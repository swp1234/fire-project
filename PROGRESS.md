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
  - `stress-check`, `hsp-test`, `future-self`, `iq-test`: 접혀있던 학술 방법론/점수기준/FAQ `<details open>` 전면 기본 노출 전환.
  - 서브모듈 선푸시 완료: `stress-check`(`1f49653`), `hsp-test`(`ecb50d8`), `future-self`(`b682a2e`), `iq-test`(`c9d63b7`).
  - IndexNow 즉시 제출 완료: `stress-check`, `hsp-test`, `future-self`, `iq-test`, `animal-personality`, `brain-type`.
- **P1 소셜 트렌드 기반 신규 킬러 콘텐츠 배포**:
  - Reddit/Reels 실시간 화제(ADHD 마비, 열린 탭 100개, 도파민 번아웃) 분석 반영.
  - `portal/blog/ko/adhd-paralysis-open-tabs-dopamine-burnout.html` 배포 (인터랙티브 탭 진단 위젯 및 즉시 진단 도구 연동).
  - `portal` (`3bb5ba3` 선푸시 완료): 한국어 블로그 Top 5 및 최신 글 1열에 연동.

## Latest release: Crawler Indexing Unblock & ADHD Dopamine Trend Launch (2026-10-09)

- Submodules: stress-check (`1f49653`), hsp-test (`ecb50d8`), future-self (`b682a2e`), iq-test (`c9d63b7`), portal (`3bb5ba3`).
- Crawler & Indexing:
  - 핵심 진입 도구의 `<details open>` 기본 노출 전환으로 '크롤링됨 - 현재 색인 생성되지 않음' 저품질 판정 위험 차단.
  - IndexNow API 통한 즉각 인덱싱 제출 (HTTP 200).
- Trend Content:
  - '열린 탭 100개와 ADHD 마비: 도파민 번아웃 0~100% 자가진단 및 뇌 피로 리셋법' 발행.
  - 인터랙티브 '탭 과적형 vs 앱 방랑형' 선택 위젯, 4종 즉시 진단 카드, Auto Ads 단일 로더, 모바일 가로 오버플로 0px 검증 통과.
- Test Harness & Ports:
  - 감정 조절 플래너 검증기(`verify-{de,id,ko}-emotion-action-path.js`)에 `listenOnSafePort` 적용하여 Chromium `ERR_UNSAFE_PORT` 방지.
  - `npm run harness` 전수 통과 ([PASS]).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.

