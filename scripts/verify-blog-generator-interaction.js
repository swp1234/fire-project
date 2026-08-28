#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { renderArticle, validateSpec } = require('./create-blog-article');

const WORKSPACE = path.resolve(__dirname, '..');
const SPEC_PATH = path.join(WORKSPACE, 'scripts', 'specs', 'trend-odyssey-spiderman-ko.json');
const ROUTE = '/portal/blog/ko/odyssey-spider-man-identity-reset-2026.html';
const TEMP_PREFIX = path.join(os.tmpdir(), 'dopabrain-blog-generator-');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadSpec() {
  return JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
}

function eventList(page) {
  return page.evaluate(() => (window.dataLayer || [])
    .map((entry) => Array.from(entry || []))
    .filter((entry) => entry[0] === 'event')
    .map((entry) => ({ name: entry[1], params: JSON.parse(JSON.stringify(entry[2] || {})) })));
}

async function waitForEvent(page, name, count = 1) {
  await page.waitForFunction(
    ({ eventName, expected }) => (window.dataLayer || [])
      .filter((entry) => entry && entry[0] === 'event' && entry[1] === eventName).length >= expected,
    { eventName: name, expected: count },
    { timeout: 3000 }
  );
}

function eventByName(events, name) {
  const matches = events.filter((event) => event.name === name);
  assert(matches.length === 1, `${name} expected once, got ${matches.length}`);
  return matches[0];
}

function createServer(articlePath) {
  return http.createServer((request, response) => {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname;
    if (pathname !== ROUTE) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not Found');
      return;
    }
    response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(articlePath).pipe(response);
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve(server.address().port);
    });
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

function removeTemporaryOutput(tempRoot, articlePath) {
  const resolvedRoot = path.resolve(tempRoot);
  assert(resolvedRoot.startsWith(path.resolve(TEMP_PREFIX)), `Refusing unsafe cleanup: ${tempRoot}`);
  const expectedArticle = path.join(resolvedRoot, 'portal', 'blog', 'ko', path.basename(articlePath));
  assert(path.resolve(articlePath) === expectedArticle, `Unexpected temporary article path: ${articlePath}`);
  fs.unlinkSync(expectedArticle);
  for (const directory of [
    path.dirname(expectedArticle),
    path.join(resolvedRoot, 'portal', 'blog'),
    path.join(resolvedRoot, 'portal'),
    resolvedRoot,
  ]) fs.rmdirSync(directory);
}

function assertGeneratedSource(html, spec) {
  const interaction = spec.interaction;
  assert(html.includes(`id="${interaction.id}"`), 'Generated interaction ID is missing');
  assert((html.match(/<input\b[^>]*\btype="radio"/g) || []).length === 2, 'Generated interaction must contain exactly two radios');
  assert(html.includes('<fieldset') && html.includes('<legend class="sr-only">'), 'Generated fieldset/legend contract is missing');
  assert(html.includes('data-choice-result') && html.includes('data-choice-share'), 'Generated result/share controls are missing');
  assert(html.includes('content_choice_view') && html.includes('content_choice_select'), 'Generated choice events are missing');
  assert(html.includes('content_share_click') && html.includes("trackContentEvent('share'"), 'Generated share events are missing');
  assert(!html.includes('/portal/js/cross-promo.js'), 'Interaction output must suppress generic cross-promo');
  assert(!html.includes(`<h2>${interaction.replaceSectionHeading}</h2>`), 'Replacement section was not replaced by the interaction');
  assert(html.includes('trackShareIntent(method);') && html.indexOf('trackShareIntent(method);') < html.indexOf('await navigator.share'), 'Share intent must be tracked before native sharing');
  assert(html.includes('culture-choice-selected'), 'Generated selected state needs a non-color visual marker');
}

function runValidationCases(sourceSpec) {
  const cases = [
    {
      name: 'missing-title', expected: 'interaction.title is required',
      mutate(spec) { delete spec.interaction.title; },
    },
    {
      name: 'one-choice', expected: 'exactly two choices',
      mutate(spec) { spec.interaction.choices.pop(); },
    },
    {
      name: 'duplicate-choice-id', expected: 'Duplicate interaction choice id',
      mutate(spec) { spec.interaction.choices[1].id = spec.interaction.choices[0].id; },
    },
    {
      name: 'missing-choice-share-label', expected: 'shareLabel is required',
      mutate(spec) { delete spec.interaction.choices[0].shareLabel; },
    },
    {
      name: 'wrong-cta-language', expected: 'exactly one lang=ko',
      mutate(spec) { spec.interaction.ctaUrl = spec.interaction.ctaUrl.replace('lang=ko', 'lang=en'); },
    },
    {
      name: 'predefined-branch', expected: 'must not predefine surface or branch',
      mutate(spec) { spec.interaction.ctaUrl += '&branch=return'; },
    },
    {
      name: 'missing-share-placeholder', expected: 'must contain {choice} exactly once',
      mutate(spec) { spec.interaction.shareTemplate = 'No choice placeholder'; },
    },
    {
      name: 'missing-replacement-section', expected: 'must match exactly one section heading',
      mutate(spec) { spec.interaction.replaceSectionHeading = 'Missing section'; },
    },
    {
      name: 'generic-crosspromo-with-interaction', expected: 'requires crossPromoMode to be "native"',
      mutate(spec) { spec.crossPromoMode = 'default'; },
    },
  ];

  for (const testCase of cases) {
    const candidate = clone(sourceSpec);
    testCase.mutate(candidate);
    let error = null;
    try {
      validateSpec(candidate);
    } catch (caught) {
      error = caught;
    }
    assert(error && error.message.includes(testCase.expected), `${testCase.name} was not rejected correctly: ${error ? error.message : 'passed'}`);
    console.log(`[PASS] validation ${testCase.name}`);
  }

  const impliedNative = clone(sourceSpec);
  delete impliedNative.crossPromoMode;
  assert(validateSpec(impliedNative).crossPromoMode === 'native', 'Interaction did not imply native cross-promo suppression');
  console.log('[PASS] interaction implies native cross-promo suppression');
}

async function openPage(browser, baseUrl, shareMode) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ko-KR' });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await page.route('https://**/*', (route) => route.abort());
  await page.addInitScript((mode) => {
    window.__shareCalls = [];
    window.__copyCalls = [];
    window.__finishShare = null;
    window.__finishCopy = null;
    if (mode === 'native') {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value(payload) {
          window.__shareCalls.push(JSON.parse(JSON.stringify(payload || {})));
          return new Promise((resolve) => { window.__finishShare = resolve; });
        },
      });
    } else {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText(value) {
            window.__copyCalls.push(String(value));
            return new Promise((resolve) => { window.__finishCopy = resolve; });
          },
        },
      });
    }
  }, shareMode);
  await page.goto(`${baseUrl}${ROUTE}`, { waitUntil: 'domcontentloaded' });
  return { context, page, runtimeErrors };
}

async function selectChoice(page, choiceId, keyboard) {
  const section = page.locator('#return-reset-choice');
  assert(await section.count() === 1, 'Generated interaction did not render exactly once');
  assert(await section.locator('input[type="radio"]').count() === 2, 'Generated radio count changed at runtime');
  assert((await eventList(page)).every((event) => event.name !== 'content_choice_view'), 'Choice view fired before the card was exposed');
  await section.scrollIntoViewIfNeeded();
  await waitForEvent(page, 'content_choice_view');
  const radio = section.locator(`input[value="${choiceId}"]`);
  const label = radio.locator('xpath=ancestor::label[1]');
  const box = await label.boundingBox();
  assert(box && box.width >= 44 && box.height >= 44, `Generated choice target is too small: ${box ? `${box.width}x${box.height}` : 'missing'}`);
  if (keyboard) {
    await radio.focus();
    await page.keyboard.press('Space');
  } else {
    await label.click();
  }
  await waitForEvent(page, 'content_choice_select');
  assert(await radio.isChecked(), `${choiceId} was not selected`);
  assert(await label.evaluate((node) => node.classList.contains('is-selected')), 'Selected label lacks the visible is-selected state');
  const markerOpacity = await label.locator('.culture-choice-selected').evaluate((node) => getComputedStyle(node).opacity);
  assert(markerOpacity === '1', 'Selected state marker is not visible');
  const result = section.locator('[data-choice-result]');
  assert(await result.isVisible(), 'Generated choice result did not become visible');
  const cta = section.locator('.culture-choice-cta');
  const url = new URL(await cta.getAttribute('href'));
  assert(url.searchParams.get('branch') === choiceId, 'Generated CTA branch is wrong');
  assert(url.searchParams.get('surface') === `odyssey_spiderman_choice_${choiceId}`, 'Generated CTA surface is wrong');
  assert(url.searchParams.get('lang') === 'ko' && url.searchParams.get('start') === '1', 'Generated CTA lost lang/start parameters');
  const overflow = await page.evaluate(() => Math.max(
    0,
    document.documentElement.scrollWidth - window.innerWidth,
    document.body.scrollWidth - window.innerWidth
  ));
  assert(overflow === 0, `Generated page has ${overflow}px horizontal overflow`);
  assert(await page.locator('.cp-sticky-sprint').count() === 0, 'Generated native interaction loaded a sticky cross-promo');
  return section;
}

async function verifyShare(browser, baseUrl, mode, choiceId, keyboard) {
  const handle = await openPage(browser, baseUrl, mode);
  try {
    const section = await selectChoice(handle.page, choiceId, keyboard);
    await section.locator('[data-choice-share]').click();
    await waitForEvent(handle.page, 'content_share_click');
    let events = await eventList(handle.page);
    assert(events.filter((event) => event.name === 'share').length === 0, `${mode} success event fired before the API resolved`);
    const intent = eventByName(events, 'content_share_click');
    assert(intent.params.choice_id === choiceId, `${mode} intent lost choice_id`);
    assert(intent.params.method === (mode === 'native' ? 'web_share' : 'clipboard'), `${mode} intent method is wrong`);
    if (mode === 'native') {
      const calls = await handle.page.evaluate(() => window.__shareCalls);
      assert(calls.length === 1 && calls[0].title && calls[0].text && calls[0].url, 'Native share payload is incomplete');
      await handle.page.evaluate(() => window.__finishShare());
    } else {
      const calls = await handle.page.evaluate(() => window.__copyCalls);
      assert(calls.length === 1 && calls[0].includes('utm_content=' + choiceId), 'Clipboard payload is incomplete or lacks branch attribution');
      await handle.page.evaluate(() => window.__finishCopy());
    }
    await waitForEvent(handle.page, 'share');
    events = await eventList(handle.page);
    const success = eventByName(events, 'share');
    assert(success.params.choice_id === choiceId, `${mode} success lost choice_id`);
    assert(success.params.method === (mode === 'native' ? 'web_share' : 'clipboard'), `${mode} success method is wrong`);
    assert(events.findIndex((event) => event.name === 'content_share_click') < events.findIndex((event) => event.name === 'share'), `${mode} event order is wrong`);
    assert(handle.runtimeErrors.length === 0, `${mode} runtime errors: ${handle.runtimeErrors.join(' | ')}`);
    console.log(`[PASS] generated ${mode} share intent precedes successful share`);
  } finally {
    await handle.context.close();
  }
}

async function main() {
  const sourceSpec = loadSpec();
  runValidationCases(sourceSpec);
  const spec = validateSpec(clone(sourceSpec));
  const html = renderArticle(spec);
  assertGeneratedSource(html, spec);

  const tempRoot = fs.mkdtempSync(TEMP_PREFIX);
  assert(path.resolve(tempRoot).startsWith(path.resolve(TEMP_PREFIX)), `Unsafe temp directory: ${tempRoot}`);
  const articlePath = path.join(tempRoot, 'portal', 'blog', 'ko', `${spec.slug}.html`);
  fs.mkdirSync(path.dirname(articlePath), { recursive: true });
  fs.writeFileSync(articlePath, html, 'utf8');
  assert(fs.readFileSync(articlePath, 'utf8') === html, 'Temporary generated output did not round-trip');
  console.log(`[PASS] temporary output generated (${Buffer.byteLength(html, 'utf8')} bytes)`);

  const server = createServer(articlePath);
  const port = await listen(server);
  const browser = await chromium.launch({ headless: true });
  try {
    const baseUrl = `http://127.0.0.1:${port}`;
    await verifyShare(browser, baseUrl, 'native', 'return', true);
    await verifyShare(browser, baseUrl, 'clipboard', 'reset', false);
  } finally {
    await browser.close();
    await closeServer(server);
    removeTemporaryOutput(tempRoot, articlePath);
  }
  console.log('[PASS] temporary output cleaned');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
