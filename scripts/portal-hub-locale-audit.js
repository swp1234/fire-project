#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const PORTAL_ROOT = path.join(PROJECTS_ROOT, 'portal');
const LOCALE_DIR = path.join(PORTAL_ROOT, 'js', 'locales');
const LOCALES = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const RAW_KEY_RE = /\bhub_[a-z0-9_]+\.[a-z0-9_]+\b/i;
const STATIC_KEY_IGNORE = [
  /^hub_games\.feat\d+_(tag|name|desc)$/,
  /^hub_games\.desc_[a-z0-9-]+$/,
  /^hub_tools\.desc_[a-z0-9-]+$/,
  /^hub_tests\.(name|desc)_[a-z0-9-]+$/
];

const TARGET_PAGES = [
  {
    relPath: 'games/index.html',
    smokePath: '/portal/games/',
    selectors: [
      '[data-i18n="hub_games.feat1_tag"]',
      '[data-i18n="hub_games.feat1_desc"]',
      '[data-i18n="hub_games.try_tests"]'
    ],
    badPatterns: [RAW_KEY_RE]
  },
  {
    relPath: 'mbti/index.html',
    smokePath: '/portal/mbti/',
    selectors: [
      '[data-i18n="hub_mbti.starter_kicker"]',
      '[data-i18n-html="hub_mbti.starter_title_html"]',
      '[data-i18n="hub_mbti.starter_badge_recommended"]',
      '[data-i18n="hub_mbti.followup_title"]',
      '#next-tests .next-test-pill'
    ],
    badPatterns: [
      RAW_KEY_RE,
      /Best Next Step/,
      /Go Beyond Type Labels/,
      /Recommended/
    ]
  },
  {
    relPath: 'tests/index.html',
    smokePath: '/portal/tests/',
    selectors: [
      '[data-i18n-html="hub_tests.recovery_blog_title_html"]',
      '[data-i18n="hub_tests.recovery_blog_en_title"]',
      '[data-i18n="hub_tests.recovery_blog_en_desc"]'
    ],
    badPatterns: [
      RAW_KEY_RE,
      /Blog Hubs by Language/,
      /English Blog Hub/,
      /Korean Blog Hub/,
      /Japanese Blog Hub/
    ]
  },
  {
    relPath: 'index.html',
    smokePath: '/portal/',
    selectors: ['body'],
    badPatterns: [RAW_KEY_RE]
  },
  {
    relPath: 'tools/index.html',
    smokePath: '/portal/tools/',
    selectors: ['.quick-start-desc', '.featured .fc-desc', '.routine-desc', '.tools-grid .tc-desc'],
    badPatterns: [RAW_KEY_RE]
  }
];

function getByPath(obj, dottedPath) {
  return dottedPath.split('.').reduce((acc, part) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectLocaleKeys(html) {
  const keys = new Set();
  const regex = /data-i18n(?:-html)?="([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    keys.add(match[1]);
  }
  return [...keys];
}

function hasDataI18nHtmlHandler(html) {
  return (
    html.includes("querySelectorAll('[data-i18n-html]')") ||
    html.includes('querySelectorAll("[data-i18n-html]")')
  );
}

function shouldIgnoreStaticKey(key) {
  return STATIC_KEY_IGNORE.some((pattern) => pattern.test(key));
}

function startStaticServer(rootDir) {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    let requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (requestPath === '/') requestPath = '/index.html';
    let target = path.join(rootDir, requestPath);

    try {
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        target = path.join(target, 'index.html');
      }
      if (!fs.existsSync(target)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      const ext = path.extname(target).toLowerCase();
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      fs.createReadStream(target).pipe(res);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(String(error));
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to bind static server'));
        return;
      }
      resolve({ server, port: address.port });
    });
    server.on('error', reject);
  });
}

async function run() {
  const issues = [];
  const localeData = {};

  for (const locale of LOCALES) {
    localeData[locale] = readJson(path.join(LOCALE_DIR, `${locale}.json`));
  }

  for (const target of TARGET_PAGES) {
    const htmlPath = path.join(PORTAL_ROOT, target.relPath);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const keys = collectLocaleKeys(html);

    if (html.includes('data-i18n-html') && !hasDataI18nHtmlHandler(html)) {
      issues.push(`[static] ${target.relPath}: uses data-i18n-html but has no data-i18n-html render handler`);
    }

    for (const key of keys) {
      if (shouldIgnoreStaticKey(key)) {
        continue;
      }
      for (const locale of LOCALES) {
        if (getByPath(localeData[locale], key) === undefined) {
          issues.push(`[static] ${target.relPath}: missing locale key "${key}" in ${locale}.json`);
        }
      }
    }
  }

  let browser;
  let serverHandle;
  try {
    serverHandle = await startStaticServer(PROJECTS_ROOT);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('app_language', 'ko');
    });

    for (const target of TARGET_PAGES) {
      await page.goto(`http://127.0.0.1:${serverHandle.port}${target.smokePath}?localeAudit=1`, {
        waitUntil: 'networkidle'
      });
      const values = await page.evaluate((selectors) => {
        return selectors.map((selector) => {
          const el = document.querySelector(selector);
          return el ? (el.innerText || el.textContent || '').trim() : '';
        });
      }, target.selectors);

      values.forEach((value, index) => {
        for (const pattern of target.badPatterns) {
          if (pattern.test(value)) {
            issues.push(
              `[smoke] ${target.relPath}: selector "${target.selectors[index]}" rendered suspicious text "${value}"`
            );
            break;
          }
        }
      });
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    if (serverHandle && serverHandle.server) {
      await new Promise((resolve) => serverHandle.server.close(resolve));
    }
  }

  if (issues.length > 0) {
    console.error('portal-hub-locale-audit: FAIL');
    for (const issue of issues) {
      console.error(` - ${issue}`);
    }
    process.exit(1);
  }

  console.log('portal-hub-locale-audit: PASS');
}

run().catch((error) => {
  console.error('portal-hub-locale-audit: ERROR');
  console.error(error.stack || String(error));
  process.exit(1);
});
