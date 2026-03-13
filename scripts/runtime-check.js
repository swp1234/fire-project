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
  const page = await context.newPage();

  const errors = [];
  let crashed = false;

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

    // Simulate a click in center to "start" the game
    try {
      await page.mouse.click(640, 360);
    } catch { /* ignore click failures */ }

    // Phase 2: observe for another 5 seconds after interaction
    await page.waitForTimeout(OBSERVE_TIME);
  }

  await context.close();

  const pass = errors.length === 0;
  return { appName, url, pass, errors, crashed };
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
  const jsonPath = path.join(PROJECT_ROOT, 'scripts', 'runtime-check-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(2);
});
