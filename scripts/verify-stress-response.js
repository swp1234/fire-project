#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'stress-response');
const LOCALES = ['ko','en','ja','zh','es','pt','id','tr','de','fr','hi','ru'];
const EVENTS = ['stress_response_view','stress_response_start','stress_response_progress','stress_response_complete','stress_response_next_click','stress_response_share','stress_response_related_click'];
const RELATED = ['/attachment-style/','/brain-type/'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'),
    css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'),
    i18n: overrides.i18n ?? read('js/i18n.js'),
    sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map(lang => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const allSource = [value.html,value.css,value.app,value.i18n,value.sw,value.manifest,...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Invalid-traffic suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|data-ad-client|\/portal\/js\/game-ads\.js|\bGameAds\b|showInterstitial|showRewarded/i.test(allSource), 'Ad code conflicts with the suspension');
  assert(!/aggregateRating|ratingCount|FAQPage|page_engage|ad_impression|social-proof|proof-count|percentile-stat/i.test(allSource), 'Fabricated proof, hidden schema, or synthetic telemetry remains');
  assert(!/result-card\.js|cross-promo\.js|DailyStreak|GameAchievements/i.test(allSource), 'Unneeded retention or promotion dependency remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve zoom');
  assert(/not a diagnosis or validated assessment/i.test(value.html), 'Visible method boundary missing from source');
  assert(/each answer adds one point/i.test(value.html), 'Transparent scoring explanation missing');
  assert(/href="\/stress-check\/\?lang=ko&amp;source=stress_response_result"/.test(value.html), 'Primary Stress Check action drifted');
  assert(count(value.html, /data-related-slug=/g) === 2, 'Exactly two focused related routes are required');
  for (const route of RELATED) assert(value.html.includes(`href="${route}"`), `Related route missing: ${route}`);
  for (const eventName of EVENTS) assert(count(value.app, new RegExp(`['"]${eventName}['"]`, 'g')) === 1, `Stage event call count drifted: ${eventName}`);
  assert(/this\.trackedStages = new Set\(\)/.test(value.app) && /this\.trackedStages\.has\(name\)/.test(value.app), 'Exact-once guard missing');
  assert(/this\.answers\.length === 4\) this\.trackStage\('stress_response_progress'\)/.test(value.app), 'Progress must require four accepted answers');
  assert(!/trackStage\('stress_response_[^']+'\s*,/.test(value.app), 'Private value entered funnel telemetry');
  assert(/event\.target\.closest\('\.related-card'\)/.test(value.app), 'Nested related-card attribution is missing');
  assert(/await navigator\.share\(shareData\)/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share must be success-gated');
  assert(!/shareData[\s\S]{0,300}resultType|shareData[\s\S]{0,300}typeScores/.test(value.app), 'Private result entered share copy');
  assert(/CACHE_NAME = 'stress-response-v2'/.test(value.sw), 'Service worker cache version drifted');
  assert(/url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker origin or scope guard missing');
  assert(/networkResponse\.ok/.test(value.sw) && !/['"]\/index\.html['"]/.test(value.sw), 'Service worker success or relative-cache contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === '/stress-response/' && manifest.start_url === '/stress-response/', 'Manifest scope drifted');
  assert(Object.keys(value.locales).length === 12, 'Locale inventory drifted');
  for (const [lang, source] of Object.entries(value.locales)) {
    const locale = JSON.parse(source);
    assert(!/\?\?+|�/.test(source), `${lang} contains broken encoding`);
    assert(locale.intro?.boundary && locale.result?.boundary && locale.result?.calculation, `${lang} boundary or method copy missing`);
    assert(locale.button?.next_action && locale.button?.share && locale.share?.success, `${lang} action copy missing`);
    assert(Object.keys(locale.type || {}).every(key => Object.keys(locale.type[key]).sort().join(',') === 'name,tagline'), `${lang} retained dormant clinical result copy`);
    assert(!locale.meta?.keywords && !locale.intro?.social_proof && !locale.result?.percentile, `${lang} retained retired proof or keyword copy`);
  }
  assert(Buffer.byteLength(value.readme) < 1500, 'README exceeds the compact operating-contract budget');
  return { locales:12, related:2, events:EVENTS.length };
}

async function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      if (!pathname.startsWith('/stress-response/')) return response.writeHead(404).end();
      const relative = pathname.slice('/stress-response/'.length) || 'index.html';
      let target = path.resolve(APP, relative);
      assert(target === APP || target.startsWith(`${APP}${path.sep}`), `Unsafe path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':`${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(fs.readFileSync(target));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  return { origin:`http://127.0.0.1:${address.port}`, close:()=>new Promise(resolve => server.close(resolve)) };
}

function funnelEvents(rows) {
  return rows.filter(row => row?.[0] === 'event' && EVENTS.includes(row[1])).map(row => ({ name:row[1], params:row[2] || {} }));
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless:true });
  try {
    for (const test of [{ width:390, height:844, lang:'en' }, { width:1440, height:900, lang:'fr' }]) {
      const context = await browser.newContext({ viewport:{ width:test.width, height:test.height } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.addInitScript(() => Object.defineProperty(navigator, 'share', { configurable:true, value:async () => true }));
      await page.goto(`${baseUrl}/stress-response/?lang=${test.lang}`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.waitForFunction(() => window.stressResponseApp && getComputedStyle(document.getElementById('app-loader')).display === 'none', null, { timeout:15000 });
      assert(await page.locator('html[data-ad-serving="suspended-invalid-traffic-2026-09-03"]').count() === 1, `${test.width}px suspension marker missing at runtime`);
      assert(await page.evaluate(() => !(window.dataLayer || []).some(row => row?.[1] === 'stress_response_start')), `${test.width}px load counted as start`);
      const startTarget = await page.locator('#start-btn').boundingBox();
      assert(startTarget && startTarget.width >= 44 && startTarget.height >= 44, `${test.width}px start action below 44px`);
      await page.locator('#start-btn').click();
      for (let i = 0; i < 8; i++) {
        await page.locator('.option-btn').first().click();
        if (i < 7) await page.waitForFunction(expected => document.getElementById('q-current').textContent === String(expected), i + 2);
      }
      await page.waitForSelector('#result-screen.active', { timeout:10000 });
      const expectedHref = `/stress-check/?lang=${test.lang}&source=stress_response_result`;
      assert(await page.locator('#next-action').getAttribute('href') === expectedHref, `${test.width}px localized next action drifted`);
      await page.evaluate(() => document.getElementById('next-action').addEventListener('click', event => event.preventDefault()));
      await page.locator('#next-action').click();
      await page.locator('#share-page').click();
      await page.locator('#share-page').click();
      await page.evaluate(() => document.querySelector('[data-related-slug]').addEventListener('click', event => event.preventDefault()));
      await page.locator('[data-related-slug] .related-name').first().click();
      const report = await page.evaluate(() => ({
        events:(window.dataLayer || []).filter(row => row?.[0] === 'event'),
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets:['#next-action','#share-page','#retry-btn'].map(selector => { const rect=document.querySelector(selector).getBoundingClientRect(); return { selector,width:rect.width,height:rect.height }; }),
        related:Array.from(document.querySelectorAll('[data-related-slug]'), link => { const rect=link.getBoundingClientRect(); return { href:link.getAttribute('href'),width:rect.width,height:rect.height }; }),
        adSurface:document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],[data-ad-client]').length,
        resultTitle:document.getElementById('result-title').textContent.trim(),
        boundary:document.querySelector('.result-description').textContent.trim(),
      }));
      const stages = funnelEvents(report.events);
      for (const name of EVENTS) assert(stages.filter(event => event.name === name).length === 1, `${test.width}px ${name} must fire exactly once`);
      assert(stages.every(event => Object.keys(event.params).every(key => key === 'event_category')), `${test.width}px private data entered telemetry`);
      assert(report.overflow <= 0 && [...report.targets,...report.related].every(target => target.width >= 44 && target.height >= 44), `${test.width}px layout or touch target regressed: ${JSON.stringify(report)}`);
      assert(JSON.stringify(report.related.map(item => item.href)) === JSON.stringify(RELATED), `${test.width}px related routes drifted`);
      assert(report.adSurface === 0 && report.resultTitle && report.boundary && errors.length === 0, `${test.width}px runtime error or empty result: ${errors.join(' | ')}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker', { html:base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"','') }],
    ['ad-loader', { html:base.html.replace('</head>','<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['rating', { html:base.html.replace('</body>','<div>aggregateRating</div></body>') }],
    ['faq', { html:base.html.replace('</body>','<div>FAQPage</div></body>') }],
    ['percentile', { html:base.html.replace('</body>','<p class="percentile-stat">Top 10%</p></body>') }],
    ['boundary', { html:base.html.replace('not a diagnosis or validated assessment','a clinical diagnosis') }],
    ['private-event', { app:base.app.replace("this.trackStage('stress_response_complete');", "this.trackStage('stress_response_complete', this.resultType.id);") }],
    ['progress', { app:base.app.replace('this.answers.length === 4', 'this.answers.length === 1') }],
    ['exact-once', { app:base.app.replace('this.trackedStages.has(name)', 'false') }],
    ['premature-share', { app:base.app.replace('await navigator.share(shareData)', 'navigator.share(shareData)') }],
    ['primary-route', { html:base.html.replace('/stress-check/?lang=ko&amp;source=stress_response_result','/portal/') }],
    ['related-attribution', { html:base.html.replace('data-related-slug="attachment-style"','') }],
    ['nested-click', { app:base.app.replace("event.target.closest('.related-card')", "event.target.matches('.related-card')") }],
    ['event', { app:base.app.replace("this.trackStage('stress_response_start');", '') }],
    ['root-cache', { sw:base.sw.replace("'./index.html'", "'/index.html'") }],
    ['scope', { sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)', '') }],
    ['success', { sw:base.sw.replace('if (networkResponse.ok)', 'if (networkResponse)') }],
    ['manifest', { manifest:base.manifest.replace('"scope": "/stress-response/"','"scope": "/"') }],
    ['locale-boundary', { locales:{ ...base.locales, en:base.locales.en.replace('This author-created activity is for private reflection. It does not diagnose stress, trauma, or any health condition.','') } }],
    ['readme', { readme:base.readme + 'x'.repeat(1500) }],
  ];
  for (const [name, override] of cases) {
    let detected = false;
    try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(detected, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const urlAt = process.argv.indexOf('--url');
  const production = urlAt >= 0 ? process.argv[urlAt + 1].replace(/\/$/,'') : '';
  const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRuntime(production);
  else { const server=await startServer(); try { await verifyRuntime(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Stress Response containment: ${result.locales} locales, ${result.related} focused routes, ${result.events} private stages`);
}

main().catch(error => { console.error(`[FAIL] ${error.message}`); process.exitCode=1; });
