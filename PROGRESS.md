# DopaBrain current status

Updated: 2026-10-07 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-07)**: Policy violations 0 (`{}`). 10-06 **$0.11**, 10-07 누적 **$0.02**. 7일 누적 **$0.51**, 30일 누적 **$1.67**. Tier 1 RPM 안정 유지, Address PIN 기준치 도달 안내 상태 유지(게재 차단 없음).
- Production `dopabrain.com` generated 100% of impressions and revenue.

## Current operating rules

- Keep 36 legacy apps in invalid-traffic suspension contract.
- Exclude Singapore desktop Direct scans (4.5s) and China bursts from decisions.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-07) — 상세 설계: `docs/STRATEGY.md`

- **P0 포털·블로그 미노출 컨텐츠 전수 조사 & 최신순 목차 네비게이션 완료**:
  - `portal/blog/index.html`: 40개 하드코딩 배열을 1,696개 전수 색인 카탈로그(`blog-catalog-data.js`)와 연동. 최신순(latest) 정렬 시 2026-03 등 최신 글 전수 노출 보장.
  - 데스크톱 좌측 TOC 사이드바 (실시간 최신순 Top 8, 카테고리별 목차, 12개 언어 허브, 인기 테스트 바로가기) 및 모바일 하단 목차 섹션/플로팅 FAB 추가.
  - `portal/blog/ko/index.html`: 상단 목차 배너(TOC) 추가로 최신 글 Top 5 및 카테고리 빠른 탐색 링크 제공.
  - `portal/index.html`: 하단 전체 컨텐츠 디렉토리/목차 보강 (100+ 무료 앱/도구 전체 목록, 최신 발행 심리 가이드 12선, MBTI 및 유틸리티 허브 직관적 노출).
- **P1 품질 & 광고 규약 검증 완료**:
  - Auto Ads 단일 로더 규약 100% 준수 (`verify:portal-auto-ads-only`, `clean-indexable-blog-ads`).
  - 모바일 가로 오버플로 0px 및 터치 타깃 44px 이상 유지.

## Latest release: Full Directory & Latest-First Catalog (2026-10-07)

- Submodules: portal (수정 완료), root-domain (정규 유지).
- Portal (`projects/portal`):
  - `blog-catalog-data.js`: 전수 1,696개 아티클 최신순 정렬 카탈로그 생성.
  - `blog/index.html`: 반응형 2열 목차 레이아웃, 언어 필터(KO/EN/JA/ES/DE/전체), 최신순 정렬.
  - `blog/ko/index.html`: 상단 목차 & 빠른 탐색 컴포넌트 추가.
  - `index.html`: 100+ 앱 & 최신 블로그 전수 목차 디렉토리 개편.
- 전체 하네스 워크플로 및 검증 게이트 100% 통과.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
