#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'idle-clicker');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const EVENTS = ['idle_view','idle_start','idle_progress','idle_share','idle_related_click'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'),
    css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'),
    sound: overrides.sound ?? read('js/sound-engine.js'),
    sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const interfaceSource = value.html + value.css + value.app;
  const allSource = interfaceSource + value.sound + value.sw + Object.values(value.locales).join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Idle Clicker suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(allSource), 'Active ad or rewarded-game code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded_ad|offline-btn-double|_showOfflineAd|Watch Ad|광고 보고 2배/i.test(allSource), 'Ad gate or doubled offline reward remains');
  assert(!/ad-banner|ad-placeholder|interstitial-overlay|premium-badge|cross-promo\.js/i.test(interfaceSource), 'Fake ad, premium, or generic promotion surface remains');
  assert(!/aggregateRating|ratingCount|page_engage|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof or synthetic telemetry remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve user zoom');
  assert(count(value.html, /data-related-slug=/g) === 5, 'Idle Clicker must keep exactly five attributable related routes');
  for (const eventName of EVENTS) assert(count(value.app, new RegExp(`['"]${eventName}['"]`, 'g')) === 1, `Stage event call count drifted: ${eventName}`);
  assert(/const trackedStages = new Set\(\)/.test(value.app) && /trackedStages\.has\(eventName\)/.test(value.app), 'Exact-once stage guard missing');
  assert(!/trackStage\('idle_(?:view|start|progress|share)'\s*,/.test(value.app), 'Private game value entered a core stage');
  assert(/const shareText = `\$\{gameTitle\} on DopaBrain`/.test(value.app) && /const shareUrl = 'https:\/\/dopabrain\.com\/idle-clicker\/'/.test(value.app), 'Share copy must remain neutral and canonical');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app) && /function trackSuccessfulShare/.test(value.app), 'Share must be success-gated');
  assert(/function showPremiumAnalysis\(\)[\s\S]{0,300}const rank =/.test(value.app), 'Free analysis must open without an ad gate');
  assert(!/claimOfflineEarnings\([^)]*(?:true|false)/.test(value.app) && !/claimGold\s*\*=\s*2/.test(value.app), 'Offline earnings must not have an ad multiplier');
  assert(count(value.sound, /const safeDuration = Math\.max\(0\.01/g) === 2 && /envelope\.sustain \?\? 0\.3/.test(value.sound), 'Audio envelopes must clamp short durations and preserve zero sustain');
  assert(/CACHE_NAME = 'idle-clicker-v5'/.test(value.sw), 'Idle Clicker cache version is stale');
  assert(/url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker origin or app-scope guard missing');
  assert(/response\.ok/.test(value.sw) && !/['"]\/index\.html['"]|['"]\/css\//.test(value.sw), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === '/idle-clicker/' && manifest.start_url === '/idle-clicker/', 'Manifest scope drifted');
  assert(Object.keys(value.locales).length === 12, 'Idle Clicker locale inventory drifted');
  for (const [lang, source] of Object.entries(value.locales)) {
    const locale = JSON.parse(source);
    assert(!locale.offline?.double, `${lang} retained an ad-reward label`);
  }
  return { locales:12, related:5, events:EVENTS.length };
}

async function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/idle-clicker/')) { base = APP; relative = pathname.slice(14) || 'index.html'; }
      else if (pathname.startsWith('/portal/')) { base = PORTAL; relative = pathname.slice(8); }
      else return response.writeHead(404).end();
      let target = path.resolve(base, relative);
      assert(target === base || target.startsWith(`${base}${path.sep}`), `Unsafe path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':`${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(fs.readFileSync(target));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  return { origin:`http://127.0.0.1:${address.port}`, close:()=>new Promise((resolve)=>server.close(resolve)) };
}

function stageEvents(rows) {
  return rows.filter((row) => row?.[0] === 'event' && EVENTS.includes(row[1])).map((row) => ({ name:row[1], params:row[2] || {} }));
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless:true });
  try {
    for (const viewport of [{ width:390, height:844 }, { width:1440, height:900 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'share', { configurable:true, value:async () => true });
      });
      await page.goto(`${baseUrl}/idle-clicker/?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.waitForSelector('#app-loader', { state:'detached', timeout:15000 });
      const clickTarget = await page.locator('#click-area').boundingBox();
      assert(clickTarget && clickTarget.width >= 44 && clickTarget.height >= 44, `${viewport.width}px game action below 44px`);
      await page.click('#click-area');
      await page.waitForTimeout(500);
      await page.locator('.equip-card').first().click();
      await page.locator('.premium-btn').click();
      await page.waitForSelector('#premium-content:not(.hidden)');
      await page.locator('#btn-share').click();
      await page.evaluate(() => document.querySelector('[data-related-slug]')?.addEventListener('click', (event) => event.preventDefault(), { once:true }));
      await page.locator('[data-related-slug] .rec-icon').first().click();
      const report = await page.evaluate(() => ({
        events:(window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets:['.premium-btn','#btn-share'].map((selector) => {
          const rect = document.querySelector(selector).getBoundingClientRect(); return { selector, width:rect.width, height:rect.height };
        }),
        adSurface:document.querySelectorAll('script[src*="pagead2"], script[src*="game-ads"], ins.adsbygoogle, [data-ad-slot], .ad-banner, .interstitial-overlay, .offline-btn-double').length,
        premiumHidden:document.getElementById('premium-content').classList.contains('hidden'),
      }));
      const stages = stageEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /score|gold|click|kill|stage|time|result|url|location/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0, `${viewport.width}px horizontal overflow: ${report.overflow}px`);
      assert(report.targets.every((target) => target.width >= 44 && target.height >= 44), `${viewport.width}px action below 44px: ${JSON.stringify(report.targets)}`);
      assert(report.adSurface === 0 && !report.premiumHidden && errors.length === 0, `${viewport.width}px runtime errors or ad gate: ${errors.join(' | ')}`);
      await page.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker-removed', { html:base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"','') }],
    ['loader-returned', { html:base.html.replace('</head>','<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward-returned', { app:`${base.app}\nGameAds.showRewarded({onReward: claimOfflineEarnings});` }],
    ['premium-ad-returned', { app:base.app.replace('function showPremiumAnalysis() {', 'async function showPremiumAnalysis() { await showInterstitial();') }],
    ['double-returned', { app:base.app.replace('let claimGold = data.gold;', 'let claimGold = data.gold; claimGold *= 2;') }],
    ['rating-returned', { html:base.html.replace('</body>','<div>aggregateRating 4.5</div></body>') }],
    ['synthetic-event', { app:`${base.app}\ngtag('event','page_engage');` }],
    ['private-progress', { app:base.app.replace("trackStage('idle_progress');", "trackStage('idle_progress', totalEarned);") }],
    ['premature-share', { app:base.app.replace('await navigator.share({ title: gameTitle, text: shareText, url: shareUrl });', 'navigator.share({ title: gameTitle, text: shareText, url: shareUrl });') }],
    ['zoom-disabled', { html:base.html.replace('initial-scale=1.0','initial-scale=1.0, user-scalable=no') }],
    ['related-removed', { html:base.html.replace('data-related-slug="emoji-merge"','') }],
    ['event-removed', { app:base.app.replace("trackStage('idle_start');", '') }],
    ['fake-surface', { html:base.html.replace('</body>','<div class="ad-banner">AD</div></body>') }],
    ['root-cache', { sw:base.sw.replace("'./index.html'", "'/index.html'") }],
    ['scope-guard-removed', { sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)','') }],
    ['success-guard-removed', { sw:base.sw.replace('if (response.ok)', 'if (response)') }],
    ['locale-reward-returned', { locales:{ ...base.locales, en:base.locales.en.replace('"collect":', '"double":"Watch Ad for 2x Earnings",\n        "collect":') } }],
    ['unsafe-audio-envelope', { sound:base.sound.replace('Math.max(0.01, Number(duration) || 0)', 'Math.min(0.01, Number(duration) || 0)') }],
  ];
  for (const [name, override] of cases) {
    let detected = false;
    try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(detected, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const urlAt = process.argv.indexOf('--url');
  const production = urlAt >= 0 ? process.argv[urlAt + 1].replace(/\/$/,'') : '';
  const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRuntime(production);
  else { const server = await startServer(); try { await verifyRuntime(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Idle Clicker suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} private stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
