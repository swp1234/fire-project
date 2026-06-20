#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const ROOT_DOMAIN_ROOT = path.join(PROJECTS_ROOT, 'root-domain');
const PORTAL_ROOT = path.join(PROJECTS_ROOT, 'portal');
const BLOG_ROOT = path.join(PORTAL_ROOT, 'blog');
const ORIGIN = 'https://dopabrain.com';
const DEFAULT_LIMIT = 25;
const DEFAULT_MAX_AGE_DAYS = 60;
const PLACEHOLDER_AD_SLOTS = ['1234567890', '9876543210', '5555555555'];
const EXPECTED_EVENTS = [
  'content_view',
  'content_ad_impression',
  'content_test_click',
  'content_cta_click',
  'content_related_click',
];

function parseArgs(argv) {
  const args = {
    failOnScore: null,
    includeRedirects: false,
    json: false,
    langs: [],
    limit: DEFAULT_LIMIT,
    maxAgeDays: DEFAULT_MAX_AGE_DAYS,
    minScore: 0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--fail-on-score') args.failOnScore = readNumber(argv[++i], arg);
    else if (arg === '--include-redirects') args.includeRedirects = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--lang') args.langs.push(String(argv[++i] || '').trim().toLowerCase());
    else if (arg === '--limit') args.limit = readLimit(argv[++i], arg);
    else if (arg === '--max-age-days') args.maxAgeDays = readNumber(argv[++i], arg);
    else if (arg === '--min-score') args.minScore = readNumber(argv[++i], arg);
    else if (arg === '--all') args.limit = Infinity;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  args.langs = args.langs.filter(Boolean);
  return args;
}

function readNumber(value, label) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${label} expects a non-negative number.`);
  }
  return number;
}

function readLimit(value, label) {
  if (value === 'all') return Infinity;
  const number = readNumber(value, label);
  return number === 0 ? Infinity : number;
}

function printHelp() {
  console.log(`Usage:
  node scripts/blog-indexing-audit.js [--limit 30]
  node scripts/blog-indexing-audit.js --lang ko --limit 20
  node scripts/blog-indexing-audit.js --all --json
  node scripts/blog-indexing-audit.js --include-redirects --limit 30
  node scripts/blog-indexing-audit.js --min-score 40 --fail-on-score 80

Ranks portal blog pages by indexing and maintenance risk. Intentional redirect stubs are skipped by default. The command is read-only.`);
}

function walkHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html' && !entry.name.startsWith('_')) {
      files.push(fullPath);
    }
  }
  return files;
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function relativePosix(from, to) {
  return toPosix(path.relative(from, to));
}

function publicPathForFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(PROJECTS_ROOT)) {
    throw new Error(`File is outside projects/: ${filePath}`);
  }
  return `/${relativePosix(PROJECTS_ROOT, resolved)}`;
}

function publicUrlForFile(filePath) {
  return `${ORIGIN}${publicPathForFile(filePath)}`;
}

function getLang(filePath, html = '') {
  const parts = relativePosix(BLOG_ROOT, filePath).split('/');
  const first = parts[0] || '';
  if (first && !first.endsWith('.html')) return first;
  const htmlLang = firstMatch(html, /<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)
    .toLowerCase()
    .split('-')[0];
  return htmlLang || 'ko';
}

function parseSitemap(filePath) {
  const entries = new Map();
  if (!fs.existsSync(filePath)) return entries;
  const xml = readText(filePath);
  const urlRegex = /<url\b[^>]*>([\s\S]*?)<\/url>/gi;
  let match;
  while ((match = urlRegex.exec(xml))) {
    const block = match[1];
    const loc = firstMatch(block, /<loc>\s*([^<]+)\s*<\/loc>/i);
    if (!loc) continue;
    entries.set(decodeXml(loc), {
      lastmod: decodeXml(firstMatch(block, /<lastmod>\s*([^<]+)\s*<\/lastmod>/i) || ''),
      source: path.basename(filePath),
    });
  }
  return entries;
}

function mergeSitemaps(...maps) {
  const merged = new Map();
  for (const map of maps) {
    for (const [url, entry] of map.entries()) {
      merged.set(url, entry);
    }
  }
  return merged;
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

function extractLinkTags(html) {
  return Array.from(html.matchAll(/<link\b[^>]*>/gi)).map((match) => match[0]);
}

function extractCanonical(html) {
  for (const tag of extractLinkTags(html)) {
    const rel = extractAttr(tag, 'rel').toLowerCase().split(/\s+/);
    if (rel.includes('canonical')) return extractAttr(tag, 'href');
  }
  return '';
}

function extractMetaRefreshTarget(html) {
  const metaTags = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).map((match) => match[0]);
  for (const tag of metaTags) {
    const httpEquiv = extractAttr(tag, 'http-equiv').toLowerCase();
    if (httpEquiv !== 'refresh') continue;
    const content = extractAttr(tag, 'content');
    const target = firstMatch(content, /(?:^|;)\s*url\s*=\s*([^;]+)\s*$/i);
    if (target) return decodeXml(target.replace(/^['"]|['"]$/g, ''));
  }
  return '';
}

function extractHreflangs(html) {
  const hreflangs = [];
  for (const tag of extractLinkTags(html)) {
    const rel = extractAttr(tag, 'rel').toLowerCase().split(/\s+/);
    const hreflang = extractAttr(tag, 'hreflang');
    const href = extractAttr(tag, 'href');
    if (rel.includes('alternate') && hreflang && href) {
      hreflangs.push({ hreflang: hreflang.toLowerCase(), href });
    }
  }
  return hreflangs;
}

function extractJsonLd(html) {
  const scripts = [];
  const regex = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html))) {
    const raw = decodeXml(match[1].trim());
    try {
      scripts.push({ raw, value: JSON.parse(raw), error: '' });
    } catch (error) {
      scripts.push({ raw, value: null, error: error.message });
    }
  }
  return scripts;
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

function dateAgeDays(date, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const start = Date.parse(`${date}T00:00:00Z`);
  const end = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  return Math.max(0, Math.floor((end - start) / 86400000));
}

function countMatches(html, regex) {
  return Array.from(html.matchAll(regex)).length;
}

function extractHrefs(html) {
  const hrefs = [];
  const regex = /<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let match;
  while ((match = regex.exec(html))) {
    hrefs.push(decodeXml(match[2] || match[3] || match[4] || ''));
  }
  return hrefs;
}

function localPathForInternalHref(href) {
  const trimmed = String(href || '').trim();
  if (!trimmed || trimmed.startsWith('#')) return '';
  if (/^(mailto|tel|sms|javascript):/i.test(trimmed)) return '';

  let pathname = '';
  try {
    const url = new URL(trimmed, ORIGIN);
    if (url.origin !== ORIGIN) return '';
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return '';
  }

  const projectPath = (!pathname || pathname === '/')
    ? path.join(ROOT_DOMAIN_ROOT, 'index.html')
    : pathname.endsWith('/')
      ? path.join(PROJECTS_ROOT, pathname, 'index.html')
      : path.join(PROJECTS_ROOT, pathname);

  if (fs.existsSync(projectPath)) return projectPath;

  const rootDomainPath = pathname.endsWith('/')
    ? path.join(ROOT_DOMAIN_ROOT, pathname, 'index.html')
    : path.join(ROOT_DOMAIN_ROOT, pathname);
  return rootDomainPath;
}

function findBrokenInternalLinks(html) {
  const broken = [];
  const seen = new Set();
  for (const href of extractHrefs(html)) {
    const localPath = localPathForInternalHref(href);
    if (!localPath) continue;
    const key = path.resolve(localPath);
    if (seen.has(key)) continue;
    seen.add(key);
    if (!key.startsWith(PROJECTS_ROOT)) continue;
    if (!fs.existsSync(key)) broken.push(href);
  }
  return broken;
}

function normalizeUrl(url) {
  return String(url || '').replace(/\/+$/, '');
}

function isRedirectStub(html, url, canonical) {
  const refreshTarget = extractMetaRefreshTarget(html);
  if (!refreshTarget) return false;

  let refreshUrl = '';
  try {
    refreshUrl = new URL(refreshTarget, url).href;
  } catch {
    refreshUrl = refreshTarget;
  }

  const normalizedUrl = normalizeUrl(url);
  const normalizedCanonical = normalizeUrl(canonical);
  const normalizedRefresh = normalizeUrl(refreshUrl);
  const hasRedirectTitle = /<title\b[^>]*>\s*Redirecting\.\.\.\s*<\/title>/i.test(html);
  const hasScriptRedirect = /window\.location\.(?:replace|href)\s*=/i.test(html);

  return (
    normalizedCanonical &&
    normalizedCanonical !== normalizedUrl &&
    normalizedRefresh === normalizedCanonical &&
    (hasRedirectTitle || hasScriptRedirect)
  );
}

function addIssue(issues, id, weight, message) {
  issues.push({ id, weight, message });
}

function auditFile(filePath, sitemaps, today, maxAgeDays) {
  const html = readText(filePath);
  const url = publicUrlForFile(filePath);
  const lang = getLang(filePath, html);
  const jsonLd = extractJsonLd(html);
  const jsonLdErrors = jsonLd.filter((entry) => entry.error);
  const nodes = jsonLd.flatMap((entry) => flattenJsonLd(entry.value));
  const articleNodes = nodes.filter((node) => typeMatches(node, 'Article') || typeMatches(node, 'BlogPosting'));
  const breadcrumbNodes = nodes.filter((node) => typeMatches(node, 'BreadcrumbList'));
  const faqNodes = nodes.filter((node) => typeMatches(node, 'FAQPage'));
  const canonical = extractCanonical(html);
  const redirectStub = isRedirectStub(html, url, canonical);
  const hreflangs = extractHreflangs(html);
  const dateModified = findDateModified(nodes, html);
  const ageDays = dateAgeDays(dateModified, today);
  const sitemapEntry = sitemaps.get(url);
  const quickCards = countMatches(html, /class\s*=\s*["'][^"']*\bquick-card\b[^"']*["']/gi);
  const autoAds = countMatches(html, /data-ad-slot\s*=\s*["']auto["']/gi);
  const adSurfaces = countMatches(html, /data-ad-surface\s*=/gi);
  const contentEvents = Array.from(new Set(Array.from(html.matchAll(/content_[a-z0-9_]+/gi)).map((match) => match[0])));
  const placeholderSlots = PLACEHOLDER_AD_SLOTS.filter((slot) => html.includes(`data-ad-slot="${slot}"`) || html.includes(`data-ad-slot='${slot}'`));
  const brokenInternalLinks = findBrokenInternalLinks(html);
  const issues = [];

  if (!firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)) addIssue(issues, 'missing_title', 25, 'missing title');
  if (!firstMatch(html, /<meta\b[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i)) {
    addIssue(issues, 'missing_description', 20, 'missing meta description');
  }
  if (!/<h1\b/i.test(html)) addIssue(issues, 'missing_h1', 25, 'missing h1');
  if (jsonLd.length === 0) addIssue(issues, 'missing_json_ld', 40, 'missing JSON-LD');
  if (jsonLdErrors.length > 0) addIssue(issues, 'invalid_json_ld', 50, `${jsonLdErrors.length} invalid JSON-LD block(s)`);
  if (articleNodes.length === 0) addIssue(issues, 'missing_article_ld', 30, 'missing Article/BlogPosting JSON-LD');
  if (breadcrumbNodes.length === 0) addIssue(issues, 'missing_breadcrumb_ld', 12, 'missing BreadcrumbList JSON-LD');
  if (faqNodes.length === 0) addIssue(issues, 'missing_faq_ld', 8, 'missing FAQPage JSON-LD');
  if (!canonical) addIssue(issues, 'missing_canonical', 40, 'missing canonical');
  else if (normalizeUrl(canonical) !== normalizeUrl(url)) addIssue(issues, 'canonical_mismatch', 35, `canonical points to ${canonical}`);
  if (hreflangs.length === 0) addIssue(issues, 'missing_hreflang', 10, 'missing alternate hreflang links');
  else if (!hreflangs.some((entry) => entry.hreflang === lang)) addIssue(issues, 'missing_self_hreflang', 8, `missing self hreflang ${lang}`);
  if (!dateModified) addIssue(issues, 'missing_date_modified', 35, 'missing dateModified');
  else if (ageDays !== null && ageDays > maxAgeDays) addIssue(issues, 'old_date_modified', 18, `dateModified is ${ageDays} days old`);
  if (!sitemapEntry) addIssue(issues, 'missing_sitemap', 50, 'not listed in portal sitemaps');
  else if (dateModified && sitemapEntry.lastmod && sitemapEntry.lastmod.slice(0, 10) !== dateModified) {
    addIssue(issues, 'stale_sitemap_lastmod', 22, `sitemap lastmod ${sitemapEntry.lastmod} != ${dateModified}`);
  }
  if (quickCards < 4) addIssue(issues, 'thin_quick_rail', 24, `quick cards ${quickCards}/4`);
  if (autoAds === 0) addIssue(issues, 'missing_auto_ad', 20, 'missing auto ad slot');
  if (adSurfaces === 0) addIssue(issues, 'missing_ad_surface', 12, 'missing data-ad-surface');
  if (placeholderSlots.length > 0) addIssue(issues, 'placeholder_ad_slot', 25, `placeholder ad slots: ${placeholderSlots.join(', ')}`);
  for (const eventName of EXPECTED_EVENTS) {
    if (!contentEvents.includes(eventName)) addIssue(issues, `missing_${eventName}`, eventName === 'content_view' ? 20 : 10, `missing ${eventName}`);
  }
  if (/\/dopamine-test\//i.test(html)) addIssue(issues, 'legacy_dopamine_test_link', 15, 'links to legacy /dopamine-test/');
  if (brokenInternalLinks.length > 0) addIssue(issues, 'broken_internal_links', 35, `broken internal links: ${brokenInternalLinks.slice(0, 4).join(', ')}`);
  if (/<table\b/i.test(html) && !/overflow-x\s*:\s*auto/i.test(html) && !/table-scroll|table-wrap|comparison-wrapper/i.test(html)) {
    addIssue(issues, 'mobile_table_overflow_risk', 12, 'table lacks obvious horizontal overflow wrapper');
  }
  if (/width\s*:\s*100vw/i.test(html) && !/overflow-x\s*:\s*hidden/i.test(html)) {
    addIssue(issues, 'mobile_100vw_overflow_risk', 10, '100vw without overflow-x guard');
  }

  return {
    adSurfaces,
    autoAds,
    brokenInternalLinks,
    canonical,
    contentEvents,
    dateModified,
    file: relativePosix(ROOT, filePath),
    hreflangs: hreflangs.map((entry) => entry.hreflang),
    isRedirectStub: redirectStub,
    issues,
    lang,
    quickCards,
    score: issues.reduce((total, issue) => total + issue.weight, 0),
    sitemapLastmod: sitemapEntry ? sitemapEntry.lastmod : '',
    url,
  };
}

function trimCell(value, width) {
  const text = String(value ?? '');
  if (text.length <= width) return text.padEnd(width, ' ');
  return `${text.slice(0, Math.max(0, width - 1))}…`;
}

function printTable(results, totalCount, skippedRedirectStubs, args) {
  const shown = results.slice(0, args.limit);
  const skippedText = skippedRedirectStubs > 0 ? ` Skipped ${skippedRedirectStubs} redirect stub(s).` : '';
  console.log(`Audited ${totalCount} portal blog article pages.${skippedText} Showing ${shown.length} candidate(s).`);
  console.log(`Score weights prioritize sitemap/canonical/JSON-LD, then content rails, ads, analytics, and mobile risks.\n`);
  console.log(`${trimCell('score', 5)}  ${trimCell('lang', 4)}  ${trimCell('date', 10)}  ${trimCell('quick', 5)}  ${trimCell('ads', 3)}  ${trimCell('file', 54)}  issues`);
  console.log(`${'-'.repeat(5)}  ${'-'.repeat(4)}  ${'-'.repeat(10)}  ${'-'.repeat(5)}  ${'-'.repeat(3)}  ${'-'.repeat(54)}  ${'-'.repeat(48)}`);
  for (const result of shown) {
    const issueText = result.issues.slice(0, 4).map((issue) => issue.message).join('; ');
    console.log(
      `${trimCell(result.score, 5)}  ${trimCell(result.lang, 4)}  ${trimCell(result.dateModified || '-', 10)}  ` +
      `${trimCell(result.quickCards, 5)}  ${trimCell(result.autoAds, 3)}  ${trimCell(result.file, 54)}  ${issueText}`
    );
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const today = (process.env.CONTENT_AUDIT_TODAY || new Date().toISOString().slice(0, 10)).slice(0, 10);
  const sitemaps = mergeSitemaps(
    parseSitemap(path.join(PORTAL_ROOT, 'sitemap.xml')),
    parseSitemap(path.join(BLOG_ROOT, 'sitemap.xml'))
  );
  const files = walkHtmlFiles(BLOG_ROOT).filter((filePath) => {
    const lang = getLang(filePath);
    return args.langs.length === 0 || args.langs.includes(lang);
  });
  const auditedResults = files.map((filePath) => auditFile(filePath, sitemaps, today, args.maxAgeDays));
  const skippedRedirectStubs = args.includeRedirects
    ? 0
    : auditedResults.filter((result) => result.isRedirectStub).length;
  const results = auditedResults
    .filter((result) => args.includeRedirects || !result.isRedirectStub)
    .filter((result) => result.score >= args.minScore)
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

  if (args.json) {
    console.log(JSON.stringify({
      auditedAt: today,
      filters: {
        langs: args.langs,
        includeRedirects: args.includeRedirects,
        maxAgeDays: args.maxAgeDays,
        minScore: args.minScore,
      },
      skippedRedirectStubs,
      totalFiles: files.length,
      results: results.slice(0, args.limit),
    }, null, 2));
  } else {
    printTable(results, files.length, skippedRedirectStubs, args);
  }

  if (args.failOnScore !== null && results.some((result) => result.score >= args.failOnScore)) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
