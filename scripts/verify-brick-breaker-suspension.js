#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'brick-breaker');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const EVENTS = [
  'brick_breaker_view',
  'brick_breaker_start',
  'brick_breaker_progress',
  'brick_breaker_complete',
  'brick_breaker_share',
];

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
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const source = [value.html, value.css, value.app, value.i18n, value.sw, ...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Brick Breaker suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(source), 'Active ad or game-ad code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded|btn-revive|reviveWithAd|placeholder_interstitial/i.test(source), 'Interstitial or rewarded-revive path remains');
  assert(!/aggregateRating|ratingCount|page_engage|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof or synthetic telemetry remains');
  assert(!/cross-promo|shareTwitterBtn|shareUrlBtn|recommendations-section|data-i18n="related\./i.test(value.html + value.css), 'Duplicate share or unattributed promotion remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve user zoom');
  for (const event of EVENTS) {
    assert(count(value.app, new RegExp(`trackBrickBreakerStage\\('${event}'\\)`, 'g')) === 1, `${event} call drifted`);
  }
  assert(/const brickBreakerStages = new Set\(\)/.test(value.app) && /brickBreakerStages\.has\(name\)/.test(value.app), 'Exact-once funnel guard missing');
  assert(!/trackBrickBreakerStage\('brick_breaker_(?:view|start|progress|complete|share)'\s*,/.test(value.app), 'Private game value entered a funnel event');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share success is not awaited');
  assert(value.app.indexOf("trackBrickBreakerStage('brick_breaker_share')") > value.app.indexOf('await navigator.clipboard.writeText'), 'Share is counted before completion');
  assert(/params\.get\('lang'\)/.test(value.i18n) && value.i18n.indexOf('params.get(\'lang\')') < value.i18n.indexOf("localStorage.getItem('i18n_lang')"), 'URL language no longer has first priority');
  assert(/CACHE_NAME = 'brick-breaker-v7'/.test(value.sw), 'Brick Breaker cache version is stale');
  assert(/name\.startsWith\(CACHE_PREFIX\)/.test(value.sw), 'Service worker can delete another product cache');
  assert(/event\.request\.method !== 'GET'/.test(value.sw) && /url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker request boundary missing');
  assert(/response\.ok/.test(value.sw) && !/['"]\/brick-breaker\//.test(value.sw.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/)?.[1] || ''), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === './' && manifest.start_url === './' && manifest.shortcuts?.[0]?.url === './?action=play', 'Manifest must remain deployment-relative');
  assert(Object.keys(value.locales).length === 12, 'Brick Breaker locale inventory drifted');
  for (const [lang, text] of Object.entries(value.locales)) {
    const locale = JSON.parse(text);
    assert(!Object.prototype.hasOwnProperty.call(locale, 'ad'), `${lang} ad copy returned`);
    assert(!Object.prototype.hasOwnProperty.call(locale, 'recommendations'), `${lang} recommendation copy returned`);
    assert(!Object.prototype.hasOwnProperty.call(locale, 'related'), `${lang} generic related copy returned`);
    assert(!Object.prototype.hasOwnProperty.call(locale, 'share'), `${lang} duplicate share copy returned`);
    assert(!Object.prototype.hasOwnProperty.call(locale.gameover || {}, 'revive'), `${lang} rewarded-revive label returned`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 1800, 'README returned to an oversized roadmap');
  assert(/invalid-traffic restriction/i.test(value.readme) && /brick_breaker_view/.test(value.readme), 'README lost the restriction or funnel contract');
  for (const stale of ['js/error-handler.js', 'og-image.jpg', 'og-image.svg']) {
    assert(!fs.existsSync(path.join(APP, stale)), `Unused asset returned: ${stale}`);
  }
  return { locales: LOCALES.length, events: EVENTS.length };
}

async function startServer() {
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/brick-breaker/')) { base = APP; relative = pathname.slice(15) || 'index.html'; }
      else if (pathname.startsWith('/portal/')) { base = PORTAL; relative = pathname.slice(8); }
      else return response.writeHead(404).end();
      let target = path.resolve(base, relative);
      assert(target === base || target.startsWith(`${base}${path.sep}`), `Unsafe path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(fs.readFileSync(target));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  return { origin: `http://127.0.0.1:${address.port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

function funnelEvents(rows) {
  return rows.filter((row) => row?.[0] === 'event' && EVENTS.includes(row[1])).map((row) => ({ name: row[1], params: row[2] || {} }));
}

async function clickCanvas(page) {
  const canvas = await page.locator('#game-canvas').boundingBox();
  assert(canvas && canvas.width >= 300 && canvas.height >= 300, `Canvas is not usable: ${JSON.stringify(canvas)}`);
  await page.mouse.click(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.addInitScript(() => {
        localStorage.setItem('i18n_lang', 'ko');
        Object.defineProperty(navigator, 'share', { configurable: true, value: async () => true });
      });
      await page.goto(`${baseUrl}/brick-breaker/?lang=en`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => window.game && window.i18n?.currentLang === 'en' && document.querySelector('#btn-start span')?.textContent === 'Start Game', null, { timeout: 15000 });
      const locale = await page.evaluate(() => ({ document: document.documentElement.lang, app: window.i18n.currentLang }));
      assert(locale.document === 'en' && locale.app === 'en', `${viewport.width}px URL language did not override saved Korean: ${JSON.stringify(locale)}`);
      await page.locator('#btn-start').click();
      await page.waitForFunction(() => window.game?.state === 'game');
      await clickCanvas(page);
      await page.waitForFunction(() => window.game?.gameRunning === true);
      await page.evaluate(() => window.game.endGame());
      await page.waitForFunction(() => window.game?.state === 'gameover' && !document.getElementById('gameover-screen').classList.contains('hidden'));
      await page.locator('#btn-retry').click();
      await clickCanvas(page);
      await page.evaluate(() => window.game.endGame());
      await page.locator('#btn-share').click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'brick_breaker_share'));
      const report = await page.evaluate(() => ({
        events: (window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets: ['btn-retry', 'btn-share', 'btn-menu'].map((id) => ({ id, ...(() => { const r = document.getElementById(id).getBoundingClientRect(); return { width: r.width, height: r.height }; })() })),
        adSurface: document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],[class*="ad-banner"],[id*="interstitial"]').length,
        promotion: document.querySelectorAll('[class*="cross-promo"],.recommendations-section,[data-i18n^="related."]').length,
      }));
      const stages = funnelEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /mode|stage|path|score|duration|time|result|error|url|location|language/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0, `${viewport.width}px horizontal overflow: ${report.overflow}`);
      assert(report.targets.every((target) => target.width >= 44 && target.height >= 44), `${viewport.width}px result target is below 44px: ${JSON.stringify(report.targets)}`);
      assert(report.adSurface === 0 && report.promotion === 0, `${viewport.width}px retired ad or promotion surface returned`);
      assert(errors.length === 0, `${viewport.width}px runtime errors: ${errors.join(' | ')}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker', { html: base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"', '') }],
    ['loader', { html: base.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward', { app: `${base.app}\nGameAds.showRewarded();` }],
    ['rating', { html: base.html.replace('</body>', '<div>aggregateRating</div></body>') }],
    ['synthetic', { app: `${base.app}\ngtag('event','page_engage');` }],
    ['duplicate-share', { html: base.html.replace('</body>', '<button id="shareTwitterBtn">Share</button></body>') }],
    ['private-value', { app: base.app.replace("trackBrickBreakerStage('brick_breaker_progress');", "trackBrickBreakerStage('brick_breaker_progress', this.score);") }],
    ['event-removed', { app: base.app.replace("trackBrickBreakerStage('brick_breaker_complete');", '') }],
    ['exact-once', { app: base.app.replace('brickBreakerStages.has(name)', 'false') }],
    ['unawaited-share', { app: base.app.replace('await navigator.share', 'navigator.share') }],
    ['language-priority', { i18n: base.i18n.replace("const urlLang = params.get('lang');", "const urlLang = ''; // URL ignored") }],
    ['zoom-disabled', { html: base.html.replace('initial-scale=1.0', 'initial-scale=1.0, user-scalable=no') }],
    ['root-cache', { sw: base.sw.replace("'./index.html'", "'/brick-breaker/index.html'") }],
    ['global-cache-delete', { sw: base.sw.replace('name.startsWith(CACHE_PREFIX) && ', '') }],
    ['scope-guard', { sw: base.sw.replace(' || !url.pathname.startsWith(APP_PATH)', '') }],
    ['success-guard', { sw: base.sw.replace('if (response.ok)', 'if (response)') }],
    ['manifest-scope', { manifest: base.manifest.replace('"scope": "./"', '"scope": "/"') }],
    ['locale-ad', { locales: { ...base.locales, en: base.locales.en.replace(/^\{/, '{\n  "ad": {},') } }],
    ['locale-revive', { locales: { ...base.locales, en: base.locales.en.replace('"gameover": {', '"gameover": {\n    "revive": "Watch Ad",') } }],
    ['readme-bloat', { readme: base.readme + 'x'.repeat(1800) }],
  ];
  for (const [name, override] of cases) {
    let detected = false;
    try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(detected, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const at = process.argv.indexOf('--url');
  const production = at >= 0 ? process.argv[at + 1].replace(/\/$/, '') : '';
  const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRuntime(production);
  else { const server = await startServer(); try { await verifyRuntime(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Brick Breaker suspension: ${result.locales} locales, ${result.events} exact-once funnel stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
