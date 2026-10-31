'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');

const TYPES = ['enfj', 'enfp', 'entj', 'entp', 'esfj', 'esfp', 'estj', 'estp', 'infj', 'infp', 'intj', 'intp', 'isfj', 'isfp', 'istj', 'istp'];
const ROUTES = ['/portal/mbti/', ...TYPES.map(t => `/portal/mbti/${t}.html`)];

async function runTest() {
  console.log('=== Verifying Portal MBTI Hub & 16 Type Pages (390x844) ===');

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

  for (const route of ROUTES) {
    const url = `${baseUrl}${route}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    // 1. Horizontal overflow check
    const overflow = await page.evaluate(() => {
      const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const clientW = document.documentElement.clientWidth;
      return scrollW - clientW;
    });

    if (overflow > 0) {
      console.error(`[FAIL] ${route}: Horizontal overflow ${overflow}px`);
      allPass = false;
    }

    // 2. Interactive touch targets >= 44px
    const touchIssues = await page.evaluate(() => {
      const issues = [];
      const interactives = document.querySelectorAll('button, a, select, input:not([type=hidden])');
      interactives.forEach(el => {
        if (!el.offsetParent) return; // Skip hidden elements
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
          issues.push({ tag: el.tagName, text: el.innerText.slice(0, 20), w: Math.round(rect.width), h: Math.round(rect.height) });
        }
      });
      return issues;
    });

    if (touchIssues.length > 0) {
      console.error(`[FAIL] ${route}: ${touchIssues.length} touch targets < 44px:`, touchIssues.slice(0, 3));
      allPass = false;
    } else {
      console.log(`[PASS] ${route}: 0px overflow & touch targets compliant`);
    }
  }

  await browser.close();
  await new Promise(resolve => server.close(resolve));

  if (!allPass) {
    process.exit(1);
  }
  console.log('=== All 17 MBTI Hub & Type Pages PASSED! ===');
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
