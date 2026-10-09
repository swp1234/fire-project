# DopaBrain current status

Updated: 2026-10-09 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-09)**: Policy violations 0 (`{}`). 10-06 **$0.11** (클릭 2회), 10-07 **$0.02** (저점), 10-08 **$0.06** (반등!, 노출 64회, Brazil $0.02, US $0.03), 10-09 진행 중 ($0.01). 7일 누적 **$0.55**, 30일 누적 **$1.69**.
- 수익 변동 핵심 원인 및 대책: Ad Intents off 및 빈도 최적화 후 PV당 노출률 11~25%대 유지 상태에서 유효 클릭 증대가 핵심. 체류시간이 검증된 킬러 진입면(Animal Personality, Stress Check, Future Self)과 2026 최신 가이드를 포털 메인 및 블로그 허브 전면에 배치하여 고가치 오가닉 유입 및 클릭 활성화 도모.

## Current operating rules

- Keep 36 legacy apps in invalid-traffic suspension contract.
- Exclude Singapore desktop Direct scans (4.5s) and China bursts from decisions.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-09) — 상세 설계: `docs/STRATEGY.md`

- **P0 포털 메인 & 블로그 허브 목차 디렉토리 2026 네온 글래스모피즘 전면 개편 완료**:
  - `projects/portal/index.html` & `css/style.css`: 'DopaBrain Catalog & Directory' 허브로 전면 개편 (글래스 패널, `HOT`/`NEW`/`AI` 마이크로 칩 뱃지, 호버 글로우).
  - `projects/portal/blog/en/index.html`: "Featured Topics & Quick Catalog" TOC 배너 신설 (최신 인기 심리 가이드 8종 및 킬러 테스트 도구 4종 다이렉트 연동).
  - 모바일 반응형 1~2열 최적화 (터치 타깃 44px 이상, 모바일 가로 오버플로 0px 유지).
- **P1 다국어 초기화 & 하네스 검증 완료**:
  - `projects/stress-check/index.html`: URL `lang` 파라미터 감지 시 `document.documentElement.lang` 즉시 동기화로 브리지 레이스 컨디션 해결.
  - Auto Ads 단일 로더 규약 100% 준수 (`verify:portal-auto-ads-only`, `verify:portal-ad-containment`).
  - `npm run harness` 전수 통과 (모든 하네스 검증 [PASS]).

## Latest release: Neon Glassmorphism UI & Multi-Hub Catalog Elevation (2026-10-09)

- Submodules: portal (`dd71f5d` 선푸시 완료), stress-check (`dd43205` 선푸시 완료).
- Portal (`projects/portal`):
  - `index.html`: 목차 디렉토리 네온 글래스모피즘 카탈로그 개편, 매거진 섹션에 2026 최신 심리 가이드 전면 연동.
  - `css/style.css`: Hero 위너 카드 3D 림 라이트 및 글래스 질감 강화, Language selector CSS 구문 수정.
  - `blog/en/index.html`: 영문 블로그 허브 네온 글래스 TOC 배너 주입 및 트렌딩 아티클·도구 연결.
- Stress Check (`projects/stress-check`):
  - `index.html`: 초기 lang 동기화 보강으로 브리지 레이스 컨디션 제거.
- 전체 하네스 워크플로 및 검증 게이트 100% 통과 ([PASS]).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.

