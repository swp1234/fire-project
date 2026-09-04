#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const OLD_PATH = '/portal/blog/2026-online-games-trend.html';
const TARGET_PATH = '/portal/games/';
const FILES = {
  retired: 'blog/2026-online-games-trend.html',
  catalog: 'blog/index.html',
  emoji: 'blog/emoji-merge-guide-2026.html',
  de: 'blog/de/browserspiele-2026.html',
  hi: 'blog/hi/browser-games-2026.html',
};

function assert(value, message) {
  if (!value) throw new Error(message);
}

function source(overrides, key) {
  return overrides[key] ?? fs.readFileSync(path.join(PORTAL, FILES[key]), 'utf8');
}

function verifySource(overrides = {}) {
  const retired = source(overrides, 'retired');
  const catalog = source(overrides, 'catalog');
  const emoji = source(overrides, 'emoji');
  const de = source(overrides, 'de');
  const hi = source(overrides, 'hi');

  assert(Buffer.byteLength(retired) <= 900, `Retired stub is too large: ${Buffer.byteLength(retired)} bytes`);
  assert(/<html\s+lang=["']ko["']/i.test(retired), 'Retired stub language must be Korean');
  assert(/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(retired), 'Retired stub must be noindex,follow');
  assert(new RegExp(`<meta\\s+http-equiv=["']refresh["']\\s+content=["']0; url=https://dopabrain\\.com${TARGET_PATH}["']`, 'i').test(retired), 'Retired stub refresh target drifted');
  assert(new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']https://dopabrain\\.com${TARGET_PATH}["']`, 'i').test(retired), 'Retired stub canonical target drifted');
  assert(new RegExp(`window\\.location\\.replace\\(["']https://dopabrain\\.com${TARGET_PATH}["']\\)`, 'i').test(retired), 'Retired stub script target drifted');
  assert(new RegExp(`<a\\s+href=["']https://dopabrain\\.com${TARGET_PATH}["']`, 'i').test(retired), 'Retired stub fallback target drifted');
  assert(!/googletagmanager|adsbygoogle|ad-loader|application\/ld\+json|aggregateRating/i.test(retired), 'Retired stub contains analytics, ads, or schema');
  assert(!catalog.includes(OLD_PATH), 'Retired article remains in the blog catalog');
  assert(!emoji.includes(OLD_PATH) && /href=["']\/portal\/games\/["'][^>]*class=["']related-card["']/.test(emoji), 'Emoji guide retains the retired related route');
  assert(!de.includes(OLD_PATH) && !hi.includes(OLD_PATH), 'Retired Korean page remains in hreflang');

  return { bytes: Buffer.byteLength(retired), target: TARGET_PATH };
}

async function startServer() {
  let origin = '';
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
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
        const url = new URL(route.request().url());
        if (url.origin === new URL(baseUrl).origin) return route.continue();
        return route.abort();
      });
      await page.goto(`${baseUrl}${OLD_PATH}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForURL((url) => url.pathname === TARGET_PATH, { timeout: 10000 });
      assert(new URL(page.url()).pathname === TARGET_PATH, `${viewport.width}px redirect target drifted: ${page.url()}`);
      assert((await page.locator('main a, main button, [role="main"] a, [role="main"] button').count()) > 0, `${viewport.width}px destination has no actions`);
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
      assert(overflow <= 0, `${viewport.width}px destination overflow: ${overflow}px`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

function verifyMutations() {
  const baseline = Object.fromEntries(Object.keys(FILES).map((key) => [key, source({}, key)]));
  const cases = [
    ['missing-noindex', { retired: baseline.retired.replace('noindex,follow', 'index,follow') }],
    ['wrong-target', { retired: baseline.retired.replaceAll('/portal/games/', '/portal/tests/') }],
    ['ad-loader-returned', { retired: baseline.retired.replace('</head>', '<script src="/portal/js/ad-loader.js"></script></head>') }],
    ['catalog-entry-returned', { catalog: `${baseline.catalog}\n${OLD_PATH}` }],
    ['related-link-returned', { emoji: baseline.emoji.replace('/portal/games/', OLD_PATH) }],
    ['hreflang-returned', { de: `${baseline.de}\n${OLD_PATH}` }],
    ['large-content-returned', { retired: `${baseline.retired}${'x'.repeat(1000)}` }],
  ];
  for (const [name, overrides] of cases) {
    let detected = false;
    try { verifySource({ ...baseline, ...overrides }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
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
    console.log(`[PASS] retired game trend production redirect: ${result.bytes} bytes -> ${result.target}`);
    return;
  }
  const server = await startServer();
  try { await verifyRedirect(server.origin); } finally { await server.close(); }
  console.log(`[PASS] retired game trend local redirect: ${result.bytes} bytes -> ${result.target}`);
}

main().catch((error) => {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
});
