#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const APP = path.join(ROOT, 'projects', 'brain-type');
const ROUTE = '/portal/blog/ja/brain-type-test.html';
const LIVE = `https://dopabrain.com${ROUTE}`;
const QUICK = ['brain-type', 'animal-personality', 'eq-test', 'attachment-style'];
const USAGE = `Usage:\n  node scripts/verify-ja-brain-type.js [--mutations]\n  node scripts/verify-ja-brain-type.js --url ${LIVE}`;

function assert(value, message) { if (!value) throw new Error(message); }
function count(text, pattern) { return (text.match(pattern) || []).length; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function visible(html) { return html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); }
function events(layer) { return layer.map((row) => Array.from(row || [])).filter((row) => row[0] === 'event').map((row) => ({ name: row[1], params: row[2] || {} })); }

function fixture() {
  return {
    guide: fs.readFileSync(path.join(PORTAL, 'blog', 'ja', 'brain-type-test.html'), 'utf8'),
    index: fs.readFileSync(path.join(PORTAL, 'blog', 'ja', 'index.html'), 'utf8'),
    sitemap: fs.readFileSync(path.join(PORTAL, 'blog', 'sitemap.xml'), 'utf8'),
    appHtml: fs.readFileSync(path.join(APP, 'index.html'), 'utf8'),
    appJs: fs.readFileSync(path.join(APP, 'js', 'app.js'), 'utf8'),
    ja: fs.readFileSync(path.join(APP, 'js', 'locales', 'ja.json'), 'utf8'),
  };
}

function verifySource(value) {
  const text = visible(value.guide);
  assert(value.guide.includes('data-ja-brain-type-contract="2026-08-30"'), 'Japanese Brain Type guide marker missing');
  assert(value.guide.includes('<meta name="dateModified" content="2026-08-30">'), 'Japanese Brain Type guide date is stale');
  assert(value.guide.includes(`<link rel="canonical" href="${LIVE}">`), 'Japanese Brain Type canonical drifted');
  assert(count(value.guide, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'Japanese Brain Type Auto Ads loader drifted');
  assert(!/FAQPage|AggregateRating|content_ad_impression|data-ad-slot=|adsbygoogle\.push/i.test(value.guide), 'Japanese Brain Type guide retains unsupported schema or ad telemetry');
  assert(/脳スキャンではありません/.test(text) && /知能、左右脳優位、診断、才能、適職を測るものではありません/.test(text) && /10の選択を、見えるルールでまとめる/.test(text), 'Japanese Brain Type boundary or scoring rule missing');
  assert(value.guide.includes('10.1371/journal.pone.0071275'), 'Japanese Brain Type primary source missing');
  assert(value.guide.includes('/brain-type/?lang=ja&amp;start=1&amp;surface=ja_brain_type_primary'), 'Japanese Brain Type primary route broken');
  const quick = [...value.guide.matchAll(/<a class="quick-card[^>]*data-target-slug="([^"]+)"/g)].map((match) => match[1]);
  assert(JSON.stringify(quick) === JSON.stringify(QUICK), 'Japanese Brain Type quick-route set drifted');
  assert(/intersectionRatio>=\.5/.test(value.guide) && /},500\)/.test(value.guide) && /content_ja_brain_type_view/.test(value.guide), 'Japanese Brain Type qualified exposure missing');
  assert(/content_cta_click/.test(value.guide) && /content_related_click/.test(value.guide), 'Japanese Brain Type click telemetry missing');
  assert(value.sitemap.includes(`<loc>${LIVE}</loc><lastmod>2026-08-30</lastmod>`), 'Japanese Brain Type sitemap row/date missing');
  const card = value.index.match(/<a href="\/portal\/blog\/ja\/brain-type-test\.html"[\s\S]*?<\/a>/)?.[0] || '';
  assert(/採点ルールと限界/.test(card) && /更新 2026-08/.test(card), 'Japanese Brain Type catalog card stale');
  assert(value.appHtml.includes('data-brain-type-contract="2026-08-30"'), 'Brain Type privacy release missing');
  assert(!/result_type:|share_url:|page_engage|setupGA\(/.test(`${value.appHtml}\n${value.appJs}`), 'Brain Type telemetry privacy regressed');
  assert(/"feature_scan": "選択パターンに基づくスコア"/.test(value.ja) && /"neural_metrics": "プロフィール指標"/.test(value.ja), 'Brain Type Japanese trust copy stale');
  return { quickRoutes: quick.length, sources: 1, submitted: 1 };
}

function mutations(base) {
  const cases = [
    ['faq', 'unsupported schema', (v) => { v.guide += '<script type="application/ld+json">{"@type":"FAQPage"}</script>'; }],
    ['myth', 'boundary or scoring rule missing', (v) => { v.guide = v.guide.replace('脳スキャンではありません', '脳スキャンです').replace('知能、左右脳優位、診断、才能、適職を測るものではありません', '知能と適職を測ります').replace('10の選択を、見えるルールでまとめる', '秘密の採点'); }],
    ['source', 'primary source missing', (v) => { v.guide = v.guide.replace('10.1371/journal.pone.0071275', 'removed'); }],
    ['route', 'primary route broken', (v) => { v.guide = v.guide.replace('/brain-type/?lang=ja&amp;start=1&amp;surface=ja_brain_type_primary', '/portal/'); }],
    ['quick', 'quick-route set drifted', (v) => { v.guide = v.guide.replace('data-target-slug="eq-test"', 'data-target-slug="iq-test"'); }],
    ['easy-view', 'qualified exposure missing', (v) => { v.guide = v.guide.replace('intersectionRatio>=.5', 'intersectionRatio>=0'); }],
    ['sitemap', 'sitemap row/date missing', (v) => { v.sitemap = v.sitemap.replace(/\s*<url><loc>https:\/\/dopabrain\.com\/portal\/blog\/ja\/brain-type-test\.html<\/loc>[^\n]+/, ''); }],
    ['catalog', 'catalog card stale', (v) => { v.index = v.index.replace('採点ルールと限界', '80%正確'); }],
    ['result-leak', 'telemetry privacy regressed', (v) => { v.appJs = v.appJs.replace("content_type: 'test_result',", "content_type: 'test_result', result_type:this.resultType,"); }],
    ['ja-copy', 'Japanese trust copy stale', (v) => { v.ja = v.ja.replace('選択パターンに基づくスコア', '脳スキャン'); }],
  ];
  for (const [name, expected, mutate] of cases) {
    const value = clone(base); mutate(value); let message = '';
    try { verifySource(value); } catch (error) { message = error.message; }
    assert(message.includes(expected), `${name} mutation escaped: ${message || 'passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
}

function server() {
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml' };
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let base; let relative;
    if (pathname.startsWith('/portal/')) { base = PORTAL; relative = pathname.slice(8); }
    else if (pathname.startsWith('/brain-type/')) { base = APP; relative = pathname.slice(12); }
    else { response.writeHead(404); response.end(); return; }
    let file = path.resolve(base, relative);
    if (!(file === base || file.startsWith(`${base}${path.sep}`))) { response.writeHead(403); response.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
}

async function prepare(page, local) {
  if (local) await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, async (route) => /googletagmanager|googlesyndication/.test(route.request().url()) ? route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }) : route.abort());
  await page.addInitScript(() => { window.dataLayer = []; window.gtag = function gtag() { window.dataLayer.push(arguments); }; });
}

async function runtime(url, local) {
  const browser = await chromium.launch({ headless: true });
  const layouts = [];
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
      const page = await context.newPage(); await prepare(page, local);
      const errors = []; page.on('pageerror', (error) => errors.push(String(error)));
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const state = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, targets: [...document.querySelectorAll('.cta,.quick-card')].map((node) => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })) }));
      assert(state.overflow === 0 && state.h1 === 1, `Japanese Brain Type ${viewport.width}px layout drift: ${JSON.stringify(state)}`);
      for (const target of state.targets) assert(target.width >= 44 && target.height >= 44, `Japanese Brain Type target below 44px: ${JSON.stringify(target)}`);
      assert(errors.length === 0, `Japanese Brain Type errors: ${errors.join(' | ')}`);
      layouts.push({ viewport: viewport.width, overflow: 0 }); await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const page = await context.newPage(); await prepare(page, local);
    const errors = []; page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('.brain-actions').evaluate((node) => node.scrollIntoView({ block: 'center' })); await page.waitForTimeout(250);
    let rows = events(await page.evaluate(() => (window.dataLayer || []).map((row) => Array.from(row || []))));
    assert(rows.filter((row) => row.name === 'content_ja_brain_type_view').length === 0, 'Japanese Brain Type view fired before 500ms');
    await page.waitForFunction(() => (window.dataLayer || []).filter((row) => row[0] === 'event' && row[1] === 'content_ja_brain_type_view').length === 1, null, { timeout: 3000 });
    await page.evaluate(() => document.addEventListener('click', (event) => { if (event.target.closest('.cta')) event.preventDefault(); }, true)); await page.click('.cta');
    rows = events(await page.evaluate(() => (window.dataLayer || []).map((row) => Array.from(row || []))));
    assert(rows.filter((row) => row.name === 'content_cta_click').length === 1, 'Japanese Brain Type CTA event mismatch');
    const href = await page.locator('.cta').getAttribute('href');
    assert(href === '/brain-type/?lang=ja&start=1&surface=ja_brain_type_primary', `Japanese Brain Type href drifted: ${href}`);
    await page.goto(`${new URL(url).origin}${href}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => document.documentElement.lang === 'ja' && document.getElementById('scan-screen').classList.contains('active'), null, { timeout: 10000 });
    const app = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, lang: document.documentElement.lang, active: document.getElementById('scan-screen').classList.contains('active'), layer: (window.dataLayer || []).map((row) => Array.from(row || [])) }));
    rows = events(app.layer);
    assert(app.lang === 'ja' && app.active && app.overflow === 0, `Japanese Brain Type app entry mismatch: ${JSON.stringify(app)}`);
    assert(rows.filter((row) => row.name === 'test_start' && row.params.cta_surface === 'ja_brain_type_primary').length === 1, 'Japanese Brain Type linked start attribution mismatch');
    assert(!/result_type|share_url|choice|dimension/.test(JSON.stringify(rows)), 'Japanese Brain Type runtime telemetry leaked answer/result data');
    assert(errors.length === 0, `Japanese Brain Type journey errors: ${errors.join(' | ')}`);
    await context.close();
    return { layouts, qualifiedView: 1, cta: 1, lang: 'ja', start: 1, private: true };
  } finally { await browser.close(); }
}

function parseArgs(argv) {
  const useMutations = argv.includes('--mutations'); const urlIndex = argv.indexOf('--url'); const url = urlIndex >= 0 ? argv[urlIndex + 1] : null;
  assert(argv.length === (useMutations ? 1 : 0) + (urlIndex >= 0 ? 2 : 0) && !(useMutations && url), USAGE);
  if (!url) return { useMutations, url: null };
  const parsed = new URL(url); assert(parsed.href === LIVE, USAGE); return { useMutations: false, url: parsed.href };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.url) { console.log(`PASS: live Japanese Brain Type ${JSON.stringify(await runtime(options.url, false))}`); return; }
  const base = fixture(); const source = verifySource(base); if (options.useMutations) mutations(base);
  const instance = server(); const address = await listenOnSafePort(instance);
  try { console.log(`PASS: Japanese Brain Type ${JSON.stringify({ source, runtime: await runtime(`http://127.0.0.1:${address.port}${ROUTE}`, true) })}`); }
  finally { await new Promise((resolve) => instance.close(resolve)); }
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
