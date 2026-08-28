#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const ARTICLE_FILE = path.join(ROOT, 'projects', 'portal', 'blog', 'ko', '2026-brain-training-top-10.html');
const PORTAL_MAP_FILE = path.join(ROOT, 'projects', 'portal', 'sitemap.xml');
const BLOG_MAP_FILE = path.join(ROOT, 'projects', 'portal', 'blog', 'sitemap.xml');
const ROUTE = '/portal/blog/ko/2026-brain-training-top-10.html';
const CANONICAL = 'https://dopabrain.com' + ROUTE;
const TITLE = '2026년 두뇌 훈련 앱 추천 TOP 10 - 뇌 타입 테스트부터 색상 기억력까지 | DopaBrain';
const HEADLINE = '2026년 두뇌 훈련 앱 TOP 10 추천';
const DESCRIPTION = '브라우저에서 실제로 제공되는 두뇌 게임과 테스트 10개의 기능, 이용 방식, 다음 경로를 정리한 가이드입니다. 오락과 연습용이며 개선을 보장하거나 의료 조언을 제공하지 않습니다.';
const LASTMOD = '2026-08-29';
const CONTENT_ID = '2026-brain-training-top-10.html';
const CONTENT_SLUG = '2026-brain-training-top-10';

const QUICK = [
  ['/portal/tools/brain-game-workout.html?lang=ko&source=ko_brain_training_quick&surface=quick_rail', 'quick_rail', 'brain-game-workout'],
  ['/puzzle-2048/coach.html?lang=ko&source=ko_brain_training_quick&surface=quick_rail', 'quick_rail', '2048-coach'],
  ['/brain-type/?lang=ko&source=ko_brain_training_quick&surface=quick_rail', 'quick_rail', 'brain-type'],
  ['/reaction-test/?lang=ko&source=ko_brain_training_quick&surface=quick_rail', 'quick_rail', 'reaction-test'],
];

const APPS = [
  ['/portal/tools/brain-game-workout.html?lang=ko&source=ko_brain_training_article&surface=article_app_brain_game_workout', 'article_app', 'brain-game-workout'],
  ['/puzzle-2048/coach.html?lang=ko&source=ko_brain_training_article&surface=article_app_puzzle_2048_coach', 'article_app', '2048-coach'],
  ['/brain-type/?lang=ko&source=ko_brain_training_article&surface=article_app_brain_type', 'article_app', 'brain-type'],
  ['/reaction-test/?lang=ko&source=ko_brain_training_article&surface=article_app_reaction_test', 'article_app', 'reaction-test'],
  ['/color-memory/?lang=ko&source=ko_brain_training_article&surface=article_app_color_memory', 'article_app', 'color-memory'],
  ['/puzzle-2048/?lang=ko&source=ko_brain_training_article&surface=article_app_puzzle_2048', 'article_app', 'puzzle-2048'],
  ['/typing-speed/?lang=ko&source=ko_brain_training_article&surface=article_app_typing_speed', 'article_app', 'typing-speed'],
];

const FOLLOWUP = [
  ['/portal/tools/brain-game-workout.html?lang=ko&source=ko_brain_training_followup&surface=followup_primary', 'followup_primary', 'brain-game-workout'],
  ['/puzzle-2048/coach.html?lang=ko&source=ko_brain_training_followup&surface=followup_related', 'followup_related', '2048-coach'],
  ['/brain-type/?lang=ko&source=ko_brain_training_followup&surface=followup_related', 'followup_related', 'brain-type'],
  ['/reaction-test/?lang=ko&source=ko_brain_training_followup&surface=followup_related', 'followup_related', 'reaction-test'],
];

const DESTINATIONS = {
  '/portal/tools/brain-game-workout.html': path.join(ROOT, 'projects', 'portal', 'tools', 'brain-game-workout.html'),
  '/puzzle-2048/coach.html': path.join(ROOT, 'projects', 'puzzle-2048', 'coach.html'),
  '/brain-type/': path.join(ROOT, 'projects', 'brain-type', 'index.html'),
  '/reaction-test/': path.join(ROOT, 'projects', 'reaction-test', 'index.html'),
  '/color-memory/': path.join(ROOT, 'projects', 'color-memory', 'index.html'),
  '/puzzle-2048/': path.join(ROOT, 'projects', 'puzzle-2048', 'index.html'),
  '/typing-speed/': path.join(ROOT, 'projects', 'typing-speed', 'index.html'),
};

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs(argv) {
  let mutations = false;
  argv.forEach(function(argument) {
    assert(argument === '--mutations', 'Unknown argument: ' + argument);
    assert(!mutations, 'Duplicate --mutations argument');
    mutations = true;
  });
  return { mutations: mutations };
}

function decode(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&times;/g, '×')
    .replace(/&copy;/g, '©');
}

function textOf(value) {
  return decode(String(value || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function attr(tag, name) {
  const match = String(tag).match(new RegExp("\\b" + name + "\\s*=\\s*([\"'])([\\s\\S]*?)\\1", 'i'));
  return match ? decode(match[2]) : null;
}

function tags(html, name) {
  return String(html).match(new RegExp('<' + name + '\\b[^>]*>', 'gi')) || [];
}

function sliceSection(html, startPattern, endPattern, label) {
  const start = html.search(startPattern);
  assert(start >= 0, 'Missing ' + label + ' start');
  const remainder = html.slice(start);
  const end = remainder.match(endPattern);
  assert(end, 'Missing ' + label + ' end');
  return remainder.slice(0, end.index + end[0].length);
}

function meta(html, key, value) {
  const found = tags(html, 'meta').find(function(tag) { return attr(tag, key) === value; });
  assert(found, 'Missing meta ' + key + '=' + value);
  return attr(found, 'content');
}

function canonical(html) {
  const found = tags(html, 'link').filter(function(tag) {
    return (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('canonical');
  });
  assert(found.length === 1, 'Canonical count mismatch: ' + found.length);
  return attr(found[0], 'href');
}

function verifyHreflang(html) {
  const alternates = tags(html, 'link').filter(function(tag) {
    return (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('alternate');
  });
  assert(alternates.length === 2, 'Alternate hreflang count mismatch: ' + alternates.length);
  const values = Object.fromEntries(alternates.map(function(tag) {
    return [attr(tag, 'hreflang'), attr(tag, 'href')];
  }));
  assert(values.ko === CANONICAL, 'Korean self hreflang mismatch');
  assert(values['x-default'] === CANONICAL, 'x-default hreflang mismatch');
}

function assertLink(tag, expected, label) {
  assert(attr(tag, 'href') === expected[0], label + ' href mismatch');
  assert(attr(tag, 'data-content-surface') === expected[1], label + ' surface mismatch');
  assert(attr(tag, 'data-target-slug') === expected[2], label + ' target slug mismatch');
  const url = new URL(expected[0], 'https://dopabrain.com');
  assert(url.searchParams.getAll('lang').length === 1 && url.searchParams.get('lang') === 'ko', label + ' needs exactly one lang=ko');
  assert(url.searchParams.getAll('source').length === 1, label + ' needs exactly one source');
  assert(url.searchParams.getAll('surface').length === 1, label + ' needs exactly one URL surface');
}

function assertLinks(actual, expected, label) {
  assert(actual.length === expected.length, label + ' count mismatch: expected ' + expected.length + ', got ' + actual.length);
  expected.forEach(function(item, index) { assertLink(actual[index], item, label + ' ' + (index + 1)); });
}

function schemaNodes(html) {
  const blocks = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch (error) {
      throw new Error('Invalid JSON-LD: ' + error.message);
    }
    (Array.isArray(parsed) ? parsed : [parsed]).forEach(function(node) {
      if (node && Array.isArray(node['@graph'])) blocks.push.apply(blocks, node['@graph']);
      else if (node) blocks.push(node);
    });
  }
  assert(blocks.length > 0, 'Missing JSON-LD');
  return blocks;
}

function visibleText(html) {
  return textOf(sliceSection(html, /<body\b/i, /<\/body>/i, 'body')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' '));
}

function verifyClaims(html) {
  const visible = visibleText(html);
  [
    '당신의 두뇌를 한 단계 업그레이드',
    '최고의 무료 두뇌',
    '실제 사용자들에게 검증',
    '과학 기반',
    '과학적으로 입증',
    '신경과학',
    '인지심리학',
    '신경인지',
    '정확도 높은',
    '완벽히 파악',
    '최대 70%',
    '전 세계 천만',
    '뇌 신경망',
    '정신 건강의 중요한 지표',
    '전두엽',
    '편도체',
    '운동 피질',
    '소뇌',
    '신경 전달',
    '신경가소성',
    '시냅스',
    '인지 예비력',
    '눈에 띄는 개선',
    '3개월 내',
    '15-30분',
    '여러 뇌 영역',
    '약점을 파악',
    '개선도를 추적',
  ].forEach(function(phrase) {
    assert(!visible.includes(phrase), 'Unsupported-claim denylist hit: ' + phrase);
  });
  const claims = /(?:기억력|주의력|집중력|지능|인지능력|반응속도|논리력|공간 인식|손-눈 협응)[^.!?。]{0,45}(?:향상|개선|증진|강화|발전|증대|단축|키우)/;
  visible.split(/[.!?。]\s*/).filter(Boolean).forEach(function(sentence) {
    if (claims.test(sentence)) {
      assert(/(?:보장하지|아니|않|없)/.test(sentence), 'Unsupported positive efficacy claim: ' + sentence);
    }
  });
}

function sitemapEntry(xml, label) {
  const entries = (String(xml).match(/<url>[\s\S]*?<\/url>/gi) || []).filter(function(block) {
    return block.includes(CANONICAL);
  });
  assert(entries.length === 1, label + ' article entry count mismatch: ' + entries.length);
  assert(new RegExp('<lastmod>\\s*' + LASTMOD + '\\s*</lastmod>').test(entries[0]), label + ' lastmod must be ' + LASTMOD);
}

function verifyDestinations() {
  QUICK.concat(APPS, FOLLOWUP).forEach(function(item) {
    const pathname = new URL(item[0], 'https://dopabrain.com').pathname;
    const file = DESTINATIONS[pathname];
    assert(file, 'No destination mapping for ' + pathname);
    assert(fs.existsSync(file) && fs.statSync(file).isFile(), 'CTA destination is missing: ' + path.relative(ROOT, file));
  });
}

function verifySource(html, portalMap, blogMap) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  assert(titleMatch && textOf(titleMatch[1]) === TITLE, 'Title must remain unchanged');
  assert(canonical(html) === CANONICAL, 'Canonical must remain unchanged');
  verifyHreflang(html);
  assert(meta(html, 'name', 'description') === DESCRIPTION, 'Meta description contract mismatch');
  assert(meta(html, 'property', 'og:description') === DESCRIPTION, 'Open Graph description mismatch');
  assert(meta(html, 'name', 'twitter:description') === DESCRIPTION, 'Twitter description mismatch');

  const schema = schemaNodes(html);
  const articles = schema.filter(function(node) { return node['@type'] === 'Article'; });
  const breadcrumbs = schema.filter(function(node) { return node['@type'] === 'BreadcrumbList'; });
  assert(articles.length === 1, 'Article schema count mismatch: ' + articles.length);
  assert(breadcrumbs.length === 1, 'Breadcrumb schema count mismatch: ' + breadcrumbs.length);
  assert(!schema.some(function(node) { return node['@type'] === 'FAQPage'; }), 'Hidden FAQ schema is not allowed');
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const visibleDescription = html.match(/<p\b[^>]*class=["'][^"']*\barticle-desc\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  assert(h1 && textOf(h1[1]) === HEADLINE, 'Visible H1 contract mismatch');
  assert(visibleDescription && textOf(visibleDescription[1]) === DESCRIPTION, 'Visible description contract mismatch');
  assert(articles[0].headline === textOf(h1[1]), 'Schema headline must match the visible H1');
  assert(articles[0].description === textOf(visibleDescription[1]), 'Schema description must match the visible description');
  assert(articles[0].dateModified === LASTMOD, 'Schema dateModified must be ' + LASTMOD);
  assert(articles[0].mainEntityOfPage && articles[0].mainEntityOfPage['@id'] === CANONICAL, 'Schema mainEntityOfPage mismatch');
  assert(html.includes('업데이트 2026년 8월 29일'), 'Visible modified date is missing');

  const quick = sliceSection(html, /<section\b[^>]*class=["'][^"']*\bindexing-quick-rail\b/i, /<\/section>/i, 'quick rail');
  assertLinks(tags(quick, 'a').filter(function(tag) { return attr(tag, 'data-content-surface') === 'quick_rail'; }), QUICK, 'Quick rail');

  const article = sliceSection(html, /<article\b[^>]*class=["'][^"']*\barticle-content\b/i, /<\/article>/i, 'article');
  const itemSections = tags(article, 'section').filter(function(tag) {
    return (attr(tag, 'class') || '').split(/\s+/).includes('article-item');
  });
  assert(itemSections.length === 10, 'Article item count mismatch: expected 10, got ' + itemSections.length);
  itemSections.forEach(function(tag, index) {
    assert(attr(tag, 'id') === 'item-' + (index + 1), 'Article item ' + (index + 1) + ' ID mismatch');
  });
  const appLinks = tags(article, 'a').filter(function(tag) { return attr(tag, 'data-content-surface') === 'article_app'; });
  assertLinks(appLinks, APPS, 'Article app CTA');
  assert(new Set(appLinks.map(function(tag) { return attr(tag, 'data-target-slug'); })).size === 7, 'Article app CTA target slugs must be unique');

  const followup = sliceSection(html, /<section\b[^>]*class=["'][^"']*\bindexing-followup-section\b/i, /<\/section>/i, 'follow-up');
  const followupLinks = tags(followup, 'a').filter(function(tag) { return /^followup_/.test(attr(tag, 'data-content-surface') || ''); });
  assertLinks(followupLinks, FOLLOWUP, 'Follow-up');

  assert(html.includes('오락과 반복 연습을 위한 기능 안내'), 'Entertainment/practice disclaimer is missing');
  assert(html.includes('향상을 측정하거나 보장하지 않으며'), 'No-improvement-guarantee disclaimer is missing');
  assert(html.includes('의료 조언·진단·치료 도구가 아닙니다'), 'Medical-advice disclaimer is missing');
  verifyClaims(html);

  assert(!/\bdata-ad-slot\s*=\s*["']auto["']/i.test(html), 'Manual data-ad-slot="auto" is forbidden');
  assert(!/\bdata-ad-surface\s*=/i.test(html), 'Manual article ad surface is forbidden');
  assert(!/<ins\b[^>]*\badsbygoogle\b/i.test(html), 'Manual adsbygoogle element is forbidden');
  assert(!html.includes('content_ad_impression'), 'Synthetic content_ad_impression is forbidden');
  assert((html.match(/<script\b[^>]*src=["']\/portal\/js\/ad-loader\.js["'][^>]*><\/script>/gi) || []).length === 1, 'Head Auto Ads loader must remain exactly once');
  assert((html.match(/<script\b[^>]*src=["']\/portal\/js\/cross-promo\.js["'][^>]*><\/script>/gi) || []).length === 1, 'Existing cross-promo must remain exactly once');

  const telemetry = sliceSection(html, /\(function indexingContentTelemetry\(\)/, /<\/script>/i, 'content telemetry');
  assert((telemetry.match(/\bcta_surface\s*:/g) || []).length === 2, 'Telemetry must set cta_surface for view and click events');
  assert((telemetry.match(/\btarget_slug\s*:/g) || []).length === 2, 'Telemetry must set target_slug for view and click events');
  ['content_view', 'content_test_click', 'content_cta_click', 'content_related_click', 'content_toc_click'].forEach(function(eventName) {
    assert(telemetry.includes("'" + eventName + "'"), 'Missing telemetry event: ' + eventName);
  });

  sitemapEntry(portalMap, 'Portal sitemap');
  sitemapEntry(blogMap, 'Blog sitemap');
  verifyDestinations();
}

function commonParams() {
  return {
    event_category: 'content',
    page_path: ROUTE,
    content_locale: 'ko',
    content_id: CONTENT_ID,
  };
}

function exactParams(actual, expected, eventName) {
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected).sort();
  assert(JSON.stringify(actualKeys) === JSON.stringify(expectedKeys), eventName + ' parameter keys mismatch: ' + actualKeys.join(', '));
  expectedKeys.forEach(function(key) {
    assert(actual[key] === expected[key], eventName + '.' + key + ' mismatch: expected ' + expected[key] + ', got ' + actual[key]);
  });
}

function events(page) {
  return page.evaluate(function() {
    return (window.dataLayer || [])
      .map(function(entry) { return Array.from(entry || []); })
      .filter(function(entry) { return entry[0] === 'event'; })
      .map(function(entry) { return { name: entry[1], params: JSON.parse(JSON.stringify(entry[2] || {})) }; });
  });
}

async function noOverflow(page, label) {
  const value = await page.evaluate(function() {
    return {
      document: document.documentElement.scrollWidth - window.innerWidth,
      body: document.body.scrollWidth - window.innerWidth,
    };
  });
  assert(value.document <= 1 && value.body <= 1, label + ' horizontal overflow: document=' + value.document + 'px, body=' + value.body + 'px');
}

async function targetSizes(page, label) {
  const targets = page.locator('a[data-content-surface]');
  const count = await targets.count();
  assert(count === 27, label + ' tracked-link count mismatch: expected 27, got ' + count);
  for (let index = 0; index < count; index += 1) {
    const target = targets.nth(index);
    const box = await target.boundingBox();
    const slug = await target.getAttribute('data-target-slug');
    const surface = await target.getAttribute('data-content-surface');
    assert(box, label + ' ' + surface + '/' + slug + ' has no target box');
    assert(box.width >= 44 && box.height >= 44, label + ' ' + surface + '/' + slug + ' violates 44px target: ' + box.width.toFixed(1) + 'x' + box.height.toFixed(1));
  }
}

async function clickEvent(page, selector, eventName, surface, slug) {
  const target = page.locator(selector).first();
  assert(await target.count() === 1, 'Missing click target: ' + selector);
  const linkUrl = await target.evaluate(function(node) { return node.href; });
  const before = (await events(page)).filter(function(event) { return event.name === eventName; }).length;
  await target.click();
  const matching = (await events(page)).filter(function(event) { return event.name === eventName; });
  assert(matching.length === before + 1, eventName + ' count did not increase exactly once');
  exactParams(matching[matching.length - 1].params, Object.assign(commonParams(), {
    link_url: linkUrl,
    cta_surface: surface,
    target_slug: slug,
  }), eventName);
}

function serverFor(getHtml) {
  return http.createServer(function(request, response) {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname;
    if (pathname === ROUTE) {
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
      response.end(getHtml());
      return;
    }
    if (pathname === '/portal/js/ad-loader.js' || pathname === '/portal/js/cross-promo.js') {
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/javascript; charset=utf-8' });
      response.end('/* isolated verifier stub */');
      return;
    }
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not Found');
  });
}

function listen(server) {
  return new Promise(function(resolve, reject) {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', function() {
      server.removeListener('error', reject);
      resolve(server.address().port);
    });
  });
}

function close(server) {
  return new Promise(function(resolve) { server.close(resolve); });
}

async function browserCheck(browser, baseUrl, viewport) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, locale: 'ko-KR' });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', function(error) { runtimeErrors.push(error.message); });
  page.on('console', function(message) {
    if (message.type() !== 'error') return;
    const location = message.location();
    const evidence = `${message.text()} ${location && location.url ? location.url : ''}`;
    if (/googletagmanager\.com|googlesyndication\.com|doubleclick\.net/i.test(evidence)) return;
    runtimeErrors.push(message.text());
  });
  await page.route('https://**/*', function(route) { route.abort(); });
  await page.addInitScript(function() {
    document.addEventListener('click', function(event) {
      if (event.target && event.target.closest && event.target.closest('a')) event.preventDefault();
    }, true);
  });
  try {
    await page.goto(baseUrl + ROUTE, { waitUntil: 'domcontentloaded' });
    assert(await page.locator('html').getAttribute('lang') === 'ko', viewport.name + ' html lang mismatch');
    assert(await page.title() === TITLE, viewport.name + ' browser title mismatch');
    await noOverflow(page, viewport.name);
    await targetSizes(page, viewport.name);

    const initial = await events(page);
    const views = initial.filter(function(event) { return event.name === 'content_view'; });
    assert(views.length === 1, viewport.name + ' content_view count mismatch: ' + views.length);
    exactParams(views[0].params, Object.assign(commonParams(), {
      cta_surface: 'article',
      target_slug: CONTENT_SLUG,
    }), 'content_view');
    assert(initial.every(function(event) { return event.name !== 'content_ad_impression'; }), viewport.name + ' emitted content_ad_impression');

    await clickEvent(page, '.quick-card[data-target-slug="brain-game-workout"]', 'content_test_click', 'quick_rail', 'brain-game-workout');
    await clickEvent(page, '.article-content a[data-target-slug="brain-game-workout"]', 'content_cta_click', 'article_app', 'brain-game-workout');
    await clickEvent(page, '.cta-button[data-target-slug="brain-game-workout"]', 'content_cta_click', 'followup_primary', 'brain-game-workout');
    await clickEvent(page, '.related-link[data-target-slug="2048-coach"]', 'content_related_click', 'followup_related', '2048-coach');
    await clickEvent(page, '.toc a[data-target-slug="intro"]', 'content_toc_click', 'toc', 'intro');

    const contentEvents = (await events(page)).filter(function(event) { return /^content_/.test(event.name); });
    assert(contentEvents.length === 6, viewport.name + ' content event count mismatch: ' + contentEvents.length);
    assert(contentEvents.every(function(event) { return event.params.cta_surface && event.params.target_slug; }), viewport.name + ' content event lost CTA context');
    await noOverflow(page, viewport.name);
    assert(runtimeErrors.length === 0, viewport.name + ' runtime errors: ' + runtimeErrors.join(' | '));
    console.log('[PASS] ' + viewport.name + ': 44px targets, no overflow, CTA routes, exact event params');
  } finally {
    await context.close();
  }
}

function replaceRequired(value, search, replacement, name) {
  const output = value.replace(search, replacement);
  assert(output !== value, 'Mutation ' + name + ' did not change its input');
  return output;
}

function sourceMutations(baseline) {
  const encodedQuick = QUICK[0][0].replace(/&/g, '&amp;');
  return [
    ['changed-title', 'Title must remain', { article: replaceRequired(baseline.article, TITLE, '바뀐 제목 | DopaBrain', 'changed-title') }],
    ['changed-canonical', 'Canonical must remain', { article: replaceRequired(baseline.article, 'href="' + CANONICAL + '"', 'href="https://dopabrain.com/wrong"', 'changed-canonical') }],
    ['broken-x-default', 'x-default hreflang mismatch', { article: replaceRequired(baseline.article, 'hreflang="x-default" href="' + CANONICAL + '"', 'hreflang="x-default" href="https://dopabrain.com/wrong"', 'broken-x-default') }],
    ['stale-schema-date', 'Schema dateModified', { article: replaceRequired(baseline.article, '"dateModified":"' + LASTMOD + '"', '"dateModified":"2026-08-28"', 'stale-schema-date') }],
    ['missing-disclaimer', 'Entertainment/practice disclaimer', { article: replaceRequired(baseline.article, '오락과 반복 연습을 위한 기능 안내', '가벼운 기능 안내', 'missing-disclaimer') }],
    ['unsupported-claim', 'Unsupported-claim denylist', { article: replaceRequired(baseline.article, '</article>', '<p>과학 기반 프로그램으로 눈에 띄는 개선을 제공합니다.</p></article>', 'unsupported-claim') }],
    ['quick-route-drift', 'Quick rail 1 href mismatch', { article: replaceRequired(baseline.article, encodedQuick, '/brain-type/?lang=ko&amp;source=ko_brain_training_quick&amp;surface=quick_rail', 'quick-route-drift') }],
    ['duplicate-app-target', 'Article app CTA 7 target slug mismatch', { article: replaceRequired(baseline.article, 'data-target-slug="typing-speed">타이핑 속도 테스트 열기', 'data-target-slug="puzzle-2048">타이핑 속도 테스트 열기', 'duplicate-app-target') }],
    ['missing-app-surface', 'Article app CTA count mismatch', { article: replaceRequired(baseline.article, 'data-content-surface="article_app" data-target-slug="brain-game-workout">워크아웃 만들기', 'data-content-surface="missing" data-target-slug="brain-game-workout">워크아웃 만들기', 'missing-app-surface') }],
    ['manual-auto-slot', 'Manual data-ad-slot', { article: replaceRequired(baseline.article, '</article>', '<ins data-ad-slot="auto"></ins></article>', 'manual-auto-slot') }],
    ['synthetic-ad-event', 'Synthetic content_ad_impression', { article: replaceRequired(baseline.article, "track('content_view', {", "track('content_ad_impression');\n                track('content_view', {", 'synthetic-ad-event') }],
    ['schema-visible-drift', 'Schema description must match', { article: replaceRequired(baseline.article, '"description":"' + DESCRIPTION + '","image"', '"description":"다른 설명","image"', 'schema-visible-drift') }],
    ['removed-cross-promo', 'Existing cross-promo', { article: replaceRequired(baseline.article, '    <script src="/portal/js/cross-promo.js" defer></script>\n', '', 'removed-cross-promo') }],
    ['missing-event-surface', 'Telemetry must set cta_surface', { article: replaceRequired(baseline.article, "                    cta_surface: target.getAttribute('data-content-surface') || '',\n", '', 'missing-event-surface') }],
    ['nine-items', 'Article item count mismatch', { article: replaceRequired(baseline.article, 'class="article-item" id="item-10"', 'class="removed-item" id="item-10"', 'nine-items') }],
    ['portal-lastmod', 'Portal sitemap lastmod', { portal: replaceRequired(baseline.portal, '<loc>' + CANONICAL + '</loc><lastmod>' + LASTMOD + '</lastmod>', '<loc>' + CANONICAL + '</loc><lastmod>2026-08-28</lastmod>', 'portal-lastmod') }],
    ['blog-lastmod', 'Blog sitemap lastmod', { blog: replaceRequired(baseline.blog, '<loc>' + CANONICAL + '</loc><lastmod>' + LASTMOD + '</lastmod>', '<loc>' + CANONICAL + '</loc><lastmod>2026-08-28</lastmod>', 'blog-lastmod') }],
  ];
}

function runSourceMutations(baseline) {
  return sourceMutations(baseline).map(function(mutation) {
    let error = null;
    try {
      verifySource(
        mutation[2].article || baseline.article,
        mutation[2].portal || baseline.portal,
        mutation[2].blog || baseline.blog
      );
    } catch (caught) {
      error = caught;
    }
    const ok = Boolean(error && error.message.includes(mutation[1]));
    console.log('[' + (ok ? 'PASS' : 'FAIL') + '] mutation ' + mutation[0] + ': ' + (error ? error.message : 'escaped'));
    return { name: mutation[0], ok: ok };
  });
}

async function browserMutations(browser, baseline, setArticle, baseUrl) {
  const mutations = [
    {
      name: 'undersized-cta',
      expected: 'violates 44px target',
      article: replaceRequired(
        baseline,
        '<style>',
        '<style>\n        .quick-card { min-height:20px !important; height:20px !important; padding:0 !important; overflow:hidden !important; }',
        'undersized-cta'
      )
    },
    {
      name: 'console-error',
      expected: 'runtime errors',
      article: replaceRequired(baseline, '</body>', '<script>console.error("mutation-console-error")</script></body>', 'console-error')
    },
    {
      name: 'page-error',
      expected: 'runtime errors',
      article: replaceRequired(baseline, '</body>', '<script>setTimeout(function(){throw new Error("mutation-page-error")},0)</script></body>', 'page-error')
    }
  ];
  const results = [];
  for (const mutation of mutations) {
    setArticle(mutation.article);
    let error = null;
    try {
      await browserCheck(browser, baseUrl, VIEWPORTS[0]);
    } catch (caught) {
      error = caught;
    } finally {
      setArticle(baseline);
    }
    const ok = Boolean(error && error.message.includes(mutation.expected));
    console.log('[' + (ok ? 'PASS' : 'FAIL') + '] mutation ' + mutation.name + ': ' + (error ? error.message : 'escaped'));
    results.push({ name: mutation.name, ok: ok });
  }
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const baseline = {
    article: fs.readFileSync(ARTICLE_FILE, 'utf8'),
    portal: fs.readFileSync(PORTAL_MAP_FILE, 'utf8'),
    blog: fs.readFileSync(BLOG_MAP_FILE, 'utf8'),
  };
  verifySource(baseline.article, baseline.portal, baseline.blog);
  console.log('[PASS] source: claims, schema, CTA routes, Auto Ads, sitemaps, destinations');

  let servedArticle = baseline.article;
  const server = serverFor(function() { return servedArticle; });
  const port = await listen(server);
  const baseUrl = 'http://127.0.0.1:' + port;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const viewport of VIEWPORTS) await browserCheck(browser, baseUrl, viewport);
    if (options.mutations) {
      const results = runSourceMutations(baseline);
      results.push.apply(results, await browserMutations(browser, baseline.article, function(value) { servedArticle = value; }, baseUrl));
      const escaped = results.filter(function(result) { return !result.ok; });
      console.log('Mutation summary: ' + (results.length - escaped.length) + '/' + results.length + ' detected');
      assert(results.length >= 8, 'Mutation count is too low: ' + results.length);
      assert(escaped.length === 0, escaped.length + ' mutation(s) escaped or failed for the wrong reason');
    }
  } finally {
    if (browser) await browser.close();
    await close(server);
  }
}

main().catch(function(error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
