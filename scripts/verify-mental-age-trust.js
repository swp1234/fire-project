#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const PROJECT = path.join(PROJECTS, 'mental-age');
const PORTAL_BLOG = path.join(PROJECTS, 'portal', 'blog');
const LANGS = ['de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh'];
const BASE = 'https://dopabrain.com/mental-age/';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadFixture() {
  const locales = Object.fromEntries(LANGS.map(lang => [
    lang,
    fs.readFileSync(path.join(PROJECT, 'js', 'locales', `${lang}.json`), 'utf8'),
  ]));
  return {
    html: fs.readFileSync(path.join(PROJECT, 'index.html'), 'utf8'),
    app: fs.readFileSync(path.join(PROJECT, 'js', 'app.js'), 'utf8'),
    i18n: fs.readFileSync(path.join(PROJECT, 'js', 'i18n.js'), 'utf8'),
    manifest: fs.readFileSync(path.join(PROJECT, 'manifest.json'), 'utf8'),
    artwork: fs.readFileSync(path.join(PROJECT, 'og-image.svg'), 'utf8'),
    locales,
    guidePaths: Object.fromEntries(LANGS.map(lang => [
      lang,
      path.join(PORTAL_BLOG, lang, 'mental-age-test-brain-quiz-guide.html'),
    ])),
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function verify(fixture) {
  const { html, app, i18n, manifest, artwork, locales, guidePaths } = fixture;
  const publicSource = [html, app, i18n, manifest, artwork, ...Object.values(locales)].join('\n');
  const forbidden = [
    ['fabricated social proof', /(?:2,?340|brains? scanned today|people scanned|aggregateRating|socialProof)/i],
    ['fabricated percentile', /(?:calculatePercentile|displayPercentileStat|percentileStat|percentile-stat|normal distribution)/i],
    ['arbitrary age conversion', /(?:this\.mentalAge|this\.category|_getCategoryData|yourMentalAge|age-counter|result-age|\b5\s*\+\s*\([^\n]{0,80}\*\s*75)/i],
    ['unsupported accuracy claim', /(?:true|real|exact|scientifically inspired|science-based)[ -](?:mental|brain)[ -]age/i],
    ['misleading scan telemetry', /content_type\s*:\s*['"]brain_scan['"]/i],
    ['legacy result parameter', /\bmental_age\s*:/i],
  ];
  for (const [label, pattern] of forbidden) assert(!pattern.test(publicSource), `Found ${label}`);

  assert(/class BrainChallengeApp/.test(app), 'Challenge engine naming is stale');
  assert(/this\.challengeScore\s*=\s*Math\.round\(this\.scores\.reduce\(\(a, b\) => a \+ b, 0\) \/ this\.scores\.length\)/.test(app), 'Transparent arithmetic mean is missing');
  assert(/id="result-score"/.test(html), 'Average-score result target is missing');
  assert(/data-i18n="result\.boundary_note"|id="result-boundary-note"/.test(html), 'Visible result limitation is missing');
  assert(!/FAQPage/.test(html), 'Hidden FAQ schema remains');
  assert(/element\.tagName === 'META'/.test(i18n), 'Locale loader does not update metadata content');
  assert(/document\.title\s*=/.test(i18n), 'Locale loader does not update the page title');

  const schemaBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map(match => JSON.parse(match[1]));
  assert(schemaBlocks.length === 2, 'Expected exactly two JSON-LD blocks');
  assert(JSON.stringify(schemaBlocks.map(item => item['@type']).sort()) === JSON.stringify(['BreadcrumbList', 'SoftwareApplication']), 'Unexpected JSON-LD types');

  const alternateMatches = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)];
  const alternates = new Map(alternateMatches.map(match => [match[1], match[2]]));
  assert(alternateMatches.length === 13 && alternates.size === 13, 'Expected 13 unique hreflang labels');
  assert(alternates.get('en') === BASE && alternates.get('x-default') === BASE, 'English/x-default hreflang mismatch');
  for (const lang of LANGS.filter(lang => lang !== 'en')) assert(alternates.get(lang) === `${BASE}?lang=${lang}`, `Incorrect ${lang} hreflang URL`);
  assert(new Set(alternates.values()).size === 12, 'Locale hreflang URLs collapsed');

  const requiredKeys = [
    'app.title', 'meta.description', 'meta.og_title', 'meta.og_description', 'meta.twitter_title',
    'meta.twitter_description', 'intro.resultPreview', 'intro.privacyNote', 'button.start',
    'analyzing.title', 'result.score_label', 'result.challenge_profile', 'result.session_summary',
    'result.score_context', 'result.description', 'result.boundary_note', 'result.guide_label',
    'share.twitterText', 'share.copyText', 'share.canvasTitle',
  ];
  for (const lang of LANGS) {
    const locale = JSON.parse(locales[lang]);
    for (const key of requiredKeys) {
      const value = key.split('.').reduce((node, part) => node && node[part], locale);
      assert(typeof value === 'string' && value.trim(), `Missing ${lang}.${key}`);
      assert(!value.includes('\uFFFD'), `Replacement character in ${lang}.${key}`);
    }
    assert(!('category' in locale), `Legacy age category remains in ${lang}`);
    assert(!('yourMentalAge' in locale.intro), `Legacy mental-age counter remains in ${lang}`);
    assert(!('socialProof' in locale.intro), `Legacy social proof remains in ${lang}`);
    assert(!('age_label' in locale.result), `Legacy age label remains in ${lang}`);
    assert(!('percentileStat' in locale.result), `Legacy percentile remains in ${lang}`);
    assert(locale.result.score_context.includes('{score}'), `Score placeholder missing in ${lang}`);
    assert(locale.share.twitterText.includes('{score}') && locale.share.copyText.includes('{score}'), `Share score placeholder missing in ${lang}`);
    assert(fs.existsSync(guidePaths[lang]), `Missing ${lang} result guide`);
  }
  return { locales: LANGS.length, hreflangs: alternates.size, schema: schemaBlocks.length };
}

function runMutations(baseline) {
  const mutations = [
    ['fake-social-proof', 'Found fabricated social proof', fixture => { fixture.html += '<p>2,340 brains scanned today</p>'; }],
    ['age-conversion', 'Found arbitrary age conversion', fixture => { fixture.app += '\nthis.mentalAge = 5 + (score * 75);'; }],
    ['percentile', 'Found fabricated percentile', fixture => { fixture.html += '<div id="percentile-stat"></div>'; }],
    ['legacy-locale', 'Legacy age category remains in en', fixture => { const value = JSON.parse(fixture.locales.en); value.category = { adult: 'Adult' }; fixture.locales.en = JSON.stringify(value); }],
    ['collapsed-hreflang', 'Incorrect ko hreflang URL', fixture => { fixture.html = fixture.html.replace(`${BASE}?lang=ko`, BASE); }],
    ['missing-guide', 'Missing ko result guide', fixture => { fixture.guidePaths.ko = path.join(ROOT, 'missing-guide.html'); }],
  ];
  for (const [name, expected, mutate] of mutations) {
    const fixture = clone(baseline);
    mutate(fixture);
    let message = '';
    try { verify(fixture); } catch (error) { message = error.message; }
    assert(message.includes(expected), `${name} mutation escaped: ${message || 'verifier passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
}

function createServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(PROJECTS, pathname.replace(/^\/+/, ''));
    if (!file.startsWith(`${PROJECTS}${path.sep}`) || !fs.existsSync(file)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
    const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
    response.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
}

async function listen(server) {
  for (let port = 24700; port < 24750; port += 1) {
    try {
      await new Promise((resolve, reject) => {
        const onError = error => { server.off('listening', onListening); reject(error); };
        const onListening = () => { server.off('error', onError); resolve(); };
        server.once('error', onError); server.once('listening', onListening); server.listen(port, '127.0.0.1');
      });
      return port;
    } catch (error) {
      if (!['EADDRINUSE', 'EACCES'].includes(error.code)) throw error;
    }
  }
  throw new Error('No safe local verification port available');
}

async function runBrowser(locales) {
  const server = createServer();
  const port = await listen(server);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    for (const lang of LANGS) {
      const locale = JSON.parse(locales[lang]);
      await page.goto(`http://127.0.0.1:${port}/mental-age/?lang=${lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(expected => document.documentElement.lang === expected && Boolean(window.i18n?.translations?.[expected]), lang);
      const actual = await page.evaluate(() => ({
        title: document.title,
        meta: document.querySelector('meta[name="description"]')?.content,
        ogTitle: document.querySelector('meta[property="og:title"]')?.content,
        intro: document.querySelector('[data-i18n="intro.title"]')?.textContent,
        preview: document.querySelector('[data-i18n="intro.resultPreview"]')?.textContent,
        privacy: document.querySelector('[data-i18n="intro.privacyNote"]')?.textContent,
        start: document.querySelector('#start-btn')?.textContent.trim(),
        guide: document.querySelector('#mental-age-guide-link')?.getAttribute('href'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      const expected = {
        title: `${locale.app.title} | DopaBrain`, meta: locale.meta.description, ogTitle: locale.meta.og_title,
        intro: locale.intro.title, preview: locale.intro.resultPreview, privacy: locale.intro.privacyNote,
        start: locale.button.start, guide: `/portal/blog/${lang}/mental-age-test-brain-quiz-guide.html?surface=mental_age_result_guide`, overflow: 0,
      };
      assert(JSON.stringify(actual) === JSON.stringify(expected), `${lang} locale runtime mismatch: ${JSON.stringify({ actual, expected })}`);
    }

    await page.goto(`http://127.0.0.1:${port}/mental-age/?lang=en`, { waitUntil: 'domcontentloaded' });
    const english = JSON.parse(locales.en);
    await page.waitForFunction(expected => document.documentElement.lang === 'en' && document.querySelector('#start-btn')?.textContent.trim() === expected, english.button.start);
    await page.click('#start-btn');
    assert(await page.locator('#challenge-screen').evaluate(node => node.classList.contains('active')), 'Start button did not open the challenge');
    await page.evaluate(() => { app._clearTimers(); app.scores = [10, 20, 30, 40, 50, 60, 70]; app.calculateResult(); });
    await page.waitForSelector('#result-screen.active');
    const first = await page.evaluate(() => ({
      score: Number(document.querySelector('#result-score')?.textContent),
      title: document.querySelector('#result-title')?.textContent,
      context: document.querySelector('#result-tagline')?.textContent,
      boundary: document.querySelector('#result-boundary-note')?.textContent,
      ageTarget: Boolean(document.querySelector('#result-age, #age-counter')),
      percentile: Boolean(document.querySelector('#percentile-stat, .percentile-stat')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      overflowNodes: [...document.querySelectorAll('body *')].map(node => ({
        selector: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${node.classList.length ? `.${[...node.classList].join('.')}` : ''}`,
        left: Math.round(node.getBoundingClientRect().left),
        right: Math.round(node.getBoundingClientRect().right),
      })).filter(item => item.left < 0 || item.right > document.documentElement.clientWidth).slice(0, 8),
    }));
    assert(first.score === 40, `Expected arithmetic mean 40, got ${first.score}`);
    assert(first.title === 'Your Session Summary' && first.context.includes('40/100'), 'Result copy does not explain the average');
    assert(first.boundary.includes('not a clinical mental-age'), 'Visible result limitation is missing at runtime');
    assert(!first.ageTarget && !first.percentile && first.overflow === 0, `Legacy or mobile result UI remains: ${JSON.stringify(first)}`);

    await page.evaluate(() => { app._clearTimers(); app.scores = [0, 0, 0, 0, 0, 0, 100]; app.calculateResult(); });
    await page.waitForFunction(() => document.querySelector('#result-score')?.textContent === '14');
    assert(errors.length === 0, `Page errors: ${errors.join(' | ')}`);
    console.log(JSON.stringify({ runtimeLocales: LANGS.length, scoreCases: [40, 14], overflow: first.overflow, pageErrors: errors.length }));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

async function main() {
  const fixture = loadFixture();
  const result = verify(fixture);
  if (process.argv.includes('--mutations')) runMutations(fixture);
  await runBrowser(fixture.locales);
  console.log(`PASS: mental-age trust contract (${result.locales} locales, ${result.hreflangs} hreflangs)`);
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
