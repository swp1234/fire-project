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
  guide: path.join(PORTAL, 'blog', 'en', 'avoidant-attachment-healing-guide.html'),
  catalog: path.join(PORTAL, 'blog', 'en', 'index.html'),
};
const LANGUAGES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const GUIDE_EVENTS = ['content_view', 'content_en_avoidant_pattern_view', 'content_cta_click', 'content_related_click'];
const APP_EVENTS = [
  'attachment_reflection_view',
  'attachment_reflection_start',
  'attachment_reflection_complete',
  'attachment_reflection_restart',
  'attachment_reflection_share',
  'attachment_reflection_related_click',
  'attachment_reflection_evidence_open',
];
const CTA = '/attachment-style/?lang=en&amp;start=1&amp;surface=en_avoidant_guide_primary';
const TOTAL_SCENARIOS = 10;

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function count(source, pattern) { return (source.match(pattern) || []).length; }
function loadBundle() {
  return Object.fromEntries(Object.entries(FILES).map(function (entry) {
    return [entry[0], read(entry[1])];
  }));
}

function verifySource(source) {
  if (!/<html lang="en"/.test(source.index) || !/Attachment Response Reflection/.test(source.index)) {
    fail('app language or reflection identity drifted');
  }
  if (!/dateModified[^\n]+2026-08-30/.test(source.index) || !/dateModified[^\n]+2026-08-30/.test(source.guide)) {
    fail('release date drifted');
  }
  for (const language of LANGUAGES) {
    if (!new RegExp('hreflang="' + language + '"').test(source.index)) fail('app hreflang missing: ' + language);
    if (!new RegExp('^    ' + language + ': ', 'm').test(source.js)) fail('localized evidence copy missing: ' + language);
    if (!new RegExp('^    ' + language + ': \\[', 'm').test(source.js)) fail('localized result label missing: ' + language);
  }
  for (const phrase of ['ECR-R', '36 items', 'not the ECR-R', 'not a diagnosis', 'Answers stay in this browser']) {
    if (!source.index.includes(phrase)) fail('visible app evidence boundary missing: ' + phrase);
  }
  if (count(source.index, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) !== 1) {
    fail('app must contain exactly one Auto Ads loader');
  }
  if (/<ins\b[^>]*adsbygoogle|data-ad-slot|adsbygoogle\s*(?:=|\.push)/i.test(source.index + '\n' + source.js)) {
    fail('app contains a manual ad surface or push');
  }
  if (/AggregateRating|ratingValue|ratingCount|reviewCount|FAQPage|2,400|social-proof|percentile|Math\.random/i.test(source.index + '\n' + source.js + '\n' + source.css)) {
    fail('fabricated proof, FAQ, or random percentile remains');
  }
  if (/quiz_answer_selected|attachment_result_ad_impression|result_ad_impression|page_engage|quiz_start|test_start|result_view|quiz_complete/.test(source.js)) {
    fail('legacy or synthetic analytics remain');
  }
  for (const event of APP_EVENTS) if (!source.js.includes("'" + event + "'")) fail('app event missing: ' + event);
  for (const value of ['direct', 'en_avoidant_guide_primary', 'fr_attachment_guide_primary', 'clarity_board', 'clarity_header', 'clarity_footer']) {
    if (!source.js.includes("'" + value + "'")) fail('source or surface allowlist missing: ' + value);
  }
  if (/result_type|secondary_type|option_key|scenario_number|share_url|attachment_style=|utm_content|event_label\s*:\s*(?:primary|type)|trackEvent\([^\n]+scores?\b/i.test(source.js)) {
    fail('private answer, result, score, or share data can enter analytics or URL');
  }
  const shareBody = source.js.match(/function neutralShareUrl\(\)\s*\{([\s\S]*?)\n    \}/);
  if (!shareBody || count(shareBody[1], /searchParams\.set\('lang'/g) !== 1 || /searchParams\.set\('(?!lang')/.test(shareBody[1])) {
    fail('share URL is not language-only and neutral');
  }
  if (!/attachment-reflection-v4/.test(source.sw) || /manifest\.json/.test(source.sw)) {
    fail('service worker cache contract drifted');
  }

  if (!/<h1>Avoidant attachment: what does it actually mean\?<\/h1>/.test(source.guide)) fail('guide direct-answer H1 drifted');
  for (const evidence of ['PMC3954965', '36201836', 'PMC8470855', '36 items', '224 studies', 'continuous dimension', 'not a clinical diagnosis']) {
    if (!new RegExp(evidence, 'i').test(source.guide)) fail('guide evidence missing: ' + evidence);
  }
  if (/usually crystallize|always begins in childhood|childhood origins|polyvagal|dorsal vagal|science-backed healing|7-step healing|12 behavioral patterns|FAQPage/i.test(source.guide)) {
    fail('unsupported origin, mechanism, roadmap, or FAQ claim remains');
  }
  const escapedCta = CTA.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
  if (count(source.guide, new RegExp(escapedCta, 'g')) !== 2) fail('guide must contain two identical direct-start CTAs');
  for (const event of GUIDE_EVENTS) if (!source.guide.includes("'" + event + "'")) fail('guide event missing: ' + event);
  if (!/intersectionRatio>=\.35/.test(source.guide) || !/setTimeout\(\(\)=>\{[^}]+\},500\)/.test(source.guide)) {
    fail('qualified guide view timing or visibility drifted');
  }
  if (/target_url|link_url|content_ad_|scroll_(?:depth|engagement)|timer_engagement|cross-promo/.test(source.guide)) {
    fail('guide contains unsafe legacy telemetry or generic promotion');
  }
  if (count(source.guide, /<a[^>]+class="quick-card"[^>]+data-content-surface="quick_rail"[^>]+data-target-slug=/g) !== 2) {
    fail('focused evidence rail must contain exactly two attributed internal cards');
  }
  if (count(source.guide, /\/portal\/js\/ad-loader\.js/g) !== 1 || /data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*(?:=|\.push)/.test(source.guide)) {
    fail('guide is not managed Auto Ads only');
  }
  if (!/Avoidant Attachment: Meaning, Limits, and One Practice/.test(source.catalog) || !/6 min/.test(source.catalog)) {
    fail('English catalog card drifted');
  }
  return {
    appBytes: Buffer.byteLength(source.index) + Buffer.byteLength(source.js),
    guideBytes: Buffer.byteLength(source.guide),
    languages: LANGUAGES.length,
    events: GUIDE_EVENTS.length + APP_EVENTS.length,
    privateTelemetry: false,
    autoAdsOnly: true,
  };
}

function expectMutation(name, mutate) {
  const source = loadBundle();
  mutate(source);
  try { verifySource(source); } catch (error) {
    console.log('[PASS] ' + name + ': ' + error.message);
    return;
  }
  fail('mutation escaped: ' + name);
}

function verifyMutations() {
  const mutations = [
    ['fake-rating', function (source) { source.index += '<div itemprop="AggregateRating">4.9</div>'; }],
    ['manual-ad', function (source) { source.index += '<ins class="adsbygoogle" data-ad-slot="auto"></ins>'; }],
    ['fake-ad-event', function (source) { source.js += "trackEvent('attachment_result_ad_impression')"; }],
    ['answer-event', function (source) { source.js += "trackEvent('quiz_answer_selected',{option_key:key})"; }],
    ['result-payload', function (source) { source.js += "trackEvent('x',{result_type:primary})"; }],
    ['private-share', function (source) { source.js = source.js.replace("url.searchParams.set('lang', i18n.currentLang || 'en');", "url.searchParams.set('lang', i18n.currentLang || 'en'); url.searchParams.set('attachment_style', currentResult.primary);"); }],
    ['missing-clarity-source', function (source) { source.js = source.js.replace("'clarity_board'", "'removed_board'"); }],
    ['missing-locale-result', function (source) { source.js = source.js.replace("    hi: ['स्थिर", "    removed_hi: ['स्थिर"); }],
    ['false-childhood-claim', function (source) { source.guide += '<p>Avoidant attachment always begins in childhood.</p>'; }],
    ['cta-drift', function (source) { source.guide = source.guide.replace('surface=en_avoidant_guide_primary', 'surface=unknown'); }],
    ['missing-study', function (source) { source.guide = source.guide.replace('PMC8470855', 'removed-study'); }],
    ['catalog-drift', function (source) { source.catalog = source.catalog.replace('Avoidant Attachment: Meaning, Limits, and One Practice', 'Old attachment article'); }],
    ['focused-rail-drift', function (source) { source.guide = source.guide.replace('data-target-slug="emotion_iceberg"', 'data-removed-slug="emotion_iceberg"'); }],
  ];
  for (const mutation of mutations) expectMutation(mutation[0], mutation[1]);
  console.log('[PASS] mutation summary ' + mutations.length + '/' + mutations.length + ' detected');
}

function mime(file) {
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
  })[path.extname(file)] || 'application/octet-stream';
}

function localServer() {
  return http.createServer(function (request, response) {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let base;
    let relative;
    if (pathname === '/attachment-style' || pathname.startsWith('/attachment-style/')) {
      base = APP;
      relative = pathname.replace(/^\/attachment-style\/?/, '');
    } else if (pathname === '/portal' || pathname.startsWith('/portal/')) {
      base = PORTAL;
      relative = pathname.replace(/^\/portal\/?/, '');
    } else {
      response.writeHead(404); response.end('not found'); return;
    }
    let file = path.resolve(base, relative || 'index.html');
    if (!file.startsWith(path.resolve(base) + path.sep) && file !== path.resolve(base, 'index.html')) {
      response.writeHead(403); response.end('forbidden'); return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      response.writeHead(404); response.end('not found'); return;
    }
    response.writeHead(200, { 'content-type': mime(file), 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(response);
  });
}

async function blockExternal(page) {
  await page.route('**/googletagmanager.com/**', function (route) { return route.abort(); });
  await page.route('**/googlesyndication.com/**', function (route) { return route.abort(); });
  await page.route('**/doubleclick.net/**', function (route) { return route.abort(); });
}

function eventRows(page) {
  return page.evaluate(function () {
    return (window.dataLayer || [])
      .map(function (row) { return Array.from(row || []); })
      .filter(function (row) { return row[0] === 'event'; })
      .map(function (row) { return { name: row[1], params: row[2] || {} }; });
  });
}

async function completeReflection(page) {
  for (let index = 0; index < TOTAL_SCENARIOS; index += 1) {
    const first = page.locator('.reply-btn:not([disabled])').first();
    await first.waitFor({ state: 'visible', timeout: 5000 });
    await first.evaluate(function (button) { button.click(); });
  }
  await page.locator('#result-screen.active').waitFor({ state: 'visible', timeout: 5000 });
}

async function assertLayout(page, label) {
  const overflow = await page.evaluate(function () { return document.documentElement.scrollWidth - window.innerWidth; });
  if (overflow > 1) fail(label + ': horizontal overflow ' + overflow + 'px');
  const start = page.locator('#start-btn');
  if (await start.isVisible()) {
    const box = await start.boundingBox();
    if (!box || box.width < 44 || box.height < 44) fail(label + ': start target below 44px');
  }
}

async function verifyRuntime(live) {
  const server = live ? null : localServer();
  if (server) await new Promise(function (resolve) { server.listen(0, '127.0.0.1', resolve); });
  const origin = live ? 'https://dopabrain.com' : 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce' });
  await context.addInitScript(function () {
    // Keep article exposure timers real; only collapse deliberate quiz animation delays.
    const nativeSetTimeout = window.setTimeout;
    window.setTimeout = function (callback, delay) {
      const args = Array.prototype.slice.call(arguments, 2);
      const effectiveDelay = location.pathname.startsWith('/attachment-style/')
        ? Math.min(Number(delay) || 0, 1)
        : delay;
      return nativeSetTimeout.apply(window, [callback, effectiveDelay].concat(args));
    };
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async function (value) { window.__copied = value; } },
    });
  });
  try {
    for (const language of LANGUAGES) {
      const page = await context.newPage();
      await blockExternal(page);
      await page.goto(origin + '/attachment-style/?lang=' + language, { waitUntil: 'domcontentloaded' });
      await page.locator('#app-loader.hidden').waitFor({ state: 'attached' });
      if (await page.getAttribute('html', 'lang') !== language) fail(language + ': document language mismatch');
      if (!(await page.locator('#reflection-title').textContent()).trim()) fail(language + ': title missing');
      if ((await page.locator('#reflection-boundary').textContent()).trim().length < 40) fail(language + ': evidence boundary missing');
      await assertLayout(page, language);
      await page.click('#start-btn');
      await completeReflection(page);
      if (!(await page.locator('#result-type').textContent()).trim()) fail(language + ': result label missing');
      if ((await page.locator('#result-boundary').textContent()).trim().length < 35) fail(language + ': result boundary missing');
      const rows = await eventRows(page);
      for (const event of ['attachment_reflection_start', 'attachment_reflection_complete']) {
        if (rows.filter(function (row) { return row.name === event; }).length !== 1) fail(language + ': ' + event + ' not exact-once');
      }
      const payload = JSON.stringify(rows);
      if (/\"(?:secure|anxious|avoidant|fearful)\"|option_key|scenario_number|result_type|score/i.test(payload)) fail(language + ': private answer or result leaked to analytics');
      await page.close();
    }

    const page = await context.newPage();
    await blockExternal(page);
    await page.goto(origin + '/portal/blog/en/avoidant-attachment-healing-guide.html', { waitUntil: 'domcontentloaded' });
    if ((await page.locator('h1').textContent()).trim() !== 'Avoidant attachment: what does it actually mean?') fail('linked guide H1 drifted');
    await page.locator('[data-qualified-action]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.locator('[data-cta-position="action"]').evaluate(function (link) {
      link.addEventListener('click', function (event) { event.preventDefault(); }, { capture: true, once: true });
    });
    const href = await page.locator('[data-cta-position="action"]').getAttribute('href');
    await page.locator('.quick-card').first().evaluate(function (link) {
      link.addEventListener('click', function (event) { event.preventDefault(); }, { capture: true, once: true });
    });
    await page.locator('.quick-card').first().click();
    await page.locator('[data-cta-position="action"]').click();
    const guideRows = await eventRows(page);
    for (const event of GUIDE_EVENTS) {
      if (guideRows.filter(function (row) { return row.name === event; }).length !== 1) fail('guide ' + event + ' not exact-once');
    }

    await page.goto(origin + href, { waitUntil: 'domcontentloaded' });
    await page.locator('.reply-btn:not([disabled])').first().waitFor({ state: 'visible', timeout: 5000 });
    await completeReflection(page);
    let appRows = await eventRows(page);
    for (const event of ['attachment_reflection_view', 'attachment_reflection_start', 'attachment_reflection_complete']) {
      if (appRows.filter(function (row) { return row.name === event; }).length !== 1) fail('linked app ' + event + ' not exact-once');
    }
    const view = appRows.find(function (row) { return row.name === 'attachment_reflection_view'; });
    if (view.params.source !== 'en_avoidant_guide_primary' || view.params.surface !== 'en_avoidant_guide_primary') fail('guide source and surface were not normalized');
    await page.click('#share-copy');
    await page.waitForFunction(function () { return Boolean(window.__copied); });
    const copied = await page.evaluate(function () { return window.__copied; });
    const copiedUrl = new URL(copied);
    if (copiedUrl.pathname !== '/attachment-style/' || Array.from(copiedUrl.searchParams.keys()).join(',') !== 'lang') fail('shared link contains a result or tracking value');
    await page.locator('#primary-related-cta').evaluate(function (link) {
      link.addEventListener('click', function (event) { event.preventDefault(); }, { capture: true, once: true });
    });
    await page.click('#primary-related-cta');
    appRows = await eventRows(page);
    for (const event of ['attachment_reflection_share', 'attachment_reflection_related_click']) {
      if (appRows.filter(function (row) { return row.name === event; }).length !== 1) fail('linked app ' + event + ' not exact-once');
    }
    const payload = JSON.stringify(appRows);
    if (/\"(?:secure|anxious|avoidant|fearful)\"|option_key|scenario_number|result_type|attachment_style/i.test(payload)) fail('linked journey exposed a private answer or result');
    await assertLayout(page, 'linked mobile');

    await page.setViewportSize({ width: 1365, height: 900 });
    await page.goto(origin + '/attachment-style/?lang=en&source=untrusted&surface=untrusted', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const unknown = (await eventRows(page)).find(function (row) { return row.name === 'attachment_reflection_view'; });
    if (!unknown || unknown.params.source !== 'direct' || unknown.params.surface !== 'direct') fail('unknown attribution did not normalize to direct');
    await assertLayout(page, 'desktop');

    await page.goto(origin + '/attachment-style/?lang=en&source=clarity_board&surface=clarity_header', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const clarity = (await eventRows(page)).find(function (row) { return row.name === 'attachment_reflection_view'; });
    if (!clarity || clarity.params.source !== 'clarity_board' || clarity.params.surface !== 'clarity_header') fail('clarity board attribution drifted');
    await page.close();

    return {
      environment: live ? 'live' : 'local',
      localeCompletions: LANGUAGES.length,
      linkedJourney: 1,
      mobileAndDesktop: true,
      privateTelemetry: true,
      neutralShare: true,
      autoAdsOnly: true,
    };
  } finally {
    await context.close();
    await browser.close();
    if (server) await new Promise(function (resolve) { server.close(resolve); });
  }
}

(async function () {
  console.log('[PASS] source contract', verifySource(loadBundle()));
  if (process.argv.includes('--mutations')) verifyMutations();
  console.log('[PASS] runtime contract', await verifyRuntime(process.argv.includes('--live')));
  console.log('[PASS] English attachment reflection path verified');
})().catch(function (error) {
  console.error('[FAIL] ' + error.message);
  process.exit(1);
});
