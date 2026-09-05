#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const repo = (name) => path.join(ROOT, 'projects', name);
const APP = repo('rizz-score');
const TARGET = repo('attachment-style');
const PORTAL = repo('portal');
const OLD_PATH = '/rizz-score/';
const TARGET_PATH = '/attachment-style/';
const ALLOWED_FILES = ['.gitattributes', 'README.md', 'index.html', 'sw.js'];
const PROMOTION_FILES = [
  [PORTAL, 'index.html'], [PORTAL, 'js/app-data.js'], [PORTAL, 'js/cross-promo.js'], [PORTAL, 'js/country-content.js'],
  [repo('ick-factor'), 'index.html'], [repo('pick-me'), 'index.html'], [repo('would-you-rather'), 'index.html'],
  [repo('npc-test'), 'index.html'], [repo('npc-test'), 'js/app.js'], [repo('kpop-position'), 'index.html'],
];
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
  return PROMOTION_FILES.map(([directory, file]) => [path.join(directory, file), read(path.join(directory, file))]);
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
  assert(!/googletagmanager|pagead2|adsbygoogle|application\/ld\+json|FAQPage|aggregateRating|page_engage|rizz_level|rizz_score|score\s+95%/i.test(html), 'Retired route contains ads, analytics, schema, or fake measurement');
  assert(/startsWith\('rizz-score'\)/.test(worker) && /caches\.delete\(name\)/.test(worker), 'Old caches are not narrowly removed');
  assert(/registration\.unregister\(\)/.test(worker), 'Retired worker must unregister');
  assert(!/addEventListener\(['"](?:fetch|push|sync|notificationclick)/.test(worker), 'Retired worker intercepts runtime traffic');
  const stale = sources.filter(([, source]) => /\/rizz-score\/|appId:\s*['"]rizz-score|id:\s*['"]rizz-score/i.test(source));
  assert(stale.length === 0, `A live surface still promotes the retired route: ${stale.map(([file]) => path.relative(ROOT, file)).join(', ')}`);
  return { bytes: Buffer.byteLength(html), files: inventory.length };
}

function mutations() {
  const baseline = { html: read(path.join(APP, 'index.html')), worker: read(path.join(APP, 'sw.js')), files: files(), sources: promotionSources() };
  const cases = [
    ['noindex', { html: baseline.html.replace('noindex,follow', 'index,follow') }],
    ['target', { html: baseline.html.replaceAll(TARGET_PATH, '/daily-tarot/') }],
    ['ad', { html: baseline.html.replace(/<p>[^<]+<\/p>/, '<script src="https://pagead2.googlesyndication.com/x.js"></script>') }],
    ['fake-measurement', { html: baseline.html.replace('</main>', '<p>rizz score 95%</p></main>') }],
    ['bundle', { files: [...baseline.files, 'js/app.js'].sort() }],
    ['cache', { worker: baseline.worker.replace("name.startsWith('rizz-score')", 'name.length > 0') }],
    ['worker', { worker: baseline.worker.replace('await self.registration.unregister();', '') }],
    ['promotion', { sources: [...baseline.sources, [path.join(PORTAL, 'fake.html'), '<a href="/rizz-score/">old</a>']] }],
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
  const roots = [[OLD_PATH, APP], [TARGET_PATH, TARGET]];
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
      const extension = path.extname(target);
      const type = extension === '.css' ? 'text/css' : extension === '.js' ? 'application/javascript' : extension === '.json' ? 'application/json' : 'text/html; charset=utf-8';
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
    [APP, 'master', 'index.html', OLD_PATH], [APP, 'master', 'sw.js', `${OLD_PATH}sw.js`],
    [PORTAL, 'main', 'index.html', '/portal/'], [PORTAL, 'main', 'js/app-data.js', '/portal/js/app-data.js'],
    [PORTAL, 'main', 'js/cross-promo.js', '/portal/js/cross-promo.js'], [PORTAL, 'main', 'js/country-content.js', '/portal/js/country-content.js'],
    [repo('ick-factor'), 'master', 'index.html', '/ick-factor/'], [repo('pick-me'), 'master', 'index.html', '/pick-me/'],
    [repo('would-you-rather'), 'master', 'index.html', '/would-you-rather/'],
    [repo('npc-test'), 'gh-pages', 'index.html', '/npc-test/'], [repo('npc-test'), 'gh-pages', 'js/app.js', '/npc-test/js/app.js'],
    [repo('kpop-position'), 'main', 'index.html', '/kpop-position/'], [TARGET, 'master', 'index.html', TARGET_PATH],
  ];
  await Promise.all(checks.map(async ([repository, branch, file, url]) => {
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
    console.log(`[PASS] Rizz Score retirement production: ${result.bytes} bytes, ${result.files} files -> ${TARGET_PATH}`);
    return;
  }
  const local = await localServer();
  try { await redirect(local.origin); } finally { await local.close(); }
  console.log(`[PASS] Rizz Score retirement local: ${result.bytes} bytes, ${result.files} files -> ${TARGET_PATH}`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
