#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { removeInvalidStaticAds } = require('./upgrade-blog-indexing-batch');
const { inspectHtml, verifyHtml } = require('./verify-adsense-contract');
const { PORTAL, loadKeepPaths } = require('./blog-indexing-focus');

function fail(message) {
  throw new Error(message);
}

function writeWithRetry(file, content) {
  let lastError;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      fs.writeFileSync(file, content, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      if (!['EBUSY', 'EPERM', 'UNKNOWN'].includes(error.code)) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 40 * (attempt + 1));
    }
  }
  const backup = `${file}.codex-write-bak`;
  if (fs.existsSync(backup)) fail(`Write fallback backup already exists: ${backup}`);
  try {
    fs.renameSync(file, backup);
    fs.writeFileSync(file, content, 'utf8');
    fs.unlinkSync(backup);
  } catch (error) {
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
      if (fs.existsSync(backup)) fs.renameSync(backup, file);
    } catch {}
    error.cause = lastError;
    throw error;
  }
}

function fileForPage(pagePath) {
  const relative = pagePath.replace(/^\/portal\//, '').split('/').join(path.sep);
  const file = path.resolve(PORTAL, relative);
  if (!file.startsWith(`${PORTAL}${path.sep}`)) fail(`Page escapes the portal root: ${pagePath}`);
  return file;
}

function listHtml(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listHtml(target));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(target);
  }
  return files;
}

function removeManualPushCalls(html) {
  return String(html).replace(
    /\(?\s*(?:window\.)?adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\s*\)?\s*\.push\s*\(\s*\{\s*\}\s*\)\s*;?/gi,
    ''
  );
}

function removeCallAt(source, start) {
  const open = source.indexOf('(', start);
  if (open < 0) return source;
  const end = findCallEnd(source, open);
  return end < 0 ? source : source.slice(0, start) + source.slice(end);
}

function findCallEnd(source, open) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '(') depth += 1;
    if (char !== ')') continue;
    depth -= 1;
    if (depth !== 0) continue;
    let end = index + 1;
    while (/[ \t]/.test(source[end] || '')) end += 1;
    if (source[end] === ';') end += 1;
    return end;
  }
  return -1;
}

function removeFakeImpressionCalls(html) {
  let next = String(html);
  const patterns = [
    /\b(?:track|trackContentEvent|sendContentEvent|pushContentEvent)\s*\(\s*(['"])content_ad_impression\1/i,
    /\bgtag\s*\(\s*(['"])event\1\s*,\s*(['"])content_ad_impression\2/i,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(next))) next = removeCallAt(next, match.index);
  }
  return next;
}

function dedupeAutoAdsLoaders(html) {
  let seen = false;
  return String(html).replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:\/portal\/js\/ad-loader\.js|pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=)[^"']*["'][^>]*>\s*<\/script>/gi, (tag) => {
    if (seen) return '';
    seen = true;
    return tag;
  });
}

function removeFakeImpressionLoops(html) {
  let next = String(html);
  const pattern = /document\.querySelectorAll\(\s*['"]\[data-ad-surface\]['"]\s*\)\.forEach\s*\(/i;
  let searchFrom = 0;
  while (searchFrom < next.length) {
    const match = pattern.exec(next.slice(searchFrom));
    if (!match) break;
    const matchStart = searchFrom + match.index;
    const open = matchStart + match[0].lastIndexOf('(');
    let end = findCallEnd(next, open);
    if (end < 0) break;
    const lineStart = next.lastIndexOf('\n', matchStart - 1) + 1;
    const start = /^\s*$/.test(next.slice(lineStart, matchStart)) ? lineStart : matchStart;
    const block = next.slice(start, end);
    if (!/\bcontent_ad_impression\b/.test(block)) {
      searchFrom = end;
      continue;
    }
    while (/[ \t]/.test(next[end] || '')) end += 1;
    if (next.slice(end, end + 2) === '\r\n') end += 2;
    else if (next[end] === '\n') end += 1;
    next = next.slice(0, start) + next.slice(end);
    searchFrom = start;
  }
  return next;
}

function removeOrphanedImpressionClosers(html) {
  return String(html).replace(
    /(function\s+emitInitialContentEvents\s*\(\s*\)\s*\{\s*track\(\s*['"]content_view['"]\s*\)\s*;)\s*\}\);\s*(\})/g,
    '$1\n            $2'
  );
}

function verifyInlineScriptSyntax(html, label) {
  let count = 0;
  for (const match of String(html).matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1];
    if (/\bsrc\s*=/i.test(attributes) || /application\/(?:ld\+json|json)/i.test(attributes)) continue;
    count += 1;
    try {
      new vm.Script(match[2], { filename: label });
    } catch (error) {
      fail(`${label}: inline script syntax error: ${error.message}`);
    }
  }
  return count;
}

function cleanHtml(html, label) {
  let next = String(html);
  for (let pass = 0; pass < 20; pass += 1) {
    const cleaned = removeInvalidStaticAds(next);
    if (cleaned === next) break;
    next = cleaned;
    if (pass === 19) fail(`${label}: static ad cleanup did not converge`);
  }
  next = removeFakeImpressionLoops(next);
  next = removeFakeImpressionCalls(next);
  next = removeManualPushCalls(next);
  next = dedupeAutoAdsLoaders(next);
  next = next.replace(/\s+data-ad-surface\s*=\s*("[^"]*"|'[^']*')/gi, '');
  next = next.replace(/[ \t]+(?=\r?$)/gm, '');
  return next;
}

function selfTest() {
  const fixture = `<script src="/portal/js/ad-loader.js"></script>
<div class="ad-container"><ins class="adsbygoogle" data-ad-slot="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>
<script>
  function emit() {
    track('content_view');
    document.querySelectorAll('[data-ad-surface]').forEach(function(node, index) {
      track('content_ad_impression', { ad_index: index + 1 });
    });
  }
</script>`;
  const cleaned = cleanHtml(fixture, 'self-test');
  verifyHtml(cleaned, 'self-test');
  if (!cleaned.includes("track('content_view')")) fail('self-test: legitimate telemetry was removed');
  const mixed = cleanHtml('<script src="/portal/js/ad-loader.js"></script><script>prepare(); (adsbygoogle = window.adsbygoogle || []).push({}); done();</script>', 'mixed-script');
  if (!mixed.includes('prepare();') || !mixed.includes('done();') || mixed.includes('adsbygoogle =')) fail('self-test: mixed-script cleanup damaged adjacent logic');
  const flatIndent = `function emitInitialContentEvents() {
    track('content_view');
    document.querySelectorAll('[data-ad-surface]').forEach(function(node, index) {
    track('content_ad_impression', { ad_index: index + 1 });
    });
  }`;
  const flatCleaned = removeOrphanedImpressionClosers(removeFakeImpressionCalls(removeFakeImpressionLoops(flatIndent)));
  if (flatCleaned.includes('content_ad_impression') || flatCleaned.includes('forEach')) fail('self-test: flat-indented loop survived');
  new Function('track', flatCleaned);
  console.log('[PASS] indexable blog ad cleaner self-test');
}

function run({ apply = false } = {}) {
  const { keep } = loadKeepPaths();
  const blogRoot = path.join(PORTAL, 'blog');
  const pending = new Map();
  const failures = [];
  let dirtyBefore = 0;
  let inlineScripts = 0;
  let syntheticBefore = 0;

  for (const file of listHtml(blogRoot)) {
    const original = fs.readFileSync(file, 'utf8');
    const withoutSynthetic = removeOrphanedImpressionClosers(removeFakeImpressionCalls(removeFakeImpressionLoops(original)));
    const cleaned = withoutSynthetic.replace(/[ \t]+(?=\r?$)/gm, '');
    if (withoutSynthetic !== original) syntheticBefore += 1;
    try {
      inlineScripts += verifyInlineScriptSyntax(cleaned, path.relative(PORTAL, file));
    } catch (error) {
      failures.push(error.message);
    }
    pending.set(file, { file, original, cleaned });
  }

  for (const pagePath of [...keep].sort()) {
    const file = fileForPage(pagePath);
    if (!fs.existsSync(file)) {
      failures.push(`${pagePath}: file is missing`);
      continue;
    }
    const item = pending.get(file);
    const original = item ? item.original : fs.readFileSync(file, 'utf8');
    const before = inspectHtml(original);
    if (before.invalidAutoSlots || before.manualUnits || before.manualPushes || before.staticAdSurfaces || before.paidImpressionClaims) dirtyBefore += 1;
    try {
      const cleaned = cleanHtml(item ? item.cleaned : original, pagePath);
      verifyHtml(cleaned, pagePath);
      pending.set(file, { file, original, cleaned });
    } catch (error) {
      failures.push(error.message);
    }
  }
  if (failures.length) fail(`${failures.length} indexable ad cleanup issue(s):\n- ${failures.slice(0, 30).join('\n- ')}`);

  const changed = [...pending.values()].filter((item) => item.cleaned !== item.original);
  if (apply) for (const item of changed) writeWithRetry(item.file, item.cleaned);
  if (!apply && changed.length) fail(`${changed.length} blog page(s) still require ad cleanup; run with --apply`);
  console.log(`[PASS] blog ad events: scanned=${pending.size}, inlineScripts=${inlineScripts}, syntheticBefore=${syntheticBefore}; retained=${keep.size}, dirtyBefore=${dirtyBefore}, changed=${apply ? changed.length : 0}`);
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

module.exports = { cleanHtml, removeFakeImpressionCalls, removeFakeImpressionLoops, removeManualPushCalls };
