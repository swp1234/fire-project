# DopaBrain current status

Updated: 2026-11-15 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-15 Trust-Audit 119/119, Harness & Live Signal Review
- **Trust Audit & Submodules (`119/119 clean`)**: Resolved final 5 findings across `color-memory`, `flappy-bird`, `maze-runner`, `sky-runner` (visible 5-item FAQ), `inner-child-test`; refined `trust-audit.js` + updated `audit-registry.json` (`114 skipped, 5 clean, 0 issues`); fixed `quality-gate.sh` MSYS Python JSON check via `node`.
- **Harness & Analytics (`10/10 PASS`)**: Added `future-self-monetization-funnel` (`test_start`, `test_complete`, `curated_resource_click`, `content_cta_click`, `{ force: true }`) to `analytics-event-check.js`; verified 4 legacy `VERIFY_EXEMPTIONS`. Earlier today: `146`-step harness (`7/7` self-test), `14`-doc `verify-doc-budget.js`, `session:brief`, repo cleanup (`bc9ca9e`).
- **Live GSC/GA4/AdSense & Prior Wave (`cce1392`)**: AdSense keepalive OK (`policyIssues: 0`), GSC 0 quick wins (`28d`/`90d` sparse), GA4 Organic Search shows `animal-personality` multi-locale cluster (`EN/ES/PT` + app `12` sess) untouched outside `[WAIT]` (`stress-check`, `hsp-test`, `future-self`, `portal`, `kpop-position`, `color-blindness`, `iq-test`; earliest review `2026-11-22`).

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
