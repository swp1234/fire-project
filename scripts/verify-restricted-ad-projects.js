#!/usr/bin/env node
// Fails closed: legacy apps placed under the invalid-traffic restriction must
// remain free of every executable/manual AdSense pattern.

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { inspectProject } = require('./ad-risk-inventory');
const { MARKER, PROJECTS, cleanHtml, cleanScript } = require('./suspend-restricted-ad-projects');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_EXTENSIONS = new Set(['.html', '.htm', '.js', '.mjs']);
function assert(value, message) { if (!value) throw new Error(message); }

function sources(project) {
  const root = path.join(ROOT, 'projects', project);
  const result = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        result.push({ relative:path.relative(root, file).replace(/\\/g, '/'), source:fs.readFileSync(file, 'utf8') });
      }
    }
  }
  visit(root);
  return result;
}

function verifyProject(project) {
  const files = sources(project);
  const html = files.filter((file) => /\.html?$/i.test(file.relative));
  assert(html.length > 0, `${project}: no HTML entry point`);
  for (const file of html) {
    assert(/data-ad-serving="suspended-invalid-traffic-\d{4}-\d{2}-\d{2}"/i.test(file.source), `${project}/${file.relative}: restriction marker missing`);
    assert(cleanHtml(file.source) === file.source, `${project}/${file.relative}: suspension migration is not idempotent`);
  }
  for (const file of files.filter((item) => !/\.html?$/i.test(item.relative))) {
    assert(cleanScript(file.source) === file.source, `${project}/${file.relative}: manual ad request remains`);
  }
  const inventory = inspectProject(project, files);
  assert(inventory.severity === 'clean', `${project}: restricted project has ad risk: ${inventory.findings.map((item) => item.id).join(', ')}`);
}

function mutationTest() {
  const project = PROJECTS[0];
  const file = sources(project).find((item) => /\.html?$/i.test(item.relative));
  assert(file, 'mutation fixture missing');
  const mutated = { ...file, source:file.source.replace('</body>', '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-x"></script></body>') };
  assert(cleanHtml(mutated.source) !== mutated.source, 'loader mutation escaped suspension migration');
  console.log('[PASS] restricted-ad verifier mutation: loader return detected');
}

async function startServer() {
  const types = { '.css':'text/css', '.html':'text/html', '.js':'application/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.webmanifest':'application/manifest+json' };
  const projectsRoot = path.join(ROOT, 'projects');
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let target = path.resolve(projectsRoot, pathname.replace(/^\/+/, ''));
      assert(target === projectsRoot || target.startsWith(`${projectsRoot}${path.sep}`), `Unsafe request path: ${pathname}`);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return response.writeHead(404).end();
      response.writeHead(200, { 'Cache-Control':'no-store', 'Content-Type':`${types[path.extname(target).toLowerCase()] || 'application/octet-stream'}; charset=utf-8` });
      response.end(fs.readFileSync(target));
    } catch (error) { response.writeHead(400).end(error.message); }
  });
  const address = await listenOnSafePort(server);
  return { origin:`http://127.0.0.1:${address.port}`, close:() => new Promise((resolve) => server.close(resolve)) };
}

async function verifyRuntime() {
  const server = await startServer();
  const browser = await chromium.launch({ headless:true });
  try {
    for (const project of ['habit-tracker', 'puzzle-2048', 'block-puzzle', 'typing-speed']) {
      const context = await browser.newContext({ viewport:{ width:1280, height:800 }, serviceWorkers:'block' });
      const page = await context.newPage();
      const errors = [];
      const adRequests = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (/pagead2\.googlesyndication\.com|\/portal\/js\/game-ads\.js/i.test(request.url())) adRequests.push(request.url());
      });
      await page.route('**/*', (route) => new URL(route.request().url()).origin === server.origin ? route.continue() : route.abort());
      await page.goto(`${server.origin}/${project}/`, { waitUntil:'domcontentloaded', timeout:20000 });
      await page.waitForTimeout(250);
      const report = await page.evaluate(() => ({
        manual:document.querySelectorAll('ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').length,
        marker:document.documentElement.getAttribute('data-ad-serving') || document.body.getAttribute('data-ad-serving') || '',
      }));
      assert(errors.length === 0, `${project}: runtime errors: ${errors.join(' | ')}`);
      assert(adRequests.length === 0, `${project}: ad request escaped containment: ${adRequests.join(', ')}`);
      assert(report.manual === 0, `${project}: manual ad DOM remains (${report.manual})`);
      assert(/^suspended-invalid-traffic-\d{4}-\d{2}-\d{2}$/.test(report.marker), `${project}: runtime suspension marker missing`);
      await context.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }
  console.log('[PASS] restricted-ad runtime: 4 representative apps loaded without ad requests or page errors');
}

async function main() {
  for (const project of PROJECTS) verifyProject(project);
  if (process.argv.includes('--mutations')) mutationTest();
  await verifyRuntime();
  console.log(`[PASS] restricted-ad projects: ${PROJECTS.length} clean, marked, and idempotent`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
