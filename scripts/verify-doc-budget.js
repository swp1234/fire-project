#!/usr/bin/env node

const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const CONTRACT={
  'README.md':{bytes:1500,lines:45},
  'PROGRESS.md':{bytes:4000,lines:45},
  'memory/data-check-log.md':{bytes:10000,lines:120},
  'docs/STRATEGY.md':{bytes:4000,lines:80},
  'docs/MARKETING.md':{bytes:1500,lines:35},
  'docs/HARNESS-WORKFLOW.md':{bytes:2500,lines:60},
  'docs/OPERATIONS.md':{bytes:4000,lines:90},
  'docs/VALIDATION.md':{bytes:8000,lines:150},
};
function ok(v,m){if(!v)throw Error(m)}
function load(overrides={}){return Object.fromEntries(Object.keys(CONTRACT).map(file=>[file,overrides[file]??fs.readFileSync(path.join(ROOT,file),'utf8')]))}
function verify(docs=load()){
  for(const [file,budget] of Object.entries(CONTRACT)){
    const text=docs[file];ok(typeof text==='string',`${file}: missing`);
    const bytes=Buffer.byteLength(text),lines=text.split(/\r?\n/).length;
    ok(bytes<=budget.bytes,`${file}: ${bytes} bytes exceeds ${budget.bytes}`);
    ok(lines<=budget.lines,`${file}: ${lines} lines exceeds ${budget.lines}`);
    const headings=Array.from(text.matchAll(/^#{1,3}\s+(.+)$/gm),m=>m[1].trim().toLowerCase());
    ok(new Set(headings).size===headings.length,`${file}: duplicate heading`);
  }
  const progress=docs['PROGRESS.md'],memory=docs['memory/data-check-log.md'],ops=docs['docs/OPERATIONS.md'];
  ok((progress.match(/^## Latest release:/gm)||[]).length===1,'PROGRESS.md: exactly one latest release required');
  ok(/Current account state/.test(memory)&&/Measurement rules/.test(memory)&&/Verification baseline/.test(memory),'memory/data-check-log.md: current decision sections missing');
  ok(/Git history/.test(memory)&&/raw responses/i.test(memory),'memory/data-check-log.md: archival boundary missing');
  ok(/Documentation budget/.test(ops)&&/Git 이력/.test(ops),'docs/OPERATIONS.md: documentation lifecycle missing');
  return Object.entries(CONTRACT).map(([file,b])=>({file,bytes:Buffer.byteLength(docs[file]),limit:b.bytes}));
}
function mutations(){const b=load(),cases=[
  ['progress-bloat',{'PROGRESS.md':b['PROGRESS.md']+'x'.repeat(4000)}],
  ['memory-bloat',{'memory/data-check-log.md':b['memory/data-check-log.md']+'x'.repeat(10000)}],
  ['duplicate-heading',{'docs/STRATEGY.md':b['docs/STRATEGY.md']+'\n## Goal and constraint\n'}],
  ['latest-release-duplicated',{'PROGRESS.md':b['PROGRESS.md']+'\n## Latest release: stale\n'}],
  ['memory-sections-removed',{'memory/data-check-log.md':b['memory/data-check-log.md'].replace('Measurement rules','Old rules')}],
  ['archive-boundary-removed',{'memory/data-check-log.md':b['memory/data-check-log.md'].replace('Git history','commit history').replace('raw responses','responses')}],
  ['lifecycle-removed',{'docs/OPERATIONS.md':b['docs/OPERATIONS.md'].replace('Documentation budget','Notes')}],
 ];
 for(const [name,change] of cases){let caught=false;try{verify({...b,...change})}catch(e){caught=true;console.log(`[PASS] ${name}: ${e.message}`)}ok(caught,`mutation escaped: ${name}`)}
 console.log(`[PASS] mutation summary ${cases.length}/${cases.length} detected`);
}
const rows=verify();if(process.argv.includes('--mutations'))mutations();console.log(`[PASS] documentation budget: ${rows.map(x=>`${x.file} ${x.bytes}/${x.limit}`).join(', ')}`);
