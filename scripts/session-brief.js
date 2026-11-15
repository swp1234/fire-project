#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const RETRO_PATH = path.join(ROOT, 'memory', 'retrospectives.jsonl');
const DATA_LOG_PATH = path.join(ROOT, 'memory', 'data-check-log.md');
const REGISTRY_PATH = path.join(ROOT, 'memory', 'audit-registry.json');

function kstToday(now = new Date()) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function parseRetrospectives(text) {
  const rows = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const parsed = [];
  for (let i = 0; i < rows.length; i += 1) {
    let item;
    try {
      item = JSON.parse(rows[i]);
    } catch (error) {
      throw new Error(`memory/retrospectives.jsonl line ${i + 1}: invalid JSON (${error.message})`);
    }
    if (item.date && (item.date > '2026-11-15' || ('promoted' in item) || ('friction' in item) || (!item.key_lesson && !item.period))) {
      for (const field of ['date', 'task', 'friction', 'rule_target', 'lesson']) {
        if (typeof item[field] !== 'string' || !item[field].trim()) {
          throw new Error(`memory/retrospectives.jsonl line ${i + 1}: missing required string "${field}"`);
        }
      }
      if (typeof item.promoted !== 'boolean') {
        throw new Error(`memory/retrospectives.jsonl line ${i + 1}: "promoted" must be boolean`);
      }
      if (!['code', 'md', 'none'].includes(item.rule_target)) {
        throw new Error(`memory/retrospectives.jsonl line ${i + 1}: invalid rule_target "${item.rule_target}"`);
      }
    }
    parsed.push(item);
  }
  return parsed;
}

function parseMaturationGates(markdown, today = kstToday()) {
  const lines = markdown.split(/\r?\n/);
  const gates = [];
  let inSection = false;
  for (const line of lines) {
    if (/^##\s+Active monetization tracking/i.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(line)) break;
    if (!inSection || !line.startsWith('|')) continue;
    if (/^\|\s*Deployed\s*\|/i.test(line) || /^\|\s*-+/.test(line)) continue;
    const cols = line.split('|').slice(1, -1).map((col) => col.trim());
    if (cols.length < 5) continue;
    const [deployed, workstream, , , earliestRaw] = cols;
    const dates = Array.from(earliestRaw.matchAll(/\d{4}-\d{2}-\d{2}/g), (match) => match[0]);
    const nextDate = dates.find((date) => date > today) || null;
    const readyDates = dates.filter((date) => date <= today);
    gates.push({
      deployed,
      workstream,
      earliestRaw,
      ready: readyDates.length > 0,
      status: readyDates.length > 0 ? `READY (${readyDates.join(', ')})` : `WAIT until ${nextDate || earliestRaw}`,
    });
  }
  return gates;
}

function dirtySubmodules() {
  try {
    const out = execSync('git status --porcelain projects', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    if (!out) return [];
    return out.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function summarize(options = {}) {
  const today = options.today || kstToday();
  const retroText = options.retroText ?? fs.readFileSync(RETRO_PATH, 'utf8');
  const dataLogText = options.dataLogText ?? fs.readFileSync(DATA_LOG_PATH, 'utf8');
  const retros = parseRetrospectives(retroText);
  const recent = retros.slice(-3);
  const unpromoted = retros.filter((item) => item.promoted === false);
  const gates = parseMaturationGates(dataLogText, today);
  const dirty = options.dirty ?? dirtySubmodules();
  const registry = options.registry ?? (fs.existsSync(REGISTRY_PATH) ? JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')) : { submodules: {} });
  return { today, recent, unpromoted, gates, dirty, registryCount: Object.keys(registry.submodules || {}).length };
}

function runSelfTests() {
  let caughtSchema = false;
  try {
    parseRetrospectives(JSON.stringify({ date: '2026-11-16', task: 't', friction: 'f', rule_target: 'bad', promoted: false, lesson: 'l' }));
  } catch {
    caughtSchema = true;
  }
  if (!caughtSchema) throw new Error('session-brief mutation escaped: invalid rule_target');

  const sampleLog = [
    '## Active monetization tracking & maturation gates',
    '| Deployed | Workstream | Base | Metrics | Earliest review |',
    '|---|---|---|---|---|',
    '| 2026-11-12 | Future window | a | b | `2026-11-21` |',
    '| 2026-11-01 | Ready window | a | b | `2026-11-10` |',
  ].join('\n');
  const gates = parseMaturationGates(sampleLog, '2026-11-15');
  if (gates.length !== 2 || gates[0].ready !== false || gates[1].ready !== true) {
    throw new Error('session-brief maturation gate self-test failed');
  }
  console.log('[PASS] session-brief mutation summary 2/2 detected');
}

function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTests();
    return;
  }
  const report = summarize();
  console.log(`=== DopaBrain Session Brief (KST ${report.today}) ===`);
  console.log(`Audit registry cached: ${report.registryCount} submodules`);
  console.log('\n[Recent Retrospectives]');
  for (const row of report.recent) {
    const label = row.date || row.period || 'unknown';
    const lesson = row.lesson || row.key_lesson || row.rule_promoted || '';
    console.log(`- (${label}) ${lesson}`);
  }
  if (report.unpromoted.length > 0) {
    console.log(`\n[WARN] Unpromoted lessons (${report.unpromoted.length}) — promote repeated friction to verify-*.js:`);
    for (const row of report.unpromoted) {
      console.log(`- [${row.date}] (${row.rule_target}) ${row.friction} -> ${row.lesson}`);
    }
  } else {
    console.log('\n[OK] Zero unpromoted lessons pending.');
  }
  console.log('\n[Maturation Gates]');
  for (const gate of report.gates) {
    console.log(`- ${gate.status} | ${gate.deployed} | ${gate.workstream}`);
  }
  if (report.dirty.length > 0) {
    console.log(`\n[WARN] Dirty project entries (${report.dirty.length}): ${report.dirty.join(', ')}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { kstToday, parseRetrospectives, parseMaturationGates, summarize };
