#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const TEXT_EXTENSIONS = new Set(['.html', '.htm', '.js', '.mjs']);

const RULES = Object.freeze([
  {
    id: 'suspension_conflict',
    severity: 'critical',
    score: 120,
    describe: 'claims invalid-traffic suspension while executable ad code remains',
  },
  {
    id: 'incentivized_ad_reward',
    severity: 'critical',
    score: 100,
    describe: 'offers an in-product score, life, continue, or unlock reward for an ad action',
  },
  {
    id: 'fake_ad_completion_unlock',
    severity: 'critical',
    score: 95,
    describe: 'lets a user self-declare ad completion to unlock content',
  },
  {
    id: 'manual_ad_unit',
    severity: 'high',
    score: 60,
    describe: 'contains a manually placed adsbygoogle unit',
  },
  {
    id: 'manual_adsbygoogle_push',
    severity: 'high',
    score: 45,
    describe: 'manually pushes an AdSense request',
  },
  {
    id: 'reward_ad_telemetry',
    severity: 'medium',
    score: 25,
    describe: 'emits reward-ad telemetry that confirms an incentivized flow',
  },
  {
    id: 'h5_ad_api',
    severity: 'medium',
    score: 20,
    describe: 'loads or calls the H5 Games ad API',
  },
  {
    id: 'synthetic_ad_impression',
    severity: 'medium',
    score: 20,
    describe: 'emits a client-authored ad impression event',
  },
  {
    id: 'active_ad_loader',
    severity: 'info',
    score: 5,
    describe: 'loads AdSense or the managed site ad loader',
  },
]);
const RULE_BY_ID = new Map(RULES.map((rule) => [rule.id, rule]));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs(argv) {
  const options = { json: false, selfTest: false, strict: false, limit: 30 };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--self-test') options.selfTest = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--limit') {
      options.limit = Number.parseInt(argv[++index], 10);
      assert(Number.isInteger(options.limit) && options.limit >= 0, '--limit expects a non-negative integer');
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/ad-risk-inventory.js [--json] [--limit N] [--strict] [--self-test]');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function stripComments(source) {
  return String(source || '')
    .replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\r\n]/g, ' '))
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\r\n]/g, ' '))
    .replace(/^(\s*)\/\/.*$/gm, '$1');
}

function count(source, regex) {
  return Array.from(source.matchAll(regex)).length;
}

function countFiles(files, regex) {
  return files.reduce((total, file) => total + count(file.source, regex), 0);
}

function evidence(files, regex, limit = 4) {
  const hits = [];
  for (const file of files) {
    const lines = file.source.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      regex.lastIndex = 0;
      if (!regex.test(lines[index])) continue;
      hits.push(`${file.relative}:${index + 1}`);
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}

function inspectProject(name, rawFiles) {
  const files = rawFiles.map((file) => ({ ...file, source: stripComments(file.source) }));
  const combined = files.map((file) => file.source).join('\n');
  const findings = [];
  const add = (id, hits, occurrences = hits.length) => {
    if (occurrences <= 0) return;
    const rule = RULE_BY_ID.get(id);
    findings.push({ ...rule, occurrences, evidence: hits });
  };

  const directLoader = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js|\/portal\/js\/ad-loader\.js/gi;
  const manualUnit = /<ins\b[^>]*\bclass\s*=\s*["'][^"']*\badsbygoogle\b[^"']*["'][^>]*>/gi;
  const manualPush = /\badsbygoogle\b[\s\S]{0,100}?\.push\s*\(/gi;
  const rewardCall = /GameAds\s*\.\s*(?:injectRewardButton|showRewarded)\s*\(|adBreak\s*\(\s*\{[\s\S]{0,180}?\btype\s*:\s*["']reward["']/gi;
  const fakeCompletionControl = /(?:id|class)\s*=\s*["'][^"']*(?:watch-ad|ad-complete)[^"']*["']|광고\s*시청\s*완료/gi;
  const unlockHandler = /(?:unlockPremium|premiumUnlocked\s*=\s*true|classList\.remove\s*\(\s*["']hidden["']\s*\))/gi;
  const h5Api = /(?:\bGameAds\b|\badBreak\s*\(|\badConfig\s*\(|\/_common\/js\/game-ads\.js)/gi;
  const rewardTelemetry = /gtag\s*\(\s*["']event["']\s*,\s*["']rewarded_ad["']/gi;
  const syntheticImpression = /gtag\s*\(\s*["']event["']\s*,\s*["'](?:content_)?ad_impression["']/gi;
  const suspensionMarker = /data-ad-serving\s*=\s*["']suspended-invalid-traffic-[^"']+["']/gi;

  const loaderCount = countFiles(files, directLoader);
  const unitCount = countFiles(files, manualUnit);
  const pushCount = countFiles(files, manualPush);
  const rewardCallCount = countFiles(files, rewardCall);
  const fakeCompletionCount = count(combined, fakeCompletionControl);
  const unlockCount = count(combined, unlockHandler);
  const h5Count = countFiles(files, h5Api);
  const rewardEventCount = countFiles(files, rewardTelemetry);
  const syntheticCount = countFiles(files, syntheticImpression);
  const suspended = suspensionMarker.test(combined);
  const hasExecutableAds = loaderCount + unitCount + pushCount + h5Count > 0;

  if (suspended && hasExecutableAds) {
    add('suspension_conflict', evidence(files, /data-ad-serving\s*=|adsbygoogle|\bGameAds\b|\badBreak\s*\(/i, 6), 1);
  }
  if (rewardCallCount > 0) {
    add('incentivized_ad_reward', evidence(files, /injectRewardButton|showRewarded|type\s*:\s*["']reward["']|watch\s+(?:an?\s+)?ad|광고\s*시청/i, 6), rewardCallCount);
  }
  if (fakeCompletionCount > 0 && unlockCount > 0) {
    add('fake_ad_completion_unlock', evidence(files, /watch-ad|ad-complete|광고\s*시청\s*완료|unlockPremium|premiumUnlocked/i, 6), fakeCompletionCount);
  }
  add('manual_ad_unit', evidence(files, /<ins\b[^>]*\badsbygoogle\b/i), unitCount);
  add('manual_adsbygoogle_push', evidence(files, /adsbygoogle[^\n]{0,100}\.push\s*\(/i), pushCount);
  add('reward_ad_telemetry', evidence(files, /["']rewarded_ad["']/i), rewardEventCount);
  add('h5_ad_api', evidence(files, /\bGameAds\b|\badBreak\s*\(|\badConfig\s*\(|\/_common\/js\/game-ads\.js/i), h5Count);
  add('synthetic_ad_impression', evidence(files, /["'](?:content_)?ad_impression["']/i), syntheticCount);
  add('active_ad_loader', evidence(files, /pagead2\.googlesyndication\.com|\/portal\/js\/ad-loader\.js/i), loaderCount);

  const score = findings.reduce((total, finding) => total + finding.score, 0);
  const severity = findings.some((item) => item.severity === 'critical')
    ? 'critical'
    : findings.some((item) => item.severity === 'high')
      ? 'high'
      : findings.some((item) => item.severity === 'medium') ? 'medium' : findings.length ? 'info' : 'clean';
  return {
    project: name,
    route: name === 'root-domain' ? 'https://dopabrain.com/' : `https://dopabrain.com/${name}/`,
    severity,
    score,
    suspended,
    filesScanned: files.length,
    findings,
  };
}

function trackedSourceFiles(projectDir) {
  let names;
  try {
    const output = execFileSync('git', ['-C', projectDir, 'ls-files', '-z'], { encoding: 'buffer' });
    names = output.toString('utf8').split('\0').filter(Boolean);
  } catch {
    return [];
  }
  return names
    .filter((name) => TEXT_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .filter((name) => !/(^|\/)(?:node_modules|vendor|dist|build)(?:\/|$)/i.test(name))
    .filter((name) => {
      const absolute = path.join(projectDir, name);
      return fs.existsSync(absolute) && fs.statSync(absolute).isFile();
    })
    .map((relative) => ({
      relative: relative.replace(/\\/g, '/'),
      source: fs.readFileSync(path.join(projectDir, relative), 'utf8'),
    }));
}

function buildInventory() {
  return fs.readdirSync(PROJECTS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '_common')
    .map((entry) => inspectProject(entry.name, trackedSourceFiles(path.join(PROJECTS_ROOT, entry.name))))
    .sort((a, b) => b.score - a.score || a.project.localeCompare(b.project));
}

function runSelfTest() {
  const fixture = (name, source) => inspectProject('fixture', [{ relative: name, source }]);
  const ids = (result) => new Set(result.findings.map((finding) => finding.id));
  const clean = fixture('index.html', '<main><button>Play again</button><p>Double your score by practicing.</p></main>');
  assert(clean.severity === 'clean', 'clean copy was classified as ad risk');

  const comments = fixture('index.html', '<!-- <ins class="adsbygoogle"></ins><script>GameAds.injectRewardButton({label:"Watch Ad for 2x Score"})</script> -->');
  assert(comments.severity === 'clean', 'HTML comment decoys were classified');

  const loader = fixture('index.html', '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-test"></script>');
  assert(ids(loader).has('active_ad_loader') && loader.severity === 'info', 'Auto Ads loader was not separated as informational');

  const reward = fixture('app.js', 'GameAds.injectRewardButton({ label: "Watch Ad for 2x Score", onReward: () => { score *= 2; } });');
  assert(ids(reward).has('incentivized_ad_reward') && reward.severity === 'critical', 'incentivized score reward escaped');

  const fakeUnlock = inspectProject('fixture', [
    { relative: 'index.html', source: '<button id="watch-ad-btn">광고 시청 완료</button>' },
    { relative: 'app.js', source: 'function unlockPremium(){ premiumUnlocked = true; }' },
  ]);
  assert(ids(fakeUnlock).has('fake_ad_completion_unlock'), 'self-declared ad completion unlock escaped');

  const manual = fixture('index.html', '<ins class="adsbygoogle" data-ad-slot="123"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>');
  assert(ids(manual).has('manual_ad_unit') && ids(manual).has('manual_adsbygoogle_push'), 'manual unit or push escaped');

  const suspended = fixture('index.html', '<html data-ad-serving="suspended-invalid-traffic-2026-09-03"><main>Safe</main></html>');
  assert(suspended.suspended && suspended.severity === 'clean', 'clean suspension marker failed');

  const conflict = fixture('index.html', '<html data-ad-serving="suspended-invalid-traffic-2026-09-03"><script src="/portal/js/ad-loader.js"></script></html>');
  assert(ids(conflict).has('suspension_conflict') && conflict.severity === 'critical', 'suspension/ad-code conflict escaped');

  const workingTreeFiles = trackedSourceFiles(path.join(PROJECTS_ROOT, 'mbti-career'));
  assert(workingTreeFiles.every((file) => fs.existsSync(path.join(PROJECTS_ROOT, 'mbti-career', file.relative))), 'deleted tracked file reached the scanner');
  console.log('[PASS] ad-risk inventory self-test: 9/9 behavior classes including staged/unstaged deletion safety');
}

function printInventory(inventory, limit) {
  const shown = inventory.filter((item) => item.findings.length > 0).slice(0, limit);
  const counts = Object.fromEntries(['critical', 'high', 'medium', 'info', 'clean'].map((severity) => [
    severity,
    inventory.filter((item) => item.severity === severity).length,
  ]));
  console.log(`Projects: ${inventory.length} | critical=${counts.critical} high=${counts.high} medium=${counts.medium} info=${counts.info} clean=${counts.clean}`);
  for (const item of shown) {
    const risks = item.findings.map((finding) => `${finding.id}:${finding.occurrences}`).join(', ');
    console.log(`${String(item.score).padStart(3)} ${item.severity.padEnd(8)} ${item.project.padEnd(26)} ${risks}`);
    for (const finding of item.findings.filter((entry) => entry.severity !== 'info')) {
      if (finding.evidence.length) console.log(`    ${finding.id} -> ${finding.evidence.join(', ')}`);
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.selfTest) runSelfTest();
  const inventory = buildInventory();
  if (options.json) console.log(JSON.stringify(inventory, null, 2));
  else printInventory(inventory, options.limit);
  if (options.strict && inventory.some((item) => item.severity === 'critical')) {
    throw new Error('Critical incentivized or conflicting ad implementation remains');
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { inspectProject, stripComments };
