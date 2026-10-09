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

## Latest release: Homepage Cyber-Neon Glassmorphism & Dopamine Trend Elevation (2026-10-09)

- Submodules: root-domain (`7324f08` 선푸시 완료), portal (`dd71f5d` 선푸시 완료), stress-check (`dd43205` 선푸시 완료).
- Root-domain (`projects/root-domain`):
  - `index.html`: 오딧세이/스파이더맨 영화 리뷰 시그널을 고수요 '2026 도파민 디톡스 & 뇌 피로 리셋 가이드'(`dopamine-detox-guide-reset-brain.html`)로 전면 교체.
  - 히어로 CTA, 첫 클릭 추천 카드(3종), 상위 픽 칩(6종) 등 홈페이지 전반을 사이버 네온 글래스모피즘(3D 림 라이트, 발광 호버, 마이크로 칩 뱃지)으로 전면 환골탈태.
  - 12개 지원 언어(`ko en zh hi ru ja es pt id tr de fr`) 로케일 동기화 및 모바일 뷰포트 반응형 최적화(높이 44~96px 유지, 가로 오버플로 0px).
- Root test harness: `verify:root`, `verify:root:mutations`, `npm run harness` 100% 통과 ([PASS]).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.

