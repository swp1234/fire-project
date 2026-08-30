#!/usr/bin/env node
const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const APP_ROOT = path.join(ROOT, "projects", "blood-type");
const PORTAL_ROOT = path.join(ROOT, "projects", "portal");
const GUIDE_PATH = path.join(PORTAL_ROOT, "blog", "es", "blood-type-personality.html");
const LANGUAGES = ["de", "en", "es", "fr", "hi", "id", "ja", "ko", "pt", "ru", "tr", "zh"];
const EVENTS = [
  "blood_type_culture_view",
  "blood_type_culture_open",
  "blood_type_culture_share",
  "blood_type_culture_restart",
  "blood_type_culture_related_click",
];
const REQUIRED_KEYS = [
  "meta.title", "meta.description", "app.eyebrow", "app.title", "app.subtitle",
  "selection.evidence_title", "selection.evidence_body", "selection.source", "selection.title", "selection.desc",
  "profiles.A.short", "profiles.A.title", "profiles.A.summary", "profiles.B.short", "profiles.B.title", "profiles.B.summary",
  "profiles.O.short", "profiles.O.title", "profiles.O.summary", "profiles.AB.short", "profiles.AB.title", "profiles.AB.summary",
  "result.label", "result.reflect_title", "result.reflect_body", "result.evidence_title", "result.evidence_body",
  "result.source_large", "result.source_small", "common.back", "share.button", "share.title", "share.text",
  "share.success", "share.copied", "share.error", "related.title", "related.reaction", "related.reaction_desc",
  "related.iq", "related.iq_desc", "related.guide", "related.guide_desc", "footer.privacy", "footer.home", "accessibility.skip",
];

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, "utf8"); }
function get(object, dotted) { return dotted.split(".").reduce((value, key) => value?.[key], object); }

function loadBundle() {
  const locales = {};
  for (const lang of LANGUAGES) locales[lang] = JSON.parse(read(path.join(APP_ROOT, "js", "locales", `${lang}.json`)));
  return {
    html: read(path.join(APP_ROOT, "index.html")),
    app: read(path.join(APP_ROOT, "js", "app.js")),
    i18n: read(path.join(APP_ROOT, "js", "i18n.js")),
    css: read(path.join(APP_ROOT, "css", "style.css")),
    readme: read(path.join(APP_ROOT, "README.md")),
    manifest: read(path.join(APP_ROOT, "manifest.json")),
    sw: read(path.join(APP_ROOT, "sw.js")),
    guide: read(GUIDE_PATH),
    locales,
  };
}

function verifySource(bundle) {
  const appPublic = `${bundle.html}\n${bundle.app}\n${bundle.readme}\n${bundle.manifest}`;
  const legacy = /(?:89,000|trusted by thousands|aggregateRating|page_engage|quiz_start|quiz_complete|result_view|blood_type_select|compatibility matrix|percentile badge|premium feature|AI deep analysis|watch.{0,20}ad)/i;
  if (legacy.test(appPublic)) fail("legacy claim, synthetic event, or fabricated feature remains");
  if (/\b(?:blood_type|selected_type|answer|score)\s*:/i.test(bundle.app)) fail("event or share code can expose the selected type/result");
  for (const event of EVENTS) {
    if (!new RegExp(`track\\(["']${event}["']`).test(bundle.app)) fail(`missing stage event: ${event}`);
  }
  const adLoaders = bundle.html.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) || [];
  if (adLoaders.length !== 1 || /data-ad-slot|adsbygoogle\s*\.\s*push/.test(bundle.html)) fail("app is not Auto Ads loader-only");
  if (!/window\.i18n\s*=\s*i18n/.test(bundle.i18n)) fail("i18n singleton is not exposed to the app");
  if (!/requestUrl\.pathname\.startsWith\(APP_ROOT\.pathname\)/.test(bundle.sw)) fail("service-worker cache is not app scoped");
  if (/clients\.openWindow|notificationclick|\/portal\//.test(bundle.sw)) fail("service worker crosses the app boundary");
  if (Object.keys(bundle.locales).sort().join(",") !== LANGUAGES.join(",")) fail("locale inventory drifted");
  for (const [lang, locale] of Object.entries(bundle.locales)) {
    const source = JSON.stringify(locale);
    if (source.includes("�") || source.includes("??")) fail(`${lang}: damaged locale text`);
    for (const key of REQUIRED_KEYS) {
      const value = get(locale, key);
      if (typeof value !== "string" || !value.trim()) fail(`${lang}: missing ${key}`);
    }
  }
  if (!/menos (?:del )?0,3\s?%/i.test(bundle.guide) || !/más de 10\.000/i.test(bundle.guide)) fail("guide lacks the large-study result boundary");
  for (const source of ["jstage.jst.go.jp", "pmc.ncbi.nlm.nih.gov"]) if (!bundle.guide.includes(source)) fail(`guide source missing: ${source}`);
  const expectedCta = "https://dopabrain.com/blood-type/?lang=es&amp;start=1&amp;surface=es_blood_type_guide_primary";
  if ((bundle.guide.match(new RegExp(expectedCta.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length !== 2) fail("guide must contain two identical measured app CTAs");
  if (!/track\('content_view'\)/.test(bundle.guide) || !/track\('content_cta_click'/.test(bundle.guide)) fail("guide stage measurement missing");
  if (/link_url|content_ad_|scroll_(?:depth|engagement)|timer_engagement|FAQPage/.test(bundle.guide)) fail("guide contains legacy or synthetic measurement/schema");
  if (!/<html lang="es">/.test(bundle.guide) || !/dateModified[^\n]+2026-08-30/.test(bundle.guide)) fail("guide language or modified date drifted");
  return { locales: LANGUAGES.length, events: EVENTS.length, appBytes: Buffer.byteLength(bundle.app), guideBytes: Buffer.byteLength(bundle.guide) };
}

function expectMutation(name, mutate) {
  const bundle = loadBundle();
  mutate(bundle);
  try { verifySource(bundle); }
  catch (error) { console.log(`[PASS] ${name}: ${error.message}`); return; }
  fail(`mutation escaped: ${name}`);
}

function runMutations() {
  const cases = [
    ["fake-social-proof", b => { b.html += "89,000 people"; }],
    ["private-selection-payload", b => { b.app += "\ngtag('event','x',{blood_type:'A'})"; }],
    ["manual-ad-slot", b => { b.html += "<div data-ad-slot='1'></div>"; }],
    ["missing-locale", b => { delete b.locales.es; }],
    ["damaged-locale", b => { b.locales.ja.app.title += "�"; }],
    ["missing-card-copy", b => { delete b.locales.ko.profiles.AB.summary; }],
    ["broad-service-worker", b => { b.sw = b.sw.replace(" || !requestUrl.pathname.startsWith(APP_ROOT.pathname)", ""); }],
    ["missing-large-study", b => { b.guide = b.guide.replace(/menos (?:del )?0,3\s?%/gi, "una cantidad pequeña"); }],
    ["raw-link-event", b => { b.guide += "\nlink_url"; }],
    ["missing-stage", b => { b.app = b.app.replace('this.track("blood_type_culture_open"', 'this.track("removed_open"'); }],
  ];
  for (const [name, mutate] of cases) expectMutation(name, mutate);
}

function contentType(file) {
  return ({ ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8", ".svg":"image/svg+xml" })[path.extname(file)] || "application/octet-stream";
}

function createServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let base;
    let relative;
    if (pathname === "/blood-type" || pathname.startsWith("/blood-type/")) {
      base = APP_ROOT; relative = pathname.replace(/^\/blood-type\/?/, "");
    } else if (pathname === "/portal" || pathname.startsWith("/portal/")) {
      base = PORTAL_ROOT; relative = pathname.replace(/^\/portal\/?/, "");
    } else { response.writeHead(404); response.end("not found"); return; }
    let file = path.resolve(base, relative || "index.html");
    if (!file.startsWith(path.resolve(base))) { response.writeHead(403); response.end("forbidden"); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) { response.writeHead(404); response.end("not found"); return; }
    response.writeHead(200, { "content-type": contentType(file), "cache-control":"no-store" });
    fs.createReadStream(file).pipe(response);
  });
}

async function verifyRuntime(live = false) {
  const server = live ? null : createServer();
  if (server) await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = live ? "https://dopabrain.com" : `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  try {
    for (const lang of LANGUAGES) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await page.route("**/googletagmanager.com/**", route => route.abort());
      await page.route("**/googlesyndication.com/**", route => route.abort());
      await page.goto(`${origin}/blood-type/?lang=${lang}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => window.bloodTypeCultureCards);
      const locale = JSON.parse(read(path.join(APP_ROOT, "js", "locales", `${lang}.json`)));
      if (await page.getAttribute("html", "lang") !== lang) fail(`${lang}: document language mismatch`);
      if ((await page.locator("#page-title").textContent()).trim() !== locale.app.title) fail(`${lang}: shell is not localized`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) fail(`${lang}: mobile horizontal overflow ${overflow}px`);
      await page.locator('[data-blood-type="AB"]').click();
      if ((await page.locator("#result-title").textContent()).trim() !== locale.profiles.AB.title) fail(`${lang}: result is not localized`);
      if (await page.locator("#result-screen").isHidden()) fail(`${lang}: result did not open`);
      await page.close();
    }

    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => { Object.defineProperty(navigator, "share", { configurable: true, value: async () => {} }); });
    await page.route("**/googletagmanager.com/**", route => route.abort());
    await page.route("**/googlesyndication.com/**", route => route.abort());
    if (live) {
      await page.goto(`${origin}/portal/blog/es/blood-type-personality.html`, { waitUntil: "domcontentloaded" });
      if (!(await page.locator('h1').textContent()).includes("tipo de sangre")) fail("live Spanish guide did not deploy");
      await Promise.all([
        page.waitForURL(/\/blood-type\/\?lang=es&start=1&surface=es_blood_type_guide_primary/),
        page.locator('[data-cta-position="hero"]').click(),
      ]);
    } else {
      await page.goto(`${origin}/blood-type/?lang=es&start=1&surface=es_blood_type_guide_primary`, { waitUntil: "domcontentloaded" });
    }
    await page.waitForFunction(() => window.bloodTypeCultureCards);
    await page.locator('[data-blood-type="A"]').click();
    if (!page.url().includes("surface=es_blood_type_guide_primary") || /(?:blood_type|type)=A/i.test(page.url())) fail("linked journey URL leaks the selected type");
    await page.locator("#share-button").click();
    await page.locator("#related-links a").first().evaluate(link => link.addEventListener("click", event => event.preventDefault(), { capture: true }));
    await page.locator("#related-links a").first().click();
    await page.locator("#back-button").click();
    const events = await page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item)).filter(item => item[0] === "event"));
    const names = events.map(item => item[1]);
    for (const name of EVENTS) if (!names.includes(name)) fail(`runtime event missing: ${name}`);
    for (const [, name, params] of events.filter(item => String(item[1]).startsWith("blood_type_culture_"))) {
      const forbidden = Object.keys(params || {}).filter(key => /blood_type|selected|result|answer|score/i.test(key));
      if (forbidden.length) fail(`${name}: private payload key ${forbidden.join(",")}`);
    }
    const shareEvent = events.find(item => item[1] === "blood_type_culture_share");
    if (shareEvent?.[2]?.method !== "native") fail("successful native share was not measured correctly");
    const relatedEvent = events.find(item => item[1] === "blood_type_culture_related_click");
    if (relatedEvent?.[2]?.target_slug !== "reaction_test" || relatedEvent?.[2]?.target_rank !== 1) fail("related click payload is not allowlisted");
    await page.close();
    return { environment: live ? "live" : "local", localeJourneys: LANGUAGES.length, linkedJourney: 1, viewport: "390x844", events: EVENTS.length };
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
}

(async () => {
  const source = verifySource(loadBundle());
  console.log("[PASS] source contract", source);
  if (process.argv.includes("--mutations")) runMutations();
  const runtime = await verifyRuntime(process.argv.includes("--live"));
  console.log("[PASS] runtime contract", runtime);
  console.log("[PASS] blood-type culture reset verified");
})().catch(error => { console.error(`[FAIL] ${error.message}`); process.exit(1); });
