#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'word-guess');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const EVENTS = ['word_guess_view', 'word_guess_start', 'word_guess_progress', 'word_guess_complete', 'word_guess_share', 'word_guess_related_click'];
const RELATED = ['/word-scramble/', '/quiz-app/', '/dev-quiz/', '/typing-speed/'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'), css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'), i18n: overrides.i18n ?? read('js/i18n.js'),
    sw: overrides.sw ?? read('sw.js'), manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const source = [value.html, value.css, value.app, value.i18n, value.sw, ...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Word Guess suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(source), 'Active ad or game-ad code conflicts with suspension');
  assert(!/showInterstitial|interstitial-ad|rewarded|injectRewardButton|Watch Ad|ad-banner|ad-container/i.test(source), 'Interstitial, reward, or fake ad surface remains');
  assert(!/aggregateRating|ratingCount|FAQPage|page_engage|timer_engagement|scroll_engagement|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof, hidden FAQ, or synthetic telemetry remains');
  assert(!/cross-promo|DailyStreak|GameAchievements|dopabrainApps|\/projects\//i.test(value.html + value.app), 'Unqualified retention or stale promotion remains');
  for (const event of EVENTS) assert(count(value.app, new RegExp(`trackWordGuessStage\\('${event}'\\)`, 'g')) === 1, `${event} call drifted`);
  assert(/const wordGuessStages = new Set\(\)/.test(value.app) && /wordGuessStages\.has\(name\)/.test(value.app), 'Exact-once funnel guard missing');
  assert(/guesses\.length === 1[^\n]+word_guess_start/.test(value.app), 'Start must require the first accepted guess');
  assert(/guesses\.length === 2[^\n]+word_guess_progress/.test(value.app), 'Progress must require the second accepted guess');
  assert(value.app.indexOf("trackWordGuessStage('word_guess_start')") > value.app.indexOf('gameState.guesses.push'), 'Start moved before accepted-guess storage');
  assert(/if \(gameState\.gameOver\) trackWordGuessStage\('word_guess_complete'\)/.test(value.app), 'Completion must require terminal state');
  assert(!/trackWordGuessStage\('word_guess_(?:view|start|progress|complete|share|related_click)'\s*,/.test(value.app), 'Private game value entered a funnel event');
  assert(/async function shareResult/.test(value.app) && /await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share success is not awaited');
  assert(value.app.indexOf("trackWordGuessStage('word_guess_share')") > value.app.indexOf('await navigator.clipboard.writeText'), 'Share is counted before completion');
  assert(/params\.get\('lang'\)/.test(value.i18n) && value.i18n.indexOf("params.get('lang')") < value.i18n.indexOf("localStorage.getItem('wordguess-language')"), 'URL language no longer has first priority');
  assert(/window\.i18n = i18n/.test(value.i18n) && /window\.gameState = gameState/.test(value.app), 'Runtime handles are unavailable');
  const related = Array.from(value.html.matchAll(/<a href="([^"]+)" class="related-card"/g), (match) => match[1]);
  assert(JSON.stringify(related) === JSON.stringify(RELATED), `Related route contract drifted: ${related.join(', ')}`);
  assert(/event\.target\.closest\('\.related-card'\)/.test(value.app), 'Nested related-link clicks are not attributed');
  assert(/CACHE_NAME = 'word-guess-v6'/.test(value.sw) && /name\.startsWith\(CACHE_PREFIX\)/.test(value.sw), 'Service-worker cache boundary drifted');
  assert(/event\.request\.method !== 'GET'/.test(value.sw) && /url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw) && /response\.ok/.test(value.sw), 'Service-worker request boundary drifted');
  assert(!/['"]\/word-guess\//.test(value.sw.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/)?.[1] || ''), 'Service-worker assets must be relative');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === './' && manifest.start_url === './' && manifest.shortcuts?.every((item) => item.url.startsWith('./?')), 'Manifest must remain deployment-relative');
  assert(/URLSearchParams\(window\.location\.search\)\.get\('mode'\)/.test(value.app) && /startNewGame\(initialMode\)/.test(value.app), 'PWA mode shortcut is not honored');
  for (const [lang, text] of Object.entries(value.locales)) {
    const locale = JSON.parse(text);
    assert(!locale.ad && !locale.dopabrain && locale.related && Object.keys(locale.related).length === RELATED.length + 1, `${lang} locale promotion contract drifted`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 1800 && /Page load, typing, invalid words/i.test(value.readme) && /invalid-traffic restriction/i.test(value.readme), 'README is stale or oversized');
  return { locales: LOCALES.length, events: EVENTS.length, related: related.length };
}

async function startServer() {
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/word-guess/')) { base = APP; relative = pathname.slice(12) || 'index.html'; }
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

async function enterWord(page, word) {
  for (const letter of word) await page.locator(`#virtual-keyboard [data-key="${letter}"]`).click();
  await page.locator('#enter-btn').click();
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ viewport }); const page = await context.newPage(); const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
      await page.addInitScript(() => { localStorage.setItem('wordguess-language', 'ko'); Object.defineProperty(navigator, 'share', { configurable: true, value: async () => true }); });
      await page.goto(`${baseUrl}/word-guess/?lang=en&mode=practice`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => window.gameState?.mode === 'practice' && window.i18n?.currentLang === 'en' && window.i18n?.isInitialized && document.getElementById('practice-mode-btn')?.classList.contains('active'), null, { timeout: 15000 });
      assert(await page.evaluate(() => !window.dataLayer?.some((row) => row?.[1] === 'word_guess_start')), `${viewport.width}px load counted as start`);
      await page.locator('#virtual-keyboard [data-key="A"]').click();
      await page.locator('#enter-btn').click();
      assert(await page.evaluate(() => !window.dataLayer?.some((row) => row?.[1] === 'word_guess_start')), `${viewport.width}px partial word counted as start`);
      await page.locator('#practice-mode-btn').click();
      assert(await page.evaluate(() => !window.dataLayer?.some((row) => row?.[1] === 'word_guess_start')), `${viewport.width}px reset counted as start`);
      await page.evaluate(() => {
        window.gameState.currentWord = 'GRAPE'; window.gameState.wordLength = 5; window.gameState.attempts = 6;
        window.gameState.guesses = []; window.gameState.currentGuess = []; window.gameState.gameOver = false; window.gameState.validating = false;
        _expectedWordLength = 5; initializeTiles(); initializeKeyboard();
      });
      await enterWord(page, 'APPLE');
      await page.waitForFunction(() => window.gameState.guesses.length === 1);
      await enterWord(page, 'GRAPE');
      await page.waitForFunction(() => !document.getElementById('result-modal').classList.contains('hidden'));
      await page.locator('#share-result-btn').click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'word_guess_share'));
      await page.evaluate(() => document.getElementById('result-modal').classList.add('hidden'));
      await page.evaluate(() => document.querySelector('.related-grid').addEventListener('click', (event) => event.preventDefault()));
      await page.locator('.related-card span[data-i18n]').first().click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'word_guess_related_click'));
      const report = await page.evaluate(() => ({
        events: (window.dataLayer || []).filter((row) => row?.[0] === 'event'), overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets: ['enter-btn', 'hint-btn', 'daily-mode-btn'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return { id, width: r.width, height: r.height }; }),
        related: Array.from(document.querySelectorAll('.related-card'), (link) => { const r = link.getBoundingClientRect(); return { href: link.getAttribute('href'), width: r.width, height: r.height }; }),
        adSurface: document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],[class*="ad-banner"],[id*="interstitial-ad"]').length,
      }));
      const stages = funnelEvents(report.events);
      for (const eventName of EVENTS) assert(stages.filter((event) => event.name === eventName).length === 1, `${viewport.width}px ${eventName} must fire exactly once`);
      assert(stages.every((event) => !Object.keys(event.params).some((key) => /word|guess|score|answer|result|time|duration|url|path|location|language/i.test(key))), `${viewport.width}px private game value entered analytics`);
      assert(report.overflow <= 0 && [...report.targets, ...report.related].every((target) => target.width >= 43.99 && target.height >= 43.99), `${viewport.width}px layout or touch target regressed: ${JSON.stringify({ overflow: report.overflow, targets: report.targets, related: report.related })}`);
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
    ['easy-start', { app: base.app.replace('guesses.length === 1', 'guesses.length === 0') }], ['progress', { app: base.app.replace('guesses.length === 2', 'guesses.length === 1') }],
    ['early-start', { app: base.app.replace("gameState.guesses.push([...currentGuess]);", "trackWordGuessStage('word_guess_start');\n    gameState.guesses.push([...currentGuess]);").replace("if (gameState.guesses.length === 1) trackWordGuessStage('word_guess_start');", '') }],
    ['private', { app: base.app.replace("trackWordGuessStage('word_guess_progress');", "trackWordGuessStage('word_guess_progress', word);") }],
    ['event', { app: base.app.replace("trackWordGuessStage('word_guess_complete');", '') }], ['exact-once', { app: base.app.replace('wordGuessStages.has(name)', 'false') }],
    ['share', { app: base.app.replace('await navigator.share', 'navigator.share') }], ['language', { i18n: base.i18n.replace("const urlLang = params.get('lang');", "const urlLang = '';") }],
    ['nested-related', { app: base.app.replace("event.target.closest('.related-card')", "event.target.matches('.related-card')") }],
    ['related-route', { html: base.html.replace('href="/word-scramble/"', 'href="/unknown/"') }], ['root-cache', { sw: base.sw.replace("'./index.html'", "'/word-guess/index.html'") }],
    ['global-cache', { sw: base.sw.replace('name.startsWith(CACHE_PREFIX) && ', '') }], ['scope-guard', { sw: base.sw.replace(' || !url.pathname.startsWith(APP_PATH)', '') }],
    ['success-guard', { sw: base.sw.replace('if (response.ok)', 'if (response)') }], ['manifest', { manifest: base.manifest.replace('"scope": "./"', '"scope": "/"') }],
    ['mode-shortcut', { app: base.app.replace('startNewGame(initialMode);', "startNewGame('daily');") }],
    ['locale-promo', { locales: { ...base.locales, en: base.locales.en.replace(/^\{/, '{\n  "dopabrain": {},') } }],
    ['locale-related', { locales: { ...base.locales, en: base.locales.en.replace(/\n\s*"quizApp"[^\n]+/, '') } }], ['readme', { readme: base.readme + 'x'.repeat(1800) }],
  ];
  for (const [name, override] of cases) { let detected = false; try { verifySource({ ...base, ...override }); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); } assert(detected, `Mutation escaped: ${name}`); }
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);
}

async function main() {
  const at = process.argv.indexOf('--url'); const production = at >= 0 ? process.argv[at + 1].replace(/\/$/, '') : ''; const result = verifySource();
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRuntime(production); else { const server = await startServer(); try { await verifyRuntime(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Word Guess suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} exact-once stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
