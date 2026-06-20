#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const ROOT_DOMAIN_ROOT = path.join(PROJECTS_ROOT, 'root-domain');
const PORTAL_ROOT = path.join(PROJECTS_ROOT, 'portal');
const ORIGIN = 'https://dopabrain.com';
const TODAY = (process.env.INDEXING_AUDIT_TODAY || new Date().toISOString().slice(0, 10)).slice(0, 10);
const REPORT_DIR = path.join(ROOT, 'logs', 'indexing-audit');

function parseArgs(argv) {
  const args = {
    json: false,
    write: false,
    limit: 40,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--write') args.write = true;
    else if (arg === '--limit') args.limit = readNumber(argv[++i], arg);
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function readNumber(value, label) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${label} expects a non-negative number.`);
  return number;
}

function printHelp() {
  console.log(`Usage:
  node scripts/indexing-inventory.js
  node scripts/indexing-inventory.js --write
  node scripts/indexing-inventory.js --json --limit 100

Audits every submitted local sitemap URL for technical indexing risks. This does not replace GSC URL Inspection; it finds site-side causes that can be fixed locally.`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
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

function extractAttr(tag, name) {
  const regex = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
  const match = regex.exec(tag);
  return match ? decodeXml(match[2] || match[3] || match[4] || '') : '';
}

function parseSitemap(filePath, label) {
  const entries = [];
  if (!fs.existsSync(filePath)) return entries;
  const xml = readText(filePath);
  const urlRegex = /<url\b[^>]*>([\s\S]*?)<\/url>/gi;
  let match;
  while ((match = urlRegex.exec(xml))) {
    const block = match[1];
    const loc = decodeXml(firstMatch(block, /<loc>\s*([^<]+)\s*<\/loc>/i));
    if (!loc) continue;
    entries.push({
      changefreq: decodeXml(firstMatch(block, /<changefreq>\s*([^<]+)\s*<\/changefreq>/i)),
      lastmod: decodeXml(firstMatch(block, /<lastmod>\s*([^<]+)\s*<\/lastmod>/i)),
      loc,
      priority: decodeXml(firstMatch(block, /<priority>\s*([^<]+)\s*<\/priority>/i)),
      source: label,
    });
  }
  return entries;
}

function loadSitemapEntries() {
  return [
    ...parseSitemap(path.join(ROOT_DOMAIN_ROOT, 'sitemap.xml'), 'root-domain/sitemap.xml'),
    ...parseSitemap(path.join(PORTAL_ROOT, 'sitemap.xml'), 'portal/sitemap.xml'),
    ...parseSitemap(path.join(PORTAL_ROOT, 'blog', 'sitemap.xml'), 'portal/blog/sitemap.xml'),
  ];
}

function mapUrlToLocalPath(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return { file: '', kind: 'invalid_url' };
  }
  if (url.origin !== ORIGIN) return { file: '', kind: 'external' };

  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/' || pathname === '') return { file: path.join(ROOT_DOMAIN_ROOT, 'index.html'), kind: 'root' };
  if (pathname === '/sitemap.xml') return { file: path.join(ROOT_DOMAIN_ROOT, 'sitemap.xml'), kind: 'asset' };
  if (pathname.startsWith('/portal/')) {
    const rel = pathname.replace(/^\/portal\//, '');
    const base = path.join(PORTAL_ROOT, rel);
    const kind = pathname.startsWith('/portal/blog/')
      ? pathname.endsWith('/') ? 'blog_hub' : 'blog'
      : 'portal';
    return { file: pathname.endsWith('/') ? path.join(base, 'index.html') : base, kind };
  }

  const parts = pathname.replace(/^\/+/, '').split('/');
  const app = parts.shift();
  if (!app) return { file: path.join(ROOT_DOMAIN_ROOT, 'index.html'), kind: 'root' };
  const base = path.join(PROJECTS_ROOT, app, ...parts);
  return { file: pathname.endsWith('/') ? path.join(base, 'index.html') : base, kind: 'app' };
}

function normalizeUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

function extractLinkTags(html) {
  return Array.from(html.matchAll(/<link\b[^>]*>/gi)).map((match) => match[0]);
}

function extractCanonical(html) {
  for (const tag of extractLinkTags(html)) {
    if (extractAttr(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical')) return extractAttr(tag, 'href');
  }
  return '';
}

function extractMetaRefreshTarget(html) {
  const metaTags = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).map((match) => match[0]);
  for (const tag of metaTags) {
    if (extractAttr(tag, 'http-equiv').toLowerCase() !== 'refresh') continue;
    const content = extractAttr(tag, 'content');
    const target = firstMatch(content, /(?:^|;)\s*url\s*=\s*([^;]+)\s*$/i);
    if (target) return target.replace(/^['"]|['"]$/g, '');
  }
  return '';
}

function extractRobots(html) {
  const metaTags = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).map((match) => match[0]);
  for (const tag of metaTags) {
    if (extractAttr(tag, 'name').toLowerCase() === 'robots') return extractAttr(tag, 'content').toLowerCase();
  }
  return '';
}

function extractJsonLd(html) {
  const blocks = [];
  const regex = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html))) {
    const raw = decodeXml(match[1].trim());
    try {
      blocks.push({ value: JSON.parse(raw), error: '' });
    } catch (error) {
      blocks.push({ value: null, error: error.message });
    }
  }
  return blocks;
}

function flattenJsonLd(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (typeof value !== 'object') return [];
  const graph = Array.isArray(value['@graph']) ? value['@graph'].flatMap(flattenJsonLd) : [];
  return [value, ...graph];
}

function typeMatches(node, typeName) {
  const type = node && node['@type'];
  if (Array.isArray(type)) return type.includes(typeName);
  return type === typeName;
}

function findDateModified(nodes, html) {
  for (const node of nodes) {
    if (node && node.dateModified) return String(node.dateModified).slice(0, 10);
  }
  const metaDate = firstMatch(html, /<meta\b[^>]*(?:property|name)\s*=\s*["'](?:article:modified_time|dateModified)["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i);
  if (metaDate) return metaDate.slice(0, 10);
  return firstMatch(html, /"dateModified"\s*:\s*"([^"]+)"/i).slice(0, 10);
}

function dateAgeDays(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const start = Date.parse(`${date}T00:00:00Z`);
  const end = Date.parse(`${TODAY}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  return Math.max(0, Math.floor((end - start) / 86400000));
}

function looksMojibake(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .slice(0, 6000);
  const markers = (text.match(/[�챕誓西]/g) || []).length;
  return markers >= 12;
}

function countMatches(html, regex) {
  return Array.from(html.matchAll(regex)).length;
}

function extractHrefs(html) {
  const hrefs = [];
  const regex = /<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let match;
  while ((match = regex.exec(html))) {
    const href = decodeXml(match[2] || match[3] || match[4] || '').trim();
    if (!href || /\$\{|['"]?\s*\+\s*['"]?/.test(href)) continue;
    hrefs.push(href);
  }
  return hrefs;
}

function localPathForHref(href, baseUrl = ORIGIN) {
  const trimmed = String(href || '').trim();
  if (!trimmed || trimmed.startsWith('#')) return '';
  if (/^(mailto|tel|sms|javascript):/i.test(trimmed)) return '';
  let url;
  try {
    url = new URL(trimmed, baseUrl);
  } catch {
    return '';
  }
  if (url.origin !== ORIGIN) return '';
  return mapUrlToLocalPath(url.href).file;
}

function findBrokenInternalLinks(html, baseUrl = ORIGIN) {
  const broken = [];
  const seen = new Set();
  for (const href of extractHrefs(html)) {
    const file = localPathForHref(href, baseUrl);
    if (!file) continue;
    const resolved = path.resolve(file);
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    if (!resolved.startsWith(PROJECTS_ROOT)) continue;
    if (!fs.existsSync(resolved)) broken.push(href);
  }
  return broken;
}

function addIssue(issues, id, severity, message) {
  issues.push({ id, severity, message });
}

function severityScore(severity) {
  if (severity === 'blocker') return 100;
  if (severity === 'high') return 35;
  if (severity === 'medium') return 12;
  return 4;
}

function auditUrl(entry, duplicateCount) {
  const mapped = mapUrlToLocalPath(entry.loc);
  const issues = [];
  const uniqueSources = new Set(entry.sources || [entry.source]);
  if (duplicateCount > uniqueSources.size) addIssue(issues, 'duplicate_sitemap_url', 'low', `listed ${duplicateCount} times in local sitemaps`);
  if (!mapped.file) addIssue(issues, 'unmappable_url', 'blocker', `cannot map URL to a local file (${mapped.kind})`);
  else if (!fs.existsSync(mapped.file)) addIssue(issues, 'missing_local_file', 'blocker', `local file missing: ${toPosix(path.relative(ROOT, mapped.file))}`);

  if (!mapped.file || !fs.existsSync(mapped.file) || path.extname(mapped.file).toLowerCase() !== '.html') {
    return finalize(entry, mapped, issues, {});
  }

  const html = readText(mapped.file);
  const canonical = extractCanonical(html);
  const refresh = extractMetaRefreshTarget(html);
  const robots = extractRobots(html);
  const jsonLd = extractJsonLd(html);
  const jsonLdErrors = jsonLd.filter((item) => item.error);
  const nodes = jsonLd.flatMap((item) => flattenJsonLd(item.value));
  const dateModified = findDateModified(nodes, html);
  const ageDays = dateAgeDays(dateModified);
  const isRedirect = refresh && canonical && normalizeUrl(new URL(refresh, entry.loc).href) === normalizeUrl(canonical);
  const brokenInternalLinks = findBrokenInternalLinks(html, entry.loc);

  if (/\bnoindex\b/.test(robots)) addIssue(issues, 'robots_noindex', 'blocker', `robots meta contains noindex: ${robots}`);
  if (!canonical) addIssue(issues, 'missing_canonical', 'high', 'missing canonical');
  else if (!isRedirect && normalizeUrl(canonical) !== normalizeUrl(entry.loc)) addIssue(issues, 'canonical_mismatch', 'high', `canonical points to ${canonical}`);
  if (!firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)) addIssue(issues, 'missing_title', 'high', 'missing title');
  if (!firstMatch(html, /<meta\b[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i)) addIssue(issues, 'missing_description', 'medium', 'missing meta description');
  if (!/<h1\b/i.test(html)) addIssue(issues, 'missing_h1', 'medium', 'missing h1');
  if (!isRedirect && jsonLd.length === 0) addIssue(issues, 'missing_json_ld', 'medium', 'missing JSON-LD');
  if (!isRedirect && jsonLdErrors.length > 0) addIssue(issues, 'invalid_json_ld', 'high', `${jsonLdErrors.length} invalid JSON-LD block(s)`);
  if (!isRedirect && mapped.kind === 'blog' && nodes.filter((node) => typeMatches(node, 'Article') || typeMatches(node, 'BlogPosting')).length === 0) {
    addIssue(issues, 'missing_article_ld', 'high', 'blog URL missing Article/BlogPosting JSON-LD');
  }
  if (!isRedirect && mapped.kind === 'blog' && nodes.filter((node) => typeMatches(node, 'BreadcrumbList')).length === 0) {
    addIssue(issues, 'missing_breadcrumb_ld', 'medium', 'blog URL missing BreadcrumbList JSON-LD');
  }
  if (!isRedirect && !dateModified && mapped.kind !== 'root' && mapped.kind !== 'blog_hub') addIssue(issues, 'missing_date_modified', 'medium', 'missing dateModified');
  if (dateModified && entry.lastmod && dateModified !== entry.lastmod.slice(0, 10)) {
    addIssue(issues, 'sitemap_lastmod_mismatch', 'medium', `sitemap lastmod ${entry.lastmod} != dateModified ${dateModified}`);
  }
  if (ageDays !== null && ageDays > 90) addIssue(issues, 'old_date_modified_90d', 'medium', `dateModified is ${ageDays} days old`);
  if (!isRedirect && mapped.kind === 'blog' && countMatches(html, /class\s*=\s*["'][^"']*\bquick-card\b[^"']*["']/gi) < 4) {
    addIssue(issues, 'thin_quick_rail', 'medium', 'blog page has fewer than 4 static quick cards');
  }
  if (!isRedirect && mapped.kind === 'blog' && countMatches(html, /data-ad-slot\s*=\s*["']auto["']/gi) === 0) {
    addIssue(issues, 'missing_auto_ad_surface', 'medium', 'blog page has no static Auto ad surface');
  }
  if (!isRedirect && mapped.kind === 'blog' && looksMojibake(html)) addIssue(issues, 'mojibake_text', 'high', 'page text appears mojibake/corrupted');
  if (brokenInternalLinks.length > 0) addIssue(issues, 'broken_internal_links', 'high', `broken internal links: ${brokenInternalLinks.slice(0, 5).join(', ')}`);

  return finalize(entry, mapped, issues, {
    canonical,
    dateModified,
    isRedirect,
    localFile: toPosix(path.relative(ROOT, mapped.file)),
  });
}

function finalize(entry, mapped, issues, meta) {
  return {
    kind: mapped.kind,
    lastmod: entry.lastmod,
    loc: entry.loc,
    score: issues.reduce((total, issue) => total + severityScore(issue.severity), 0),
    source: entry.sources || [entry.source],
    ...meta,
    issues,
  };
}

function groupByUrl(entries) {
  const map = new Map();
  for (const entry of entries) {
    if (!map.has(entry.loc)) map.set(entry.loc, { ...entry, sources: [entry.source] });
    else map.get(entry.loc).sources.push(entry.source);
  }
  return map;
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function summarize(results, rawEntries) {
  const issueCounts = {};
  const severityCounts = {};
  for (const result of results) {
    for (const issue of result.issues) {
      issueCounts[issue.id] = (issueCounts[issue.id] || 0) + 1;
      severityCounts[issue.severity] = (severityCounts[issue.severity] || 0) + 1;
    }
  }
  return {
    auditedAt: TODAY,
    rawSitemapRows: rawEntries.length,
    uniqueUrls: results.length,
    urlsWithIssues: results.filter((result) => result.issues.length > 0).length,
    blockerUrls: results.filter((result) => result.issues.some((issue) => issue.severity === 'blocker')).length,
    highRiskUrls: results.filter((result) => result.issues.some((issue) => issue.severity === 'high')).length,
    byKind: countBy(results, (result) => result.kind || 'unknown'),
    byIssue: Object.fromEntries(Object.entries(issueCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    bySeverity: Object.fromEntries(Object.entries(severityCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
  };
}

function renderMarkdown(report, topResults) {
  const lines = [];
  lines.push(`# Indexing Inventory ${report.summary.auditedAt}`);
  lines.push('');
  lines.push(`- Raw sitemap rows: ${report.summary.rawSitemapRows}`);
  lines.push(`- Unique URLs: ${report.summary.uniqueUrls}`);
  lines.push(`- URLs with local technical issues: ${report.summary.urlsWithIssues}`);
  lines.push(`- Blocker URLs: ${report.summary.blockerUrls}`);
  lines.push(`- High-risk URLs: ${report.summary.highRiskUrls}`);
  lines.push('');
  lines.push('## By Kind');
  for (const [key, value] of Object.entries(report.summary.byKind)) lines.push(`- ${key}: ${value}`);
  lines.push('');
  lines.push('## Top Issues');
  for (const [key, value] of Object.entries(report.summary.byIssue).slice(0, 25)) lines.push(`- ${key}: ${value}`);
  lines.push('');
  lines.push('## Top Risk URLs');
  lines.push('| score | kind | url | issues |');
  lines.push('|---:|---|---|---|');
  for (const result of topResults) {
    const issueText = result.issues.slice(0, 5).map((issue) => issue.id).join(', ');
    lines.push(`| ${result.score} | ${result.kind} | ${result.loc} | ${issueText} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function writeReport(report, topResults) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(REPORT_DIR, `${stamp}.json`);
  const mdPath = path.join(REPORT_DIR, `${stamp}.md`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(mdPath, renderMarkdown(report, topResults));
  fs.copyFileSync(jsonPath, path.join(REPORT_DIR, 'latest.json'));
  fs.copyFileSync(mdPath, path.join(REPORT_DIR, 'latest.md'));
  return { jsonPath, mdPath };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rawEntries = loadSitemapEntries();
  const unique = groupByUrl(rawEntries);
  const results = Array.from(unique.values()).map((entry) => auditUrl(entry, entry.sources.length));
  results.sort((a, b) => b.score - a.score || a.loc.localeCompare(b.loc));
  const topResults = results.slice(0, args.limit);
  const report = {
    summary: summarize(results, rawEntries),
    topResults,
    results,
  };

  if (args.write) {
    const paths = writeReport(report, topResults);
    report.written = {
      json: toPosix(path.relative(ROOT, paths.jsonPath)),
      markdown: toPosix(path.relative(ROOT, paths.mdPath)),
    };
  }

  if (args.json) {
    console.log(JSON.stringify({ summary: report.summary, topResults, written: report.written || null }, null, 2));
    return;
  }

  console.log(`Indexing inventory ${report.summary.auditedAt}`);
  console.log(`Raw sitemap rows: ${report.summary.rawSitemapRows}`);
  console.log(`Unique URLs: ${report.summary.uniqueUrls}`);
  console.log(`URLs with issues: ${report.summary.urlsWithIssues}`);
  console.log(`Blocker URLs: ${report.summary.blockerUrls}`);
  console.log(`High-risk URLs: ${report.summary.highRiskUrls}`);
  console.log('\nTop issues:');
  for (const [key, value] of Object.entries(report.summary.byIssue).slice(0, 15)) {
    console.log(`  ${key}: ${value}`);
  }
  console.log('\nTop URLs:');
  for (const result of topResults) {
    console.log(`  ${result.score} ${result.kind} ${result.loc}`);
    console.log(`    ${result.issues.slice(0, 5).map((issue) => issue.id).join(', ')}`);
  }
  if (report.written) console.log(`\nReport: ${report.written.markdown}`);
}

main();
