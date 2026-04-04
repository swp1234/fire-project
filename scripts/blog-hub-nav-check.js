const { chromium } = require('playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 8767;
const PROJECTS_ROOT = path.resolve(__dirname, '..', 'projects');

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

function getLocalPath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || '/').split('?')[0]);
  const joined = path.join(PROJECTS_ROOT, cleanPath);
  const resolved = path.resolve(joined);
  if (!resolved.startsWith(PROJECTS_ROOT)) {
    throw new Error(`Blocked path escape: ${urlPath}`);
  }

  let target = resolved;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, 'index.html');
  }

  return target;
}

function createStaticServer() {
  return http.createServer((req, res) => {
    try {
      const filePath = getLocalPath(req.url);
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const body = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentType,
      });
      res.end(body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(error.message);
    }
  });
}

async function blockExternalRequests(page) {
  await page.route('https://**/*', async (route) => {
    const url = route.request().url();
    if (url.includes('googletagmanager.com/gtag/js')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
      return;
    }

    if (
      url.includes('pagead2.googlesyndication.com') ||
      url.includes('googleads.g.doubleclick.net')
    ) {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
      return;
    }

    if (url.includes('fonts.googleapis.com')) {
      await route.fulfill({
        status: 200,
        contentType: 'text/css',
        body: '',
      });
      return;
    }

    if (url.includes('fonts.gstatic.com')) {
      await route.fulfill({
        status: 204,
        body: '',
      });
      return;
    }

    await route.abort();
  });
}

async function instrumentPage(page) {
  await page.addInitScript(() => {
    window.__navCheck = {
      bfcacheRestoreEvents: 0,
      lastNavigationType: null,
    };

    document.addEventListener('dopabrain:bfcache-restore', (event) => {
      window.__navCheck.bfcacheRestoreEvents += 1;
      window.__navCheck.lastNavigationType =
        event && event.detail ? event.detail.navigationType : null;
    });
  });
}

async function collectState(page) {
  return page.evaluate(() => {
    const speculationNode = document.getElementById('dopabrain-speculation-rules');
    const raw = speculationNode ? speculationNode.textContent || '' : '';
    let parsed = null;

    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch (error) {
      parsed = { parseError: error.message };
    }

    return {
      href: window.location.href,
      hasSpeculationRulesNode: !!speculationNode,
      speculationRules: parsed,
      bfcacheRestored: document.documentElement.getAttribute('data-bfcache-restored') === 'true',
      bfcacheRestoreEvents: window.__navCheck ? window.__navCheck.bfcacheRestoreEvents : 0,
      lastNavigationType: window.__navCheck ? window.__navCheck.lastNavigationType : null,
    };
  });
}

function assertSpeculationRules(state, selector) {
  if (!state.hasSpeculationRulesNode) {
    throw new Error('Missing #dopabrain-speculation-rules node');
  }

  const prefetch = state.speculationRules && state.speculationRules.prefetch;
  if (!Array.isArray(prefetch) || prefetch.length === 0) {
    throw new Error('Speculation rules missing prefetch configuration');
  }

  const actualSelector =
    prefetch[0] &&
    prefetch[0].where &&
    prefetch[0].where.selector_matches;

  if (actualSelector !== selector) {
    throw new Error(`Unexpected selector_matches: ${actualSelector}`);
  }

  if (prefetch[0].eagerness !== 'moderate') {
    throw new Error(`Unexpected eagerness: ${prefetch[0].eagerness}`);
  }
}

const scenarios = [
  {
    name: 'blog-en',
    path: '/portal/blog/en/',
    expectedSelector: '.js-prefetch-link',
    articleSelector: '.card.js-prefetch-link',
  },
  {
    name: 'blog-ko',
    path: '/portal/blog/ko/',
    expectedSelector: '.blog-grid > a.blog-card[href]',
    articleSelector: '.blog-grid > a.blog-card[href]',
  },
  {
    name: 'blog-es',
    path: '/portal/blog/es/',
    expectedSelector: '.blog-grid > a.blog-card[href]',
    articleSelector: '.blog-grid > a.blog-card[href]',
  },
  {
    name: 'blog-zh',
    path: '/portal/blog/zh/',
    expectedSelector: '.blog-grid > a.blog-card[href]',
    articleSelector: '.blog-grid > a.blog-card[href]',
  },
  {
    name: 'blog-ja',
    path: '/portal/blog/ja/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
  {
    name: 'blog-pt',
    path: '/portal/blog/pt/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
  {
    name: 'blog-id',
    path: '/portal/blog/id/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
  {
    name: 'blog-tr',
    path: '/portal/blog/tr/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
  {
    name: 'blog-de',
    path: '/portal/blog/de/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
  {
    name: 'blog-fr',
    path: '/portal/blog/fr/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
  {
    name: 'blog-hi',
    path: '/portal/blog/hi/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
  {
    name: 'blog-ru',
    path: '/portal/blog/ru/',
    expectedSelector: 'a.blog-card[href]',
    articleSelector: 'a.blog-card[href]',
  },
];

async function runScenario(browser, scenario) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await blockExternalRequests(page);
  await instrumentPage(page);

  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  try {
    await page.goto(`http://${HOST}:${PORT}${scenario.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(900);
    await page.waitForSelector(scenario.articleSelector, { timeout: 10000 });

    const before = await collectState(page);
    assertSpeculationRules(before, scenario.expectedSelector);

    const article = page.locator(scenario.articleSelector).first();
    await article.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(700);

    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);

    const after = await collectState(page);
    assertSpeculationRules(after, scenario.expectedSelector);

    if (pageErrors.length > 0) {
      throw new Error(`pageerror: ${pageErrors.join(' | ')}`);
    }

    return {
      name: scenario.name,
      ok: true,
      bfcacheRestored: after.bfcacheRestored,
      bfcacheRestoreEvents: after.bfcacheRestoreEvents,
      lastNavigationType: after.lastNavigationType,
    };
  } catch (error) {
    const state = await collectState(page).catch(() => null);
    return {
      name: scenario.name,
      ok: false,
      error: error.message,
      state,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, HOST, resolve));

  const browser = await chromium.launch({ headless: true });

  try {
    const results = [];
    for (const scenario of scenarios) {
      results.push(await runScenario(browser, scenario));
    }

    let failed = 0;
    console.log('\nBlog Hub Navigation Check\n');
    for (const result of results) {
      if (result.ok) {
        const bfcache = result.bfcacheRestored ? 'observed' : 'not observed';
        console.log(
          `[PASS] ${result.name} | speculationrules OK | bfcache ${bfcache} | restore events: ${result.bfcacheRestoreEvents}`
        );
        continue;
      }

      failed += 1;
      console.log(`[FAIL] ${result.name}`);
      console.log(`       ${result.error}`);
      if (result.state) {
        console.log(`       state: ${JSON.stringify(result.state)}`);
      }
    }

    console.log(`\nSummary: ${results.length - failed} passed, ${failed} failed out of ${results.length}\n`);
    process.exitCode = failed > 0 ? 1 : 0;
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
