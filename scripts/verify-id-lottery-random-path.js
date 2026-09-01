#!/usr/bin/env node
const fs=require('fs'),http=require('http'),path=require('path');
const {chromium}=require('playwright');
const {listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),PORTAL=path.join(ROOT,'projects','portal'),APP=path.join(ROOT,'projects','lottery');
const GUIDE_ROUTE='/portal/blog/id/lottery-number-guide.html',APP_ROUTE='/lottery/';
const GUIDE_LIVE='https://dopabrain.com'+GUIDE_ROUTE,APP_LIVE='https://dopabrain.com'+APP_ROUTE;
const LANGS=['ko','en','ja','es','pt','zh','id','tr','de','fr','hi','ru'];
function ok(value,message){if(!value)throw Error(message)}
function read(file){return fs.readFileSync(file,'utf8')}
function count(source,pattern){return(source.match(pattern)||[]).length}
function fixture(){return{guide:read(path.join(PORTAL,'blog','id','lottery-number-guide.html')),catalog:read(path.join(PORTAL,'blog','id','index.html')),sitemap:read(path.join(PORTAL,'blog','sitemap.xml')),html:read(path.join(APP,'index.html')),js:read(path.join(APP,'js','app.js')),i18n:read(path.join(APP,'js','i18n.js')),css:read(path.join(APP,'css','style.css')),manifest:read(path.join(APP,'manifest.json')),sw:read(path.join(APP,'sw.js')),locales:fs.readdirSync(path.join(APP,'js','locales')).filter(x=>x.endsWith('.json')).map(file=>read(path.join(APP,'js','locales',file)))}}
function source(v){
  ok(v.guide.includes('data-id-random-guide-contract="2026-09-01"'),'guide release contract missing');
  ok(v.html.includes('data-lottery-random-contract="2026-09-01"'),'app release contract missing');
  for(const text of ['1 dari 8.145.060','tidak menjual tiket, menerima taruhan, atau menautkan ke operator perjudian','tidak dikirim dalam event analitik','tidak meningkatkan peluang','bukan mesin prediksi'])ok(v.guide.includes(text),'guide boundary missing: '+text);
  ok(count(v.guide,/href="\/lottery\/\?lang=id&amp;source=id_random_number_guide"/g)===2,'two Indonesian app CTAs required');
  for(const event of ['content_view','content_lottery_method_view','content_cta_click','content_related_click'])ok(v.guide.includes("'"+event+"'"),'guide event missing: '+event);
  ok(/intersectionRatio>=\.5/.test(v.guide)&&/setTimeout\(function\(\).*?,500\)/s.test(v.guide)&&/clearTimeout\(timer\)/.test(v.guide),'guide 50%/500ms qualification missing');
  ok(!/selected|number_value|generated_number|combination:/.test((v.guide.match(/track\([\s\S]{0,180}/g)||[]).join('\n')),'guide telemetry leaks a selection');
  ok(count(v.guide,/\/portal\/js\/ad-loader\.js/g)===1&&!/FAQPage|AggregateRating|content_ad_impression|data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*(?:=|\.push)|cross-promo\.js/.test(v.guide),'guide trust or Auto Ads contract drifted');
  const schemas=[...v.guide.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  ok(schemas.length===1&&JSON.stringify(schemas[0]['@graph'].map(item=>item['@type']))===JSON.stringify(['Article','BreadcrumbList']),'guide schema types drifted');
  ok(v.catalog.includes('/portal/blog/id/lottery-number-guide.html')&&v.catalog.includes('Generator Angka Acak 6/45')&&v.catalog.includes('2026-09 diperbarui'),'Indonesian catalog stale');
  ok(v.sitemap.includes('<loc>'+GUIDE_LIVE+'</loc><lastmod>2026-09-01</lastmod>'),'focused sitemap row missing');
  ok(count(v.html,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)===1,'app must load Auto Ads once');
  ok(!/AggregateRating|FAQPage|page_engage|content_ad_impression|data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*(?:=|\.push)|simulationSection|premiumSection|freqGrid|cross-promo\.js/.test(v.html+'\n'+v.js),'app fake proof, obsolete feature, or manual ad remains');
  ok(!/Math\.random/.test(v.js),'Math.random fallback remains');
  ok(/crypto\.getRandomValues\(value\)/.test(v.js)&&/limit=range-\(range%max\)/.test(v.js)&&/while\(value\[0\]>=limit\)/.test(v.js),'unbiased Web Crypto sampling missing');
  ok(v.html.indexOf('sources=new Set')<v.html.indexOf('googletagmanager.com/gtag/js'),'query sanitizer must precede analytics');
  ok(/sources=new Set\(\['id_random_number_guide'\]\)/.test(v.html)&&/langs\.has\(lang\)/.test(v.html),'query allowlist drifted');
  for(const event of ['lottery_random_view','lottery_random_generate','lottery_random_save','lottery_random_share','lottery_random_related_click'])ok(v.js.includes("'"+event+"'"),'app event missing: '+event);
  const trackingCalls=(v.js.match(/track\('lottery_random_[\s\S]{0,160}/g)||[]).join('\n');
  ok(!/(?:numbers?|results?|fixed|seed|history|combination|set_count)\s*:/.test(trackingCalls),'private generated state enters app telemetry');
  ok(/await navigator\.share\(data\)/.test(v.js)&&/await navigator\.clipboard\.writeText/.test(v.js)&&/track\('lottery_random_share'\)/.test(v.js),'success-only share gate missing');
  const manifest=JSON.parse(v.manifest);ok(manifest.start_url===APP_ROUTE&&manifest.scope===APP_ROUTE,'manifest scope drifted');
  ok(/CACHE_NAME='lottery-random-v2'/.test(v.sw)&&/SCOPE='\/lottery\/'/.test(v.sw)&&/url\.origin!==self\.location\.origin/.test(v.sw)&&/url\.pathname\.startsWith\(SCOPE\)/.test(v.sw),'service worker scope drifted');
  ok(v.locales.length===12&&v.locales.every(text=>{JSON.parse(text);return!text.includes('\uFFFD')}),'12 valid locale files required');
  for(const lang of LANGS)ok(new RegExp('\\b'+lang+':\\{').test(v.i18n),'safe copy missing: '+lang);
  ok(count(v.guide,/class="related-card quick-card"/g)===4&&count(v.html,/data-target-slug=/g)===2,'focused related routes drifted');
  return{guideBytes:Buffer.byteLength(v.guide),appBytes:Buffer.byteLength(v.html)+Buffer.byteLength(v.js)+Buffer.byteLength(v.i18n)+Buffer.byteLength(v.css),locales:12,guideCtas:2};
}
function mutations(){
  const cases=[
    ['guide-contract',v=>v.guide=v.guide.replace('data-id-random-guide-contract','data-broken-contract')],
    ['guide-probability',v=>v.guide=v.guide.replaceAll('1 dari 8.145.060','pasti menang')],
    ['guide-boundary',v=>v.guide=v.guide.replace('tidak meningkatkan peluang','meningkatkan peluang')],
    ['guide-route',v=>v.guide=v.guide.replace('source=id_random_number_guide','source=unknown')],
    ['guide-view',v=>v.guide=v.guide.replace('intersectionRatio>=.5','intersectionRatio>=0')],
    ['guide-ad',v=>v.guide+='<ins data-ad-slot="auto"></ins>'],
    ['guide-schema',v=>v.guide=v.guide.replace('"BreadcrumbList"','"FAQPage"')],
    ['catalog',v=>v.catalog=v.catalog.replace('Generator Angka Acak 6/45','Prediksi Nomor Togel')],
    ['sitemap',v=>v.sitemap=v.sitemap.replace(GUIDE_LIVE,'https://removed.example/')],
    ['app-contract',v=>v.html=v.html.replace('data-lottery-random-contract','data-broken-contract')],
    ['app-rating',v=>v.html=v.html.replace('<body','<div>AggregateRating 4.9</div><body')],
    ['app-random',v=>v.js=v.js.replace('crypto.getRandomValues(value)','value[0]=Math.floor(Math.random()*0x100000000)')],
    ['app-event',v=>v.js=v.js.replaceAll("'lottery_random_generate'","'removed_generate'")],
    ['app-private',v=>v.js=v.js.replace("track('lottery_random_generate')","track('lottery_random_generate',{numbers:this.results})")],
    ['app-share',v=>v.js=v.js.replace('await navigator.clipboard.writeText','navigator.clipboard.writeText')],
    ['manifest',v=>v.manifest=v.manifest.replace('"/lottery/"','"/"')],
    ['service-worker',v=>v.sw=v.sw.replace("SCOPE='/lottery/'","SCOPE='/'")],
    ['locale',v=>v.i18n=v.i18n.replace('id:{title:', 'xx:{title:')]
  ];
  for(const [name,mutate] of cases){const v=fixture();mutate(v);try{source(v)}catch(error){console.log('[PASS] '+name+': '+error.message);continue}throw Error('mutation escaped: '+name)}
  console.log('[PASS] mutation summary '+cases.length+'/'+cases.length+' detected');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function server(){return http.createServer((request,response)=>{const pathname=decodeURIComponent(new URL(request.url,'http://x').pathname);let root,relative;if(pathname.startsWith('/portal/')){root=PORTAL;relative=pathname.slice(8)}else if(pathname.startsWith('/lottery/')){root=APP;relative=pathname.slice(9)}else return response.writeHead(404).end();let file=path.resolve(root,relative||'index.html');if(!file.startsWith(path.resolve(root)+path.sep)&&file!==path.resolve(root,'index.html'))return response.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file))return response.writeHead(404).end();response.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(response)})}
async function block(page){for(const host of ['**/googletagmanager.com/**','**/googlesyndication.com/**','**/doubleclick.net/**'])await page.route(host,route=>route.abort())}
async function events(page){return page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[])).filter(item=>item[0]==='event').map(item=>({name:item[1],params:item[2]||{}})))}
async function runtime(live){
  let local,origin;if(live)origin='https://dopabrain.com';else{local=server();const result=await listenOnSafePort(local);origin='http://127.0.0.1:'+result.port}
  const browser=await chromium.launch({headless:true});
  try{
    for(const width of [390,1440]){
      const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block'});
      await context.addInitScript(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}})});
      const page=await context.newPage();await block(page);
      await page.goto(origin+GUIDE_ROUTE,{waitUntil:'domcontentloaded'});
      ok((await page.locator('h1').textContent()).includes('bukan mesin prediksi'),width+' guide identity mismatch');
      ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' guide overflow');
      await page.evaluate(()=>{const panel=document.querySelector('.qualified-method');window.__qualifiedScroll=setInterval(()=>panel&&panel.scrollIntoView({block:'center'}),100)});
      await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_lottery_method_view').length===1,null,{timeout:8000});
      await page.evaluate(()=>clearInterval(window.__qualifiedScroll));
      const cta=page.locator('.primary-cta').first();await cta.evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{once:true}));await cta.click();
      let rows=await events(page);for(const name of ['content_view','content_lottery_method_view','content_cta_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');
      await page.goto(origin+APP_ROUTE+'?lang=id&source=id_random_number_guide&bad=1#private',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.lotteryApp&&document.documentElement.lang==='id');
      ok((await page.evaluate(()=>location.search))==='?lang=id&source=id_random_number_guide',width+' query sanitizer mismatch');
      ok((await page.evaluate(()=>location.hash))==='',width+' app fragment not removed');
      ok((await page.locator('h1').textContent()).includes('Pengacak Angka'),width+' Indonesian app render failed');
      ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' app overflow');
      if(width===1440){for(const lang of LANGS){await page.selectOption('#languageSelect',lang);await page.waitForFunction(expected=>document.documentElement.lang===expected,lang);ok((await page.locator('h1').textContent()).trim().length>4,'empty heading: '+lang)}await page.selectOption('#languageSelect','id')}
      await page.evaluate(()=>{const panel=document.querySelector('.qualified-generator');window.__qualifiedScroll=setInterval(()=>panel&&panel.scrollIntoView({block:'center'}),100)});
      await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='lottery_random_view').length===1,null,{timeout:8000});
      await page.evaluate(()=>clearInterval(window.__qualifiedScroll));
      await page.check('#autoMode');for(const n of [1,2,3,4,5])await page.locator('.pick-number[data-number="'+n+'"]').click();await page.selectOption('#setCount','3');await page.click('#generateBtn');
      ok(await page.locator('.result-row').count()===3,width+' result count');
      const generated=await page.locator('.result-row').evaluateAll(nodes=>nodes.map(node=>[...node.querySelectorAll('.ball')].map(ball=>Number(ball.textContent))));
      ok(generated.every(set=>set.length===6&&new Set(set).size===6&&[1,2,3,4,5].every(n=>set.includes(n))&&set.every(n=>n>=1&&n<=45)),width+' generated set invariant');
      await page.click('.result-row .save');await page.click('#generateBtn');await page.click('#shareBtn');await page.click('#shareBtn');const related=page.locator('.related-grid a').first();await related.evaluate(link=>link.addEventListener('click',event=>event.preventDefault(),{once:true}));await related.click();
      rows=await events(page);for(const name of ['lottery_random_view','lottery_random_generate','lottery_random_save','lottery_random_share','lottery_random_related_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');
      const own=rows.filter(row=>row.name.startsWith('lottery_random_')),keys=own.flatMap(row=>Object.keys(row.params));ok(!keys.some(key=>/(?:number|result|fixed|seed|history|combination|set_count)/i.test(key)),'private event key leaked: '+keys.join(','));
      ok(await page.evaluate(()=>{const value=JSON.parse(localStorage.getItem('lottery_saved_v2')||'[]');return value.length===1&&value[0].length===6}),width+' local save missing');
      await context.close();
    }
    return{origin,viewports:2,languages:12,funnel:'exact-once',private:true};
  }finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}
}
async function main(){const args=process.argv.slice(2),index=args.indexOf('--url'),live=index>=0?args[index+1]:'';if(live&&new URL(live).origin!=='https://dopabrain.com')throw Error('live origin mismatch');const result=source(fixture());if(args.includes('--mutations'))mutations();console.log('[PASS] Indonesian lottery random path '+JSON.stringify({source:result,runtime:await runtime(live)}))}
main().catch(error=>{console.error('[FAIL] '+error.stack);process.exitCode=1});
