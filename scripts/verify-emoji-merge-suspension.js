#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'emoji-merge');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const EVENTS = ['emoji_merge_view', 'emoji_merge_start', 'emoji_merge_progress', 'emoji_merge_complete', 'emoji_merge_share', 'emoji_merge_related_click'];
const RELATED = ['/idle-clicker/', '/block-puzzle/', '/stack-tower/', '/color-memory/'];
function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }

function fixture(overrides = {}) {
  return {
    html: overrides.html ?? read('index.html'), css: overrides.css ?? read('css/style.css'),
    app: overrides.app ?? read('js/app.js'), i18n: overrides.i18n ?? read('js/i18n.js'),
    sw: overrides.sw ?? read('sw.js'), manifest: overrides.manifest ?? read('manifest.json'),
    readme: overrides.readme ?? read('README.md'),
    locales: overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)]))
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const source = [value.html, value.css, value.app, value.i18n, value.sw, ...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Emoji Merge suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(source), 'Active ad or game-ad code conflicts with suspension');
  assert(!/showInterstitial|showRewarded|rewarded|Watch Ad|ad-banner|ad-placeholder|interstitial|btn-premium/i.test(source), 'Interstitial, reward, fake ad, or pseudo-premium surface remains');
  assert(!/aggregateRating|ratingCount|FAQPage|page_engage|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof, hidden FAQ, or synthetic telemetry remains');
  assert(!/cross-promo|DailyStreak|GameAchievements|recommendations-section/i.test(source), 'Unqualified retention or generic promotion remains');
  assert(!/gtag\('event',\s*'(?:page_view|game_over|game_win|continue_game)'/.test(value.html + value.app), 'Duplicate or private legacy event remains');
  assert(!/user-scalable\s*=\s*no/i.test(value.html), 'Viewport disables user zoom');
  for (const event of EVENTS) assert(count(value.app, new RegExp(`trackEmojiMergeStage\\('${event}'\\)`, 'g')) === 1, `${event} call drifted`);
  assert(/const emojiMergeStages = new Set\(\)/.test(value.app) && /emojiMergeStages\.has\(name\)/.test(value.app), 'Exact-once funnel guard missing');
  assert(value.app.indexOf("moveCount === 1) trackEmojiMergeStage('emoji_merge_start')") > value.app.indexOf('if (!changed) return false'), 'Start must follow a successful board move');
  assert(/moveCount === 3\) trackEmojiMergeStage\('emoji_merge_progress'\)/.test(value.app), 'Progress must require three successful moves');
  assert(/gameOverOverlay\) gameOverOverlay\.classList\.remove\('hidden'\);\s*trackEmojiMergeStage\('emoji_merge_complete'\)/.test(value.app), 'Completion must follow the real game-over overlay');
  assert(!/trackEmojiMergeStage\('emoji_merge_(?:view|start|progress|complete|share|related_click)'\s*,/.test(value.app), 'Private game value entered telemetry');
  assert(/async function shareResult\(\)/.test(value.app) && /await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share success is not awaited');
  const shareBlock = value.app.match(/async function shareResult\(\) \{([\s\S]*?)\r?\n    \}\r?\n\r?\n    \/\/ === Events ===/)?.[1] || '';
  assert(shareBlock && !/score|chain|maxVal|moveCount|resultTitle/i.test(shareBlock), 'Share path exposes a private result');
  assert(/params\.get\('lang'\)/.test(value.i18n) && value.i18n.indexOf("params.get('lang')") < value.i18n.indexOf("localStorage.getItem('app_language')"), 'URL language no longer has first priority');
  const related = Array.from(value.html.matchAll(/<a href="([^"]+)" class="related-card"/g), (match) => match[1]);
  assert(JSON.stringify(related) === JSON.stringify(RELATED), `Related route contract drifted: ${related.join(', ')}`);
  assert(/event\.target\.closest\('\.related-card'\)/.test(value.app), 'Nested related click is not attributed');
  assert(/CACHE_NAME = `\$\{CACHE_PREFIX\}v5`/.test(value.sw) && /name\.startsWith\(CACHE_PREFIX\)/.test(value.sw), 'Service-worker cache boundary drifted');
  assert(/event\.request\.method !== 'GET'/.test(value.sw) && /url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw) && /response\.ok/.test(value.sw), 'Service-worker request boundary drifted');
  assert(!/['"]\/emoji-merge\//.test(value.sw.match(/const ASSETS = \[([\s\S]*?)\];/)?.[1] || ''), 'Service-worker assets must be relative');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === './' && manifest.start_url === './' && !manifest.share_target, 'Manifest must remain deployment-relative and truthful');
  for (const [lang, text] of Object.entries(value.locales)) {
    const locale = JSON.parse(text);
    assert(!locale.ads && !locale.premium && !locale.recs && !locale.game?.ad && !locale.game?.premium, `${lang} locale retired ad or pseudo-premium copy returned`);
  }
  assert(Buffer.byteLength(value.readme, 'utf8') < 1800 && /visit is not a play/i.test(value.readme) && /invalid-traffic restriction/i.test(value.readme), 'README is stale or oversized');
  return { locales: LOCALES.length, events: EVENTS.length, related: related.length };
}

async function startServer() {
  const types = { '.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let base; let relative;
      if (pathname.startsWith('/emoji-merge/')) { base = APP; relative = pathname.slice(13) || 'index.html'; }
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
  return { origin:`http://127.0.0.1:${address.port}`, close:() => new Promise((resolve) => server.close(resolve)) };
}

function funnelEvents(rows) {
  return rows.filter((row) => row?.[0] === 'event' && EVENTS.includes(row[1])).map((row) => ({ name:row[1], params:row[2] || {} }));
}

function assertNeutral(events, width) {
  assert(events.every((event) => !Object.keys(event.params).some((key) => /score|chain|board|move|tile|time|duration|result|url|path|language/i.test(key))), `${width}px private value entered telemetry`);
}

async function openPage(context, baseUrl, errors) {
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
  await page.goto(`${baseUrl}/emoji-merge/?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
  await page.waitForFunction(() => !document.getElementById('app-loader'), null, { timeout:15000 });
  return page;
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless:true });
  try {
    for (const viewport of [{ width:390, height:844 }, { width:1440, height:900 }]) {
      const errors = [];
      const context = await browser.newContext({ viewport });
      await context.addInitScript(() => {
        localStorage.setItem('app_language', 'ko');
        Math.random = () => 0;
        Object.defineProperty(navigator, 'share', { configurable:true, value:async () => true });
      });
      const page = await openPage(context, baseUrl, errors);
      assert(await page.evaluate(() => document.documentElement.lang === 'en'), `${viewport.width}px URL language lost priority`);
      assert(await page.evaluate(() => !window.dataLayer?.some((row) => row?.[1] === 'emoji_merge_start')), `${viewport.width}px load counted as start`);
      await page.locator('#btn-chain').click();
      await page.locator('#chain-close').click();
      assert(await page.evaluate(() => !window.dataLayer?.some((row) => row?.[1] === 'emoji_merge_start')), `${viewport.width}px menu counted as start`);
      for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowLeft']) { await page.keyboard.press(key); await page.waitForTimeout(250); }
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'emoji_merge_progress'));
      await page.evaluate(() => document.querySelector('.related-grid').addEventListener('click', (event) => event.preventDefault()));
      await page.locator('.related-card .related-name').first().click();
      await page.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'emoji_merge_related_click'));
      const report = await page.evaluate(() => ({
        events:(window.dataLayer || []).filter((row) => row?.[0] === 'event'),
        overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        targets:['theme-toggle','sound-toggle','lang-toggle','btn-new','btn-undo','btn-collection','btn-history','btn-daily','btn-hint','btn-chain'].map((id) => { const r=document.getElementById(id).getBoundingClientRect(); return { id, width:r.width, height:r.height }; }),
        related:Array.from(document.querySelectorAll('.related-card'), (link) => { const r=link.getBoundingClientRect(); return { href:link.getAttribute('href'), width:r.width, height:r.height }; }),
        adSurface:document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],[class*="ad-banner"],[id*="interstitial"]').length
      }));
      const events = funnelEvents(report.events);
      for (const name of ['emoji_merge_view','emoji_merge_start','emoji_merge_progress','emoji_merge_related_click']) assert(events.filter((event) => event.name === name).length === 1, `${viewport.width}px ${name} must fire exactly once`);
      assertNeutral(events, viewport.width);
      assert(report.overflow <= 0 && [...report.targets, ...report.related].every((target) => target.width >= 43.99 && target.height >= 43.99), `${viewport.width}px layout or touch target regressed: ${JSON.stringify(report)}`);
      assert(JSON.stringify(report.related.map((item) => item.href)) === JSON.stringify(RELATED), `${viewport.width}px related routes drifted`);
      assert(report.adSurface === 0 && errors.length === 0, `${viewport.width}px ad surface or runtime error: ${errors.join(' | ')}`);
      await context.close();

      const terminalErrors = [];
      const terminal = await browser.newContext({ viewport });
      await terminal.addInitScript(() => {
        Math.random = () => 0;
        Object.defineProperty(navigator, 'share', { configurable:true, value:async () => true });
        const grid = [[2,2,8,16],[8,16,32,64],[16,32,64,128],[32,64,128,256]];
        let id = 1;
        const tileMap = grid.map((row) => row.map(() => id++));
        localStorage.setItem('emojiMerge_gameState', JSON.stringify({ grid, tileMap, nextTileId:id, score:0, won:false, keepPlaying:false, gameOver:false, moveCount:0, reachedStages:{}, mergeHistory:[] }));
      });
      const terminalPage = await openPage(terminal, baseUrl, terminalErrors);
      await terminalPage.keyboard.press('ArrowLeft');
      await terminalPage.waitForFunction(() => !document.getElementById('game-over-overlay').classList.contains('hidden'), null, { timeout:5000 });
      await terminalPage.locator('#btn-share').click();
      await terminalPage.waitForFunction(() => window.dataLayer?.some((row) => row?.[1] === 'emoji_merge_share'));
      const terminalEvents = funnelEvents(await terminalPage.evaluate(() => window.dataLayer || []));
      for (const name of ['emoji_merge_view','emoji_merge_start','emoji_merge_complete','emoji_merge_share']) assert(terminalEvents.filter((event) => event.name === name).length === 1, `${viewport.width}px terminal ${name} must fire exactly once`);
      assertNeutral(terminalEvents, viewport.width);
      assert(terminalErrors.length === 0, `${viewport.width}px terminal runtime error: ${terminalErrors.join(' | ')}`);
      await terminal.close();
    }
  } finally { await browser.close(); }
}

function verifyMutations() {
  const base = fixture();
  const cases = [
    ['marker',{ html:base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"','') }],
    ['loader',{ html:base.html.replace('</head>','<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>') }],
    ['reward',{ app:`${base.app}\nGameAds.showRewarded();` }],
    ['rating',{ html:base.html.replace('</body>','<div>aggregateRating</div></body>') }],
    ['faq',{ html:base.html.replace('</body>','<div>FAQPage</div></body>') }],
    ['synthetic',{ app:`${base.app}\ngtag('event','page_engage');` }],
    ['duplicate-view',{ app:`${base.app}\ngtag('event','page_view');` }],
    ['start',{ app:base.app.replace("trackEmojiMergeStage('emoji_merge_start');",'') }],
    ['progress',{ app:base.app.replace('moveCount === 3','moveCount === 2') }],
    ['complete',{ app:base.app.replace("trackEmojiMergeStage('emoji_merge_complete');",'') }],
    ['private',{ app:base.app.replace("trackEmojiMergeStage('emoji_merge_progress');","trackEmojiMergeStage('emoji_merge_progress', score);") }],
    ['exact-once',{ app:base.app.replace('emojiMergeStages.has(name)','false') }],
    ['share',{ app:base.app.replace('await navigator.share','navigator.share') }],
    ['language',{ i18n:base.i18n.replace("const urlLang = params.get('lang');","const urlLang = '';") }],
    ['nested',{ app:base.app.replace("event.target.closest('.related-card')","event.target.matches('.related-card')") }],
    ['route',{ html:base.html.replace('href="/idle-clicker/"','href="/unknown/"') }],
    ['zoom',{ html:base.html.replace('initial-scale=1.0','initial-scale=1.0, user-scalable=no') }],
    ['root-cache',{ sw:base.sw.replace("'./index.html'","'/emoji-merge/index.html'") }],
    ['global-cache',{ sw:base.sw.replace('name.startsWith(CACHE_PREFIX) && ','') }],
    ['scope',{ sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)','') }],
    ['success',{ sw:base.sw.replace('if (response.ok)','if (response)') }],
    ['manifest',{ manifest:base.manifest.replace('"scope": "./"','"scope": "/"') }],
    ['locale',{ locales:{ ...base.locales, en:base.locales.en.replace(/^\{/, '{\n  "premium": {},') } }],
    ['readme',{ readme:base.readme + 'x'.repeat(1800) }]
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
  console.log(`[PASS] Emoji Merge suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} exact-once stages`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
