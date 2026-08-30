#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'shadow-work');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LANGUAGES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const APP_EVENTS = ['shadow_reflection_view', 'shadow_reflection_start', 'shadow_reflection_complete', 'shadow_reflection_restart', 'shadow_reflection_share', 'shadow_reflection_related_click', 'shadow_reflection_evidence_open'];
const GUIDE_EVENTS = ['content_view', 'content_en_jung_shadow_concept_view', 'content_cta_click', 'content_related_click'];
const CTA = '/shadow-work/?lang=en&amp;start=1&amp;surface=en_jung_shadow_primary';
const FILES = {
  index: path.join(APP, 'index.html'),
  app: path.join(APP, 'js', 'app.js'),
  i18n: path.join(APP, 'js', 'i18n.js'),
  css: path.join(APP, 'css', 'style.css'),
  sw: path.join(APP, 'sw.js'),
  guide: path.join(PORTAL, 'blog', 'en', 'carl-jung-shadow-self-explained.html'),
  catalog: path.join(PORTAL, 'blog', 'en', 'index.html'),
};

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function count(source, regex) { return (source.match(regex) || []).length; }
function bundle() {
  const source = Object.fromEntries(Object.entries(FILES).map(([key, file]) => [key, read(file)]));
  source.locales = Object.fromEntries(LANGUAGES.map(language => [language, read(path.join(APP, 'js', 'locales', language + '.json'))]));
  return source;
}
function parseSchemas(source, label) {
  const blocks = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail(label + ': JSON-LD missing');
  blocks.forEach(match => JSON.parse(match[1]));
}

function verifySource(source) {
  if (!/Shadow Pattern Reflection/.test(source.index) || !/<html lang="en"/.test(source.index)) fail('app identity or fallback language drifted');
  if (!/2026-08-30/.test(source.index) || !/2026-08-30/.test(source.guide)) fail('release date drifted');
  parseSchemas(source.index, 'app');
  parseSchemas(source.guide, 'guide');
  for (const language of LANGUAGES) {
    if (!new RegExp('hreflang="' + language + '"').test(source.index)) fail('hreflang missing: ' + language);
    const raw = source.locales[language];
    if (raw.includes('\uFFFD') || raw.includes('??')) fail('locale encoding damage: ' + language);
    const locale = JSON.parse(raw);
    if (!locale.question || Object.keys(locale.question).length !== 56) fail('question contract drifted: ' + language);
    for (const key of ['intro.boundary', 'result.boundary', 'about.formula', 'pattern.appease', 'pattern.caretake']) {
      let value = locale;
      for (const part of key.split('.')) value = value && value[part];
      const minimum = key.startsWith('pattern.') ? 2 : 4;
      if (typeof value !== 'string' || value.length < minimum) fail('localized core copy missing: ' + language + ' ' + key);
    }
    if (/percentile|social_proof|unconscious fear|shadow archetype is|reveals? your hidden/i.test(raw)) fail('retired result claim remains: ' + language);
  }
  if (count(source.index, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) !== 1) fail('app must contain exactly one Auto Ads loader');
  if (/<ins\b[^>]*adsbygoogle|data-ad-slot|adsbygoogle\s*(?:=|\.push)/i.test(source.index + source.app)) fail('manual ad surface remains');
  if (/AggregateRating|ratingValue|ratingCount|FAQPage|5\.8K|Math\.random|result-card\.js|cross-promo\.js/i.test(source.index + source.app + source.css)) fail('fabricated proof, random result, hidden FAQ, or legacy dependency remains');
  if (/quiz_start|quiz_complete|test_start|test_complete|result_view|page_engage|shadow_work_result_ad_impression|content_ad_impression/.test(source.app)) fail('legacy or synthetic app event remains');
  for (const event of APP_EVENTS) if (!source.app.includes("'" + event + "'")) fail('app event missing: ' + event);
  for (const surface of ['direct', 'en_jung_shadow_primary', 'shadow_trigger_reset', 'shadow_quiz_guide', 'clarity_board']) if (!source.app.includes("'" + surface + "'")) fail('surface allowlist missing: ' + surface);
  if (/track\([^\n]+(?:answer|score|result_type|pattern|percentile)|searchParams\.set\(['"](?:answer|score|result|type|pattern|percentile)/i.test(source.app)) fail('private result data can leave the app');
  if (!/each answer adds one point/i.test(source.locales.en) || !/counts\[index\]\+=1/.test(source.app)) fail('published formula and implemented formula diverged');
  if (!/shadow-reflection-v3/.test(source.sw) || /manifest\.json/.test(source.sw)) fail('service-worker cache contract drifted');
  for (const asset of [...source.sw.matchAll(/['"](\/shadow-work\/[^'"]*)['"]/g)].map(match => match[1])) {
    const relative = asset.replace(/^\/shadow-work\/?/, '') || 'index.html';
    if (!fs.existsSync(path.join(APP, relative))) fail('service-worker asset missing: ' + asset);
  }

  if (!/<h1>What did Carl Jung mean by the “shadow”\?<\/h1>/.test(source.guide)) fail('guide direct-answer H1 drifted');
  for (const evidence of ['International Association for Analytical Psychology', 'Society of Analytical Psychology', 'Report-Archetype-Theory-Roesler-1.pdf', 'not a clinical diagnosis', 'cannot measure unconscious content']) {
    if (!new RegExp(evidence, 'i').test(source.guide)) fail('guide evidence boundary missing: ' + evidence);
  }
  if (/everything you don.t want to be|controls us from the shadows|always forms in childhood|strong reactions (?:signal|prove)|unconscious fear that|full integration|profound and far-reaching|FAQPage/i.test(source.guide)) fail('deterministic or unsupported guide claim remains');
  const escaped = CTA.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
  if (count(source.guide, new RegExp(escaped, 'g')) !== 2) fail('guide must contain two identical direct-start CTAs');
  for (const event of GUIDE_EVENTS) if (!source.guide.includes("'" + event + "'")) fail('guide event missing: ' + event);
  if (!/intersectionRatio>=\.35/.test(source.guide) || !/observer\.disconnect\(\);setTimeout\(/.test(source.guide) || !/\},500\)/.test(source.guide)) fail('qualified guide view visibility contract drifted');
  if (/content_ad_|target_url|link_url|cross-promo/.test(source.guide)) fail('unsafe guide telemetry or generic promotion remains');
  if (count(source.guide, /<a class="[^"]*quick-card[^"]*"[^>]+data-content-surface="quick_rail"[^>]+data-target-slug=/g) !== 2) fail('focused rail must contain exactly two attributed cards');
  if (count(source.guide, /\/portal\/js\/ad-loader\.js/g) !== 1 || /data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*(?:=|\.push)/.test(source.guide)) fail('guide is not managed Auto Ads only');
  if (!/Carl Jung's Shadow: Meaning, Limits, and One Practice/.test(source.catalog) || !/'7 min'/.test(source.catalog)) fail('English catalog card drifted');
  return { languages: LANGUAGES.length, appEvents: APP_EVENTS.length, guideEvents: GUIDE_EVENTS.length, guideBytes: Buffer.byteLength(source.guide), appShellBytes: Buffer.byteLength(source.index) + Buffer.byteLength(source.app) };
}

function expectMutation(name, mutate) {
  const source = bundle(); mutate(source);
  try { verifySource(source); } catch (error) { console.log('[PASS] ' + name + ': ' + error.message); return; }
  fail('mutation escaped: ' + name);
}
function verifyMutations() {
  const mutations = [
    ['fake-rating', source => { source.index += '<div itemprop="AggregateRating">4.9</div>'; }],
    ['manual-ad', source => { source.index += '<ins class="adsbygoogle" data-ad-slot="auto"></ins>'; }],
    ['random-result', source => { source.app += 'Math.random()'; }],
    ['legacy-event', source => { source.app += "track('quiz_complete')"; }],
    ['private-event', source => { source.app += "track('x',{result_type:'appease'})"; }],
    ['private-share', source => { source.app += "url.searchParams.set('result','appease')"; }],
    ['formula-drift', source => { source.app = source.app.replace('counts[index]+=1', 'counts[index]+=2'); }],
    ['missing-locale-boundary', source => { source.locales.fr = source.locales.fr.replace('"boundary":', '"removed_boundary":'); }],
    ['false-projection-claim', source => { source.guide += '<p>Strong reactions prove projection.</p>'; }],
    ['cta-drift', source => { source.guide = source.guide.replace('surface=en_jung_shadow_primary', 'surface=unknown'); }],
    ['source-drift', source => { source.guide = source.guide.replace('Report-Archetype-Theory-Roesler-1.pdf', 'removed-report.pdf'); }],
    ['qualified-view-disconnect', source => { source.guide = source.guide.replace('observer.disconnect();setTimeout(', 'setTimeout('); }],
    ['focused-rail-drift', source => { source.guide = source.guide.replace('data-target-slug="emotion_iceberg"', 'data-removed-slug="emotion_iceberg"'); }],
    ['catalog-drift', source => { source.catalog = source.catalog.replace("Carl Jung's Shadow: Meaning, Limits, and One Practice", 'Old shadow guide'); }],
  ];
  mutations.forEach(([name, mutate]) => expectMutation(name, mutate));
  console.log('[PASS] mutation summary ' + mutations.length + '/' + mutations.length + ' detected');
}

const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };
function localServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let base, relative;
    if (pathname === '/shadow-work' || pathname.startsWith('/shadow-work/')) { base = APP; relative = pathname.replace(/^\/shadow-work\/?/, ''); }
    else if (pathname === '/portal' || pathname.startsWith('/portal/')) { base = PORTAL; relative = pathname.replace(/^\/portal\/?/, ''); }
    else { response.writeHead(404); response.end('not found'); return; }
    let file = path.resolve(base, relative || 'index.html');
    if (!(file === path.resolve(base, 'index.html') || file.startsWith(path.resolve(base) + path.sep))) { response.writeHead(403); response.end('forbidden'); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('not found'); return; }
    response.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control':'no-store' });
    fs.createReadStream(file).pipe(response);
  });
}
async function blockExternal(page) {
  await page.route('**/googletagmanager.com/**', route => route.abort());
  await page.route('**/googlesyndication.com/**', route => route.abort());
  await page.route('**/doubleclick.net/**', route => route.abort());
}
function events(page) {
  return page.evaluate(() => (window.dataLayer || []).map(row => Array.from(row || [])).filter(row => row[0] === 'event').map(row => ({ name:row[1], params:row[2] || {} })));
}
async function complete(page) {
  for (let index = 0; index < 8; index += 1) {
    const option = page.locator('.option-btn').first();
    await option.waitFor({ state:'visible', timeout:5000 });
    await option.click();
  }
  await page.locator('#result-screen.active').waitFor({ state:'visible', timeout:5000 });
}
async function layout(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) fail(label + ': horizontal overflow ' + overflow + 'px');
  for (const selector of ['#theme-toggle', '#start-btn']) {
    const item = page.locator(selector); if (!(await item.isVisible())) continue;
    const box = await item.boundingBox(); if (!box || box.width < 44 || box.height < 44) fail(label + ': target below 44px ' + selector);
  }
}
function assertPrivate(rows, label) {
  const forbidden = new Set(['answer','answers','score','scores','result','result_type','type','pattern','percentile']);
  rows.forEach(row => Object.keys(row.params || {}).forEach(key => { if (forbidden.has(key)) fail(label + ': private analytics key ' + key); }));
}

async function verifyRuntime(liveBase) {
  const server = liveBase ? null : localServer();
  if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = liveBase ? liveBase.replace(/\/$/, '') : 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless:true });
  const context = await browser.newContext({ serviceWorkers:'block' });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable:true, value:{ writeText:async value => { window.__copied = value; } } });
  });
  try {
    for (const language of LANGUAGES) {
      const page = await context.newPage(); await blockExternal(page);
      await page.goto(origin + '/shadow-work/?lang=' + language, { waitUntil:'domcontentloaded' });
      await page.locator('#app-loader.hidden').waitFor({ state:'attached', timeout:5000 });
      if (await page.getAttribute('html', 'lang') !== language) fail(language + ': document language mismatch');
      if ((await page.locator('[data-i18n="intro.boundary"]').textContent()).trim().length < 35) fail(language + ': start boundary missing');
      await layout(page, language); await page.click('#start-btn'); await complete(page);
      if (!(await page.locator('#result-title').textContent()).trim()) fail(language + ': result name missing');
      if ((await page.locator('[data-i18n="result.boundary"]').textContent()).trim().length < 35) fail(language + ': result boundary missing');
      const rows = await events(page);
      for (const event of ['shadow_reflection_start','shadow_reflection_complete']) if (rows.filter(row => row.name === event).length !== 1) fail(language + ': ' + event + ' not exact-once');
      assertPrivate(rows, language); await page.close();
    }

    const page = await context.newPage(); await blockExternal(page);
    await page.goto(origin + '/shadow-work/?lang=en&result=appease&score=9&surface=unknown', { waitUntil:'domcontentloaded' });
    await page.locator('#app-loader.hidden').waitFor({ state:'attached' });
    if (/result=|score=/.test(page.url())) fail('legacy sensitive URL keys were not removed before use');
    await page.click('#start-btn'); await complete(page); await page.click('#share-btn');
    const copied = await page.evaluate(() => window.__copied);
    if (copied !== 'https://dopabrain.com/shadow-work/?lang=en') fail('share URL is not neutral: ' + copied);
    assertPrivate(await events(page), 'neutral-share');

    const guide = await context.newPage(); await blockExternal(guide);
    await guide.goto(origin + '/portal/blog/en/carl-jung-shadow-self-explained.html', { waitUntil:'domcontentloaded' });
    await guide.locator('[data-qualified-action]').scrollIntoViewIfNeeded(); await guide.waitForTimeout(700);
    let rows = await events(guide);
    for (const event of ['content_view','content_en_jung_shadow_concept_view']) if (rows.filter(row => row.name === event).length !== 1) fail('guide ' + event + ' not exact-once');
    const hero = guide.locator('[data-cta-position="hero"]');
    const href = await hero.getAttribute('href');
    await hero.evaluate(link => link.addEventListener('click', event => event.preventDefault(), { once:true }));
    await hero.click(); rows = await events(guide);
    if (rows.filter(row => row.name === 'content_cta_click').length !== 1) fail('guide CTA event missing');
    await guide.goto(origin + href, { waitUntil:'domcontentloaded' });
    await guide.locator('#question-screen.active').waitFor({ state:'visible', timeout:5000 });
    rows = await events(guide);
    const start = rows.find(row => row.name === 'shadow_reflection_start');
    if (!start || start.params.entry_surface !== 'en_jung_shadow_primary') fail('guide auto-start attribution missing');
    assertPrivate(rows, 'guide-auto-start');

    const mobile = await context.newPage(); await mobile.setViewportSize({ width:360, height:740 }); await blockExternal(mobile);
    await mobile.goto(origin + '/shadow-work/?lang=en', { waitUntil:'domcontentloaded' });
    await mobile.locator('#app-loader.hidden').waitFor({ state:'attached' }); await layout(mobile, 'mobile');

    const fallback = await context.newPage(); await blockExternal(fallback);
    await fallback.route('**/shadow-work/js/locales/fr.json', route => route.abort());
    await fallback.goto(origin + '/shadow-work/?lang=fr', { waitUntil:'domcontentloaded' });
    await fallback.locator('#app-loader.hidden').waitFor({ state:'attached' });
    if (await fallback.getAttribute('html', 'lang') !== 'en') fail('locale fetch failure did not recover to English');
    await fallback.click('#start-btn'); await complete(fallback);

    return { origin, locales:LANGUAGES.length, scenariosPerLocale:8, guideAutoStart:true, neutralShare:true, privateTelemetry:true, mobile:true, localeFallback:true };
  } finally {
    await browser.close(); if (server) await new Promise(resolve => server.close(resolve));
  }
}

async function main() {
  const args = process.argv.slice(2); const liveIndex = args.indexOf('--url'); const liveBase = liveIndex >= 0 ? args[liveIndex + 1] : null;
  const source = verifySource(bundle());
  if (args.includes('--mutations')) verifyMutations();
  const runtime = await verifyRuntime(liveBase);
  console.log('[PASS] English Jung shadow reflection ' + JSON.stringify({ source, runtime }));
}
main().catch(error => { console.error('[FAIL] ' + error.stack); process.exitCode = 1; });
