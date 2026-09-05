#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const RETIRED = path.join(ROOT, 'projects', 'seollal-fortune');
const GREETINGS = path.join(ROOT, 'projects', 'seollal-greetings', 'index.html');
const TARGET = path.join(ROOT, 'projects', 'fortune-cookie');
const OLD_ROUTE = '/seollal-fortune/';
const TARGET_ROUTE = '/fortune-cookie/';

function assert(value, message) {
  if (!value) throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function verifySource(overrides = {}) {
  const retired = overrides.retired ?? read(path.join(RETIRED, 'index.html'));
  const greetings = overrides.greetings ?? read(GREETINGS);
  const worker = overrides.worker ?? read(path.join(RETIRED, 'sw.js'));
  const portalSitemap = overrides.portalSitemap ?? read(path.join(ROOT, 'projects', 'portal', 'sitemap.xml'));
  const blogSitemap = overrides.blogSitemap ?? read(path.join(ROOT, 'projects', 'portal', 'blog', 'sitemap.xml'));

  assert(Buffer.byteLength(retired) <= 900, 'Retired stub is too large: ' + Buffer.byteLength(retired) + ' bytes');
  assert(/<title>Redirecting\.\.\.<\/title>/i.test(retired), 'Retired route title must identify a redirect');
  assert(/data-product-status="retired-2026-09-05"/.test(retired), 'Retired route status marker missing');
  assert(/<meta\s+name="robots"\s+content="noindex,follow">/i.test(retired), 'Retired route must be noindex,follow');
  assert(/http-equiv="refresh"\s+content="0; url=https:\/\/dopabrain\.com\/fortune-cookie\/"/i.test(retired), 'Refresh target drifted');
  assert(/rel="canonical"\s+href="https:\/\/dopabrain\.com\/fortune-cookie\/"/i.test(retired), 'Canonical target drifted');
  assert(/window\.location\.replace\("https:\/\/dopabrain\.com\/fortune-cookie\/"\)/.test(retired), 'Script target drifted');
  assert(/<a\s+href="https:\/\/dopabrain\.com\/fortune-cookie\/"/i.test(retired), 'Fallback target drifted');
  assert(!/googletagmanager|gtag\s*\(|adsbygoogle|ad-loader|application\/ld\+json|aggregateRating|serviceWorker/i.test(retired), 'Retired route contains ads, analytics, schema, or worker code');
  assert(/key\.startsWith\(RETIRED_PREFIX\)/.test(worker), 'Retirement worker cache boundary drifted');
  assert(!/caches\.keys\(\).*filter\(\(key\)\s*=>\s*key\s*!==/s.test(worker), 'Retirement worker can delete unrelated caches');
  assert(/client\.navigate\(TARGET\)/.test(worker) && /registration\.unregister\(\)/.test(worker), 'Retirement worker does not move clients and unregister');
  assert(!/respondWith|caches\.open|cache\.put|cache\.add/i.test(worker), 'Retirement worker can still serve or create cache content');
  assert(!greetings.includes(OLD_ROUTE), 'Seollal Greetings still promotes the retired route');
  assert((greetings.match(/href="\/zodiac-match\/"/g) || []).length === 1, 'Seollal Greetings replacement route drifted');
  assert(!portalSitemap.includes(OLD_ROUTE) && !blogSitemap.includes(OLD_ROUTE), 'Retired route entered a submitted sitemap');
  return { bytes: Buffer.byteLength(retired), target: TARGET_ROUTE };
}

function verifyMutations() {
  const baseline = {
    retired: read(path.join(RETIRED, 'index.html')),
    greetings: read(GREETINGS),
    worker: read(path.join(RETIRED, 'sw.js')),
    portalSitemap: read(path.join(ROOT, 'projects', 'portal', 'sitemap.xml')),
    blogSitemap: read(path.join(ROOT, 'projects', 'portal', 'blog', 'sitemap.xml')),
  };
  const cases = [
    ['missing-noindex', { retired: baseline.retired.replace('noindex,follow', 'index,follow') }],
    ['missing-status', { retired: baseline.retired.replace(' data-product-status="retired-2026-09-05"', '') }],
    ['wrong-target', { retired: baseline.retired.replaceAll('/fortune-cookie/', '/daily-tarot/') }],
    ['ad-loader-returned', { retired: baseline.retired.replace('</head>', '<script src="/portal/js/ad-loader.js"></script></head>') }],
    ['analytics-returned', { retired: baseline.retired.replace('</head>', '<script>gtag("event","page_view")</script></head>') }],
    ['broad-cache-delete', { worker: baseline.worker.replace('key.startsWith(RETIRED_PREFIX)', 'key !== RETIRED_PREFIX') }],
    ['fetch-handler-returned', { worker: baseline.worker + '\nself.addEventListener("fetch", event => event.respondWith(fetch(event.request)));' }],
    ['unregister-removed', { worker: baseline.worker.replace('await self.registration.unregister();', '') }],
    ['large-content-returned', { retired: baseline.retired + 'x'.repeat(1000) }],
    ['related-link-returned', { greetings: baseline.greetings.replace('/zodiac-match/', OLD_ROUTE) }],
    ['replacement-duplicated', { greetings: baseline.greetings + '\n<a href="/zodiac-match/">duplicate</a>' }],
    ['sitemap-returned', { portalSitemap: baseline.portalSitemap + '\n' + OLD_ROUTE }],
  ];
  for (const [name, mutation] of cases) {
    let detected = false;
    try {
      verifySource({ ...baseline, ...mutation });
    } catch (error) {
      detected = true;
      console.log('[PASS] ' + name + ': ' + error.message);
    }
    assert(detected, 'Mutation escaped: ' + name);
  }
  console.log('[PASS] mutation summary ' + cases.length + '/' + cases.length + ' detected');
}

async function startServer() {
  let origin = '';
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base;
      let relative;
      if (pathname.startsWith(OLD_ROUTE)) {
        base = RETIRED;
        relative = pathname.slice(OLD_ROUTE.length) || 'index.html';
      } else if (pathname.startsWith(TARGET_ROUTE)) {
        base = TARGET;
        relative = pathname.slice(TARGET_ROUTE.length) || 'index.html';
      } else {
        response.writeHead(404).end();
        return;
      }
      let file = path.resolve(base, relative);
      assert(file === base || file.startsWith(base + path.sep), 'Unsafe request path: ' + pathname);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        response.writeHead(404).end();
        return;
      }
      let body = fs.readFileSync(file);
      if (pathname.startsWith(OLD_ROUTE)) body = Buffer.from(body.toString('utf8').replaceAll('https://dopabrain.com', origin));
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      response.end(body);
    } catch (error) {
      response.writeHead(400).end(error.message);
    }
  });
  const address = await listenOnSafePort(server);
  origin = 'http://127.0.0.1:' + address.port;
  return { origin, close: () => new Promise((resolve) => server.close(resolve)) };
}

async function verifyRedirect(origin) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(origin + OLD_ROUTE, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForURL((url) => url.pathname === TARGET_ROUTE, { timeout: 10000 });
      assert(new URL(page.url()).pathname === TARGET_ROUTE, viewport.width + 'px redirect target drifted');
      assert(errors.length === 0, viewport.width + 'px runtime error: ' + errors.join('; '));
      const layout = await page.evaluate(() => ({
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        actions: document.querySelectorAll('a,button').length,
      }));
      assert(layout.overflow <= 0, viewport.width + 'px destination overflow: ' + layout.overflow + 'px');
      assert(layout.actions > 0, viewport.width + 'px destination has no action');
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  const urlIndex = process.argv.indexOf('--url');
  if (urlIndex >= 0) {
    await verifyRedirect(process.argv[urlIndex + 1].replace(/\/$/, ''));
    console.log('[PASS] Seollal retirement production: ' + result.bytes + ' bytes -> ' + result.target);
    return;
  }
  const server = await startServer();
  try {
    await verifyRedirect(server.origin);
  } finally {
    await server.close();
  }
  console.log('[PASS] Seollal retirement local: ' + result.bytes + ' bytes -> ' + result.target);
}

main().catch((error) => {
  console.error('[FAIL] ' + error.message);
  process.exitCode = 1;
});
