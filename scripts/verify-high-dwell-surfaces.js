#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

async function runAudit() {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer((req, res) => {
    let clean = req.url.split('?')[0].replace(/^\/+/, '');
    if (!clean || clean.endsWith('/')) clean += 'index.html';
    const fp = path.join(root, 'projects', clean);
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'text/plain' });
      res.end(fs.readFileSync(fp));
    } else {
      res.writeHead(404);
      res.end('Not found: ' + req.url);
    }
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();

  console.log('=== Verifying High-Dwell Core Entry Surfaces Mobile Compliance ===');

  // 1. Future Self Full User Journey
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`http://127.0.0.1:${port}/future-self/?lang=en`);
    await page.waitForTimeout(500);

    let introOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (introOverflow !== 0) throw new Error(`Future Self intro overflow: ${introOverflow}px`);

    await page.click('#btn-start', { force: true });
    await page.waitForTimeout(400);

    for (let i = 0; i < 8; i++) {
      await page.waitForSelector('.choice-btn', { state: 'visible', timeout: 5000 });
      const btns = await page.$$('.choice-btn');
      if (btns.length === 0) throw new Error(`No choices found on moment ${i + 1}`);
      await btns[0].click({ force: true });
      await page.waitForTimeout(350);
    }

    await page.waitForSelector('#screen-result.active', { timeout: 5000 });
    let resOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (resOverflow !== 0) throw new Error(`Future Self result overflow: ${resOverflow}px`);

    const badTargets = await page.evaluate(() => {
      const interactive = Array.from(document.querySelectorAll('button, a, input, [role="button"], summary'));
      const bad = [];
      for (const el of interactive) {
        if (el.offsetParent === null) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 43.5 || r.height < 43.5) {
          if (el.closest('[aria-hidden="true"]')) continue;
          bad.push({
            tag: el.tagName,
            class: el.className,
            text: (el.textContent || '').trim().slice(0, 30),
            w: Math.round(r.width * 10) / 10,
            h: Math.round(r.height * 10) / 10
          });
        }
      }
      return bad;
    });

    if (badTargets.length > 0) {
      throw new Error(`Future Self result screen touch targets < 44px: ${JSON.stringify(badTargets)}`);
    }

    const promoLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.next-app-link, .related-link')).map(a => a.href);
    });
    for (const link of promoLinks) {
      if (!link.includes('lang=en')) {
        throw new Error(`Future Self cross-promo link missing ?lang=en: ${link}`);
      }
    }
    console.log('[PASS] /future-self/ (Full Flow): 0px overflow, all touch >=44px, ?lang=en preserved');
    await page.close();
  }

  // 2. Stress Check Core Suite
  const stressPages = [
    '/stress-check/?lang=en',
    '/stress-check/plan.html?lang=en',
    '/stress-check/script.html?lang=en',
    '/stress-check/library.html?lang=en'
  ];

  for (const pagePath of stressPages) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`http://127.0.0.1:${port}${pagePath}`);
    await page.waitForTimeout(500);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow !== 0) throw new Error(`${pagePath} overflow: ${overflow}px`);

    const badTargets = await page.evaluate(() => {
      const interactive = Array.from(document.querySelectorAll('button, a, input, [role="button"], summary'));
      const bad = [];
      for (const el of interactive) {
        if (el.offsetParent === null) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 43.5 || r.height < 43.5) {
          if (el.closest('[aria-hidden="true"]')) continue;
          bad.push({
            tag: el.tagName,
            id: el.id,
            class: el.className,
            text: (el.textContent || '').trim().slice(0, 30),
            w: Math.round(r.width * 10) / 10,
            h: Math.round(r.height * 10) / 10
          });
        }
      }
      return bad;
    });

    if (badTargets.length > 0) {
      throw new Error(`${pagePath} touch targets < 44px: ${JSON.stringify(badTargets)}`);
    }

    console.log(`[PASS] ${pagePath}: 0px overflow, all touch targets >=44px`);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('=== All High-Dwell Surface Checks PASSED! ===');
}

runAudit().catch(e => {
  console.error(e.message || e);
  process.exit(1);
});
