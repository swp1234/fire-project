#!/usr/bin/env node
/**
 * Static & mutation-tested contract verifier for:
 * 1. Shared portal blog monetization engine (blog-monetization.css/js)
 * 2. Managed ad-loader.js spam-referrer & localhost RPM shield
 * 3. Portfolio-wide blog curated-resources + sticky CTA coverage & affiliate compliance
 * 4. Zero GA4 gtag() initialization blackouts across sitemap blogs & active monetized apps
 * 5. Smart 404 organic/AI recovery & >=44px touch compliance (root-domain/404.html)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const PORTAL_DIR = path.join(PROJECTS_DIR, 'portal');
const SUSPENDED_SLUGS = [
  'dark-core', 'daily-tarot', 'numerology', 'flappy-bird',
  'brick-breaker', 'snake-game', 'maze-runner', 'zigzag-runner',
  'stack-tower', 'number-puzzle', 'word-guess', 'emoji-merge',
  'sky-runner', 'pong-game', 'idle-clicker', 'color-memory',
  'road-shooter', 'zodiac-match', 'mbti-coffee', 'mbti-career',
  'word-scramble', 'red-flag', 'luck-meter', 'sleep-animal',
  'rizz-score', 'delulu-test', 'brainrot-quiz', 'shadow-work',
  'past-life',
];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function loadFixture() {
  const sm = fs.readFileSync(path.join(PORTAL_DIR, 'blog', 'sitemap.xml'), 'utf8');
  const blogUrls = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const blogs = {};
  for (const u of blogUrls) {
    const rel = u.replace('https://dopabrain.com/portal/blog/', '');
    const fp = path.join(PORTAL_DIR, 'blog', rel);
    if (fs.existsSync(fp)) blogs[rel] = fs.readFileSync(fp, 'utf8');
  }

  const activeApps = {};
  for (const d of fs.readdirSync(PROJECTS_DIR).sort()) {
    const idx = path.join(PROJECTS_DIR, d, 'index.html');
    if (!fs.existsSync(idx)) continue;
    const html = fs.readFileSync(idx, 'utf8');
    if (/suspended-invalid-traffic|data-product-status="retired-/i.test(html)) continue;
    if (/noindex,\s*follow/i.test(html) && html.length < 3000) continue;
    activeApps[d] = html;
  }

  return {
    bmCss: fs.readFileSync(path.join(PORTAL_DIR, 'css', 'blog-monetization.css'), 'utf8'),
    bmJs: fs.readFileSync(path.join(PORTAL_DIR, 'js', 'blog-monetization.js'), 'utf8'),
    adLoader: fs.readFileSync(path.join(PORTAL_DIR, 'js', 'ad-loader.js'), 'utf8'),
    page404: fs.readFileSync(path.join(PROJECTS_DIR, 'root-domain', '404.html'), 'utf8'),
    blogs,
    activeApps,
  };
}

function verifySource(fx) {
  // 1. Shared CSS & JS contracts
  assert(/\.curated-resources-card\b/.test(fx.bmCss) && /\.revenue-sticky-cta-wrap\b/.test(fx.bmCss), 'blog-monetization.css missing core selectors');
  assert(/min-height:\s*44px/.test(fx.bmCss) && /min-width:\s*44px/.test(fx.bmCss), 'blog-monetization.css missing 44px touch target floor');
  assert(/content_sticky_cta_view/.test(fx.bmJs) && /curated_resource_click/.test(fx.bmJs), 'blog-monetization.js missing required telemetry events');
  assert(/IntersectionObserver/.test(fx.bmJs) && /threshold:\s*0\.5/.test(fx.bmJs), 'blog-monetization.js missing 50%-visibility observer');
  assert(!/page_engage|ad_impression/i.test(fx.bmJs), 'blog-monetization.js contains forbidden synthetic telemetry');

  // 2. Managed ad-loader.js RPM shield
  assert(fx.adLoader.includes("CLIENT_ID = 'ca-pub-3600813755953882'"), 'ad-loader.js client ID drifted');
  assert(/function\s+isLocalOrPreviewHost\b/.test(fx.adLoader), 'ad-loader.js missing localhost guard');
  assert(/function\s+isSpamReferrer\b/.test(fx.adLoader) && /aocr\.org/.test(fx.adLoader), 'ad-loader.js missing spam referrer guard');
  assert(/function\s+isScanRisk\b/.test(fx.adLoader), 'ad-loader.js missing SG scan risk guard');

  // 3. Portfolio-wide blog monetization & GA4 integrity
  let curatedCount = 0;
  let stickyCount = 0;
  let quickCheckCount = 0;
  let preconnectCount = 0;
  let missingBlogGtag = [];
  for (const [rel, html] of Object.entries(fx.blogs)) {
    if (!/function\s+gtag\s*\(/i.test(html) || !/G-J8GSWM40TV/.test(html)) {
      missingBlogGtag.push(rel);
    }
    if (/rel="preconnect"[^>]*googlesyndication/i.test(html)) {
      preconnectCount++;
    }
    if (html.includes('data-bm-curated="1"')) {
      curatedCount++;
      assert(html.includes('tag=dopabrain-20'), `${rel}: curated card missing dopabrain-20 affiliate tag`);
      assert(/rel="[^"]*\bsponsored\b[^"]*"/i.test(html), `${rel}: curated affiliate link missing rel=sponsored`);
    }
    if (html.includes('data-bm-sticky="1"')) {
      stickyCount++;
      const m = html.match(/<a\s+class="revenue-sticky-cta"\s+href="\/([a-z0-9-]+)\//i);
      assert(m && m[1], `${rel}: sticky CTA missing internal app target`);
      assert(!SUSPENDED_SLUGS.includes(m[1]), `${rel}: sticky CTA points to suspended app /${m[1]}/`);
    }
    if (html.includes('data-bm-check="1"')) {
      quickCheckCount++;
      const mc = html.match(/<a\s+class="bm-qc-cta"\s+href="\/([a-z0-9-]+)\//i);
      assert(mc && mc[1], `${rel}: quick-check CTA missing internal app target`);
      assert(!SUSPENDED_SLUGS.includes(mc[1]), `${rel}: quick-check CTA points to suspended app /${mc[1]}/`);
      assert(html.includes('role="checkbox"'), `${rel}: quick-check missing accessible checkbox role`);
    }
  }
  assert(missingBlogGtag.length === 0, `Sitemap blog pages missing gtag() init: ${missingBlogGtag.slice(0, 5).join(', ')}`);
  assert(curatedCount >= 1000, `Expected >=1000 curated blog pages, got ${curatedCount}`);
  assert(stickyCount >= 1000, `Expected >=1000 managed sticky CTA blog pages, got ${stickyCount}`);
  assert(quickCheckCount >= 600, `Expected >=600 interactive quick-check blog pages across 12 locales, got ${quickCheckCount}`);
  assert(preconnectCount >= 1000, `Expected >=1000 AdSense preconnect blog pages, got ${preconnectCount}`);

  // 4. Zero GA4 blackouts across active monetized sub-apps
  const missingAppGtag = [];
  for (const [app, html] of Object.entries(fx.activeApps)) {
    if (!/function\s+gtag\s*\(/i.test(html) || !/G-J8GSWM40TV/.test(html)) {
      missingAppGtag.push(app);
    }
  }
  assert(missingAppGtag.length === 0, `Active monetized apps missing gtag() init: ${missingAppGtag.join(', ')}`);

  // 5. Smart 404 recovery & touch targets
  assert(/__dopabrainResolve404Candidate/.test(fx.page404), '404.html missing smart recovery resolver');
  assert(/page_not_found_recovered/.test(fx.page404), '404.html missing recovery telemetry event');
  assert(/method:\s*'HEAD'/.test(fx.page404), '404.html missing HEAD verification to prevent redirect loops');
  assert(/URLSearchParams/.test(fx.page404), '404.html missing ?lang= query priority');
  assert(/\.chip\s*\{[^}]*min-height:\s*44px/i.test(fx.page404), '404.html .chip missing 44px touch target');

  return {
    blogsChecked: Object.keys(fx.blogs).length,
    curatedCount,
    stickyCount,
    quickCheckCount,
    preconnectCount,
    activeAppsChecked: Object.keys(fx.activeApps).length,
  };
}

function runMutations(base) {
  const firstCuratedKey = Object.keys(base.blogs).find((k) => base.blogs[k].includes('data-bm-curated="1"'));
  const firstQuickKey = Object.keys(base.blogs).find((k) => base.blogs[k].includes('data-bm-check="1"'));
  const firstAppKey = Object.keys(base.activeApps)[0];
  const noPreconnectBlogs = Object.fromEntries(
    Object.entries(base.blogs).map(([k, v]) => [k, v.replace(/<link[^>]*rel="preconnect"[^>]*googlesyndication[^>]*>/gi, '')])
  );
  const cases = [
    ['synthetic-page-engage', { ...base, bmJs: `${base.bmJs}\nsendEvent('page_engage');` }],
    ['spam-guard-removed', { ...base, adLoader: base.adLoader.replace('function isSpamReferrer', 'function disabledGuard') }],
    ['missing-sponsored-rel', { ...base, blogs: { ...base.blogs, [firstCuratedKey]: base.blogs[firstCuratedKey].replace(/\bsponsored\b/gi, '') } }],
    ['suspended-sticky-target', { ...base, blogs: { ...base.blogs, [firstCuratedKey]: base.blogs[firstCuratedKey].replace(/<a class="revenue-sticky-cta" href="\/[a-z0-9-]+\//i, '<a class="revenue-sticky-cta" href="/past-life/') } }],
    ['suspended-quickcheck-target', { ...base, blogs: { ...base.blogs, [firstQuickKey]: base.blogs[firstQuickKey].replace(/<a class="bm-qc-cta" href="\/[a-z0-9-]+\//i, '<a class="bm-qc-cta" href="/past-life/') } }],
    ['preconnect-stripped', { ...base, blogs: noPreconnectBlogs }],
    ['blog-gtag-blackout', { ...base, blogs: { ...base.blogs, [firstCuratedKey]: base.blogs[firstCuratedKey].replace(/function\s+gtag\s*\(/gi, 'function broken(') } }],
    ['app-gtag-blackout', { ...base, activeApps: { ...base.activeApps, [firstAppKey]: base.activeApps[firstAppKey].replace(/function\s+gtag\s*\(/gi, 'function broken(') } }],
    ['404-head-guard-removed', { ...base, page404: base.page404.replace("method: 'HEAD'", "method: 'GET'") }],
    ['404-small-chip-target', { ...base, page404: base.page404.replace(/min-height:\s*44px;/g, 'min-height: 24px;') }],
  ];

  for (const [name, mutated] of cases) {
    let caught = false;
    try {
      verifySource(mutated);
    } catch (err) {
      caught = true;
      console.log(`[PASS] ${name}: ${err.message}`);
    }
    assert(caught, `Mutation escaped: ${name}`);
  }
  console.log(`[PASS] blog monetization mutation summary ${cases.length}/${cases.length} detected`);
}

function main() {
  const base = loadFixture();
  const res = verifySource(base);
  if (process.argv.includes('--mutations')) runMutations(base);
  console.log(`[PASS] Blog monetization & telemetry contracts verified (${res.blogsChecked} sitemap blogs, ${res.curatedCount} curated, ${res.stickyCount} sticky CTAs, ${res.quickCheckCount} quick-checks, ${res.preconnectCount} preconnect, ${res.activeAppsChecked} active apps, 404 recovery)`);
}

main();
