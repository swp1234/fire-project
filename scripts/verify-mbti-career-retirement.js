#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'mbti-career');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const OLD_PATH = '/mbti-career/';
const TARGET_PATH = '/portal/mbti/';
const ALLOWED_FILES = ['.gitattributes', 'README.md', 'index.html', 'sw.js'];

function assert(value, message) {
  if (!value) throw new Error(message);
}

function read(relative) {
  return fs.readFileSync(path.join(APP, relative), 'utf8');
}

function currentFiles(directory = APP, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git') return [];
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? currentFiles(path.join(directory, entry.name), relative) : [relative];
  }).sort();
}

function verifySource(overrides = {}) {
  const html = overrides.html ?? read('index.html');
  const worker = overrides.worker ?? read('sw.js');
  const catalog = overrides.catalog ?? fs.readFileSync(path.join(PORTAL, 'js', 'app-data.js'), 'utf8');
  const roster = overrides.roster ?? fs.readFileSync(path.join(ROOT, 'scripts', 'verify-kpop-role-roster.js'), 'utf8');
  const files = overrides.files ?? currentFiles();

  assert(JSON.stringify(files) === JSON.stringify(ALLOWED_FILES), `Retired repository footprint drifted: ${files.join(', ')}`);
  assert(Buffer.byteLength(html) <= 1800, `Retired stub is too large: ${Buffer.byteLength(html)} bytes`);
  assert(/<html\s+lang=["']ko["']/i.test(html), 'Retired stub language must be Korean');
  assert(/name=["']robots["']\s+content=["']noindex,follow["']/i.test(html), 'Retired route must be noindex,follow');
  assert(new RegExp(`http-equiv=["']refresh["']\\s+content=["']1; url=https://dopabrain\\.com${TARGET_PATH}["']`, 'i').test(html), 'Refresh target drifted');
  assert(new RegExp(`rel=["']canonical["']\\s+href=["']https://dopabrain\\.com${TARGET_PATH}["']`, 'i').test(html), 'Canonical target drifted');
  assert(html.includes(`const target = 'https://dopabrain.com${TARGET_PATH}'`) && /location\.replace\(target\)/.test(html), 'Script redirect target drifted');
  assert(new RegExp(`<a\\s+href=["']https://dopabrain\\.com${TARGET_PATH}["']`, 'i').test(html), 'Fallback link target drifted');
  assert(/min-height:\s*44px/.test(html), 'Fallback action must retain a 44px touch target');
  assert(/data-ad-serving=["']suspended-invalid-traffic-2026-09-03["']/.test(html), 'Incident suspension marker missing');
  assert(!/pagead2|adsbygoogle|googletagmanager|application\/ld\+json|aggregateRating|ratingCount/i.test(html), 'Retired stub contains ads, analytics, or rating/schema claims');
  assert(!/perfect job|top 10|ideal career|과학적|정확도|AI 심층/i.test(html), 'Retired stub revives unsupported career claims');

  assert(/addEventListener\(["']install["']/.test(worker) && /skipWaiting\(\)/.test(worker), 'Service-worker install cleanup contract missing');
  assert(/addEventListener\(["']activate["']/.test(worker), 'Service-worker activate cleanup contract missing');
  assert(/startsWith\(["']mbti-career["']\)/.test(worker) && /caches\.delete\(name\)/.test(worker), 'Old MBTI Career caches are not narrowly removed');
  assert(/registration\.unregister\(\)/.test(worker), 'Retired service worker must unregister itself');
  assert(!/addEventListener\(["'](?:fetch|push|sync|notificationclick)["']|showNotification|openWindow/i.test(worker), 'Retired service worker retains runtime interception or notification behavior');

  assert(!/\bmbti-career\b/i.test(catalog), 'Portal catalog still promotes the retired product');
  assert(/const CATALOG_COUNT = 43;/.test(roster), 'Unrelated tools catalog count must remain 43');

  return { bytes: Buffer.byteLength(html), files: files.length, target: TARGET_PATH };
}

async function startServer() {
  let origin = '';
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base;
      let relative;
      if (pathname.startsWith(OLD_PATH)) {
        base = APP;
        relative = pathname.slice(OLD_PATH.length) || 'index.html';
      } else if (pathname.startsWith('/portal/')) {
        base = PORTAL;
        relative = pathname.slice('/portal/'.length) || 'index.html';
      } else {
        return response.writeHead(404).end();
      }
      let target = path.resolve(base, relative);
      assert(target === base || target.startsWith(`${base}${path.sep}`), `Unsafe request path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      let body = fs.readFileSync(target);
      if (pathname === OLD_PATH) body = Buffer.from(body.toString('utf8').replaceAll('https://dopabrain.com', origin));
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(body);
    } catch (error) {
      response.writeHead(400).end(error.message);
    }
  });
  const address = await listenOnSafePort(server);
  origin = `http://127.0.0.1:${address.port}`;
  return { origin, close: () => new Promise((resolve) => server.close(resolve)) };
}

async function verifyRedirect(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const page = await browser.newPage({ viewport });
      await page.route('**/*', (route) => {
        if (new URL(route.request().url()).origin === new URL(baseUrl).origin) return route.continue();
        return route.abort();
      });
      await page.goto(`${baseUrl}${OLD_PATH}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForURL((url) => url.pathname === TARGET_PATH, { timeout: 10000 });
      assert(new URL(page.url()).pathname === TARGET_PATH, `${viewport.width}px redirect target drifted: ${page.url()}`);
      assert((await page.locator('main a, main button').count()) > 0, `${viewport.width}px destination has no actions`);
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
      assert(overflow <= 0, `${viewport.width}px destination overflow: ${overflow}px`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

function verifyMutations() {
  const baseline = {
    html: read('index.html'),
    worker: read('sw.js'),
    catalog: fs.readFileSync(path.join(PORTAL, 'js', 'app-data.js'), 'utf8'),
    roster: fs.readFileSync(path.join(ROOT, 'scripts', 'verify-kpop-role-roster.js'), 'utf8'),
    files: currentFiles(),
  };
  const cases = [
    ['missing-noindex', { html: baseline.html.replace('noindex,follow', 'index,follow') }],
    ['wrong-target', { html: baseline.html.replaceAll(TARGET_PATH, '/portal/tests/') }],
    ['ad-loader-returned', { html: baseline.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['rating-returned', { html: baseline.html.replace('</main>', '<p>aggregateRating 4.5</p></main>') }],
    ['stale-app-returned', { files: [...baseline.files, 'js/app.js'].sort() }],
    ['cache-filter-broadened', { worker: baseline.worker.replace("name.startsWith('mbti-career')", 'name.length > 0') }],
    ['worker-stays-installed', { worker: baseline.worker.replace('await self.registration.unregister();', '') }],
    ['fetch-handler-returned', { worker: `${baseline.worker}\nself.addEventListener('fetch', () => {});` }],
    ['catalog-card-returned', { catalog: `${baseline.catalog}\nconst retired = 'mbti-career';` }],
    ['unrelated-catalog-count-drift', { roster: baseline.roster.replace('const CATALOG_COUNT = 43;', 'const CATALOG_COUNT = 42;') }],
    ['small-touch-target', { html: baseline.html.replace('min-height:44px', 'min-height:20px') }],
  ];
  for (const [name, override] of cases) {
    let detected = false;
    try { verifySource({ ...baseline, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(detected, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const urlIndex = process.argv.indexOf('--url');
  const productionUrl = urlIndex >= 0 ? process.argv[urlIndex + 1] : '';
  const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (productionUrl) {
    await verifyRedirect(productionUrl.replace(/\/$/, ''));
    console.log(`[PASS] MBTI Career production retirement: ${result.bytes} bytes, ${result.files} files -> ${result.target}`);
    return;
  }
  const server = await startServer();
  try { await verifyRedirect(server.origin); } finally { await server.close(); }
  console.log(`[PASS] MBTI Career local retirement: ${result.bytes} bytes, ${result.files} files -> ${result.target}`);
}

main().catch((error) => {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
});
