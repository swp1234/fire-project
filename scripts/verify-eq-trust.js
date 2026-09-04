#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'eq-test');
const LIVE_ORIGIN = 'https://dopabrain.com';
const ROUTE = '/eq-test/';
const LANGS = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const LINKED_SURFACES = [
  'es_emotional_regulation_sticky',
  'es_emotional_regulation_quick',
  'es_emotional_regulation_cta'
];
const EVENTS = [
  'eq_test_start',
  'eq_test_complete',
  'eq_result_action_view',
  'eq_next_click',
  'eq_related_click',
  'eq_test_retry'
];

function assert(value, message) {
  if (!value) throw new Error(message);
}

function read(relative) {
  return fs.readFileSync(path.join(APP, relative), 'utf8');
}

function count(source, regex) {
  return (String(source).match(regex) || []).length;
}

function fixture() {
  return {
    html: read('index.html'),
    i18n: read('js/i18n.js'),
    sw: read('sw.js'),
    manifest: read('manifest.json'),
    locales: Object.fromEntries(LANGS.map(lang => [lang, read(`js/locales/${lang}.json`)]))
  };
}

function verifySource(value) {
  const bundle = `${value.html}\n${value.i18n}`;
  assert(value.html.includes('data-eq-test-contract="2026-09-03"'), 'release contract missing');
  assert(value.html.includes('data-ad-serving="suspended-invalid-traffic-2026-09-03"'), 'invalid-traffic suspension marker missing');
  const sanitizer = value.html.indexOf("const languages = new Set");
  const external = value.html.indexOf('<script async src="https://www.googletagmanager.com');
  assert(sanitizer >= 0 && external >= 0 && sanitizer < external, 'query sanitizer must precede external scripts');
  for (const surface of LINKED_SURFACES) assert(value.html.includes(surface), `linked surface missing: ${surface}`);
  assert(!/pagead2\.googlesyndication\.com|<ins[^>]+adsbygoogle|\badsbygoogle\b|data-ad-slot=|data-ad-surface=/.test(bundle), 'active or manual ad code conflicts with suspension');
  assert(count(value.html, /\bid:\s*\d+,\s*type:/g) === 10, 'exactly 10 fixed scenarios required');
  assert(/scores:\s*\[[0-3],\s*[0-3],\s*[0-3],\s*[0-3]\]/.test(value.html), 'published 0–3 scoring implementation missing');
  assert(value.html.includes('data-i18n="intro.method"') && value.html.includes('data-i18n="result.boundary"'), 'visible method or result boundary missing');
  assert(value.html.includes("$('score-max').textContent = '/ 30'"), 'scenario total denominator missing');
  assert(/document\.createElement\('button'\)/.test(value.html) && /card\.type = 'button'/.test(value.html), 'answer choices are not native buttons');
  assert(/requestAnimationFrame\(\(\) => \$\('scene-question'\)\.focus\(\)\)/.test(value.html), 'round focus management missing');
  assert(count(value.html, /class="related-card"/g) === 2, 'result must keep exactly two related choices');
  const action = value.html.indexOf('id="result-primary-action"');
  const details = value.html.indexOf('id="dim-bars"');
  assert(action >= 0 && details >= 0 && action < details, 'primary next action must precede result details');
  assert(!/FAQPage|AggregateRating|premium|ai-analysis|percentile|btn-save-card|btn-twitter|btn-copy|ResultCard|cross-promo\.js|Math\.random|page_engage|eq_result_ad_impression/.test(bundle), 'fabricated proof, gated result, sharing, or synthetic telemetry returned');
  for (const event of EVENTS) assert(count(value.html, new RegExp(`['"]${event}['"]`, 'g')) === 1, `event must have one call site: ${event}`);
  assert(!/eq_total|eq_level|answer_id|answer_text|result_band|share_url|destination\s*:|target_label\s*:/.test(value.html), 'private or high-cardinality telemetry key returned');
  assert(/if \(quizRunning\) return/.test(value.html), 'duplicate start guard missing');
  assert(/intersectionRatio >= 0\.5/.test(value.html) && /}, 500\)/.test(value.html) && /clearTimeout\(dwellTimer\)/.test(value.html), 'qualified result action exposure missing');
  assert(/CACHE_NAME = 'eq-test-v3'/.test(value.sw), 'service-worker cache version drifted');
  assert(/APP_SCOPE = '\/eq-test\/'/.test(value.sw) && /event\.request\.method !== 'GET'/.test(value.sw), 'service-worker method/scope guard missing');
  assert(/requestUrl\.origin !== self\.location\.origin/.test(value.sw) && /requestUrl\.pathname\.startsWith\(APP_SCOPE\)/.test(value.sw), 'service-worker origin/path guard missing');
  assert(/!response\.ok/.test(value.sw), 'service-worker can cache unsuccessful responses');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === ROUTE && manifest.start_url === ROUTE, 'manifest scope/start URL drifted');
  assert(/10 fixed emotional scenarios/.test(manifest.description), 'manifest retains a false test description');
  for (const lang of LANGS) {
    const text = value.locales[lang];
    const locale = JSON.parse(text);
    assert(!text.includes('\uFFFD'), `${lang} locale contains replacement characters`);
    assert(locale.intro?.method && locale.intro?.disclaimer && locale.result?.boundary && locale.result?.nextPrompt, `${lang} trust/action copy missing`);
    assert(!locale.level && !locale.share && !locale.premium && !locale.ai && !locale.result.percentileStat, `${lang} stale fabricated-result copy returned`);
    assert(Object.keys(locale.related || {}).sort().join(',') === 'attachmentStyle,hspTest,stressCheck', `${lang} related copy is not focused`);
  }
  const schemas = Array.from(value.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g), match => JSON.parse(match[1]));
  assert(schemas.map(schema => schema['@type']).join(',') === 'WebApplication,BreadcrumbList', 'schema types drifted');
  assert(schemas[0].dateModified === '2026-09-03' && !JSON.stringify(schemas).includes('aggregateRating'), 'schema trust/date contract drifted');
  const mainScript = Array.from(value.html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g), match => match[1]).find(script => script.includes('const SCENES'));
  assert(mainScript, 'main inline script missing');
  new Function(mainScript);
  return { scenarios: 10, locales: LANGS.length, related: 2, events: EVENTS.length, adServing: 'suspended' };
}

function runMutations() {
  const cases = [
    ['release-contract', value => { value.html = value.html.replace('data-eq-test-contract', 'broken-contract'); }],
    ['suspension-marker', value => { value.html = value.html.replace('data-ad-serving', 'broken-ad-serving'); }],
    ['active-loader', value => { value.html = value.html.replace('</head>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=bad"></script></head>'); }],
    ['manual-ad', value => { value.html = value.html.replace('<body>', '<body><ins class="adsbygoogle" data-ad-slot="1"></ins>'); }],
    ['manual-push', value => { value.html = value.html.replace('</body>', '<script>adsbygoogle.push({})</script></body>'); }],
    ['scenario-count', value => { value.html = value.html.replace('id: 10, type:', 'removed: 10, type:'); }],
    ['method-boundary', value => { value.html = value.html.replace('data-i18n="intro.method"', 'data-i18n="removed.method"'); }],
    ['native-option', value => { value.html = value.html.replace("document.createElement('button')", "document.createElement('div')"); }],
    ['round-focus', value => { value.html = value.html.replace("requestAnimationFrame(() => $('scene-question').focus());", ''); }],
    ['action-hierarchy', value => { value.html = value.html.replace('id="result-primary-action"', 'id="removed-primary-action"'); }],
    ['related-focus', value => { value.html = value.html.replace('class="related-card"', 'class="removed-card"'); }],
    ['fake-percentile', value => { value.html = value.html.replace('<body>', '<body><p id="percentile">Top 1%</p>'); }],
    ['event-contract', value => { value.html = value.html.replace("'eq_next_click'", "'removed_next_click'"); }],
    ['private-telemetry', value => { value.html = value.html.replace("{ content_type: 'reflection'", "{ eq_total: total, content_type: 'reflection'"); }],
    ['duplicate-start', value => { value.html = value.html.replace('if (quizRunning) return;', ''); }],
    ['easy-exposure', value => { value.html = value.html.replace('intersectionRatio >= 0.5', 'intersectionRatio >= 0'); }],
    ['unsafe-worker', value => { value.sw = value.sw.replace("APP_SCOPE = '/eq-test/'", "APP_SCOPE = '/'"); }],
    ['stale-locale', value => { value.locales.en = value.locales.en.replace('"boundary"', '"removedBoundary"'); }],
    ['manifest-claim', value => { value.manifest = value.manifest.replace('10 fixed emotional scenarios', '40 measured questions'); }],
    ['fake-schema', value => { value.html = value.html.replace('"offers":', '"aggregateRating":{"ratingValue":"5"},"offers":'); }]
  ];
  for (const [name, mutate] of cases) {
    const value = fixture();
    mutate(value);
    try {
      verifySource(value);
    } catch (error) {
      console.log(`[PASS] ${name}: ${error.message}`);
      continue;
    }
    throw new Error(`mutation escaped: ${name}`);
  }
  console.log(`[PASS] mutation summary ${cases.length}/${cases.length} detected`);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, 'http://local');
    let relative;
    try {
      relative = decodeURIComponent(url.pathname).replace(/^\/eq-test\/?/, '');
    } catch {
      response.writeHead(400).end();
      return;
    }
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const file = path.resolve(APP, relative);
    if (!file.startsWith(`${APP}${path.sep}`) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(response);
  });
}

async function isolate(page) {
  for (const route of ['**/googletagmanager.com/**', '**/google-analytics.com/**', '**/googlesyndication.com/**', '**/doubleclick.net/**']) {
    await page.route(route, request => request.abort());
  }
}

async function getEvents(page) {
  return page.evaluate(() => (window.dataLayer || [])
    .map(row => Array.from(row || []))
    .filter(row => row[0] === 'event')
    .map(row => ({ name: row[1], params: row[2] || {} })));
}

async function completeJourney(page) {
  await page.evaluate(() => {
    const button = document.querySelector('#btn-start');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForSelector('#screen-scene.active');
  for (let index = 0; index < 10; index += 1) {
    await page.click('.option-card:first-child');
    if (index < 9) {
      await page.waitForFunction(expected => document.querySelector('#progress-label')?.textContent.trim() === `${expected} / 10`, index + 2);
      await page.waitForFunction(() => document.activeElement?.id === 'scene-question');
    }
  }
  await page.waitForSelector('#screen-result.active');
}

async function verifyRuntime(live) {
  let server;
  let origin = LIVE_ORIGIN;
  if (!live) {
    server = createServer();
    origin = `http://127.0.0.1:${(await listenOnSafePort(server)).port}`;
  }
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: 'block' });
      await context.addInitScript(() => {
        const nativeSetTimeout = window.setTimeout.bind(window);
        window.setTimeout = (handler, delay, ...args) => nativeSetTimeout(handler, delay === 1400 ? 0 : delay, ...args);
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await isolate(page);
      await page.goto(`${origin}${ROUTE}?lang=en&eq_score=30&utm_source=bad#private`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => typeof i18n !== 'undefined' && i18n.initialized && document.documentElement.lang === 'en');
      assert(new URL(page.url()).search === '?lang=en' && new URL(page.url()).hash === '', `${width}px query/hash sanitizer failed`);
      assert(await page.locator('script[src*="pagead2"],ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').count() === 0, `${width}px ad code rendered during suspension`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${width}px intro overflow`);
      assert((await page.locator('#btn-start').evaluate(element => element.getBoundingClientRect().height)) >= 44, `${width}px start target below 44px`);
      await completeJourney(page);
      assert(await page.locator('.option-card').first().evaluate(element => element.tagName) === 'BUTTON', `${width}px options are not buttons`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${width}px result overflow`);
      assert(await page.locator('#result-primary-action').evaluate(element => element.getBoundingClientRect().top) < await page.locator('#dim-bars').evaluate(element => element.getBoundingClientRect().top), `${width}px result action hierarchy failed`);
      await page.locator('#result-primary-action').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => (window.dataLayer || []).map(row => Array.from(row || [])).filter(row => row[0] === 'event' && row[1] === 'eq_result_action_view').length === 1, null, { timeout: 8000 });
      await page.evaluate(() => {
        for (const link of document.querySelectorAll('#btn-next,.related-card')) link.addEventListener('click', event => event.preventDefault());
        document.querySelector('#btn-next').click();
        document.querySelector('#btn-next').click();
        for (const link of document.querySelectorAll('.related-card')) {
          link.click();
          link.click();
        }
      });
      await page.click('#lang-btn');
      await page.click('.lang-option[data-lang="ko"]');
      await page.waitForFunction(() => document.documentElement.lang === 'ko');
      const events = await getEvents(page);
      for (const name of ['eq_test_start', 'eq_test_complete', 'eq_result_action_view', 'eq_next_click']) {
        assert(events.filter(event => event.name === name).length === 1, `${width}px ${name} must fire once`);
      }
      assert(events.filter(event => event.name === 'eq_related_click').length === 2, `${width}px related clicks must fire once per target`);
      const keys = events.flatMap(event => Object.keys(event.params));
      assert(!keys.some(key => /(answer|score|result|level|destination|url|label)/i.test(key)), `${width}px private/high-cardinality event key leaked`);
      assert(errors.length === 0, `${width}px runtime errors: ${errors.join('; ')}`);
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    await isolate(page);
    for (const lang of LANGS) {
      await page.goto(`${origin}${ROUTE}?lang=${lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(expected => typeof i18n !== 'undefined' && i18n.initialized && document.documentElement.lang === expected, lang);
      const copy = await page.locator('[data-i18n="intro.method"]').textContent();
      assert(copy && copy !== 'intro.method' && copy.length > 20, `${lang} method copy failed`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${lang} intro overflow`);
    }
    await page.goto(`${origin}${ROUTE}?lang=es&start=1&surface=es_emotional_regulation_cta&bad=drop`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-scene.active');
    assert(new URL(page.url()).search === '?lang=es&start=1&surface=es_emotional_regulation_cta', 'linked sanitizer failed');
    const linkedEvents = await getEvents(page);
    assert(linkedEvents.filter(event => event.name === 'eq_test_start').length === 1, 'linked auto-start duplicated');
    await context.close();
    return { origin, viewports: 2, locales: LANGS.length, linkedStart: true, adServing: 'suspended' };
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const urlIndex = args.indexOf('--url');
  const live = urlIndex >= 0 ? args[urlIndex + 1] : '';
  if (live && new URL(live).origin !== LIVE_ORIGIN) throw new Error('live origin mismatch');
  const source = verifySource(fixture());
  if (args.includes('--mutations')) runMutations();
  const runtime = await verifyRuntime(Boolean(live));
  console.log(`[PASS] EQ trust ${JSON.stringify({ source, runtime })}`);
}

main().catch(error => {
  console.error(`[FAIL] ${error.stack}`);
  process.exitCode = 1;
});
