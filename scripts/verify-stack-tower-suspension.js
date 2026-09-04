#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'stack-tower');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const EVENTS = ['stack_tower_view', 'stack_tower_start', 'stack_tower_progress', 'stack_tower_complete', 'stack_tower_share', 'stack_tower_related_click'];
const RELATED = ['/flappy-bird/', '/zigzag-runner/', '/block-puzzle/', '/idle-clicker/'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'),
    css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'),
    i18n: overrides.i18n ?? read('js/i18n.js'),
    sound: overrides.sound ?? read('js/sound-engine.js'),
    sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const source = [value.html, value.css, value.app, value.i18n, value.sound, value.sw, ...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Stack Tower suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(source), 'Active ad or game-ad code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded|reviveGame|reviveUsed|adContainer|countdownContainer|ad-banner/i.test(source), 'Interstitial, rewarded revive, or fake ad surface remains');
  assert(!/aggregateRating|ratingCount|FAQPage|page_engage|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof, hidden FAQ, or synthetic telemetry remains');
  assert(!/cross-promo|pwa-install|DailyStreak|GameAchievements|use_powerup/i.test(value.html + value.app), 'Unqualified retention, telemetry, or generic promotion remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport must preserve user zoom');
  for (const event of EVENTS) assert(count(value.app, new RegExp(`trackStackTowerStage\\('${event}'\\)`, 'g')) === 1, `${event} call drifted`);
  assert(/const stackTowerStages = new Set\(\)/.test(value.app) && /stackTowerStages\.has\(name\)/.test(value.app), 'Exact-once funnel guard missing');
  assert(!/trackStackTowerStage\('stack_tower_(?:view|start|progress|complete|share|related_click)'\s*,/.test(value.app), 'Private game value entered a funnel event');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share success is not awaited');
  assert(value.app.indexOf("trackStackTowerStage('stack_tower_share')") > value.app.indexOf('await navigator.clipboard.writeText'), 'Share is counted before completion');
  assert(/params\.get\('lang'\)/.test(value.i18n) && value.i18n.indexOf("params.get('lang')") < value.i18n.indexOf("localStorage.getItem('app_language')"), 'URL language no longer has first priority');
  assert(/window\.i18n = i18n/.test(value.i18n) && /window\.game = new StackTowerGame/.test(value.app), 'Runtime handles are unavailable');
  assert(count(value.sound, /const safeDuration = Math\.max\(0\.01, Number\(duration\) \|\| 0\)/g) === 2 && /envelope\.sustain \?\? 0\.3/.test(value.sound), 'Audio envelopes must clamp short durations and preserve zero sustain');
  const related = Array.from(value.html.matchAll(/<a href="([^"]+)" class="related-card"/g), (match) => match[1]);
  assert(JSON.stringify(related) === JSON.stringify(RELATED), `Related route contract drifted: ${related.join(', ')}`);
  assert(/event\.target\.closest\('\.related-card'\)/.test(value.app), 'Nested related-link clicks are not attributed');
  assert(/CACHE_NAME = 'stack-tower-v6'/.test(value.sw), 'Stack Tower cache version is stale');
  assert(/name\.startsWith\(CACHE_PREFIX\)/.test(value.sw), 'Service worker can delete another product cache');
  assert(/event\.request\.method !== 'GET'/.test(value.sw) && /url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker request boundary missing');
  assert(/response\.ok/.test(value.sw) && !/['"]\/stack-tower\//.test(value.sw.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/)?.[1] || ''), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === './' && manifest.start_url === './' && manifest.shortcuts?.[0]?.url === './?mode=game', 'Manifest must remain deployment-relative');
  for (const [lang, text] of Object.entries(value.locales)) {
    const locale = JSON.parse(text);
    assert(!locale.ad && !locale.rec && !locale.error && !locale.game?.revive && !locale.game?.reviveGame && !locale.game?.adLoading && !locale.game?.shareText, `${lang} retired ad/share copy returned`);
    assert(locale.related && Object.keys(locale.related).length === RELATED.length, `${lang} related labels drifted`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 1800 && /invalid-traffic restriction/i.test(value.readme) && /stack_tower_view/.test(value.readme), 'README is stale or oversized');
  for (const stale of ['js/error-handler.js', 'og-image.jpg', 'og-image.svg']) assert(!fs.existsSync(path.join(APP, stale)), `Unused asset returned: ${stale}`);
  return { locales: LOCALES.length, events: EVENTS.length, related: related.length };
}

async function startServer() {
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/stack-tower/')) { base = APP; relative = pathname.slice(13) || 'index.html'; }
      else if (pathname.startsWith('/portal/')) { base = PORTAL; relative = pathname.slice(8); }
      else return response.writeHead(404).end();
      let target = path.resolve(base, relative);
      assert(target === base || target.startsWith(`${base}${path.sep}`), `Unsafe path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(fs.readFileSync(target));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  return { origin: `http://127.0.0.1:${address.port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

function funnelEvents(rows) {
  return rows.filter((row) => row?.[0] === 'event' && EVENTS.includes(row[1])).map((row) => ({ name: row[1], params: row[2] || {} }));
}

async function tapCanvas(page) {
  const canvas = await page.locator('#gameCanvas').boundingBox();
  assert(canvas && canvas.width >= 300 && canvas.height >= 500, `Canvas is not usable: ${JSON.stringify(canvas)}`);
  await page.mouse.click(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
}

async function playToGameOver(page) {
  await page.locator('#startBtn').click();
  await tapCanvas(page);
  await page.waitForFunction(() => window.game?.state === 'playing');
  await page.evaluate(() => { window.game.movingBlock.x = window.game.stack.at(-1).x; });
  await tapCanvas(page);
  await page.waitForFunction(() => window.game?.floor >= 1);
  await page.waitForFunction(() => window.game?.state === 'playing' && window.game?.movingBlock);
  await page.evaluate(() => { window.game.movingBlock.x = -window.game.movingBlock.w - 10; });
  await tapCanvas(page);
  await page.waitForFunction(() => window.game?.state === 'gameover' && document.getElementById('gameOverScreen').classList.contains('active'), null, { timeout: 5000 });
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.addInitScript(() => {
        localStorage.setItem('app_language', 'ko');
        Object.defineProperty(navigator, 'share', { configurable: true, value: async () => true });
      });
      await page.goto(`${baseUrl}/stack-tower/?lang=en`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => window.game && window.i18n?.currentLang === 'en' && document.getElementById('startBtn')?.textContent.includes('Start'), null, { timeout: 15000 });
      assert(await page.evaluate(() => document.documentElement.lang === 'en'), `${viewport.width}px URL language did not override saved Korean`);
      await playToGameOver(page);
      await page.locator('#restartBtn').click();
      await tapCanvas(page);
      await page.evaluate(() => { window.game.movingBlock.x = window.game.stack.at(-1).x; });
      await tapCanvas(page);
      await page.waitForFunction(() => window.game?.state === 'playing' && window.game?.movingBlock);
      await page.evaluate(() => { window.game.movingBlock.x = -window.game.movingBlock.w - 10; });
      await tapCanvas(page);
      await page.waitForFunction(() => window.game?.state === 'gameover' && document.getElementById('gameOverScreen').classList.contains('active'), null, { timeout: 5000 });
      await page.locator('#shareBtn').click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'stack_tower_share'));
      await page.evaluate(() => document.querySelector('.related-grid').addEventListener('click', (event) => event.preventDefault()));
      await page.locator('.related-card .related-name').first().click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'stack_tower_related_click'));
      const report = await page.evaluate(() => ({
        events: (window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets: ['restartBtn', 'shareBtn', 'mainMenuBtn'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return { id, width: r.width, height: r.height }; }),
        related: Array.from(document.querySelectorAll('.related-card'), (link) => ({ href: link.getAttribute('href'), width: link.getBoundingClientRect().width, height: link.getBoundingClientRect().height })),
        adSurface: document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],[class*="ad-banner"],[id*="adOverlay"]').length,
      }));
      const stages = funnelEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /score|coin|theme|skin|stage|time|duration|result|url|path|location|language/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0, `${viewport.width}px horizontal overflow: ${report.overflow}`);
      assert([...report.targets, ...report.related].every((target) => target.width >= 43.99 && target.height >= 43.99), `${viewport.width}px target below 44px: ${JSON.stringify({ targets: report.targets, related: report.related })}`);
      assert(JSON.stringify(report.related.map((link) => link.href)) === JSON.stringify(RELATED), `${viewport.width}px related routes drifted`);
      assert(report.adSurface === 0, `${viewport.width}px retired ad surface returned`);
      assert(errors.length === 0, `${viewport.width}px runtime errors: ${errors.join(' | ')}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker', { html: base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"', '') }],
    ['loader', { html: base.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward', { app: `${base.app}\nGameAds.showRewarded();` }],
    ['rating', { html: base.html.replace('</body>', '<div>aggregateRating</div></body>') }],
    ['faq', { html: base.html.replace('</body>', '<div>FAQPage</div></body>') }],
    ['synthetic', { app: `${base.app}\ngtag('event','page_engage');` }],
    ['private', { app: base.app.replace("trackStackTowerStage('stack_tower_progress');", "trackStackTowerStage('stack_tower_progress', this.score);") }],
    ['event', { app: base.app.replace("trackStackTowerStage('stack_tower_complete');", '') }],
    ['exact-once', { app: base.app.replace('stackTowerStages.has(name)', 'false') }],
    ['share', { app: base.app.replace('await navigator.share', 'navigator.share') }],
    ['language', { i18n: base.i18n.replace("const urlLang = params.get('lang');", "const urlLang = '';") }],
    ['runtime-handles', { i18n: base.i18n.replace('window.i18n = i18n;', '') }],
    ['audio-envelope', { sound: base.sound.replace('const safeDuration = Math.max(0.01, Number(duration) || 0);', 'const safeDuration = duration;') }],
    ['nested-related', { app: base.app.replace("event.target.closest('.related-card')", "event.target.matches('.related-card')") }],
    ['related-route', { html: base.html.replace('href="/flappy-bird/"', 'href="/unknown/"') }],
    ['zoom', { html: base.html.replace('initial-scale=1.0', 'initial-scale=1.0, user-scalable=no') }],
    ['root-cache', { sw: base.sw.replace("'./index.html'", "'/stack-tower/index.html'") }],
    ['global-cache', { sw: base.sw.replace('name.startsWith(CACHE_PREFIX) && ', '') }],
    ['scope-guard', { sw: base.sw.replace(' || !url.pathname.startsWith(APP_PATH)', '') }],
    ['success-guard', { sw: base.sw.replace('if (response.ok)', 'if (response)') }],
    ['manifest', { manifest: base.manifest.replace('"scope": "./"', '"scope": "/"') }],
    ['locale-ad', { locales: { ...base.locales, en: base.locales.en.replace(/^\{/, '{\n  "ad": {},') } }],
    ['locale-related', { locales: { ...base.locales, en: base.locales.en.replace(/\n\s*"blockPuzzle"[^\n]+/, '') } }],
    ['readme', { readme: base.readme + 'x'.repeat(1800) }],
  ];
  for (const [name, override] of cases) {
    let detected = false;
    try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
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
  console.log(`[PASS] Stack Tower suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} exact-once stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
