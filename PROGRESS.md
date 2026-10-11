# DopaBrain current status

Updated: 2026-10-11 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-11)**: Policy violations 0 (`{}`). 10-07 **$0.02**, 10-08 **$0.06**, 10-09 **$0.02**, 10-10 **$0.02**. 7일 누적 **$0.55**, 30일 누적 **$1.69**.
- 핵심 대책: 1,678개 블로그 미렌더링 FAQ 스키마 제거로 GSC 크롤링 페널티 해소 및 핵심 진입면 인덱싱 재개 유도.

## Current operating rules

- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s, Mental Age).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-11) — 상세 설계: `docs/STRATEGY.md`

- **P0 GSC 크롤링 페널티 & 정규 URL 불일치 전면 해소**:
  - 1,678개 블로그 미일치 템플릿 FAQPage 스키마 전수 제거 및 JSON-LD 무결성 검증.
  - 12개 진입면 앱 hreflang-canonical 언어 쿼리 uncollapse 전면 적용 (`?lang=en` 등).
  - 36개 레거시 앱 무효 트래픽 광고 격리 계약 준수 유지.
  - 서브모듈 선푸시 후 루트 포인터 갱신 및 IndexNow 200 전송 완료.
- **P1 핵심 진입면 색인 정상화 & 바이럴 트렌드 지속 배포**:
  - '뇌 배터리 12% / 감각 과부하 리셋' 인터랙티브 가이드 8개 언어 전면 배포 및 사이트맵 반영.

## Latest release: High-Traffic Core Apps Hreflang & SEO Uncollapse (2026-10-11)

- Submodules: stress-check (`3aff627`), trauma-response (`d8e5336`), anxiety-type (`2373550`), color-personality (`2e81ee6`), color-memory (`c82607b`), toxic-trait (`02e4554`), toxic-trait-test (`31bbc8e`), future-self (`c87189d`), eq-test (`84a1352`), portal (`94b6dd2`).
- Crawler & Indexing:
  - `stress-check`, `trauma-response`, `anxiety-type`, `color-personality`, `color-memory`, `toxic-trait`, `toxic-trait-test` 12개국어 hreflang 전면 uncollapse 및 IndexNow 전송.
  - `robots` 태그에 `index, follow, max-image-preview:large` 명시하여 글로벌 검색 로봇 탐색 허용.
  - 뇌 배터리 12% 감각 과부하 리셋 가이드 8개 언어(ko, en, es, pt, ja, de, zh, fr) 전면 배포 및 sitemap 갱신.
- Test Harness:
  - 아티클 3,898건, 사이트맵 1,508개 URL 전수 검사 0 issues 통과 (`verify:indexing-inventory`).
  - `verify:stress-core` 16/16, `verify:trauma-response`, `verify:anxiety-type`, `verify:color-personality`, `verify:color-memory-suspension`, `verify:toxic-trait` 100% mutation PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
