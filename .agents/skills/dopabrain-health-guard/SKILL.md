---
name: dopabrain-health-guard
description: >-
  Runs the complete DopaBrain compliance and health battery: AdSense keepalive, Auto Ads contract, indexing inventory, secret detection, documentation budgets, and root domain Playwright tests. Use at the start or end of development sessions.
---

# DopaBrain Health Guard Skill

This skill runs the primary compliance and operational sanity suite to verify that all systems, revenue contracts, SEO boundaries, and security rules are intact.

## Checks Performed
1. **AdSense Keepalive**: Verifies OAuth token validity, publisher status (`ca-pub-3600813755953882`), and active policy issue count (`0`).
2. **AdSense Contract**: Enforces <=1 Auto Ads loader script, 0 manual ad units, and 0 fake impression/reward gates across the entire codebase.
3. **Indexing Inventory**: Verifies 1,520+ URLs across focused sitemaps with 0 blocker issues and 0 high-risk issues.
4. **Tracked Secrets**: Scans the workspace to prevent accidental leakage of OAuth tokens, credentials, or client secrets.
5. **Documentation Budgets**: Enforces strict byte and line limits on the 10 contract documentation files (`PROGRESS.md`, `CLAUDE.md`, etc.).
6. **Root Domain Focus**: Executes Playwright browser tests across all 12 supported languages (`ko`, `en`, `zh`, `hi`, `ru`, `ja`, `es`, `pt`, `id`, `tr`, `de`, `fr`) on both mobile and desktop viewports.

## How to Execute

```bash
node .agents/skills/dopabrain-health-guard/scripts/health-guard.js
```

Or via package.json scripts individually:
```bash
npm run adsense:keepalive
npm run verify:adsense-contract
npm run verify:indexing-inventory
npm run verify:tracked-secrets
npm run verify:docs
npm run verify:root
```
