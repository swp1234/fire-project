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
  - Interlinked #1 killer `/stress-check/` (175s) across HSP Test, Brain Type & Future Self with language/source query sync.
- **Tier 1 High-RPM Organic Recovery & GSC Alignment (Waves 1~13)**:
  - Registered missing killer apps (`future-self` 178s, `stress-response`, `burnout-test`) in root sitemap.
  - Lifted `noindex` on 24 Tier 1 guides (Cognitive Distortions, Boundaries, Burnout Self-Check, Cortisol, Panic, Burnout Prev, CBT, Social Anxiety, Decision Fatigue, Anxiety Types EN/KO).
  - Upgraded Quick Rails to point directly to top killer tools (`overthinker-test`, `brain-type`, `stress-check`, `burnout-test`).
- **Verification**: Full test suite PASS (Analytics 9/9, Runtime 6/6, Indexing Inventory 99 clean, 0 errors).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
