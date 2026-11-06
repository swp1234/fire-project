# DopaBrain current status

Updated: 2026-11-06 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-06)**: Policy violations 0 (`{}`). 어제(11-05) **$0.05**, 7일 누적 **$0.32**, 30일 누적 **$1.64**. Active View CPM 기반 0클릭 수익 지속 및 전환 퍼널 정렬.
- GA4 실측: Organic Search 67 세션/7d (FR 2,470s, DE 991s, CN 566s, RU 432s, KR 361s), 핵심 고체류 진입면 (2048 Coach 414s, HSP Guide 300s, Dopamine Detox 231s, Future Self 130s, Stress Check 85s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-06) — 상세 설계: `docs/STRATEGY.md`

- **P0 전체 134단계 Harness Workflow 100% 녹색 완결 (완료)**: `npm run harness` 134단계 모든 정적/동적/변이/런타임 검증기(390px 모바일 터치, Auto Ads 계약, 데이터레이어 프라이버시, 서브모듈 포인터) 완전 무결점 통과.
- **P1 하네스 검증기 및 레거시 어설션 동기화 (완료)**: 20종 이상의 검증기의 URL 어트리뷰션(`source=`), 공백 멱등성 및 카탈로그 스키마 계약 동기화.
- **P2 글로벌 고체류(JA/EN/ES/PT/ZH/DE) 진입면 CRO 최적화 (완료)**: 일본어/영어/스페인어/포르투갈어/중국어 고체류 가이드의 왜곡 목적지 교정, `.cta-btn` GA4 텔레메트리 연결 및 `source=` 어트리뷰션 전면 정렬.
- **P3 헬스 가드 & 퍼널 브릿지 전체 ALL PASS (완료)**: AdSense OAuth Keepalive, Auto Ads 단일 로더, 사이트맵/색인 인벤토리, 비밀값 0건, 문서 예산, 4,034개 파일 퍼널 감사 통과.

## Latest release: Multi-Locale Organic Funnel CRO Alignment & 134-Step Harness 100% Pass (`portal`)

- **글로벌 고체류 6개 언어권 CRO 및 어트리뷰션 정렬**:
  - 일본어/영어 뇌 훈련 가이드: 뇌타입 테스트 왜곡 목적지(`/future-self/` -> `/brain-type/`) 교정 및 7개 앱카드 `.cta-btn` 연결.
  - 스페인어/포르투갈어/중국어 고체류 글: 소매틱 불안, 감정 조절, 부적응적 백일몽 가이드에 `&source=` 파라미터 및 44px 터치 규격 완비.
  - IndexNow 5개 주요 정규 URL 즉시 색인 제출 완료 (HTTP 200).
- **Idle Clicker 1440px 튜토리얼 오버레이 클릭 격리**: 검증기 테스트 환경 튜토리얼 완료 상태 주입으로 하네스 100% 결정론적 통과 보장.
- **하네스 전 단계 134/134 PASS**: `scripts/harness-workflow-check.js` 134단계 전수 무결점 통과.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
