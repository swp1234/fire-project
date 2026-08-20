#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const WORKSPACE = path.resolve(__dirname, '..');
const DEFAULT_ROOT_DIR = path.join(WORKSPACE, 'projects', 'root-domain');
const DEFAULT_PROJECTS_DIR = path.join(WORKSPACE, 'projects');
const LANGS = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const HREFLANGS = [...LANGS, 'x-default'];
const START_PATHS = ['/stress-check/', '/hsp-test/', '/puzzle-2048/coach.html'];
const PICK_PATHS = [
  '/stress-check/', '/hsp-test/', '/puzzle-2048/coach.html',
  '/brain-type/', '/iq-test/', '/portal/tools/kpop-role-roster.html',
];
const HEALTH_PATHS = [...new Set([...PICK_PATHS, '/portal/', '/portal/privacy-policy.html'])];
const REQUIRED_SCHEMA_TYPES = ['CollectionPage', 'ItemList', 'Organization', 'WebSite'];
const CRASH_PATTERN = /ReferenceError|TypeError|SyntaxError|Unhandled|is not defined|is not a function/i;
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function valueAt(object, dottedKey) {
  return dottedKey.split('.').reduce((value, key) => value && value[key], object);
}

function readLocales(rootDir) {
  const localeDir = path.join(rootDir, 'js', 'locales');
  const requiredKeys = [
    'app.title', 'header.tagline', 'header.subtitle', 'cta.primary', 'cta.secondary',
    'cta.desc', 'cta.button', 'startHere.title', 'focus.stress', 'focus.hsp',
    'focus.coach', 'focus.brain', 'focus.iq', 'focus.kpop',
  ];
  return Object.fromEntries(LANGS.map((lang) => {
    const localePath = path.join(localeDir, `${lang}.json`);
    assert(fs.existsSync(localePath), `Missing locale file: ${lang}.json`);
    let locale;
    try {
      locale = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    } catch (error) {
      throw new Error(`Invalid locale JSON: ${lang}.json (${error.message})`);
    }
    for (const key of requiredKeys) {
      assert(normalizeText(valueAt(locale, key)), `Missing locale key: ${lang}.${key}`);
    }
    return [lang, locale];
  }));
}

function resolveStaticFile(urlPath, rootDir, projectsDir) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.posix.normalize(decoded).replace(/^\/+/, '');
  assert(!normalized.startsWith('..'), `Blocked path escape: ${urlPath}`);
  const rootFirst = normalized === '' || normalized === 'index.html' || normalized.startsWith('js/') || !normalized.includes('/');
  const candidates = rootFirst
    ? [path.join(rootDir, normalized || 'index.html'), path.join(projectsDir, normalized)]
    : [path.join(projectsDir, normalized), path.join(rootDir, normalized)];
  for (let candidate of candidates) {
    const resolved = path.resolve(candidate);
    const allowed = resolved.startsWith(path.resolve(rootDir)) || resolved.startsWith(path.resolve(projectsDir));
    if (!allowed || !fs.existsSync(resolved)) continue;
    candidate = fs.statSync(resolved).isDirectory() ? path.join(resolved, 'index.html') : resolved;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

async function startLocalServer(rootDir = DEFAULT_ROOT_DIR, projectsDir = DEFAULT_PROJECTS_DIR) {
  const server = http.createServer((request, response) => {
    try {
      const filePath = resolveStaticFile(request.url || '/', rootDir, projectsDir);
      if (!filePath) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not Found');
        return;
      }
      const body = fs.readFileSync(filePath);
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error.message);
    }
  });
  let port = 20000 + Math.floor(Math.random() * 15000);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await new Promise((resolve, reject) => {
        const onError = (error) => reject(error);
        server.once('error', onError);
        server.listen(port, '127.0.0.1', () => {
          server.removeListener('error', onError);
          resolve();
        });
      });
      break;
    } catch (error) {
      if (error.code !== 'EADDRINUSE' || attempt === 19) throw error;
      port += 1;
    }
  }
  const address = server.address();
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

function schemaTypes(blocks) {
  const types = new Set();
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(visit);
    const values = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    values.filter(Boolean).forEach((value) => types.add(value));
    Object.values(node).forEach(visit);
  };
  blocks.forEach(visit);
  return [...types];
}

async function instrumentAnalytics(page) {
  await page.addInitScript(() => {
    const events = [];
    const layer = [];
    const basePush = Array.prototype.push;
    layer.push = function pushProxy(...items) {
      for (const item of items) {
        const args = Array.from(item);
        if (args[0] === 'event') events.push({ name: args[1], params: args[2] || {} });
      }
      return basePush.apply(this, items);
    };
    window.__rootVerifierEvents = events;
    window.dataLayer = layer;
  });
}

async function readPageState(page) {
  return page.evaluate(() => {
    const pathOf = (node) => new URL(node.href, location.href).pathname;
    const rectOf = (node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height };
    };
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const schemaBlocks = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent));
    const keyText = Object.fromEntries([...document.querySelectorAll('[data-i18n]')]
      .map((node) => [node.dataset.i18n, node.textContent.replace(/\s+/g, ' ').trim()]));
    const interactive = [...document.querySelectorAll('.hero-actions a, .start-card, .pick-card, #cta-link, .lang-btn')]
      .map((node) => ({ selector: node.id || node.className, ...rectOf(node) }));
    const primary = document.querySelector('#hero-primary-cta');
    return {
      title: document.title,
      lang: document.documentElement.lang,
      keyText,
      primaryPath: pathOf(primary),
      primaryRect: rectOf(primary),
      primaryVisible: Boolean(primary && getComputedStyle(primary).display !== 'none' &&
        getComputedStyle(primary).visibility !== 'hidden' && Number(getComputedStyle(primary).opacity) > 0 &&
        primary.getBoundingClientRect().width > 0 && primary.getBoundingClientRect().height > 0),
      startPaths: [...document.querySelectorAll('.start-card')].map(pathOf),
      pickPaths: [...document.querySelectorAll('.pick-card')].map(pathOf),
      legacyCount: document.querySelectorAll('.country-content-rail, .quick-cats, .stats-row, .app-grid, .site-directory').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      duplicateIds,
      schemaBlocks,
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      hreflangs: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((node) => node.hreflang),
      interactive,
      skipTarget: document.querySelector('.skip-link')?.getAttribute('href') || '',
      mainExists: Boolean(document.querySelector('main#main-content')),
    };
  });
}

function assertPageState(state, locale, lang, viewport) {
  assert(state.title === locale.app.title, `${lang}/${viewport.name}: localized title mismatch`);
  assert(state.lang === lang, `${lang}/${viewport.name}: html lang mismatch`);
  for (const key of ['header.tagline', 'header.subtitle', 'cta.primary', 'cta.secondary', 'cta.desc', 'cta.button', 'startHere.title']) {
    assert(state.keyText[key] === normalizeText(valueAt(locale, key)), `${lang}/${viewport.name}: untranslated key ${key}`);
  }
  assert(state.primaryPath === START_PATHS[0], `${lang}/${viewport.name}: Primary CTA path mismatch`);
  assert(JSON.stringify(state.startPaths) === JSON.stringify(START_PATHS), `${lang}/${viewport.name}: Focus start paths mismatch`);
  assert(JSON.stringify(state.pickPaths) === JSON.stringify(PICK_PATHS), `${lang}/${viewport.name}: Focus pick paths mismatch`);
  assert(new Set(state.pickPaths).size === PICK_PATHS.length, `${lang}/${viewport.name}: Duplicate focus destinations`);
  assert(state.legacyCount === 0, `${lang}/${viewport.name}: Legacy discovery surface remains`);
  assert(state.overflow <= 0, `${lang}/${viewport.name}: horizontal overflow (${state.overflow}px)`);
  assert(state.duplicateIds.length === 0, `${lang}/${viewport.name}: Duplicate DOM IDs: ${state.duplicateIds.join(', ')}`);
  assert(state.primaryVisible, `${lang}/${viewport.name}: Primary CTA is not visible`);
  assert(state.primaryRect.width >= 44 && state.primaryRect.height >= 44, `${lang}/${viewport.name}: Primary CTA touch target is too small`);
  assert(state.primaryRect.top >= 0 && state.primaryRect.bottom <= viewport.height, `${lang}/${viewport.name}: Primary CTA is outside the initial viewport`);
  assert(state.interactive.every((item) => item.width >= 44 && item.height >= 44), `${lang}/${viewport.name}: Interactive target below 44px`);
  assert(state.skipTarget === '#main-content' && state.mainExists, `${lang}/${viewport.name}: Skip link target is broken`);
  assert(state.canonical === 'https://dopabrain.com/', `${lang}/${viewport.name}: Canonical URL mismatch`);
  assert(JSON.stringify([...state.hreflangs].sort()) === JSON.stringify([...HREFLANGS].sort()), `${lang}/${viewport.name}: hreflang set mismatch`);
  const types = schemaTypes(state.schemaBlocks);
  for (const type of REQUIRED_SCHEMA_TYPES) assert(types.includes(type), `${lang}/${viewport.name}: Missing schema type ${type}`);
}

async function assertAnalytics(page) {
  const waitForEvent = (predicate) => page.waitForFunction(predicate, null, { timeout: 3000 });
  await waitForEvent(() => window.__rootVerifierEvents.some((event) => event.name === 'root_view'));
  await page.locator('#hero-primary-cta').evaluate((node) => node.addEventListener('click', (event) => event.preventDefault(), { capture: true }));
  await page.locator('#hero-primary-cta').click();
  await waitForEvent(() => window.__rootVerifierEvents.some((event) => event.name === 'root_cta_click' && event.params.surface === 'hero_primary_stress'));
  await page.locator('.pick-card').first().evaluate((node) => node.addEventListener('click', (event) => event.preventDefault(), { capture: true }));
  await page.locator('.pick-card').first().click();
  await waitForEvent(() => window.__rootVerifierEvents.some((event) => event.name === 'root_pick_click'));
  await page.locator('#lang-toggle').click();
  await page.locator('.lang-option[data-lang="fr"]').click();
  await waitForEvent(() => window.__rootVerifierEvents.some((event) => event.name === 'root_language_change' && event.params.language === 'fr'));
}

async function assertArchiveReveal(page) {
  const section = page.locator('.cta-section');
  await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.cta-section')?.classList.contains('in-view'));
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.cta-section')).opacity) === 1);
  const archive = page.locator('#cta-link');
  assert(await archive.isVisible(), 'Archive CTA did not reveal after scrolling');
  const box = await archive.boundingBox();
  assert(box && box.width >= 44 && box.height >= 44, 'Archive CTA is not operable after reveal');
  await page.evaluate(() => scrollTo(0, 0));
}

async function assertHealthyLinks(context, origin) {
  for (const routePath of HEALTH_PATHS) {
    const response = await context.request.get(new URL(routePath, origin).href, { timeout: 15000 });
    assert(response.status() >= 200 && response.status() < 400, `Broken focus link: ${routePath} (${response.status()})`);
  }
}

async function verifyRootFocus(options = {}) {
  const rootDir = path.resolve(options.rootDir || DEFAULT_ROOT_DIR);
  const projectsDir = path.resolve(options.projectsDir || DEFAULT_PROJECTS_DIR);
  const locales = readLocales(rootDir);
  const languages = options.languages || LANGS;
  const viewports = options.viewports || [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'desktop', width: 1440, height: 900 },
  ];
  const ownServer = options.origin ? null : await startLocalServer(rootDir, projectsDir);
  const origin = options.origin || ownServer.origin;
  const originHost = new URL(origin).host;
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of viewports) {
      for (const lang of languages) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        const runtimeErrors = [];
        await instrumentAnalytics(page);
        page.on('pageerror', (error) => runtimeErrors.push(error.message));
        page.on('console', (message) => {
          if (message.type() === 'error' && CRASH_PATTERN.test(message.text())) runtimeErrors.push(message.text());
        });
        await page.route('**/*', (route) => {
          const url = new URL(route.request().url());
          return url.host === originHost ? route.continue() : route.abort();
        });
        try {
          const response = await page.goto(`${origin}/?lang=${lang}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
          assert(response && response.ok(), `${lang}/${viewport.name}: Root response failed`);
          await page.waitForFunction(() => getComputedStyle(document.getElementById('app-loader')).display === 'none');
          await page.waitForFunction((expected) => document.documentElement.lang === expected, lang);
          await page.waitForFunction(() => [...document.querySelectorAll('.hero-anim')]
            .every((node) => Number(getComputedStyle(node).opacity) === 1));
          const state = await readPageState(page);
          assertPageState(state, locales[lang], lang, viewport);
          assert(runtimeErrors.length === 0, `${lang}/${viewport.name}: Runtime errors: ${runtimeErrors.join(' | ')}`);
          if (lang === 'en' && viewport.name === 'mobile') {
            await assertArchiveReveal(page);
            if (options.screenshot !== false) {
              const screenshotPath = path.resolve(options.screenshotPath || path.join(WORKSPACE, '.codex-artifacts', 'root-focus-mobile.png'));
              fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
              await page.screenshot({ path: screenshotPath, fullPage: true });
            }
            await assertAnalytics(page).catch((error) => {
              throw new Error(`Analytics event verification failed: ${error.message}`);
            });
          }
          results.push({ lang, viewport: viewport.name, ok: true });
        } finally {
          await context.close();
        }
      }
    }
    if (options.checkLinks !== false) {
      const context = await browser.newContext();
      try {
        await assertHealthyLinks(context, origin);
      } finally {
        await context.close();
      }
    }
    return { ok: true, origin, checks: results.length, languages: languages.length, viewports: viewports.map((item) => item.name), links: options.checkLinks === false ? 0 : HEALTH_PATHS.length };
  } finally {
    await browser.close();
    if (ownServer) await ownServer.close();
  }
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (/^https?:\/\//.test(arg)) options.origin = arg.replace(/\/$/, '');
    else if (arg === '--origin') options.origin = argv[++index].replace(/\/$/, '');
    else if (arg === '--root-dir') options.rootDir = argv[++index];
    else if (arg === '--projects-dir') options.projectsDir = argv[++index];
    else if (arg === '--no-links') options.checkLinks = false;
    else if (arg === '--no-screenshot') options.screenshot = false;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/verify-root-focus.js [origin] [--root-dir path] [--projects-dir path] [--no-links] [--no-screenshot]');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

if (require.main === module) {
  verifyRootFocus(parseArgs(process.argv.slice(2)))
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error.stack || error.message);
      process.exit(1);
    });
}

module.exports = { LANGS, verifyRootFocus };
