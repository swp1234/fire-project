#!/usr/bin/env node
'use strict';
const fs=require('fs'),http=require('http'),path=require('path');
const{chromium}=require('playwright');
const{listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),PORTAL=path.join(ROOT,'projects','portal'),APP=path.join(ROOT,'projects','past-life');
const GUIDE='/portal/blog/en/past-life-calculator-birthday.html',JOURNEY='/past-life/',LIVE='https://dopabrain.com';
const LANGS=['ko','en','ja','es','pt','zh','id','tr','de','fr','hi','ru'];
function ok(value,message){if(!value)throw Error(message)}
function read(file){return fs.readFileSync(file,'utf8')}
function count(source,regex){return(source.match(regex)||[]).length}
function fixture(){return{guide:read(path.join(PORTAL,'blog','en','past-life-calculator-birthday.html')),catalog:read(path.join(PORTAL,'blog','en','index.html')),sitemap:read(path.join(PORTAL,'blog','sitemap.xml')),html:read(path.join(APP,'index.html')),app:read(path.join(APP,'js','app.js')),i18n:read(path.join(APP,'js','i18n.js')),manifest:read(path.join(APP,'manifest.json')),sw:read(path.join(APP,'sw.js')),locales:fs.readdirSync(path.join(APP,'js','locales')).filter(f=>f.endsWith('.json')).sort().map(f=>read(path.join(APP,'js','locales',f)))}}
function source(v){
  ok(v.guide.includes('data-en-past-life-contract="2026-09-01"'),'guide contract missing');
  for(const text of ['No birth date or choice can prove who you were','reconstructive','does not send your birthday','uses six scene choices—not your birthday'])ok(v.guide.includes(text),'guide boundary missing: '+text);
  ok(count(v.guide,/href="\/past-life\/\?lang=en&amp;source=en_past_life_guide"/g)===2,'two identical journey routes required');
  ok(v.guide.includes('1995-07-24')&&count(v.guide,/class="card"/g)===9,'birthday method or nine prompts missing');
  ok(count(v.guide,/class="quick-card related-link"/g)===4,'four related cards required');
  for(const event of ['content_view','content_en_past_life_method_view','content_cta_click','content_related_click'])ok(v.guide.includes("'"+event+"'"),'guide event missing: '+event);
  ok(/intersectionRatio>=\.5/.test(v.guide)&&/},500\)/.test(v.guide)&&/clearTimeout\(timer\)/.test(v.guide),'qualified 50%/500ms guide view missing');
  ok(count(v.guide,/\/portal\/js\/ad-loader\.js/g)===1&&!/FAQPage|AggregateRating|content_ad_impression|cross-promo\.js|data-ad-slot|<ins[^>]+adsbygoogle/i.test(v.guide),'guide trust or Auto Ads contract drifted');
  const schemas=[...v.guide.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  ok(schemas.length===1&&schemas[0]['@graph'].map(item=>item['@type']).join(',')==='Article,BreadcrumbList','guide schema drifted');
  ok(v.catalog.includes('Past Life Birthday Story Method')&&v.catalog.includes('transparent fictional prompt'),'English catalog stale');
  ok(v.sitemap.includes('<loc>'+LIVE+GUIDE+'</loc><lastmod>2026-09-01</lastmod>'),'focused sitemap row missing');

  ok(v.html.includes('data-past-life-contract="2026-09-01"'),'app contract missing');
  ok(count(v.html,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)===1,'app Auto Ads loader count');
  ok(!/AggregateRating|FAQPage|page_engage|past_life_result_ad_impression|data-ad-slot|ad-banner|participant-count|cross-promo\.js|error-handler\.js|resultCanvas|percentile|compatPercent|save_image/i.test(v.html+'\n'+v.app+'\n'+v.i18n),'fake proof, manual ad, legacy error or result surface remains');
  ok(v.html.indexOf('sources=new Set')<v.html.indexOf('googletagmanager.com/gtag/js')&&/sources=new Set\(\['en_past_life_guide'\]\)/.test(v.html),'query sanitizer order or allowlist drifted');
  ok(count(v.app,/id:'(?:egypt|medieval|renaissance|exploration|industrial|modern)'/g)===6,'six-scene engine required');
  ok(/const PAST_LIFE_TYPES=\['knight','scholar','painter','royal','explorer','healer','oracle','pirate'\]/.test(v.app),'eight-role order drifted');
  for(const event of ['past_life_view','past_life_start','past_life_complete','past_life_share','past_life_related_click'])ok(v.app.includes("'"+event+"'"),'app event missing: '+event);
  ok(!/trackPastLife\('past_life_(?:view|start|complete|share)'\s*,/.test(v.app)&&/trackPastLife\('past_life_related_click',\{target_slug:/.test(v.app),'private journey state enters telemetry');
  const share=v.app.slice(v.app.indexOf('async share()'),v.app.lastIndexOf('\n}'));
  ok(/await navigator\.share/.test(share)&&/await navigator\.clipboard\.writeText/.test(share)&&!/this\.(?:result|scores|selections)|role-name|role-setting/.test(share),'neutral success-gated sharing missing');
  const manifest=JSON.parse(v.manifest);ok(manifest.start_url===JOURNEY&&manifest.scope===JOURNEY,'manifest scope drifted');
  ok(/CACHE='past-life-v5',SCOPE='\/past-life\/'/.test(v.sw)&&/u\.origin!==self\.location\.origin/.test(v.sw)&&/u\.pathname\.startsWith\(SCOPE\)/.test(v.sw)&&/if\(r\.ok\)/.test(v.sw),'service-worker scope or success guard drifted');
  ok(v.locales.length===12&&v.locales.every(text=>{const j=JSON.parse(text);return!text.includes('\uFFFD')&&!/percentileStat|participantCount|compatPercent|ads|error/.test(text)&&j.intro?.boundary&&j.intro?.formula&&j.eras?.modern&&j.types?.pirate?.name&&j.result?.summary}),'12 compact truthful locales required');
  ok(/GameAds\.showInterstitial/.test(v.app)&&!/showRewarded|injectRewardButton/.test(v.app),'completion-break-only ad contract missing');
  return{guideBytes:Buffer.byteLength(v.guide),appBytes:Buffer.byteLength(v.html)+Buffer.byteLength(v.app)+Buffer.byteLength(v.i18n),scenes:6,roles:8,locales:12};
}
function mutations(){
  const cases=[
    ['guide-contract',v=>v.guide=v.guide.replace('data-en-past-life-contract','broken-contract')],
    ['guide-route',v=>v.guide=v.guide.replace('source=en_past_life_guide','source=bad')],
    ['guide-boundary',v=>v.guide=v.guide.replace('No birth date or choice can prove who you were','A birth date can prove who you were')],
    ['guide-method',v=>v.guide=v.guide.replace('1995-07-24','method-removed')],
    ['guide-view',v=>v.guide=v.guide.replace('intersectionRatio>=.5','intersectionRatio>=0')],
    ['guide-ad',v=>v.guide=v.guide.replace('<body','<div data-ad-slot="auto"></div><body')],
    ['guide-schema',v=>v.guide=v.guide.replace('Article','FAQPage')],
    ['catalog',v=>v.catalog=v.catalog.replace('Past Life Birthday Story Method','Past Life Proof')],
    ['sitemap',v=>v.sitemap=v.sitemap.replace(LIVE+GUIDE,'https://removed.example/')],
    ['app-contract',v=>v.html=v.html.replace('data-past-life-contract','broken-contract')],
    ['app-rating',v=>v.html=v.html.replace('<body','<div>AggregateRating</div><body')],
    ['app-scenes',v=>v.app=v.app.replace("id:'modern'","removed:'modern'")],
    ['app-event',v=>v.app=v.app.replaceAll("'past_life_complete'","'removed_complete'")],
    ['app-private',v=>v.app=v.app.replace("trackPastLife('past_life_complete')","trackPastLife('past_life_complete',{result:this.result})")],
    ['app-share',v=>v.app=v.app.replace('await navigator.clipboard.writeText','navigator.clipboard.writeText')],
    ['manifest',v=>v.manifest=v.manifest.replace('"scope":"/past-life/"','"scope":"/"')],
    ['sw',v=>v.sw=v.sw.replace("SCOPE='/past-life/'","SCOPE='/'")],
    ['locale',v=>v.locales[0]=v.locales[0].replace('"boundary"','"removed"')]
  ];
  for(const[name,mutate]of cases){const v=fixture();mutate(v);try{source(v)}catch(error){console.log('[PASS] '+name+': '+error.message);continue}throw Error('mutation escaped: '+name)}
  console.log('[PASS] mutation summary '+cases.length+'/'+cases.length+' detected');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function server(){return http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://x').pathname),match=pathname.match(/^\/([^/]+)\/(.*)$/);if(!match)return res.writeHead(404).end();const root=match[1]==='portal'?PORTAL:path.join(ROOT,'projects',match[1]);if(!fs.existsSync(root))return res.writeHead(404).end();let file=path.resolve(root,match[2]||'index.html');if(!file.startsWith(path.resolve(root)+path.sep)&&file!==path.resolve(root,'index.html'))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file))return res.writeHead(404).end();res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(res)})}
async function events(page){return page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[])).filter(item=>item[0]==='event').map(item=>({name:item[1],params:item[2]||{}})))}
async function isolate(page){for(const host of['**/googletagmanager.com/**','**/googlesyndication.com/**','**/doubleclick.net/**'])await page.route(host,route=>route.abort())}
async function runtime(live){
  let local,origin;if(live)origin=LIVE;else{local=server();origin='http://127.0.0.1:'+(await listenOnSafePort(local)).port}
  const browser=await chromium.launch({headless:true});
  try{
    for(const width of[390,1440]){
      const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
      await context.addInitScript(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}})});
      const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await isolate(page);
      await page.goto(origin+GUIDE,{waitUntil:'domcontentloaded'});ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' guide overflow');
      await page.evaluate(()=>{const panel=document.querySelector('.qualified-past-life');window.__center=setInterval(()=>panel.scrollIntoView({block:'center'}),100)});
      await page.waitForFunction(()=>(dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_en_past_life_method_view').length===1,null,{timeout:8000});await page.evaluate(()=>clearInterval(window.__center));
      const cta=page.locator('.cta').first();await cta.evaluate(a=>a.addEventListener('click',event=>event.preventDefault()));await cta.click();await cta.click();let rows=await events(page);
      for(const name of['content_view','content_en_past_life_method_view','content_cta_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');
      await page.goto(origin+JOURNEY+'?lang=en&source=en_past_life_guide&bad=1#result',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.pastLifeJourney&&document.documentElement.lang==='en');
      ok(await page.evaluate(()=>location.search)==='?lang=en&source=en_past_life_guide'&&await page.evaluate(()=>location.hash)==='',width+' sanitizer failed');ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' app overflow');
      if(width===1440){for(const lang of LANGS){await page.selectOption('#language',lang);await page.waitForFunction(value=>document.documentElement.lang===value,lang);ok(!(await page.locator('h1').textContent()).includes('intro.title'),'locale key leaked: '+lang)}await page.selectOption('#language','en')}
      await page.click('#start');for(let index=0;index<6;index++){await page.click('#choice-a');await page.click('#next')}
      ok(await page.locator('#result').evaluate(el=>el.classList.contains('active')),width+' completion missing');ok((await page.locator('#role-name').textContent()).trim()===(await page.evaluate(()=>i18n.t('types.pirate.name'))),width+' deterministic role drifted');
      await page.click('#share');await page.click('#share');const related=page.locator('[data-target-slug]').first();await related.evaluate(a=>a.addEventListener('click',event=>event.preventDefault()));await related.click();await related.click();rows=await events(page);
      for(const name of['past_life_view','past_life_start','past_life_complete','past_life_share','past_life_related_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');
      const allowed=new Set(['event_category','app_language','target_slug']),keys=rows.filter(row=>row.name.startsWith('past_life_')).flatMap(row=>Object.keys(row.params)).filter(key=>!allowed.has(key));ok(!keys.some(key=>/(choice|answer|score|result|role|era|scene)/i.test(key)),'private key leaked');ok(errors.length===0,width+' page errors: '+errors.join('; '));await context.close();
    }
    return{origin,viewports:2,languages:12,scenes:6,private:true};
  }finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}
}
async function main(){const args=process.argv.slice(2),index=args.indexOf('--url'),live=index>=0?args[index+1]:'';if(live&&new URL(live).origin!==LIVE)throw Error('live origin mismatch');const staticResult=source(fixture());if(args.includes('--mutations'))mutations();console.log('[PASS] English past-life path '+JSON.stringify({source:staticResult,runtime:await runtime(live)}))}
main().catch(error=>{console.error('[FAIL] '+error.stack);process.exitCode=1});
