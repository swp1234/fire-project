#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const WORKSPACE = path.resolve(__dirname, '..', '..', '..', '..');

const CHECKS = [
  { name: 'AdSense OAuth & Account Keepalive', cmd: 'npm run adsense:keepalive' },
  { name: 'AdSense Contract (Auto Ads & No-Reward)', cmd: 'npm run verify:adsense-contract' },
  { name: 'Indexing Inventory & Sitemap Health', cmd: 'npm run verify:indexing-inventory' },
  { name: 'Tracked Secrets Scan', cmd: 'npm run verify:tracked-secrets' },
  { name: 'Documentation Budgets', cmd: 'npm run verify:docs' },
  { name: 'Root Domain & 12 Locales Focus', cmd: 'npm run verify:root' }
];

console.log('=== DopaBrain Health Guard Suite ===\n');
let failed = 0;

for (const check of CHECKS) {
  process.stdout.write(`[RUNNING] ${check.name}... `);
  try {
    const output = execSync(check.cmd, { cwd: WORKSPACE, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log('PASSED');
  } catch (err) {
    console.log('FAILED');
    console.error(`\nError in [${check.name}]:\n${err.stderr || err.stdout || err.message}\n`);
    failed++;
  }
}

console.log('\n====================================');
if (failed === 0) {
  console.log('All health checks PASSED. System is clean and compliant.');
  process.exit(0);
} else {
  console.error(`Health guard detected ${failed} failure(s). Investigate before proceeding.`);
  process.exit(1);
}
