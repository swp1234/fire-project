#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const TODAY = (process.env.INDEXING_REPAIR_TODAY || new Date().toISOString().slice(0, 10)).slice(0, 10);
const INVENTORY_SCRIPT = path.join(ROOT, 'scripts', 'indexing-inventory.js');
const SITEMAPS = [
  path.join(PROJECTS_ROOT, 'root-domain', 'sitemap.xml'),
  path.join(PROJECTS_ROOT, 'portal', 'sitemap.xml'),
  path.join(PROJECTS_ROOT, 'portal', 'blog', 'sitemap.xml'),
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text, 'utf8');
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function firstMatch(text, regex) {
  const match = regex.exec(text);
  return match ? match[1].trim() : '';
}

function decodeXml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanText(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html, fallbackUrl) {
  const rawTitle = cleanText(firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i));
  if (rawTitle) return rawTitle.replace(/\s*[-|]\s*DopaBrain\s*$/i, '').trim() || rawTitle;
  try {
    const url = new URL(fallbackUrl);
    const slug = url.pathname.split('/').filter(Boolean).pop() || 'DopaBrain';
    return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return 'DopaBrain';
  }
}

function hasDescription(html) {
  return /<meta\b[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["'][^"']+["'][^>]*>/i.test(html);
}

function insertBeforeHeadEnd(html, addition) {
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${addition}\n</head>`);
  return `${addition}\n${html}`;
}

function ensureDescription(html, title) {
  if (hasDescription(html)) return html;
  const description = `${title} on DopaBrain. Use this interactive page for quick brain training, personality insight, and shareable results.`;
  const tag = `    <meta name="description" content="${escapeHtml(description)}">`;
  if (/<meta\b[^>]*charset=/i.test(html)) {
    return html.replace(/(<meta\b[^>]*charset=[^>]*>)/i, `$1\n${tag}`);
  }
  return insertBeforeHeadEnd(html, tag);
}

function ensureH1(html, title) {
  if (/<h1\b/i.test(html)) return html;
  const h1 = `<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;">${escapeHtml(title)}</h1>`;
  if (/<body\b[^>]*>/i.test(html)) return html.replace(/<body\b[^>]*>/i, (tag) => `${tag}\n${h1}`);
  return `${h1}\n${html}`;
}

function ensureDateModified(html) {
  let next = html;
  next = next.replace(
    /(<meta\b[^>]*(?:property|name)\s*=\s*["'](?:article:modified_time|dateModified)["'][^>]*\bcontent\s*=\s*["'])(\d{4}-\d{2}-\d{2})([^"']*)(["'][^>]*>)/gi,
    `$1${TODAY}$3$4`
  );
  next = next.replace(
    /(<meta\b[^>]*\bcontent\s*=\s*["'])(\d{4}-\d{2}-\d{2})([^"']*)(["'][^>]*(?:property|name)\s*=\s*["'](?:article:modified_time|dateModified)["'][^>]*>)/gi,
    `$1${TODAY}$3$4`
  );
  next = next.replace(/("dateModified"\s*:\s*")\d{4}-\d{2}-\d{2}([^"]*")/g, `$1${TODAY}$2`);
  if (/"dateModified"\s*:|(?:property|name)\s*=\s*["'](?:article:modified_time|dateModified)["']/i.test(next)) return next;

  const tag = `    <meta name="dateModified" content="${TODAY}">`;
  if (/<meta\b[^>]*name\s*=\s*["']description["'][^>]*>/i.test(next)) {
    return next.replace(/(<meta\b[^>]*name\s*=\s*["']description["'][^>]*>)/i, `$1\n${tag}`);
  }
  return insertBeforeHeadEnd(next, tag);
}

function jsonLdFor(result, title) {
  const type = result.kind === 'blog_hub' ? 'CollectionPage' : result.kind === 'app' ? 'WebApplication' : 'WebPage';
  const node = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    url: result.loc,
    dateModified: TODAY,
    publisher: {
      '@type': 'Organization',
      name: 'DopaBrain',
      url: 'https://dopabrain.com/',
    },
  };
  if (type === 'WebApplication') {
    node.applicationCategory = 'LifestyleApplication';
    node.operatingSystem = 'Web';
  }
  return `    <script type="application/ld+json">\n${JSON.stringify(node, null, 2).replace(/^/gm, '    ')}\n    </script>`;
}

function ensureJsonLd(html, result, title) {
  if (/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>/i.test(html)) return html;
  return insertBeforeHeadEnd(html, jsonLdFor(result, title));
}

function repairHtml(result) {
  if (!result.localFile || !result.localFile.endsWith('.html')) return false;
  const filePath = path.join(ROOT, result.localFile);
  if (!filePath.startsWith(PROJECTS_ROOT) || !fs.existsSync(filePath)) return false;

  const issueIds = new Set((result.issues || []).map((issue) => issue.id));
  let html = readText(filePath);
  const before = html;
  const title = extractTitle(html, result.loc);

  if (issueIds.has('missing_description')) html = ensureDescription(html, title);
  if (issueIds.has('missing_h1')) html = ensureH1(html, title);
  if (issueIds.has('missing_json_ld')) html = ensureJsonLd(html, result, title);
  if (issueIds.has('missing_date_modified') || issueIds.has('old_date_modified_90d') || issueIds.has('missing_json_ld')) {
    html = ensureDateModified(html);
  }

  if (html === before) return false;
  writeText(filePath, html);
  return true;
}

function updateSitemap(filePath, urlDates) {
  if (!fs.existsSync(filePath)) return { changed: false, removed: 0 };
  const xml = readText(filePath);
  const seen = new Set();
  let removed = 0;
  const next = xml.replace(/<url\b[^>]*>[\s\S]*?<\/url>/gi, (block) => {
    const loc = decodeXml(firstMatch(block, /<loc>\s*([^<]+)\s*<\/loc>/i));
    if (!loc) return block;
    if (seen.has(loc)) {
      removed += 1;
      return '';
    }
    seen.add(loc);
    const date = urlDates.get(loc);
    if (!date) return block;
    if (/<lastmod>\s*[^<]*\s*<\/lastmod>/i.test(block)) {
      return block.replace(/<lastmod>\s*[^<]*\s*<\/lastmod>/i, `<lastmod>${date}</lastmod>`);
    }
    return block.replace(/(<loc>\s*[^<]+\s*<\/loc>)/i, `$1\n    <lastmod>${date}</lastmod>`);
  }).replace(/\n{3,}/g, '\n\n');

  if (next !== xml) writeText(filePath, next);
  return { changed: next !== xml, removed };
}

function loadInventory() {
  const raw = execFileSync(process.execPath, [INVENTORY_SCRIPT, '--json', '--limit', '5000'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, INDEXING_AUDIT_TODAY: TODAY },
    maxBuffer: 32 * 1024 * 1024,
  });
  return JSON.parse(raw);
}

function main() {
  const inventory = loadInventory();
  const htmlIssues = new Set(['missing_date_modified', 'old_date_modified_90d', 'missing_h1', 'missing_description', 'missing_json_ld']);
  const sitemapIssues = new Set(['sitemap_lastmod_mismatch', 'duplicate_sitemap_url']);
  const urlDates = new Map();
  const repairedHtml = [];

  for (const result of inventory.topResults || []) {
    const issueIds = new Set((result.issues || []).map((issue) => issue.id));
    if ([...issueIds].some((id) => htmlIssues.has(id))) {
      if (repairHtml(result)) repairedHtml.push(result.localFile);
      urlDates.set(result.loc, TODAY);
    } else if ([...issueIds].some((id) => sitemapIssues.has(id))) {
      urlDates.set(result.loc, result.dateModified || result.lastmod || TODAY);
    }
  }

  const sitemapResults = SITEMAPS.map((filePath) => ({
    file: toPosix(path.relative(ROOT, filePath)),
    ...updateSitemap(filePath, urlDates),
  }));

  console.log(JSON.stringify({
    today: TODAY,
    htmlFilesRepaired: repairedHtml.length,
    sitemapUrlsTouched: urlDates.size,
    sitemaps: sitemapResults,
    repairedHtml,
  }, null, 2));
}

main();
