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

- **P0 자율 AI 검색(GEO) 배포 & IndexNow 즉각 송출 (완료)**: IndexNow API(Bing/ChatGPT Search) 즉시 색인 송출 200 OK, `llms.txt`/`llms-full.txt` AI 전용 표준 최적화 (`658524e`), 3대 킬러앱 공개 깃허브 학술 쇼케이스 리드미 완비.
- **P1 오가닉 바이럴 카드 & 고수익 파트너십 확장 (완료)**: `future-self`, `stress-check`, `hsp-test` 3대 킬러앱 1080x1920 인스타 스토리 카드 캔버스 엔진 및 도서 큐레이션 슬롯 구축.
- **P2 글로벌 소셜 런칭 카피 & 배포 템플릿 자산화 (완료)**: Reddit/Threads/X 맞춤형 바이럴 훅 및 가이드라인 구축 (`docs/MARKETING-VIRAL-HOOKS.md`).
- **P3 헬스 가드 & 퍼널 브릿지 ALL PASS (완료)**: 4,034개 파일 퍼널 무결점, 119개 프로젝트 감사 레지스트리 동기화.

## Latest release: Core App i18n/SEO, Blog/Hub UX & Live Sync (`2026-11-14`)

- **Wave 1-2 (`soul-age`, `color-blindness`, `white-noise`, `portal`, `root-domain`)**: Aligned EN SEO (`<html lang="en">`, `en_US`, `hreflang` swap, `?lang=` head sync), fixed `soul-age` quiz & 8 top blog touch/overflow issues, added `blockExternalAds(page)` to `test-batch64..71`, and updated `llms*.txt`.
- **Wave 3-4 Global `i18n`, UX & Metadata Alignment**: Exposed `window.i18n = i18n` across `stress-check`, `stress-type`, `white-noise`, `puzzle-2048`, `kpop-position`, and `future-self`; fixed `stress-type` `#upper-back-btn`/Chest SVG hitbox overlap & EN metadata; localized `dream-fortune` fallback/zodiac labels & `#main-content`; aligned `<html lang="en">` / `og:locale="en_US"` / `hreflang` across `puzzle-2048`, `emotion-iceberg`, `burnout-test`, and `brain-type`.
- **Portal Blog Hubs & Guides (`portal`)**: Fixed `>=44px` touch targets (`<input>`/nav/filter/breadcrumb/TOC) across `portal/blog/`, `en/`, `zh/`, `ko/` hubs and top guides (`0px` overflow, `0` issues).
- **Live Verification & Indexing**: Full `npm run harness` + `audit-funnel` + `indexing-inventory` (`0` issues) + `adsense-contract` PASS; 12+4 submodules pushed, 20 URLs IndexNow `200`, 3 GSC sitemaps (`0` errors).
- Protected assets (`attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`), 36 suspended apps, and user-only actions (AdSense PIN, GSC UI, SNS posts) untouched.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
