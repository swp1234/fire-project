#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { verifyHtml } = require('./verify-adsense-contract');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const BLOG = path.join(PORTAL, 'blog');
const SNAPSHOT = path.join(ROOT, 'scripts', 'specs', 'blog-organic-focus-2026-08-28.json');
const SITEMAPS = [path.join(PORTAL, 'sitemap.xml'), path.join(BLOG, 'sitemap.xml')];
const MARKER = '<meta name="robots" content="noindex,follow" data-indexing-focus="2026-08-29">';
const FOCUS_META = /\s*<meta\b[^>]*data-indexing-focus=["'][^"']+["'][^>]*>\s*/gi;
const ROBOTS_META = /<meta\b[^>]*name=["']robots["'][^>]*>/gi;

function fail(message) {
  throw new Error(message);
}

function listHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtml(target);
    return entry.isFile() && entry.name.endsWith('.html') ? [target] : [];
  });
}

function pagePath(file) {
  return `/portal/${path.relative(PORTAL, file).split(path.sep).join('/')}`;
}

function extract(html, expression) {
  return html.match(expression)?.[1]?.trim() || '';
}

function isRedirectStub(html, currentPath) {
  const canonical = extract(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || extract(html, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const refresh = extract(html, /<meta\b[^>]*http-equiv=["']refresh["'][^>]*content=["'][^;]+;\s*url=([^"']+)["'][^>]*>/i);
  if (!canonical || !refresh) return false;
  let canonicalPath;
  let refreshPath;
  try {
    canonicalPath = new URL(canonical, 'https://dopabrain.com').pathname.replace(/\/$/, '');
    refreshPath = new URL(refresh, `https://dopabrain.com${currentPath}`).pathname.replace(/\/$/, '');
  } catch {
    return false;
  }
  return canonicalPath !== currentPath.replace(/\/$/, '')
    && canonicalPath === refreshPath
    && (/<title\b[^>]*>\s*Redirecting\.\.\.\s*<\/title>/i.test(html)
      || /window\.location\.(?:replace|href)\s*=/i.test(html));
}

function loadSnapshot() {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const pages = snapshot.pages || [];
  const unique = new Set(pages.map((row) => row.path));
  const sessions = pages.reduce((total, row) => total + Number(row.sessions || 0), 0);
  if (snapshot.schemaVersion !== 1) fail('Organic focus snapshot schemaVersion must be 1');
  if (snapshot.window?.minimumSessions !== 2) fail('Organic focus threshold must remain two sessions');
  if (pages.length !== snapshot.evidence?.retainedPages || unique.size !== pages.length) fail('Organic focus retained page count is inconsistent');
  if (sessions !== snapshot.evidence?.retainedSessions) fail('Organic focus retained session total is inconsistent');
  if (pages.some((row) => !row.path.startsWith('/portal/blog/') || !row.path.endsWith('.html') || row.sessions < 2)) {
    fail('Organic focus snapshot contains an invalid page row');
  }
  return snapshot;
}

function sitemapPaths() {
  const paths = new Set();
  for (const file of SITEMAPS) {
    const xml = fs.readFileSync(file, 'utf8');
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const pathname = new URL(match[1]).pathname;
      if (pathname.startsWith('/portal/blog/') && pathname.endsWith('.html')) paths.add(pathname);
    }
  }
  return paths;
}

function loadKeepPaths() {
  const snapshot = loadSnapshot();
  const evidence = new Set(snapshot.pages.map((row) => row.path));
  const submitted = sitemapPaths();
  return { snapshot, evidence, submitted, keep: new Set([...evidence, ...submitted]) };
}

function addNoindex(html) {
  const eol = html.includes('\r\n') ? '\r\n' : '\n';
  const existing = Array.from(html.matchAll(ROBOTS_META));
  if (existing.length > 0) {
    return html.replace(ROBOTS_META, (meta, offset) => offset === existing[0].index ? MARKER : '');
  }
  if (/<meta\b[^>]*charset=/i.test(html)) {
    return html.replace(/(<meta\b[^>]*charset=[^>]*>)/i, `$1${eol}    ${MARKER}`);
  }
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/(<head\b[^>]*>)/i, `$1${eol}    ${MARKER}`);
  fail('HTML document has no head insertion point');
}

function removeFocusNoindex(html) {
  return html.replace(FOCUS_META, (match) => match.includes('\r\n') ? '\r\n' : '\n');
}

function inspect({ apply = false } = {}) {
  const { snapshot, submitted, keep } = loadKeepPaths();
  const files = listHtml(BLOG).filter((file) => path.basename(file) !== 'index.html');
  const failures = [];
  const counts = { articles: files.length, redirects: 0, kept: 0, excluded: 0, changed: 0 };

  for (const file of files) {
    const pathname = pagePath(file);
    const original = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(original, pathname)) {
      counts.redirects += 1;
      if (original.includes('data-indexing-focus=')) failures.push(`${pathname}: redirect stub has a focus marker`);
      continue;
    }

    const shouldKeep = keep.has(pathname);
    let updated = original;
    if (apply) updated = shouldKeep ? removeFocusNoindex(original) : addNoindex(original);
    if (updated !== original) {
      fs.writeFileSync(file, updated, 'utf8');
      counts.changed += 1;
    }

    const robots = Array.from(updated.matchAll(ROBOTS_META)).map((match) => match[0]);
    const noindex = robots.filter((meta) => /\bnoindex\b/i.test(meta));
    if (shouldKeep) {
      counts.kept += 1;
      if (noindex.length) failures.push(`${pathname}: retained page is noindex`);
      try {
        verifyHtml(updated, pathname);
      } catch (error) {
        failures.push(error.message);
      }
    } else {
      counts.excluded += 1;
      if (noindex.length !== 1 || !noindex[0].includes('data-indexing-focus=')) {
        failures.push(`${pathname}: excluded page must have exactly one focus noindex marker`);
      }
    }
  }

  for (const pathname of keep) {
    const file = path.join(PORTAL, pathname.replace(/^\/portal\//, '').split('/').join(path.sep));
    if (!fs.existsSync(file)) failures.push(`${pathname}: retained page file is missing`);
  }
  if (counts.articles !== 1978) failures.push(`article inventory drift: expected 1978, got ${counts.articles}`);
  if (counts.redirects !== 206) failures.push(`redirect inventory drift: expected 206, got ${counts.redirects}`);
  if (failures.length) fail(`${failures.length} indexing focus issue(s):\n- ${failures.slice(0, 20).join('\n- ')}`);

  console.log(`[PASS] blog indexing focus: articles=${counts.articles}, redirects=${counts.redirects}, kept=${counts.kept}, noindex=${counts.excluded}, changed=${counts.changed}`);
  console.log(`[PASS] evidence: ${snapshot.evidence.retainedSessions}/${snapshot.evidence.sourceSessions} organic sessions retained; submitted=${submitted.size}`);
  return counts;
}

function selfTest() {
  const base = '<!doctype html>\n<html><head>\n<meta charset="utf-8">\n<title>Page</title></head></html>';
  const excluded = addNoindex(base);
  if (!excluded.includes(MARKER)) fail('self-test: noindex marker was not inserted');
  if (addNoindex(excluded) !== excluded) fail('self-test: noindex insertion is not idempotent');
  if (removeFocusNoindex(excluded).includes('noindex')) fail('self-test: retained page kept the focus marker');
  const redirect = '<html><head><title>Redirecting...</title><link rel="canonical" href="https://dopabrain.com/portal/blog/en/new.html"><meta http-equiv="refresh" content="0; url=/portal/blog/en/new.html"></head><script>window.location.replace("/portal/blog/en/new.html")</script></html>';
  if (!isRedirectStub(redirect, '/portal/blog/en/old.html')) fail('self-test: redirect stub was not protected');
  console.log('[PASS] blog indexing focus self-test');
}

function main() {
  if (process.argv.includes('--self-test')) selfTest();
  inspect({ apply: process.argv.includes('--apply') });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { BLOG, PORTAL, isRedirectStub, listHtml, loadKeepPaths, pagePath };
