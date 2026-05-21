#!/usr/bin/env node
// Codex-safe harness workflow runner.
// Usage: node scripts/harness-workflow-check.js [--target projects/portal] [--runtime brainrot-score]
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOG_DIR = path.join(ROOT, 'logs', 'harness-workflow');
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');
const BASH = process.env.GIT_BASH || (process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash');

function parseArgs(argv) {
  const options = {
    target: 'projects/portal',
    runtime: 'brainrot-score',
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
      console.log('Usage: node scripts/harness-workflow-check.js [--target projects/portal] [--runtime brainrot-score] [--skip-analytics] [--skip-runtime]');
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
  return { jsonPath, latestJsonPath, mdPath };
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
    ['portal locale audit', process.execPath, ['scripts/portal-hub-locale-audit.js']],
    ['quality gate', BASH, ['scripts/quality-gate.sh', options.target]],
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

  process.exit(run.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
