# DopaBrain current status

Updated: 2026-09-20 KST. Release history is in `memory/data-check-log.md`; the repeatable loop is in the `dopabrain-growth-ops` skill.

## Target and status

- Target: `$1.40` per completed seven days (`$0.20/day`).
- **AdSense Serving Restriction Lifted (2026-09-13)**:
  - Policy issues API returned 0 violations (`{}`). The severe `adsense-traffic-throttled` alert has completely disappeared.
  - Total earnings (2026-09-13 to 2026-09-19): **$0.47**, yesterday: **$0.11**, today: **$0.02**.
  - High-value Tier 1 contribution: United States ($0.08, RPM $2.65), Canada ($0.07, RPM $5.15).
  - Production `dopabrain.com` generated 100% of the revenue.
  - Address PIN verification remains an account-level payment threshold notice, not an ad delivery restriction.

## Current operating rules

- Keep 36 legacy apps in the invalid-traffic suspension contract: no loader, manual unit, request push, H5 game-ad loader, rewarded exchange, or ad-completion unlock.
- Exclude Singapore desktop Direct scans (average duration 4.5s) and China Direct bursts from growth and product performance decisions.
- Focus organic traffic growth on high-engagement core products (Stress Check: 95~175s dwell time, Future Self: 178s dwell time, HSP Test: 63s dwell time).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Latest release: Tier 3 Multilingual Recovery & Killer Funnel Loop (2026-09-20)

- **Tier 3 Multilingual Guides Restored (20 URLs in JA, DE, ES, FR)**:
  - Restored 5 top-intent guide topics (Burnout, Attachment Quiz, Decision Fatigue, Boundaries, Anxiety Types) across 4 high-value languages.
  - Linked to core killer apps via 4-card localized Quick Rails with strict DOM and telemetry contracts.
  - Sitemaps synchronized: 435 clean unique URLs with 0 errors, 0 blockers.
- **Killer App Recirculation Funnel Deepened**:
  - Connected #1 killer Stress Check (175s dwell time) directly to #2 killer Future Self (178s dwell time) on result screens across all 12 locales.
  - Added localized `related.futureSelf` translations across all 12 languages and auto-forwarded `lang` & `source` query params.
- **Verification**: Full test suite PASS (Indexing Inventory 435/0, AdSense Contract 11/11, Restricted Ads 36/36, Culture Signal Review 13/13, Doc Budget 10/10).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
