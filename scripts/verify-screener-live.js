'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORTAL_BLOG = path.join(ROOT, 'projects', 'portal', 'blog');

const LOCALES = ['en', 'ko', 'de', 'es', 'fr', 'ja', 'zh'];

async function runTest() {
  console.log('=== Verifying 30s HSP Screener with Playwright ===');
  
  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(ROOT, 'projects', urlPath.replace(/^\/+/, ''));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404);
        res.end('Not Found: ' + filePath);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const mimeMap = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } catch (e) {
      res.writeHead(500);
      res.end(e.message);
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

  let allPass = true;

  for (const lang of LOCALES) {
    const url = `${baseUrl}/portal/blog/${lang}/am-i-highly-sensitive-person-signs.html`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // 1. Check overflow
    const overflow = await page.evaluate(() => {
      const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const clientW = document.documentElement.clientWidth;
      return Math.max(0, scrollW - clientW);
    });

    if (overflow > 0) {
      console.error(`[FAIL] ${lang}: Horizontal overflow detected: ${overflow}px`);
      allPass = false;
    } else {
      console.log(`[PASS] ${lang}: 0px horizontal overflow (390x844)`);
    }

    // 2. Check screener element presence
    const screenerBox = await page.$('#hspScreener');
    if (!screenerBox) {
      console.error(`[FAIL] ${lang}: Screener box #hspScreener not found`);
      allPass = false;
      continue;
    }

    // 3. Check touch targets >= 44px
    const targetsCompliant = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('#hspScreener .screener-item, #hspScreener .screener-btn, #hspScreener .screener-sub-btn'));
      for (const el of items) {
        const rect = el.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
          return { compliant: false, tag: el.tagName, text: el.innerText, height: rect.height, width: rect.width };
        }
      }
      return { compliant: true };
    });

    if (!targetsCompliant.compliant) {
      console.error(`[FAIL] ${lang}: Touch target smaller than 44px:`, targetsCompliant);
      allPass = false;
    } else {
      console.log(`[PASS] ${lang}: Touch targets >= 44px compliant`);
    }

    // 4. Test interactive clicking & state updates
    const initialCount = await page.$eval('#hspScreenerCount', el => el.textContent.trim());
    if (initialCount !== '0') {
      console.error(`[FAIL] ${lang}: Initial count expected 0, got ${initialCount}`);
      allPass = false;
    }

    const checkboxes = await page.$$('#hspScreener .hsp-screener-chk');
    if (checkboxes.length !== 4) {
      console.error(`[FAIL] ${lang}: Expected 4 checkboxes, found ${checkboxes.length}`);
      allPass = false;
    }

    // Click first checkbox
    await checkboxes[0].click();
    await page.waitForTimeout(100);
    const countAfter1 = await page.$eval('#hspScreenerCount', el => el.textContent.trim());
    const isChecked1 = await page.evaluate(() => {
      const item = document.querySelector('#hspScreener .screener-item');
      return item.classList.contains('is-checked');
    });

    if (countAfter1 !== '1' || !isChecked1) {
      console.error(`[FAIL] ${lang}: After click 1, count=${countAfter1}, isChecked=${isChecked1}`);
      allPass = false;
    }

    // Click all remaining checkboxes
    for (let i = 1; i < checkboxes.length; i++) {
      await checkboxes[i].click();
    }
    await page.waitForTimeout(100);
    const countAfter4 = await page.$eval('#hspScreenerCount', el => el.textContent.trim());
    if (countAfter4 !== '4') {
      console.error(`[FAIL] ${lang}: After click 4, count=${countAfter4}`);
      allPass = false;
    } else {
      console.log(`[PASS] ${lang}: Reactive interactivity (0 -> 1 -> 4) verified`);
    }

    // 5. Verify CTA link preserves language param
    const primaryHref = await page.$eval('#hspScreener .screener-btn', el => el.getAttribute('href'));
    const expectedPrimary = `/hsp-test/?lang=${lang}`;
    if (primaryHref !== expectedPrimary) {
      console.error(`[FAIL] ${lang}: CTA href expected ${expectedPrimary}, got ${primaryHref}`);
      allPass = false;
    } else {
      console.log(`[PASS] ${lang}: CTA href preserves ?lang=${lang}`);
    }
  }

  await browser.close();
  await new Promise(resolve => server.close(resolve));

  if (!allPass) {
    console.error('=== Verification FAILED ===');
    process.exit(1);
  } else {
    console.log('=== All Playwright tests PASSED! ===');
  }
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
