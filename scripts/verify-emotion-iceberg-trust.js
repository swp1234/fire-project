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
const APP = path.join(PROJECTS, 'emotion-iceberg');
const LIVE_ORIGIN = 'https://dopabrain.com';
const ROUTE = '/emotion-iceberg/';
const VERSION = '20260905-1';
const LANGS = ['de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh'];
const SURFACE = new Set(['calm', 'cheerful', 'indifferent', 'confident']);
const DEEP = new Set(['angry', 'passionate', 'lonely', 'sad', 'tender', 'anxious', 'fearful', 'confused', 'calm']);
const TYPES = ['volcano', 'aurora', 'coral', 'abyss', 'fog', 'crystal'];
const EVENTS = [
  'emotion_reflection_start',
  'emotion_reflection_halfway',
  'emotion_reflection_complete',
  'emotion_planner_click',
  'emotion_stress_click',
  'emotion_share_success',
  'emotion_reflection_retry'
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

function contractFromSource(source) {
  const context = {
    window: {},
    document: { readyState: 'loading', addEventListener() {} },
    location: { href: 'https://dopabrain.com/emotion-iceberg/', origin: 'https://dopabrain.com', pathname: '/emotion-iceberg/', search: '', hash: '' },
    history: { replaceState() {} },
    navigator: {},
    URL,
    setTimeout() {},
    setInterval() {}
  };
  vm.runInNewContext(source, context);
  return JSON.parse(JSON.stringify(context.window.EmotionReflectionContract));
}

function verifySource(value) {
  const publicSource = [value.html, value.app, value.i18n, value.css, ...Object.values(value.locales)].join('\n');
  const forbidden = [
    ['executable ad code', /pagead2\.googlesyndication\.com|<ins[^>]+adsbygoogle|adsbygoogle\s*\)?\.push/i],
    ['fabricated popularity or rating', /12[,.]400|aggregateRating|ratingCount|participants|social-proof/i],
    ['hidden FAQ schema', /FAQPage/i],
    ['generic cross-promotion', /cross-promo\.js|related-games/i],
    ['fabricated gap or percentile', /gap-score|gapDesc|percentile-stat|percentileText|result-stats-card/i],
    ['claim-heavy analysis', /result-analysis|analysisTitle|Your Emotional Depth/i],
    ['legacy social sharer', /share-(?:kakao|twitter|facebook|copy)|twitter\.com\/intent|facebook\.com\/sharer/i],
    ['synthetic engagement event', /page_engage|engagement_time_msec/i],
    ['legacy funnel event', /['"](?:test_complete|quiz_start|quiz_complete)['"]/i],
    ['private analytics payload', /event_label\s*:|gtag\(\s*['"]event['"][^;\n]*\{/i],
    ['result-specific share placeholder', /[{](?:type|score|result)[}]/i],
    ['unused promotional locale copy', /previewText|midEncouragement|"teasers"|"related"|"about"/i]
  ];
  for (const [label, pattern] of forbidden) assert(!pattern.test(publicSource), `Found ${label}`);

  assert(value.html.includes('data-emotion-trust-contract="2026-09-05"'), 'trust contract missing');
  assert(value.html.includes('data-ad-serving="suspended-invalid-traffic-2026-09-03"'), 'ad suspension marker missing');
  assert(value.html.includes('pubmed.ncbi.nlm.nih.gov/17576282'), 'affect-labeling boundary source missing');
  assert((value.html.match(/class="related-card/g) || []).length === 2, 'result must expose exactly two focused actions');
  assert(value.html.includes('id="next-emotion-action"') && value.html.includes('id="next-stress-check"'), 'focused action IDs missing');
  assert(value.html.includes('id="share-reflection"') && value.html.includes('aria-live="polite"'), 'neutral share contract missing');
  assert(/gtag\('event', name\)/.test(value.app), 'parameter-free event wrapper missing');
  for (const event of EVENTS) assert((value.app.match(new RegExp(`'${event}'`, 'g')) || []).length === 1, `event missing or duplicated: ${event}`);

  const schemas = [...value.html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map(match => JSON.parse(match[1]));
  assert(schemas.length === 2, 'expected exactly two JSON-LD blocks');
  assert(JSON.stringify(schemas.map(item => item['@type']).sort()) === JSON.stringify(['BreadcrumbList', 'SoftwareApplication']), 'unexpected JSON-LD types');

  const alternateMatches = [...value.html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)];
  const alternates = new Map(alternateMatches.map(match => [match[1], match[2]]));
  assert(alternates.size === 13 && alternateMatches.length === 13, 'expected 13 unique hreflang labels');
  assert(alternates.get('en') === `${LIVE_ORIGIN}${ROUTE}` && alternates.get('x-default') === `${LIVE_ORIGIN}${ROUTE}`, 'default hreflang mismatch');
  for (const lang of LANGS.filter(lang => lang !== 'en')) assert(alternates.get(lang) === `${LIVE_ORIGIN}${ROUTE}?lang=${lang}`, `${lang} hreflang mismatch`);

  const contract = contractFromSource(value.app);
  assert(contract.totalQuestions === 10 && contract.selectionsPerQuestion === 2, 'reflection dimensions changed');
  assert(JSON.stringify(contract.surfaceOrder) === JSON.stringify([...SURFACE]), 'surface tie order changed');
  assert(JSON.stringify(contract.deepOrder) === JSON.stringify([...DEEP]), 'inner-word tie order changed');
  assert(Object.keys(contract.typeByDeep).length === DEEP.size, 'metaphor mapping coverage changed');
  assert(DEEP.has('calm') && contract.typeByDeep.calm === 'crystal', 'calm mapping missing');
  assert(/isTransitioning/.test(value.app) && /control\.disabled = true/.test(value.app), 'duplicate-answer guard missing');

  const required = [
    'meta.title', 'meta.description', 'meta.timeEstimate', 'app.title', 'app.subtitle', 'app.startBtnEnhanced',
    'app.method', 'app.rule', 'app.boundary', 'app.source', 'question.surfaceStep', 'question.deepStep',
    'question.surfaceQ', 'question.deepQ', 'result.kicker', 'result.boundary', 'result.aboveLabel',
    'result.belowLabel', 'result.retry', 'result.nextTitle', 'result.plannerAction', 'result.stressAction',
    'result.narrative', 'share.title', 'share.button', 'share.text', 'share.success', 'share.unavailable'
  ];
  const expectedTop = ['meta', 'a11y', 'loader', 'app', 'question', 'questions', 'emotions', 'results', 'result', 'share'];
  for (const lang of LANGS) {
    const locale = JSON.parse(value.locales[lang]);
    assert(JSON.stringify(Object.keys(locale)) === JSON.stringify(expectedTop), `${lang} locale contains stale top-level sections`);
    for (const key of required) {
      const content = key.split('.').reduce((node, part) => node && node[part], locale);
      assert(typeof content === 'string' && content.trim().length >= 3, `missing ${lang}.${key}`);
      assert(!content.includes('\uFFFD'), `replacement character in ${lang}.${key}`);
    }
    assert(locale.app.method.length >= 35 && locale.app.boundary.length >= 25, `${lang} trust copy is too thin`);
    assert(Object.keys(locale.questions).length === 10, `${lang} must contain ten scenarios`);
    for (let question = 0; question < 10; question += 1) {
      const item = locale.questions[`q${question}`];
      assert(item && typeof item.scenario === 'string' && item.scenario.length >= 3, `${lang}.q${question} scenario missing`);
      for (let option = 0; option < 4; option += 1) {
        const surface = item[`surface${option}`];
        const deep = item[`deep${option}`];
        assert(surface && surface.text && surface.emoji && SURFACE.has(surface.emotion), `${lang}.q${question}.surface${option} invalid`);
        assert(deep && deep.text && deep.emoji && DEEP.has(deep.emotion), `${lang}.q${question}.deep${option} invalid`);
      }
      assert(Object.keys(item).length === 9, `${lang}.q${question} must contain one scenario and eight options`);
    }
    assert(JSON.stringify(Object.keys(locale.results).sort()) === JSON.stringify([...TYPES].sort()), `${lang} metaphor set changed`);
    for (const result of Object.values(locale.results)) {
      assert(JSON.stringify(Object.keys(result)) === JSON.stringify(['name', 'desc']), `${lang} result contains claim-heavy fields`);
      assert(result.name.length >= 2 && result.desc.length >= 15, `${lang} result copy missing`);
    }
  }

  const manifest = JSON.parse(value.manifest);
  assert(manifest.name === 'Emotion Iceberg Reflection' && manifest.start_url === ROUTE && manifest.scope === ROUTE, 'manifest identity or scope mismatch');
  assert(value.html.includes(`js/app.js?v=${VERSION}`) && value.html.includes(`js/i18n.js?v=${VERSION}`) && value.html.includes(`css/style.css?v=${VERSION}`), 'release asset version missing');
  assert(value.i18n.includes(`js/locales/\${lang}.json?v=${VERSION}`), 'locale asset version missing');
  assert(value.app.includes("document.body.dataset.emotionAppReady = 'true'"), 'app readiness contract missing');
  assert(value.sw.includes("const CACHE_NAME = 'emotion-iceberg-v2'"), 'service-worker cache version stale');
  for (const lang of LANGS) assert(value.sw.includes(`/emotion-iceberg/js/locales/${lang}.json?v=${VERSION}`), `${lang} locale missing from versioned offline cache`);
  assert(value.sw.includes("event.request.method !== 'GET'") && value.sw.includes('self.clients.claim()'), 'service-worker request/swap safety missing');
  return { locales: LANGS.length, scenarios: 10, selections: 20, schemas: schemas.length, focusedActions: 2, adServing: 'suspended' };
}

function runMutations(baseline) {
  const mutations = [
    ['ad-loader', 'Found executable ad code', value => { value.html += '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>'; }],
    ['suspension', 'ad suspension marker missing', value => { value.html = value.html.replace(' data-ad-serving="suspended-invalid-traffic-2026-09-03"', ''); }],
    ['fake-rating', 'Found fabricated popularity or rating', value => { value.html += '"aggregateRating":{"ratingCount":1340}'; }],
    ['fake-gap', 'Found fabricated gap or percentile', value => { value.html += '<span id="gap-score">88%</span>'; }],
    ['claim-analysis', 'Found claim-heavy analysis', value => { value.html += '<p id="result-analysis"></p>'; }],
    ['old-event', 'Found legacy funnel event', value => { value.app += "\ngtag('event','test_complete');"; }],
    ['private-event', 'Found private analytics payload', value => { value.app += "\ngtag('event','x',{result_type:'volcano'});"; }],
    ['missing-boundary', 'trust contract missing', value => { value.html = value.html.replace(' data-emotion-trust-contract="2026-09-05"', ''); }],
    ['action-sprawl', 'result must expose exactly two focused actions', value => { value.html += '<a class="related-card"></a>'; }],
    ['collapsed-hreflang', 'ko hreflang mismatch', value => { value.html = value.html.replace(`${ROUTE}?lang=ko`, ROUTE); }],
    ['locale-method', 'missing en.app.method', value => { const locale = JSON.parse(value.locales.en); delete locale.app.method; value.locales.en = JSON.stringify(locale); }],
    ['locale-option', 'es.q9.deep3 invalid', value => { const locale = JSON.parse(value.locales.es); locale.questions.q9.deep3.emotion = 'mystery'; value.locales.es = JSON.stringify(locale); }],
    ['result-claim', 'en result contains claim-heavy fields', value => { const locale = JSON.parse(value.locales.en); locale.results.volcano.analysis = 'diagnosis'; value.locales.en = JSON.stringify(locale); }],
    ['manifest-scope', 'manifest identity or scope mismatch', value => { const manifest = JSON.parse(value.manifest); manifest.scope = '/'; value.manifest = JSON.stringify(manifest); }],
    ['unsafe-sw', 'service-worker request/swap safety missing', value => { value.sw = value.sw.replace("event.request.method !== 'GET'", 'false'); }],
    ['stale-assets', 'release asset version missing', value => { value.html = value.html.replace(`js/app.js?v=${VERSION}`, 'js/app.js'); }],
    ['app-ready', 'app readiness contract missing', value => { value.app = value.app.replace("document.body.dataset.emotionAppReady = 'true';", ''); }]
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
      await page.waitForFunction(expected => document.body.dataset.emotionAppReady === 'true'
        && document.documentElement.lang === expected
        && document.querySelector('[data-i18n="app.method"]')?.textContent !== 'app.method'
        && document.querySelector('#next-emotion-action')?.getAttribute('href') === `/portal/tools/emotion-regulation-planner.html?lang=${expected}`,
      lang);
      const state = await page.evaluate(expected => ({
        lang: document.documentElement.lang,
        method: document.querySelector('[data-i18n="app.method"]')?.textContent,
        boundary: document.querySelector('[data-i18n="app.boundary"]')?.textContent,
        plannerHref: document.querySelector('#next-emotion-action')?.getAttribute('href'),
        stressHref: document.querySelector('#next-stress-check')?.getAttribute('href'),
        search: location.search,
        hash: location.hash,
        overflow: document.documentElement.scrollWidth - innerWidth,
        adNodes: document.querySelectorAll('script[src*="pagead2"],ins.adsbygoogle,[data-ad-slot]').length,
        expected
      }), lang);
      assert(state.lang === lang && state.method.length >= 20 && state.boundary.length >= 15, `${lang} localized trust copy failed`);
      assert(state.plannerHref === `/portal/tools/emotion-regulation-planner.html?lang=${lang}` && state.stressHref === `/stress-check/?lang=${lang}`, `${lang} localized actions failed`);
      assert(state.search === `?lang=${lang}` && state.hash === '', `${lang} URL sanitizer failed`);
      assert(state.overflow <= 1 && state.adNodes === 0, `${lang} mobile overflow or ad node detected`);
    }

    await page.goto(`${origin}${ROUTE}?lang=es&verify=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.body.dataset.emotionAppReady === 'true' && document.documentElement.lang === 'es');
    assert(await page.locator('#start-btn').evaluate(element => element.getBoundingClientRect().height) >= 44, 'start target below 44px');
    await page.click('#start-btn');
    assert((await page.locator('.option-btn').first().textContent()).trim().length > 3, 'localized option missing');
    await page.locator('.option-btn').first().evaluate(element => { element.click(); element.click(); });
    for (let selection = 1; selection < 20; selection += 1) {
      await page.waitForFunction(() => document.querySelector('#result-screen')?.classList.contains('active') || (document.querySelector('.option-btn') && !document.querySelector('.option-btn').disabled));
      if (await page.locator('#result-screen').evaluate(element => element.classList.contains('active'))) break;
      await page.locator('.option-btn').first().click();
    }
    await page.waitForSelector('#result-screen.active');
    assert((await page.locator('#result-type-name').textContent()).trim().length > 2, 'result label missing');
    assert(await page.locator('.related-card').count() === 2, 'runtime action focus changed');
    assert(await page.locator('#gap-score,#percentile-stat,#result-analysis,ins.adsbygoogle').count() === 0, 'fabricated or ad surface rendered');
    assert(!/\d+\s*%/.test(await page.locator('#result-screen').innerText()), 'result rendered an unsupported percentage');
    assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, 'result mobile overflow');

    await page.locator('#lang-selector select').selectOption('ko');
    await page.waitForFunction(() => document.documentElement.lang === 'ko' && document.querySelector('#next-emotion-action')?.getAttribute('href')?.endsWith('lang=ko'));
    assert((await page.locator('#result-narrative').textContent()).includes('가장 많이'), 'result did not re-render after language switch');
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
    assert(await page.locator('#start-screen').evaluate(element => element.classList.contains('active')), 'retry did not return to start');

    const rows = await eventRows(page);
    for (const event of EVENTS) assert(rows.filter(row => row.name === event).length === 1, `${event} must fire exactly once`);
    assert(rows.every(row => Object.keys(row.params).length === 0), 'analytics event parameters must remain empty and low-cardinality');
    assert(errors.length === 0, `runtime errors: ${errors.join('; ')}`);
    return { origin, locales: LANGS.length, scenarios: 10, selections: 20, events: EVENTS.length, adNodes: 0, mobile: true };
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
  console.log(`[PASS] emotion iceberg trust ${JSON.stringify({ source, mutations, runtime })}`);
}

main().catch(error => {
  console.error(`[FAIL] ${error.stack || error.message}`);
  process.exitCode = 1;
});
