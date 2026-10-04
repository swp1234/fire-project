#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'animal-personality');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];

function ok(v, m) { if (!v) throw new Error(m); }
function read(f) { return fs.readFileSync(path.join(APP, f), 'utf8'); }
function count(s, r) { return Array.from(s.matchAll(r)).length; }

function fixture(o = {}) {
  return {
    html: o.html ?? read('index.html'),
    css: o.css ?? read('css/style.css'),
    app: o.app ?? read('js/app.js'),
    i18n: o.i18n ?? read('js/i18n.js'),
    locales: o.locales ?? Object.fromEntries(LOCALES.map((l) => [l, read(`js/locales/${l}.json`)])),
  };
}

function source(o = {}) {
  const v = fixture(o);
  const all = [v.html, v.css, v.app, v.i18n, ...Object.values(v.locales)].join('\n');

  // AdSense single-loader contract
  ok(count(v.html, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) === 1, 'Auto Ads single loader drifted');
  ok(!/<ins\b[^>]*class="[^"]*adsbygoogle/i.test(all), 'Manual ad container present');
  ok(!/\bpush\s*\(\s*\{/i.test(all), 'Manual ad push present');
  ok(!/data-ad-slot/i.test(all), 'data-ad-slot attribute present');

  // Trust & E-E-A-T: No fabricated claims or synthetic telemetry
  ok(!/aggregateRating|ratingCount|social-proof|proof-count|percentile-stat/i.test(all), 'Fabricated proof, fake rating, or synthetic stat remains');
  ok(!/page_engage|timer_engagement|scroll_engagement/i.test(all), 'Synthetic engagement timer remains');
  ok(!/4\.6\s*점|2,350\s*명|2,100\s*명/i.test(all), 'Fabricated review or user counter remains');

  // Canonical tag & hreflangs
  ok(/<link\s+rel="canonical"\s+href="https:\/\/dopabrain\.com\/animal-personality\/"/i.test(v.html), 'Canonical URL drifted');
  ok(!/canonicalHref\s*=\s*this\.getSeoHref\([^)]*\?[^)]*\)/.test(v.i18n), 'i18n syncSeoState mutates canonical with query params');

  // Visible educational trust guide and FAQ schema
  ok(v.html.includes('class="about-guide"'), 'Visible about-guide accordion missing');
  ok(v.html.includes('data-i18n="guide.summaryTitle"'), 'Guide summary title missing');
  ok(v.html.includes('data-i18n="guide.faqTitle"'), 'Visible FAQ section heading missing');
  ok(count(v.html, /class="about-faq-item"/g) >= 5, 'Fewer than 5 visible FAQ items');
  ok(v.html.includes('"@type": "FAQPage"'), 'FAQPage schema missing');
  ok(v.html.includes('"dateModified": "2026-10-04"'), 'dateModified drifted');

  // 12 truthful locales without encoding corruption
  ok(Object.keys(v.locales).length === 12, 'Locale count drifted');
  for (const [lang, text] of Object.entries(v.locales)) {
    ok(!text.includes('\uFFFD') && !text.includes('???'), `${lang} contains corrupted characters`);
    const loc = JSON.parse(text);
    ok(loc.guide?.summaryTitle && loc.guide?.faqTitle && loc.guide?.faq1Q && loc.guide?.faq1A, `${lang} guide/faq missing`);
    ok(loc.home?.quickStrip && !loc.home?.socialStats && !loc.home?.proofText, `${lang} retain retired proof copy`);
    ok(loc.result?.nextStepLabel && loc.result?.nextStepCta && !loc.result?.percentileStat, `${lang} retain percentileStat`);
    ok(loc.related?.dopamineType, `${lang} missing dopamineType`);
  }

  // Mobile overflow & touch target styles
  ok(v.css.includes('overflow-x: hidden'), 'CSS lacks overflow-x: hidden guard');
  ok(/\.theme-toggle\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s.test(v.css), 'theme-toggle not sized at 44px');

  return { locales: 12, faqs: 5 };
}

function mutations() {
  const b = fixture();
  const cases = [
    ['no-loader', { html: b.html.replace(/<script async src="https:\/\/pagead2\.googlesyndication\.com[^>]*><\/script>/, '') }],
    ['manual-ad', { html: b.html.replace('</body>', '<ins class="adsbygoogle"></ins></body>') }],
    ['adsbygoogle-push', { app: b.app + '\n(adsbygoogle = window.adsbygoogle || []).push({});' }],
    ['fake-rating', { html: b.html.replace('</body>', '<div>aggregateRating 4.9</div></body>') }],
    ['fake-percentile', { html: b.html.replace('</body>', '<p class="percentile-stat">Top 5%</p></body>') }],
    ['synthetic-timer', { html: b.html.replace('</head>', '<script>gtag("event", "page_engage");</script></head>') }],
    ['canonical-drift', { html: b.html.replace('<link rel="canonical" href="https://dopabrain.com/animal-personality/">', '<link rel="canonical" href="https://dopabrain.com/animal-personality/?lang=en">') }],
    ['missing-guide', { html: b.html.replace('class="about-guide"', 'class="hidden-guide"') }],
    ['corrupt-locale', { locales: { ...b.locales, ko: b.locales.ko.replace('추천 다음 단계', '??? ???') } }],
    ['touch-regression', { css: b.css.replace(/(\.theme-toggle\s*\{[^}]*width:\s*)44px;/, '$130px;') }],
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
      if (!p.startsWith('/animal-personality/')) {
        res.writeHead(404).end();
        return;
      }
      let f = path.resolve(APP, p.slice(20) || 'index.html');
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

      await page.goto(`${base}/animal-personality/?lang=${t.lang}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => window.app && getComputedStyle(document.getElementById('appLoader')).display === 'none', null, { timeout: 15000 });

      // Verify theme toggle & lang toggle size >= 44px
      const themeBox = await page.locator('#theme-toggle').boundingBox();
      ok(themeBox && themeBox.width >= 44 && themeBox.height >= 44, `${t.width}px theme-toggle below 44px`);
      const langBox = await page.locator('#lang-toggle').boundingBox();
      ok(langBox && langBox.width >= 44 && langBox.height >= 44, `${t.width}px lang-toggle below 44px`);

      // Verify start button >= 44px
      const startBox = await page.locator('#startBtn').boundingBox();
      ok(startBox && startBox.width >= 44 && startBox.height >= 44, `${t.width}px startBtn below 44px`);

      // Check horizontal overflow on home
      const homeOverflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
      ok(homeOverflow <= 0, `${t.width}px home horizontal overflow: ${homeOverflow}px`);

      // Verify about guide details element can be toggled
      await page.locator('.about-guide-summary').click();
      const guideIsOpen = await page.locator('.about-guide').getAttribute('open');
      ok(guideIsOpen !== null, `${t.width}px about-guide failed to open`);

      // Start test: Click start button
      await page.click('#startBtn', { force: true });
      await page.waitForSelector('#biomeScreen.active', { timeout: 10000 });

      // Select first biome card (Forest)
      const firstBiome = page.locator('.biome-card').first();
      const biomeBox = await firstBiome.boundingBox();
      ok(biomeBox && biomeBox.width >= 44 && biomeBox.height >= 44, `${t.width}px biome card below 44px`);
      await firstBiome.click();

      // Complete 6 scenarios
      await page.waitForSelector('#scenarioScreen.active', { timeout: 10000 });
      for (let i = 0; i < 6; i++) {
        const choiceBtn = page.locator('.scenario-choice').first();
        await choiceBtn.waitFor({ state: 'visible', timeout: 5000 });
        const choiceBox = await choiceBtn.boundingBox();
        ok(choiceBox && choiceBox.width >= 44 && choiceBox.height >= 44, `${t.width}px scenario choice below 44px`);
        await choiceBtn.click();
        if (i < 5) {
          await page.waitForFunction(
            (step) => document.getElementById('scenarioStep')?.textContent.trim() === step,
            `${i + 2} / 6`,
            { timeout: 5000 }
          );
        }
      }

      // Result screen
      await page.waitForSelector('#resultScreen.active', { timeout: 15000 });
      await page.locator('#retakeBtn').waitFor({ state: 'visible', timeout: 5000 });
      const resultTitle = await page.locator('#resultTitle').textContent();
      ok(resultTitle && resultTitle.trim().length > 0, `${t.width}px resultTitle is empty`);

      // Verify result screen touch targets & overflow
      const resultOverflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
      ok(resultOverflow <= 0, `${t.width}px result horizontal overflow: ${resultOverflow}px`);

      await page.locator('#retakeBtn').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const retakeBox = await page.locator('#retakeBtn').boundingBox();
      ok(retakeBox && retakeBox.width >= 44 && retakeBox.height >= 44, `${t.width}px retakeBtn below 44px`);

      const ctaBox = await page.locator('#primary-related-cta').boundingBox();
      ok(ctaBox && ctaBox.width >= 44 && ctaBox.height >= 44, `${t.width}px primary-related-cta below 44px`);

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
  console.log(`[PASS] Animal Personality contract: ${r.locales} locales, ${r.faqs} FAQs, mobile & desktop verified`);
}

main().catch((e) => {
  console.error('[FAIL] ' + e.message);
  process.exitCode = 1;
});
