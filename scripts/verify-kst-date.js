#!/usr/bin/env node
'use strict';

const { dateInTimeZone, todayInTimeZone } = require('./lib/time-zone-date');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main(argv) {
  assert(argv.length === 0, `Unknown argument: ${argv[0]}`);
  const cases = [
    ['2026-08-28T14:59:59.999Z', '2026-08-28'],
    ['2026-08-28T15:00:00.000Z', '2026-08-29'],
    ['2026-12-31T15:00:00.000Z', '2027-01-01'],
    ['2028-02-29T01:30:00.000Z', '2028-02-29'],
  ];
  for (const [input, expected] of cases) {
    const actual = dateInTimeZone(input, 'Asia/Seoul');
    assert(actual === expected, `${input}: expected ${expected}, got ${actual}`);
    console.log(`[PASS] ${input} -> ${actual}`);
  }
  assert(/^\d{4}-\d{2}-\d{2}$/.test(todayInTimeZone()), 'todayInTimeZone format mismatch');
  try {
    dateInTimeZone('not-a-date');
    throw new Error('invalid date was accepted');
  } catch (error) {
    assert(error.message === 'Invalid date: not-a-date', `unexpected invalid-date error: ${error.message}`);
  }
  console.log('[PASS] invalid dates are rejected');
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
