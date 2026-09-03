#!/usr/bin/env node
'use strict';
const fs=require('fs'),http=require('http'),path=require('path');
const{chromium}=require('playwright');
const{listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),APP=path.join(ROOT,'projects','stress-check'),LIVE='https://dopabrain.com',ROUTE='/stress-check/';
const LANGS=['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
function ok(value,message){if(!value)throw Error(message)}
function read(file){return fs.readFileSync(path.join(APP,file),'utf8')}
function count(source,regex){return(source.match(regex)||[]).length}
function fixture(){return{html:read('index.html'),app:read('js/app.js'),data:read('js/data.js'),i18n:read('js/i18n.js'),sw:read('sw.js'),manifest:read('manifest.json'),locales:LANGS.map(lang=>read('js/locales/'+lang+'.json'))}}
function source(v){
  ok(v.html.includes('data-stress-check-contract="2026-09-03"'),'release contract missing');
  const sanitizerIndex=v.html.indexOf('const surfaces = new Set'),externalIndex=v.html.indexOf('<script async src="https://pagead2.googlesyndication.com');
  ok(sanitizerIndex>=0&&externalIndex>=0&&sanitizerIndex<externalIndex,'query sanitizer must run before external scripts');
  for(const surface of['zh_cognitive_distortion_primary','fr_cognitive_distortion_primary','es_cognitive_distortion_primary'])ok(v.html.includes(surface),'linked source missing: '+surface);
  for(const linkedSource of['doomscroll_guide_primary','doomscroll_guide_quick','doomscroll_guide_footer'])ok(v.html.includes(linkedSource),'linked source missing: '+linkedSource);
  ok(count(v.html,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)===1&&!/data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\.push/.test(v.html+'\n'+v.app),'Auto Ads contract drifted');
  ok(count(v.data,/id:\s*\d+/g)===15,'exactly 15 questions required');
  ok(count(v.html,/class="related-card"/g)===2,'result must keep exactly two related choices');
  const actionIndex=v.html.indexOf('id="result-primary-action"'),detailIndex=v.html.indexOf('id="radar-list"');
  ok(actionIndex>=0&&detailIndex>=0&&actionIndex<detailIndex,'primary plan action must precede result detail');
  ok(!/gauge-percent|result-canvas|btn-save-image|btn-share|recommendations-section|seo-links|cross-promo\.js/.test(v.html),'retired result clutter returned');
  ok(!/displayRecommendations|RECOMMENDED_APPS|shareResult|saveResultImage|page_engage|stress_ad_impression/.test(v.app+'\n'+v.data+'\n'+v.html),'retired code or synthetic telemetry returned');
  for(const event of['stress_intro_view','stress_intro_cta_view','stress_intro_start_click','test_start','test_complete','stress_result_action_view','stress_plan_click'])ok(v.app.includes("'"+event+"'"),'event missing: '+event);
  ok(/if \(this\.testRunning\) return/.test(v.app),'duplicate start guard missing');
  ok(/intersectionRatio >= 0\.5/.test(v.app)&&/}, 500\)/.test(v.app)&&/clearTimeout\(timer\)/.test(v.app),'qualified result action exposure missing');
  ok(!/(?:answer|score|result|stress_level|categoryScores|totalScore)\s*:/.test(v.app),'private result can enter telemetry');
  ok(/CACHE_NAME = 'stress-check-v6'/.test(v.sw)&&/SCOPE = '\/stress-check\/'/.test(v.sw)&&/url\.origin !== self\.location\.origin/.test(v.sw)&&/url\.pathname\.startsWith\(SCOPE\)/.test(v.sw)&&/if \(r\.ok\)/.test(v.sw),'service-worker boundary drifted');
  const manifest=JSON.parse(v.manifest);ok(manifest.scope==='/stress-check/','manifest scope drifted');
  ok(v.locales.length===12&&v.locales.every(text=>{const j=JSON.parse(text);return!text.includes('\uFFFD')&&j.trust?.rule&&j.trust?.boundary&&j.trust?.resultBoundary&&j.button?.actionPlan&&j.result?.title}),'12-locale trust/action contract missing');
  const schemas=[...v.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(row=>JSON.parse(row[1]));ok(schemas.map(x=>x['@type']).join(',')==='SoftwareApplication,BreadcrumbList'&&schemas[0].dateModified==='2026-09-03','schema contract drifted');
  return{questions:15,locales:12,related:2,appBytes:Buffer.byteLength(v.html)+Buffer.byteLength(v.app)+Buffer.byteLength(v.data)};
}
function mutations(){const cases=[
  ['contract',v=>v.html=v.html.replace('data-stress-check-contract','broken-contract')],
  ['sanitizer-order',v=>v.html=v.html.replace('const surfaces = new Set','const removedSurfaces = new Set')],
  ['source',v=>v.html=v.html.replace('fr_cognitive_distortion_primary','removed_source')],
  ['doomscroll-source',v=>v.html=v.html.replace('doomscroll_guide_primary','removed_source')],
  ['manual-ad',v=>v.html=v.html.replace('<body>','<body><ins class="adsbygoogle" data-ad-slot="1"></ins>')],
  ['question',v=>v.data=v.data.replace('id: 15','removed: 15')],
  ['related',v=>v.html=v.html.replace('class="related-card"','class="removed-card"')],
  ['hierarchy',v=>v.html=v.html.replace('<div class="result-primary-action" id="result-primary-action">','')],
  ['clutter',v=>v.html=v.html.replace('<body>','<body><canvas id="result-canvas"></canvas>')],
  ['event',v=>v.app=v.app.replaceAll("'stress_result_action_view'","'removed_action_view'")],
  ['duplicate-start',v=>v.app=v.app.replace('if (this.testRunning) return;','')],
  ['easy-view',v=>v.app=v.app.replace('intersectionRatio >= 0.5','intersectionRatio >= 0')],
  ['private-event',v=>v.app=v.app.replace("this.track('test_complete', { content_type: 'reflection'","this.track('test_complete', { result: this.stressLevel")],
  ['unsafe-sw',v=>v.sw=v.sw.replace("SCOPE = '/stress-check/'","SCOPE = '/'")],
  ['locale',v=>v.locales[0]=v.locales[0].replace('"resultBoundary"','"removedBoundary"')],
  ['schema',v=>v.html=v.html.replace('"dateModified": "2026-09-03"','"dateModified": "2026-08-30"')]
];for(const[name,mutate]of cases){const v=fixture();mutate(v);try{source(v)}catch(error){console.log('[PASS] '+name+': '+error.message);continue}throw Error('mutation escaped: '+name)}console.log('[PASS] mutation summary '+cases.length+'/'+cases.length+' detected')}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function server(){return http.createServer((req,res)=>{const url=new URL(req.url,'http://x');let relative=decodeURIComponent(url.pathname).replace(/^\/stress-check\/?/,'');if(!relative||relative.endsWith('/'))relative+='index.html';let file=path.resolve(APP,relative);if(!file.startsWith(APP+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory())return res.writeHead(404).end();res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(res)})}
function events(page){return page.evaluate(()=>(window.dataLayer||[]).map(row=>Array.from(row||[])).filter(row=>row[0]==='event').map(row=>({name:row[1],params:row[2]||{}})))}
async function isolate(page){for(const host of['**/googletagmanager.com/**','**/googlesyndication.com/**','**/doubleclick.net/**'])await page.route(host,route=>route.abort())}
async function complete(page){await page.evaluate(()=>{app.startTest('intro_primary_cta','manual');app.startTest('intro_primary_cta','manual')});for(let i=0;i<15;i++){await page.click('.option-btn:first-child');if(i<14){await page.waitForFunction(index=>document.querySelector('#progress-text')?.textContent.trim()===`${index} / 15`,i+2);ok(await page.evaluate(()=>document.activeElement?.id)==='question-text','question focus failed')}}await page.waitForSelector('#result-screen.active');}
async function runtime(live){let local,origin;if(live)origin=LIVE;else{local=server();origin='http://127.0.0.1:'+(await listenOnSafePort(local)).port}const browser=await chromium.launch({headless:true});try{
  for(const width of[390,1440]){const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await isolate(page);await page.goto(origin+ROUTE+'?lang=en&bad=drop#secret',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.app&&document.documentElement.lang==='en');ok(await page.evaluate(()=>location.search)==='?lang=en'&&await page.evaluate(()=>location.hash)==='',width+' query/hash sanitizer failed');ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' intro overflow');await page.waitForFunction(()=>(dataLayer||[]).some(x=>x[0]==='event'&&x[1]==='stress_intro_cta_view'));await complete(page);ok(await page.locator('#result-primary-action').evaluate(el=>el.getBoundingClientRect().top)<await page.locator('.detail-section').first().evaluate(el=>el.getBoundingClientRect().top),width+' action hierarchy failed');await page.evaluate(()=>{const action=document.querySelector('#result-primary-action');window.__center=setInterval(()=>action.scrollIntoView({block:'center'}),100)});await page.waitForFunction(()=>(dataLayer||[]).filter(x=>x[0]==='event'&&x[1]==='stress_result_action_view').length===1,null,{timeout:8000});await page.evaluate(()=>clearInterval(window.__center));const action=page.locator('#btn-action-plan');await action.evaluate(el=>el.addEventListener('click',event=>event.preventDefault()));await action.click();await action.click();const rows=await events(page);for(const name of['stress_intro_view','stress_intro_cta_view','stress_intro_start_click','test_start','test_complete','stress_result_action_view','stress_plan_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' must fire once');ok(!rows.flatMap(row=>Object.keys(row.params)).some(key=>/(answer|score|result|level|category)/i.test(key)),width+' private event key leaked');ok(errors.length===0,width+' errors: '+errors.join('; '));await context.close()}
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});const page=await context.newPage();await isolate(page);for(const lang of LANGS){await page.goto(origin+ROUTE+'?lang='+lang,{waitUntil:'domcontentloaded'});await page.waitForFunction(value=>window.app&&document.documentElement.lang===value,lang);await page.evaluate(()=>{STRESS_QUESTIONS.forEach(q=>app.answers[q.id]=3);app.calculateResults();app.displayResults()});ok(!(await page.locator('#result-level-title').textContent()).includes('results.'),'locale result key leaked: '+lang)}await page.goto(origin+ROUTE+'?lang=fr&start=1&surface=fr_cognitive_distortion_primary&bad=drop',{waitUntil:'domcontentloaded'});await page.waitForSelector('#question-screen.active');ok(new URL(page.url()).search==='?lang=fr&start=1&surface=fr_cognitive_distortion_primary','linked sanitizer failed');const linked=await events(page);ok(linked.filter(row=>row.name==='test_start').length===1,'linked auto-start duplicated');await context.close();return{origin,viewports:2,locales:12,questions:15,private:true}
}finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}}
async function main(){const args=process.argv.slice(2),index=args.indexOf('--url'),live=index>=0?args[index+1]:'';if(live&&new URL(live).origin!==LIVE)throw Error('live origin mismatch');const staticResult=source(fixture());if(args.includes('--mutations'))mutations();console.log('[PASS] Stress core '+JSON.stringify({source:staticResult,runtime:await runtime(live)}))}
main().catch(error=>{console.error('[FAIL] '+error.stack);process.exitCode=1});
