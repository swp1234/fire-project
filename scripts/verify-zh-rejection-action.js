#!/usr/bin/env node
const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const PORTAL = path.join(ROOT, "projects", "portal");
const GUIDE_FILE = path.join(PORTAL, "blog", "zh", "rejection-sensitivity-dysphoria.html");
const TOOL_FILE = path.join(PORTAL, "tools", "emotion-regulation-planner.html");
const TOOL_JS_FILE = path.join(PORTAL, "js", "emotion-regulation-planner.js");
const CATALOG_FILE = path.join(PORTAL, "blog", "zh", "index.html");
const LANGUAGES = ["ko","en","zh","hi","ru","ja","es","pt","id","tr","de","fr"];
const GUIDE_EVENTS = ["content_view","content_zh_rejection_check_view","content_cta_click"];
const TOOL_EVENTS = ["emotion_action_view","emotion_action_generate","emotion_action_copy","emotion_action_used","emotion_action_related_click"];
const CTA = "/portal/tools/emotion-regulation-planner.html?lang=zh&amp;source=zh_rsd_guide_primary";

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, "utf8"); }
function count(source, pattern) { return (source.match(pattern) || []).length; }
function loadBundle() { return { guide:read(GUIDE_FILE), tool:read(TOOL_FILE), js:read(TOOL_JS_FILE), catalog:read(CATALOG_FILE) }; }

function verifySource(bundle) {
  if (!/<html lang="zh-CN">/.test(bundle.guide) || !/<h1>RSD是正式诊断吗？<\/h1>/.test(bundle.guide)) fail("guide language or direct-answer H1 drifted");
  if (!/dateModified[^\n]+2026-08-30/.test(bundle.guide) || !/dateModified[^\n]+2026-09-01/.test(bundle.tool)) fail("release date drifted");
  if (!/不是正式医学诊断/.test(bundle.guide) || !/研究仍有限/.test(bundle.guide)) fail("RSD evidence boundary is missing");
  if (/(?:高达\s*99|99\s*%|神经生物学疾病|杏仁核过度|多巴胺失调|单胺氧化酶|MAOI|药物治疗|30-60分钟|988自杀|FAQPage)/i.test(bundle.guide)) fail("unsupported diagnosis, prevalence, mechanism, treatment, timing, hotline, or FAQ claim remains");
  for (const source of ["24099-rejection-sensitive-dysphoria-rsd","37470198","30155685","9789240003927"]) if (!bundle.guide.includes(source)) fail(`guide source missing: ${source}`);
  if (!/35项成人ADHD研究/.test(bundle.guide) || !/391名青少年/.test(bundle.guide)) fail("study sample boundary is missing");
  if (count(bundle.guide, new RegExp(CTA.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "g")) !== 2) fail("guide must have two identical primary CTAs");
  for (const event of GUIDE_EVENTS) if (!bundle.guide.includes(`'${event}'`)) fail(`guide event missing: ${event}`);
  if (!/setTimeout\(\(\)=>\{[^}]+\},500\)/.test(bundle.guide) || !/intersectionRatio>=\.35/.test(bundle.guide)) fail("qualified guide view timing or visibility threshold drifted");
  if (/target_url|link_url|content_ad_|scroll_(?:depth|engagement)|timer_engagement|cross-promo/.test(bundle.guide)) fail("guide retains unsafe legacy telemetry or generic promotion");
  if (count(bundle.guide, /\/portal\/js\/ad-loader\.js/g) !== 1 || /data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*\.\s*push/.test(bundle.guide)) fail("guide is not managed Auto Ads only");

  if (count(bundle.tool, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3600813755953882/g) !== 1) fail("tool Auto Ads loader count drifted");
  if (/data-ad-slot|<ins[^>]+adsbygoogle|data-ad-surface|adsbygoogle\s*=|adsbygoogle\s*\.\s*push/.test(`${bundle.tool}\n${bundle.js}`)) fail("tool contains a manual ad surface or push");
  if (/emotion_action_ad_impression|content_ad_impression|result_ad_impression/.test(`${bundle.tool}\n${bundle.js}`)) fail("tool contains synthetic paid-impression telemetry");
  for (const source of ["direct","portal_tools_catalog","blog_emotion_action_bridge","zh_rsd_guide_primary"]) if (!bundle.js.includes(`'${source}'`)) fail(`tool source allowlist missing: ${source}`);
  if (!/entry_source:source\(params\.get\('source'\)\)/.test(bundle.js) || /\bsource:params\.get\('source'\)/.test(bundle.js)) fail("tool entry source is not normalized");
  if (/track\([^\n]+\b(?:emotion|intensity|context|goal|time)\s*:/.test(bundle.js)) fail("tool analytics expose a private choice");
  for (const event of TOOL_EVENTS) if (!bundle.js.includes(`'${event}'`)) fail(`tool event missing: ${event}`);
  if (!/证据与行动/.test(bundle.catalog) || !/RSD是正式诊断吗？拒绝敏感、ADHD与应对方法/.test(bundle.catalog)) fail("Chinese catalog card drifted");
  return {guideBytes:Buffer.byteLength(bundle.guide), toolBytes:Buffer.byteLength(bundle.tool), languages:LANGUAGES.length, events:GUIDE_EVENTS.length+TOOL_EVENTS.length};
}

function expectMutation(name, mutate) {
  const bundle=loadBundle(); mutate(bundle);
  try { verifySource(bundle); } catch (error) { console.log(`[PASS] ${name}: ${error.message}`); return; }
  fail(`mutation escaped: ${name}`);
}
function runMutations() {
  const mutations = [
    ["fake-diagnosis", b=>{b.guide += "RSD是一种神经生物学疾病";}],
    ["missing-study", b=>{b.guide=b.guide.replace(/391名青少年/g,"许多青少年");}],
    ["cta-drift", b=>{b.guide=b.guide.replace("source=zh_rsd_guide_primary","source=unknown");}],
    ["qualified-view-no-delay", b=>{b.guide=b.guide.replace("},500)","},0)");}],
    ["manual-ad", b=>{b.tool += "<ins class='adsbygoogle' data-ad-slot='auto'></ins>";}],
    ["fake-ad-event", b=>{b.js += "track('emotion_action_ad_impression')";}],
    ["raw-source", b=>{b.js=b.js.replace("entry_source:source(params.get('source'))","source:params.get('source')");}],
    ["private-event", b=>{b.js += "track('x',{emotion:v.emotion})";}],
    ["missing-event", b=>{b.js=b.js.replace("'emotion_action_generate'","'removed_generate'");}],
    ["catalog-drift", b=>{b.catalog=b.catalog.replace("证据与行动","心理学");}],
  ];
  for (const [name, mutate] of mutations) expectMutation(name, mutate);
  console.log(`[PASS] mutation summary ${mutations.length}/${mutations.length} detected`);
}

function mime(file) { return ({".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml"})[path.extname(file)] || "application/octet-stream"; }
function server() {
  return http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,"http://localhost").pathname);
    if (!(pathname==="/portal" || pathname.startsWith("/portal/"))) { response.writeHead(404); response.end("not found"); return; }
    let file=path.resolve(PORTAL,pathname.replace(/^\/portal\/?/,"") || "index.html");
    if (!file.startsWith(`${path.resolve(PORTAL)}${path.sep}`) && file!==path.resolve(PORTAL,"index.html")) { response.writeHead(403); response.end("forbidden"); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,"index.html");
    if (!fs.existsSync(file)) { response.writeHead(404); response.end("not found"); return; }
    response.writeHead(200,{"content-type":mime(file),"cache-control":"no-store"}); fs.createReadStream(file).pipe(response);
  });
}
function events(page) { return page.evaluate(()=>(window.dataLayer||[]).map(row=>Array.from(row||[])).filter(row=>row[0]==="event").map(row=>({name:row[1],params:row[2]||{}}))); }
async function isolate(page) {
  await page.route("**/googletagmanager.com/**",route=>route.abort());
  await page.route("**/googlesyndication.com/**",route=>route.abort());
  await page.route("**/doubleclick.net/**",route=>route.abort());
}
async function verifyRuntime(live=false) {
  const local=live?null:server(); if(local)await new Promise(resolve=>local.listen(0,"127.0.0.1",resolve));
  const origin=live?"https://dopabrain.com":`http://127.0.0.1:${local.address().port}`;
  const browser=await chromium.launch({headless:true});
  try {
    for (const language of LANGUAGES) {
      const page=await browser.newPage({viewport:{width:390,height:844}}); await isolate(page);
      await page.goto(`${origin}/portal/tools/emotion-regulation-planner.html?lang=${language}&source=direct`,{waitUntil:"domcontentloaded"}); await page.waitForSelector("#generate");
      if (await page.getAttribute("html","lang")!==language) fail(`${language}: document language mismatch`);
      if (!(await page.locator("h1").textContent()).trim()) fail(`${language}: localized title missing`);
      if (await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>1) fail(`${language}: mobile overflow`);
      for (const selector of ["#generate","#reset"]) { const box=await page.locator(selector).boundingBox(); if(!box||box.height<44||box.width<44)fail(`${language}: ${selector} target below 44px`); }
      await page.close();
    }

    const page=await browser.newPage({viewport:{width:390,height:844}}); await isolate(page);
    await page.addInitScript(()=>Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async value=>{window.__copied=value}}}));
    await page.goto(`${origin}/portal/blog/zh/rejection-sensitivity-dysphoria.html`,{waitUntil:"domcontentloaded"});
    if ((await page.locator("h1").textContent()).trim()!=="RSD是正式诊断吗？") fail("linked guide H1 drifted");
    await page.locator("[data-qualified-action]").scrollIntoViewIfNeeded(); await page.waitForTimeout(650);
    let guideEvents=await events(page); for(const event of GUIDE_EVENTS.slice(0,2))if(guideEvents.filter(row=>row.name===event).length!==1)fail(`guide ${event} not exact-once`);
    await Promise.all([page.waitForURL(/emotion-regulation-planner\.html\?lang=zh&source=zh_rsd_guide_primary/),page.locator('[data-cta-position="action"]').click()]);
    guideEvents=guideEvents.concat([]); await page.waitForSelector("#generate");
    await page.selectOption("#emotion","angry"); await page.selectOption("#intensity","high"); await page.selectOption("#context","relationship"); await page.selectOption("#time","1"); await page.selectOption("#goal","communicate");
    await page.click("#generate"); await page.click("#copy"); await page.waitForFunction(()=>Boolean(window.__copied)); await page.click("#done");
    await page.locator(".related a").first().evaluate(link=>link.addEventListener("click",event=>event.preventDefault(),{capture:true})); await page.locator(".related a").first().click();
    const toolEvents=await events(page); for(const event of TOOL_EVENTS)if(toolEvents.filter(row=>row.name===event).length!==1)fail(`tool ${event} not exact-once`);
    const view=toolEvents.find(row=>row.name==="emotion_action_view"); if(view?.params?.entry_source!=="zh_rsd_guide_primary")fail("linked source was not normalized and attributed");
    const privateWords=["angry","high","relationship","communicate","emotion","intensity","context","goal"];
    const payload=JSON.stringify(toolEvents); for(const word of privateWords)if(new RegExp(`(?:\\"${word}\\"|:${word}(?:[,}]))`,"i").test(payload))fail(`private choice leaked to telemetry: ${word}`);
    if(/(?:emotion|intensity|context|goal)=/i.test(page.url()))fail("private choice leaked to URL");
    await page.goto(`${origin}/portal/tools/emotion-regulation-planner.html?lang=zh&source=untrusted_value`,{waitUntil:"domcontentloaded"}); await page.waitForSelector("#generate");
    const unknown=(await events(page)).find(row=>row.name==="emotion_action_view"); if(unknown?.params?.entry_source!=="direct")fail("unknown source did not normalize to direct");
    if(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>1)fail("linked mobile overflow");
    await page.close();
    return {environment:live?"live":"local", localeJourneys:LANGUAGES.length, linkedJourney:1, events:GUIDE_EVENTS.length+TOOL_EVENTS.length, private:true, autoAdsOnly:true};
  } finally { await browser.close(); if(local)await new Promise(resolve=>local.close(resolve)); }
}

(async()=>{const source=verifySource(loadBundle());console.log("[PASS] source contract",source);if(process.argv.includes("--mutations"))runMutations();const runtime=await verifyRuntime(process.argv.includes("--live"));console.log("[PASS] runtime contract",runtime);console.log("[PASS] Chinese rejection action path verified")})().catch(error=>{console.error(`[FAIL] ${error.message}`);process.exit(1)});
