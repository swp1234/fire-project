#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const GUIDE_FILE = path.join(PORTAL, 'blog', 'ko', 'emotional-regulation-techniques.html');
const TOOL_FILE = path.join(PORTAL, 'tools', 'emotion-regulation-planner.html');
const TOOL_JS_FILE = path.join(PORTAL, 'js', 'emotion-regulation-planner.js');
const CATALOG_FILE = path.join(PORTAL, 'blog', 'ko', 'index.html');
const SITEMAP_FILE = path.join(PORTAL, 'blog', 'sitemap.xml');
const LANGUAGES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const GUIDE_EVENTS = ['content_view','content_ko_emotion_action_view','content_cta_click','content_related_click'];
const TOOL_EVENTS = ['emotion_action_view','emotion_action_generate','emotion_action_copy','emotion_action_used','emotion_action_related_click'];
const CTA = '/portal/tools/emotion-regulation-planner.html?lang=ko&amp;source=ko_emotion_regulation_guide';

function fail(message) { throw new Error(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function count(source, pattern) { return (source.match(pattern) || []).length; }
function loadBundle() { return { guide:read(GUIDE_FILE), tool:read(TOOL_FILE), js:read(TOOL_JS_FILE), catalog:read(CATALOG_FILE), sitemap:read(SITEMAP_FILE) }; }

function verifySource(bundle) {
  if (!/<html lang="ko">/.test(bundle.guide) || !/<h1>감정 조절 방법: 지금–다음–나중 3단계<\/h1>/.test(bundle.guide)) fail('Korean language or action-led H1 drifted');
  if (!/dateModified[^\n]+2026-09-01/.test(bundle.guide) || !/dateModified[^\n]+2026-09-01/.test(bundle.tool)) fail('release date drifted');
  if (!/일반적인 자기성찰 자료이며 진단·치료·위기 대응이 아닙니다/.test(bundle.guide) || !/제한된 실험 과제의 신경 반응/.test(bundle.guide)) fail('medical or research boundary is missing');
  if (/(?:과학이 증명|뇌가 재배선|편도체.{0,12}(?:축소|줄어)|효과.{0,8}(?:%|퍼센트)|불안.{0,8}58|우울.{0,8}40|파괴적.{0,8}70|4-7-8|FAQPage|EQ.{0,8}(?:측정|점수)|content_ad_impression|cross-promo)/i.test(bundle.guide)) fail('unsupported efficacy, mechanism, test, FAQ, ad, or promotion claim remains');
  for (const source of ['9789240003927','tackling-your-worries','17576282']) if (!bundle.guide.includes(source)) fail(`guide source missing: ${source}`);
  if (count(bundle.guide, new RegExp(CTA.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'g')) !== 2) fail('guide must have two identical primary CTAs');
  if (count(bundle.guide, /data-related=/g) !== 4) fail('guide must keep four verified related routes');
  for (const route of ['/stress-check/?lang=ko','/hsp-test/reset.html?lang=ko','/portal/blog/ko/stress-response-guide.html','/portal/blog/ko/healthy-boundaries-guide.html']) if (!bundle.guide.includes(route)) fail(`related route missing: ${route}`);
  for (const event of GUIDE_EVENTS) if (!bundle.guide.includes(`'${event}'`)) fail(`guide event missing: ${event}`);
  if (!/setTimeout\(\(\)=>\{[^}]+\},500\)/.test(bundle.guide) || !/intersectionRatio>=\.35/.test(bundle.guide)) fail('qualified guide view timing or threshold drifted');
  if (count(bundle.guide, /\/portal\/js\/ad-loader\.js/g) !== 1 || /data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*\.\s*push/.test(bundle.guide)) fail('guide is not managed Auto Ads only');
  if (!/"@type":"Article"/.test(bundle.guide) || !/"@type":"BreadcrumbList"/.test(bundle.guide)) fail('guide structured-data contract drifted');

  if (/FAQPage/.test(bundle.tool) || !/"@type":"WebApplication"/.test(bundle.tool) || !/"@type":"BreadcrumbList"/.test(bundle.tool)) fail('tool structured data is hidden, incomplete, or mismatched');
  if (!bundle.tool.includes("'ko_emotion_regulation_guide'") || !bundle.js.includes("'ko_emotion_regulation_guide'")) fail('Korean entry source is not allowlisted before analytics');
  if (bundle.tool.indexOf("const langs=new Set") > bundle.tool.indexOf('googletagmanager.com')) fail('query sanitizer must run before external analytics');
  if (!/history\.replaceState\(\{\},'',next\)/.test(bundle.tool)) fail('tool query sanitizer is missing');
  if (/emotion_action_ad_impression|content_ad_impression|result_ad_impression/.test(`${bundle.tool}\n${bundle.js}`)) fail('tool contains synthetic paid-impression telemetry');
  if (/track\([^\n]+\b(?:emotion|intensity|context|goal|time)\s*:/.test(bundle.js)) fail('tool analytics expose a private selection');
  for (const event of TOOL_EVENTS) if (!bundle.js.includes(`'${event}'`)) fail(`tool event missing: ${event}`);
  if (!/감정 조절 방법: 지금–다음–나중 3단계 행동 카드/.test(bundle.catalog)) fail('Korean catalog card drifted');
  if (count(bundle.sitemap, /https:\/\/dopabrain\.com\/portal\/blog\/ko\/emotional-regulation-techniques\.html/g) !== 1 || !/emotional-regulation-techniques\.html<\/loc><lastmod>2026-09-01/.test(bundle.sitemap)) fail('focused sitemap entry is missing or duplicated');
  return { guideBytes:Buffer.byteLength(bundle.guide), toolBytes:Buffer.byteLength(bundle.tool), languages:LANGUAGES.length, events:GUIDE_EVENTS.length + TOOL_EVENTS.length };
}

function expectMutation(name, mutate) {
  const bundle = loadBundle(); mutate(bundle);
  try { verifySource(bundle); } catch (error) { console.log(`[PASS] ${name}: ${error.message}`); return; }
  fail(`mutation escaped: ${name}`);
}
function runMutations() {
  const mutations = [
    ['efficacy-claim', b=>{ b.guide += '불안을 58% 줄이는 과학이 증명한 방법'; }],
    ['missing-boundary', b=>{ b.guide = b.guide.replace('제한된 실험 과제의 신경 반응','확실한 신경 반응'); }],
    ['cta-drift', b=>{ b.guide = b.guide.replace('source=ko_emotion_regulation_guide','source=unknown'); }],
    ['related-route-loss', b=>{ b.guide = b.guide.replace(' data-related="stress_check"',''); }],
    ['qualified-no-delay', b=>{ b.guide = b.guide.replace('},500)','},0)'); }],
    ['manual-ad', b=>{ b.guide += '<ins class="adsbygoogle" data-ad-slot="1"></ins>'; }],
    ['hidden-faq', b=>{ b.tool += '<script type="application/ld+json">{"@type":"FAQPage"}</script>'; }],
    ['source-not-early', b=>{ b.tool = b.tool.replace("'ko_emotion_regulation_guide'", "'removed_ko_source'"); }],
    ['sanitizer-loss', b=>{ b.tool = b.tool.replace("history.replaceState({},'',next)", 'void next'); }],
    ['fake-ad-event', b=>{ b.js += "track('emotion_action_ad_impression')"; }],
    ['private-event', b=>{ b.js += "track('x',{emotion:v.emotion})"; }],
    ['catalog-drift', b=>{ b.catalog = b.catalog.replace('지금–다음–나중 3단계 행동 카드','과학이 증명한 7가지'); }],
    ['sitemap-duplicate', b=>{ b.sitemap += '<loc>https://dopabrain.com/portal/blog/ko/emotional-regulation-techniques.html</loc>'; }]
  ];
  for (const [name, mutate] of mutations) expectMutation(name, mutate);
  console.log(`[PASS] mutation summary ${mutations.length}/${mutations.length} detected`);
}

function mime(file) { return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream'; }
function server() {
  return http.createServer((request,response)=>{
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if (!(pathname === '/portal' || pathname.startsWith('/portal/'))) { response.writeHead(404); response.end('not found'); return; }
    let file = path.resolve(PORTAL, pathname.replace(/^\/portal\/?/,'') || 'index.html');
    if (!file.startsWith(`${path.resolve(PORTAL)}${path.sep}`) && file !== path.resolve(PORTAL,'index.html')) { response.writeHead(403); response.end('forbidden'); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('not found'); return; }
    response.writeHead(200, {'content-type':mime(file),'cache-control':'no-store'}); fs.createReadStream(file).pipe(response);
  });
}
function events(page) { return page.evaluate(()=>(window.dataLayer||[]).map(row=>Array.from(row||[])).filter(row=>row[0]==='event').map(row=>({name:row[1],params:row[2]||{}}))); }
async function isolate(page) {
  await page.route('**/googletagmanager.com/**',route=>route.abort());
  await page.route('**/googlesyndication.com/**',route=>route.abort());
  await page.route('**/doubleclick.net/**',route=>route.abort());
}
async function linkedJourney(browser, origin, viewport) {
  const page = await browser.newPage({viewport}); await isolate(page);
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copied=value}}}));
  await page.goto(`${origin}/portal/blog/ko/emotional-regulation-techniques.html`,{waitUntil:'domcontentloaded'});
  if ((await page.locator('h1').textContent()).trim() !== '감정 조절 방법: 지금–다음–나중 3단계') fail(`${viewport.width}: guide H1 drifted`);
  if (await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>1) fail(`${viewport.width}: guide horizontal overflow`);
  await page.locator('[data-qualified-action]').scrollIntoViewIfNeeded(); await page.waitForTimeout(650);
  const related = page.locator('[data-related]').first(); await related.evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true})); await related.click();
  const cta = page.locator('[data-cta-position="action"]'); const href = await cta.getAttribute('href'); await cta.evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true})); await cta.click();
  const guideEvents = await events(page); for (const event of GUIDE_EVENTS) if (guideEvents.filter(row=>row.name===event).length!==1) fail(`${viewport.width}: guide ${event} not exact-once`);
  await page.goto(new URL(href,origin).href,{waitUntil:'domcontentloaded'}); await page.waitForSelector('#generate');
  if (new URL(page.url()).searchParams.get('source') !== 'ko_emotion_regulation_guide') fail(`${viewport.width}: valid source was removed`);
  await page.selectOption('#emotion','angry'); await page.selectOption('#intensity','high'); await page.selectOption('#context','relationship'); await page.selectOption('#time','1'); await page.selectOption('#goal','communicate');
  await page.click('#generate'); await page.click('#copy'); await page.waitForFunction(()=>Boolean(window.__copied)); await page.click('#done');
  await page.locator('.related a').first().evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true})); await page.locator('.related a').first().click();
  const toolEvents = await events(page); for (const event of TOOL_EVENTS) if (toolEvents.filter(row=>row.name===event).length!==1) fail(`${viewport.width}: tool ${event} not exact-once`);
  const view = toolEvents.find(row=>row.name==='emotion_action_view'); if (view?.params?.entry_source !== 'ko_emotion_regulation_guide') fail(`${viewport.width}: source attribution drifted`);
  const payload = JSON.stringify(toolEvents); for (const word of ['angry','high','relationship','communicate','emotion','intensity','context','goal']) if (new RegExp(`(?:\\"${word}\\"|:${word}(?:[,}]))`,'i').test(payload)) fail(`${viewport.width}: private choice leaked: ${word}`);
  if (/(?:emotion|intensity|context|goal|time)=/i.test(page.url())) fail(`${viewport.width}: private choice leaked to URL`);
  if (await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>1) fail(`${viewport.width}: tool horizontal overflow`);
  await page.goto(`${origin}/portal/tools/emotion-regulation-planner.html?lang=bad&source=untrusted_value&emotion=secret#private`,{waitUntil:'domcontentloaded'}); await page.waitForSelector('#generate');
  if (new URL(page.url()).search || new URL(page.url()).hash) fail(`${viewport.width}: unsafe query or hash survived sanitizer`);
  const unknown = (await events(page)).find(row=>row.name==='emotion_action_view'); if (unknown?.params?.entry_source !== 'direct') fail(`${viewport.width}: unknown source did not normalize to direct`);
  await page.close();
}
async function verifyRuntime(live=false) {
  const local=live?null:server(); if(local) await new Promise(resolve=>local.listen(0,'127.0.0.1',resolve));
  const origin=live?'https://dopabrain.com':`http://127.0.0.1:${local.address().port}`;
  const browser=await chromium.launch({headless:true});
  try {
    for (const language of LANGUAGES) {
      const page=await browser.newPage({viewport:{width:390,height:844}}); await isolate(page);
      await page.goto(`${origin}/portal/tools/emotion-regulation-planner.html?lang=${language}&source=direct`,{waitUntil:'domcontentloaded'}); await page.waitForSelector('#generate');
      if (await page.getAttribute('html','lang')!==language) fail(`${language}: document language mismatch`);
      if (!(await page.locator('h1').textContent()).trim()) fail(`${language}: localized title missing`);
      await page.close();
    }
    await linkedJourney(browser,origin,{width:390,height:844});
    await linkedJourney(browser,origin,{width:1440,height:1000});
    return {environment:live?'live':'local',locales:LANGUAGES.length,viewports:[390,1440],events:GUIDE_EVENTS.length+TOOL_EVENTS.length,private:true,sanitized:true};
  } finally { await browser.close(); if(local) await new Promise(resolve=>local.close(resolve)); }
}

(async()=>{const source=verifySource(loadBundle());console.log('[PASS] source contract',source);if(process.argv.includes('--mutations'))runMutations();const runtime=await verifyRuntime(process.argv.includes('--live'));console.log('[PASS] runtime contract',runtime);console.log('[PASS] Korean emotion action path verified')})().catch(error=>{console.error(`[FAIL] ${error.message}`);process.exit(1)});
