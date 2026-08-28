#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECT = path.join(ROOT, 'projects', 'brain-type');
const LANGS = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const BASE = 'https://dopabrain.com/brain-type/';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadFixture() {
  const locales = Object.fromEntries(LANGS.map((lang) => [lang, fs.readFileSync(path.join(PROJECT, 'js', 'locales', `${lang}.json`), 'utf8')]));
  return {
    html: fs.readFileSync(path.join(PROJECT, 'index.html'), 'utf8'),
    app: fs.readFileSync(path.join(PROJECT, 'js', 'app.js'), 'utf8'),
    locales,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function verify(fixture) {
  const { html, app, locales } = fixture;
  assert(/<html\s+lang="en"/i.test(html), 'Default document language must be English');
  const publicSource = `${html}\n${app}\n${Object.values(locales).join('\n')}`;
  for (const [label, pattern] of [
    ['fabricated social proof', /(?:1,?950|brains scanned today|aggregateRating|socialProof)/i],
    ['fabricated population statistic', /percentileStat|calculatePercentile|typeDistribution/i],
    ['scanner branding', /Neural Pathway Scanner/i],
  ]) assert(!pattern.test(publicSource), `Found ${label}`);

  const schemaBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
  assert(schemaBlocks.length === 2, 'Expected exactly two JSON-LD blocks');
  const schemaTypes = schemaBlocks.map((block) => block['@type']).sort();
  assert(JSON.stringify(schemaTypes) === JSON.stringify(['BreadcrumbList', 'SoftwareApplication']), 'Unexpected JSON-LD types');
  assert(!publicSource.includes('FAQPage'), 'Hidden FAQ schema remains');

  const alternateMatches = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)];
  assert(alternateMatches.length === 13, 'Expected 13 hreflang links');
  const hrefs = new Map(alternateMatches.map((match) => [match[1], match[2]]));
  assert(hrefs.size === 13, 'Duplicate hreflang labels');
  assert(hrefs.get('en') === BASE && hrefs.get('x-default') === BASE, 'English/x-default hreflang mismatch');
  for (const lang of LANGS.filter((item) => item !== 'en')) assert(hrefs.get(lang) === `${BASE}?lang=${lang}`, `Incorrect ${lang} hreflang URL`);
  assert(new Set([...hrefs.values()]).size === 12, 'Locale hreflang URLs collapsed');

  const requiredKeys = ['meta.description', 'intro.feature_scan', 'button.start', 'analyzing.title', 'result.neural_metrics', 'result.profileStat', 'engage.trustNote', 'about.heading3', 'about.text3'];
  for (const lang of LANGS) {
    const locale = JSON.parse(locales[lang]);
    for (const key of requiredKeys) {
      const value = key.split('.').reduce((node, part) => node && node[part], locale);
      assert(typeof value === 'string' && value.trim(), `Missing ${lang}.${key}`);
    }
    assert(!('percentileStat' in locale.result), `Fabricated percentile key remains in ${lang}`);
  }
  assert(/data-i18n="engage\.trustNote"/.test(html), 'Visible trust note missing');
  assert(/data-i18n="about\.text3"/.test(html), 'Visible limitation disclosure missing');
  assert(/does not scan your brain/i.test(locales.en), 'English limitation disclosure weakened');
  return { ok: true, locales: LANGS.length, hreflangs: hrefs.size, schemaTypes };
}

function runMutations(baseline) {
  const mutations = [
    ['fake-social-proof', 'Found fabricated social proof', (fixture) => { fixture.locales.en = fixture.locales.en.replace('Private · no sign-up · instant result', '1,950 brains scanned today'); }],
    ['fake-rating-schema', 'Found fabricated social proof', (fixture) => { fixture.html = fixture.html.replace('"offers": {', '"aggregateRating": {"ratingValue":"4.9"}, "offers": {'); }],
    ['collapsed-hreflangs', 'Incorrect ko hreflang URL', (fixture) => { fixture.html = fixture.html.replace(/https:\/\/dopabrain\.com\/brain-type\/\?lang=[a-z]+/g, BASE); }],
    ['missing-disclosure', 'Visible limitation disclosure missing', (fixture) => { fixture.html = fixture.html.replace('data-i18n="about.text3"', 'data-i18n="about.removed"'); }],
    ['fabricated-percentile', 'Found fabricated population statistic', (fixture) => { fixture.app += '\nfunction calculatePercentile() {}'; }],
  ];
  const results = [];
  for (const [name, expected, mutate] of mutations) {
    const fixture = clone(baseline);
    mutate(fixture);
    try {
      verify(fixture);
      results.push({ name, ok: false, error: 'verifier incorrectly passed' });
    } catch (error) {
      results.push({ name, ok: error.message.includes(expected), error: error.message });
    }
  }
  return results;
}

const baseline = loadFixture();
try {
  const result = verify(baseline);
  console.log(JSON.stringify(result, null, 2));
  if (process.argv.includes('--mutations')) {
    const mutations = runMutations(baseline);
    for (const item of mutations) console.log(`[${item.ok ? 'PASS' : 'FAIL'}] ${item.name}: ${item.error}`);
    assert(mutations.every((item) => item.ok), 'One or more mutations escaped detection');
  }
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
