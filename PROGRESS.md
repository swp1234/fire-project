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

## Latest release: Tier 2 organic recovery & killer recirculation (2026-09-20)

- **Tier 1 & Tier 2 Guides Restorations Complete (Waves 1~178 Complete)**:
  - Completed Tier 2 restorations across 58 high-intent psychology, cognitive, and self-reflection guides (Waves 143~178).
  - Bound all guides to high-dwell killer apps (`stress-check` 175s, `future-self` 178s, `brain-type` 122s, `hsp-test` 63s) via 4-card localized Quick Rails.
  - Preserved 36 legacy games in strict invalid-traffic containment (`noindex,follow`, 0 ad code).
  - Sitemaps synchronized: 415 clean unique URLs with 0 errors, 0 blockers.
- **Verification**: Full test suite PASS (Indexing Inventory 415/0, AdSense Contract 11/11, Restricted Ads 36/36, Culture Review 13/13, Doc Budget 10/10).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
