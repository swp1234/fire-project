# DopaBrain current status

Updated: 2026-10-08 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-08)**: Policy violations 0 (`{}`). 10-06 **$0.11** (클릭 2회), 10-07 **$0.02** (노출 급감 42회, 클릭 0회), 10-08 **$0.04** (노출 55회, US $0.03). 7일 누적 **$0.51**, 30일 누적 **$1.67**.
- 수익 변동 핵심 원인: Ad Intents off 및 광고 빈도 축소 후 PV당 노출률 11~25%로 감소 + 10-07/10-08 유효 클릭 0건. 고체류 도구(Animal Personality 805s, Stress Check 436s, Future Self 178s) 전면 배치 및 모던 UI로 세션 참여 증대 필요.

## Current operating rules

- Keep 36 legacy apps in invalid-traffic suspension contract.
- Exclude Singapore desktop Direct scans (4.5s) and China bursts from decisions.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-08) — 상세 설계: `docs/STRATEGY.md`

- **P0 포털 메인 & 목차 디렉토리 2026 모던 네온 글래스모피즘 전면 리디자인 완료**:
  - `projects/portal/index.html` & `css/style.css`: 투박한 회색 박스 나열 디렉토리를 세련된 'DopaBrain Catalog & Directory' 허브로 환골탈태.
  - 카테고리별 글래스 카드 패널(심리·성격, 두뇌 게임, 웰빙, 전문 허브, 최신 블로그) 구조화.
  - 마이크로 칩 뱃지(`HOT`, `NEW`, `AI`, 날짜 캡슐) 및 인터랙티브 호버 글로우/리프트 적용.
  - 모바일 반응형 1~2열 최적화 (터치 타깃 44px 이상, 모바일 가로 오버플로 0px 유지).
- **P1 품질 & 광고 규약 검증 완료**:
  - Auto Ads 단일 로더 규약 100% 준수 (`verify:portal-auto-ads-only`, `verify:portal-ad-containment`).
  - `npm run harness` 전수 통과 (모든 하네스 검증 [PASS]).

## Latest release: Neon Glassmorphism Catalog & Directory UI (2026-10-08)

- Submodules: portal (`7b21dbd` 선푸시 완료), root-domain (정규 유지).
- Portal (`projects/portal`):
  - `index.html`: 목차 디렉토리 마크업 개편, 시각적 계층화, 마이크로 뱃지 연동.
  - `css/style.css`: 네온 글래스모피즘 카드 컨테이너, 호버 애니메이션, 모바일 쿼리 최적화.
- 전체 하네스 워크플로 및 검증 게이트 100% 통과.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.

