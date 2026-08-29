#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { renderArticle, validateSpec } = require('./create-blog-article');
const { listenOnSafePort } = require('./lib/safe-local-port');

const WORKSPACE = path.resolve(__dirname, '..');
const DEFAULT_SPEC_PATH = path.join(WORKSPACE, 'scripts', 'specs', 'trend-odyssey-spiderman-ko.json');
const TEMP_PREFIX = path.join(os.tmpdir(), 'dopabrain-blog-generator-');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isWithin(parentPath, candidatePath) {
  const relative = path.relative(parentPath, candidatePath);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
}

function resolveSpecPath(specArgument) {
  const requestedPath = specArgument || DEFAULT_SPEC_PATH;
  const resolvedPath = path.resolve(WORKSPACE, requestedPath);
  assert(isWithin(WORKSPACE, resolvedPath), `--spec must stay inside the workspace: ${requestedPath}`);
  assert(path.extname(resolvedPath).toLowerCase() === '.json', `--spec must point to a JSON file: ${requestedPath}`);
  assert(fs.existsSync(resolvedPath), `--spec file does not exist: ${requestedPath}`);
  assert(fs.statSync(resolvedPath).isFile(), `--spec must point to a file: ${requestedPath}`);

  const realWorkspace = fs.realpathSync(WORKSPACE);
  const realSpecPath = fs.realpathSync(resolvedPath);
  assert(isWithin(realWorkspace, realSpecPath), `--spec resolves outside the workspace: ${requestedPath}`);
  return realSpecPath;
}

function parseArgs(args) {
  let specArgument = null;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    assert(argument === '--spec', `Unknown argument: ${argument}`);
    assert(specArgument === null, '--spec may only be provided once');
    const value = args[index + 1];
    assert(typeof value === 'string' && value.length > 0 && !value.startsWith('--'), '--spec requires a workspace JSON path');
    specArgument = value;
    index += 1;
  }
  return resolveSpecPath(specArgument);
}

function loadSpec(specPath) {
  return JSON.parse(fs.readFileSync(specPath, 'utf8'));
}

function buildContract(spec) {
  return {
    route: `/portal/blog/${spec.lang}/${spec.slug}.html`,
    lang: spec.lang,
    contentSlug: spec.contentSlug,
    interactionId: spec.interaction.id,
    interactionName: spec.interaction.name,
    interactionSurface: spec.interaction.surface,
    shareSurface: spec.interaction.shareSurface,
    choices: spec.interaction.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      ctaSurface: choice.ctaSurface,
    })),
  };
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

function assertEventContext(event, contract) {
  assert(event.params.content_slug === contract.contentSlug, `${event.name} lost content_slug`);
  assert(event.params.page_path === contract.route, `${event.name} has the wrong page_path`);
  assert(event.params.page_language === contract.lang, `${event.name} has the wrong page_language`);
}

function createServer(articlePath, route) {
  return http.createServer((request, response) => {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname;
    if (pathname !== route) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not Found');
      return;
    }
    response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(articlePath).pipe(response);
  });
}

function listen(server) {
  return listenOnSafePort(server).then((address) => address.port);
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

function removeTemporaryOutput(tempRoot, articlePath, lang) {
  const resolvedRoot = path.resolve(tempRoot);
  assert(resolvedRoot.startsWith(path.resolve(TEMP_PREFIX)), `Refusing unsafe cleanup: ${tempRoot}`);
  const expectedArticle = path.join(resolvedRoot, 'portal', 'blog', lang, path.basename(articlePath));
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
  for (const choice of interaction.choices) {
    assert(html.includes(`value="${choice.id}"`), `Generated choice ${choice.id} is missing`);
    assert(html.includes(choice.ctaSurface), `Generated CTA surface ${choice.ctaSurface} is missing`);
  }
}

function runValidationCases(sourceSpec) {
  const wrongLang = sourceSpec.lang === 'en' ? 'ko' : 'en';
  const firstChoiceId = sourceSpec.interaction.choices[0].id;
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
      name: 'wrong-cta-language', expected: `exactly one lang=${sourceSpec.lang}`,
      mutate(spec) {
        const url = new URL(spec.interaction.ctaUrl);
        url.searchParams.set('lang', wrongLang);
        spec.interaction.ctaUrl = url.toString();
      },
    },
    {
      name: 'predefined-branch', expected: 'must not predefine surface or branch',
      mutate(spec) { spec.interaction.ctaUrl += `&branch=${firstChoiceId}`; },
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

async function openPage(browser, baseUrl, shareMode, contract) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: contract.lang });
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
  await page.goto(`${baseUrl}${contract.route}`, { waitUntil: 'domcontentloaded' });
  assert(new URL(page.url()).pathname === contract.route, 'Generated article loaded from the wrong route');
  assert(await page.locator('html').getAttribute('lang') === contract.lang, 'Generated article has the wrong html lang');
  return { context, page, runtimeErrors };
}

async function selectChoice(page, contract, choice, keyboard) {
  const section = page.locator(`#${contract.interactionId}`);
  assert(await section.count() === 1, 'Generated interaction did not render exactly once');
  assert(await section.locator('input[type="radio"]').count() === 2, 'Generated radio count changed at runtime');
  assert((await eventList(page)).every((event) => event.name !== 'content_choice_view'), 'Choice view fired before the card was exposed');
  await section.scrollIntoViewIfNeeded();
  await waitForEvent(page, 'content_choice_view');
  const viewEvent = eventByName(await eventList(page), 'content_choice_view');
  assertEventContext(viewEvent, contract);
  assert(viewEvent.params.interaction_name === contract.interactionName, 'Choice view has the wrong interaction_name');
  assert(viewEvent.params.interaction_surface === contract.interactionSurface, 'Choice view has the wrong interaction_surface');
  assert(viewEvent.params.choice_count === contract.choices.length, 'Choice view has the wrong choice_count');
  const radio = section.locator(`input[value="${choice.id}"]`);
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
  const selectEvent = eventByName(await eventList(page), 'content_choice_select');
  assertEventContext(selectEvent, contract);
  assert(selectEvent.params.interaction_name === contract.interactionName, 'Choice select has the wrong interaction_name');
  assert(selectEvent.params.interaction_surface === contract.interactionSurface, 'Choice select has the wrong interaction_surface');
  assert(selectEvent.params.choice_id === choice.id && selectEvent.params.choice_label === choice.label, 'Choice select has the wrong choice contract');
  assert(await radio.isChecked(), `${choice.id} was not selected`);
  assert(await label.evaluate((node) => node.classList.contains('is-selected')), 'Selected label lacks the visible is-selected state');
  const markerOpacity = await label.locator('.culture-choice-selected').evaluate((node) => getComputedStyle(node).opacity);
  assert(markerOpacity === '1', 'Selected state marker is not visible');
  const result = section.locator('[data-choice-result]');
  assert(await result.isVisible(), 'Generated choice result did not become visible');
  const cta = section.locator('.culture-choice-cta');
  const url = new URL(await cta.getAttribute('href'));
  assert(url.searchParams.get('branch') === choice.id, 'Generated CTA branch is wrong');
  assert(url.searchParams.get('surface') === choice.ctaSurface, 'Generated CTA surface is wrong');
  assert(url.searchParams.get('lang') === contract.lang && url.searchParams.get('start') === '1', 'Generated CTA lost lang/start parameters');
  assert(await cta.getAttribute('data-choice-id') === choice.id, 'Generated CTA data-choice-id is wrong');
  assert(await cta.getAttribute('data-content-surface') === choice.ctaSurface, 'Generated CTA data-content-surface is wrong');
  const overflow = await page.evaluate(() => Math.max(
    0,
    document.documentElement.scrollWidth - window.innerWidth,
    document.body.scrollWidth - window.innerWidth
  ));
  assert(overflow === 0, `Generated page has ${overflow}px horizontal overflow`);
  assert(await page.locator('.cp-sticky-sprint').count() === 0, 'Generated native interaction loaded a sticky cross-promo');
  console.log(`[PASS] ${contract.contentSlug} ${keyboard ? 'keyboard' : 'pointer'} choice: CTA contract, 44px target, overflow=0, cross-promo suppressed`);
  return section;
}

async function verifyShare(browser, baseUrl, mode, contract, choice, keyboard) {
  const handle = await openPage(browser, baseUrl, mode, contract);
  try {
    const section = await selectChoice(handle.page, contract, choice, keyboard);
    await section.locator('[data-choice-share]').click();
    await waitForEvent(handle.page, 'content_share_click');
    let events = await eventList(handle.page);
    assert(events.filter((event) => event.name === 'share').length === 0, `${mode} success event fired before the API resolved`);
    const intent = eventByName(events, 'content_share_click');
    assertEventContext(intent, contract);
    assert(intent.params.choice_id === choice.id, `${mode} intent lost choice_id`);
    assert(intent.params.method === (mode === 'native' ? 'web_share' : 'clipboard'), `${mode} intent method is wrong`);
    assert(intent.params.share_surface === contract.shareSurface, `${mode} intent has the wrong share_surface`);
    if (mode === 'native') {
      const calls = await handle.page.evaluate(() => window.__shareCalls);
      assert(calls.length === 1 && calls[0].title && calls[0].text && calls[0].url, 'Native share payload is incomplete');
      const sharedUrl = new URL(calls[0].url);
      assert(sharedUrl.pathname === contract.route, 'Native share payload has the wrong article route');
      assert(sharedUrl.searchParams.get('utm_campaign') === contract.interactionName, 'Native share payload has the wrong campaign');
      assert(sharedUrl.searchParams.get('utm_content') === choice.id, 'Native share payload lacks branch attribution');
      await handle.page.evaluate(() => window.__finishShare());
    } else {
      const calls = await handle.page.evaluate(() => window.__copyCalls);
      assert(calls.length === 1 && calls[0].includes(contract.route) && calls[0].includes('utm_content=' + choice.id), 'Clipboard payload is incomplete or lacks route/branch attribution');
      await handle.page.evaluate(() => window.__finishCopy());
    }
    await waitForEvent(handle.page, 'share');
    events = await eventList(handle.page);
    const success = eventByName(events, 'share');
    assertEventContext(success, contract);
    assert(success.params.choice_id === choice.id, `${mode} success lost choice_id`);
    assert(success.params.method === (mode === 'native' ? 'web_share' : 'clipboard'), `${mode} success method is wrong`);
    assert(success.params.item_id === contract.contentSlug, `${mode} success lost contentSlug item_id`);
    const orderedNames = ['content_choice_view', 'content_choice_select', 'content_share_click', 'share'];
    const orderedIndexes = orderedNames.map((name) => events.findIndex((event) => event.name === name));
    assert(orderedIndexes.every((index) => index >= 0), `${mode} event order is missing an event`);
    assert(orderedIndexes.every((index, position) => position === 0 || orderedIndexes[position - 1] < index), `${mode} event order is wrong`);
    assert(handle.runtimeErrors.length === 0, `${mode} runtime errors: ${handle.runtimeErrors.join(' | ')}`);
    console.log(`[PASS] ${contract.contentSlug} ${mode} share: view -> select -> intent -> success`);
  } finally {
    await handle.context.close();
  }
}

async function main() {
  const specPath = parseArgs(process.argv.slice(2));
  const sourceSpec = loadSpec(specPath);
  runValidationCases(sourceSpec);
  const spec = validateSpec(clone(sourceSpec));
  const contract = buildContract(spec);
  const html = renderArticle(spec);
  assertGeneratedSource(html, spec);
  console.log(`[INFO] spec ${path.relative(WORKSPACE, specPath)} -> ${contract.route}`);

  const tempRoot = fs.mkdtempSync(TEMP_PREFIX);
  assert(path.resolve(tempRoot).startsWith(path.resolve(TEMP_PREFIX)), `Unsafe temp directory: ${tempRoot}`);
  const articlePath = path.join(tempRoot, 'portal', 'blog', spec.lang, `${spec.slug}.html`);
  fs.mkdirSync(path.dirname(articlePath), { recursive: true });
  fs.writeFileSync(articlePath, html, 'utf8');
  assert(fs.readFileSync(articlePath, 'utf8') === html, 'Temporary generated output did not round-trip');
  console.log(`[PASS] temporary output generated (${Buffer.byteLength(html, 'utf8')} bytes)`);

  const server = createServer(articlePath, contract.route);
  const port = await listen(server);
  const browser = await chromium.launch({ headless: true });
  try {
    const baseUrl = `http://127.0.0.1:${port}`;
    await verifyShare(browser, baseUrl, 'native', contract, contract.choices[0], true);
    await verifyShare(browser, baseUrl, 'clipboard', contract, contract.choices[1], false);
  } finally {
    await browser.close();
    await closeServer(server);
    removeTemporaryOutput(tempRoot, articlePath, spec.lang);
  }
  console.log('[PASS] temporary output cleaned');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
