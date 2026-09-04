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

function parseArgs(argv) {
  const options = {
    target: 'projects/portal',
    runtime: 'focused',
    skipAnalytics: false,
    skipRuntime: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--target') options.target = argv[++i];
    else if (arg === '--runtime') options.runtime = argv[++i];
    else if (arg === '--skip-analytics') options.skipAnalytics = true;
    else if (arg === '--skip-runtime') options.skipRuntime = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/harness-workflow-check.js [--target projects/portal] [--runtime focused] [--skip-analytics] [--skip-runtime]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

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
    `- Runtime smoke target: \`${run.options.runtime}\``,
    `- Playwright: \`${run.playwrightVersion}\``,
    `- Result: **${run.ok ? 'PASS' : 'FAIL'}**`,
    '',
    '| Step | Result | Duration |',
    '|---|---:|---:|',
    ...run.steps.map((step) => `| ${step.name} | ${step.ok ? 'PASS' : 'FAIL'} | ${(step.durationMs / 1000).toFixed(1)}s |`),
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
  const playwrightVersion = require('playwright/package.json').version;
  const steps = [];

  console.log('\nHarness Workflow Check\n');
  console.log(`Playwright: ${playwrightVersion}`);
  console.log(`Target: ${options.target}`);
  console.log(`Runtime: ${options.runtime}\n`);

  const plannedSteps = [
    ['git diff check', 'git', ['diff', '--check']],
    ['playwright version floor', process.execPath, ['-e', `const v=require('playwright/package.json').version; if (!(${JSON.stringify(versionAtLeast(playwrightVersion, '1.60.0'))})) { console.error('Playwright 1.60.0+ required, got '+v); process.exit(1); } console.log('Playwright '+v+' OK');`]],
    ['script syntax', process.execPath, ['--check', 'scripts/harness-workflow-check.js']],
    ['analytics syntax', process.execPath, ['--check', 'scripts/analytics-event-check.js']],
    ['runtime syntax', process.execPath, ['--check', 'scripts/runtime-check.js']],
    ['root verifier syntax', process.execPath, ['--check', 'scripts/verify-root-focus.js']],
    ['root mutation syntax', process.execPath, ['--check', 'scripts/verify-root-focus-mutations.js']],
    ['brain trust verifier syntax', process.execPath, ['--check', 'scripts/verify-brain-type-trust.js']],
    ['Palworld server console verifier syntax', process.execPath, ['--check', 'scripts/verify-palworld-server-console.js']],
    ['MBTI compatibility focus verifier syntax', process.execPath, ['--check', 'scripts/verify-mbti-compatibility-focus.js']],
    ['Future Self funnel verifier syntax', process.execPath, ['--check', 'scripts/verify-future-self-funnel.js']],
    ['English Future Self guide verifier syntax', process.execPath, ['--check', 'scripts/verify-en-future-self-guide.js']],
    ['Doomscrolling bridge verifier syntax', process.execPath, ['--check', 'scripts/verify-doomscrolling-bridge.js']],
    ['Chinese browser-games verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-browser-games.js']],
    ['Chinese free-games controls verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-free-games-controls.js']],
    ['Spanish dopamine-break verifier syntax', process.execPath, ['--check', 'scripts/verify-es-dopamine-break.js']],
    ['Spanish typing-speed verifier syntax', process.execPath, ['--check', 'scripts/verify-es-typing-speed.js']],
    ['Chinese habit-tracker verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-habit-tracker.js']],
    ['Japanese Brain Type verifier syntax', process.execPath, ['--check', 'scripts/verify-ja-brain-type.js']],
    ['Chinese cognitive-distortions verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-cognitive-distortions.js']],
    ['French cognitive-distortions verifier syntax', process.execPath, ['--check', 'scripts/verify-fr-cognitive-distortions.js']],
    ['Spanish cognitive-distortions verifier syntax', process.execPath, ['--check', 'scripts/verify-es-cognitive-distortions.js']],
    ['Korean psychology picker verifier syntax', process.execPath, ['--check', 'scripts/verify-ko-psychology-picker.js']],
    ['Chinese HSP guide verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-hsp-guide.js']],
    ['English HSP coping verifier syntax', process.execPath, ['--check', 'scripts/verify-en-hsp-coping.js']],
    ['Japanese reaction-time verifier syntax', process.execPath, ['--check', 'scripts/verify-ja-reaction-time.js']],
    ['Japanese Minesweeper path verifier syntax', process.execPath, ['--check', 'scripts/verify-ja-minesweeper-path.js']],
    ['French Minesweeper path verifier syntax', process.execPath, ['--check', 'scripts/verify-fr-minesweeper-path.js']],
    ['Indonesian lottery random path verifier syntax', process.execPath, ['--check', 'scripts/verify-id-lottery-random-path.js']],
    ['Chinese Block Puzzle path verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-block-puzzle-path.js']],
    ['French Developer Quiz path verifier syntax', process.execPath, ['--check', 'scripts/verify-fr-dev-quiz-path.js']],
    ['English Past Life path verifier syntax', process.execPath, ['--check', 'scripts/verify-en-past-life-path.js']],
    ['Chinese MBTI City path verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-mbti-city-path.js']],
    ['IQ completion-reset verifier syntax', process.execPath, ['--check', 'scripts/verify-iq-completion-reset.js']],
    ['Blood Type culture-reset verifier syntax', process.execPath, ['--check', 'scripts/verify-blood-type-culture-reset.js']],
    ['Zodiac pair-reset verifier syntax', process.execPath, ['--check', 'scripts/verify-zodiac-pair-reset.js']],
    ['Chinese rejection-action verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-rejection-action.js']],
    ['Korean emotion-action path verifier syntax', process.execPath, ['--check', 'scripts/verify-ko-emotion-action-path.js']],
    ['Indonesian emotion-action path verifier syntax', process.execPath, ['--check', 'scripts/verify-id-emotion-action-path.js']],
    ['German emotion-action path verifier syntax', process.execPath, ['--check', 'scripts/verify-de-emotion-action-path.js']],
    ['English attachment-reflection verifier syntax', process.execPath, ['--check', 'scripts/verify-en-attachment-reflection.js']],
    ['French attachment-reflection verifier syntax', process.execPath, ['--check', 'scripts/verify-fr-attachment-reflection.js']],
    ['English shadow-reflection verifier syntax', process.execPath, ['--check', 'scripts/verify-en-shadow-reflection.js']],
    ['brain training bridge verifier syntax', process.execPath, ['--check', 'scripts/verify-brain-training-bridge.js']],
    ['2048 ad policy verifier syntax', process.execPath, ['--check', 'scripts/verify-2048-ad-policy.js']],
    ['Sky Runner suspension verifier syntax', process.execPath, ['--check', 'scripts/verify-sky-runner-suspension.js']],
    ['portfolio retirement verifier syntax', process.execPath, ['--check', 'scripts/verify-portfolio-retirement.js']],
    ['MBTI Career retirement verifier syntax', process.execPath, ['--check', 'scripts/verify-mbti-career-retirement.js']],
    ['Pong suspension verifier syntax', process.execPath, ['--check', 'scripts/verify-pong-suspension.js']],
    ['ZH 2048 guide verifier syntax', process.execPath, ['--check', 'scripts/verify-zh-2048-guide.js']],
    ['culture choice verifier syntax', process.execPath, ['--check', 'scripts/verify-culture-choice.js']],
    ['cross-promo touch verifier syntax', process.execPath, ['--check', 'scripts/verify-cross-promo-touch.js']],
    ['culture review syntax', process.execPath, ['--check', 'scripts/culture-signal-review.js']],
    ['GSC sitemap submit syntax', process.execPath, ['--check', 'scripts/gsc-submit-sitemaps.js']],
    ['IndexNow submit syntax', process.execPath, ['--check', 'scripts/indexnow-submit.js']],
    ['indexing inventory syntax', process.execPath, ['--check', 'scripts/indexing-inventory.js']],
    ['content audit syntax', process.execPath, ['--check', 'scripts/blog-indexing-audit.js']],
    ['blog page verifier syntax', process.execPath, ['--check', 'scripts/verify-blog-pages.js']],
    ['tracked secret verifier syntax', process.execPath, ['--check', 'scripts/verify-tracked-secrets.js']],
    ['AdSense contract verifier syntax', process.execPath, ['--check', 'scripts/verify-adsense-contract.js']],
    ['ad-risk inventory syntax', process.execPath, ['--check', 'scripts/ad-risk-inventory.js']],
    ['HSP reset funnel verifier syntax', process.execPath, ['--check', 'scripts/verify-hsp-reset-funnel.js']],
    ['Stress core verifier syntax', process.execPath, ['--check', 'scripts/verify-stress-core.js']],
    ['EQ trust verifier syntax', process.execPath, ['--check', 'scripts/verify-eq-trust.js']],
    ['sensory reset integration verifier syntax', process.execPath, ['--check', 'scripts/verify-sensory-reset.js']],
    ['K-pop roster verifier syntax', process.execPath, ['--check', 'scripts/verify-kpop-role-roster.js']],
    ['KST date helper syntax', process.execPath, ['--check', 'scripts/lib/time-zone-date.js']],
    ['KST date verifier syntax', process.execPath, ['--check', 'scripts/verify-kst-date.js']],
    ['safe local port verifier syntax', process.execPath, ['--check', 'scripts/verify-safe-local-port.js']],
    ['Daily Tarot verifier syntax', process.execPath, ['--check', 'scripts/verify-daily-tarot.js']],
    ['blog indexing focus syntax', process.execPath, ['--check', 'scripts/blog-indexing-focus.js']],
    ['indexable blog ad cleaner syntax', process.execPath, ['--check', 'scripts/clean-indexable-blog-ads.js']],
    ['blog interaction generator syntax', process.execPath, ['--check', 'scripts/verify-blog-generator-interaction.js']],
    ['portal locale audit', process.execPath, ['scripts/portal-hub-locale-audit.js']],
    ['quality gate', BASH, ['scripts/quality-gate.sh', options.target]],
    ['MBTI Career retirement quality gate', BASH, ['scripts/quality-gate.sh', 'projects/mbti-career']],
    ['K-pop position quality gate', BASH, ['scripts/quality-gate.sh', 'projects/kpop-position']],
    ['Future Self quality gate', BASH, ['scripts/quality-gate.sh', 'projects/future-self']],
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
    ['MBTI Career retirement mutations', process.execPath, ['scripts/verify-mbti-career-retirement.js', '--mutations']],
    ['Pong suspension mutations', process.execPath, ['scripts/verify-pong-suspension.js', '--mutations']],
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

  for (const [name, command, args, stepOptions] of plannedSteps) {
    console.log(`\n=== ${name} ===`);
    const result = await runStep(name, command, args, stepOptions || {});
    steps.push(result);
    if (!result.ok) break;
  }

  const run = {
    runId: RUN_ID,
    ok: steps.every((step) => step.ok),
    options,
    playwrightVersion,
    steps,
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
