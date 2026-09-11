# DopaBrain current status

Updated: 2026-09-11 KST. Release history is in `memory/data-check-log.md`; the repeatable loop is in the `dopabrain-growth-ops` skill.

## Target and blocker

- Target: `$1.40` per completed seven days (`$0.20/day`).
- 2026-09-04 through 2026-09-10: `$0.04 / 1,898 page views / 51 impressions / 1 click`, or `$0.006/day`.
- AdSense still returns the severe `adsense-traffic-throttled` alert. Address PIN verification is a separate payment hold, not the cause or remedy for serving limits.

## Current rule

- Keep ad-layout experiments, traffic expansion, IndexNow and manual GSC submissions paused until the restriction clears.
- The 1,186 Direct sessions include recurring Singapore-desktop, no-referrer multi-route bursts; exclude that scan-like traffic from growth decisions.
- Keep 36 legacy apps in the invalid-traffic suspension contract: no loader, manual unit, request push, H5 game-ad loader, rewarded exchange, or ad-completion unlock.
- Preserve routes with credible Organic acquisition or valid action evidence. Exclude Singapore desktop Direct scans and legacy synthetic events from growth decisions.

## Latest release: restricted-ad containment

- Added an explicit, idempotent restricted-ad migration and verifier. Its browser check loads Habit Tracker, 2048, Block Puzzle and Typing Speed with third-party traffic isolated; page errors, AdSense/H5 requests and manual ad DOM must all be zero.
- Removed the remaining misleading 2048 ad-undo claim and the Habit Tracker self-declared ad-unlock UI.
- Current inventory: `0 critical / 0 high / 0 medium / 53 info / 66 clean`. The remaining `info` entries are Auto Ads loaders and are not a signal to expand traffic while the restriction is active.

## Validation and deployment state

- `verify:restricted-ads`, `verify:adsense-contract`, and the ad-risk self-test pass; restricted-ad verification includes a loader-return mutation and four-app browser runtime check.
- Deployment is intentionally pending: the affected independent app repositories already contain unrelated dirty work. Preserve those changes, split reviewable commits, then push child repositories and verify the actual Pages source before claiming production resolution.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
