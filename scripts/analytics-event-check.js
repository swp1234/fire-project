const { chromium } = require('playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 8766;
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
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
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
      const filePath = getLocalPath(req.url || '/');
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

async function preventNavigation(page, selector) {
  const locator = page.locator(selector).first();
  await locator.evaluate((node) => {
    node.addEventListener(
      'click',
      (event) => event.preventDefault(),
      { capture: true }
    );
  });
}

async function clickAndWait(page, selector) {
  await page.locator(selector).first().click();
  await page.waitForTimeout(150);
}

async function readEventNames(page) {
  return page.evaluate(() => window.__analyticsEvents.map((event) => event.name));
}

async function assertEvents(page, expectedNames) {
  const eventNames = await readEventNames(page);
  const missing = expectedNames.filter((name) => !eventNames.includes(name));
  if (missing.length > 0) {
    throw new Error(`Missing events: ${missing.join(', ')} | got: ${eventNames.join(', ')}`);
  }
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

async function instrumentAnalytics(page) {
  await page.addInitScript(() => {
    const captured = [];
    const dataLayer = [];
    const basePush = Array.prototype.push;

    dataLayer.push = function pushProxy(...items) {
      for (const item of items) {
        const args = Array.from(item);
        if (args[0] === 'event') {
          captured.push({
            name: args[1],
            params: args[2] || {},
          });
        }
      }
      return basePush.apply(this, items);
    };

    window.__analyticsEvents = captured;
    window.dataLayer = dataLayer;
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  });
}

const scenarios = [
  {
    name: 'portal',
    path: '/portal/',
    expected: ['hub_view', 'hub_filter_select', 'hub_test_card_click', 'hub_cta_click'],
    async run(page) {
      await page.waitForSelector('#blog-filters .blog-filter');
      await assertEvents(page, ['hub_view']);
      await clickAndWait(page, '#blog-filters .blog-filter[data-cat="tests"]');
      await preventNavigation(page, '.blog-card');
      await clickAndWait(page, '.blog-card');
      await preventNavigation(page, '.hub-card[href="/portal/tests/"]');
      await clickAndWait(page, '.hub-card[href="/portal/tests/"]');
    },
  },
  {
    name: 'portal-tests',
    path: '/portal/tests/',
    expected: ['hub_view', 'hub_filter_select', 'hub_featured_click', 'hub_faq_open', 'hub_cta_click'],
    async run(page) {
      await page.waitForSelector('.filter-btn[data-filter="emotion"]');
      await assertEvents(page, ['hub_view']);
      await clickAndWait(page, '.filter-btn[data-filter="emotion"]');
      await preventNavigation(page, '.featured-card[data-cat="emotion"]');
      await clickAndWait(page, '.featured-card[data-cat="emotion"]:visible');
      await clickAndWait(page, '.faq-item .faq-q');
      await preventNavigation(page, '.cta-section .cta-btn');
      await clickAndWait(page, '.cta-section .cta-btn');
    },
  },
  {
    name: 'portal-mbti',
    path: '/portal/mbti/',
    expected: ['hub_view', 'hub_featured_click', 'hub_faq_open', 'hub_cta_click', 'hub_test_card_click'],
    async run(page) {
      await page.waitForSelector('.m-cell');
      await assertEvents(page, ['hub_view']);
      await clickAndWait(page, '.m-cell');
      await preventNavigation(page, '.modal-cta');
      await clickAndWait(page, '.modal-cta');
      await clickAndWait(page, '#modal-close');
      await clickAndWait(page, '.faq-item .faq-q');
      await preventNavigation(page, '#next-tests a');
      await clickAndWait(page, '#next-tests a');
    },
  },
  {
    name: 'digital-detox',
    path: '/portal/blog/en/digital-detox.html',
    expected: ['content_view', 'content_faq_open', 'content_toc_click', 'content_cta_click', 'content_related_click'],
    async run(page) {
      await page.waitForSelector('.faq-question');
      await assertEvents(page, ['content_view']);
      await clickAndWait(page, '.faq-question');
      await clickAndWait(page, '.toc a');
      await preventNavigation(page, '.cta-button');
      await clickAndWait(page, '.cta-button');
      await preventNavigation(page, '.related-card');
      await clickAndWait(page, '.related-card');
    },
  },
  {
    name: 'habit-building',
    path: '/portal/blog/en/habit-building.html',
    expected: ['content_view', 'content_faq_open', 'content_toc_click', 'content_cta_click', 'content_related_click'],
    async run(page) {
      await page.waitForSelector('.faq-question');
      await assertEvents(page, ['content_view']);
      await clickAndWait(page, '.faq-question');
      await clickAndWait(page, '.toc a');
      await preventNavigation(page, '.cta-button');
      await clickAndWait(page, '.cta-button');
      await preventNavigation(page, '.related-card');
      await clickAndWait(page, '.related-card');
    },
  },
  {
    name: 'stress-management',
    path: '/portal/blog/en/stress-management-techniques-guide.html',
    expected: ['content_view', 'content_cta_click', 'content_toc_click', 'content_related_click'],
    async run(page) {
      await page.waitForSelector('.cta-btn');
      await assertEvents(page, ['content_view']);
      await preventNavigation(page, '.cta-btn');
      await clickAndWait(page, '.cta-btn');
      await clickAndWait(page, '.toc a');
      await preventNavigation(page, '.related-links a');
      await clickAndWait(page, '.related-links a');
    },
  },
  {
    name: 'blood-type',
    path: '/portal/blog/en/blood-type-personality-guide.html',
    expected: ['content_view', 'content_cta_click', 'content_related_click', 'content_nav_click'],
    async run(page) {
      await page.waitForSelector('.cta-button');
      await assertEvents(page, ['content_view']);
      await preventNavigation(page, '.cta-button');
      await clickAndWait(page, '.cta-button');
      await preventNavigation(page, '.related-links a');
      await clickAndWait(page, '.related-links a');
      await preventNavigation(page, 'nav a');
      await clickAndWait(page, 'nav a');
    },
  },
  {
    name: 'eq-test',
    path: '/eq-test/',
    expected: ['premium_cta_view', 'premium_unlock_click', 'premium_unlock_complete', 'eq_related_click'],
    async run(page) {
      await page.waitForSelector('#btn-start');
      await clickAndWait(page, '#btn-start');

      for (let round = 0; round < 10; round += 1) {
        await page.waitForSelector('.option-card');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(1550);
      }

      await page.waitForSelector('#btn-ai-unlock:not(.hidden)');
      await assertEvents(page, ['premium_cta_view']);
      await clickAndWait(page, '#btn-ai-unlock');
      await page.waitForTimeout(1350);
      await preventNavigation(page, '.related-card');
      await clickAndWait(page, '.related-card');
    },
  },
];

async function runScenario(browser, scenario) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await blockExternalRequests(page);
  await instrumentAnalytics(page);

  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  try {
    await page.goto(`http://${HOST}:${PORT}${scenario.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(800);
    await scenario.run(page);
    await page.waitForTimeout(250);
    await assertEvents(page, scenario.expected);

    if (pageErrors.length > 0) {
      throw new Error(`pageerror: ${pageErrors.join(' | ')}`);
    }

    return { name: scenario.name, ok: true };
  } catch (error) {
    const eventNames = await readEventNames(page).catch(() => []);
    return {
      name: scenario.name,
      ok: false,
      error: error.message,
      events: eventNames,
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
    console.log('\nAnalytics Event Smoke Check\n');
    for (const result of results) {
      if (result.ok) {
        console.log(`[PASS] ${result.name}`);
        continue;
      }

      failed += 1;
      console.log(`[FAIL] ${result.name}`);
      console.log(`       ${result.error}`);
      if (result.events && result.events.length > 0) {
        console.log(`       events: ${result.events.join(', ')}`);
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
