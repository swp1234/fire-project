#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const PORTAL = path.join(PROJECTS, 'portal');
const APP = path.join(PROJECTS, 'detox-timer');
const GUIDE_PATH = path.join(PORTAL, 'blog', 'es', 'dopamine-detox-guide-reset-brain.html');
const APP_HTML_PATH = path.join(APP, 'index.html');
const APP_JS_PATH = path.join(APP, 'js', 'app.js');
const SW_PATH = path.join(APP, 'sw.js');
const INDEX_PATH = path.join(PORTAL, 'blog', 'es', 'index.html');
const SITEMAP_PATH = path.join(PORTAL, 'blog', 'sitemap.xml');
const GUIDE_URL_PATH = '/portal/blog/es/dopamine-detox-guide-reset-brain.html';
const APP_URL_PATH = '/detox-timer/';
const LIVE_GUIDE = `https://dopabrain.com${GUIDE_URL_PATH}`;
const QUICK_TARGETS = ['detox-timer','pomodoro-timer','habit-tracker','white-noise'];
const LOCALES = ['ko','en','ja','es','pt','zh','id','tr','de','fr','hi','ru'];
const USAGE = `Usage:\n  node scripts/verify-es-dopamine-break.js [--mutations]\n  node scripts/verify-es-dopamine-break.js --url ${LIVE_GUIDE}`;

function assert(condition, message) { if (!condition) throw new Error(message); }
function count(text, pattern) { return (text.match(pattern) || []).length; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function visibleText(html) { return html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' '); }
function parseJsonLd(html) { return [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(match=>JSON.parse(match[1])); }

function loadFixture() {
  return {
    guide: fs.readFileSync(GUIDE_PATH,'utf8'),
    appHtml: fs.readFileSync(APP_HTML_PATH,'utf8'),
    appJs: fs.readFileSync(APP_JS_PATH,'utf8'),
    sw: fs.readFileSync(SW_PATH,'utf8'),
    index: fs.readFileSync(INDEX_PATH,'utf8'),
    sitemap: fs.readFileSync(SITEMAP_PATH,'utf8'),
    locales: Object.fromEntries(LOCALES.map(locale=>[locale,fs.readFileSync(path.join(APP,'js','locales',`${locale}.json`),'utf8')]))
  };
}

function verifySource(fixture) {
  const { guide, appHtml, appJs, sw, index, sitemap, locales } = fixture;
  const text = visibleText(guide);
  assert(guide.includes('data-dopamine-break-contract="2026-08-30"'), 'Spanish dopamine-break release marker is missing');
  assert(guide.includes('<meta name="dateModified" content="2026-08-30">'), 'Spanish dopamine-break dateModified is stale');
  assert(guide.includes(`<link rel="canonical" href="${LIVE_GUIDE}">`), 'Spanish dopamine-break canonical drifted');
  assert(count(guide,/rel="alternate"\s+hreflang=/g)===2,'Spanish dopamine-break hreflang must be es plus x-default');
  assert(count(guide,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi)===1,'Spanish dopamine-break guide must have exactly one Auto Ads loader');
  assert(!/FAQPage|AggregateRating|content_ad_impression/.test(guide),'Spanish dopamine-break guide retains unsupported schema or synthetic ad telemetry');
  assert(!/resetear el sistema de recompensa|restaurar niveles saludables|sobrecarga de dopamina|disminuyendo los receptores|cerebro (?:se )?recalibr|estrategias respaldadas por la ciencia|beneficiarse de un detox/i.test(text),'Spanish dopamine-break guide retains an unsupported health claim');
  assert(/no puedes “desintoxicar”/i.test(text)&&/no diagnóstico ni tratamiento/i.test(text)&&/no trata depresión/i.test(text),'Spanish dopamine-break health boundary is missing');
  assert(guide.includes('href="/detox-timer/?lang=es&amp;minutes=10&amp;source=es_dopamine_detox_primary"'),'Primary Spanish timer bridge is broken');
  const quick=[...guide.matchAll(/<a class="quick-card"[^>]*data-target-slug="([^"]+)"/g)].map(match=>match[1]);
  assert(JSON.stringify(quick)===JSON.stringify(QUICK_TARGETS),'Spanish dopamine-break quick-route set drifted');
  assert(count(guide,/<li><a href="https:\/\//g)===4,'Spanish dopamine-break source list must contain four direct sources');
  assert(/intersectionRatio>=0\.5/.test(guide)&&/},500\)/.test(guide)&&/observe\(document\.querySelector\('\.reset-actions'\)\)/.test(guide),'Qualified behavior-break exposure contract is incomplete');
  assert(/resetUseSent/.test(guide)&&/content_dopamine_break_use/.test(guide),'Exact-once behavior-break use telemetry is missing');
  assert(!/track\('content_dopamine_break_use',[\s\S]{0,150}(?:button\.dataset|data-plan|feed|alerts|reopen)/.test(guide),'Behavior-break telemetry leaks the selected plan');
  assert(/track\('content_cta_click',params\)/.test(guide),'Spanish dopamine-break CTA telemetry is missing');
  const guideSchemas=parseJsonLd(guide);const guideTypes=guideSchemas[0]?.['@graph']?.map(item=>item['@type'])||[];
  assert(guideSchemas.length===1&&JSON.stringify(guideTypes)===JSON.stringify(['Article','BreadcrumbList']),'Spanish dopamine-break schema must contain Article and Breadcrumb only');
  assert(sitemap.includes(`<loc>${LIVE_GUIDE}</loc><lastmod>2026-08-30</lastmod>`),'Spanish dopamine-break sitemap row/date is missing');
  const card=index.match(/<a href="\/portal\/blog\/es\/dopamine-detox-guide-reset-brain\.html"[\s\S]*?<\/a>/)?.[0]||'';
  assert(card.includes('límites y plan de 10 minutos')&&!/resetea|cerebro/i.test(card),'Spanish catalog retains the old reset claim');

  assert(appHtml.includes('data-detox-timer-contract="2026-08-30"'),'Detox Timer release marker is missing');
  assert(appHtml.includes('<meta name="dateModified" content="2026-08-30">'),'Detox Timer dateModified is stale');
  assert(count(appHtml,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi)===1,'Detox Timer must have exactly one Auto Ads loader');
  assert(!/AggregateRating|FAQPage|50[,. ]?000|2[,.]?300|page_engage|premium-analysis|premium-modal|premiumBtn|socialProof/.test(`${appHtml}${appJs}${Object.values(locales).join('')}`),'Detox Timer retains fabricated proof, unsupported schema, or fake premium output');
  assert(!/showInterstitialAd|closeInterstitialAd|close-ad-btn|interstitial-ad/.test(`${appHtml}${appJs}`),'Detox Timer retains a fake interstitial gate');
  const appTypes=parseJsonLd(appHtml).map(schema=>schema['@type']);
  assert(JSON.stringify(appTypes)===JSON.stringify(['MobileApplication','BreadcrumbList']),'Detox Timer schema types drifted');
  assert(/allowed\.includes\(requested\)/.test(appJs)&&/this\.selectedMinutes = requested/.test(appJs),'Detox Timer linked duration preset is missing');
  assert(/detox_timer_view/.test(appJs)&&/detox_timer_start/.test(appJs)&&/detox_timer_complete/.test(appJs)&&/detox_timer_abort/.test(appJs),'Detox Timer funnel telemetry is incomplete');
  assert(/this\.timerStartSent/.test(appJs)&&/this\.timerOutcomeSent/.test(appJs),'Detox Timer exact-once telemetry guards are missing');
  assert(!/this\.track\([^;\n]*(?:selectedMinutes|remainingSeconds|totalSeconds)[^;\n]*\)/.test(appJs),'Detox Timer telemetry leaks session duration');
  assert(/translate\('complete\.success\.title'/.test(appJs)&&/translate\('complete\.failed\.message'/.test(appJs),'Detox Timer completion localization is missing');
  assert(/navigator\.clipboard\.writeText[\s\S]*?\.then\(function\(\)[\s\S]*?gtag\('event','share'/.test(appHtml)&&!/gtag\('event','share'[^;]*;\s*navigator\.clipboard\.writeText/.test(appHtml),'Detox Timer clipboard share is not success-gated');
  assert(/detox-timer-v2/.test(sw)&&/requestUrl\.origin !== self\.location\.origin/.test(sw)&&/fetchResponse\.ok/.test(sw),'Detox Timer service-worker safety contract is incomplete');
  for(const locale of LOCALES){const parsed=JSON.parse(locales[locale]);assert(parsed.app&&!parsed.app.socialProof&&parsed.complete&&!parsed.complete.premiumBtn&&!parsed.premium,`Detox Timer ${locale} retains fake proof or premium keys`);}
  const es=JSON.parse(locales.es);
  assert(es.hero.title==='Haz una pausa de la pantalla'&&/pausa de pantalla/.test(es.app.description),'Detox Timer Spanish trust copy is stale');
  return {guideSchemas:guideTypes.length,quickRoutes:quick.length,sources:4,appLocales:LOCALES.length,submitted:1};
}

function runMutations(baseline){
  const mutations=[
    ['hidden-faq','unsupported schema',v=>{v.guide+='<script type="application/ld+json">{"@type":"FAQPage"}</script>';}],
    ['stale-guide-date','dateModified is stale',v=>{v.guide=v.guide.replace('dateModified" content="2026-08-30','dateModified" content="2026-06-19');}],
    ['health-claim','unsupported health claim',v=>{v.guide=v.guide.replace('No puedes “desintoxicar”','Puedes resetear el sistema de recompensa y restaurar niveles saludables. No puedes “desintoxicar”');}],
    ['missing-boundary','health boundary is missing',v=>{v.guide=v.guide.replace('no diagnóstico ni tratamiento','consejo de tratamiento').replace('no trata depresión','cura depresión');}],
    ['broken-primary','Primary Spanish timer bridge is broken',v=>{v.guide=v.guide.replace('/detox-timer/?lang=es&amp;minutes=10&amp;source=es_dopamine_detox_primary','/portal/');}],
    ['quick-drift','quick-route set drifted',v=>{v.guide=v.guide.replace('data-target-slug="white-noise"','data-target-slug="dopamine-type"');}],
    ['missing-source','source list must contain four',v=>{v.guide=v.guide.replace('<li><a href="https://support.apple.com','<li><a href="/portal/');}],
    ['tracking-too-easy','Qualified behavior-break exposure contract is incomplete',v=>{v.guide=v.guide.replace('entry.intersectionRatio>=0.5','entry.intersectionRatio>=0');}],
    ['selection-leak','telemetry leaks the selected plan',v=>{v.guide=v.guide.replace("{interaction_name:'ten_minute_behavior_break'}","{interaction_name:'ten_minute_behavior_break',plan:button.dataset.plan}");}],
    ['missing-cta','CTA telemetry is missing',v=>{v.guide=v.guide.replace("track('content_cta_click',params)","track('content_related_click',params)");}],
    ['missing-sitemap','sitemap row/date is missing',v=>{v.sitemap=v.sitemap.replace(`  <url><loc>${LIVE_GUIDE}</loc><lastmod>2026-08-30</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`,'');}],
    ['catalog-claim','catalog retains the old reset claim',v=>{v.index=v.index.replace('Detox de dopamina: límites y plan de 10 minutos','Detox de dopamina: resetea tu cerebro');}],
    ['fake-rating','fabricated proof',v=>{v.appHtml=v.appHtml.replace('"offers": {','"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.6","ratingCount":"2300"},"offers": {');}],
    ['fake-social-proof','fabricated proof',v=>{const parsed=JSON.parse(v.locales.es);parsed.app.socialProof='50,000 usuarios';v.locales.es=JSON.stringify(parsed);}],
    ['fake-ad-gate','fake interstitial gate',v=>{v.appJs=v.appJs.replace('giveUp() {','showInterstitialAd() {}\n    giveUp() {');}],
    ['missing-preset','linked duration preset is missing',v=>{v.appJs=v.appJs.replace('this.selectedMinutes = requested','this.requestedMinutes = requested');}],
    ['missing-funnel-event','funnel telemetry is incomplete',v=>{v.appJs=v.appJs.replace("'detox_timer_start'","'timer_start_removed'");}],
    ['duration-leak','telemetry leaks session duration',v=>{v.appJs=v.appJs.replace("this.track('detox_timer_start');","this.track('detox_timer_start',{selectedMinutes:this.selectedMinutes});");}],
    ['stale-es-copy','Spanish trust copy is stale',v=>{const parsed=JSON.parse(v.locales.es);parsed.hero.title='Reinicia tu cerebro';v.locales.es=JSON.stringify(parsed);}],
    ['unsafe-sw-origin','service-worker safety contract is incomplete',v=>{v.sw=v.sw.replace("requestUrl.origin !== self.location.origin","requestUrl.origin === self.location.origin");}],
    ['premature-share','clipboard share is not success-gated',v=>{v.appHtml=v.appHtml.replace("navigator.clipboard.writeText(window.location.href).then(function(){","if(typeof gtag!=='undefined')gtag('event','share',{method:'url_copy'});navigator.clipboard.writeText(window.location.href).then(function(){");}],
  ];
  for(const [name,expected,mutate] of mutations){const fixture=clone(baseline);mutate(fixture);let message='';try{verifySource(fixture)}catch(error){message=error.message}assert(message.includes(expected),`${name} mutation escaped: ${message||'verifier passed'}`);console.log(`[PASS] ${name}: ${message}`);}
}

function createServer(){
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.webmanifest':'application/manifest+json'};
  return http.createServer((request,response)=>{const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);let base,relative;if(pathname.startsWith('/portal/')){base=PORTAL;relative=pathname.slice('/portal/'.length)}else if(pathname.startsWith('/detox-timer/')){base=APP;relative=pathname.slice('/detox-timer/'.length)}else{response.writeHead(404);response.end('Not found');return}let file=path.resolve(base,relative);if(!(file===base||file.startsWith(`${base}${path.sep}`))){response.writeHead(403);response.end('Forbidden');return}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){response.writeHead(404);response.end('Not found');return}response.writeHead(200,{'Cache-Control':'no-store','Content-Type':`${types[path.extname(file)]||'application/octet-stream'}; charset=utf-8`});fs.createReadStream(file).pipe(response)});
}

function browserEvents(layer){return layer.map(item=>Array.from(item||[])).filter(item=>item[0]==='event').map(item=>({name:item[1],params:item[2]||{}}));}

async function runtimeCheck(guideUrl,local){
  const browser=await chromium.launch({headless:true});const layouts=[];
  try{
    for(const viewport of [{width:390,height:844},{width:1440,height:900}]){const context=await browser.newContext({viewport,serviceWorkers:'block'});if(local)await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));try{await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForSelector('[data-dopamine-break-contract="2026-08-30"]');const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,targets:[...document.querySelectorAll('.cta,.quick-card,.reset-choice,.related a')].map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));assert(state.overflow===0&&state.h1===1,`Spanish dopamine-break ${viewport.width}px layout drift: ${JSON.stringify(state)}`);for(const target of state.targets)assert(target.w>=44&&target.h>=44,`Spanish dopamine-break target below 44px: ${JSON.stringify(target)}`);assert(errors.length===0,`Spanish dopamine-break page errors: ${errors.join(' | ')}`);layouts.push({viewport:viewport.width,overflow:state.overflow});}finally{await context.close();}}

    const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});if(local)await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());const page=await context.newPage();const errors=[];const captured=[];page.on('pageerror',error=>errors.push(String(error)));try{
      await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});await page.exposeFunction('__captureDopamineEvent',(name,params)=>captured.push({name,params}));await page.evaluate(()=>{const original=window.gtag;window.gtag=(...args)=>{if(args[0]==='event')window.__captureDopamineEvent(args[1],args[2]||{});return original?.(...args)}});if(!local)await page.waitForTimeout(1200);
      await page.locator('.reset-actions').evaluate(node=>node.scrollIntoView({block:'center'}));await page.waitForTimeout(250);let events=browserEvents(await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[]))));assert(events.filter(event=>event.name==='content_dopamine_break_view').length===0,'Behavior-break view fired before 500ms');await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_dopamine_break_view').length===1,null,{timeout:3000});await page.locator('[data-plan="feed"]').click();await page.locator('[data-plan="reopen"]').click();const choice=await page.evaluate(()=>({pressed:[...document.querySelectorAll('.reset-choice')].map(node=>node.getAttribute('aria-pressed')),output:document.querySelector('[data-reset-output]')?.textContent,layer:(window.dataLayer||[]).map(item=>Array.from(item||[])),url:location.href,storage:Object.keys(localStorage)}));events=browserEvents(choice.layer);const uses=events.filter(event=>event.name==='content_dopamine_break_use');assert(uses.length===1&&uses[0].params.interaction_name==='ten_minute_behavior_break','Behavior-break use must fire exactly once');assert(!/feed|alerts|reopen|plan|choice/i.test(JSON.stringify(uses[0].params)),'Behavior-break runtime telemetry leaked the selected plan');assert(choice.pressed.join(',')==='false,false,true'&&/primera pantalla/i.test(choice.output),'Behavior-break state/output mismatch');assert(!/feed|alerts|reopen/i.test(`${choice.url}${JSON.stringify(choice.storage)}`),'Behavior-break selection leaked to URL or browser storage');
      await page.locator('.primary').evaluate(node=>node.scrollIntoView({block:'center'}));await Promise.all([page.waitForURL(/\/detox-timer\/\?lang=es&minutes=10&source=es_dopamine_detox_primary/),page.click('.primary .cta')]);assert(captured.filter(event=>event.name==='content_cta_click'&&event.params.target_slug==='detox-timer').length===1,'Spanish timer CTA click did not fire exactly once');await page.waitForFunction(()=>document.documentElement.lang==='es'&&window.detoxTimer&&document.getElementById('app-loader')?.style.display==='none',null,{timeout:10000});const appEntry=await page.evaluate(()=>({lang:document.documentElement.lang,selected:[...document.querySelectorAll('.time-btn.selected')].map(node=>node.dataset.minutes),setup:document.getElementById('setup-screen')?.classList.contains('active'),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,targets:[...document.querySelectorAll('button,a')].filter(node=>node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden').map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height})),layer:(window.dataLayer||[]).map(item=>Array.from(item||[])),url:location.href}));assert(appEntry.lang==='es'&&appEntry.selected.join(',')==='10'&&appEntry.setup&&appEntry.overflow===0,`Spanish timer entry mismatch: ${JSON.stringify(appEntry)}`);for(const target of appEntry.targets)assert(target.w>=44&&target.h>=44,`Detox Timer mobile target below 44px: ${JSON.stringify(target)}`);assert(browserEvents(appEntry.layer).filter(event=>event.name==='detox_timer_view'&&event.params.entry_surface==='es_dopamine_detox_primary').length===1,'Detox Timer linked view event mismatch');
      await page.click('#start-btn');await page.evaluate(()=>{window.detoxTimer.remainingSeconds=0;window.detoxTimer.tick()});const completed=await page.evaluate(()=>({title:document.getElementById('complete-title')?.textContent,message:document.getElementById('complete-message')?.textContent,active:document.getElementById('complete-screen')?.classList.contains('active'),layer:(window.dataLayer||[]).map(item=>Array.from(item||[]))}));const appEvents=browserEvents(completed.layer);assert(appEvents.filter(event=>event.name==='detox_timer_start').length===1&&appEvents.filter(event=>event.name==='detox_timer_complete').length===1,'Detox Timer start/complete events must fire exactly once');assert(!/selectedMinutes|remainingSeconds|totalSeconds/.test(JSON.stringify(appEvents)),'Detox Timer runtime telemetry leaked session duration');assert(completed.active&&/felicitaciones/i.test(completed.title)&&/completado/i.test(completed.message),`Detox Timer Spanish completion mismatch: ${JSON.stringify(completed)}`);
      const appUrl=`${new URL(guideUrl).origin}${APP_URL_PATH}?lang=es&minutes=10&source=es_dopamine_detox_primary`;
      await page.setViewportSize({width:1440,height:900});await page.goto(appUrl,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForFunction(()=>document.documentElement.lang==='es'&&window.detoxTimer&&document.getElementById('app-loader')?.style.display==='none',null,{timeout:10000});const desktopApp=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,targets:[...document.querySelectorAll('button,a')].filter(node=>node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden').map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));assert(desktopApp.overflow===0,`Detox Timer desktop overflow: ${desktopApp.overflow}`);for(const target of desktopApp.targets)assert(target.w>=44&&target.h>=44,`Detox Timer desktop target below 44px: ${JSON.stringify(target)}`);
      await page.setViewportSize({width:390,height:844});await page.goto(appUrl,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForFunction(()=>document.documentElement.lang==='es'&&window.detoxTimer&&document.getElementById('app-loader')?.style.display==='none',null,{timeout:10000});await page.click('#start-btn');await page.click('#give-up-btn');const aborted=await page.evaluate(()=>({title:document.getElementById('complete-title')?.textContent,message:document.getElementById('complete-message')?.textContent,active:document.getElementById('complete-screen')?.classList.contains('active'),fakeGate:Boolean(document.querySelector('#interstitial-ad,#close-ad-btn')),layer:(window.dataLayer||[]).map(item=>Array.from(item||[]))}));const abortEvents=browserEvents(aborted.layer);assert(aborted.active&&!aborted.fakeGate&&/no del todo/i.test(aborted.title)&&/intenta/i.test(aborted.message),`Detox Timer immediate abort mismatch: ${JSON.stringify(aborted)}`);assert(abortEvents.filter(event=>event.name==='detox_timer_start').length===1&&abortEvents.filter(event=>event.name==='detox_timer_abort').length===1,'Detox Timer start/abort events must fire exactly once');assert(errors.length===0,`Spanish dopamine funnel errors: ${errors.join(' | ')}`);return{layouts,appLayouts:[390,1440],breakView:1,breakUse:1,cta:1,appView:1,start:1,complete:1,abort:1,destination:'detox-timer-es-10'};
    }finally{await context.close();}
  }finally{await browser.close();}
}

function parseArgs(argv){const mutations=argv.includes('--mutations');const urlIndex=argv.indexOf('--url');const url=urlIndex>=0?argv[urlIndex+1]:null;const known=(mutations?1:0)+(urlIndex>=0?2:0);assert(argv.length===known&&!(mutations&&url),USAGE);if(!url)return{mutations,url:null};const parsed=new URL(url);assert(parsed.href===LIVE_GUIDE,USAGE);return{mutations:false,url:parsed.href};}

async function main(){const args=parseArgs(process.argv.slice(2));if(args.url){console.log(`PASS: live Spanish dopamine-break funnel ${JSON.stringify(await runtimeCheck(args.url,false))}`);return}const fixture=loadFixture();const source=verifySource(fixture);if(args.mutations)runMutations(fixture);const server=createServer();const address=await listenOnSafePort(server);try{const runtime=await runtimeCheck(`http://127.0.0.1:${address.port}${GUIDE_URL_PATH}`,true);console.log(`PASS: Spanish dopamine-break funnel ${JSON.stringify({source,runtime})}`)}finally{await new Promise(resolve=>server.close(resolve));}}

main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1;});
