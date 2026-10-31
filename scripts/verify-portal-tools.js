'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');

const TOOLS = [
  '/portal/tools/burnout-stress-differential.html',
  '/portal/tools/grounding-exercise.html',
  '/portal/tools/cognitive-load-calculator.html',
  '/portal/tools/decision-matrix.html',
  '/portal/tools/dopamine-detox-protocol.html',
  '/portal/tools/emotion-regulation-planner.html',
  '/portal/tools/kpop-role-roster.html',
  '/portal/tools/index.html'
];

async function runTest() {
  console.log('=== Verifying Portal High-Dwell Tools with Playwright (390x844) ===');

  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(ROOT, 'projects', urlPath.replace(/^\/+/, ''));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found: ' + filePath);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      };

      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } catch (err) {
      res.writeHead(500);
      res.end(err.message);
    }
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  await page.route(url => !url.href.includes('127.0.0.1'), route => route.abort());

  let allPass = true;

  for (const tool of TOOLS) {
    const url = `${baseUrl}${tool}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // 1. Horizontal overflow check
    const overflow = await page.evaluate(() => {
      const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const clientW = document.documentElement.clientWidth;
      return scrollW - clientW;
    });

    if (overflow > 0) {
      console.error(`[FAIL] ${tool}: Horizontal overflow ${overflow}px`);
      allPass = false;
    } else {
      console.log(`[PASS] ${tool}: 0px horizontal overflow`);
    }

    // 2. Interactive touch targets >= 44px
    const targetsCompliant = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a.cta-btn, a.bridge-card, a.tool-card, a.routine-card, .opt-btn, .primary-btn, .ghost-btn'));
      const small = [];
      for (const el of elements) {
        if (!el.offsetParent) continue; // Skip hidden
        const rect = el.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
          small.push({ tag: el.tagName, text: el.innerText.slice(0, 30), w: Math.round(rect.width), h: Math.round(rect.height) });
        }
      }
      return { compliant: small.length === 0, count: elements.length, small: small.slice(0, 5) };
    });

    if (!targetsCompliant.compliant) {
      console.warn(`[WARN] ${tool}: ${targetsCompliant.small.length} touch targets < 44px:`, targetsCompliant.small);
      // Let's inspect if any interactive button/link is violating
    } else {
      console.log(`[PASS] ${tool}: All ${targetsCompliant.count} interactive targets >= 44px`);
    }
  }

  await browser.close();
  await new Promise(resolve => server.close(resolve));

  if (!allPass) {
    process.exit(1);
  }
  console.log('=== All Portal Tools checks completed! ===');
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
