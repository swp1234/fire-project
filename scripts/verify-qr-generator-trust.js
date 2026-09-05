#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'qr-generator');
const GENERATOR = path.join(ROOT, 'scripts', 'generate-utility-apps.js');
const LOCALES = ['de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh'];
const assert = (value, message) => { if (!value) throw new Error(message); };
const read = (file) => fs.readFileSync(file, 'utf8');
const count = (source, pattern) => (source.match(pattern) || []).length;

function baseline() {
  return {
    html: read(path.join(APP, 'index.html')),
    app: read(path.join(APP, 'js', 'app.js')),
    worker: read(path.join(APP, 'sw.js')),
    readme: read(path.join(APP, 'README.md')),
    generator: read(GENERATOR),
    locales: Object.fromEntries(LOCALES.map((locale) => [locale, read(path.join(APP, 'js', 'locales', `${locale}.json`))])),
  };
}

function verifySource(input = baseline()) {
  const { html, app, worker, readme, generator, locales } = input;
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(html), 'Incident suspension marker missing');
  assert(/data-release-contract="qr-generator-trust-2026-09-05"/.test(html), 'Release contract missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|data-ad-client/.test(html), 'Active or manual ad code conflicts with suspension');
  assert(!/aggregateRating|social-proof|3[,. ]456|page_engage/.test(html), 'Fabricated proof or synthetic engagement remains');
  assert(/Inputs stay in this tab and are not sent in analytics/.test(html), 'Visible privacy boundary missing');
  assert(count(html, /googletagmanager\.com\/gtag\/js/g) === 1, 'GA4 loader count drifted');
  for (const event of ['qr_generator_start', 'qr_generator_generate', 'qr_generator_download']) {
    assert(count(app, new RegExp(`trackEvent\\('${event}'`, 'g')) === 1, `Event call drifted: ${event}`);
  }
  assert(!/input_type|data_size|qr_size|page_location|event_label/.test(app), 'Private or high-cardinality telemetry returned');
  assert(!/localStorage\.(?:getItem|setItem)\(['"]qr-history/.test(app), 'QR payload history is persisted');
  assert(/await navigator\.share/.test(html) && /await navigator\.clipboard\.writeText/.test(html), 'Share success gate missing');
  assert(/const url = 'https:\/\/dopabrain\.com\/qr-generator\/'/.test(html), 'Share URL is not neutral and canonical');
  assert(!/encodeURIComponent\(window\.location\.href\)/.test(html), 'Social share can leak query data');
  assert(count(html, /gtag\('event', 'qr_generator_share'/g) === 1, 'Share event call drifted');
  assert(/const CACHE_NAME = 'qr-generator-v3'/.test(worker), 'Service-worker release version drifted');
  assert(/cacheName\.startsWith\('qr-generator'\)/.test(worker), 'Cache deletion is not product-scoped');
  assert(/url\.origin !== location\.origin/.test(worker), 'Cross-origin request guard missing');
  assert(count(worker, /response\.ok/g) >= 2, 'Successful-response cache guard missing');
  assert(!/['"]\/qr-generator\//.test(worker), 'Service-worker assets must remain app-relative');
  assert(!/addEventListener\(['"]sync/.test(worker), 'Unused background sync returned');
  assert(Object.keys(locales).length === 12, 'Locale inventory drifted');
  for (const [locale, source] of Object.entries(locales)) {
    JSON.parse(source);
    assert(!/"users"\s*:|3[,. ]456/.test(source), `${locale} fabricated counter returned`);
  }
  assert(Buffer.byteLength(readme) <= 1100, 'README exceeds compact contract budget');
  assert(!/TODO|roadmap|restore ads|enable ads/i.test(readme), 'README restored stale roadmap');
  assert(!/pagead2|adsbygoogle/.test(generator), 'Utility generator can restore active ads');
  assert(/<body data-ad-serving="suspended-invalid-traffic-2026-09-03">/.test(generator), 'Generated utility suspension marker missing');
  return { locales: Object.keys(locales).length, events: 4, readmeBytes: Buffer.byteLength(readme) };
}

function mutations() {
  const source = baseline();
  const cases = [
    ['marker', { html: source.html.replace('suspended-invalid-traffic-2026-09-03', 'active') }],
    ['ad', { html: source.html.replace('</head>', '<ins class="adsbygoogle"></ins></head>') }],
    ['rating', { html: source.html.replace('"featureList"', '"aggregateRating":{"ratingValue":"5"},"featureList"') }],
    ['proof', { html: source.html.replace('</header>', '<p>3,456 codes today</p></header>') }],
    ['privacy', { html: source.html.replace('Inputs stay in this tab and are not sent in analytics.', 'Fast and private.') }],
    ['private-event', { app: source.app.replace("release: '2026-09-05'", 'data_size: data.length') }],
    ['event', { app: source.app.replace("trackEvent('qr_generator_generate')", "trackEvent('generate_qr')") }],
    ['history', { app: source.app.replace('loadHistory() {', "loadHistory() { localStorage.getItem('qr-history');") }],
    ['share', { html: source.html.replace('await navigator.share({ title, url })', 'navigator.share({ title, url })') }],
    ['share-query', { html: source.html.replace("encodeURIComponent('https://dopabrain.com/qr-generator/')", 'encodeURIComponent(window.location.href)') }],
    ['cache', { worker: source.worker.replace("cacheName.startsWith('qr-generator')", 'cacheName.length > 0') }],
    ['cross-origin', { worker: source.worker.replace('if (url.origin !== location.origin)', 'if (false)') }],
    ['cache-success', { worker: source.worker.replaceAll('response.ok', 'response') }],
    ['sync', { worker: `${source.worker}\nself.addEventListener('sync',()=>{});` }],
    ['locale-proof', { locales: { ...source.locales, en: source.locales.en.replace('"preview":', '"header":{"users":"3,456"},"preview":') } }],
    ['readme', { readme: `${source.readme}${'x'.repeat(1200)}` }],
    ['generator-ad', { generator: source.generator.replace('<meta name="robots"', '<script src="https://pagead2.googlesyndication.com/x.js"></script>\n  <meta name="robots"') }],
    ['generator-marker', { generator: source.generator.replace('suspended-invalid-traffic-2026-09-03', 'active') }],
  ];
  for (const [name, override] of cases) {
    let caught = false;
    try { verifySource({ ...source, ...override }); } catch (error) { caught = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(caught, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function localServer() {
  const instance = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      if (!pathname.startsWith('/qr-generator/')) return response.writeHead(404).end();
      let file = path.resolve(APP, pathname.slice('/qr-generator/'.length) || 'index.html');
      assert(file === APP || file.startsWith(`${APP}${path.sep}`), `Unsafe path: ${pathname}`);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) return response.writeHead(404).end();
      const extension = path.extname(file);
      const type = extension === '.css' ? 'text/css' : extension === '.js' ? 'application/javascript' : extension === '.json' ? 'application/json' : extension === '.svg' ? 'image/svg+xml' : 'text/html; charset=utf-8';
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': type });
      response.end(fs.readFileSync(file));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(instance);
  return { origin: `http://127.0.0.1:${address.port}`, close: () => new Promise((resolve) => instance.close(resolve)) };
}

async function runtime(origin) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, acceptDownloads: true });
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
      await page.goto(`${origin}/qr-generator/?lang=en`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForFunction(() => window.qrGenerator && document.querySelector('#app-loader.hidden'), null, { timeout: 10000 });
      await page.locator('#url-input').fill('https://example.com/private-value');
      await page.waitForTimeout(1000);
      const download = page.waitForEvent('download');
      await page.locator('#download-btn').click();
      await download;
      const result = await page.evaluate(() => ({
        events: (window.dataLayer || []).map((row) => Array.from(row)).filter((row) => row[0] === 'event').map((row) => ({ name: row[1], params: row[2] })),
        ads: document.querySelectorAll('ins.adsbygoogle,[data-ad-slot],[data-ad-client]').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        history: localStorage.getItem('qr-history'),
        target: (() => { const r = document.querySelector('#download-btn').getBoundingClientRect(); return [r.width, r.height]; })(),
      }));
      for (const event of ['qr_generator_start', 'qr_generator_generate', 'qr_generator_download']) assert(result.events.filter((row) => row.name === event).length === 1, `${width}px ${event} is not exact-once`);
      assert(result.events.every((row) => !/private-value/.test(JSON.stringify(row))), `${width}px private input leaked`);
      assert(result.ads === 0 && result.history === null, `${width}px ad or persisted history returned`);
      assert(result.overflow <= 0, `${width}px horizontal overflow: ${result.overflow}px`);
      assert(result.target[0] >= 44 && result.target[1] >= 44, `${width}px download target is below 44px`);
      await page.close();
    }
  } finally { await browser.close(); }
}

async function productionParity(origin) {
  const files = ['index.html', 'js/app.js', 'sw.js', ...LOCALES.map((locale) => `js/locales/${locale}.json`)];
  await Promise.all(files.map(async (file) => {
    const result = spawnSync('git', ['cat-file', 'blob', `origin/master:${file}`], { cwd: APP });
    assert(result.status === 0, `Cannot read deployed Git blob: ${file}`);
    const response = await fetch(`${origin}/qr-generator/${file === 'index.html' ? '' : file}?trust-verify=20260905`, { cache: 'no-store' });
    assert(response.status === 200, `Production returned ${response.status}: ${file}`);
    assert(Buffer.from(await response.arrayBuffer()).equals(result.stdout), `Production bytes differ from origin/master: ${file}`);
  }));
  console.log(`[PASS] Production byte parity: ${files.length}/${files.length} files`);
}

async function main() {
  const result = verifySource();
  if (process.argv.includes('--mutations')) mutations();
  const index = process.argv.indexOf('--url');
  if (index >= 0) {
    const origin = process.argv[index + 1].replace(/\/$/, '');
    await productionParity(origin);
    await runtime(origin);
    console.log(`[PASS] QR Generator trust production: ${JSON.stringify(result)}`);
    return;
  }
  const local = await localServer();
  try { await runtime(local.origin); } finally { await local.close(); }
  console.log(`[PASS] QR Generator trust local: ${JSON.stringify(result)}`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
