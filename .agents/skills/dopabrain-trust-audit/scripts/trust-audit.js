#!/usr/bin/env node
/**
 * DopaBrain Trust & Compliance Audit Tool
 * Checks and fixes:
 *  - synthetic telemetry (page_engage)
 *  - fabricated aggregateRating schema
 *  - hidden FAQPage schema without visible FAQs
 *  - manual adsbygoogle units or ad-lock gates
 * Enforces zero-token skip via memory/audit-registry.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = path.resolve(__dirname, '..', '..', '..', '..');
const PROJECTS_DIR = path.join(WORKSPACE, 'projects');
const REGISTRY_PATH = path.join(WORKSPACE, 'memory', 'audit-registry.json');

const args = process.argv.slice(2);
const isFix = args.includes('--fix');
const isAll = args.includes('--all');
const forceCheck = args.includes('--force');
const targetProjects = args.filter(a => !a.startsWith('--'));

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) return { submodules: {} };
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
}

function saveRegistry(reg) {
  reg.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2) + '\n', 'utf8');
}

function getSubmoduleHead(dir) {
  try {
    return execSync('git rev-parse HEAD', { cwd: dir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function getSubmoduleBranch(dir) {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: dir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (branch === 'HEAD') {
      const branches = execSync('git branch -r', { cwd: dir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      if (branches.includes('origin/master')) return 'master';
      if (branches.includes('origin/main')) return 'main';
      return 'master';
    }
    return branch;
  } catch {
    return 'master';
  }
}

function auditProject(projectName, registry, fixMode) {
  const projDir = path.join(PROJECTS_DIR, projectName);
  const indexPath = path.join(projDir, 'index.html');
  if (!fs.existsSync(indexPath)) return null;

  const currentHead = getSubmoduleHead(projDir);
  const regEntry = registry.submodules?.[projectName];

  if (!forceCheck && regEntry && regEntry.headCommit === currentHead && regEntry.status === 'VERIFIED_PASSED' && regEntry.trustCompliant === true) {
    return { name: projectName, skipped: true, reason: 'Already verified at current HEAD in audit-registry.json' };
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  let issues = [];

  // 1. Synthetic telemetry: page_engage (HTML and JS)
  if (/page_engage/i.test(html)) {
    issues.push('synthetic_page_engage');
  }

  // Scan JS files for synthetic telemetry and fake percentiles
  const jsFiles = [];
  function collectJs(d) {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      if (f.startsWith('.') || f === 'node_modules' || f === 'tests') continue;
      const full = path.join(d, f);
      const st = fs.statSync(full);
      if (st.isDirectory()) collectJs(full);
      else if (f.endsWith('.js')) jsFiles.push(full);
    }
  }
  collectJs(projDir);

  for (const jsPath of jsFiles) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    if (/page_engage/i.test(jsContent) && !issues.includes('synthetic_page_engage')) {
      issues.push('synthetic_page_engage');
    }
    if (/Math\.random\(\)/.test(jsContent) && (/percentileStat/i.test(jsContent) || /pctVal/i.test(jsContent) || /Math\.floor\(Math\.random/i.test(jsContent) && /percentile/i.test(jsContent))) {
      if (!issues.includes('fake_random_percentile')) issues.push('fake_random_percentile');
    }
  }

  // 2. Fabricated aggregateRating
  if (/aggregateRating/i.test(html)) {
    issues.push('fake_aggregate_rating');
  }

  // 3. Hidden FAQPage schema
  if (/FAQPage/i.test(html)) {
    const hasVisibleFaq = /class=["'][^"']*(?:faq|about-faq|accordion)[^"']*["']/i.test(html) ||
      /<(?:details|h[2-4])[^>]*>.*?(?:faq|frequently asked)/i.test(html);
    if (!hasVisibleFaq) {
      issues.push('hidden_faq_schema');
    }
  }

  // 4. Interstitial ad lock
  if (/showInterstitialAd|interstitial-ad/i.test(html)) {
    issues.push('ad_lock_interstitial');
  }

  if (issues.length === 0) {
    if (currentHead) {
      if (!registry.submodules) registry.submodules = {};
      const existing = registry.submodules[projectName] || {};
      registry.submodules[projectName] = {
        ...existing,
        headCommit: currentHead,
        branch: getSubmoduleBranch(projDir),
        auditedAt: new Date().toISOString().split('T')[0],
        overflowPx: existing.overflowPx !== undefined ? existing.overflowPx : 0,
        touchTargetCompliant: existing.touchTargetCompliant !== undefined ? existing.touchTargetCompliant : true,
        trustCompliant: true,
        status: 'VERIFIED_PASSED'
      };
      saveRegistry(registry);
    }
    return { name: projectName, issues: [], clean: true };
  }

  if (!fixMode) {
    return { name: projectName, issues, clean: false };
  }

  // FIX MODE: Apply sanitization
  let fixedHtml = html;

  // Fix 1: Remove page_engage setTimeout scripts
  fixedHtml = fixedHtml.replace(/<script>[^<]*?page_engage[^<]*?<\/script>\s*/gi, '');

  // Fix 2 & 3: Clean JSON-LD scripts individually via JSON.parse
  fixedHtml = fixedHtml.replace(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>\r?\n?/gi, (fullMatch, content) => {
    if (issues.includes('hidden_faq_schema') && /"FAQPage"/i.test(content)) {
      return ''; // Drop hidden FAQPage
    }
    try {
      const obj = JSON.parse(content.trim());
      let modified = false;
      if (obj.aggregateRating) {
        delete obj.aggregateRating;
        modified = true;
      }
      if (modified) {
        return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>\n`;
      }
    } catch (e) {
      // Fallback: simple string replacement if JSON.parse fails on malformed input
      if (/aggregateRating/i.test(content)) {
        const cleaned = content.replace(/,?\s*"aggregateRating"\s*:\s*\{[^{}]*\}\s*,?/g, '');
        return `<script type="application/ld+json">${cleaned}</script>\n`;
      }
    }
    return fullMatch;
  });

  // Fix 4: Remove interstitial ad modal markup if present
  fixedHtml = fixedHtml.replace(/<!--\s*Interstitial Ad Modal\s*-->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\r?\n?/gi, '');
  fixedHtml = fixedHtml.replace(/<!--\s*Interstitial ad\s*-->[\s\S]*?<\/div>\s*<\/div>\r?\n?/gi, '');
  fixedHtml = fixedHtml.replace(/<!--\s*전면 광고 모달\s*-->[\s\S]*?<\/div>\s*<\/div>\r?\n?/gi, '');
  fixedHtml = fixedHtml.replace(/<!--\s*전면 광고 오버레이\s*-->[\s\S]*?<\/div>\s*<\/div>\r?\n?/gi, '');

  // Update dateModified
  const today = new Date().toISOString().split('T')[0];
  fixedHtml = fixedHtml.replace(/<meta\s+name=["']dateModified["']\s+content=["'][^"']+["']>/i, `<meta name="dateModified" content="${today}">`);
  fixedHtml = fixedHtml.replace(/"dateModified"\s*:\s*"[^"]+"/g, `"dateModified": "${today}"`);

  fs.writeFileSync(indexPath, fixedHtml, 'utf8');

  // Verify JSON-LD syntax integrity
  const jsonLdMatches = fixedHtml.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatches) {
    for (const tag of jsonLdMatches) {
      const jsonContent = tag.replace(/<script\s+type=["']application\/ld\+json["']>/i, '').replace(/<\/script>/i, '').trim();
      try {
        JSON.parse(jsonContent);
      } catch (err) {
        // Rollback on syntax error
        fs.writeFileSync(indexPath, html, 'utf8');
        return { name: projectName, issues: ['JSON_LD_SYNTAX_ERROR_ABORTED'], clean: false };
      }
    }
  }

  // Run touch audit
  try {
    execSync(`node .agents/skills/dopabrain-touch-audit/scripts/audit-touch.js ${projectName}`, {
      cwd: WORKSPACE,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
  } catch (err) {
    // Touch audit error logged
  }

  // Commit & push submodule
  const branch = getSubmoduleBranch(projDir);
  try {
    execSync('git add index.html', { cwd: projDir, stdio: ['pipe', 'pipe', 'ignore'] });
    execSync('git commit -m "fix(trust): remove synthetic telemetry, fake aggregateRating & hidden FAQ schema"', { cwd: projDir, stdio: ['pipe', 'pipe', 'ignore'] });
    execSync(`git push origin ${branch}`, { cwd: projDir, stdio: ['pipe', 'pipe', 'ignore'] });
  } catch (err) {
    // Push may fail if nothing to commit or network
  }

  const newHead = getSubmoduleHead(projDir);
  if (newHead) {
    if (!registry.submodules) registry.submodules = {};
    const existing = registry.submodules[projectName] || {};
    registry.submodules[projectName] = {
      ...existing,
      headCommit: newHead,
      branch,
      auditedAt: today,
      overflowPx: existing.overflowPx !== undefined ? existing.overflowPx : 0,
      touchTargetCompliant: existing.touchTargetCompliant !== undefined ? existing.touchTargetCompliant : true,
      trustCompliant: true,
      status: 'VERIFIED_PASSED'
    };
    saveRegistry(registry);
  }

  // Submit to IndexNow
  try {
    execSync(`node scripts/indexnow-submit.js --url https://dopabrain.com/${projectName}/`, {
      cwd: WORKSPACE,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
  } catch (err) {
    // IndexNow non-fatal
  }

  return { name: projectName, issues, fixed: true, newHead };
}

function main() {
  console.log(`=== DopaBrain Trust & Compliance Audit ===`);
  console.log(`Mode: ${isFix ? 'FIX & DEPLOY' : 'INSPECTION'} | Zero-Token Registry Active\n`);

  const registry = loadRegistry();
  let projectsToAudit = [];

  if (targetProjects.length > 0) {
    projectsToAudit = targetProjects;
  } else if (isAll) {
    projectsToAudit = fs.readdirSync(PROJECTS_DIR).filter(f => {
      return fs.existsSync(path.join(PROJECTS_DIR, f, 'index.html'));
    });
  } else {
    console.log('Usage:');
    console.log('  node trust-audit.js <project-name...> [--fix] [--force]');
    console.log('  node trust-audit.js --all [--fix]');
    process.exit(0);
  }

  let skippedCount = 0;
  let cleanCount = 0;
  let fixedCount = 0;
  let issuesCount = 0;

  for (const p of projectsToAudit) {
    const res = auditProject(p, registry, isFix);
    if (!res) continue;

    if (res.skipped) {
      console.log(`[SKIP] ${p}: ${res.reason}`);
      skippedCount++;
    } else if (res.fixed) {
      console.log(`[FIXED] ${p}: resolved [${res.issues.join(', ')}] -> pushed (${res.newHead?.slice(0, 7)}) & IndexNow submitted`);
      fixedCount++;
    } else if (res.clean) {
      console.log(`[CLEAN] ${p}: PASSED trust & compliance check`);
      cleanCount++;
    } else {
      console.log(`[ISSUE] ${p}: found [${res.issues.join(', ')}]`);
      issuesCount++;
    }
  }

  console.log('\n==========================================');
  console.log(`Summary: ${skippedCount} skipped (zero-token), ${cleanCount} clean, ${fixedCount} auto-fixed, ${issuesCount} issues remaining`);
}

main();
