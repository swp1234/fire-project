#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'luck-meter');
const TARGET = path.join(ROOT, 'projects', 'fortune-cookie');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const OLD_PATH = '/luck-meter/';
const TARGET_PATH = '/fortune-cookie/';
const ALLOWED_FILES = ['.gitattributes', 'README.md', 'index.html', 'sw.js'];
const assert = (value, message) => { if (!value) throw new Error(message); };
const read = (file) => fs.readFileSync(file, 'utf8');

function files(directory = APP, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git') return [];
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? files(path.join(directory, entry.name), relative) : [relative];
  }).sort();
}

function promotionSources() {
  const rows = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(?:html|js|xml)$/.test(entry.name)) rows.push([file, read(file)]);
    }
  };
  visit(PORTAL);
  visit(TARGET);
  return rows;
}

function verifySource(overrides = {}) {
  const html = overrides.html ?? read(path.join(APP, 'index.html'));
  const worker = overrides.worker ?? read(path.join(APP, 'sw.js'));
  const inventory = overrides.files ?? files();
  const sources = overrides.sources ?? promotionSources();
  assert(JSON.stringify(inventory) === JSON.stringify(ALLOWED_FILES), `Retired footprint drifted: ${inventory.join(', ')}`);
  assert(Buffer.byteLength(html) <= 1500, `Retired stub is too large: ${Buffer.byteLength(html)} bytes`);
  assert(/name="robots" content="noindex,follow"/.test(html), 'Retired route must be noindex,follow');
  assert(html.includes(`content="1; url=https://dopabrain.com${TARGET_PATH}"`), 'Refresh target drifted');
  assert(html.includes(`href="https://dopabrain.com${TARGET_PATH}"`), 'Fallback/canonical target drifted');
  assert(html.includes(`const target = 'https://dopabrain.com${TARGET_PATH}'`), 'Script target drifted');
  assert(/data-product-status="retired-2026-09-05"/.test(html), 'Retirement marker missing');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(html), 'Incident marker missing');
  assert(!/googletagmanager|pagead2|adsbygoogle|application\/ld\+json|FAQPage|aggregateRating|page_engage|luck_score|measure_luck/i.test(html), 'Retired route contains ads, analytics, schema, or fake measurement');
  assert(/startsWith\('luck-meter'\)/.test(worker) && /caches\.delete\(name\)/.test(worker), 'Old caches are not narrowly removed');
  assert(/registration\.unregister\(\)/.test(worker), 'Retired worker must unregister');
  assert(!/addEventListener\(['"](?:fetch|push|sync|notificationclick)/.test(worker), 'Retired worker intercepts runtime traffic');
  const stale = sources.filter(([, source]) => /\/luck-meter\/|appId:\s*['"]luck-meter|id:\s*['"]luck-meter/i.test(source));
  assert(stale.length === 0, `Portal still promotes the retired route: ${stale.map(([file]) => path.relative(PORTAL, file)).join(', ')}`);
  return { bytes: Buffer.byteLength(html), files: inventory.length };
}

function mutations() {
  const baseline = { html: read(path.join(APP, 'index.html')), worker: read(path.join(APP, 'sw.js')), files: files(), sources: promotionSources() };
  const cases = [
    ['noindex', { html: baseline.html.replace('noindex,follow', 'index,follow') }],
    ['target', { html: baseline.html.replaceAll(TARGET_PATH, '/daily-tarot/') }],
    ['ad', { html: baseline.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/x.js"></script></head>') }],
    ['fake-measurement', { html: baseline.html.replace('</main>', '<p>luck_score 95%</p></main>') }],
    ['bundle', { files: [...baseline.files, 'js/app.js'].sort() }],
    ['cache', { worker: baseline.worker.replace("name.startsWith('luck-meter')", 'name.length > 0') }],
    ['worker', { worker: baseline.worker.replace('await self.registration.unregister();', '') }],
    ['promotion', { sources: [...baseline.sources, [path.join(PORTAL, 'fake.html'), '<a href="/luck-meter/">old</a>']] }],
  ];
  for (const [name, override] of cases) {
    let caught = false;
    try { verifySource({ ...baseline, ...override }); } catch (error) { caught = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(caught, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function localServer() {
  let origin = '';
  const roots = [[OLD_PATH, APP], [TARGET_PATH, TARGET], ['/portal/', PORTAL]];
  const instance = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const pair = roots.find(([prefix]) => pathname.startsWith(prefix));
      if (!pair) return response.writeHead(404).end();
      const [prefix, base] = pair;
      let target = path.resolve(base, pathname.slice(prefix.length) || 'index.html');
      assert(target === base || target.startsWith(`${base}${path.sep}`), `Unsafe path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) return response.writeHead(404).end();
      let body = fs.readFileSync(target);
      if (pathname === OLD_PATH) body = Buffer.from(body.toString('utf8').replaceAll('https://dopabrain.com', origin));
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
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
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
      await page.goto(`${origin}${OLD_PATH}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForURL((url) => url.pathname === TARGET_PATH, { timeout: 10000 });
      assert((await page.locator('a[href], button').count()) > 0, 'Destination has no action');
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
      assert(overflow <= 0, `${width}px destination overflow: ${overflow}px`);
      await page.close();
    }
  } finally { await browser.close(); }
}

async function productionParity(origin) {
  const checks = [
    [APP, 'index.html', OLD_PATH], [APP, 'sw.js', `${OLD_PATH}sw.js`],
    [PORTAL, 'index.html', '/portal/'], [PORTAL, 'js/app-data.js', '/portal/js/app-data.js'],
    [PORTAL, 'blog/en/lottery-number-guide.html', '/portal/blog/en/lottery-number-guide.html'],
    [TARGET, 'index.html', TARGET_PATH],
    ...['de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh'].map((locale) => [TARGET, `js/locales/${locale}.json`, `${TARGET_PATH}js/locales/${locale}.json`]),
  ];
  await Promise.all(checks.map(async ([repository, file, url]) => {
    const branch = repository === PORTAL ? 'main' : 'master';
    const result = spawnSync('git', ['cat-file', 'blob', `origin/${branch}:${file}`], { cwd: repository });
    assert(result.status === 0, `Cannot read deployed Git blob: ${file}`);
    const response = await fetch(`${origin}${url}?retirement-verify=20260905`, { cache: 'no-store', redirect: 'manual' });
    assert(response.status === 200, `Production returned ${response.status}: ${url}`);
    assert(Buffer.from(await response.arrayBuffer()).equals(result.stdout), `Production bytes differ from origin/${branch}: ${url}`);
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
    console.log(`[PASS] Luck Meter retirement production: ${result.bytes} bytes, ${result.files} files -> ${TARGET_PATH}`);
    return;
  }
  const local = await localServer();
  try { await redirect(local.origin); } finally { await local.close(); }
  console.log(`[PASS] Luck Meter retirement local: ${result.bytes} bytes, ${result.files} files -> ${TARGET_PATH}`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
