#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const ARTICLE_PATH = path.join(PORTAL, 'blog', 'mbti-compatibility.html');
const REDIRECT_PATH = path.join(PORTAL, 'blog', 'mbti-love-compatibility-2026.html');
const INDEX_PATH = path.join(PORTAL, 'blog', 'index.html');
const SITEMAP_PATH = path.join(PORTAL, 'blog', 'sitemap.xml');
const VALENTINE_PATH = path.join(PORTAL, 'blog', 'valentine-compatibility-test-2026.html');
const URL_PATH = '/portal/blog/mbti-compatibility.html';
const OLD_PATH = '/portal/blog/mbti-love-compatibility-2026.html';
const CANONICAL = `https://dopabrain.com${URL_PATH}`;
const TITLE = 'MBTI 궁합표 16×16 | 점수 대신 관계 차이 읽는 법';
const HEADLINE = 'MBTI 궁합표 16×16: 점수 대신 관계 차이를 읽는 가이드';
const DESCRIPTION = 'MBTI 궁합표를 확률 점수나 최고·최악 순위 대신 4가지 선호 차이로 읽어보세요. 두 유형을 골라 같은 축과 다른 축, 대화 질문을 바로 확인합니다.';
const QUICK_TARGETS = ['mbti-love', 'couple-deck', 'attachment-style', 'love-language'];
const USAGE = `Usage:\n  node scripts/verify-mbti-compatibility-focus.js [--mutations]\n  node scripts/verify-mbti-compatibility-focus.js --url ${CANONICAL}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function loadFixture() {
  return {
    article: fs.readFileSync(ARTICLE_PATH, 'utf8'),
    redirect: fs.readFileSync(REDIRECT_PATH, 'utf8'),
    index: fs.readFileSync(INDEX_PATH, 'utf8'),
    sitemap: fs.readFileSync(SITEMAP_PATH, 'utf8'),
    valentine: fs.readFileSync(VALENTINE_PATH, 'utf8'),
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function jsonLd(article) {
  return [...article.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map(match => JSON.parse(match[1]));
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

function verifySource(fixture) {
  const { article, redirect, index, sitemap, valentine } = fixture;
  assert(article.includes('data-mbti-compatibility-contract="2026-08-30"'), 'Release contract marker is missing');
  assert(article.includes(`<title>${TITLE}</title>`), 'Canonical title contract drifted');
  assert(article.includes(`<meta name="description" content="${DESCRIPTION}">`), 'Canonical description contract drifted');
  assert(article.includes('<meta name="dateModified" content="2026-08-30">'), 'dateModified metadata is stale');
  assert(article.includes(`<link rel="canonical" href="${CANONICAL}">`), 'Canonical URL contract drifted');
  assert(count(article, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'Canonical page must have exactly one Auto Ads loader');
  assert(article.includes('https://www.myersbriggs.org/type-in-my-life/personality-type-and-relationships/home.htm'), 'Official Myers-Briggs relationship source is missing');

  assert(!/FAQPage|AggregateRating/.test(article), 'Unsupported FAQ or rating schema is present');
  const schemas = jsonLd(article);
  assert(schemas.length === 1, 'Expected one JSON-LD block');
  const graph = schemas[0]['@graph'];
  assert(Array.isArray(graph) && graph.length === 2, 'Expected Article and Breadcrumb schema only');
  const articleSchema = graph.find(node => node['@type'] === 'Article');
  const breadcrumb = graph.find(node => node['@type'] === 'BreadcrumbList');
  assert(articleSchema && breadcrumb, 'Article or Breadcrumb schema is missing');
  assert(articleSchema.headline === HEADLINE, 'Article schema headline drifted');
  assert(articleSchema.description === DESCRIPTION, 'Article schema description drifted');
  assert(articleSchema.dateModified === '2026-08-30' && articleSchema.inLanguage === 'ko', 'Article schema date/language drifted');

  const text = visibleText(article);
  assert(!/\b\d{2,3}\s*점\b|천생연분|최악\s*궁합|완벽한\s*궁합/.test(text), 'Arbitrary compatibility score or deterministic claim is present');
  assert(/최고의 조합이나 더 성공적인 조합이 따로 없/.test(text), 'Visible no-best-match trust boundary is missing');
  assert(/선택값은 URL·분석 이벤트·저장소로 보내지 않습니다/.test(text), 'Visible comparison privacy boundary is missing');

  const quick = [...article.matchAll(/<a class="quick-card"[^>]*data-target-slug="([^"]+)"/g)].map(match => match[1]);
  assert(JSON.stringify(quick) === JSON.stringify(QUICK_TARGETS), 'Korean quick-route set drifted');
  assert(/intersectionRatio\s*>=\s*0\.5/.test(article) && /},500\)/.test(article), 'Qualified comparison exposure contract is incomplete');
  assert(/observer\.observe\(document\.querySelector\('\.picker'\)\)/.test(article), 'Comparison exposure does not observe the usable picker');
  assert(/track\('content_mbti_compare_use'(?:,|\))/.test(article), 'Comparison-use telemetry is missing');
  assert(!/content_mbti_compare_use'\s*,\s*\{[^}]*type/i.test(article), 'Comparison telemetry leaks selected types');

  const sitemapRow = `<loc>${CANONICAL}</loc><lastmod>2026-08-30</lastmod>`;
  assert(sitemap.includes(sitemapRow), 'Canonical sitemap row/date is missing');
  assert(!sitemap.includes(OLD_PATH), 'Redirected duplicate remains in sitemap');
  assert(count(index, /\/portal\/blog\/mbti-compatibility\.html/g) === 1 && !index.includes(OLD_PATH), 'Blog catalog does not expose one canonical MBTI guide');
  assert(valentine.includes('href="/portal/blog/mbti-compatibility.html"') && !valentine.includes(OLD_PATH), 'Valentine related link does not use the canonical guide');

  assert(/<meta name="robots" content="noindex,follow">/.test(redirect), 'Redirect must be noindex,follow');
  assert(redirect.includes(`<link rel="canonical" href="${CANONICAL}">`), 'Redirect canonical is wrong');
  assert(redirect.includes(`content="0; url=${CANONICAL}"`), 'Redirect refresh target is wrong');
  assert(redirect.includes(`location.replace('${CANONICAL}')`), 'Redirect script target is wrong');
  assert(count(redirect, /pagead2\.googlesyndication\.com|googletagmanager\.com|\bgtag\s*\(/gi) === 0, 'Redirect must not load ads or analytics');
  assert(count(redirect, /<title>Redirecting\.\.\.<\/title>/g) === 1, 'Redirect title contract drifted');

  return { schemas: graph.length, quickRoutes: quick.length, sitemapCanonical: 1, redirects: 1 };
}

function runMutations(baseline) {
  const mutations = [
    ['score-claim', 'Arbitrary compatibility score', value => { value.article = value.article.replace('관계의 정답처럼', '95점 천생연분처럼'); }],
    ['hidden-faq', 'Unsupported FAQ or rating schema', value => { value.article += '<script type="application/ld+json">{"@type":"FAQPage"}</script>'; }],
    ['wrong-source', 'Official Myers-Briggs relationship source is missing', value => { value.article = value.article.replace('https://www.myersbriggs.org/type-in-my-life/personality-type-and-relationships/home.htm', 'https://example.com/opinion'); }],
    ['duplicate-sitemap', 'Redirected duplicate remains in sitemap', value => { value.sitemap += `<loc>https://dopabrain.com${OLD_PATH}</loc>`; }],
    ['broken-redirect', 'Redirect script target is wrong', value => { value.redirect = value.redirect.replace(`location.replace('${CANONICAL}')`, "location.replace('/portal/')"); }],
    ['quick-route-drift', 'Korean quick-route set drifted', value => { value.article = value.article.replace('data-target-slug="love-language"', 'data-target-slug="meme-news"'); }],
    ['tracking-too-easy', 'Qualified comparison exposure contract is incomplete', value => { value.article = value.article.replace('entry.intersectionRatio>=0.5', 'entry.intersectionRatio>=0'); }],
    ['selection-leak', 'Comparison telemetry leaks selected types', value => { value.article = value.article.replace("track('content_mbti_compare_use')", "track('content_mbti_compare_use',{type_a:a.value})"); }],
    ['schema-drift', 'Article schema headline drifted', value => { value.article = value.article.replace(`"headline":"${HEADLINE}"`, '"headline":"DopaBrain"'); }],
    ['catalog-duplicate', 'Blog catalog does not expose one canonical MBTI guide', value => { value.index += `href="${OLD_PATH}"`; }],
  ];
  for (const [name, expected, mutate] of mutations) {
    const fixture = clone(baseline);
    mutate(fixture);
    let message = '';
    try { verifySource(fixture); } catch (error) { message = error.message; }
    assert(message.includes(expected), `${name} mutation escaped: ${message || 'verifier passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
}

function createServer() {
  const types = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(PORTAL, pathname.replace(/^\/portal\//, ''));
    if (!file.startsWith(`${PORTAL}${path.sep}`) || !fs.existsSync(file)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':`${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
}

function browserEvents(dataLayer) {
  return dataLayer.map(item => Array.from(item || []))
    .filter(item => item[0] === 'event')
    .map(item => ({ name:item[1], params:item[2] || {} }));
}

async function layoutCheck(browser, baseUrl, local, viewport) {
  const context = await browser.newContext({ viewport });
  if (local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(baseUrl, { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForSelector('[data-mbti-compatibility-contract="2026-08-30"]');
    const state = await page.evaluate(() => ({
      title:document.title,
      lang:document.documentElement.lang,
      h1:document.querySelectorAll('h1').length,
      overflow:document.documentElement.scrollWidth - document.documentElement.clientWidth,
      quick:[...document.querySelectorAll('.quick-card')].map(node => ({ width:node.getBoundingClientRect().width, height:node.getBoundingClientRect().height })),
      controls:[...document.querySelectorAll('#type-a,#type-b,#compare-button,.cta-button')].map(node => ({ width:node.getBoundingClientRect().width, height:node.getBoundingClientRect().height })),
    }));
    assert(state.title === TITLE && state.lang === 'ko' && state.h1 === 1, `Runtime title/lang/H1 drift: ${JSON.stringify(state)}`);
    assert(state.overflow === 0, `${viewport.width}px viewport has ${state.overflow}px horizontal overflow`);
    for (const target of [...state.quick, ...state.controls]) assert(target.width >= 44 && target.height >= 44, `Touch target below 44px: ${JSON.stringify(target)}`);
    assert(errors.length === 0, `Page errors: ${errors.join(' | ')}`);
    return state;
  } finally {
    await context.close();
  }
}

async function interactionCheck(browser, baseUrl, local) {
  const context = await browser.newContext({ viewport:{ width:390, height:844 } });
  if (local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(baseUrl, { waitUntil:'domcontentloaded', timeout:30000 });
    await page.locator('.picker').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    let events = await page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item || [])));
    assert(browserEvents(events).filter(event => event.name === 'content_mbti_compare_view').length === 0, 'Comparison view fired before 500ms qualification');
    await page.waitForTimeout(400);
    await page.locator('body').evaluate(node => node.scrollIntoView());
    await page.locator('.picker').scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const exposureState = await page.locator('.picker').evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { top:Math.round(rect.top), bottom:Math.round(rect.bottom), height:Math.round(rect.height), viewport:innerHeight };
    });
    await page.selectOption('#type-a', 'INTJ');
    await page.selectOption('#type-b', 'ENFP');
    await page.click('#compare-button');
    const result = await page.locator('#compare-result').innerText();
    assert((await page.locator('#compare-result li').count()) === 4, 'Comparison result does not explain four axes');
    assert(result.includes('INTJ') && result.includes('ENFP'), 'Comparison result omitted selected types');
    assert(!/\d{2,3}\s*점|순위|확률/.test(result), 'Runtime comparison emitted a score, rank, or probability');

    await page.evaluate(() => document.addEventListener('click', event => {
      if (event.target.closest('.primary-box .cta-button')) event.preventDefault();
    }, true));
    await page.click('.primary-box .cta-button');
    await page.waitForTimeout(50);
    const telemetry = await page.evaluate(() => ({
      layer:(window.dataLayer || []).map(item => Array.from(item || [])),
      url:location.href,
      local:Object.entries(localStorage),
      session:Object.entries(sessionStorage),
    }));
    events = browserEvents(telemetry.layer);
    const eventCount = name => events.filter(event => event.name === name).length;
    assert(eventCount('content_mbti_compare_view') === 1, `Qualified comparison-view count is ${eventCount('content_mbti_compare_view')}, expected 1; picker=${JSON.stringify(exposureState)}; events=${events.map(event => event.name).join(',')}; errors=${errors.join(' | ')}`);
    assert(eventCount('content_mbti_compare_use') === 1, `Comparison-use count is ${eventCount('content_mbti_compare_use')}, expected 1`);
    assert(eventCount('content_cta_click') === 1, `Primary CTA count is ${eventCount('content_cta_click')}, expected 1`);
    const compareParams = events.find(event => event.name === 'content_mbti_compare_use').params;
    assert(!/INTJ|ENFP/.test(JSON.stringify(compareParams)), 'Comparison analytics leaked selected types');
    assert(!/INTJ|ENFP/.test(`${telemetry.url}${JSON.stringify(telemetry.local)}${JSON.stringify(telemetry.session)}`), 'Selection leaked to URL or browser storage');
    assert(errors.length === 0, `Page errors: ${errors.join(' | ')}`);
    return { view:eventCount('content_mbti_compare_view'), use:eventCount('content_mbti_compare_use'), cta:eventCount('content_cta_click'), axes:4 };
  } finally {
    await context.close();
  }
}

async function runtimeCheck(baseUrl, local) {
  const browser = await chromium.launch({ headless:true });
  try {
    const mobile = await layoutCheck(browser, baseUrl, local, { width:390, height:844 });
    const desktop = await layoutCheck(browser, baseUrl, local, { width:1440, height:900 });
    const events = await interactionCheck(browser, baseUrl, local);
    return { mobileOverflow:mobile.overflow, desktopOverflow:desktop.overflow, events };
  } finally {
    await browser.close();
  }
}

async function liveRedirectCheck() {
  const browser = await chromium.launch({ headless:true });
  const page = await browser.newPage({ viewport:{ width:390, height:844 } });
  try {
    await page.goto(`https://dopabrain.com${OLD_PATH}`, { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForURL(CANONICAL, { timeout:30000 });
    assert(page.url() === CANONICAL, `Live duplicate did not resolve to canonical: ${page.url()}`);
    assert(await page.locator('[data-mbti-compatibility-contract="2026-08-30"]').count() === 1, 'Live redirect destination is missing the release contract');
    return { from:OLD_PATH, to:URL_PATH };
  } finally {
    await browser.close();
  }
}

function parseArgs(argv) {
  const mutations = argv.includes('--mutations');
  const urlIndex = argv.indexOf('--url');
  const url = urlIndex >= 0 ? argv[urlIndex + 1] : null;
  const known = (mutations ? 1 : 0) + (urlIndex >= 0 ? 2 : 0);
  assert(argv.length === known && !(mutations && url), USAGE);
  if (!url) return { mutations, url:null };
  const parsed = new URL(url);
  assert(parsed.protocol === 'https:' && parsed.host === 'dopabrain.com' && parsed.pathname === URL_PATH && !parsed.search && !parsed.hash, USAGE);
  return { mutations:false, url:parsed.href };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.url) {
    const runtime = await runtimeCheck(args.url, false);
    const redirect = await liveRedirectCheck();
    console.log(`PASS: live MBTI compatibility focus ${JSON.stringify({ runtime, redirect })}`);
    return;
  }
  const fixture = loadFixture();
  const source = verifySource(fixture);
  if (args.mutations) runMutations(fixture);
  const server = createServer();
  const address = await listenOnSafePort(server);
  try {
    const runtime = await runtimeCheck(`http://127.0.0.1:${address.port}${URL_PATH}`, true);
    console.log(`PASS: MBTI compatibility focus ${JSON.stringify({ source, runtime })}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
