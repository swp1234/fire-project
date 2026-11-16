#!/usr/bin/env node
/**
 * Static and mutation-tested contract verifier for i18n, SW scope, SVG-anchor,
 * 12-locale parity/Hangul/mojibake hygiene, runtime lang sync, static canonical,
 * dialog-free UX, and dataLayer telemetry preservation across active sub-apps.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const ANALYTICS_CHECK_FILE = path.join(ROOT, 'scripts', 'analytics-event-check.js');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];

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

function resolveByPath(obj, dotKey) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, dotKey)) return obj[dotKey];
  const parts = dotKey.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i += 1) {
    if (!cur || typeof cur !== 'object') return undefined;
    const rest = parts.slice(i).join('.');
    if (Object.prototype.hasOwnProperty.call(cur, rest)) return cur[rest];
    cur = cur[parts[i]];
  }
  return cur;
}

function resolveLocaleKey(obj, key, dotFirst) {
  if (dotFirst && Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
  return resolveByPath(obj, key);
}

function flattenNonEmptyKeys(obj, prefix = '', out = []) {
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') {
      if (v.trim()) out.push(p);
    } else if (Array.isArray(v)) {
      if (v.length > 0) out.push(p);
    } else if (v && typeof v === 'object') {
      flattenNonEmptyKeys(v, p, out);
    }
  }
  return out;
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

function stripAllowedHangul(raw) {
  return raw
    .replace(/한국어/g, '')
    .replace(/"(?:뱀|용|물|비행|추락|죽음)"\s*:/g, '')
    .replace(/세뱃돈|병오년|병오/g, '');
}

function loadFixture() {
  const subApps = {};
  for (const slug of listSubAppSlugs()) {
    if (slug === 'portal' || slug === 'root-domain') continue;
    const appDir = path.join(PROJECTS_DIR, slug);
    const html = read(path.join(appDir, 'index.html'));
    const i18nPath = path.join(appDir, 'js', 'i18n.js');
    const localesDir = path.join(appDir, 'js', 'locales');
    const enPath = path.join(localesDir, 'en.json');
    const koPath = path.join(localesDir, 'ko.json');
    const manifestPath = path.join(appDir, 'manifest.json');
    const swPath = path.join(appDir, 'sw.js');
    const isWait = WAIT_COHORT.has(slug);
    const isRetired = /data-product-status="retired-/i.test(html) || (/noindex,\s*follow/i.test(html) && html.length < 3000);
    const isSuspendedAdServing = /data-ad-serving="suspended-invalid-traffic-/i.test(html);
    const activeTarget = !isWait && !SUSPENDED_LEGACY.has(slug);
    const monetizedActive = activeTarget && !isRetired && !isSuspendedAdServing;

    let locales = null;
    if (activeTarget && !isRetired && fs.existsSync(localesDir)) {
      locales = {};
      for (const l of LOCALES) {
        const lf = path.join(localesDir, `${l}.json`);
        if (fs.existsSync(lf)) locales[l] = read(lf);
      }
    }

    const jsFiles = {};
    const jsDir = path.join(appDir, 'js');
    if (activeTarget && !isRetired && fs.existsSync(jsDir)) {
      for (const f of fs.readdirSync(jsDir).filter((name) => name.endsWith('.js'))) {
        jsFiles[f] = read(path.join(jsDir, f));
      }
    }

    subApps[slug] = {
      activeTarget,
      monetizedActive,
      isRetired,
      html,
      i18n: fs.existsSync(i18nPath) ? read(i18nPath) : '',
      en: fs.existsSync(enPath) ? read(enPath) : null,
      ko: fs.existsSync(koPath) ? read(koPath) : null,
      locales,
      jsFiles,
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

/** Validate all runtime i18n, SW scope, SVG-anchor, parity, canonical, dialog, and telemetry contracts. */
function verifyContracts(fixture) {
  let checkedSubApps = 0;
  let checkedLocaleApps = 0;
  let checkedMonetizedApps = 0;

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

    const dotFirst = app.i18n.includes('Object.prototype.hasOwnProperty.call') || /translations\[.*\]\[key\]/.test(app.i18n);
    if (app.en !== null && app.ko !== null) {
      checkedLocaleApps += 1;
      const enObj = JSON.parse(app.en);
      const koObj = JSON.parse(app.ko);
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

    // Hygiene across all active non-retired apps (monetized + live suspended)
    if (app.locales) {
      for (const [loc, raw] of Object.entries(app.locales)) {
        if (raw.includes('\uFFFD')) {
          throw new Error(`Mojibake U+FFFD found in ${slug}/js/locales/${loc}.json`);
        }
      }
    }
    for (const [jf, code] of Object.entries(app.jsFiles || {})) {
      if (slug === 'attachment-style' && jf === 'clarity.js') continue;
      if (/canonical[^\n]*\.href\s*=\s*(?:seoHref|targetHref|alternate\.href)/.test(code)) {
        throw new Error(`Dynamic canonical mutation found in ${slug}/js/${jf}`);
      }
    }

    // Strict systemic guarantees across active monetized portfolio
    if (!app.monetizedActive) continue;
    checkedMonetizedApps += 1;

    if (app.i18n) {
      if (!app.i18n.includes('window.i18n')) {
        throw new Error(`Missing window.i18n export in ${slug}/js/i18n.js`);
      }
      if (!/URLSearchParams/.test(app.i18n)) {
        throw new Error(`Missing URLSearchParams ?lang= priority in ${slug}/js/i18n.js`);
      }
      if (!/documentElement\.lang/.test(app.i18n)) {
        throw new Error(`Missing document.documentElement.lang sync in ${slug}/js/i18n.js`);
      }
    }

    for (const [jf, code] of Object.entries(app.jsFiles || {})) {
      if (/\b(?:window\.)?(?:alert|confirm|prompt)\s*\(/.test(code)) {
        throw new Error(`Native blocking dialog (alert/confirm/prompt) found in ${slug}/js/${jf}`);
      }
    }

    if (app.locales && app.en !== null) {
      const enObj = JSON.parse(app.en);
      const requiredKeys = [...new Set([...flattenNonEmptyKeys(enObj), ...extractI18nKeys(app.html)])];
      for (const loc of LOCALES) {
        const raw = loc === 'en' ? app.en : (loc === 'ko' && !app.locales.ko ? app.ko : app.locales[loc]);
        if (typeof raw !== 'string') {
          throw new Error(`Missing locale file ${loc}.json in ${slug}`);
        }
        if (raw.includes('\uFFFD')) {
          throw new Error(`Mojibake U+FFFD found in ${slug}/js/locales/${loc}.json`);
        }
        if (loc !== 'ko' && /[\uAC00-\uD7AF]/.test(stripAllowedHangul(raw))) {
          throw new Error(`Unexpected Hangul leak found in ${slug}/js/locales/${loc}.json`);
        }
        const obj = JSON.parse(raw);
        for (const key of requiredKeys) {
          const val = resolveLocaleKey(obj, key, dotFirst);
          const valid = (typeof val === 'string' && val.trim().length > 0) || (Array.isArray(val) && val.length > 0);
          if (!valid) {
            throw new Error(`Missing or empty ${loc}.json key "${key}" in ${slug}`);
          }
        }
      }
    }
  }

  if (!fixture.analyticsCheck.includes('dataLayer.push = function pushProxy') ||
      !fixture.analyticsCheck.includes('window.dataLayer = dataLayer;')) {
    throw new Error('analytics-event-check.js must capture telemetry via window.dataLayer push proxy');
  }

  return { checkedSubApps, checkedLocaleApps, checkedMonetizedApps };
}

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function runMutations(baseline) {
  const activeSlug = Object.keys(baseline.subApps).find((slug) => baseline.subApps[slug].monetizedActive && baseline.subApps[slug].en && baseline.subApps[slug].locales && baseline.subApps[slug].locales.fr);
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
    ['missing-fr-key', (fx) => {
      const firstKey = extractI18nKeys(fx.subApps[activeSlug].html)[0];
      const parts = firstKey.split('.');
      const frObj = JSON.parse(fx.subApps[activeSlug].locales.fr);
      let cur = frObj;
      for (let i = 0; i < parts.length - 1; i += 1) cur = cur[parts[i]];
      delete cur[parts[parts.length - 1]];
      fx.subApps[activeSlug].locales.fr = JSON.stringify(frObj);
    }],
    ['hangul-leak-es', (fx) => {
      fx.subApps[activeSlug].locales.es = fx.subApps[activeSlug].locales.es.replace('}', ',"leakCheck":"테스트"}');
    }],
    ['mojibake-fffd', (fx) => {
      fx.subApps[activeSlug].locales.ko = fx.subApps[activeSlug].locales.ko.replace('"', '"\uFFFD');
    }],
    ['missing-window-i18n', (fx) => {
      fx.subApps[activeSlug].i18n = fx.subApps[activeSlug].i18n.replace(/window\.i18n/g, 'localI18n');
    }],
    ['dynamic-canonical', (fx) => {
      fx.subApps[activeSlug].jsFiles['i18n.js'] += '\ncanonical.href = targetHref;\n';
    }],
    ['native-alert', (fx) => {
      fx.subApps[activeSlug].jsFiles['app.js'] = (fx.subApps[activeSlug].jsFiles['app.js'] || '') + '\nalert("Copied!");\n';
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
  console.log(`[PASS] i18n runtime contracts verified (${result.checkedSubApps} sub-apps, ${result.checkedLocaleApps} active locale pairs, ${result.checkedMonetizedApps} active 12-locale monetized apps)`);
}

try {
  main();
} catch (error) {
  console.error(`[FAIL] ${error.message}`);
  process.exit(1);
}
