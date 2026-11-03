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

## Latest release: Universal Funnel Bridge & Mobile Touch Standard (`color-blindness af8f39e`, `biorhythm b43e715`, `fortune-cookie 5aed91b`, `pomodoro 943a100`, `dday 20e2f39`)

- **22개 전방위 서브모듈 전환 퍼널 및 터치 최적화**: `reaction-test`, `color-personality`, `overthinker-test`, `stress-type`, `stress-response`, `burnout-test`, `work-style`, `animal-personality`, `soul-age`, `kpop-position`, `aura-score`, `toxic-trait`, `biorhythm`, `life-in-numbers`, `bmi-calculator`, `fortune-cookie`, `emotion-temp`, `color-palette`, `unit-converter`, `dday-counter`, `pomodoro-timer`, `color-blindness`.
- **모바일 0px 오버플로 및 44px 터치 규격 완결**: `repeat(2, minmax(0, 1fr))` 그리드 적용으로 가로 오버플로 0px 달성, 버튼 및 공유 링크 44px 이상 확보.
- **동적 다국어(`?lang=`) 및 전환 어트리뷰션(`content_cta_click`)**: 인바운드 언어 파라미터 완전 보존, `source={submodule}_result` 태깅, GA4 표준 `content_cta_click` 이벤트 탑재.
- **품질 게이트 및 헬스 가드 통과**: `audit-touch.js` 0px/0이슈, `audit-funnel.js`(4,034파일) PASS, `indexing-inventory.js --strict`(1,555URL) PASS, `health-guard.js` ALL PASS, `audit-registry.json` 22개 서브모듈 동기화 완료.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
