#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'brainrot-score');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const DETOX = path.join(ROOT, 'projects', 'detox-timer');
const APP_PATH = '/brainrot-score/';
const APP_TARGET = '/detox-timer/';
const ARTICLE_PATH = '/portal/blog/en/brainrot-score-test-2026.html';
const ARTICLE_TARGET = '/portal/blog/en/doom-scrolling-mental-health-effects.html';
const ALLOWED_FILES = ['.gitattributes', 'README.md', 'index.html', 'sw.js'];

function assert(value, message) {
  if (!value) throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function files(directory = APP, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git') return [];
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? files(path.join(directory, entry.name), relative) : [relative];
  }).sort();
}

function portalSources() {
  const result = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(?:html|js|xml)$/.test(entry.name)) result.push([file, read(file)]);
    }
  };
  visit(PORTAL);
  return result;
}

function verifySource(overrides = {}) {
  const html = overrides.html ?? read(path.join(APP, 'index.html'));
  const worker = overrides.worker ?? read(path.join(APP, 'sw.js'));
  const article = overrides.article ?? read(path.join(PORTAL, 'blog', 'en', 'brainrot-score-test-2026.html'));
  const inventory = overrides.files ?? files();
  const sources = overrides.sources ?? portalSources();

  assert(JSON.stringify(inventory) === JSON.stringify(ALLOWED_FILES), `Retired footprint drifted: ${inventory.join(', ')}`);
  assert(Buffer.byteLength(html) <= 1600, `Retired app stub is too large: ${Buffer.byteLength(html)} bytes`);
  assert(/name="robots" content="noindex,follow"/.test(html), 'Retired app must be noindex,follow');
  assert(html.includes(`content="1; url=https://dopabrain.com${APP_TARGET}"`), 'App refresh target drifted');
  assert(html.includes(`href="https://dopabrain.com${APP_TARGET}"`), 'App fallback/canonical target drifted');
  assert(html.includes(`const target = 'https://dopabrain.com${APP_TARGET}'`), 'App script target drifted');
  assert(/data-product-status="retired-2026-09-05"/.test(html), 'Retirement marker missing');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(html), 'Incident marker missing');
  assert(!/googletagmanager|pagead2|adsbygoogle|application\/ld\+json|aggregateRating|ratingCount|page_engage/i.test(html), 'Retired app contains ads, analytics, schema, or fake proof');

  assert(/startsWith\('brainrot-score'\)/.test(worker) && /caches\.delete\(name\)/.test(worker), 'Old caches are not narrowly removed');
  assert(/registration\.unregister\(\)/.test(worker), 'Retired worker must unregister');
  assert(!/addEventListener\(['"](?:fetch|push|sync|notificationclick)/.test(worker), 'Retired worker intercepts runtime traffic');

  assert(Buffer.byteLength(article) <= 1000, `Retired article stub is too large: ${Buffer.byteLength(article)} bytes`);
  assert(/name="robots" content="noindex,follow" data-indexing-focus="2026-08-29"/.test(article), 'Retired article must preserve its focus noindex marker');
  assert(article.includes(`content="0; url=https://dopabrain.com${ARTICLE_TARGET}"`), 'Article refresh target drifted');
  assert(article.includes(`location.replace('https://dopabrain.com${ARTICLE_TARGET}')`), 'Article script target drifted');
  assert(!/googletagmanager|pagead2|adsbygoogle|application\/ld\+json|FAQPage|aggregateRating/i.test(article), 'Retired article contains ads, analytics, schema, or FAQ');

  const stale = sources.filter(([file, source]) => file !== path.join(PORTAL, 'blog', 'en', 'brainrot-score-test-2026.html') && /\/brainrot-score\/|brainrot-score-test-2026|appId:\s*['"]brainrot-score/i.test(source));
  assert(stale.length === 0, `Portal still promotes retired content: ${stale.map(([file]) => path.relative(PORTAL, file)).join(', ')}`);
  return { appBytes: Buffer.byteLength(html), articleBytes: Buffer.byteLength(article), files: inventory.length };
}

function mutations() {
  const baseline = {
    html: read(path.join(APP, 'index.html')),
    worker: read(path.join(APP, 'sw.js')),
    article: read(path.join(PORTAL, 'blog', 'en', 'brainrot-score-test-2026.html')),
    files: files(),
    sources: portalSources(),
  };
  const cases = [
    ['app-noindex', { html: baseline.html.replace('noindex,follow', 'index,follow') }],
    ['app-target', { html: baseline.html.replaceAll(APP_TARGET, '/social-battery/') }],
    ['ad-returned', { html: baseline.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/x.js"></script></head>') }],
    ['proof-returned', { html: baseline.html.replace('</main>', '<p>aggregateRating 4.3</p></main>') }],
    ['bundle-returned', { files: [...baseline.files, 'js/app.js'].sort() }],
    ['cache-broadened', { worker: baseline.worker.replace("name.startsWith('brainrot-score')", 'name.length > 0') }],
    ['worker-stays', { worker: baseline.worker.replace('await self.registration.unregister();', '') }],
    ['article-target', { article: baseline.article.replaceAll(ARTICLE_TARGET, '/portal/blog/en/ai-job-anxiety-2026.html') }],
    ['article-schema', { article: baseline.article.replace('</head>', '<script type="application/ld+json">{}</script></head>') }],
    ['portal-reference', { sources: [...baseline.sources, [path.join(PORTAL, 'fake.html'), '<a href="/brainrot-score/">old</a>']] }],
  ];
  for (const [name, override] of cases) {
    let caught = false;
    try { verifySource({ ...baseline, ...override }); } catch (error) { caught = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(caught, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function server() {
  let origin = '';
  const roots = [[APP_PATH, APP], ['/detox-timer/', DETOX], ['/portal/', PORTAL]];
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
      if (pathname === APP_PATH || pathname === ARTICLE_PATH) body = Buffer.from(body.toString('utf8').replaceAll('https://dopabrain.com', origin));
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
      response.end(body);
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(instance);
  origin = `http://127.0.0.1:${address.port}`;
  return { origin, close: () => new Promise((resolve) => instance.close(resolve)) };
}

async function redirects(origin) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [source, target] of [[APP_PATH, APP_TARGET], [ARTICLE_PATH, ARTICLE_TARGET]]) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
      await page.goto(`${origin}${source}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForURL((url) => url.pathname === target, { timeout: 10000 });
      assert((await page.locator('main a, main button, [role="main"] a, [role="main"] button').count()) > 0, `${target} has no action`);
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
      assert(overflow <= 0, `${target} mobile overflow: ${overflow}px`);
      await page.close();
    }
  } finally { await browser.close(); }
}

async function main() {
  const result = verifySource();
  if (process.argv.includes('--mutations')) mutations();
  const urlIndex = process.argv.indexOf('--url');
  if (urlIndex >= 0) {
    await redirects(process.argv[urlIndex + 1].replace(/\/$/, ''));
    console.log(`[PASS] Brainrot retirement production: ${result.appBytes}+${result.articleBytes} bytes, ${result.files} app files`);
    return;
  }
  const local = await server();
  try { await redirects(local.origin); } finally { await local.close(); }
  console.log(`[PASS] Brainrot retirement local: ${result.appBytes}+${result.articleBytes} bytes, ${result.files} app files`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
