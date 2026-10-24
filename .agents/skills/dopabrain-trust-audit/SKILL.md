---
name: dopabrain-trust-audit
description: >-
  Audits and sanitizes DopaBrain projects for trust and compliance: detects and removes synthetic telemetry (page_engage), unverifiable aggregateRating, hidden FAQPage schema, and rewarded/gated ad patterns. Enforces zero-token skipping via audit-registry.json.
---

# DopaBrain Trust & Compliance Audit Skill

This skill automates audits and sanitization of trust, compliance, and search quality invariants across all DopaBrain submodules (`projects/*`).

## What it Detects & Resolves

1. **Synthetic Client Telemetry**:
   - `page_engage` event timers (`setTimeout(..., 5000)`).
   - Past mistake: triggers AdSense Invalid Traffic (IVT) alarms and bot traffic detection.
2. **Fabricated Structured Data**:
   - `aggregateRating` without a real, verifiable user rating system.
   - Past mistake: triggers Google structured data spam manual actions.
3. **Hidden `FAQPage` Schema**:
   - JSON-LD FAQ schemas without corresponding user-visible FAQ questions and answers in HTML.
4. **Ad-for-Result Interstitials & Manual Units**:
   - Simulated ad modals, countdown gates, or manual `<ins class="adsbygoogle">` slots violating the single Auto Ads contract.
5. **Zero-Token Auditing**:
   - References `memory/audit-registry.json`. Submodules whose HEAD commit matches the registry with `VERIFIED_PASSED` are skipped instantly to avoid redundant work.

## How to Execute

### 1. Audit Specific Project(s)
```bash
node .agents/skills/dopabrain-trust-audit/scripts/trust-audit.js stress-check hsp-test
```

### 2. Audit All Submodules
```bash
node .agents/skills/dopabrain-trust-audit/scripts/trust-audit.js --all
```

### 3. Automatically Fix, Audit Touch, Commit, Push & IndexNow
```bash
node .agents/skills/dopabrain-trust-audit/scripts/trust-audit.js <project-name> --fix
```
In `--fix` mode:
- Purges `page_engage` scripts and fake schemas.
- Updates `dateModified` to `2026-10-24`.
- Runs Playwright mobile touch & overflow audit (`0px` overflow, `>=44px` targets).
- Commits and pushes submodule to remote (`master` or `main`).
- Updates `memory/audit-registry.json` with the new HEAD SHA.
- Notifies IndexNow API immediately (HTTP 200).
