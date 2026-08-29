#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const WORKSPACE = path.resolve(__dirname, '..');
const DEFAULT_PROJECT_DIR = path.join(WORKSPACE, 'projects', 'puzzle-2048');
const PORTAL_DIR = path.join(WORKSPACE, 'projects', 'portal');
const APP_PATH = '/puzzle-2048/';
const LANGUAGES = Object.freeze(['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']);
const VIEWPORTS = Object.freeze([
  { name: 'mobile-touch', width: 390, height: 844, hasTouch: true, input: 'touch', undoInput: 'pointer' },
  { name: 'desktop-keyboard', width: 1440, height: 900, hasTouch: false, input: 'keyboard', undoInput: 'keyboard' }
]);
const TARGET_SELECTORS = Object.freeze([
  '#sound-toggle',
  '#theme-toggle',
  '#lang-toggle',
  '#new-game-btn',
  '#undo-btn',
  '#board-coach-link',
  '.seo-accordion-toggle',
  '#share-float button'
]);
const USAGE = `Usage:
  node scripts/verify-2048-ad-policy.js
  node scripts/verify-2048-ad-policy.js --mutations`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function countMatches(text, pattern) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  return [...text.matchAll(new RegExp(pattern.source, flags))].length;
}

function parseJsonLd(html) {
  return [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match, index) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        throw new Error(`Invalid JSON-LD block ${index + 1}: ${error.message}`);
      }
    });
}

function schemaHasType(value, expectedType) {
  if (Array.isArray(value)) return value.some((item) => schemaHasType(item, expectedType));
  if (!value || typeof value !== 'object') return false;
  const ownType = value['@type'];
  if (ownType === expectedType || (Array.isArray(ownType) && ownType.includes(expectedType))) return true;
  return Object.values(value).some((item) => schemaHasType(item, expectedType));
}

function verifySource(projectDir = DEFAULT_PROJECT_DIR) {
  const root = path.resolve(projectDir);
  const indexHtml = readText(path.join(root, 'index.html'));
  const appJs = readText(path.join(root, 'js', 'app.js'));
  const styleCss = readText(path.join(root, 'css', 'style.css'));
  const readme = readText(path.join(root, 'README.md'));
  const serviceWorker = readText(path.join(root, 'sw.js'));

  assert(countMatches(indexHtml, /\bid=["']undo-btn["']/gi) === 1, 'Expected exactly one ordinary #undo-btn');
  assert(!/\bid=["']undo-ad-btn["']/i.test(indexHtml), 'Fake undo button #undo-ad-btn is present');
  assert(!/data-i18n=["']game\.undoWithAd["']/i.test(indexHtml), 'Fake undo translation binding game.undoWithAd is present');
  assert(!/\bid=["']interstitial-ad["']/i.test(indexHtml), 'Fake interstitial overlay #interstitial-ad is present');
  assert(!/\bad-interstitial\b/i.test(indexHtml), 'Fake interstitial overlay class is present');

  const headMatch = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(indexHtml);
  assert(headMatch, 'Document head is missing');
  const autoAdsLoader = /<script\b(?=[^>]*\basync\b)(?=[^>]*\bsrc=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882["'])(?=[^>]*\bcrossorigin=["']anonymous["'])[^>]*>\s*<\/script>/gi;
  const loaderCount = countMatches(indexHtml, autoAdsLoader);
  const headLoaderCount = countMatches(headMatch[1], autoAdsLoader);
  assert(loaderCount === 1 && headLoaderCount === 1, `Auto Ads head loader count mismatch: document=${loaderCount}, head=${headLoaderCount}`);
  assert(!/<ins\b[^>]*class=["'][^"']*\badsbygoogle\b/i.test(indexHtml), 'Manual AdSense <ins> unit is present');
  assert(!/\bdata-ad-slot\s*=/i.test(indexHtml), 'Manual data-ad-slot attribute is present');
  assert(
    !/(?:window\.)?adsbygoogle\s*=|(?:window\.)?adsbygoogle[^;\n]*\.push\s*\(/i.test(`${indexHtml}\n${appJs}`),
    'Manual adsbygoogle.push/bootstrap code is present outside the head loader'
  );

  const fakeProgressPatterns = [
    [/\bid=["']progress-ad["']/i, 'Fake progress ad wrapper is present'],
    [/\bpuzzle2048_progress_ad\b/, 'Fake progress ad surface is present'],
    [/\bprogressAdLoaded\b/, 'Fake progress ad code progressAdLoaded is present'],
    [/\bprogressAdMoveThreshold\b/, 'Fake progress ad code progressAdMoveThreshold is present'],
    [/\bloadProgressAd\b/, 'Fake progress ad code loadProgressAd is present'],
    [/\bprogress_ad_impression\b/, 'Fake progress ad telemetry progress_ad_impression is present'],
    [/\bad_slot\b/, 'Fake progress ad telemetry ad_slot is present']
  ];
  for (const [pattern, message] of fakeProgressPatterns) {
    assert(!pattern.test(`${indexHtml}\n${appJs}`), message);
  }

  const fakeAppPatterns = [
    [/\bundoAdBtn\b/, 'Fake undoAdBtn reference is present'],
    [/\bundoWithAd\b/, 'Fake ad-granted undo code undoWithAd is present'],
    [/\bshowInterstitialAd\b/, 'Fake display-ad overlay code showInterstitialAd is present'],
    [/getElementById\(\s*['"]interstitial-ad['"]\s*\)/, 'Fake interstitial overlay lookup is present'],
    [/trackEvent\(\s*['"]adView['"]/, 'Fake puzzle2048_adView tracking path is present'],
    [/setTimeout\s*\(\s*\(\)\s*=>\s*this\.undo\(\)\s*,\s*5000\s*\)/, 'Fake five-second ad undo timer is present']
  ];
  for (const [pattern, message] of fakeAppPatterns) assert(!pattern.test(appJs), message);
  assert(!/(?:\.ad-interstitial|#interstitial-ad)\b/i.test(styleCss), 'Fake interstitial overlay CSS is present');

  assert(
    /this\.undoBtn\.addEventListener\(\s*['"]click['"]\s*,\s*\(\)\s*=>\s*this\.undo\(\)\s*\)/.test(appJs),
    'Ordinary undo click binding missing'
  );
  assert(/case\s+['"]u['"]\s*:[\s\S]{0,180}?this\.undo\(\)/.test(appJs), 'Ordinary keyboard undo binding missing');

  const officialCalls = [
    ['GameAds.showInterstitial', /GameAds\.showInterstitial\s*\(/g],
    ['GameAds.injectRewardButton', /GameAds\.injectRewardButton\s*\(/g],
    ['GameAds.removeRewardButton', /GameAds\.removeRewardButton\s*\(/g],
    ['GameAds.init', /GameAds\.init\s*\(/g]
  ];
  for (const [name, pattern] of officialCalls) {
    const count = countMatches(appJs, pattern);
    assert(count === 1, `${name} call count mismatch: expected 1, got ${count}`);
  }
  assert(
    countMatches(indexHtml, /src=["']\/portal\/js\/game-ads\.js["']/gi) === 1,
    'Shared /portal/js/game-ads.js include count mismatch'
  );

  assert(!/(?:\.ad-container|\.ad-top|\.ad-progress|\.ad-bottom|\.adsbygoogle)\b/i.test(styleCss), 'Removed manual ad surface CSS is present');

  const schemas = parseJsonLd(indexHtml);
  const hasFaqSchema = schemas.some((schema) => schemaHasType(schema, 'FAQPage'));
  const hasVisibleFaq = /<(?:section|div|details)[^>]*(?:id|class)=["'][^"']*\bfaq\b/i.test(indexHtml);
  assert(!hasFaqSchema && !hasVisibleFaq, 'FAQ/schema mismatch: hidden or unmatched FAQ content is present');

  const forbiddenUndoClaims = [
    /watch a short ad to earn additional undo uses/i,
    /\bad-based undo\b/i,
    /\badditional undo\b[\s\S]{0,40}\b(?:ad|advert)/i,
    /\bpuzzle2048_adView\b/
  ];
  const claimSources = [
    ['index.html', indexHtml],
    ['README.md', readme]
  ];
  for (const [sourceName, source] of claimSources) {
    for (const pattern of forbiddenUndoClaims) {
      assert(!pattern.test(source), `Removed ad-based undo claim remains in ${sourceName}: ${pattern}`);
    }
  }
  assert(!/\|\s*Undo\s*\|\s*Reward\s*\|/i.test(readme), 'README still claims an Undo reward-ad placement');

  const localeDir = path.join(root, 'js', 'locales');
  const localeFiles = fs.readdirSync(localeDir).filter((name) => name.endsWith('.json')).sort();
  const expectedFiles = LANGUAGES.map((lang) => `${lang}.json`).sort();
  assert(
    JSON.stringify(localeFiles) === JSON.stringify(expectedFiles),
    `Locale inventory mismatch: expected ${expectedFiles.join(', ')}, got ${localeFiles.join(', ')}`
  );
  let expectedGameKeys = null;
  for (const fileName of localeFiles) {
    let locale;
    try {
      locale = JSON.parse(readText(path.join(localeDir, fileName)));
    } catch (error) {
      throw new Error(`Invalid locale JSON ${fileName}: ${error.message}`);
    }
    assert(locale.game && typeof locale.game === 'object', `Missing game object in ${fileName}`);
    assert(!Object.prototype.hasOwnProperty.call(locale.game, 'undoWithAd'), `Forbidden game.undoWithAd key remains in ${fileName}`);
    assert(typeof locale.game.undo === 'string' && locale.game.undo.trim(), `Missing ordinary game.undo label in ${fileName}`);
    const keys = Object.keys(locale.game).sort();
    if (!expectedGameKeys) expectedGameKeys = keys;
    assert(
      JSON.stringify(keys) === JSON.stringify(expectedGameKeys),
      `Inconsistent game locale keys in ${fileName}`
    );
  }

  const cacheMatch = /const\s+CACHE_NAME\s*=\s*['"]puzzle2048-v(\d+)['"]/.exec(serviceWorker);
  assert(cacheMatch, 'Service worker cache name is missing or malformed');
  assert(Number(cacheMatch[1]) >= 8, `Service worker cache was not bumped for the cleanup: v${cacheMatch[1]}`);

  const ids = [...indexHtml.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert(duplicateIds.length === 0, `Duplicate DOM IDs: ${duplicateIds.join(', ')}`);

  return {
    locales: localeFiles.length,
    officialGameAdsCalls: officialCalls.length,
    serviceWorkerCache: `v${cacheMatch[1]}`
  };
}

function isWithin(root, target) {
  const normalizedRoot = `${path.resolve(root)}${path.sep}`.toLowerCase();
  return path.resolve(target).toLowerCase().startsWith(normalizedRoot);
}

function resolveRequestTarget(projectDir, requestPath) {
  if (requestPath === '/puzzle-2048') return { redirect: APP_PATH };

  let root;
  let relative;
  if (requestPath.startsWith(APP_PATH)) {
    root = projectDir;
    relative = requestPath.slice(APP_PATH.length);
  } else if (requestPath.startsWith('/portal/')) {
    root = PORTAL_DIR;
    relative = requestPath.slice('/portal/'.length);
  } else {
    return null;
  }

  const target = path.resolve(root, relative || 'index.html');
  assert(isWithin(root, target), `Unsafe verifier request path: ${requestPath}`);
  return { target };
}

function startStaticServer(projectDir) {
  const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };

  const server = http.createServer((request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      const requestPath = decodeURIComponent(requestUrl.pathname);
      const resolved = resolveRequestTarget(projectDir, requestPath);
      if (!resolved) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }
      if (resolved.redirect) {
        response.writeHead(308, { Location: resolved.redirect });
        response.end();
        return;
      }
      let target = resolved.target;
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': mimeTypes[path.extname(target).toLowerCase()] || 'application/octet-stream'
      });
      fs.createReadStream(target).pipe(response);
    } catch (error) {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error.message);
    }
  });

  return listenOnSafePort(server).then((address) => ({
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((closeResolve) => server.close(closeResolve))
      }));
}

function installTestState() {
  window.dataLayer = [];
  window.adsbygoogle = [];
  localStorage.setItem('language', 'en');
  localStorage.setItem('puzzle2048_sound', 'false');
  localStorage.setItem('puzzle2048_bestScore', '0');
  localStorage.setItem('puzzle2048_gameState', JSON.stringify({
    grid: [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    score: 0,
    gameOver: false
  }));
}

async function isolateExternalNetwork(page, origin) {
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === origin) {
      await route.continue();
      return;
    }
    const resourceType = request.resourceType();
    const contentType = resourceType === 'script'
      ? 'application/javascript; charset=utf-8'
      : resourceType === 'stylesheet'
        ? 'text/css; charset=utf-8'
        : 'text/plain; charset=utf-8';
    await route.fulfill({ status: 200, contentType, body: '' });
  });
}

async function waitForReady(page) {
  await page.waitForFunction(() => {
    const loader = document.getElementById('app-loader');
    return !loader || getComputedStyle(loader).display === 'none';
  }, null, { timeout: 5000 });
  await page.waitForFunction(() => document.querySelectorAll('#game-grid .tile').length === 2, null, { timeout: 5000 });
  await page.waitForTimeout(200);
}

async function readBoard(page) {
  return page.evaluate(() => [...document.querySelectorAll('#game-grid .tile')]
    .map((tile) => ({
      left: Math.round(Number.parseFloat(tile.style.left || '0')),
      top: Math.round(Number.parseFloat(tile.style.top || '0')),
      value: Number(tile.getAttribute('data-value'))
    }))
    .sort((a, b) => a.top - b.top || a.left - b.left || a.value - b.value));
}

async function readEventNames(page) {
  return page.evaluate(() => (window.dataLayer || [])
    .map((entry) => {
      try {
        return Array.from(entry || []);
      } catch (error) {
        return [];
      }
    })
    .filter((entry) => entry[0] === 'event')
    .map((entry) => entry[1]));
}

async function assertTargets(page, viewportName) {
  const targets = await page.evaluate((selectors) => selectors.flatMap((selector) => {
    return [...document.querySelectorAll(selector)].map((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        height: rect.height,
        selector,
        visible: style.display !== 'none' && style.visibility !== 'hidden',
        width: rect.width
      };
    });
  }), TARGET_SELECTORS);
  assert(targets.length >= TARGET_SELECTORS.length, `${viewportName}: expected interaction targets are missing`);
  for (const target of targets.filter((item) => item.visible)) {
    assert(
      target.width >= 44 && target.height >= 44,
      `${viewportName}: target below 44px (${target.selector}: ${target.width.toFixed(1)}x${target.height.toFixed(1)})`
    );
  }
}

async function assertNoOverflow(page, viewportName) {
  const overflow = await page.evaluate(() => ({
    body: Math.max(0, document.body.scrollWidth - window.innerWidth),
    document: Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
  }));
  assert(
    overflow.body === 0 && overflow.document === 0,
    `${viewportName}: horizontal overflow (body=${overflow.body}, document=${overflow.document})`
  );
}

async function dispatchTouchMove(page, direction) {
  await page.locator('.grid-background').evaluate((element, moveDirection) => {
    const rect = element.getBoundingClientRect();
    const startX = moveDirection === 'left' ? rect.right - rect.width * 0.2 : rect.left + rect.width * 0.2;
    const endX = moveDirection === 'left' ? rect.left + rect.width * 0.2 : rect.right - rect.width * 0.2;
    const y = rect.top + rect.height / 2;
    const start = new Event('touchstart', { bubbles: true, cancelable: true });
    Object.defineProperty(start, 'touches', { value: [{ clientX: startX, clientY: y }] });
    element.dispatchEvent(start);
    const end = new Event('touchend', { bubbles: true, cancelable: true });
    Object.defineProperty(end, 'changedTouches', { value: [{ clientX: endX, clientY: y }] });
    element.dispatchEvent(end);
  }, direction);
}

async function verifyViewport(browser, origin, viewport) {
  const context = await browser.newContext({
    hasTouch: viewport.hasTouch,
    serviceWorkers: 'block',
    viewport: { width: viewport.width, height: viewport.height }
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(installTestState);
  await isolateExternalNetwork(page, origin);

  try {
    const response = await page.goto(`${origin}${APP_PATH}?lang=en&verifyAdPolicy=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    assert(response && response.ok(), `${viewport.name}: game document failed to load`);
    await waitForReady(page);
    assert(await page.locator('#undo-ad-btn').count() === 0, `${viewport.name}: fake undo button rendered`);
    assert(await page.locator('#interstitial-ad').count() === 0, `${viewport.name}: fake interstitial overlay rendered`);
    assert(await page.locator('ins.adsbygoogle').count() === 0, `${viewport.name}: manual AdSense unit rendered`);
    assert(await page.locator('[data-ad-slot]').count() === 0, `${viewport.name}: manual data-ad-slot rendered`);
    assert(await page.locator('#progress-ad').count() === 0, `${viewport.name}: fake progress ad wrapper rendered`);
    assert(
      await page.locator('head script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="]').count() === 1,
      `${viewport.name}: Auto Ads head loader runtime count mismatch`
    );
    await assertTargets(page, viewport.name);
    await assertNoOverflow(page, viewport.name);

    await page.locator('#new-game-btn').click();
    await page.waitForFunction(() => document.querySelectorAll('#game-grid .tile').length === 2);
    const startEvents = await readEventNames(page);
    assert(startEvents.includes('puzzle2048_newGame'), `${viewport.name}: New Game did not emit puzzle2048_newGame`);

    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForReady(page);
    const before = await readBoard(page);
    assert(
      JSON.stringify(before.map((tile) => tile.value)) === JSON.stringify([2, 2]),
      `${viewport.name}: deterministic start board did not load`
    );

    if (viewport.input === 'touch') await dispatchTouchMove(page, 'left');
    else await page.keyboard.press('ArrowLeft');
    await page.waitForFunction(() => document.getElementById('move-counter')?.textContent === 'Moves: 1', null, { timeout: 3000 });
    await page.waitForTimeout(240);
    const afterMove = await readBoard(page);
    assert(JSON.stringify(afterMove) !== JSON.stringify(before), `${viewport.name}: valid move did not change the board`);
    assert(afterMove.some((tile) => tile.value === 4), `${viewport.name}: valid move did not merge the deterministic pair`);
    assert(await page.locator('#score').textContent() === '4', `${viewport.name}: valid move score mismatch`);

    if (viewport.undoInput === 'keyboard') await page.keyboard.press('u');
    else await page.locator('#undo-btn').click();
    await page.waitForTimeout(50);
    const afterUndo = await readBoard(page);
    assert(
      JSON.stringify(afterUndo) === JSON.stringify(before),
      `${viewport.name}: ordinary undo did not restore the prior board (before=${JSON.stringify(before)}, after=${JSON.stringify(afterUndo)})`
    );
    assert(await page.locator('#score').textContent() === '0', `${viewport.name}: ordinary undo did not restore the score`);
    const events = await readEventNames(page);
    assert(events.includes('puzzle2048_move'), `${viewport.name}: valid move event missing`);
    assert(events.includes('puzzle2048_undo'), `${viewport.name}: ordinary undo event missing`);
    await assertNoOverflow(page, viewport.name);
    await page.waitForTimeout(50);
    assert(runtimeErrors.length === 0, `${viewport.name}: Runtime errors: ${runtimeErrors.join(' | ')}`);
  } finally {
    await context.close();
  }
}

async function verifyRuntime(projectDir = DEFAULT_PROJECT_DIR, viewports = VIEWPORTS) {
  const localServer = await startStaticServer(path.resolve(projectDir));
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) await verifyViewport(browser, localServer.origin, viewport);
  } finally {
    await browser.close();
    await localServer.close();
  }
  return { viewports: viewports.map((item) => item.name) };
}

async function verifyProject(options = {}) {
  const projectDir = path.resolve(options.projectDir || DEFAULT_PROJECT_DIR);
  const source = verifySource(projectDir);
  const runtime = options.runtime === false
    ? { viewports: [] }
    : await verifyRuntime(projectDir, options.viewports || VIEWPORTS);
  return { projectDir, runtime, source };
}

function mutateFile(projectDir, relativePath, transform) {
  const filePath = path.join(projectDir, relativePath);
  const source = readText(filePath);
  const output = transform(source);
  assert(output !== source, `Mutation did not change ${relativePath}`);
  fs.writeFileSync(filePath, output, 'utf8');
}

function replaceRequired(source, pattern, replacement, mutationName) {
  const output = source.replace(pattern, replacement);
  assert(output !== source, `Mutation ${mutationName} did not match its source pattern`);
  return output;
}

function copyFixture(source, destination) {
  fs.cpSync(source, destination, {
    filter: (entry) => path.basename(entry) !== '.git',
    recursive: true
  });
}

const MUTATIONS = Object.freeze([
  {
    name: 'fake-undo-button',
    expected: 'Fake undo button',
    apply(projectDir) {
      mutateFile(projectDir, 'index.html', (html) => replaceRequired(
        html,
        '<button class="btn btn-secondary" id="undo-btn" data-i18n="game.undo">Undo</button>',
        '<button class="btn btn-secondary" id="undo-btn" data-i18n="game.undo">Undo</button>\n            <button id="undo-ad-btn">Undo (Ad)</button>',
        this.name
      ));
    }
  },
  {
    name: 'fake-five-second-undo',
    expected: 'Fake ad-granted undo code',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => replaceRequired(
        app,
        '    // ========== EVENT LISTENERS ==========',
        '    undoWithAd() { setTimeout(() => this.undo(), 5000); }\n\n    // ========== EVENT LISTENERS ==========',
        this.name
      ));
    }
  },
  {
    name: 'fake-interstitial-overlay',
    expected: 'Fake interstitial overlay',
    apply(projectDir) {
      mutateFile(projectDir, 'index.html', (html) => replaceRequired(
        html,
        '    <!-- GA4 Analytics -->',
        '    <div class="ad-interstitial hidden" id="interstitial-ad"></div>\n\n    <!-- GA4 Analytics -->',
        this.name
      ));
    }
  },
  {
    name: 'fake-interstitial-css',
    expected: 'Fake interstitial overlay CSS',
    apply(projectDir) {
      mutateFile(projectDir, 'css/style.css', (css) => `${css}\n.ad-interstitial { position: fixed; inset: 0; }\n`);
    }
  },
  {
    name: 'manual-adsense-unit',
    expected: 'Manual AdSense <ins> unit',
    apply(projectDir) {
      mutateFile(projectDir, 'index.html', (html) => replaceRequired(
        html,
        '</body>',
        '<ins class="adsbygoogle" data-ad-client="ca-pub-3600813755953882"></ins>\n</body>',
        this.name
      ));
    }
  },
  {
    name: 'auto-slot-attribute',
    expected: 'Manual data-ad-slot attribute',
    apply(projectDir) {
      mutateFile(projectDir, 'index.html', (html) => replaceRequired(
        html,
        '</body>',
        '<div data-ad-slot="auto"></div>\n</body>',
        this.name
      ));
    }
  },
  {
    name: 'manual-adsbygoogle-push',
    expected: 'Manual adsbygoogle.push',
    apply(projectDir) {
      mutateFile(projectDir, 'index.html', (html) => replaceRequired(
        html,
        '</body>',
        '<script>(window.adsbygoogle = window.adsbygoogle || []).push({});</script>\n</body>',
        this.name
      ));
    }
  },
  {
    name: 'fake-progress-telemetry',
    expected: 'Fake progress ad telemetry progress_ad_impression',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => `${app}\nwindow.gtag?.('event', 'progress_ad_impression', { ad_slot: 'auto' });\n`);
    }
  },
  {
    name: 'duplicate-auto-ads-loader',
    expected: 'Auto Ads head loader count mismatch',
    apply(projectDir) {
      mutateFile(projectDir, 'index.html', (html) => {
        const loader = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3600813755953882" crossorigin="anonymous"></script>';
        return replaceRequired(html, '</head>', `${loader}\n</head>`, this.name);
      });
    }
  },
  {
    name: 'forbidden-locale-key',
    expected: 'Forbidden game.undoWithAd key',
    apply(projectDir) {
      mutateFile(projectDir, 'js/locales/en.json', (json) => replaceRequired(
        json,
        '    "undo": "Undo",',
        '    "undo": "Undo",\n    "undoWithAd": "Undo (Watch Ad)",',
        this.name
      ));
    }
  },
  {
    name: 'stale-readme-claim',
    expected: 'Removed ad-based undo claim remains',
    apply(projectDir) {
      mutateFile(projectDir, 'README.md', (readme) => `${readme}\n- Ad-based Undo: watch an ad for another undo.\n`);
    }
  },
  {
    name: 'hidden-faq-schema',
    expected: 'FAQ/schema mismatch',
    apply(projectDir) {
      const schema = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}</script>';
      mutateFile(projectDir, 'index.html', (html) => replaceRequired(html, '</head>', `${schema}\n</head>`, this.name));
    }
  },
  {
    name: 'missing-official-interstitial',
    expected: 'GameAds.showInterstitial call count mismatch',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => replaceRequired(
        app,
        'GameAds.showInterstitial(',
        'GameAds.showInterstitialMissing(',
        this.name
      ));
    }
  },
  {
    name: 'missing-official-reward-injection',
    expected: 'GameAds.injectRewardButton call count mismatch',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => replaceRequired(
        app,
        'GameAds.injectRewardButton(',
        'GameAds.injectRewardButtonMissing(',
        this.name
      ));
    }
  },
  {
    name: 'missing-official-reward-removal',
    expected: 'GameAds.removeRewardButton call count mismatch',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => replaceRequired(
        app,
        'GameAds.removeRewardButton(',
        'GameAds.removeRewardButtonMissing(',
        this.name
      ));
    }
  },
  {
    name: 'missing-official-init',
    expected: 'GameAds.init call count mismatch',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => replaceRequired(app, 'GameAds.init();', 'GameAds.initMissing();', this.name));
    }
  },
  {
    name: 'missing-ordinary-undo-binding',
    expected: 'Ordinary undo click binding missing',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => replaceRequired(
        app,
        "this.undoBtn.addEventListener('click', () => this.undo());",
        "this.undoBtn.addEventListener('click', () => {});",
        this.name
      ));
    }
  },
  {
    name: 'undersized-undo-target',
    expected: 'target below 44px',
    apply(projectDir) {
      mutateFile(projectDir, 'css/style.css', (css) => `${css}\n#undo-btn { height: 20px !important; min-height: 0 !important; padding: 0 !important; }\n`);
    }
  },
  {
    name: 'mobile-overflow',
    expected: 'horizontal overflow',
    apply(projectDir) {
      mutateFile(projectDir, 'css/style.css', (css) => `${css}\nbody { min-width: 900px !important; }\n`);
    }
  },
  {
    name: 'runtime-exception',
    expected: 'Runtime errors',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => `${app}\nsetTimeout(() => { throw new Error('mutation-runtime-crash'); }, 0);\n`);
    }
  },
  {
    name: 'broken-ordinary-undo',
    expected: 'ordinary undo did not restore',
    apply(projectDir) {
      mutateFile(projectDir, 'js/app.js', (app) => replaceRequired(
        app,
        '        this.history = null;\n        this.render();',
        '        this.history = null;\n        this.grid = this.createEmptyGrid();\n        this.render();',
        this.name
      ));
    }
  }
]);

async function safeRemoveTemp(tempRoot, safePrefix) {
  const resolvedRoot = path.resolve(tempRoot);
  const resolvedPrefix = path.resolve(safePrefix);
  assert(
    resolvedRoot.startsWith(`${resolvedPrefix}${path.sep}`),
    `Refusing unsafe verifier cleanup: ${resolvedRoot}`
  );
  await fs.promises.rm(resolvedRoot, {
    force: true,
    maxRetries: 10,
    recursive: true,
    retryDelay: 100
  });
}

async function runMutationSuite() {
  const safePrefix = path.join(os.tmpdir(), 'dopabrain-2048-ad-policy');
  fs.mkdirSync(safePrefix, { recursive: true });
  const tempRoot = fs.mkdtempSync(`${safePrefix}${path.sep}`);
  const results = [];
  try {
    console.log('[RUN] baseline');
    const baselineResult = await verifyProject();
    results.push({ name: 'baseline', ok: true });
    console.log(
      `[PASS] baseline: ${baselineResult.source.locales} locales, ${baselineResult.runtime.viewports.length} viewports`
    );

    for (const mutation of MUTATIONS) {
      const fixture = path.join(tempRoot, mutation.name);
      copyFixture(DEFAULT_PROJECT_DIR, fixture);
      mutation.apply(fixture);
      console.log(`[RUN] ${mutation.name}`);
      try {
        await verifyProject({
          projectDir: fixture,
          viewports: [VIEWPORTS[0]]
        });
        results.push({ error: 'verifier incorrectly passed', name: mutation.name, ok: false });
        console.log(`[FAIL] ${mutation.name}: verifier incorrectly passed`);
      } catch (error) {
        const detected = error.message.includes(mutation.expected);
        results.push({
          error: detected ? undefined : error.message,
          name: mutation.name,
          ok: detected
        });
        console.log(`[${detected ? 'PASS' : 'FAIL'}] ${mutation.name}${detected ? '' : `: ${error.message}`}`);
      }
    }
  } finally {
    console.log('[RUN] cleanup');
    await safeRemoveTemp(tempRoot, safePrefix);
    console.log('[PASS] cleanup');
  }
  const failed = results.filter((result) => !result.ok);
  console.log(`\nMutation summary: ${results.length - failed.length}/${results.length} checks passed (${MUTATIONS.length} mutants)`);
  assert(failed.length === 0, `2048 ad-policy mutation failures: ${failed.map((item) => item.name).join(', ')}`);
}

function parseArgs(argv) {
  if (argv.length === 0) return { mutations: false };
  if (argv.length === 1 && argv[0] === '--mutations') return { mutations: true };
  if (argv.length === 1 && (argv[0] === '--help' || argv[0] === '-h')) {
    console.log(USAGE);
    process.exit(0);
  }
  throw new Error(`Unknown arguments: ${argv.join(' ')}\n${USAGE}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.mutations) {
    await runMutationSuite();
    return;
  }
  const result = await verifyProject();
  console.log(
    `[PASS] 2048 ad-policy baseline: ${result.source.locales} locales, ${result.source.officialGameAdsCalls} official GameAds calls, ${result.runtime.viewports.length} viewports, SW ${result.source.serviceWorkerCache}`
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  MUTATIONS,
  verifyProject,
  verifyRuntime,
  verifySource
};
