#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const APP = path.join(PROJECTS, 'future-self');
const PORTAL = path.join(PROJECTS, 'portal');
const GUIDE_PATH = path.join(PORTAL, 'blog', 'ko', 'future-self-prediction-test.html');
const SITEMAP_PATH = path.join(PORTAL, 'blog', 'sitemap.xml');
const KO_INDEX_PATH = path.join(PORTAL, 'blog', 'ko', 'index.html');
const GUIDE_URL_PATH = '/portal/blog/ko/future-self-prediction-test.html';
const APP_URL_PATH = '/future-self/';
const LIVE_GUIDE = `https://dopabrain.com${GUIDE_URL_PATH}`;
const LANGS = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const QUICK_TARGETS = ['future-self','habit-tracker','mbti-career','life-in-numbers'];
const USAGE = `Usage:\n  node scripts/verify-future-self-funnel.js [--mutations]\n  node scripts/verify-future-self-funnel.js --url ${LIVE_GUIDE}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function loadFixture() {
  const locales = {};
  for (const lang of LANGS) locales[lang] = fs.readFileSync(path.join(APP, 'js', 'locales', `${lang}.json`), 'utf8');
  return {
    appHtml:fs.readFileSync(path.join(APP, 'index.html'), 'utf8'),
    appJs:fs.readFileSync(path.join(APP, 'js', 'app.js'), 'utf8'),
    i18nJs:fs.readFileSync(path.join(APP, 'js', 'i18n.js'), 'utf8'),
    css:fs.readFileSync(path.join(APP, 'css', 'style.css'), 'utf8'),
    sw:fs.readFileSync(path.join(APP, 'sw.js'), 'utf8'),
    locales,
    guide:fs.readFileSync(GUIDE_PATH, 'utf8'),
    sitemap:fs.readFileSync(SITEMAP_PATH, 'utf8'),
    koIndex:fs.readFileSync(KO_INDEX_PATH, 'utf8'),
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
  const { appHtml, appJs, i18nJs, sw, locales, guide, sitemap, koIndex } = fixture;
  assert(appHtml.includes('data-future-self-contract="2026-08-30"'), 'App release contract marker is missing');
  assert(appHtml.includes('<meta name="dateModified" content="2026-08-30">'), 'App dateModified is stale');
  assert(count(appHtml, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'App must have exactly one Auto Ads loader');
  assert(!/AggregateRating|FAQPage|2,340|2340|social-proof-badge|HealthApplication/.test(appHtml), 'App retains fabricated proof or unsupported schema');
  assert(appHtml.includes('data-i18n="app.method"') && appHtml.includes('data-i18n="result.boundary"'), 'Visible app method or result boundary is missing');

  const appSchemas = parseJsonLd(appHtml);
  assert(appSchemas.length === 2, 'App must expose WebApplication and Breadcrumb schema only');
  const webApp = appSchemas.find(schema => schema['@type'] === 'WebApplication');
  const breadcrumb = appSchemas.find(schema => schema['@type'] === 'BreadcrumbList');
  assert(webApp && breadcrumb, 'App WebApplication or Breadcrumb schema is missing');
  assert(webApp.dateModified === '2026-08-30' && webApp.softwareVersion === '2026-08-30 trust contract', 'App schema release contract drifted');
  assert(JSON.stringify(webApp.inLanguage) === JSON.stringify(LANGS), 'App schema locale set/order drifted');
  assert(count(appHtml, /rel="alternate"\s+hreflang=/g) === 13, 'App hreflang count must be 12 locales plus x-default');

  for (const lang of LANGS) {
    const locale = JSON.parse(locales[lang]);
    assert(locale.app?.method && locale.app?.disclaimer && locale.result?.boundary, `${lang} trust translation is incomplete`);
    assert(!Object.hasOwn(locale.engage || {}, 'socialProof') && !/2[,.]340/.test(locales[lang]), `${lang} fabricated social proof remains`);
    assert(!/destined|преднач|運命|注定|नियति|destino|ditakdir|kader|Schicksal|destiné/i.test(locale.meta?.description || ''), `${lang} metadata retains a deterministic future claim`);
  }

  assert(/const queryLang = new URLSearchParams\(window\.location\.search\)\.get\('lang'\)/.test(i18nJs), 'Query language does not override stored/browser language');
  assert(/ENTRY_QUERY\.get\('start'\) === '1'/.test(appJs) && /startJourney\('linked'\)/.test(appJs), 'Linked auto-start contract is missing');
  assert(/\^\[a-z0-9_-\]\{1,48\}\$/.test(appJs), 'Entry source is not allowlisted');
  assert(/entry_mode: entryMode/.test(appJs) && /source_surface: ENTRY_SOURCE/.test(appJs), 'Start telemetry attribution contract is incomplete');
  assert(!/result_type\s*:|result_value\s*:/.test(appJs), 'Result type or score leaks into analytics');
  assert(/completionSent/.test(appJs) && /scoring_method: 'fixed_dual_path_points'/.test(appJs), 'Exact-once completion or scoring-method telemetry is missing');
  assert(/result-desc'\)\.textContent = i18n\.t\('result\.boundary'\)/.test(appJs), 'Runtime result still renders deterministic prediction copy');
  const copyHandler = appJs.slice(appJs.indexOf("document.getElementById('btn-copy')"), appJs.indexOf('// Retake'));
  const writeIndex = copyHandler.indexOf('navigator.clipboard.writeText');
  const successIndex = copyHandler.indexOf('.then(() => {', writeIndex);
  const shareIndex = copyHandler.indexOf("gtag('event', 'share', { method: 'clipboard'");
  assert(writeIndex >= 0 && successIndex > writeIndex && shareIndex > successIndex, 'Clipboard share is recorded before success');

  const cached = [...sw.matchAll(/'\/future-self\/([^']+)'/g)].map(match => match[1]);
  assert(sw.includes("const CACHE_NAME = 'future-self-v3'"), 'Future Self service-worker cache version is stale');
  assert(!cached.includes('js/quiz-data.js'), 'Service worker caches a nonexistent quiz-data file');
  for (const lang of LANGS) assert(cached.includes(`js/locales/${lang}.json`), `Service worker omits ${lang} locale`);
  for (const relative of cached) assert(fs.existsSync(path.join(APP, ...relative.split('/'))), `Service worker asset is missing: ${relative}`);

  assert(guide.includes('data-future-self-guide-contract="2026-08-30"'), 'Guide release contract marker is missing');
  assert(guide.includes('<meta name="dateModified" content="2026-08-30">'), 'Guide dateModified is stale');
  assert(count(guide, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'Guide must have exactly one Auto Ads loader');
  assert(!/FAQPage|AggregateRating|content_ad_impression/.test(guide), 'Guide retains unsupported schema or synthetic ad telemetry');
  assert(!/AI가\s+[^.]{0,30}미래를\s+예측|AI 미래 예측 테스트|심리학 기반/.test(visibleText(guide)), 'Guide retains an unsupported AI or psychology claim');
  assert(guide.includes('href="/future-self/?lang=ko&start=1&source=future_self_guide_primary"'), 'Primary guide CTA does not auto-start the Korean app');
  assert(/답변과 결과값은 URL·저장소·분석 이벤트에 보내지 않습니다/.test(guide), 'Guide privacy boundary is missing');
  assert(/8개 선택 × 답마다 2점 = 전체 16점 분배/.test(guide), 'Guide scoring rule is not visible');
  const quick = [...guide.matchAll(/<a class="quick-card"[^>]*data-target-slug="([^"]+)"/g)].map(match => match[1]);
  assert(JSON.stringify(quick) === JSON.stringify(QUICK_TARGETS), 'Future Self quick-route set drifted');
  assert(/intersectionRatio>=0\.5/.test(guide) && /},500\)/.test(guide), 'Qualified CTA exposure contract is incomplete');
  assert(/track\('content_cta_click',params\)/.test(guide), 'Guide CTA click telemetry is missing');
  const guideSchemas = parseJsonLd(guide);
  assert(guideSchemas.length === 1 && guideSchemas[0]['@graph']?.length === 2, 'Guide must expose Article and Breadcrumb schema only');
  assert(sitemap.includes(`<loc>https://dopabrain.com${GUIDE_URL_PATH}</loc><lastmod>2026-08-30</lastmod>`), 'Guide sitemap row/date is missing');
  const indexCard = koIndex.match(/<a href="\/portal\/blog\/ko\/future-self-prediction-test\.html"[\s\S]*?<\/a>/)?.[0] || '';
  assert(indexCard.includes('미래의 나: 8장면 선택 테스트') && !/AI|예측/.test(indexCard), 'Korean catalog card retains the old prediction claim');
  return { appSchemas:appSchemas.length, locales:LANGS.length, quickRoutes:quick.length, submitted:1 };
}

function runMutations(baseline) {
  const mutations = [
    ['fake-rating', 'App retains fabricated proof', value => { value.appHtml = value.appHtml.replace('</body>', '<div>2,340 users</div><script type="application/ld+json">{"@type":"AggregateRating"}</script></body>'); }],
    ['hidden-faq', 'App retains fabricated proof', value => { value.appHtml += '<script type="application/ld+json">{"@type":"FAQPage"}</script>'; }],
    ['locale-social-proof', 'en fabricated social proof remains', value => { const data=JSON.parse(value.locales.en); data.engage.socialProof='2,340 users'; value.locales.en=JSON.stringify(data); }],
    ['missing-boundary', 'ko trust translation is incomplete', value => { const data=JSON.parse(value.locales.ko); delete data.result.boundary; value.locales.ko=JSON.stringify(data); }],
    ['query-language-ignored', 'Query language does not override', value => { value.i18nJs=value.i18nJs.replace("const queryLang = new URLSearchParams(window.location.search).get('lang');", "const queryLang = null;"); }],
    ['auto-start-removed', 'Linked auto-start contract is missing', value => { value.appJs=value.appJs.replace("if (ENTRY_QUERY.get('start') === '1') startJourney('linked');", ''); }],
    ['result-privacy-leak', 'Result type or score leaks', value => { value.appJs=value.appJs.replace("question_count: MOMENTS.length,", "result_type: winner,\n            question_count: MOMENTS.length,"); }],
    ['premature-share', 'Clipboard share is recorded before success', value => { value.appJs=value.appJs.replace("navigator.clipboard.writeText('https://dopabrain.com/future-self/').then(() => {", "if (typeof gtag === 'function') gtag('event', 'share', { method: 'clipboard', app_name: 'future-self' });\n    navigator.clipboard.writeText('https://dopabrain.com/future-self/').then(() => {"); }],
    ['stale-service-worker', 'Future Self service-worker cache version is stale', value => { value.sw=value.sw.replace('future-self-v3','future-self-v2'); }],
    ['missing-locale-cache', 'Service worker omits fr locale', value => { value.sw=value.sw.replace("    '/future-self/js/locales/fr.json',\n", ''); }],
    ['broken-primary-cta', 'Primary guide CTA does not auto-start', value => { value.guide=value.guide.replace('/future-self/?lang=ko&start=1&source=future_self_guide_primary','/portal/'); }],
    ['tracking-too-easy', 'Qualified CTA exposure contract is incomplete', value => { value.guide=value.guide.replace('entry.intersectionRatio>=0.5','entry.intersectionRatio>=0'); }],
    ['missing-cta-click', 'Guide CTA click telemetry is missing', value => { value.guide=value.guide.replace("track('content_cta_click',params)", "track('content_related_click',params)"); }],
    ['unsupported-guide-claim', 'Guide retains an unsupported AI', value => { value.guide=value.guide.replace('상상 속 미래 하루의 8장면을 고르면', 'AI가 미래를 예측합니다. 상상 속 미래 하루의 8장면을 고르면'); }],
    ['missing-sitemap', 'Guide sitemap row/date is missing', value => { value.sitemap=value.sitemap.replace(`<url><loc>https://dopabrain.com${GUIDE_URL_PATH}</loc><lastmod>2026-08-30</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`, ''); }],
  ];
  for (const [name, expected, mutate] of mutations) {
    const fixture = clone(baseline);
    mutate(fixture);
    let message='';
    try { verifySource(fixture); } catch (error) { message=error.message; }
    assert(message.includes(expected), `${name} mutation escaped: ${message || 'verifier passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
}

function createServer() {
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml'};
  return http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let file;
    if (pathname.startsWith('/portal/')) file=path.resolve(PORTAL,pathname.slice('/portal/'.length));
    else if (pathname.startsWith('/future-self/')) file=path.resolve(APP,pathname.slice('/future-self/'.length));
    else { response.writeHead(404);response.end('Not found');return; }
    const allowed=pathname.startsWith('/portal/')?PORTAL:APP;
    if (!(file===allowed||file.startsWith(`${allowed}${path.sep}`))) { response.writeHead(403);response.end('Forbidden');return; }
    if (fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404);response.end('Not found');return; }
    response.writeHead(200,{'Cache-Control':'no-store','Content-Type':`${types[path.extname(file)]||'application/octet-stream'}; charset=utf-8`});
    fs.createReadStream(file).pipe(response);
  });
}

function browserEvents(layer) {
  return layer.map(item=>Array.from(item||[])).filter(item=>item[0]==='event').map(item=>({name:item[1],params:item[2]||{}}));
}

async function layoutCheck(browser, guideUrl, appUrl, local) {
  const summaries=[];
  for (const viewport of [{width:390,height:844},{width:1440,height:900}]) {
    const context=await browser.newContext({viewport,serviceWorkers:'block'});
    if(local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
    const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
    try {
      await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});
      await page.waitForSelector('[data-future-self-guide-contract="2026-08-30"]');
      const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,targets:[...document.querySelectorAll('.quick-card,.cta')].map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));
      assert(state.overflow===0&&state.h1===1,`Guide ${viewport.width}px layout drift: ${JSON.stringify(state)}`);
      for(const target of state.targets) assert(target.w>=44&&target.h>=44,`Guide target below 44px: ${JSON.stringify(target)}`);
      assert(errors.length===0,`Guide page errors: ${errors.join(' | ')}`);
      summaries.push({viewport:viewport.width,overflow:state.overflow});
    } finally { await context.close(); }
  }

  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  if(local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  try {
    for(const lang of LANGS){
      await page.goto(`${appUrl}?lang=${lang}`,{waitUntil:'domcontentloaded',timeout:30000});
      await page.waitForFunction(()=>!document.querySelector('#app-loader'));
      const state=await page.evaluate(()=>({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,method:document.querySelector('.method-badge')?.textContent,boundary:document.querySelector('#result-desc')?.textContent,start:{w:document.querySelector('#btn-start')?.getBoundingClientRect().width,h:document.querySelector('#btn-start')?.getBoundingClientRect().height}}));
      assert(state.lang===lang&&state.method&&!/app\.method/.test(state.method)&&state.boundary&&!/result\.boundary/.test(state.boundary),`${lang} runtime trust translation failed`);
      assert(state.overflow===0&&state.start.w>=44&&state.start.h>=44,`${lang} mobile layout/target failed: ${JSON.stringify(state)}`);
    }
    assert(errors.length===0,`App locale page errors: ${errors.join(' | ')}`);
    return summaries;
  } finally { await context.close(); }
}

async function funnelCheck(browser, guideUrl, local) {
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  if(local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  try {
    await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});
    const capturedGuideEvents=[];
    await page.exposeFunction('__captureFutureSelfGuideEvent',(name,params)=>capturedGuideEvents.push({name,params}));
    await page.evaluate(()=>{const original=window.gtag;window.gtag=(...args)=>{if(args[0]==='event')window.__captureFutureSelfGuideEvent(args[1],args[2]||{});return original?.(...args)}});
    await page.locator('.primary-box').evaluate(node=>node.scrollIntoView({block:'center'}));
    await page.waitForTimeout(250);
    let layer=await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[])));
    assert(browserEvents(layer).filter(event=>event.name==='content_future_self_cta_view').length===0,'Guide CTA view fired before 500ms');
    await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_future_self_cta_view').length===1,null,{timeout:3000});
    layer=await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[])));
    assert(browserEvents(layer).filter(event=>event.name==='content_future_self_cta_view').length===1,'Guide qualified CTA view did not fire exactly once');
    await Promise.all([page.waitForURL(/\/future-self\/\?lang=ko&start=1&source=future_self_guide_primary/),page.click('.primary-box .cta')]);
    assert(capturedGuideEvents.filter(event=>event.name==='content_cta_click'&&event.params.target_slug==='future-self').length===1,'Guide CTA click did not fire exactly once');
    await page.waitForSelector('#screen-story.active .choice-btn');
    let state=await page.evaluate(()=>({lang:document.documentElement.lang,moment:document.querySelector('#moment-counter')?.textContent,layer:(window.dataLayer||[]).map(item=>Array.from(item||[]))}));
    let events=browserEvents(state.layer);
    const start=events.filter(event=>event.name==='test_start');
    assert(state.lang==='ko'&&/1\s*\/\s*8/.test(state.moment),`Linked Korean auto-start failed: ${JSON.stringify(state)}`);
    assert(start.length===1&&start[0].params.entry_mode==='linked'&&start[0].params.source_surface==='future_self_guide_primary','Linked start attribution mismatch');

    for(let index=0;index<8;index+=1){
      await page.locator('.choice-btn').first().click();
      if(index<7) await page.waitForFunction(expected=>document.querySelector('#moment-counter')?.textContent.trim().startsWith(String(expected)),index+2);
    }
    await page.waitForSelector('#screen-result.active');
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copied=value;}}}));
    await page.click('#btn-copy');
    await page.waitForTimeout(50);
    state=await page.evaluate(()=>({boundary:document.querySelector('#result-desc')?.textContent,name:document.querySelector('#result-name')?.textContent,url:location.href,storage:Object.keys(localStorage),session:Object.keys(sessionStorage),copied:window.__copied,layer:(window.dataLayer||[]).map(item=>Array.from(item||[]))}));
    events=browserEvents(state.layer);
    const complete=events.filter(event=>event.name==='test_complete');
    const shares=events.filter(event=>event.name==='share'&&event.params.method==='clipboard');
    assert(complete.length===1&&complete[0].params.scoring_method==='fixed_dual_path_points'&&complete[0].params.question_count===8,'Completion event contract mismatch');
    assert(!/result_type|result_value|ceo/i.test(JSON.stringify(complete[0].params)),'Completion telemetry leaked result data');
    assert(shares.length===1&&state.copied==='https://dopabrain.com/future-self/','Clipboard success/share contract mismatch');
    assert(!/ceo|artist|adventurer|scholar|healer|influencer|inventor|freelancer/i.test(`${state.url}${JSON.stringify(state.storage)}${JSON.stringify(state.session)}`),'Result leaked to URL or browser storage');
    assert(state.boundary&&!/result\.boundary/.test(state.boundary)&&state.name,'Runtime result boundary/name is missing');
    assert(errors.length===0,`Funnel page errors: ${errors.join(' | ')}`);
    return {start:1,complete:1,share:1,answers:8};
  } finally { await context.close(); }
}

async function manualStartCheck(browser, appUrl, local) {
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  if(local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
  const page=await context.newPage();
  try {
    await page.goto(`${appUrl}?lang=en`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>!document.querySelector('#app-loader'));
    await page.locator('#btn-start').click({ force: true });
    const events=browserEvents(await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[]))));
    const start=events.filter(event=>event.name==='test_start');
    assert(start.length===1&&start[0].params.entry_mode==='manual'&&start[0].params.source_surface==='direct','Manual start attribution mismatch');
    return {manualStart:1};
  } finally { await context.close(); }
}

async function runtimeCheck(guideUrl,local){
  const browser=await chromium.launch({headless:true});
  const parsed=new URL(guideUrl);const appUrl=`${parsed.origin}${APP_URL_PATH}`;
  try { return {layouts:await layoutCheck(browser,guideUrl,appUrl,local),funnel:await funnelCheck(browser,guideUrl,local),manual:await manualStartCheck(browser,appUrl,local)}; }
  finally { await browser.close(); }
}

function parseArgs(argv){
  const mutations=argv.includes('--mutations');const urlIndex=argv.indexOf('--url');const url=urlIndex>=0?argv[urlIndex+1]:null;const known=(mutations?1:0)+(urlIndex>=0?2:0);
  assert(argv.length===known&&!(mutations&&url),USAGE);
  if(!url)return{mutations,url:null};const parsed=new URL(url);assert(parsed.href===LIVE_GUIDE,USAGE);return{mutations:false,url:parsed.href};
}

async function main(){
  const args=parseArgs(process.argv.slice(2));
  if(args.url){const runtime=await runtimeCheck(args.url,false);console.log(`PASS: live Future Self funnel ${JSON.stringify(runtime)}`);return;}
  const fixture=loadFixture();const source=verifySource(fixture);if(args.mutations)runMutations(fixture);
  const server=createServer();const address=await listenOnSafePort(server);
  try{const runtime=await runtimeCheck(`http://127.0.0.1:${address.port}${GUIDE_URL_PATH}`,true);console.log(`PASS: Future Self funnel ${JSON.stringify({source,runtime})}`);}
  finally{await new Promise(resolve=>server.close(resolve));}
}

main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1;});
