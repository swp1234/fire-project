#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'toxic-trait-test');
const LOCALES = ['ko', 'en', 'ja', 'zh', 'hi', 'ru', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const EVENTS = ['toxic_trait_view', 'toxic_trait_start', 'toxic_trait_progress', 'toxic_trait_complete', 'toxic_trait_next_click', 'toxic_trait_share', 'toxic_trait_related_click'];

function ok(value, message) { if (!value) throw new Error(message); }
function read(file) { return fs.readFileSync(path.join(APP, file), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }
function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'),
    i18n: overrides.i18n ?? read('js/i18n.js'),
    sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map(lang => [lang, read(`js/locales/${lang}.json`)]))
  };
}

function source(overrides = {}) {
  const value = fixture(overrides);
  const product = [value.html, value.i18n, value.sw, value.manifest, ...Object.values(value.locales)].join('\n');
  ok(value.html.includes('data-ad-serving="suspended-invalid-traffic-2026-09-03"'), 'suspension marker missing');
  ok(!/pagead2|adsbygoogle|data-ad-slot|data-ad-client|\bGameAds\b|showInterstitial|showRewarded/i.test(product), 'ad code conflicts with suspension');
  ok(!/aggregateRating|ratingCount|FAQPage|page_engage|ad_impression|social-proof|percentile-stat|12,000\+ profiles/i.test(product), 'fabricated proof, hidden schema, or synthetic telemetry remains');
  ok(!/result-card\.js|cross-promo\.js|DailyStreak|GameAchievements|Kakao\.Share|twitter\.com\/intent|facebook\.com\/sharer/i.test(product), 'result-rich sharing or generic promotion remains');
  ok(!/user-scalable\s*=\s*no/i.test(value.html), 'viewport disables zoom');
  ok(/not a diagnosis or validated assessment/i.test(value.html) && /Each answer adds one point/i.test(value.html), 'visible boundary or scoring method missing');
  ok(/maps: \[0,null,5,3\]/.test(value.html) && /scores\[mappedType\] \+= 1/.test(value.html), 'published and implemented scoring rules diverged');
  ok(value.html.includes('href="/stress-check/?lang=ko&amp;source=toxic_trait_result"'), 'primary Stress Check action drifted');
  ok(count(value.html, /<a[^>]+data-related-slug=/g) === 2 && value.html.includes('href="/overthinker-test/"') && value.html.includes('href="/attachment-style/"'), 'focused related routes drifted');
  for (const name of EVENTS) ok(count(value.html, new RegExp(`['"]${name}['"]`, 'g')) === 1, `event call count drifted: ${name}`);
  ok(/trackedStages = new Set\(\)/.test(value.html) && /trackedStages\.has\(name\)/.test(value.html), 'exact-once stage guard missing');
  ok(/qIdx === 3\) trackStage\('toxic_trait_progress'\)/.test(value.html), 'progress does not require four accepted answers');
  ok(!/trackStage\('toxic_trait_[^']+'\s*,/.test(value.html), 'private value entered telemetry');
  ok(/event\.target\.closest\('\.related-card'\)/.test(value.html), 'nested related attribution missing');
  ok(/await navigator\.share\(shareData\)/.test(value.html) && /await navigator\.clipboard\.writeText\(shareData\.url\)/.test(value.html), 'share is not success-gated');
  ok(!/shareData[\s\S]{0,300}getResultType|shareData[\s\S]{0,300}scores/.test(value.html), 'private result entered share copy');
  ok(/document\.createElement\('button'\)/.test(value.html) && /card\.disabled = true/.test(value.html), 'answer controls are not native single-submit buttons');
  ok(/CACHE_NAME = 'toxic-trait-test-v2'/.test(value.sw) && /url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'service worker scope drifted');
  ok(/response\.ok/.test(value.sw) && !/["']\/index\.html["']/.test(value.sw), 'service worker cache contract drifted');
  const manifest = JSON.parse(value.manifest);
  ok(manifest.scope === '/toxic-trait-test/' && manifest.start_url === '/toxic-trait-test/', 'manifest scope drifted');
  ok(Object.keys(value.locales).length === 12, 'locale inventory drifted');
  for (const [lang, text] of Object.entries(value.locales)) {
    const locale = JSON.parse(text);
    ok(locale.intro?.boundary && locale.intro?.method && locale.result?.boundary && locale.result?.calculation, `${lang} boundary or method missing`);
    ok(locale.result?.nextAction && locale.share?.action && locale.share?.text && locale.share?.success, `${lang} focused action copy missing`);
    ok(Object.keys(locale.types || {}).length === 18 && Object.keys(locale.tips || {}).length === 6, `${lang} result inventory drifted`);
    ok(Object.keys(locale.related || {}).sort().join(',') === 'attachment,overthinker', `${lang} related inventory drifted`);
    ok(!locale.intro?.socialProof && !locale.result?.percentileStat && !locale.share?.twitterText && !locale.tips?.general, `${lang} retired proof or result-rich share copy remains`);
  }
  ok(Buffer.byteLength(value.readme) < 1500, 'README exceeds compact contract budget');
  return { locales: LOCALES.length, related: 2, events: EVENTS.length };
}

async function createServer() {
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
      if (!pathname.startsWith('/toxic-trait-test/')) return response.writeHead(404).end();
      let file = path.resolve(APP, pathname.slice('/toxic-trait-test/'.length) || 'index.html');
      ok(file === APP || file.startsWith(APP + path.sep), 'unsafe path');
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) return response.writeHead(404).end();
      response.writeHead(200, { 'content-type': `${mime[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'cache-control': 'no-store' });
      response.end(fs.readFileSync(file));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  return { origin: `http://127.0.0.1:${address.port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

function funnel(rows) {
  return rows.filter(row => row?.[0] === 'event' && EVENTS.includes(row[1])).map(row => ({ name: row[1], params: row[2] || {} }));
}

async function runtime(base) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const test of [{ width: 390, height: 844, lang: 'en' }, { width: 1440, height: 900, lang: 'fr' }]) {
      const context = await browser.newContext({ viewport: { width: test.width, height: test.height } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
      await page.addInitScript(() => Object.defineProperty(navigator, 'share', { configurable: true, value: async () => true }));
      await page.goto(`${base}/toxic-trait-test/?lang=${test.lang}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      try {
        await page.waitForFunction(() => typeof i18n !== 'undefined' && i18n.initialized && getComputedStyle(document.getElementById('app-loader')).visibility === 'hidden', null, { timeout: 15000 });
      } catch (error) {
        const state = await page.evaluate(() => ({ i18n: typeof i18n !== 'undefined' && i18n.initialized, loader: document.getElementById('app-loader')?.className, body: document.body?.textContent?.slice(0, 120) }));
        throw new Error(`startup timeout ${JSON.stringify(state)}; ${errors.join('|')}`);
      }
      ok(await page.locator('html[data-ad-serving="suspended-invalid-traffic-2026-09-03"]').count() === 1, `${test.width}px marker missing`);
      const start = await page.locator('#btn-start').boundingBox();
      ok(start && start.width >= 44 && start.height >= 44, `${test.width}px start target below 44px`);
      ok(!(await page.evaluate(() => (window.dataLayer || []).some(row => row?.[1] === 'toxic_trait_start'))), `${test.width}px load counted as start`);
      await page.click('#btn-start');
      const firstOption = await page.locator('.option-card').first().boundingBox();
      ok(firstOption && firstOption.width >= 44 && firstOption.height >= 44, `${test.width}px option target below 44px`);
      for (let index = 0; index < 8; index += 1) {
        await page.locator('.option-card').first().click();
        if (index < 7) await page.waitForFunction(expected => document.getElementById('progress-label').textContent === `${expected} / 8`, index + 2);
      }
      await page.waitForSelector('#screen-result.active', { timeout: 10000 });
      const next = `/stress-check/?lang=${test.lang}&source=toxic_trait_result`;
      const overthinker = `/overthinker-test/?lang=${test.lang}&source=toxic_trait_result`;
      const attachment = `/attachment-style/?lang=${test.lang}&source=toxic_trait_result`;
      ok(await page.locator('#next-action').getAttribute('href') === next, `${test.width}px next route drifted`);
      ok(await page.locator('[data-related-slug="overthinker"]').getAttribute('href') === overthinker, `${test.width}px overthinker route drifted`);
      ok(await page.locator('[data-related-slug="attachment"]').getAttribute('href') === attachment, `${test.width}px attachment route drifted`);
      await page.evaluate(() => document.getElementById('next-action').addEventListener('click', event => event.preventDefault()));
      await page.click('#next-action');
      await page.click('#btn-share');
      await page.click('#btn-share');
      await page.evaluate(() => document.querySelector('[data-related-slug]').addEventListener('click', event => event.preventDefault()));
      await page.click('[data-related-slug] .related-name');
      const report = await page.evaluate(() => ({
        rows: (window.dataLayer || []).filter(row => row?.[0] === 'event'),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets: ['#next-action', '#btn-share', '#btn-retry'].map(selector => { const box = document.querySelector(selector).getBoundingClientRect(); return { selector, width: box.width, height: box.height }; }),
        related: Array.from(document.querySelectorAll('[data-related-slug]'), element => { const box = element.getBoundingClientRect(); return { href: element.getAttribute('href'), width: box.width, height: box.height }; }),
        ads: document.querySelectorAll('script[src*="pagead2"], ins.adsbygoogle, [data-ad-slot], [data-ad-client]').length,
        result: document.getElementById('result-type-name').textContent.trim(),
        boundary: document.querySelector('#screen-result [data-i18n="result.boundary"]').textContent.trim(),
        shareStatus: document.getElementById('share-status').textContent.trim()
      }));
      const events = funnel(report.rows);
      for (const name of EVENTS) ok(events.filter(event => event.name === name).length === 1, `${test.width}px ${name} not exact-once`);
      ok(events.every(event => Object.keys(event.params).every(key => key === 'event_category')), `${test.width}px private telemetry`);
      ok(report.overflow <= 0 && [...report.targets, ...report.related].every(target => target.width >= 44 && target.height >= 44), `${test.width}px layout or touch regression ${JSON.stringify(report)}`);
      ok(report.related.map(item => item.href).join('|') === [overthinker, attachment].join('|'), `${test.width}px related routes drifted`);
      ok(report.ads === 0 && report.result && report.boundary && report.shareStatus && errors.length === 0, `${test.width}px runtime error ${errors.join('|')}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

function mutations() {
  const base = fixture();
  const cases = [
    ['marker', { html: base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"', '') }],
    ['ad', { html: base.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['rating', { html: base.html.replace('</body>', '<p>aggregateRating</p></body>') }],
    ['faq', { html: base.html.replace('</body>', '<p>FAQPage</p></body>') }],
    ['proof', { html: base.html.replace('</body>', '<p class="social-proof">12,000+ profiles</p></body>') }],
    ['boundary', { html: base.html.replace(/not a diagnosis or validated assessment/gi, 'a diagnosis') }],
    ['scoring', { html: base.html.replace('scores[mappedType] += 1', 'scores[mappedType] += 3') }],
    ['private', { html: base.html.replace("trackStage('toxic_trait_complete');", "trackStage('toxic_trait_complete', type);") }],
    ['progress', { html: base.html.replace('qIdx === 3', 'qIdx === 0') }],
    ['exact', { html: base.html.replace('trackedStages.has(name)', 'false') }],
    ['share', { html: base.html.replace('await navigator.share(shareData)', 'navigator.share(shareData)') }],
    ['primary', { html: base.html.replace('/stress-check/?lang=ko&amp;source=toxic_trait_result', '/portal/') }],
    ['related', { html: base.html.replace('data-related-slug="overthinker"', '') }],
    ['nested', { html: base.html.replace("event.target.closest('.related-card')", "event.target.matches('.related-card')") }],
    ['event', { html: base.html.replace("trackStage('toxic_trait_start');", '') }],
    ['root-cache', { sw: base.sw.replace("'./index.html'", "'/index.html'") }],
    ['scope', { sw: base.sw.replace(' || !url.pathname.startsWith(APP_PATH)', '') }],
    ['success', { sw: base.sw.replace('if (response.ok)', 'if (response)') }],
    ['manifest', { manifest: base.manifest.replace('"scope": "/toxic-trait-test/"', '"scope": "/"') }],
    ['locale', { locales: { ...base.locales, en: base.locales.en.replaceAll('This author-created activity is for private reflection. It is not a diagnosis or validated assessment.', '') } }],
    ['readme', { readme: base.readme + 'x'.repeat(1500) }]
  ];
  for (const [name, mutation] of cases) {
    let caught = false;
    try { source({ ...base, ...mutation }); } catch (error) { caught = true; console.log(`[PASS] ${name}: ${error.message}`); }
    ok(caught, `mutation escaped: ${name}`);
  }
  console.log(`[PASS] mutation summary ${cases.length}/${cases.length} detected`);
}

async function main() {
  const urlIndex = process.argv.indexOf('--url');
  const base = urlIndex >= 0 ? process.argv[urlIndex + 1].replace(/\/$/, '') : '';
  const result = source();
  if (process.argv.includes('--mutations')) mutations();
  if (base) await runtime(base);
  else {
    const server = await createServer();
    try { await runtime(server.origin); } finally { await server.close(); }
  }
  console.log(`[PASS] Toxic Trait containment: ${result.locales} locales, ${result.related} focused routes, ${result.events} private stages`);
}

main().catch(error => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
