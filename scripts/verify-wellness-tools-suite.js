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
    sharedCss: fs.readFileSync(path.join(PORTAL, 'css', 'wellness-lab-tool.css'), 'utf8'),
    portalIndex: fs.readFileSync(path.join(PORTAL, 'index.html'), 'utf8'),
    portalSitemap: fs.readFileSync(path.join(PORTAL, 'sitemap.xml'), 'utf8'),
    mbtiEnhancer: fs.readFileSync(path.join(PORTAL, 'mbti', 'type-page-enhancer.js'), 'utf8'),
    bridgeCount,
  };
}

function verifySource(fx) {
  // 1. Shared Story Card engine
  assert(/width\s*=\s*1080/.test(fx.storyJs) && /height\s*=\s*1920/.test(fx.storyJs), 'tool-story-card.js must render 1080x1920 canvas');
  assert(/tool_story_card_download/.test(fx.storyJs), 'tool-story-card.js missing safe download event');
  assert(!/page_engage|ad_impression/i.test(fx.storyJs), 'tool-story-card.js contains forbidden synthetic telemetry');

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
  assert(fx.mbtiEnhancer.includes('tag=dopabrain-20') && /\bsponsored\b/i.test(fx.mbtiEnhancer) && /curated_resource_click/.test(fx.mbtiEnhancer), 'MBTI enhancer missing curated affiliate contract');

  // 6. Contextual blog tool bridges
  assert(fx.bridgeCount >= 1000, `Expected >=1000 contextual blog tool bridges, got ${fx.bridgeCount}`);

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
      assert(checkinCheck.lang === vp.lang && checkinCheck.rxCards === 3 && checkinCheck.bars >= 1 && checkinCheck.overflow <= 0 && checkinCheck.completeEvents === 1, `Daily check-in failed: ${JSON.stringify(checkinCheck)}`);

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
