#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const STRESS = path.join(ROOT, 'projects', 'stress-check');
const GUIDE_PATH = path.join(PORTAL, 'blog', 'en', 'doom-scrolling-mental-health-effects.html');
const SITEMAP_PATH = path.join(PORTAL, 'blog', 'sitemap.xml');
const INDEX_PATH = path.join(PORTAL, 'blog', 'en', 'index.html');
const GUIDE_URL_PATH = '/portal/blog/en/doom-scrolling-mental-health-effects.html';
const STRESS_URL_PATH = '/stress-check/';
const LIVE_GUIDE = `https://dopabrain.com${GUIDE_URL_PATH}`;
const QUICK_TARGETS = ['stress-check','detox-timer','overthinker-test','white-noise'];
const USAGE = `Usage:\n  node scripts/verify-doomscrolling-bridge.js [--mutations]\n  node scripts/verify-doomscrolling-bridge.js --url ${LIVE_GUIDE}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function loadFixture() {
  return {
    guide: fs.readFileSync(GUIDE_PATH, 'utf8'),
    sitemap: fs.readFileSync(SITEMAP_PATH, 'utf8'),
    index: fs.readFileSync(INDEX_PATH, 'utf8'),
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseJsonLd(html) {
  return [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
}

function visibleText(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

function verifySource(fixture) {
  const { guide, sitemap, index } = fixture;
  const text = visibleText(guide);
  assert(guide.includes('data-doomscroll-contract="2026-08-30"'), 'Doomscrolling release marker is missing');
  assert(guide.includes('<meta name="dateModified" content="2026-08-30">'), 'Doomscrolling dateModified is stale');
  assert(guide.includes('<link rel="canonical" href="https://dopabrain.com/portal/blog/en/doom-scrolling-mental-health-effects.html">'), 'Doomscrolling canonical drifted');
  assert(count(guide, /rel="alternate"\s+hreflang=/g) === 2, 'Doomscrolling hreflang must be en plus x-default');
  assert(count(guide, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'Doomscrolling guide must have exactly one Auto Ads loader');
  assert(!/FAQPage|AggregateRating|content_ad_impression/.test(guide), 'Doomscrolling guide retains unsupported schema or synthetic ad telemetry');
  assert(!/hijack(?:s|ing|ed)? (?:your )?(?:brain|dopamine)|neurochemical trap|cortisol levels? for|reward baseline|more than 2 hours|evidence-based strategies/i.test(text), 'Doomscrolling guide retains an unsupported health claim');
  assert(/associations, not proof/.test(text) && /not a diagnosis or treatment/.test(text), 'Doomscrolling health boundary is missing');
  assert(guide.includes('href="/stress-check/?lang=en&source=doomscroll_guide_primary"'), 'Primary Stress Check bridge is broken');
  const quick = [...guide.matchAll(/<a class="quick-card"[^>]*data-target-slug="([^"]+)"/g)].map(match => match[1]);
  assert(JSON.stringify(quick) === JSON.stringify(QUICK_TARGETS), 'Doomscrolling quick-route set drifted');
  assert(count(guide, /<li><a href="https:\/\//g) === 4, 'Doomscrolling source list must contain four direct sources');
  assert(/intersectionRatio>=0\.5/.test(guide) && /},500\)/.test(guide) && /observe\(document\.querySelector\('\.reset-actions'\)\)/.test(guide), 'Qualified reset exposure contract is incomplete');
  assert(/resetUseSent/.test(guide) && /content_doomscroll_reset_use/.test(guide), 'Exact-once reset-use telemetry is missing');
  assert(!/track\('content_doomscroll_reset_use',[\s\S]{0,120}(?:plan|choice|data-plan)/.test(guide), 'Reset telemetry leaks the selected plan');
  assert(/track\('content_cta_click',params\)/.test(guide), 'Doomscrolling CTA click telemetry is missing');
  const schemas = parseJsonLd(guide);
  assert(schemas.length === 1 && schemas[0]['@graph']?.length === 2, 'Doomscrolling schema must contain Article and Breadcrumb only');
  const types = schemas[0]['@graph'].map(item => item['@type']);
  assert(JSON.stringify(types) === JSON.stringify(['Article','BreadcrumbList']), 'Doomscrolling schema types/order drifted');
  assert(sitemap.includes(`<loc>https://dopabrain.com${GUIDE_URL_PATH}</loc><lastmod>2026-08-30</lastmod>`), 'Doomscrolling sitemap row/date is missing');
  const card = index.match(/\['doom-scrolling-mental-health-effects\.html'[\s\S]*?\],/)?.[0] || '';
  assert(card.includes('60-Second Stop Plan') && !/hijack|brain science/i.test(card), 'English catalog retains the old unsupported claim');
  return { schemas:types.length, quickRoutes:quick.length, sources:4, submitted:1 };
}

function runMutations(baseline) {
  const mutations = [
    ['hidden-faq','unsupported schema',value=>{value.guide += '<script type="application/ld+json">{"@type":"FAQPage"}</script>';}],
    ['stale-date','dateModified is stale',value=>{value.guide=value.guide.replace('dateModified" content="2026-08-30','dateModified" content="2026-06-12');}],
    ['health-claim','unsupported health claim',value=>{value.guide=value.guide.replace('Doomscrolling is continuing','Doomscrolling hijacks your dopamine and is continuing');}],
    ['missing-boundary','health boundary is missing',value=>{value.guide=value.guide.replace('associations, not proof','correlations only');}],
    ['broken-primary','Primary Stress Check bridge is broken',value=>{value.guide=value.guide.replace('/stress-check/?lang=en&source=doomscroll_guide_primary','/portal/');}],
    ['quick-drift','quick-route set drifted',value=>{value.guide=value.guide.replace('data-target-slug="white-noise"','data-target-slug="dopamine-type"');}],
    ['missing-source','source list must contain four',value=>{value.guide=value.guide.replace('<li><a href="https://support.google.com/android/answer/9346420?hl=en"','<li><a href="/portal/"');}],
    ['tracking-too-easy','Qualified reset exposure contract is incomplete',value=>{value.guide=value.guide.replace('entry.intersectionRatio>=0.5','entry.intersectionRatio>=0');}],
    ['selection-leak','Reset telemetry leaks the selected plan',value=>{value.guide=value.guide.replace("{interaction_name:'one_minute_reset'}", "{interaction_name:'one_minute_reset',plan:button.dataset.plan}");}],
    ['missing-use-guard','Exact-once reset-use telemetry is missing',value=>{value.guide=value.guide.replace('resetUseSent=false','resetUsed=false').replace(/resetUseSent/g,'');}],
    ['missing-click','CTA click telemetry is missing',value=>{value.guide=value.guide.replace("track('content_cta_click',params)", "track('content_related_click',params)");}],
    ['missing-sitemap','sitemap row/date is missing',value=>{value.sitemap=value.sitemap.replace(`<url><loc>https://dopabrain.com${GUIDE_URL_PATH}</loc><lastmod>2026-08-30</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`, '');}],
    ['catalog-claim','catalog retains the old unsupported claim',value=>{value.index=value.index.replace('Notice a distressing-news loop','Your phone is hijacking your brain science. Notice a distressing-news loop');}],
  ];
  for (const [name, expected, mutate] of mutations) {
    const fixture=clone(baseline);mutate(fixture);let message='';
    try { verifySource(fixture); } catch (error) { message=error.message; }
    assert(message.includes(expected),`${name} mutation escaped: ${message||'verifier passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
}

function createServer() {
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml'};
  return http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let base;let relative;
    if(pathname.startsWith('/portal/')){base=PORTAL;relative=pathname.slice('/portal/'.length);}
    else if(pathname.startsWith('/stress-check/')){base=STRESS;relative=pathname.slice('/stress-check/'.length);}
    else{response.writeHead(404);response.end('Not found');return;}
    let file=path.resolve(base,relative);
    if(!(file===base||file.startsWith(`${base}${path.sep}`))){response.writeHead(403);response.end('Forbidden');return;}
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    if(!fs.existsSync(file)){response.writeHead(404);response.end('Not found');return;}
    response.writeHead(200,{'Cache-Control':'no-store','Content-Type':`${types[path.extname(file)]||'application/octet-stream'}; charset=utf-8`});
    fs.createReadStream(file).pipe(response);
  });
}

function browserEvents(layer) {
  return layer.map(item=>Array.from(item||[])).filter(item=>item[0]==='event').map(item=>({name:item[1],params:item[2]||{}}));
}

async function runtimeCheck(guideUrl, local) {
  const browser=await chromium.launch({headless:true});
  const summaries=[];
  try {
    for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
      const context=await browser.newContext({viewport,serviceWorkers:'block'});
      if(local)await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
      const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
      try{
        await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});
        await page.waitForSelector('[data-doomscroll-contract="2026-08-30"]');
        const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,targets:[...document.querySelectorAll('.quick-card,.cta,.reset-choice')].map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));
        assert(state.overflow===0&&state.h1===1,`Doomscrolling ${viewport.width}px layout drift: ${JSON.stringify(state)}`);
        for(const target of state.targets)assert(target.w>=44&&target.h>=44,`Doomscrolling target below 44px: ${JSON.stringify(target)}`);
        assert(errors.length===0,`Doomscrolling page errors: ${errors.join(' | ')}`);
        summaries.push({viewport:viewport.width,overflow:state.overflow});
      }finally{await context.close();}
    }

    const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
    if(local)await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
    const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
    const captured=[];
    try{
      await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});
      await page.exposeFunction('__captureDoomscrollEvent',(name,params)=>captured.push({name,params}));
      await page.evaluate(()=>{const original=window.gtag;window.gtag=(...args)=>{if(args[0]==='event')window.__captureDoomscrollEvent(args[1],args[2]||{});return original?.(...args)}});
      if(!local)await page.waitForTimeout(1500);
      await page.locator('.reset-actions').evaluate(node=>node.scrollIntoView({block:'center'}));
      await page.waitForTimeout(250);
      let layer=await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[])));
      assert(browserEvents(layer).filter(event=>event.name==='content_doomscroll_reset_view').length===0,'Reset view fired before 500ms');
      try {
        await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_doomscroll_reset_view').length===1,null,{timeout:3000});
      } catch (error) {
        const diagnostic=await page.evaluate(()=>{const rect=document.querySelector('.reset-actions')?.getBoundingClientRect();return{rect:rect&&{top:rect.top,bottom:rect.bottom,height:rect.height},viewport:innerHeight,scrollY,events:(window.dataLayer||[]).filter(item=>item[0]==='event').map(item=>item[1])}});
        throw new Error(`Qualified reset view timed out: ${JSON.stringify(diagnostic)}`);
      }
      await page.locator('[data-plan="news"]').click();
      await page.locator('[data-plan="sleep"]').click();
      const reset=await page.evaluate(()=>({output:document.querySelector('[data-reset-output]')?.textContent,pressed:[...document.querySelectorAll('.reset-choice')].map(node=>node.getAttribute('aria-pressed')),layer:(window.dataLayer||[]).map(item=>Array.from(item||[])),url:location.href,storage:Object.keys(localStorage)}));
      const events=browserEvents(reset.layer);const uses=events.filter(event=>event.name==='content_doomscroll_reset_use');
      assert(uses.length===1&&uses[0].params.interaction_name==='one_minute_reset','Reset use must fire exactly once');
      assert(!/news|sleep|app|plan|choice/i.test(JSON.stringify(uses[0].params)),'Reset runtime telemetry leaked the selected plan');
      assert(reset.pressed.join(',')==='false,false,true'&&/arm.?s reach/i.test(reset.output),'Reset interaction state/output mismatch');
      assert(!/news|sleep|app/i.test(`${reset.url}${JSON.stringify(reset.storage)}`),'Reset selection leaked to URL or browser storage');
      await page.locator('.primary').evaluate(node=>node.scrollIntoView({block:'center'}));
      await Promise.all([page.waitForURL(/\/stress-check\/\?lang=en&source=doomscroll_guide_primary/),page.click('.primary .cta')]);
      assert(captured.filter(event=>event.name==='content_cta_click'&&event.params.target_slug==='stress-check').length===1,'Stress Check CTA click did not fire exactly once');
      await page.waitForSelector('h1');
      const destination=await page.evaluate(()=>({lang:document.documentElement.lang,h1:document.querySelector('h1')?.textContent,url:location.href}));
      assert(destination.lang==='en'&&destination.h1&&/lang=en&source=doomscroll_guide_primary/.test(destination.url),`Stress Check destination mismatch: ${JSON.stringify(destination)}`);
      assert(errors.length===0,`Doomscrolling funnel errors: ${errors.join(' | ')}`);
      return {layouts:summaries,resetView:1,resetUse:1,cta:1,destination:'stress-check'};
    }finally{await context.close();}
  }finally{await browser.close();}
}

function parseArgs(argv){
  const mutations=argv.includes('--mutations');const urlIndex=argv.indexOf('--url');const url=urlIndex>=0?argv[urlIndex+1]:null;const known=(mutations?1:0)+(urlIndex>=0?2:0);
  assert(argv.length===known&&!(mutations&&url),USAGE);
  if(!url)return{mutations,url:null};const parsed=new URL(url);assert(parsed.href===LIVE_GUIDE,USAGE);return{mutations:false,url:parsed.href};
}

async function main(){
  const args=parseArgs(process.argv.slice(2));
  if(args.url){console.log(`PASS: live doomscrolling bridge ${JSON.stringify(await runtimeCheck(args.url,false))}`);return;}
  const fixture=loadFixture();const source=verifySource(fixture);if(args.mutations)runMutations(fixture);
  const server=createServer();const address=await listenOnSafePort(server);
  try{const runtime=await runtimeCheck(`http://127.0.0.1:${address.port}${GUIDE_URL_PATH}`,true);console.log(`PASS: doomscrolling bridge ${JSON.stringify({source,runtime})}`);}
  finally{await new Promise(resolve=>server.close(resolve));}
}

main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1;});
