const http=require('http');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');

const workspace=path.resolve(__dirname,'..');
const appIds=['color-memory','memory-card','minesweeper','puzzle-2048','number-puzzle','reaction-test','typing-speed','word-scramble','block-puzzle'];
const routeRoots=[{prefix:'/portal/',root:path.join(workspace,'projects','portal')}]
  .concat(appIds.map(id=>({prefix:`/${id}/`,root:path.join(workspace,'projects',id)})));
const mime={'.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
function findFile(urlPath){const route=routeRoots.find(item=>urlPath.startsWith(item.prefix));if(!route)return null;let relative=urlPath.slice(route.prefix.length);if(!relative||relative.endsWith('/'))relative+='index.html';const file=path.resolve(route.root,relative);return file.startsWith(route.root+path.sep)&&fs.existsSync(file)&&!fs.statSync(file).isDirectory()?file:null}
function server(){return http.createServer((req,res)=>{const file=findFile(decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file){res.writeHead(404);res.end('Not found');return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)})}
function events(page){return page.evaluate(()=>(window.dataLayer||[]).map(item=>item?.event||(item?.[0]==='event'?item[1]:null)).filter(Boolean))}

async function run(){
  const production=process.argv.includes('--production');const local=production?null:server();if(local)await new Promise(ok=>local.listen(0,'127.0.0.1',ok));
  const origin=production?'https://dopabrain.com':`http://127.0.0.1:${local.address().port}`;const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];
  page.on('pageerror',error=>{if(!/adsbygoogle|TagError/i.test(String(error)))errors.push(String(error))});
  try{
    const localeReports=[];
    for(const locale of ['ko','en','zh','hi','ru','ja','es','pt','id','tr','de','fr']){
      await page.goto(`${origin}/portal/tools/brain-game-workout.html?lang=${locale}&source=verify`,{waitUntil:'domcontentloaded'});await page.waitForSelector('#buildPlan');
      localeReports.push(await page.evaluate(expected=>({expected,lang:document.documentElement.lang,title:document.querySelector('h1')?.textContent,button:document.querySelector('#buildPlan')?.textContent,canonical:document.querySelector('link[rel=canonical]')?.href,adCount:document.querySelectorAll('[data-ad-surface="brain_game_workout_inline"]').length,jsonLd:document.querySelectorAll('script[type="application/ld+json"]').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}),locale));
    }
    await page.goto(`${origin}/portal/tools/brain-game-workout.html?lang=ko&source=verify`,{waitUntil:'domcontentloaded'});await page.evaluate(()=>localStorage.removeItem('brain_game_workout_v1'));await page.reload({waitUntil:'domcontentloaded'});
    await page.click('#buildPlan');
    const ten=await page.evaluate(()=>({ids:[...document.querySelectorAll('.stage')].map(x=>x.dataset.stageId),minutes:[...document.querySelectorAll('.stage-copy small')].map(x=>parseInt(x.textContent,10)),progress:document.querySelector('#todayProgress').textContent,title:document.querySelector('#planTitle').textContent}));
    await page.click('#buildPlan');const deterministic=await page.evaluate(()=>[...document.querySelectorAll('.stage')].map(x=>x.dataset.stageId));
    await page.evaluate(()=>document.querySelector('[data-play]')?.addEventListener('click',event=>event.preventDefault(),{capture:true}));await page.click('[data-play]');await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));
    for(const button of await page.locator('[data-complete]').all())await button.click();
    const complete=await page.evaluate(()=>({progress:document.querySelector('#todayProgress').textContent,streak:document.querySelector('#streak').textContent,sessions:document.querySelector('#completedSessions').textContent,cardVisible:!document.querySelector('#completeCard').hidden,stored:JSON.parse(localStorage.getItem('brain_game_workout_v1'))}));
    await page.locator('[data-complete]').first().click();await page.locator('[data-complete]').first().click();const beforeReloadEvents=await events(page);await page.reload({waitUntil:'domcontentloaded'});
    const persisted=await page.evaluate(()=>({progress:document.querySelector('#todayProgress').textContent,streak:document.querySelector('#streak').textContent,sessions:document.querySelector('#completedSessions').textContent,ids:[...document.querySelectorAll('.stage')].map(x=>x.dataset.stageId)}));
    await page.click('#timeChoices [data-value="5"]');await page.click('#buildPlan');const five=await page.evaluate(()=>[...document.querySelectorAll('.stage-copy small')].map(x=>parseInt(x.textContent,10)));
    await page.click('#timeChoices [data-value="15"]');await page.click('#buildPlan');const fifteen=await page.evaluate(()=>[...document.querySelectorAll('.stage-copy small')].map(x=>parseInt(x.textContent,10)));
    const interactionEvents=[...new Set(beforeReloadEvents.concat(await events(page)))];

    await page.goto(`${origin}/portal/blog/ko/2026-brain-training-top-10.html`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.cp-brain-workout');await page.locator('.cp-brain-workout').scrollIntoViewIfNeeded();await page.waitForTimeout(120);
    const brainBridge=await page.evaluate(()=>({title:document.querySelector('.cp-brain-workout-title')?.textContent,href:document.querySelector('.cp-brain-workout-link')?.getAttribute('href'),workout:document.querySelectorAll('.cp-brain-workout').length,palworld:document.querySelectorAll('.cp-palworld-game').length,sprint:document.querySelectorAll('.cp-mobile-sprint').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));const brainEvents=await events(page);
    await page.goto(`${origin}/portal/blog/zh/2048-strategy-guide.html`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.cp-2048-coach');const coachPriority=await page.evaluate(()=>({coach:document.querySelectorAll('.cp-2048-coach').length,workout:document.querySelectorAll('.cp-brain-workout').length,palworld:document.querySelectorAll('.cp-palworld-game').length}));
    await page.goto(`${origin}/portal/blog/en/snake-game-guide.html`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.cp-palworld-game');const palworldPreserved=await page.evaluate(()=>({palworld:document.querySelectorAll('.cp-palworld-game').length,workout:document.querySelectorAll('.cp-brain-workout').length}));
    await page.goto(`${origin}/portal/games/?lang=ko`,{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-brain-workout-rail]');const gamesHub=await page.evaluate(()=>({rails:document.querySelectorAll('.practice-rails>a').length,title:document.querySelector('[data-workout-title]')?.textContent,href:document.querySelector('[data-brain-workout-rail]')?.getAttribute('href'),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));const gamesEvents=await events(page);
    await page.goto(`${origin}/portal/tools/?lang=zh`,{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-app="brain-game-workout"]');await page.waitForTimeout(100);const catalog=await page.evaluate(()=>({name:document.querySelector('[data-app="brain-game-workout"] .tc-name')?.textContent,href:document.querySelector('[data-app="brain-game-workout"]')?.getAttribute('href'),count:document.querySelectorAll('[data-app="brain-game-workout"]').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
    const report={localeReports,ten,deterministic,complete,persisted,five,fifteen,interactionEvents,brainBridge,brainEvents,coachPriority,palworldPreserved,gamesHub,gamesEvents,catalog,errors};console.log(JSON.stringify(report,null,2));
    const fail=[];localeReports.forEach(x=>{if(x.lang!==x.expected||!x.title||!x.button)fail.push(`${x.expected} localization missing`);if(x.adCount!==1||x.jsonLd!==2)fail.push(`${x.expected} metadata/ad mismatch`);if(x.overflow>0)fail.push(`${x.expected} overflow ${x.overflow}`)});
    if(ten.ids.length!==3||new Set(ten.ids).size!==3||ten.minutes.reduce((a,b)=>a+b,0)!==10||ten.progress!=='0/3')fail.push('10-minute circuit is invalid');if(ten.ids.join()!=deterministic.join())fail.push('daily plan is not deterministic');
    if(complete.progress!=='3/3'||complete.streak!=='1'||complete.sessions!=='1'||!complete.cardVisible)fail.push('completion state is invalid');if(persisted.progress!=='3/3'||persisted.sessions!=='1'||persisted.ids.join()!=ten.ids.join())fail.push('persistence or duplicate guard failed');
    if(five.length!==2||five.reduce((a,b)=>a+b,0)!==5)fail.push('5-minute plan invalid');if(fifteen.length!==4||fifteen.reduce((a,b)=>a+b,0)!==15)fail.push('15-minute plan invalid');
    ['brain_game_workout_view','brain_game_workout_generate','brain_game_workout_game_click','brain_game_workout_return','brain_game_workout_stage_complete','brain_game_workout_stage_reopen','brain_game_workout_complete'].forEach(name=>{if(!interactionEvents.includes(name))fail.push(`${name} missing`)});
    if(brainBridge.workout!==1||brainBridge.palworld||brainBridge.sprint||!brainBridge.href?.includes('source=blog_brain_game_bridge')||!brainEvents.includes('brain_game_workout_bridge_view'))fail.push('brain article bridge invalid');if(coachPriority.coach!==1||coachPriority.workout||coachPriority.palworld)fail.push('2048 bridge priority invalid');if(palworldPreserved.palworld!==1||palworldPreserved.workout)fail.push('Palworld game bridge not preserved');
    if(gamesHub.rails!==2||!gamesHub.href?.includes('source=games_hub')||!gamesEvents.includes('brain_game_workout_games_view'))fail.push('games hub rail invalid');if(catalog.count!==1||!catalog.name?.includes('每日')||!catalog.href?.includes('source=portal_tools_catalog'))fail.push('catalog distribution invalid');if([brainBridge.overflow,gamesHub.overflow,catalog.overflow].some(x=>x>0))fail.push('distribution overflow');if(errors.length)fail.push(`page errors: ${errors.join(' | ')}`);if(fail.length)throw new Error(fail.join('\n'));console.log('PASS: brain game workout verification');
  }finally{await browser.close();if(local)await new Promise(ok=>local.close(ok))}
}
run().catch(error=>{console.error(error.stack||error.message);process.exitCode=1});
