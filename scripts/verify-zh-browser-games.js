#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { listenOnSafePort } = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const PORTAL = path.join(PROJECTS, 'portal');
const PAGE_PATH = path.join(PORTAL, 'blog', 'zh', 'browser-games.html');
const INDEX_PATH = path.join(PORTAL, 'blog', 'zh', 'index.html');
const SITEMAP_PATH = path.join(PORTAL, 'blog', 'sitemap.xml');
const URL_PATH = '/portal/blog/zh/browser-games.html';
const LIVE_URL = `https://dopabrain.com${URL_PATH}`;
const TARGETS = ['puzzle-2048','minesweeper','brick-breaker','sky-runner','stack-tower','zigzag-runner','emoji-merge','idle-clicker','flappy-bird'];
const USAGE = `Usage:\n  node scripts/verify-zh-browser-games.js [--mutations]\n  node scripts/verify-zh-browser-games.js --url ${LIVE_URL}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function visibleText(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

function parseJsonLd(html) {
  return [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
}

function loadFixture() {
  return {
    page: fs.readFileSync(PAGE_PATH, 'utf8'),
    index: fs.readFileSync(INDEX_PATH, 'utf8'),
    sitemap: fs.readFileSync(SITEMAP_PATH, 'utf8'),
  };
}

function verifySource(fixture, checkProjects = true) {
  const { page, index, sitemap } = fixture;
  const text = visibleText(page);
  assert(page.includes('data-browser-games-contract="2026-08-30"'), 'Browser-games release marker is missing');
  assert(page.includes('<meta name="dateModified" content="2026-08-30">'), 'Browser-games dateModified is stale');
  assert(page.includes(`<link rel="canonical" href="${LIVE_URL}">`), 'Browser-games canonical drifted');
  assert(count(page, /rel="alternate"\s+hreflang=/g) === 2, 'Browser-games hreflang must be zh plus x-default');
  assert(count(page, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/gi) === 1, 'Browser-games page must have exactly one Auto Ads loader');
  assert(!/FAQPage|AggregateRating|content_ad_impression/.test(page), 'Browser-games page retains unsupported schema or synthetic ad telemetry');
  assert(!/最好玩的|TOP\s*10|全球玩家|五星|无广告干扰|每月更新/i.test(text), 'Browser-games page retains an unsupported popularity or ad claim');
  assert(/不是人气排行榜/.test(text) && /时长只是选游戏的参考/.test(text), 'Browser-games ranking or duration boundary is missing');
  assert(page.includes('href="/puzzle-2048/?lang=zh&amp;source=zh_browser_games_primary"'), 'Primary 2048 bridge is broken');
  const catalog = [...page.matchAll(/data-game-surface="catalog"\s+data-target-slug="([^"]+)"/g)].map(match => match[1]);
  assert(JSON.stringify(catalog) === JSON.stringify(TARGETS), 'Browser-games catalog route set drifted');
  for (const slug of TARGETS) {
    assert(new RegExp(`href="/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\?lang=zh`).test(page), `Chinese route is missing for ${slug}`);
    if (checkProjects) {
      const indexPath = path.join(PROJECTS, slug, 'index.html');
      const i18nPath = path.join(PROJECTS, slug, 'js', 'i18n.js');
      assert(fs.existsSync(indexPath), `Local destination is missing for ${slug}`);
      assert(fs.existsSync(i18nPath), `Locale module is missing for ${slug}`);
      const i18n = fs.readFileSync(i18nPath, 'utf8');
      assert(/supportedLanguages\s*=\s*\[[^\]]*['"]zh['"]/.test(i18n), `Chinese locale is unsupported for ${slug}`);
      assert(/URLSearchParams/.test(i18n), `Language query is ignored by ${slug}`);
    }
  }
  assert(/intersectionRatio>=0\.5/.test(page) && /},500\)/.test(page) && /observe\(document\.querySelector\('\.picker-actions'\)\)/.test(page), 'Qualified game-picker exposure contract is incomplete');
  assert(/pickerUseSent/.test(page) && /content_game_picker_use/.test(page), 'Exact-once game-picker use telemetry is missing');
  assert(!/track\('content_game_picker_use',[\s\S]{0,150}(?:button\.dataset|data-time|short|medium|long)/.test(page), 'Game-picker telemetry leaks the selected time');
  assert(/track\('content_game_click'/.test(page), 'Game click telemetry is missing');
  const schemas = parseJsonLd(page);
  assert(schemas.length === 1 && schemas[0]['@graph']?.length === 2, 'Browser-games schema must contain Article and Breadcrumb only');
  const types = schemas[0]['@graph'].map(item => item['@type']);
  assert(JSON.stringify(types) === JSON.stringify(['Article','BreadcrumbList']), 'Browser-games schema types/order drifted');
  assert(sitemap.includes(`<loc>${LIVE_URL}</loc><lastmod>2026-08-30</lastmod>`), 'Browser-games sitemap row/date is missing');
  const card = index.match(/<a href="\/portal\/blog\/zh\/browser-games\.html"[\s\S]*?<\/a>/)?.[0] || '';
  assert(card.includes('按 3、10、20 分钟选择') && !/最好玩|TOP/i.test(card), 'Chinese catalog retains the old popularity claim');
  return { schemas: types.length, catalogRoutes: catalog.length, verifiedDestinations: TARGETS.length, submitted: 1 };
}

function runMutations(baseline) {
  const mutations = [
    ['hidden-rating','unsupported schema',value=>{value.page += '<script type="application/ld+json">{"@type":"AggregateRating"}</script>';}],
    ['stale-date','dateModified is stale',value=>{value.page=value.page.replace('dateModified" content="2026-08-30','dateModified" content="2026-06-19');}],
    ['ranking-claim','unsupported popularity',value=>{value.page=value.page.replace('这里没有','2026 TOP 10 最好玩的游戏；这里没有');}],
    ['missing-boundary','ranking or duration boundary is missing',value=>{value.page=value.page.replace('这不是人气排行榜','这些游戏排名全球第一').replace('时长只是选游戏的参考','时间保证准确');}],
    ['broken-primary','Primary 2048 bridge is broken',value=>{value.page=value.page.replace('/puzzle-2048/?lang=zh&amp;source=zh_browser_games_primary','/portal/');}],
    ['route-drift','catalog route set drifted',value=>{value.page=value.page.replace('data-game-surface="catalog" data-target-slug="flappy-bird"','data-game-surface="catalog" data-target-slug="reaction-test"');}],
    ['missing-lang','Chinese route is missing',value=>{value.page=value.page.replace('/idle-clicker/?lang=zh&amp;source=zh_browser_games_catalog','/idle-clicker/?source=zh_browser_games_catalog');}],
    ['tracking-too-easy','Qualified game-picker exposure contract is incomplete',value=>{value.page=value.page.replace('entry.intersectionRatio>=0.5','entry.intersectionRatio>=0');}],
    ['selection-leak','telemetry leaks the selected time',value=>{value.page=value.page.replace("{interaction_name:'time_game_picker'}", "{interaction_name:'time_game_picker',time:button.dataset.time}");}],
    ['missing-use-guard','Exact-once game-picker use telemetry is missing',value=>{value.page=value.page.replace('pickerUseSent=false','pickerUsed=false').replace(/pickerUseSent/g,'');}],
    ['missing-click','Game click telemetry is missing',value=>{value.page=value.page.replace("track('content_game_click'", "track('content_related_click'");}],
    ['missing-sitemap','sitemap row/date is missing',value=>{value.sitemap=value.sitemap.replace(`  <url><loc>${LIVE_URL}</loc><lastmod>2026-08-30</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`, '');}],
    ['catalog-claim','catalog retains the old popularity claim',value=>{value.index=value.index.replace('免费浏览器小游戏：按 3、10、20 分钟选择','2026年最好玩的免费在线游戏 TOP 10');}],
  ];
  for (const [name, expected, mutate] of mutations) {
    const fixture = clone(baseline);
    mutate(fixture);
    let message = '';
    try { verifySource(fixture, false); } catch (error) { message = error.message; }
    assert(message.includes(expected), `${name} mutation escaped: ${message || 'verifier passed'}`);
    console.log(`[PASS] ${name}: ${message}`);
  }
}

function createServer() {
  const types = { '.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml' };
  return http.createServer((request,response)=>{
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let base;
    let relative;
    if (pathname.startsWith('/portal/')) { base=PORTAL;relative=pathname.slice('/portal/'.length); }
    else {
      const slug = TARGETS.find(item=>pathname===`/${item}`||pathname.startsWith(`/${item}/`));
      if (!slug) { response.writeHead(404);response.end('Not found');return; }
      base=path.join(PROJECTS,slug);relative=pathname.slice(`/${slug}/`.length);
    }
    let file = path.resolve(base,relative);
    if (!(file===base||file.startsWith(`${base}${path.sep}`))) { response.writeHead(403);response.end('Forbidden');return; }
    if (fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404);response.end('Not found');return; }
    response.writeHead(200,{'Cache-Control':'no-store','Content-Type':`${types[path.extname(file)]||'application/octet-stream'}; charset=utf-8`});
    fs.createReadStream(file).pipe(response);
  });
}

function browserEvents(layer) {
  return layer.map(item=>Array.from(item||[])).filter(item=>item[0]==='event').map(item=>({name:item[1],params:item[2]||{}}));
}

async function runtimeCheck(pageUrl, local) {
  const browser = await chromium.launch({ headless:true });
  const layouts = [];
  try {
    for (const viewport of [{width:390,height:844},{width:1440,height:900}]) {
      const context = await browser.newContext({ viewport, serviceWorkers:'block' });
      if (local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror',error=>errors.push(String(error)));
      try {
        await page.goto(pageUrl,{waitUntil:'domcontentloaded',timeout:30000});
        await page.waitForSelector('[data-browser-games-contract="2026-08-30"]');
        const state = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,targets:[...document.querySelectorAll('.cta,.game-link,.time-choice,.game-card a,.related a')].map(node=>({w:node.getBoundingClientRect().width,h:node.getBoundingClientRect().height}))}));
        assert(state.overflow===0&&state.h1===1,`Browser-games ${viewport.width}px layout drift: ${JSON.stringify(state)}`);
        for (const target of state.targets) assert(target.w>=44&&target.h>=44,`Browser-games target below 44px: ${JSON.stringify(target)}`);
        assert(errors.length===0,`Browser-games page errors: ${errors.join(' | ')}`);
        layouts.push({viewport:viewport.width,overflow:state.overflow});
      } finally { await context.close(); }
    }

    const context = await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
    if (local) await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
    const page = await context.newPage();
    const errors = [];
    const captured = [];
    page.on('pageerror',error=>errors.push(String(error)));
    try {
      await page.goto(pageUrl,{waitUntil:'domcontentloaded',timeout:30000});
      await page.exposeFunction('__captureGameEvent',(name,params)=>captured.push({name,params}));
      await page.evaluate(()=>{const original=window.gtag;window.gtag=(...args)=>{if(args[0]==='event')window.__captureGameEvent(args[1],args[2]||{});return original?.(...args)}});
      if (!local) await page.waitForTimeout(1200);
      await page.locator('.picker-actions').evaluate(node=>node.scrollIntoView({block:'center'}));
      await page.waitForTimeout(250);
      let events = browserEvents(await page.evaluate(()=>(window.dataLayer||[]).map(item=>Array.from(item||[]))));
      assert(events.filter(event=>event.name==='content_game_picker_view').length===0,'Game-picker view fired before 500ms');
      await page.waitForFunction(()=>(window.dataLayer||[]).filter(item=>item[0]==='event'&&item[1]==='content_game_picker_view').length===1,null,{timeout:3000});
      await page.locator('[data-time="short"]').click();
      await page.locator('[data-time="long"]').click();
      const state = await page.evaluate(()=>({pressed:[...document.querySelectorAll('.time-choice')].map(node=>node.getAttribute('aria-pressed')),targets:[...document.querySelectorAll('.result-link')].map(node=>node.dataset.targetSlug),layer:(window.dataLayer||[]).map(item=>Array.from(item||[])),url:location.href,storage:Object.keys(localStorage)}));
      events = browserEvents(state.layer);
      const uses = events.filter(event=>event.name==='content_game_picker_use');
      assert(uses.length===1&&uses[0].params.interaction_name==='time_game_picker','Game-picker use must fire exactly once');
      assert(!/short|medium|long/i.test(JSON.stringify(uses[0].params))&&!Object.keys(uses[0].params).some(key=>/^(time|choice|selection)$/i.test(key)),'Game-picker runtime telemetry leaked the selected time');
      assert(state.pressed.join(',')==='false,false,true'&&state.targets.join(',')==='emoji-merge,idle-clicker,sky-runner','Game-picker state or output mismatch');
      assert(!/short|medium|long/i.test(`${state.url}${JSON.stringify(state.storage)}`),'Game-picker selection leaked to URL or browser storage');
      await page.locator('.primary').evaluate(node=>node.scrollIntoView({block:'center'}));
      await Promise.all([page.waitForURL(/\/puzzle-2048\/\?lang=zh&source=zh_browser_games_primary/),page.click('.primary .cta')]);
      assert(captured.filter(event=>event.name==='content_game_click'&&event.params.target_slug==='puzzle-2048').length===1,'Primary game click did not fire exactly once');
      await page.waitForFunction(()=>document.documentElement.lang==='zh',null,{timeout:5000});
      const destination = await page.evaluate(()=>({lang:document.documentElement.lang,url:location.href,h1:document.querySelector('h1')?.textContent||''}));
      assert(destination.lang==='zh'&&destination.h1&&/lang=zh&source=zh_browser_games_primary/.test(destination.url),`2048 destination mismatch: ${JSON.stringify(destination)}`);
      assert(errors.length===0,`Browser-games funnel errors: ${errors.join(' | ')}`);
      return { layouts, pickerView:1, pickerUse:1, click:1, destination:'puzzle-2048' };
    } finally { await context.close(); }
  } finally { await browser.close(); }
}

function parseArgs(argv) {
  const mutations = argv.includes('--mutations');
  const urlIndex = argv.indexOf('--url');
  const url = urlIndex>=0 ? argv[urlIndex+1] : null;
  const known = (mutations?1:0)+(urlIndex>=0?2:0);
  assert(argv.length===known&&!(mutations&&url),USAGE);
  if (!url) return { mutations, url:null };
  const parsed = new URL(url);
  assert(parsed.href===LIVE_URL,USAGE);
  return { mutations:false, url:parsed.href };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.url) { console.log(`PASS: live Chinese browser-games bridge ${JSON.stringify(await runtimeCheck(args.url,false))}`);return; }
  const fixture = loadFixture();
  const source = verifySource(fixture);
  if (args.mutations) runMutations(fixture);
  const server = createServer();
  const address = await listenOnSafePort(server);
  try {
    const runtime = await runtimeCheck(`http://127.0.0.1:${address.port}${URL_PATH}`,true);
    console.log(`PASS: Chinese browser-games bridge ${JSON.stringify({source,runtime})}`);
  } finally { await new Promise(resolve=>server.close(resolve)); }
}

main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1;});
