const { chromium } = require('playwright');

const origin = process.argv[2] || 'http://127.0.0.1:4173';
const originHost = new URL(origin).hostname;
const isLocal = ['127.0.0.1', 'localhost'].includes(originHost);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
      errors.push(message.text());
    }
  });
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== originHost) return route.abort();
    if (isLocal && url.pathname.startsWith('/portal/js/')) return route.abort();
    return route.continue();
  });

  await page.goto(`${origin}/?lang=ko`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => getComputedStyle(document.getElementById('app-loader')).display === 'none');
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('#top-picks')).opacity) === 1);
  await page.locator('.cta-section').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.cta-section')?.classList.contains('in-view'));
  await page.evaluate(() => scrollTo(0, 0));
  const ko = await page.evaluate(() => ({
    title: document.title,
    tagline: document.querySelector('.tagline')?.textContent.trim(),
    primary: document.querySelector('#hero-primary-cta')?.textContent.trim(),
    primaryHref: document.querySelector('#hero-primary-cta')?.getAttribute('href'),
    startCards: [...document.querySelectorAll('.start-card')].map((link) => link.getAttribute('href')),
    picks: [...document.querySelectorAll('.pick-card')].map((link) => link.textContent.trim()),
    directoryCount: document.querySelectorAll('.site-directory').length,
    popularCount: document.querySelectorAll('#app-grid .app-card').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    primaryVisible: Number(getComputedStyle(document.querySelector('#hero-primary-cta')).opacity) === 1,
    schemasValid: [...document.querySelectorAll('script[type="application/ld+json"]')]
      .every((script) => { try { JSON.parse(script.textContent); return true; } catch { return false; } }),
  }));
  assert(ko.title.includes('스트레스'), 'Korean focus title missing');
  assert(ko.primaryHref.includes('/stress-check/'), 'Primary CTA is not Stress Check');
  assert(ko.startCards.length === 3, 'Expected three primary paths');
  assert(ko.startCards[0].includes('/stress-check/'), 'First primary path is not Stress Check');
  assert(ko.picks.length === 6, 'Expected six focused picks');
  assert(ko.directoryCount === 0 && ko.popularCount === 0, 'Legacy catalog remains on root');
  assert(ko.overflow <= 0, 'Mobile layout overflows');
  assert(ko.primaryVisible, 'Primary CTA is not visible');
  assert(ko.schemasValid, 'Structured data is invalid');
  await page.screenshot({ path: '.codex-artifacts/root-focus-mobile.png', fullPage: true });

  await page.goto(`${origin}/?lang=zh`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('.tagline')?.textContent.includes('需要'));
  const zh = await page.evaluate(() => ({
    title: document.title,
    primary: document.querySelector('#hero-primary-cta')?.textContent.trim(),
    picks: [...document.querySelectorAll('.pick-card')].map((link) => link.textContent.trim()),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  assert(zh.title.includes('压力'), 'Chinese focus title missing');
  assert(zh.primary.includes('压力'), 'Chinese primary CTA missing');
  assert(zh.picks.length === 6 && zh.overflow <= 0, 'Chinese mobile focus layout failed');
  assert(errors.length === 0, `Runtime errors: ${errors.join(' | ')}`);

  console.log(JSON.stringify({ ko, zh, errors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
