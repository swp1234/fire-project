#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'attachment-style');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const FILES = {
  index: path.join(APP, 'index.html'),
  js: path.join(APP, 'js', 'app.js'),
  css: path.join(APP, 'css', 'style.css'),
  sw: path.join(APP, 'sw.js'),
  guide: path.join(PORTAL, 'blog', 'fr', 'attachment-style-test-quiz.html'),
  catalog: path.join(PORTAL, 'blog', 'fr', 'index.html'),
  sitemap: path.join(PORTAL, 'blog', 'sitemap.xml'),
};
const CTA = '/attachment-style/?lang=fr&amp;start=1&amp;source=fr_attachment_guide_primary&amp;surface=fr_attachment_guide_primary';
const GUIDE_EVENTS = ['content_view', 'content_fr_attachment_boundary_view', 'content_cta_click', 'content_related_click'];
const TOTAL_SCENARIOS = 10;

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function count(source, pattern) { return (source.match(pattern) || []).length; }
function loadBundle() {
  return Object.fromEntries(Object.entries(FILES).map(function (entry) { return [entry[0], read(entry[1])]; }));
}

function verifySource(source) {
  if (!/<html lang="fr"/.test(source.guide) || !/<h1>Quel est votre style d’attachement \?<\/h1>/.test(source.guide)) fail('French query identity drifted');
  if (!/dateModified[^\n]+2026-09-01/.test(source.guide)) fail('guide release date drifted');
  for (const evidence of ['ECR-R', '36 items', '18 portent sur l’anxiété', '18 sur l’évitement', 'deux dimensions continues', '224 études']) {
    if (!new RegExp(evidence, 'i').test(source.guide)) fail('evidence boundary missing: ' + evidence);
  }
  for (const sourceUrl of ['labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm', 'PMC3954965', '36201836']) {
    if (!new RegExp(sourceUrl, 'i').test(source.guide)) fail('primary source missing: ' + sourceUrl);
  }
  if (/régit.+tout au long de votre vie|crée un attachement|prédicteurs? les plus forts|20\s*[–-]\s*30\s*%|40\s*%|neuroplastic|EMDR|FAQPage|AggregateRating/i.test(source.guide)) {
    fail('unsupported cause, outcome, treatment, or structured proof remains');
  }
  const escapedCta = CTA.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
  if (count(source.guide, new RegExp(escapedCta, 'g')) !== 2) fail('guide must contain two identical direct-start CTAs');
  for (const event of GUIDE_EVENTS) if (!source.guide.includes("'" + event + "'")) fail('guide event missing: ' + event);
  if (!/intersectionRatio>=\.35/.test(source.guide) || !/setTimeout\(qualify,500\)/.test(source.guide)) fail('qualified visibility contract drifted');
  if (/target_url|link_url|content_ad_|scroll_(?:depth|engagement)|timer_engagement|cross-promo/.test(source.guide)) fail('unsafe legacy telemetry or generic promotion remains');
  if (count(source.guide, /<a[^>]+class="quick-card"[^>]+data-content-surface="quick_rail"[^>]+data-target-slug=/g) !== 2) fail('focused rail must contain exactly two attributed cards');
  if (count(source.guide, /\/portal\/js\/ad-loader\.js/g) !== 1 || /data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*(?:=|\.push)/.test(source.guide)) fail('guide is not managed Auto Ads only');
  if (!/Style d’attachement : repères, limites et réflexion privée/.test(source.catalog) || !/6 min/.test(source.catalog)) fail('French catalog card drifted');
  if (!/attachment-style-test-quiz\.html<\/loc><lastmod>2026-09-01<\/lastmod><changefreq>monthly<\/changefreq><priority>0\.8/.test(source.sitemap)) fail('blog sitemap release row drifted');

  for (const value of ['direct', 'en_avoidant_guide_primary', 'fr_attachment_guide_primary', 'clarity_board', 'clarity_header', 'clarity_footer']) {
    if (!source.js.includes("'" + value + "'")) fail('source or surface allowlist missing: ' + value);
  }
  for (const phrase of ['ECR-R', '36 items', 'not the ECR-R', 'not a diagnosis', 'Answers stay in this browser']) {
    if (!source.index.includes(phrase)) fail('visible app boundary missing: ' + phrase);
  }
  if (count(source.index, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) !== 1) fail('app must contain exactly one Auto Ads loader');
  if (/<ins\b[^>]*adsbygoogle|data-ad-slot|adsbygoogle\s*(?:=|\.push)/i.test(source.index + '\n' + source.js)) fail('app manual ad surface remains');
  if (/result_type|secondary_type|option_key|scenario_number|share_url|attachment_style=|utm_content|trackEvent\([^\n]+scores?\b/i.test(source.js)) fail('private result, answer, score, or share data can leak');
  const shareBody = source.js.match(/function neutralShareUrl\(\)\s*\{([\s\S]*?)\n    \}/);
  if (!shareBody || count(shareBody[1], /searchParams\.set\('lang'/g) !== 1 || /searchParams\.set\('(?!lang')/.test(shareBody[1])) fail('share URL is not language-only');
  if (!/attachment-reflection-v4/.test(source.sw) || /manifest\.json/.test(source.sw)) fail('service worker cache contract drifted');
  return { guideBytes: Buffer.byteLength(source.guide), scenarios: TOTAL_SCENARIOS, guideEvents: GUIDE_EVENTS.length, privateTelemetry: true, autoAdsOnly: true };
}

function expectMutation(name, mutate) {
  const source = loadBundle();
  mutate(source);
  try { verifySource(source); } catch (error) { console.log('[PASS] ' + name + ': ' + error.message); return; }
  fail('mutation escaped: ' + name);
}

function verifyMutations() {
  const mutations = [
    ['fixed-childhood-cause', function (s) { s.guide += '<p>Ce modèle régit vos relations tout au long de votre vie.</p>'; }],
    ['treatment-claim', function (s) { s.guide += '<p>EMDR transforme votre style.</p>'; }],
    ['fake-faq', function (s) { s.guide += '<script type="application/ld+json">{"@type":"FAQPage"}</script>'; }],
    ['manual-guide-ad', function (s) { s.guide += '<ins class="adsbygoogle" data-ad-slot="x"></ins>'; }],
    ['synthetic-ad-event', function (s) { s.guide += "<script>gtag('event','content_ad_impression')</script>"; }],
    ['cta-drift', function (s) { s.guide = s.guide.replace('source=fr_attachment_guide_primary', 'source=unknown'); }],
    ['missing-primary-source', function (s) { s.guide = s.guide.replace('PMC3954965', 'removed-study'); }],
    ['catalog-drift', function (s) { s.catalog = s.catalog.replace('Style d’attachement : repères, limites et réflexion privée', 'Ancien test'); }],
    ['sitemap-drift', function (s) { s.sitemap = s.sitemap.replace('attachment-style-test-quiz.html</loc><lastmod>2026-09-01', 'attachment-style-test-quiz.html</loc><lastmod>2026-06-19'); }],
    ['missing-fr-source', function (s) { s.js = s.js.replace(/'fr_attachment_guide_primary'/g, "'removed_fr_source'"); }],
    ['private-result-event', function (s) { s.js += "trackEvent('x',{result_type:currentResult.primary})"; }],
    ['private-share', function (s) { s.js = s.js.replace("url.searchParams.set('lang', i18n.currentLang || 'en');", "url.searchParams.set('lang', i18n.currentLang || 'en');url.searchParams.set('attachment_style',currentResult.primary);"); }],
    ['stale-cache', function (s) { s.sw = s.sw.replace('attachment-reflection-v4', 'attachment-reflection-v3'); }],
  ];
  for (const mutation of mutations) expectMutation(mutation[0], mutation[1]);
  console.log('[PASS] mutation summary ' + mutations.length + '/' + mutations.length + ' detected');
}

function mime(file) { return ({ '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg' })[path.extname(file)] || 'application/octet-stream'; }
function localServer() {
  return http.createServer(function (request, response) {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let base; let relative;
    if (pathname === '/attachment-style' || pathname.startsWith('/attachment-style/')) { base = APP; relative = pathname.replace(/^\/attachment-style\/?/, ''); }
    else if (pathname === '/portal' || pathname.startsWith('/portal/')) { base = PORTAL; relative = pathname.replace(/^\/portal\/?/, ''); }
    else { response.writeHead(404); response.end('not found'); return; }
    let file = path.resolve(base, relative || 'index.html');
    if (!file.startsWith(path.resolve(base) + path.sep) && file !== path.resolve(base, 'index.html')) { response.writeHead(403); response.end('forbidden'); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('not found'); return; }
    response.writeHead(200, { 'content-type':mime(file), 'cache-control':'no-store' }); fs.createReadStream(file).pipe(response);
  });
}
async function blockExternal(page) {
  await page.route('**/googletagmanager.com/**', function (route) { return route.abort(); });
  await page.route('**/googlesyndication.com/**', function (route) { return route.abort(); });
  await page.route('**/doubleclick.net/**', function (route) { return route.abort(); });
}
function eventRows(page) {
  return page.evaluate(function () { return (window.dataLayer || []).map(function (row) { return Array.from(row || []); }).filter(function (row) { return row[0] === 'event'; }).map(function (row) { return { name:row[1], params:row[2] || {} }; }); });
}
async function completeReflection(page) {
  for (let index = 0; index < TOTAL_SCENARIOS; index += 1) { const first = page.locator('.reply-btn:not([disabled])').first(); await first.waitFor({ state:'visible', timeout:5000 }); await first.evaluate(function (button) { button.click(); }); }
  await page.locator('#result-screen.active').waitFor({ state:'visible', timeout:5000 });
}
async function assertLayout(page, label) {
  const overflow = await page.evaluate(function () { return document.documentElement.scrollWidth - window.innerWidth; });
  if (overflow > 1) fail(label + ': horizontal overflow ' + overflow + 'px');
  const button = page.locator('#start-btn'); if (await button.isVisible()) { const box = await button.boundingBox(); if (!box || box.width < 44 || box.height < 44) fail(label + ': start target below 44px'); }
}

async function verifyRuntime(live) {
  const server = live ? null : localServer(); if (server) await new Promise(function (resolve) { server.listen(0, '127.0.0.1', resolve); });
  const origin = live ? 'https://dopabrain.com' : 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless:true }); const context = await browser.newContext({ serviceWorkers:'block', viewport:{ width:390, height:844 } });
  await context.addInitScript(function () { Object.defineProperty(navigator, 'clipboard', { configurable:true, value:{ writeText:async function (value) { window.__copied = value; } } }); });
  try {
    const page = await context.newPage(); await blockExternal(page);
    await page.goto(origin + '/portal/blog/fr/attachment-style-test-quiz.html', { waitUntil:'domcontentloaded' });
    if ((await page.locator('h1').textContent()).trim() !== 'Quel est votre style d’attachement ?') fail('live guide H1 drifted');
    await page.locator('[data-qualified-action]').scrollIntoViewIfNeeded(); await page.waitForTimeout(650);
    const action = page.locator('[data-cta-position="action"]'); const href = await action.getAttribute('href');
    await page.locator('.quick-card').first().evaluate(function (link) { link.addEventListener('click', function (event) { event.preventDefault(); }, { capture:true, once:true }); });
    await action.evaluate(function (link) { link.addEventListener('click', function (event) { event.preventDefault(); }, { capture:true, once:true }); });
    await page.locator('.quick-card').first().click(); await action.click();
    const guideRows = await eventRows(page); for (const event of GUIDE_EVENTS) if (guideRows.filter(function (row) { return row.name === event; }).length !== 1) fail('guide ' + event + ' not exact-once');
    await page.goto(origin + href, { waitUntil:'domcontentloaded' });
    await page.locator('.reply-btn:not([disabled])').first().waitFor({ state:'visible', timeout:5000 });
    if (await page.getAttribute('html', 'lang') !== 'fr') fail('linked app did not retain French locale');
    await completeReflection(page); let rows = await eventRows(page);
    for (const event of ['attachment_reflection_view','attachment_reflection_start','attachment_reflection_complete']) if (rows.filter(function (row) { return row.name === event; }).length !== 1) fail('app ' + event + ' not exact-once');
    const view = rows.find(function (row) { return row.name === 'attachment_reflection_view'; });
    if (!view || view.params.source !== 'fr_attachment_guide_primary' || view.params.surface !== 'fr_attachment_guide_primary') fail('French guide attribution was not normalized');
    const payload = JSON.stringify(rows); if (/"(?:secure|anxious|avoidant|fearful)"|option_key|scenario_number|result_type|score/i.test(payload)) fail('private result or answer leaked to analytics');
    await page.click('#share-copy'); await page.waitForFunction(function () { return Boolean(window.__copied); }); const shared = new URL(await page.evaluate(function () { return window.__copied; }));
    if (shared.pathname !== '/attachment-style/' || Array.from(shared.searchParams.keys()).join(',') !== 'lang' || shared.searchParams.get('lang') !== 'fr') fail('shared URL is not neutral French entry');
    await assertLayout(page, 'French mobile completion');
    await page.setViewportSize({ width:1365, height:900 }); await page.goto(origin + '/attachment-style/?lang=fr&source=untrusted&surface=untrusted', { waitUntil:'domcontentloaded' }); await page.waitForTimeout(600);
    const unknown = (await eventRows(page)).find(function (row) { return row.name === 'attachment_reflection_view'; }); if (!unknown || unknown.params.source !== 'direct' || unknown.params.surface !== 'direct') fail('unknown attribution did not normalize to direct');
    await assertLayout(page, 'French desktop'); await page.close();
    return { environment:live ? 'live':'local', linkedCompletion:1, guideEvents:GUIDE_EVENTS.length, appEvents:3, mobileAndDesktop:true, privateTelemetry:true, neutralShare:true };
  } finally { await context.close(); await browser.close(); if (server) await new Promise(function (resolve) { server.close(resolve); }); }
}

(async function () {
  console.log('[PASS] source contract', verifySource(loadBundle()));
  if (process.argv.includes('--mutations')) verifyMutations();
  console.log('[PASS] runtime contract', await verifyRuntime(process.argv.includes('--live')));
  console.log('[PASS] French attachment reflection path verified');
})().catch(function (error) { console.error('[FAIL] ' + error.message); process.exit(1); });
