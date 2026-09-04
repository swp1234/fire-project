#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'number-puzzle');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const EVENTS = ['number_puzzle_view', 'number_puzzle_start', 'number_puzzle_progress', 'number_puzzle_complete', 'number_puzzle_share', 'number_puzzle_related_click'];
const RELATED = ['/puzzle-2048/', '/block-puzzle/', '/minesweeper/', '/memory-card/'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'), css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'), i18n: overrides.i18n ?? read('js/i18n.js'),
    sound: overrides.sound ?? read('js/sound-engine.js'), sw: overrides.sw ?? read('sw.js'),
    manifest: overrides.manifest ?? read('manifest.json'), readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const source = [value.html, value.css, value.app, value.i18n, value.sound, value.sw, ...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Number Puzzle suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(source), 'Active ad or game-ad code conflicts with suspension');
  assert(!/showInterstitial|interstitial-ad|rewarded|injectRewardButton|Watch Ad|ad-banner/i.test(source), 'Interstitial, reward, or fake ad surface remains');
  assert(!/aggregateRating|ratingCount|FAQPage|page_engage|timer_engagement|scroll_engagement|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof, hidden FAQ, or synthetic telemetry remains');
  assert(!/cross-promo|DailyStreak|GameAchievements|dopabrainApps|\/projects\//i.test(value.html + value.app), 'Unqualified retention or stale promotion remains');
  assert(!/gtag\('event',\s*'game_start'/.test(value.app), 'Page-load game_start returned');
  for (const event of EVENTS) assert(count(value.app, new RegExp(`trackNumberPuzzleStage\\('${event}'\\)`, 'g')) === 1, `${event} call drifted`);
  assert(/const numberPuzzleStages = new Set\(\)/.test(value.app) && /numberPuzzleStages\.has\(name\)/.test(value.app), 'Exact-once funnel guard missing');
  assert(/validMoves === 1[^\n]+number_puzzle_start/.test(value.app) && value.app.indexOf('JSON.stringify(oldTiles) === JSON.stringify(this.tiles)') < value.app.indexOf('number_puzzle_start'), 'Start must require a board-changing move');
  assert(/validMoves === 3[^\n]+number_puzzle_progress/.test(value.app), 'Progress qualification drifted');
  assert(!/trackNumberPuzzleStage\('number_puzzle_(?:view|start|progress|complete|share|related_click)'\s*,/.test(value.app), 'Private game value entered a funnel event');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share success is not awaited');
  assert(value.app.indexOf("trackNumberPuzzleStage('number_puzzle_share')") > value.app.indexOf('await navigator.clipboard.writeText'), 'Share is counted before completion');
  assert(/params\.get\('lang'\)/.test(value.i18n) && value.i18n.indexOf("params.get('lang')") < value.i18n.indexOf("localStorage.getItem('language')"), 'URL language no longer has first priority');
  assert(/window\.i18n = i18n/.test(value.i18n) && /window\.game = game/.test(value.app), 'Runtime handles are unavailable');
  assert(/const safeDuration = Math\.max\(0\.01, Number\(dur\) \|\| 0\)/.test(value.sound) && /env\.s \?\? 0\.3/.test(value.sound), 'Audio envelope must clamp duration and preserve zero sustain');
  const related = Array.from(value.html.matchAll(/<a href="([^"]+)" class="related-card"/g), (match) => match[1]);
  assert(JSON.stringify(related) === JSON.stringify(RELATED), `Related route contract drifted: ${related.join(', ')}`);
  assert(/event\.target\.closest\('\.related-card'\)/.test(value.app), 'Nested related-link clicks are not attributed');
  assert(/CACHE_NAME = 'number-puzzle-v5'/.test(value.sw) && /name\.startsWith\(CACHE_PREFIX\)/.test(value.sw), 'Service-worker cache boundary drifted');
  assert(/event\.request\.method !== 'GET'/.test(value.sw) && /url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw) && /response\.ok/.test(value.sw), 'Service-worker request boundary drifted');
  assert(!/['"]\/number-puzzle\//.test(value.sw.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/)?.[1] || ''), 'Service-worker assets must be relative');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === './' && manifest.start_url === './' && manifest.shortcuts?.[0]?.url === './?action=newgame', 'Manifest must remain deployment-relative');
  for (const [lang, text] of Object.entries(value.locales)) {
    const locale = JSON.parse(text);
    assert(!locale.ad && !locale.dopabrain && locale.related && Object.keys(locale.related).length === RELATED.length + 1, `${lang} locale promotion contract drifted`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 1800 && /page load is not a game start/i.test(value.readme) && /invalid-traffic restriction/i.test(value.readme), 'README is stale or oversized');
  for (const stale of ['og-image.jpg', 'og-image.svg']) assert(!fs.existsSync(path.join(APP, stale)), `Unused asset returned: ${stale}`);
  return { locales: LOCALES.length, events: EVENTS.length, related: related.length };
}

async function startServer() {
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/number-puzzle/')) { base = APP; relative = pathname.slice(15) || 'index.html'; }
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

async function validMove(page) {
  await page.evaluate(() => { window.game.tiles = [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; window.game.render(); });
  await page.keyboard.press('ArrowLeft');
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ viewport }); const page = await context.newPage(); const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.addInitScript(() => { localStorage.setItem('language', 'ko'); Object.defineProperty(navigator, 'share', { configurable: true, value: async () => true }); });
      await page.goto(`${baseUrl}/number-puzzle/?lang=en`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => window.game && window.i18n?.currentLang === 'en' && document.getElementById('new-game-btn')?.textContent.includes('New'), null, { timeout: 15000 });
      assert(await page.evaluate(() => !window.dataLayer?.some((row) => row?.[1] === 'number_puzzle_start')), `${viewport.width}px load counted as start`);
      await page.locator('#new-game-btn').click();
      assert(await page.evaluate(() => !window.dataLayer?.some((row) => row?.[1] === 'number_puzzle_start')), `${viewport.width}px reset counted as start`);
      await validMove(page); await validMove(page); await validMove(page);
      await page.evaluate(() => { window.game.tiles = [1024, 1024, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; window.game.render(); });
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(() => document.getElementById('game-overlay').classList.contains('show'));
      await page.locator('#share-score-btn').click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'number_puzzle_share'));
      await page.evaluate(() => document.querySelector('.related-grid').addEventListener('click', (event) => event.preventDefault()));
      await page.locator('.related-card span[data-i18n]').first().click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'number_puzzle_related_click'));
      const report = await page.evaluate(() => ({
        events: (window.dataLayer || []).filter((row) => row?.[0] === 'event'), overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets: ['new-game-btn', 'undo-btn', 'share-score-btn'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return { id, width: r.width, height: r.height }; }),
        related: Array.from(document.querySelectorAll('.related-card'), (link) => { const r = link.getBoundingClientRect(); return { href: link.getAttribute('href'), width: r.width, height: r.height }; }),
        adSurface: document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],[class*="ad-banner"],[id*="interstitial-ad"]').length,
      }));
      const stages = funnelEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /score|tile|move|direction|time|duration|result|url|path|location|language/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0 && [...report.targets, ...report.related].every((target) => target.width >= 43.99 && target.height >= 43.99), `${viewport.width}px layout or touch target regressed`);
      assert(JSON.stringify(report.related.map((link) => link.href)) === JSON.stringify(RELATED), `${viewport.width}px related routes drifted`);
      assert(report.adSurface === 0 && errors.length === 0, `${viewport.width}px ad surface or runtime error: ${errors.join(' | ')}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker', { html: base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"', '') }],
    ['loader', { html: base.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward', { app: `${base.app}\nGameAds.injectRewardButton();` }], ['rating', { html: base.html.replace('</body>', '<div>aggregateRating</div></body>') }],
    ['faq', { html: base.html.replace('</body>', '<div>FAQPage</div></body>') }], ['synthetic', { app: `${base.app}\ngtag('event','page_engage');` }],
    ['page-load-start', { app: `${base.app}\ngtag('event', 'game_start');` }], ['easy-start', { app: base.app.replace('validMoves === 1', 'validMoves === 0') }],
    ['progress', { app: base.app.replace('validMoves === 3', 'validMoves === 1') }], ['private', { app: base.app.replace("trackNumberPuzzleStage('number_puzzle_progress');", "trackNumberPuzzleStage('number_puzzle_progress', this.score);") }],
    ['event', { app: base.app.replace("trackNumberPuzzleStage('number_puzzle_complete');", '') }], ['exact-once', { app: base.app.replace('numberPuzzleStages.has(name)', 'false') }],
    ['share', { app: base.app.replace('await navigator.share', 'navigator.share') }], ['language', { i18n: base.i18n.replace("const urlLang = params.get('lang');", "const urlLang = '';") }],
    ['audio', { sound: base.sound.replace('const safeDuration = Math.max(0.01, Number(dur) || 0);', 'const safeDuration = dur;') }], ['nested-related', { app: base.app.replace("event.target.closest('.related-card')", "event.target.matches('.related-card')") }],
    ['related-route', { html: base.html.replace('href="/puzzle-2048/"', 'href="/unknown/"') }], ['root-cache', { sw: base.sw.replace("'./index.html'", "'/number-puzzle/index.html'") }],
    ['global-cache', { sw: base.sw.replace('name.startsWith(CACHE_PREFIX) && ', '') }], ['scope-guard', { sw: base.sw.replace(' || !url.pathname.startsWith(APP_PATH)', '') }],
    ['success-guard', { sw: base.sw.replace('if (response.ok)', 'if (response)') }], ['manifest', { manifest: base.manifest.replace('"scope": "./"', '"scope": "/"') }],
    ['locale-promo', { locales: { ...base.locales, en: base.locales.en.replace(/^\{/, '{\n  "dopabrain": {},') } }], ['locale-related', { locales: { ...base.locales, en: base.locales.en.replace(/\n\s*"blockPuzzle"[^\n]+/, '') } }],
    ['readme', { readme: base.readme + 'x'.repeat(1800) }],
  ];
  for (const [name, override] of cases) { let detected = false; try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); } assert(detected, `Mutation escaped: ${name}`); }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const at = process.argv.indexOf('--url'); const production = at >= 0 ? process.argv[at + 1].replace(/\/$/, '') : ''; const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRuntime(production); else { const server = await startServer(); try { await verifyRuntime(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Number Puzzle suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} exact-once stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
