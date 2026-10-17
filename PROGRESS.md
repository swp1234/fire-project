# DopaBrain current status

Updated: 2026-10-11 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-17)**: Policy violations 0 (`{}`). 10-17 **$0.05** (반등 지속, 10-16 $0.01 대비 5배). 7일 누적 **$0.26**, 30일 누적 **$1.82**.
- 핵심 대책: 직접 유입 정지 앱 및 10개 유틸리티 도구의 관련 링크를 활성 수익화 도구(`pomodoro-timer`, `dark-core`, `stress-check`, `future-self`, `emotional-age`)로 전면 전환하여 유입 트래픽 누수 원천 차단.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-17) — 상세 설계: `docs/STRATEGY.md`

- **P0 수익화 트래픽 누수 차단 및 활성 도구 라우팅**:
  - 10개 유틸리티 앱의 정지 스텁(`qr-generator`) 링크를 활성 Auto Ads 앱(`pomodoro-timer`)으로 전면 전환.
  - 직접 유입 정지 심리테스트(`inner-child-test`, `villain-type`)의 관련 그리드를 활성 수익화 앱으로 전환 및 서브모듈 푸시 완료.
- **P1 고유지율 허브(`/puzzle-2048/coach.html`) & 진입면 수익 연결**:
  - GA4 1위 체류 페이지(2048 Coach)에서 다국어 가이드 및 게임 허브로의 유기적 수익 순환 유지.

## Latest release: EN, KO, JA Reaction Test Game Guides Monetization Routing (2026-10-17)

- Submodules: `projects/portal` (`3a59e99`).
- Monetization & High-Intent Conversion Routing:
  - 영어/한국어/일본어 반응속도 테스트 가이드(`blog/{en,ko,ja}/reaction-test-game-guide.html`):
    - 퀵 레일 내 정지 링크(`/minesweeper/`, `/brick-breaker/`) 및 오타겟 링크를 활성 수익화 도구(`/reaction-test/?lang=...`, `/puzzle-2048/coach.html?lang=...`, `/stress-check/?lang=...`, `/future-self/?lang=...`)로 개편.
    - 본문 상/하단 CTA 및 데일리 벤치마크 텍스트 링크가 정지/비관련 앱(`iq-test`, `color-memory`)을 가리키던 문제를 핵심 진입면인 반응속도 테스트(`/reaction-test/?lang=...`) 및 2048 전술 코치로 전면 전환.
    - 하단 관련 링크 6종을 100% 활성 고유지율/Auto Ads 도구(반응속도 테스트, 2048 전술 코치, 센서리 리셋, 스트레스 측정, 미래의 나, HSP 테스트)로 현지화 교체.
- Mobile & Ad Quality:
  - Playwright 기준 390x844 모바일 가로 오버플로 3개 파일 모두 0px 검증 완료.
  - `verify:adsense-contract`, `verify:portal-auto-ads-only`, `verify:portal-ad-containment`, `verify:restricted-ads`, `verify:zh-2048-guide`, `verify:ja-reaction-time`, `harness:analytics`, `verify:root`, `verify:docs` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
