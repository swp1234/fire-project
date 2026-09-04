#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'flappy-bird');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const EVENTS = ['flappy_view','flappy_start','flappy_complete','flappy_share','flappy_related_click'];
const MIN_RENDERED_TARGET = 43.99;

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
  const interfaceSource = value.html + value.css + value.app;
  const productSource = interfaceSource + value.sw + Object.values(value.locales).join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Flappy suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(productSource), 'Active ad or rewarded-game code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded_ad|Watch Ad|2x Score.*Ad/i.test(productSource), 'Ad gate or rewarded action remains');
  assert(!/aggregateRating|ratingCount|page_engage|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof or synthetic telemetry remains');
  assert(!/DailyStreak|GameAchievements|daily-streak\.js|achievements\.js|cross-promo\.js/i.test(value.html + value.app), 'Unqualified retention or generic promotion code remains');
  assert(!/ad-container|ad-placeholder|ad-interstitial/i.test(interfaceSource), 'Manual or fake ad surface remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve user zoom');
  assert(count(value.html, /data-related-slug=/g) === 7, 'Flappy must keep exactly seven attributable related routes');
  for (const eventName of EVENTS) assert(count(value.app, new RegExp(`['"]${eventName}['"]`, 'g')) === 1, `Stage event call count drifted: ${eventName}`);
  assert(/const trackedStages = new Set\(\)/.test(value.app) && /trackedStages\.has\(eventName\)/.test(value.app), 'Exact-once stage guard missing');
  assert(!/trackStage\('flappy_(?:view|start|complete|share)'\s*,/.test(value.app), 'Private game value entered a core stage');
  assert(/const text = 'I played Sky Flap on DopaBrain\.'/i.test(value.app) && /const url = 'https:\/\/dopabrain\.com\/flappy-bird\/'/.test(value.app), 'Share copy must remain neutral and canonical');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share must wait for a successful action');
  assert(value.app.indexOf("trackStage('flappy_share')") > value.app.indexOf('await navigator.share'), 'Share telemetry must follow success');
  assert(/CACHE_NAME = 'flappy-bird-v9'/.test(value.sw), 'Flappy cache version is stale');
  assert(/url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker origin or app-scope guard missing');
  assert(/response\.ok/.test(value.sw) && !/['"]\/index\.html['"]|['"]\/css\//.test(value.sw), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === '/flappy-bird/' && manifest.start_url === '/flappy-bird/', 'Manifest scope drifted');
  assert(manifest.shortcuts?.[0]?.url === '/flappy-bird/?action=play', 'Manifest shortcut escaped the app path');
  assert(Object.keys(value.locales).length === 12, 'Flappy locale inventory drifted');
  for (const [lang, source] of Object.entries(value.locales)) {
    const locale = JSON.parse(source);
    assert(locale.game?.share && !/score|result|점수|skor|puan|punkt|punkte|puntuaci[oó]n|pontua[cç][aã]o|сч[её]т/i.test(locale.game.share), `${lang} share label still promises result sharing`);
    assert(!locale.game?.shareText && locale.game?.scoreCopied && !/[{}]/.test(locale.game.scoreCopied), `${lang} locale retained result-rich share copy`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 2500, 'README returned to an oversized operating manual');
  assert(/invalid-traffic review/i.test(value.readme) && /flappy_view -> flappy_start -> flappy_complete/.test(value.readme), 'README lost the suspension or analytics contract');
  assert(!/Monetization Ready|Automatic ad triggers|AdSense integration/i.test(value.readme), 'README restored a stale monetization claim');
  return { locales:12, related:7, events:EVENTS.length };
}

async function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/flappy-bird/')) { base = APP; relative = pathname.slice(13) || 'index.html'; }
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
      await page.goto(`${baseUrl}/flappy-bird/?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.waitForSelector('#app-loader', { state:'detached', timeout:15000 });
      const startTarget = await page.locator('#start-btn').boundingBox();
      assert(startTarget && startTarget.width >= MIN_RENDERED_TARGET && startTarget.height >= MIN_RENDERED_TARGET, `${viewport.width}px start action below 44px`);
      await page.click('#start-btn');
      await page.evaluate(() => game.gameOver());
      await page.waitForSelector('#gameover-screen.active');
      await page.click('#restart-btn');
      await page.evaluate(() => game.gameOver());
      await page.click('#share-btn');
      await page.evaluate(() => document.querySelector('[data-related-slug]')?.addEventListener('click', (event) => event.preventDefault(), { once:true }));
      await page.locator('[data-related-slug] .related-name').first().click();
      const report = await page.evaluate(() => ({
        events:(window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        wide:[...document.querySelectorAll('body *')].map((element) => {
          const rect = element.getBoundingClientRect();
          return { tag:element.tagName, id:element.id, className:typeof element.className === 'string' ? element.className : '', left:rect.left, right:rect.right, width:rect.width };
        }).filter((rect) => rect.left < -0.5 || rect.right > innerWidth + 0.5).slice(0, 8),
        targets:['#restart-btn','#share-btn'].map((selector) => {
          const rect = document.querySelector(selector).getBoundingClientRect(); return { selector, width:rect.width, height:rect.height };
        }),
        adSurface:document.querySelectorAll('script[src*="pagead2"], script[src*="game-ads"], ins.adsbygoogle, [data-ad-slot], .ad-container, .ad-interstitial').length,
        reward:/Watch Ad|Rewarded/i.test(document.body.innerText),
      }));
      const stages = stageEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /score|mode|duration|time|result|url|location/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0, `${viewport.width}px horizontal overflow: ${report.overflow}px; ${JSON.stringify(report.wide)}`);
      assert(report.targets.every((target) => target.width >= MIN_RENDERED_TARGET && target.height >= MIN_RENDERED_TARGET), `${viewport.width}px action below 44px: ${JSON.stringify(report.targets)}`);
      assert(report.adSurface === 0 && !report.reward && errors.length === 0, `${viewport.width}px runtime errors or ad surface: ${errors.join(' | ')}`);
      await page.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker-removed', { html:base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"','') }],
    ['loader-returned', { html:base.html.replace('</head>','<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward-returned', { app:`${base.app}\nGameAds.showRewarded({label:'Watch Ad for 2x Score'});` }],
    ['rating-returned', { html:base.html.replace('</body>','<div>aggregateRating 4.6</div></body>') }],
    ['synthetic-event', { app:`${base.app}\ngtag('event','page_engage');` }],
    ['score-leak', { app:base.app.replace("trackStage('flappy_complete');", "trackStage('flappy_complete', this.score);") }],
    ['premature-share', { app:base.app.replace("await navigator.share({ title: 'Sky Flap', text, url });", "navigator.share({ title: 'Sky Flap', text, url });") }],
    ['legacy-retention', { html:base.html.replace('</body>','<script src="/portal/js/daily-streak.js"></script></body>') }],
    ['zoom-disabled', { html:base.html.replace('initial-scale=1.0','initial-scale=1.0, user-scalable=no') }],
    ['related-removed', { html:base.html.replace('data-related-slug="stack-tower"','') }],
    ['event-removed', { app:base.app.replace("trackStage('flappy_start');", '') }],
    ['root-cache', { sw:base.sw.replace("'./index.html'", "'/index.html'") }],
    ['scope-guard-removed', { sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)','') }],
    ['success-guard-removed', { sw:base.sw.replace('if (response.ok)', 'if (response)') }],
    ['locale-score-returned', { locales:{ ...base.locales, en:base.locales.en.replace('Share Game','Share Score') } }],
    ['readme-bloat-returned', { readme:base.readme + 'x'.repeat(2500) }],
    ['stale-monetization-claim', { readme:base.readme + '\nMonetization Ready: Automatic ad triggers' }],
    ['wrong-share-route', { app:base.app.replace('https://dopabrain.com/flappy-bird/', 'https://dopabrain.com/games/sky-flap/') }],
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
  console.log(`[PASS] Flappy suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} private stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
