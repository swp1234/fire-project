#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const HOST = '127.0.0.1';
const ORIGIN = 'https://dopabrain.com';
const CRASH_PATTERNS = [
  'Cannot read propert',
  'is not a function',
  'is not defined',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'Uncaught',
  'Unhandled',
];
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const EVENT_SELECTORS = {
  content_cta_click: [
    '.cta-btn',
    '.cta-button',
    '.game-link',
    '.test-cta a',
    'a[data-content-surface*="cta"]',
  ],
  content_related_click: [
    '.related-links a',
    '.related-card',
    '.related-link',
    '.link-item',
  ],
  content_test_click: ['.quick-card'],
  content_toc_click: ['.toc a', 'nav.toc a', '[data-toc] a'],
};

function parseArgs(argv) {
  const args = {
    expectAuto: null,
    expectDate: '',
    expectEvents: [],
    expectQuick: null,
    files: [],
    json: false,
    live: false,
    targets: [],
    timeout: 15000,
    urls: [],
    viewport: { width: 390, height: 844 },
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--expect-auto') args.expectAuto = readNumber(argv[++i], arg);
    else if (arg === '--expect-date') args.expectDate = String(argv[++i] || '').trim();
    else if (arg === '--expect-events') args.expectEvents.push(...readList(argv[++i]));
    else if (arg === '--expect-quick') args.expectQuick = readNumber(argv[++i], arg);
    else if (arg === '--file') args.files.push(String(argv[++i] || '').trim());
    else if (arg === '--json') args.json = true;
    else if (arg === '--live') args.live = true;
    else if (arg === '--local') args.live = false;
    else if (arg === '--target') args.targets.push(String(argv[++i] || '').trim());
    else if (arg === '--timeout') args.timeout = readNumber(argv[++i], arg);
    else if (arg === '--url') args.urls.push(String(argv[++i] || '').trim());
    else if (arg === '--viewport') args.viewport = readViewport(argv[++i]);
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      args.targets.push(arg);
    }
  }

  args.expectEvents = Array.from(new Set(args.expectEvents.filter(Boolean)));
  return args;
}

function readNumber(value, label) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${label} expects a non-negative number.`);
  }
  return number;
}

function readList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function readViewport(value) {
  const match = /^(\d+)x(\d+)$/i.exec(String(value || '').trim());
  if (!match) throw new Error('--viewport expects WIDTHxHEIGHT, for example 390x844.');
  return { width: Number(match[1]), height: Number(match[2]) };
}

function printHelp() {
  console.log(`Usage:
  node scripts/verify-blog-pages.js --file projects/portal/blog/en/example.html
  node scripts/verify-blog-pages.js --live --file projects/portal/blog/ko/example.html
  node scripts/verify-blog-pages.js --url https://dopabrain.com/portal/blog/en/example.html

Optional expectations:
  --expect-date 2026-06-05
  --expect-quick 4
  --expect-auto 1
  --expect-events content_view,content_ad_impression,content_test_click,content_cta_click,content_related_click`);
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value);
}

function getLocalPath(urlPath) {
  const cleanPath = decodeURIComponent(String(urlPath || '/').split('?')[0]);
  const joined = path.join(PROJECTS_ROOT, cleanPath);
  const resolved = path.resolve(joined);
  if (!resolved.startsWith(PROJECTS_ROOT)) {
    throw new Error(`Blocked path escape: ${urlPath}`);
  }

  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    return path.join(resolved, 'index.html');
  }
  return resolved;
}

function createStaticServer() {
  return http.createServer((req, res) => {
    try {
      const filePath = getLocalPath(req.url || '/');
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const body = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      });
      res.end(body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(error.message);
    }
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, HOST, () => resolve(server.address().port));
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

function publicPathForFile(filePath) {
  const resolved = path.resolve(ROOT, filePath);
  if (!resolved.startsWith(PROJECTS_ROOT)) {
    throw new Error(`File target must be inside projects/: ${filePath}`);
  }
  return `/${toPosix(path.relative(PROJECTS_ROOT, resolved))}`;
}

function resolveTarget(rawTarget, args, localBaseUrl) {
  const target = String(rawTarget || '').trim();
  if (!target) throw new Error('Empty target.');
  if (isHttpUrl(target)) return { input: target, mode: 'url', url: target };
  if (target.startsWith('/')) {
    return {
      input: target,
      mode: args.live ? 'live-path' : 'local-path',
      url: args.live ? `${ORIGIN}${target}` : `${localBaseUrl}${target}`,
    };
  }

  const publicPath = publicPathForFile(target);
  return {
    input: target,
    mode: args.live ? 'live-file' : 'local-file',
    url: args.live ? `${ORIGIN}${publicPath}` : `${localBaseUrl}${publicPath}`,
  };
}

function needsLocalServer(args) {
  if (args.live) return false;
  return [...args.files, ...args.targets].some((target) => !isHttpUrl(target));
}

async function blockExternalRequests(page) {
  await page.route('https://**/*', async (route) => {
    const url = route.request().url();
    if (url.includes('googletagmanager.com/gtag/js') || url.includes('pagead2.googlesyndication.com')) {
      await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
      return;
    }
    if (url.includes('googleads.g.doubleclick.net') || url.includes('fonts.gstatic.com')) {
      await route.fulfill({ status: 204, body: '' });
      return;
    }
    if (url.includes('fonts.googleapis.com')) {
      await route.fulfill({ status: 200, contentType: 'text/css', body: '' });
      return;
    }
    await route.abort();
  });
}

async function instrumentAnalytics(page) {
  await page.addInitScript(() => {
    const captured = [];
    const dataLayer = window.dataLayer || [];
    const originalPush = Array.prototype.push;
    const capture = (item) => {
      const args = Array.from(item || []);
      if (args[0] === 'event') {
        captured.push({ name: args[1], params: args[2] || {} });
      } else if (item && typeof item === 'object' && item.event) {
        captured.push({ name: item.event, params: item });
      }
    };

    for (const item of dataLayer) capture(item);
    dataLayer.push = function pushProxy(...items) {
      for (const item of items) capture(item);
      return originalPush.apply(this, items);
    };

    window.__analyticsEvents = captured;
    window.dataLayer = dataLayer;
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  });
}

function isCrashError(text) {
  const lower = String(text || '').toLowerCase();
  return CRASH_PATTERNS.some((pattern) => lower.includes(pattern.toLowerCase()));
}

function isIgnoredRuntimeNoise(text) {
  const lower = String(text || '').toLowerCase();
  return (
    lower.includes('googlesyndication.com') ||
    lower.includes('googleads.g.doubleclick.net') ||
    lower.includes('googletagmanager.com') ||
    lower.includes('net::err_aborted') ||
    lower.includes('failed to load resource')
  );
}

async function readPageSnapshot(page) {
  return page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const jsonLd = scripts.map((script) => {
      try {
        return { ok: true, value: JSON.parse(script.textContent || '{}') };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    });
    const flatten = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value.flatMap(flatten);
      if (typeof value !== 'object') return [];
      return [value].concat(Array.isArray(value['@graph']) ? value['@graph'].flatMap(flatten) : []);
    };
    const nodes = jsonLd.flatMap((entry) => (entry.ok ? flatten(entry.value) : []));
    const typeMatches = (node, typeName) => {
      const type = node && node['@type'];
      return Array.isArray(type) ? type.includes(typeName) : type === typeName;
    };
    const article = nodes.find((node) => typeMatches(node, 'Article') || typeMatches(node, 'BlogPosting'));
    const canonical = document.querySelector('link[rel~="canonical"]')?.getAttribute('href') || '';
    const htmlOverflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const bodyOverflow = document.body ? Math.max(0, document.body.scrollWidth - window.innerWidth) : 0;
    return {
      adSurfaces: document.querySelectorAll('[data-ad-surface]').length,
      articleJsonLd: Boolean(article),
      autoAds: document.querySelectorAll('[data-ad-slot="auto"]').length,
      canonical,
      dateModified: article && article.dateModified ? String(article.dateModified).slice(0, 10) : '',
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      invalidJsonLd: jsonLd.filter((entry) => !entry.ok).map((entry) => entry.error),
      jsonLdBlocks: jsonLd.length,
      overflowX: Math.max(htmlOverflow, bodyOverflow),
      quickCards: document.querySelectorAll('.quick-card').length,
      title: document.title || '',
    };
  });
}

async function preventAnchorNavigation(page) {
  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target;
        const anchor = target && target.closest ? target.closest('a') : null;
        if (anchor) event.preventDefault();
      },
      true
    );
  });
}

async function clickFirst(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    const count = await locator.count().catch(() => 0);
    if (count === 0) continue;
    await locator.evaluate((node) => node.scrollIntoView({ block: 'center', inline: 'center' })).catch(() => {});
    await locator.click({ force: true, timeout: 2000 }).catch(async () => {
      await page.evaluate((cssSelector) => {
        const node = document.querySelector(cssSelector);
        if (node) node.click();
      }, selector);
    });
    await page.waitForTimeout(150);
    return selector;
  }
  return '';
}

async function triggerExpectedEvents(page, expectedEvents) {
  const clicked = {};
  await preventAnchorNavigation(page);
  for (const eventName of expectedEvents) {
    const selectors = EVENT_SELECTORS[eventName];
    if (!selectors) continue;
    clicked[eventName] = await clickFirst(page, selectors);
  }
  return clicked;
}

async function readEventNames(page) {
  return page.evaluate(() => {
    const captured = Array.isArray(window.__analyticsEvents) ? window.__analyticsEvents : [];
    const dataLayerEvents = Array.isArray(window.dataLayer)
      ? window.dataLayer
        .map((item) => {
          const args = Array.from(item || []);
          if (args[0] === 'event') return args[1];
          if (item && typeof item === 'object' && item.event) return item.event;
          return '';
        })
        .filter(Boolean)
      : [];
    return Array.from(new Set(captured.map((event) => event.name).concat(dataLayerEvents)));
  });
}

function checkSnapshot(snapshot, args, eventNames, runtimeErrors) {
  const failures = [];
  if (!snapshot.title) failures.push('missing document title');
  if (!snapshot.h1) failures.push('missing h1');
  if (snapshot.invalidJsonLd.length > 0) failures.push(`invalid JSON-LD: ${snapshot.invalidJsonLd.join('; ')}`);
  if (!snapshot.articleJsonLd) failures.push('missing Article/BlogPosting JSON-LD');
  if (!snapshot.dateModified) failures.push('missing Article dateModified');
  if (args.expectDate && snapshot.dateModified !== args.expectDate) failures.push(`dateModified ${snapshot.dateModified || '-'} != ${args.expectDate}`);
  if (args.expectQuick !== null && snapshot.quickCards < args.expectQuick) failures.push(`quick cards ${snapshot.quickCards}/${args.expectQuick}`);
  if (args.expectAuto !== null && snapshot.autoAds < args.expectAuto) failures.push(`auto ads ${snapshot.autoAds}/${args.expectAuto}`);
  if (snapshot.overflowX > 2) failures.push(`horizontal overflow ${snapshot.overflowX}px`);
  for (const eventName of args.expectEvents) {
    if (!eventNames.includes(eventName)) failures.push(`missing event ${eventName}`);
  }
  for (const error of runtimeErrors) failures.push(`runtime error: ${error}`);
  return failures;
}

async function verifyTarget(browser, target, args) {
  const context = await browser.newContext({ viewport: args.viewport });
  const page = await context.newPage();
  const runtimeErrors = [];

  page.on('pageerror', (error) => {
    const text = error.message || String(error);
    if (!isIgnoredRuntimeNoise(text)) runtimeErrors.push(text);
  });
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' && isCrashError(text) && !isIgnoredRuntimeNoise(text)) {
      runtimeErrors.push(text);
    }
  });

  if (target.url.startsWith(`http://${HOST}:`)) {
    await blockExternalRequests(page);
  }
  await instrumentAnalytics(page);
  await page.goto(target.url, { timeout: args.timeout, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const clicked = await triggerExpectedEvents(page, args.expectEvents);
  const snapshot = await readPageSnapshot(page);
  const eventNames = await readEventNames(page);
  const failures = checkSnapshot(snapshot, args, eventNames, runtimeErrors);
  await context.close();

  return {
    clicked,
    eventNames,
    failures,
    input: target.input,
    mode: target.mode,
    ok: failures.length === 0,
    snapshot,
    url: target.url,
  };
}

function printResults(results) {
  for (const result of results) {
    const status = result.ok ? 'PASS' : 'FAIL';
    console.log(`${status} ${result.input} -> ${result.url}`);
    console.log(`  h1="${result.snapshot.h1}" date=${result.snapshot.dateModified || '-'} quick=${result.snapshot.quickCards} autoAds=${result.snapshot.autoAds} overflow=${result.snapshot.overflowX}px`);
    if (result.eventNames.length > 0) console.log(`  events=${result.eventNames.join(', ')}`);
    if (result.failures.length > 0) {
      for (const failure of result.failures) console.log(`  - ${failure}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rawTargets = [...args.files, ...args.urls, ...args.targets].filter(Boolean);
  if (rawTargets.length === 0) throw new Error('Provide at least one --file, --url, or target.');

  let server = null;
  let localBaseUrl = '';
  if (needsLocalServer(args)) {
    server = createStaticServer();
    const port = await listen(server);
    localBaseUrl = `http://${HOST}:${port}`;
  }

  const targets = rawTargets.map((target) => resolveTarget(target, args, localBaseUrl));
  const browser = await chromium.launch();
  try {
    const results = [];
    for (const target of targets) {
      results.push(await verifyTarget(browser, target, args));
    }
    if (args.json) console.log(JSON.stringify({ results }, null, 2));
    else printResults(results);
    if (results.some((result) => !result.ok)) process.exitCode = 1;
  } finally {
    await browser.close();
    if (server) await closeServer(server);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
