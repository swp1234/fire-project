#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const HTML_PATH = path.join(PROJECTS, 'portal', 'tools', 'palworld-server-settings.html');
const JS_PATH = path.join(PROJECTS, 'portal', 'js', 'palworld-server-settings.js');
const CSS_PATH = path.join(PROJECTS, 'portal', 'css', 'palworld-server-settings.css');
const SITEMAP_PATH = path.join(PROJECTS, 'portal', 'sitemap.xml');
const URL_PATH = '/portal/tools/palworld-server-settings.html';
const LANGS = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const PVP_FLAGS = ['bIsPvP', 'bEnablePlayerToPlayerDamage', 'bEnableDefenseOtherGuildPlayer'];
const USAGE = `Usage:\n  node scripts/verify-palworld-server-console.js [--mutations]\n  node scripts/verify-palworld-server-console.js --url https://dopabrain.com${URL_PATH}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadFixture() {
  return {
    html: fs.readFileSync(HTML_PATH, 'utf8'),
    js: fs.readFileSync(JS_PATH, 'utf8'),
    css: fs.readFileSync(CSS_PATH, 'utf8'),
    sitemap: fs.readFileSync(SITEMAP_PATH, 'utf8')
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function verifySource({ html, js, css, sitemap }) {
  assert(/data-palworld-contract="2026-08-30"/.test(html), 'Release contract marker is missing');
  assert(/<meta name="dateModified" content="2026-08-30">/.test(html), 'dateModified metadata is stale');
  assert(/Palworld server docs 1\.0\.3/.test(html), 'Visible metadata does not name official docs 1.0.3');
  assert(/softwareVersion":"1\.0\.3 docs contract"/.test(html), 'WebApplication schema version is stale');
  assert(!/FAQPage/.test(html), 'Unsupported hidden FAQ schema is present');

  const schemas = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map(match => JSON.parse(match[1]));
  assert(schemas.length === 1 && schemas[0]['@type'] === 'WebApplication', 'Expected one WebApplication JSON-LD block');
  assert(schemas[0].dateModified === '2026-08-30', 'WebApplication schema date is stale');

  const generatorIndex = html.indexOf('id="generator"');
  const outputIndex = html.indexOf('class="output-head"');
  const settingsIndex = html.indexOf('id="settings"');
  const suiteIndex = html.indexOf('class="suite-links"');
  assert(generatorIndex >= 0 && generatorIndex < suiteIndex, 'Guide rail appears before the primary generator');
  assert(outputIndex > generatorIndex && outputIndex < settingsIndex, 'Copy output appears after optional settings');
  assert(/id="pvpRequirement"[^>]*hidden/.test(html), 'Visible conditional PvP requirement is missing');
  assert(/settings-and-operation\/pvp\//.test(html), 'Official PvP source link is missing');

  for (const flag of PVP_FLAGS) {
    assert(new RegExp(`\\['${flag}','boolean',false`).test(js), `Missing ${flag} setting definition`);
    assert(new RegExp(`${flag}:true`).test(js), `PvP preset does not enable ${flag}`);
  }
  assert(/official_docs_version:'1\.0\.3'/.test(js), 'Analytics docs version is stale');
  assert(/palworld_generator_view/.test(js) && /intersectionRatio >= 0\.5/.test(js) && /}, 500\)/.test(js), 'Qualified generator exposure contract is incomplete');
  assert(/new URL\(location\.pathname, location\.origin\)/.test(js), 'Canonical URL is not rebuilt from the clean path');
  assert(!/new URL\(location\.href\); url\.searchParams\.set\('lang',lang\)/.test(js), 'Canonical URL still inherits campaign parameters');
  assert(/Math\.min\(definition\[6\], Math\.max\(definition\[5\], numeric\)\)/.test(js), 'Numeric settings are not clamped to official UI bounds');
  assert(/palworld-server-settings\.css\?v=20260830a/.test(html) && /palworld-server-settings\.js\?v=20260830a/.test(html), 'Release assets are not cache-busted together');
  assert(/#iniOutput\{max-height:230px\}/.test(css), 'Generated block is not height-bounded');
  assert(/<loc>https:\/\/dopabrain\.com\/portal\/tools\/palworld-server-settings\.html<\/loc><lastmod>2026-08-30<\/lastmod>/.test(sitemap), 'Palworld sitemap lastmod is stale');

  return { schemas: schemas.length, flags: PVP_FLAGS.length, languages: LANGS.length };
}

function runMutations(baseline) {
  const mutations = [
    ['missing-pvp-flag', 'PvP preset does not enable bEnableDefenseOtherGuildPlayer', fixture => { fixture.js = fixture.js.replace('bEnableDefenseOtherGuildPlayer:true', 'bEnableDefenseOtherGuildPlayer:false'); }],
    ['guide-before-tool', 'Guide rail appears before the primary generator', fixture => { const nav = fixture.html.match(/    <nav class="suite-links"[\s\S]*?<\/nav>\n/)?.[0]; assert(nav, 'Mutation fixture guide rail missing'); fixture.html = fixture.html.replace(nav, '').replace('    <section id="generator"', `${nav}\n    <section id="generator"`); }],
    ['output-after-settings', 'Copy output appears after optional settings', fixture => { fixture.html = fixture.html.replace('<div id="settings" class="settings"></div>', '<div id="settings" class="settings"></div><div class="output-head"></div>').replace('      <div class="output-head">', '      <div class="old-output-head">'); }],
    ['stale-version', 'Visible metadata does not name official docs 1.0.3', fixture => { fixture.html = fixture.html.replace('Palworld server docs 1.0.3', 'Palworld server docs 1.0'); }],
    ['tracking-too-easy', 'Qualified generator exposure contract is incomplete', fixture => { fixture.js = fixture.js.replace('intersectionRatio >= 0.5', 'intersectionRatio >= 0'); }],
    ['dirty-canonical', 'Canonical URL is not rebuilt from the clean path', fixture => { fixture.js = fixture.js.replace('new URL(location.pathname, location.origin)', 'new URL(location.href)'); }],
    ['hidden-faq', 'Unsupported hidden FAQ schema is present', fixture => { fixture.html += '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"}</script>'; }],
    ['unbounded-number', 'Numeric settings are not clamped to official UI bounds', fixture => { fixture.js = fixture.js.replace('Math.min(definition[6], Math.max(definition[5], numeric))', 'numeric'); }],
    ['stale-sitemap', 'Palworld sitemap lastmod is stale', fixture => { fixture.sitemap = fixture.sitemap.replace('<lastmod>2026-08-30</lastmod>', '<lastmod>2026-07-27</lastmod>'); }]
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
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.svg':'image/svg+xml' };
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(PROJECTS, pathname.replace(/^\/+/, ''));
    if (!file.startsWith(`${PROJECTS}${path.sep}`) || !fs.existsSync(file)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':`${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
}

function eventRows(dataLayer) {
  return dataLayer.map(item => Array.from(item || [])).filter(item => item[0] === 'event').map(item => ({ name:item[1], params:item[2] || {} }));
}

async function runtimeCheck(baseUrl, local) {
  const browser = await chromium.launch({ headless:true });
  const context = await browser.newContext({ viewport:{ width:390, height:844 } });
  if (local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    for (const lang of LANGS) {
      await page.goto(`${baseUrl}?lang=${lang}&source=verifier&utm_source=noise`, { waitUntil:'domcontentloaded', timeout:30000 });
      await page.waitForSelector('#presets .preset');
      const state = await page.evaluate(expectedLang => ({
        lang:document.documentElement.lang,
        title:document.title,
        canonical:document.querySelector('link[rel=canonical]')?.href,
        overflow:document.documentElement.scrollWidth - document.documentElement.clientWidth,
        generatorTop:Math.round(document.querySelector('#generator').getBoundingClientRect().top + scrollY),
        copyTop:Math.round(document.querySelector('#copyIni').getBoundingClientRect().top + scrollY),
        order:[document.querySelector('#generator'), document.querySelector('.output-head'), document.querySelector('#settings'), document.querySelector('.suite-links')].map(node => Math.round(node.getBoundingClientRect().top + scrollY)),
        expectedLang
      }), lang);
      const clean = new URL(baseUrl);
      clean.searchParams.set('lang', lang);
      assert(state.lang === lang && state.title.includes('1.0.3'), `${lang} localization/version runtime mismatch`);
      assert(state.canonical === clean.href, `${lang} canonical retained noise: ${state.canonical}`);
      assert(state.overflow === 0, `${lang} has ${state.overflow}px horizontal overflow`);
      assert(state.order.every((value, index, rows) => index === 0 || rows[index - 1] < value), `${lang} primary flow order drift: ${state.order.join(',')}`);
    }

    await page.goto(`${baseUrl}?lang=ko&source=verifier&utm_source=noise`, { waitUntil:'domcontentloaded', timeout:30000 });
    await page.waitForSelector('#presets .preset');
    const position = await page.evaluate(() => ({
      generatorTop:Math.round(document.querySelector('#generator').getBoundingClientRect().top + scrollY),
      copyTop:Math.round(document.querySelector('#copyIni').getBoundingClientRect().top + scrollY)
    }));
    assert(position.generatorTop <= 700, `Mobile generator starts too late: ${position.generatorTop}px`);
    assert(position.copyTop <= 1250, `Mobile copy action starts too late: ${position.copyTop}px`);

    await page.click('[data-preset="pvp"]');
    const pvp = await page.evaluate(flags => ({
      output:document.querySelector('#iniOutput').textContent,
      noteHidden:document.querySelector('#pvpRequirement').hidden,
      flags
    }), PVP_FLAGS);
    assert(!pvp.noteHidden, 'PvP requirement did not become visible');
    for (const flag of PVP_FLAGS) assert(pvp.output.includes(`${flag}=True`), `Runtime output omitted ${flag}=True`);

    const playerInput = page.locator('[data-key="ServerPlayerMaxNum"]');
    await playerInput.fill('999');
    assert((await page.locator('#iniOutput').textContent()).includes('ServerPlayerMaxNum=32'), 'High player count was not clamped to 32');
    await playerInput.fill('-5');
    assert((await page.locator('#iniOutput').textContent()).includes('ServerPlayerMaxNum=2'), 'Low player count was not clamped to 2');
    await playerInput.fill('16');

    await page.locator('#presets').scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.locator('body').evaluate(node => node.scrollIntoView());
    await page.locator('#presets').scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.click('#copyIni');
    await page.waitForTimeout(50);
    const events = await page.evaluate(() => (window.dataLayer || [])
      .map(item => Array.from(item || []))
      .filter(item => item[0] === 'event')
      .map(item => ({ name:item[1], params:item[2] || {} })));
    const count = name => events.filter(item => item.name === name).length;
    assert(count('palworld_generator_view') === 1, `Generator exposure count is ${count('palworld_generator_view')}, expected 1`);
    assert(count('palworld_preset_select') === 1, `Preset selection count is ${count('palworld_preset_select')}, expected 1`);
    assert(count('palworld_setting_change') === 1, `Setting-change count is ${count('palworld_setting_change')}, expected 1 per key`);
    assert(count('palworld_copy') === 1, `Copy count is ${count('palworld_copy')}, expected 1`);
    assert(events.find(item => item.name === 'palworld_generator_view')?.params?.official_docs_version === '1.0.3', 'Generator exposure version parameter mismatch');
    assert(errors.length === 0, `Page errors: ${errors.join(' | ')}`);
    return { languages:LANGS.length, mobile:position, events:{ generator:count('palworld_generator_view'), preset:count('palworld_preset_select'), setting:count('palworld_setting_change'), copy:count('palworld_copy') }, errors:errors.length };
  } finally {
    await browser.close();
  }
}

function parseArgs(argv) {
  const mutations = argv.includes('--mutations');
  const urlIndex = argv.indexOf('--url');
  const url = urlIndex >= 0 ? argv[urlIndex + 1] : null;
  const knownCount = (mutations ? 1 : 0) + (urlIndex >= 0 ? 2 : 0);
  assert(argv.length === knownCount && !(mutations && url), USAGE);
  if (!url) return { mutations, url:null };
  const parsed = new URL(url);
  assert(parsed.protocol === 'https:' && parsed.host === 'dopabrain.com' && parsed.pathname === URL_PATH && !parsed.search && !parsed.hash, USAGE);
  return { mutations:false, url:parsed.href };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.url) {
    const result = await runtimeCheck(args.url, false);
    console.log(`PASS: live Palworld server console ${JSON.stringify(result)}`);
    return;
  }
  const fixture = loadFixture();
  const source = verifySource(fixture);
  if (args.mutations) runMutations(fixture);
  const server = createServer();
  const address = await listenOnSafePort(server);
  try {
    const runtime = await runtimeCheck(`http://127.0.0.1:${address.port}${URL_PATH}`, true);
    console.log(`PASS: Palworld server console ${JSON.stringify({ source, runtime })}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
