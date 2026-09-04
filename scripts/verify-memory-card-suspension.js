#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'memory-card');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const EVENTS = ['memory_card_view','memory_card_start','memory_card_progress','memory_card_complete','memory_card_share','memory_card_related_click'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'),
    css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'),
    sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const productSource = value.html + value.css + value.app + value.sw + Object.values(value.locales).join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Memory Card suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(productSource), 'Active ad or rewarded-game code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded_ad|Watch Ad|injectRewardButton/i.test(productSource), 'Ad gate or rewarded score remains');
  assert(!/aggregateRating|ratingCount|page_engage|traffic_quality|timer_engagement|scroll_engagement|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof or synthetic telemetry remains');
  assert(!/DailyStreak|GameAchievements|daily-streak\.js|achievements\.js|cross-promo\.js/i.test(value.html + value.app), 'Unqualified retention or generic promotion code remains');
  assert(!/ad-container|ad-top|ad-bottom|shareTwitterBtn|shareUrlBtn|rec-section/i.test(value.html + value.css + value.app), 'Duplicate share, ad, or generic recommendation surface remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve user zoom');
  assert(count(value.html, /data-related-slug=/g) === 4, 'Memory Card must keep exactly four attributable related routes');
  for (const eventName of EVENTS) assert(count(value.app, new RegExp(`['"]${eventName}['"]`, 'g')) === 1, `Stage event call count drifted: ${eventName}`);
  assert(/const trackedStages = new Set\(\)/.test(value.app) && /trackedStages\.has\(eventName\)/.test(value.app), 'Exact-once stage guard missing');
  assert(!/trackStage\('memory_card_(?:view|start|progress|complete|share)'\s*,/.test(value.app), 'Private game value entered a core stage');
  assert(/const text = 'I played Memory Card Flip on DopaBrain\.'/i.test(value.app) && /const url = 'https:\/\/dopabrain\.com\/memory-card\/'/.test(value.app), 'Share copy must remain neutral and canonical');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share must wait for a successful action');
  assert(value.app.indexOf("trackStage('memory_card_share')") > value.app.indexOf('await navigator.share'), 'Share telemetry must follow success');
  assert(!/\.btn\s*\{[\s\S]{0,160}min-height:\s*40px/.test(value.css), 'Mobile button target regressed below 44px');
  assert(/CACHE_NAME = 'memory-card-v4'/.test(value.sw), 'Memory Card cache version is stale');
  assert(/url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker origin or app-scope guard missing');
  assert(/response\.ok/.test(value.sw) && !/['"]\/index\.html['"]|['"]\/css\//.test(value.sw), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === '/memory-card/' && manifest.start_url === '/memory-card/', 'Manifest scope drifted');
  assert(Object.keys(value.locales).length === 12, 'Memory Card locale inventory drifted');
  for (const [lang, source] of Object.entries(value.locales)) {
    const locale = JSON.parse(source);
    assert(locale.button?.share && !/[{}]/.test(locale.button.share), `${lang} share label is missing or result-rich`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 2500, 'README returned to an oversized operating manual');
  assert(/invalid-traffic review/i.test(value.readme) && /memory_card_view -> memory_card_start/.test(value.readme), 'README lost the suspension or analytics contract');
  assert(!/Ad Units|AdSense integration|Monetization Ready/i.test(value.readme), 'README restored a stale monetization claim');
  return { locales:12, related:4, events:EVENTS.length };
}

async function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/memory-card/')) { base = APP; relative = pathname.slice(13) || 'index.html'; }
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
      await page.addInitScript(() => Object.defineProperty(navigator, 'share', { configurable:true, value:async () => true }));
      await page.goto(`${baseUrl}/memory-card/?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.waitForFunction(() => document.getElementById('app-loader')?.classList.contains('hidden'), null, { timeout:15000 });
      const startTarget = await page.locator('#start-btn').boundingBox();
      assert(startTarget && startTarget.width >= 44 && startTarget.height >= 44, `${viewport.width}px start action below 44px`);
      await page.click('#start-btn');
      await page.waitForSelector('#game-screen.active .memory-card');
      await page.evaluate(() => {
        memoryCardGame.attempts = memoryCardGame.cards.length / 2;
        memoryCardGame.stageClear();
      });
      await page.waitForSelector('#stage-clear-screen.active');
      await page.waitForTimeout(500);
      const nextTarget = await page.locator('#next-stage-btn').boundingBox();
      assert(nextTarget && nextTarget.width >= 44 && nextTarget.height >= 44, `${viewport.width}px next-stage action below 44px: ${JSON.stringify(nextTarget)}`);
      await page.click('#next-stage-btn');
      await page.evaluate(() => memoryCardGame.quitGame());
      await page.waitForSelector('#game-over-screen.active');
      await page.click('#play-again-btn');
      await page.evaluate(() => memoryCardGame.quitGame());
      await page.click('#share-btn');
      await page.evaluate(() => document.querySelector('[data-related-slug]')?.addEventListener('click', (event) => event.preventDefault(), { once:true }));
      await page.locator('[data-related-slug] span').first().click();
      const report = await page.evaluate(() => ({
        events:(window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets:['#play-again-btn','#share-btn'].map((selector) => {
          const rect = document.querySelector(selector).getBoundingClientRect(); return { selector, width:rect.width, height:rect.height };
        }),
        adSurface:document.querySelectorAll('script[src*="pagead2"], script[src*="game-ads"], ins.adsbygoogle, [data-ad-slot], .ad-container').length,
        duplicateShare:document.querySelectorAll('#shareTwitterBtn,#shareUrlBtn').length,
      }));
      const stages = stageEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /theme|difficulty|card|score|stage|mode|duration|time|result|url|location/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0, `${viewport.width}px horizontal overflow: ${report.overflow}px`);
      assert(report.targets.every((target) => target.width >= 44 && target.height >= 44), `${viewport.width}px action below 44px: ${JSON.stringify(report.targets)}`);
      assert(report.adSurface === 0 && report.duplicateShare === 0 && errors.length === 0, `${viewport.width}px runtime errors or retired surface: ${errors.join(' | ')}`);
      await page.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker-removed', { html:base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"','') }],
    ['loader-returned', { html:base.html.replace('</head>','<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward-returned', { app:`${base.app}\nGameAds.injectRewardButton({label:'Watch Ad'});` }],
    ['rating-returned', { html:base.html.replace('</body>','<div>aggregateRating 4.5</div></body>') }],
    ['synthetic-event', { app:`${base.app}\ngtag('event','timer_engagement');` }],
    ['score-leak', { app:base.app.replace("trackStage('memory_card_complete');", "trackStage('memory_card_complete', this.score);") }],
    ['premature-share', { app:base.app.replace('await navigator.share({ title, text, url });', 'navigator.share({ title, text, url });') }],
    ['legacy-retention', { html:base.html.replace('</body>','<script src="/portal/js/achievements.js"></script></body>') }],
    ['zoom-disabled', { html:base.html.replace('initial-scale=1.0','initial-scale=1.0, user-scalable=no') }],
    ['related-removed', { html:base.html.replace('data-related-slug="color-memory"','') }],
    ['event-removed', { app:base.app.replace("trackStage('memory_card_progress');", '') }],
    ['duplicate-share-returned', { html:base.html.replace('</body>','<button id="shareTwitterBtn">Twitter</button></body>') }],
    ['root-cache', { sw:base.sw.replace("'./index.html'", "'/index.html'") }],
    ['scope-guard-removed', { sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)','') }],
    ['success-guard-removed', { sw:base.sw.replace('if (response.ok)', 'if (response)') }],
    ['small-mobile-button', { css:base.css.replace('font-size: 12px;\n        min-height: 44px;', 'font-size: 12px;\n        min-height: 40px;') }],
    ['readme-bloat-returned', { readme:base.readme + 'x'.repeat(2500) }],
    ['stale-monetization-claim', { readme:base.readme + '\nAd Units: AdSense integration' }],
    ['wrong-share-route', { app:base.app.replace('https://dopabrain.com/memory-card/', 'https://dopabrain.com/games/memory/') }],
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
  console.log(`[PASS] Memory Card suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} private stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
