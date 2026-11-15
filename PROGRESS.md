# DopaBrain current status

Updated: 2026-11-15 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-15 Portfolio Wave 1-5L Profitability, Funnel & Bugfix Sweep
- **34 Submodules Pushed & Audited (`119/119 clean`, `0` funnel issues, `34/34` touch `0px`)**: Added `1080x1920` story cards, `?tag=dopabrain-20` curated books, `?lang=` `hreflang`/link preservation, open SSR FAQ `<details open>`, toasted validation, and sanitized GA4 funnels (`test_start`, `test_complete`, `save_image`, `share`, `curated_resource_click`) across active tests/tools (`animal-personality`..`valentine`, plus funnel cleanup on `soul-age`, `villain-origin`) while keeping `[WAIT]` & 36 suspended legacy apps untouched.
- **Live Bugs & Contract Fixes**: Fixed missing modals (`dday-counter`, `shopping-calc`), missing `window.i18n` (`unit-converter`, `tax-refund-preview`, `sebatdon-calc`, `valentine`), blanked EN buttons/`#premiumAd` crash (`tax-refund-preview`), pre-existing `e.currentTarget` async null bug (`valentine`), `.generate-btn` `44px` height (`color-palette`), raw telemetry leaks (`sebatdon-calc`, `valentine`), `detox-timer` share contract, and `dream-fortune` sitemap `dateModified`.
- **Verification & Live Signals**: `health-guard` (`6/6`), `analytics-event-check` (`10/10`), `indexing-inventory --strict` (`0` issues across `1,557` URLs), `verify:animal-personality`, `verify:es-dopamine-break`, `harness:release` (`portal`), and Playwright `390x844` checks pass; earliest maturation review `2026-11-21` / `2026-11-22`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-15)**: Policy violations 0 (`{}`), user-owned PIN hold already acknowledged/in progress (do NOT re-warn or ask again). 7d **$0.22**, 30d **$1.62**, MTD **$0.53** (`11,418` PV, `$0.14` RPM). Tier-1 human RPM: US `$1.82`, FR `$2.62`, DE `$3.70`, BE `$2.82`; SG `$0.00` (`3,963` PV scan noise).
- GA4 (28d): `7,407` page_view (`1,151` ad_impression, `115` content_sticky_cta_view, `89` content_cta_click), `268` Organic Search (`1.57` PV/session).
- 고체류 핵심 진입면: Stress Check, HSP Test, Future Self, 2048 Coach, IQ Test, Color Blindness, White Noise, K-pop Position.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise, K-pop Position).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-12) — 상세 설계: `docs/STRATEGY.md`

- **P0-P3 SEO/GEO & Funnel Foundation (완료)**: IndexNow 송출 (`200 OK`), `llms*.txt` (`658524e`), 3대 킬러앱(Stress Check/HSP/Future Self) 1080x1920 스토리 카드·도서 큐레이션, 소셜 훅(`docs/MARKETING-VIRAL-HOOKS.md`), 4,034파일 퍼널 무결점 & 119개 레지스트리 동기화.

- **Hub Indexing & Monetization (`2026-11-14`)**: EN SEO, `window.i18n`, `stress-type`/`soul-age`/`dream-fortune` UX, Cloudflare WAF/TLS `1.2`, `/portal/` 419개 허브 링크(`TRUE_INDEXABLE_ORPHAN=0`), 7개 오가닉 `.revenue-sticky-cta`, protected `attachment-style/clarity.*` & 36 suspended apps untouched.
