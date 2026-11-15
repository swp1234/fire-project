#!/usr/bin/env node
/**
 * Static and mutation-tested contract verifier for i18n, SW scope, SVG-anchor
 * integrity, and dataLayer telemetry preservation across active sub-apps.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const ANALYTICS_CHECK_FILE = path.join(ROOT, 'scripts', 'analytics-event-check.js');

const WAIT_COHORT = new Set([
  'stress-check', 'hsp-test', 'future-self', 'color-blindness', 'iq-test',
  'kpop-position', 'brain-type', 'white-noise', 'stress-type', 'portal', 'root-domain',
]);

const SUSPENDED_LEGACY = new Set([
  'aspect-ratio-calculator', 'aura-reading', 'blood-type', 'brain-type', 'block-puzzle',
  'burnout-test', 'data-transfer-calculator', 'dev-quiz', 'eq-test',
  'file-extension-converter', 'file-size-converter', 'flappy-bird', 'habit-tracker',
  'hail-mary-mode', 'image-format-converter', 'mbti-city', 'image-size-converter',
  'inner-child-test', 'json-formatter', 'mental-age', 'past-life', 'puzzle-2048',
  'qr-generator', 'quiz-app', 'reaction-test', 'road-shooter', 'routine-planner',
  'social-battery', 'stress-response', 'text-case-converter', 'timezone-converter',
  'todo-list', 'typing-speed', 'unix-timestamp-converter', 'villain-type', 'word-guess',
]);

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function listSubAppSlugs() {
  return fs.readdirSync(PROJECTS_DIR)
    .filter((slug) => fs.existsSync(path.join(PROJECTS_DIR, slug, 'index.html')))
    .sort();
}

function resolveLocaleKey(obj, key, dotFirst) {
  if (dotFirst && Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function extractI18nKeys(html) {
  const keys = [];
  const attrPattern = /\bdata-i18n(?:-(?:placeholder|aria-label|title|alt|content))?="([^"]+)"/g;
  for (const match of html.matchAll(attrPattern)) {
    if (match[1]) keys.push(match[1]);
  }
  return [...new Set(keys)];
}

function listRelativeFiles(baseDir, prefix = '') {
  const results = [];
  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) results.push(...listRelativeFiles(path.join(baseDir, entry.name), rel));
    else results.push(rel);
  }
  return results;
}

function loadFixture() {
  const subApps = {};
  for (const slug of listSubAppSlugs()) {
    if (slug === 'portal' || slug === 'root-domain') continue;
    const appDir = path.join(PROJECTS_DIR, slug);
    const html = read(path.join(appDir, 'index.html'));
    const i18nPath = path.join(appDir, 'js', 'i18n.js');
    const enPath = path.join(appDir, 'js', 'locales', 'en.json');
    const koPath = path.join(appDir, 'js', 'locales', 'ko.json');
    const manifestPath = path.join(appDir, 'manifest.json');
    const swPath = path.join(appDir, 'sw.js');
    subApps[slug] = {
      activeTarget: !WAIT_COHORT.has(slug) && !SUSPENDED_LEGACY.has(slug),
      html,
      i18n: fs.existsSync(i18nPath) ? read(i18nPath) : '',
      en: fs.existsSync(enPath) ? read(enPath) : null,
      ko: fs.existsSync(koPath) ? read(koPath) : null,
      manifest: fs.existsSync(manifestPath) ? read(manifestPath) : null,
      sw: fs.existsSync(swPath) ? read(swPath) : null,
      files: listRelativeFiles(appDir),
    };
  }
  return {
    subApps,
    analyticsCheck: read(ANALYTICS_CHECK_FILE),
  };
}

function normalizeAppAssetRef(slug, ref) {
  const clean = ref.split('?')[0].split('#')[0];
  if (!clean || clean === '.' || clean === './' || clean === '/' || clean === `/${slug}/` || clean.startsWith('http') || clean.startsWith('data:')) {
    return null;
  }
  if (clean.startsWith('/portal/')) return null;
  let rel = clean.replace(/^\/+/, '');
  if (rel.startsWith(`${slug}/`)) rel = rel.slice(slug.length + 1);
  else if (clean.startsWith('./')) rel = clean.slice(2);
  return rel || null;
}

/** Validate all runtime i18n, SW scope, PWA precache/icon, and telemetry contracts. */
function verifyContracts(fixture) {
  let checkedSubApps = 0;
  let checkedLocaleApps = 0;

  for (const [slug, app] of Object.entries(fixture.subApps)) {
    checkedSubApps += 1;
    if (/serviceWorker\.register\(\s*['"]\/sw\.js['"]/i.test(app.html)) {
      throw new Error(`Root-relative serviceWorker.register('/sw.js') found in ${slug}`);
    }
    if (/window\.dataLayer\s*=\s*\[\s*\]/.test(app.html)) {
      throw new Error(`Destructive window.dataLayer = [] overwrite found in ${slug}`);
    }

    if (!app.activeTarget) continue;

    const svgI18nTags = [...app.html.matchAll(/<(button|a|span|div|label)\b[^>]*data-i18n="[^"]+"[^>]*>[\s\S]*?<\/\1>/g)]
      .filter((match) => /<svg\b/i.test(match[0]));
    if (svgI18nTags.length > 0) {
      throw new Error(`SVG-bearing element carries data-i18n in ${slug}`);
    }

    const fileSet = new Set(app.files || []);
    if (app.manifest !== null) {
      const mf = JSON.parse(app.manifest);
      for (const icon of (mf.icons || [])) {
        const rel = icon.src ? normalizeAppAssetRef(slug, icon.src) : null;
        if (rel && !fileSet.has(rel)) {
          throw new Error(`Missing manifest icon "${icon.src}" in ${slug}`);
        }
      }
    }

    if (app.sw !== null) {
      const arrMatch = app.sw.match(/const\s+(?:ASSETS|STATIC_ASSETS|CACHE_ASSETS|URLS_TO_CACHE|PRECACHE_URLS|FILES_TO_CACHE)\s*=\s*\[([\s\S]*?)\]/i);
      if (arrMatch) {
        for (const m of arrMatch[1].matchAll(/['"]([^'"]+)['"]/g)) {
          const rel = normalizeAppAssetRef(slug, m[1]);
          if (rel && !fileSet.has(rel)) {
            throw new Error(`Missing SW precache asset "${m[1]}" in ${slug}`);
          }
        }
      }
    }

    if (app.en !== null && app.ko !== null) {
      checkedLocaleApps += 1;
      const enObj = JSON.parse(app.en);
      const koObj = JSON.parse(app.ko);
      const dotFirst = app.i18n.includes('Object.prototype.hasOwnProperty.call') || /translations\[.*\]\[key\]/.test(app.i18n);
      for (const key of extractI18nKeys(app.html)) {
        const enVal = resolveLocaleKey(enObj, key, dotFirst);
        const koVal = resolveLocaleKey(koObj, key, dotFirst);
        if (typeof enVal !== 'string' || !enVal.trim()) {
          throw new Error(`Missing or empty en.json key "${key}" in ${slug}`);
        }
        if (typeof koVal !== 'string' || !koVal.trim()) {
          throw new Error(`Missing or empty ko.json key "${key}" in ${slug}`);
        }
      }
    }
  }

  if (!fixture.analyticsCheck.includes('dataLayer.push = function pushProxy') ||
      !fixture.analyticsCheck.includes('window.dataLayer = dataLayer;')) {
    throw new Error('analytics-event-check.js must capture telemetry via window.dataLayer push proxy');
  }

  return { checkedSubApps, checkedLocaleApps };
}

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function runMutations(baseline) {
  const activeSlug = Object.keys(baseline.subApps).find((slug) => baseline.subApps[slug].activeTarget && baseline.subApps[slug].en);
  const cases = [
    ['root-sw-registration', (fx) => {
      fx.subApps[activeSlug].html += "\n<script>navigator.serviceWorker.register('/sw.js')</script>";
    }],
    ['datalayer-overwrite', (fx) => {
      fx.subApps[activeSlug].html += '\n<script>window.dataLayer = [];</script>';
    }],
    ['svg-data-i18n-wipe', (fx) => {
      fx.subApps[activeSlug].html += '\n<a href="/" data-i18n="app.title"><svg viewBox="0 0 24 24"></svg>Home</a>';
    }],
    ['missing-en-key', (fx) => {
      fx.subApps[activeSlug].html += '\n<span data-i18n="nonexistent.runtimeKey">Fallback</span>';
    }],
    ['empty-ko-value', (fx) => {
      const firstKey = extractI18nKeys(fx.subApps[activeSlug].html)[0];
      const parts = firstKey.split('.');
      const koObj = JSON.parse(fx.subApps[activeSlug].ko);
      let cur = koObj;
      for (let i = 0; i < parts.length - 1; i += 1) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = '';
      fx.subApps[activeSlug].ko = JSON.stringify(koObj);
    }],
    ['analytics-datalayer-proxy', (fx) => {
      fx.analyticsCheck = fx.analyticsCheck.replace('dataLayer.push = function pushProxy', 'dataLayer.push = null //');
    }],
    ['missing-manifest-icon', (fx) => {
      const slug = Object.keys(fx.subApps).find((s) => fx.subApps[s].activeTarget && fx.subApps[s].manifest);
      const mf = JSON.parse(fx.subApps[slug].manifest);
      mf.icons = [{ src: 'missing-icon-999.png', sizes: '192x192', type: 'image/png' }];
      fx.subApps[slug].manifest = JSON.stringify(mf);
    }],
    ['missing-sw-precache-asset', (fx) => {
      const slug = Object.keys(fx.subApps).find((s) => fx.subApps[s].activeTarget && fx.subApps[s].sw && /(?:ASSETS|URLS_TO_CACHE|PRECACHE_URLS)\s*=\s*\[/i.test(fx.subApps[s].sw));
      fx.subApps[slug].sw = fx.subApps[slug].sw.replace(/(const\s+(?:ASSETS|URLS_TO_CACHE|PRECACHE_URLS)\s*=\s*\[)/i, `$1'/${slug}/missing-precache-file.json',`);
    }],
  ];

  for (const [name, mutate] of cases) {
    const mutated = cloneFixture(baseline);
    mutate(mutated);
    let caught = false;
    try {
      verifyContracts(mutated);
    } catch (error) {
      console.log(`[PASS] ${name}: ${error.message}`);
      caught = true;
    }
    if (!caught) throw new Error(`Mutation escaped detection: ${name}`);
  }
  console.log(`[PASS] i18n/runtime mutation summary ${cases.length}/${cases.length} detected`);
}

function main() {
  const args = process.argv.slice(2);
  const fixture = loadFixture();
  const result = verifyContracts(fixture);
  if (args.includes('--mutations')) runMutations(fixture);
  console.log(`[PASS] i18n runtime contracts verified (${result.checkedSubApps} sub-apps, ${result.checkedLocaleApps} active locale pairs)`);
}

try {
  main();
} catch (error) {
  console.error(`[FAIL] ${error.message}`);
  process.exit(1);
}
