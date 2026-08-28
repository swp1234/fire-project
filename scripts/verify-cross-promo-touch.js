#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const WORKSPACE = path.resolve(__dirname, '..');
const CROSS_PROMO_PATH = path.join(WORKSPACE, 'projects', 'portal', 'js', 'cross-promo.js');
const APP_DATA_PATH = path.join(WORKSPACE, 'projects', 'portal', 'js', 'app-data.js');
const HOST = '127.0.0.1';
const FIXTURE_PATH = '/portal/blog/ko/cross-promo-touch-fixture.html';
const VIEWPORT = { width: 390, height: 844 };
const TARGETS = ['.cp-sticky-link', '.cp-sticky-alt', '.cp-sticky-close'];

function parseArgs(argv) {
  const args = { mutations: false };
  for (const arg of argv) {
    if (arg === '--mutations') args.mutations = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/verify-cross-promo-touch.js [--mutations]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function fixtureHtml() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Cross-promo touch fixture</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; max-width: 100%; }
    body { background: #07110f; color: #f4fffd; font-family: sans-serif; }
    article { width: min(100%, 760px); margin: 0 auto; padding: 20px 16px 120px; }
  </style>
</head>
<body>
  <article><h1>Culture Signal fixture</h1><p>Sticky touch geometry verification.</p></article>
  <script src="/portal/js/cross-promo.js" defer></script>
</body>
</html>`;
}

function createServer(crossPromoSource, appDataSource) {
  return http.createServer((req, res) => {
    const pathname = new URL(req.url || '/', 'http://localhost').pathname;
    if (pathname === FIXTURE_PATH) {
      res.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fixtureHtml());
      return;
    }
    if (pathname === '/portal/js/cross-promo.js') {
      res.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(crossPromoSource);
      return;
    }
    if (pathname === '/portal/js/app-data.js') {
      res.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(appDataSource);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, HOST, () => {
      server.removeListener('error', reject);
      resolve(server.address().port);
    });
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

async function verifySource(browser, name, crossPromoSource, appDataSource) {
  const server = createServer(crossPromoSource, appDataSource);
  const port = await listen(server);
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message || String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
      runtimeErrors.push(message.text());
    }
  });

  try {
    // market=zh makes the optional alternate link render while the fixture remains on the required KO blog path.
    const url = `http://${HOST}:${port}${FIXTURE_PATH}?market=zh`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('.cp-sticky-sprint', { state: 'visible', timeout: 6000 });
    await page.waitForTimeout(100);

    const snapshot = await page.evaluate((selectors) => {
      const targets = selectors.map((selector) => {
        const node = document.querySelector(selector);
        if (!node) return { selector, missing: true };
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          selector,
          missing: false,
          width: rect.width,
          height: rect.height,
          display: style.display,
          visibility: style.visibility,
        };
      });
      const documentOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const bodyOverflow = document.body ? document.body.scrollWidth - window.innerWidth : 0;
      return {
        targets,
        overflowX: Math.max(0, documentOverflow, bodyOverflow),
      };
    }, TARGETS);

    const failures = [];
    for (const target of snapshot.targets) {
      if (target.missing) {
        failures.push(`${target.selector} missing`);
        continue;
      }
      if (target.display === 'none' || target.visibility === 'hidden') {
        failures.push(`${target.selector} is not visible`);
      }
      if (target.width < 44 || target.height < 44) {
        failures.push(`${target.selector} is ${target.width.toFixed(2)}x${target.height.toFixed(2)}; expected at least 44x44`);
      }
    }
    if (snapshot.overflowX !== 0) failures.push(`horizontal overflow is ${snapshot.overflowX}px; expected 0`);
    for (const error of runtimeErrors) failures.push(`runtime error: ${error}`);

    return { name, ok: failures.length === 0, failures, snapshot, url };
  } catch (error) {
    return {
      name,
      ok: false,
      failures: [`verification error: ${error.message}`],
      snapshot: { targets: [], overflowX: null },
    };
  } finally {
    await context.close();
    await closeServer(server);
  }
}

function mutateCssRule(source, selector, transform) {
  const startMarker = `'${selector}{`;
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`Could not find CSS rule for mutation: ${selector}`);
  const ruleStart = start + 1;
  const ruleEnd = source.indexOf("}'", ruleStart);
  if (ruleEnd === -1) throw new Error(`Could not find CSS rule end for mutation: ${selector}`);
  const rule = source.slice(ruleStart, ruleEnd + 1);
  const mutatedRule = transform(rule);
  if (mutatedRule === rule) throw new Error(`Mutation did not change CSS rule: ${selector}`);
  return `${source.slice(0, ruleStart)}${mutatedRule}${source.slice(ruleEnd + 1)}`;
}

const MUTATIONS = [
  {
    name: 'sticky-link-remove-min-height',
    selector: '.cp-sticky-link',
    apply(source) {
      return mutateCssRule(source, this.selector, (rule) => rule.replace('min-height:44px;', ''));
    },
  },
  {
    name: 'sticky-alt-remove-min-height',
    selector: '.cp-sticky-alt',
    apply(source) {
      return mutateCssRule(source, this.selector, (rule) => rule.replace('min-height:44px;', ''));
    },
  },
  {
    name: 'sticky-close-32px',
    selector: '.cp-sticky-close',
    apply(source) {
      return mutateCssRule(source, this.selector, (rule) => rule.replace(
        'width:44px;height:44px;flex:0 0 44px;',
        'width:32px;height:32px;flex:0 0 32px;'
      ));
    },
  },
];

function printResult(result, expectedFailure = false) {
  const passed = expectedFailure ? !result.ok : result.ok;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${result.name}${expectedFailure ? ' (mutation detected)' : ''}`);
  for (const target of result.snapshot.targets || []) {
    if (!target.missing) console.log(`  ${target.selector}: ${target.width.toFixed(2)}x${target.height.toFixed(2)}`);
  }
  if (result.snapshot.overflowX !== null) console.log(`  overflow: ${result.snapshot.overflowX}px`);
  for (const failure of result.failures) console.log(`  - ${failure}`);
  return passed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const crossPromoSource = fs.readFileSync(CROSS_PROMO_PATH, 'utf8');
  const appDataSource = fs.readFileSync(APP_DATA_PATH, 'utf8');
  const browser = await chromium.launch();
  let allPassed = true;

  try {
    const baseline = await verifySource(browser, 'baseline', crossPromoSource, appDataSource);
    allPassed = printResult(baseline) && allPassed;
    if (!baseline.ok) throw new Error('Baseline failed; mutation sensitivity cannot be established.');

    if (args.mutations) {
      for (const mutation of MUTATIONS) {
        const mutatedSource = mutation.apply(crossPromoSource);
        const result = await verifySource(browser, mutation.name, mutatedSource, appDataSource);
        const detected = !result.ok && result.failures.some((failure) => failure.includes(mutation.selector));
        printResult(result, true);
        if (!detected) {
          console.log(`  - expected a geometry failure for ${mutation.selector}`);
          allPassed = false;
        }
      }
    }
  } finally {
    await browser.close();
  }

  if (!allPassed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
