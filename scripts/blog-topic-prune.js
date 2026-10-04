#!/usr/bin/env node
/*
 * Topic prune (2026-10-03): removes off-topic blog clusters from the portal sitemaps so
 * `blog-indexing-focus.js --apply` marks them `noindex,follow`. Files are never deleted,
 * so the decision is reversible by narrowing OFF_TOPIC and re-adding sitemap rows.
 *
 * Rationale: GSC showed core tools "Crawled - currently not indexed" while ~2,000 off-topic
 * URLs (Roblox dev, game neuroscience, world cup, fiction/movie psychology) were submitted.
 *
 * Usage: node scripts/blog-topic-prune.js [--apply] [--self-test]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const SITEMAPS = [path.join(PORTAL, 'sitemap.xml'), path.join(PORTAL, 'blog', 'sitemap.xml')];

const OFF_TOPIC = new RegExp([
  'roblox',
  'neuroscience',
  'world-cup',
  'minecraft',
  '-fiction-psychology',
  'horror-psychology',
  'cinema-psychology',
  'movie-',
  'kdrama',
  'whodunit',
  'mythology',
  'folklore',
  'procedural-generation',
  'sci-fi',
  'soulslike',
  'souls-like',
  'ghibli',
  'superhero',
  'true-crime',
  'comedy-humor',
  'gaming-tilt',
  'flow-state-gaming',
  'gaming-cognition',
  'action-rpg',
  'moba-',
  'tactical-fps',
  'stealth-games?-',
].join('|'), 'i');

function isOffTopic(url) {
  let pathname;
  try {
    pathname = new URL(url, 'https://dopabrain.com').pathname;
  } catch {
    return false;
  }
  if (!pathname.startsWith('/portal/blog/') || !pathname.endsWith('.html')) return false;
  return OFF_TOPIC.test(path.posix.basename(pathname, '.html'));
}

function pruneXml(xml) {
  let removed = 0;
  const eol = xml.includes('\r\n') ? '\r\n' : '\n';
  const out = xml.replace(/[ \t]*<url>[\s\S]*?<\/url>[ \t]*(\r?\n)?/g, (block) => {
    const loc = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1];
    if (loc && isOffTopic(loc)) {
      removed += 1;
      return '';
    }
    return block;
  });
  return { xml: out.endsWith(eol) || !xml.endsWith(eol) ? out : out + eol, removed };
}

function remaining(xml) {
  return Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) => m[1]).filter(isOffTopic);
}

function run({ apply }) {
  let total = 0;
  const leftovers = [];
  for (const file of SITEMAPS) {
    const original = fs.readFileSync(file, 'utf8');
    const { xml, removed } = pruneXml(original);
    total += removed;
    const label = path.relative(ROOT, file);
    console.log(`${apply ? '[APPLY]' : '[DRY]'} ${label}: off-topic rows ${removed}, kept rows ${(xml.match(/<url>/g) || []).length}`);
    if (apply && removed) fs.writeFileSync(file, xml, 'utf8');
    leftovers.push(...remaining(apply ? xml : original).map((u) => `${label}: ${u}`));
  }
  if (!apply && leftovers.length) {
    console.error(`[FAIL] ${leftovers.length} off-topic URL(s) still submitted, e.g.\n- ${leftovers.slice(0, 10).join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[PASS] topic prune: ${apply ? `removed ${total}` : 'no off-topic URLs submitted'}`);
}

function selfTest() {
  const assert = (ok, msg) => { if (!ok) throw new Error(`self-test: ${msg}`); };
  assert(isOffTopic('https://dopabrain.com/portal/blog/ko/roblox-fps-boost-lag-fix-guide.html'), 'roblox not pruned');
  assert(isOffTopic('https://dopabrain.com/portal/blog/en/moba-wave-management-macro-strategy-guide.html'), 'moba not pruned');
  assert(isOffTopic('https://dopabrain.com/portal/blog/en/stealth-game-enemy-suspicion-meter-vigilance-neuroscience.html'), 'neuroscience not pruned');
  assert(!isOffTopic('https://dopabrain.com/portal/blog/en/hsp-test-highly-sensitive-person-quiz.html'), 'core HSP pruned');
  assert(!isOffTopic('https://dopabrain.com/portal/blog/en/2048-strategy-guide.html'), '2048 guide pruned');
  assert(!isOffTopic('https://dopabrain.com/stress-check/'), 'non-blog URL pruned');
  const xml = '<urlset>\n  <url><loc>https://dopabrain.com/portal/blog/en/roblox-x.html</loc></url>\n  <url>\n    <loc>https://dopabrain.com/portal/blog/en/stress-test.html</loc>\n  </url>\n</urlset>\n';
  const { xml: out, removed } = pruneXml(xml);
  assert(removed === 1 && !out.includes('roblox') && out.includes('stress-test'), 'xml prune incorrect');
  assert(pruneXml(out).removed === 0, 'prune not idempotent');
  console.log('[PASS] blog topic prune self-test');
}

if (require.main === module) {
  try {
    if (process.argv.includes('--self-test')) selfTest();
    run({ apply: process.argv.includes('--apply') });
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { isOffTopic, pruneXml, OFF_TOPIC };
