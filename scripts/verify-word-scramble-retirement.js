#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'word-scramble');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const OLD_PATH = '/word-scramble/';
const TARGET_PATH = '/word-guess/';
const GUIDE_PATH = '/portal/blog/en/word-scramble-game-guide.html';
const GUIDE_TARGET = '/portal/blog/en/word-guess-wordle-guide.html';
const ALLOWED_FILES = ['.gitattributes', 'README.md', 'index.html', 'sw.js'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function currentFiles(directory = APP, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git') return [];
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? currentFiles(path.join(directory, entry.name), relative) : [relative];
  }).sort();
}
function portalSources() {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(?:html|js)$/.test(entry.name) && file !== path.join(PORTAL, 'blog', 'en', 'word-scramble-game-guide.html')) files.push(file);
    }
  };
  visit(PORTAL);
  return files.map((file) => read(file)).join('\n');
}

function fixture() {
  return {
    html: read(path.join(APP, 'index.html')),
    worker: read(path.join(APP, 'sw.js')),
    guide: read(path.join(PORTAL, 'blog', 'en', 'word-scramble-game-guide.html')),
    portal: portalSources(),
    games: read(path.join(PORTAL, 'games', 'index.html')),
    files: currentFiles(),
  };
}

function verifySource(overrides = {}) {
  const value = { ...fixture(), ...overrides };
  assert(JSON.stringify(value.files) === JSON.stringify(ALLOWED_FILES), `Retired repository footprint drifted: ${value.files.join(', ')}`);
  assert(Buffer.byteLength(value.html) <= 1800, `Retired stub is too large: ${Buffer.byteLength(value.html)} bytes`);
  assert(/name="robots" content="noindex,follow"/.test(value.html), 'Retired route must be noindex,follow');
  assert(value.html.includes(`content="1; url=https://dopabrain.com${TARGET_PATH}"`), 'Refresh target drifted');
  assert(value.html.includes(`rel="canonical" href="https://dopabrain.com${TARGET_PATH}"`), 'Canonical target drifted');
  assert(value.html.includes(`const target = 'https://dopabrain.com${TARGET_PATH}'`) && /location\.replace\(target\)/.test(value.html), 'Script redirect target drifted');
  assert(value.html.includes(`<a href="https://dopabrain.com${TARGET_PATH}">`), 'Fallback target drifted');
  assert(/min-height:44px/.test(value.html), 'Fallback action must retain a 44px touch target');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Incident suspension marker missing');
  assert(!/pagead2|adsbygoogle|googletagmanager|application\/ld\+json|aggregateRating|GameAds|premium/i.test(value.html), 'Retired stub contains ad, analytics, schema, or premium code');

  assert(/addEventListener\('install'/.test(value.worker) && /skipWaiting\(\)/.test(value.worker), 'Worker install cleanup contract missing');
  assert(/addEventListener\('activate'/.test(value.worker), 'Worker activate cleanup contract missing');
  assert(/startsWith\('word-scramble'\)/.test(value.worker) && /caches\.delete\(name\)/.test(value.worker), 'Old caches are not narrowly removed');
  assert(/registration\.unregister\(\)/.test(value.worker), 'Retired worker must unregister');
  assert(!/addEventListener\(['"](?:fetch|push|sync|notificationclick)/.test(value.worker), 'Retired worker retains runtime interception');

  assert(Buffer.byteLength(value.guide) <= 900, `Retired guide stub is too large: ${Buffer.byteLength(value.guide)} bytes`);
  assert(/name="robots" content="noindex,follow"/.test(value.guide), 'Retired guide must be noindex,follow');
  assert(value.guide.includes(`content="0; url=https://dopabrain.com${GUIDE_TARGET}"`) && value.guide.includes(`rel="canonical" href="https://dopabrain.com${GUIDE_TARGET}"`), 'Guide redirect target drifted');
  assert(value.guide.includes(`window.location.replace('https://dopabrain.com${GUIDE_TARGET}')`), 'Guide script target drifted');
  assert(!/googletagmanager|adsbygoogle|ad-loader|application\/ld\+json|aggregateRating/i.test(value.guide), 'Retired guide contains analytics, ads, or schema');
  assert(!value.portal.includes(OLD_PATH), 'Portal still promotes the retired route');
  assert(!value.portal.includes("id: 'word-scramble'") && !value.portal.includes('data-app="word-scramble"'), 'Portal catalog still contains the retired product');
  assert(!value.portal.includes("'word-scramble':") && !value.portal.includes("'word-scramble-game-guide.html'"), 'Planner or blog catalog still contains the retired product');
  assert(!value.games.includes('https://dopabrain.com/word-scramble/'), 'Games schema still contains the retired product');
  const positions = [...value.games.matchAll(/"@type":"ListItem","position":(\d+),"url":"https:\/\/dopabrain\.com\/[^"]+\/","name":"[^"]+"/g)].map((match) => Number(match[1]));
  assert(positions.length === 20 && positions.every((position, index) => position === index + 1), `Games schema positions drifted: ${positions.join(',')}`);
  return { bytes: Buffer.byteLength(value.html), guideBytes: Buffer.byteLength(value.guide), files: value.files.length };
}

async function startServer() {
  let origin = '';
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith(OLD_PATH)) { base = APP; relative = pathname.slice(OLD_PATH.length) || 'index.html'; }
      else if (pathname.startsWith(TARGET_PATH)) { base = path.join(ROOT, 'projects', 'word-guess'); relative = pathname.slice(TARGET_PATH.length) || 'index.html'; }
      else if (pathname.startsWith('/portal/')) { base = PORTAL; relative = pathname.slice('/portal/'.length) || 'index.html'; }
      else return response.writeHead(404).end();
      let target = path.resolve(base, relative);
      assert(target === base || target.startsWith(`${base}${path.sep}`), `Unsafe request path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      let body = read(target);
      if (pathname === OLD_PATH || pathname === GUIDE_PATH) body = body.replaceAll('https://dopabrain.com', origin);
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
      response.end(body);
    } catch (error) { response.writeHead(400).end(error.message); }
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
      await page.goto(`${baseUrl}${OLD_PATH}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForURL((url) => url.pathname === TARGET_PATH, { timeout: 10000 });
      assert((await page.locator('button, a').count()) > 0, `${viewport.width}px Word Guess has no action`);
      await page.goto(`${baseUrl}${GUIDE_PATH}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForURL((url) => url.pathname === GUIDE_TARGET, { timeout: 10000 });
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
      assert(overflow <= 0, `${viewport.width}px destination overflow: ${overflow}px`);
      await page.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['missing-noindex', { html: base.html.replace('noindex,follow', 'index,follow') }],
    ['wrong-target', { html: base.html.replaceAll(TARGET_PATH, '/portal/games/') }],
    ['ad-returned', { html: base.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['stale-app-returned', { files: [...base.files, 'js/app.js'].sort() }],
    ['cache-filter-broadened', { worker: base.worker.replace("name.startsWith('word-scramble')", 'name.length > 0') }],
    ['worker-stays-installed', { worker: base.worker.replace('await self.registration.unregister();', '') }],
    ['fetch-returned', { worker: `${base.worker}\nself.addEventListener('fetch', () => {});` }],
    ['portal-card-returned', { portal: `${base.portal}\n<a href="/word-scramble/" data-app="word-scramble">Word Scramble</a>` }],
    ['planner-returned', { portal: `${base.portal}\nconst game = {'word-scramble':{}};` }],
    ['guide-noindex-removed', { guide: base.guide.replace('noindex,follow', 'index,follow') }],
    ['guide-target-drifted', { guide: base.guide.replaceAll(GUIDE_TARGET, '/portal/games/') }],
    ['games-schema-returned', { games: `${base.games}\nhttps://dopabrain.com/word-scramble/` }],
    ['small-touch-target', { html: base.html.replace('min-height:44px', 'min-height:20px') }],
  ];
  for (const [name, override] of cases) {
    let detected = false;
    try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(detected, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const urlIndex = process.argv.indexOf('--url');
  const productionUrl = urlIndex >= 0 ? process.argv[urlIndex + 1].replace(/\/$/, '') : '';
  const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (productionUrl) await verifyRedirect(productionUrl);
  else { const server = await startServer(); try { await verifyRedirect(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Word Scramble retirement: ${result.bytes} byte app, ${result.guideBytes} byte guide, ${result.files} files -> Word Guess`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
