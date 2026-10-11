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
  - `animal-personality`, `iq-test`, `blood-type`의 hreflang-canonical 정합성 완전 정상화.
  - 36개 레거시 앱 무효 트래픽 광고 격리 계약 준수 (`social-battery` 합성 타이머 제거).
  - 서브모듈 선푸시: `portal`(`86c371d`), `animal-personality`(`e673057`), `blood-type`(`cd440a9`), `iq-test`(`5459d0d`), `social-battery`(`8151b8a`), `root-domain`(`a9c8a35`).
  - GSC sitemaps 3종 및 핵심 16개 URL IndexNow 200 전송 완료.
- **P1 핵심 진입면 색인 정상화 & 바이럴 트렌드 지속 배포**:
  - Stress Check, HSP Test 등 핵심 면 GSC 재검증 및 최신 심리/도파민 인터랙티브 콘텐츠 확장.

## Latest release: GSC Crawling Penalty Hidden FAQ Schema Purge (2026-10-11)

- Submodules: portal (`86c371d`), animal-personality (`e673057`), blood-type (`cd440a9`), iq-test (`5459d0d`), social-battery (`8151b8a`), root-domain (`a9c8a35`).
- Crawler & Indexing:
  - 1,678개 블로그 내 미렌더링 영어 FAQPage 구조화 데이터 완전 박멸로 Google 스팸 페널티 원인 해소.
  - `animal-personality`, `iq-test`, `blood-type` canonical-hreflang 불일치 해소 및 IndexNow 실배포 검증.
  - `social-battery` 합성 타이머 제거 및 36개 레거시 앱 무효 트래픽 광고 완전 격리 통과.
- Test Harness:
  - 아티클 3,892건, 사이트맵 1,502개 URL 전수 검사 0 issues 통과 (`verify:indexing-inventory`).
  - `verify:animal-personality`, `verify:portal-ad-containment`, `verify:portal-auto-ads-only` 100% mutation PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
