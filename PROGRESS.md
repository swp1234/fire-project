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

## Latest release: harness completion & high-dwell recirculation (2026-09-18)

- **Harness & Contract Harmonization**:
  - Full 433-step `npm run harness` achieved 100% PASS (Summary: 9 passed in analytics, 6 passed in runtime).
- **Stress Check (Dwell Time #1, 175s) Funnel Optimization**:
  - Related Cards parameter injection (`lang=${currentLang}&source=stress_result`) + clean GA4 `stress_related_click`.
  - Bidirectional bridge links to Sensory Reset (`/hsp-test/reset.html`) & Doomscrolling Guide in `plan.html` across all 12 locales.
- **Future Self (Dwell Time #2, 178s) Recirculation Engine**:
  - Built `next-journey-section` in `screen-result` targeting active high-yield apps (`brain-type`, `stress-check`, `mental-age`).
  - Added multi-locale support across all 12 locales and dynamic query synchronization (`updateNextAppLinks`).
  - 100% verified via `verify-future-self-funnel.js --mutations` (15/15) and `verify-en-future-self-guide.js --mutations` (13/13).
- **Tier 1 High-RPM Organic Recovery**:
  - Lifted `noindex` on high-dwell Cortisol Guides (`en/cortisol-lowering-techniques-guide.html`, `ko/cortisol-lowering-techniques-guide.html`), updated `dateModified: 2026-09-18`, and registered in `portal/blog/sitemap.xml`.
  - Upgraded Quick Rails on Cortisol & MBTI guides to point directly to high-dwell core tools.
  - Added `/nervous-system-quiz/` 301 canonical redirect stub to `/stress-response/` preventing 404 leakage.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
