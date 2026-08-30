#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const APP = path.join(ROOT, 'projects', 'typing-speed');
const GUIDE_PATH = path.join(PORTAL, 'blog', 'es', 'test-velocidad-escritura-guia.html');
const INDEX_PATH = path.join(PORTAL, 'blog', 'es', 'index.html');
const SITEMAP_PATH = path.join(PORTAL, 'blog', 'sitemap.xml');
const APP_HTML_PATH = path.join(APP, 'index.html');
const APP_JS_PATH = path.join(APP, 'js', 'app.js');
const WORDS_PATH = path.join(APP, 'js', 'word-data.js');
const SW_PATH = path.join(APP, 'sw.js');
const GUIDE_ROUTE = '/portal/blog/es/test-velocidad-escritura-guia.html';
const APP_ROUTE = '/typing-speed/';
const LIVE_GUIDE = `https://dopabrain.com${GUIDE_ROUTE}`;
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const QUICK_TARGETS = ['typing-speed','reaction-test','word-guess','pomodoro-timer'];
const SOURCES = ['es_typing_speed_easy','es_typing_speed_normal','es_typing_speed_hard'];
const USAGE = `Usage:
  node scripts/verify-es-typing-speed.js [--mutations]
  node scripts/verify-es-typing-speed.js --url ${LIVE_GUIDE}`;

function assert(value, message) { if (!value) throw new Error(message); }
function count(text, pattern) { return (text.match(pattern) || []).length; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function visibleText(html) { return html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' '); }
function schemas(html) { return [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1])); }
function events(layer) { return layer.map(item => Array.from(item || [])).filter(item => item[0] === 'event').map(item => ({ name:item[1], params:item[2] || {} })); }

function fixture() {
  return {
    guide: fs.readFileSync(GUIDE_PATH, 'utf8'),
    index: fs.readFileSync(INDEX_PATH, 'utf8'),
    sitemap: fs.readFileSync(SITEMAP_PATH, 'utf8'),
    appHtml: fs.readFileSync(APP_HTML_PATH, 'utf8'),
    appJs: fs.readFileSync(APP_JS_PATH, 'utf8'),
    words: fs.readFileSync(WORDS_PATH, 'utf8'),
    sw: fs.readFileSync(SW_PATH, 'utf8'),
    locales: Object.fromEntries(LOCALES.map(locale => [locale, fs.readFileSync(path.join(APP, 'js', 'locales', `${locale}.json`), 'utf8')]))
  };
}

function verifySource(data) {
  const { guide, index, sitemap, appHtml, appJs, words, sw, locales } = data;
  const text = visibleText(guide);
  assert(guide.includes('data-typing-guide-contract="2026-08-30"'), 'Spanish typing guide release marker is missing');
  assert(guide.includes('<meta name="dateModified" content="2026-08-30">'), 'Spanish typing guide dateModified is stale');
  assert(guide.includes(`<link rel="canonical" href="${LIVE_GUIDE}">`), 'Spanish typing guide canonical drifted');
  assert(count(guide, /rel="alternate"\s+hreflang=/g) === 2, 'Spanish typing guide hreflang must be es plus x-default');
  assert(count(guide, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'Spanish typing guide must have exactly one Auto Ads loader');
  assert(!/FAQPage|AggregateRating|content_ad_impression|adsbygoogle\.push|data-ad-slot=/i.test(guide), 'Spanish typing guide retains unsupported schema or ad telemetry');
  assert(/No usamos una base de datos poblacional/i.test(text) && /no mostramos percentiles/i.test(text) && /no ofrece evaluación médica/i.test(text), 'Spanish typing guide result and health boundary is missing');
  assert(/WPM mostrado = \(caracteres ÷ 5 ÷ minutos\) × precisión por palabra/.test(text), 'Spanish typing formula is missing');
  assert(guide.includes('href="/typing-speed/?lang=es&amp;mode=word&amp;difficulty=normal&amp;source=es_typing_speed_primary"'), 'Spanish typing primary route is broken');
  for (const source of SOURCES) assert(guide.includes(`source=${source}`), `Spanish typing route is missing: ${source}`);
  const quick = [...guide.matchAll(/<a class="quick-card"[^>]*data-target-slug="([^"]+)"/g)].map(match => match[1]);
  assert(JSON.stringify(quick) === JSON.stringify(QUICK_TARGETS), 'Spanish typing quick-route set drifted');
  assert(/intersectionRatio>=0\.5/.test(guide) && /},500\)/.test(guide) && /content_typing_test_view/.test(guide), 'Spanish typing qualified exposure contract is incomplete');
  assert(/content_cta_click/.test(guide) && !/typedText|wpm|accuracy/.test(guide.match(/const params=\{[^}]+\}/)?.[0] || ''), 'Spanish typing guide click telemetry is missing or leaks results');
  const guideTypes = schemas(guide)[0]?.['@graph']?.map(item => item['@type']) || [];
  assert(JSON.stringify(guideTypes) === JSON.stringify(['Article','BreadcrumbList']), 'Spanish typing guide schema must be Article and Breadcrumb only');
  assert(sitemap.includes(`<loc>${LIVE_GUIDE}</loc><lastmod>2026-08-30</lastmod>`), 'Spanish typing sitemap row/date is missing');
  const card = index.match(/<a href="\/portal\/blog\/es\/test-velocidad-escritura-guia\.html"[\s\S]*?<\/a>/)?.[0] || '';
  assert(/WPM y precisión/.test(card) && /Actualizado 2026-08/.test(card), 'Spanish typing catalog card is stale');

  assert(appHtml.includes('data-typing-speed-contract="2026-08-30"'), 'Typing Speed app release marker is missing');
  assert(appHtml.includes('<meta name="dateModified" content="2026-08-30">'), 'Typing Speed app dateModified is stale');
  assert(count(appHtml, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'Typing Speed app must have exactly one Auto Ads loader');
  assert(!/AggregateRating|FAQPage|page_engage|result-percentile|result-grade|ad-banner/i.test(appHtml), 'Typing Speed app retains fabricated proof, hidden schema, or fake ad surfaces');
  assert(!/percentile|injectRewardButton|2x WPM|page_view|getGrade\(|resultGrade/i.test(appJs), 'Typing Speed app retains fabricated ranking, reward inflation, or duplicate page view');
  assert(!/\{grade\}|percentile/i.test(Object.values(locales).join('')), 'Typing Speed locale bundles retain unsupported grade or percentile output');
  const appTypes = schemas(appHtml).map(item => item['@type']);
  assert(JSON.stringify(appTypes) === JSON.stringify(['SoftwareApplication','BreadcrumbList']), 'Typing Speed app schema types drifted');
  assert(/TYPING_ENTRY_SOURCES/.test(appJs) && /\['word', 'sentence'\]\.includes/.test(appJs) && /\['easy', 'normal', 'hard'\]\.includes/.test(appJs), 'Typing Speed linked-entry allowlists are incomplete');
  assert(/typing_test_view/.test(appJs) && /typing_test_start/.test(appJs) && /typing_test_complete/.test(appJs) && /typing_test_share/.test(appJs), 'Typing Speed funnel telemetry is incomplete');
  assert(/startEventSent/.test(appJs) && /completeEventSent/.test(appJs), 'Typing Speed exact-once guards are missing');
  const trackCalls = [...appJs.matchAll(/typingTrack\([\s\S]*?\);/g)].map(match => match[0]).join('\n');
  assert(!/typedText|\bwpm\b|accuracy|correctWords|incorrectWords/.test(trackCalls), 'Typing Speed telemetry leaks typed text or result values');
  assert(/navigator\.share\([\s\S]*?\.then\(\(\) => typingTrack\('typing_test_share'/.test(appJs) && !/typingTrack\('typing_test_share'[^;]*;\s*navigator\.share/.test(appJs), 'Typing Speed native share is not success-gated');
  assert(/navigator\.clipboard\.writeText[\s\S]*?\.then\(\(\) => \{[\s\S]*?typingTrack\('typing_test_share'/.test(appJs), 'Typing Speed clipboard share is not success-gated');
  assert(/const WORD_POOL_ES/.test(words) && /const SENTENCE_POOL_ES/.test(words) && /getRandomWords\(count = 30, language = 'en'\)/.test(words), 'Typing Speed Spanish prompt pools are missing');
  assert(/this\.wordCount = typedWords\.length/.test(appJs) && /typedWords\.forEach/.test(appJs), 'Typing Speed accuracy still penalizes unattempted prompt words');
  assert(/typing-speed-v5/.test(sw) && !/['"]\/js\//.test(sw) && /event\.request\.url\.startsWith\(self\.location\.origin\)/.test(sw) && /response\.ok/.test(sw), 'Typing Speed service-worker scope/success contract is incomplete');
  for (const locale of LOCALES) JSON.parse(locales[locale]);
  return { guideSchemas:guideTypes.length, quickRoutes:quick.length, locales:LOCALES.length, submitted:1 };
}

function mutations(baseline) {
  const cases = [
    ['hidden-faq','unsupported schema',v=>{v.guide += '<script type="application/ld+json">{"@type":"FAQPage"}</script>'}],
    ['stale-date','dateModified is stale',v=>{v.guide=v.guide.replace('dateModified" content="2026-08-30','dateModified" content="2026-06-19')}],
    ['population-claim','result and health boundary is missing',v=>{v.guide=v.guide.replace('No usamos una base de datos poblacional','Usamos una base de datos poblacional').replace('no mostramos percentiles','mostramos percentiles').replace('no ofrece evaluación médica','ofrece evaluación médica')}],
    ['formula-removed','formula is missing',v=>{v.guide=v.guide.replace('WPM mostrado =','Resultado =')}],
    ['primary-broken','primary route is broken',v=>{v.guide=v.guide.replace('/typing-speed/?lang=es&amp;mode=word&amp;difficulty=normal&amp;source=es_typing_speed_primary','/portal/')}],
    ['difficulty-source-removed','route is missing',v=>{v.guide=v.guide.replace('source=es_typing_speed_hard','source=removed')}],
    ['quick-drift','quick-route set drifted',v=>{v.guide=v.guide.replace('data-target-slug="word-guess"','data-target-slug="iq-test"')}],
    ['easy-exposure','qualified exposure contract is incomplete',v=>{v.guide=v.guide.replace('entry.intersectionRatio>=0.5','entry.intersectionRatio>=0')}],
    ['sitemap-removed','sitemap row/date is missing',v=>{v.sitemap=v.sitemap.replace(new RegExp(`  <url><loc>${LIVE_GUIDE.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&')}[^\n]+\n`),'')}],
    ['catalog-stale','catalog card is stale',v=>{v.index=v.index.replace('WPM y precisión','ranking profesional')}],
    ['fake-rating','fabricated proof',v=>{v.appHtml=v.appHtml.replace('"offers": {','"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.5","ratingCount":"850"},"offers": {')}],
    ['fake-percentile','fabricated ranking',v=>{v.appJs=v.appJs.replace('displayResults() {','displayResults() { const percentile = 10;')}],
    ['reward-inflation','reward inflation',v=>{v.appJs=v.appJs.replace('displayResults() {','displayResults() { GameAds.injectRewardButton({label:"2x WPM"});')}],
    ['result-leak','telemetry leaks typed text',v=>{v.appJs=v.appJs.replace("typingTrack('typing_test_complete', {","typingTrack('typing_test_complete', { typedText:this.typedText,")}],
    ['share-premature','native share is not success-gated',v=>{v.appJs=v.appJs.replace("navigator.share({","typingTrack('typing_test_share'); navigator.share({")}],
    ['spanish-pool-removed','Spanish prompt pools are missing',v=>{v.words=v.words.replace('const WORD_POOL_ES','const REMOVED_POOL_ES')}],
    ['accuracy-regression','accuracy still penalizes',v=>{v.appJs=v.appJs.replace('this.wordCount = typedWords.length','this.wordCount = words.length')}],
    ['sw-root-scope','service-worker scope/success contract is incomplete',v=>{v.sw=v.sw.replace("'./js/app.js'","'/js/app.js'")}],
    ['sw-success-removed','service-worker scope/success contract is incomplete',v=>{v.sw=v.sw.replace('response && response.ok','response')}]
  ];
  for (const [name, expected, mutate] of cases) {
    const value=clone(baseline); mutate(value); let message='';
    try { verifySource(value) } catch (error) { message=error.message; }
    assert(message.includes(expected), `${name} mutation escaped: ${message || 'verifier passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
}

function server() {
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.xml':'application/xml'};
  return http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let base, relative;
    if(pathname.startsWith('/portal/')){base=PORTAL;relative=pathname.slice('/portal/'.length)}
    else if(pathname.startsWith('/typing-speed/')){base=APP;relative=pathname.slice('/typing-speed/'.length)}
    else {response.writeHead(404);response.end('Not found');return}
    let file=path.resolve(base,relative);
    if(!(file===base||file.startsWith(`${base}${path.sep}`))){response.writeHead(403);response.end('Forbidden');return}
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    if(!fs.existsSync(file)){response.writeHead(404);response.end('Not found');return}
    response.writeHead(200,{'Cache-Control':'no-store','Content-Type':`${types[path.extname(file)]||'application/octet-stream'}; charset=utf-8`});
    fs.createReadStream(file).pipe(response);
  });
}

async function runtime(guideUrl, local) {
  const browser=await chromium.launch({headless:true});
  const layouts=[];
  try {
    for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
      const context=await browser.newContext({viewport,serviceWorkers:'block'});
      if(local)await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
      const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
      await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});
      await page.waitForSelector('[data-typing-guide-contract="2026-08-30"]');
      const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,targets:[...document.querySelectorAll('.primary,.route-card,.quick-card,.back')].filter(node=>node.getClientRects().length).map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));
      assert(state.overflow===0&&state.h1===1,`Spanish typing guide ${viewport.width}px layout drift: ${JSON.stringify(state)}`);
      for(const target of state.targets)assert(target.w>=44&&target.h>=44,`Spanish typing guide target below 44px: ${JSON.stringify(target)}`);
      assert(errors.length===0,`Spanish typing guide errors: ${errors.join(' | ')}`);
      layouts.push({viewport:viewport.width,overflow:state.overflow});await context.close();
    }

    const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
    if(local)await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
    const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
    await page.goto(guideUrl,{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('.test-actions').evaluate(node=>node.scrollIntoView({block:'center'}));
    await page.waitForTimeout(250);
    let layer=await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[])));
    assert(events(layer).filter(event=>event.name==='content_typing_test_view').length===0,'Spanish typing view fired before 500ms');
    await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_typing_test_view').length===1,null,{timeout:3000});
    await page.locator('.primary').evaluate(node=>node.scrollIntoView({block:'center'}));
    await Promise.all([page.waitForURL(/\/typing-speed\/\?lang=es&mode=word&difficulty=normal&source=es_typing_speed_primary/),page.click('.primary')]);
    await page.waitForFunction(()=>document.documentElement.lang==='es'&&window.app&&document.getElementById('app-loader')?.classList.contains('hidden'),null,{timeout:10000});
    const entry=await page.evaluate(()=>({lang:document.documentElement.lang,start:document.getElementById('start-screen')?.classList.contains('active'),game:document.getElementById('game-screen')?.classList.contains('active'),difficultyVisible:!document.getElementById('difficulty-select')?.classList.contains('hidden'),linked:document.querySelector('.difficulty-card.linked-entry')?.dataset.difficulty,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,targets:[...document.querySelectorAll('button,a')].filter(node=>{const rect=node.getBoundingClientRect();return node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden'&&rect.right>0&&rect.left<innerWidth&&rect.bottom>0&&rect.top<innerHeight}).map(node=>({marker:`${node.tagName}.${node.className}#${node.id}`,w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height})),layer:(window.dataLayer||[]).map(item=>Array.from(item||[]))}));
    assert(entry.lang==='es'&&entry.start&&!entry.game&&entry.difficultyVisible&&entry.linked==='normal'&&entry.overflow===0,`Spanish typing linked entry mismatch: ${JSON.stringify(entry)}`);
    for(const target of entry.targets)assert(target.w>=44&&target.h>=44,`Typing Speed target below 44px: ${JSON.stringify(target)}`);
    let appEvents=events(entry.layer);
    assert(appEvents.filter(event=>event.name==='typing_test_view'&&event.params.entry_surface==='es_typing_speed_primary').length===1,'Typing Speed linked view mismatch');
    assert(appEvents.filter(event=>event.name==='typing_test_start').length===0,'Typing Speed auto-started from the guide');
    await page.click('.difficulty-card[data-difficulty="normal"]');
    const prompt=await page.locator('#typing-display').innerText();
    assert(/[áéíóúñ]|\b(?:que|para|palabra|texto|práctica|precisión)\b/i.test(prompt),`Typing Speed Spanish prompt mismatch: ${prompt}`);
    await page.fill('#typing-input',prompt.split(/\s+/).slice(0,5).join(' '));
    await page.evaluate(()=>{window.GameAds=undefined;window.app.endGame()});
    await page.waitForSelector('#result-screen.active');
    await page.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:()=>Promise.resolve()}));
    await page.click('#share-button');await page.waitForTimeout(50);
    const result=await page.evaluate(()=>({grade:Boolean(document.querySelector('#result-grade,#result-percentile')),layer:(window.dataLayer||[]).map(item=>Array.from(item||[])),active:document.getElementById('result-screen')?.classList.contains('active')}));
    appEvents=events(result.layer);
    assert(result.active&&!result.grade,'Typing Speed result retained a grade or percentile');
    assert(appEvents.filter(event=>event.name==='typing_test_start').length===1&&appEvents.filter(event=>event.name==='typing_test_complete').length===1&&appEvents.filter(event=>event.name==='typing_test_share').length===1,'Typing Speed start/complete/share must fire exactly once');
    assert(!/typedText|\bwpm\b|accuracy|correctWords|incorrectWords/i.test(JSON.stringify(appEvents)),'Typing Speed runtime telemetry leaked typed text or results');
    assert(errors.length===0,`Spanish typing journey errors: ${errors.join(' | ')}`);

    await page.setViewportSize({width:1440,height:900});
    await page.goto(`${new URL(guideUrl).origin}${APP_ROUTE}?lang=es&mode=word&difficulty=easy&source=es_typing_speed_easy`,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>document.documentElement.lang==='es'&&window.app&&document.getElementById('app-loader')?.classList.contains('hidden'),null,{timeout:10000});
    const desktop=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,linked:document.querySelector('.difficulty-card.linked-entry')?.dataset.difficulty}));
    assert(desktop.overflow===0&&desktop.linked==='easy',`Typing Speed desktop linked entry drift: ${JSON.stringify(desktop)}`);
    await context.close();
    return{layouts,appLayouts:[390,1440],qualifiedView:1,cta:1,appView:1,start:1,complete:1,share:1,spanishPrompt:true};
  } finally { await browser.close(); }
}

function args(argv){
  const useMutations=argv.includes('--mutations');const urlIndex=argv.indexOf('--url');const url=urlIndex>=0?argv[urlIndex+1]:null;
  const known=(useMutations?1:0)+(urlIndex>=0?2:0);assert(argv.length===known&&!(useMutations&&url),USAGE);
  if(!url)return{useMutations,url:null};const parsed=new URL(url);assert(parsed.href===LIVE_GUIDE,USAGE);return{useMutations:false,url:parsed.href};
}

async function main(){
  const options=args(process.argv.slice(2));
  if(options.url){console.log(`PASS: live Spanish typing-speed funnel ${JSON.stringify(await runtime(options.url,false))}`);return}
  const baseline=fixture();const source=verifySource(baseline);if(options.useMutations)mutations(baseline);
  const localServer=server();const address=await listenOnSafePort(localServer);
  try{console.log(`PASS: Spanish typing-speed funnel ${JSON.stringify({source,runtime:await runtime(`http://127.0.0.1:${address.port}${GUIDE_ROUTE}`,true)})}`)}
  finally{await new Promise(resolve=>localServer.close(resolve))}
}

main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1});
