#!/usr/bin/env node
const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const APP_ROOT = path.join(ROOT, "projects", "zodiac-match");
const PORTAL_ROOT = path.join(ROOT, "projects", "portal");
const GUIDE = path.join(PORTAL_ROOT, "blog", "zh", "zodiac-compatibility-guide.html");
const LANGUAGES = ["de", "en", "es", "fr", "hi", "id", "ja", "ko", "pt", "ru", "tr", "zh"];
const EVENTS = ["zodiac_pair_view", "zodiac_pair_start", "zodiac_pair_open", "zodiac_pair_restart", "zodiac_pair_share", "zodiac_pair_related_click"];
const SIGNS = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
const REQUIRED = [
  "meta.title","meta.description","app.eyebrow","app.title","app.subtitle","boundary.title","boundary.body","boundary.source",
  "selection.title","selection.desc","selection.first","selection.second","selection.placeholder","selection.open",
  ...SIGNS.map(sign => `zodiac.${sign}`), "elements.fire","elements.earth","elements.air","elements.water",
  "result.label","result.pair_title","result.elements","result.boundary","result.prompt1_title","result.prompt1_body",
  "result.prompt2_title","result.prompt2_body","result.prompt3_title","result.prompt3_body","result.evidence_title",
  "result.evidence_body","result.source_relationship","result.source_personality","common.back","share.button","share.title",
  "share.text","share.success","share.copied","share.error","related.title","related.reaction","related.reaction_desc",
  "related.iq","related.iq_desc","related.blood","related.blood_desc","footer.privacy","footer.home","accessibility.skip",
];

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, "utf8"); }
function get(object, dotted) { return dotted.split(".").reduce((value, key) => value?.[key], object); }
function loadBundle() {
  const locales = {};
  for (const lang of LANGUAGES) locales[lang] = JSON.parse(read(path.join(APP_ROOT, "js", "locales", `${lang}.json`)));
  return { html:read(path.join(APP_ROOT,"index.html")), app:read(path.join(APP_ROOT,"js","app.js")), i18n:read(path.join(APP_ROOT,"js","i18n.js")), css:read(path.join(APP_ROOT,"css","style.css")), readme:read(path.join(APP_ROOT,"README.md")), manifest:read(path.join(APP_ROOT,"manifest.json")), sw:read(path.join(APP_ROOT,"sw.js")), guide:read(GUIDE), locales };
}

function verifySource(bundle) {
  const publicSource = `${bundle.html}\n${bundle.app}\n${bundle.manifest}\n${Object.values(bundle.locales).map(JSON.stringify).join("\n")}`;
  if (/(?:5,280|AggregateRating|FAQPage|page_engage|timer_engagement|scroll_engagement|zodiac_select|zodiac_quick_start|result_view|result_ad_impression|percentileStat|premium-screen|romantic-score|friendship-score|work-score)/i.test(publicSource)) fail("legacy proof, score, synthetic event, or hidden schema remains");
  if (/\b(?:selected_sign|zodiac_sign|first_sign|second_sign|result|score)\s*:/i.test(bundle.app)) fail("analytics or share code can expose a sign/result");
  for (const event of EVENTS) if (!new RegExp(`track\\(["']${event}["']`).test(bundle.app)) fail(`missing stage event: ${event}`);
  const ads = bundle.html.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) || [];
  if (ads.length !== 1 || /data-ad-slot|adsbygoogle\s*\.\s*push/.test(bundle.html)) fail("app is not Auto Ads loader-only");
  if (!/window\.i18n\s*=\s*i18n/.test(bundle.i18n)) fail("i18n singleton is not exposed");
  if (!/requestUrl\.pathname\.startsWith\(APP_ROOT\.pathname\)/.test(bundle.sw) || /clients\.openWindow|notificationclick|\/portal\//.test(bundle.sw)) fail("service-worker boundary is unsafe");
  if (/zodiac-data\.js|error-handler\.js/.test(`${bundle.html}\n${bundle.sw}`)) fail("removed legacy bundle is still referenced");
  if (Object.keys(bundle.locales).sort().join(",") !== LANGUAGES.join(",")) fail("locale inventory drifted");
  for (const [lang, locale] of Object.entries(bundle.locales)) {
    const source = JSON.stringify(locale);
    if (source.includes("�") || source.includes("??")) fail(`${lang}: damaged locale text`);
    for (const key of REQUIRED) if (typeof get(locale,key) !== "string" || !get(locale,key).trim()) fail(`${lang}: missing ${key}`);
    for (const key of ["result.pair_title","result.elements"]) {
      const value = get(locale,key);
      if (!value.includes("{first}") || !value.includes("{second}")) fail(`${lang}: ${key} placeholders drifted`);
    }
  }
  if (!/66,063/.test(bundle.guide) || !/46,000/.test(bundle.guide)) fail("guide lacks relationship-study sample boundaries");
  for (const source of ["s41118-020-00103-5","pubmed.ncbi.nlm.nih.gov/16796119"]) if (!bundle.guide.includes(source)) fail(`guide source missing: ${source}`);
  const cta = "https://dopabrain.com/zodiac-match/?lang=zh&amp;start=1&amp;surface=zh_zodiac_guide_primary";
  if ((bundle.guide.split(cta).length - 1) !== 2) fail("guide must contain two identical primary app CTAs");
  if (!/track\('content_view'\)/.test(bundle.guide) || !/track\('content_cta_click'/.test(bundle.guide)) fail("guide stage events missing");
  if (/link_url|content_ad_|scroll_(?:depth|engagement)|timer_engagement|FAQPage|cross-promo/.test(bundle.guide)) fail("guide retains legacy schema, telemetry, or generic promotion");
  if (!/<html lang="zh-CN">/.test(bundle.guide) || !/dateModified[^\n]+2026-08-30/.test(bundle.guide)) fail("guide language/date drifted");
  return { locales:LANGUAGES.length, signs:SIGNS.length, events:EVENTS.length, appBytes:Buffer.byteLength(bundle.app), guideBytes:Buffer.byteLength(bundle.guide) };
}

function expectMutation(name, mutate) {
  const bundle = loadBundle(); mutate(bundle);
  try { verifySource(bundle); } catch (error) { console.log(`[PASS] ${name}: ${error.message}`); return; }
  fail(`mutation escaped: ${name}`);
}
function runMutations() {
  const cases = [
    ["fake-proof", b => { b.html += "5,280 matches"; }], ["score-event", b => { b.app += "\ngtag('event','x',{score:88})"; }],
    ["manual-ad", b => { b.html += "<ins data-ad-slot='1'></ins>"; }], ["missing-locale", b => { delete b.locales.zh; }],
    ["damaged-locale", b => { b.locales.ja.app.title += "�"; }], ["missing-sign", b => { delete b.locales.ko.zodiac.pisces; }],
    ["placeholder-drift", b => { b.locales.es.result.pair_title = "Pareja"; }],
    ["broad-service-worker", b => { b.sw = b.sw.replace(" || !requestUrl.pathname.startsWith(APP_ROOT.pathname)", ""); }],
    ["missing-study", b => { b.guide = b.guide.replace(/66,063/g, "many"); }],
    ["missing-stage", b => { b.app = b.app.replace('this.track("zodiac_pair_open"', 'this.track("removed_open"'); }],
  ];
  for (const [name, mutate] of cases) expectMutation(name, mutate);
}

function type(file) { return ({".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".jpg":"image/jpeg"})[path.extname(file)] || "application/octet-stream"; }
function createServer() {
  return http.createServer((request,response) => {
    const pathname = decodeURIComponent(new URL(request.url,"http://localhost").pathname);
    let base,relative;
    if (pathname === "/zodiac-match" || pathname.startsWith("/zodiac-match/")) { base=APP_ROOT; relative=pathname.replace(/^\/zodiac-match\/?/,""); }
    else if (pathname === "/portal" || pathname.startsWith("/portal/")) { base=PORTAL_ROOT; relative=pathname.replace(/^\/portal\/?/,""); }
    else { response.writeHead(404); response.end("not found"); return; }
    let file = path.resolve(base,relative || "index.html");
    if (!file.startsWith(path.resolve(base))) { response.writeHead(403); response.end("forbidden"); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,"index.html");
    if (!fs.existsSync(file)) { response.writeHead(404); response.end("not found"); return; }
    response.writeHead(200,{"content-type":type(file),"cache-control":"no-store"}); fs.createReadStream(file).pipe(response);
  });
}

async function verifyRuntime(live=false) {
  const server=live?null:createServer(); if(server) await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const origin=live?"https://dopabrain.com":`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({headless:true});
  try {
    for (const lang of LANGUAGES) {
      const page=await browser.newPage({viewport:{width:390,height:844}});
      await page.route("**/googletagmanager.com/**",r=>r.abort()); await page.route("**/googlesyndication.com/**",r=>r.abort());
      await page.goto(`${origin}/zodiac-match/?lang=${lang}`,{waitUntil:"domcontentloaded"}); await page.waitForFunction(()=>window.zodiacPairCards);
      const locale=JSON.parse(read(path.join(APP_ROOT,"js","locales",`${lang}.json`)));
      if(await page.getAttribute("html","lang")!==lang) fail(`${lang}: document language mismatch`);
      if((await page.locator("h1").textContent()).trim()!==locale.app.title) fail(`${lang}: shell not localized`);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth); if(overflow>1) fail(`${lang}: overflow ${overflow}px`);
      await page.selectOption("#first-sign","aries"); await page.selectOption("#second-sign","pisces"); await page.click("#open-card");
      if((await page.locator("#pair-title").textContent()).trim()!==locale.result.pair_title.replace("{first}",locale.zodiac.aries).replace("{second}",locale.zodiac.pisces)) fail(`${lang}: result not localized`);
      await page.close();
    }
    const desktop=await browser.newPage({viewport:{width:1440,height:900}}); await desktop.route("**/googletagmanager.com/**",r=>r.abort()); await desktop.route("**/googlesyndication.com/**",r=>r.abort()); await desktop.goto(`${origin}/zodiac-match/?lang=zh`,{waitUntil:"domcontentloaded"}); await desktop.waitForFunction(()=>window.zodiacPairCards); if(await desktop.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>1) fail("desktop overflow"); await desktop.close();

    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.addInitScript(()=>{window.__shareData=null;Object.defineProperty(navigator,"share",{configurable:true,value:async data=>{window.__shareData=data}})});
    await page.route("**/googletagmanager.com/**",r=>r.abort()); await page.route("**/googlesyndication.com/**",r=>r.abort());
    if(live){await page.goto(`${origin}/portal/blog/zh/zodiac-compatibility-guide.html`,{waitUntil:"domcontentloaded"});if(!(await page.locator("h1").textContent()).includes("星座配对"))fail("live guide missing");await Promise.all([page.waitForURL(/\/zodiac-match\/\?lang=zh&start=1&surface=zh_zodiac_guide_primary/),page.locator('[data-cta-position="hero"]').click()]);}
    else await page.goto(`${origin}/zodiac-match/?lang=zh&start=1&surface=zh_zodiac_guide_primary`,{waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>window.zodiacPairCards); await page.selectOption("#first-sign","aries"); await page.selectOption("#second-sign","pisces"); await page.click("#open-card");
    if(/(?:sign|zodiac|pair)=/i.test(page.url())) fail("selected signs leaked into URL");
    await page.click("#share-button"); const shared=await page.evaluate(()=>window.__shareData); if(/aries|pisces|白羊|双鱼/i.test(JSON.stringify(shared))) fail("selected signs leaked into share data");
    await page.locator("#related-links a").first().evaluate(link=>link.addEventListener("click",e=>e.preventDefault(),{capture:true})); await page.locator("#related-links a").first().click(); await page.click("#back-button");
    const events=await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item)).filter(item=>item[0]==="event")); const names=events.map(item=>item[1]);
    for(const name of EVENTS)if(!names.includes(name))fail(`runtime event missing: ${name}`);
    for(const [,name,params] of events.filter(item=>String(item[1]).startsWith("zodiac_pair_"))){const bad=Object.keys(params||{}).filter(key=>/sign|zodiac|pair_result|score|answer|selected/i.test(key));if(bad.length)fail(`${name}: private payload ${bad.join(",")}`);}
    const related=events.find(item=>item[1]==="zodiac_pair_related_click");if(related?.[2]?.target_slug!=="reaction_test"||related?.[2]?.target_rank!==1)fail("related click payload drifted");
    await page.close(); return {environment:live?"live":"local",localeJourneys:LANGUAGES.length,desktopJourneys:1,linkedJourney:1,events:EVENTS.length,private:true};
  } finally { await browser.close(); if(server)await new Promise(resolve=>server.close(resolve)); }
}

(async()=>{const source=verifySource(loadBundle());console.log("[PASS] source contract",source);if(process.argv.includes("--mutations"))runMutations();const runtime=await verifyRuntime(process.argv.includes("--live"));console.log("[PASS] runtime contract",runtime);console.log("[PASS] zodiac pair reset verified")})().catch(error=>{console.error(`[FAIL] ${error.message}`);process.exit(1)});
