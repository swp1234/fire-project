#!/usr/bin/env bash
# Analyze failure logs for recurring patterns
# Usage: bash scripts/analyze-failures.sh [days]
# Default: last 7 days

set -euo pipefail

DAYS="${1:-7}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="${FAILURE_LOG_FILE:-$PROJECT_ROOT/memory/failures.jsonl}"

if [ ! -f "$LOG_FILE" ]; then
  echo "No failures logged yet."
  exit 0
fi

node - "$LOG_FILE" "$DAYS" <<'NODE'
const fs = require('fs');

const logFile = process.argv[2];
const days = Number(process.argv[3] || 7);
const raw = fs.readFileSync(logFile, 'utf8').split(/\r?\n/).filter(Boolean);
const entries = raw.map((line, index) => {
  try {
    return JSON.parse(line);
  } catch (error) {
    return {
      ts: 'invalid',
      agent: 'unknown',
      app: 'unknown',
      category: 'parse',
      error: `Invalid JSONL at line ${index + 1}`,
      resolved: false
    };
  }
});

const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
const recent = entries.filter(entry => {
  const time = Date.parse(entry.ts || '');
  return Number.isFinite(time) && time >= cutoff;
});

function countBy(items, field) {
  const counts = new Map();
  for (const item of items) {
    const key = item[field] || 'unknown';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function printCounts(title, counts, limit = Infinity) {
  console.log(title);
  for (const [key, count] of counts.slice(0, limit)) {
    console.log(`${String(count).padStart(5, ' ')} ${key}`);
  }
  console.log('');
}

console.log('=== Failure Analysis ===');
console.log(`Total entries: ${entries.length}`);
console.log(`Period: last ${days} days`);
console.log('');

printCounts('--- By Category ---', countBy(entries, 'category'));
printCounts('--- By Agent ---', countBy(entries, 'agent'));
printCounts('--- By App (top 10) ---', countBy(entries, 'app'), 10);

console.log('--- Unresolved ---');
console.log(entries.filter(entry => entry.resolved === false).length);
console.log('');

console.log(`--- Recent Errors (last ${days} days) ---`);
for (const entry of recent.slice(-10)) {
  console.log(`  [${entry.ts || ''}] ${entry.agent || 'unknown'}/${entry.app || 'unknown'} (${entry.category || 'unknown'}): ${entry.error || ''}`);
}
console.log('');

console.log('--- Recurring Patterns (errors appearing 2+ times) ---');
for (const [error, count] of countBy(entries, 'error').filter(([, count]) => count >= 2)) {
  console.log(`${String(count).padStart(5, ' ')} ${error}`);
}
NODE
