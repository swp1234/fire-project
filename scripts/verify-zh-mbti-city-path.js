#!/usr/bin/env node
'use strict';
const fs=require('fs'),http=require('http'),path=require('path');
const{chromium}=require('playwright');
const{listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),PORTAL=path.join(ROOT,'projects','portal'),APP=path.join(ROOT,'projects','mbti-city');
const GUIDE='/portal/blog/zh/mbti-city-chengshi-xingge.html',QUIZ='/mbti-city/',LIVE='https://dopabrain.com';
const LANGS=['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
function ok(value,message){if(!value)throw Error(message)}
function read(file){return fs.readFileSync(file,'utf8')}
function count(source,regex){return(source.match(regex)||[]).length}
function fixture(){return{guide:read(path.join(PORTAL,'blog','zh','mbti-city-chengshi-xingge.html')),catalog:read(path.join(PORTAL,'blog','zh','index.html')),sitemap:read(path.join(PORTAL,'blog','sitemap.xml')),html:read(path.join(APP,'index.html')),app:read(path.join(APP,'js','app.js')),i18n:read(path.join(APP,'js','i18n.js')),manifest:read(path.join(APP,'manifest.json')),sw:read(path.join(APP,'sw.js')),locales:fs.readdirSync(path.join(APP,'js','locales')).filter(file=>file.endsWith('.json')).sort().map(file=>read(path.join(APP,'js','locales',file)))}}
function source(v){
  ok(v.guide.includes('data-zh-mbti-city-contract="2026-09-01"'),'guide contract missing');
  for(const text of ['不是官方MBTI®测评','没有经过验证的心理学对应关系','结果不能判断你该在哪里居住','题目答案、各维度分数和最终类型不会发送'])ok(v.guide.includes(text),'guide boundary missing: '+text);
  ok(count(v.guide,/href="\/mbti-city\/\?lang=zh&amp;source=zh_mbti_city_guide"/g)===2,'two identical quiz routes required');
  ok(count(v.guide,/class="card"/g)===20,'four axes and sixteen city cards required');
  ok(count(v.guide,/class="quick-card related-link"/g)===4,'four related culture routes required');
  for(const event of ['content_view','content_zh_mbti_city_boundary_view','content_cta_click','content_related_click'])ok(v.guide.includes("'"+event+"'"),'guide event missing: '+event);
  ok(/intersectionRatio>=\.5/.test(v.guide)&&/},500\)/.test(v.guide)&&/clearTimeout\(timer\)/.test(v.guide),'qualified 50%/500ms guide view missing');
  ok(count(v.guide,/\/portal\/js\/ad-loader\.js/g)===1&&!/FAQPage|AggregateRating|content_ad_impression|cross-promo\.js|data-ad-slot|<ins[^>]+adsbygoogle/i.test(v.guide),'guide trust or Auto Ads contract drifted');
  const schemas=[...v.guide.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  ok(schemas.length===1&&schemas[0]['@graph'].map(item=>item['@type']).join(',')==='Article,BreadcrumbList','guide schema drifted');
  ok(v.catalog.includes('8个旅行情景如何匹配16座城市')&&v.catalog.includes('透明计分'),'Chinese catalog stale');
  ok(v.sitemap.includes('<loc>'+LIVE+GUIDE+'</loc><lastmod>2026-09-01</lastmod>'),'focused sitemap row missing');

  ok(v.html.includes('data-mbti-city-contract="2026-09-01"'),'app contract missing');
  ok(count(v.html,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)===1,'app Auto Ads loader count');
  ok(!/AggregateRating|FAQPage|page_engage|quiz_complete|data-ad-slot|participant|15,200|4\.3 \/ 5|cross-promo\.js|translateDOM|city-rarity|rareStat|error-handler\.js/i.test(v.html+'\n'+v.app+'\n'+v.i18n+'\n'+v.locales.join('\n')),'fake proof, broken completion or legacy surface remains');
  ok(v.html.indexOf('sources=new Set')<v.html.indexOf('googletagmanager.com/gtag/js')&&/sources=new Set\(\['zh_mbti_city_guide'\]\)/.test(v.html),'query sanitizer order or allowlist drifted');
  ok(count(v.app,/\{ key: 'q\d', axis: '[A-Z]{2}' \}/g)===8,'eight-question engine required');
  ok(count(v.app,/^[ ]{4}[A-Z]{4}: \{ city:/gm)===16,'sixteen city results required');
  ok(/scores\.E >= scores\.I/.test(v.app)&&/scores\.S >= scores\.N/.test(v.app)&&/scores\.T >= scores\.F/.test(v.app)&&/scores\.J >= scores\.P/.test(v.app),'published tie rule drifted');
  for(const event of ['mbti_city_view','mbti_city_start','mbti_city_complete','mbti_city_share','mbti_city_related_click'])ok(v.app.includes("'"+event+"'"),'app event missing: '+event);
  ok(!/trackMbtiCity\('mbti_city_(?:view|start|complete|share)'\s*,/.test(v.app)&&/trackMbtiCity\('mbti_city_related_click', \{ target_slug:/.test(v.app),'private quiz state enters telemetry');
  ok(/GameAds\.showInterstitial/.test(v.app)&&!/showRewarded|injectRewardButton/.test(v.app),'completion-break-only ad contract missing');
  const manifest=JSON.parse(v.manifest);ok(manifest.start_url===QUIZ&&manifest.scope===QUIZ,'manifest scope drifted');
  ok(/CACHE='mbti-city-v2',SCOPE='\/mbti-city\/'/.test(v.sw)&&/url\.origin!==self\.location\.origin/.test(v.sw)&&/url\.pathname\.startsWith\(SCOPE\)/.test(v.sw)&&/if\(response\.ok\)/.test(v.sw),'service-worker scope or success guard drifted');
  ok(v.locales.length===12&&v.locales.every(text=>{const locale=JSON.parse(text);return!text.includes('\uFFFD')&&!/participants|rareStat|rarityText|AggregateRating/.test(text)&&locale.questions?.q8&&locale.results?.ESTJ?.name&&locale.share?.copyLink}),'12 compact truthful locales required');
  return{guideBytes:Buffer.byteLength(v.guide),appBytes:Buffer.byteLength(v.html)+Buffer.byteLength(v.app)+Buffer.byteLength(v.i18n),questions:8,cities:16,locales:12};
}
function mutations(){
  const cases=[
    ['guide-contract',v=>v.guide=v.guide.replace('data-zh-mbti-city-contract','broken-contract')],
    ['guide-route',v=>v.guide=v.guide.replace('source=zh_mbti_city_guide','source=bad')],
    ['guide-boundary',v=>v.guide=v.guide.replace('不是官方MBTI®测评','是官方MBTI®测评')],
    ['guide-cards',v=>v.guide=v.guide.replace('class="card"','class="removed"')],
    ['guide-view',v=>v.guide=v.guide.replace('intersectionRatio>=.5','intersectionRatio>=0')],
    ['guide-ad',v=>v.guide=v.guide.replace('<body','<div data-ad-slot="auto"></div><body')],
    ['guide-schema',v=>v.guide=v.guide.replace('Article','FAQPage')],
    ['catalog',v=>v.catalog=v.catalog.replace('透明计分','神秘算法')],
    ['sitemap',v=>v.sitemap=v.sitemap.replace(LIVE+GUIDE,'https://removed.example/')],
    ['app-contract',v=>v.html=v.html.replace('data-mbti-city-contract','broken-contract')],
    ['app-rating',v=>v.html=v.html.replace('<body','<div>AggregateRating</div><body')],
    ['app-questions',v=>v.app=v.app.replace("{ key: 'q8', axis: 'JP' }","{ removed: 'q8', axis: 'JP' }")],
    ['app-results',v=>v.app=v.app.replace('ESTJ: { city:','ESTJ: { removed:')],
    ['app-event',v=>v.app=v.app.replaceAll("'mbti_city_complete'","'removed_complete'")],
    ['app-private',v=>v.app=v.app.replace("trackMbtiCity('mbti_city_complete')","trackMbtiCity('mbti_city_complete', { result: mbti })")],
    ['manifest',v=>v.manifest=v.manifest.replace('"scope": "/mbti-city/"','"scope": "/"')],
    ['sw',v=>v.sw=v.sw.replace("SCOPE='/mbti-city/'","SCOPE='/'")],
    ['locale',v=>v.locales[0]=v.locales[0].replace('"q8"','"removed"')]
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
      await context.addInitScript(()=>{window.open=()=>({});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}})});
      const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await isolate(page);
      await page.goto(origin+GUIDE,{waitUntil:'domcontentloaded'});ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' guide overflow');
      await page.evaluate(()=>{const panel=document.querySelector('.qualified-mbti-city');window.__center=setInterval(()=>panel.scrollIntoView({block:'center'}),100)});
      await page.waitForFunction(()=>(dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_zh_mbti_city_boundary_view').length===1,null,{timeout:8000});await page.evaluate(()=>clearInterval(window.__center));
      const cta=page.locator('.cta').first();await cta.evaluate(link=>link.addEventListener('click',event=>event.preventDefault()));await cta.click();await cta.click();let rows=await events(page);
      for(const name of['content_view','content_zh_mbti_city_boundary_view','content_cta_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');
      await page.goto(origin+QUIZ+'?lang=zh&source=zh_mbti_city_guide&bad=1#result',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.i18n?.initialized&&document.documentElement.lang==='zh'&&(dataLayer||[]).some(item=>item[0]==='event'&&item[1]==='mbti_city_view'));
      ok(await page.evaluate(()=>location.search)==='?lang=zh&source=zh_mbti_city_guide'&&await page.evaluate(()=>location.hash)==='',width+' sanitizer failed');ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' app overflow');
      if(width===1440){for(const lang of LANGS){await page.selectOption('#lang-select',lang);try{await page.waitForFunction(value=>document.documentElement.lang===value,lang,{timeout:5000})}catch(error){const state=await page.evaluate(()=>({html:document.documentElement.lang,current:window.i18n?.currentLang,selected:document.getElementById('lang-select')?.value}));throw Error('locale switch failed: '+lang+' '+JSON.stringify(state)+'; '+error.message)}ok(!(await page.locator('h1').textContent()).includes('app.title'),'locale key leaked: '+lang)}await page.selectOption('#lang-select','zh')}
      await page.click('#start-btn');for(let index=0;index<8;index++){await page.locator('.option-btn').first().click();if(index<7)await page.waitForFunction(expected=>document.getElementById('progress-text')?.textContent?.startsWith(expected+' /'),index+2);else await page.waitForFunction(()=>document.getElementById('result-screen')?.classList.contains('active'))}
      ok((await page.locator('.result-mbti').textContent()).trim()==='ESTJ',width+' deterministic result drifted');
      await page.click('#share-copy');await page.click('#share-copy');const related=page.locator('[data-target-slug]').first();await related.evaluate(link=>link.addEventListener('click',event=>event.preventDefault()));await related.click();await related.click();rows=await events(page);
      for(const name of['mbti_city_view','mbti_city_start','mbti_city_complete','mbti_city_share','mbti_city_related_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');
      const allowed=new Set(['event_category','app_language','target_slug']),keys=rows.filter(row=>row.name.startsWith('mbti_city_')).flatMap(row=>Object.keys(row.params)).filter(key=>!allowed.has(key));ok(!keys.some(key=>/(choice|answer|score|result|type|city|mbti)/i.test(key)),'private key leaked');ok(errors.length===0,width+' page errors: '+errors.join('; '));await context.close();
    }
    return{origin,viewports:2,languages:12,questions:8,private:true};
  }finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}
}
async function main(){const args=process.argv.slice(2),index=args.indexOf('--url'),live=index>=0?args[index+1]:'';if(live&&new URL(live).origin!==LIVE)throw Error('live origin mismatch');const staticResult=source(fixture());if(args.includes('--mutations'))mutations();console.log('[PASS] Chinese MBTI city path '+JSON.stringify({source:staticResult,runtime:await runtime(live)}))}
main().catch(error=>{console.error('[FAIL] '+error.stack);process.exitCode=1});
