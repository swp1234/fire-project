'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');

const TEST_TARGETS = [
  { path: '/portal/blog/en/am-i-highly-sensitive-person-signs.html', id: 'hspScreener', countId: 'hspScreenerCount', chk: '.hsp-screener-chk', lang: 'en' },
  { path: '/portal/blog/ko/am-i-highly-sensitive-person-signs.html', id: 'hspScreener', countId: 'hspScreenerCount', chk: '.hsp-screener-chk', lang: 'ko' },
  { path: '/portal/blog/de/am-i-highly-sensitive-person-signs.html', id: 'hspScreener', countId: 'hspScreenerCount', chk: '.hsp-screener-chk', lang: 'de' },
  { path: '/portal/blog/en/emotional-exhaustion-signs-recovery.html', id: 'exhaustionScreener', countId: 'exhaustionScreenerCount', chk: '.exh-screener-chk', lang: 'en' },
  { path: '/portal/blog/ko/emotional-exhaustion-signs-recovery.html', id: 'exhaustionScreener', countId: 'exhaustionScreenerCount', chk: '.exh-screener-chk', lang: 'ko' },
  { path: '/portal/blog/zh/emotional-exhaustion-signs-recovery.html', id: 'exhaustionScreener', countId: 'exhaustionScreenerCount', chk: '.exh-screener-chk', lang: 'zh' },
  { path: '/portal/blog/de/emotional-exhaustion-signs-recovery.html', id: 'exhaustionScreener', countId: 'exhaustionScreenerCount', chk: '.exh-screener-chk', lang: 'de' },
  { path: '/portal/blog/en/stress-management-techniques-guide.html', id: 'stressResponseScreener', countId: 'stressResponseScreenerCount', chk: '.str-screener-chk', lang: 'en' },
  { path: '/portal/blog/ko/stress-management-techniques-guide.html', id: 'stressResponseScreener', countId: 'stressResponseScreenerCount', chk: '.str-screener-chk', lang: 'ko' },
  { path: '/portal/blog/es/stress-management-techniques-guide.html', id: 'stressResponseScreener', countId: 'stressResponseScreenerCount', chk: '.str-screener-chk', lang: 'es' },
  { path: '/portal/blog/ko/hsp-workplace-survival-guide.html', id: 'workplaceDrainScreener', countId: 'workplaceDrainScreenerCount', chk: '.wp-ko-chk', lang: 'ko' },
  { path: '/portal/blog/zh/avoidant-attachment-dating-guide.html', id: 'avoidantScreener', countId: 'avoidantScreenerCount', chk: '.av-zh-chk', lang: 'zh' },
  { path: '/portal/blog/ko/avoidant-attachment-dating-patterns.html', id: 'avoidantScreenerKo', countId: 'avoidantScreenerKoCount', chk: '.av-ko-chk', lang: 'ko' },
  { path: '/portal/blog/pt/hsp-coping-strategies-highly-sensitive.html', id: 'sensory-triage', countId: 'triageCount', chk: '.triage-chk', lang: 'pt' },
  { path: '/portal/blog/ru/hsp-coping-strategies-highly-sensitive.html', id: 'sensory-triage', countId: 'triageCount', chk: '.triage-chk', lang: 'ru' },
  { path: '/portal/blog/id/hsp-coping-strategies-highly-sensitive.html', id: 'sensory-triage', countId: 'triageCount', chk: '.triage-chk', lang: 'id' },
  { path: '/portal/blog/tr/hsp-coping-strategies-highly-sensitive.html', id: 'sensory-triage', countId: 'triageCount', chk: '.triage-chk', lang: 'tr' },
  { path: '/portal/blog/hi/hsp-coping-strategies-highly-sensitive.html', id: 'sensory-triage', countId: 'triageCount', chk: '.triage-chk', lang: 'hi' },
  { path: '/portal/blog/en/nervous-system-regulation-techniques.html', id: 'nervousScreener', countId: 'nervousScreenerCount', chk: '.nerv-screener-chk', lang: 'en' },
  { path: '/portal/blog/ko/nervous-system-regulation-techniques.html', id: 'nervousScreener', countId: 'nervousScreenerCount', chk: '.nerv-screener-chk', lang: 'ko' },
  { path: '/portal/blog/ja/nervous-system-regulation-techniques.html', id: 'nervousScreener', countId: 'nervousScreenerCount', chk: '.nerv-screener-chk', lang: 'ja' },
  { path: '/portal/blog/en/emotional-regulation-techniques.html', id: 'emotionRegScreener', countId: 'emotionRegScreenerCount', chk: '.emoreg-screener-chk', lang: 'en' },
  { path: '/portal/blog/ko/emotional-regulation-techniques.html', id: 'emotionRegScreener', countId: 'emotionRegScreenerCount', chk: '.emoreg-screener-chk', lang: 'ko' },
  { path: '/portal/blog/de/emotional-regulation-techniques.html', id: 'emotionRegScreener', countId: 'emotionRegScreenerCount', chk: '.emoreg-screener-chk', lang: 'de' },
  { path: '/portal/blog/id/emotional-regulation-techniques.html', id: 'emotionRegScreener', countId: 'emotionRegScreenerCount', chk: '.emoreg-screener-chk', lang: 'id' },
  { path: '/portal/blog/en/anxious-attachment-style-relationships.html', id: 'anxiousAttachScreener', countId: 'anxiousAttachScreenerCount', chk: '.anxatt-screener-chk', lang: 'en' },
  { path: '/portal/blog/ko/anxious-attachment-style-relationships.html', id: 'anxiousAttachScreener', countId: 'anxiousAttachScreenerCount', chk: '.anxatt-screener-chk', lang: 'ko' },
  { path: '/portal/blog/id/anxious-attachment-style-relationships.html', id: 'anxiousAttachScreener', countId: 'anxiousAttachScreenerCount', chk: '.anxatt-screener-chk', lang: 'id' },
  { path: '/portal/blog/en/kpop-positions-explained-guide.html', id: 'kpopRoleScreener', countId: 'kpopRoleScreenerCount', chk: '.kpop-screener-chk', lang: 'en' }
];

async function runTest() {
  console.log('=== Verifying Interactive 30s CRO Screeners with Playwright ===');

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
  await page.route(url => !url.href.includes('127.0.0.1'), route => route.abort());

  let allPass = true;

  for (const target of TEST_TARGETS) {
    const url = `${baseUrl}${target.path}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    // 1. Check horizontal overflow on 390x844
    const overflow = await page.evaluate(() => {
      const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const clientW = document.documentElement.clientWidth;
      return Math.max(0, scrollW - clientW);
    });

    if (overflow > 0) {
      console.error(`[FAIL] ${target.path}: Horizontal overflow ${overflow}px`);
      allPass = false;
    }

    // 2. Check screener box & touch targets >= 44px
    const box = await page.$(`#${target.id}`);
    if (!box) {
      console.error(`[FAIL] ${target.path}: #${target.id} not found`);
      allPass = false;
      continue;
    }

    const targetsCompliant = await page.evaluate((id) => {
      const items = Array.from(document.querySelectorAll(`#${id} .screener-item, #${id} .screener-btn, #${id} .screener-sub-btn, #${id} .hsp-triage-item, #${id} .triage-btn, #${id} .triage-sub-btn`));
      for (const el of items) {
        const rect = el.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
          return { compliant: false, tag: el.tagName, text: el.innerText, height: rect.height, width: rect.width };
        }
      }
      return { compliant: true };
    }, target.id);

    if (!targetsCompliant.compliant) {
      console.error(`[FAIL] ${target.path}: Touch target < 44px:`, targetsCompliant);
      allPass = false;
    }

    // 3. Test interactive checkbox clicking (0 -> 1 -> 4)
    const checkboxes = await page.$$(`#${target.id} ${target.chk}`);
    if (checkboxes.length !== 4) {
      console.error(`[FAIL] ${target.path}: Expected 4 checkboxes, got ${checkboxes.length}`);
      allPass = false;
      continue;
    }

    await checkboxes[0].click();
    const count1 = await page.$eval(`#${target.countId}`, el => el.textContent.trim());
    for (let i = 1; i < checkboxes.length; i++) {
      await checkboxes[i].click();
    }
    const count4 = await page.$eval(`#${target.countId}`, el => el.textContent.trim());

    if (count1 !== '1' || count4 !== '4') {
      console.error(`[FAIL] ${target.path}: Interactive count failed (1=${count1}, 4=${count4})`);
      allPass = false;
    }

    // 4. Verify CTA preserves ?lang=
    const href = await page.$eval(`#${target.id} .screener-btn, #${target.id} .triage-btn`, el => el.getAttribute('href'));
    if (!href.includes(`lang=${target.lang}`)) {
      console.error(`[FAIL] ${target.path}: CTA href missing lang=${target.lang}: ${href}`);
      allPass = false;
    } else {
      console.log(`[PASS] ${target.path}: 0px overflow, >=44px touch, 0->1->4 reactive, ?lang=${target.lang}`);
    }
  }

  await browser.close();
  await new Promise(resolve => server.close(resolve));

  if (!allPass) {
    process.exit(1);
  }
  console.log(`=== All ${TEST_TARGETS.length} Screener Playwright checks PASSED! ===`);
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
