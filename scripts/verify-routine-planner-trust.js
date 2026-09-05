#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'routine-planner');
const ROUTE = '/routine-planner/';
const LANGS = ['ko', 'en', 'ja', 'zh', 'es', 'pt', 'id', 'tr', 'de', 'fr', 'hi', 'ru'];
const EVENTS = ['routine_planner_view', 'routine_plan_create', 'routine_timer_start', 'routine_task_complete', 'routine_export', 'routine_share_success', 'routine_related_click'];
const ok = (value, message) => { if (!value) throw new Error(message); };
const read = (file) => fs.readFileSync(path.join(APP, file), 'utf8');

function baseline() {
  return {
    html: read('index.html'), app: read('js/app.js'), worker: read('sw.js'),
    manifest: JSON.parse(read('manifest.json')), readme: read('README.md'),
    locales: Object.fromEntries(LANGS.map((lang) => [lang, JSON.parse(read(`js/locales/${lang}.json`))])),
  };
}

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function verifySource(source = baseline()) {
  ok(/data-release-contract="routine-planner-trust-2026-09-05"/.test(source.html), 'release contract missing');
  ok(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(source.html), 'invalid-traffic suspension marker missing');
  ok(/name="dateModified" content="2026-09-05"/.test(source.html), 'dateModified drifted');
  ok(!/pagead2|adsbygoogle|data-ad-slot|page_engage|content_ad_impression/i.test(source.html + source.app), 'active/manual ads or synthetic telemetry returned');
  ok(!/FAQPage|aggregateRating|ratingCount|ratingValue/.test(source.html), 'fabricated or hidden structured proof returned');
  ok(!/premium-ai|watchAdOrBuy|showAIPremiumAd|aiOptimization|aiDescription/i.test(source.html + source.app + JSON.stringify(source.locales)), 'fake AI, premium, or ad gate returned');
  const types = schemas(source.html).map((schema) => schema['@type']).sort();
  ok(JSON.stringify(types) === JSON.stringify(['BreadcrumbList', 'WebApplication']), `schema types drifted: ${types.join(', ')}`);
  ok(/routine\.boundary/.test(source.html), 'visible local-storage boundary missing');
  ok(Object.keys(source.locales).length === 12, 'locale inventory drifted');
  for (const [lang, locale] of Object.entries(source.locales)) {
    ok(typeof locale.routine?.boundary === 'string' && locale.routine.boundary.length >= 35, `${lang} local-storage boundary missing`);
    ok(!locale.premium && !locale.button?.watchAdOrBuy, `${lang} fake premium copy returned`);
  }
  for (const event of EVENTS) ok(source.app.includes(`trackRoutineStage('${event}')`), `event missing: ${event}`);
  ok(/ROUTINE_SOURCES = new Set\(\['direct', 'en_stress_habit_quick', 'es_stress_habit_quick', 'zh_stress_habit_quick'\]\)/.test(source.app), 'entry source allowlist drifted');
  ok(!/routine_name|routine_duration|template_name|completed_count|wakeup_time|date_key|share_url/.test(source.app), 'private or high-cardinality telemetry key returned');
  ok(/escapeHTML\(routine\.name\)/.test(source.app) && /escapeHTML\(r\.name\)/.test(source.app), 'user routine text is not escaped');
  ok(/Math\.min\(180, Math\.max\(1, parseInt/.test(source.app), 'routine duration is not clamped');
  ok(/await navigator\.share/.test(source.app) && /await navigator\.clipboard\.writeText/.test(source.app), 'share success is not awaited');
  ok(/new URL\('\/routine-planner\/', window\.location\.origin\)/.test(source.app), 'neutral canonical share URL missing');
  ok(/register\('\.\/sw\.js', \{ scope: '\.\/' \}\)/.test(source.app), 'service-worker registration scope drifted');
  ok(/name\.startsWith\('routine-planner'\)/.test(source.worker), 'cache deletion is not product-scoped');
  ok(/event\.request\.method !== 'GET'/.test(source.worker) && /url\.origin !== self\.location\.origin/.test(source.worker) && /url\.pathname\.startsWith\('\/routine-planner\/'\)/.test(source.worker), 'service-worker request boundary drifted');
  ok(/!response\.ok \|\| response\.type !== 'basic'/.test(source.worker), 'service-worker success guard drifted');
  ok(!/addEventListener\(['"](?:sync|push|notificationclick)/.test(source.worker), 'background notification behavior returned');
  ok(source.manifest.start_url === './' && source.manifest.scope === './', 'manifest escaped app scope');
  ok(Buffer.byteLength(source.readme) <= 1200 && /fixed stage names/.test(source.readme), 'README is stale or oversized');
  return { locales: 12, schemas: 2, events: EVENTS.length, readmeBytes: Buffer.byteLength(source.readme), adServing: 'suspended' };
}

function mutations() {
  const source = baseline();
  const cases = [
    ['marker', { html: source.html.replace('suspended-invalid-traffic-2026-09-03', 'active') }],
    ['ad', { html: source.html.replace('</head>', '<ins class="adsbygoogle" data-ad-slot="auto"></ins></head>') }],
    ['rating', { html: source.html.replace('</head>', '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script></head>') }],
    ['premium', { app: `${source.app}\nshowAIPremiumAd()` }],
    ['boundary', { locales: { ...source.locales, en: { ...source.locales.en, routine: { ...source.locales.en.routine, boundary: '' } } } }],
    ['event', { app: source.app.replace("trackRoutineStage('routine_timer_start');", '') }],
    ['private', { app: `${source.app}\nconst routine_name = 'private';` }],
    ['escape', { app: source.app.replace('escapeHTML(routine.name)', 'routine.name') }],
    ['duration', { app: source.app.replace('Math.min(180, Math.max(1, parseInt', 'parseInt') }],
    ['share', { app: source.app.replace('await navigator.share(data)', 'navigator.share(data)') }],
    ['cache', { worker: source.worker.replace("name.startsWith('routine-planner')", 'name.length > 0') }],
    ['scope', { worker: source.worker.replace("url.pathname.startsWith('/routine-planner/')", 'true') }],
    ['sync', { worker: `${source.worker}\nself.addEventListener('sync', () => {});` }],
    ['manifest', { manifest: { ...source.manifest, scope: '/' } }],
    ['readme', { readme: `${source.readme}${'x'.repeat(1200)}` }],
  ];
  for (const [name, override] of cases) {
    let caught = false;
    try { verifySource({ ...source, ...override }); } catch (error) { caught = true; console.log(`[PASS] ${name}: ${error.message}`); }
    ok(caught, `mutation escaped: ${name}`);
  }
  console.log(`[PASS] mutation summary ${cases.length}/${cases.length} detected`);
}

async function server() {
  const instance = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      if (!pathname.startsWith(ROUTE)) return response.writeHead(404).end();
      let file = path.resolve(APP, pathname.slice(ROUTE.length) || 'index.html');
      ok(file === APP || file.startsWith(`${APP}${path.sep}`), `unsafe path: ${pathname}`);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) return response.writeHead(404).end();
      const ext = path.extname(file);
      const type = ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : ext === '.json' ? 'application/json' : ext === '.svg' ? 'image/svg+xml' : 'text/html; charset=utf-8';
      response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      response.end(fs.readFileSync(file));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(instance);
  return { origin: `http://127.0.0.1:${address.port}`, close: () => new Promise((resolve) => instance.close(resolve)) };
}

function eventRows(rows) {
  return rows.map((row) => Array.from(row)).filter((row) => row[0] === 'event').map((row) => ({ name: row[1], params: row[2] }));
}

async function verifyPage(page, origin, lang, width = 390) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${origin}${ROUTE}?lang=${lang}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.lang && !document.querySelector('#app-loader') && document.querySelector('.privacy-note')?.textContent !== 'routine.boundary');
  const result = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    boundary: document.querySelector('.privacy-note')?.textContent.trim(),
    overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    controls: [...document.querySelectorAll('button')].map((node) => {
      const box = node.getBoundingClientRect(); return { id: node.id || node.className, width: box.width, height: box.height };
    }).filter((control) => control.width > 0 && control.height > 0),
  }));
  ok(result.lang === lang && result.boundary.length >= 35, `${lang} locale did not initialize`);
  ok(result.overflow <= 0, `${lang}/${width}px horizontal overflow: ${result.overflow}`);
  const small = result.controls.find((control) => control.width < 44 || control.height < 44);
  ok(!small, `${lang}/${width}px control below 44px: ${JSON.stringify(small)}`);
  ok(errors.length === 0, `${lang} runtime errors: ${errors.join('; ')}`);
}

async function runtime(origin) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const lang of LANGS) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
      await verifyPage(page, origin, lang);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: async (data) => { window.__shared = data; }, configurable: true }));
    await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
    await page.goto(`${origin}${ROUTE}?lang=en&surface=en_stress_habit_quick`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !document.querySelector('#app-loader') && document.querySelector('.privacy-note')?.textContent.startsWith('Your routine'));
    await page.click('#add-routine-btn');
    await page.fill('#routine-name', '<img src=x onerror=window.__xss=1>Private routine');
    await page.fill('#routine-duration', '999');
    await page.click('#add-routine-confirm');
    await page.click('[data-tab="templates"]');
    await page.click('.btn-template[data-template="health"]');
    await page.click('[data-tab="templates"]');
    await page.click('.btn-template[data-template="health"]');
    await page.click('.routine-checkbox');
    await page.click('[data-tab="timer"]');
    const option = await page.locator('#timer-routine-select option').nth(1).getAttribute('value');
    await page.selectOption('#timer-routine-select', option);
    await page.click('#timer-start-btn');
    await page.click('#settings-toggle');
    await page.click('#export-btn');
    await page.click('#close-settings');
    await page.click('.share-btn');
    await page.evaluate(() => document.querySelector('[data-routine-related]').addEventListener('click', (event) => event.preventDefault()));
    await page.click('[data-routine-related]');
    const result = await page.evaluate(() => ({
      events: (window.dataLayer || []).map((row) => Array.from(row)),
      xss: window.__xss || 0,
      injectedNode: !!document.querySelector('.routine-name img'),
      shared: window.__shared,
      duration: app.routines[0]?.duration,
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    }));
    const events = eventRows(result.events).filter((event) => EVENTS.includes(event.name));
    for (const name of EVENTS) ok(events.filter((event) => event.name === name).length === 1, `${name} is not exact-once: ${JSON.stringify(events)}`);
    for (const event of events) {
      ok(JSON.stringify(Object.keys(event.params).sort()) === JSON.stringify(['entry_source', 'event_category', 'page_language']), `${event.name} parameter drift: ${Object.keys(event.params)}`);
      ok(event.params.entry_source === 'en_stress_habit_quick', `${event.name} source attribution drifted`);
      ok(!JSON.stringify(event).includes('Private routine'), `${event.name} leaked routine text`);
    }
    ok(result.xss === 0 && !result.injectedNode, 'routine name executed or rendered as HTML');
    ok(result.duration >= 1 && result.duration <= 180, `duration clamp failed: ${result.duration}`);
    ok(result.shared?.url === `${origin}${ROUTE}?lang=en`, `neutral share URL drifted: ${result.shared?.url}`);
    ok(result.overflow <= 0, `desktop horizontal overflow: ${result.overflow}`);
    await page.close();
  } finally { await browser.close(); }
}

async function production(origin) {
  const files = ['index.html', 'css/style.css', 'js/app.js', 'js/i18n.js', 'sw.js', 'manifest.json', ...LANGS.map((lang) => `js/locales/${lang}.json`)];
  await Promise.all(files.map(async (file) => {
    const blob = spawnSync('git', ['cat-file', 'blob', `origin/master:${file}`], { cwd: APP });
    ok(blob.status === 0, `cannot read deployed blob: ${file}`);
    const response = await fetch(`${origin}${ROUTE}${file === 'index.html' ? '' : file}?routine-trust=20260905`, { cache: 'no-store' });
    ok(response.status === 200, `production returned ${response.status}: ${file}`);
    ok(Buffer.from(await response.arrayBuffer()).equals(blob.stdout), `production bytes differ: ${file}`);
  }));
  console.log(`[PASS] production byte parity: ${files.length}/${files.length}`);
}

async function main() {
  const result = verifySource();
  if (process.argv.includes('--mutations')) mutations();
  const index = process.argv.indexOf('--url');
  if (index >= 0) {
    const origin = process.argv[index + 1].replace(/\/$/, '');
    await production(origin);
    await runtime(origin);
    console.log(`[PASS] Routine Planner production: ${JSON.stringify(result)}`);
    return;
  }
  const local = await server();
  try { await runtime(local.origin); } finally { await local.close(); }
  console.log(`[PASS] Routine Planner local: ${JSON.stringify(result)}`);
}

main().catch((error) => { console.error(`[FAIL] ${error.message}`); process.exitCode = 1; });
