# DopaBrain current status

Updated: 2026-11-15 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-15 Autonomous Profitability & Funnel Pass
- `root-domain` (`3246b68`, `084c193`): Fixed async `i18n.js` race setting `html[lang]` before locale load (24/24 live `verify-root-focus.js` checks PASS), bumped `sw.js` (`v5-focus`), synced `sitemap.xml`.
- `future-self` (`1eecfd9`) & `kpop-position` (`6077bee`): Added 12-locale `.curated-resources-card` (Kyobo/Amazon dynamic `dopabrain-20`, `curated_resource_click` + `content_cta_click`), bumped `sw.js` (`future-self-v4`, `kpop-position-v7`), updated verifiers.
- `portal` (`f53819b`): Upgraded 20 top-PV pages (9 tools incl. `grounding-exercise.html` + 11 uncovered EN/ZH blogs) with `.revenue-sticky-cta`, `cross-promo.js`, SG `/portal/js/ad-loader.js` guard, and clean query-free Palworld canonicals (`palworld-base-planner`, `palworld-field-guide`, `palworld-server-troubleshooter`).
- Session 1 (`0276a3a`): Fixed `color-blindness` canonical + curated reading (`v3`), `iq-test` curated reading (`v6`), 12-locale `cross-promo.js` sticky sprint + 16 portal sticky CTAs, sitemaps (`1557` URLs), IndexNow (`200 OK`).

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

## Previous release: Hub Indexing, Sticky CTAs & App Monetization (`2026-11-14`)

- **Wave 1-4 Core App & Portal Hubs**: EN SEO, `window.i18n`, `stress-type`/`soul-age`/`dream-fortune` UX, Cloudflare WAF/TLS `1.2`, `/portal/` 419개 허브 링크(`TRUE_INDEXABLE_ORPHAN=0`), 7개 오가닉 가이드 `.revenue-sticky-cta`, `white-noise`/`stress-type` 도서 큐레이션.
- Protected assets (`attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`), 36 suspended apps, and user-only actions (AdSense PIN, GSC UI, SNS posts) untouched.
