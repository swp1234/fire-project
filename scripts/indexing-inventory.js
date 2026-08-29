#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { todayInTimeZone } = require('./lib/time-zone-date');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const ROOT_DOMAIN_ROOT = path.join(PROJECTS_ROOT, 'root-domain');
const PORTAL_ROOT = path.join(PROJECTS_ROOT, 'portal');
const ORIGIN = 'https://dopabrain.com';
const FOCUSED_QUICK_RAIL_URLS = new Set([
  `${ORIGIN}/portal/blog/en/kpop-positions-explained-guide.html`,
]);
const TODAY = (process.env.INDEXING_AUDIT_TODAY || todayInTimeZone()).slice(0, 10);
const REPORT_DIR = path.join(ROOT, 'logs', 'indexing-audit');

function parseArgs(argv) {
  const args = {
    json: false,
    selfTest: false,
    write: false,
    limit: 40,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--self-test') args.selfTest = true;
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
  node scripts/indexing-inventory.js --self-test

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
    return { file: '', kind: 'invalid_url' };
  }
  if (url.origin !== ORIGIN) return { file: '', kind: 'external' };

  if (/%2f|%5c/i.test(url.pathname)) return { file: '', kind: 'encoded_separator' };
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return { file: '', kind: 'invalid_encoding' };
  }
  if (pathname.includes('\\')) return { file: '', kind: 'invalid_separator' };
  if (pathname === '/' || pathname === '') return { file: path.join(ROOT_DOMAIN_ROOT, 'index.html'), kind: 'root' };
  if (pathname === '/sitemap.xml') return { file: path.join(ROOT_DOMAIN_ROOT, 'sitemap.xml'), kind: 'asset' };
  if (pathname.startsWith('/portal/')) {
    const rel = pathname.replace(/^\/portal\//, '');
    const base = resolveInside(PORTAL_ROOT, rel);
    if (!base) return { file: '', kind: 'path_escape' };
    const kind = pathname.startsWith('/portal/blog/')
      ? pathname.endsWith('/') ? 'blog_hub' : 'blog'
      : 'portal';
    const file = pathname.endsWith('/') ? resolveInside(PORTAL_ROOT, rel, 'index.html') : base;
    return file ? { file, kind } : { file: '', kind: 'path_escape' };
  }

  const parts = pathname.replace(/^\/+/, '').split('/');
  const app = parts.shift();
  if (!app) return { file: path.join(ROOT_DOMAIN_ROOT, 'index.html'), kind: 'root' };
  const base = resolveInside(PROJECTS_ROOT, app, ...parts);
  if (!base) return { file: '', kind: 'path_escape' };
  const file = pathname.endsWith('/') ? resolveInside(PROJECTS_ROOT, app, ...parts, 'index.html') : base;
  return file ? { file, kind: 'app' } : { file: '', kind: 'path_escape' };
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

function isValidFocusedQuickCard(tag) {
  if (extractAttr(tag, 'data-content-surface') !== 'quick_rail') return false;
  if (!extractAttr(tag, 'data-target-slug')) return false;
  const href = extractAttr(tag, 'href');
  if (!href) return false;
  try {
    const url = new URL(href, ORIGIN);
    return url.origin === ORIGIN && url.pathname !== '/';
  } catch {
    return false;
  }
}

function assessQuickRail(html, pageUrl = '') {
  const quickCardCount = countMatches(html, /class\s*=\s*["'][^"']*\bquick-card\b[^"']*["']/gi);
  const hasNativeInteraction = /<section\b(?=[^>]*\bclass\s*=\s*["'][^"']*\bculture-choice\b[^"']*["'])(?=[^>]*\bdata-content-interaction(?:\s*=|\s|>))[^>]*>/i.test(html);
  const focusedMatch = String(html).match(/<section\b(?=[^>]*\bclass\s*=\s*["'][^"']*\bindexing-quick-rail\b[^"']*["'])(?=[^>]*\bdata-quick-rail-mode\s*=\s*["']focused["'])[^>]*>([\s\S]*?)<\/section>/i);
  const focusedCards = focusedMatch
    ? Array.from(focusedMatch[1].matchAll(/<a\b[^>]*\bclass\s*=\s*["'][^"']*\bquick-card\b[^"']*["'][^>]*>/gi)).map((match) => match[0])
    : [];
  const focusedUrlAllowed = FOCUSED_QUICK_RAIL_URLS.has(normalizeUrl(pageUrl));
  const hasFocusedRail = Boolean(
    focusedMatch
    && focusedUrlAllowed
    && focusedCards.length === 2
    && focusedCards.every(isValidFocusedQuickCard)
  );
  const minimumQuickCards = hasNativeInteraction || hasFocusedRail ? 2 : 4;
  return {
    focusedCardCount: focusedCards.length,
    hasFocusedRail,
    hasFocusedRailMarker: Boolean(focusedMatch),
    hasNativeInteraction,
    invalidFocusedRail: Boolean(focusedMatch) && !hasFocusedRail,
    isThin: quickCardCount < minimumQuickCards,
    minimumQuickCards,
    quickCardCount,
  };
}

function assessAdsense(html) {
  const source = String(html || '').replace(/<!--[\s\S]*?-->/g, '');
  return {
    hasLoader: /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-/i.test(source)
      || /\/portal\/js\/ad-loader\.js/i.test(source),
    invalidAutoSlotCount: countMatches(source, /data-ad-slot\s*=\s*["']auto["']/gi),
  };
}

function assertSelfTest(condition, message) {
  if (!condition) throw new Error(`Self-test failed: ${message}`);
}

function quickRailFixture(quickCardCount, hasNativeInteraction, hasFocusedRail = false) {
  const interactionAttribute = hasNativeInteraction ? ' data-content-interaction="choice"' : '';
  const focusedAttribute = hasFocusedRail ? ' data-quick-rail-mode="focused"' : '';
  const cards = Array.from({ length: quickCardCount }, (_unused, index) => hasFocusedRail
    ? `<a class="quick-card" href="/tool-${index + 1}/" data-content-surface="quick_rail" data-target-slug="tool-${index + 1}">card</a>`
    : '<a class="quick-card">card</a>').join('');
  const className = hasFocusedRail ? 'indexing-quick-rail' : 'culture-choice';
  return `<section class="${className}"${interactionAttribute}${focusedAttribute}>${cards}</section>`;
}

function runSelfTest() {
  const cases = [
    { name: 'general blog with 3 cards fails', cards: 3, interaction: false, focused: false, expectedThin: true, expectedMinimum: 4 },
    { name: 'general blog with 4 cards passes', cards: 4, interaction: false, focused: false, expectedThin: false, expectedMinimum: 4 },
    { name: 'interaction blog with 1 card fails', cards: 1, interaction: true, focused: false, expectedThin: true, expectedMinimum: 2 },
    { name: 'interaction blog with 2 cards passes', cards: 2, interaction: true, focused: false, expectedThin: false, expectedMinimum: 2 },
    { name: 'focused rail with 1 card cannot lower the minimum', cards: 1, interaction: false, focused: true, pageUrl: `${ORIGIN}/portal/blog/en/kpop-positions-explained-guide.html`, expectedThin: true, expectedMinimum: 4, expectedFocused: false },
    { name: 'allowlisted focused rail with 2 valid cards passes', cards: 2, interaction: false, focused: true, pageUrl: `${ORIGIN}/portal/blog/en/kpop-positions-explained-guide.html`, expectedThin: false, expectedMinimum: 2, expectedFocused: true },
  ];

  for (const testCase of cases) {
    const result = assessQuickRail(quickRailFixture(testCase.cards, testCase.interaction, testCase.focused), testCase.pageUrl);
    assertSelfTest(result.quickCardCount === testCase.cards, `${testCase.name}: counted ${result.quickCardCount} cards`);
    assertSelfTest(result.hasNativeInteraction === testCase.interaction, `${testCase.name}: interaction classification changed`);
    assertSelfTest(result.hasFocusedRail === (testCase.expectedFocused ?? false), `${testCase.name}: focused classification changed`);
    assertSelfTest(result.minimumQuickCards === testCase.expectedMinimum, `${testCase.name}: minimum is ${result.minimumQuickCards}`);
    assertSelfTest(result.isThin === testCase.expectedThin, `${testCase.name}: thin=${result.isThin}`);
    console.log(`[PASS] ${testCase.name}`);
  }

  const inertMarker = assessQuickRail(
    '<main data-content-interaction="choice">' + '<a class="quick-card">card</a>'.repeat(3) + '</main>'
  );
  assertSelfTest(!inertMarker.hasNativeInteraction, 'inert interaction marker changed the page classification');
  assertSelfTest(inertMarker.isThin, 'inert interaction marker lowered the four-card minimum');
  console.log('[PASS] inert interaction marker does not lower the general blog minimum');

  const inertFocusedMarker = assessQuickRail(
    '<main data-quick-rail-mode="focused">' + '<a class="quick-card">card</a>'.repeat(3) + '</main>'
  );
  assertSelfTest(!inertFocusedMarker.hasFocusedRail, 'inert focused marker changed the page classification');
  assertSelfTest(inertFocusedMarker.isThin, 'inert focused marker lowered the four-card minimum');
  console.log('[PASS] inert focused marker does not lower the general blog minimum');

  const unauthorizedFocusedRail = assessQuickRail(
    quickRailFixture(2, false, true),
    `${ORIGIN}/portal/blog/en/unrelated.html`
  );
  assertSelfTest(!unauthorizedFocusedRail.hasFocusedRail, 'unauthorized focused marker changed the page classification');
  assertSelfTest(unauthorizedFocusedRail.invalidFocusedRail && unauthorizedFocusedRail.minimumQuickCards === 4, 'unauthorized focused marker bypassed the four-card minimum');
  console.log('[PASS] focused rail mode is restricted to the intentional page');

  const missingTelemetry = assessQuickRail(
    quickRailFixture(2, false, true).replace(' data-target-slug="tool-1"', ''),
    `${ORIGIN}/portal/blog/en/kpop-positions-explained-guide.html`
  );
  assertSelfTest(!missingTelemetry.hasFocusedRail && missingTelemetry.invalidFocusedRail, 'focused card without telemetry passed');
  console.log('[PASS] focused rail requires exactly two internal cards with telemetry');

  const autoAdsOnly = assessAdsense('<script src="/portal/js/ad-loader.js"></script>');
  assertSelfTest(autoAdsOnly.hasLoader && autoAdsOnly.invalidAutoSlotCount === 0, 'valid Auto Ads-only contract failed');
  const invalidManualUnit = assessAdsense('<script src="/portal/js/ad-loader.js"></script><ins class="adsbygoogle" data-ad-slot="auto"></ins>');
  assertSelfTest(invalidManualUnit.hasLoader && invalidManualUnit.invalidAutoSlotCount === 1, 'invalid auto slot was not detected');
  const missingLoader = assessAdsense('<main>content</main>');
  assertSelfTest(!missingLoader.hasLoader && missingLoader.invalidAutoSlotCount === 0, 'missing loader classification failed');
  const commentOnly = assessAdsense('<!-- <script src="/portal/js/ad-loader.js"></script><ins data-ad-slot="auto"></ins> -->');
  assertSelfTest(!commentOnly.hasLoader && commentOnly.invalidAutoSlotCount === 0, 'commented ad markup changed the contract');
  const loaderWithCommentDecoy = assessAdsense('<script src="/portal/js/ad-loader.js"></script><!-- <ins data-ad-slot="auto"></ins> -->');
  assertSelfTest(loaderWithCommentDecoy.hasLoader && loaderWithCommentDecoy.invalidAutoSlotCount === 0, 'comment decoy produced a false ad issue');
  console.log('[PASS] Auto Ads loader and invalid manual slot contracts are distinguished');
  console.log('[PASS] commented ad markup is excluded from the DOM contract');

  const validPortal = mapUrlToLocalPath(`${ORIGIN}/portal/blog/ko/example.html`);
  assertSelfTest(validPortal.kind === 'blog' && isPathInside(PORTAL_ROOT, validPortal.file), 'valid portal URL mapping failed');
  const unsafeUrls = [
    `${ORIGIN}/portal/%2F..%2F..%2Fsecret.html`,
    `${ORIGIN}/portal/%5C..%5C..%5Csecret.html`,
    `${ORIGIN}/app/%2F..%2F..%2Fsecret.html`,
    `${ORIGIN}/portal/%ZZ.html`,
    `${ORIGIN}/portal/%E0%A4%A.html`
  ];
  for (const unsafeUrl of unsafeUrls) {
    const mapped = mapUrlToLocalPath(unsafeUrl);
    assertSelfTest(!mapped.file, `unsafe URL mapped to a local file (${mapped.kind})`);
  }
  console.log('[PASS] encoded traversal and malformed URL paths are rejected');
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
    if (!isPathInside(PROJECTS_ROOT, resolved)) continue;
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
  const quickRail = assessQuickRail(html, entry.loc);
  if (!isRedirect && mapped.kind === 'blog' && quickRail.invalidFocusedRail) {
    addIssue(issues, 'invalid_focused_quick_rail', 'medium', 'focused quick rail is not allowlisted or lacks exactly two valid internal telemetry cards');
  }
  if (!isRedirect && mapped.kind === 'blog' && quickRail.isThin) {
    addIssue(
      issues,
      'thin_quick_rail',
      'medium',
      `blog page has ${quickRail.quickCardCount} static quick cards; expected at least ${quickRail.minimumQuickCards}`
    );
  }
  if (!isRedirect && mapped.kind === 'blog') {
    const adsense = assessAdsense(html);
    if (!adsense.hasLoader) addIssue(issues, 'missing_adsense_loader', 'medium', 'blog page has no Auto Ads loader');
    if (adsense.invalidAutoSlotCount > 0) {
      addIssue(issues, 'invalid_adsense_auto_slot', 'medium', 'data-ad-slot="auto" is not a valid manual AdSense unit');
    }
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
  if (args.selfTest) {
    runSelfTest();
    return;
  }
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
