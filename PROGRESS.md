# DopaBrain current status

Updated: 2026-11-16 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-16 Systemic 12-Locale i18n, Canonical & Mobile UX Hardening
- **Portfolio-Wide Fixes (41 + 31 Active/Safe Submodules Pushed)**: Following Batch 4/5 (`c403b32`), resolved all systemic i18n, canonical, and UX defects across all 39 active monetized apps & safe live suspended apps (31 submodules pushed; `[WAIT]` & `clarity.*` untouched): translated 100% of 12-locale missing/Korean-leaked/mojibake keys (`dream-fortune`, `shopping-calc`, `tax-refund-preview`, `love-frequency`, `emotional-age`, `life-in-numbers`, `ick-factor`, `lottery`, `dday-counter`, `sky-runner`, `brick-breaker`), fixed `affirmation` async race + `attachment-style`/`zigzag-runner` i18n bugs, synced `?lang=`/`html[lang]`/`window.i18n`, removed dynamic canonical mutations + added `hreflang`, scoped `sw.js`, eliminated native `alert`/`confirm` & clipboard crashes (`daily-tarot`, `bmi-calculator`, `dday-counter`, `love-frequency`, `dream-fortune`, `red-green-flag`, `unit-converter`), fixed `name-match` 11px overflow & `memory-card` 48px mobile CTA.
- **Systemic Verifier Promotion**: Upgraded `scripts/verify-i18n-runtime-contracts.js` (`14/14` mutations, `117` sub-apps / `65` active pairs / `39` 12-locale monetized apps), passing 147/147 `npm run harness`, `audit-touch` (31/31), `trust-audit` (31/31), `audit-funnel` (4034), and `health-guard`.

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
