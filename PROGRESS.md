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

## Latest release: harness completion & killer product optimization (2026-09-18)

- **Harness & Contract Harmonization**:
  - Resolved suspension vs. SEO guide verification conflicts across 9 multilingual verifiers (`verify-blood-type-culture-reset`, `verify-brain-type-trust`, `verify-en-past-life-path`, `verify-es-typing-speed`, `verify-fr-dev-quiz-path`, `verify-ja-reaction-time`, `verify-zh-block-puzzle-path`, `verify-zh-habit-tracker`, `verify-zh-mbti-city-path`) via adaptive `isSuspended ? 0 : 1` loader assertions.
  - Automatically repaired 5 stale (>90d) inventory files for 2026-09-18.
  - Completed **full 433-step `npm run harness` with 100% PASS** (exit code 0).
- **Stress Check (Dwell Time #1) Funnel Optimization**:
  - Dynamic language and source parameter injection (`lang=${currentLang}&source=stress_result`) into Related Cards (`/hsp-test/`, `/stress-response/`).
  - Added clean GA4 telemetry `stress_related_click` for related test card interactions.
  - Embedded bidirectional bridge links to Sensory Reset (`/hsp-test/reset.html`) and Doomscrolling Guide (`/portal/blog/${lang}/doom-scrolling-mental-health-effects.html`) in `plan.html` across all 12 supported locales.
- **Culture Signal & Search Intent Enhancement**:
  - Expanded FAQPage schema and visible FAQ entries in `odyssey-spider-man-identity-reset-2026.html` and `scripts/specs/trend-odyssey-spiderman-ko.json` with high-volume entity queries.
  - Verified with zero regressions via `verify-culture-choice.js --mutations` (12/12) and `verify-blog-generator-interaction.js`.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
