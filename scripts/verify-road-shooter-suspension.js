#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'road-shooter');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const EVENTS = ['road_shooter_view','road_shooter_start','road_shooter_progress','road_shooter_complete'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'),
    css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'),
    i18n: overrides.i18n ?? read('js/i18n.js'),
    run: overrides.run ?? read('js/scenes/run.js'),
    result: overrides.result ?? read('js/scenes/result.js'),
    endless: overrides.endless ?? read('js/scenes/endless.js'),
    sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const source = [value.html,value.css,value.app,value.i18n,value.run,value.result,value.endless,value.sw,...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Road Shooter suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(source), 'Active ad or game-ad code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded_ad|ad_2x_gold|Watch Ad|rewardBtn/i.test(source), 'Interstitial or rewarded-gold path remains');
  assert(!/aggregateRating|ratingCount|page_engage|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof or synthetic telemetry remains');
  assert(!/cross-promo|cp-section|class="related-games"/i.test(value.html + value.css), 'Inaccessible promotion surface or hiding rule remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve user zoom');
  assert(count(value.app, /trackRoadShooterStage\('road_shooter_view'\)/g) === 1, 'View event call drifted');
  assert(count(value.app, /trackRoadShooterStage\('road_shooter_progress'\)/g) === 1, 'Progress event call drifted');
  assert(count(value.app, /trackRoadShooterStage\('road_shooter_start'\)/g) === 2, 'Start events must cover stage and endless branches');
  assert(count(value.app, /trackRoadShooterStage\('road_shooter_complete'\)/g) === 2, 'Complete events must cover stage and endless branches');
  assert(/const roadShooterStages = new Set\(\)/.test(value.app) && /roadShooterStages\.has\(name\)/.test(value.app), 'Exact-once funnel guard missing');
  assert(!/trackRoadShooterStage\('road_shooter_(?:view|start|progress|complete)'\s*,/.test(value.app), 'Private game value entered a funnel event');
  const urlIndex = value.app.indexOf('ROAD_SHOOTER_LOCALES.includes(requestedLang)');
  const savedIndex = value.app.indexOf('ROAD_SHOOTER_LOCALES.includes(this.saveData.settings.language)');
  assert(/const requestedLang = new URLSearchParams\(window\.location\.search\)\.get\('lang'\)/.test(value.app) && urlIndex >= 0 && savedIndex > urlIndex && /navigator\.language \|\| 'en'/.test(value.app), 'Game locale priority must be URL, saved, browser, then English');
  assert(/const requested = new URLSearchParams\(window\.location\.search\)\.get\('lang'\)/.test(value.i18n) && value.i18n.indexOf('supported.includes(requested)') < value.i18n.indexOf('supported.includes(saved)'), 'Document locale no longer gives URL priority');
  assert(/const descriptions = \{/.test(value.i18n) && /const titles = \{/.test(value.i18n) && /document\.title = titles\[lang\]/.test(value.i18n), 'Localized metadata contract missing');
  assert(!/�/.test(value.i18n), 'Localized metadata contains a replacement character');
  assert(/CACHE_NAME = 'road-shooter-v9'/.test(value.sw), 'Road Shooter cache version is stale');
  assert(/key\.startsWith\(CACHE_PREFIX\)/.test(value.sw), 'Service worker can delete another product cache');
  assert(/event\.request\.method !== 'GET'/.test(value.sw) && /url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker request boundary missing');
  const assetBlock = value.sw.match(/const ASSETS = \[([\s\S]*?)\];/)?.[1] || '';
  assert(/response\.ok/.test(value.sw) && !/['"]\/road-shooter\//.test(assetBlock), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === './' && manifest.start_url === './', 'Manifest must remain deployment-relative');
  assert(Object.keys(value.locales).length === 12, 'Road Shooter locale inventory drifted');
  for (const [lang, text] of Object.entries(value.locales)) {
    const locale = JSON.parse(text);
    assert(!Object.prototype.hasOwnProperty.call(locale, 'ad_2x_gold'), `${lang} rewarded-ad label returned`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 1800, 'README returned to an oversized roadmap');
  assert(/invalid-traffic restriction/i.test(value.readme) && /road_shooter_view/.test(value.readme), 'README lost the restriction or funnel contract');
  assert(!fs.existsSync(path.join(APP, 'REDESIGN-ROADMAP.md')), 'Stale redesign roadmap returned');
  return { locales: LOCALES.length, events: EVENTS.length };
}

async function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.mp3':'audio/mpeg' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/road-shooter/')) { base = APP; relative = pathname.slice(14) || 'index.html'; }
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

function funnelEvents(rows) {
  return rows.filter((row) => row?.[0] === 'event' && EVENTS.includes(row[1])).map((row) => ({ name:row[1], params:row[2] || {} }));
}

async function clickCanvasButton(page, button) {
  const canvas = await page.locator('#gameCanvas').boundingBox();
  assert(canvas && button, 'Canvas action is unavailable');
  await page.mouse.click(
    canvas.x + (button.x + button.w / 2) * canvas.width / 400,
    canvas.y + (button.y + button.h / 2) * canvas.height / 700,
  );
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless:true });
  try {
    for (const viewport of [{ width:390, height:844 }, { width:1440, height:900 }]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.addInitScript(() => localStorage.setItem('roadShooter_save', JSON.stringify({
        version:1, daily:{day:0,completed:false,progress:0}, progress:{maxStage:0,stars:{},difficulty:'normal',endlessHighWave:0,endlessHighScore:0},
        upgrades:{startSquad:0,baseDamage:0,baseHP:0,moveSpeed:0,magnetRange:0,goldBonus:0}, currency:{gold:0,starCoin:0}, achievements:{},
        skin:{equipped:'default',owned:[]}, stats:{totalRuns:0,totalKills:0,maxSquadSize:0,bossesDefeated:0,totalGoldEarned:0}, settings:{sound:false,music:false,language:'ko'},
      })));
      await page.goto(`${baseUrl}/road-shooter/?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.waitForFunction(() => window.game?.scene instanceof MenuScene && game.scene.startBtn, null, { timeout:15000 });
      const locale = await page.evaluate(() => ({ document:document.documentElement.lang, game:game.lang, label:game.i18n('menu_start') }));
      assert(locale.document === 'en' && locale.game === 'en' && locale.label === 'START', `${viewport.width}px URL language did not override saved Korean: ${JSON.stringify(locale)}`);
      const tutorialButton = await page.evaluate(() => game.scene.showTutorial && game.scene.tutorialBtn);
      assert(tutorialButton, `${viewport.width}px first-run tutorial action missing`);
      await clickCanvasButton(page, tutorialButton);
      await page.waitForFunction(() => game.scene instanceof MenuScene && !game.scene.showTutorial);
      const startButton = await page.evaluate(() => game.scene.startBtn);
      await clickCanvasButton(page, startButton);
      await page.waitForFunction(() => game.scene instanceof RunScene);
      const canvas = await page.locator('#gameCanvas').boundingBox();
      assert(canvas, `${viewport.width}px canvas missing`);
      await page.mouse.move(canvas.x + canvas.width / 2, canvas.y + canvas.height * 0.75);
      await page.mouse.down();
      await page.mouse.move(canvas.x + canvas.width * 0.6, canvas.y + canvas.height * 0.75);
      await page.mouse.up();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'road_shooter_progress'));
      await page.evaluate(() => game.scene.endRun(false));
      await page.waitForFunction(() => game.scene instanceof ResultScene, null, { timeout:5000 });
      await page.waitForFunction(() => game.scene.shown && game.scene.retryBtn, null, { timeout:5000 });
      const retryButton = await page.evaluate(() => game.scene.retryBtn);
      await clickCanvasButton(page, retryButton);
      await page.waitForFunction(() => game.scene instanceof RunScene);
      await page.evaluate(() => game.scene.endRun(false));
      await page.waitForFunction(() => game.scene instanceof ResultScene, null, { timeout:5000 });
      const report = await page.evaluate(() => ({
        events:(window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        canvas:(() => { const rect=document.getElementById('gameCanvas').getBoundingClientRect(); return { width:rect.width, height:rect.height }; })(),
        adSurface:document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],.ad-container').length,
        hiddenPromotion:document.querySelectorAll('[class*="cross-promo"],[id*="cross-promo"],.cp-section,.related-games').length,
        title:document.title,
      }));
      const stages = funnelEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /mode|stage|path|score|duration|time|result|error|url|location|language/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0, `${viewport.width}px horizontal overflow: ${report.overflow}`);
      assert(report.canvas.width >= 300 && report.canvas.height >= 525, `${viewport.width}px game canvas is too small: ${JSON.stringify(report.canvas)}`);
      assert(report.adSurface === 0 && report.hiddenPromotion === 0, `${viewport.width}px retired ad or inaccessible promotion returned`);
      assert(report.title === 'Road Shooter - Squad Runner Shooter | DopaBrain', `${viewport.width}px metadata localization failed: ${report.title}`);
      assert(errors.length === 0, `${viewport.width}px runtime errors: ${errors.join(' | ')}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker', { html:base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"', '') }],
    ['loader', { html:base.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward', { result:`${base.result}\nconst rewardBtn = 'Watch Ad';` }],
    ['rating', { html:base.html.replace('</body>', '<div>aggregateRating</div></body>') }],
    ['synthetic', { app:`${base.app}\ngtag('event','page_engage');` }],
    ['private-value', { app:base.app.replace("trackRoadShooterStage('road_shooter_progress');", "trackRoadShooterStage('road_shooter_progress', this.scene.stage);") }],
    ['event-removed', { app:base.app.replace("trackRoadShooterStage('road_shooter_progress');", '') }],
    ['language-priority', { app:base.app.replace('const requestedLang = new URLSearchParams(window.location.search).get(\'lang\');', "const requestedLang = ''; // URL ignored") }],
    ['document-language-priority', { i18n:base.i18n.replace("const requested = new URLSearchParams(window.location.search).get('lang');", "const requested = ''; // URL ignored") }],
    ['metadata-overwrite', { i18n:base.i18n.replace('document.title = titles[lang];', "document.title = 'Road Shooter';") }],
    ['zoom-disabled', { html:base.html.replace('initial-scale=1.0', 'initial-scale=1.0, user-scalable=no') }],
    ['hidden-promotion', { css:`${base.css}\n.cross-promo-sidebar { display:none; }` }],
    ['root-cache', { sw:base.sw.replace("'./index.html'", "'/road-shooter/index.html'") }],
    ['global-cache-delete', { sw:base.sw.replace('key.startsWith(CACHE_PREFIX) && ', '') }],
    ['scope-guard', { sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)', '') }],
    ['success-guard', { sw:base.sw.replace('if (response.ok)', 'if (response)') }],
    ['manifest-scope', { manifest:base.manifest.replace('"scope": "./"', '"scope": "/"') }],
    ['locale-reward', { locales:{ ...base.locales, en:base.locales.en.replace(/\n}\s*$/, ',\n  "ad_2x_gold": "Watch Ad"\n}\n') } }],
    ['readme-bloat', { readme:base.readme + 'x'.repeat(1800) }],
    ['stale-roadmap', { readme:base.readme, html:base.html }],
  ];
  for (const [name, override] of cases) {
    let detected = false;
    if (name === 'stale-roadmap') {
      fs.writeFileSync(path.join(APP, 'REDESIGN-ROADMAP.md'), '# stale');
      try { verifySource(base); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
      finally { fs.unlinkSync(path.join(APP, 'REDESIGN-ROADMAP.md')); }
    } else {
      try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
    }
    assert(detected, `Mutation escaped: ${name}`);
  }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const at = process.argv.indexOf('--url');
  const production = at >= 0 ? process.argv[at + 1].replace(/\/$/, '') : '';
  const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRuntime(production);
  else { const server = await startServer(); try { await verifyRuntime(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Road Shooter suspension: ${result.locales} locales, ${result.events} exact-once funnel stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
