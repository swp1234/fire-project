#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'maze-runner');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const EVENTS = ['maze_runner_view','maze_runner_start','maze_runner_progress','maze_runner_complete','maze_runner_share','maze_runner_related_click'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'),
    css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'),
    errors: overrides.errors ?? read('js/error-handler.js'),
    i18n: overrides.i18n ?? read('js/i18n.js'),
    sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const productSource = [value.html, value.css, value.app, value.errors, value.i18n, value.sw, ...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Maze Runner suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(productSource), 'Active ad or rewarded-game code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded_ad|Watch Ad|injectRewardButton/i.test(value.html + value.app), 'Ad gate or rewarded life remains');
  assert(!/aggregateRating|ratingCount|page_engage|traffic_quality|timer_engagement|scroll_engagement|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof or synthetic telemetry remains');
  assert(!/DailyStreak|GameAchievements|daily-streak\.js|achievements\.js|cross-promo\.js|pwa-install\.js/i.test(value.html + value.app), 'Unqualified retention or generic promotion code remains');
  assert(!/share-float|class="related-games"/i.test(value.html), 'Duplicate share or generic recommendation surface remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve user zoom');
  assert(count(value.html, /data-related-slug=/g) === 4, 'Maze Runner must keep exactly four attributable related routes');
  for (const eventName of EVENTS) assert(count(value.app, new RegExp(`['"]${eventName}['"]`, 'g')) === 1, `Stage event call count drifted: ${eventName}`);
  assert(/const mazeTrackedStages = new Set\(\)/.test(value.app) && /mazeTrackedStages\.has\(eventName\)/.test(value.app), 'Exact-once stage guard missing');
  assert(!/trackMazeStage\('maze_runner_(?:view|start|progress|complete|share)'\s*,/.test(value.app), 'Private game value entered a core stage');
  assert(/const text = 'I played Maze Runner on DopaBrain\.'/i.test(value.app) && /const url = 'https:\/\/dopabrain\.com\/maze-runner\/'/.test(value.app), 'Share copy must remain neutral and canonical');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share must wait for a successful action');
  assert(value.app.indexOf("trackMazeStage('maze_runner_share')") > value.app.indexOf('await navigator.share'), 'Share telemetry must follow success');
  assert(/if \(!\(event\.error instanceof Error\)\) return/.test(value.errors), 'Resource-load errors can pollute the exception signal');
  assert(!/gtag\s*\(\s*['"]event['"]\s*,\s*['"]exception['"]/.test(value.errors), 'Raw exception telemetry remains');
  assert(/element\.tagName === 'INPUT'\) \{[\s\S]{0,100}element\.value = translation;[\s\S]{0,100}else \{[\s\S]{0,100}element\.textContent = translation;/.test(value.i18n), 'Button locale text update contract regressed');
  assert(count(value.i18n + value.app, /i18n\.init\(\)/g) === 1, 'i18n initialization must have exactly one owner');
  assert(/CACHE_NAME = 'maze-runner-v8'/.test(value.sw), 'Maze Runner cache version is stale');
  assert(/url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker origin or app-scope guard missing');
  assert(/response\.ok/.test(value.sw) && !/['"]\/index\.html['"]|['"]\/css\//.test(value.sw), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === '/maze-runner/' && manifest.start_url === '/maze-runner/', 'Manifest scope drifted');
  assert(Object.keys(value.locales).length === 12, 'Maze Runner locale inventory drifted');
  for (const [lang, source] of Object.entries(value.locales)) {
    const locale = JSON.parse(source);
    assert(locale.game?.shareScore && !/score|puan|分数|점수|スコア|स्कोर|skor/i.test(locale.game.shareScore), `${lang} share label remains result-rich`);
  }
  assert(!['assets/goal.png','assets/player.png','og-image.jpg','og-image.svg'].some((file) => fs.existsSync(path.join(APP, file))), 'Unused duplicate media returned');
  assert(Buffer.byteLength(value.readme, 'utf8') < 2500, 'README returned to an oversized operating manual');
  assert(/invalid-traffic review/i.test(value.readme) && /maze_runner_view -> maze_runner_start/.test(value.readme), 'README lost the suspension or analytics contract');
  assert(!/Monetization Features|AdSense banner ads/i.test(value.readme), 'README restored a stale monetization claim');
  return { locales:12, related:4, events:EVENTS.length };
}

async function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/maze-runner/')) { base = APP; relative = pathname.slice(13) || 'index.html'; }
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
      await page.goto(`${baseUrl}/maze-runner/?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.waitForFunction(() => !document.getElementById('app-loader'), null, { timeout:15000 });
      assert(await page.locator('#startBtn').textContent() === 'Start Game', `${viewport.width}px English button translation failed`);
      await page.click('#lang-toggle');
      await page.click('[data-lang="ko"]');
      await page.waitForFunction(() => document.getElementById('startBtn')?.textContent?.trim() === '게임 시작');
      const startTarget = await page.locator('#startBtn').boundingBox();
      assert(startTarget && startTarget.width >= 44 && startTarget.height >= 44, `${viewport.width}px start action below 44px`);
      await page.click('#startBtn');
      await page.waitForSelector('#gameScreen.active');
      await page.evaluate(() => mazeRunnerGame.levelComplete());
      await page.waitForSelector('#levelCompleteScreen.active');
      await page.click('#nextLevelBtn');
      await page.waitForSelector('#gameScreen.active');
      await page.evaluate(() => mazeRunnerGame.gameOver());
      await page.waitForSelector('#gameOverScreen.active');
      await page.click('#retryBtn');
      await page.evaluate(() => mazeRunnerGame.gameOver());
      await page.click('#share-score-btn');
      await page.evaluate(() => document.querySelector('[data-related-slug]')?.addEventListener('click', (event) => event.preventDefault(), { once:true }));
      await page.locator('[data-related-slug] span').first().click();
      await page.waitForTimeout(300);
      const report = await page.evaluate(() => ({
        events:(window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        overflowers:Array.from(document.querySelectorAll('body *')).map((element) => {
          const rect = element.getBoundingClientRect();
          return { tag:element.tagName, id:element.id, className:typeof element.className === 'string' ? element.className : '', left:rect.left, right:rect.right, width:rect.width };
        }).filter((rect) => rect.left < -0.5 || rect.right > innerWidth + 0.5).slice(0, 12),
        targets:['#retryBtn','#share-score-btn'].map((selector) => {
          const rect = document.querySelector(selector).getBoundingClientRect(); return { selector, width:rect.width, height:rect.height };
        }),
        adSurface:document.querySelectorAll('script[src*="pagead2"], script[src*="game-ads"], ins.adsbygoogle, [data-ad-slot], .ad-container').length,
        rewardSurface:Array.from(document.querySelectorAll('button')).filter((button) => /watch ad|reward/i.test(button.textContent)).length,
        duplicateShare:document.querySelectorAll('#share-float').length,
        notification:document.querySelectorAll('#error-notification').length,
      }));
      const stages = stageEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /mode|stage|path|score|duration|time|result|error|description|url|location/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0, `${viewport.width}px horizontal overflow: ${report.overflow}px ${JSON.stringify(report.overflowers)}`);
      assert(report.targets.every((target) => target.width >= 44 && target.height >= 44), `${viewport.width}px action below 44px: ${JSON.stringify(report.targets)}`);
      assert(report.adSurface === 0 && report.rewardSurface === 0 && report.duplicateShare === 0, `${viewport.width}px retired ad/share surface returned`);
      assert(report.notification === 0 && errors.length === 0, `${viewport.width}px runtime errors: ${errors.join(' | ')}`);
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
    ['rating-returned', { html:base.html.replace('</body>','<div>aggregateRating 4.4</div></body>') }],
    ['synthetic-event', { app:`${base.app}\ngtag('event','page_engage');` }],
    ['private-value-leak', { app:base.app.replace("trackMazeStage('maze_runner_progress');", "trackMazeStage('maze_runner_progress', this.stage);") }],
    ['premature-share', { app:base.app.replace('await navigator.share({ title:', 'navigator.share({ title:') }],
    ['legacy-retention', { html:base.html.replace('</body>','<script src="/portal/js/achievements.js"></script></body>') }],
    ['zoom-disabled', { html:base.html.replace('initial-scale=1.0','initial-scale=1.0, user-scalable=no') }],
    ['related-removed', { html:base.html.replace('data-related-slug="snake-game"','') }],
    ['event-removed', { app:base.app.replace("trackMazeStage('maze_runner_progress');", '') }],
    ['duplicate-share-returned', { html:base.html.replace('</body>','<div id="share-float"></div></body>') }],
    ['resource-error-noise', { errors:base.errors.replace('if (!(event.error instanceof Error)) return;', '') }],
    ['exception-telemetry', { errors:`${base.errors}\ngtag('event', 'exception');` }],
    ['button-translation-regressed', { i18n:base.i18n.replace("element.tagName === 'INPUT'", "element.tagName === 'INPUT' || element.tagName === 'BUTTON'") }],
    ['duplicate-i18n-init', { i18n:`${base.i18n}\ni18n.init();` }],
    ['root-cache', { sw:base.sw.replace("'./index.html'", "'/index.html'") }],
    ['scope-guard-removed', { sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)','') }],
    ['success-guard-removed', { sw:base.sw.replace('if (response.ok)', 'if (response)') }],
    ['readme-bloat-returned', { readme:base.readme + 'x'.repeat(2500) }],
    ['stale-monetization-claim', { readme:base.readme + '\nMonetization Features: AdSense banner ads' }],
    ['result-share-label', { locales:{ ...base.locales, en:base.locales.en.replace('Share Game', 'Share Score') } }],
    ['wrong-share-route', { app:base.app.replace('https://dopabrain.com/maze-runner/', 'https://dopabrain.com/games/maze/') }],
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
  console.log(`[PASS] Maze Runner suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} private stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
