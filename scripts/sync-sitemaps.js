#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const ROOT_DOMAIN_ROOT = path.join(PROJECTS_ROOT, 'root-domain');
const PORTAL_ROOT = path.join(PROJECTS_ROOT, 'portal');
const ORIGIN = 'https://dopabrain.com';

const SITEMAP_FILES = [
  { path: path.join(ROOT_DOMAIN_ROOT, 'sitemap.xml'), label: 'root-domain/sitemap.xml' },
  { path: path.join(PORTAL_ROOT, 'sitemap.xml'), label: 'portal/sitemap.xml' },
  { path: path.join(PORTAL_ROOT, 'blog', 'sitemap.xml'), label: 'portal/blog/sitemap.xml' }
];

function decodeXml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function firstMatch(text, regex) {
  const match = regex.exec(text);
  return match ? match[1].trim() : '';
}

function isPathInside(root, target) {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
}

function resolveInside(root, ...parts) {
  const resolved = path.resolve(root, ...parts);
  return isPathInside(root, resolved) ? resolved : '';
}

function mapUrlToLocalPath(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.origin !== ORIGIN) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }

  if (pathname === '/' || pathname === '') return path.join(ROOT_DOMAIN_ROOT, 'index.html');
  if (pathname.startsWith('/portal/')) {
    const rel = pathname.replace(/^\/portal\//, '');
    const base = resolveInside(PORTAL_ROOT, rel);
    if (!base) return null;
    return pathname.endsWith('/') ? resolveInside(PORTAL_ROOT, rel, 'index.html') : base;
  }

  const parts = pathname.replace(/^\/+/, '').split('/');
  const app = parts.shift();
  if (!app) return path.join(ROOT_DOMAIN_ROOT, 'index.html');
  const base = resolveInside(PROJECTS_ROOT, app, ...parts);
  if (!base) return null;
  return pathname.endsWith('/') ? resolveInside(PROJECTS_ROOT, app, ...parts, 'index.html') : base;
}

function extractDateModified(html) {
  // 1. JSON-LD dateModified
  const jsonLdRegex = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdRegex.exec(html))) {
    const raw = decodeXml(match[1].trim());
    try {
      const parsed = JSON.parse(raw);
      const nodes = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
      for (const node of nodes) {
        if (node && node.dateModified) return String(node.dateModified).slice(0, 10);
      }
    } catch (_) {}
  }

  // 2. Meta tags
  const metaMatch = firstMatch(html, /<meta\b[^>]*(?:property|name)\s*=\s*["'](?:article:modified_time|dateModified)["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
  if (metaMatch) return metaMatch.slice(0, 10);

  // 3. Fallback regex
  const fallback = firstMatch(html, /"dateModified"\s*:\s*"([^"]+)"/i);
  if (fallback) return fallback.slice(0, 10);

  return '';
}

function syncSitemaps(options = {}) {
  const { apply = false, targetUrls = null, submitIndexnow = false } = options;
  const updatedUrls = new Set();
  const mismatches = [];

  for (const sitemap of SITEMAP_FILES) {
    if (!fs.existsSync(sitemap.path)) continue;
    let xml = fs.readFileSync(sitemap.path, 'utf8');
    let modifiedXml = xml;
    let sitemapChanged = false;

    const urlBlockRegex = /<url\b[^>]*>([\s\S]*?)<\/url>/gi;
    let match;
    while ((match = urlBlockRegex.exec(xml))) {
      const fullBlock = match[0];
      const inner = match[1];
      const loc = decodeXml(firstMatch(inner, /<loc>\s*([^<]+)\s*<\/loc>/i));
      const lastmod = decodeXml(firstMatch(inner, /<lastmod>\s*([^<]+)\s*<\/lastmod>/i));

      if (!loc) continue;
      if (targetUrls && !targetUrls.has(loc)) continue;

      const localFile = mapUrlToLocalPath(loc);
      if (!localFile || !fs.existsSync(localFile)) continue;

      const html = fs.readFileSync(localFile, 'utf8');
      const htmlDate = extractDateModified(html);

      if (htmlDate && lastmod && htmlDate !== lastmod) {
        mismatches.push({
          loc,
          sitemap: sitemap.label,
          sitemapDate: lastmod,
          htmlDate,
          localFile: path.relative(ROOT, localFile)
        });

        if (apply) {
          const newBlock = fullBlock.replace(
            /<lastmod>\s*[^<]+\s*<\/lastmod>/i,
            `<lastmod>${htmlDate}</lastmod>`
          );
          modifiedXml = modifiedXml.replace(fullBlock, newBlock);
          sitemapChanged = true;
          updatedUrls.add(loc);
        }
      }
    }

    if (apply && sitemapChanged) {
      fs.writeFileSync(sitemap.path, modifiedXml, 'utf8');
      console.log(`[UPDATED] ${sitemap.label}`);
    }
  }

  if (submitIndexnow && updatedUrls.size > 0) {
    console.log(`Submitting ${updatedUrls.size} URLs to IndexNow...`);
    for (const url of updatedUrls) {
      try {
        const out = execSync(`node scripts/indexnow-submit.js --url ${url}`, { encoding: 'utf8' });
        console.log(`[INDEXNOW 200] ${url}`);
      } catch (err) {
        console.error(`[INDEXNOW ERR] ${url}: ${err.message}`);
      }
    }
  }

  return { mismatches, updatedUrls: Array.from(updatedUrls) };
}

function selfTest() {
  const dummyHtml = `
    <html>
    <head>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","dateModified":"2026-11-12"}</script>
    </head>
    </html>
  `;
  const date = extractDateModified(dummyHtml);
  if (date !== '2026-11-12') throw new Error(`Self-test failed: expected 2026-11-12, got ${date}`);
  console.log('[PASS] sync-sitemaps self-test passed');
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    selfTest();
    return;
  }

  const apply = args.includes('--apply');
  const submitIndexnow = args.includes('--submit-indexnow');
  const check = args.includes('--check');

  let targetUrls = null;
  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    targetUrls = new Set([args[urlIdx + 1]]);
  }

  const { mismatches, updatedUrls } = syncSitemaps({ apply, targetUrls, submitIndexnow });

  if (mismatches.length === 0) {
    console.log('[CLEAN] All sitemap lastmod dates match HTML dateModified.');
  } else {
    console.log(`Found ${mismatches.length} date mismatch(es):`);
    for (const m of mismatches) {
      console.log(`  - ${m.loc} (sitemap: ${m.sitemapDate} vs HTML: ${m.htmlDate})`);
    }
    if (!apply) {
      console.log('Run with --apply to synchronize sitemaps with HTML dateModified.');
      if (check) process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { syncSitemaps, extractDateModified, mapUrlToLocalPath };
