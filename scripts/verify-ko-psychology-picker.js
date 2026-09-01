#!/usr/bin/env node
const fs=require('fs'),http=require('http'),path=require('path'),{chromium}=require('playwright'),{listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),PORTAL=path.join(ROOT,'projects','portal'),ROUTE='/portal/blog/psychology-test-best.html',LIVE='https://dopabrain.com'+ROUTE;
const FILES={page:path.join(PORTAL,'blog','psychology-test-best.html'),catalog:path.join(PORTAL,'blog','index.html'),sitemap:path.join(PORTAL,'blog','sitemap.xml')};
const ROUTES={stress:'/stress-check/?lang=ko',sensitivity:'/hsp-test/?lang=ko',thinking:'/brain-type/?lang=ko',puzzle:'/iq-test/?lang=ko',kpop:'/kpop-position/?lang=ko'};
function fail(m){throw new Error(m)}function read(f){return fs.readFileSync(f,'utf8')}function load(){return Object.fromEntries(Object.entries(FILES).map(([k,f])=>[k,read(f)]))}function count(s,r){return(s.match(r)||[]).length}
function source(v){
  if(!/data-ko-test-picker-contract="2026-09-01"/.test(v.page)||!/<h1>무료 심리테스트, 지금 무엇을 확인하고 싶나요\?<\/h1>/.test(v.page))fail('Korean picker identity drifted');
  if(count(v.page,/data-choice="(?:stress|sensitivity|thinking|puzzle|kpop)"/g)!==5||count(v.page,/class="test"/g)!==5)fail('five picker choices and boundaries required');
  for(const [key,href] of Object.entries(ROUTES))if(!v.page.includes(key+":{href:'"+href+"'"))fail('picker route missing: '+key);
  for(const x of ['apa.org/topics/psychological-testing-assessment','who.int/en/news-room/questions-and-answers/item/stress'])if(!v.page.includes(x))fail('source missing: '+x);
  if(/FAQPage|AggregateRating|content_ad_impression|80~90|70~85|솔페지오|치유.*주파수|과학적으로.*궁합|가장 인기|황금기|자가진단|정확한 측정/i.test(v.page))fail('unsupported ranking, diagnosis, proof, schema, or telemetry remains');
  for(const e of ['content_view','content_ko_test_picker_view','content_ko_test_picker_use','content_cta_click','content_related_click'])if(!v.page.includes("'"+e+"'"))fail('event missing: '+e);
  if(!/intersectionRatio>=\.5/.test(v.page)||!/let exposureTimer/.test(v.page)||!/clearTimeout\(exposureTimer\)/.test(v.page)||!/observer\.disconnect\(\);sent\.add\('view'\)/.test(v.page)||!/\},500\)/.test(v.page))fail('continuous qualified picker exposure missing');
  const use=v.page.match(/track\('content_ko_test_picker_use',[\s\S]*?\)/)?.[0]||'';if(/choice|target_slug|href/.test(use))fail('picker use leaks the selected purpose');
  if(count(v.page,/class="quick-card related-card"/g)!==4)fail('four focused related cards required');
  if(count(v.page,/\/portal\/js\/ad-loader\.js/g)!==1||/data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*(?:=|\.push)/.test(v.page))fail('page must use managed Auto Ads only');
  if(!/무료 심리테스트: 목적에 맞는 5가지/.test(v.catalog)||!/date: '2026-09-01'/.test(v.catalog))fail('portal catalog drifted');
  if(!v.sitemap.includes('<loc>'+LIVE+'</loc><lastmod>2026-09-01</lastmod>'))fail('focused sitemap row missing');
  return{choices:5,boundaries:5,related:4,sources:2,pageBytes:Buffer.byteLength(v.page),submitted:1};
}
function mutations(){const ms=[['faq',v=>v.page+='<script type="application/ld+json">FAQPage</script>'],['claim',v=>v.page+='<p>가장 인기 있고 90% 정확한 자가진단입니다.</p>'],['choice',v=>v.page=v.page.replace('data-choice="stress"','data-choice="removed"')],['route',v=>v.page=v.page.replace("stress:{href:'/stress-check/?lang=ko'","stress:{href:'/removed/'")],['source',v=>v.page=v.page.replace('apa.org/topics/psychological-testing-assessment','removed.example')],['event',v=>v.page=v.page.replace("'content_ko_test_picker_use'","'removed_use'")],['easy-view',v=>v.page=v.page.replace('intersectionRatio>=.5','intersectionRatio>=0')],['early-disconnect',v=>v.page=v.page.replace("observer.disconnect();sent.add('view')","sent.add('view')")],['private-use',v=>v.page=v.page.replace("{interaction_name:'purpose_picker'}","{interaction_name:'purpose_picker',choice:button.dataset.choice}")],['manual-ad',v=>v.page+='<ins class="adsbygoogle" data-ad-slot="auto"></ins>'],['related',v=>v.page=v.page.replace('class="quick-card related-card"','class="quick-card"')],['catalog',v=>v.catalog=v.catalog.replace('무료 심리테스트: 목적에 맞는 5가지','인기 BEST 7')],['sitemap',v=>v.sitemap=v.sitemap.replace(LIVE,'https://removed.example/')]];for(const[n,m]of ms){const v=load();m(v);try{source(v)}catch(e){console.log('[PASS] '+n+': '+e.message);continue}fail('mutation escaped: '+n)}console.log('[PASS] mutation summary '+ms.length+'/'+ms.length+' detected')}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function server(){return http.createServer((q,s)=>{const p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(!p.startsWith('/portal/'))return s.writeHead(404).end();let f=path.resolve(PORTAL,p.slice(8)||'index.html');if(!f.startsWith(path.resolve(PORTAL)+path.sep))return s.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f))return s.writeHead(404).end();s.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(s)})}
async function block(p){await p.route('**/googletagmanager.com/**',r=>r.abort());await p.route('**/googlesyndication.com/**',r=>r.abort());await p.route('**/doubleclick.net/**',r=>r.abort())}
function events(p){return p.evaluate(()=>(window.dataLayer||[]).map(x=>Array.from(x||[])).filter(x=>x[0]==='event').map(x=>({name:x[1],params:x[2]||{}})))}
async function runtime(live){
  let srv,origin;
  if(live)origin=new URL(live).origin;
  else{
    srv=server();
    const a=await listenOnSafePort(srv);
    origin='http://127.0.0.1:'+a.port;
  }
  const b=await chromium.launch({headless:true});
  try{
    for(const width of [390,1440]){
      const c=await b.newContext({viewport:{width,height:844},serviceWorkers:'block'}),p=await c.newPage();
      await block(p);
      await p.goto(origin+ROUTE,{waitUntil:'domcontentloaded'});
      const layout=await p.evaluate(()=>({
        overflow:document.documentElement.scrollWidth-innerWidth,
        targets:[...document.querySelectorAll('button,a')]
          .filter(x=>x.getClientRects().length)
          .map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))
      }));
      if(layout.overflow>1)fail(width+' overflow '+layout.overflow);
      for(const x of layout.targets)if(x.w<44||x.h<44)fail(width+' target below 44px '+JSON.stringify(x));

      await p.waitForTimeout(1000);
      await p.locator('[data-qualified-picker] h2').scrollIntoViewIfNeeded();
      await p.waitForFunction(
        ()=>(window.dataLayer||[]).filter(x=>x[0]==='event'&&x[1]==='content_ko_test_picker_view').length===1,
        null,
        {timeout:3000}
      );

      const expected=Object.entries(ROUTES);
      for(const[key,href]of expected){
        await p.locator('[data-choice="'+key+'"] strong').click();
        if(await p.locator('.picker-cta').getAttribute('href')!==href)fail(key+' picker route mismatch');
      }
      let rows=await events(p);
      for(const e of ['content_view','content_ko_test_picker_view','content_ko_test_picker_use']){
        if(rows.filter(x=>x.name===e).length!==1)fail(width+' '+e+' not exact-once');
      }
      if(JSON.stringify(rows).match(/choice|selected_purpose/i))fail('picker selection leaked');

      const cta=p.locator('.picker-cta');
      await cta.evaluate(a=>a.addEventListener('click',e=>e.preventDefault(),{once:true}));
      await cta.click();
      await p.locator('.quick-card').first().evaluate(a=>a.addEventListener('click',e=>e.preventDefault(),{once:true}));
      await p.locator('.quick-card').first().click();
      rows=await events(p);
      if(rows.filter(x=>x.name==='content_cta_click').length!==1||rows.filter(x=>x.name==='content_related_click').length!==1)fail(width+' click events mismatch');
      await c.close();
    }
    return{origin,viewports:2,choices:5,use:1,cta:1,related:1,private:true};
  }finally{
    await b.close();
    if(srv)await new Promise(r=>srv.close(r));
  }
}
async function main(){const a=process.argv.slice(2),i=a.indexOf('--url'),live=i>=0?a[i+1]:'';if(live&&new URL(live).href!==LIVE)fail('Live URL mismatch');const s=source(load());if(a.includes('--mutations'))mutations();console.log('[PASS] Korean psychology picker '+JSON.stringify({source:s,runtime:await runtime(live)}))}main().catch(e=>{console.error('[FAIL] '+e.stack);process.exitCode=1});
