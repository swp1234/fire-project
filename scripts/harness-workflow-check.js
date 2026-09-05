#!/usr/bin/env node
// Codex-safe harness workflow runner.
// Usage: node scripts/harness-workflow-check.js [--target projects/portal] [--runtime focused]
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOG_DIR = path.join(ROOT, 'logs', 'harness-workflow');
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');
const REPORT_KEEP = Number.parseInt(process.env.HARNESS_WORKFLOW_REPORT_KEEP || '8', 10);
const BASH = process.env.GIT_BASH || (process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash');
const VERIFY_EXEMPTIONS = {
  'scripts/clean-focused-auto-ads.js': 'legacy migration diagnostic; the active restriction contract is owned by verify-adsense-contract',
  'scripts/verify-stress-plan.js': 'focused product diagnostic outside the current six-route portfolio smoke',
  'scripts/verify-stress-plan-distribution.js': 'focused product distribution diagnostic outside the current six-route portfolio smoke',
  'scripts/verify-rule-based-labels.js': 'legacy umbrella diagnostic superseded by product-specific trust verifiers',
};

function takeValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
  return value;
}

function parseArgs(argv) {
  const options = {
    target: 'projects/portal',
    runtime: 'focused',
    skipAnalytics: false,
    skipRuntime: false,
    planOnly: false,
    selfTest: false,
    release: false,
    releaseVerifier: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--target') options.target = takeValue(argv, i++, arg);
    else if (arg === '--runtime') options.runtime = takeValue(argv, i++, arg);
    else if (arg === '--skip-analytics') options.skipAnalytics = true;
    else if (arg === '--skip-runtime') options.skipRuntime = true;
    else if (arg === '--release') options.release = true;
    else if (arg === '--release-verifier') options.releaseVerifier = takeValue(argv, i++, arg);
    else if (arg === '--plan') options.planOnly = true;
    else if (arg === '--self-test') options.selfTest = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/harness-workflow-check.js [--release --target projects/app --release-verifier scripts/verify-product.js] [--runtime focused] [--skip-analytics] [--skip-runtime] [--plan | --self-test]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (options.release && !options.releaseVerifier) throw new Error('--release requires --release-verifier');
  if (options.releaseVerifier) options.release = true;

  return options;
}

function versionAtLeast(actual, minimum) {
  const a = actual.split('.').map(Number);
  const b = minimum.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const left = a[i] || 0;
    const right = b[i] || 0;
    if (left > right) return true;
    if (left < right) return false;
  }
  return true;
}

function runStep(name, command, args, options = {}) {
  const start = Date.now();
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: { ...process.env, ...options.env },
      shell: false,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on('error', (error) => {
      resolve({
        name,
        ok: false,
        code: null,
        durationMs: Date.now() - start,
        stdout,
        stderr: `${stderr}${error.message}`,
      });
    });

    child.on('close', (code) => {
      resolve({
        name,
        ok: code === 0,
        code,
        durationMs: Date.now() - start,
        stdout,
        stderr,
      });
    });
  });
}

function normalizeScript(value) {
  return value.replace(/\\/g, '/');
}

function validateOptions(options) {
  const target = normalizeScript(options.target).replace(/\/$/, '');
  if (!/^projects\/[a-z0-9._-]+$/i.test(target)) throw new Error(`Unsafe harness target: ${options.target}`);
  const targetPath = path.resolve(ROOT, target);
  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) throw new Error(`Missing harness target: ${target}`);
  if (!/^[a-z0-9._-]+$/i.test(options.runtime)) throw new Error(`Unsafe runtime target: ${options.runtime}`);
  options.target = target;
}

function verifierCoverage(steps, packageScripts = require(path.join(ROOT, 'package.json')).scripts, exemptions = VERIFY_EXEMPTIONS) {
  const registered = new Set(steps.flatMap(([, , args]) => args.filter((arg) => typeof arg === 'string' && /^scripts\/[a-z0-9._-]+\.js$/i.test(normalizeScript(arg))).map(normalizeScript)));
  const aliases = [];
  for (const [alias, command] of Object.entries(packageScripts)) {
    if (!alias.startsWith('verify:')) continue;
    for (const match of command.matchAll(/scripts\/[a-z0-9._-]+\.js/gi)) aliases.push({ alias, script: normalizeScript(match[0]) });
  }
  const unclassified = aliases.filter(({ script }) => !registered.has(script) && !exemptions[script]);
  if (unclassified.length) throw new Error(`Unclassified package verifier(s): ${unclassified.map((item) => `${item.alias} -> ${item.script}`).join(', ')}`);
  const staleExemptions = Object.keys(exemptions).filter((script) => !aliases.some((item) => item.script === script));
  if (staleExemptions.length) throw new Error(`Stale verifier exemption(s): ${staleExemptions.join(', ')}`);
  return {
    packageScripts: new Set(aliases.map((item) => item.script)).size,
    registered: new Set(aliases.filter((item) => registered.has(item.script)).map((item) => item.script)).size,
    diagnosticOnly: Object.entries(exemptions).map(([script, reason]) => ({ script, reason })),
  };
}

function stepGroup([name, , args]) {
  const value = `${name} ${args.join(' ')}`.toLowerCase();
  if (/analytics event|runtime smoke/.test(value)) return 'telemetry-runtime';
  if (/retirement|suspension/.test(value)) return 'containment';
  if (/index|secret|adsense|ad-risk|auto ads|local browser port/.test(value)) return 'release-safety';
  if (/chinese|french|spanish|korean|japanese|indonesian|german|english|culture|blog|content audit|bridge|funnel|path/.test(value)) return 'acquisition';
  if (/git diff|playwright|documentation|harness structure|locale audit|quality gate/.test(value)) return 'foundation';
  return 'product-contract';
}

function summarizePlan(steps) {
  const groups = {};
  for (const step of steps) groups[stepGroup(step)] = (groups[stepGroup(step)] || 0) + 1;
  return {
    steps: steps.length,
    groups,
    node: steps.filter(([, command]) => command === process.execPath).length,
    shell: steps.filter(([, command]) => command === BASH).length,
    other: steps.filter(([, command]) => command !== process.execPath && command !== BASH).length,
  };
}

function validatePlan(steps) {
  const names = new Set();
  for (const [name, command, args] of steps) {
    if (names.has(name)) throw new Error(`Duplicate harness step name: ${name}`);
    names.add(name);
    if (command === process.execPath && args[0] && args[0] !== '-e') {
      const scriptPath = path.resolve(ROOT, args[0]);
      if (!fs.existsSync(scriptPath)) throw new Error(`Missing harness script: ${args[0]}`);
    }
    if (command === BASH) {
      const scriptPath = path.resolve(ROOT, args[0]);
      if (!fs.existsSync(scriptPath)) throw new Error(`Missing harness shell script: ${args[0]}`);
    }
  }
}

function expectFailure(name, action, expected) {
  let message = '';
  try { action(); } catch (error) { message = error.message; }
  if (!message.includes(expected)) throw new Error(`${name} mutation escaped: ${message || 'passed'}`);
  console.log(`[PASS] ${name}: ${message}`);
}

function runSelfTests() {
  const good = [['docs', process.execPath, ['scripts/verify-doc-budget.js']]];
  validatePlan(good);
  expectFailure('duplicate-step', () => validatePlan([...good, good[0]]), 'Duplicate harness step name');
  expectFailure('missing-node-script', () => validatePlan([['missing', process.execPath, ['scripts/not-real.js']]]), 'Missing harness script');
  expectFailure('missing-flag-value', () => parseArgs(['--target']), '--target requires a value');
  expectFailure('release-without-verifier', () => parseArgs(['--release']), '--release requires --release-verifier');
  expectFailure('unsafe-target', () => validateOptions({ target: '../outside', runtime: 'focused' }), 'Unsafe harness target');
  const packageScripts = {
    'verify:docs': 'node scripts/verify-doc-budget.js',
    'verify:unclassified': 'node scripts/verify-safe-local-port.js',
  };
  expectFailure('unclassified-package-verifier', () => verifierCoverage(good, packageScripts, {}), 'Unclassified package verifier');
  const coverage = verifierCoverage(good, { 'verify:docs': packageScripts['verify:docs'] }, {});
  if (coverage.registered !== 1) throw new Error('coverage baseline failed');
  console.log('[PASS] harness structure mutation summary 6/6 detected');
}

function writeReport(run) {
  fs.mkdirSync(LOG_DIR, { recursive: true });

  const jsonPath = path.join(LOG_DIR, `${RUN_ID}.json`);
  const latestJsonPath = path.join(LOG_DIR, 'latest.json');
  fs.writeFileSync(jsonPath, JSON.stringify(run, null, 2));
  fs.writeFileSync(latestJsonPath, JSON.stringify(run, null, 2));

  const lines = [
    `# Harness Workflow ${RUN_ID}`,
    '',
    `- Target: \`${run.options.target}\``,
    `- Mode: \`${run.mode}\``,
    `- Runtime smoke target: \`${run.options.runtime}\``,
    `- Playwright: \`${run.playwrightVersion}\``,
    '- Node syntax validation: `implicit in verifier execution`',
    `- Result: **${run.ok ? 'PASS' : 'FAIL'}**`,
    '',
    `- Package verifier coverage: \`${run.coverage.registered}/${run.coverage.packageScripts}\` registered, \`${run.coverage.diagnosticOnly.length}\` explicit diagnostics`,
    '',
    '| Group | Step | Result | Duration |',
    '|---|---|---:|---:|',
    ...run.steps.map((step) => `| ${step.group} | ${step.name} | ${step.ok ? 'PASS' : 'FAIL'} | ${(step.durationMs / 1000).toFixed(1)}s |`),
    '',
  ];

  if (!run.ok) {
    lines.push('## Failures', '');
    for (const step of run.steps.filter((item) => !item.ok)) {
      const detail = (step.stderr || step.stdout || '').trim().split('\n').slice(-12).join('\n');
      lines.push(`### ${step.name}`, '', '```text', detail || `exit code ${step.code}`, '```', '');
    }
  }

  const mdPath = path.join(LOG_DIR, `${RUN_ID}.md`);
  fs.writeFileSync(mdPath, `${lines.join('\n')}\n`);
  const prunedReports = pruneOldReports();
  return { jsonPath, latestJsonPath, mdPath, prunedReports };
}

function pruneOldReports() {
  if (!Number.isFinite(REPORT_KEEP) || REPORT_KEEP < 0) return 0;
  const keepCount = Math.max(1, REPORT_KEEP);

  const reportPattern = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\.(json|md)$/;
  const reportsByRun = new Map();

  for (const entry of fs.readdirSync(LOG_DIR, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const match = entry.name.match(reportPattern);
    if (!match) continue;

    const fullPath = path.join(LOG_DIR, entry.name);
    const stats = fs.statSync(fullPath);
    const run = reportsByRun.get(match[1]) || { runId: match[1], mtimeMs: 0, files: [] };
    run.mtimeMs = Math.max(run.mtimeMs, stats.mtimeMs);
    run.files.push(fullPath);
    reportsByRun.set(match[1], run);
  }

  const oldRuns = Array.from(reportsByRun.values())
    .sort((left, right) => right.mtimeMs - left.mtimeMs)
    .slice(keepCount);

  let pruned = 0;
  for (const run of oldRuns) {
    for (const file of run.files) {
      fs.unlinkSync(file);
      pruned += 1;
    }
  }

  return pruned;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.selfTest) {
    runSelfTests();
    return;
  }
  validateOptions(options);
  const playwrightVersion = require('playwright/package.json').version;
  const steps = [];

  console.log('\nHarness Workflow Check\n');
  console.log(`Playwright: ${playwrightVersion}`);
  console.log(`Target: ${options.target}`);
  console.log(`Runtime: ${options.runtime}\n`);

  const plannedSteps = [
    ['git diff check', 'git', ['diff', '--check']],
    ['playwright version floor', process.execPath, ['-e', `const v=require('playwright/package.json').version; if (!(${JSON.stringify(versionAtLeast(playwrightVersion, '1.60.0'))})) { console.error('Playwright 1.60.0+ required, got '+v); process.exit(1); } console.log('Playwright '+v+' OK');`]],
    ['harness structure mutations', process.execPath, ['scripts/harness-workflow-check.js', '--self-test']],
    ['documentation budget and mutations', process.execPath, ['scripts/verify-doc-budget.js', '--mutations']],
    ['portal locale audit', process.execPath, ['scripts/portal-hub-locale-audit.js']],
    ['quality gate', BASH, ['scripts/quality-gate.sh', options.target]],
    ['MBTI Career retirement quality gate', BASH, ['scripts/quality-gate.sh', 'projects/mbti-career']],
    ['Word Scramble retirement quality gate', BASH, ['scripts/quality-gate.sh', 'projects/word-scramble']],
    ['K-pop position quality gate', BASH, ['scripts/quality-gate.sh', 'projects/kpop-position']],
    ['Future Self quality gate', BASH, ['scripts/quality-gate.sh', 'projects/future-self']],
    ['fake unlock gate audit', process.execPath, ['scripts/verify-fake-unlock-gates.js']],
    ['root focus regression', process.execPath, ['scripts/verify-root-focus.js', '--no-screenshot']],
    ['root verifier mutations', process.execPath, ['scripts/verify-root-focus-mutations.js']],
    ['brain trust and mutations', process.execPath, ['scripts/verify-brain-type-trust.js', '--mutations']],
    ['mental-age trust and mutations', process.execPath, ['scripts/verify-mental-age-trust.js', '--mutations']],
    ['Palworld server console and mutations', process.execPath, ['scripts/verify-palworld-server-console.js', '--mutations']],
    ['MBTI compatibility focus and mutations', process.execPath, ['scripts/verify-mbti-compatibility-focus.js', '--mutations']],
    ['Future Self funnel and mutations', process.execPath, ['scripts/verify-future-self-funnel.js', '--mutations']],
    ['English Future Self guide and mutations', process.execPath, ['scripts/verify-en-future-self-guide.js', '--mutations']],
    ['Doomscrolling bridge and mutations', process.execPath, ['scripts/verify-doomscrolling-bridge.js', '--mutations']],
    ['Chinese browser-games bridge and mutations', process.execPath, ['scripts/verify-zh-browser-games.js', '--mutations']],
    ['Chinese free-games controls and mutations', process.execPath, ['scripts/verify-zh-free-games-controls.js', '--mutations']],
    ['Spanish dopamine-break funnel and mutations', process.execPath, ['scripts/verify-es-dopamine-break.js', '--mutations']],
    ['Spanish typing-speed funnel and mutations', process.execPath, ['scripts/verify-es-typing-speed.js', '--mutations']],
    ['Chinese habit-tracker funnel and mutations', process.execPath, ['scripts/verify-zh-habit-tracker.js', '--mutations']],
    ['Japanese Brain Type funnel and mutations', process.execPath, ['scripts/verify-ja-brain-type.js', '--mutations']],
    ['Chinese cognitive-distortions funnel and mutations', process.execPath, ['scripts/verify-zh-cognitive-distortions.js', '--mutations']],
    ['French cognitive-distortions funnel and mutations', process.execPath, ['scripts/verify-fr-cognitive-distortions.js', '--mutations']],
    ['Spanish cognitive-distortions funnel and mutations', process.execPath, ['scripts/verify-es-cognitive-distortions.js', '--mutations']],
    ['Korean psychology picker and mutations', process.execPath, ['scripts/verify-ko-psychology-picker.js', '--mutations']],
    ['Chinese HSP guide funnel and mutations', process.execPath, ['scripts/verify-zh-hsp-guide.js', '--mutations']],
    ['English HSP coping path and mutations', process.execPath, ['scripts/verify-en-hsp-coping.js', '--mutations']],
    ['Japanese reaction-time funnel and mutations', process.execPath, ['scripts/verify-ja-reaction-time.js', '--mutations']],
    ['Japanese Minesweeper path and mutations', process.execPath, ['scripts/verify-ja-minesweeper-path.js', '--mutations']],
    ['French Minesweeper path and mutations', process.execPath, ['scripts/verify-fr-minesweeper-path.js', '--mutations']],
    ['Indonesian lottery random path and mutations', process.execPath, ['scripts/verify-id-lottery-random-path.js', '--mutations']],
    ['Chinese Block Puzzle path and mutations', process.execPath, ['scripts/verify-zh-block-puzzle-path.js', '--mutations']],
    ['French Developer Quiz path and mutations', process.execPath, ['scripts/verify-fr-dev-quiz-path.js', '--mutations']],
    ['English Past Life path and mutations', process.execPath, ['scripts/verify-en-past-life-path.js', '--mutations']],
    ['Chinese MBTI City path and mutations', process.execPath, ['scripts/verify-zh-mbti-city-path.js', '--mutations']],
    ['IQ completion reset and mutations', process.execPath, ['scripts/verify-iq-completion-reset.js', '--mutations']],
    ['Blood Type culture reset and mutations', process.execPath, ['scripts/verify-blood-type-culture-reset.js', '--mutations']],
    ['Zodiac pair reset and mutations', process.execPath, ['scripts/verify-zodiac-pair-reset.js', '--mutations']],
    ['Chinese rejection action and mutations', process.execPath, ['scripts/verify-zh-rejection-action.js', '--mutations']],
    ['Korean emotion action path and mutations', process.execPath, ['scripts/verify-ko-emotion-action-path.js', '--mutations']],
    ['Indonesian emotion action path and mutations', process.execPath, ['scripts/verify-id-emotion-action-path.js', '--mutations']],
    ['German emotion action path and mutations', process.execPath, ['scripts/verify-de-emotion-action-path.js', '--mutations']],
    ['English attachment reflection and mutations', process.execPath, ['scripts/verify-en-attachment-reflection.js', '--mutations']],
    ['French attachment reflection and mutations', process.execPath, ['scripts/verify-fr-attachment-reflection.js', '--mutations']],
    ['English shadow reflection and mutations', process.execPath, ['scripts/verify-en-shadow-reflection.js', '--mutations']],
    ['brain training bridge mutations', process.execPath, ['scripts/verify-brain-training-bridge.js', '--mutations']],
    ['2048 ad policy mutations', process.execPath, ['scripts/verify-2048-ad-policy.js', '--mutations']],
    ['Sky Runner suspension mutations', process.execPath, ['scripts/verify-sky-runner-suspension.js', '--mutations']],
    ['portfolio retirement mutations', process.execPath, ['scripts/verify-portfolio-retirement.js', '--mutations']],
    ['Brainrot retirement mutations', process.execPath, ['scripts/verify-brainrot-retirement.js', '--mutations']],
    ['Delulu retirement mutations', process.execPath, ['scripts/verify-delulu-retirement.js', '--mutations']],
    ['Hail Mary retirement mutations', process.execPath, ['scripts/verify-hail-mary-retirement.js', '--mutations']],
    ['Luck Meter retirement mutations', process.execPath, ['scripts/verify-luck-meter-retirement.js', '--mutations']],
    ['Sleep Animal retirement mutations', process.execPath, ['scripts/verify-sleep-animal-retirement.js', '--mutations']],
    ['Rizz Score retirement mutations', process.execPath, ['scripts/verify-rizz-score-retirement.js', '--mutations']],
    ['QR Generator trust and incident suspension', process.execPath, ['scripts/verify-qr-generator-trust.js', '--mutations']],
    ['Red Flag Test retirement mutations', process.execPath, ['scripts/verify-red-flag-retirement.js', '--mutations']],
    ['Routine Planner trust and incident suspension', process.execPath, ['scripts/verify-routine-planner-trust.js', '--mutations']],
    ['MBTI Career retirement mutations', process.execPath, ['scripts/verify-mbti-career-retirement.js', '--mutations']],
    ['Word Scramble retirement mutations', process.execPath, ['scripts/verify-word-scramble-retirement.js', '--mutations']],
    ['Pong suspension mutations', process.execPath, ['scripts/verify-pong-suspension.js', '--mutations']],
    ['Idle Clicker suspension mutations', process.execPath, ['scripts/verify-idle-clicker-suspension.js', '--mutations']],
    ['Flappy suspension mutations', process.execPath, ['scripts/verify-flappy-suspension.js', '--mutations']],
    ['Memory Card suspension mutations', process.execPath, ['scripts/verify-memory-card-suspension.js', '--mutations']],
    ['Maze Runner suspension mutations', process.execPath, ['scripts/verify-maze-runner-suspension.js', '--mutations']],
    ['Color Memory suspension mutations', process.execPath, ['scripts/verify-color-memory-suspension.js', '--mutations']],
    ['Road Shooter suspension mutations', process.execPath, ['scripts/verify-road-shooter-suspension.js', '--mutations']],
    ['Brick Breaker suspension mutations', process.execPath, ['scripts/verify-brick-breaker-suspension.js', '--mutations']],
    ['Zigzag Runner suspension mutations', process.execPath, ['scripts/verify-zigzag-runner-suspension.js', '--mutations']],
    ['Stack Tower suspension mutations', process.execPath, ['scripts/verify-stack-tower-suspension.js', '--mutations']],
    ['Number Puzzle suspension mutations', process.execPath, ['scripts/verify-number-puzzle-suspension.js', '--mutations']],
    ['Word Guess suspension mutations', process.execPath, ['scripts/verify-word-guess-suspension.js', '--mutations']],
    ['Snake suspension mutations', process.execPath, ['scripts/verify-snake-suspension.js', '--mutations']],
    ['Emoji Merge suspension mutations', process.execPath, ['scripts/verify-emoji-merge-suspension.js', '--mutations']],
    ['Portal ad containment mutations', process.execPath, ['scripts/verify-portal-ad-containment.js', '--mutations']],
    ['Portal Auto Ads-only mutations', process.execPath, ['scripts/verify-portal-auto-ads-only.js', '--mutations']],
    ['Trauma Response containment and mutations', process.execPath, ['scripts/verify-trauma-response.js', '--mutations']],
    ['Stress Response containment and mutations', process.execPath, ['scripts/verify-stress-response.js', '--mutations']],
    ['Color Personality containment and mutations', process.execPath, ['scripts/verify-color-personality.js', '--mutations']],
    ['Seollal retirement and mutations', process.execPath, ['scripts/verify-seollal-retirement.js', '--mutations']],
    ['NPC completion reset and mutations', process.execPath, ['scripts/verify-npc-completion-reset.js', '--mutations']],
    ['Anxiety Type containment and mutations', process.execPath, ['scripts/verify-anxiety-type.js', '--mutations']],
    ['Toxic Trait containment and mutations', process.execPath, ['scripts/verify-toxic-trait.js', '--mutations']],
    ['AI Personality containment and mutations', process.execPath, ['scripts/verify-ai-personality.js', '--mutations']],
    ['Emotion Temp containment and mutations', process.execPath, ['scripts/verify-emotion-temp.js', '--mutations']],
    ['Overthinker containment and mutations', process.execPath, ['scripts/verify-overthinker.js', '--mutations']],
    ['MBTI Love containment and mutations', process.execPath, ['scripts/verify-mbti-love.js', '--mutations']],
    ['ZH 2048 guide mutations', process.execPath, ['scripts/verify-zh-2048-guide.js', '--mutations']],
    ['culture choice and mutations', process.execPath, ['scripts/verify-culture-choice.js', '--mutations']],
    ['cross-promo touch mutations', process.execPath, ['scripts/verify-cross-promo-touch.js', '--mutations']],
    ['culture review mutations', process.execPath, ['scripts/culture-signal-review.js', '--mutations']],
    ['GSC sitemap submit safety', process.execPath, ['scripts/gsc-submit-sitemaps.js', '--self-test']],
    ['IndexNow submit safety', process.execPath, ['scripts/indexnow-submit.js', '--self-test']],
    ['indexing inventory self-test', process.execPath, ['scripts/indexing-inventory.js', '--self-test']],
    ['submitted indexing inventory strict', process.execPath, ['scripts/indexing-inventory.js', '--strict']],
    ['safe local browser ports', process.execPath, ['scripts/verify-safe-local-port.js']],
    ['Daily Tarot trust mutations', process.execPath, ['scripts/verify-daily-tarot.js', '--mutations']],
    ['blog indexing focus', process.execPath, ['scripts/blog-indexing-focus.js', '--self-test']],
    ['indexable blog ads', process.execPath, ['scripts/clean-indexable-blog-ads.js', '--self-test']],
    ['content audit self-test', process.execPath, ['scripts/blog-indexing-audit.js', '--self-test']],
    ['content audit smoke', process.execPath, ['scripts/blog-indexing-audit.js', '--lang', 'ko', '--limit', '1']],
    ['blog page verifier self-test', process.execPath, ['scripts/verify-blog-pages.js', '--self-test']],
    ['tracked secret self-test', process.execPath, ['scripts/verify-tracked-secrets.js', '--self-test']],
    ['tracked secret scan', process.execPath, ['scripts/verify-tracked-secrets.js']],
    ['AdSense contract mutations', process.execPath, ['scripts/verify-adsense-contract.js', '--mutations']],
    ['ad-risk inventory self-test', process.execPath, ['scripts/ad-risk-inventory.js', '--self-test', '--limit', '0']],
    ['HSP reset funnel runtime', process.execPath, ['scripts/verify-hsp-reset-funnel.js']],
    ['Stress core and mutations', process.execPath, ['scripts/verify-stress-core.js', '--mutations']],
    ['EQ trust and incident suspension', process.execPath, ['scripts/verify-eq-trust.js', '--mutations']],
    ['Burnout trust and incident suspension', process.execPath, ['scripts/verify-burnout-trust.js', '--mutations']],
    ['Reward reflection trust and incident suspension', process.execPath, ['scripts/verify-dopamine-trust.js', '--mutations']],
    ['Emotion iceberg reflection trust and incident suspension', process.execPath, ['scripts/verify-emotion-iceberg-trust.js', '--mutations']],
    ['Coffee code reflection trust and incident suspension', process.execPath, ['scripts/verify-mbti-coffee-trust.js', '--mutations']],
    ['Aura color studio trust and incident suspension', process.execPath, ['scripts/verify-aura-color-studio.js', '--mutations']],
    ['World knowledge sprint trust and incident suspension', process.execPath, ['scripts/verify-knowledge-sprint.js', '--mutations']],
    ['HSP reset funnel mutations', process.execPath, ['scripts/verify-hsp-reset-funnel.js', '--mutations']],
    ['sensory reset integration', process.execPath, ['scripts/verify-sensory-reset.js']],
    ['K-pop roster and guide mutations', process.execPath, ['scripts/verify-kpop-role-roster.js', '--mutations']],
    ['KST midnight boundary', process.execPath, ['scripts/verify-kst-date.js']],
    ['blog interaction generator', process.execPath, ['scripts/verify-blog-generator-interaction.js']],
  ];

  if (!options.skipAnalytics) {
    plannedSteps.push(['analytics event smoke', process.execPath, ['scripts/analytics-event-check.js']]);
  }

  if (!options.skipRuntime) {
    plannedSteps.push([
      'runtime smoke',
      process.execPath,
      ['scripts/runtime-check.js', options.runtime],
      {
        env: {
          HARNESS_ARTIFACTS: 'failure',
          HARNESS_TRACE: 'failure',
          RUNTIME_RESULTS_PATH: 'logs/harness-artifacts/runtime/latest-results.json',
        },
      },
    ]);
  }

  validatePlan(plannedSteps);
  const coverage = verifierCoverage(plannedSteps);

  if (options.release) {
    const verifier = options.releaseVerifier.replace(/\\/g, '/');
    if (!/^scripts\/[a-z0-9._-]+\.js$/i.test(verifier)) throw new Error(`Unsafe release verifier path: ${options.releaseVerifier}`);
    const selected = plannedSteps.find(([, command, args]) => command === process.execPath && args[0] === verifier);
    if (!selected) throw new Error(`Release verifier is not registered in the full harness: ${verifier}`);
    const releaseCore = new Set([
      'git diff check',
      'playwright version floor',
      'harness structure mutations',
      'documentation budget and mutations',
      'quality gate',
      'GSC sitemap submit safety',
      'IndexNow submit safety',
      'indexing inventory self-test',
      'submitted indexing inventory strict',
      'safe local browser ports',
      'tracked secret self-test',
      'tracked secret scan',
      'AdSense contract mutations',
      'ad-risk inventory self-test',
    ]);
    if (options.target.replace(/\\/g, '/').replace(/\/$/, '') === 'projects/portal') releaseCore.add('portal locale audit');
    plannedSteps.splice(0, plannedSteps.length, ...plannedSteps.filter((step) => releaseCore.has(step[0]) || step === selected));
  }

  validatePlan(plannedSteps);
  console.log('Node syntax validation: implicit in verifier execution\n');
  if (options.planOnly) {
    console.log(JSON.stringify({
      ...summarizePlan(plannedSteps),
      mode: options.release ? 'release' : 'full',
      verifierCoverage: coverage,
    }, null, 2));
    return;
  }

  for (const [name, command, args, stepOptions] of plannedSteps) {
    console.log(`\n=== ${name} ===`);
    const result = await runStep(name, command, args, stepOptions || {});
    steps.push(result);
    if (!result.ok) break;
  }

  const reportSteps = steps.map((step) => step.ok ? {
    name: step.name,
    group: stepGroup(plannedSteps.find((item) => item[0] === step.name)),
    ok: step.ok,
    code: step.code,
    durationMs: step.durationMs,
  } : { ...step, group: stepGroup(plannedSteps.find((item) => item[0] === step.name)) });
  const run = {
    runId: RUN_ID,
    ok: steps.every((step) => step.ok),
    mode: options.release ? 'release' : 'full',
    options,
    playwrightVersion,
    coverage,
    steps: reportSteps,
  };
  const reportPaths = writeReport(run);

  console.log('\nHarness Workflow Summary');
  for (const step of steps) {
    console.log(`  [${step.ok ? 'PASS' : 'FAIL'}] ${step.name} (${(step.durationMs / 1000).toFixed(1)}s)`);
  }
  console.log(`\nReport: ${reportPaths.mdPath}`);
  console.log(`Latest JSON: ${reportPaths.latestJsonPath}\n`);
  if (reportPaths.prunedReports > 0) {
    console.log(`Pruned old workflow reports: ${reportPaths.prunedReports}\n`);
  }

  process.exit(run.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
