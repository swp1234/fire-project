#!/usr/bin/env node
const fs=require('fs');
const http=require('http');
const path=require('path');
const {chromium}=require('playwright');

const ROOT=path.resolve(__dirname,'..');
const PORTAL=path.join(ROOT,'projects','portal');
const GUIDE_FILE=path.join(PORTAL,'blog','de','emotional-regulation-techniques.html');
const TOOL_FILE=path.join(PORTAL,'tools','emotion-regulation-planner.html');
const JS_FILE=path.join(PORTAL,'js','emotion-regulation-planner.js');
const CATALOG_FILE=path.join(PORTAL,'blog','de','index.html');
const SITEMAP_FILE=path.join(PORTAL,'blog','sitemap.xml');
const CTA='/portal/tools/emotion-regulation-planner.html?lang=de&amp;source=de_emotion_regulation_guide';
const GUIDE_EVENTS=['content_view','content_de_emotion_action_view','content_cta_click','content_related_click'];
const TOOL_EVENTS=['emotion_action_view','emotion_action_generate','emotion_action_copy','emotion_action_used','emotion_action_related_click'];

function fail(message){throw new Error(message)}
function read(file){return fs.readFileSync(file,'utf8')}
function count(source,pattern){return(source.match(pattern)||[]).length}
function load(){return{guide:read(GUIDE_FILE),tool:read(TOOL_FILE),js:read(JS_FILE),catalog:read(CATALOG_FILE),sitemap:read(SITEMAP_FILE)}}

function verifySource(bundle){
  if(!/<html lang="de">/.test(bundle.guide)||!/<h1>Techniken zur Emotionsregulation: Jetzt–Danach–Später<\/h1>/.test(bundle.guide))fail('German language or action-led H1 drifted');
  if(!/dateModified[^\n]+2026-09-01/.test(bundle.guide)||!/dateModified[^\n]+2026-09-01/.test(bundle.tool))fail('release date drifted');
  if(!/keine Diagnose, Therapie oder Krisenhilfe/.test(bundle.guide)||!/Allgemeine Hinweise belegen nicht/.test(bundle.guide))fail('medical or evidence boundary is missing');
  if(/(?:25-30%|bis zu 40%|4-7-8|Neuroplastizität|graue Substanz|Amygdala.{0,20}(?:reduziert|verringert)|Medikamenten vergleichbar|4-8 Wochen|FAQPage|EQ-Test|content_ad_impression|cross-promo|link_url)/i.test(bundle.guide))fail('unsupported efficacy, mechanism, test, FAQ, ad, promotion, or raw telemetry remains');
  for(const source of ['9789240003927','gesund.bund.de/entspannungsmethoden','anlaufstellen-bei-psychischen-krisen'])if(!bundle.guide.includes(source))fail(`guide source missing: ${source}`);
  if(count(bundle.guide,new RegExp(CTA.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))!==2)fail('guide must have two identical primary CTAs');
  if(count(bundle.guide,/data-related=/g)!==4)fail('guide must keep four verified related routes');
  for(const route of ['/stress-check/?lang=de','/hsp-test/reset.html?lang=de','/portal/blog/de/stress-response-guide.html','/portal/blog/de/anxiety-type-guide.html'])if(!bundle.guide.includes(route))fail(`related route missing: ${route}`);
  for(const event of GUIDE_EVENTS)if(!bundle.guide.includes(`'${event}'`))fail(`guide event missing: ${event}`);
  if(!/intersectionRatio>=\.35/.test(bundle.guide)||!/clearTimeout\(timer\)/.test(bundle.guide)||!/},500\)/.test(bundle.guide))fail('continuous qualified guide exposure drifted');
  if(count(bundle.guide,/\/portal\/js\/ad-loader\.js/g)!==1||/data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*\.\s*push/.test(bundle.guide))fail('guide is not managed Auto Ads only');
  if(!/"@type":"Article"/.test(bundle.guide)||!/"@type":"BreadcrumbList"/.test(bundle.guide))fail('guide schema contract drifted');

  if(!bundle.tool.includes("'de_emotion_regulation_guide'")||!bundle.js.includes("'de_emotion_regulation_guide'"))fail('German source is not allowlisted before analytics');
  if(bundle.tool.indexOf('const langs=new Set')>bundle.tool.indexOf('googletagmanager.com')||!/history\.replaceState\(\{\},'',next\)/.test(bundle.tool))fail('pre-analytics query sanitizer drifted');
  const localeStart=bundle.js.indexOf("de:{pageTitle:'Aktionsplaner zur Emotionsregulation");
  const localeEnd=bundle.js.indexOf("\ntr:{",localeStart);
  const actionStart=bundle.js.indexOf("\nde:{orient:");
  const actionEnd=bundle.js.indexOf("\nid:{orient:",actionStart);
  if(localeStart<0||localeEnd<0||actionStart<0||actionEnd<0)fail('German locale or action library is missing');
  const locale=bundle.js.slice(localeStart,localeEnd),actions=bundle.js.slice(actionStart,actionEnd);
  for(const key of ['safetyBody','emotion_angry','context_relationship','goal_communicate','privacy','methodTitle','stepLater','highNote'])if(!locale.includes(`${key}:`))fail(`German locale key missing: ${key}`);
  for(const key of ['orient','emotion','goal','later','phrase'])if(!actions.includes(`${key}:{`))fail(`German action group missing: ${key}`);
  if(/emotion_action_ad_impression|content_ad_impression|result_ad_impression/.test(`${bundle.tool}\n${bundle.js}`))fail('tool contains synthetic paid-impression telemetry');
  if(/track\([^\n]+\b(?:emotion|intensity|context|goal|time)\s*:/.test(bundle.js))fail('tool analytics expose a private selection');
  for(const event of TOOL_EVENTS)if(!bundle.js.includes(`'${event}'`))fail(`tool event missing: ${event}`);
  if(!/Emotionsregulation: Jetzt–Danach–Später/.test(bundle.catalog)||!/2026-09/.test(bundle.catalog))fail('German catalog card drifted');
  if(count(bundle.sitemap,/https:\/\/dopabrain\.com\/portal\/blog\/de\/emotional-regulation-techniques\.html/g)!==1||!/de\/emotional-regulation-techniques\.html<\/loc><lastmod>2026-09-01/.test(bundle.sitemap))fail('focused sitemap entry missing or duplicated');
  return{guideBytes:Buffer.byteLength(bundle.guide),toolBytes:Buffer.byteLength(bundle.tool),locale:'de',events:GUIDE_EVENTS.length+TOOL_EVENTS.length};
}

function mutation(name,change){const bundle=load();change(bundle);try{verifySource(bundle)}catch(error){console.log(`[PASS] ${name}: ${error.message}`);return}fail(`mutation escaped: ${name}`)}
function runMutations(){
  const mutations=[
    ['efficacy-claim',b=>{b.guide+='25-30% und Gehirnstruktur verändert'}],
    ['boundary-loss',b=>{b.guide=b.guide.replace('keine Diagnose, Therapie oder Krisenhilfe','garantierte Therapie')}],
    ['cta-drift',b=>{b.guide=b.guide.replace('source=de_emotion_regulation_guide','source=unknown')}],
    ['related-loss',b=>{b.guide=b.guide.replace(' data-related="stress_check"','')}],
    ['qualified-no-delay',b=>{b.guide=b.guide.replace('},500)','},0)')}],
    ['qualified-no-cancel',b=>{b.guide=b.guide.replace('clearTimeout(timer)','void timer')}],
    ['manual-ad',b=>{b.guide+='<ins class="adsbygoogle" data-ad-slot="1"></ins>'}],
    ['hidden-faq',b=>{b.guide+='<script type="application/ld+json">{"@type":"FAQPage"}</script>'}],
    ['source-not-early',b=>{b.tool=b.tool.replace("'de_emotion_regulation_guide'","'removed_de_source'")}],
    ['source-not-runtime',b=>{b.js=b.js.replace("'de_emotion_regulation_guide'","'removed_de_source'")}],
    ['locale-loss',b=>{b.js=b.js.replace("safetyBody:'Dieses Werkzeug", "removedSafety:'Dieses Werkzeug")}],
    ['action-loss',b=>{const i=b.js.indexOf("\nde:{orient:");b.js=b.js.slice(0,i)+b.js.slice(i).replace('phrase:{','removedPhrase:{')}],
    ['fake-ad-event',b=>{b.js+="track('emotion_action_ad_impression')"}],
    ['private-event',b=>{b.js+="track('x',{emotion:v.emotion})"}],
    ['catalog-drift',b=>{b.catalog=b.catalog.replace('Jetzt–Danach–Später','7 wissenschaftliche Techniken')}],
    ['sitemap-duplicate',b=>{b.sitemap+='<loc>https://dopabrain.com/portal/blog/de/emotional-regulation-techniques.html</loc>'}]
  ];
  for(const [name,change]of mutations)mutation(name,change);
  console.log(`[PASS] mutation summary ${mutations.length}/${mutations.length} detected`);
}

function mime(file){return({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream'}
function server(){return http.createServer((request,response)=>{const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);if(!(pathname==='/portal'||pathname.startsWith('/portal/'))){response.writeHead(404);response.end('not found');return}let file=path.resolve(PORTAL,pathname.replace(/^\/portal\/?/,'')||'index.html');if(!file.startsWith(`${path.resolve(PORTAL)}${path.sep}`)&&file!==path.resolve(PORTAL,'index.html')){response.writeHead(403);response.end('forbidden');return}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){response.writeHead(404);response.end('not found');return}response.writeHead(200,{'content-type':mime(file),'cache-control':'no-store'});fs.createReadStream(file).pipe(response)})}
function events(page){return page.evaluate(()=>(window.dataLayer||[]).map(row=>Array.from(row||[])).filter(row=>row[0]==='event').map(row=>({name:row[1],params:row[2]||{}})))}
async function isolate(page,local){if(local)await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort())}

async function journey(browser,origin,viewport,local){
  const page=await browser.newPage({viewport});await isolate(page,local);await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copied=value}}}));
  try{
    await page.goto(`${origin}/portal/blog/de/emotional-regulation-techniques.html`,{waitUntil:'domcontentloaded'});
    if((await page.locator('h1').textContent()).trim()!=='Techniken zur Emotionsregulation: Jetzt–Danach–Später')fail(`${viewport.width}: guide H1 drifted`);
    if(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>1)fail(`${viewport.width}: guide overflow`);
    await page.locator('[data-qualified-action]').evaluate(node=>node.scrollIntoView({block:'center'}));await page.waitForTimeout(250);
    if((await events(page)).some(row=>row.name==='content_de_emotion_action_view'))fail(`${viewport.width}: qualified view fired before 500ms`);
    await page.waitForTimeout(1000);if(!(await events(page)).some(row=>row.name==='content_de_emotion_action_view'))await page.locator('[data-qualified-action]').evaluate(node=>node.scrollIntoView({block:'center'}));
    await page.waitForFunction(()=>(window.dataLayer||[]).filter(row=>row[0]==='event'&&row[1]==='content_de_emotion_action_view').length===1);
    const related=page.locator('[data-related]').first();await related.evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true}));await related.click();
    const cta=page.locator('[data-cta-position="action"]'),href=await cta.getAttribute('href');await cta.evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true}));await cta.click();
    const guideEvents=await events(page);for(const name of GUIDE_EVENTS)if(guideEvents.filter(row=>row.name===name).length!==1)fail(`${viewport.width}: guide ${name} not exact-once`);

    await page.goto(new URL(href,origin).href,{waitUntil:'domcontentloaded'});await page.waitForSelector('#generate');
    if(await page.getAttribute('html','lang')!=='de'||new URL(page.url()).searchParams.get('source')!=='de_emotion_regulation_guide')fail(`${viewport.width}: German entry attribution drifted`);
    if((await page.locator('h1').textContent()).trim()!=='Aktionsplaner zur Emotionsregulation')fail(`${viewport.width}: German tool title drifted`);
    await page.selectOption('#emotion','angry');await page.selectOption('#intensity','high');await page.selectOption('#context','relationship');await page.selectOption('#time','1');await page.selectOption('#goal','communicate');await page.click('#generate');
    const result=await page.locator('#result').innerText();for(const phrase of ['Eine 1 Minute-Karte für „Wütend“','Sende oder sage','eine Beobachtung','Kehre zum Gespräch'])if(!result.includes(phrase))fail(`${viewport.width}: German result missing: ${phrase}`);
    if(/Delay sending|Write or say one observation|Return only when/.test(result))fail(`${viewport.width}: English result leaked`);
    await page.click('#copy');await page.waitForFunction(()=>Boolean(window.__copied));await page.click('#done');
    await page.locator('.related a').first().evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true}));await page.locator('.related a').first().click();
    const toolEvents=await events(page);for(const name of TOOL_EVENTS)if(toolEvents.filter(row=>row.name===name).length!==1)fail(`${viewport.width}: tool ${name} not exact-once`);
    if(toolEvents.find(row=>row.name==='emotion_action_view')?.params?.entry_source!=='de_emotion_regulation_guide')fail(`${viewport.width}: source attribution drifted`);
    const payload=JSON.stringify(toolEvents);for(const word of ['angry','high','relationship','communicate'])if(new RegExp(`(?:\\"${word}\\"|:${word}(?:[,}]))`,'i').test(payload))fail(`${viewport.width}: private choice leaked: ${word}`);
    if(/(?:emotion|intensity|context|goal|time)=/i.test(page.url())||await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>1)fail(`${viewport.width}: private URL or overflow`);
    await page.goto(`${origin}/portal/tools/emotion-regulation-planner.html?lang=bad&source=untrusted&emotion=secret#private`,{waitUntil:'domcontentloaded'});await page.waitForSelector('#generate');
    if(new URL(page.url()).search||new URL(page.url()).hash)fail(`${viewport.width}: unsafe query/hash survived`);
    if((await events(page)).find(row=>row.name==='emotion_action_view')?.params?.entry_source!=='direct')fail(`${viewport.width}: unknown source did not normalize`);
  }finally{await page.close()}
}
async function runtime(live=false){const local=live?null:server();if(local)await new Promise(resolve=>local.listen(0,'127.0.0.1',resolve));const origin=live?'https://dopabrain.com':`http://127.0.0.1:${local.address().port}`,browser=await chromium.launch({headless:true});try{for(const viewport of[{width:390,height:844},{width:1440,height:1000}])await journey(browser,origin,viewport,!live);return{environment:live?'live':'local',locale:'de',viewports:[390,1440],events:9,private:true,sanitized:true}}finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}}

(async()=>{const source=verifySource(load());console.log('[PASS] source contract',source);if(process.argv.includes('--mutations'))runMutations();console.log('[PASS] runtime contract',await runtime(process.argv.includes('--live')));console.log('[PASS] German emotion action path verified')})().catch(error=>{console.error(`[FAIL] ${error.message}`);process.exit(1)});
