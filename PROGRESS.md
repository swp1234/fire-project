# DopaBrain current status

Updated: 2026-11-14 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-13)**: Policy violations 0 (`{}`), active PIN/address hold (`SEVERE`: `pin-deadline-approaching`, user-owned). 7d **$0.28**, 30d **$1.62**, MTD **$0.49**.
  - 30d breakdown surfaced `127.0.0.1` (`4,187` / `11,091` = 37.8% PV, `$0.00`), mixed `<html lang="ko">` vs English/hreflang conflict keeping `/stress-check/`, `/hsp-test/`, `/future-self/`, `/iq-test/` `"Crawled - currently not indexed"`, and `/stress-check/` + `/future-self/` funnel leaks into suspended `/brain-type/`.
- GA4 (28d): Direct `6,888` (SG desktop `5,142`), Organic Search `268` (`1.57` PV/session; `google / organic` 3 sessions).
- 고체류 핵심 진입면: Stress Check, HSP Test, Future Self, 2048 Coach, IQ Test, Color Blindness, White Noise.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-12) — 상세 설계: `docs/STRATEGY.md`

- **P0-P3 SEO/GEO & Funnel Foundation (완료)**: IndexNow 송출 (`200 OK`), `llms*.txt` (`658524e`), 3대 킬러앱(Stress Check/HSP/Future Self) 1080x1920 스토리 카드·도서 큐레이션, 소셜 훅(`docs/MARKETING-VIRAL-HOOKS.md`), 4,034파일 퍼널 무결점 & 119개 레지스트리 동기화.

## Latest release: Hub Indexing, Sticky CTAs & App Monetization (`2026-11-14`)

- **Wave 1-4 Core App i18n/SEO & UX**: EN SEO(`en_US`, `hreflang`, `?lang=` sync), `window.i18n` 노출, `stress-type` hitbox, `soul-age`/`dream-fortune` UX, `root-domain` sitemap dedupe, `#app-loader` LCP & Cloudflare proxy/WAF/TLS `1.2` 정렬.
- **Blog Hub Orphan Closure & `og:locale` (`portal`)**: `/portal/` 중복 `og:locale` 수정(`ko_KR` + `en_US`), 12개 언어 허브 정적 링크 419개(`>=44px`) 보강으로 indexable 고아 0 달성(`TRUE_INDEXABLE_ORPHAN=0`), `portal/blog/sitemap.xml` 동기화.
- **Organic Winners & App Monetization (`portal`, `white-noise`, `stress-type`)**: 7개 상위 유입 가이드에 `.revenue-sticky-cta`(`content_sticky_cta_view`), FR 4문항 `FAQPage`, Palworld `#sizing-matrix` 추가; `white-noise`/`stress-type` 12언어 도서 큐레이션(`Kyobo`/Amazon `dopabrain-20`, `curated_resource_click`) 및 SW `v2` 반영. Health-guard·105 screener·`verify:docs`·`390x844` Playwright PASS.
- Protected assets (`attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`), 36 suspended apps, and user-only actions (AdSense PIN, GSC UI, SNS posts) untouched.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
