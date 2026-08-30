#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const TARGETS = ['blood-type', 'mbti-love'];
const FORBIDDEN = [
  /watch ad\s*\(/i,
  /loading ad/i,
  /ad playing/i,
  /premium unlocked/i,
  /\bid=["'](?:ad-overlay|ad-countdown|watch-ad-btn|premium-modal)["']/i,
  /\bAI[- ]powered\b/i,
  /\bAI deep\b/i,
];

function fail(message) {
  throw new Error(message);
}

function listTextFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listTextFiles(target));
    else if (/\.(?:html|js|json|webmanifest)$/i.test(entry.name)) files.push(target);
  }
  return files;
}

function staticIssues() {
  const issues = [];
  for (const project of TARGETS) {
    for (const file of listTextFiles(path.join(PROJECTS, project))) {
      const source = fs.readFileSync(file, 'utf8');
      for (const pattern of FORBIDDEN) {
        if (pattern.test(source)) issues.push(`${path.relative(ROOT, file).replace(/\\/g, '/')}: ${pattern}`);
      }
    }
  }
  return issues;
}

function selfTest() {
  for (const pattern of FORBIDDEN) {
    const sample = pattern.source.includes('ad-overlay') ? '<div id="ad-overlay">' : (
      pattern.source.includes('AI') ? 'AI-powered AI deep' : 'Watch Ad (30 sec) Loading Ad Ad Playing Premium Unlocked'
    );
    if (!pattern.test(sample)) fail(`forbidden-pattern self-test failed: ${pattern}`);
  }
  console.log(`[PASS] fake unlock static mutations: ${FORBIDDEN.length}/${FORBIDDEN.length}`);
}

function createServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(PROJECTS, pathname.replace(/^\/+/, ''));
    if (!file.startsWith(`${PROJECTS}${path.sep}`) || !fs.existsSync(file)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
    const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
    response.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
}

async function listen(server) {
  for (let port = 24600; port < 24650; port += 1) {
    try {
      await new Promise((resolve, reject) => {
        const onError = error => { server.off('listening', onListening); reject(error); };
        const onListening = () => { server.off('error', onError); resolve(); };
        server.once('error', onError); server.once('listening', onListening); server.listen(port, '127.0.0.1');
      });
      return port;
    } catch (error) {
      if (!['EADDRINUSE', 'EACCES'].includes(error.code)) throw error;
    }
  }
  fail('no safe local verification port available');
}

async function runBrowser() {
  const server = createServer();
  const port = await listen(server);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(`http://127.0.0.1:${port}/blood-type/?lang=en`, { waitUntil: 'domcontentloaded' });
    await page.click('.blood-type-btn[data-blood-type="A"]');
    await page.waitForSelector('#results-screen.active');
    const bloodStart = Date.now();
    await page.click('#premium-btn-personality');
    await page.waitForSelector('.premium-analysis');
    const blood = await page.evaluate(() => ({
      detail: document.querySelector('.premium-analysis')?.innerText || '',
      hasFakeModal: Boolean(document.querySelector('#premium-modal, #watch-ad-btn')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    blood.elapsedMs = Date.now() - bloodStart;

    await page.goto(`http://127.0.0.1:${port}/mbti-love/?lang=en`, { waitUntil: 'domcontentloaded' });
    await page.click('#btn-start');
    for (let index = 0; index < 12; index += 1) {
      await page.waitForSelector('.option-btn:not([disabled])');
      await page.click('.option-btn:not([disabled])');
      await page.waitForTimeout(380);
    }
    await page.waitForSelector('#result-screen.active', { timeout: 10000 });
    const mbtiStart = Date.now();
    await page.click('#btn-premium');
    await page.waitForSelector('#premium-result:not(.hidden)');
    const mbti = await page.evaluate(() => ({
      detail: document.querySelector('#premium-result')?.innerText || '',
      hasFakeModal: Boolean(document.querySelector('#ad-overlay, #ad-countdown')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    mbti.elapsedMs = Date.now() - mbtiStart;

    if (!blood.detail.includes('cultural folklore') || blood.hasFakeModal || blood.overflow > 0 || blood.elapsedMs > 1000) fail('Blood Type immediate detail contract failed');
    if (!mbti.detail || mbti.hasFakeModal || mbti.overflow > 0 || mbti.elapsedMs > 1000) fail('MBTI Love immediate detail contract failed');
    if (errors.length) fail(`page errors: ${errors.join(' | ')}`);
    console.log(JSON.stringify({ blood, mbti, errors }, null, 2));
    console.log('PASS: fake unlock gates removed');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

async function main() {
  selfTest();
  const issues = staticIssues();
  if (issues.length) fail(`fake unlock source issue(s):\n- ${issues.join('\n- ')}`);
  await runBrowser();
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
