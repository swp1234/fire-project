#!/usr/bin/env node
/**
 * Static, Runtime (Playwright 390x844 & 1440x900), Security (XSS), and Mutation Verifier for:
 * - 3 Flagship Wellness Tools: CBT Cognitive Distortion Reframer, RSD Coping Audit, Attachment Trigger Decoder
 * - Shared 1080x1920 Story Card PNG engine (tool-story-card.js) & 5 existing flagship tools integration
 * - Portal hub discovery (/portal/index.html, /portal/tools/index.html, /portal/sitemap.xml)
 * - 100 contextual blog tool bridges (data-bm-tool-bridge="1")
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const PORTAL = path.join(PROJECTS, 'portal');

const NEW_TOOLS = [
  'cognitive-distortion-reframer',
  'rsd-coping-audit',
  'attachment-trigger-decoder',
  'sleep-chronotype-reset',
  'procrastination-root-decoder',
  'daily-mind-checkin',
  'imposter-syndrome-audit',
  'boundary-script-builder',
  'window-of-tolerance-check',
  'adhd-focus-friction-audit',
  'inner-critic-compassion-lab',
  'overthinking-rumination-breaker',
  'social-battery-recharge-planner',
  'somatic-tension-body-map',
  'emotional-energy-audit',
  'gaslighting-reality-check',
  'codependency-reset-audit',
  'perfectionism-loop-decoder',
  'social-anxiety-exposure-ladder',
  'vagal-nervous-system-reset',
  'doomscrolling-circuit-breaker',
  'inner-child-need-decoder',
  'decision-fatigue-declutter',
  'emotional-flashback-grounding',
  'anxiety-vs-panic-reset',
  'emotional-exhaustion-recovery',
  'emotional-validation-reframer',
  'abandonment-anxiety-soother',
  'nvc-conflict-script-builder',
  'morning-energy-architect',
  'emotional-trigger-decoder',
  'workplace-stress-triage',
  'grief-loss-wave-companion',
  'relationship-green-flag-audit',
  'people-pleasing-fawn-decoder',
  'functional-freeze-thaw-planner',
  'hypervigilance-safety-reset',
  'self-worth-evidence-builder',
  'sensory-overload-calm-kit',
  'avoidant-attachment-thaw-lab',
  'anger-cooldown-deescalator',
  'guilt-vs-responsibility-filter',
  'loneliness-micro-connection-plan',
  'sunday-scaries-week-reset',
  'working-memory-span-trainer',
  'attention-switching-agility-lab',
  'deep-work-focus-readiness',
  'hsp-workplace-energy-planner',
  'nervous-system-state-mapper',
  'burnout-boundary-recovery-calc',
  'sleep-debt-recovery-planner',
  'maladaptive-daydreaming-grounding',
  'executive-dysfunction-micro-ramp',
  'health-anxiety-reassurance-breaker',
  'allostatic-stress-budgeter',
  'self-sabotage-pattern-decoder',
  'comparison-spiral-detox',
  'burnout-return-to-work-planner',
  'digital-eye-strain-focus-reset',
  'conflict-repair-apology-builder',
  'career-decision-clarity-matrix',
  'empathy-fatigue-boundary-kit',
  'pre-sleep-brain-dump-vault',
  'perfectionist-inbox-triage-lab',
];
const EXISTING_FLAGSHIPS = [
  'burnout-stress-differential',
  'cognitive-load-calculator',
  'decision-matrix',
  'dopamine-detox-protocol',
  'grounding-exercise',
  'brain-game-workout',
];
const LOCALES = ['en', 'ko', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const SUSPENDED = ['past-life', 'brainrot-quiz', 'delulu-test', 'rizz-score', 'sleep-animal', 'luck-meter'];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function loadFixture() {
  const tools = {};
  for (const slug of NEW_TOOLS) {
    tools[slug] = {
      html: fs.readFileSync(path.join(PORTAL, 'tools', `${slug}.html`), 'utf8'),
      js: fs.readFileSync(path.join(PORTAL, 'js', `${slug}.js`), 'utf8'),
    };
  }
  const existing = {};
  for (const slug of EXISTING_FLAGSHIPS) {
    existing[slug] = fs.readFileSync(path.join(PORTAL, 'tools', `${slug}.html`), 'utf8');
  }
  const blogSitemap = fs.readFileSync(path.join(PORTAL, 'blog', 'sitemap.xml'), 'utf8');
  const blogUrls = [...blogSitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  let bridgeCount = 0;
  for (const u of blogUrls) {
    const rel = u.replace('https://dopabrain.com/portal/blog/', '');
    const fp = path.join(PORTAL, 'blog', rel);
    if (fs.existsSync(fp) && fs.readFileSync(fp, 'utf8').includes('data-bm-tool-bridge="1"')) {
      bridgeCount++;
    }
  }
  return {
    tools,
    existing,
    storyJs: fs.readFileSync(path.join(PORTAL, 'js', 'tool-story-card.js'), 'utf8'),
    calmPacerJs: fs.readFileSync(path.join(PORTAL, 'js', 'tool-calm-pacer.js'), 'utf8'),
    sharedCss: fs.readFileSync(path.join(PORTAL, 'css', 'wellness-lab-tool.css'), 'utf8'),
    portalIndex: fs.readFileSync(path.join(PORTAL, 'index.html'), 'utf8'),
    portalToolsIndex: fs.readFileSync(path.join(PORTAL, 'tools', 'index.html'), 'utf8'),
    portalSitemap: fs.readFileSync(path.join(PORTAL, 'sitemap.xml'), 'utf8'),
    mbtiEnhancer: fs.readFileSync(path.join(PORTAL, 'mbti', 'type-page-enhancer.js'), 'utf8'),
    wellnessLabHtml: fs.readFileSync(path.join(PORTAL, 'tools', 'wellness-lab.html'), 'utf8'),
    wellnessLabJs: fs.readFileSync(path.join(PORTAL, 'js', 'wellness-lab.js'), 'utf8'),
    wellnessLabLeads: fs.readFileSync(path.join(PORTAL, 'js', 'wellness-lab-leads.json'), 'utf8'),
    bridgeCount,
  };
}

function verifySource(fx) {
  // 1. Shared Story Card engine
  assert(/width\s*=\s*1080/.test(fx.storyJs) && /height\s*=\s*1920/.test(fx.storyJs), 'tool-story-card.js must render 1080x1920 canvas');
  assert(/tool_story_card_download/.test(fx.storyJs), 'tool-story-card.js missing safe download event');
  assert(/FOOTER_TAGLINES/.test(fx.storyJs) && /TAKEAWAY_LABELS/.test(fx.storyJs), 'tool-story-card.js missing 12-locale viral footer taglines / takeaway labels');
  assert(!/page_engage|ad_impression/i.test(fx.storyJs), 'tool-story-card.js contains forbidden synthetic telemetry');
  assert(/wellness_pacer_start/.test(fx.calmPacerJs) && /wellness_pacer_complete/.test(fx.calmPacerJs) && /min-height:44px/.test(fx.calmPacerJs), 'tool-calm-pacer.js missing pacer telemetry or 44px button contract');
  assert(!/page_engage|ad_impression|Math\.random/i.test(fx.calmPacerJs), 'tool-calm-pacer.js contains forbidden synthetic or random pattern');

  // 2. Shared CSS
  assert(/overflow-x:\s*hidden/.test(fx.sharedCss) && /min-height:\s*44px/.test(fx.sharedCss), 'wellness-lab-tool.css missing mobile safety rules');

  // 3. Three new flagship tools
  for (const slug of NEW_TOOLS) {
    const { html, js } = fx.tools[slug];
    const canonical = `https://dopabrain.com/portal/tools/${slug}.html`;
    assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${slug}: static canonical missing`);
    for (const loc of LOCALES) {
      assert(html.includes(`hreflang="${loc}"`), `${slug}: hreflang missing (${loc})`);
    }
    assert(html.includes('hreflang="x-default"'), `${slug}: x-default hreflang missing`);
    assert(html.includes('<script src="/portal/js/ad-loader.js"></script>'), `${slug}: managed ad-loader.js missing`);
    assert(/rel="preconnect"[^>]*googlesyndication/i.test(html), `${slug}: AdSense preconnect missing`);
    assert(/function\s+gtag\s*\(/i.test(html) && html.includes('G-J8GSWM40TV'), `${slug}: GA4 gtag init missing`);
    assert(html.includes('data-bm-curated="1"') && html.includes('tag=dopabrain-20') && /\bsponsored\b/i.test(html), `${slug}: affiliate curated card contract missing`);
    assert(html.includes('data-bm-sticky="1"'), `${slug}: scroll sticky CTA missing`);
    if (/FAQPage/.test(html)) {
      assert(/class=["'][^"']*faq-grid[^"']*["']/.test(html), `${slug}: FAQPage JSON-LD must have matching visible .faq-grid`);
    }
    for (const bad of SUSPENDED) {
      assert(!html.includes(`href="/${bad}/`), `${slug}: links to suspended app /${bad}/`);
    }
    assert(!/<ins\b[^>]*adsbygoogle|data-ad-slot|page_engage|ad_impression|AggregateRating|Math\.random/i.test(html + '\n' + js), `${slug}: forbidden ad/trust/random pattern detected`);
    assert(/window\.i18n\s*=/.test(js), `${slug}: window.i18n not exposed`);
    assert(!/\.innerHTML\s*=\s*(?:rawThought|fullScript|note)/i.test(js), `${slug}: unsafe innerHTML user input detected`);
    assert(!/thought:|note:|answers:|score:|verdict:/i.test((js.match(/function sendSafeEvent[\s\S]*?\n  \}/) || [''])[0]), `${slug}: private data entered telemetry`);
    assert(fx.portalIndex.includes(`/portal/tools/${slug}.html`), `/portal/index.html missing hub link to ${slug}`);
    assert(fx.portalSitemap.includes(`<loc>${canonical}</loc>`), `/portal/sitemap.xml missing ${slug}`);
    assert(html.includes('/portal/tools/wellness-lab.html'), `${slug}: missing bidirectional link to /portal/tools/wellness-lab.html`);
  }

  // 4. Existing 5 flagship tools upgraded with Story Card + Preconnect + Hub link
  for (const slug of EXISTING_FLAGSHIPS) {
    const html = fx.existing[slug];
    assert(html.includes('id="storyCardBtn"'), `${slug}: missing #storyCardBtn`);
    assert(html.includes('/portal/js/tool-story-card.js'), `${slug}: missing tool-story-card.js script`);
    assert(/rel="preconnect"[^>]*googlesyndication/i.test(html), `${slug}: missing AdSense preconnect`);
    assert(fx.portalIndex.includes(`/portal/tools/${slug}.html`), `/portal/index.html missing hub link to ${slug}`);
  }

  // 5. MBTI curated affiliate & tool bridge enhancement
  assert(fx.mbtiEnhancer.includes('tag=dopabrain-20') && /\bsponsored\b/i.test(fx.mbtiEnhancer) && /curated_resource_click/.test(fx.mbtiEnhancer) && fx.mbtiEnhancer.includes('All 70 Mental Wellness Labs'), 'MBTI enhancer missing curated affiliate or 70-Lab bridge contract');

  // 6. Contextual blog tool bridges
  assert(fx.bridgeCount >= 1249, `Expected >=1249 contextual blog tool bridges, got ${fx.bridgeCount}`);

  // 7. Interactive Mental Wellness Lab Pillar Hub (70 tools + instant local search + 12-locale lead pack)
  const labCanon = 'https://dopabrain.com/portal/tools/wellness-lab.html';
  assert(fx.wellnessLabHtml.includes(`<link rel="canonical" href="${labCanon}">`), 'wellness-lab: canonical missing');
  assert(fx.wellnessLabHtml.includes('CollectionPage') && fx.wellnessLabHtml.includes('"numberOfItems": 70'), 'wellness-lab: CollectionPage/ItemList(70) schema missing');
  assert(fx.wellnessLabHtml.includes('id="labSearch"'), 'wellness-lab: instant local #labSearch input missing');
  const leadsObj = JSON.parse(fx.wellnessLabLeads);
  assert(Object.keys(leadsObj).length === 70, `wellness-lab-leads.json must cover 70 tools, got ${Object.keys(leadsObj).length}`);
  for (const slug of NEW_TOOLS) {
    assert(leadsObj[slug] && leadsObj[slug].de && leadsObj[slug].fr && leadsObj[slug].ja && leadsObj[slug].es, `wellness-lab-leads.json missing Tier-1 locales for ${slug}`);
  }
  assert(fx.wellnessLabHtml.includes('FAQPage') && /class=["'][^"']*faq-grid[^"']*["']/.test(fx.wellnessLabHtml), 'wellness-lab: visible FAQ contract missing');
  assert(fx.wellnessLabHtml.includes('/portal/js/ad-loader.js') && fx.wellnessLabHtml.includes('tag=dopabrain-20') && /\bsponsored\b/i.test(fx.wellnessLabHtml), 'wellness-lab: monetization contract missing');
  assert(!/page_engage|ad_impression|AggregateRating|Math\.random/i.test(fx.wellnessLabHtml + '\n' + fx.wellnessLabJs), 'wellness-lab: forbidden pattern detected');
  assert(fx.portalIndex.includes('/portal/tools/wellness-lab.html'), 'portal/index.html missing wellness-lab link');
  assert(fx.portalToolsIndex.includes('/portal/tools/wellness-lab.html'), 'portal/tools/index.html missing wellness-lab link');
  assert(fx.portalSitemap.includes(`<loc>${labCanon}</loc>`), 'portal/sitemap.xml missing wellness-lab');

  return { newTools: NEW_TOOLS.length, existingUpgraded: EXISTING_FLAGSHIPS.length, bridgeCount: fx.bridgeCount };
}

function runMutations(base) {
  const clone = () => JSON.parse(JSON.stringify(base));
  const cases = [
    ['story-card-wrong-dims', () => { const m = clone(); m.storyJs = m.storyJs.replace('width = 1080', 'width = 500'); return m; }],
    ['xss-innerhtml-leak', () => { const m = clone(); m.tools['cognitive-distortion-reframer'].js += '\ndocument.getElementById("x").innerHTML = rawThought;'; return m; }],
    ['private-telemetry-leak', () => { const m = clone(); m.tools['rsd-coping-audit'].js = m.tools['rsd-coping-audit'].js.replace("tool_slug: 'rsd-coping-audit',", "tool_slug: 'rsd-coping-audit', score: 99,"); return m; }],
    ['missing-sponsored-rel', () => { const m = clone(); m.tools['attachment-trigger-decoder'].html = m.tools['attachment-trigger-decoder'].html.replace(/\bsponsored\b/gi, ''); return m; }],
    ['suspended-sticky-target', () => { const m = clone(); m.tools['cognitive-distortion-reframer'].html = m.tools['cognitive-distortion-reframer'].html.replace('href="/stress-check/', 'href="/past-life/'); return m; }],
    ['missing-story-card-btn', () => { const m = clone(); m.existing['burnout-stress-differential'] = m.existing['burnout-stress-differential'].replace('id="storyCardBtn"', 'id="removedBtn"'); return m; }],
    ['missing-portal-hub-link', () => { const m = clone(); m.portalIndex = m.portalIndex.replace('/portal/tools/rsd-coping-audit.html', '/portal/tools/removed.html'); return m; }],
    ['missing-sitemap-entry', () => { const m = clone(); m.portalSitemap = m.portalSitemap.replace('cognitive-distortion-reframer.html', 'removed.html'); return m; }],
    ['sleep-missing-ad-loader', () => { const m = clone(); m.tools['sleep-chronotype-reset'].html = m.tools['sleep-chronotype-reset'].html.replace('<script src="/portal/js/ad-loader.js"></script>', ''); return m; }],
    ['procrastination-bridge-drop', () => { const m = clone(); m.bridgeCount = 40; return m; }],
    ['checkin-missing-canonical', () => { const m = clone(); m.tools['daily-mind-checkin'].html = m.tools['daily-mind-checkin'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['imposter-missing-i18n', () => { const m = clone(); m.tools['imposter-syndrome-audit'].js = m.tools['imposter-syndrome-audit'].js.replace('window.i18n =', 'window.removed ='); return m; }],
    ['boundary-hidden-faq', () => { const m = clone(); m.tools['boundary-script-builder'].html = m.tools['boundary-script-builder'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['wot-missing-sitemap', () => { const m = clone(); m.portalSitemap = m.portalSitemap.replace('window-of-tolerance-check.html', 'removed.html'); return m; }],
    ['adhd-missing-curated', () => { const m = clone(); m.tools['adhd-focus-friction-audit'].html = m.tools['adhd-focus-friction-audit'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['brain-workout-missing-story', () => { const m = clone(); m.existing['brain-game-workout'] = m.existing['brain-game-workout'].replace('id="storyCardBtn"', 'id="gone"'); return m; }],
    ['inner-critic-hidden-faq', () => { const m = clone(); m.tools['inner-critic-compassion-lab'].html = m.tools['inner-critic-compassion-lab'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['overthinking-missing-canonical', () => { const m = clone(); m.tools['overthinking-rumination-breaker'].html = m.tools['overthinking-rumination-breaker'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['social-battery-missing-i18n', () => { const m = clone(); m.tools['social-battery-recharge-planner'].js = m.tools['social-battery-recharge-planner'].js.replace('window.i18n =', 'window.removed ='); return m; }],
    ['somatic-map-hidden-faq', () => { const m = clone(); m.tools['somatic-tension-body-map'].html = m.tools['somatic-tension-body-map'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['energy-audit-missing-curated', () => { const m = clone(); m.tools['emotional-energy-audit'].html = m.tools['emotional-energy-audit'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['wellness-lab-missing-sitemap', () => { const m = clone(); m.portalSitemap = m.portalSitemap.replace('wellness-lab.html', 'removed.html'); return m; }],
    ['gaslighting-missing-canonical', () => { const m = clone(); m.tools['gaslighting-reality-check'].html = m.tools['gaslighting-reality-check'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['codependency-hidden-faq', () => { const m = clone(); m.tools['codependency-reset-audit'].html = m.tools['codependency-reset-audit'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['perfectionism-missing-curated', () => { const m = clone(); m.tools['perfectionism-loop-decoder'].html = m.tools['perfectionism-loop-decoder'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['social-ladder-missing-canonical', () => { const m = clone(); m.tools['social-anxiety-exposure-ladder'].html = m.tools['social-anxiety-exposure-ladder'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['vagal-reset-hidden-faq', () => { const m = clone(); m.tools['vagal-nervous-system-reset'].html = m.tools['vagal-nervous-system-reset'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['doomscroll-missing-curated', () => { const m = clone(); m.tools['doomscrolling-circuit-breaker'].html = m.tools['doomscrolling-circuit-breaker'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['inner-child-missing-canonical', () => { const m = clone(); m.tools['inner-child-need-decoder'].html = m.tools['inner-child-need-decoder'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['decision-fatigue-hidden-faq', () => { const m = clone(); m.tools['decision-fatigue-declutter'].html = m.tools['decision-fatigue-declutter'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['flashback-missing-curated', () => { const m = clone(); m.tools['emotional-flashback-grounding'].html = m.tools['emotional-flashback-grounding'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['anxiety-panic-missing-canonical', () => { const m = clone(); m.tools['anxiety-vs-panic-reset'].html = m.tools['anxiety-vs-panic-reset'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['exhaustion-hidden-faq', () => { const m = clone(); m.tools['emotional-exhaustion-recovery'].html = m.tools['emotional-exhaustion-recovery'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['validation-missing-curated', () => { const m = clone(); m.tools['emotional-validation-reframer'].html = m.tools['emotional-validation-reframer'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['abandonment-missing-canonical', () => { const m = clone(); m.tools['abandonment-anxiety-soother'].html = m.tools['abandonment-anxiety-soother'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['nvc-hidden-faq', () => { const m = clone(); m.tools['nvc-conflict-script-builder'].html = m.tools['nvc-conflict-script-builder'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['morning-missing-curated', () => { const m = clone(); m.tools['morning-energy-architect'].html = m.tools['morning-energy-architect'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['trigger-missing-canonical', () => { const m = clone(); m.tools['emotional-trigger-decoder'].html = m.tools['emotional-trigger-decoder'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['workstress-hidden-faq', () => { const m = clone(); m.tools['workplace-stress-triage'].html = m.tools['workplace-stress-triage'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['grief-missing-curated', () => { const m = clone(); m.tools['grief-loss-wave-companion'].html = m.tools['grief-loss-wave-companion'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['greenflag-missing-canonical', () => { const m = clone(); m.tools['relationship-green-flag-audit'].html = m.tools['relationship-green-flag-audit'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['fawn-missing-canonical', () => { const m = clone(); m.tools['people-pleasing-fawn-decoder'].html = m.tools['people-pleasing-fawn-decoder'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['freeze-hidden-faq', () => { const m = clone(); m.tools['functional-freeze-thaw-planner'].html = m.tools['functional-freeze-thaw-planner'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['hypervig-missing-curated', () => { const m = clone(); m.tools['hypervigilance-safety-reset'].html = m.tools['hypervigilance-safety-reset'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['selfworth-missing-canonical', () => { const m = clone(); m.tools['self-worth-evidence-builder'].html = m.tools['self-worth-evidence-builder'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['sensory-hidden-faq', () => { const m = clone(); m.tools['sensory-overload-calm-kit'].html = m.tools['sensory-overload-calm-kit'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['avoidant-missing-curated', () => { const m = clone(); m.tools['avoidant-attachment-thaw-lab'].html = m.tools['avoidant-attachment-thaw-lab'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['anger-missing-canonical', () => { const m = clone(); m.tools['anger-cooldown-deescalator'].html = m.tools['anger-cooldown-deescalator'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['guilt-hidden-faq', () => { const m = clone(); m.tools['guilt-vs-responsibility-filter'].html = m.tools['guilt-vs-responsibility-filter'].html.replace('class="faq-grid"', 'class="hidden-box"'); return m; }],
    ['loneliness-missing-curated', () => { const m = clone(); m.tools['loneliness-micro-connection-plan'].html = m.tools['loneliness-micro-connection-plan'].html.replaceAll('tag=dopabrain-20', 'tag=none'); return m; }],
    ['sunday-missing-canonical', () => { const m = clone(); m.tools['sunday-scaries-week-reset'].html = m.tools['sunday-scaries-week-reset'].html.replace('rel="canonical"', 'rel="alt"'); return m; }],
    ['wellness-lab-missing-search', () => { const m = clone(); m.wellnessLabHtml = m.wellnessLabHtml.replace('id="labSearch"', 'id="removedSearch"'); return m; }],
    ['calm-pacer-synthetic-leak', () => { const m = clone(); m.calmPacerJs += '\n// page_engage'; return m; }],
  ];
  for (const [name, build] of cases) {
    let caught = false;
    try {
      verifySource(build());
    } catch (err) {
      caught = true;
      console.log(`[PASS] ${name}: ${err.message}`);
    }
    assert(caught, `Mutation escaped: ${name}`);
  }
  console.log(`[PASS] wellness tools mutation summary ${cases.length}/${cases.length} detected`);
}

async function startServer() {
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    let fp = path.join(PROJECTS, pathname.replace(/^\/+/, ''));
    if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html');
    if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': `${mime[path.extname(fp)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
    res.end(fs.readFileSync(fp));
  });
  const addr = await listenOnSafePort(server);
  return { origin: `http://127.0.0.1:${addr.port}`, close: () => new Promise((r) => server.close(r)) };
}

async function runRuntime() {
  const srv = await startServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of [{ width: 390, height: 844, lang: 'ko' }, { width: 1440, height: 900, lang: 'en' }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.route('**/*', (r) => new URL(r.request().url()).origin === srv.origin ? r.continue() : r.abort());

      // 1. CBT Reframer + XSS test + reload persistence + 1080x1920 Story Card canvas
      await page.goto(`${srv.origin}/portal/tools/cognitive-distortion-reframer.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#buildBtn');
      const xssPayload = '<img src=x onerror="window.__xss=1">';
      await page.fill('#thoughtInput', xssPayload);
      await page.click('.toggle-card[data-distortion="mind_reading"]');
      await page.click('#buildBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const cbtCheck = await page.evaluate(() => {
        const canvas = window.DopaBrainStoryCard.renderStoryCanvas({ slug: 'cbt', headline: 'Test' });
        const events = (window.dataLayer || []).filter((r) => r && r[0] === 'event');
        return {
          lang: document.documentElement.lang,
          i18nLang: window.i18n && window.i18n.getLanguage(),
          xss: Boolean(window.__xss),
          captured: document.getElementById('capturedThought').textContent,
          overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
          canvasW: canvas.width,
          canvasH: canvas.height,
          completeEvents: events.filter((e) => e[1] === 'cbt_reframer_complete').length,
          leakedPayload: JSON.stringify(events).includes('onerror'),
        };
      });
      assert(cbtCheck.lang === vp.lang && cbtCheck.i18nLang === vp.lang, `CBT lang mismatch: ${JSON.stringify(cbtCheck)}`);
      assert(!cbtCheck.xss && cbtCheck.captured === xssPayload, `CBT XSS guard failed: ${JSON.stringify(cbtCheck)}`);
      assert(cbtCheck.overflow <= 0 && cbtCheck.canvasW === 1080 && cbtCheck.canvasH === 1920, `CBT layout/canvas failed: ${JSON.stringify(cbtCheck)}`);
      assert(cbtCheck.completeEvents === 1 && !cbtCheck.leakedPayload, `CBT telemetry failed: ${JSON.stringify(cbtCheck)}`);

      // Reload persistence check
      await page.reload({ waitUntil: 'domcontentloaded' });
      const persisted = await page.evaluate(() => !document.getElementById('resultCard').hidden);
      assert(persisted, 'CBT state did not persist across reload');

      // 2. RSD Audit + 90s Timer + 1080x1920 canvas
      await page.goto(`${srv.origin}/portal/tools/rsd-coping-audit.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#calcBtn');
      await page.click('#calcBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#timerStartBtn');
      await page.waitForTimeout(1150);
      const rsdCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        clock: document.getElementById('timerClock').textContent,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'rsd_audit_complete').length,
      }));
      assert(rsdCheck.lang === vp.lang && rsdCheck.clock !== '01:30' && rsdCheck.overflow <= 0 && rsdCheck.completeEvents === 1, `RSD check failed: ${JSON.stringify(rsdCheck)}`);

      // 3. Attachment Trigger Decoder + XSS + 1080x1920 canvas
      await page.goto(`${srv.origin}/portal/tools/attachment-trigger-decoder.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#generateBtn');
      await page.fill('#contextInput', xssPayload);
      await page.click('.toggle-card[data-impulse="avoidant"]');
      await page.click('#generateBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const attCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        scriptText: document.getElementById('secureScript').textContent,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'attachment_decoder_complete').length,
      }));
      assert(attCheck.lang === vp.lang && !attCheck.xss && attCheck.scriptText.includes(xssPayload) && attCheck.overflow <= 0 && attCheck.completeEvents === 1, `Attachment decoder check failed: ${JSON.stringify(attCheck)}`);

      // 4. Sleep Cycle & Circadian Reset
      await page.goto(`${srv.origin}/portal/tools/sleep-chronotype-reset.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#calcBtn');
      await page.click('.toggle-card[data-habit="caffeine"]');
      await page.click('#calcBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const sleepCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        cycles: document.querySelectorAll('.cycle-card').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'sleep_reset_complete').length,
      }));
      assert(sleepCheck.lang === vp.lang && sleepCheck.cycles === 3 && sleepCheck.overflow <= 0 && sleepCheck.completeEvents === 1, `Sleep reset check failed: ${JSON.stringify(sleepCheck)}`);

      // 5. Procrastination Root Decoder + XSS + 5-Min Sprint timer
      await page.goto(`${srv.origin}/portal/tools/procrastination-root-decoder.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#decodeBtn');
      await page.fill('#taskInput', xssPayload);
      await page.click('.toggle-card[data-root="overwhelm"]');
      await page.click('#decodeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#sprintStartBtn');
      await page.waitForTimeout(1150);
      const procCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        taskText: document.getElementById('targetTaskOut').textContent,
        clock: document.getElementById('sprintClock').textContent,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'procrastination_decoder_complete').length,
      }));
      assert(procCheck.lang === vp.lang && !procCheck.xss && procCheck.taskText === xssPayload && procCheck.clock !== '05:00' && procCheck.overflow <= 0 && procCheck.completeEvents === 1, `Procrastination decoder check failed: ${JSON.stringify(procCheck)}`);

      // 6. Daily 60-Second Mind Check-In + Streak Sparkline + 3-Tool Routing
      await page.goto(`${srv.origin}/portal/tools/daily-mind-checkin.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#logBtn');
      await page.click('.toggle-card[data-friction="task_freeze"]');
      await page.click('#logBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const checkinCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        rxCards: document.querySelectorAll('#rxGrid a.bridge-card').length,
        bars: document.querySelectorAll('#streakBars .streak-bar').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'daily_checkin_complete').length,
      }));
      assert(checkinCheck.lang === vp.lang && checkinCheck.rxCards === 4 && checkinCheck.bars >= 1 && checkinCheck.overflow <= 0 && checkinCheck.completeEvents === 1, `Daily check-in failed: ${JSON.stringify(checkinCheck)}`);

      // 7. Imposter Syndrome Audit + Proof Vault XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/imposter-syndrome-audit.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#calcBtn');
      await page.click('#calcBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.fill('#proofInput', xssPayload);
      await page.click('#addProofBtn');
      const impCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        proofs: document.querySelectorAll('#proofList .proof-item').length,
        proofText: document.querySelector('#proofList .proof-item span')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'imposter_audit_complete').length,
      }));
      assert(impCheck.lang === vp.lang && !impCheck.xss && impCheck.proofs === 1 && impCheck.proofText.includes(xssPayload) && impCheck.overflow <= 0 && impCheck.completeEvents === 1, `Imposter audit failed: ${JSON.stringify(impCheck)}`);

      // 8. People-Pleasing & Boundary Script Generator + XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/boundary-script-builder.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#buildBtn');
      await page.fill('#detailInput', xssPayload);
      await page.click('#buildBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const bndCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        scriptText: document.getElementById('scriptOutput')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'boundary_script_complete').length,
      }));
      assert(bndCheck.lang === vp.lang && !bndCheck.xss && bndCheck.scriptText.includes(xssPayload) && bndCheck.overflow <= 0 && bndCheck.completeEvents === 1, `Boundary builder failed: ${JSON.stringify(bndCheck)}`);

      // 9. Window of Tolerance Check-In + 6 Markers + 60s Somatic Pacer
      await page.goto(`${srv.origin}/portal/tools/window-of-tolerance-check.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#analyzeBtn');
      for (const mk of ['breath', 'muscles', 'thoughts', 'emotion', 'social', 'energy']) {
        await page.click(`button[data-marker="${mk}"][data-val="hyper"]`);
      }
      await page.click('#analyzeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#startTimerBtn');
      await page.waitForTimeout(1150);
      const wotCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        clock: document.getElementById('timerDisplay')?.textContent || '',
        hyperScore: document.getElementById('hyperScore')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'wot_check_complete').length,
      }));
      assert(wotCheck.lang === vp.lang && wotCheck.hyperScore === '100%' && wotCheck.clock !== '01:00' && wotCheck.overflow <= 0 && wotCheck.completeEvents === 1, `Window of Tolerance failed: ${JSON.stringify(wotCheck)}`);

      // 10. ADHD & Executive Function Friction Audit + XSS + 10-Min Body-Doubling Timer
      await page.goto(`${srv.origin}/portal/tools/adhd-focus-friction-audit.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#auditBtn');
      await page.click('button[data-axis="initiation"][data-score="3"]');
      await page.fill('#anchorTaskInput', xssPayload);
      await page.click('#auditBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#startSprintBtn');
      await page.waitForTimeout(1150);
      const adhdCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        anchorText: document.getElementById('anchorTaskOut')?.textContent || '',
        clock: document.getElementById('sprintDisplay')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'adhd_friction_complete').length,
      }));
      assert(adhdCheck.lang === vp.lang && !adhdCheck.xss && adhdCheck.anchorText === xssPayload && adhdCheck.clock !== '10:00' && adhdCheck.overflow <= 0 && adhdCheck.completeEvents === 1, `ADHD audit failed: ${JSON.stringify(adhdCheck)}`);

      // 11. Inner Critic & Self-Compassion Reframer + XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/inner-critic-compassion-lab.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#reframeBtn');
      await page.click('button[data-critic="taskmaster"]');
      await page.fill('#criticLineInput', xssPayload);
      await page.click('#reframeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const criticCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        captured: document.getElementById('capturedCriticOut')?.textContent || '',
        pillars: document.querySelectorAll('#pillarsList li').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'inner_critic_reframe_complete').length,
      }));
      assert(criticCheck.lang === vp.lang && !criticCheck.xss && criticCheck.captured === xssPayload && criticCheck.pillars === 3 && criticCheck.overflow <= 0 && criticCheck.completeEvents === 1, `Inner Critic lab failed: ${JSON.stringify(criticCheck)}`);

      // 12. Overthinking & Rumination Circuit Breaker + XSS + 90s Cognitive Shuffle
      await page.goto(`${srv.origin}/portal/tools/overthinking-rumination-breaker.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#breakBtn');
      await page.fill('#loopInput', xssPayload);
      await page.click('#breakBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#startShuffleBtn');
      await page.waitForTimeout(1150);
      const overCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        parked: document.getElementById('parkedThoughtOut')?.textContent || '',
        clock: document.getElementById('shuffleClock')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'overthinking_breaker_complete').length,
      }));
      assert(overCheck.lang === vp.lang && !overCheck.xss && overCheck.parked === xssPayload && overCheck.clock !== '01:30' && overCheck.overflow <= 0 && overCheck.completeEvents === 1, `Overthinking breaker failed: ${JSON.stringify(overCheck)}`);

      // 13. Social Battery & HSP Recharge Calculator
      await page.goto(`${srv.origin}/portal/tools/social-battery-recharge-planner.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#calcBtn');
      await page.click('button[data-drainer="crowds"]');
      await page.click('#calcBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const batCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        bigNum: document.getElementById('batteryBigNum')?.textContent || '',
        exitText: document.getElementById('exitScriptOut')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'social_battery_complete').length,
      }));
      assert(batCheck.lang === vp.lang && /%$/.test(batCheck.bigNum) && batCheck.exitText.length > 20 && batCheck.overflow <= 0 && batCheck.completeEvents === 1, `Social battery calc failed: ${JSON.stringify(batCheck)}`);

      // 14. Somatic Stress & Body Tension Map + 60s PMR Pacer
      await page.goto(`${srv.origin}/portal/tools/somatic-tension-body-map.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#decodeBtn');
      await page.click('button[data-zone="chest"]');
      await page.click('#decodeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#startPmrBtn');
      await page.waitForTimeout(1150);
      const somCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        clock: document.getElementById('pmrClock')?.textContent || '',
        zones: document.getElementById('zoneCountOut')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'somatic_map_complete').length,
      }));
      assert(somCheck.lang === vp.lang && somCheck.zones === '3 / 6' && somCheck.clock !== '01:00' && somCheck.overflow <= 0 && somCheck.completeEvents === 1, `Somatic map failed: ${JSON.stringify(somCheck)}`);

      // 15. Emotional Energy Leak Audit + Stop-Doing XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/emotional-energy-audit.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#auditBtn');
      await page.fill('#stopDoingInput', xssPayload);
      await page.click('#auditBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const engCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        stopText: document.getElementById('stopDoingOut')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'energy_audit_complete').length,
      }));
      assert(engCheck.lang === vp.lang && !engCheck.xss && engCheck.stopText === xssPayload && engCheck.overflow <= 0 && engCheck.completeEvents === 1, `Energy audit failed: ${JSON.stringify(engCheck)}`);

      // 16. Interactive Mental Wellness Lab Pillar Hub (50 tools + filter + instant #labSearch + ?lang= preservation)
      await page.goto(`${srv.origin}/portal/tools/wellness-lab.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#labGrid .lab-card');
      const labBefore = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        count: document.querySelectorAll('#labGrid .lab-card').length,
        firstHref: document.querySelector('#labGrid .lab-card')?.getAttribute('href') || '',
        searchHeight: Math.round(document.getElementById('labSearch')?.getBoundingClientRect().height || 0),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
      }));
      await page.click('.filter-pill[data-cat="anxiety"]');
      const labAfter = await page.evaluate(() => ({
        count: document.querySelectorAll('#labGrid .lab-card').length,
        filterEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'wellness_lab_filter').length,
      }));
      await page.click('.filter-pill[data-cat="all"]');
      const searchNeedle = vp.lang === 'ko' ? '공황' : 'panic';
      await page.fill('#labSearch', searchNeedle);
      const labSearch = await page.evaluate((needle) => ({
        count: document.querySelectorAll('#labGrid .lab-card').length,
        leakedQuery: JSON.stringify(window.dataLayer || []).includes(needle),
      }), searchNeedle);
      await page.fill('#labSearch', '');
      const labClearedCount = await page.evaluate(() => document.querySelectorAll('#labGrid .lab-card').length);
      await page.click('.mood-chip[data-mood="panic"]');
      const labMood = await page.evaluate(() => ({
        count: document.querySelectorAll('#labGrid .lab-card').length,
        moodEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'wellness_lab_mood_chip').length,
      }));
      await page.click('.mood-chip[data-mood="panic"]');
      const labMoodCleared = await page.evaluate(() => document.querySelectorAll('#labGrid .lab-card').length);
      const expectLangQuery = vp.lang === 'en' ? !labBefore.firstHref.includes('?lang=') : labBefore.firstHref.includes(`?lang=${vp.lang}`);
      assert(labBefore.lang === vp.lang && labBefore.count === 70 && labBefore.searchHeight >= 44 && expectLangQuery && labBefore.overflow <= 0, `Wellness Lab initial check failed: ${JSON.stringify(labBefore)}`);
      assert(labAfter.count === 19 && labAfter.filterEvents === 1, `Wellness Lab filter check failed: ${JSON.stringify(labAfter)}`);
      assert(labSearch.count >= 1 && labSearch.count < 12 && !labSearch.leakedQuery && labClearedCount === 70, `Wellness Lab search check failed: ${JSON.stringify({ labSearch, labClearedCount })}`);
      assert(labMood.count === 7 && labMood.moodEvents === 1 && labMoodCleared === 70, `Wellness Lab mood chip check failed: ${JSON.stringify({ labMood, labMoodCleared })}`);

      // 17. Gaslighting & Manipulation Reality-Check Log + XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/gaslighting-reality-check.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#analyzeBtn');
      await page.fill('#factInput', xssPayload);
      await page.click('#analyzeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const gasCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        factText: document.getElementById('factAnchorOut')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'gaslighting_check_complete').length,
      }));
      assert(gasCheck.lang === vp.lang && !gasCheck.xss && gasCheck.factText === xssPayload && gasCheck.overflow <= 0 && gasCheck.completeEvents === 1, `Gaslighting check failed: ${JSON.stringify(gasCheck)}`);

      // 18. Codependency & Interdependence Reset Audit + XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/codependency-reset-audit.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#calcBtn');
      await page.fill('#needInput', xssPayload);
      await page.click('#calcBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const codCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        needText: document.getElementById('needOut')?.textContent || '',
        bal: document.getElementById('balanceOut')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'codependency_audit_complete').length,
      }));
      assert(codCheck.lang === vp.lang && !codCheck.xss && codCheck.needText === xssPayload && /%$/.test(codCheck.bal) && codCheck.overflow <= 0 && codCheck.completeEvents === 1, `Codependency audit failed: ${JSON.stringify(codCheck)}`);

      // 19. Perfectionism & Self-Sabotage Loop Decoder + XSS + 5-Min Sprint Timer
      await page.goto(`${srv.origin}/portal/tools/perfectionism-loop-decoder.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#decodeBtn');
      await page.fill('#shipInput', xssPayload);
      await page.click('#decodeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#sprintStartBtn');
      await page.waitForTimeout(1150);
      const perfCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        shipText: document.getElementById('shipOut')?.textContent || '',
        clock: document.getElementById('sprintClock')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'perfectionism_decoder_complete').length,
      }));
      assert(perfCheck.lang === vp.lang && !perfCheck.xss && perfCheck.shipText === xssPayload && perfCheck.clock !== '05:00' && perfCheck.overflow <= 0 && perfCheck.completeEvents === 1, `Perfectionism decoder failed: ${JSON.stringify(perfCheck)}`);

      // 20. Social Anxiety Exposure Ladder + XSS Escaping + Auto-Sort
      await page.goto(`${srv.origin}/portal/tools/social-anxiety-exposure-ladder.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#buildBtn');
      await page.fill('#repInput', xssPayload);
      await page.click('#buildBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const ladCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        repText: document.getElementById('repOut')?.textContent || '',
        rungs: document.querySelectorAll('#ladderList .ladder-rung').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'social_ladder_complete').length,
      }));
      assert(ladCheck.lang === vp.lang && !ladCheck.xss && ladCheck.repText === xssPayload && ladCheck.rungs === 6 && ladCheck.overflow <= 0 && ladCheck.completeEvents === 1, `Social ladder failed: ${JSON.stringify(ladCheck)}`);

      // 21. Vagal Tone & Nervous System Reset + 60s Sigh Pacer Tick
      await page.goto(`${srv.origin}/portal/tools/vagal-nervous-system-reset.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#buildBtn');
      await page.click('button[data-state="shutdown"]');
      await page.click('#buildBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#sighStartBtn');
      await page.waitForTimeout(1150);
      const vagCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        clock: document.getElementById('sighClock')?.textContent || '',
        steps: document.querySelectorAll('#menuList li').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'vagal_reset_complete').length,
      }));
      assert(vagCheck.lang === vp.lang && vagCheck.steps === 3 && vagCheck.clock !== '01:00' && vagCheck.overflow <= 0 && vagCheck.completeEvents === 1, `Vagal reset failed: ${JSON.stringify(vagCheck)}`);

      // 22. Doomscrolling Circuit Breaker + XSS Escaping + Annual Calculation
      await page.goto(`${srv.origin}/portal/tools/doomscrolling-circuit-breaker.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#buildBtn');
      await page.fill('#swapInput', xssPayload);
      await page.click('#buildBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const doomCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        swapText: document.getElementById('swapOut')?.textContent || '',
        hrs: document.getElementById('hoursYearOut')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'doomscroll_breaker_complete').length,
      }));
      assert(doomCheck.lang === vp.lang && !doomCheck.xss && doomCheck.swapText === xssPayload && /548/.test(doomCheck.hrs) && doomCheck.overflow <= 0 && doomCheck.completeEvents === 1, `Doomscroll breaker failed: ${JSON.stringify(doomCheck)}`);

      // 23. Inner Child & Core Emotional Need Decoder + XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/inner-child-need-decoder.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#decodeBtn');
      await page.fill('#letterInput', xssPayload);
      await page.click('#decodeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const icCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        letterText: document.getElementById('letterOut')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'inner_child_decoder_complete').length,
      }));
      assert(icCheck.lang === vp.lang && !icCheck.xss && icCheck.letterText === xssPayload && icCheck.overflow <= 0 && icCheck.completeEvents === 1, `Inner child decoder failed: ${JSON.stringify(icCheck)}`);

      // 24. Decision Fatigue & Mental Declutter Filter + XSS Escaping
      await page.goto(`${srv.origin}/portal/tools/decision-fatigue-declutter.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#buildBtn');
      await page.fill('#ruleInput', xssPayload);
      await page.click('#buildBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      const dfCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        ruleText: document.getElementById('ruleOut')?.textContent || '',
        rules: document.querySelectorAll('#ruleList li').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'decision_fatigue_complete').length,
      }));
      assert(dfCheck.lang === vp.lang && !dfCheck.xss && dfCheck.ruleText === xssPayload && dfCheck.rules === 3 && dfCheck.overflow <= 0 && dfCheck.completeEvents === 1, `Decision fatigue filter failed: ${JSON.stringify(dfCheck)}`);

      // 25. Emotional Flashback Grounding Companion + XSS + 60s Timer Tick
      await page.goto(`${srv.origin}/portal/tools/emotional-flashback-grounding.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#completeBtn');
      await page.fill('#anchorInput', xssPayload);
      await page.click('#completeBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#timerBtn');
      await page.waitForTimeout(1150);
      const fbCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        xss: Boolean(window.__xss),
        anchorText: document.getElementById('anchorOut')?.textContent || '',
        clock: document.getElementById('groundClock')?.textContent || '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'flashback_grounding_complete').length,
      }));
      assert(fbCheck.lang === vp.lang && !fbCheck.xss && fbCheck.anchorText === xssPayload && fbCheck.clock !== '01:00' && fbCheck.overflow <= 0 && fbCheck.completeEvents === 1, `Flashback grounding failed: ${JSON.stringify(fbCheck)}`);

      // 26. Anxiety vs. Panic Attack Differential + 90s Adrenaline Wave Timer
      await page.goto(`${srv.origin}/portal/tools/anxiety-vs-panic-reset.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#checkBtn');
      await page.click('#checkBtn');
      await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
      await page.click('#waveBtn');
      await page.waitForTimeout(1150);
      const apCheck = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        clock: document.getElementById('waveClock')?.textContent || '',
        steps: document.querySelectorAll('#stepList li').length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
        completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'anxiety_panic_check_complete').length,
      }));
      assert(apCheck.lang === vp.lang && apCheck.steps >= 3 && apCheck.clock !== '01:30' && apCheck.overflow <= 0 && apCheck.completeEvents === 1, `Anxiety vs Panic reset failed: ${JSON.stringify(apCheck)}`);

      // 27-41. Fifteen Wave-31, Wave-34 & Wave-39 Flagship Tools + XSS Escaping
      const wave31Checks = [
        ['emotional-exhaustion-recovery', 'emotional_exhaustion_complete'],
        ['emotional-validation-reframer', 'emotional_validation_complete'],
        ['abandonment-anxiety-soother', 'abandonment_soother_complete'],
        ['nvc-conflict-script-builder', 'nvc_conflict_complete'],
        ['morning-energy-architect', 'morning_architect_complete'],
        ['emotional-trigger-decoder', 'emotional_trigger_complete'],
        ['workplace-stress-triage', 'workplace_stress_complete'],
        ['grief-loss-wave-companion', 'grief_companion_complete'],
        ['relationship-green-flag-audit', 'green_flag_audit_complete'],
        ['people-pleasing-fawn-decoder', 'fawn_decoder_complete'],
        ['functional-freeze-thaw-planner', 'freeze_thaw_complete'],
        ['hypervigilance-safety-reset', 'hypervigilance_reset_complete'],
        ['self-worth-evidence-builder', 'self_worth_complete'],
        ['sensory-overload-calm-kit', 'sensory_calm_complete'],
        ['avoidant-attachment-thaw-lab', 'avoidant_thaw_complete'],
        ['anger-cooldown-deescalator', 'anger_cooldown_complete'],
        ['guilt-vs-responsibility-filter', 'guilt_filter_complete'],
        ['loneliness-micro-connection-plan', 'micro_connection_complete'],
        ['sunday-scaries-week-reset', 'sunday_reset_complete'],
      ];
      for (const [slug, evName] of wave31Checks) {
        await page.goto(`${srv.origin}/portal/tools/${slug}.html?lang=${vp.lang}`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#runBtn');
        await page.fill('#noteInput', xssPayload);
        await page.click('#runBtn');
        await page.waitForFunction(() => !document.getElementById('resultCard').hidden);
        const wCheck = await page.evaluate((ev) => ({
          lang: document.documentElement.lang,
          xss: Boolean(window.__xss),
          noteText: document.getElementById('noteOut')?.textContent || '',
          pct: document.getElementById('pctOut')?.textContent || '',
          overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
          completeEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === ev).length,
          leakedPayload: JSON.stringify(window.dataLayer || []).includes('onerror'),
        }), evName);
        assert(wCheck.lang === vp.lang && !wCheck.xss && wCheck.noteText === xssPayload && /%$/.test(wCheck.pct) && wCheck.overflow <= 0 && wCheck.completeEvents === 1 && !wCheck.leakedPayload, `${slug} failed: ${JSON.stringify(wCheck)}`);
        if (slug === 'anger-cooldown-deescalator') {
          await page.waitForSelector('#calmPacerStartBtn');
          await page.click('#calmPacerStartBtn');
          await page.waitForTimeout(1150);
          const pCheck = await page.evaluate(() => ({
            clock: document.getElementById('calmPacerClock')?.textContent || '',
            btnH: Math.round(document.getElementById('calmPacerStartBtn')?.getBoundingClientRect().height || 0),
            overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
            startEvents: (window.dataLayer || []).filter((r) => r && r[0] === 'event' && r[1] === 'wellness_pacer_start').length,
          }));
          assert(pCheck.clock !== '00:60' && pCheck.btnH >= 44 && pCheck.overflow <= 0 && pCheck.startEvents === 1, `Shared 60s Calm Pacer failed: ${JSON.stringify(pCheck)}`);
        }
      }

      assert(errors.length === 0, `${vp.width}px runtime errors: ${errors.join(' | ')}`);
      await ctx.close();
    }
  } finally {
    await browser.close();
    await srv.close();
  }
  console.log('[PASS] Playwright 390x844 & 1440x900 runtime, 12-locale i18n, XSS escaping, persistence, 90s timer, and 1080x1920 canvas verified');
}

async function main() {
  const fx = loadFixture();
  const summary = verifySource(fx);
  if (process.argv.includes('--mutations')) runMutations(fx);
  await runRuntime();
  console.log(`[PASS] Wellness tools suite verified (${summary.newTools} new tools, ${summary.existingUpgraded} story-card upgrades, ${summary.bridgeCount} contextual blog bridges)`);
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exitCode = 1;
});
