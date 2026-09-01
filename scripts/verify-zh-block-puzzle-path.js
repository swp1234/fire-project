#!/usr/bin/env node
const fs=require('fs'),http=require('http'),path=require('path');
const {chromium}=require('playwright');
const {listenOnSafePort}=require('./lib/safe-local-port');
const ROOT=path.resolve(__dirname,'..'),PORTAL=path.join(ROOT,'projects','portal'),APP=path.join(ROOT,'projects','block-puzzle');
const GUIDE_ROUTE='/portal/blog/zh/dopabrain-games-2026.html',APP_ROUTE='/block-puzzle/';
const GUIDE_LIVE='https://dopabrain.com'+GUIDE_ROUTE,APP_LIVE='https://dopabrain.com'+APP_ROUTE;
const LANGS=['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr'];
function ok(value,message){if(!value)throw Error(message)}
function read(file){return fs.readFileSync(file,'utf8')}
function count(source,pattern){return(source.match(pattern)||[]).length}
function fixture(){
  const targets=['block-puzzle','idle-clicker','sky-runner','word-guess'].map(slug=>({slug,i18n:read(path.join(ROOT,'projects',slug,'js','i18n.js')),zh:read(path.join(ROOT,'projects',slug,'js','locales','zh.json'))}));
  return{guide:read(path.join(PORTAL,'blog','zh','dopabrain-games-2026.html')),catalog:read(path.join(PORTAL,'blog','zh','index.html')),sitemap:read(path.join(PORTAL,'blog','sitemap.xml')),html:read(path.join(APP,'index.html')),js:read(path.join(APP,'js','app.js')),i18n:read(path.join(APP,'js','i18n.js')),manifest:read(path.join(APP,'manifest.json')),sw:read(path.join(APP,'sw.js')),locales:fs.readdirSync(path.join(APP,'js','locales')).filter(x=>x.endsWith('.json')).map(file=>read(path.join(APP,'js','locales',file))),targets};
}
function source(v){
  ok(v.guide.includes('data-zh-dopabrain-games-contract="2026-09-01"'),'guide release contract missing');
  for(const text of ['四种玩法，不是效果排名','不是认知测量或治疗','广告不改变得分，也不用于解锁游戏','分数、等级和输赢不会写入分析事件或分享网址'])ok(v.guide.includes(text),'guide boundary missing: '+text);
  ok(count(v.guide,/class="game-card quick-card"/g)===4,'guide must expose exactly four choice cards');
  ok(count(v.guide,/href="\/block-puzzle\/\?lang=zh&amp;source=zh_dopabrain_games_block"/g)===2,'two focused Block Puzzle routes required');
  for(const slug of ['block-puzzle','idle-clicker','sky-runner','word-guess'])ok(v.guide.includes('data-target-slug="'+slug+'"'),'guide target missing: '+slug);
  for(const event of ['content_view','content_zh_game_catalog_view','content_game_click','content_related_click'])ok(v.guide.includes("'"+event+"'"),'guide event missing: '+event);
  ok(/intersectionRatio>=\.5/.test(v.guide)&&/setTimeout\(function\(\).*?,500\)/s.test(v.guide)&&/clearTimeout\(timer\)/.test(v.guide),'guide 50%/500ms qualification missing');
  ok(count(v.guide,/\/portal\/js\/ad-loader\.js/g)===1&&!/FAQPage|AggregateRating|content_ad_impression|data-ad-slot|<ins[^>]+adsbygoogle|cross-promo\.js/.test(v.guide),'guide trust or Auto Ads contract drifted');
  const schemas=[...v.guide.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  ok(schemas.length===1&&JSON.stringify(schemas[0]['@graph'].map(item=>item['@type']))===JSON.stringify(['Article','BreadcrumbList']),'guide schema types drifted');
  ok(v.catalog.includes(GUIDE_ROUTE)&&v.catalog.includes('从方块拼图开始的 4 个入口')&&v.catalog.includes('2026-09 更新'),'Chinese catalog stale');
  ok(v.sitemap.includes('<loc>'+GUIDE_LIVE+'</loc><lastmod>2026-09-01</lastmod>'),'focused sitemap row missing');

  ok(v.html.includes('data-block-puzzle-contract="2026-09-01"'),'app release contract missing');
  ok(count(v.html,/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g)===1,'app must load Auto Ads once');
  ok(!/AggregateRating|FAQPage|page_engage|content_ad_impression|ad-placeholder|interstitial-overlay|shareTwitterBtn|shareUrlBtn|daily-streak|achievements|cross-promo\.js/.test(v.html+'\n'+v.js),'app fake proof, synthetic UI, or generic promotion remains');
  ok(!/injectRewardButton|removeRewardButton|DailyStreak|GameAchievements|game_start|game_over|gtag\('event',\s*'engagement'/.test(v.js),'score reward or legacy analytics remains');
  ok(v.html.indexOf('sources=new Set')<v.html.indexOf('googletagmanager.com/gtag/js'),'query sanitizer must precede analytics');
  ok(/sources=new Set\(\['zh_dopabrain_games_block'\]\)/.test(v.html)&&/langs\.has\(lang\)/.test(v.html),'query allowlist drifted');
  for(const event of ['block_puzzle_view','block_puzzle_start','block_puzzle_complete','block_puzzle_share','block_puzzle_related_click'])ok(v.js.includes("'"+event+"'"),'app event missing: '+event);
  const tracking=(v.js.match(/trackBlockPuzzle\([\s\S]{0,150}/g)||[]).join('\n');
  ok(!/(?:score|level|lines|grid|result|board|combo)\s*:/.test(tracking),'private game state enters telemetry');
  ok(/await navigator\.share/.test(v.js)&&/await navigator\.clipboard\.writeText/.test(v.js)&&/trackBlockPuzzle\('block_puzzle_share'\)/.test(v.js),'success-only share gate missing');
  ok(!/this\.score|this\.level/.test((v.js.match(/async shareScore\(\)[\s\S]*?\n    }\n\n    loadHighScore/)||[''])[0]),'share payload exposes result state');
  const manifest=JSON.parse(v.manifest);ok(manifest.start_url===APP_ROUTE&&manifest.scope===APP_ROUTE&&!manifest.share_target,'manifest scope or share target drifted');
  ok(/CACHE_NAME = 'block-puzzle-v7'/.test(v.sw)&&/SCOPE = '\/block-puzzle\/'/.test(v.sw)&&/url\.origin !== self\.location\.origin/.test(v.sw)&&/url\.pathname\.startsWith\(SCOPE\)/.test(v.sw)&&!/^\s*['"]\/['"],?\s*$/m.test(v.sw),'service worker scope drifted');
  ok(v.locales.length===12&&v.locales.every(text=>{const data=JSON.parse(text);return!text.includes('\uFFFD')&&!data.ad&&!data.share_msg}),'12 clean locale files required');
  ok(count(v.html,/data-target-slug=/g)===4&&/related-card\[data-target-slug\]/.test(v.i18n),'localized app related routes drifted');
  for(const target of v.targets){JSON.parse(target.zh);const supported=(target.i18n.match(/supportedLanguages\s*=\s*\[([^\]]+)\]/)||[])[1]||'';ok(/['"]zh['"]/.test(supported),'Chinese support missing: '+target.slug)}
  return{guideBytes:Buffer.byteLength(v.guide),appBytes:Buffer.byteLength(v.html)+Buffer.byteLength(v.js)+Buffer.byteLength(v.i18n),locales:12,choices:4};
}
function mutations(){
  const cases=[
    ['guide-contract',v=>v.guide=v.guide.replace('data-zh-dopabrain-games-contract','data-broken-contract')],
    ['guide-choice-count',v=>v.guide=v.guide.replace('class="game-card quick-card"','class="removed-card"')],
    ['guide-boundary',v=>v.guide=v.guide.replace('广告不改变得分，也不用于解锁游戏','广告可让得分翻倍')],
    ['guide-route',v=>v.guide=v.guide.replace('source=zh_dopabrain_games_block','source=unknown')],
    ['guide-view',v=>v.guide=v.guide.replace('intersectionRatio>=.5','intersectionRatio>=0')],
    ['guide-schema',v=>v.guide=v.guide.replace('"BreadcrumbList"','"FAQPage"')],
    ['catalog',v=>v.catalog=v.catalog.replace('从方块拼图开始的 4 个入口','过期游戏排行')],
    ['sitemap',v=>v.sitemap=v.sitemap.replace(GUIDE_LIVE,'https://removed.example/')],
    ['app-contract',v=>v.html=v.html.replace('data-block-puzzle-contract','data-broken-contract')],
    ['app-rating',v=>v.html=v.html.replace('<body','<div>AggregateRating 4.9</div><body')],
    ['app-reward',v=>v.js=v.js.replace('const showGameOver =',"GameAds.injectRewardButton({onReward:()=>this.score*=2});\nconst showGameOver =")],
    ['app-event',v=>v.js=v.js.replaceAll("'block_puzzle_complete'","'removed_complete'")],
    ['app-private',v=>v.js=v.js.replace("trackBlockPuzzle('block_puzzle_complete')","trackBlockPuzzle('block_puzzle_complete',{score:this.score})")],
    ['app-share',v=>v.js=v.js.replace('await navigator.clipboard.writeText','navigator.clipboard.writeText')],
    ['manifest',v=>v.manifest=v.manifest.replace('"scope": "/block-puzzle/"','"scope": "/"')],
    ['service-worker',v=>v.sw=v.sw.replace("SCOPE = '/block-puzzle/'","SCOPE = '/'")],
    ['locale-retired-ad',v=>v.locales[0]=v.locales[0].replace('{','{"ad":{"placeholder":"Ad"},')],
    ['target-language',v=>v.targets[1].i18n=v.targets[1].i18n.replace("'zh'","'xx'")]
  ];
  for(const [name,mutate] of cases){const v=fixture();mutate(v);try{source(v)}catch(error){console.log('[PASS] '+name+': '+error.message);continue}throw Error('mutation escaped: '+name)}
  console.log('[PASS] mutation summary '+cases.length+'/'+cases.length+' detected');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg'};
function server(){return http.createServer((request,response)=>{const pathname=decodeURIComponent(new URL(request.url,'http://x').pathname);const match=pathname.match(/^\/([^/]+)\/(.*)$/);if(!match)return response.writeHead(404).end();const slug=match[1],root=slug==='portal'?PORTAL:path.join(ROOT,'projects',slug),relative=match[2];if(!fs.existsSync(root))return response.writeHead(404).end();let file=path.resolve(root,relative||'index.html');if(!file.startsWith(path.resolve(root)+path.sep)&&file!==path.resolve(root,'index.html'))return response.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file))return response.writeHead(404).end();response.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(response)})}
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
      ok((await page.locator('h1').textContent()).includes('方块拼图'),width+' guide identity mismatch');
      ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' guide overflow');
      await page.evaluate(()=>{const panel=document.querySelector('.qualified-catalog');window.__qualifiedScroll=setInterval(()=>panel&&panel.scrollIntoView({block:'center'}),100)});
      await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_zh_game_catalog_view').length===1,null,{timeout:8000});
      await page.evaluate(()=>clearInterval(window.__qualifiedScroll));
      for(const selector of ['.primary .play','.related-link']){const link=page.locator(selector).first();await link.evaluate(node=>node.addEventListener('click',event=>event.preventDefault()));await link.click();await link.click()}
      let rows=await events(page);for(const name of ['content_view','content_zh_game_catalog_view','content_game_click','content_related_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');

      await page.goto(origin+APP_ROUTE+'?lang=zh&source=zh_dopabrain_games_block&bad=1#score-999',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.game&&document.documentElement.lang==='zh');
      ok((await page.evaluate(()=>location.search))==='?lang=zh&source=zh_dopabrain_games_block',width+' query sanitizer mismatch');
      ok((await page.evaluate(()=>location.hash))==='',width+' app fragment not removed');
      ok((await page.locator('h1').textContent()).trim().length>3,width+' Chinese app render failed');
      ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+' app overflow');
      if(width===1440){for(const lang of LANGS){await page.evaluate(lang=>window.i18n.setLanguage(lang),lang);await page.waitForFunction(expected=>document.documentElement.lang===expected,lang);ok((await page.locator('#btn-start').textContent()).trim().length>2,'empty start copy: '+lang);ok((await page.locator('.related-card').first().getAttribute('href')).includes('?lang='+lang),'related language mismatch: '+lang)}await page.evaluate(()=>window.i18n.setLanguage('zh'))}
      await page.evaluate(()=>document.getElementById('btn-start').click());
      await page.evaluate(()=>window.game.gameOver());
      await page.evaluate(()=>window.game.gameOver());
      await page.click('#btn-share');await page.click('#btn-share');
      const related=page.locator('.related-card').first();await related.evaluate(node=>node.addEventListener('click',event=>event.preventDefault()));await related.click();await related.click();
      rows=await events(page);for(const name of ['block_puzzle_view','block_puzzle_start','block_puzzle_complete','block_puzzle_share','block_puzzle_related_click'])ok(rows.filter(row=>row.name===name).length===1,width+' '+name+' exact once');
      const own=rows.filter(row=>row.name.startsWith('block_puzzle_')),keys=own.flatMap(row=>Object.keys(row.params));ok(!keys.some(key=>/(?:score|level|lines|grid|result|board|combo)/i.test(key)),'private event key leaked: '+keys.join(','));
      ok(await page.locator('.ga-reward-btn').count()===0,width+' score reward button appeared');
      await context.close();
    }
    return{origin,viewports:2,languages:12,funnel:'exact-once',private:true};
  }finally{await browser.close();if(local)await new Promise(resolve=>local.close(resolve))}
}
async function main(){const args=process.argv.slice(2),index=args.indexOf('--url'),live=index>=0?args[index+1]:'';if(live&&new URL(live).origin!=='https://dopabrain.com')throw Error('live origin mismatch');const result=source(fixture());if(args.includes('--mutations'))mutations();console.log('[PASS] Chinese Block Puzzle path '+JSON.stringify({source:result,runtime:await runtime(live)}))}
main().catch(error=>{console.error('[FAIL] '+error.stack);process.exitCode=1});
