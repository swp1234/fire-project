#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PROJECT = path.join(ROOT, 'projects', 'sky-runner');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const APP_PATH = '/sky-runner/';
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const VIEWPORTS = [
  { name: 'mobile-touch', width: 390, height: 844, input: 'touch' },
  { name: 'desktop-keyboard', width: 1440, height: 900, input: 'keyboard' },
];

function assert(value, message) {
  if (!value) throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function count(text, regex) {
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  return [...text.matchAll(new RegExp(regex.source, flags))].length;
}

function verifySource(projectDir = PROJECT) {
  const index = read(path.join(projectDir, 'index.html'));
  const game = read(path.join(projectDir, 'js', 'game.js'));
  const skins = read(path.join(projectDir, 'js', 'skins-data.js'));
  const css = read(path.join(projectDir, 'css', 'style.css'));
  const worker = read(path.join(projectDir, 'sw.js'));
  const manifest = JSON.parse(read(path.join(projectDir, 'manifest.json')));
  const combined = `${index}\n${game}\n${skins}\n${css}`;

  assert(/<body\b[^>]*data-ad-serving=["']suspended-invalid-traffic-2026-09-03["']/i.test(index), 'Sky Runner suspension marker missing');
  assert(!/pagead2\.googlesyndication\.com|\badsbygoogle\b|\/portal\/js\/game-ads\.js|\bGameAds\b|\badBreak\s*\(/i.test(combined), 'Active ad code conflicts with suspension');
  assert(!/showInterstitialAd|interstitial-overlay|btn-revive|rewarded_ad|watchAdUnlock|ad-banner/i.test(combined), 'Ad reward, revive, unlock, or fake surface remains');
  assert(!/\bpage_engage\b|engagement_time_msec/i.test(combined), 'Synthetic engagement event remains');
  assert(!/aggregateRating|ratingCount|ratingValue/i.test(index), 'Fabricated rating schema remains');
  const schemas = [...index.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  assert(schemas.length === 3, `Sky Runner schema count drifted: ${schemas.length}`);
  for (const [position, match] of schemas.entries()) {
    try { JSON.parse(match[1]); } catch (error) { throw new Error(`Invalid JSON-LD block ${position + 1}: ${error.message}`); }
  }
  assert(/<meta\s+name=["']dateModified["']\s+content=["']2026-09-05["']/i.test(index), 'Sky Runner dateModified drifted');
  assert(/content=["']width=device-width, initial-scale=1\.0["']/i.test(index) && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(index), 'Viewport disables user zoom');

  assert(count(skins, /^\s*id:\s*["'][^"']+["']/gm) === 10, 'Sky Runner must expose exactly 10 real skins');
  assert(/id:\s*["']phoenix["'][\s\S]{0,400}?unlockType:\s*["']score["'][\s\S]{0,100}?unlockValue:\s*2000/.test(skins), 'Phoenix play-based unlock drifted');
  assert(/id:\s*["']stealth["'][\s\S]{0,400}?unlockType:\s*["']play_count["'][\s\S]{0,100}?unlockValue:\s*25/.test(skins), 'Stealth play-based unlock drifted');

  const eventNames = ['sky_runner_view', 'sky_runner_start', 'sky_runner_complete', 'sky_runner_share', 'sky_runner_related_click'];
  for (const eventName of eventNames) {
    assert(count(game, new RegExp(`trackStage\\(\\s*['"]${eventName}['"]`, 'g')) === 1, `Stage event call count drifted: ${eventName}`);
  }
  assert(!/trackStage\([^\n]{0,120}\b(?:score|rank|result|skin|answer)\b/i.test(game), 'Private game value can enter stage telemetry');
  assert(/if\s*\(navigator\.share\)\s*await\s+navigator\.share/.test(game), 'Native share is not success-gated');
  assert(/await\s+navigator\.clipboard\.writeText[\s\S]{0,180}?trackStage\(\s*['"]sky_runner_share['"]/.test(game), 'Clipboard share is not success-gated');
  assert(count(index, /data-sky-related\b/g) === 4 && count(index, /data-target-slug=["'][^"']+["']/g) === 4, 'Focused related route contract drifted');
  const ids = [...index.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  assert(new Set(ids).size === ids.length, 'Duplicate DOM IDs remain');

  const localeDir = path.join(projectDir, 'js', 'locales');
  const files = fs.readdirSync(localeDir).filter((file) => file.endsWith('.json')).sort();
  assert(JSON.stringify(files) === JSON.stringify(LOCALES.map((locale) => `${locale}.json`).sort()), 'Sky Runner locale inventory drifted');
  for (const file of files) {
    const locale = JSON.parse(read(path.join(localeDir, file)));
    assert(!locale.ad, `${file}: retired ad locale block remains`);
    assert(!Object.prototype.hasOwnProperty.call(locale.gameover || {}, 'revive'), `${file}: retired revive copy remains`);
    assert(!Object.prototype.hasOwnProperty.call(locale.skins || {}, 'watchAdUnlock'), `${file}: retired rewarded-skin copy remains`);
  }

  assert(/const\s+CACHE_NAME\s*=\s*['"]sky-runner-v(\d+)['"]/.test(worker), 'Sky Runner cache name missing');
  assert(Number(/sky-runner-v(\d+)/.exec(worker)[1]) >= 5, 'Sky Runner cache version is stale');
  assert(!/^\s*['"]\/(?!\/)/m.test(worker), 'Service worker caches root-absolute assets');
  assert(/request\.method\s*!==\s*['"]GET['"]/.test(worker), 'Service worker method guard missing');
  assert(/requestUrl\.origin\s*!==\s*self\.location\.origin/.test(worker), 'Service worker same-origin guard missing');
  assert(/event\.request\.url\.startsWith\(self\.registration\.scope\)/.test(worker), 'Service worker app-scope guard missing');
  assert(/response\.ok/.test(worker), 'Service worker success guard missing');
  assert(manifest.start_url === '.' && manifest.scope === './', 'Manifest escapes the Sky Runner route');
  assert(count(`${index}\n${game}`, /serviceWorker\.register\(\s*['"]sw\.js['"]\s*\)/g) === 1, 'Service worker registration count drifted');

  return { locales: files.length, skins: 10, events: eventNames.length, adServing: 'suspended' };
}

function resolveTarget(projectDir, requestPath) {
  let base;
  let relative;
  if (requestPath === '/sky-runner') return { redirect: APP_PATH };
  if (requestPath.startsWith(APP_PATH)) {
    base = projectDir;
    relative = requestPath.slice(APP_PATH.length);
  } else if (requestPath.startsWith('/portal/')) {
    base = PORTAL;
    relative = requestPath.slice('/portal/'.length);
  } else return null;
  const target = path.resolve(base, relative || 'index.html');
  assert(target === path.resolve(base) || target.startsWith(`${path.resolve(base)}${path.sep}`), `Unsafe request path: ${requestPath}`);
  return { target };
}

async function startServer(projectDir) {
  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
  const server = http.createServer((request, response) => {
    try {
      const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const resolved = resolveTarget(projectDir, requestPath);
      if (!resolved) return response.writeHead(404).end();
      if (resolved.redirect) return response.writeHead(308, { Location: resolved.redirect }).end();
      let target = resolved.target;
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      fs.createReadStream(target).pipe(response);
    } catch (error) {
      response.writeHead(400).end(error.message);
    }
  });
  const address = await listenOnSafePort(server);
  return { origin: `http://127.0.0.1:${address.port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

function installBrowserState() {
  window.dataLayer = [];
  window.__shareSucceeds = false;
  Object.defineProperty(navigator, 'share', { configurable: true, value: () => window.__shareSucceeds ? Promise.resolve() : Promise.reject(new Error('cancelled')) });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.resolve() } });
  window.alert = () => {};
  localStorage.setItem('language', 'en');
  localStorage.removeItem('skyrunner_data');
}

async function eventEntries(page) {
  return page.evaluate(() => (window.dataLayer || []).map((entry) => {
    try { return Array.from(entry); } catch (error) { return []; }
  }).filter((entry) => entry[0] === 'event').map((entry) => ({ name: entry[1], params: entry[2] || {} })));
}

async function verifyViewport(browser, origin, viewport) {
  const context = await browser.newContext({ hasTouch: viewport.input === 'touch', serviceWorkers: 'block', viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.addInitScript(installBrowserState);
  await page.route('**/*', async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.origin === origin) return route.continue();
    const type = route.request().resourceType() === 'script' ? 'application/javascript' : 'text/plain';
    return route.fulfill({ status: 200, contentType: type, body: '' });
  });
  try {
    const response = await page.goto(`${origin}${APP_PATH}?lang=en&verifySuspension=1`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    assert(response && response.ok(), `${viewport.name}: document failed to load`);
    await page.waitForFunction(() => !document.getElementById('app-loader') || getComputedStyle(document.getElementById('app-loader')).display === 'none', null, { timeout: 6000 });
    assert(await page.locator('body[data-ad-serving="suspended-invalid-traffic-2026-09-03"]').count() === 1, `${viewport.name}: suspension marker missing at runtime`);
    assert(await page.locator('script[src*="pagead2"], script[src*="game-ads"], ins.adsbygoogle, [data-ad-slot], .ad-banner, #interstitial-overlay, #btn-revive').count() === 0, `${viewport.name}: ad or reward surface rendered`);
    assert(await page.evaluate(() => typeof GameAds === 'undefined'), `${viewport.name}: GameAds API available`);
    const overflow = await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth);
    assert(overflow <= 0, `${viewport.name}: horizontal overflow ${overflow}px`);
    const targets = await page.locator('button:visible, a[data-sky-related]:visible').evaluateAll((elements) => elements.map((element) => { const rect = element.getBoundingClientRect(); return { width: rect.width, height: rect.height, id: element.id || element.dataset.targetSlug || element.tagName }; }));
    for (const target of targets) assert(target.width >= 44 && target.height >= 44, `${viewport.name}: target below 44px (${target.id}: ${target.width}x${target.height})`);

    let events = await eventEntries(page);
    assert(events.filter((event) => event.name === 'sky_runner_view').length === 1, `${viewport.name}: view event not exact-once`);
    await page.locator('#btn-start').click();
    if (viewport.input === 'keyboard') await page.keyboard.press('Space');
    else await page.locator('#game-canvas').tap({ position: { x: 100, y: 100 } });
    await page.waitForFunction(() => !document.getElementById('gameover-screen').classList.contains('hidden'), null, { timeout: 6000 });
    events = await eventEntries(page);
    assert(events.filter((event) => event.name === 'sky_runner_start').length === 1, `${viewport.name}: start event not exact-once`);
    assert(events.filter((event) => event.name === 'sky_runner_complete').length === 1, `${viewport.name}: complete event not exact-once`);
    assert(await page.locator('#gameover-screen button').filter({ hasText: /watch|ad|revive/i }).count() === 0, `${viewport.name}: rewarded revive returned`);

    await page.locator('#btn-share').click();
    await page.waitForTimeout(50);
    events = await eventEntries(page);
    assert(events.filter((event) => event.name === 'sky_runner_share').length === 0, `${viewport.name}: cancelled share was recorded`);
    await page.evaluate(() => { window.__shareSucceeds = true; });
    await page.locator('#btn-share').click();
    await page.waitForFunction(() => (window.dataLayer || []).some((entry) => Array.from(entry)[1] === 'sky_runner_share'));

    await page.locator('[data-sky-related][data-target-slug="road-shooter"]').evaluate((link) => {
      link.addEventListener('click', (event) => event.preventDefault(), { once: true });
      link.click();
    });
    events = await eventEntries(page);
    assert(events.filter((event) => event.name === 'sky_runner_share').length === 1, `${viewport.name}: successful share not exact-once`);
    const related = events.filter((event) => event.name === 'sky_runner_related_click');
    assert(related.length === 1 && related[0].params.target_slug === 'road-shooter', `${viewport.name}: related click contract failed`);
    for (const event of events) {
      const keys = Object.keys(event.params);
      assert(!keys.some((key) => /score|rank|result|skin|answer/i.test(key)), `${viewport.name}: private telemetry key ${keys.join(',')}`);
    }
    assert(errors.length === 0, `${viewport.name}: Runtime errors: ${errors.join(' | ')}`);
  } finally {
    await context.close();
  }
}

async function verifyRuntime(projectDir = PROJECT, viewports = VIEWPORTS, externalOrigin = null) {
  const server = externalOrigin ? null : await startServer(projectDir);
  const origin = externalOrigin ? new URL(externalOrigin).origin : server.origin;
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) await verifyViewport(browser, origin, viewport);
  } finally {
    await browser.close();
    if (server) await server.close();
  }
  return { viewports: viewports.map((viewport) => viewport.name) };
}

async function verifyProject(options = {}) {
  const projectDir = path.resolve(options.projectDir || PROJECT);
  const source = verifySource(projectDir);
  const runtime = options.runtime === false ? { viewports: [] } : await verifyRuntime(projectDir, options.viewports || VIEWPORTS, options.origin || null);
  return { source, runtime };
}

function replaceRequired(source, pattern, replacement, name) {
  const result = source.replace(pattern, replacement);
  assert(result !== source, `Mutation setup failed: ${name}`);
  return result;
}

function mutate(projectDir, relative, transform) {
  const file = path.join(projectDir, relative);
  fs.writeFileSync(file, transform(read(file)), 'utf8');
}

const MUTATIONS = [
  ['marker-removed', 'suspension marker missing', false, (dir) => mutate(dir, 'index.html', (s) => s.replace(' data-ad-serving="suspended-invalid-traffic-2026-09-03"', ''))],
  ['loader-returned', 'Active ad code', false, (dir) => mutate(dir, 'index.html', (s) => s.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=x"></script></head>'))],
  ['reward-revive-returned', 'Ad reward, revive', false, (dir) => mutate(dir, 'index.html', (s) => s.replace('</main>', '<button id="btn-revive">Watch Ad & Revive</button></main>'))],
  ['game-ads-returned', 'Active ad code', false, (dir) => mutate(dir, 'js/game.js', (s) => `${s}\nGameAds.showRewarded({onReward(){}});`)],
  ['rating-returned', 'Fabricated rating', false, (dir) => mutate(dir, 'index.html', (s) => s.replace('</head>', '<script type="application/ld+json">{"@type":"AggregateRating","ratingValue":5}</script></head>'))],
  ['synthetic-engagement', 'Synthetic engagement', false, (dir) => mutate(dir, 'index.html', (s) => s.replace('</body>', '<script>gtag("event","page_engage",{engagement_time_msec:5000})</script></body>'))],
  ['score-telemetry', 'Private game value', false, (dir) => mutate(dir, 'js/game.js', (s) => replaceRequired(s, "trackStage('sky_runner_complete');", "trackStage('sky_runner_complete', score);", 'score-telemetry'))],
  ['premature-share', 'Native share is not success-gated', false, (dir) => mutate(dir, 'js/game.js', (s) => replaceRequired(s, 'if (navigator.share) await navigator.share', 'if (navigator.share) navigator.share', 'premature-share'))],
  ['rewarded-skin', 'Ad reward, revive', false, (dir) => mutate(dir, 'js/skins-data.js', (s) => replaceRequired(s, 'unlockType: "score",', 'unlockType: "rewarded_ad",', 'rewarded-skin'))],
  ['root-cache', 'root-absolute assets', false, (dir) => mutate(dir, 'sw.js', (s) => replaceRequired(s, "    './index.html',", "    '/index.html',", 'root-cache'))],
  ['scope-guard-removed', 'app-scope guard missing', false, (dir) => mutate(dir, 'sw.js', (s) => s.replace(' || !event.request.url.startsWith(self.registration.scope)', ''))],
  ['stale-cache', 'cache version is stale', false, (dir) => mutate(dir, 'sw.js', (s) => s.replace('sky-runner-v5', 'sky-runner-v4'))],
  ['missing-complete-event', 'Stage event call count drifted', false, (dir) => mutate(dir, 'js/game.js', (s) => s.replace("trackStage('sky_runner_complete');", ''))],
  ['undersized-start', 'target below 44px', true, (dir) => mutate(dir, 'css/style.css', (s) => `${s}\n#btn-start { height:20px!important; min-height:0!important; padding:0!important; }`)],
  ['mobile-overflow', 'horizontal overflow', true, (dir) => mutate(dir, 'css/style.css', (s) => `${s}\nbody { min-width:900px!important; }`)],
  ['runtime-exception', 'Runtime errors', true, (dir) => mutate(dir, 'js/game.js', (s) => `${s}\nsetTimeout(() => { throw new Error('sky-runner-mutation'); }, 0);`)],
];

async function runMutations() {
  const safeRoot = path.join(os.tmpdir(), 'dopabrain-sky-runner-suspension');
  fs.mkdirSync(safeRoot, { recursive: true });
  const temp = fs.mkdtempSync(`${safeRoot}${path.sep}`);
  const results = [];
  try {
    await verifyProject();
    console.log('[PASS] baseline');
    for (const [name, expected, runtime, apply] of MUTATIONS) {
      const fixture = path.join(temp, name);
      fs.cpSync(PROJECT, fixture, { recursive: true, filter: (entry) => path.basename(entry) !== '.git' });
      apply(fixture);
      try {
        await verifyProject({ projectDir: fixture, runtime, viewports: [VIEWPORTS[0]] });
        results.push([name, false, 'verifier incorrectly passed']);
      } catch (error) {
        results.push([name, error.message.includes(expected), error.message]);
      }
    }
  } finally {
    const resolved = path.resolve(temp);
    assert(resolved.startsWith(`${path.resolve(safeRoot)}${path.sep}`), `Unsafe cleanup path: ${resolved}`);
    await fs.promises.rm(resolved, { recursive: true, force: true, maxRetries: 10 });
  }
  for (const [name, ok, message] of results) console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}: ${message}`);
  const failed = results.filter((result) => !result[1]);
  console.log(`Mutation summary: ${results.length - failed.length}/${results.length} detected`);
  assert(failed.length === 0, `Sky Runner mutations failed: ${failed.map((result) => result[0]).join(', ')}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--mutations') return runMutations();
  if (args.length === 2 && args[0] === '--url') {
    const result = await verifyProject({ origin: new URL(args[1]).origin });
    console.log(`[PASS] Sky Runner production: ${result.source.locales} locales, ${result.runtime.viewports.length} viewports, ads ${result.source.adServing}`);
    return;
  }
  assert(args.length === 0, 'Usage: verify-sky-runner-suspension.js [--mutations | --url https://dopabrain.com]');
  const result = await verifyProject();
  console.log(`[PASS] Sky Runner: ${result.source.locales} locales, ${result.source.skins} skins, ${result.runtime.viewports.length} viewports, ads ${result.source.adServing}`);
}

if (require.main === module) main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });

module.exports = { MUTATIONS, verifyProject, verifyRuntime, verifySource };
