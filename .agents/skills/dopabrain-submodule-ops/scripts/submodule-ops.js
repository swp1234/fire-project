#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = path.resolve(__dirname, '..', '..', '..', '..');
const PROJECTS_DIR = path.join(WORKSPACE, 'projects');

function run(cmd, cwd = WORKSPACE) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    throw new Error(`Command failed [${cmd}] in [${cwd}]: ${err.stderr || err.message}`);
  }
}

function getSubmodules() {
  const gitmodulesPath = path.join(WORKSPACE, '.gitmodules');
  if (!fs.existsSync(gitmodulesPath)) return [];
  const content = fs.readFileSync(gitmodulesPath, 'utf8');
  const matches = [...content.matchAll(/path\s*=\s*projects\/([^\r\n]+)/g)];
  return matches.map(m => m[1].trim());
}

function getTrackingBranch(subDir) {
  try {
    const branches = run('git branch -a', subDir);
    if (/remotes\/origin\/main\b/.test(branches) || /\bmain\b/.test(branches)) {
      return 'main';
    }
    return 'master';
  } catch (e) {
    return 'master';
  }
}

function commitAndPush(submoduleName, message) {
  const subDir = path.join(PROJECTS_DIR, submoduleName);
  if (!fs.existsSync(subDir)) {
    console.error(`Submodule not found: ${submoduleName}`);
    return false;
  }

  const branch = getTrackingBranch(subDir);
  console.log(`\n=== Processing [${submoduleName}] (Branch: ${branch}) ===`);

  const status = run('git status --porcelain', subDir);
  if (!status) {
    console.log(`[${submoduleName}] Working tree clean. Ensuring on branch ${branch}...`);
    try {
      run(`git checkout -B ${branch} origin/${branch}`, subDir);
    } catch {
      run(`git checkout -B ${branch}`, subDir);
    }
    return true;
  }

  console.log(`[${submoduleName}] Changes detected:\n${status}`);
  try {
    // Checkout tracking branch without losing uncommitted changes
    run(`git checkout -B ${branch}`, subDir);
    run('git add -A', subDir);
    // Write commit message to temporary file to avoid PowerShell escaping bugs
    const tmpMsgFile = path.join(WORKSPACE, '.git', 'SUBMODULE_COMMIT_MSG');
    fs.writeFileSync(tmpMsgFile, message, 'utf8');
    run(`git commit -F "${tmpMsgFile}"`, subDir);
    if (fs.existsSync(tmpMsgFile)) fs.unlinkSync(tmpMsgFile);
    console.log(`[${submoduleName}] Committed with message: "${message}"`);

    // Push to origin
    run(`git push origin ${branch}`, subDir);
    console.log(`[${submoduleName}] Pushed to origin/${branch}`);
    return true;
  } catch (err) {
    console.error(`[${submoduleName}] Error during commit/push:`, err.message);
    return false;
  }
}

function syncRoot(submoduleName) {
  console.log(`[Root] Staging pointer for projects/${submoduleName}...`);
  run(`git add projects/${submoduleName}`);
}

function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  if (action === 'status') {
    const target = args[1];
    const submodules = target ? [target] : getSubmodules();
    console.log(`Checking ${submodules.length} submodules...`);
    let dirtyCount = 0;
    for (const sub of submodules) {
      const subDir = path.join(PROJECTS_DIR, sub);
      if (!fs.existsSync(subDir)) continue;
      try {
        const status = run('git status --porcelain', subDir);
        const head = run('git rev-parse --short HEAD', subDir);
        const branch = run('git rev-parse --abbrev-ref HEAD', subDir);
        if (status) {
          dirtyCount++;
          console.log(`DIRTY: [${sub}] (${branch} @ ${head})`);
        }
      } catch (e) {
        console.log(`ERROR: [${sub}]: ${e.message}`);
      }
    }
    console.log(`Status check done. ${dirtyCount} dirty submodules.`);
    return;
  }

  if (action === 'commit-push') {
    const target = args[1];
    const message = args.slice(2).join(' ') || 'chore: update submodule';
    if (!target) {
      console.error('Usage: node submodule-ops.js commit-push <submodule-name> <message>');
      process.exit(1);
    }
    const success = commitAndPush(target, message);
    if (success) {
      syncRoot(target);
    }
    return;
  }

  console.log('Usage:');
  console.log('  node submodule-ops.js status [<submodule-name>]');
  console.log('  node submodule-ops.js commit-push <submodule-name> "<commit message>"');
}

if (require.main === module) {
  main();
}

module.exports = { getSubmodules, getTrackingBranch, commitAndPush, syncRoot };
