#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'daily-tarot');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const PORTAL = path.join(ROOT, 'projects', 'portal');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function load() {
  return {
    app: fs.readFileSync(path.join(APP, 'js', 'app.js'), 'utf8'),
    html: fs.readFileSync(path.join(APP, 'index.html'), 'utf8'),
    manifest: fs.readFileSync(path.join(APP, 'manifest.json'), 'utf8'),
    readme: fs.readFileSync(path.join(APP, 'README.md'), 'utf8'),
    locales: Object.fromEntries(LOCALES.map((locale) => [
      locale,
      fs.readFileSync(path.join(APP, 'js', 'locales', `${locale}.json`), 'utf8'),
    ])),
  };
}

function verify(source) {
  const joined = [source.html, source.app, source.manifest, source.readme, ...Object.values(source.locales)].join('\n');
  assert((source.html.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) || []).length === 1, 'Auto Ads loader must exist exactly once');
  assert(!/<ins\b[^>]*adsbygoogle/i.test(source.html), 'Manual adsbygoogle unit is forbidden');
  assert(!/data-ad-slot|data-ad-surface|adsbygoogle[\s\S]{0,100}\.push\s*\(/i.test(`${source.html}\n${source.app}`), 'Manual ad slot, surface, or push is forbidden');
  assert(!/_ad_impression\b/.test(source.app), 'Synthetic ad impression telemetry is forbidden');
  assert(!/aggregateRating|ratingCount|54,000\+|social-proof-badge/i.test(source.html), 'Fabricated rating or social proof is forbidden');
  assert(!/interstitial-ad|ad-placeholder|showInterstitialAd|watch an ad|광고 시청/i.test(joined), 'Fake ad gate or placeholder is forbidden');
  assert(!/\bAI\b|人工智能|인공지능/i.test(joined), 'Unsupported AI claim is forbidden');
  assert(source.app.includes("this.track('daily_tarot_reflection_view'"), 'Reflection view telemetry is missing');
  assert(!source.app.includes('loadResultAd'), 'Legacy result ad path is forbidden');

  const schemas = Array.from(source.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)).map((match) => JSON.parse(match[1]));
  assert(schemas.some((schema) => schema['@type'] === 'WebApplication'), 'WebApplication schema is missing');
  for (const locale of LOCALES) {
    const data = JSON.parse(source.locales[locale]);
    assert(data.premium?.badge && data.premium?.title && data.premium?.deepReading, `${locale}: reflection copy is missing`);
    assert(!data.ads, `${locale}: dead fake-ad copy remains`);
    assert(!data.engage?.proof, `${locale}: dead social-proof copy remains`);
  }
}

function runMutations(baseline) {
  const mutations = [
    ['aggregate-rating', 'Fabricated rating', (s) => ({ ...s, html: s.html.replace('</head>', '<script type="application/ld+json">{"@type":"AggregateRating","ratingCount":2800}</script></head>') })],
    ['manual-slot', 'Manual adsbygoogle unit', (s) => ({ ...s, html: s.html.replace('</main>', '<ins class="adsbygoogle" data-ad-slot="auto"></ins></main>') })],
    ['fake-impression', 'Synthetic ad impression', (s) => ({ ...s, app: `${s.app}\ngtag('event','daily_tarot_result_ad_impression');` })],
    ['fake-social-proof', 'Fabricated rating', (s) => ({ ...s, html: s.html.replace('</main>', '<div class="social-proof-badge">54,000+ readings today</div></main>') })],
    ['fake-ad-gate', 'Fake ad gate', (s) => ({ ...s, app: `${s.app}\nfunction showInterstitialAd(){}` })],
    ['ai-claim', 'Unsupported AI claim', (s) => ({ ...s, manifest: s.manifest.replace('guided daily reflection', 'AI deep analysis') })],
  ];
  for (const [name, expected, mutate] of mutations) {
    try {
      verify(mutate(baseline));
      throw new Error(`${name}: verifier incorrectly passed`);
    } catch (error) {
      assert(error.message.includes(expected), `${name}: wrong failure: ${error.message}`);
      console.log(`[PASS] mutation ${name}: ${error.message}`);
    }
  }
  console.log(`Mutation summary: ${mutations.length}/${mutations.length} detected`);
}

function contentType(file) {
  const extension = path.extname(file).toLowerCase();
  return ({ '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' })[extension] || 'application/octet-stream';
}

async function runRuntime({ production = false } = {}) {
  const server = production ? null : http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
    let base = APP;
    let relative = pathname.replace(/^\/daily-tarot\/?/, '') || 'index.html';
    if (pathname.startsWith('/portal/')) {
      base = PORTAL;
      relative = pathname.slice('/portal/'.length);
    }
    const target = path.resolve(base, relative);
    if (!target.startsWith(`${base}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': contentType(target) });
    fs.createReadStream(target).pipe(response);
  });
  const address = server ? await listenOnSafePort(server) : null;
  const origin = production ? 'https://dopabrain.com' : `http://127.0.0.1:${address.port}`;
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route(/^https?:\/\//, (route) => {
      const hostname = new URL(route.request().url()).hostname;
      const allowed = hostname === '127.0.0.1' || hostname === 'dopabrain.com' || hostname === 'www.dopabrain.com';
      return allowed ? route.continue() : route.abort();
    });
    const cacheBust = production ? `&deploy=${Date.now()}` : '';
    const response = await page.goto(`${origin}/daily-tarot/?lang=es&start=1&autoDraw=1&surface=verify_daily_tarot${cacheBust}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), 'Daily Tarot runtime document failed to load');
    await page.locator('#reading-result').waitFor({ state: 'visible', timeout: 8000 });
    assert(await page.locator('ins.adsbygoogle,[data-ad-slot],[data-ad-surface],#interstitial-ad').count() === 0, 'Runtime rendered a fake or manual ad surface');
    const button = await page.locator('#deep-reading-btn').boundingBox();
    assert(button && button.width >= 44 && button.height >= 44, 'Reflection button violates the 44px target');
    await page.locator('#deep-reading-btn').click();
    await page.locator('#premium-section').waitFor({ state: 'visible' });
    assert((await page.locator('#reflection-patterns').textContent())?.trim(), 'Guided reflection did not render');
    const events = await page.evaluate(() => (window.dataLayer || []).filter((item) => item && item[0] === 'event').map((item) => item[1]));
    assert(events.filter((name) => name === 'daily_tarot_reflection_view').length === 1, 'Reflection view event must fire exactly once');
    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - innerWidth));
    assert(overflow === 0, `Mobile horizontal overflow: ${overflow}px`);
    assert(errors.length === 0, `Daily Tarot runtime errors: ${errors.join(' | ')}`);
    await context.close();
    console.log(`[PASS] Daily Tarot ${production ? 'production ' : ''}runtime: ES auto draw -> guided reflection, 44px, no fake ads, exact-once event`);
  } finally {
    await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  const source = load();
  verify(source);
  console.log(`[PASS] Daily Tarot trust + Auto Ads contract: locales=${LOCALES.length}`);
  if (process.argv.includes('--mutations')) runMutations(source);
  await runRuntime({ production: process.argv.includes('--production') });
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
