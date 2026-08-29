#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const WORKSPACE = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(WORKSPACE, 'projects');
const ARTICLE_PATH = path.join(
  PROJECTS_ROOT,
  'portal',
  'blog',
  'ko',
  'odyssey-spider-man-identity-reset-2026.html'
);
const ARTICLE_URL_PATH = '/portal/blog/ko/odyssey-spider-man-identity-reset-2026.html';
const LIVE_ORIGIN = 'https://dopabrain.com';
const CONTENT_SLUG = 'odyssey-spider-man-identity-reset-2026';
const COMMON_EVENT_PARAMS = Object.freeze({
  content_group: 'culture_signal',
  content_slug: CONTENT_SLUG,
  page_path: ARTICLE_URL_PATH,
  page_language: 'ko',
  transport_type: 'beacon'
});
const VIEWPORTS = Object.freeze([
  { name: 'mobile-pointer', width: 390, height: 844, choice: 'return', input: 'pointer' },
  { name: 'desktop-keyboard', width: 1440, height: 900, choice: 'reset', input: 'keyboard' }
]);
const TARGET_EVENT_NAMES = Object.freeze([
  'content_view',
  'content_choice_view',
  'content_choice_select',
  'content_cta_click',
  'content_share_click',
  'share'
]);
const USAGE = `Usage:
  node scripts/verify-culture-choice.js
  node scripts/verify-culture-choice.js --mutations
  node scripts/verify-culture-choice.js --url https://dopabrain.com${ARTICLE_URL_PATH}[?cachebuster=value]`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseLiveUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch (error) {
    throw new Error(`Invalid --url value: ${JSON.stringify(value)}\n${USAGE}`);
  }
  assert(parsed.protocol === 'https:', `--url must use HTTPS: ${parsed.href}\n${USAGE}`);
  assert(parsed.host === 'dopabrain.com', `--url host must be exactly dopabrain.com: ${parsed.host}\n${USAGE}`);
  assert(!parsed.username && !parsed.password, `--url must not contain credentials\n${USAGE}`);
  assert(
    parsed.pathname === ARTICLE_URL_PATH,
    `--url path must be exactly ${ARTICLE_URL_PATH}: ${parsed.pathname}\n${USAGE}`
  );
  assert(!parsed.hash, `--url must not contain a fragment\n${USAGE}`);
  return parsed.href;
}

function parseArgs(argv) {
  let mutations = false;
  let liveUrl = null;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--mutations') {
      assert(!mutations, `Duplicate --mutations argument\n${USAGE}`);
      mutations = true;
      continue;
    }
    if (argument === '--url') {
      assert(liveUrl === null, `Duplicate --url argument\n${USAGE}`);
      const value = argv[index + 1];
      assert(value && !value.startsWith('--'), `--url requires a value\n${USAGE}`);
      liveUrl = parseLiveUrl(value);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}\n${USAGE}`);
  }
  assert(!(mutations && liveUrl), `--url and --mutations cannot be used together\n${USAGE}`);
  return { mutations, liveUrl };
}

function navigationUrl(articleUrl, parameter, value) {
  const url = new URL(articleUrl);
  url.searchParams.set(parameter, value);
  return url.href;
}

function sortedKeys(value) {
  return Object.keys(value || {}).sort();
}

function assertExactParams(actual, expected, eventName) {
  const actualKeys = sortedKeys(actual);
  const expectedKeys = sortedKeys(expected);
  assert(
    JSON.stringify(actualKeys) === JSON.stringify(expectedKeys),
    `GA ${eventName} parameter keys mismatch: expected ${expectedKeys.join(', ')}, got ${actualKeys.join(', ')}`
  );
  for (const [key, value] of Object.entries(expected)) {
    assert(
      actual[key] === value,
      `GA ${eventName}.${key} mismatch: expected ${JSON.stringify(value)}, got ${JSON.stringify(actual[key])}`
    );
  }
}

function replaceRequired(html, pattern, replacement, mutationName) {
  const output = html.replace(pattern, replacement);
  assert(output !== html, `Mutation ${mutationName} did not change the in-memory HTML`);
  return output;
}

function collectSchemaTypes(value, types = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaTypes(item, types));
    return types;
  }
  if (!value || typeof value !== 'object') return types;
  const type = value['@type'];
  if (Array.isArray(type)) type.forEach((item) => types.push(String(item)));
  else if (type) types.push(String(type));
  Object.values(value).forEach((item) => collectSchemaTypes(item, types));
  return types;
}

function extractChoiceSection(html) {
  const idMatch = /\bid=["']return-reset-choice["']/i.exec(html);
  if (!idMatch) return '';
  const sectionStart = html.lastIndexOf('<section', idMatch.index);
  const sectionEnd = html.indexOf('</section>', idMatch.index);
  if (sectionStart < 0 || sectionEnd < 0) return '';
  return html.slice(sectionStart, sectionEnd + '</section>'.length);
}

function verifySource(html) {
  assert(/\bid=["']return-reset-choice["']/i.test(html), 'Missing #return-reset-choice card');

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert(duplicateIds.length === 0, `Duplicate DOM IDs: ${duplicateIds.join(', ')}`);

  const choiceSection = extractChoiceSection(html);
  assert(choiceSection, 'Could not isolate #return-reset-choice card');
  assert(
    !/(?:class=["'][^"']*adsbygoogle|data-ad-surface|data-ad-client|googlesyndication)/i.test(choiceSection),
    'Interaction contains an internal advertisement'
  );
  assert(
    !/(?:1[,.]?950|1950\s*(?:people|users|명)|(?:return|reset|귀환|리셋)\s*(?:유형)?\s*\d{1,3}%)/i.test(choiceSection),
    'Choice card contains fabricated popularity statistics'
  );
  assert(
    !/(?:\/portal\/js\/cross-promo\.js|\bcp-sticky-sprint\b)/i.test(html),
    'Article re-enabled the generic cross-promo/sticky sprint'
  );

  const schemaBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match, index) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        throw new Error(`Invalid JSON-LD block ${index + 1}: ${error.message}`);
      }
    });
  const topLevelTypes = schemaBlocks.map((block) => block['@type']);
  assert(topLevelTypes.filter((type) => type === 'Article').length === 1, 'Expected exactly one Article JSON-LD block');
  assert(topLevelTypes.filter((type) => type === 'BreadcrumbList').length === 1, 'Expected exactly one BreadcrumbList JSON-LD block');
  const unsupportedTopLevelTypes = topLevelTypes.filter((type) => !['Article', 'BreadcrumbList', 'FAQPage'].includes(type));
  assert(
    unsupportedTopLevelTypes.length === 0,
    `Unexpected top-level JSON-LD types: ${unsupportedTopLevelTypes.join(', ')}`
  );
  const allSchemaTypes = collectSchemaTypes(schemaBlocks);
  assert(!allSchemaTypes.includes('Quiz'), 'Quiz schema must not be used for the editorial choice card');
  assert(!allSchemaTypes.includes('AggregateRating'), 'AggregateRating schema is not supported by real data');
}

function safeResolve(requestPath) {
  const relativePath = requestPath.replace(/^\/+/, '');
  const target = path.resolve(PROJECTS_ROOT, relativePath);
  const rootWithSeparator = `${path.resolve(PROJECTS_ROOT)}${path.sep}`.toLowerCase();
  assert(target.toLowerCase().startsWith(rootWithSeparator), `Unsafe static path: ${requestPath}`);
  return target;
}

function startServer(getArticleHtml) {
  const mimeTypes = {
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
    '.webp': 'image/webp'
  };
  const server = http.createServer((request, response) => {
    try {
      const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
      if (requestPath === ARTICLE_URL_PATH) {
        response.writeHead(200, {
          'Cache-Control': 'no-store',
          'Content-Type': 'text/html; charset=utf-8'
        });
        response.end(getArticleHtml());
        return;
      }
      let target = safeResolve(requestPath);
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

  return listenOnSafePort(server).then((address) => ({ server, port: address.port }));
}

async function fetchLiveHtml(articleUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(articleUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Cache-Control': 'no-cache',
        'User-Agent': 'DopaBrain-Culture-Choice-Verifier/1.0'
      },
      redirect: 'manual',
      signal: controller.signal
    });
  } catch (error) {
    if (error && error.name === 'AbortError') throw new Error(`Timed out fetching live article: ${articleUrl}`);
    throw new Error(`Could not fetch live article ${articleUrl}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
  assert(response.status === 200, `Live article returned HTTP ${response.status}: ${articleUrl}`);
  const contentType = response.headers.get('content-type') || '';
  assert(/text\/html/i.test(contentType), `Live article returned non-HTML content type: ${contentType || '(missing)'}`);
  const responseUrl = new URL(response.url || articleUrl);
  assert(
    responseUrl.origin === LIVE_ORIGIN && responseUrl.pathname === ARTICLE_URL_PATH,
    `Live article response escaped the allowed URL: ${responseUrl.href}`
  );
  return response.text();
}

function isAllowedPageRequest(requestUrl, resourceType, articleUrl) {
  const allowedOrigin = new URL(articleUrl).origin;
  return (
    requestUrl.origin === allowedOrigin
    && (resourceType !== 'document' || requestUrl.pathname === ARTICLE_URL_PATH)
  );
}

function verifyNetworkIsolationPolicy(articleUrl) {
  const origin = new URL(articleUrl).origin;
  assert(
    isAllowedPageRequest(new URL(`${origin}${ARTICLE_URL_PATH}`), 'document', articleUrl),
    'Network policy rejected the article document'
  );
  assert(
    isAllowedPageRequest(new URL(`${origin}/portal/css/blog.css`), 'stylesheet', articleUrl),
    'Network policy rejected a same-origin asset'
  );
  assert(
    !isAllowedPageRequest(new URL('http://127.0.0.1:9/probe'), 'fetch', articleUrl),
    'Network policy allowed another local HTTP origin'
  );
  assert(
    !isAllowedPageRequest(new URL('https://example.com/probe'), 'fetch', articleUrl),
    'Network policy allowed an external HTTPS origin'
  );
  assert(
    !isAllowedPageRequest(new URL(`${origin}/portal/`), 'document', articleUrl),
    'Network policy allowed a different same-origin document'
  );
}

async function isolatePageNetwork(page, articleUrl) {
  await page.route('**/*', async (route) => {
    const request = route.request();
    let requestUrl;
    try {
      requestUrl = new URL(request.url());
    } catch (error) {
      await route.abort('blockedbyclient');
      return;
    }

    if (!isAllowedPageRequest(requestUrl, request.resourceType(), articleUrl)) {
      await route.abort('blockedbyclient');
      return;
    }
    await route.continue();
  });
  await page.routeWebSocket(/.*/, async (webSocketRoute) => {
    await webSocketRoute.close({ code: 1008, reason: 'Blocked by culture-choice verifier' });
  });
}

function startNetworkProbeServer() {
  let httpHits = 0;
  let webSocketUpgradeHits = 0;
  const server = http.createServer((_request, response) => {
    httpHits += 1;
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    });
    response.end();
  });
  server.on('upgrade', (_request, socket) => {
    webSocketUpgradeHits += 1;
    socket.destroy();
  });

  return listenOnSafePort(server).then((address) => ({
        getHttpHits: () => httpHits,
        getWebSocketUpgradeHits: () => webSocketUpgradeHits,
        httpUrl: `http://127.0.0.1:${address.port}/external-http-probe`,
        server,
        webSocketUrl: `ws://127.0.0.1:${address.port}/external-websocket-probe`
      }));
}

async function verifyRuntimeNetworkIsolation(browser, articleUrl) {
  const probe = await startNetworkProbeServer();
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  await isolatePageNetwork(page, articleUrl);
  await page.addInitScript(installAnalyticsIsolation);
  try {
    await page.goto(navigationUrl(articleUrl, 'verifyNetworkIsolation', '1'), { waitUntil: 'domcontentloaded' });
    await page.evaluate(async (httpUrl) => {
      try {
        await fetch(httpUrl);
      } catch (error) {}
    }, probe.httpUrl);
    await page.evaluate((webSocketUrl) => {
      window.__cultureVerifierWebSocketProbe = new WebSocket(webSocketUrl);
    }, probe.webSocketUrl);
    await page.waitForFunction(
      () => window.__cultureVerifierWebSocketProbe.readyState === WebSocket.CLOSED,
      null,
      { timeout: 2000 }
    );
    await page.waitForTimeout(50);
    assert(probe.getHttpHits() === 0, `Network isolation leaked ${probe.getHttpHits()} external HTTP request(s)`);
    assert(
      probe.getWebSocketUpgradeHits() === 0,
      `Network isolation leaked ${probe.getWebSocketUpgradeHits()} external WebSocket upgrade(s)`
    );
  } finally {
    await context.close();
    await new Promise((resolve) => probe.server.close(resolve));
  }
}

function installAnalyticsIsolation() {
  window.dataLayer = [];
  window.adsbygoogle = [];
  try {
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: () => true
    });
  } catch (error) {}
}

async function readEvents(page) {
  return page.evaluate(() => {
    return (window.dataLayer || [])
      .map((entry) => Array.from(entry || []))
      .filter((entry) => entry[0] === 'event')
      .map((entry) => ({
        name: entry[1],
        params: JSON.parse(JSON.stringify(entry[2] || {}))
      }));
  });
}

async function waitForEventCount(page, eventName, count) {
  try {
    await page.waitForFunction(
      ({ name, expected }) => (window.dataLayer || []).filter((entry) => entry && entry[0] === 'event' && entry[1] === name).length >= expected,
      { name: eventName, expected: count },
      { timeout: 2500 }
    );
  } catch (error) {
    const events = await readEvents(page);
    const actual = events.filter((event) => event.name === eventName).length;
    throw new Error(`Missing GA event: ${eventName}; expected ${count}, got ${actual}`);
  }
}

function oneEvent(events, eventName) {
  const matching = events.filter((event) => event.name === eventName);
  assert(matching.length === 1, `GA ${eventName} count mismatch: expected 1, got ${matching.length}`);
  return matching[0];
}

async function assertNoOverflow(page, viewportName) {
  const overflow = await page.evaluate(() => ({
    body: Math.max(0, document.body.scrollWidth - window.innerWidth),
    document: Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
  }));
  assert(
    overflow.body <= 1 && overflow.document <= 1,
    `${viewportName} horizontal overflow: body=${overflow.body}px, document=${overflow.document}px`
  );
}

async function assertTargetSize(locator, label) {
  const box = await locator.boundingBox();
  assert(box, `${label} has no visible target box`);
  assert(
    box.width >= 44 && box.height >= 44,
    `${label} violates 44px target: ${box.width.toFixed(1)}x${box.height.toFixed(1)}`
  );
}

async function verifyViewport(browser, articleUrl, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: 'ko-KR',
    serviceWorkers: 'block'
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await isolatePageNetwork(page, articleUrl);
  await page.addInitScript(installAnalyticsIsolation);
  await page.addInitScript(() => {
    window.__cultureShareCalls = [];
    window.__shareIntentCountsAtCall = [];
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (payload) => {
        window.__shareIntentCountsAtCall.push(
          (window.dataLayer || []).filter((entry) => entry && entry[0] === 'event' && entry[1] === 'content_share_click').length
        );
        window.__cultureShareCalls.push(JSON.parse(JSON.stringify(payload || {})));
      }
    });
    try { sessionStorage.setItem('dopabrain_sticky_sprint_dismissed', '0'); } catch (error) {}
  });

  try {
    await page.goto(navigationUrl(articleUrl, 'verifyCultureChoice', viewport.name), { waitUntil: 'domcontentloaded' });
    const card = page.locator('#return-reset-choice');
    assert(await card.count() === 1, 'Missing or duplicate #return-reset-choice card');

    const duplicateIds = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    });
    assert(duplicateIds.length === 0, `Duplicate DOM IDs: ${duplicateIds.join(', ')}`);

    const aria = await card.evaluate((element) => {
      const fieldset = element.querySelector('fieldset');
      const legend = fieldset && fieldset.querySelector(':scope > legend');
      const result = element.querySelector('[data-choice-result]');
      const summary = element.querySelector('[data-choice-summary]');
      const shareStatus = element.querySelector('[data-share-status]');
      const labelledBy = element.getAttribute('aria-labelledby');
      return {
        fieldset: Boolean(fieldset),
        legend: legend ? legend.textContent.trim() : '',
        labelledBy,
        labelTargetExists: Boolean(labelledBy && document.getElementById(labelledBy)),
        summaryExists: Boolean(summary),
        summaryRole: summary ? summary.getAttribute('role') : null,
        summaryLive: summary ? summary.getAttribute('aria-live') : null,
        shareRole: shareStatus ? shareStatus.getAttribute('role') : null,
        shareLive: shareStatus ? shareStatus.getAttribute('aria-live') : null
      };
    });
    assert(aria.fieldset && aria.legend, 'Choice controls require a fieldset with a visible legend');
    assert(aria.labelledBy && aria.labelTargetExists, 'Choice card aria-labelledby must resolve to a heading');
    assert(aria.summaryExists, 'Missing [data-choice-summary]');
    assert(aria.summaryRole === 'status' && aria.summaryLive === 'polite', '[data-choice-summary] must be a polite status region');
    assert(aria.shareRole === 'status' && aria.shareLive === 'polite', '[data-share-status] must be a polite status region');

    const radios = card.locator('input[type="radio"]');
    assert(await radios.count() === 2, `Expected two choice radios, got ${await radios.count()}`);
    const radioContract = await radios.evaluateAll((elements) => elements.map((element) => ({
      id: element.id,
      name: element.name,
      value: element.value,
      checked: element.checked,
      labelCount: element.labels ? element.labels.length : 0
    })));
    assert(
      JSON.stringify(radioContract.map((radio) => radio.value).sort()) === JSON.stringify(['reset', 'return']),
      `Radio values must be return/reset, got ${radioContract.map((radio) => radio.value).join(', ')}`
    );
    assert(radioContract.every((radio) => radio.name), 'Every radio needs a non-empty group name');
    assert(new Set(radioContract.map((radio) => radio.name)).size === 1, 'Choice radios must share one group name');
    assert(radioContract.every((radio) => radio.labelCount === 1), 'Every radio needs exactly one associated label');
    assert(radioContract.every((radio) => !radio.checked), 'No choice may be preselected');

    const choiceStates = card.locator('[data-choice-state]');
    assert(await choiceStates.count() === 2, `Expected two non-color choice state markers, got ${await choiceStates.count()}`);
    const choiceStateContract = await choiceStates.evaluateAll((elements) => elements.map((element) => ({
      text: element.textContent.trim(),
      ariaHidden: element.getAttribute('aria-hidden'),
      visible: Boolean(element.getClientRects().length) && getComputedStyle(element).visibility !== 'hidden'
    })));
    assert(choiceStateContract.every((state) => /✓/.test(state.text) && /선택됨/.test(state.text)), 'Choice state markers need visible check and “선택됨” text');
    assert(choiceStateContract.every((state) => state.ariaHidden === 'true'), 'Visual choice state markers must not duplicate the native radio announcement');
    assert(choiceStateContract.every((state) => !state.visible), 'No “선택됨” marker may be visible before selection');

    const result = card.locator('[data-choice-result]');
    const summary = card.locator('[data-choice-summary]');
    const cta = card.locator('.culture-choice-cta');
    const share = card.locator('[data-choice-share]');
    const shareStatus = card.locator('[data-share-status]');
    for (const [name, locator] of [['result', result], ['summary', summary], ['CTA', cta], ['share', share], ['share status', shareStatus]]) {
      assert(await locator.count() === 1, `Expected one ${name} element, got ${await locator.count()}`);
    }
    assert(await result.getAttribute('hidden') !== null && !(await result.isVisible()), 'Choice result must be hidden before selection');
    assert((await summary.textContent() || '').trim() === '', 'Choice summary must be empty before selection');
    assert(!(await cta.isVisible()) && !(await share.isVisible()), 'Result CTA/share must be hidden before selection');
    assert((await shareStatus.textContent() || '').trim() === '', 'Share status must be empty before sharing');
    assert(await card.locator('[data-ad-surface], .adsbygoogle, [data-ad-client]').count() === 0, 'Interaction contains an internal advertisement');

    await card.scrollIntoViewIfNeeded();
    await waitForEventCount(page, 'content_choice_view', 1);
    for (const radio of radioContract) {
      const radioInput = card.locator(`input[type="radio"][value="${radio.value}"]`);
      const radioLabel = radioInput.locator('xpath=ancestor::label[1]');
      assert(await radioLabel.count() === 1, `Missing wrapping label for ${radio.value}`);
      await assertTargetSize(radioLabel, `${viewport.name} ${radio.value} choice`);
    }
    await assertNoOverflow(page, viewport.name);
    assert(await page.locator('.cp-sticky-sprint').count() === 0, 'Generic .cp-sticky-sprint appeared at runtime');

    const chosenRadio = card.locator(`input[type="radio"][value="${viewport.choice}"]`);
    const chosenLabel = chosenRadio.locator('xpath=ancestor::label[1]');
    const choiceLabel = (await chosenLabel.innerText()).trim();
    assert(choiceLabel, `Missing visible label for ${viewport.choice}`);
    if (viewport.input === 'pointer') {
      await chosenLabel.click();
    } else {
      await chosenRadio.focus();
      assert(await chosenRadio.evaluate((element) => document.activeElement === element), 'Keyboard radio could not receive focus');
      await page.keyboard.press('Space');
    }
    await waitForEventCount(page, 'content_choice_select', 1);

    assert(await chosenRadio.isChecked(), `${viewport.choice} radio was not selected by ${viewport.input}`);
    const chosenState = chosenLabel.locator('[data-choice-state]');
    assert(await chosenState.count() === 1 && await chosenState.isVisible(), 'Selected choice lacks a visible non-color “✓ 선택됨” marker');
    const unselectedState = card.locator(`input[type="radio"]:not([value="${viewport.choice}"])`).locator('xpath=ancestor::label[1]').locator('[data-choice-state]');
    assert(await unselectedState.count() === 1 && !(await unselectedState.isVisible()), 'Unselected choice incorrectly shows the “선택됨” marker');
    assert(await result.isVisible() && await result.getAttribute('hidden') === null, 'Choice result did not become visible');
    const summaryText = (await summary.innerText()).trim();
    assert(summaryText.length >= 20, `Choice summary is too thin: ${summaryText.length} characters`);
    assert(await cta.isVisible() && await share.isVisible(), 'Result CTA/share did not become visible');
    await assertTargetSize(cta, `${viewport.name} result CTA`);
    await assertTargetSize(share, `${viewport.name} share button`);

    const ctaHref = await cta.getAttribute('href');
    assert(ctaHref, 'Choice CTA is missing href');
    const ctaUrl = new URL(ctaHref, 'https://dopabrain.com/');
    assert(ctaUrl.origin === 'https://dopabrain.com' && ctaUrl.pathname === '/brain-type/', `Choice CTA route mismatch: ${ctaUrl.href}`);
    const expectedSurface = `odyssey_spiderman_choice_${viewport.choice}`;
    for (const [key, expected] of [
      ['lang', 'ko'],
      ['start', '1'],
      ['branch', viewport.choice],
      ['surface', expectedSurface]
    ]) {
      assert(ctaUrl.searchParams.get(key) === expected, `Choice CTA ${key} mismatch: expected ${expected}, got ${ctaUrl.searchParams.get(key)}`);
      assert(ctaUrl.searchParams.getAll(key).length === 1, `Choice CTA ${key} must appear exactly once`);
    }
    assert(await cta.getAttribute('data-content-surface') === expectedSurface, 'Choice CTA data-content-surface is not branch-specific');
    assert(await cta.getAttribute('data-target-slug') === 'brain-type', 'Choice CTA target slug mismatch');

    await page.evaluate(() => {
      document.addEventListener('click', (event) => {
        if (event.target.closest('.culture-choice-cta')) event.preventDefault();
      }, { capture: true, once: true });
    });
    await cta.click();
    await waitForEventCount(page, 'content_cta_click', 1);
    await share.click();
    await waitForEventCount(page, 'content_share_click', 1);
    await waitForEventCount(page, 'share', 1);

    const shareCalls = await page.evaluate(() => window.__cultureShareCalls || []);
    assert(shareCalls.length === 1, `Web Share API call count mismatch: expected 1, got ${shareCalls.length}`);
    const intentCountsAtCall = await page.evaluate(() => window.__shareIntentCountsAtCall || []);
    assert(JSON.stringify(intentCountsAtCall) === JSON.stringify([1]), `content_share_click must be recorded before the share API call, got ${JSON.stringify(intentCountsAtCall)}`);
    assert(
      typeof shareCalls[0].title === 'string' && shareCalls[0].title.trim() &&
      typeof shareCalls[0].text === 'string' && shareCalls[0].text.trim() &&
      typeof shareCalls[0].url === 'string' && shareCalls[0].url.trim(),
      'Web Share payload requires non-empty title, text, and url'
    );
    assert((await shareStatus.innerText()).trim(), 'Share status did not announce success');

    const events = await readEvents(page);
    const contentView = oneEvent(events, 'content_view');
    const choiceView = oneEvent(events, 'content_choice_view');
    const choiceSelect = oneEvent(events, 'content_choice_select');
    const ctaClick = oneEvent(events, 'content_cta_click');
    const shareClick = oneEvent(events, 'content_share_click');
    const shareEvent = oneEvent(events, 'share');
    assert(events.filter((event) => event.name === 'choice_cta_click').length === 0, 'Do not create a choice_cta_click event; reuse content_cta_click');

    assertExactParams(contentView.params, {
      ...COMMON_EVENT_PARAMS,
      content_type: 'blog'
    }, contentView.name);
    assertExactParams(choiceView.params, {
      ...COMMON_EVENT_PARAMS,
      interaction_name: 'return_reset',
      interaction_surface: 'culture_story_fork',
      choice_count: 2
    }, choiceView.name);
    assertExactParams(choiceSelect.params, {
      ...COMMON_EVENT_PARAMS,
      interaction_name: 'return_reset',
      interaction_surface: 'culture_story_fork',
      choice_id: viewport.choice,
      choice_label: choiceLabel
    }, choiceSelect.name);
    assertExactParams(ctaClick.params, {
      ...COMMON_EVENT_PARAMS,
      target_url: ctaHref,
      target_label: (await cta.innerText()).trim(),
      cta_surface: expectedSurface,
      target_slug: 'brain-type',
      choice_id: viewport.choice
    }, ctaClick.name);
    assertExactParams(shareClick.params, {
      ...COMMON_EVENT_PARAMS,
      choice_id: viewport.choice,
      method: 'web_share',
      share_surface: 'culture_choice_result'
    }, shareClick.name);
    assertExactParams(shareEvent.params, {
      ...COMMON_EVENT_PARAMS,
      method: 'web_share',
      content_type: 'culture_signal_choice',
      item_id: CONTENT_SLUG,
      choice_id: viewport.choice
    }, shareEvent.name);

    const eventOrder = TARGET_EVENT_NAMES.map((name) => events.findIndex((event) => event.name === name));
    assert(eventOrder.every((index) => index >= 0), `Missing target event in order check: ${eventOrder.join(', ')}`);
    assert(eventOrder.every((index, position) => position === 0 || eventOrder[position - 1] < index), `Target GA event order mismatch: ${eventOrder.join(', ')}`);
    await assertNoOverflow(page, viewport.name);
    assert(await page.locator('.cp-sticky-sprint').count() === 0, 'Generic .cp-sticky-sprint appeared after interaction');
    assert(runtimeErrors.length === 0, `Runtime errors: ${runtimeErrors.join(' | ')}`);

    return {
      viewport: viewport.name,
      choice: viewport.choice,
      input: viewport.input,
      summary: summaryText,
      targetEvents: Object.fromEntries(TARGET_EVENT_NAMES.map((name) => [name, events.filter((event) => event.name === name).length]))
    };
  } finally {
    await context.close();
  }
}

const SHARE_OUTCOME_SCENARIOS = Object.freeze([
  { name: 'native-pending', api: 'native', outcome: 'pending', method: 'web_share', expectedShareCount: 0 },
  { name: 'native-cancel', api: 'native', outcome: 'cancel', method: 'web_share', expectedShareCount: 0 },
  { name: 'native-failure', api: 'native', outcome: 'failure', method: 'web_share', expectedShareCount: 0 },
  { name: 'clipboard-success', api: 'clipboard', outcome: 'success', method: 'clipboard', expectedShareCount: 1 },
  { name: 'clipboard-failure', api: 'clipboard', outcome: 'failure', method: 'clipboard', expectedShareCount: 0 }
]);

async function verifyShareOutcome(browser, articleUrl, scenario) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: 'ko-KR',
    serviceWorkers: 'block'
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await isolatePageNetwork(page, articleUrl);
  await page.addInitScript(installAnalyticsIsolation);
  await page.addInitScript(({ api, outcome }) => {
    window.__cultureShareCalls = [];
    window.__shareIntentCountsAtCall = [];
    const invoke = (payload) => {
      window.__shareIntentCountsAtCall.push(
        (window.dataLayer || []).filter((entry) => entry && entry[0] === 'event' && entry[1] === 'content_share_click').length
      );
      window.__cultureShareCalls.push(typeof payload === 'string' ? payload : JSON.parse(JSON.stringify(payload || {})));
      if (outcome === 'pending') return new Promise(() => {});
      if (outcome === 'cancel') return Promise.reject(new DOMException('share cancelled', 'AbortError'));
      if (outcome === 'failure') return Promise.reject(new Error('share API failed'));
      return Promise.resolve();
    };
    if (api === 'native') {
      Object.defineProperty(navigator, 'share', { configurable: true, value: invoke });
    } else {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: invoke }
      });
    }
  }, scenario);

  try {
    await page.goto(navigationUrl(articleUrl, 'verifyShareOutcome', scenario.name), { waitUntil: 'domcontentloaded' });
    const card = page.locator('#return-reset-choice');
    await card.scrollIntoViewIfNeeded();
    const radio = card.locator('input[type="radio"][value="return"]');
    await radio.locator('xpath=ancestor::label[1]').click();
    await waitForEventCount(page, 'content_choice_select', 1);
    const shareButton = card.locator('[data-choice-share]');
    await shareButton.click();
    await waitForEventCount(page, 'content_share_click', 1);
    await page.waitForFunction(() => (window.__cultureShareCalls || []).length === 1, null, { timeout: 1000 });

    if (scenario.expectedShareCount === 1) {
      await waitForEventCount(page, 'share', 1);
    } else {
      await page.waitForTimeout(120);
    }

    const events = await readEvents(page);
    const clickEvents = events.filter((event) => event.name === 'content_share_click');
    const shareEvents = events.filter((event) => event.name === 'share');
    assert(clickEvents.length === 1, `${scenario.name}: content_share_click count mismatch: expected 1, got ${clickEvents.length}`);
    assert(shareEvents.length === scenario.expectedShareCount, `${scenario.name}: share count mismatch: expected ${scenario.expectedShareCount}, got ${shareEvents.length}`);
    assertExactParams(clickEvents[0].params, {
      ...COMMON_EVENT_PARAMS,
      choice_id: 'return',
      method: scenario.method,
      share_surface: 'culture_choice_result'
    }, `${scenario.name}.content_share_click`);
    if (scenario.expectedShareCount === 1) {
      assertExactParams(shareEvents[0].params, {
        ...COMMON_EVENT_PARAMS,
        method: scenario.method,
        content_type: 'culture_signal_choice',
        item_id: CONTENT_SLUG,
        choice_id: 'return'
      }, `${scenario.name}.share`);
    }

    const intentCountsAtCall = await page.evaluate(() => window.__shareIntentCountsAtCall || []);
    assert(JSON.stringify(intentCountsAtCall) === JSON.stringify([1]), `${scenario.name}: content_share_click was not recorded immediately before the API call`);
    if (scenario.outcome !== 'pending') {
      const status = (await card.locator('[data-share-status]').innerText()).trim();
      assert(status, `${scenario.name}: share outcome was not announced in the status region`);
    }
    assert(runtimeErrors.length === 0, `${scenario.name}: runtime errors: ${runtimeErrors.join(' | ')}`);
    return {
      name: scenario.name,
      clickCount: clickEvents.length,
      shareCount: shareEvents.length,
      method: scenario.method
    };
  } finally {
    await context.close();
  }
}

async function verifyHtml(browser, articleUrl, html, viewports = VIEWPORTS, runShareOutcomeScenarios = true) {
  verifySource(html);
  const journeys = [];
  for (const viewport of viewports) journeys.push(await verifyViewport(browser, articleUrl, viewport));
  if (journeys.length > 1) {
    assert(new Set(journeys.map((result) => result.summary)).size === journeys.length, 'Return/reset choices rendered the same summary');
  }
  const shareOutcomes = [];
  if (runShareOutcomeScenarios) {
    for (const scenario of SHARE_OUTCOME_SCENARIOS) {
      shareOutcomes.push(await verifyShareOutcome(browser, articleUrl, scenario));
    }
  }
  return { journeys, shareOutcomes };
}

function buildMutations(baseline) {
  return [
    {
      name: 'choice-card-removed',
      expected: 'Missing #return-reset-choice',
      html: replaceRequired(baseline, /\bid=["']return-reset-choice["']/i, 'id="return-reset-choice-removed"', 'choice-card-removed')
    },
    {
      name: 'duplicate-id',
      expected: 'Duplicate DOM IDs',
      html: replaceRequired(baseline, /<legend\b/i, '<legend id="return-reset-choice"', 'duplicate-id')
    },
    {
      name: 'selection-event-removed',
      expected: 'Missing GA event: content_choice_select',
      html: replaceRequired(
        baseline,
        /(trackContentEvent\(\s*["'])content_choice_select(["'])/,
        '$1content_choice_select_removed$2',
        'selection-event-removed'
      )
    },
    {
      name: 'selection-param-removed',
      expected: 'GA content_choice_select parameter keys mismatch',
      html: replaceRequired(baseline, /\bchoice_label\s*:/, 'choice_label_removed:', 'selection-param-removed')
    },
    {
      name: 'non-color-selection-state-removed',
      expected: 'Expected two non-color choice state markers',
      html: replaceRequired(baseline, /data-choice-state/g, 'data-choice-state-removed', 'non-color-selection-state-removed')
    },
    {
      name: 'cta-query-damaged',
      expected: 'Choice CTA lang mismatch',
      html: replaceRequired(baseline, /lang=ko/g, 'lang=en', 'cta-query-damaged')
    },
    {
      name: 'target-shrunk-to-32px',
      expected: 'violates 44px target',
      html: replaceRequired(
        baseline,
        /<\/head>/i,
        '<style>#return-reset-choice label,#return-reset-choice button,#return-reset-choice a{height:32px!important;min-height:32px!important;max-height:32px!important;padding-top:0!important;padding-bottom:0!important}</style>\n</head>',
        'target-shrunk-to-32px'
      )
    },
    {
      name: 'share-status-a11y-removed',
      expected: '[data-share-status] must be a polite status region',
      html: replaceRequired(
        baseline,
        /(<[^>]*data-share-status[^>]*?)\s+role=["']status["']/i,
        '$1',
        'share-status-a11y-removed'
      )
    },
    {
      name: 'fabricated-popularity',
      expected: 'fabricated popularity statistics',
      html: replaceRequired(
        baseline,
        /(\bid=["']return-reset-choice["'][^>]*>)/i,
        '$1<p>1,950 people chose this today.</p>',
        'fabricated-popularity'
      )
    },
    {
      name: 'fake-aggregate-rating-schema',
      expected: 'Unexpected top-level JSON-LD types',
      html: replaceRequired(
        baseline,
        /<\/head>/i,
        '<script type="application/ld+json">{"@context":"https://schema.org","@type":"AggregateRating","ratingValue":"4.9","ratingCount":"1950"}</script>\n</head>',
        'fake-aggregate-rating-schema'
      )
    },
    {
      name: 'interaction-internal-ad',
      expected: 'internal advertisement',
      html: replaceRequired(
        baseline,
        /(\bid=["']return-reset-choice["'][^>]*>)/i,
        '$1<ins class="adsbygoogle" data-ad-client="ca-pub-test"></ins>',
        'interaction-internal-ad'
      )
    },
    {
      name: 'generic-crosspromo-reactivated',
      expected: 'generic cross-promo/sticky sprint',
      html: replaceRequired(
        baseline,
        /<\/body>/i,
        '<script src="/portal/js/cross-promo.js" defer></script>\n</body>',
        'generic-crosspromo-reactivated'
      )
    }
  ];
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  let baseline;
  let activeHtml;
  let articleUrl;
  let networkMode;
  let serverHandle = null;
  let browser = null;

  try {
    if (options.liveUrl) {
      console.log(`[RUN] fetch live culture choice ${options.liveUrl}`);
      baseline = await fetchLiveHtml(options.liveUrl);
      activeHtml = baseline;
      articleUrl = options.liveUrl;
      networkMode = 'live';
    } else {
      baseline = fs.readFileSync(ARTICLE_PATH, 'utf8');
      activeHtml = baseline;
      serverHandle = await startServer(() => activeHtml);
      articleUrl = `http://127.0.0.1:${serverHandle.port}${ARTICLE_URL_PATH}`;
      networkMode = 'local';
    }

    browser = await chromium.launch({ headless: true });
    verifyNetworkIsolationPolicy(articleUrl);
    await verifyRuntimeNetworkIsolation(browser, articleUrl);
    console.log('[PASS] HTTP and WebSocket network isolation');
    console.log(`[RUN] culture choice ${networkMode} baseline`);
    const baselineResults = await verifyHtml(browser, articleUrl, baseline, VIEWPORTS, true);
    baselineResults.journeys.forEach((result) => {
      console.log(`[PASS] ${result.viewport}: ${result.input} selected ${result.choice}; events=${JSON.stringify(result.targetEvents)}`);
    });
    baselineResults.shareOutcomes.forEach((result) => {
      console.log(`[PASS] ${result.name}: content_share_click=${result.clickCount}, share=${result.shareCount}, method=${result.method}`);
    });

    if (options.mutations) {
      const mutationResults = [];
      for (const mutation of buildMutations(baseline)) {
        activeHtml = mutation.html;
        console.log(`[RUN] mutation ${mutation.name}`);
        try {
          await verifyHtml(browser, articleUrl, activeHtml, [VIEWPORTS[0]], false);
          mutationResults.push({ name: mutation.name, ok: false, error: 'verifier incorrectly passed' });
        } catch (error) {
          mutationResults.push({
            name: mutation.name,
            ok: error.message.includes(mutation.expected),
            error: error.message
          });
        }
      }
      activeHtml = baseline;
      mutationResults.forEach((result) => console.log(`[${result.ok ? 'PASS' : 'FAIL'}] ${result.name}: ${result.error}`));
      const escaped = mutationResults.filter((result) => !result.ok);
      console.log(`Mutation summary: ${mutationResults.length - escaped.length}/${mutationResults.length} detected`);
      assert(escaped.length === 0, `${escaped.length} culture-choice mutation(s) escaped or failed for the wrong reason`);
    }
  } finally {
    if (browser) await browser.close();
    if (serverHandle) await new Promise((resolve) => serverHandle.server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
