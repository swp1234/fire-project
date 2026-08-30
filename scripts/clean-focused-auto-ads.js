#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {
  assertCleanupInvariants,
  cleanHtml,
  inspectHtml,
  verifyInlineScriptSyntax,
  verifyInventoryHtml,
} = require('./clean-indexable-blog-ads');
const { loadSitemapEntries, mapUrlToLocalPath } = require('./indexing-inventory');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');

function fail(message) {
  throw new Error(message);
}

function writeWithRetry(file, content) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      fs.writeFileSync(file, content);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function focusedHtmlFiles() {
  const files = new Set();
  for (const entry of loadSitemapEntries()) {
    const mapped = mapUrlToLocalPath(entry.loc);
    if (!mapped.file || !fs.existsSync(mapped.file) || path.extname(mapped.file).toLowerCase() !== '.html') continue;
    files.add(mapped.file);
  }
  return [...files].sort();
}

function linkedLocalScripts(htmlFile, html) {
  const scripts = new Set();
  for (const match of String(html).matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const source = match[1].split(/[?#]/)[0];
    if (/^(?:https?:)?\/\//i.test(source)) continue;
    let file = '';
    if (source.startsWith('/portal/')) file = path.resolve(PORTAL, source.slice('/portal/'.length));
    else if (!source.startsWith('/')) file = path.resolve(path.dirname(htmlFile), source);
    if (file && fs.existsSync(file) && path.extname(file).toLowerCase() === '.js') scripts.add(file);
  }
  return scripts;
}

function verifyLinkedScript(source, label) {
  new vm.Script(source, { filename: label });
  if (/\(?\s*(?:window\.)?adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\s*\)?\s*\.push\s*\(/i.test(source)) {
    fail(`${label}: linked script can issue a manual adsbygoogle.push`);
  }
  if (/\bdata-ad-surface\b/i.test(source)) fail(`${label}: linked script depends on a static ad surface`);
  if (/\b[A-Za-z0-9_]*ad_impression\b/i.test(source)) fail(`${label}: linked script emits unverifiable ad-impression telemetry`);
}

function verifyExactAutoAds(html, label) {
  const result = verifyInventoryHtml(html, label);
  const loaders = result.directLoaders + result.managedLoaders;
  if (loaders !== 1) fail(`${label}: expected exactly one Auto Ads loader, got ${loaders}`);
}

function run({ apply = false } = {}) {
  const failures = [];
  const pending = [];
  const scripts = new Set();
  let dirtyBefore = 0;
  let inlineScripts = 0;

  for (const file of focusedHtmlFiles()) {
    const label = path.relative(ROOT, file).replace(/\\/g, '/');
    const original = fs.readFileSync(file, 'utf8');
    for (const script of linkedLocalScripts(file, original)) scripts.add(script);
    const before = inspectHtml(original);
    if (before.invalidAutoSlots || before.manualUnits || before.manualPushes || before.staticAdSurfaces || before.paidImpressionClaims) dirtyBefore += 1;
    const cleaned = cleanHtml(original, label);
    try {
      if (cleanHtml(cleaned, label) !== cleaned) fail(`${label}: cleanup is not idempotent`);
      assertCleanupInvariants(original, cleaned, label);
      verifyExactAutoAds(cleaned, label);
      inlineScripts += verifyInlineScriptSyntax(cleaned, label);
    } catch (error) {
      failures.push(error.message);
    }
    pending.push({ file, original, cleaned });
  }

  for (const file of [...scripts].sort()) {
    const label = path.relative(ROOT, file).replace(/\\/g, '/');
    try {
      verifyLinkedScript(fs.readFileSync(file, 'utf8'), label);
    } catch (error) {
      failures.push(error.message);
    }
  }

  if (failures.length) fail(`${failures.length} focused Auto Ads issue(s):\n- ${failures.slice(0, 30).join('\n- ')}`);
  const changed = pending.filter((item) => item.original !== item.cleaned);
  if (apply) for (const item of changed) writeWithRetry(item.file, item.cleaned);
  if (!apply && changed.length) fail(`${changed.length} focused page(s) still require Auto Ads cleanup; run with --apply`);
  console.log(`[PASS] focused Auto Ads inventory: scanned=${pending.length}, linkedScripts=${scripts.size}, dirtyBefore=${dirtyBefore}, inlineScripts=${inlineScripts}, changed=${apply ? changed.length : 0}`);
}

function selfTest() {
  const fixture = '<title>Keep</title><h1>Keep</h1><script src="/portal/js/ad-loader.js"></script><aside class="ad-card" data-ad-surface="mid"><span>Advertisement</span><ins class="adsbygoogle" data-ad-slot="1234567890"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></aside><p>Reader text</p>';
  const cleaned = cleanHtml(fixture, 'fixture');
  assertCleanupInvariants(fixture, cleaned, 'fixture');
  verifyExactAutoAds(cleaned, 'fixture');
  if (!cleaned.includes('<p>Reader text</p>')) fail('self-test: reader content was removed');
  if (cleanHtml(cleaned, 'fixture') !== cleaned) fail('self-test: cleanup is not idempotent');
  new vm.Script('const ok = true;');
  verifyLinkedScript('function useful() { return true; }', 'linked-fixture');
  let mutationDetected = false;
  try {
    verifyLinkedScript("(window.adsbygoogle = window.adsbygoogle || []).push({}); track('result_ad_impression');", 'linked-mutation');
  } catch {
    mutationDetected = true;
  }
  if (!mutationDetected) fail('self-test: linked manual ad mutation was not detected');
  console.log('[PASS] focused Auto Ads cleaner self-test');
}

function main() {
  if (process.argv.includes('--self-test')) selfTest();
  run({ apply: process.argv.includes('--apply') });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { focusedHtmlFiles, linkedLocalScripts, run, verifyExactAutoAds, verifyLinkedScript };
