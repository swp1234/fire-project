#!/usr/bin/env node
const fs=require('fs'),http=require('http'),path=require('path');
const{chromium}=require('playwright');
const{listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),APP=path.join(ROOT,'projects','overthinker-test');
const LOCALES=['ko','en','ja','zh','es','pt','id','tr','de','fr','hi','ru'];
const STAGES=['view','start','progress','complete','next_click','share','related_click'];
const EVENTS=STAGES.map(stage=>`overthinker_${stage}`);
const SCORE_MAP=[[5,1,2,4],[2,3,1,5],[3,1,0,2],[0,4,1,5],[3,2,1,0],[1,4,3,5],[4,1,0,2],[0,3,1,4]];
function ok(value,message){if(!value)throw Error(message)}
function read(file){return fs.readFileSync(path.join(APP,file),'utf8')}
function count(text,regex){return Array.from(text.matchAll(regex)).length}
function fixture(overrides={}){return{html:overrides.html??read('index.html'),css:overrides.css??read('css/style.css'),app:overrides.app??read('js/app.js'),i18n:overrides.i18n??read('js/i18n.js'),sw:overrides.sw??read('sw.js'),manifest:overrides.manifest??read('manifest.json'),readme:overrides.readme??read('README.md'),locales:overrides.locales??Object.fromEntries(LOCALES.map(lang=>[lang,read(`js/locales/${lang}.json`)]))}}
function source(overrides={}){
  const v=fixture(overrides),all=[v.html,v.css,v.app,v.i18n,v.sw,v.manifest,...Object.values(v.locales)].join('\n');
  ok(v.html.includes('data-ad-serving="suspended-invalid-traffic-2026-09-03"'),'suspension marker missing');
  ok(!/pagead2|adsbygoogle|data-ad-slot|data-ad-client|GameAds|showInterstitial|showRewarded/i.test(all),'ad code conflicts with suspension');
  ok(!/aggregateRating|ratingCount|FAQPage|page_engage|ad_impression|social-proof|percentile|14,200|cross-promo|share-kakao|share-twitter|share-facebook/i.test(all),'fabricated proof or legacy promotion remains');
  ok(!/user-scalable\s*=\s*no/i.test(v.html),'viewport disables zoom');
  ok(/not a mental-health assessment or a fixed personality label/i.test(v.html)&&/Each answer adds one point/i.test(v.html),'visible boundary or method missing');
  const match=v.app.match(/const ANSWER_TYPE=(\[[\s\S]*?\]);\nconst tracked=/);ok(match,'score map missing');
  const map=JSON.parse(match[1]);ok(JSON.stringify(map)===JSON.stringify(SCORE_MAP),'transparent one-point map drifted');
  ok(/this\.scores\[typeIndex\]\+=1/.test(v.app)&&/if\(this\.scores\[i\]>this\.scores\[best\]\)best=i/.test(v.app),'displayed scoring or tie rule drifted');
  ok(v.html.includes('/stress-check/?lang=ko&amp;source=overthinker_result'),'primary Stress Check route drifted');
  ok(count(v.html,/data-related-slug=/g)===2&&v.html.includes('/emotion-iceberg/')&&v.html.includes('/hsp-test/'),'focused related routes drifted');
  for(const stage of STAGES)ok(count(v.app,new RegExp(`track\\('${stage}'\\)`,'g'))===1,`event call count drifted: ${stage}`);
  ok(/const tracked=new Set\(\)/.test(v.app)&&/tracked\.has\(stage\)/.test(v.app),'exact-once guard missing');
  ok(/this\.answers\.length===4\)track\('progress'\)/.test(v.app),'progress does not require four answers');
  ok(/gtag\('event',`overthinker_\$\{stage\}`,\{event_category:'overthinker_reflection'\}\)/.test(v.app),'telemetry contains unexpected parameters');
  ok(/document\.createElement\('button'\)/.test(v.app)&&/button\.disabled=true/.test(v.app),'answer controls are not native single-submit buttons');
  ok(/text:t\('share\.text'\),url:'https:\/\/dopabrain\.com\/overthinker-test\/'/.test(v.app),'share copy exposes a result or wrong URL');
  ok(/if\(success\)track\('share'\)/.test(v.app)&&/await navigator\.share\(data\)/.test(v.app)&&/await navigator\.clipboard\.writeText\(data\.url\)/.test(v.app),'share is not success-gated');
  ok(/CACHE_NAME=`\$\{CACHE_PREFIX\}v3`/.test(v.sw)&&/url\.origin!==self\.location\.origin/.test(v.sw)&&/url\.pathname\.startsWith\(BASE\)/.test(v.sw)&&/response\.ok/.test(v.sw),'service-worker boundary drifted');
  const manifest=JSON.parse(v.manifest);ok(manifest.scope==='/overthinker-test/'&&manifest.start_url==='/overthinker-test/','manifest scope drifted');
  for(const[lang,text]of Object.entries(v.locales)){
    ok(!text.includes('\uFFFD'),`${lang} contains replacement character`);
    const locale=JSON.parse(text);
    ok(locale.intro?.boundary&&locale.intro?.method&&locale.result?.boundary&&locale.result?.calculation,`${lang} boundary or method missing`);
    ok(Object.keys(locale.question||{}).length===40,`${lang} question inventory drifted`);
    ok(Object.keys(locale.type||{}).length===6&&Object.values(locale.type).every(item=>Object.keys(item).sort().join(',')==='name,tagline'),`${lang} result inventory drifted`);
    ok(Object.keys(locale.related||{}).sort().join(',')==='emotionIceberg,hspTest',`${lang} related inventory drifted`);
    ok(locale.share?.text&&locale.share?.success&&locale.share?.failure&&!/\{type\}|\{emoji\}|\{result\}/.test(locale.share.text),`${lang} share contract drifted`);
    ok(!locale.analyzing&&!locale.result?.metricsTitle&&!locale.result?.percentile,`${lang} retired result content remains`);
  }
  ok(Buffer.byteLength(v.readme)<1500,'README exceeds compact contract budget');
  return{locales:LOCALES.length,events:EVENTS.length,related:2};
}
async function server(){
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
  const instance=http.createServer((req,res)=>{try{
    const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
    if(!pathname.startsWith('/overthinker-test/'))return res.writeHead(404).end();
    let file=path.resolve(APP,pathname.slice('/overthinker-test/'.length)||'index.html');
    ok(file===APP||file.startsWith(APP+path.sep),'unsafe path');
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    if(!fs.existsSync(file))return res.writeHead(404).end();
    res.writeHead(200,{'content-type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','cache-control':'no-store'}).end(fs.readFileSync(file));
  }catch(error){res.writeHead(400).end(error.message)}});
  const address=await listenOnSafePort(instance);return{origin:`http://127.0.0.1:${address.port}`,close:()=>new Promise(resolve=>instance.close(resolve))};
}
function eventRows(rows){return rows.filter(row=>row?.[0]==='event'&&EVENTS.includes(row[1])).map(row=>({name:row[1],params:row[2]||{}}))}
async function runtime(base){
  const ownOrigin=new URL(base).origin,browser=await chromium.launch({headless:true});
  try{for(const test of[{width:390,height:844,lang:'en'},{width:1440,height:900,lang:'fr'}]){
    const context=await browser.newContext({viewport:{width:test.width,height:test.height}}),page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>new URL(route.request().url()).origin===ownOrigin?route.continue():route.abort());
    await page.addInitScript(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async()=>true}));
    await page.goto(`${base}/overthinker-test/?lang=${test.lang}`,{waitUntil:'domcontentloaded',timeout:20000});
    await page.waitForSelector(`html[lang="${test.lang}"]`,{timeout:10000});
    ok(await page.locator('body[data-ad-serving]').count()===1,`${test.width}px suspension marker missing`);
    const start=await page.locator('#start-btn').boundingBox();ok(start&&start.width>=44&&start.height>=44,`${test.width}px start target too small`);
    await page.click('#start-btn');
    for(let i=0;i<TOTAL;i++){
      await page.locator('.option').first().click();
      if(i<TOTAL-1)await page.waitForFunction(next=>document.getElementById('progress-text').textContent.startsWith(String(next)),i+2);
    }
    await page.waitForSelector('#result-screen.active',{timeout:10000});
    const next=`/stress-check/?lang=${test.lang}&source=overthinker_result`;
    const related=[`/emotion-iceberg/?lang=${test.lang}&source=overthinker_related`,`/hsp-test/?lang=${test.lang}&source=overthinker_related`];
    ok(await page.locator('#next-action').getAttribute('href')===next,`${test.width}px primary route drifted`);
    await page.evaluate(()=>document.getElementById('next-action').addEventListener('click',event=>event.preventDefault()));
    await page.click('#next-action');await page.click('#share-page');await page.click('#share-page');
    await page.evaluate(()=>document.querySelector('[data-related-slug]').addEventListener('click',event=>event.preventDefault()));
    await page.click('[data-related-slug] strong');
    const report=await page.evaluate(()=>({rows:(window.dataLayer||[]).filter(row=>row?.[0]==='event'),overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,targets:['#next-action','#share-page','#retry-btn'].map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{w:r.width,h:r.height}}),related:Array.from(document.querySelectorAll('[data-related-slug]'),link=>{const r=link.getBoundingClientRect();return{href:link.getAttribute('href'),w:r.width,h:r.height}}),ads:document.querySelectorAll('script[src*="pagead2"],ins.adsbygoogle,[data-ad-slot]').length,result:document.getElementById('result-type').textContent.trim(),calc:document.getElementById('result-calculation').textContent.trim(),boundary:document.querySelector('#result-screen .notice').textContent.trim(),status:document.getElementById('share-status').textContent.trim()}));
    const events=eventRows(report.rows);for(const name of EVENTS)ok(events.filter(event=>event.name===name).length===1,`${test.width}px ${name} not exact-once`);
    ok(events.every(event=>Object.keys(event.params).every(key=>key==='event_category')),`${test.width}px private telemetry detected`);
    ok(report.overflow<=0&&[...report.targets,...report.related].every(target=>target.w>=44&&target.h>=44),`${test.width}px layout regression ${JSON.stringify(report)}`);
    ok(report.related.map(item=>item.href).join('|')===related.join('|'),`${test.width}px related routes drifted`);
    ok(!report.ads&&report.result&&report.calc&&report.boundary&&report.status&&!errors.length,`${test.width}px runtime error ${errors.join('|')}`);
    await context.close();
  }}finally{await browser.close()}
}
function mutations(){
  const b=fixture(),cases=[
    ['marker',{html:b.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"','')}],
    ['ad',{html:b.html.replace('</head>','<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>')}],
    ['rating',{html:b.html.replace('</body>','<p>aggregateRating</p></body>')}],
    ['proof',{html:b.html.replace('</body>','<p>14,200 users</p></body>')}],
    ['boundary',{html:b.html.replace('not a mental-health assessment or a fixed personality label','a personality assessment')}],
    ['method',{html:b.html.replace('Each answer adds one point','Each answer adds a score')}],
    ['score-map',{app:b.app.replace('[5,1,2,4]','[0,1,2,4]')}],
    ['score-add',{app:b.app.replace('this.scores[typeIndex]+=1','this.scores[typeIndex]+=2')}],
    ['tie',{app:b.app.replace('this.scores[i]>this.scores[best]','this.scores[i]>=this.scores[best]')}],
    ['primary',{html:b.html.replace('/stress-check/?lang=ko&amp;source=overthinker_result','/portal/')}],
    ['related',{html:b.html.replace('data-related-slug="hsp-test"','')}],
    ['event',{app:b.app.replace("track('complete');",'')}],
    ['exact-once',{app:b.app.replace('tracked.has(stage)','false')}],
    ['progress',{app:b.app.replace('this.answers.length===4','this.answers.length===1')}],
    ['telemetry',{app:b.app.replace("{event_category:'overthinker_reflection'}","{event_category:'overthinker_reflection',result:'private'}")}],
    ['button-lock',{app:b.app.replace('button.disabled=true','button.disabled=false')}],
    ['share-copy',{app:b.app.replace("text:t('share.text')","text:document.getElementById('result-type').textContent")}],
    ['share-gate',{app:b.app.replace("if(success)track('share')","track('share')")}],
    ['sw-origin',{sw:b.sw.replace('url.origin!==self.location.origin||','')}],
    ['sw-success',{sw:b.sw.replace('if(response.ok)','if(response)')}],
    ['manifest',{manifest:b.manifest.replace('"scope": "/overthinker-test/"','"scope": "/"')}],
    ['locale',{locales:{...b.locales,en:b.locales.en.replace('This is a playful snapshot of your answers, not a mental-health assessment or a fixed personality label.','')}}],
    ['readme',{readme:b.readme+'x'.repeat(1500)}]
  ];
  for(const[name,override]of cases){let caught=false;try{source({...b,...override})}catch(error){caught=true;console.log(`[PASS] ${name}: ${error.message}`)}ok(caught,`mutation escaped: ${name}`)}
  console.log(`[PASS] mutation summary ${cases.length}/${cases.length} detected`);
}
async function main(){
  const urlAt=process.argv.indexOf('--url'),base=urlAt>=0?process.argv[urlAt+1].replace(/\/$/,''):'';
  const result=source();if(process.argv.includes('--mutations'))mutations();
  if(base)await runtime(base);else{const local=await server();try{await runtime(local.origin)}finally{await local.close()}}
  console.log(`[PASS] Overthinker containment: ${result.locales} locales, ${result.related} routes, ${result.events} private stages`);
}
const TOTAL=8;
main().catch(error=>{console.error('[FAIL] '+error.message);process.exitCode=1});
