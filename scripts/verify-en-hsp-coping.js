#!/usr/bin/env node
'use strict';
const fs=require('fs'),http=require('http'),path=require('path');
const{chromium}=require('playwright');
const{listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),PORTAL=path.join(ROOT,'projects','portal'),HSP=path.join(ROOT,'projects','hsp-test');
const GUIDE='/portal/blog/en/hsp-coping-strategies-highly-sensitive.html',RESET='/hsp-test/reset.html',MAP='/hsp-test/map.html',LIVE='https://dopabrain.com';
function ok(value,message){if(!value)throw Error(message)}
function read(file){return fs.readFileSync(file,'utf8')}
function count(source,regex){return(source.match(regex)||[]).length}
function visible(html){return html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')}
function fixture(){return{guide:read(path.join(PORTAL,'blog','en','hsp-coping-strategies-highly-sensitive.html')),catalog:read(path.join(PORTAL,'blog','en','index.html')),sitemap:read(path.join(PORTAL,'blog','sitemap.xml')),inventory:read(path.join(ROOT,'scripts','indexing-inventory.js')),resetHtml:read(path.join(HSP,'reset.html')),resetJs:read(path.join(HSP,'js','reset.js')),mapJs:read(path.join(HSP,'js','map.js'))}}
function source(v){
  const text=visible(v.guide),resetRoute='/hsp-test/reset.html?lang=en&amp;source=blog_sensory_bridge';
  ok(v.guide.includes('data-en-hsp-coping-contract="2026-09-03"'),'guide contract missing');
  ok(v.guide.includes('<meta name="dateModified" content="2026-09-03">'),'modified date stale');
  ok(Buffer.byteLength(v.guide)<26000,'guide is no longer compact');
  for(const phrase of['It is not a medical diagnosis','experiments for comfort and planning—not HSP-specific treatments','small, task-specific study cannot establish','18 participants','13 returning for a second scan'])ok(text.includes(phrase),'research boundary missing: '+phrase);
  for(const forbidden of['15-20%','brain literally','absorb others feelings like a sponge','science-based assessment','decades validated','enormous difference','1:1 recovery ratio'])ok(!text.toLowerCase().includes(forbidden.toLowerCase()),'unsupported claim returned: '+forbidden);
  for(const url of['pubmed.ncbi.nlm.nih.gov/9248053/','pubmed.ncbi.nlm.nih.gov/30639671/','pmc.ncbi.nlm.nih.gov/articles/PMC4086365/'])ok(v.guide.includes(url),'research source missing: '+url);
  ok(count(v.guide,new RegExp(resetRoute.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))===2,'two identical reset routes required');
  ok(count(v.guide,/class="quick-card related-link"/g)===2&&v.guide.includes('data-quick-rail-mode="focused"'),'focused two-choice rail drifted');
  for(const event of['content_view','content_en_hsp_coping_plan_view','content_cta_click','content_related_click'])ok(v.guide.includes("'"+event+"'")||v.guide.includes(event),'guide event missing: '+event);
  ok(/intersectionRatio>=\.5/.test(v.guide)&&/},500\)/.test(v.guide)&&/clearTimeout\(timer\)/.test(v.guide),'qualified 50%/500ms view missing');
  ok(count(v.guide,/\/portal\/js\/ad-loader\.js/g)===1&&!/FAQPage|AggregateRating|content_ad_impression|cross-promo\.js|data-ad-slot|<ins[^>]+adsbygoogle/i.test(v.guide),'schema, ads or synthetic telemetry drifted');
  const schemas=[...v.guide.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(row=>JSON.parse(row[1]));
  ok(schemas.length===1&&schemas[0]['@graph'].map(item=>item['@type']).join(',')==='Article,BreadcrumbList','schema graph drifted');
  ok(v.catalog.includes('HSP Coping Strategies: A Practical Sensory Plan')&&v.catalog.includes("'6 min'"),'English catalog stale');
  ok(v.sitemap.includes('<loc>'+LIVE+GUIDE+'</loc><lastmod>2026-09-03</lastmod>'),'focused sitemap row missing');
  ok(v.inventory.includes('`${ORIGIN}'+GUIDE+'`'),'focused rail allowlist missing');
  for(const code of[v.resetHtml,v.resetJs,v.mapJs])ok(code.includes('blog_sensory_bridge'),'linked tool source allowlist missing');
  ok(!/(?:profile|result|trigger|place|capacity)=/.test(v.guide),'private selection entered guide URL');
  return{bytes:Buffer.byteLength(v.guide),steps:3,quick:2,sources:3};
}
function mutations(){
  const cases=[
    ['contract',v=>v.guide=v.guide.replace('data-en-hsp-coping-contract','broken-contract')],
    ['boundary',v=>v.guide=v.guide.replace('It is not a medical diagnosis','It is a medical diagnosis')],
    ['claim',v=>v.guide=v.guide.replace('18 participants','15-20% of people')],
    ['sample',v=>v.guide=v.guide.replace('13 returning for a second scan','sample removed')],
    ['source',v=>v.guide=v.guide.replace('pubmed.ncbi.nlm.nih.gov/9248053/','example.invalid/')],
    ['route',v=>v.guide=v.guide.replace('source=blog_sensory_bridge','source=broken')],
    ['rail',v=>v.guide=v.guide.replace('data-quick-rail-mode="focused"','data-quick-rail-mode="wide"')],
    ['view',v=>v.guide=v.guide.replace('intersectionRatio>=.5','intersectionRatio>=0')],
    ['ad',v=>v.guide=v.guide.replace('<body>','<body><div data-ad-slot="fake"></div>')],
    ['schema',v=>v.guide=v.guide.replace('BreadcrumbList','FAQPage')],
    ['catalog',v=>v.catalog=v.catalog.replace('HSP Coping Strategies: A Practical Sensory Plan','Stale HSP guide')],
    ['sitemap',v=>v.sitemap=v.sitemap.replace(LIVE+GUIDE,'https://removed.invalid/')],
    ['inventory',v=>v.inventory=v.inventory.replace(GUIDE,'/portal/blog/en/removed.html')],
    ['allowlist',v=>v.resetJs=v.resetJs.replace("'blog_sensory_bridge'", "'removed_source'")]
  ];
  for(const[name,mutate]of cases){const v=fixture();mutate(v);try{source(v)}catch(error){console.log('[PASS] '+name+': '+error.message);continue}throw Error('mutation escaped: '+name)}
  console.log('[PASS] mutation summary '+cases.length+'/'+cases.length+' detected');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function server(){return http.createServer((req,res)=>{const url=new URL(req.url,'http://x'),match=decodeURIComponent(url.pathname).match(/^\/([^/]+)\/(.*)$/);if(!match)return res.writeHead(404).end();const root=match[1]==='portal'?PORTAL:match[1]==='hsp-test'?HSP:null;if(!root)return res.writeHead(404).end();let file=path.resolve(root,match[2]||'index.html');if(!file.startsWith(path.resolve(root)+path.sep)&&file!==path.resolve(root,'index.html'))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file))return res.writeHead(404).end();res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(res)})}
function records(page){return page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[])).filter(item=>item[0]==='event').map(item=>({name:item[1],params:item[2]||{}})))}
async function isolate(page){for(const host of['**/googletagmanager.com/**','**/googlesyndication.com/**','**/doubleclick.net/**'])await page.route(host,route=>route.abort())}
async function runtime(live){let local,origin;if(live)origin=LIVE;else{local=server();origin='http://127.0.0.1:'+(await listenOnSafePort(local)).port}const browser=await chromium.launch({headless:true});try{
  for(const width of[390,1440]){const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await isolate(page);
    await page.goto(origin+GUIDE,{waitUntil:'domcontentloaded'});ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' guide overflow');
    await page.evaluate(()=>{const panel=document.querySelector('.qualified-hsp-plan');window.__center=setInterval(()=>panel.scrollIntoView({block:'center'}),100)});await page.waitForFunction(()=>(dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_en_hsp_coping_plan_view').length===1,null,{timeout:8000});await page.evaluate(()=>clearInterval(window.__center));
    const cta=page.locator('.primary-reset').first();await cta.evaluate(link=>link.addEventListener('click',event=>event.preventDefault()));await cta.click();await cta.click();const related=page.locator('.related-link').first();await related.evaluate(link=>link.addEventListener('click',event=>event.preventDefault()));await related.click();await related.click();let rows=await records(page);
    for(const name of['content_view','content_en_hsp_coping_plan_view','content_cta_click','content_related_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' must fire once');
    ok(!rows.flatMap(row=>Object.keys(row.params)).some(key=>/(choice|trigger|place|capacity|answer|score|result)/i.test(key)),width+' private telemetry key leaked');
    await page.goto(origin+RESET+'?lang=en&source=blog_sensory_bridge&trigger=drop&bad=drop',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.lang==='en');const resetUrl=new URL(page.url());ok(resetUrl.search==='?lang=en&source=blog_sensory_bridge',width+' reset URL sanitizer failed');await page.click('#generate-button');ok(await page.locator('#result-card').isVisible(),width+' reset plan did not generate');rows=await records(page);ok(rows.filter(row=>row.name==='sensory_reset_view').length===1,width+' reset view missing');ok(rows.filter(row=>row.name==='sensory_reset_generate').length===1,width+' reset generation missing');
    await page.goto(origin+MAP+'?lang=en&source=blog_sensory_bridge&answer=drop',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.lang==='en');const mapUrl=new URL(page.url());ok(mapUrl.search==='?lang=en&source=blog_sensory_bridge',width+' map URL sanitizer failed');rows=await records(page);ok(rows.filter(row=>row.name==='sensory_map_view').length===1,width+' map view missing');ok(errors.length===0,width+' page errors: '+errors.join('; '));await context.close();
  }
  return{origin,viewports:2,qualified:true,resetGenerated:true,mapLoaded:true};
}finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}}
async function main(){const args=process.argv.slice(2),index=args.indexOf('--url'),live=index>=0?args[index+1]:'';if(live&&new URL(live).origin!==LIVE)throw Error('live origin mismatch');const staticResult=source(fixture());if(args.includes('--mutations'))mutations();console.log('[PASS] English HSP coping path '+JSON.stringify({source:staticResult,runtime:await runtime(live)}))}
main().catch(error=>{console.error('[FAIL] '+error.stack);process.exitCode=1});
