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

- **P0 GSC 검색 크롤러 차단 요소(Thin Content) 전면 해소**:
  - `stress-check`, `hsp-test`, `future-self`, `iq-test`, `puzzle-2048`: 접혀있던 학술 방법론/FAQ `<details open>` 전면 기본 노출 전환.
  - 서브모듈 선푸시 완료: `stress-check`(`1f49653`), `hsp-test`(`ecb50d8`), `future-self`(`b682a2e`), `iq-test`(`c9d63b7`), `puzzle-2048`(`9014209`).
  - IndexNow 즉시 제출 완료: `stress-check`, `hsp-test`, `future-self`, `iq-test`, `animal-personality`, `brain-type`, `puzzle-2048/coach.html`.
- **P1 소셜 트렌드 기반 신규 킬러 콘텐츠 배포**:
  - Reddit/Reels 실시간 화제(ADHD 마비 100개 탭, 퇴근 후 뇌 배터리 12% 방전 및 감각 과부하) 분석 반영.
  - 신규 배포 1: `adhd-paralysis-open-tabs-dopamine-burnout.html` (ko/en, 인터랙티브 탭 진단 위젯).
  - 신규 배포 2: `brain-battery-sensory-overload-recharge-guide.html` (ko/en, 실시간 뇌 배터리 게이지 위젯).
  - 서브모듈 선푸시 완료: `portal`(`b0fb3e6`), `root-domain`(`f137d55`).
  - IndexNow 즉각 제출 완료: 국문/영문 신규 가이드 4종 전수 HTTP 200 성공.
  - 엄격 인덱싱 인벤토리 검증(`verify:indexing-inventory`): 1,487개 URL 전수 이슈 0건(Clean) 달성.

## Latest release: Brain Battery & ADHD Dopamine Trend Launch (2026-10-09)

- Submodules: stress-check (`1f49653`), hsp-test (`ecb50d8`), future-self (`b682a2e`), iq-test (`c9d63b7`), puzzle-2048 (`9014209`), root-domain (`f137d55`), portal (`b0fb3e6`).
- Crawler & Indexing:
  - 핵심 진입 도구 `<details open>` 전환 및 인덱싱 인벤토리 엄격 스펙 100% 무결성 유지 (이슈 0건).
  - IndexNow API 통한 국문/영문 바이럴 가이드 즉각 인덱싱 제출 (HTTP 200).
- Trend Content:
  - '열린 탭 100개와 ADHD 마비' & '퇴근 후 뇌 배터리 12%와 감각 과부하 리셋' 인터랙티브 가이드 동시 발행.
  - 실시간 배터리 게이지 진단기 위젯 탑재, Auto Ads 단일 로더 규약, 모바일 가로 오버플로 0px 유지.
- Test Harness:
  - 아티클 인벤토리 3,878건 동기화 및 인덱싱 무결성 검증 완전 통과.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.

