#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { verifyRootFocus } = require('./verify-root-focus');

const WORKSPACE = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.join(WORKSPACE, 'projects', 'root-domain');
const PROJECTS_DIR = path.join(WORKSPACE, 'projects');
const SAFE_PREFIX = path.join(os.tmpdir(), 'dopabrain-verifier-');

function mutateIndex(rootDir, transform) {
  const indexPath = path.join(rootDir, 'index.html');
  const source = fs.readFileSync(indexPath, 'utf8');
  const output = transform(source);
  if (output === source) throw new Error('Mutation did not change index.html');
  fs.writeFileSync(indexPath, output);
}

function copyRootFixture(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const name of ['index.html', 'manifest.json', 'sw.js', 'favicon.ico', 'icon-192.svg', 'icon-512.svg']) {
    const sourcePath = path.join(source, name);
    if (fs.existsSync(sourcePath)) fs.copyFileSync(sourcePath, path.join(destination, name));
  }
  const copyDirectory = (sourceDir, destinationDir) => {
    fs.mkdirSync(destinationDir, { recursive: true });
    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
      const sourcePath = path.join(sourceDir, entry.name);
      const destinationPath = path.join(destinationDir, entry.name);
      if (entry.isDirectory()) copyDirectory(sourcePath, destinationPath);
      else if (entry.isFile()) fs.copyFileSync(sourcePath, destinationPath);
    }
  };
  copyDirectory(path.join(source, 'js'), path.join(destination, 'js'));
}

function removeDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) removeDirectory(target);
    else fs.unlinkSync(target);
  }
  fs.rmdirSync(directory);
}

const mutations = [
  {
    name: 'broken-primary-route', expected: 'Primary CTA path mismatch',
    apply(rootDir) {
      mutateIndex(rootDir, (html) => html.replace('href="/stress-check/" class="cta-link hero-cta" id="hero-primary-cta"', 'href="/missing-primary/" class="cta-link hero-cta" id="hero-primary-cta"'));
    },
  },
  {
    name: 'missing-fr-locale', expected: 'Missing locale file: fr.json',
    apply(rootDir) { fs.unlinkSync(path.join(rootDir, 'js', 'locales', 'fr.json')); },
  },
  {
    name: 'missing-analytics-binding', expected: 'Analytics event verification failed',
    apply(rootDir) { mutateIndex(rootDir, (html) => html.replace('data-root-surface="hero_primary_stress"', 'data-root-surface="hero_primary_missing"')); },
  },
  {
    name: 'broken-culture-signal-route', expected: 'Culture signal path mismatch',
    apply(rootDir) {
      mutateIndex(rootDir, (html) => html.replace('/portal/blog/ko/odyssey-spider-man-identity-reset-2026.html', '/portal/blog/ko/missing-culture-signal.html'));
    },
  },
  {
    name: 'mobile-overflow', expected: 'horizontal overflow',
    apply(rootDir) { mutateIndex(rootDir, (html) => html.replace('</head>', '<style>body{min-width:900px!important}</style>\n</head>')); },
  },
  {
    name: 'duplicate-id', expected: 'Duplicate DOM IDs',
    apply(rootDir) { mutateIndex(rootDir, (html) => html.replace('id="hero-secondary-cta"', 'id="hero-primary-cta"')); },
  },
  {
    name: 'runtime-exception', expected: 'Runtime errors',
    apply(rootDir) { mutateIndex(rootDir, (html) => html.replace('</body>', '<script>setTimeout(() => { throw new Error("mutation-runtime-crash") }, 0)</script>\n</body>')); },
  },
];

async function runVerifier(rootDir) {
  return verifyRootFocus({
    rootDir,
    projectsDir: PROJECTS_DIR,
    languages: ['en'],
    viewports: [{ name: 'mobile', width: 390, height: 844 }],
    checkLinks: false,
    screenshot: false,
  });
}

async function main() {
  const tempRoot = fs.mkdtempSync(SAFE_PREFIX);
  if (!path.resolve(tempRoot).startsWith(path.resolve(SAFE_PREFIX))) throw new Error(`Unsafe temp root: ${tempRoot}`);
  const results = [];
  const baseline = path.join(tempRoot, 'baseline');
  copyRootFixture(SOURCE_ROOT, baseline);
  console.log('[RUN] baseline');
  await runVerifier(baseline);
  results.push({ name: 'baseline', ok: true });
  for (const mutation of mutations) {
    const fixture = path.join(tempRoot, mutation.name);
    copyRootFixture(baseline, fixture);
    mutation.apply(fixture);
    console.log(`[RUN] ${mutation.name}`);
    try {
      await runVerifier(fixture);
      results.push({ name: mutation.name, ok: false, error: 'verifier incorrectly passed' });
    } catch (error) {
      const detected = error.message.includes(mutation.expected);
      results.push({ name: mutation.name, ok: detected, error: detected ? undefined : error.message });
    }
  }
  for (const result of results) console.log(`[${result.ok ? 'PASS' : 'FAIL'}] ${result.name}${result.error ? `: ${result.error}` : ''}`);
  const failed = results.filter((result) => !result.ok);
  console.log(`\nMutation summary: ${results.length - failed.length}/${results.length} checks passed`);
  if (!path.resolve(tempRoot).startsWith(path.resolve(SAFE_PREFIX))) throw new Error(`Refusing unsafe cleanup: ${tempRoot}`);
  removeDirectory(tempRoot);
  console.log('[PASS] cleanup');
  process.exitCode = failed.length ? 1 : 0;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
