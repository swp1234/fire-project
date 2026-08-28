#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const ARTICLE_FILE = path.join(PORTAL, 'blog', 'zh', '2048-strategy-guide.html');
const PORTAL_MAP_FILE = path.join(PORTAL, 'sitemap.xml');
const BLOG_MAP_FILE = path.join(PORTAL, 'blog', 'sitemap.xml');
const AD_LOADER_FILE = path.join(PORTAL, 'js', 'ad-loader.js');
const CROSS_PROMO_FILE = path.join(PORTAL, 'js', 'cross-promo.js');
const APP_DATA_FILE = path.join(PORTAL, 'js', 'app-data.js');

const ROUTE = '/portal/blog/zh/2048-strategy-guide.html';
const CANONICAL = 'https://dopabrain.com' + ROUTE;
const TITLE = '2048游戏攻略：高分技巧与策略完全指南 | DopaBrain';
const LASTMOD = '2026-08-29';
const CONTENT_ID = '2048-strategy-guide.html';
const ARTICLE_TEXT_SHA256 = '948184931f08501934f0f4611e581dec8a383261798cb320bf78c72b712cf097';

const STICKY = {
  href: '/puzzle-2048/?lang=zh&surface=zh_2048_strategy_sticky',
  surface: 'sticky_revenue_cta',
  slug: 'puzzle-2048',
};

const QUICK = [
  { href: '/puzzle-2048/?lang=zh&surface=zh_2048_strategy_quick', surface: 'quick_rail', slug: 'puzzle-2048' },
  { href: '/reaction-test/?lang=zh', surface: 'quick_rail', slug: 'reaction-test' },
  { href: '/minesweeper/?lang=zh', surface: 'quick_rail', slug: 'minesweeper' },
  { href: '/brick-breaker/?lang=zh', surface: 'quick_rail', slug: 'brick-breaker' },
];

const ARTICLE_CTAS = [
  'https://dopabrain.com/puzzle-2048/?lang=zh&surface=zh_2048_strategy_cta1',
  'https://dopabrain.com/puzzle-2048/?lang=zh&surface=zh_2048_strategy_cta2',
];

const FAQ = [
  {
    question: 'Q1. 2048游戏的基本规则是什么？',
    answer: '2048是一个在4x4网格上进行的数字滑动拼图游戏。每次滑动时，所有方块会向一个方向移动，相同数字的方块碰撞时会合并为它们的总和。每次滑动后会随机出现一个新的2或4方块。目标是合成数值为2048的方块。当棋盘填满且无法继续合并时游戏结束。',
  },
  {
    question: 'Q2. 2048游戏中最重要的策略是什么？',
    answer: '最重要的策略是"角落固定法"——将最大数值的方块固定在棋盘的一个角落（通常是左下角或右下角），然后沿着边缘构建从大到小递减的数字链。同时应尽量避免频繁使用会将大方块推离角落的方向。这样可以有效控制棋盘局面，大幅提高胜率。',
  },
  {
    question: 'Q3. 如何避免方块被卡住？',
    answer: '避免方块被卡住的关键是保持棋盘整洁有序：让数字从大到小形成蛇形路径排列；不要让小数字方块夹在两个大数字之间；尽量保持最大方块所在行始终填满以锁定位置；当局面混乱时，优先清理小方块而非追求合并大方块。',
  },
  {
    question: 'Q4. 2048的最高分理论上是多少？',
    answer: '理论上，2048游戏可以合成的最高方块数值为131072（2的17次方）。但在标准4x4棋盘上，实际能达到的最高方块通常是65536。大多数高手的追求目标是8192或16384方块。对于普通玩家来说，能够稳定合成2048方块已经是非常优秀的表现。',
  },
  {
    question: 'Q5. 玩2048游戏对大脑有什么好处？',
    answer: '游戏过程会用到空间预判、规则计算、局面监测和计划，但不能据此保证这些能力会广泛迁移到学习、工作或日常生活。研究结果因游戏特征、训练方式和测量指标而异。更稳妥的定位是：2048是一款有策略深度的娱乐游戏，而不是医疗或认知训练工具。',
  },
];

const COACH = {
  coachHref: '/puzzle-2048/coach.html?lang=zh&source=blog_2048_bridge',
  playHref: '/puzzle-2048/?lang=zh&surface=coach_2048_bridge',
  surface: 'blog_2048_coach',
};

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const DESTINATIONS = {
  '/puzzle-2048/': path.join(ROOT, 'projects', 'puzzle-2048', 'index.html'),
  '/puzzle-2048/coach.html': path.join(ROOT, 'projects', 'puzzle-2048', 'coach.html'),
  '/reaction-test/': path.join(ROOT, 'projects', 'reaction-test', 'index.html'),
  '/minesweeper/': path.join(ROOT, 'projects', 'minesweeper', 'index.html'),
  '/brick-breaker/': path.join(ROOT, 'projects', 'brick-breaker', 'index.html'),
};

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
    .replace(/&#(\d+);/g, function(_match, code) { return String.fromCodePoint(Number(code)); })
    .replace(/&#x([0-9a-f]+);/gi, function(_match, code) { return String.fromCodePoint(parseInt(code, 16)); })
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rarr;/g, '→')
    .replace(/&bull;/g, '•')
    .replace(/&times;/g, '×')
    .replace(/&copy;/g, '©');
}

function textOf(value) {
  return decode(String(value || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(tag, name) {
  const match = String(tag).match(new RegExp('\\b' + name + '\\s*=\\s*(["\'])([\\s\\S]*?)\\1', 'i'));
  return match ? decode(match[2]) : null;
}

function classHas(tag, className) {
  return (attr(tag, 'class') || '').split(/\s+/).includes(className);
}

function tags(html, name) {
  return String(html).match(new RegExp('<' + name + '\\b[^>]*>', 'gi')) || [];
}

function sliceSection(html, startPattern, endPattern, label) {
  const start = String(html).search(startPattern);
  assert(start >= 0, 'Missing ' + label + ' start');
  const remainder = String(html).slice(start);
  const end = remainder.match(endPattern);
  assert(end, 'Missing ' + label + ' end');
  return remainder.slice(0, end.index + end[0].length);
}

function canonical(html) {
  const matches = tags(html, 'link').filter(function(tag) {
    return (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('canonical');
  });
  assert(matches.length === 1, 'Canonical count mismatch: ' + matches.length);
  return attr(matches[0], 'href');
}

function schemaNodes(html) {
  const nodes = [];
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
      if (node && Array.isArray(node['@graph'])) nodes.push.apply(nodes, node['@graph']);
      else if (node) nodes.push(node);
    });
  }
  assert(nodes.length > 0, 'Missing JSON-LD');
  return nodes;
}

function visibleFaq(html) {
  const start = String(html).search(/<h2\b[^>]*id=["']faq["'][^>]*>/i);
  assert(start >= 0, 'Visible FAQ heading is missing');
  const tail = String(html).slice(start);
  const headingEnd = tail.search(/<\/h2>/i);
  assert(headingEnd >= 0, 'Visible FAQ heading is malformed');
  const afterHeading = tail.slice(headingEnd + 5);
  const nextHeading = afterHeading.search(/<h2\b/i);
  assert(nextHeading >= 0, 'Visible FAQ boundary is missing');
  const section = afterHeading.slice(0, nextHeading);
  const items = [];
  const itemPattern = /<div\b[^>]*class=["'][^"']*\bfaq-item\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = itemPattern.exec(section))) {
    const heading = match[1].match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
    const answer = match[1].match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
    assert(heading && answer, 'Visible FAQ item is malformed');
    items.push({ question: textOf(heading[1]), answer: textOf(answer[1]) });
  }
  return items;
}

function exactObject(actual, expected, label) {
  assert(JSON.stringify(actual) === JSON.stringify(expected), label + ' mismatch');
}

function verifyFaq(html, nodes) {
  const visible = visibleFaq(html);
  assert(visible.length === 5, 'Visible FAQ count mismatch: ' + visible.length);
  exactObject(visible, FAQ, 'Visible FAQ text contract');
  const faqNodes = nodes.filter(function(node) { return node['@type'] === 'FAQPage'; });
  assert(faqNodes.length === 1, 'FAQPage schema count mismatch: ' + faqNodes.length);
  const entities = Array.isArray(faqNodes[0].mainEntity) ? faqNodes[0].mainEntity : [];
  assert(entities.length === 5, 'FAQPage mainEntity count mismatch: ' + entities.length);
  const structured = entities.map(function(entity) {
    assert(entity && entity['@type'] === 'Question', 'FAQPage entry type mismatch');
    assert(entity.acceptedAnswer && entity.acceptedAnswer['@type'] === 'Answer', 'FAQPage answer type mismatch');
    return { question: entity.name, answer: entity.acceptedAnswer.text };
  });
  exactObject(structured, visible, 'FAQ schema-visible parity');
}

function assertLink(tag, expected, label) {
  assert(attr(tag, 'href') === expected.href, label + ' href mismatch');
  assert(attr(tag, 'data-content-surface') === expected.surface, label + ' surface mismatch');
  assert(attr(tag, 'data-target-slug') === expected.slug, label + ' target slug mismatch');
}

function assertUniqueLocs(xml, label) {
  const locs = [];
  const pattern = /<loc>\s*([\s\S]*?)\s*<\/loc>/gi;
  let match;
  while ((match = pattern.exec(String(xml)))) locs.push(decode(match[1]).trim());
  assert(locs.length > 0, label + ' has no loc entries');
  const duplicates = [...new Set(locs.filter(function(loc, index) { return locs.indexOf(loc) !== index; }))];
  assert(duplicates.length === 0, label + ' contains duplicate loc: ' + duplicates.join(', '));
}

function verifySitemap(xml, label) {
  assertUniqueLocs(xml, label);
  const entries = (String(xml).match(/<url>[\s\S]*?<\/url>/gi) || []).filter(function(block) {
    return /<loc>\s*https:\/\/dopabrain\.com\/portal\/blog\/zh\/2048-strategy-guide\.html\s*<\/loc>/i.test(block);
  });
  assert(entries.length === 1, label + ' article entry count mismatch: ' + entries.length);
  assert(new RegExp('<lastmod>\\s*' + LASTMOD + '\\s*</lastmod>').test(entries[0]), label + ' lastmod must be ' + LASTMOD);
  assert(/<changefreq>\s*monthly\s*<\/changefreq>/i.test(entries[0]), label + ' changefreq must remain monthly');
  assert(/<priority>\s*0\.8\s*<\/priority>/i.test(entries[0]), label + ' priority must remain 0.8');
}

function verifyDestinations() {
  const hrefs = QUICK.map(function(item) { return item.href; })
    .concat([STICKY.href], ARTICLE_CTAS, [COACH.coachHref, COACH.playHref]);
  [...new Set(hrefs.map(function(href) { return new URL(href, 'https://dopabrain.com').pathname; }))].forEach(function(pathname) {
    const file = DESTINATIONS[pathname];
    assert(file, 'No destination mapping for ' + pathname);
    assert(fs.existsSync(file) && fs.statSync(file).isFile(), 'CTA destination is missing: ' + path.relative(ROOT, file));
  });
}

function verifyCoachSource(source) {
  [
    'function get2048CoachBridgeConfig()',
    "coachUrl: '/puzzle-2048/coach.html?lang=' + encodeURIComponent(supportedLocale) + '&source=blog_2048_bridge'",
    "playUrl: '/puzzle-2048/?lang=' + encodeURIComponent(supportedLocale) + '&surface=coach_2048_bridge'",
    "data-surface-name=\"blog_2048_coach\"",
    "gtag('event', 'coach_2048_bridge_view'",
    "gtag('event', 'coach_2048_bridge_click'",
    "surface_name: 'blog_2048_coach'",
  ].forEach(function(contract) {
    assert(source.includes(contract), '2048 Coach bridge contract missing: ' + contract);
  });
}

function verifySource(html, portalMap, blogMap, crossPromoSource) {
  const titleMatch = String(html).match(/<title>([\s\S]*?)<\/title>/i);
  assert(titleMatch && textOf(titleMatch[1]) === TITLE, 'Title must remain unchanged');
  assert(canonical(html) === CANONICAL, 'Canonical must remain unchanged');

  assert(!/\bdata-ad-slot\s*=/i.test(html), 'Manual data-ad-slot is forbidden');
  assert(!/\bdata-ad-surface\s*=/i.test(html), 'Manual data-ad-surface is forbidden');
  assert(!/<ins\b[^>]*\badsbygoogle\b/i.test(html), 'Manual adsbygoogle element is forbidden');
  assert(!/(?:window\.)?adsbygoogle\s*=|adsbygoogle\s*\|\|/i.test(html), 'Manual adsbygoogle push bootstrap is forbidden');
  assert(!String(html).includes('content_ad_impression'), 'Synthetic content_ad_impression is forbidden');
  assert(!String(html).includes('indexing-auto-ad'), 'Stale manual ad shell CSS is forbidden');

  const head = sliceSection(html, /<head\b/i, /<\/head>/i, 'head');
  const loaderPattern = /<script\b[^>]*src=["']\/portal\/js\/ad-loader\.js["'][^>]*><\/script>/gi;
  assert((String(html).match(loaderPattern) || []).length === 1, 'Auto Ads loader count must be exactly one');
  assert((head.match(loaderPattern) || []).length === 1, 'Auto Ads loader must remain in head');
  assert(!/<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com/i.test(html), 'Direct AdSense loader must not bypass ad-loader.js');
  const crossPromoPattern = /<script\b[^>]*src=["']\/portal\/js\/cross-promo\.js["'][^>]*><\/script>/gi;
  assert((String(html).match(crossPromoPattern) || []).length === 1, 'Cross-promo loader count must be exactly one');

  const schema = schemaNodes(html);
  const articles = schema.filter(function(node) { return node['@type'] === 'Article'; });
  assert(articles.length === 1, 'Article schema count mismatch: ' + articles.length);
  assert(articles[0].dateModified === LASTMOD, 'Article schema dateModified must be ' + LASTMOD);
  assert(articles[0].mainEntityOfPage && articles[0].mainEntityOfPage['@id'] === CANONICAL, 'Article schema canonical mismatch');
  verifyFaq(html, schema);

  const stickyTags = tags(html, 'a').filter(function(tag) { return classHas(tag, 'revenue-sticky-cta'); });
  assert(stickyTags.length === 1, 'Sticky CTA count mismatch: ' + stickyTags.length);
  assertLink(stickyTags[0], STICKY, 'Sticky CTA');

  const quickSection = sliceSection(html, /<section\b[^>]*class=["'][^"']*\bindexing-quick-rail\b/i, /<\/section>/i, 'quick rail');
  const quickTags = tags(quickSection, 'a').filter(function(tag) { return classHas(tag, 'quick-card'); });
  assert(quickTags.length === QUICK.length, 'Quick rail count mismatch: ' + quickTags.length);
  QUICK.forEach(function(expected, index) { assertLink(quickTags[index], expected, 'Quick rail ' + (index + 1)); });

  const article = sliceSection(html, /<article\b/i, /<\/article>/i, 'article');
  const ctaTags = tags(article, 'a').filter(function(tag) { return classHas(tag, 'cta-btn'); });
  assert(ctaTags.length === ARTICLE_CTAS.length, 'Article CTA count mismatch: ' + ctaTags.length);
  ARTICLE_CTAS.forEach(function(expected, index) {
    assert(attr(ctaTags[index], 'href') === expected, 'Article CTA ' + (index + 1) + ' href mismatch');
  });
  const articleHash = crypto.createHash('sha256').update(textOf(article)).digest('hex');
  assert(articleHash === ARTICLE_TEXT_SHA256, 'Search-body hash mismatch: expected ' + ARTICLE_TEXT_SHA256 + ', got ' + articleHash);

  const telemetry = sliceSection(html, /\(function indexingContentTelemetry\(\)/, /<\/script>/i, 'content telemetry');
  ['content_view', 'content_sticky_cta_view', 'content_test_click', 'content_cta_click', 'content_related_click', 'content_toc_click'].forEach(function(eventName) {
    assert(telemetry.includes("'" + eventName + "'"), 'Missing content event: ' + eventName);
  });
  assert(telemetry.includes('content_locale: "zh"'), 'Content telemetry locale mismatch');
  assert(telemetry.includes('content_id: "' + CONTENT_ID + '"'), 'Content telemetry ID mismatch');
  assert((telemetry.match(/\bcta_surface\s*:/g) || []).length === 2, 'CTA surface event-param contract mismatch');
  assert((telemetry.match(/\btarget_slug\s*:/g) || []).length === 3, 'Target slug event-param contract mismatch');

  verifyCoachSource(crossPromoSource);
  verifySitemap(portalMap, 'Portal sitemap');
  verifySitemap(blogMap, 'Blog sitemap');
  verifyDestinations();
}

function commonContentParams() {
  return {
    event_category: 'content',
    page_path: ROUTE,
    content_locale: 'zh',
    content_id: CONTENT_ID,
  };
}

function exactParams(actual, expected, label) {
  const actualKeys = Object.keys(actual || {}).sort();
  const expectedKeys = Object.keys(expected).sort();
  assert(JSON.stringify(actualKeys) === JSON.stringify(expectedKeys), label + ' parameter keys mismatch: ' + actualKeys.join(', '));
  expectedKeys.forEach(function(key) {
    assert(actual[key] === expected[key], label + '.' + key + ' mismatch: expected ' + expected[key] + ', got ' + actual[key]);
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

function eventCount(page, name) {
  return events(page).then(function(items) { return items.filter(function(item) { return item.name === name; }).length; });
}

async function waitForEvent(page, name) {
  await page.waitForFunction(function(eventName) {
    return (window.dataLayer || []).some(function(entry) {
      const values = Array.from(entry || []);
      return values[0] === 'event' && values[1] === eventName;
    });
  }, name, { timeout: 5000 });
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(function() {
    return {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.documentElement.clientWidth,
    };
  });
  assert(overflow.document <= 1 && overflow.body <= 1, label + ' horizontal overflow: document=' + overflow.document + 'px, body=' + overflow.body + 'px');
}

async function assertTargets(page, label) {
  const selectors = ['.revenue-sticky-cta', '.quick-card', '.cta-btn', '.cp-2048-coach-link'];
  const targets = page.locator(selectors.join(','));
  const count = await targets.count();
  assert(count === 9, label + ' primary target count mismatch: expected 9, got ' + count);
  for (let index = 0; index < count; index += 1) {
    const target = targets.nth(index);
    const box = await target.boundingBox();
    const marker = await target.evaluate(function(node) { return node.className + ' ' + (node.getAttribute('href') || ''); });
    assert(box, label + ' target has no box: ' + marker);
    assert(box.width >= 44 && box.height >= 44, label + ' target violates 44px minimum: ' + marker + ' (' + box.width.toFixed(1) + 'x' + box.height.toFixed(1) + ')');
  }
}

async function clickAndRead(page, selector, eventName) {
  const target = page.locator(selector).first();
  assert(await target.count() === 1, 'Missing click target: ' + selector);
  const before = await eventCount(page, eventName);
  await target.evaluate(function(node) { node.click(); });
  await page.waitForFunction(function(args) {
    return (window.dataLayer || []).filter(function(entry) {
      const values = Array.from(entry || []);
      return values[0] === 'event' && values[1] === args.name;
    }).length === args.count;
  }, { name: eventName, count: before + 1 }, { timeout: 3000 });
  const matches = (await events(page)).filter(function(event) { return event.name === eventName; });
  assert(matches.length === before + 1, eventName + ' must increase exactly once');
  return { event: matches[matches.length - 1], href: await target.evaluate(function(node) { return node.href; }) };
}

function serverFor(getArticle) {
  const scripts = {
    '/portal/js/ad-loader.js': fs.readFileSync(AD_LOADER_FILE, 'utf8'),
    '/portal/js/cross-promo.js': fs.readFileSync(CROSS_PROMO_FILE, 'utf8'),
    '/portal/js/app-data.js': fs.readFileSync(APP_DATA_FILE, 'utf8'),
  };
  return http.createServer(function(request, response) {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname;
    if (pathname === ROUTE) {
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
      response.end(getArticle());
      return;
    }
    if (Object.prototype.hasOwnProperty.call(scripts, pathname)) {
      response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/javascript; charset=utf-8' });
      response.end(scripts[pathname]);
      return;
    }
    response.writeHead(204, { 'Cache-Control': 'no-store' });
    response.end();
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
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, locale: 'zh-CN' });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', function(error) { runtimeErrors.push(error.message); });
  page.on('console', function(message) {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.route('https://**/*', function(route) {
    route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: '/* isolated external script */' });
  });
  await page.addInitScript(function() {
    document.addEventListener('click', function(event) {
      if (event.target && event.target.closest && event.target.closest('a')) event.preventDefault();
    }, true);
  });
  try {
    const response = await page.goto(baseUrl + ROUTE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    assert(response && response.ok(), viewport.name + ' article response failed');
    await page.waitForSelector('.cp-2048-coach', { timeout: 5000 });
    await waitForEvent(page, 'content_view');
    await waitForEvent(page, 'content_sticky_cta_view');

    assert(await page.title() === TITLE, viewport.name + ' browser title mismatch');
    assert(await page.locator('html').getAttribute('lang') === 'zh-Hans', viewport.name + ' html lang mismatch');
    assert(await page.locator('link[rel="canonical"]').getAttribute('href') === CANONICAL, viewport.name + ' browser canonical mismatch');
    assert(await page.locator('script[src="/portal/js/ad-loader.js"]').count() === 1, viewport.name + ' browser Auto Ads loader count mismatch');
    assert(await page.locator('ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').count() === 0, viewport.name + ' browser manual ad surface remains');

    await assertNoOverflow(page, viewport.name);
    await assertTargets(page, viewport.name);

    const initial = await events(page);
    const views = initial.filter(function(event) { return event.name === 'content_view'; });
    assert(views.length === 1, viewport.name + ' content_view count mismatch: ' + views.length);
    exactParams(views[0].params, commonContentParams(), 'content_view');
    const stickyViews = initial.filter(function(event) { return event.name === 'content_sticky_cta_view'; });
    assert(stickyViews.length === 1, viewport.name + ' sticky CTA view count mismatch: ' + stickyViews.length);
    const stickyHref = await page.locator('.revenue-sticky-cta').evaluate(function(node) { return node.href; });
    exactParams(stickyViews[0].params, Object.assign(commonContentParams(), {
      cta_surface: STICKY.surface,
      target_slug: STICKY.slug,
      link_url: stickyHref,
    }), 'content_sticky_cta_view');
    assert(initial.every(function(event) { return event.name !== 'content_ad_impression'; }), viewport.name + ' emitted content_ad_impression');

    const quick = await clickAndRead(page, '.quick-card[data-target-slug="puzzle-2048"]', 'content_test_click');
    exactParams(quick.event.params, Object.assign(commonContentParams(), {
      link_url: quick.href,
      target_slug: 'puzzle-2048',
    }), 'content_test_click');

    const sticky = await clickAndRead(page, '.revenue-sticky-cta', 'content_cta_click');
    exactParams(sticky.event.params, Object.assign(commonContentParams(), {
      link_url: sticky.href,
      cta_surface: STICKY.surface,
      target_slug: STICKY.slug,
    }), 'content_cta_click/sticky');

    const articleCta = await clickAndRead(page, '.cta-btn', 'content_cta_click');
    exactParams(articleCta.event.params, Object.assign(commonContentParams(), {
      link_url: articleCta.href,
      cta_surface: 'article_cta',
      target_slug: '',
    }), 'content_cta_click/article');

    const coach = page.locator('.cp-2048-coach');
    await coach.scrollIntoViewIfNeeded();
    await waitForEvent(page, 'coach_2048_bridge_view');
    const coachViews = (await events(page)).filter(function(event) { return event.name === 'coach_2048_bridge_view'; });
    assert(coachViews.length === 1, viewport.name + ' coach view count mismatch: ' + coachViews.length);
    exactParams(coachViews[0].params, {
      event_category: 'engagement',
      source_app: 'blog',
      surface_name: COACH.surface,
      content_locale: 'zh',
      revenue_goal: 'daily_0_10',
    }, 'coach_2048_bridge_view');

    const coachClick = await clickAndRead(page, '.cp-2048-coach-link[data-destination="board_coach"]', 'coach_2048_bridge_click');
    exactParams(coachClick.event.params, {
      event_category: 'engagement',
      source_app: 'blog',
      surface_name: COACH.surface,
      content_locale: 'zh',
      destination_id: 'board_coach',
      destination_path: COACH.coachHref,
      revenue_goal: 'daily_0_10',
    }, 'coach_2048_bridge_click');

    await assertNoOverflow(page, viewport.name + '/after-interaction');
    assert(runtimeErrors.length === 0, viewport.name + ' console/runtime errors: ' + runtimeErrors.join(' | '));
    console.log('[PASS] ' + viewport.name + ': loader/manual-ad contract, 44px, overflow, CTA and Coach events');
  } finally {
    await context.close();
  }
}

function replaceRequired(value, search, replacement, name) {
  const output = String(value).replace(search, replacement);
  assert(output !== value, 'Mutation ' + name + ' did not change its input');
  return output;
}

function datedEntry() {
  return '<url><loc>' + CANONICAL + '</loc><lastmod>' + LASTMOD + '</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>';
}

function sourceMutations(baseline) {
  return [
    ['changed-title', 'Title must remain unchanged', { article: replaceRequired(baseline.article, TITLE, '2048错误标题 | DopaBrain', 'changed-title') }],
    ['changed-canonical', 'Canonical must remain unchanged', { article: replaceRequired(baseline.article, '<link rel="canonical" href="' + CANONICAL + '">', '<link rel="canonical" href="https://dopabrain.com/wrong">', 'changed-canonical') }],
    ['stale-schema-date', 'Article schema dateModified', { article: replaceRequired(baseline.article, '"dateModified":"' + LASTMOD + '"', '"dateModified":"2026-08-28"', 'stale-schema-date') }],
    ['faq-schema-drift', 'FAQ schema-visible parity', { article: replaceRequired(baseline.article, '"name":"Q1. 2048游戏的基本规则是什么？"', '"name":"Q1. 错误问题？"', 'faq-schema-drift') }],
    ['manual-auto-slot', 'Manual data-ad-slot', { article: replaceRequired(baseline.article, '<footer>', '<ins data-ad-slot="auto"></ins>\n<footer>', 'manual-auto-slot') }],
    ['manual-ins', 'Manual adsbygoogle element', { article: replaceRequired(baseline.article, '<footer>', '<ins class="adsbygoogle"></ins>\n<footer>', 'manual-ins') }],
    ['manual-ad-surface', 'Manual data-ad-surface', { article: replaceRequired(baseline.article, '<footer>', '<div data-ad-surface="fake"></div>\n<footer>', 'manual-ad-surface') }],
    ['synthetic-ad-event', 'Synthetic content_ad_impression', { article: replaceRequired(baseline.article, "track('content_view');", "track('content_ad_impression');\n                track('content_view');", 'synthetic-ad-event') }],
    ['missing-loader', 'Auto Ads loader count', { article: replaceRequired(baseline.article, '<script src="/portal/js/ad-loader.js"></script>', '', 'missing-loader') }],
    ['duplicate-loader', 'Auto Ads loader count', { article: replaceRequired(baseline.article, '    <script src="/portal/js/ad-loader.js"></script>', '    <script src="/portal/js/ad-loader.js"></script>\n    <script src="/portal/js/ad-loader.js"></script>', 'duplicate-loader') }],
    ['quick-route-drift', 'Quick rail 1 href mismatch', { article: replaceRequired(baseline.article, '/puzzle-2048/?lang=zh&amp;surface=zh_2048_strategy_quick', '/puzzle-2048/?lang=zh&amp;surface=wrong', 'quick-route-drift') }],
    ['sticky-surface-drift', 'Sticky CTA surface mismatch', { article: replaceRequired(baseline.article, 'data-content-surface="sticky_revenue_cta"', 'data-content-surface="wrong"', 'sticky-surface-drift') }],
    ['cta-route-drift', 'Article CTA 1 href mismatch', { article: replaceRequired(baseline.article, 'https://dopabrain.com/puzzle-2048/?lang=zh&amp;surface=zh_2048_strategy_cta1', 'https://dopabrain.com/puzzle-2048/?lang=zh&amp;surface=wrong', 'cta-route-drift') }],
    ['search-body-drift', 'Search-body hash mismatch', { article: replaceRequired(baseline.article, '方向锁定是角落固定法的延伸。', '方向锁定正文被意外修改。', 'search-body-drift') }],
    ['missing-cross-promo', 'Cross-promo loader count', { article: replaceRequired(baseline.article, '<script src="/portal/js/cross-promo.js" defer></script>', '', 'missing-cross-promo') }],
    ['missing-event', 'Missing content event', { article: replaceRequired(baseline.article, "track('content_toc_click'", "track('content_toc_missing'", 'missing-event') }],
    ['portal-stale-lastmod', 'Portal sitemap lastmod', { portal: replaceRequired(baseline.portal, datedEntry(), datedEntry().replace(LASTMOD, '2026-08-28'), 'portal-stale-lastmod') }],
    ['blog-stale-lastmod', 'Blog sitemap lastmod', { blog: replaceRequired(baseline.blog, datedEntry(), datedEntry().replace(LASTMOD, '2026-08-28'), 'blog-stale-lastmod') }],
    ['portal-duplicate-loc', 'Portal sitemap contains duplicate loc', { portal: replaceRequired(baseline.portal, '</urlset>', '  ' + datedEntry() + '\n</urlset>', 'portal-duplicate-loc') }],
  ];
}

function runSourceMutations(baseline) {
  return sourceMutations(baseline).map(function(mutation) {
    let error = null;
    try {
      verifySource(
        mutation[2].article || baseline.article,
        mutation[2].portal || baseline.portal,
        mutation[2].blog || baseline.blog,
        baseline.crossPromo
      );
    } catch (caught) {
      error = caught;
    }
    const ok = Boolean(error && error.message.includes(mutation[1]));
    console.log('[' + (ok ? 'PASS' : 'FAIL') + '] mutation ' + mutation[0] + ': ' + (error ? error.message : 'escaped'));
    return { name: mutation[0], ok: ok };
  });
}

async function browserMutation(browser, baseline, setArticle, baseUrl) {
  const mutated = replaceRequired(
    baseline,
    '</head>',
    '<style>.quick-card{height:20px!important;min-height:0!important;max-height:20px!important;padding:0!important;overflow:hidden!important}</style>\n</head>',
    'undersized-target'
  );
  setArticle(mutated);
  let error = null;
  try {
    await browserCheck(browser, baseUrl, VIEWPORTS[0]);
  } catch (caught) {
    error = caught;
  } finally {
    setArticle(baseline);
  }
  const ok = Boolean(error && error.message.includes('violates 44px minimum'));
  console.log('[' + (ok ? 'PASS' : 'FAIL') + '] mutation undersized-target: ' + (error ? error.message : 'escaped'));
  return { name: 'undersized-target', ok: ok };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const baseline = {
    article: fs.readFileSync(ARTICLE_FILE, 'utf8'),
    portal: fs.readFileSync(PORTAL_MAP_FILE, 'utf8'),
    blog: fs.readFileSync(BLOG_MAP_FILE, 'utf8'),
    crossPromo: fs.readFileSync(CROSS_PROMO_FILE, 'utf8'),
  };
  verifySource(baseline.article, baseline.portal, baseline.blog, baseline.crossPromo);
  console.log('[PASS] source: content, FAQ parity, CTA/Coach events, Auto Ads loader, sitemaps');

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
      results.push(await browserMutation(browser, baseline.article, function(value) { servedArticle = value; }, baseUrl));
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
