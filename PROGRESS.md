# DopaBrain current status

Updated: 2026-11-03 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-03)**: Policy violations 0 (`{}`). 어제 확정 **$0.03**, 7일 누적 **$0.61** (일평균 $0.087), 30일 누적 **$1.79**. 오늘 **$0.04** 진행 중. 10-27 피크 **$0.25** (일 목표 달성 사례 보유).
- GA4 실측: Organic Search ~84 세션/7d, 핵심 고체류 진입면 (2048 Coach 414s, Future Self 203s, Brain Type 243s, HSP Guide 650s).
- 고체류 핵심 진입면: 2048 Coach, Future Self, Stress Check, HSP Test, Brain Type, IQ Test.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-01) — 상세 설계: `docs/STRATEGY.md`

- **P0 도구 카탈로그·MBTI·감각 리셋·꿈해몽 전환 추적 통합 (완료)**: `portal/tools`, `portal/mbti`, `hsp-test` (reset, map), `dream-fortune`에 GA4 `content_cta_click` 탑재 및 터치 규격 44px 준수.
- **P1 관계·감정 핵심 진입면 전환 어트리뷰션 확장 (완료)**: `attachment-style` & `emotion-iceberg` 상호 브릿지, `source` 파라미터 보존, GA4 `content_cta_click` 탑재.
- **P2 포털 도구 및 K-pop 생태계 전환 추적 표준화 (완료)**: `portal` dopamine-detox, kpop-role-roster, brain-game-workout, emotion-regulation-planner 및 `kpop-position` companion card i18n/추적 표준화.
- **P3 무결점 컴플라이언스 & 헬스 가드 통과 (완료)**: AdSense Auto Ads 계약, OAuth keepalive, 터치 타깃 0 이슈, 105개 스크리너 라이브 테스트 및 Health Guard ALL PASS.

## Latest release: Interstitial Lock Sanitization & Secondary Funnel Bridge (`affirmation bd5a269`, `valentine aed406a`, `love-frequency 2427f9f`, `dday 110e99e`, `unit-converter f19efa9`, `shadow-work a90b610`, `dream-fortune d24c5cb`)

- **가짜 전면 광고 카운트다운 게이트 영구 제거**: `affirmation`, `valentine`, `love-frequency`, `dday-counter`, `unit-converter`에서 5초 카운트다운 오버레이 및 수동 배너 플레이스홀더를 완전 제거하고 즉시 콘텐츠를 표시하도록 수정하여 Google Auto Ads 비보상형 정책 100% 준수.
- **서브모듈 퍼널 브릿지 및 목적지 정합성 완결**: `shadow-work`의 중단 앱(`/emotion-iceberg/`) 링크를 `/future-self/`로 전면 교체(12개 언어 정합), `affirmation`, `valentine`, `love-frequency`, `dream-fortune`에 `repeat(2, minmax(0, 1fr))` 44px 모바일 터치 규격 탐색 그리드 탑재.
- **동적 다국어(`?lang=`) 및 전환 어트리뷰션(`content_cta_click`)**: 인바운드 언어 파라미터 완전 보존, `source={submodule}_result` 태깅, GA4 표준 `content_cta_click` 이벤트 탑재.
- **핵심 5대 고체류 도구 IndexNow 즉시 재제출**: P1 학술 프레임워크/FAQ 보강 이후 Google 재크롤링 유도를 위해 5개 도구(`stress-check`, `hsp-test`, `brain-type`, `future-self`, `iq-test`) IndexNow HTTP 200 제출 완료.
- **품질 게이트 및 헬스 가드 통과**: 7개 서브모듈 Pre-push Quality Gate 통과 및 원격 푸시, `audit-touch.js` 0px/0이슈, `audit-funnel.js`(4,034파일) PASS, `trust-audit.js --all`(119개) PASS, `health-guard.js` ALL PASS, `audit-registry.json` 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
