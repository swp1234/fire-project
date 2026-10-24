#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const PORTAL_BLOG = path.join(ROOT, 'projects', 'portal', 'blog');

const SUSPENDED_SLUGS = [
  '/dark-core/', '/daily-tarot/', '/numerology/', '/flappy-bird/',
  '/brick-breaker/', '/snake-game/', '/maze-runner/', '/zigzag-runner/',
  '/stack-tower/', '/number-puzzle/', '/word-guess/', '/emoji-merge/',
  '/sky-runner/', '/pong-game/', '/idle-clicker/', '/color-memory/',
  '/road-shooter/', '/zodiac-match/', '/mbti-coffee/', '/mbti-career/',
  '/word-scramble/', '/red-flag/', '/luck-meter/', '/sleep-animal/',
  '/rizz-score/', '/delulu-test/', '/brainrot-quiz/', '/shadow-work/'
];

function getHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function auditFunnel(options = {}) {
  const files = getHtmlFiles(PORTAL_BLOG);
  let totalIssues = 0;
  const issuesByFile = [];

  for (const file of files) {
    const relativePath = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');

    // Skip noindex and redirect stubs
    if (content.includes('noindex') || content.includes('http-equiv="refresh"')) continue;

    const fileIssues = [];

    // 1. Check suspended links
    for (const slug of SUSPENDED_SLUGS) {
      if (content.includes(`href="${slug}`) || content.includes(`href="https://dopabrain.com${slug}`)) {
        fileIssues.push(`Suspended app link: ${slug}`);
      }
    }

    // 2. Check telemetry result leaks
    if (/track(?:ing)?\s*\([^)]*(?:stress_score|totalScore|result_type|score\s*:)/i.test(content)) {
      fileIssues.push('Potential telemetry score/result leak in analytics tracking');
    }

    if (fileIssues.length > 0) {
      totalIssues += fileIssues.length;
      issuesByFile.push({ file: relativePath, issues: fileIssues });
    }
  }

  console.log(`=== DopaBrain Funnel Audit ===`);
  console.log(`Audited ${files.length} blog files across all locales.`);
  if (totalIssues === 0) {
    console.log(`[PASS] Zero suspended links or telemetry leaks found. All funnels clean!`);
  } else {
    console.log(`[FAIL] Found ${totalIssues} issue(s) across ${issuesByFile.length} file(s):`);
    for (const item of issuesByFile) {
      console.log(` - ${item.file}:`);
      item.issues.forEach(iss => console.log(`     * ${iss}`));
    }
  }

  return { totalIssues, issuesByFile };
}

if (require.main === module) {
  const result = auditFunnel();
  process.exitCode = result.totalIssues === 0 ? 0 : 1;
}

module.exports = { auditFunnel, SUSPENDED_SLUGS };
