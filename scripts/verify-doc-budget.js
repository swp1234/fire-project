#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTRACT = {
  'AGENTS.md': { bytes: 1800, lines: 45 },
  'CLAUDE.md': { bytes: 3000, lines: 60 },
  'README.md': { bytes: 1500, lines: 45 },
  'PROGRESS.md': { bytes: 4000, lines: 45 },
  'memory/data-check-log.md': { bytes: 10000, lines: 120 },
  'docs/STRATEGY.md': { bytes: 4000, lines: 80 },
  'docs/MARKETING.md': { bytes: 1500, lines: 35 },
  'docs/HARNESS-WORKFLOW.md': { bytes: 2500, lines: 60 },
  'docs/OPERATIONS.md': { bytes: 4000, lines: 90 },
  'docs/VALIDATION.md': { bytes: 4500, lines: 100 },
};

function ok(value, message) {
  if (!value) throw new Error(message);
}

function load(overrides = {}) {
  return Object.fromEntries(Object.keys(CONTRACT).map((file) => [
    file,
    overrides[file] ?? fs.readFileSync(path.join(ROOT, file), 'utf8'),
  ]));
}

function verifyLocalLinks(file, text) {
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, '');
    if (/^(?:https?:|mailto:|#)/i.test(rawTarget)) continue;
    const target = rawTarget.replace(/#.*$/, '').replace(/:\d+$/, '');
    if (!target) continue;
    const resolved = path.resolve(path.dirname(path.join(ROOT, file)), target);
    ok(fs.existsSync(resolved), `${file}: broken local link ${rawTarget}`);
  }
}

function verify(docs = load()) {
  for (const [file, budget] of Object.entries(CONTRACT)) {
    const text = docs[file];
    ok(typeof text === 'string', `${file}: missing`);
    const bytes = Buffer.byteLength(text);
    const lines = text.split(/\r?\n/).length;
    ok(bytes <= budget.bytes, `${file}: ${bytes} bytes exceeds ${budget.bytes}`);
    ok(lines <= budget.lines, `${file}: ${lines} lines exceeds ${budget.lines}`);
    ok(!/[\u0000\uFFFD]/u.test(text), `${file}: invalid UTF-8 marker`);
    const headings = Array.from(text.matchAll(/^#{1,3}\s+(.+)$/gm), (match) => match[1].trim().toLowerCase());
    ok(new Set(headings).size === headings.length, `${file}: duplicate heading`);
    verifyLocalLinks(file, text);
  }

  const progress = docs['PROGRESS.md'];
  const memory = docs['memory/data-check-log.md'];
  const operations = docs['docs/OPERATIONS.md'];
  const harness = docs['docs/HARNESS-WORKFLOW.md'];
  ok((progress.match(/^## Latest release:/gm) || []).length === 1, 'PROGRESS.md: exactly one latest release required');
  ok(/Current account state/.test(memory) && /Measurement rules/.test(memory) && /Verification baseline/.test(memory), 'memory/data-check-log.md: current decision sections missing');
  ok(/Git history/.test(memory) && /raw responses/i.test(memory), 'memory/data-check-log.md: archival boundary missing');
  ok(/Documentation budget/.test(operations) && /Git (?:history|이력)/.test(operations), 'docs/OPERATIONS.md: documentation lifecycle missing');
  ok(/harness:release/.test(harness) && /--plan/.test(harness) && /diagnostic/i.test(harness), 'docs/HARNESS-WORKFLOW.md: harness modes missing');

  return Object.entries(CONTRACT).map(([file, budget]) => ({
    file,
    bytes: Buffer.byteLength(docs[file]),
    limit: budget.bytes,
  }));
}

function mutations() {
  const baseline = load();
  const cases = [
    ['progress-bloat', { 'PROGRESS.md': baseline['PROGRESS.md'] + 'x'.repeat(4000) }],
    ['memory-bloat', { 'memory/data-check-log.md': baseline['memory/data-check-log.md'] + 'x'.repeat(10000) }],
    ['duplicate-heading', { 'docs/STRATEGY.md': `${baseline['docs/STRATEGY.md']}\n## Goal and constraint\n` }],
    ['latest-release-duplicated', { 'PROGRESS.md': `${baseline['PROGRESS.md']}\n## Latest release: stale\n` }],
    ['memory-sections-removed', { 'memory/data-check-log.md': baseline['memory/data-check-log.md'].replace('Measurement rules', 'Old rules') }],
    ['archive-boundary-removed', { 'memory/data-check-log.md': baseline['memory/data-check-log.md'].replace('Git history', 'commit history').replace('raw responses', 'responses') }],
    ['lifecycle-removed', { 'docs/OPERATIONS.md': baseline['docs/OPERATIONS.md'].replace('Documentation budget', 'Notes') }],
    ['invalid-utf8-marker', { 'README.md': `${baseline['README.md']}\uFFFD` }],
    ['broken-local-link', { 'README.md': `${baseline['README.md']}\n[missing](docs/not-real.md)\n` }],
    ['harness-modes-removed', { 'docs/HARNESS-WORKFLOW.md': baseline['docs/HARNESS-WORKFLOW.md'].replace('harness:release', 'release-check') }],
  ];

  for (const [name, change] of cases) {
    let caught = false;
    try { verify({ ...baseline, ...change }); } catch (error) {
      caught = true;
      console.log(`[PASS] ${name}: ${error.message}`);
    }
    ok(caught, `mutation escaped: ${name}`);
  }
  console.log(`[PASS] mutation summary ${cases.length}/${cases.length} detected`);
}

const rows = verify();
if (process.argv.includes('--mutations')) mutations();
console.log(`[PASS] documentation budget: ${rows.map((row) => `${row.file} ${row.bytes}/${row.limit}`).join(', ')}`);
