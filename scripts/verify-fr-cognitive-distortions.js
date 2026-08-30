#!/usr/bin/env node
const fs=require('fs'),http=require('http'),path=require('path'),{chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),PORTAL=path.join(ROOT,'projects','portal'),APP=path.join(ROOT,'projects','stress-check');
const FILES={guide:path.join(PORTAL,'blog','fr','cognitive-distortions-list.html'),catalog:path.join(PORTAL,'blog','fr','index.html'),app:path.join(APP,'js','app.js'),html:path.join(APP,'index.html')};
const CTA='/stress-check/?lang=fr&amp;start=1&amp;surface=fr_cognitive_distortion_primary';
function fail(m){throw new Error(m)}function read(f){return fs.readFileSync(f,'utf8')}function load(){return Object.fromEntries(Object.entries(FILES).map(([k,f])=>[k,read(f)]))}function count(s,r){return(s.match(r)||[]).length}
function source(v){
  if(!/data-fr-thought-check-contract="2026-08-30"/.test(v.guide)||!/<h1>Que sont les distorsions cognitives \?<\/h1>/.test(v.guide))fail('French guide identity drifted');
  if(count(v.guide,/class="pattern"/g)!==15)fail('French guide must show 15 patterns');
  for(const x of ['thought-record/','reframing-unhelpful-thoughts/','publications/b/53604'])if(!v.guide.includes(x))fail('source missing: '+x);
  if(/FAQPage|AggregateRating|content_ad_impression|cerveau.*recâbl|corrigées|signalen?t souvent|erreurs systématiques de pensée/i.test(v.guide))fail('unsupported claim, schema, or synthetic telemetry remains');
  const escaped=CTA.replace(/[|\\{}()[\]^$+*?.-]/g,'\\$&');if(count(v.guide,new RegExp(escaped,'g'))!==2)fail('two identical French primary CTAs required');
  for(const e of ['content_view','content_fr_thought_check_view','content_fr_thought_check_use','content_cta_click','content_related_click'])if(!v.guide.includes("'"+e+"'"))fail('event missing: '+e);
  if(!/intersectionRatio>=\.5/.test(v.guide)||!/observer\.disconnect\(\);setTimeout/.test(v.guide)||!/\},500\)/.test(v.guide))fail('qualified exposure contract missing');
  if(/track\([^\n]+(?:choice|selected|button_text|thought_text)/i.test(v.guide))fail('private check choice can enter analytics');
  if(count(v.guide,/class="quick-card related-card"/g)!==4)fail('four related cards required');
  if(count(v.guide,/\/portal\/js\/ad-loader\.js/g)!==1||/data-ad-slot|<ins[^>]+adsbygoogle|adsbygoogle\s*(?:=|\.push)/.test(v.guide))fail('guide must use managed Auto Ads only');
  if(!/15 distorsions cognitives : repères et exercice privé/.test(v.catalog))fail('French catalog drifted');
  if(!/\^fr_cognitive_distortion_\(primary\|quick\)\$/.test(v.app))fail('French Stress Check entry allowlist missing');
  return{patterns:15,sources:3,quick:4,guideBytes:Buffer.byteLength(v.guide)};
}
function mutations(){const ms=[['faq',v=>v.guide+='<script type="application/ld+json">FAQPage</script>'],['claim',v=>v.guide+='<p>Les réactions fortes signalent souvent une pensée déformée.</p>'],['pattern',v=>v.guide=v.guide.replace('class="pattern"','class="removed"')],['source',v=>v.guide=v.guide.replace('thought-record/','removed/')],['cta',v=>v.guide=v.guide.replace('fr_cognitive_distortion_primary','unknown')],['easy-view',v=>v.guide=v.guide.replace('intersectionRatio>=.5','intersectionRatio>=0')],['private-event',v=>v.guide+="track('x',{selected_choice:1})"],['manual-ad',v=>v.guide+='<ins class="adsbygoogle" data-ad-slot="auto"></ins>'],['quick',v=>v.guide=v.guide.replace('class="quick-card related-card"','class="quick-card"')],['entry',v=>v.app=v.app.replace('^fr_cognitive_distortion_','^removed_')]];for(const[n,m]of ms){const v=load();m(v);try{source(v)}catch(e){console.log('[PASS] '+n+': '+e.message);continue}fail('mutation escaped: '+n)}console.log('[PASS] mutation summary '+ms.length+'/'+ms.length+' detected')}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function server(){return http.createServer((q,s)=>{const p=decodeURIComponent(new URL(q.url,'http://x').pathname);let base,rel;if(p.startsWith('/portal/')){base=PORTAL;rel=p.slice(8)}else if(p.startsWith('/stress-check/')){base=APP;rel=p.slice(14)}else{return s.writeHead(404).end()}let f=path.resolve(base,rel||'index.html');if(!f.startsWith(path.resolve(base)+path.sep)&&f!==path.resolve(base,'index.html'))return s.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f))return s.writeHead(404).end();s.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(s)})}
async function block(p){await p.route('**/googletagmanager.com/**',r=>r.abort());await p.route('**/googlesyndication.com/**',r=>r.abort());await p.route('**/doubleclick.net/**',r=>r.abort())}
function events(p){return p.evaluate(()=>(window.dataLayer||[]).map(x=>Array.from(x||[])).filter(x=>x[0]==='event').map(x=>({name:x[1],params:x[2]||{}})))}
async function runtime(live){
  const srv=live?null:server();
  if(srv)await new Promise(r=>srv.listen(0,'127.0.0.1',r));
  const origin=live?live.replace(/\/$/,''):'http://127.0.0.1:'+srv.address().port;
  const b=await chromium.launch({headless:true}),ctx=await b.newContext({serviceWorkers:'block'});
  try{
    for(const width of [390,1440]){
      const p=await ctx.newPage();
      await p.setViewportSize({width,height:844});
      await block(p);
      await p.goto(origin+'/portal/blog/fr/cognitive-distortions-list.html',{waitUntil:'domcontentloaded'});
      const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      if(overflow>1)fail(width+' overflow '+overflow);
      await p.locator('[data-qualified-action] h2').scrollIntoViewIfNeeded();
      await p.waitForTimeout(650);
      for(const button of await p.locator('.check button').all())await button.locator('text=/./').click();
      await p.locator('.check button').first().click();
      await p.locator('.check button').first().click();
      let rows=await events(p);
      for(const e of ['content_view','content_fr_thought_check_view','content_fr_thought_check_use']){
        if(rows.filter(x=>x.name===e).length!==1)fail(width+' '+e+' not exact-once');
      }
      if(JSON.stringify(rows).match(/selected|choice|thought_text/i))fail('private selection leaked');
      const cta=p.locator('[data-content-surface="hero_primary"]');
      const href=await cta.getAttribute('href');
      await cta.evaluate(a=>a.addEventListener('click',e=>e.preventDefault(),{once:true}));
      await cta.click();
      rows=await events(p);
      const ctaCount=rows.filter(x=>x.name==='content_cta_click').length;
      if(ctaCount!==1)fail(width+' CTA event count '+ctaCount+'; events='+rows.map(x=>x.name).join(','));
      if(width===390){
        await p.goto(origin+href,{waitUntil:'domcontentloaded'});
        await p.locator('#question-screen.active').waitFor({state:'visible',timeout:5000});
        if(await p.getAttribute('html','lang')!=='fr')fail('French linked locale missing');
        const start=(await events(p)).find(x=>x.name==='test_start');
        if(!start||start.params.cta_surface!=='fr_cognitive_distortion_primary')fail('French linked attribution missing');
      }
      await p.close();
    }
    return{origin,viewports:2,use:1,linkedFrench:true,private:true};
  }finally{
    await b.close();
    if(srv)await new Promise(r=>srv.close(r));
  }
}
async function main(){const args=process.argv.slice(2),i=args.indexOf('--url'),live=i>=0?args[i+1]:'';const s=source(load());if(args.includes('--mutations'))mutations();console.log('[PASS] French cognitive-distortions '+JSON.stringify({source:s,runtime:await runtime(live)}))}main().catch(e=>{console.error('[FAIL] '+e.stack);process.exitCode=1});
