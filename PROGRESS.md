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

- **P0 GSC '크롤링됨 - 현재 색인이 생성되지 않음' 1,307건 페널티 완전 제거**:
  - 1,678개 블로그 아티클 내 DOM 미일치 템플릿 FAQPage 스키마 전수 제거 및 JSON-LD 무결성 검증.
  - 서브모듈 선푸시: `portal`(`86c371d`), `animal-personality`(`e673057`), `root-domain`(`a9c8a35`).
  - 3개 sitemap GSC API 직접 재제출 및 핵심 12개 URL IndexNow API 200 전송 완료.
- **P1 핵심 진입면 색인 정상화 & 바이럴 트렌드 지속 배포**:
  - Stress Check, HSP Test 등 핵심 면 GSC 재검증 및 최신 심리/도파민 인터랙티브 콘텐츠 확장.

## Latest release: GSC Crawling Penalty Hidden FAQ Schema Purge (2026-10-11)

- Submodules: portal (`86c371d`), animal-personality (`e673057`), root-domain (`a9c8a35`).
- Crawler & Indexing:
  - 1,678개 블로그 내 미렌더링 영어 FAQPage 구조화 데이터 완전 박멸로 Google 스팸/품질 페널티 원인 해소.
  - portal/index.html 및 sitemap lastmod 2026-10-11 갱신, GSC API 및 IndexNow 갱신 완료.
  - 포털 메인 다국어 매거진 피드에 영재 번아웃 & ADHD 100탭 바이럴 가이드 전면 승격.
- Test Harness:
  - 아티클 3,892건, 사이트맵 1,502개 URL 전수 검사 0 issues 통과 (`verify:indexing-inventory`).
  - `verify:animal-personality`, `verify:portal-ad-containment`, `verify:portal-auto-ads-only` 100% mutation PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
