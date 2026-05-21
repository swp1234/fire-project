// Playwright smoke test for game runtime verification
// Usage: node scripts/runtime-check.js <app-name|all|games>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME_DIRS = [
  'snake-game', 'flappy-bird', 'minesweeper', 'maze-runner', 'reaction-test',
  'pong-game', 'zigzag-runner', 'color-memory', 'stack-tower', 'sky-runner',
  'emoji-merge', 'idle-clicker', 'block-puzzle', 'brick-breaker', 'puzzle-2048',
  'memory-card', 'typing-speed', 'word-guess', 'word-scramble', 'road-shooter'
];

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(PROJECT_ROOT, 'projects');
const LOAD_TIMEOUT = 10000;
const OBSERVE_TIME = 5000;
const ARTIFACT_MODE = process.env.HARNESS_ARTIFACTS || 'failure';
const TRACE_MODE = process.env.HARNESS_TRACE || 'failure';
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');
const ARTIFACT_ROOT = path.join(PROJECT_ROOT, 'logs', 'harness-artifacts', 'runtime', RUN_ID);
const DEFAULT_RESULTS_PATH = path.join(PROJECT_ROOT, 'logs', 'harness-artifacts', 'runtime', 'latest-results.json');

// Error patterns that indicate a crash
const CRASH_PATTERNS = [
  'Uncaught', 'ReferenceError', 'TypeError', 'SyntaxError',
  'RangeError', 'URIError', 'EvalError', 'InternalError',
  'Unhandled', 'FATAL', 'Cannot read propert', 'is not defined',
  'is not a function', 'Cannot set propert', 'null is not an object'
];

function isCrashError(text) {
  const lower = text.toLowerCase();
  return CRASH_PATTERNS.some(p => lower.includes(p.toLowerCase()));
}

function sanitizeName(name) {
  return name.replace(/[^a-z0-9._-]+/gi, '-');
}

function shouldWriteArtifacts(pass) {
  if (ARTIFACT_MODE === '0' || ARTIFACT_MODE === 'never') return false;
  if (ARTIFACT_MODE === 'always') return true;
  return !pass;
}

function shouldKeepTrace(pass) {
  if (TRACE_MODE === '0' || TRACE_MODE === 'never') return false;
  if (TRACE_MODE === 'always') return true;
  return !pass;
}

function dedupeErrors(errors) {
  const seen = new Set();
  return errors.filter((error) => {
    const key = `${error.phase}:${error.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getResultsPath() {
  if (!process.env.RUNTIME_RESULTS_PATH) return DEFAULT_RESULTS_PATH;
  return path.isAbsolute(process.env.RUNTIME_RESULTS_PATH)
    ? process.env.RUNTIME_RESULTS_PATH
    : path.join(PROJECT_ROOT, process.env.RUNTIME_RESULTS_PATH);
}

async function collectBufferedDiagnostics(page) {
  const errors = [];
  if (typeof page.pageErrors === 'function') {
    const pageErrors = await page.pageErrors({ filter: 'since-navigation' }).catch(() => []);
    for (const error of pageErrors) {
      errors.push({ phase: 'pageErrors()', text: error.message || String(error) });
    }
  }

  if (typeof page.consoleMessages === 'function') {
    const consoleMessages = await page.consoleMessages({ filter: 'since-navigation' }).catch(() => []);
    for (const message of consoleMessages) {
      if (message.type() === 'error' && isCrashError(message.text())) {
        errors.push({ phase: 'consoleMessages()', text: message.text() });
      }
    }
  }

  return errors;
}

async function readAriaSnapshot(page) {
  if (typeof page.ariaSnapshot !== 'function') return '';
  try {
    return await page.ariaSnapshot({ depth: 4, mode: 'ai', timeout: 2000 });
  } catch {
    return '';
  }
}

async function writeFailureArtifacts(page, appName, payload) {
  const appArtifactDir = path.join(ARTIFACT_ROOT, sanitizeName(appName));
  fs.mkdirSync(appArtifactDir, { recursive: true });

  const jsonPath = path.join(appArtifactDir, 'result.json');
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));

  try {
    await page.screenshot({ path: path.join(appArtifactDir, 'failure.png'), fullPage: true });
  } catch {
    // Screenshots are best-effort diagnostics.
  }

  return appArtifactDir;
}

function getAllApps() {
  try {
    return fs.readdirSync(PROJECTS_DIR).filter(d => {
      const full = path.join(PROJECTS_DIR, d);
      return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.html'));
    });
  } catch {
    return [];
  }
}

function resolveApps(arg) {
  if (arg === 'all') return getAllApps();
  if (arg === 'games') return GAME_DIRS.filter(g => {
    const idx = path.join(PROJECTS_DIR, g, 'index.html');
    return fs.existsSync(idx);
  });
  return [arg];
}

async function testApp(browser, appName) {
  const localPath = path.join(PROJECTS_DIR, appName, 'index.html');
  const hasLocal = fs.existsSync(localPath);
  const url = hasLocal
    ? `file:///${localPath.replace(/\\/g, '/')}`
    : `https://dopabrain.com/${appName}/`;

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    // Suppress permission dialogs
    permissions: [],
  });
  const shouldStartTrace = TRACE_MODE !== '0' && TRACE_MODE !== 'never';
  if (shouldStartTrace) {
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true, title: appName });
  }
  const page = await context.newPage();

  const errors = [];
  let crashed = false;
  let ariaSnapshot = '';
  let artifactPath = '';

  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (isCrashError(text)) {
        errors.push({ phase: 'console.error', text });
      }
    }
  });

  // Collect page errors (uncaught exceptions)
  page.on('pageerror', err => {
    errors.push({ phase: 'pageerror', text: err.message });
  });

  // Page crash
  page.on('crash', () => {
    crashed = true;
    errors.push({ phase: 'crash', text: 'Page crashed' });
  });

  try {
    // Navigate
    await page.goto(url, { waitUntil: 'load', timeout: LOAD_TIMEOUT });
  } catch (e) {
    errors.push({ phase: 'navigation', text: e.message });
  }

  if (!crashed) {
    // Phase 1: observe for 5 seconds
    await page.waitForTimeout(OBSERVE_TIME);
    ariaSnapshot = await readAriaSnapshot(page);

    // Simulate a click in center to "start" the game
    try {
      await page.mouse.click(640, 360);
    } catch { /* ignore click failures */ }

    // Phase 2: observe for another 5 seconds after interaction
    await page.waitForTimeout(OBSERVE_TIME);
  }

  errors.push(...await collectBufferedDiagnostics(page));
  const finalErrors = dedupeErrors(errors);
  const pass = finalErrors.length === 0;
  const result = { appName, url, pass, errors: finalErrors, crashed, ariaSnapshot };

  if (shouldWriteArtifacts(pass)) {
    artifactPath = await writeFailureArtifacts(page, appName, result);
    result.artifactPath = artifactPath;
  }

  if (shouldStartTrace) {
    if (shouldKeepTrace(pass)) {
      if (!artifactPath) {
        artifactPath = path.join(ARTIFACT_ROOT, sanitizeName(appName));
        fs.mkdirSync(artifactPath, { recursive: true });
        result.artifactPath = artifactPath;
      }
      await context.tracing.stop({ path: path.join(artifactPath, 'trace.zip') });
    } else {
      await context.tracing.stop();
    }
  }

  await context.close();

  return result;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/runtime-check.js <app-name|all|games>');
    process.exit(2);
  }

  const apps = resolveApps(arg);
  if (apps.length === 0) {
    console.error(`No apps found for: ${arg}`);
    process.exit(2);
  }

  console.log(`\n  Runtime Smoke Test — ${apps.length} app(s)\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const app of apps) {
    const result = await testApp(browser, app);
    results.push(result);

    const icon = result.pass ? 'PASS' : 'FAIL';
    const line = `  [${icon}] ${result.appName}`;
    if (result.pass) {
      console.log(line);
    } else {
      console.log(line);
      if (result.artifactPath) {
        console.log(`         artifact: ${result.artifactPath}`);
      }
      for (const e of result.errors) {
        console.log(`         (${e.phase}) ${e.text.substring(0, 200)}`);
      }
    }
  }

  await browser.close();

  // Summary
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n  Summary: ${passed} passed, ${failed} failed out of ${results.length}\n`);

  // Output JSON for machine consumption
  const jsonPath = getResultsPath();
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`  Results: ${jsonPath}`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(2);
});
