#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const APP = path.join(PROJECTS, 'burnout-test');
const LIVE_ORIGIN = 'https://dopabrain.com';
const ROUTE = '/burnout-test/';
const LANGS = ['de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh'];
const EVENTS = [
  'burnout_reflection_start',
  'burnout_reflection_complete',
  'burnout_next_step_click',
  'burnout_guide_click',
  'burnout_share_success',
  'burnout_reflection_retry'
];

function assert(value, message) {
  if (!value) throw new Error(message);
}

function read(relative) {
  return fs.readFileSync(path.join(APP, relative), 'utf8');
}

function fixture() {
  return {
    html: read('index.html'),
    app: read('js/app.js'),
    i18n: read('js/i18n.js'),
    css: read('css/style.css'),
    manifest: read('manifest.json'),
    sw: read('sw.js'),
    locales: Object.fromEntries(LANGS.map(lang => [lang, read(`js/locales/${lang}.json`)]))
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function modelFromSource(source) {
  const context = { document: { addEventListener() {} } };
  vm.runInNewContext(`${source}\nglobalThis.__model = { QUESTIONS, SCORE_MAP, TYPE_ORDER };`, context);
  return JSON.parse(JSON.stringify(context.__model));
}

function verifySource(value) {
  const publicSource = [value.html, value.app, ...Object.values(value.locales)].join('\n');
  const forbidden = [
    ['executable ad code', /pagead2\.googlesyndication\.com|<ins[^>]+adsbygoogle|adsbygoogle\s*\)?\.push/i],
    ['fabricated popularity or rating', /12\.8K|aggregateRating|ratingCount|people tested/i],
    ['fabricated metric or percentile', /percentile-stat|result\.percentile|metrics-grid|type\.metrics|burnout_metrics/i],
    ['result-card export', /ResultCard|result-card\.js|save-result/i],
    ['generic cross-promotion', /cross-promo\.js|related-games/i],
    ['legacy social sharer', /share-(?:kakao|twitter|facebook|copy)|sharer\.kakao|twitter\.com\/intent|facebook\.com\/sharer/i],
    ['synthetic engagement event', /page_engage|engagement_time_msec/i],
    ['legacy funnel event', /['"]quiz_(?:start|complete)['"]/i],
    ['private analytics payload', /event_label\s*:|(?:answer|result|score|type)_?(?:id|value|label)?\s*:/i]
  ];
  for (const [label, pattern] of forbidden) assert(!pattern.test(publicSource), `Found ${label}`);

  assert(value.html.includes('data-burnout-trust-contract="2026-09-05"'), 'trust contract missing');
  assert(value.html.includes('data-ad-serving="suspended-invalid-traffic-2026-09-03"'), 'ad suspension marker missing');
  assert(value.html.includes('www.who.int/standards/classifications'), 'WHO boundary source missing');
  assert(!value.html.includes('FAQPage'), 'hidden FAQ schema remains');
  assert((value.html.match(/class="related-card/g) || []).length === 2, 'result must expose exactly two focused actions');
  assert(value.html.includes('id="next-stress-check"') && value.html.includes('id="next-stress-guide"'), 'focused action IDs missing');
  assert(value.html.includes('id="share-reflection"') && value.html.includes('aria-live="polite"'), 'neutral share contract missing');
  assert(/gtag\('event', name\)/.test(value.app), 'private event wrapper missing');
  for (const event of EVENTS) assert(value.app.includes(`'${event}'`), `event missing: ${event}`);

  const schemas = [...value.html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map(match => JSON.parse(match[1]));
  assert(schemas.length === 2, 'expected exactly two JSON-LD blocks');
  assert(JSON.stringify(schemas.map(item => item['@type']).sort()) === JSON.stringify(['BreadcrumbList', 'SoftwareApplication']), 'unexpected JSON-LD types');
  const alternateMatches = [...value.html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)];
  const alternates = new Map(alternateMatches.map(match => [match[1], match[2]]));
  assert(alternates.size === 13 && alternateMatches.length === 13, 'expected 13 unique hreflang labels');
  assert(alternates.get('en') === `${LIVE_ORIGIN}${ROUTE}` && alternates.get('x-default') === `${LIVE_ORIGIN}${ROUTE}`, 'default hreflang mismatch');
  for (const lang of LANGS.filter(lang => lang !== 'en')) assert(alternates.get(lang) === `${LIVE_ORIGIN}${ROUTE}?lang=${lang}`, `${lang} hreflang mismatch`);

  const model = modelFromSource(value.app);
  assert(model.QUESTIONS.length === 8 && model.TYPE_ORDER.length === 6, 'reflection model dimensions changed');
  assert(Object.keys(model.SCORE_MAP).length === 32, 'score map must cover 32 answers');
  for (const question of model.QUESTIONS) {
    assert(question.options.length === 4, `question ${question.id} must have four options`);
    for (let index = 0; index < 4; index += 1) {
      const key = `${question.id}${String.fromCharCode(97 + index)}`;
      const weights = model.SCORE_MAP[key];
      assert(Array.isArray(weights) && weights.length === 6, `score map missing ${key}`);
      assert(weights.every(score => Number.isInteger(score) && score >= 0 && score <= 3), `score map range invalid: ${key}`);
      assert(weights.some(score => score > 0), `score map ${key} has no effect`);
    }
  }
  assert(/if \(this\.scores\[i\] > maxScore\)/.test(value.app), 'highest-total calculation or listed-order tie rule changed');
  assert(/this\.isTransitioning/.test(value.app), 'duplicate-answer guard missing');

  const required = [
    'meta.description', 'intro.feature_method', 'intro.method', 'intro.boundary', 'intro.source',
    'button.share', 'result.your_type', 'result.boundary_note', 'result.next_title',
    'result.primary_action', 'result.guide_action', 'result.share',
    'share.text', 'share.success', 'share.unavailable'
  ];
  for (const lang of LANGS) {
    const locale = JSON.parse(value.locales[lang]);
    for (const key of required) {
      const text = key.split('.').reduce((node, part) => node && node[part], locale);
      assert(typeof text === 'string' && text.trim().length >= 3, `missing ${lang}.${key}`);
      assert(!text.includes('\uFFFD'), `replacement character in ${lang}.${key}`);
    }
    assert(locale.intro.method.length >= 20 && locale.intro.boundary.length >= 15, `${lang} trust copy is too thin`);
    assert(!('social_proof' in locale.intro) && !('feature_metrics' in locale.intro), `${lang} fabricated intro keys remain`);
    assert(!('metric' in locale) && !('related' in locale), `${lang} unused metric/related copy remains`);
    assert(!('percentile' in locale.result) && !('burnout_metrics' in locale.result), `${lang} fabricated result keys remain`);
    assert(!/[{](?:type|score|result)[}]/i.test(locale.share.text), `${lang} share leaks a result`);
  }

  const manifest = JSON.parse(value.manifest);
  assert(manifest.start_url === ROUTE && manifest.scope === ROUTE, 'manifest scope mismatch');
  assert(value.sw.includes("const CACHE_NAME = 'burnout-test-v2'"), 'service-worker cache version stale');
  for (const lang of LANGS) assert(value.sw.includes(`/burnout-test/js/locales/${lang}.json`), `${lang} locale missing from offline cache`);
  assert(value.sw.includes("event.request.method !== 'GET'") && value.sw.includes('self.clients.claim()'), 'service-worker request/swap safety missing');
  return { locales: LANGS.length, schemas: schemas.length, scoreEntries: Object.keys(model.SCORE_MAP).length, focusedActions: 2, adServing: 'suspended' };
}

function runMutations(baseline) {
  const mutations = [
    ['ad-loader', 'Found executable ad code', value => { value.html += '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>'; }],
    ['suspension', 'ad suspension marker missing', value => { value.html = value.html.replace(' data-ad-serving="suspended-invalid-traffic-2026-09-03"', ''); }],
    ['fake-rating', 'Found fabricated popularity or rating', value => { value.html += '"aggregateRating":{"ratingCount":2850}'; }],
    ['percentile', 'Found fabricated metric or percentile', value => { value.html += '<p class="percentile-stat">top 15%</p>'; }],
    ['result-card', 'Found result-card export', value => { value.app += '\nResultCard.download({});'; }],
    ['old-event', 'Found legacy funnel event', value => { value.app += "\ngtag('event','quiz_complete');"; }],
    ['private-event', 'Found private analytics payload', value => { value.app += "\ngtag('event','x',{event_label:'overachiever'});"; }],
    ['missing-boundary', 'trust contract missing', value => { value.html = value.html.replace(' data-burnout-trust-contract="2026-09-05"', ''); }],
    ['action-sprawl', 'result must expose exactly two focused actions', value => { value.html += '<a class="related-card"></a>'; }],
    ['collapsed-hreflang', 'ko hreflang mismatch', value => { value.html = value.html.replace(`${ROUTE}?lang=ko`, ROUTE); }],
    ['score-entry', 'score map missing 7d', value => { value.app = value.app.replace("    '7d': [0,0,0,3,3,2]", "    '7x': [0,0,0,3,3,2]"); }],
    ['score-range', 'score map range invalid: 0a', value => { value.app = value.app.replace("'0a': [3,0,0,1,0,0]", "'0a': [9,0,0,1,0,0]"); }],
    ['locale-method', 'missing en.intro.method', value => { const locale = JSON.parse(value.locales.en); delete locale.intro.method; value.locales.en = JSON.stringify(locale); }],
    ['manifest-scope', 'manifest scope mismatch', value => { const manifest = JSON.parse(value.manifest); manifest.scope = '/'; value.manifest = JSON.stringify(manifest); }]
  ];
  for (const [name, expected, mutate] of mutations) {
    const value = clone(baseline);
    mutate(value);
    let message = '';
    try { verifySource(value); } catch (error) { message = error.message; }
    assert(message.includes(expected), `${name} mutation escaped: ${message || 'verifier passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
  return mutations.length;
}

function createServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(PROJECTS, pathname.replace(/^\/+/, ''));
    if (!file.startsWith(`${PROJECTS}${path.sep}`) || !fs.existsSync(file)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end('Not found'); return; }
    const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
    response.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(response);
  });
}

async function eventRows(page) {
  return page.evaluate(() => (window.dataLayer || []).map(row => Array.from(row || []))
    .filter(row => row[0] === 'event').map(row => ({ name: row[1], params: row[2] || {} })));
}

async function isolate(page, origin) {
  await page.route('**/*', route => {
    const requestOrigin = new URL(route.request().url()).origin;
    if (requestOrigin === origin) route.continue();
    else route.abort();
  });
}

async function verifyRuntime(liveOrigin) {
  let server;
  let origin = liveOrigin;
  if (!origin) {
    server = createServer();
    const address = await listenOnSafePort(server);
    origin = `http://127.0.0.1:${address.port}`;
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await context.addInitScript(() => {
    const nativeTimeout = window.setTimeout.bind(window);
    const nativeInterval = window.setInterval.bind(window);
    window.setTimeout = (handler, delay, ...args) => nativeTimeout(handler, delay >= 100 ? 0 : delay, ...args);
    window.setInterval = (handler, delay, ...args) => nativeInterval(handler, delay >= 100 ? 1 : delay, ...args);
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__sharedText = text; } } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await isolate(page, origin);
  try {
    for (const lang of LANGS) {
      await page.goto(`${origin}${ROUTE}?lang=${lang}&result=private#answer`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(expected => document.documentElement.lang === expected
        && document.querySelector('[data-i18n="intro.method"]')?.textContent !== 'intro.method'
        && document.querySelector('#next-stress-check')?.getAttribute('href') === `/stress-check/?lang=${expected}`,
      lang);
      const state = await page.evaluate(expected => ({
        lang: document.documentElement.lang,
        method: document.querySelector('[data-i18n="intro.method"]')?.textContent,
        boundary: document.querySelector('[data-i18n="intro.boundary"]')?.textContent,
        stressHref: document.querySelector('#next-stress-check')?.getAttribute('href'),
        guideHref: document.querySelector('#next-stress-guide')?.getAttribute('href'),
        search: location.search,
        hash: location.hash,
        overflow: document.documentElement.scrollWidth - innerWidth,
        adNodes: document.querySelectorAll('script[src*="pagead2"],ins.adsbygoogle,[data-ad-slot]').length,
        expected
      }), lang);
      assert(state.lang === lang && state.method.length >= 20 && state.boundary.length >= 15, `${lang} localized trust copy failed`);
      assert(state.stressHref === `/stress-check/?lang=${lang}` && state.guideHref === `/portal/blog/${lang}/stress-management-techniques-guide.html`, `${lang} localized actions failed: ${JSON.stringify({ stressHref: state.stressHref, guideHref: state.guideHref })}`);
      assert(state.search === `?lang=${lang}` && state.hash === '', `${lang} URL sanitizer failed`);
      assert(state.overflow <= 1 && state.adNodes === 0, `${lang} mobile overflow or ad node detected`);
    }

    await page.goto(`${origin}${ROUTE}?lang=en&verify=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.lang === 'en' && document.querySelector('#start-btn')?.textContent.trim().length > 3);
    assert(await page.locator('#start-btn').evaluate(element => element.getBoundingClientRect().height) >= 44, 'start target below 44px');
    await page.click('#start-btn');
    await page.locator('.option-btn').first().evaluate(element => { element.click(); element.click(); });
    await page.waitForFunction(() => document.querySelector('#q-current')?.textContent === '2');
    for (let question = 2; question <= 7; question += 1) {
      await page.locator('.option-btn').first().click();
      await page.waitForFunction(expected => document.querySelector('#q-current')?.textContent === String(expected), question + 1);
    }
    await page.locator('.option-btn').first().click();
    await page.waitForSelector('#result-screen.active');
    assert((await page.locator('#result-title').textContent()).trim().length > 3, 'result label missing');
    assert(await page.locator('.related-card').count() === 2, 'runtime action focus changed');
    assert(await page.locator('#metrics-grid,#percentile-stat,ins.adsbygoogle').count() === 0, 'fabricated or ad surface rendered');
    assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, 'result mobile overflow');

    await page.evaluate(() => {
      for (const link of document.querySelectorAll('.related-card')) {
        link.addEventListener('click', event => event.preventDefault());
        link.click(); link.click();
      }
    });
    await page.locator('#share-reflection').click();
    await page.locator('#share-reflection').click();
    await page.waitForFunction(() => document.querySelector('#share-status')?.textContent.trim().length > 0);
    await page.locator('#retry-btn').evaluate(element => { element.click(); element.click(); });
    assert(await page.locator('#intro-screen').evaluate(element => element.classList.contains('active')), 'retry did not return to intro');

    const rows = await eventRows(page);
    for (const event of EVENTS) assert(rows.filter(row => row.name === event).length === 1, `${event} must fire exactly once`);
    assert(rows.every(row => Object.keys(row.params).length === 0), 'analytics event parameters must remain private and low-cardinality');
    assert(errors.length === 0, `runtime errors: ${errors.join('; ')}`);
    return { origin, locales: LANGS.length, questions: 8, events: EVENTS.length, adNodes: 0, mobile: true };
  } finally {
    await context.close();
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const urlIndex = args.indexOf('--url');
  const requested = urlIndex >= 0 ? args[urlIndex + 1] : '';
  const liveOrigin = requested ? new URL(requested).origin : '';
  if (liveOrigin && liveOrigin !== LIVE_ORIGIN) throw new Error('live origin mismatch');
  const baseline = fixture();
  const source = verifySource(baseline);
  const mutations = args.includes('--mutations') ? runMutations(baseline) : 0;
  const runtime = await verifyRuntime(liveOrigin);
  console.log(`[PASS] burnout trust ${JSON.stringify({ source, mutations, runtime })}`);
}

main().catch(error => {
  console.error(`[FAIL] ${error.stack || error.message}`);
  process.exitCode = 1;
});
