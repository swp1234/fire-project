#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const OLD_PATH = '/portal/blog/free-online-games.html';
const TARGET_PATH = '/portal/games/';
const REFERENCE_FILES = [
  'index.html', 'blog/index.html', 'rss.xml', 'blog/brain-test-2026.html',
  'blog/emoji-merge-guide-2026.html', 'blog/idle-game-guide-2026.html',
  'blog/stress-test-psychology.html', 'blog/id/free-games.html',
  'blog/tr/free-games.html', 'blog/tr/tarayici-oyunlari-2026.html'
];
function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(PORTAL, relative), 'utf8'); }

function fixture(overrides = {}) {
  return {
    module: overrides.module ?? read('js/game-ads.js'),
    retired: overrides.retired ?? read('blog/free-online-games.html'),
    references: overrides.references ?? Object.fromEntries(REFERENCE_FILES.map((file) => [file, read(file)])),
    focus: overrides.focus ?? fs.readFileSync(path.join(ROOT, 'scripts', 'blog-indexing-focus.js'), 'utf8')
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  assert(Buffer.byteLength(value.module, 'utf8') < 900, 'Compatibility module is oversized');
  assert(/const GameAds/.test(value.module) && /showInterstitial\(options = \{\}\)/.test(value.module), 'Existing game callback compatibility is missing');
  assert(/typeof options\.onComplete === 'function'/.test(value.module) && /options\.onComplete\(\)/.test(value.module), 'Result callback is not preserved');
  assert(/isAvailable\(\)[\s\S]*return false/.test(value.module), 'Availability must remain false during containment');
  assert(!/adsbygoogle|adBreak|adConfig|showRewarded|injectRewardButton|onReward|onSkip|ga-reward|reward-continue/i.test(value.module), 'Ad request or incentive API returned');

  assert(Buffer.byteLength(value.retired, 'utf8') <= 900, `Retired guide is too large: ${Buffer.byteLength(value.retired, 'utf8')} bytes`);
  assert(/<html\s+lang="ko"/i.test(value.retired) && /name="robots" content="noindex,follow"/i.test(value.retired), 'Retired guide language or noindex contract drifted');
  assert(new RegExp(`http-equiv="refresh" content="0; url=https://dopabrain\\.com${TARGET_PATH}"`, 'i').test(value.retired), 'Retired guide refresh target drifted');
  assert(new RegExp(`rel="canonical" href="https://dopabrain\\.com${TARGET_PATH}"`, 'i').test(value.retired), 'Retired guide canonical target drifted');
  assert(new RegExp(`location\\.replace\\('https://dopabrain\\.com${TARGET_PATH}'\\)`, 'i').test(value.retired), 'Retired guide script target drifted');
  assert(new RegExp(`<a href="https://dopabrain\\.com${TARGET_PATH}"`, 'i').test(value.retired), 'Retired guide fallback target drifted');
  assert(!/googletagmanager|adsbygoogle|ad-loader|application\/ld\+json|aggregateRating/i.test(value.retired), 'Retired guide contains analytics, ads, or schema');
  for (const [file, source] of Object.entries(value.references)) assert(!source.includes(OLD_PATH), `${file} still promotes the retired guide`);
  assert(/counts\.redirects !== 209/.test(value.focus), 'Focused redirect inventory was not updated');
  return { moduleBytes:Buffer.byteLength(value.module, 'utf8'), retiredBytes:Buffer.byteLength(value.retired, 'utf8'), references:REFERENCE_FILES.length };
}

function verifyCompatibility(source) {
  const context = {};
  vm.runInNewContext(`${source}\nglobalThis.__gameAds = GameAds;`, context);
  const api = context.__gameAds;
  assert(api && typeof api.init === 'function' && typeof api.showInterstitial === 'function', 'Compatibility API failed to load');
  assert(!api.showRewarded && !api.injectRewardButton, 'Reward API is exposed');
  let completed = 0;
  api.init();
  api.showInterstitial({ onComplete:() => { completed += 1; } });
  api.showInterstitial();
  assert(completed === 1 && api.isAvailable() === false, 'Compatibility callback or availability failed');
  assert(context.adsbygoogle === undefined && context.adBreak === undefined && context.adConfig === undefined, 'Compatibility module created an ad global');
}

async function startServer() {
  let origin = '';
  const types = { '.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const relative = requestPath.startsWith('/portal/') ? requestPath.slice('/portal/'.length) : '';
      let target = path.resolve(PORTAL, relative || 'index.html');
      assert(target === PORTAL || target.startsWith(`${PORTAL}${path.sep}`), `Unsafe request path: ${requestPath}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      let body = fs.readFileSync(target);
      if (requestPath === OLD_PATH) body = Buffer.from(body.toString('utf8').replaceAll('https://dopabrain.com', origin));
      response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':`${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(body);
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  origin = `http://127.0.0.1:${address.port}`;
  return { origin, close:() => new Promise((resolve) => server.close(resolve)) };
}

async function verifyRedirect(baseUrl) {
  const browser = await chromium.launch({ headless:true });
  try {
    for (const viewport of [{ width:390, height:844 }, { width:1440, height:900 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.goto(`${baseUrl}${OLD_PATH}`, { waitUntil:'domcontentloaded', timeout:15000 });
      await page.waitForURL((url) => url.pathname === TARGET_PATH, { timeout:10000 });
      const report = await page.evaluate(() => ({
        path:location.pathname,
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        actions:Array.from(document.querySelectorAll('main a,main button,[role="main"] a,[role="main"] button'), (item) => { const r=item.getBoundingClientRect(); return { width:r.width, height:r.height }; })
      }));
      assert(report.path === TARGET_PATH && report.overflow <= 0 && report.actions.length > 0, `${viewport.width}px retirement destination failed: ${JSON.stringify(report)}`);
      assert(report.actions.every((action) => action.width >= 43.99 && action.height >= 43.99), `${viewport.width}px destination action below 44px`);
      assert(errors.length === 0, `${viewport.width}px runtime errors: ${errors.join(' | ')}`);
      await page.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['module-bloat',{ module:base.module + 'x'.repeat(900) }],
    ['missing-callback',{ module:base.module.replace('options.onComplete();','') }],
    ['false-availability',{ module:base.module.replace('return false;','return true;') }],
    ['ad-request',{ module:`${base.module}\nwindow.adsbygoogle = [];` }],
    ['reward-api',{ module:base.module.replace('reset() {}','showRewarded() {}, reset() {}') }],
    ['missing-noindex',{ retired:base.retired.replace('noindex,follow','index,follow') }],
    ['wrong-target',{ retired:base.retired.replaceAll('/portal/games/','/portal/tests/') }],
    ['retired-ad',{ retired:base.retired.replace('</head>','<script src="/portal/js/ad-loader.js"></script></head>') }],
    ['reference-returned',{ references:{ ...base.references, 'index.html':`${base.references['index.html']}\n${OLD_PATH}` } }],
    ['redirect-count',{ focus:base.focus.replace('counts.redirects !== 209','counts.redirects !== 208') }],
    ['retired-bloat',{ retired:base.retired + 'x'.repeat(900) }]
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
  verifyCompatibility(fixture().module);
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRedirect(production);
  else { const server = await startServer(); try { await verifyRedirect(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Portal containment: ${result.moduleBytes} byte compatibility module, ${result.retiredBytes} byte redirect, ${result.references} references clean`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
