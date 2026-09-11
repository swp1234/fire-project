#!/usr/bin/env node
// Removes executable AdSense code from legacy apps while an invalid-traffic
// serving restriction is active. The target list is intentionally explicit:
// adding a project requires a reviewed source change, not a broad glob.

const fs = require('fs');
const path = require('path');
const { removeInvalidStaticAds } = require('./upgrade-blog-indexing-batch');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = Object.freeze([
  'aspect-ratio-calculator', 'aura-reading', 'blood-type', 'brain-type',
  'block-puzzle', 'burnout-test', 'data-transfer-calculator', 'dev-quiz', 'eq-test',
  'file-extension-converter', 'file-size-converter', 'flappy-bird',
  'habit-tracker', 'hail-mary-mode', 'image-format-converter', 'mbti-city',
  'image-size-converter', 'inner-child-test', 'json-formatter', 'mental-age',
  'past-life', 'puzzle-2048', 'qr-generator', 'quiz-app', 'reaction-test',
  'road-shooter', 'routine-planner', 'social-battery', 'stress-response',
  'text-case-converter', 'timezone-converter', 'todo-list', 'typing-speed',
  'unix-timestamp-converter', 'villain-type', 'word-guess',
]);
const MARKER = 'suspended-invalid-traffic-2026-09-11';
const SOURCE_EXTENSIONS = new Set(['.html', '.htm', '.js', '.mjs']);

function assert(value, message) { if (!value) throw new Error(message); }

function trackedFiles(project) {
  const root = path.join(ROOT, 'projects', project);
  assert(fs.existsSync(root), `Missing project: ${project}`);
  const results = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) results.push(file);
    }
  }
  visit(root);
  return results;
}

function removeManualPushes(source) {
  let next = String(source).replace(
    /\(?\s*(?:window\.)?adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\s*\)?\s*\.push\s*\(\s*\{\s*\}\s*\)\s*;?/gi,
    '',
  );
  // A few legacy apps used the old page-level object form. It is still an
  // executable manual request, so remove the whole bounded call rather than
  // leaving a suspended page able to request ads.
  next = next.replace(/(?:window\.)?adsbygoogle\s*\.push\s*\(\s*\{[\s\S]{0,500}?\}\s*\)\s*;?/gi, '');
  return next;
}

function removeLoaders(source) {
  return String(source)
    .replace(/<script\b(?=[^>]*\bsrc\s*=\s*["'][^"']*(?:pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js|\/portal\/js\/ad-loader\.js)[^"']*["'])[^>]*>\s*<\/script>\s*/gi, '')
    .replace(/<script\b(?=[^>]*\bsrc\s*=\s*["'][^"']*\/portal\/js\/game-ads\.js[^"']*["'])[^>]*>\s*<\/script>\s*/gi, '')
    .replace(/<link\b(?=[^>]*\b(?:href)\s*=\s*["'][^"']*pagead2\.googlesyndication\.com[^"']*["'])[^>]*>\s*/gi, '');
}

function addMarker(source) {
  if (/data-ad-serving\s*=\s*["']suspended-invalid-traffic-/i.test(source)) return source;
  if (/<html\b/i.test(source)) return source.replace(/<html\b/i, `<html data-ad-serving="${MARKER}"`);
  return source;
}

function cleanHtml(source) {
  let next = removeLoaders(source);
  for (let pass = 0; pass < 8; pass += 1) {
    const cleaned = removeInvalidStaticAds(next);
    if (cleaned === next) break;
    next = cleaned;
  }
  next = next.replace(/<ins\b(?=[^>]*\bclass\s*=\s*["'][^"']*\badsbygoogle\b)[^>]*>[\s\S]*?<\/ins>\s*/gi, '');
  next = removeManualPushes(next);
  return addMarker(next).replace(/[ \t]+(?=\r?$)/gm, '');
}

function cleanScript(source) {
  return removeManualPushes(removeLoaders(source)).replace(/[ \t]+(?=\r?$)/gm, '');
}

function selfTest() {
  const html = '<!doctype html><html><head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-x"></script></head><body><main>Keep this</main><div class="ad-container"><ins class="adsbygoogle" data-ad-slot="auto"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div></body></html>';
  const cleaned = cleanHtml(html);
  assert(cleaned.includes('Keep this'), 'self-test removed product content');
  assert(cleaned.includes(`data-ad-serving="${MARKER}"`), 'self-test did not add restriction marker');
  assert(!/pagead2|adsbygoogle|data-ad-slot/i.test(cleaned), 'self-test left executable or manual ad code');
  const code = cleanScript('before(); (window.adsbygoogle = window.adsbygoogle || []).push({}); after();');
  assert(code.includes('before();') && code.includes('after();') && !/adsbygoogle/.test(code), 'self-test damaged adjacent script logic');
  console.log('[PASS] restricted-ad suspension migration self-test');
}

function run({ apply = false } = {}) {
  const pending = [];
  for (const project of PROJECTS) {
    for (const file of trackedFiles(project)) {
      const original = fs.readFileSync(file, 'utf8');
      const next = /\.html?$/i.test(file) ? cleanHtml(original) : cleanScript(original);
      if (next !== original) pending.push({ file, next });
    }
  }
  if (!apply && pending.length) throw new Error(`${pending.length} restricted source file(s) require ad suspension; run with --apply`);
  for (const item of pending) fs.writeFileSync(item.file, item.next, 'utf8');
  console.log(`[PASS] restricted-ad suspension: projects=${PROJECTS.length}, changed=${apply ? pending.length : 0}`);
}

if (require.main === module) {
  try {
    if (process.argv.includes('--self-test')) selfTest();
    run({ apply: process.argv.includes('--apply') });
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { MARKER, PROJECTS, cleanHtml, cleanScript, run, selfTest };
