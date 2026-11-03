# DopaBrain current status

Updated: 2026-11-03 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-03)**: Policy violations 0 (`{}`). 어제 확정 **$0.03**, 7일 누적 **$0.61** (일평균 $0.087), 30일 누적 **$1.79**. 오늘 **$0.04** 진행 중. 10-27 피크 **$0.25** (일 목표 달성 사례 보유). Active View CPM 기반 0클릭 수익 지속.
- GA4 실측: Organic Search ~84 세션/7d, 핵심 고체류 진입면 (2048 Coach 414s, Future Self 203s, Brain Type 243s, HSP Guide 650s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-01) — 상세 설계: `docs/STRATEGY.md`

- **P0 도구 카탈로그·MBTI·감각 리셋·꿈해몽 전환 추적 통합 (완료)**: `portal/tools`, `portal/mbti`, `hsp-test`, `dream-fortune` GA4 `content_cta_click` 탑재 및 터치 규격 44px 준수.
- **P1 관계·감정 핵심 진입면 전환 어트리뷰션 확장 (완료)**: `attachment-style` & `emotion-iceberg` 상호 브릿지, `source` 파라미터 보존, GA4 `content_cta_click` 탑재.
- **P2 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster, brain-game-workout, emotion-regulation-planner 및 `kpop-position` companion card i18n/추적 표준화.
- **P3 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense Auto Ads 계약, OAuth keepalive, 터치 타깃 0 이슈, 105개 스크리너 라이브 테스트 및 Health Guard ALL PASS.

## Latest release: Comprehensive Auto Ads Compliance, Funnel Bridge & Revenue Variance Cleanup Batch 1-4 (`puzzle-2048`, `tax-refund-preview`, `love-frequency`, `numerology`, `biorhythm`, `white-noise`, `color-palette`, `sebatdon-calc`, `shopping-calc`, `seollal-greetings`, `portal`, `brain-type`, `inner-child-test`, `villain-type`, `ick-factor`, `shadow-work`, `red-green-flag`, `valentine`, `dday-counter`, `unit-converter`, `password-generator`, `bmi-calculator`)

- **가짜 카운트다운 게이트 및 수동 플레이스홀더 완전 박멸**: 6개 서브모듈(`affirmation`, `valentine`, `love-frequency`, `dday-counter`, `unit-converter`, `tax-refund-preview`)의 5초 카운트다운 게이트를 제거하고, 11개 서브모듈의 수동 광고 플레이스홀더(`.ad-banner`, `.ad-placeholder`, `.ad-slot`, `.result-ad-slot`)를 완전 제거하여 Auto Ads 단일 로더 계약 준수.
- **최고 체류면 퍼널 브릿지 및 중단 앱 제거**: 체류시간 414초의 `puzzle-2048` 게임오버 화면을 중단 게임 대신 고수익 핵심 도구(`iq-test`, `brain-type`, `reaction-test`, `stress-check`)로 전환(12개 언어). `shadow-work`(`/future-self/`) 및 `ick-factor`(`/love-frequency/`) 중단 링크 제거.
- **모바일 44px 터치 규격 및 동적 언어 보존**: 20여 개 서브모듈 전체에 44px 터치 그리드, `content_cta_click` 이벤트, 동적 `?lang=` 파라미터 보존 적용하여 모바일 가로 오버플로 0px 달성.
- **품질 게이트 및 헬스 가드 통과**: 모든 하위 저장소 commit/push 완료, `audit-touch.js` 0px/0이슈, `audit-funnel.js`(4,034파일) PASS, `trust-audit.js --all`(119개) PASS, `audit-registry.json` 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
