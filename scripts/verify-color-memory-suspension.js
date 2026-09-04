#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'projects', 'color-memory');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const LOCALES = ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
const EVENTS = ['color_memory_view','color_memory_start','color_memory_progress','color_memory_complete','color_memory_share','color_memory_related_click'];

function assert(value, message) { if (!value) throw new Error(message); }
function read(relative) { return fs.readFileSync(path.join(APP, relative), 'utf8'); }
function count(text, regex) { return Array.from(text.matchAll(regex)).length; }
function fixture(overrides = {}) {
  return {
    html:overrides.html ?? read('index.html'), css:overrides.css ?? read('css/style.css'), app:overrides.app ?? read('js/app.js'),
    sw:overrides.sw ?? read('sw.js'), manifest:overrides.manifest ?? read('manifest.json'), readme:overrides.readme ?? read('README.md'),
    locales:overrides.locales ?? Object.fromEntries(LOCALES.map((lang) => [lang, read(`js/locales/${lang}.json`)])),
  };
}

function verifySource(overrides = {}) {
  const value = fixture(overrides);
  const source = [value.html,value.css,value.app,value.sw,...Object.values(value.locales)].join('\n');
  assert(/data-ad-serving="suspended-invalid-traffic-2026-09-03"/.test(value.html), 'Color Memory suspension marker missing');
  assert(!/pagead2|adsbygoogle|data-ad-slot|\/portal\/js\/game-ads\.js|\bGameAds\b/i.test(source), 'Active ad or rewarded-game code conflicts with suspension');
  assert(!/showInterstitial|rewarded_ad|Watch Ad|injectRewardButton/i.test(value.html + value.app), 'Ad gate or rewarded score remains');
  assert(!/aggregateRating|ratingCount|page_engage|traffic_quality|content_ad_impression/i.test(value.html + value.app), 'Fabricated proof or synthetic telemetry remains');
  assert(!/DailyStreak|GameAchievements|daily-streak\.js|achievements\.js|cross-promo\.js/i.test(value.html + value.app), 'Unqualified retention or generic promotion remains');
  assert(!/shareTwitterBtn|shareUrlBtn|class="related-games"|class="ad-container/i.test(value.html), 'Duplicate share, ad, or recommendation surface remains');
  assert(count(value.html, /data-related-slug=/g) === 4, 'Color Memory must keep four attributable related routes');
  assert(count(value.app, /addEventListener\('touchstart'[\s\S]{0,80}handleColorClick/g) === 0, 'Touch and click can double-submit one color');
  for (const eventName of EVENTS) assert(count(value.app, new RegExp(`['"]${eventName}['"]`, 'g')) === 1, `Stage event call count drifted: ${eventName}`);
  assert(/const colorMemoryTrackedStages = new Set\(\)/.test(value.app) && /colorMemoryTrackedStages\.has\(eventName\)/.test(value.app), 'Exact-once stage guard missing');
  assert(!/trackColorMemoryStage\('color_memory_(?:view|start|progress|complete|share)'\s*,/.test(value.app), 'Private game value entered a stage event');
  assert(/const text = 'I played Color Memory on DopaBrain\.'/i.test(value.app) && /const url = 'https:\/\/dopabrain\.com\/color-memory\/'/.test(value.app), 'Share copy must remain neutral and canonical');
  assert(/await navigator\.share/.test(value.app) && /await navigator\.clipboard\.writeText/.test(value.app), 'Share must wait for success');
  assert(value.app.indexOf("trackColorMemoryStage('color_memory_share')") > value.app.indexOf('await navigator.share'), 'Share telemetry must follow success');
  assert(!fs.existsSync(path.join(APP, 'js/error-handler.js')), 'Unused raw exception handler returned');
  assert(/CACHE_NAME = 'color-memory-v4'/.test(value.sw), 'Color Memory cache version is stale');
  assert(/url\.origin !== self\.location\.origin/.test(value.sw) && /url\.pathname\.startsWith\(APP_PATH\)/.test(value.sw), 'Service worker boundary missing');
  assert(/response\.ok/.test(value.sw) && !/['"]\/index\.html['"]|['"]\/css\//.test(value.sw), 'Service worker success or relative-asset contract drifted');
  const manifest = JSON.parse(value.manifest);
  assert(manifest.scope === '/color-memory/' && manifest.start_url === '/color-memory/', 'Manifest scope drifted');
  for (const [lang, text] of Object.entries(value.locales)) { JSON.parse(text); assert(lang, 'Locale key missing'); }
  assert(!['og-image.jpg','og-image.svg'].some((file) => fs.existsSync(path.join(APP, file))), 'Unused social media returned');
  assert(Buffer.byteLength(value.readme,'utf8') < 2500 && /invalid-traffic review/i.test(value.readme), 'README is stale or oversized');
  return { locales:12, related:4, events:EVENTS.length };
}

async function startServer() {
  const types={'.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
  const server=http.createServer((request,response)=>{ try {
    const pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname); let base; let relative;
    if(pathname.startsWith('/color-memory/')){base=APP;relative=pathname.slice(14)||'index.html';}
    else if(pathname.startsWith('/portal/')){base=PORTAL;relative=pathname.slice(8);} else return response.writeHead(404).end();
    let target=path.resolve(base,relative); assert(target===base||target.startsWith(`${base}${path.sep}`),`Unsafe path: ${pathname}`);
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    if(!fs.existsSync(target)||!fs.statSync(target).isFile())return response.writeHead(404).end();
    response.writeHead(200,{'Cache-Control':'no-store','Content-Type':`${types[path.extname(target)]||'application/octet-stream'}; charset=utf-8`}); response.end(fs.readFileSync(target));
  } catch(error){response.writeHead(400).end(error.message);} });
  const address=await listenOnSafePort(server); return {origin:`http://127.0.0.1:${address.port}`,close:()=>new Promise((resolve)=>server.close(resolve))};
}
function stageEvents(rows){return rows.filter((row)=>row?.[0]==='event'&&EVENTS.includes(row[1])).map((row)=>({name:row[1],params:row[2]||{}}));}

async function verifyRuntime(baseUrl){
  const browser=await chromium.launch({headless:true});
  try{for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
    const context=await browser.newContext({viewport,hasTouch:true}); const page=await context.newPage(); const errors=[];
    page.on('pageerror',(error)=>errors.push(error.message));
    await page.route('**/*',(route)=>new URL(route.request().url()).origin===new URL(baseUrl).origin?route.continue():route.abort());
    await page.addInitScript(()=>{localStorage.setItem('colorMemory_tutorialSeen','true');Object.defineProperty(navigator,'share',{configurable:true,value:async()=>true});});
    await page.goto(`${baseUrl}/color-memory/?lang=en`,{waitUntil:'domcontentloaded',timeout:20000});
    await page.waitForFunction(()=>!document.getElementById('app-loader'),null,{timeout:15000});
    await page.click('#start-btn'); await page.waitForFunction(()=>window.game&&document.getElementById('game-screen')?.classList.contains('active'));
    await page.evaluate(()=>{game.isPlayingSequence=false;game.isUserTurn=true;game.sequence=['red','blue'];game.userSequence=[];game.lives=3;});
    const redBox=await page.locator('[data-color="red"]').boundingBox(); assert(redBox,`${viewport.width}px red control missing`);
    await page.touchscreen.tap(redBox.x+redBox.width/2,redBox.y+redBox.height/2);
    const touches=await page.evaluate(()=>game.userSequence.length); assert(touches===1,`${viewport.width}px one touch produced ${touches} inputs`);
    await page.evaluate(()=>{game.isPlayingSequence=false;game.isUserTurn=true;game.sequence=['red'];game.userSequence=[];document.querySelector('[data-color="red"]').click();});
    await page.waitForFunction(()=>window.dataLayer?.some((row)=>row?.[1]==='color_memory_progress'));
    await page.evaluate(()=>game.endGame()); await page.waitForSelector('#game-over-screen.active');
    await page.click('#play-again-btn'); await page.evaluate(()=>game.endGame()); await page.waitForSelector('#game-over-screen.active');
    await page.click('#share-btn');
    await page.evaluate(()=>document.querySelector('[data-related-slug]')?.addEventListener('click',(event)=>event.preventDefault(),{once:true}));
    await page.locator('[data-related-slug] span').first().click(); await page.waitForTimeout(500);
    const report=await page.evaluate(()=>({events:(window.dataLayer||[]).filter((row)=>row?.[0]==='event'),overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,targets:['#play-again-btn','#share-btn'].map((selector)=>{const rect=document.querySelector(selector).getBoundingClientRect();return{selector,width:rect.width,height:rect.height};}),ad:document.querySelectorAll('script[src*="pagead2"],script[src*="game-ads"],ins.adsbygoogle,[data-ad-slot],.ad-container').length,reward:Array.from(document.querySelectorAll('button')).filter((button)=>/watch ad|reward/i.test(button.textContent)).length}));
    const stages=stageEvents(report.events); for(const eventName of EVENTS)assert(stages.filter((event)=>event.name===eventName).length===1,`${viewport.width}px ${eventName} must fire once`);
    assert(stages.every((event)=>!Object.keys(event.params).some((key)=>/color|sequence|round|score|level|time|result|error|url|location/i.test(key))),`${viewport.width}px private game value entered analytics`);
    assert(report.overflow<=0,`${viewport.width}px horizontal overflow: ${report.overflow}`); assert(report.targets.every((target)=>target.width>=44&&target.height>=44),`${viewport.width}px action below 44px`);
    assert(report.ad===0&&report.reward===0&&errors.length===0,`${viewport.width}px retired surface or error: ${errors.join(' | ')}`); await context.close();
  }}finally{await browser.close();}
}

function verifyMutations(){const base=fixture();const cases=[
  ['marker',{html:base.html.replace('data-ad-serving="suspended-invalid-traffic-2026-09-03"','')}],['loader',{html:base.html.replace('</head>','<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script></head>')}],['reward',{app:`${base.app}\nGameAds.injectRewardButton({label:'Watch Ad'});`}],['rating',{html:base.html.replace('</body>','<div>aggregateRating</div></body>')}],['synthetic',{app:`${base.app}\ngtag('event','page_engage');`}],['private',{app:base.app.replace("trackColorMemoryStage('color_memory_progress');","trackColorMemoryStage('color_memory_progress',this.round);")}],['premature-share',{app:base.app.replace('await navigator.share','navigator.share')}],['retention',{html:base.html.replace('</body>','<script src="/portal/js/achievements.js"></script></body>')}],['related',{html:base.html.replace('data-related-slug="memory-card"','')}],['event',{app:base.app.replace("trackColorMemoryStage('color_memory_progress');",'')}],['duplicate-share',{html:base.html.replace('</body>','<button id="shareTwitterBtn"></button></body>')}],['double-touch',{app:base.app.replace("btn.addEventListener('click', (e) => this.handleColorClick(e));","btn.addEventListener('click', (e) => this.handleColorClick(e));\n            btn.addEventListener('touchstart', (e) => this.handleColorClick(e));")}],['root-cache',{sw:base.sw.replace("'./index.html'","'/index.html'")}],['scope',{sw:base.sw.replace(' || !url.pathname.startsWith(APP_PATH)','')}],['success',{sw:base.sw.replace('if (response.ok)','if (response)')}],['readme',{readme:base.readme+'x'.repeat(2500)}],['wrong-share',{app:base.app.replace('https://dopabrain.com/color-memory/','https://dopabrain.com/games/color/')}]
];for(const[name,override]of cases){let detected=false;try{verifySource({...base,...override});}catch(error){detected=true;console.log(`[PASS] ${name}: ${error.message}`);}assert(detected,`Mutation escaped: ${name}`);}console.log(`Mutation summary: ${cases.length}/${cases.length} detected`);}

async function main(){const at=process.argv.indexOf('--url');const production=at>=0?process.argv[at+1].replace(/\/$/,''):'';const result=verifySource();if(process.argv.includes('--mutations'))verifyMutations();if(production)await verifyRuntime(production);else{const server=await startServer();try{await verifyRuntime(server.origin);}finally{await server.close();}}console.log(`[PASS] Color Memory suspension: ${result.locales} locales, ${result.related} related routes, ${result.events} private stages`);}
main().catch((error)=>{console.error(`[FAIL] ${error.message}`);process.exitCode=1;});
