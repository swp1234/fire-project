# DopaBrain current status

Updated: 2026-09-18 KST. Release history is in `memory/data-check-log.md`; the repeatable loop is in the `dopabrain-growth-ops` skill.

## Target and status

- Target: `$1.40` per completed seven days (`$0.20/day`).
- **AdSense Serving Restriction Lifted (2026-09-13)**:
  - Policy issues API returned 0 violations (`{}`). The severe `adsense-traffic-throttled` alert has completely disappeared from API alerts.
  - Total earnings (2026-09-13 to 2026-09-18): **$0.34**, 1,310 page views, 292 impressions, 7 clicks, Page RPM $0.26.
  - High-value Tier 1 contribution: United States ($0.08, RPM $2.65), Canada ($0.07, RPM $5.15).
  - Production `dopabrain.com` generated 100% of the revenue.
  - Address PIN verification remains an account-level payment threshold notice, not an ad delivery restriction.

## Current operating rules

- Keep 36 legacy apps in the invalid-traffic suspension contract: no loader, manual unit, request push, H5 game-ad loader, rewarded exchange, or ad-completion unlock.
- Exclude Singapore desktop Direct scans (average duration 4.5s) and China Direct bursts from growth and product performance decisions.
- Focus organic traffic growth on high-engagement core products (Stress Check: 95~175s dwell time, HSP Test: 63s dwell time, Cortisol/MBTI guides: 100~200s dwell time).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Latest release: high-dwell recirculation & Tier 1 guides (2026-09-18)

- **Recirculation Funnels (`stress-check`, `future-self`, `hsp-test`, `brain-type`)**:
  - Interlinked #1 killer `/stress-check/` (175s) across HSP Test & Brain Type related grids in 12 locales.
  - Replaced retired `hail-mary-mode` with `stress-check` and added bidirectional language/source query sync.
  - Built `next-journey-section` in Future Self (178s) routing to high-yield apps.
- **Tier 1 High-RPM Organic Recovery**:
  - Lifted `noindex` on 6 killer guides (Cortisol, Dopamine Detox, Emotional Exhaustion EN/KO).
  - Synchronized `dateModified: 2026-09-18` and registered all 6 URLs in `portal/blog/sitemap.xml`.
  - Upgraded Quick Rails to point directly to high-dwell core tools (`dopamine-type`, `stress-check`, `burnout-test`).
- **Verification**: Full 433-step `npm run harness` 100% PASS (Analytics 9/9, Runtime 6/6, 0 errors).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
