#!/usr/bin/env node
const fs=require('fs');
const http=require('http');
const path=require('path');
const {chromium}=require('playwright');

const ROOT=path.resolve(__dirname,'..');
const PORTAL=path.join(ROOT,'projects','portal');
const APP=path.join(ROOT,'projects','future-self');
const GUIDE_FILE=path.join(PORTAL,'blog','en','future-self-prediction-quiz.html');
const APP_JS_FILE=path.join(APP,'js','app.js');
const I18N_FILE=path.join(APP,'js','i18n.js');
const CATALOG_FILE=path.join(PORTAL,'blog','en','index.html');
const SITEMAP_FILE=path.join(PORTAL,'blog','sitemap.xml');
const CTA='/future-self/?lang=en&amp;start=1&amp;source=en_future_self_guide';
const GUIDE_EVENTS=['content_view','content_en_future_self_method_view','content_cta_click','content_related_click'];

function fail(message){throw new Error(message)}
function read(file){return fs.readFileSync(file,'utf8')}
function count(source,pattern){return(source.match(pattern)||[]).length}
function load(){return{guide:read(GUIDE_FILE),app:read(APP_JS_FILE),i18n:read(I18N_FILE),catalog:read(CATALOG_FILE),sitemap:read(SITEMAP_FILE)}}

function verifySource(bundle){
  if(!/<html lang="en">/.test(bundle.guide)||!/<h1>What Will You Be Like in 10 Years\?<\/h1>/.test(bundle.guide))fail('English language or search-intent H1 drifted');
  if(!/dateModified[^\n]+2026-09-01/.test(bundle.guide)||!/data-en-future-self-guide="2026-09-01"/.test(bundle.guide))fail('release date or guide contract drifted');
  for(const phrase of ['does not predict your job','not an AI forecast','8 choices × 2 theme points','different mood or context','do not validate DopaBrain'])if(!bundle.guide.includes(phrase))fail(`boundary or method missing: ${phrase}`);
  if(/(?:AI-powered|accurate results|predict future outcomes|personality traits predict|core personality traits are remarkably stable|strongly correlate with life outcomes|FAQPage|AggregateRating|content_ad_impression|cross-promo|link_url)/i.test(bundle.guide))fail('unsupported prediction, proof, schema, telemetry, or promotion remains');
  for(const source of ['PMC3949005','10.1016/S0065-2601(06)38002-1'])if(!bundle.guide.includes(source))fail(`source missing: ${source}`);
  if(count(bundle.guide,new RegExp(CTA.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))!==2)fail('two identical direct-start CTAs required');
  if(count(bundle.guide,/data-related=/g)!==7)fail('four quick cards and three footer routes required');
  for(const route of ['/habit-tracker/?lang=en','/todo-list/?lang=en','/pomodoro-timer/?lang=en','/life-in-numbers/?lang=en'])if(!bundle.guide.includes(route))fail(`related route missing: ${route}`);
  for(const event of GUIDE_EVENTS)if(!bundle.guide.includes(`'${event}'`))fail(`guide event missing: ${event}`);
  if(!/intersectionRatio>=\.5/.test(bundle.guide)||!/setTimeout\(\(\)=>\{[\s\S]{0,250}\},500\)/.test(bundle.guide))fail('qualified 50%/500ms method exposure missing');
  if(count(bundle.guide,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)!==1||/<ins[^>]+adsbygoogle|adsbygoogle\s*\.\s*push/.test(bundle.guide))fail('guide is not Auto Ads loader-only');
  if(!/"@type":"Article"/.test(bundle.guide)||!/"@type":"BreadcrumbList"/.test(bundle.guide))fail('guide schema contract drifted');
  if(!/\^\[a-z0-9_-\]\{1,48\}\$/.test(bundle.app)||!/source_surface: ENTRY_SOURCE/.test(bundle.app))fail('app source normalization or attribution drifted');
  if(!/ENTRY_QUERY\.get\('start'\) === '1'/.test(bundle.app)||!/const queryLang = new URLSearchParams\(window\.location\.search\)\.get\('lang'\)/.test(bundle.i18n))fail('linked start or query language drifted');
  if(!/What Will You Be Like in 10 Years\?/.test(bundle.catalog)||!/transparent fixed rule/.test(bundle.catalog))fail('English catalog card drifted');
  if(count(bundle.sitemap,/https:\/\/dopabrain\.com\/portal\/blog\/en\/future-self-prediction-quiz\.html/g)!==1||!/en\/future-self-prediction-quiz\.html<\/loc><lastmod>2026-09-01/.test(bundle.sitemap))fail('focused sitemap entry missing or duplicated');
  return{guideBytes:Buffer.byteLength(bundle.guide),sources:2,related:7,events:GUIDE_EVENTS.length};
}

function mutation(name,change){
  const bundle=load();change(bundle);
  try{verifySource(bundle)}catch(error){console.log(`[PASS] ${name}: ${error.message}`);return}
  fail(`mutation escaped: ${name}`);
}
function runMutations(){
  const mutations=[
    ['prediction-claim',b=>{b.guide+='AI-powered accurate results predict future outcomes'}],
    ['boundary-loss',b=>{b.guide=b.guide.replace('does not predict your job','reveals your job')}],
    ['method-loss',b=>{b.guide=b.guide.replace('8 choices × 2 theme points','hidden model score')}],
    ['source-loss',b=>{b.guide=b.guide.replace('PMC3949005','removed')}],
    ['cta-drift',b=>{b.guide=b.guide.replace('source=en_future_self_guide','source=unknown')}],
    ['related-loss',b=>{b.guide=b.guide.replace(' data-related="habit_tracker"','')}],
    ['early-view',b=>{b.guide=b.guide.replace('},500)','},0)')}],
    ['manual-ad',b=>{b.guide+='<ins class="adsbygoogle" data-ad-slot="1"></ins>'}],
    ['hidden-faq',b=>{b.guide+='<script type="application/ld+json">{"@type":"FAQPage"}</script>'}],
    ['raw-link-event',b=>{b.guide+="track('x',{link_url:link.href})"}],
    ['app-source-loss',b=>{b.app=b.app.replace('source_surface: ENTRY_SOURCE','source_surface: rawEntrySource')}],
    ['catalog-drift',b=>{b.catalog=b.catalog.replace('An eight-scene reflection with a transparent fixed rule.','AI prediction')}],
    ['sitemap-duplicate',b=>{b.sitemap+='<loc>https://dopabrain.com/portal/blog/en/future-self-prediction-quiz.html</loc>'}]
  ];
  for(const [name,change]of mutations)mutation(name,change);
  console.log(`[PASS] mutation summary ${mutations.length}/${mutations.length} detected`);
}

function mime(file){return({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream'}
function server(){return http.createServer((request,response)=>{
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  let file,root;
  if(pathname.startsWith('/portal/')){root=PORTAL;file=path.resolve(root,pathname.slice(8))}
  else if(pathname.startsWith('/future-self/')){root=APP;file=path.resolve(root,pathname.slice(13))}
  else{response.writeHead(404);response.end('not found');return}
  if(!(file===root||file.startsWith(`${root}${path.sep}`))){response.writeHead(403);response.end('forbidden');return}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){response.writeHead(404);response.end('not found');return}
  response.writeHead(200,{'content-type':mime(file),'cache-control':'no-store'});fs.createReadStream(file).pipe(response);
})}
function events(page){return page.evaluate(()=>(window.dataLayer||[]).map(x=>Array.from(x||[])).filter(x=>x[0]==='event').map(x=>({name:x[1],params:x[2]||{}})))}
async function isolate(context,local){if(local)await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort())}

async function journey(browser,origin,viewport,local){
  const context=await browser.newContext({viewport,serviceWorkers:'block'});await isolate(context,local);
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  try{
    await page.goto(`${origin}/portal/blog/en/future-self-prediction-quiz.html`,{waitUntil:'domcontentloaded'});
    if(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>0)fail(`${viewport.width}: guide overflow`);
    const targets=await page.locator('.cta,.quick-card').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
    if(targets.some(x=>x.w<44||x.h<44))fail(`${viewport.width}: guide target below 44px`);
    await page.locator('[data-qualified-method]').evaluate(node=>node.scrollIntoView({block:'center'}));
    await page.waitForTimeout(250);
    if((await events(page)).some(x=>x.name==='content_en_future_self_method_view'))fail(`${viewport.width}: method view fired before 500ms`);
    // Live Auto Ads can insert a large surface after DOMContentLoaded and move the
    // method card out of view. Let that layout settle, then model a reader returning
    // to the card instead of treating a correctly cancelled exposure as a failure.
    await page.waitForTimeout(1000);
    if(!(await events(page)).some(x=>x.name==='content_en_future_self_method_view')){
      await page.locator('[data-qualified-method]').evaluate(node=>node.scrollIntoView({block:'center'}));
    }
    await page.waitForFunction(()=>(window.dataLayer||[]).filter(x=>x[0]==='event'&&x[1]==='content_en_future_self_method_view').length===1);
    const related=page.locator('[data-related]').first();await related.evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true}));await related.click();
    const href=await page.locator('[data-cta-position="hero"]').getAttribute('href');
    await page.locator('[data-cta-position="hero"]').evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{capture:true}));await page.locator('[data-cta-position="hero"]').click();
    const guideEvents=await events(page);for(const name of GUIDE_EVENTS)if(guideEvents.filter(x=>x.name===name).length!==1)fail(`${viewport.width}: guide ${name} not exact-once`);
    await page.goto(new URL(href,origin).href,{waitUntil:'domcontentloaded'});await page.waitForSelector('#screen-story.active .choice-btn');
    let appEvents=await events(page);const start=appEvents.filter(x=>x.name==='test_start');
    if(await page.getAttribute('html','lang')!=='en'||start.length!==1||start[0].params.entry_mode!=='linked'||start[0].params.source_surface!=='en_future_self_guide')fail(`${viewport.width}: linked English attribution drifted`);
    for(let i=0;i<8;i++){await page.locator('.choice-btn').first().click();if(i<7)await page.waitForFunction(n=>document.querySelector('#moment-counter')?.textContent.trim().startsWith(String(n)),i+2)}
    await page.waitForSelector('#screen-result.active');appEvents=await events(page);
    const complete=appEvents.filter(x=>x.name==='test_complete');
    if(complete.length!==1||complete[0].params.scoring_method!=='fixed_dual_path_points'||complete[0].params.question_count!==8)fail(`${viewport.width}: completion contract drifted`);
    const state=await page.evaluate(()=>({url:location.href,local:Object.keys(localStorage),session:Object.keys(sessionStorage)}));
    if(/ceo|artist|adventurer|scholar|healer|influencer|inventor|freelancer/i.test(JSON.stringify({events:appEvents,state})))fail(`${viewport.width}: private result leaked`);
    if(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)>0)fail(`${viewport.width}: app overflow`);
    if(errors.length)fail(`${viewport.width}: page errors: ${errors.join(' | ')}`);
  }finally{await context.close()}
}
async function runtime(live=false){
  const local=live?null:server();if(local)await new Promise(resolve=>local.listen(0,'127.0.0.1',resolve));
  const origin=live?'https://dopabrain.com':`http://127.0.0.1:${local.address().port}`;const browser=await chromium.launch({headless:true});
  try{for(const viewport of[{width:390,height:844},{width:1440,height:1000}])await journey(browser,origin,viewport,!live);return{environment:live?'live':'local',viewports:[390,1440],answers:16,private:true}}
  finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}
}

(async()=>{const source=verifySource(load());console.log('[PASS] source contract',source);if(process.argv.includes('--mutations'))runMutations();const result=await runtime(process.argv.includes('--live'));console.log('[PASS] runtime contract',result);console.log('[PASS] English future-self guide verified')})().catch(error=>{console.error(`[FAIL] ${error.message}`);process.exit(1)});
