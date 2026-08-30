#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const APP = path.join(ROOT, 'projects', 'habit-tracker');
const GUIDE_ROUTE = '/portal/blog/zh/habit-tracker-guide.html';
const APP_ROUTE = '/habit-tracker/';
const LIVE_GUIDE = `https://dopabrain.com${GUIDE_ROUTE}`;
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const QUICK = ['habit-tracker','routine-planner','pomodoro-timer','todo-list'];
const SOURCES = ['10.1002/ejsp.674','10.1146/annurev-psych-122414-033417','38787601'];
const USAGE = `Usage:\n  node scripts/verify-zh-habit-tracker.js [--mutations]\n  node scripts/verify-zh-habit-tracker.js --url ${LIVE_GUIDE}`;

function assert(value, message) { if (!value) throw new Error(message); }
function count(text, pattern) { return (text.match(pattern) || []).length; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function visible(html) { return html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' '); }
function eventRows(layer) { return layer.map(item => Array.from(item || [])).filter(item => item[0] === 'event').map(item => ({ name:item[1], params:item[2] || {} })); }

function load() {
  return {
    guide:fs.readFileSync(path.join(PORTAL,'blog','zh','habit-tracker-guide.html'),'utf8'),
    index:fs.readFileSync(path.join(PORTAL,'blog','zh','index.html'),'utf8'),
    sitemap:fs.readFileSync(path.join(PORTAL,'blog','sitemap.xml'),'utf8'),
    html:fs.readFileSync(path.join(APP,'index.html'),'utf8'),
    js:fs.readFileSync(path.join(APP,'js','app.js'),'utf8'),
    sw:fs.readFileSync(path.join(APP,'sw.js'),'utf8'),
    locales:Object.fromEntries(LOCALES.map(lang => [lang,fs.readFileSync(path.join(APP,'js','locales',`${lang}.json`),'utf8')]))
  };
}

function verifySource(data) {
  const { guide,index,sitemap,html,js,sw,locales } = data;
  const guideText=visible(guide); const publicApp=`${html}\n${js}\n${Object.values(locales).join('\n')}`;
  assert(guide.includes('data-zh-habit-contract="2026-08-30"'),'Chinese habit guide release marker is missing');
  assert(guide.includes('<meta name="dateModified" content="2026-08-30">'),'Chinese habit guide dateModified is stale');
  assert(guide.includes(`<link rel="canonical" href="${LIVE_GUIDE}">`),'Chinese habit guide canonical drifted');
  assert(count(guide,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi)===1,'Chinese habit guide must have exactly one Auto Ads loader');
  assert(!/FAQPage|AggregateRating|content_ad_impression|adsbygoogle\.push|data-ad-slot=/i.test(guide),'Chinese habit guide retains unsupported schema or ad telemetry');
  assert(/不是新的倒计时规则/.test(guideText)&&/18至254天/.test(guideText)&&/不诊断健康问题/.test(guideText),'Chinese habit guide research or health boundary is missing');
  for(const source of SOURCES) assert(guide.includes(source),`Chinese habit guide source is missing: ${source}`);
  assert(guide.includes('href="/habit-tracker/?lang=zh&amp;quick=1&amp;habit=water&amp;goal=7&amp;surface=zh_habit_tracker_primary"'),'Chinese habit primary route is broken');
  const quick=[...guide.matchAll(/<a class="quick-card[^>]*data-target-slug="([^"]+)"/g)].map(match=>match[1]);
  assert(JSON.stringify(quick)===JSON.stringify(QUICK),'Chinese habit quick-route set drifted');
  assert(/intersectionRatio>=\.5/.test(guide)&&/},500\)/.test(guide)&&/content_zh_habit_plan_view/.test(guide),'Chinese habit qualified exposure contract is incomplete');
  assert(/content_cta_click/.test(guide)&&/content_related_click/.test(guide),'Chinese habit click telemetry is incomplete');
  assert(sitemap.includes(`<loc>${LIVE_GUIDE}</loc><lastmod>2026-08-30</lastmod>`),'Chinese habit sitemap row/date is missing');
  const card=index.match(/<a href="\/portal\/blog\/zh\/habit-tracker-guide\.html"[\s\S]*?<\/a>/)?.[0]||'';
  assert(/先做一个7天记录/.test(card)&&/更新 2026-08/.test(card),'Chinese habit catalog card is stale');

  assert(html.includes('data-habit-tracker-contract="2026-08-30"'),'Habit Tracker release marker is missing');
  assert(html.includes('<meta name="dateModified" content="2026-08-30">'),'Habit Tracker dateModified is stale');
  assert(count(html,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi)===1,'Habit Tracker must have exactly one Auto Ads loader');
  assert(!/AggregateRating|page_engage|data-ad-slot=|adsbygoogle\.push|habit-result-ad|premium-modal/i.test(html),'Habit Tracker retains fabricated proof, synthetic engagement, or manual ads');
  assert(!/premiumAnalysis|generateAnalysis|result_ad_impression|21 days to form a habit/i.test(js),'Habit Tracker retains the fake AI or ad-gated analysis');
  assert(!/"premium"\s*:|"analysis"\s*:/i.test(Object.values(locales).join('\n')),'Habit Tracker locale bundles retain fake premium analysis');
  assert(!/habit_count|goal_days|template_name|completed_count|completion_rate|habit_template/i.test(js),'Habit Tracker telemetry leaks habit data');
  assert(/trackedStages = new Set/.test(js)&&/_trackStage\('habit_tracker_view'/.test(js)&&/_trackStage\('habit_tracker_first_completion'/.test(js),'Habit Tracker exact-once funnel is incomplete');
  assert(/replace\(\/&\/g, '&amp;'\)/.test(js)&&/this\.escapeHtml\(habit\.name\)/.test(js),'Habit Tracker user text escaping is incomplete');
  assert(/await navigator\.share[\s\S]*trackShareSuccess\('web_share'\)/.test(html)&&/navigator\.clipboard\.writeText[\s\S]*trackShareSuccess\('clipboard'\)/.test(html)&&!/trackShareSuccess\('web_share'\);\s*await navigator\.share/.test(html),'Habit Tracker successful sharing is not gated');
  assert(/habit-tracker-v5/.test(sw)&&/url\.pathname\.startsWith\('\/habit-tracker\/'\)/.test(sw)&&/response\.ok/.test(sw)&&/request\.mode === 'navigate'/.test(sw)&&!/addEventListener\('(?:push|sync)'/.test(sw),'Habit Tracker service-worker scope or fallback is unsafe');
  const hrefs=[...html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  assert(hrefs.length===13,'Habit Tracker must publish 12 locale hreflangs plus x-default');
  for(const lang of LOCALES) assert(hrefs.some(match=>match[1]===lang&&match[2]===`https://dopabrain.com/habit-tracker/?lang=${lang}`),`Habit Tracker ${lang} hreflang drifted`);
  for(const lang of LOCALES) JSON.parse(locales[lang]);
  assert(JSON.parse(locales.zh).result?.ready&&JSON.parse(locales.en).result?.ready,'Habit Tracker linked result copy is not localized');
  assert(!/AI Habit Analysis|观看广告|광고 보기|広告を見る/.test(publicApp),'Habit Tracker public source retains fake AI/ad copy');
  return {quickRoutes:quick.length,sources:SOURCES.length,locales:LOCALES.length,submitted:1};
}

function runMutations(baseline) {
  const cases=[
    ['guide-faq','unsupported schema',v=>{v.guide+='<script type="application/ld+json">{"@type":"FAQPage"}</script>'}],
    ['guide-countdown','research or health boundary is missing',v=>{v.guide=v.guide.replace('不是新的倒计时规则','是固定倒计时规则').replace('18至254天','正好66天').replace('不诊断健康问题','诊断健康问题')}],
    ['guide-source','source is missing',v=>{v.guide=v.guide.replace('10.1002/ejsp.674','removed')}],
    ['guide-route','primary route is broken',v=>{v.guide=v.guide.replace('/habit-tracker/?lang=zh&amp;quick=1&amp;habit=water&amp;goal=7&amp;surface=zh_habit_tracker_primary','/portal/')}],
    ['guide-quick','quick-route set drifted',v=>{v.guide=v.guide.replace('data-target-slug="todo-list"','data-target-slug="iq-test"')}],
    ['guide-easy-view','qualified exposure contract is incomplete',v=>{v.guide=v.guide.replace('intersectionRatio>=.5','intersectionRatio>=0')}],
    ['guide-sitemap','sitemap row/date is missing',v=>{v.sitemap=v.sitemap.replace(/\s*<url><loc>https:\/\/dopabrain\.com\/portal\/blog\/zh\/habit-tracker-guide\.html<\/loc>[^\n]+/,'')}],
    ['fake-rating','fabricated proof',v=>{v.html=v.html.replace('"offers": {','"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.3","ratingCount":"780"},"offers": {')}],
    ['manual-ad','manual ads',v=>{v.html=v.html.replace('</body>','<ins class="adsbygoogle" data-ad-slot="auto"></ins></body>')}],
    ['fake-ai','fake AI',v=>{v.js+='\nfunction premiumAnalysis(){ return "21 days to form a habit" }'}],
    ['private-count','telemetry leaks habit data',v=>{v.js=v.js.replace("_trackStage('habit_tracker_view')","_trackStage('habit_tracker_view',{habit_count:this.habits.length})")}],
    ['duplicate-engage','synthetic engagement',v=>{v.html=v.html.replace('</body>',"<script>gtag('event','page_engage')</script></body>")}],
    ['unescaped-name','user text escaping is incomplete',v=>{v.js=v.js.split('this.escapeHtml(habit.name)').join('habit.name')}],
    ['premature-share','successful sharing is not gated',v=>{v.html=v.html.replace('await navigator.share({ title, url });','trackShareSuccess(\'web_share\'); await navigator.share({ title, url });')}],
    ['unsafe-sw','service-worker scope or fallback is unsafe',v=>{v.sw=v.sw.replace("url.pathname.startsWith('/habit-tracker/')","url.pathname.startsWith('/')")}],
    ['locale-premium','locale bundles retain fake premium analysis',v=>{v.locales.zh=v.locales.zh.replace('"result": {','"premium":{"title":"AI 习惯分析"},\n  "result": {')}]
  ];
  for(const [name,expected,mutate] of cases){const value=clone(baseline);mutate(value);let message='';try{verifySource(value)}catch(error){message=error.message}assert(message.includes(expected),`${name} mutation escaped: ${message||'verifier passed'}`);console.log(`[PASS] ${name}: ${message}`)}
}

function server(){
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml'};
  return http.createServer((request,response)=>{const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);let base,relative;if(pathname.startsWith('/portal/')){base=PORTAL;relative=pathname.slice(8)}else if(pathname.startsWith('/habit-tracker/')){base=APP;relative=pathname.slice(15)}else{response.writeHead(404);response.end('Not found');return}let file=path.resolve(base,relative);if(!(file===base||file.startsWith(`${base}${path.sep}`))){response.writeHead(403);response.end('Forbidden');return}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){response.writeHead(404);response.end('Not found');return}response.writeHead(200,{'Cache-Control':'no-store','Content-Type':`${types[path.extname(file)]||'application/octet-stream'}; charset=utf-8`});fs.createReadStream(file).pipe(response)});
}

async function prepare(page,local){
  if(local)await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,async route=>{const url=route.request().url();if(/googletagmanager|googlesyndication/.test(url))await route.fulfill({status:200,contentType:'application/javascript',body:''});else await route.abort()});
  await page.addInitScript(()=>{window.dataLayer=[];window.gtag=function(){window.dataLayer.push(arguments)}});
}

async function runtime(guideUrl,local){
  const browser=await chromium.launch({headless:true});const layouts=[];
  try{
    for(const viewport of [{width:390,height:844},{width:1440,height:900}]){const context=await browser.newContext({viewport,serviceWorkers:'block'});const page=await context.newPage();await prepare(page,local);const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForSelector('[data-zh-habit-contract="2026-08-30"]');const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,targets:[...document.querySelectorAll('.cta,.quick-card')].map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));assert(state.overflow===0&&state.h1===1,`Chinese habit guide ${viewport.width}px layout drift: ${JSON.stringify(state)}`);for(const target of state.targets)assert(target.w>=44&&target.h>=44,`Chinese habit guide target below 44px: ${JSON.stringify(target)}`);assert(errors.length===0,`Chinese habit guide errors: ${errors.join(' | ')}`);layouts.push({viewport:viewport.width,overflow:state.overflow});await context.close()}

    const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});const page=await context.newPage();await prepare(page,local);const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});await page.locator('.habit-plan').evaluate(node=>node.scrollIntoView({block:'center'}));await page.waitForTimeout(250);let rows=eventRows(await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[]))));assert(rows.filter(row=>row.name==='content_zh_habit_plan_view').length===0,'Chinese habit qualified view fired before 500ms');await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_zh_habit_plan_view').length===1,null,{timeout:3000});await page.evaluate(()=>document.addEventListener('click',event=>{if(event.target.closest('.cta'))event.preventDefault()},true));await page.click('.cta');rows=eventRows(await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[]))));assert(rows.filter(row=>row.name==='content_cta_click').length===1,'Chinese habit guide CTA event mismatch');const href=await page.locator('.cta').getAttribute('href');assert(href==='/habit-tracker/?lang=zh&quick=1&habit=water&goal=7&surface=zh_habit_tracker_primary',`Chinese habit guide CTA href drifted: ${href}`);
    const origin=new URL(guideUrl).origin;await page.goto(`${origin}${href}`,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForFunction(()=>window.app&&document.documentElement.lang==='zh'&&!document.getElementById('habit-modal').classList.contains('hidden'),null,{timeout:10000});const entry=await page.evaluate(()=>({lang:document.documentElement.lang,name:document.getElementById('habit-name').value,goal:document.getElementById('habit-goal').value,stored:JSON.parse(localStorage.getItem('habits')||'[]').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,layer:(window.dataLayer||[]).map(item=>Array.from(item||[]))}));assert(entry.lang==='zh'&&entry.name.includes('喝水')&&entry.goal==='7'&&entry.stored===0&&entry.overflow===0,`Habit Tracker linked entry mismatch: ${JSON.stringify(entry)}`);rows=eventRows(entry.layer);assert(rows.filter(row=>row.name==='habit_tracker_view').length===1&&rows.filter(row=>row.name==='habit_tracker_quick_form_view').length===1,'Habit Tracker linked view stages mismatch');
    const privateName='<img src=x onerror="window.__habitXss=1">';await page.fill('#habit-name',privateName);await page.click('#habit-form button[type="submit"]');await page.waitForSelector('#habit-result-panel:not(.hidden)');const created=await page.evaluate(()=>({text:document.querySelector('#todays-habits .habit-name')?.textContent||'',images:document.querySelectorAll('#todays-habits .habit-name img').length,xss:window.__habitXss||0,result:document.querySelector('#habit-result-panel h2')?.textContent||'',targets:[...document.querySelectorAll('.tab-btn,.btn,.btn-icon,.share-btn')].filter(node=>node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden').map(node=>({marker:`${node.tagName}.${node.className}#${node.id}`,w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));assert(created.text.includes(privateName)&&created.images===0&&created.xss===0,`Habit Tracker user text escaping failed: ${JSON.stringify(created)}`);assert(/习惯记录已准备好/.test(created.result),`Habit Tracker Chinese result copy mismatch: ${created.result}`);for(const target of created.targets)assert(target.w>=44&&target.h>=44,`Habit Tracker target below 44px: ${JSON.stringify(target)}`);
    await page.click('#todays-habits .habit-checkbox');await page.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:()=>Promise.resolve()}));await page.click('#result-share-btn');await page.waitForTimeout(100);rows=eventRows(await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[]))));for(const name of ['habit_tracker_view','habit_tracker_quick_form_view','habit_tracker_habit_created','habit_tracker_quick_start','habit_tracker_result_view','habit_tracker_first_completion','habit_tracker_share_click','share'])assert(rows.filter(row=>row.name===name).length===1,`Habit Tracker ${name} must fire exactly once`);const payload=JSON.stringify(rows);assert(!payload.includes(privateName)&&!/habit_count|goal_days|template_name|completed_count|completion_rate|habit_template/.test(payload),`Habit Tracker runtime telemetry leaked habit data: ${payload}`);assert(errors.length===0,`Habit Tracker journey errors: ${errors.join(' | ')}`);await context.close();return{layouts,linked:'zh-water-7',view:1,form:1,created:1,completed:1,share:1,private:true};
  }finally{await browser.close()}
}

function parseArgs(argv){const useMutations=argv.includes('--mutations');const index=argv.indexOf('--url');const url=index>=0?argv[index+1]:null;const known=(useMutations?1:0)+(index>=0?2:0);assert(argv.length===known&&!(useMutations&&url),USAGE);if(!url)return{useMutations,url:null};const parsed=new URL(url);assert(parsed.href===LIVE_GUIDE,USAGE);return{useMutations:false,url:parsed.href}}
async function main(){const options=parseArgs(process.argv.slice(2));if(options.url){console.log(`PASS: live Chinese habit-tracker funnel ${JSON.stringify(await runtime(options.url,false))}`);return}const baseline=load();const source=verifySource(baseline);if(options.useMutations)runMutations(baseline);const localServer=server();const address=await listenOnSafePort(localServer);try{console.log(`PASS: Chinese habit-tracker funnel ${JSON.stringify({source,runtime:await runtime(`http://127.0.0.1:${address.port}${GUIDE_ROUTE}`,true)})}`)}finally{await new Promise(resolve=>localServer.close(resolve))}}
main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1});
