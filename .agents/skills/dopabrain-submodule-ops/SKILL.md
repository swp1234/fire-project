---
name: dopabrain-submodule-ops
description: >-
  Safely commits and pushes Git submodule changes (`projects/*`) avoiding detached HEAD bugs and PowerShell parsing errors, then stages the updated pointer in the root repository.
---

# DopaBrain Submodule Operations Skill

This skill ensures Git submodule operations in `projects/*` are executed safely and conform to the project's multi-repository architecture.

## Why This Skill Exists
- In DopaBrain, each tool under `projects/*` is typically an independent Git repository with its own remote origin (`main` or `master`).
- If an agent commits in detached HEAD or commits to root before pushing child repos, GitHub Pages fails to build or serves a 404.
- In PowerShell, running inline commits like `git commit -m "fix(ux): ..."` crashes because `(ux)` is interpreted as a PowerShell subexpression.
- This skill handles branch resolution, commit file authoring, child push, and root pointer staging safely.

## Usage

### 1. Check Submodule Status
Check all submodules for dirty working trees or detached HEADs:
```bash
node .agents/skills/dopabrain-submodule-ops/scripts/submodule-ops.js status
```
Or check a specific submodule:
```bash
node .agents/skills/dopabrain-submodule-ops/scripts/submodule-ops.js status stress-check
```

### 2. Commit and Push a Submodule Safely
Aligns to the correct tracking branch (`main` or `master`), stages child files, commits using a safe message buffer, pushes to remote origin, and stages the pointer in root:
```bash
node .agents/skills/dopabrain-submodule-ops/scripts/submodule-ops.js commit-push <submodule-name> "<conventional commit message>"

# Example:
node .agents/skills/dopabrain-submodule-ops/scripts/submodule-ops.js commit-push stress-check "fix(ux): expand reset button touch target to 44px"
```

### 3. Finalize in Root
After all submodules are pushed and staged:
```bash
git commit -m "chore(submodules): update pointer for <submodule-name>"
git push origin master
```
