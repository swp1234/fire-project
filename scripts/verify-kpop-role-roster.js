#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const CLIENT = 'ca-pub-3600813755953882';
const LASTMOD = '2026-08-29';
const ARTICLE_ROUTE = '/portal/blog/en/kpop-positions-explained-guide.html';
const ARTICLE_CANONICAL = `https://dopabrain.com${ARTICLE_ROUTE}`;
const ARTICLE_TITLE = 'K-Pop Positions Explained - All Roles & What They Mean';
const ARTICLE_ID = 'kpop-positions-explained-guide.html';
const TOOL_ROUTE = '/portal/tools/kpop-role-roster.html';
const TOOL_CANONICAL = `https://dopabrain.com${TOOL_ROUTE}`;
const POSITION_ROUTE = '/kpop-position/';
const POSITION_CANONICAL = `https://dopabrain.com${POSITION_ROUTE}`;
const POSITION_ROOT = path.join(ROOT, 'projects', 'kpop-position');
const POSITION_LOCALES = Object.freeze(['ko', 'en']);
const POSITION_HREFLANGS = Object.freeze([...POSITION_LOCALES, 'x-default']);
const LOCALES = Object.freeze(['en', 'ko', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']);
const HREFLANGS = Object.freeze([...LOCALES, 'x-default']);
const PARTIAL_ROSTER_LOCALES = Object.freeze(['ja', 'es', 'pt', 'id', 'tr', 'de', 'fr', 'ru', 'hi']);
const ROSTER_CORE_COPY_SELECTORS = Object.freeze({
  pageTitle: null,
  title: 'h1[data-i18n="title"]',
  lead: '.lead[data-i18n="lead"]',
  generate: '#generate',
});
const OFFICIAL_PROFILE_SOURCES = Object.freeze([
  'https://bts.ibighit.com/eng/profile/',
  'https://ygfamily.com/en/artists/blackpink/profile',
  'https://twice.jype.com/Mobile/Profile',
  'https://straykids.jype.com/profile',
]);
const CATALOG_COUNT = 43;
const ROSTER_EVENT_KEYS = Object.freeze({
  kpop_roster_view: ['event_category', 'surface_name', 'content_locale', 'revenue_goal', 'source', 'has_saved_roster'],
  kpop_roster_preset: ['event_category', 'surface_name', 'content_locale', 'revenue_goal', 'preset_id', 'member_count'],
  kpop_roster_generate: ['event_category', 'surface_name', 'content_locale', 'revenue_goal', 'member_count', 'concept', 'leadership_model'],
  kpop_roster_finalize: ['event_category', 'surface_name', 'content_locale', 'revenue_goal', 'member_count', 'concept'],
  kpop_roster_language_change: ['event_category', 'surface_name', 'content_locale', 'revenue_goal', 'selected_language'],
  kpop_roster_related_click: ['event_category', 'surface_name', 'content_locale', 'revenue_goal', 'destination_id', 'destination_path'],
});
const VIEWPORTS = Object.freeze([
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]);
const QUICK = Object.freeze([
  {
    href: '/portal/tools/kpop-role-roster.html?lang=en&source=blog_kpop_positions_quick_rail',
    surface: 'quick_rail',
    slug: 'kpop-role-roster',
  },
  {
    href: '/kpop-position/?lang=en&start=1&surface=en_kpop_positions_quick_rail',
    surface: 'quick_rail',
    slug: 'kpop-position',
  },
]);
const BRIDGE_ARTICLES = Object.freeze([
  { locale: 'en', route: ARTICLE_ROUTE },
  { locale: 'es', route: '/portal/blog/es/test-posicion-kpop-guia.html' },
  { locale: 'zh', route: '/portal/blog/zh/kpop-position-test-guide.html' },
]);

const FILES = Object.freeze({
  articleHtml: path.join(PORTAL, 'blog', 'en', 'kpop-positions-explained-guide.html'),
  toolHtml: path.join(PORTAL, 'tools', 'kpop-role-roster.html'),
  toolJs: path.join(PORTAL, 'js', 'kpop-role-roster.js'),
  crossPromoJs: path.join(PORTAL, 'js', 'cross-promo.js'),
  portalMap: path.join(PORTAL, 'sitemap.xml'),
  blogMap: path.join(PORTAL, 'blog', 'sitemap.xml'),
  catalogHtml: path.join(PORTAL, 'tools', 'index.html'),
  positionHtml: path.join(POSITION_ROOT, 'index.html'),
  positionJs: path.join(POSITION_ROOT, 'js', 'app.js'),
  positionDataJs: path.join(POSITION_ROOT, 'js', 'data.js'),
  positionI18nJs: path.join(POSITION_ROOT, 'js', 'i18n.js'),
  positionCss: path.join(POSITION_ROOT, 'css', 'style.css'),
  positionEnJson: path.join(POSITION_ROOT, 'js', 'locales', 'en.json'),
  positionKoJson: path.join(POSITION_ROOT, 'js', 'locales', 'ko.json'),
  positionManifest: path.join(POSITION_ROOT, 'manifest.json'),
  positionSw: path.join(POSITION_ROOT, 'sw.js'),
});

const UNSAFE_CLAIMS = Object.freeze([
  { label: 'absolute skill ranking', pattern: /\b(?:absolute best|second[- ]strongest|clear ranking)\b/i },
  { label: 'appearance ranking', pattern: /\b(?:most conventionally attractive|most handsome face)\b/i },
  { label: 'unsupported superlative', pattern: /\b(?:legendary|unmatched|best (?:vocalist|rapper|dancer|leader)s? in K-?Pop history)\b/i },
  { label: 'unsupported viral metric', pattern: /\bviral (?:with|at) millions\b/i },
  { label: 'universal position system', pattern: /\b(?:every position in the K-?Pop system|K-?Pop takes position assignments seriously|strict hierarchy)\b/i },
  { label: 'personality-to-position mapping', pattern: /\bpersonality patterns? (?:that )?tend to align\b/i },
  { label: 'universal trainee timeline', pattern: /\b(?:train|training|trainee)[\s\S]{0,45}\b2\s*[–-]\s*7 years?\b/i },
  {
    label: 'unsupported celebrity role assignment',
    pattern: /\b(?:Jungkook|Jimin|J-Hope|Lisa|Jennie|Ros[eé]|Jisoo|RM|SUGA|Baekhyun|Jihyo|Momo|Bang Chan|Changbin|Hyunjin|Seungmin)\b[\s\S]{0,120}\b(?:main|lead|visual|center|leader|rapper|dancer|vocalist)\b/i,
  },
]);

const POSITION_FABRICATIONS = Object.freeze([
  { label: 'fabricated statistic', pattern: /(?:2[,.]?400\+?|participantsText|participantsCount|socialProof|people (?:have )?participated|positions discovered today|\uBA85\uC774 (?:\uC774\uBBF8 )?\uCC38\uC5EC)/i },
  { label: 'fabricated rating', pattern: /(?:aggregateRating|ratingValue|ratingCount)/i },
  { label: 'fabricated percentile', pattern: /(?:percentile(?:Title|Desc|Card|Text)|rarity(?:VeryRare|Rare|Common)|\btop\s+\d+(?:\.\d+)?%|\uC0C1\uC704\s*\d+(?:\.\d+)?%)/i },
  { label: 'interstitial ad overlay', pattern: /(?:\bad-overlay\b|\bad-countdown\b|\bad-box\b|\bresult-ad-container\b|\bkpop-result-ad\b)/i },
  { label: 'celebrity role mapping', pattern: /(?:\bKPOP_GROUPS\b|\bPREMIUM_ADVICE\b|\bidols\s*:|\bidol-(?:list|chip|name|group)\b|\bgroup-match-section\b|\bgroup-chip\b)/i },
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs(argv) {
  const options = { mutations: false, production: false };
  for (const argument of argv) {
    if (argument === '--mutations') options.mutations = true;
    else if (argument === '--production') options.production = true;
    else if (argument === '--help' || argument === '-h') {
      console.log('Usage: node scripts/verify-kpop-role-roster.js [--mutations] [--production]');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${argument}`);
  }
  assert(!(options.mutations && options.production), '--mutations cannot modify production');
  return options;
}

function decode(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&bull;/g, '•')
    .replace(/&rarr;/g, '→');
}

function stripComments(value) {
  return String(value || '').replace(/<!--[\s\S]*?-->/g, '');
}

function textOf(value) {
  return decode(stripComments(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(tag, name) {
  const match = String(tag || '').match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decode(match[2]) : null;
}

function classHas(tag, name) {
  return (attr(tag, 'class') || '').split(/\s+/).includes(name);
}

function tags(html, name) {
  return String(html || '').match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || [];
}

function sliceSection(html, startPattern, endPattern, label) {
  const source = String(html || '');
  const start = source.search(startPattern);
  assert(start >= 0, `Missing ${label} start`);
  const tail = source.slice(start);
  const end = tail.match(endPattern);
  assert(end, `Missing ${label} end`);
  return tail.slice(0, end.index + end[0].length);
}

function meta(html, name) {
  const matches = tags(html, 'meta').filter((tag) => (attr(tag, 'name') || '').toLowerCase() === name.toLowerCase());
  assert(matches.length === 1, `${name} meta count mismatch: ${matches.length}`);
  return attr(matches[0], 'content');
}

function metaProperty(html, property) {
  const matches = tags(html, 'meta').filter((tag) => (attr(tag, 'property') || '').toLowerCase() === property.toLowerCase());
  assert(matches.length === 1, `${property} meta property count mismatch: ${matches.length}`);
  return attr(matches[0], 'content');
}

function tagById(html, name, id, label) {
  const matches = tags(html, name).filter((tag) => attr(tag, 'id') === id);
  assert(matches.length === 1, `${label || id} count mismatch: ${matches.length}`);
  return matches[0];
}

function tagByAnyId(html, id, label) {
  const matches = Array.from(String(html || '').matchAll(new RegExp(`<([a-z][a-z0-9:-]*)\\b[^>]*\\bid\\s*=\\s*(["'])${escapeRegex(id)}\\2[^>]*>`, 'gi'))).map((match) => match[0]);
  assert(matches.length === 1, `${label || id} count mismatch: ${matches.length}`);
  return matches[0];
}

function canonical(html) {
  const matches = tags(html, 'link').filter((tag) => (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('canonical'));
  assert(matches.length === 1, `Canonical count mismatch: ${matches.length}`);
  return attr(matches[0], 'href');
}

function schemaNodes(html) {
  const nodes = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(String(html || '')))) {
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`Invalid JSON-LD: ${error.message}`);
    }
    for (const node of (Array.isArray(parsed) ? parsed : [parsed])) {
      if (node && Array.isArray(node['@graph'])) nodes.push(...node['@graph']);
      else if (node) nodes.push(node);
    }
  }
  assert(nodes.length > 0, 'Missing JSON-LD');
  return nodes;
}

function inspectAds(html) {
  const source = stripComments(html);
  const head = sliceSection(source, /<head\b/i, /<\/head>/i, 'head');
  const directPattern = /<script\b[^>]*\bsrc\s*=\s*["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=([^"'&\s>]+)[^"']*["'][^>]*><\/script>/gi;
  const managedPattern = /<script\b[^>]*\bsrc\s*=\s*["']\/portal\/js\/ad-loader\.js["'][^>]*><\/script>/gi;
  return {
    direct: Array.from(source.matchAll(directPattern)),
    directInHead: Array.from(head.matchAll(directPattern)),
    managed: Array.from(source.matchAll(managedPattern)),
    managedInHead: Array.from(head.matchAll(managedPattern)),
    manualUnits: (source.match(/<ins\b[^>]*\bclass\s*=\s*["'][^"']*\badsbygoogle\b[^"']*["'][^>]*>/gi) || []).length,
    slots: (source.match(/\bdata-ad-slot\s*=/gi) || []).length,
    surfaces: (source.match(/\bdata-ad-surface\s*=/gi) || []).length,
    pushes: (source.match(/\badsbygoogle\b[\s\S]{0,100}\.push\s*\(/gi) || []).length,
  };
}

function verifyAds(html, label, expectedMechanism) {
  const result = inspectAds(html);
  const loaders = result.direct.length + result.managed.length;
  assert(loaders === 1, `${label}: Auto Ads loader count must be exactly one, got ${loaders}`);
  assert(result.direct.length === result.directInHead.length && result.managed.length === result.managedInHead.length, `${label}: Auto Ads loader must be in head`);
  assert(result.direct.every((match) => match[1] === CLIENT), `${label}: AdSense client mismatch`);
  if (expectedMechanism === 'managed') assert(result.managed.length === 1 && result.direct.length === 0, `${label}: expected the managed Auto Ads loader`);
  if (expectedMechanism === 'direct') assert(result.direct.length === 1 && result.managed.length === 0, `${label}: expected one direct Auto Ads loader`);
  assert(result.manualUnits === 0, `${label}: manual adsbygoogle element is forbidden`);
  assert(result.slots === 0, `${label}: manual data-ad-slot is forbidden`);
  assert(result.surfaces === 0, `${label}: synthetic data-ad-surface is forbidden`);
  assert(result.pushes === 0, `${label}: manual adsbygoogle.push is forbidden`);
}

function verifyForbiddenAdCode(source, label) {
  assert(!/\badsbygoogle\b[\s\S]{0,100}\.push\s*\(/i.test(source), `${label}: manual adsbygoogle.push is forbidden`);
  assert(!/\b(?:content_ad_impression|hub_ad_impression|kpop_(?:roster|position)_[a-z0-9_]*ad_impression)\b/i.test(source), `${label}: fake ad impression event is forbidden`);
}

function visibleFaq(html) {
  const article = sliceSection(html, /<article\b/i, /<\/article>/i, 'article');
  const items = [];
  const pattern = /<(?:div|details)\b[^>]*class=["'][^"']*\bfaq-item\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|details)>/gi;
  let match;
  while ((match = pattern.exec(article))) {
    const question = match[1].match(/<(?:h3|summary)\b[^>]*>([\s\S]*?)<\/(?:h3|summary)>/i);
    const answer = match[1].match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
    assert(question && answer, 'Visible FAQ item is malformed');
    items.push({ question: textOf(question[1]), answer: textOf(answer[1]) });
  }
  return items;
}

function verifyFaq(html, nodes) {
  const visible = visibleFaq(html);
  assert(visible.length === 5, `Visible FAQ count mismatch: ${visible.length}`);
  const faqNodes = nodes.filter((node) => node['@type'] === 'FAQPage');
  assert(faqNodes.length === 1, `FAQPage schema count mismatch: ${faqNodes.length}`);
  const entities = Array.isArray(faqNodes[0].mainEntity) ? faqNodes[0].mainEntity : [];
  const structured = entities.map((entity) => {
    assert(entity && entity['@type'] === 'Question', 'FAQ schema question type mismatch');
    assert(entity.acceptedAnswer && entity.acceptedAnswer['@type'] === 'Answer', 'FAQ schema answer type mismatch');
    return { question: textOf(entity.name), answer: textOf(entity.acceptedAnswer.text) };
  });
  assert(JSON.stringify(structured) === JSON.stringify(visible), 'FAQ schema-visible parity mismatch');
}

function verifyArticle(html) {
  const title = String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  assert(title && textOf(title[1]) === ARTICLE_TITLE, 'Article title must remain unchanged');
  assert(canonical(html) === ARTICLE_CANONICAL, 'Article canonical mismatch');
  assert(meta(html, 'dateModified') === LASTMOD, `Article dateModified meta must be ${LASTMOD}`);
  verifyAds(html, 'K-pop positions article', 'managed');
  verifyForbiddenAdCode(html, 'K-pop positions article');
  assert(!/\bindexing-auto-ad\b/i.test(html), 'K-pop positions article: stale manual ad shell is forbidden');

  const nodes = schemaNodes(html);
  const articles = nodes.filter((node) => node['@type'] === 'Article');
  assert(articles.length === 1, `Article schema count mismatch: ${articles.length}`);
  assert(articles[0].dateModified === LASTMOD, `Article schema dateModified must be ${LASTMOD}`);
  assert(articles[0].mainEntityOfPage && articles[0].mainEntityOfPage['@id'] === ARTICLE_CANONICAL, 'Article schema canonical mismatch');
  verifyFaq(html, nodes);

  const article = sliceSection(html, /<article\b/i, /<\/article>/i, 'article');
  const articleText = textOf(article);
  assert(articleText.includes('Updated Aug 29, 2026'), 'Visible article metadata must say Updated Aug 29, 2026');
  assert(/(?:position|role) labels?/i.test(articleText) && /\bvar(?:y|ies)\b/i.test(articleText), 'Article must explain that position labels vary');
  for (const claim of UNSAFE_CLAIMS) assert(!claim.pattern.test(articleText), `Unsafe K-pop claim detected: ${claim.label}`);
  const sourceLinks = tags(article, 'a').map((tag) => attr(tag, 'href')).filter((href) => OFFICIAL_PROFILE_SOURCES.includes(href));
  assert(
    JSON.stringify(sourceLinks) === JSON.stringify(OFFICIAL_PROFILE_SOURCES),
    `Official profile source href/order mismatch: ${sourceLinks.join(', ')}`,
  );
  for (const href of OFFICIAL_PROFILE_SOURCES) {
    assert(sourceLinks.filter((value) => value === href).length === 1, `Official profile source href count mismatch: ${href}`);
  }

  const quickSection = sliceSection(html, /<section\b[^>]*class=["'][^"']*\bindexing-quick-rail\b/i, /<\/section>/i, 'quick rail');
  assert(/\bdata-quick-rail-mode=["']focused["']/i.test(quickSection), 'K-pop quick rail must declare focused mode');
  const quickTags = tags(quickSection, 'a').filter((tag) => classHas(tag, 'quick-card'));
  assert(quickTags.length === QUICK.length, `Focused quick-card count mismatch: ${quickTags.length}`);
  QUICK.forEach((expected, index) => {
    assert(attr(quickTags[index], 'href') === expected.href, `Quick card ${index + 1} href mismatch`);
    assert(attr(quickTags[index], 'data-content-surface') === expected.surface, `Quick card ${index + 1} surface mismatch`);
    assert(attr(quickTags[index], 'data-target-slug') === expected.slug, `Quick card ${index + 1} target slug mismatch`);
  });

  const telemetry = sliceSection(html, /\(function indexingContentTelemetry\(\)/, /<\/script>/i, 'content telemetry');
  for (const eventName of ['content_view', 'content_test_click', 'content_cta_click']) assert(telemetry.includes(`'${eventName}'`) || telemetry.includes(`"${eventName}"`), `Missing content event: ${eventName}`);
  assert(/\bcta_surface\s*:/.test(telemetry), 'content_cta_click must send cta_surface');
  assert(/\btarget_slug\s*:/.test(telemetry), 'content_cta_click must send target_slug');
}

function verifyTool(bundle) {
  verifyAds(bundle.toolHtml, 'K-pop roster tool', 'direct');
  verifyForbiddenAdCode(bundle.toolHtml, 'K-pop roster tool HTML');
  verifyForbiddenAdCode(bundle.toolJs, 'K-pop roster tool JS');
  assert(meta(bundle.toolHtml, 'dateModified') === LASTMOD, `K-pop roster dateModified meta must be ${LASTMOD}`);
  assert(canonical(bundle.toolHtml) === TOOL_CANONICAL, 'K-pop roster canonical mismatch');
  const appNodes = schemaNodes(bundle.toolHtml).filter((node) => node['@type'] === 'WebApplication');
  assert(appNodes.length === 1 && appNodes[0].dateModified === LASTMOD, `K-pop roster WebApplication dateModified must be ${LASTMOD}`);

  const alternates = tags(bundle.toolHtml, 'link').filter((tag) => (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('alternate'));
  const languages = alternates.map((tag) => attr(tag, 'hreflang'));
  assert(alternates.length === HREFLANGS.length, `Roster hreflang count mismatch: ${alternates.length}`);
  assert(JSON.stringify([...languages].sort()) === JSON.stringify([...HREFLANGS].sort()), `Roster hreflang set mismatch: ${languages.join(', ')}`);
  assert(new Set(languages).size === languages.length, 'Roster has duplicate hreflangs');
  for (const tag of alternates) {
    const language = attr(tag, 'hreflang');
    const expected = language === 'x-default' ? TOOL_CANONICAL : `${TOOL_CANONICAL}?lang=${language}`;
    assert(attr(tag, 'href') === expected, `Roster ${language} alternate href mismatch`);
  }

  assert(LOCALES.every((locale) => bundle.toolJs.includes(`'${locale}'`)), 'Roster JS must retain all 12 locales');
  assert(/id=["']related-position-test["']/i.test(bundle.toolHtml), 'Roster related position-test link needs stable id=related-position-test');
  assert(/track\(\s*['"]kpop_roster_related_click['"]/.test(bundle.toolJs), 'Roster related position-test click event is missing');
}

function parseJson(source, label) {
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`${label} is invalid JSON: ${error.message}`);
  }
}

function quotedArray(source, declaration, label) {
  const match = source.match(new RegExp(`(?:const|let|var)\\s+${declaration}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*;`));
  assert(match, `${label} declaration is missing`);
  return Array.from(match[1].matchAll(/['"]([^'"]+)['"]/g)).map((item) => item[1]);
}

function verifyPositionPackage(bundle) {
  const expectedLocaleFiles = ['en.json', 'ko.json'];
  assert(
    JSON.stringify(bundle.positionLocaleFiles) === JSON.stringify(expectedLocaleFiles),
    `K-pop position locale bundle must contain only en.json and ko.json, got ${(bundle.positionLocaleFiles || []).join(', ')}`,
  );
  const en = parseJson(bundle.positionEnJson, 'K-pop position en.json');
  const ko = parseJson(bundle.positionKoJson, 'K-pop position ko.json');
  assert(en && ko && typeof en === 'object' && typeof ko === 'object', 'K-pop position locale JSON roots must be objects');

  const manifestLinks = tags(bundle.positionHtml, 'link').filter((tag) => (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('manifest'));
  assert(manifestLinks.length === 1 && /^\.?\/?manifest\.json$/.test(attr(manifestLinks[0], 'href') || ''), 'K-pop position manifest link/scope mismatch');
  const manifest = parseJson(bundle.positionManifest, 'K-pop position manifest.json');
  assert(manifest.name === 'K-POP Role Quiz' && manifest.short_name === 'K-POP Role', 'K-pop position manifest product name mismatch');
  assert(typeof manifest.description === 'string' && /playful/i.test(manifest.description) && /seven/i.test(manifest.description), 'K-pop position manifest description must remain truthful');
  assert(['.', './'].includes(manifest.start_url), `K-pop position manifest start_url must stay in app scope: ${manifest.start_url}`);
  assert(manifest.scope === undefined || ['.', './'].includes(manifest.scope), `K-pop position manifest scope escapes the app: ${manifest.scope}`);
  assert(manifest.lang === 'en' && manifest.dir === 'ltr', 'K-pop position manifest default locale mismatch');
  assert(manifest.display === 'standalone', 'K-pop position manifest display mismatch');
  const manifestIcons = Array.isArray(manifest.icons) ? manifest.icons.map((icon) => icon && icon.src) : [];
  assert(JSON.stringify(manifestIcons) === JSON.stringify(['icon-192.svg', 'icon-512.svg']), `K-pop position manifest icon set mismatch: ${manifestIcons.join(', ')}`);

  const expectedAssets = [
    './',
    './index.html',
    './css/style.css',
    './js/data.js',
    './js/app.js',
    './js/i18n.js',
    './js/locales/en.json',
    './js/locales/ko.json',
    './manifest.json',
    './icon-192.svg',
    './icon-512.svg',
  ];
  const swAssets = quotedArray(bundle.positionSw, 'ASSETS', 'K-pop position service-worker ASSETS');
  assert(JSON.stringify(swAssets) === JSON.stringify(expectedAssets), `K-pop position service-worker asset allowlist mismatch: ${swAssets.join(', ')}`);
  assert((bundle.positionSw.match(/addEventListener\(\s*['"]fetch['"]/g) || []).length === 1, 'K-pop position service worker fetch handler count mismatch');
  assert(/request\.method\s*!==\s*['"]GET['"]/.test(bundle.positionSw), 'K-pop position service worker must bypass non-GET requests');
  assert(/\.origin\s*!==\s*self\.location\.origin/.test(bundle.positionSw), 'K-pop position service worker must bypass cross-origin requests');
  assert(/response\.ok/.test(bundle.positionSw), 'K-pop position service worker must cache only successful responses');
  assert(/waitUntil\s*\([\s\S]{0,600}cache\.put\s*\(/.test(bundle.positionSw), 'K-pop position service worker cache.put must be lifetime-bound with waitUntil');
  assert(/(?:const|let|var)\s+STATIC_PATHS\s*=\s*new Set\s*\(/.test(bundle.positionSw)
    && /STATIC_PATHS\.has\(\s*url\.pathname\s*\)/.test(bundle.positionSw), 'K-pop position service worker must restrict runtime writes to its static allowlist');

  const htmlRegistrations = (bundle.positionHtml.match(/serviceWorker\.register\s*\(/g) || []).length;
  const appRegistrations = (bundle.positionJs.match(/serviceWorker\.register\s*\(/g) || []).length;
  assert(htmlRegistrations === 0 && appRegistrations === 1, `K-pop position service worker must register exactly once from app.js: html=${htmlRegistrations}, app=${appRegistrations}`);
  const registration = bundle.positionJs.match(/serviceWorker\.register\s*\(\s*(['"])(\.\/?sw\.js|sw\.js)\1([\s\S]{0,180}?)\)/);
  assert(registration, 'K-pop position service-worker registration URL must remain relative to /kpop-position/');
  assert(!/scope\s*:\s*['"]\//.test(registration[3]), 'K-pop position service-worker registration scope must not escape /kpop-position/');
}

function verifyPositionTarget(bundle) {
  verifyPositionPackage(bundle);
  verifyAds(bundle.positionHtml, 'K-pop position test', 'direct');
  const positionSources = {
    HTML: bundle.positionHtml,
    'app.js': bundle.positionJs,
    'data.js': bundle.positionDataJs,
    'i18n.js': bundle.positionI18nJs,
    'style.css': bundle.positionCss,
    'en.json': bundle.positionEnJson,
    'ko.json': bundle.positionKoJson,
    'manifest.json': bundle.positionManifest,
    'sw.js': bundle.positionSw,
  };
  for (const [name, source] of Object.entries(positionSources)) {
    verifyForbiddenAdCode(source, `K-pop position test ${name}`);
  }
  assert(meta(bundle.positionHtml, 'dateModified') === LASTMOD, `K-pop position dateModified meta must be ${LASTMOD}`);
  const viewport = meta(bundle.positionHtml, 'viewport');
  assert(/(?:^|,)\s*width\s*=\s*device-width(?:\s*,|$)/i.test(viewport) && /(?:^|,)\s*initial-scale\s*=\s*1(?:\.0)?(?:\s*,|$)/i.test(viewport), 'K-pop position viewport must declare device width and initial scale');
  assert(!/user-scalable\s*=\s*no/i.test(viewport) && !/maximum-scale\s*=\s*1(?:\.0)?(?:\s*,|$)/i.test(viewport), 'K-pop position viewport must preserve user zoom');
  assert(canonical(bundle.positionHtml) === POSITION_CANONICAL, 'K-pop position default canonical mismatch');
  assert(metaProperty(bundle.positionHtml, 'og:url') === POSITION_CANONICAL, 'K-pop position default og:url mismatch');

  const htmlTag = tags(bundle.positionHtml, 'html');
  assert(htmlTag.length === 1 && attr(htmlTag[0], 'lang') === 'en', 'K-pop position default document language must be en');
  const alternates = tags(bundle.positionHtml, 'link').filter((tag) => (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('alternate'));
  const languages = alternates.map((tag) => attr(tag, 'hreflang'));
  assert(alternates.length === POSITION_HREFLANGS.length, `K-pop position hreflang count mismatch: ${alternates.length}`);
  assert(JSON.stringify([...languages].sort()) === JSON.stringify([...POSITION_HREFLANGS].sort()), `K-pop position hreflang set mismatch: ${languages.join(', ')}`);
  assert(new Set(languages).size === languages.length, 'K-pop position has duplicate hreflangs');
  const expectedAlternates = {
    en: POSITION_CANONICAL,
    ko: `${POSITION_CANONICAL}?lang=ko`,
    'x-default': POSITION_CANONICAL,
  };
  for (const tag of alternates) {
    const language = attr(tag, 'hreflang');
    assert(attr(tag, 'href') === expectedAlternates[language], `K-pop position ${language} alternate href mismatch`);
  }

  const appNodes = schemaNodes(bundle.positionHtml).filter((node) => ['SoftwareApplication', 'WebApplication'].includes(node['@type']));
  assert(appNodes.length === 1, `K-pop position application schema count mismatch: ${appNodes.length}`);
  assert(appNodes[0].url === POSITION_CANONICAL, `K-pop position default schema URL mismatch: ${appNodes[0].url}`);
  assert(appNodes[0].inLanguage === 'en', `K-pop position default schema language must be en: ${appNodes[0].inLanguage}`);
  assert(appNodes[0].dateModified === LASTMOD, `K-pop position schema dateModified must be ${LASTMOD}`);
  assert(!appNodes[0].aggregateRating, 'K-pop position fabricated rating is forbidden');

  const languageButtons = tags(bundle.positionHtml, 'button').filter((tag) => classHas(tag, 'lang-option'));
  const buttonLanguages = languageButtons.map((tag) => attr(tag, 'data-lang'));
  assert(JSON.stringify([...buttonLanguages].sort()) === JSON.stringify([...POSITION_LOCALES].sort()), `K-pop position language controls mismatch: ${buttonLanguages.join(', ')}`);
  const supportedMatch = bundle.positionI18nJs.match(/supportedLanguages\s*=\s*\[([\s\S]*?)\]/);
  assert(supportedMatch, 'K-pop position supportedLanguages declaration is missing');
  const supportedLanguages = Array.from(supportedMatch[1].matchAll(/['"]([a-z-]+)['"]/gi)).map((match) => match[1]);
  assert(JSON.stringify([...supportedLanguages].sort()) === JSON.stringify([...POSITION_LOCALES].sort()), `K-pop position runtime language set mismatch: ${supportedLanguages.join(', ')}`);

  const skip = tags(bundle.positionHtml, 'a').filter((tag) => classHas(tag, 'skip-link'));
  assert(skip.length === 1 && attr(skip[0], 'href') === '#main-content', 'K-pop position skip link target mismatch');
  const main = tagById(bundle.positionHtml, 'main', 'main-content', 'K-pop position main landmark');
  assert(main, 'K-pop position main landmark is missing');
  const questionText = tagByAnyId(bundle.positionHtml, 'q-text', 'K-pop position question focus target');
  assert(attr(questionText, 'tabindex') === '-1', 'K-pop position question text must be programmatically focusable');
  const quizStatus = tagByAnyId(bundle.positionHtml, 'quiz-status', 'K-pop position live status');
  assert(attr(quizStatus, 'role') === 'status' && attr(quizStatus, 'aria-live') === 'polite', 'K-pop position live status semantics mismatch');
  const overlay = tagById(bundle.positionHtml, 'div', 'share-modal', 'K-pop position share overlay');
  assert(attr(overlay, 'aria-hidden') === 'true', 'K-pop position share overlay aria-hidden mismatch');
  const dialogs = tags(bundle.positionHtml, 'div').filter((tag) => classHas(tag, 'share-modal-content'));
  assert(dialogs.length === 1, `K-pop position share dialog count mismatch: ${dialogs.length}`);
  const dialog = dialogs[0];
  assert(attr(dialog, 'role') === 'dialog', 'K-pop position share modal role mismatch');
  assert(attr(dialog, 'aria-modal') === 'true', 'K-pop position share modal aria-modal mismatch');
  const labelledBy = attr(dialog, 'aria-labelledby');
  assert(labelledBy && tagById(bundle.positionHtml, 'h2', labelledBy, 'K-pop position share modal label'), 'K-pop position share modal label mismatch');
  const close = tagById(bundle.positionHtml, 'button', 'share-close', 'K-pop position share close button');
  assert(attr(close, 'aria-label'), 'K-pop position share close button needs an accessible name');

  const combined = Object.values(positionSources).join('\n');
  for (const fabrication of POSITION_FABRICATIONS) {
    assert(!fabrication.pattern.test(combined), `K-pop position ${fabrication.label} is forbidden`);
  }
  assert(!/(?:\bJungkook\b|\bJimin\b|\bJ-Hope\b|\bJennie\b|\bLisa\b|\bRos[e\u00e9]\b|\bBang Chan\b|\bHyunjin\b|\uC815\uAD6D|\uC9C0\uBBFC|\uC81C\uB2C8|\uB9AC\uC0AC)[\s\S]{0,100}(?:main|lead|vocal|rapper|dancer|visual|leader|\uBA54\uC778|\uB9AC\uB354|\uBCF4\uCEEC|\uB798\uD37C|\uB304\uC11C|\uBE44\uC8FC\uC5BC)/i.test(combined), 'K-pop position celebrity role mapping is forbidden');
}

function verifyCrossPromo(source) {
  verifyForbiddenAdCode(source, 'cross-promo.js');
  for (const contract of [
    'function getKpopRosterBridgeConfig()',
    'data-destination="group_roster"',
    'data-destination="position_test"',
    'surface_name: \'blog_kpop_roster\'',
    'start=1&surface=blog_kpop_position_bridge',
    'source=blog_kpop_position_bridge',
  ]) assert(source.includes(contract), `K-pop dynamic bridge contract missing: ${contract}`);
  for (const eventName of ['kpop_roster_bridge_view', 'kpop_roster_bridge_click']) {
    assert(new RegExp(`gtag\\(\\s*['"]event['"]\\s*,\\s*['"]${eventName}['"]`).test(source), `K-pop dynamic bridge event missing: ${eventName}`);
  }
}

function uniqueLocs(xml, label) {
  const locs = Array.from(String(xml).matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)).map((match) => decode(match[1]).trim());
  assert(locs.length > 0, `${label} has no sitemap entries`);
  const duplicate = locs.find((loc, index) => locs.indexOf(loc) !== index);
  assert(!duplicate, `${label} has duplicate loc: ${duplicate}`);
}

function verifySitemap(xml, canonicalUrl, label) {
  uniqueLocs(xml, label);
  const entries = (String(xml).match(/<url>[\s\S]*?<\/url>/gi) || []).filter((entry) => {
    const loc = entry.match(/<loc>\s*([\s\S]*?)\s*<\/loc>/i);
    return loc && decode(loc[1]).trim() === canonicalUrl;
  });
  assert(entries.length === 1, `${label} focused entry count mismatch: ${entries.length}`);
  assert(new RegExp(`<lastmod>\\s*${LASTMOD}\\s*</lastmod>`).test(entries[0]), `${label} lastmod must be ${LASTMOD}`);
}

function catalogCardEntries(html) {
  const entries = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(String(html || '')))) {
    const tag = `<a${match[1]}>`;
    if (!classHas(tag, 'tool-card')) continue;
    const name = match[2].match(/<(?:div|h[1-6])\b[^>]*class=["'][^"']*\btc-name\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|h[1-6])>/i);
    assert(name, 'Catalog tool-card is missing .tc-name');
    entries.push({ href: attr(tag, 'href'), name: textOf(name[1]) });
  }
  return entries;
}

function normalizeCatalogUrl(value, kind, index) {
  const raw = decode(value);
  assert(raw, `Catalog ${kind} ${index + 1} URL is empty`);
  const url = new URL(raw, 'https://dopabrain.com');
  assert(url.protocol === 'https:' && url.origin === 'https://dopabrain.com' && !url.username && !url.password, `Catalog ${kind} ${index + 1} URL must stay on the DopaBrain HTTPS origin`);
  assert(!url.hash, `Catalog ${kind} ${index + 1} URL must not contain a fragment`);
  if (kind === 'DOM') {
    const params = Array.from(url.searchParams.entries());
    const validTracking = params.length === 0 || (params.length === 1 && params[0][0] === 'source' && params[0][1] === 'portal_tools_catalog');
    assert(validTracking, `Catalog DOM ${index + 1} query contract mismatch: ${url.search}`);
  } else {
    assert(/^https:\/\/dopabrain\.com\//.test(raw), `Catalog schema ${index + 1} URL must be absolute`);
    assert(!url.search, `Catalog schema ${index + 1} URL must not contain a query`);
    assert(raw === `${url.origin}${url.pathname}`, `Catalog schema ${index + 1} URL is not canonical`);
  }
  return `${url.origin}${url.pathname}`;
}

function catalogContract(html) {
  const cards = catalogCardEntries(html);
  const cardEntries = cards.map((card, index) => ({
    url: normalizeCatalogUrl(card.href, 'DOM', index),
    name: card.name,
  }));
  assert(cards.length === CATALOG_COUNT, `Catalog DOM count must be exactly ${CATALOG_COUNT}, got ${cards.length}`);
  assert(cardEntries.every((entry) => entry.name), 'Catalog DOM contains an empty tool name');
  assert(new Set(cardEntries.map((entry) => entry.url)).size === CATALOG_COUNT, 'Tools catalog has duplicate card routes');

  const collection = schemaNodes(html).find((node) => node['@type'] === 'CollectionPage');
  assert(collection && collection.mainEntity && collection.mainEntity['@type'] === 'ItemList', 'Tools catalog ItemList schema is missing');
  const list = collection.mainEntity;
  const elements = Array.isArray(list.itemListElement) ? list.itemListElement : [];
  assert(elements.length === CATALOG_COUNT, `Catalog schema count must be exactly ${CATALOG_COUNT}, got ${elements.length}`);
  const schemaEntries = elements.map((item, index) => {
    assert(item && item['@type'] === 'ListItem', `Catalog schema item ${index + 1} type mismatch`);
    assert(item.position === index + 1, `Catalog ItemList position ${index + 1} mismatch: ${item.position}`);
    assert(typeof item.name === 'string' && item.name.trim(), `Catalog schema item ${index + 1} name is empty`);
    return { url: normalizeCatalogUrl(item.url, 'schema', index), name: textOf(item.name) };
  });
  assert(list.numberOfItems === CATALOG_COUNT, `Catalog numberOfItems must be exactly ${CATALOG_COUNT}, got ${list.numberOfItems}`);
  assert(
    JSON.stringify(cardEntries) === JSON.stringify(schemaEntries),
    'Catalog DOM/schema order, URL, or name mismatch',
  );
  return { cards, cardEntries, schemaEntries };
}

function verifyCatalog(html) {
  verifyAds(html, 'Portal tools catalog', 'direct');
  verifyForbiddenAdCode(html, 'Portal tools catalog');
  const contract = catalogContract(html);
  assert(contract.cardEntries.filter((entry) => entry.url === TOOL_CANONICAL).length === 1, 'K-pop roster catalog card count mismatch');
  assert(contract.schemaEntries.filter((entry) => entry.url === TOOL_CANONICAL).length === 1, 'K-pop roster schema entry count mismatch');
}

function verifyDestinations() {
  const required = [
    path.join(PORTAL, 'tools', 'kpop-role-roster.html'),
    path.join(ROOT, 'projects', 'kpop-position', 'index.html'),
  ];
  required.forEach((file) => assert(fs.existsSync(file) && fs.statSync(file).isFile(), `CTA destination missing: ${path.relative(ROOT, file)}`));
}

function verifyStatic(bundle) {
  verifyArticle(bundle.articleHtml);
  verifyTool(bundle);
  verifyPositionTarget(bundle);
  verifyCrossPromo(bundle.crossPromoJs);
  verifySitemap(bundle.blogMap, ARTICLE_CANONICAL, 'Blog sitemap');
  verifySitemap(bundle.portalMap, TOOL_CANONICAL, 'Portal sitemap');
  verifyCatalog(bundle.catalogHtml);
  verifyDestinations();
}

function readLocalBundle() {
  const bundle = {};
  for (const [name, file] of Object.entries(FILES)) {
    assert(fs.existsSync(file), `Required file missing: ${path.relative(ROOT, file)}`);
    bundle[name] = fs.readFileSync(file, 'utf8');
  }
  bundle.positionLocaleFiles = fs.readdirSync(path.join(POSITION_ROOT, 'js', 'locales'))
    .filter((name) => name.toLowerCase().endsWith('.json'))
    .map((name) => name.toLowerCase())
    .sort();
  return bundle;
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow' });
  assert(response.ok, `Fetch failed ${response.status}: ${url}`);
  return response.text();
}

async function fetchStatus(url) {
  const response = await fetch(url, { redirect: 'follow' });
  return response.status;
}

async function readProductionBundle() {
  const [
    articleHtml,
    toolHtml,
    toolJs,
    crossPromoJs,
    portalMap,
    blogMap,
    catalogHtml,
    positionHtml,
    positionJs,
    positionDataJs,
    positionI18nJs,
    positionCss,
    positionEnJson,
    positionKoJson,
    positionManifest,
    positionSw,
  ] = await Promise.all([
    fetchText(`https://dopabrain.com${ARTICLE_ROUTE}`),
    fetchText(`https://dopabrain.com${TOOL_ROUTE}`),
    fetchText('https://dopabrain.com/portal/js/kpop-role-roster.js'),
    fetchText('https://dopabrain.com/portal/js/cross-promo.js'),
    fetchText('https://dopabrain.com/portal/sitemap.xml'),
    fetchText('https://dopabrain.com/portal/blog/sitemap.xml'),
    fetchText('https://dopabrain.com/portal/tools/'),
    fetchText('https://dopabrain.com/kpop-position/'),
    fetchText('https://dopabrain.com/kpop-position/js/app.js'),
    fetchText('https://dopabrain.com/kpop-position/js/data.js'),
    fetchText('https://dopabrain.com/kpop-position/js/i18n.js'),
    fetchText('https://dopabrain.com/kpop-position/css/style.css'),
    fetchText('https://dopabrain.com/kpop-position/js/locales/en.json'),
    fetchText('https://dopabrain.com/kpop-position/js/locales/ko.json'),
    fetchText('https://dopabrain.com/kpop-position/manifest.json'),
    fetchText('https://dopabrain.com/kpop-position/sw.js'),
  ]);
  const unsupportedLocales = LOCALES.filter((locale) => !POSITION_LOCALES.includes(locale));
  const unsupportedStatuses = await Promise.all(unsupportedLocales.map((locale) => fetchStatus(`https://dopabrain.com/kpop-position/js/locales/${locale}.json`)));
  const positionLocaleFiles = ['en.json', 'ko.json'];
  unsupportedLocales.forEach((locale, index) => {
    if (![404, 410].includes(unsupportedStatuses[index])) positionLocaleFiles.push(`${locale}.json`);
  });
  return {
    articleHtml,
    toolHtml,
    toolJs,
    crossPromoJs,
    portalMap,
    blogMap,
    catalogHtml,
    positionHtml,
    positionJs,
    positionDataJs,
    positionI18nJs,
    positionCss,
    positionEnJson,
    positionKoJson,
    positionManifest,
    positionSw,
    positionLocaleFiles: positionLocaleFiles.sort(),
  };
}

function localFile(pathname) {
  let base = null;
  let relative = null;
  if (pathname.startsWith('/portal/')) {
    base = PORTAL;
    relative = pathname.slice('/portal/'.length);
  } else if (pathname.startsWith(POSITION_ROUTE)) {
    base = POSITION_ROOT;
    relative = pathname.slice(POSITION_ROUTE.length);
  } else return null;
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  const file = path.resolve(base, relative);
  return file.startsWith(`${base}${path.sep}`) && fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

function createServer(getBundle) {
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname);
    const bundle = getBundle();
    const overrides = {
      [ARTICLE_ROUTE]: ['articleHtml', '.html'],
      [TOOL_ROUTE]: ['toolHtml', '.html'],
      '/portal/tools/': ['catalogHtml', '.html'],
      '/portal/tools/index.html': ['catalogHtml', '.html'],
      '/portal/js/kpop-role-roster.js': ['toolJs', '.js'],
      '/portal/js/cross-promo.js': ['crossPromoJs', '.js'],
      [POSITION_ROUTE]: ['positionHtml', '.html'],
      '/kpop-position/index.html': ['positionHtml', '.html'],
      '/kpop-position/js/app.js': ['positionJs', '.js'],
      '/kpop-position/js/data.js': ['positionDataJs', '.js'],
      '/kpop-position/js/i18n.js': ['positionI18nJs', '.js'],
      '/kpop-position/css/style.css': ['positionCss', '.css'],
      '/kpop-position/js/locales/en.json': ['positionEnJson', '.json'],
      '/kpop-position/js/locales/ko.json': ['positionKoJson', '.json'],
      '/kpop-position/manifest.json': ['positionManifest', '.json'],
      '/kpop-position/sw.js': ['positionSw', '.js'],
    };
    const override = overrides[pathname];
    if (override) {
      response.writeHead(200, { 'Content-Type': mime[override[1]] });
      response.end(bundle[override[0]]);
      return;
    }
    const file = localFile(pathname);
    if (!file) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}

async function isolateNetwork(page, origin) {
  const allowedOrigin = new URL(origin).origin;
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === allowedOrigin || ['data:', 'blob:'].includes(url.protocol)) route.continue();
    else route.abort();
  });
}

async function readEvents(page) {
  return page.evaluate(() => (window.dataLayer || []).map((entry) => {
    const values = Array.from(entry || []);
    return values[0] === 'event' ? { name: values[1], params: JSON.parse(JSON.stringify(values[2] || {})) } : null;
  }).filter(Boolean));
}

async function waitForEventCount(page, name, count) {
  await page.waitForFunction(({ eventName, expected }) => (window.dataLayer || []).filter((entry) => {
    const values = Array.from(entry || []);
    return values[0] === 'event' && values[1] === eventName;
  }).length >= expected, { eventName: name, expected: count }, { timeout: 5000 });
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.documentElement.clientWidth,
    offenders: Array.from(document.body.querySelectorAll('*')).map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        marker: `${node.tagName}.${String(node.className || '').replace(/\s+/g, '.')}#${node.id || ''}`,
        left: Math.round(rect.left * 10) / 10,
        right: Math.round(rect.right * 10) / 10,
      };
    }).filter((item) => item.left < -1 || item.right > document.documentElement.clientWidth + 1).slice(0, 5),
  }));
  assert(overflow.document <= 1 && overflow.body <= 1, `${label} horizontal overflow: document=${overflow.document}px body=${overflow.body}px offenders=${JSON.stringify(overflow.offenders)}`);
}

async function assertTargets(page, selector, label) {
  const targets = page.locator(selector);
  const count = await targets.count();
  assert(count > 0, `${label}: no target controls found`);
  for (let index = 0; index < count; index += 1) {
    const target = targets.nth(index);
    if (!(await target.isVisible())) continue;
    const box = await target.boundingBox();
    const marker = await target.evaluate((node) => `${node.tagName}.${node.className || ''}#${node.id || ''}`);
    assert(box && box.width >= 44 && box.height >= 44, `${label} violates 44px target: ${marker} (${box ? `${box.width.toFixed(1)}x${box.height.toFixed(1)}` : 'no box'})`);
  }
}

function assertRequiredParams(actual, expected, label) {
  for (const [key, value] of Object.entries(expected)) assert(actual && actual[key] === value, `${label}.${key} mismatch: expected ${value}, got ${actual && actual[key]}`);
}

function assertExactParamKeys(actual, expectedKeys, label) {
  const keys = Object.keys(actual || {}).sort();
  const expected = [...expectedKeys].sort();
  assert(JSON.stringify(keys) === JSON.stringify(expected), `${label} analytics params must match the allowlist: expected ${expected.join(', ')}, got ${keys.join(', ')}`);
}

async function newPage(browser, viewport, origin) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await isolateNetwork(page, origin);
  return { context, page, errors };
}

async function verifyLocales(browser, origin, locales = LOCALES) {
  const { context, page, errors } = await newPage(browser, VIEWPORTS[0], origin);
  const reports = [];
  try {
    await page.goto(`${origin}${TOOL_ROUTE}?lang=en&source=verify_locale_baseline`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#members .member');
    const english = await page.evaluate((selectors) => ({
      pageTitle: document.title.trim(),
      title: document.querySelector(selectors.title)?.textContent.trim(),
      lead: document.querySelector(selectors.lead)?.textContent.trim(),
      generate: document.querySelector(selectors.generate)?.textContent.trim(),
      privacy: document.querySelector('[data-i18n="privacy"]')?.textContent.trim(),
    }), ROSTER_CORE_COPY_SELECTORS);
    assert(Object.values(english).every(Boolean), 'Roster English baseline copy is incomplete');
    for (const locale of locales) {
      await page.goto(`${origin}${TOOL_ROUTE}?lang=${locale}&source=verify`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#members .member');
      const report = await page.evaluate(({ expected, selectors }) => ({
        expected,
        language: document.documentElement.lang,
        core: {
          pageTitle: document.title.trim(),
          title: document.querySelector(selectors.title)?.textContent.trim(),
          lead: document.querySelector(selectors.lead)?.textContent.trim(),
          generate: document.querySelector(selectors.generate)?.textContent.trim(),
        },
        privacy: document.querySelector('[data-i18n="privacy"]')?.textContent.trim(),
        members: document.querySelectorAll('#members .member').length,
        hreflangs: Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((node) => node.hreflang),
        ads: document.querySelectorAll('ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').length,
        related: document.querySelector('#related-position-test')?.getAttribute('href'),
      }), { expected: locale, selectors: ROSTER_CORE_COPY_SELECTORS });
      assert(report.language === locale, `${locale} runtime document language mismatch`);
      assert(Object.values(report.core).every(Boolean), `${locale} core localized entry is incomplete`);
      if (locale !== 'en') {
        for (const key of Object.keys(ROSTER_CORE_COPY_SELECTORS)) {
          assert(report.core[key] !== english[key], `${locale} core localized entry still uses English for ${key}`);
        }
      }
      if (PARTIAL_ROSTER_LOCALES.includes(locale)) {
        assert(report.privacy === english.privacy, `${locale} partial locale must use the explicit English fallback for non-core copy`);
      }
      assert(report.members === 5, `${locale} default member count mismatch`);
      assert(JSON.stringify([...report.hreflangs].sort()) === JSON.stringify([...HREFLANGS].sort()), `${locale} runtime hreflang mismatch`);
      assert(report.ads === 0, `${locale} runtime contains a fake manual ad`);
      const related = new URL(report.related, 'https://dopabrain.com');
      const expectedQuizLocale = locale === 'ko' ? 'ko' : 'en';
      assert(related.pathname === POSITION_ROUTE, `${locale} roster related position-test pathname mismatch`);
      assert(related.searchParams.get('lang') === expectedQuizLocale && related.searchParams.get('start') === '1' && related.searchParams.get('surface') === 'kpop_roster_related', `${locale} roster related position-test locale normalization mismatch`);
      assert([...related.searchParams.keys()].length === 3, `${locale} roster related position-test query contains unexpected parameters`);
      await assertNoOverflow(page, `${locale} locale`);
      reports.push(report);
    }
    assert(new Set(reports.map((report) => report.core.pageTitle)).size === reports.length, 'Roster core locale document titles must be distinct');
    assert(errors.length === 0, `Locale runtime errors: ${errors.join(' | ')}`);
    return reports;
  } finally {
    await context.close();
  }
}

async function verifyCatalogRuntime(browser, origin, locales = LOCALES, viewports = VIEWPORTS) {
  const reports = [];
  for (const viewport of viewports) {
    const { context, page, errors } = await newPage(browser, viewport, origin);
    try {
      for (const locale of locales) {
        await page.goto(`${origin}/portal/tools/?lang=${locale}`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.tool-card');
        const report = await page.evaluate(() => {
          const schema = JSON.parse(document.querySelector('#tools-catalog-schema')?.textContent || '{}');
          const items = schema.mainEntity?.itemListElement || [];
          return {
            language: document.documentElement.lang,
            canonical: document.querySelector('link[rel="canonical"]')?.href,
            ogUrl: document.querySelector('meta[property="og:url"]')?.content,
            hreflangs: Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((node) => node.hreflang),
            cards: Array.from(document.querySelectorAll('a.tool-card')).map((node) => ({
              href: node.getAttribute('href'),
              name: node.querySelector('.tc-name')?.textContent.trim(),
            })),
            numberOfItems: schema.mainEntity?.numberOfItems,
            items: items.map((item) => ({ type: item['@type'], position: item.position, url: item.url, name: item.name })),
            fakeAds: document.querySelectorAll('ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').length,
          };
        });
        const expectedCanonical = locale === 'en' ? 'https://dopabrain.com/portal/tools/' : `https://dopabrain.com/portal/tools/?lang=${locale}`;
        assert(report.language === locale, `${viewport.name} catalog ${locale} document language mismatch`);
        assert(report.canonical === expectedCanonical && report.ogUrl === expectedCanonical, `${viewport.name} catalog ${locale} metadata mismatch`);
        assert(JSON.stringify([...report.hreflangs].sort()) === JSON.stringify([...HREFLANGS].sort()), `${viewport.name} catalog ${locale} hreflang mismatch`);
        assert(report.cards.length === CATALOG_COUNT && report.items.length === CATALOG_COUNT && report.numberOfItems === CATALOG_COUNT, `${viewport.name} catalog ${locale} exact ${CATALOG_COUNT} count mismatch`);
        const cardEntries = report.cards.map((card, index) => ({ url: normalizeCatalogUrl(card.href, 'DOM', index), name: card.name }));
        const schemaEntries = report.items.map((item, index) => {
          assert(item.type === 'ListItem' && item.position === index + 1, `${viewport.name} catalog ${locale} schema position ${index + 1} mismatch`);
          return { url: normalizeCatalogUrl(item.url, 'schema', index), name: textOf(item.name) };
        });
        assert(JSON.stringify(cardEntries) === JSON.stringify(schemaEntries), `${viewport.name} catalog ${locale} runtime DOM/schema order, URL, or name mismatch`);
        assert(report.fakeAds === 0, `${viewport.name} catalog ${locale} contains a fake manual ad`);
        await assertTargets(page, '.tool-card,.theme-btn', `${viewport.name} catalog ${locale} control`);
        await assertNoOverflow(page, `${viewport.name} catalog ${locale}`);
        reports.push({ viewport: viewport.name, locale });
      }
      assert(errors.length === 0, `${viewport.name} catalog runtime errors: ${errors.join(' | ')}`);
    } finally {
      await context.close();
    }
  }
  return reports;
}

async function verifyToolJourney(browser, origin, viewport) {
  const { context, page, errors } = await newPage(browser, viewport, origin);
  try {
    await page.goto(`${origin}${TOOL_ROUTE}?lang=en&source=verify`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.removeItem('kpop_role_roster_v1');
      window.__kpopXss = 0;
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.click('[data-preset="seven"]');
    await page.fill('.member:nth-child(1) input', '<img src=x onerror="window.__kpopXss=1">');
    await page.fill('.member:nth-child(2) input', 'roster-private-Nova-9281');
    await page.selectOption('.member:nth-child(1) select[data-field="primary"]', 'rap');
    await page.selectOption('.member:nth-child(1) select[data-field="secondary"]', 'vocal');
    await page.click('#generate');
    await page.waitForSelector('#result:not([hidden]) .roster-card');
    const result = await page.evaluate(() => ({
      cards: document.querySelectorAll('.roster-card').length,
      names: Array.from(document.querySelectorAll('.roster-card h3')).map((node) => node.textContent),
      tags: Array.from(document.querySelectorAll('.role-tags span')).map((node) => node.textContent),
      coverage: Array.from(document.querySelectorAll('.coverage-item b')).map((node) => Number(node.textContent)),
      images: document.querySelectorAll('.roster-card img').length,
      xss: window.__kpopXss,
      stored: JSON.parse(localStorage.getItem('kpop_role_roster_v1')),
      analytics: JSON.stringify(window.dataLayer || []),
    }));
    assert(result.cards === 7, `${viewport.name} generated roster count mismatch`);
    ['Main Vocal', 'Main Dancer', 'Main Rapper', 'Center'].forEach((tag) => assert(result.tags.includes(tag), `${viewport.name} missing generated tag: ${tag}`));
    assert(result.coverage.length === 5 && result.coverage.every((count) => count >= 1), `${viewport.name} coverage contract failed`);
    assert(result.images === 0 && !result.xss && result.names[0].includes('<img'), `${viewport.name} XSS-safe text rendering failed`);
    assert(!result.analytics.includes('<img src=x') && !result.analytics.includes('roster-private-Nova-9281'), `${viewport.name} analytics privacy leak: member names were transmitted`);
    assert(!result.analytics.includes('member_strengths') && !result.analytics.includes('"rap"') && !result.analytics.includes('"vocal"'), `${viewport.name} analytics privacy leak: member strength selections were transmitted`);
    assert(JSON.stringify(Object.keys(result.stored).sort()) === JSON.stringify(['concept', 'final', 'generated', 'leadership', 'members', 'size']), `${viewport.name} storage keys changed`);
    assert(!('roles' in result.stored) && !('coverage' in result.stored), `${viewport.name} derived roster data must not be stored`);

    await page.click('#finalize');
    await waitForEventCount(page, 'kpop_roster_finalize', 1);
    const preReloadEvents = await readEvents(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert(await page.locator('#result:not([hidden]) .roster-card').count() === 7, `${viewport.name} persisted roster failed`);
    assert((await page.locator('#statusBadge').innerText()).includes('Final'), `${viewport.name} final status did not persist`);

    await page.selectOption('#language', 'zh');
    const translated = await page.evaluate(() => ({
      language: document.documentElement.lang,
      title: document.querySelector('#resultTitle')?.textContent,
      role: document.querySelector('.role-tags span')?.textContent,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      related: document.querySelector('#related-position-test')?.getAttribute('href'),
    }));
    assert(translated.language === 'zh' && /[\u3400-\u9fff]/.test(`${translated.title}${translated.role}`), `${viewport.name} live Chinese rerender failed`);
    assert(translated.canonical === `${TOOL_CANONICAL}?lang=zh`, `${viewport.name} translated canonical mismatch`);
    const relatedUrl = new URL(translated.related, 'https://dopabrain.com');
    assert(relatedUrl.pathname === POSITION_ROUTE, `${viewport.name} related test pathname mismatch`);
    assert(relatedUrl.searchParams.get('lang') === 'en' && relatedUrl.searchParams.get('start') === '1' && relatedUrl.searchParams.get('surface') === 'kpop_roster_related', `${viewport.name} related test query mismatch`);
    assert([...relatedUrl.searchParams.keys()].length === 3, `${viewport.name} related test query contains unexpected parameters`);
    await page.evaluate(() => document.addEventListener('click', (event) => {
      if (event.target.closest('#related-position-test')) event.preventDefault();
    }, { capture: true, once: true }));
    await page.click('#related-position-test');
    await waitForEventCount(page, 'kpop_roster_related_click', 1);

    const events = preReloadEvents.concat(await readEvents(page));
    const expectedEventCounts = {
      kpop_roster_view: 2,
      kpop_roster_preset: 1,
      kpop_roster_generate: 1,
      kpop_roster_finalize: 1,
      kpop_roster_language_change: 1,
      kpop_roster_related_click: 1,
    };
    for (const [name, count] of Object.entries(expectedEventCounts)) {
      const matches = events.filter((event) => event.name === name);
      assert(matches.length === count, `${viewport.name} ${name} exact-once/page-load event count mismatch: expected ${count}, got ${matches.length}`);
      matches.forEach((event) => assertExactParamKeys(event.params, ROSTER_EVENT_KEYS[name], `${viewport.name}.${name}`));
    }
    const analyticsPayload = JSON.stringify(events);
    assert(!analyticsPayload.includes('<img src=x') && !analyticsPayload.includes('roster-private-Nova-9281'), `${viewport.name} analytics privacy leak: member names were transmitted`);
    assert(!analyticsPayload.includes('member_strengths') && !analyticsPayload.includes('"rap"') && !analyticsPayload.includes('"vocal"'), `${viewport.name} analytics privacy leak: member strength selections were transmitted`);
    assert(!events.some((event) => /ad_impression/.test(event.name)), `${viewport.name} emitted a fake ad impression event`);
    const relatedEvent = events.find((event) => event.name === 'kpop_roster_related_click');
    assertRequiredParams(relatedEvent.params, {
      event_category: 'engagement',
      surface_name: 'kpop_role_roster',
      content_locale: 'zh',
      destination_id: 'position_test',
      destination_path: POSITION_ROUTE,
    }, 'kpop_roster_related_click');

    await assertTargets(page, '#language,#reset,#size,#concept,#leadership,.presets button,.member input,.member select,#generate,#copy,#finalize,.related a', `${viewport.name} roster control`);
    await assertNoOverflow(page, `${viewport.name} roster`);
    assert(errors.length === 0, `${viewport.name} roster runtime errors: ${errors.join(' | ')}`);
    return { viewport: viewport.name, events: [...new Set(events.map((event) => event.name))] };
  } finally {
    await context.close();
  }
}

function hasHangul(value) {
  return /[\uac00-\ud7a3]/.test(String(value || ''));
}

function assertCoreLocale(value, locale, label) {
  const text = String(value || '').trim();
  assert(text.length > 0, `${label} is empty`);
  if (locale === 'ko') assert(hasHangul(text), `${label} is not Korean`);
  else assert(/[a-z]/i.test(text) && !hasHangul(text), `${label} is not English`);
}

function assertExactEvent(events, name, surface, label, extra = {}) {
  const matches = events.filter((event) => event.name === name);
  assert(matches.length === 1, `${label || name} event count mismatch: ${matches.length}`);
  assertRequiredParams(matches[0].params, {
    event_category: 'kpop_position',
    entry_mode: 'auto_start',
    cta_surface: surface,
    ...extra,
  }, label || name);
  return matches[0];
}

async function waitForPositionState(page, predicate, label, timeout = 7000, argument = null) {
  try {
    await page.waitForFunction(predicate, argument, { timeout });
  } catch (_error) {
    throw new Error(label);
  }
}

async function verifyPositionJourney(browser, origin, viewport, locale) {
  const surface = `verify_kpop_position_${viewport.name}_${locale}`;
  const { context, page, errors } = await newPage(browser, viewport, origin);
  try {
    await page.addInitScript(({ savedLanguage }) => {
      localStorage.setItem('app_language', savedLanguage);
      window.__kpopAlerts = [];
      window.__kpopClipboardMode = 'resolve';
      window.alert = (message) => window.__kpopAlerts.push(String(message));
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async (value) => {
          if (window.__kpopClipboardMode === 'reject') throw new Error('verification clipboard rejection');
          window.__kpopCopied = String(value);
        } },
      });
    }, { savedLanguage: locale === 'ko' ? 'en' : 'ko' });
    await page.goto(`${origin}${POSITION_ROUTE}?lang=${locale}&start=1&surface=${surface}`, { waitUntil: 'domcontentloaded' });
    await waitForPositionState(
      page,
      () => document.querySelector('#question-screen')?.classList.contains('active') && document.querySelectorAll('.option-btn').length === 4,
      `${viewport.name} ${locale} position auto-start did not open question 1`,
    );

    const initial = await page.evaluate(() => ({
      language: document.documentElement.lang,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      question: document.querySelector('#q-text')?.textContent,
      progress: document.querySelector('#progress-text')?.textContent,
      options: document.querySelectorAll('.option-btn').length,
      loaders: document.querySelectorAll('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]').length,
      fakeAds: document.querySelectorAll('ins.adsbygoogle,[data-ad-slot],[data-ad-surface],.ad-overlay,.result-ad-container').length,
      skipTarget: document.querySelector('.skip-link')?.getAttribute('href'),
      main: document.querySelectorAll('main#main-content').length,
      activeElement: document.activeElement?.id,
      quizStatus: {
        role: document.querySelector('#quiz-status')?.getAttribute('role'),
        live: document.querySelector('#quiz-status')?.getAttribute('aria-live'),
        text: document.querySelector('#quiz-status')?.textContent.trim(),
      },
      appSchema: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent)).find((node) => ['SoftwareApplication', 'WebApplication'].includes(node['@type'])),
    }));
    const expectedCanonical = locale === 'ko' ? `${POSITION_CANONICAL}?lang=ko` : POSITION_CANONICAL;
    assert(initial.language === locale, `${viewport.name} position query locale mismatch: expected ${locale}, got ${initial.language}`);
    assert(initial.canonical === expectedCanonical && initial.ogUrl === expectedCanonical, `${viewport.name} ${locale} position locale metadata mismatch`);
    assertCoreLocale(initial.title, locale, `${viewport.name} ${locale} position title`);
    assertCoreLocale(initial.description, locale, `${viewport.name} ${locale} position description`);
    assertCoreLocale(initial.question, locale, `${viewport.name} ${locale} position question`);
    assert(initial.progress === '1 / 12' && initial.options === 4, `${viewport.name} ${locale} position question contract mismatch`);
    assert(initial.loaders === 1 && initial.fakeAds === 0, `${viewport.name} ${locale} position runtime ad contract mismatch`);
    assert(initial.skipTarget === '#main-content' && initial.main === 1, `${viewport.name} ${locale} position skip target mismatch`);
    assert(initial.activeElement === 'q-text', `${viewport.name} ${locale} position question focus mismatch: ${initial.activeElement}`);
    assert(initial.quizStatus.role === 'status' && initial.quizStatus.live === 'polite' && initial.quizStatus.text, `${viewport.name} ${locale} position live transition status mismatch`);
    assert(initial.appSchema && initial.appSchema.url === expectedCanonical && initial.appSchema.inLanguage === locale, `${viewport.name} ${locale} position dynamic schema locale mismatch`);

    const entryEvents = await readEvents(page);
    assertExactEvent(entryEvents, 'kpop_position_auto_start', surface, `${viewport.name}.${locale}.kpop_position_auto_start`);
    assertExactEvent(entryEvents, 'test_start', surface, `${viewport.name}.${locale}.test_start`, { event_label: 'auto_start' });
    assert(!entryEvents.some((event) => /ad_impression/i.test(event.name)), `${viewport.name} ${locale} position emitted a fake ad impression event`);
    await page.locator('.skip-link').focus();
    await assertTargets(page, '.skip-link,#theme-toggle,#lang-toggle,.option-btn', `${viewport.name} ${locale} position question control`);
    await page.click('#lang-toggle');
    await assertTargets(page, '.lang-option', `${viewport.name} ${locale} position language option`);
    await page.click('#lang-toggle');
    await assertTargets(page, '.about-section summary,.back-link', `${viewport.name} ${locale} position supporting control`);
    await assertNoOverflow(page, `${viewport.name} ${locale} position question`);

    await page.locator('.option-btn:not([disabled])').first().evaluate((node) => {
      node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await waitForPositionState(
      page,
      () => document.querySelector('#progress-text')?.textContent.trim() === '2 / 12'
        && document.querySelectorAll('.option-btn:not([disabled])').length === 4,
      `${viewport.name} ${locale} position duplicate answer transition did not settle on question 2`,
      4000,
    );
    assert(await page.evaluate(() => document.activeElement?.id) === 'q-text', `${viewport.name} ${locale} position next-question focus mismatch`);

    for (let question = 2; question <= 12; question += 1) {
      await page.locator('.option-btn:not([disabled])').first().click();
      if (question < 12) {
        await waitForPositionState(
          page,
          (expected) => document.querySelector('#progress-text')?.textContent.trim() === `${expected} / 12`
            && document.querySelectorAll('.option-btn:not([disabled])').length === 4,
          `${viewport.name} ${locale} position did not advance to question ${question + 1}`,
          4000,
          question + 1,
        );
      }
    }
    await waitForPositionState(
      page,
      () => document.querySelector('#result-screen')?.classList.contains('active') && document.querySelectorAll('#spectrum-bars .spectrum-bar').length === 7,
      `${viewport.name} ${locale} position did not reach the result after 12 answers`,
      15000,
    );

    const result = await page.evaluate(() => ({
      title: document.querySelector('#result-title')?.textContent,
      description: document.querySelector('#result-desc')?.textContent,
      bars: document.querySelectorAll('#spectrum-bars .spectrum-bar').length,
      activeBars: document.querySelectorAll('#spectrum-bars .spectrum-bar.active').length,
    }));
    assertCoreLocale(result.title, locale, `${viewport.name} ${locale} position result title`);
    assertCoreLocale(result.description, locale, `${viewport.name} ${locale} position result description`);
    assert(result.bars === 7 && result.activeBars === 1, `${viewport.name} ${locale} position score-bar contract mismatch`);
    await assertTargets(page, '#btn-share,#btn-save-image,#btn-retry,.related-test-card', `${viewport.name} ${locale} position result control`);
    await assertNoOverflow(page, `${viewport.name} ${locale} position result`);

    await page.click('#btn-share');
    await page.waitForSelector('#share-modal:not(.hidden)');
    await page.waitForFunction(() => document.activeElement?.id === 'share-close', null, { timeout: 3000 });
    await assertTargets(page, '#share-close,.share-btn,#share-native', `${viewport.name} ${locale} share modal control`);
    await assertNoOverflow(page, `${viewport.name} ${locale} share modal`);
    await page.keyboard.press('Shift+Tab');
    assert(await page.evaluate(() => document.querySelector('#share-modal')?.contains(document.activeElement)), `${viewport.name} ${locale} share modal Shift+Tab escaped the dialog`);
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => document.activeElement?.id) === 'share-close', `${viewport.name} ${locale} share modal Tab trap did not wrap to close`);
    await page.evaluate(() => { window.__kpopClipboardMode = 'reject'; });
    await page.click('#share-copy');
    await page.waitForFunction(() => Boolean(document.querySelector('#share-feedback')?.textContent.trim()), null, { timeout: 3000 });
    assert((await readEvents(page)).filter((event) => event.name === 'share').length === 0, `${viewport.name} ${locale} share event fired before the share action succeeded`);
    const failedShare = await page.evaluate(() => ({ feedback: document.querySelector('#share-feedback')?.textContent.trim(), copied: window.__kpopCopied || '' }));
    assert(failedShare.feedback, `${viewport.name} ${locale} failed share did not expose a truthful unavailable message`);
    assert(!failedShare.copied, `${viewport.name} ${locale} failed share incorrectly reported copied content`);
    await page.evaluate(() => { window.__kpopClipboardMode = 'resolve'; });
    await page.click('#share-copy');
    await waitForEventCount(page, 'share', 1);
    assert(await page.evaluate(() => Boolean(window.__kpopCopied)), `${viewport.name} ${locale} successful share did not complete the clipboard action`);
    await page.keyboard.press('Escape');
    assert(await page.locator('#share-modal').evaluate((node) => node.classList.contains('hidden')), `${viewport.name} ${locale} share modal did not close on Escape`);
    assert(await page.evaluate(() => document.activeElement?.id) === 'btn-share', `${viewport.name} ${locale} share modal did not restore opener focus`);

    await page.click('#btn-retry');
    await waitForEventCount(page, 'test_retry', 1);
    assert(await page.locator('#intro-screen').evaluate((node) => node.classList.contains('active')), `${viewport.name} ${locale} position retry did not restore intro`);
    await assertTargets(page, '#btn-start', `${viewport.name} ${locale} position retry control`);
    await assertNoOverflow(page, `${viewport.name} ${locale} position retry`);
    await page.click('#btn-start');
    await waitForPositionState(
      page,
      () => document.querySelector('#question-screen')?.classList.contains('active') && document.querySelectorAll('.option-btn:not([disabled])').length === 4,
      `${viewport.name} ${locale} position retry entry did not start a new attempt`,
    );
    await waitForPositionState(
      page,
      () => document.activeElement?.id === 'q-text',
      `${viewport.name} ${locale} retry entry did not focus the question`,
      2000,
    );

    const events = await readEvents(page);
    for (const eventName of [
      'kpop_position_auto_start',
      'result_view',
      'kpop_position_result_view',
      'test_complete',
      'share_modal_open',
      'share',
    ]) assertExactEvent(events, eventName, surface, `${viewport.name}.${locale}.${eventName}`);
    const retryEvent = events.filter((event) => event.name === 'test_retry');
    assert(retryEvent.length === 1, `${viewport.name}.${locale}.test_retry event count mismatch: ${retryEvent.length}`);
    assertRequiredParams(retryEvent[0].params, { event_category: 'kpop_position', entry_mode: 'retry', cta_surface: surface }, `${viewport.name}.${locale}.test_retry`);
    const starts = events.filter((event) => event.name === 'test_start');
    assert(starts.length === 2, `${viewport.name}.${locale}.test_start event count mismatch: ${starts.length}`);
    assertRequiredParams(starts[0].params, { event_category: 'kpop_position', entry_mode: 'auto_start', cta_surface: surface, event_label: 'auto_start' }, `${viewport.name}.${locale}.test_start.auto_start`);
    assertRequiredParams(starts[1].params, { event_category: 'kpop_position', entry_mode: 'retry', cta_surface: surface, event_label: 'retry' }, `${viewport.name}.${locale}.test_start.retry`);
    assertExactEvent(events, 'share', surface, `${viewport.name}.${locale}.share`, { method: 'copy_link', share_source: 'copy_button', share_target: 'clipboard' });
    assert(!events.some((event) => /ad_impression/i.test(event.name)), `${viewport.name} ${locale} position emitted a fake ad impression event`);
    assert(errors.length === 0, `${viewport.name} ${locale} position runtime errors: ${errors.join(' | ')}`);
    return { viewport: viewport.name, locale, result: result.title, events: [...new Set(events.map((event) => event.name))] };
  } finally {
    await context.close();
  }
}

async function verifyUnsupportedPositionLocale(browser, origin) {
  const viewport = VIEWPORTS[0];
  const surface = 'verify_kpop_position_unsupported_locale';
  const { context, page, errors } = await newPage(browser, viewport, origin);
  try {
    await page.addInitScript(() => localStorage.setItem('app_language', 'ko'));
    await page.goto(`${origin}${POSITION_ROUTE}?lang=zh&start=1&surface=${surface}#quiz`, { waitUntil: 'domcontentloaded' });
    await waitForPositionState(
      page,
      () => document.querySelector('#question-screen')?.classList.contains('active') && document.querySelectorAll('.option-btn').length === 4,
      'Unsupported position locale did not preserve auto-start',
    );
    const report = await page.evaluate(() => ({
      language: document.documentElement.lang,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      question: document.querySelector('#q-text')?.textContent,
      pathname: window.location.pathname,
      params: Array.from(new URLSearchParams(window.location.search).entries()),
      hash: window.location.hash,
      activeElement: document.activeElement?.id,
      appSchema: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent)).find((node) => ['SoftwareApplication', 'WebApplication'].includes(node['@type'])),
    }));
    const params = new URLSearchParams(report.params);
    assert(report.language === 'en', `Unsupported position locale did not fall back to en: ${report.language}`);
    assertCoreLocale(report.title, 'en', 'Unsupported position locale title');
    assertCoreLocale(report.description, 'en', 'Unsupported position locale description');
    assertCoreLocale(report.question, 'en', 'Unsupported position locale question');
    assert(report.canonical === POSITION_CANONICAL && report.ogUrl === POSITION_CANONICAL, 'Unsupported position locale metadata was not normalized to English');
    assert(report.appSchema && report.appSchema.url === POSITION_CANONICAL && report.appSchema.inLanguage === 'en', 'Unsupported position locale schema was not normalized to English');
    assert(report.pathname === POSITION_ROUTE && !params.has('lang'), 'Unsupported position locale query was not normalized');
    assert(params.get('start') === '1' && params.get('surface') === surface && [...params.keys()].length === 2, 'Unsupported position locale normalization did not preserve start/surface exactly');
    assert(report.hash === '#quiz', 'Unsupported position locale normalization did not preserve hash');
    assert(report.activeElement === 'q-text', 'Unsupported position locale did not focus the active question');
    const events = await readEvents(page);
    assertExactEvent(events, 'kpop_position_auto_start', surface, 'unsupported-locale.kpop_position_auto_start');
    assertExactEvent(events, 'test_start', surface, 'unsupported-locale.test_start', { event_label: 'auto_start' });
    await assertNoOverflow(page, 'unsupported position locale');
    assert(errors.length === 0, `Unsupported position locale runtime errors: ${errors.join(' | ')}`);
    return report;
  } finally {
    await context.close();
  }
}

async function verifyPositionServiceWorker(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await isolateNetwork(page, origin);
  try {
    await page.goto(`${origin}${POSITION_ROUTE}`, { waitUntil: 'domcontentloaded' });
    const registration = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return null;
      const ready = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error('service-worker ready timeout')), 8000)),
      ]);
      const registrations = await navigator.serviceWorker.getRegistrations();
      return {
        count: registrations.length,
        scope: ready.scope,
        scriptURL: (ready.active || ready.waiting || ready.installing)?.scriptURL || '',
      };
    });
    const expectedScope = `${new URL(origin).origin}${POSITION_ROUTE}`;
    assert(registration && registration.count === 1, `K-pop position service-worker registration count mismatch: ${registration && registration.count}`);
    assert(registration.scope === expectedScope, `K-pop position service-worker scope mismatch: expected ${expectedScope}, got ${registration.scope}`);
    assert(registration.scriptURL === `${expectedScope}sw.js`, `K-pop position service-worker script URL mismatch: ${registration.scriptURL}`);
    assert(errors.length === 0, `K-pop position service-worker runtime errors: ${errors.join(' | ')}`);
    return registration;
  } finally {
    await context.close();
  }
}

function bridgeExpected(locale) {
  const quizLocale = locale === 'ko' ? 'ko' : 'en';
  return {
    roster: `/portal/tools/kpop-role-roster.html?lang=${locale}&source=blog_kpop_position_bridge`,
    test: `/kpop-position/?lang=${quizLocale}&start=1&surface=blog_kpop_position_bridge`,
  };
}

async function preventClicks(page, selector) {
  await page.evaluate((targetSelector) => document.addEventListener('click', (event) => {
    if (event.target.closest(targetSelector)) event.preventDefault();
  }, { capture: true }), selector);
}

async function verifyBridgePage(browser, origin, contract, viewport = VIEWPORTS[0], verifyQuick = false) {
  const { context, page, errors } = await newPage(browser, viewport, origin);
  try {
    await page.goto(`${origin}${contract.route}?source=verify`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.cp-kpop-roster');
    const expected = bridgeExpected(contract.locale);
    const bridge = await page.evaluate(() => ({
      links: Array.from(document.querySelectorAll('.cp-kpop-roster-link')).map((node) => ({ destination: node.dataset.destination, href: node.getAttribute('href') })),
      generic: document.querySelectorAll('.cp-revenue-recovery,.cp-mobile-sprint,.cp-sticky-sprint,.cp-palworld-game,.cp-brain-workout').length,
    }));
    assert(bridge.links.length === 2, `${contract.locale} bridge link count mismatch`);
    assert(bridge.links[0].destination === 'group_roster' && bridge.links[0].href === expected.roster, `${contract.locale} roster bridge route mismatch`);
    assert(bridge.links[1].destination === 'position_test' && bridge.links[1].href === expected.test, `${contract.locale} test bridge route mismatch`);
    assert(bridge.generic === 0, `${contract.locale} generic cross-promo competed with focused bridge`);
    await page.locator('.cp-kpop-roster').scrollIntoViewIfNeeded();
    await waitForEventCount(page, 'kpop_roster_bridge_view', 1);
    await preventClicks(page, '.cp-kpop-roster-link,.quick-card');
    await page.click('.cp-kpop-roster-link[data-destination="group_roster"]');
    await page.click('.cp-kpop-roster-link[data-destination="position_test"]');
    await waitForEventCount(page, 'kpop_roster_bridge_click', 2);

    if (verifyQuick) {
      const quick = page.locator('.indexing-quick-rail .quick-card');
      assert(await quick.count() === QUICK.length, 'Runtime focused quick-card count mismatch');
      for (let index = 0; index < QUICK.length; index += 1) {
        await quick.nth(index).click();
        await waitForEventCount(page, 'content_test_click', index + 1);
      }
    }

    const events = await readEvents(page);
    assert(!events.some((event) => event.name === 'kpop_roster_ad_impression'), `${contract.locale} emitted a fake roster ad impression event`);
    const view = events.find((event) => event.name === 'kpop_roster_bridge_view');
    assertRequiredParams(view.params, {
      event_category: 'engagement', source_app: 'blog', surface_name: 'blog_kpop_roster', content_locale: contract.locale,
    }, `${contract.locale}.kpop_roster_bridge_view`);
    const clicks = events.filter((event) => event.name === 'kpop_roster_bridge_click');
    for (const [index, destination] of ['group_roster', 'position_test'].entries()) {
      assertRequiredParams(clicks[index].params, {
        event_category: 'engagement', source_app: 'blog', surface_name: 'blog_kpop_roster', content_locale: contract.locale,
        destination_id: destination, destination_path: destination === 'group_roster' ? expected.roster : expected.test,
      }, `${contract.locale}.kpop_roster_bridge_click.${destination}`);
    }

    if (verifyQuick) {
      const quickEvents = events.filter((event) => event.name === 'content_test_click');
      assert(quickEvents.length === QUICK.length, `Quick-card content_test_click count mismatch: ${quickEvents.length}`);
      QUICK.forEach((expectedQuick, index) => assertRequiredParams(quickEvents[index].params, {
        event_category: 'content', page_path: ARTICLE_ROUTE, content_locale: 'en', content_id: ARTICLE_ID,
        link_url: new URL(expectedQuick.href, origin).href, cta_surface: expectedQuick.surface, target_slug: expectedQuick.slug,
      }, `quick-card-${index + 1}.content_test_click`));
      await assertTargets(page, '.quick-card,.cp-kpop-roster-link', `${viewport.name} article CTA`);
    } else await assertTargets(page, '.cp-kpop-roster-link', `${contract.locale} bridge CTA`);

    await assertNoOverflow(page, `${viewport.name} ${contract.locale} bridge`);
    assert(errors.length === 0, `${contract.locale} bridge runtime errors: ${errors.join(' | ')}`);
    return { locale: contract.locale, viewport: viewport.name };
  } finally {
    await context.close();
  }
}

async function verifyRuntime(browser, origin, options = {}) {
  const full = options.full !== false;
  const locales = options.locales || (full ? LOCALES : ['en']);
  const viewports = options.viewports || (full ? VIEWPORTS : [VIEWPORTS[0]]);
  const localeReports = await verifyLocales(browser, origin, locales);
  const toolReports = [];
  for (const viewport of viewports) toolReports.push(await verifyToolJourney(browser, origin, viewport));
  const bridgeReports = [];
  for (const viewport of viewports) bridgeReports.push(await verifyBridgePage(browser, origin, BRIDGE_ARTICLES[0], viewport, true));
  if (full) for (const contract of BRIDGE_ARTICLES.slice(1)) bridgeReports.push(await verifyBridgePage(browser, origin, contract));
  const positionReports = [];
  const catalogReports = full ? await verifyCatalogRuntime(browser, origin) : [];
  let unsupportedPositionReport = null;
  let positionServiceWorkerReport = null;
  if (full) {
    for (let index = 0; index < VIEWPORTS.length; index += 1) {
      positionReports.push(await verifyPositionJourney(browser, origin, VIEWPORTS[index], index === 0 ? 'en' : 'ko'));
    }
    unsupportedPositionReport = await verifyUnsupportedPositionLocale(browser, origin);
    positionServiceWorkerReport = await verifyPositionServiceWorker(browser, origin);
  }
  return { localeReports, toolReports, bridgeReports, catalogReports, positionReports, unsupportedPositionReport, positionServiceWorkerReport };
}

function cloneBundle(bundle) {
  return { ...bundle };
}

function replaceRequired(text, pattern, replacement, label) {
  assert(pattern.test(text), `Mutation setup failed: ${label}`);
  pattern.lastIndex = 0;
  return text.replace(pattern, replacement);
}

function mutateFaq(html) {
  const pattern = /("@type"\s*:\s*"FAQPage"[\s\S]*?"name"\s*:\s*")([^"]+)(")/i;
  assert(pattern.test(html), 'Mutation setup failed: faq-schema-drift');
  return html.replace(pattern, (_match, before, value, after) => `${before}${value} DRIFT${after}`);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function catalogCardBlocks(html) {
  return Array.from(String(html).matchAll(/<a\b[^>]*class=["'][^"']*\btool-card\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi)).map((match) => ({ index: match.index, text: match[0] }));
}

function removeFirstCatalogCard(html) {
  const cards = catalogCardBlocks(html);
  assert(cards.length === CATALOG_COUNT, 'Mutation setup failed: catalog-card-count');
  return `${html.slice(0, cards[0].index)}${html.slice(cards[0].index + cards[0].text.length)}`;
}

function swapFirstCatalogCards(html) {
  const cards = catalogCardBlocks(html);
  assert(cards.length >= 2, 'Mutation setup failed: catalog-card-order');
  const between = html.slice(cards[0].index + cards[0].text.length, cards[1].index);
  return `${html.slice(0, cards[0].index)}${cards[1].text}${between}${cards[0].text}${html.slice(cards[1].index + cards[1].text.length)}`;
}

function driftFirstCatalogName(html) {
  const cards = catalogCardBlocks(html);
  assert(cards.length > 0, 'Mutation setup failed: catalog-card-name');
  const drifted = replaceRequired(cards[0].text, /(<(?:div|h[1-6])\b[^>]*class=["'][^"']*\btc-name\b[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|h[1-6])>)/i, '$1$2 DRIFT$3', 'catalog-card-name');
  return `${html.slice(0, cards[0].index)}${drifted}${html.slice(cards[0].index + cards[0].text.length)}`;
}

function driftFirstCatalogOrigin(html) {
  const cards = catalogCardBlocks(html);
  assert(cards.length > 0, 'Mutation setup failed: catalog-external-origin');
  const drifted = replaceRequired(cards[0].text, /\bhref\s*=\s*(["'])([^"']+)\1/i, 'href="https://example.invalid/stress-check/plan.html?source=portal_tools_catalog"', 'catalog-external-origin');
  return `${html.slice(0, cards[0].index)}${drifted}${html.slice(cards[0].index + cards[0].text.length)}`;
}

function buildMutations(baseline) {
  const mutate = (name, expected, key, transform, runtime = false) => {
    const bundle = cloneBundle(baseline);
    bundle[key] = transform(bundle[key]);
    return { name, expected, bundle, runtime };
  };
  return [
    mutate('article-manual-slot', 'manual adsbygoogle element', 'articleHtml', (html) => replaceRequired(html, /<\/article>/i, '<ins class="adsbygoogle" data-ad-slot="auto"></ins></article>', 'article-manual-slot')),
    mutate('tool-loader-removed', 'Auto Ads loader count', 'toolHtml', (html) => replaceRequired(html, /<script\b[^>]*pagead2\.googlesyndication\.com[^>]*><\/script>/i, '', 'tool-loader-removed')),
    mutate('tool-manual-push', 'manual adsbygoogle.push', 'toolJs', (source) => `${source}\n(window.adsbygoogle=window.adsbygoogle||[]).push({});`),
    mutate('tool-fake-ad-event', 'fake ad impression event', 'toolJs', (source) => `${source}\ngtag('event','kpop_roster_ad_impression');`),
    mutate('faq-schema-drift', 'FAQ schema-visible parity mismatch', 'articleHtml', mutateFaq),
    mutate('unsafe-absolute-claim', 'Unsafe K-pop claim detected', 'articleHtml', (html) => replaceRequired(html, /<\/article>/i, '<p>The main vocalist is the absolute best singer in the group.</p></article>', 'unsafe-absolute-claim')),
    mutate('quick-route-drift', 'Quick card 1 href mismatch', 'articleHtml', (html) => replaceRequired(html, /\/portal\/tools\/kpop-role-roster\.html\?lang=en(?:&|&amp;)source=blog_kpop_positions_quick_rail/, '/portal/tools/kpop-role-roster.html?lang=en&amp;source=wrong', 'quick-route-drift')),
    mutate('quick-telemetry-param-removed', 'Quick card 1 target slug mismatch', 'articleHtml', (html) => replaceRequired(html, /data-target-slug=["']kpop-role-roster["']/i, '', 'quick-telemetry-param-removed')),
    mutate('article-date-stale', 'Article dateModified meta', 'articleHtml', (html) => replaceRequired(html, /(<meta\b[^>]*name=["']dateModified["'][^>]*content=["'])2026-08-29/i, '$12026-08-28', 'article-date-stale')),
    mutate('article-official-source-removed', 'Official profile source href/order mismatch', 'articleHtml', (html) => replaceRequired(html, new RegExp(`href=["']${escapeRegex(OFFICIAL_PROFILE_SOURCES[0])}["']`), 'href="https://example.invalid/removed-source"', 'article-official-source-removed')),
    mutate('blog-sitemap-date-stale', 'Blog sitemap lastmod', 'blogMap', (xml) => replaceRequired(xml, new RegExp(`(<loc>${escapeRegex(ARTICLE_CANONICAL)}</loc>[\\s\\S]*?<lastmod>)${LASTMOD}`), '$12026-08-28', 'blog-sitemap-date-stale')),
    mutate('bridge-test-route-drift', 'K-pop dynamic bridge contract missing', 'crossPromoJs', (source) => replaceRequired(source, /start=1&surface=blog_kpop_position_bridge/, 'source=blog_kpop_position_bridge', 'bridge-test-route-drift')),
    mutate('bridge-click-event-removed', 'K-pop dynamic bridge event missing', 'crossPromoJs', (source) => replaceRequired(source, /kpop_roster_bridge_click/g, 'kpop_roster_bridge_click_removed', 'bridge-click-event-removed')),
    mutate('related-click-event-removed', 'related position-test click event', 'toolJs', (source) => replaceRequired(source, /kpop_roster_related_click/g, 'kpop_roster_related_click_removed', 'related-click-event-removed')),
    mutate('roster-member-name-privacy-leak', 'analytics privacy leak: member names', 'toolJs', (source) => replaceRequired(source, /leadership_model:\s*state\.leadership\s*}/, 'leadership_model: state.leadership, member_names: state.members.map(function (member) { return member.name; }) }', 'roster-member-name-privacy-leak'), true),
    mutate('roster-strength-privacy-leak', 'analytics privacy leak: member strength selections', 'toolJs', (source) => replaceRequired(source, /leadership_model:\s*state\.leadership\s*}/, 'leadership_model: state.leadership, member_strengths: state.members.map(function (member) { return member.primary + ":" + member.secondary; }) }', 'roster-strength-privacy-leak'), true),
    mutate('roster-generate-event-duplicate', 'kpop_roster_generate exact-once/page-load event count mismatch', 'toolJs', (source) => replaceRequired(source, /(track\(['"]kpop_roster_generate['"]\s*,\s*\{[\s\S]*?\}\);)/, '$1 $1', 'roster-generate-event-duplicate'), true),
    mutate('catalog-number-hardcoded-drift', 'Catalog numberOfItems must be exactly', 'catalogHtml', (html) => replaceRequired(html, /("numberOfItems"\s*:\s*)(\d+)/, (_match, before, count) => `${before}${Number(count) + 1}`, 'catalog-number-hardcoded-drift')),
    mutate('catalog-card-count-drift', `Catalog DOM count must be exactly ${CATALOG_COUNT}`, 'catalogHtml', removeFirstCatalogCard),
    mutate('catalog-card-order-drift', 'Catalog DOM/schema order, URL, or name mismatch', 'catalogHtml', swapFirstCatalogCards),
    mutate('catalog-card-name-drift', 'Catalog DOM/schema order, URL, or name mismatch', 'catalogHtml', driftFirstCatalogName),
    mutate('catalog-external-origin', 'must stay on the DopaBrain HTTPS origin', 'catalogHtml', driftFirstCatalogOrigin),
    mutate('catalog-query-drift', 'query contract mismatch', 'catalogHtml', (html) => replaceRequired(html, /source=portal_tools_catalog/, 'source=unapproved_catalog_query', 'catalog-query-drift')),
    mutate('tap-target-32px', 'violates 44px target', 'toolHtml', (html) => replaceRequired(html, /<\/head>/i, '<style>#generate{height:32px!important;min-height:32px!important;max-height:32px!important;padding-block:0!important}</style></head>', 'tap-target-32px'), true),
    mutate('horizontal-overflow', 'horizontal overflow', 'toolHtml', (html) => replaceRequired(html, /<body>/i, '<body><div aria-hidden="true" style="width:2000px;height:1px"></div>', 'horizontal-overflow'), true),
    mutate('catalog-manual-slot', 'manual adsbygoogle element', 'catalogHtml', (html) => replaceRequired(html, /<\/body>/i, '<ins class="adsbygoogle" data-ad-slot="auto"></ins></body>', 'catalog-manual-slot')),
    mutate('catalog-fake-ad-event', 'fake ad impression event', 'catalogHtml', (html) => replaceRequired(html, /<\/body>/i, '<script>gtag("event","hub_ad_impression")</script></body>', 'catalog-fake-ad-event')),
    mutate('position-query-locale-ignored', 'position query locale mismatch', 'positionI18nJs', (source) => replaceRequired(source, /\.get\((['"])lang\1\)/, ".get('ignored_lang')", 'position-query-locale-ignored'), 'position-ko'),
    mutate('position-fake-stat', 'fabricated statistic', 'positionHtml', (html) => replaceRequired(html, /<\/body>/i, '<p class="social-proof">2,400 people have participated!</p></body>', 'position-fake-stat')),
    mutate('position-fabricated-rating', 'fabricated rating is forbidden', 'positionHtml', (html) => replaceRequired(html, /("dateModified"\s*:)/, '"aggregateRating":{"@type":"AggregateRating","ratingValue":"5","ratingCount":"2400"},\n        $1', 'position-fabricated-rating')),
    mutate('position-fabricated-rarity', 'fabricated percentile', 'positionHtml', (html) => replaceRequired(html, /<\/body>/i, '<p>Top 1%</p></body>', 'position-fabricated-rarity')),
    mutate('position-ai-premium-gate', 'celebrity role mapping', 'positionDataJs', (source) => `${source}\nconst PREMIUM_ADVICE = { aiGate: true };`),
    mutate('position-auto-start-ignored', 'position auto-start did not open question 1', 'positionJs', (source) => replaceRequired(source, /entryParams\.get\((['"])start\1\)/, "entryParams.get('ignored_start')", 'position-auto-start-ignored'), 'position-en'),
    mutate('position-surface-ignored', 'cta_surface mismatch', 'positionJs', (source) => replaceRequired(source, /entryParams\.get\((['"])surface\1\)/, "entryParams.get('ignored_surface')", 'position-surface-ignored'), 'position-en'),
    mutate('position-answer-transition-unlocked', 'duplicate answer transition did not settle on question 2', 'positionJs', (source) => replaceRequired(source, /\s*if\s*\(answerPending\)\s*return\s*;/, '', 'position-answer-transition-unlocked'), 'position-en'),
    mutate('position-question-focus-call-removed', 'position question focus mismatch', 'positionJs', (source) => replaceRequired(source, /if\s*\(focusQuestion\)\s*requestAnimationFrame\(\(\)\s*=>\s*questionText\.focus\(\)\);/, '', 'position-question-focus-call-removed'), 'position-en'),
    mutate('position-share-event-before-success', 'share event fired before the share action succeeded', 'positionJs', (source) => replaceRequired(source, /await navigator\.clipboard\.writeText\(text\);/, "trackEvent('share', { method: 'premature' });\n        await navigator.clipboard.writeText(text);", 'position-share-event-before-success'), 'position-en'),
    mutate('position-retry-entry-mode-lost', 'test_start.retry.entry_mode mismatch', 'positionJs', (source) => replaceRequired(source, /nextStartMode\s*=\s*['"]retry['"]\s*;/, "nextStartMode = 'manual';", 'position-retry-entry-mode-lost'), 'position-en'),
    mutate('position-dynamic-schema-locale-stale', 'position dynamic schema locale mismatch', 'positionI18nJs', (source) => replaceRequired(source, /schema\.inLanguage\s*=\s*this\.currentLang\s*;/, "schema.inLanguage = 'en';", 'position-dynamic-schema-locale-stale'), 'position-ko'),
    mutate('position-skip-target-missing', 'skip link target mismatch', 'positionHtml', (html) => replaceRequired(html, /href=["']#main-content["']/i, 'href="#missing-main"', 'position-skip-target-missing')),
    mutate('position-modal-role-missing', 'share modal role mismatch', 'positionHtml', (html) => replaceRequired(html, /(<div\b[^>]*\bclass=["'][^"']*\bshare-modal-content\b[^"']*["'][^>]*)\srole=["']dialog["']/i, '$1', 'position-modal-role-missing')),
    mutate('position-question-focus-target-missing', 'question text must be programmatically focusable', 'positionHtml', (html) => replaceRequired(html, /(<[^>]+\bid=["']q-text["'][^>]*)\stabindex=["']-1["']/i, '$1', 'position-question-focus-target-missing')),
    mutate('position-viewport-zoom-disabled', 'viewport must preserve user zoom', 'positionHtml', (html) => replaceRequired(html, /(<meta\b[^>]*name=["']viewport["'][^>]*content=["'][^"']*)(["'])/i, '$1, maximum-scale=1.0, user-scalable=no$2', 'position-viewport-zoom-disabled')),
    mutate('position-stale-locale-file', 'locale bundle must contain only en.json and ko.json', 'positionLocaleFiles', (files) => [...files, 'zh.json'].sort()),
    mutate('position-default-schema-locale-drift', 'default schema language must be en', 'positionHtml', (html) => replaceRequired(html, /("inLanguage"\s*:\s*)"en"/, '$1"ko"', 'position-default-schema-locale-drift')),
    mutate('position-manifest-scope-escape', 'manifest start_url must stay in app scope', 'positionManifest', (source) => replaceRequired(source, /("start_url"\s*:\s*)"\.\/?"/, '$1"/"', 'position-manifest-scope-escape')),
    mutate('position-sw-stale-locale', 'service-worker asset allowlist mismatch', 'positionSw', (source) => replaceRequired(source, /(['"]\.\/js\/locales\/ko\.json['"]\s*,?)/, '$1\n    \'./js/locales/zh.json\',', 'position-sw-stale-locale')),
    mutate('position-sw-cross-origin-guard-removed', 'must bypass cross-origin requests', 'positionSw', (source) => replaceRequired(source, /^.*\.origin\s*!==\s*self\.location\.origin.*\r?\n/m, '', 'position-sw-cross-origin-guard-removed')),
    mutate('position-sw-success-guard-removed', 'must cache only successful responses', 'positionSw', (source) => replaceRequired(source, /^\s*if\s*\(!response\.ok\)\s*return\s*;\r?\n/m, '', 'position-sw-success-guard-removed')),
    mutate('position-sw-registration-scope-escape', 'registration URL must remain relative', 'positionJs', (source) => replaceRequired(source, /serviceWorker\.register\(\s*(['"])(?:\.\/)?sw\.js\1/, "serviceWorker.register('/sw.js'", 'position-sw-registration-scope-escape')),
    mutate('roster-unsupported-quiz-locale', 'locale normalization mismatch', 'toolJs', (source) => replaceRequired(source, /var quizLang = lang === ['"]ko['"] \? ['"]ko['"] : ['"]en['"];/, 'var quizLang = lang;', 'roster-unsupported-quiz-locale'), 'roster-zh'),
    mutate('bridge-unsupported-quiz-locale', 'test bridge route mismatch', 'crossPromoJs', (source) => replaceRequired(source, /var quizLocale = supportedLocale === ['"]ko['"] \? ['"]ko['"] : ['"]en['"];/, 'var quizLocale = supportedLocale;', 'bridge-unsupported-quiz-locale'), 'bridge-zh'),
  ];
}

async function runMutations(browser, serverState, origin, baseline) {
  const results = [];
  for (const mutation of buildMutations(baseline)) {
    serverState.active = mutation.bundle;
    console.log(`[RUN] mutation ${mutation.name}`);
    try {
      verifyStatic(mutation.bundle);
      if (mutation.runtime === 'position-en') await verifyPositionJourney(browser, origin, VIEWPORTS[0], 'en');
      else if (mutation.runtime === 'position-ko') await verifyPositionJourney(browser, origin, VIEWPORTS[0], 'ko');
      else if (mutation.runtime === 'roster-zh') await verifyLocales(browser, origin, ['zh']);
      else if (mutation.runtime === 'bridge-zh') await verifyBridgePage(browser, origin, BRIDGE_ARTICLES[2]);
      else if (mutation.runtime) await verifyRuntime(browser, origin, { full: false, locales: ['en'], viewports: [VIEWPORTS[0]] });
      results.push({ name: mutation.name, ok: false, message: 'verifier incorrectly passed' });
    } catch (error) {
      results.push({ name: mutation.name, ok: error.message.includes(mutation.expected), message: error.message });
    }
  }
  serverState.active = baseline;
  results.forEach((result) => console.log(`[${result.ok ? 'PASS' : 'FAIL'}] ${result.name}: ${result.message}`));
  const escaped = results.filter((result) => !result.ok);
  console.log(`Mutation summary: ${results.length - escaped.length}/${results.length} detected`);
  assert(escaped.length === 0, `${escaped.length} K-pop verifier mutation(s) escaped or failed for the wrong reason`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const baseline = options.production ? await readProductionBundle() : readLocalBundle();
  verifyStatic(baseline);
  console.log('[PASS] K-pop static content, ad, telemetry, sitemap, and catalog contracts');

  let serverHandle = null;
  const serverState = { active: baseline };
  const origin = options.production ? 'https://dopabrain.com' : (serverHandle = await createServer(() => serverState.active)).origin;
  const browser = await chromium.launch({ headless: true });
  try {
    const report = await verifyRuntime(browser, origin);
    console.log(`[PASS] roster core locales=${report.localeReports.length} with explicit EN fallback; journeys=${report.toolReports.length}; bridges=${report.bridgeReports.length}; catalog locale/viewports=${report.catalogReports.length}; position journeys=${report.positionReports.length}; unsupported locale normalized=${Boolean(report.unsupportedPositionReport)}; SW scope=${report.positionServiceWorkerReport && report.positionServiceWorkerReport.scope}`);
    if (options.mutations) await runMutations(browser, serverState, origin, baseline);
  } finally {
    await browser.close();
    if (serverHandle) await new Promise((resolve) => serverHandle.server.close(resolve));
  }
  console.log('PASS: K-pop role roster, position quiz, positions guide, and catalog verification');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
