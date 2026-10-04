#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'kpop-position');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];

function ok(v, m) { if (!v) throw new Error(m); }
function read(f) { return fs.readFileSync(path.join(APP, f), 'utf8'); }
function count(s, r) { return Array.from(s.matchAll(r)).length; }

function fixture(o = {}) {
  return {
    html: o.html ?? read('index.html'),
    css: o.css ?? read('css/style.css'),
    app: o.app ?? read('js/app.js'),
    data: o.data ?? read('js/data.js'),
    i18n: o.i18n ?? read('js/i18n.js'),
    locales: o.locales ?? Object.fromEntries(LOCALES.map((l) => [l, read(`js/locales/${l}.json`)])),
  };
}

function source(o = {}) {
  const v = fixture(o);
  const all = [v.html, v.css, v.app, v.data, v.i18n, ...Object.values(v.locales)].join('\n');

  // AdSense single-loader contract
  ok(count(v.html, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) === 1, 'Auto Ads single loader drifted');
  ok(!/<ins\b[^>]*class="[^"]*adsbygoogle/i.test(all), 'Manual ad container present');
  ok(!/\bpush\s*\(\s*\{/i.test(all), 'Manual ad push present');
  ok(!/data-ad-slot/i.test(all), 'data-ad-slot attribute present');

  // Trust & E-E-A-T: No synthetic telemetry or fake stats
  ok(!/page_engage|timer_engagement|scroll_engagement/i.test(all), 'Synthetic engagement timer remains');
  ok(!/aggregateRating|ratingCount/i.test(all), 'Fabricated aggregate rating remains');

  // Canonical tag & hreflangs
  ok(/<link\s+rel="canonical"\s+href="https:\/\/dopabrain\.com\/kpop-position\/"/i.test(v.html), 'Canonical URL drifted');
  ok(!/canonicalUrl\s*=\s*`https:\/\/dopabrain\.com\/kpop-position\/\$\{/i.test(v.i18n), 'i18n mutates canonical URL with query parameter');

  // Visible educational trust guide and FAQ schema
  ok(v.html.includes('class="guide-details"'), 'Visible educational guide accordion missing');
  ok(v.html.includes('data-i18n="guide.guideHeading"'), 'Guide heading data-i18n missing');
  ok(v.html.includes('class="faq-details"'), 'Visible FAQ section missing');
  ok(count(v.html, /class="faq-item"/g) >= 5, 'Fewer than 5 visible FAQ items');
  ok(v.html.includes('"@type": "FAQPage"'), 'FAQPage schema missing');
  ok(v.html.includes('"dateModified": "2026-10-04"'), 'dateModified drifted');

  // 12 truthful locales without encoding corruption
  ok(Object.keys(v.locales).length === 12, 'Locale count drifted');
  for (const [lang, text] of Object.entries(v.locales)) {
    ok(!text.includes('\uFFFD') && !text.includes('???'), `${lang} contains corrupted characters`);
    const loc = JSON.parse(text);
    ok(loc.guide?.guideHeading && loc.guide?.vocalRoleTitle && loc.guide?.editorialReview, `${lang} guide translations missing`);
    ok(loc.faq?.faqTitle && loc.faq?.q1 && loc.faq?.a1 && loc.faq?.q5 && loc.faq?.a5, `${lang} FAQ translations missing`);
  }

  // Mobile overflow & touch target styles
  ok(v.css.includes('overflow-x: hidden'), 'CSS lacks overflow-x: hidden guard');
  ok(/\.theme-toggle\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s.test(v.css), 'theme-toggle not sized at 44px');
  ok(/\.lang-option\s*\{[^}]*min-height:\s*44px;/s.test(v.css), 'lang-option not sized with min-height 44px');

  return { locales: 12, faqs: 5 };
}

function mutations() {
  const b = fixture();
  const cases = [
    ['no-loader', { html: b.html.replace(/<script async src="https:\/\/pagead2\.googlesyndication\.com[^>]*><\/script>/, '') }],
    ['manual-ad', { html: b.html.replace('</body>', '<ins class="adsbygoogle"></ins></body>') }],
    ['adsbygoogle-push', { app: b.app + '\n(adsbygoogle = window.adsbygoogle || []).push({});' }],
    ['synthetic-timer', { html: b.html.replace('</head>', '<script>gtag("event", "page_engage");</script></head>') }],
    ['canonical-drift', { html: b.html.replace('<link rel="canonical" href="https://dopabrain.com/kpop-position/">', '<link rel="canonical" href="https://dopabrain.com/kpop-position/?lang=ko">') }],
    ['missing-guide', { html: b.html.replace('class="guide-details"', 'class="hidden-guide"') }],
    ['missing-faq-schema', { html: b.html.replace('"@type": "FAQPage"', '"@type": "HiddenPage"') }],
    ['corrupt-locale', { locales: { ...b.locales, ko: b.locales.ko.replace('K-POP 포지션 테스트', '??? ???') } }],
    ['touch-regression', { css: b.css.replace(/(\.theme-toggle\s*\{[^}]*width:\s*)44px;/, '$130px;') }],
    ['locale-count-drift', { locales: Object.fromEntries(LOCALES.slice(0, 6).map((l) => [l, b.locales[l]])) }],
  ];

  for (const [name, patch] of cases) {
    let caught = false;
    try {
      source({ ...b, ...patch });
    } catch (e) {
      caught = true;
      console.log(`[PASS] mutation detected: ${name} (${e.message})`);
    }
    ok(caught, `mutation escaped: ${name}`);
  }
  console.log(`[PASS] mutation summary ${cases.length}/${cases.length} detected`);
}

async function server() {
  const mime = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
  };
  const s = http.createServer((req, res) => {
    try {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (!p.startsWith('/kpop-position/')) {
        res.writeHead(404).end();
        return;
      }
      let f = path.resolve(APP, p.slice(15) || 'index.html');
      ok(f === APP || f.startsWith(APP + path.sep), 'unsafe path');
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!fs.existsSync(f)) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, {
        'content-type': (mime[path.extname(f)] || 'application/octet-stream') + '; charset=utf-8',
        'cache-control': 'no-store',
      }).end(fs.readFileSync(f));
    } catch (e) {
      res.writeHead(400).end(e.message);
    }
  });
  const a = await listenOnSafePort(s);
  return { origin: `http://127.0.0.1:${a.port}`, close: () => new Promise((r) => s.close(r)) };
}

async function runtime(base) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const t of [{ width: 390, height: 844, lang: 'ko' }, { width: 1440, height: 900, lang: 'en' }]) {
      const ctx = await browser.newContext({ viewport: { width: t.width, height: t.height } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));

      await page.goto(`${base}/kpop-position/?lang=${t.lang}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => typeof i18n !== 'undefined' && (!document.getElementById('app-loader') || document.getElementById('app-loader').classList.contains('hidden')), null, { timeout: 15000 });

      // Verify theme toggle & lang toggle size >= 44px
      const themeBox = await page.locator('#theme-toggle').boundingBox();
      ok(themeBox && themeBox.width >= 44 && themeBox.height >= 44, `${t.width}px theme-toggle below 44px`);
      const langBox = await page.locator('#lang-toggle').boundingBox();
      ok(langBox && langBox.width >= 44 && langBox.height >= 44, `${t.width}px lang-toggle below 44px`);

      // Verify start button >= 44px
      const startBox = await page.locator('#btn-start').boundingBox();
      ok(startBox && startBox.width >= 44 && startBox.height >= 44, `${t.width}px btn-start below 44px`);

      // Check horizontal overflow on home
      const homeOverflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
      ok(homeOverflow <= 0, `${t.width}px home horizontal overflow: ${homeOverflow}px`);

      // Verify guide details can be toggled
      const guideToggle = page.locator('.guide-details summary');
      await guideToggle.click();
      await page.waitForTimeout(100);

      // Start quiz
      await page.click('#btn-start', { force: true });
      await page.waitForSelector('#question-screen.active', { timeout: 10000 });

      // Answer 12 questions
      for (let i = 0; i < 12; i++) {
        const optionBtn = page.locator('#q-options .option-btn').first();
        await optionBtn.waitFor({ state: 'visible', timeout: 5000 });
        const optBox = await optionBtn.boundingBox();
        ok(optBox && optBox.width >= 44 && optBox.height >= 44, `${t.width}px option button below 44px`);
        await optionBtn.click();
        if (i < 11) {
          await page.waitForFunction(
            (expected) => document.getElementById('progress-text')?.textContent.trim() === expected,
            `${i + 2} / 12`,
            { timeout: 5000 }
          );
        }
      }

      // Result screen
      await page.waitForSelector('#result-screen.active', { timeout: 15000 });
      await page.locator('#btn-retry').waitFor({ state: 'visible', timeout: 5000 });
      const resultTitle = await page.locator('#result-title').textContent();
      ok(resultTitle && resultTitle.trim().length > 0, `${t.width}px result-title is empty`);

      // Verify result screen overflow
      const resultOverflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
      ok(resultOverflow <= 0, `${t.width}px result horizontal overflow: ${resultOverflow}px`);

      // Check result buttons >= 44px
      const retryBox = await page.locator('#btn-retry').boundingBox();
      ok(retryBox && retryBox.width >= 44 && retryBox.height >= 44, `${t.width}px btn-retry below 44px`);
      const shareBox = await page.locator('#btn-share').boundingBox();
      ok(shareBox && shareBox.width >= 44 && shareBox.height >= 44, `${t.width}px btn-share below 44px`);

      // Check no page errors occurred
      ok(!errors.length, `${t.width}px runtime errors: ${errors.join(', ')}`);

      await ctx.close();
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const r = source();
  if (process.argv.includes('--mutations')) mutations();
  const s = await server();
  try {
    await runtime(s.origin);
  } finally {
    await s.close();
  }
  console.log(`[PASS] K-POP Position contract: ${r.locales} locales, ${r.faqs} FAQs, mobile & desktop verified`);
}

main().catch((e) => {
  console.error('[FAIL] ' + e.message);
  process.exitCode = 1;
});
