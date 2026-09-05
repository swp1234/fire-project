#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'red-flag-test');
const TARGET = path.join(ROOT, 'projects', 'attachment-style');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const OLD_PATH = '/red-flag-test/';
const TARGET_PATH = '/attachment-style/';
const SOURCE = 'red_flag_retirement';
const LANGUAGES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const ALLOWED_FILES = ['.gitattributes', 'README.md', 'index.html', 'sw.js'];
const PROMOTION_FILES = ['tests/index.html', 'js/app-data.js', 'js/country-content.js', 'js/cross-promo.js'];
const ok = (value, message) => { if (!value) throw new Error(message); };
const read = (base, file) => fs.readFileSync(path.join(base, file), 'utf8');

function files(directory = APP, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git') return [];
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? files(path.join(directory, entry.name), relative) : [relative];
  }).sort();
}

function baseline() {
  return {
    html: read(APP, 'index.html'),
    worker: read(APP, 'sw.js'),
    readme: read(APP, 'README.md'),
    inventory: files(),
    targetApp: read(TARGET, 'js/app.js'),
    promotions: Object.fromEntries(PROMOTION_FILES.map((file) => [file, read(PORTAL, file)])),
    locales: Object.fromEntries(LANGUAGES.map((lang) => [lang, JSON.parse(read(PORTAL, `js/locales/${lang}.json`))])),
  };
}

function verifySource(value = baseline()) {
  ok(JSON.stringify(value.inventory) === JSON.stringify(ALLOWED_FILES), `Retired footprint drifted: ${value.inventory.join(', ')}`);
  ok(Buffer.byteLength(value.html) <= 1500, `Retired stub is too large: ${Buffer.byteLength(value.html)} bytes`);
  ok(/name="robots" content="noindex,follow"/.test(value.html), 'Retired route must be noindex,follow');
  ok(value.html.includes(`href="https://dopabrain.com${TARGET_PATH}`), 'Canonical or fallback target drifted');
  ok(value.html.includes(`source=${SOURCE}`) && value.html.includes(`&source=${SOURCE}`), 'Attributed redirect target missing');
  ok(value.html.includes("['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr']"), 'Language allowlist drifted');
  ok(/data-product-status="retired-2026-09-05"/.test(value.html), 'Retirement marker missing');
  ok(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Incident marker missing');
  ok(!/googletagmanager|pagead2|adsbygoogle|application\/ld\+json|FAQPage|aggregateRating|page_engage|percentile|quiz_complete/i.test(value.html), 'Retired route contains ads, analytics, schema, or fake measurement');
  ok(/startsWith\('red-flag-test'\)/.test(value.worker) && /caches\.delete\(name\)/.test(value.worker), 'Old caches are not narrowly removed');
  ok(/registration\.unregister\(\)/.test(value.worker), 'Retired worker must unregister');
  ok(!/addEventListener\(['"](?:fetch|push|sync|notificationclick)/.test(value.worker), 'Retired worker intercepts runtime traffic');
  ok(Buffer.byteLength(value.readme) <= 600 && /no visits or qualified actions/.test(value.readme), 'README is not a compact evidence record');
  ok(value.targetApp.includes(`'${SOURCE}'`), 'Attachment Style source allowlist missing');

  for (const [file, source] of Object.entries(value.promotions)) {
    ok(!/\/red-flag-test\/|appId:\s*['"]red-flag-test|id:\s*['"]red-flag-test|['"]red-flag-test['"]/.test(source), `Portal still promotes the retired route: ${file}`);
  }
  const hub = value.promotions['tests/index.html'];
  const schemas = [...hub.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const collection = schemas.find((schema) => schema['@type'] === 'CollectionPage');
  const list = collection?.mainEntity;
  ok(list && list.numberOfItems === 40 && list.itemListElement.length === 40, `Tests hub ItemList count drifted: declared=${list?.numberOfItems} rows=${list?.itemListElement?.length}`);
  ok(list.itemListElement.filter((item) => item.url === 'https://dopabrain.com/attachment-style/').length === 1, 'Tests hub replacement drifted');
  ok((hub.match(/class="test-card"/g) || []).length === 40, 'Tests hub card count drifted');
  for (const [lang, locale] of Object.entries(value.locales)) {
    ok(/^40\D/.test(locale.hub_tests?.badge || ''), `${lang} tests badge count drifted: ${locale.hub_tests?.badge}`);
  }
  return { bytes: Buffer.byteLength(value.html), files: value.inventory.length, hubCards: 40 };
}

function mutations() {
  const source = baseline();
  const cases = [
    ['noindex', { html: source.html.replace('noindex,follow', 'index,follow') }],
    ['target', { html: source.html.replaceAll(TARGET_PATH, '/daily-tarot/') }],
    ['ad', { html: source.html.replace('<p>Red Flag Test has been retired. Its score was not a validated assessment.</p>', '<script src="https://pagead2.googlesyndication.com/x.js"></script>') }],
    ['fake-percentile', { html: source.html.replace('<p>Red Flag Test has been retired. Its score was not a validated assessment.</p>', '<p>Top 5% percentile result</p>') }],
    ['bundle', { inventory: [...source.inventory, 'js/app.js'].sort() }],
    ['cache', { worker: source.worker.replace("name.startsWith('red-flag-test')", 'name.length > 0') }],
    ['worker', { worker: source.worker.replace('await self.registration.unregister();', '') }],
    ['source', { targetApp: source.targetApp.replace(`, '${SOURCE}'`, '') }],
    ['promotion', { promotions: { ...source.promotions, 'js/app-data.js': `${source.promotions['js/app-data.js']}\n{id:'red-flag-test'}` } }],
    ['hub-count', { promotions: { ...source.promotions, 'tests/index.html': source.promotions['tests/index.html'].replace('"numberOfItems":40', '"numberOfItems":41') } }],
    ['locale-count', { locales: { ...source.locales, en: { ...source.locales.en, hub_tests: { ...source.locales.en.hub_tests, badge: '41 Tests Available' } } } }],
  ];
  for (const [name, override] of cases) {
    let caught = false;
    try { verifySource({ ...source, ...override }); } catch (error) { caught = true; console.log(`[PASS] ${name}: ${error.message}`); }
    ok(caught, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function localServer() {
  let origin = '';
  const roots = [[OLD_PATH, APP], [TARGET_PATH, TARGET]];
  const instance = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const pair = roots.find(([prefix]) => pathname.startsWith(prefix));
      if (!pair) return response.writeHead(404).end();
      const [prefix, base] = pair;
      let file = path.resolve(base, pathname.slice(prefix.length) || 'index.html');
      ok(file === base || file.startsWith(`${base}${path.sep}`), `Unsafe path: ${pathname}`);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) return response.writeHead(404).end();
      let body = fs.readFileSync(file);
      if (pathname === OLD_PATH) body = Buffer.from(body.toString('utf8').replaceAll('https://dopabrain.com', origin));
      const ext = path.extname(file);
      const type = ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : ext === '.json' ? 'application/json' : 'text/html; charset=utf-8';
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': type });
      response.end(body);
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(instance);
  origin = `http://127.0.0.1:${address.port}`;
  return { origin, close: () => new Promise((resolve) => instance.close(resolve)) };
}

async function redirect(origin) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [width, requested, expected] of [[390, 'tr', 'tr'], [1440, 'invalid', 'en']]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
      await page.goto(`${origin}${OLD_PATH}?lang=${requested}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForURL((url) => url.pathname === TARGET_PATH && url.searchParams.get('lang') === expected && url.searchParams.get('source') === SOURCE, { timeout: 10000 });
      await page.waitForFunction((lang) => document.documentElement.lang === lang && document.querySelector('#start-screen.active') && document.querySelector('#app-loader.hidden'), expected, { timeout: 10000 });
      await page.waitForTimeout(700);
      const result = await page.evaluate(() => ({
        events: (window.dataLayer || []).map((row) => Array.from(row)).filter((row) => row[0] === 'event').map((row) => ({ name: row[1], params: row[2] })),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        target: (() => { const r = document.querySelector('#start-btn').getBoundingClientRect(); return [r.width, r.height]; })(),
      }));
      const views = result.events.filter((event) => event.name === 'attachment_reflection_view');
      ok(views.length === 1 && views[0].params.source === SOURCE, `${width}px retirement attribution drifted: ${JSON.stringify(result.events)}`);
      ok(result.overflow <= 0, `${width}px destination overflow: ${result.overflow}px`);
      ok(result.target[0] >= 44 && result.target[1] >= 44, `${width}px destination action is below 44px`);
      await page.close();
    }
  } finally { await browser.close(); }
}

async function productionParity(origin) {
  const checks = [
    [APP, 'master', 'index.html', OLD_PATH], [APP, 'master', 'sw.js', `${OLD_PATH}sw.js`],
    [PORTAL, 'main', 'tests/index.html', '/portal/tests/'], [PORTAL, 'main', 'js/app-data.js', '/portal/js/app-data.js'],
    [PORTAL, 'main', 'js/country-content.js', '/portal/js/country-content.js'], [PORTAL, 'main', 'js/cross-promo.js', '/portal/js/cross-promo.js'],
    ...LANGUAGES.map((lang) => [PORTAL, 'main', `js/locales/${lang}.json`, `/portal/js/locales/${lang}.json`]),
    [TARGET, 'master', 'js/app.js', `${TARGET_PATH}js/app.js`],
  ];
  await Promise.all(checks.map(async ([repository, branch, file, url]) => {
    const blob = spawnSync('git', ['cat-file', 'blob', `origin/${branch}:${file}`], { cwd: repository });
    ok(blob.status === 0, `Cannot read deployed Git blob: ${file}`);
    const response = await fetch(`${origin}${url}?red-flag-retirement=20260905`, { cache: 'no-store', redirect: 'manual' });
    ok(response.status === 200, `Production returned ${response.status}: ${url}`);
    ok(Buffer.from(await response.arrayBuffer()).equals(blob.stdout), `Production bytes differ from origin/${branch}: ${url}`);
  }));
  console.log(`[PASS] Production byte parity: ${checks.length}/${checks.length} files`);
}

async function main() {
  const result = verifySource();
  if (process.argv.includes('--mutations')) mutations();
  const index = process.argv.indexOf('--url');
  if (index >= 0) {
    const origin = process.argv[index + 1].replace(/\/$/, '');
    await productionParity(origin);
    await redirect(origin);
    console.log(`[PASS] Red Flag retirement production: ${JSON.stringify(result)}`);
    return;
  }
  const local = await localServer();
  try { await redirect(local.origin); } finally { await local.close(); }
  console.log(`[PASS] Red Flag retirement local: ${JSON.stringify(result)}`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
