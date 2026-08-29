#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { renderArticle, validateSpec } = require('./create-blog-article');
const { removeInvalidStaticAds } = require('./upgrade-blog-indexing-batch');

const ROOT = path.resolve(__dirname, '..');
const CLIENT = 'ca-pub-3600813755953882';
const DEFAULT_SPEC = path.join(ROOT, 'scripts', 'specs', 'trend-odyssey-spiderman-ko.json');
const DEFAULT_PAGES = [
  path.join(ROOT, 'projects', 'portal', 'blog', 'ko', 'odyssey-spider-man-identity-reset-2026.html'),
  path.join(ROOT, 'projects', 'portal', 'blog', 'ko', '2026-brain-training-top-10.html'),
  path.join(ROOT, 'projects', 'portal', 'blog', 'zh', '2048-strategy-guide.html'),
  path.join(ROOT, 'projects', 'portal', 'blog', 'en', 'kpop-positions-explained-guide.html'),
  path.join(ROOT, 'projects', 'portal', 'tools', 'kpop-role-roster.html'),
  path.join(ROOT, 'projects', 'portal', 'tools', 'index.html'),
  path.join(ROOT, 'projects', 'kpop-position', 'index.html'),
  path.join(ROOT, 'projects', 'puzzle-2048', 'index.html'),
];
const PRODUCERS = [
  'scripts/create-blog-article.js',
  'scripts/generate-utility-apps.js',
  'scripts/repair-indexing-pages.js',
  'scripts/upgrade-blog-indexing-batch.js',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs(argv) {
  const options = { mutations: false };
  for (const arg of argv) {
    if (arg === '--mutations') options.mutations = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/verify-adsense-contract.js [--mutations]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function count(text, regex) {
  return Array.from(String(text || '').matchAll(regex)).length;
}

function stripHtmlComments(html) {
  return String(html || '').replace(/<!--[\s\S]*?-->/g, '');
}

function inspectHtml(html) {
  const source = stripHtmlComments(html);
  const directLoaders = count(source, /<script\b[^>]*\bsrc\s*=\s*["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=([^"'&\s>]+)[^"']*["'][^>]*>/gi);
  const loaderClients = Array.from(source.matchAll(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=([^"'&\s>]+)[^"']*["'][^>]*>/gi)).map((match) => match[1]);
  const managedLoaders = count(source, /<script\b[^>]*\bsrc\s*=\s*["']\/portal\/js\/ad-loader\.js["'][^>]*>/gi);
  return {
    directLoaders,
    invalidAutoSlots: count(source, /\bdata-ad-slot\s*=\s*["']auto["']/gi),
    loaderClients,
    managedLoaders,
    manualUnits: count(source, /<ins\b[^>]*\bclass\s*=\s*["'][^"']*\badsbygoogle\b[^"']*["'][^>]*>/gi),
    paidImpressionClaims: count(source, /\bcontent_ad_impression\b/g),
    staticAdSurfaces: count(source, /\bdata-ad-surface\s*=/gi),
    manualPushes: count(source, /\badsbygoogle\b[\s\S]{0,80}\.push\s*\(/gi),
  };
}

function verifyHtml(html, label) {
  const result = inspectHtml(html);
  const loaders = result.directLoaders + result.managedLoaders;
  assert(loaders === 1, `${label}: expected exactly one Auto Ads loader, got ${loaders}`);
  assert(result.loaderClients.every((client) => client === CLIENT), `${label}: AdSense client mismatch`);
  assert(result.invalidAutoSlots === 0, `${label}: invalid data-ad-slot="auto" detected`);
  assert(result.manualUnits === 0, `${label}: manual adsbygoogle unit detected without an active ad unit contract`);
  assert(result.manualPushes === 0, `${label}: manual adsbygoogle.push detected`);
  assert(result.staticAdSurfaces === 0, `${label}: static ad surface cannot prove a paid impression`);
  assert(result.paidImpressionClaims === 0, `${label}: unverifiable content_ad_impression telemetry detected`);
  return result;
}

function verifyProducerSources() {
  for (const relative of PRODUCERS) {
    const source = fs.readFileSync(path.join(ROOT, relative), 'utf8');
    assert(!/data-ad-slot=["']auto["']/i.test(source), `${relative}: emits invalid data-ad-slot="auto"`);
    assert(!/<ins\b[^>]*class=["'][^"']*adsbygoogle/i.test(source), `${relative}: emits a manual adsbygoogle unit`);
    assert(!/\bcontent_ad_impression\b/.test(source), `${relative}: emits unverifiable paid-impression telemetry`);
    assert(!/\badsbygoogle\b[\s\S]{0,80}\.push\s*\(/i.test(source), `${relative}: emits a manual adsbygoogle.push`);
  }

  const managedLoader = fs.readFileSync(path.join(ROOT, 'projects', 'portal', 'js', 'ad-loader.js'), 'utf8');
  assert(managedLoader.includes(`CLIENT_ID = '${CLIENT}'`), 'portal ad-loader client mismatch');
  assert(managedLoader.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='), 'portal ad-loader does not request the Auto Ads script');
  const upgrader = fs.readFileSync(path.join(ROOT, 'scripts', 'upgrade-blog-indexing-batch.js'), 'utf8');
  assert(/function removeInvalidStaticAds\b/.test(upgrader) && /removeInvalidStaticAds\(html\)/.test(upgrader), 'blog upgrader does not remove legacy invalid static ads');

  const legacyFixture = '<script src="/portal/js/ad-loader.js"></script><article>keep</article><div class="ad-container indexing-auto-ad" data-ad-surface="mid"><div class="ad-label">Advertisement</div><div><ins class="adsbygoogle" data-ad-slot="auto"></ins></div></div><p>after</p>';
  const sanitized = removeInvalidStaticAds(legacyFixture);
  assert(sanitized.includes('<article>keep</article>'), 'legacy ad cleanup removed unrelated content');
  assert(sanitized.includes('<p>after</p>'), 'legacy ad cleanup removed content after a nested wrapper');
  assert(!sanitized.includes('</div>'), 'legacy nested ad cleanup left an unmatched closing div');
  verifyHtml(sanitized, 'legacy ad cleanup fixture');

  const labelFixture = '<script src="/portal/js/ad-loader.js"></script><div class="ad-container"><span>Advertisement</span><ins class="adsbygoogle" data-ad-slot="auto"></ins></div><p>after</p>';
  const labelSanitized = removeInvalidStaticAds(labelFixture);
  assert(!/\bad-container\b/.test(labelSanitized), 'legacy ad cleanup left an empty label wrapper');
  assert(labelSanitized.includes('<p>after</p>'), 'legacy label cleanup removed adjacent content');
  verifyHtml(labelSanitized, 'legacy label cleanup fixture');

  const meaningfulFixture = '<script src="/portal/js/ad-loader.js"></script><div class="ad-container"><p>Reader note</p></div>';
  const meaningfulSanitized = removeInvalidStaticAds(meaningfulFixture);
  assert(meaningfulSanitized.includes('Reader note'), 'legacy ad cleanup removed meaningful container content');
  verifyHtml(meaningfulSanitized, 'meaningful container fixture');
}

function loadRenderedFixture() {
  const spec = JSON.parse(fs.readFileSync(DEFAULT_SPEC, 'utf8'));
  validateSpec(spec);
  return renderArticle(spec);
}

function replaceRequired(text, regex, replacement, name) {
  assert(regex.test(text), `Mutation setup failed: ${name}`);
  return text.replace(regex, replacement);
}

function buildMutations(html) {
  const loader = /<script\b[^>]*\bsrc\s*=\s*["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"']+["'][^>]*><\/script>/i;
  const loaderTag = html.match(loader)?.[0] || '';
  assert(loaderTag, 'Mutation setup failed: Auto Ads loader');
  return [
    { name: 'loader-removed', expected: 'exactly one Auto Ads loader', html: replaceRequired(html, loader, '', 'loader-removed') },
    { name: 'commented-only-loader', expected: 'exactly one Auto Ads loader', html: replaceRequired(html, loader, `<!-- ${loaderTag} -->`, 'commented-only-loader') },
    { name: 'loader-duplicated', expected: 'exactly one Auto Ads loader', html: replaceRequired(html, /<\/head>/i, `${loaderTag}\n</head>`, 'loader-duplicated') },
    { name: 'client-changed', expected: 'AdSense client mismatch', html: html.replace(CLIENT, 'ca-pub-0000000000000000') },
    { name: 'invalid-auto-slot', expected: 'invalid data-ad-slot="auto"', html: replaceRequired(html, /<\/article>/i, '<ins class="adsbygoogle" data-ad-slot="auto"></ins></article>', 'invalid-auto-slot') },
    { name: 'manual-numeric-unit', expected: 'manual adsbygoogle unit', html: replaceRequired(html, /<\/article>/i, '<ins class="adsbygoogle" data-ad-slot="1234567890"></ins></article>', 'manual-numeric-unit') },
    { name: 'manual-push', expected: 'manual adsbygoogle.push', html: replaceRequired(html, /<\/body>/i, '<script>(window.adsbygoogle=window.adsbygoogle||[]).push({});</script></body>', 'manual-push') },
    { name: 'fake-surface', expected: 'static ad surface', html: replaceRequired(html, /<\/article>/i, '<div data-ad-surface="mid_article"></div></article>', 'fake-surface') },
    { name: 'fake-paid-event', expected: 'content_ad_impression', html: replaceRequired(html, /<\/body>/i, '<script>gtag("event","content_ad_impression")</script></body>', 'fake-paid-event') },
  ];
}

function runMutations(baseline) {
  const commentDecoys = baseline.replace(/<\/article>/i, '<!-- <ins class="adsbygoogle" data-ad-slot="auto"></ins><div data-ad-surface="fake"></div><script>adsbygoogle.push({}); gtag("event", "content_ad_impression")</script> --></article>');
  verifyHtml(commentDecoys, 'comment decoys');
  console.log('[PASS] comment decoys: non-DOM ad markup and telemetry ignored');

  const results = [];
  for (const mutation of buildMutations(baseline)) {
    try {
      verifyHtml(mutation.html, mutation.name);
      results.push({ ...mutation, ok: false, message: 'verifier incorrectly passed' });
    } catch (error) {
      results.push({ ...mutation, ok: error.message.includes(mutation.expected), message: error.message });
    }
  }
  for (const result of results) console.log(`[${result.ok ? 'PASS' : 'FAIL'}] ${result.name}: ${result.message}`);
  const escaped = results.filter((result) => !result.ok);
  console.log(`Mutation summary: ${results.length - escaped.length}/${results.length} detected`);
  assert(escaped.length === 0, `${escaped.length} AdSense mutation(s) escaped or failed for the wrong reason`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  verifyProducerSources();
  console.log(`[PASS] ${PRODUCERS.length} content producers cannot emit fake manual Auto Ads units or paid-impression telemetry`);

  const rendered = loadRenderedFixture();
  const renderedResult = verifyHtml(rendered, 'generated Culture Signal fixture');
  console.log(`[PASS] generated fixture: loaders=${renderedResult.directLoaders + renderedResult.managedLoaders}, manualUnits=0`);

  for (const file of DEFAULT_PAGES) {
    const relative = path.relative(ROOT, file).replace(/\\/g, '/');
    assert(fs.existsSync(file) && fs.statSync(file).isFile(), `${relative}: required focused page is missing`);
    const result = verifyHtml(fs.readFileSync(file, 'utf8'), relative);
    console.log(`[PASS] ${relative}: loaders=${result.directLoaders + result.managedLoaders}, manualUnits=0`);
  }

  if (options.mutations) runMutations(rendered);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
