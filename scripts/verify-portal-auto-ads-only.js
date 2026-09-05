#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { inspectProject, stripComments } = require('./ad-risk-inventory');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const CLIENT = 'ca-pub-3600813755953882';
const TOOL_PAGES = [
  'tools/palworld-base-planner.html',
  'tools/palworld-breeding-notebook.html',
  'tools/palworld-field-guide.html',
  'tools/palworld-server-troubleshooter.html',
  'tools/past-life-story-studio.html'
];
const MBTI_PAGES = ['enfj','enfp','entj','entp','esfj','esfp','estj','estp','infj','infp','intj','intp','isfj','isfp','istj','istp']
  .map((type) => `mbti/${type}.html`);
const TARGET_PAGES = [...TOOL_PAGES, ...MBTI_PAGES];
const MANUAL_PUSH = /(?:\(\s*(?:window\.)?adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\s*\)|(?:window\.)?adsbygoogle)\s*\.push\s*\(/gi;

function assert(value, message) { if (!value) throw new Error(message); }
function count(source, regex) { return Array.from(String(source).matchAll(regex)).length; }
function replaceRequired(source, before, after, label) {
  assert(source.includes(before), `${label}: mutation anchor missing`);
  return source.replace(before, after);
}

function fixture() {
  const names = execFileSync('git', ['-C', PORTAL, 'ls-files', '-z'], { encoding:'buffer' })
    .toString('utf8').split('\0').filter((name) => /\.(?:html?|m?js)$/i.test(name));
  return { sources:Object.fromEntries(names.map((name) => [name, fs.readFileSync(path.join(PORTAL, name), 'utf8')])) };
}

function verifySource(value) {
  const files = Object.entries(value.sources).map(([relative, raw]) => ({ relative, source:stripComments(raw) }));
  const combined = files.map((file) => file.source).join('\n');
  assert(!/<ins\b[^>]*\bclass\s*=\s*["'][^"']*\badsbygoogle\b/i.test(combined), 'Manual AdSense unit remains');
  assert(!MANUAL_PUSH.test(combined), 'Manual adsbygoogle.push remains');
  MANUAL_PUSH.lastIndex = 0;
  assert(!/["'][a-z0-9_]*ad_impression["']/i.test(combined), 'Client-authored ad impression event remains');

  const loader = /<script\b[^>]*\bsrc\s*=\s*["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=([^"'&\s>]+)[^"']*["'][^>]*>\s*<\/script>/gi;
  for (const relative of TARGET_PAGES) {
    const source = value.sources[relative];
    assert(source, `Target page missing: ${relative}`);
    const clients = Array.from(source.matchAll(loader), (match) => match[1]);
    assert(clients.length === 1, `${relative}: Auto Ads loader count must be one, got ${clients.length}`);
    assert(clients[0] === CLIENT, `${relative}: Auto Ads publisher changed`);
    assert(!/<ins\b|data-ad-slot|data-ad-surface/i.test(stripComments(source)), `${relative}: manual ad surface remains`);
  }

  assert(!/injectInlineAd|type-inline-ad|mbti_type_ad_impression/i.test(value.sources['mbti/type-page-enhancer.js']), 'MBTI type inline-ad injector remains');
  for (const relative of TOOL_PAGES.map((item) => item.replace(/^tools\//, 'js/').replace(/\.html$/, '.js'))) {
    assert(!/adsbygoogle|_ad_impression|data-ad-surface/i.test(value.sources[relative]), `${relative}: manual request or synthetic ad telemetry remains`);
  }

  const inventory = inspectProject('portal', files);
  assert(inventory.severity === 'info', `Portal risk must be loader-only info, got ${inventory.severity}`);
  assert(inventory.findings.every((finding) => finding.id === 'active_ad_loader'), `Unexpected portal risk remains: ${inventory.findings.map((finding) => finding.id).join(', ')}`);
  return { files:files.length, targetPages:TARGET_PAGES.length, loaders:inventory.findings[0]?.occurrences || 0 };
}

function verifyMutations() {
  const base = fixture();
  const mutate = (relative, transform) => ({ sources:{ ...base.sources, [relative]:transform(base.sources[relative]) } });
  const cases = [
    ['manual-unit', mutate('tools/palworld-base-planner.html', (source) => source.replace('</main>', '<ins class="adsbygoogle"></ins></main>'))],
    ['assigned-push', mutate('js/palworld-base-planner.js', (source) => `${source}\n(window.adsbygoogle=window.adsbygoogle||[]).push({});`)],
    ['direct-push', mutate('js/palworld-base-planner.js', (source) => `${source}\nadsbygoogle.push({});`)],
    ['synthetic-event', mutate('js/palworld-base-planner.js', (source) => `${source}\nevent('palworld_base_ad_impression');`)],
    ['missing-loader', mutate('tools/palworld-base-planner.html', (source) => source.replace(/<script\b[^>]*pagead2\.googlesyndication\.com[^>]*><\/script>/i, ''))],
    ['wrong-publisher', mutate('tools/palworld-base-planner.html', (source) => source.replace(CLIENT, 'ca-pub-0000000000000000'))],
    ['surface-returned', mutate('tools/palworld-base-planner.html', (source) => source.replace('</main>', '<div data-ad-surface="inline"></div></main>'))],
    ['injector-returned', mutate('mbti/type-page-enhancer.js', (source) => `${source}\nfunction injectInlineAd(){}`)],
    ['hub-event-returned', mutate('index.html', (source) => `${source}\n<script>trackPortalEvent('hub_ad_impression');</script>`)]
  ];
  for (const [name, value] of cases) {
    let detected = false;
    try { verifySource(value); } catch (error) { detected = true; console.log(`[PASS] ${name}: ${error.message}`); }
    assert(detected, `Mutation escaped: ${name}`);
  }
  const decoy = mutate('index.html', (source) => `${source}\n<script>const node=el.querySelector('.adsbygoogle');seenAds.push(node);</script>`);
  verifySource(decoy);
  console.log(`Mutation summary: ${cases.length}/${cases.length} detected; unrelated Array.push accepted`);
}

async function startServer() {
  const types = { '.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml' };
  const server = http.createServer((request, response) => {
    try {
      const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const relative = requestPath.startsWith('/portal/') ? requestPath.slice(8) : '';
      let target = path.resolve(PORTAL, relative || 'index.html');
      assert(target === PORTAL || target.startsWith(`${PORTAL}${path.sep}`), `Unsafe request path: ${requestPath}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':`${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(fs.readFileSync(target));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  return { origin:`http://127.0.0.1:${address.port}`, close:() => new Promise((resolve) => server.close(resolve)) };
}

async function pageReport(page) {
  return page.evaluate(() => ({
    overflow:Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    manual:document.querySelectorAll('ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').length,
    adEvents:(window.dataLayer || []).map((row) => Array.from(row || []))[Symbol.iterator]
      ? (window.dataLayer || []).map((row) => Array.from(row || [])).filter((row) => row[0] === 'event' && /ad_impression/i.test(row[1] || '')).length
      : 0
  }));
}

async function verifyRuntime(baseUrl) {
  const browser = await chromium.launch({ headless:true });
  try {
    for (const viewport of [{ width:390, height:844 }, { width:1440, height:900 }]) {
      const context = await browser.newContext({ viewport, serviceWorkers:'block' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());

      await page.goto(`${baseUrl}/portal/tools/palworld-base-planner.html?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.locator('#buildPlan').click();
      await page.waitForFunction(() => !document.querySelector('#result')?.hidden);
      let report = await pageReport(page);
      assert(report.overflow <= 0 && report.manual === 0 && report.adEvents === 0, `${viewport.width}px base planner ad/layout regression: ${JSON.stringify(report)}`);

      await page.goto(`${baseUrl}/portal/tools/past-life-story-studio.html?lang=en`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.locator('#generate').click();
      await page.waitForFunction(() => !document.querySelector('#result')?.hidden);
      report = await pageReport(page);
      assert(report.overflow <= 0 && report.manual === 0 && report.adEvents === 0, `${viewport.width}px story studio ad/layout regression: ${JSON.stringify(report)}`);

      await page.goto(`${baseUrl}/portal/mbti/intj.html`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.locator('.type-action-rail').waitFor();
      await page.evaluate(() => document.querySelector('.type-action-link').addEventListener('click', (event) => event.preventDefault()));
      await page.locator('.type-action-link').first().click();
      report = await pageReport(page);
      const target = await page.locator('.type-action-link').first().evaluate((item) => { const rect=item.getBoundingClientRect(); return { width:rect.width, height:rect.height }; });
      assert(report.overflow <= 0 && report.manual === 0 && report.adEvents === 0 && target.width >= 43.99 && target.height >= 43.99, `${viewport.width}px MBTI type ad/action regression: ${JSON.stringify({ report, target })}`);
      assert(errors.length === 0, `${viewport.width}px runtime errors: ${errors.join(' | ')}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function main() {
  const at = process.argv.indexOf('--url');
  const production = at >= 0 ? process.argv[at + 1].replace(/\/$/, '') : '';
  const result = verifySource(fixture());
  if (process.argv.includes('--mutations')) verifyMutations();
  if (production) await verifyRuntime(production);
  else { const server = await startServer(); try { await verifyRuntime(server.origin); } finally { await server.close(); } }
  console.log(`[PASS] Portal Auto Ads-only: ${result.targetPages} pages, ${result.files} sources, loader-only inventory`);
}

main().catch((error) => { console.error(`[FAIL] ${error.stack || error.message}`); process.exitCode = 1; });
