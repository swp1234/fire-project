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

## Latest release: TR, HI Block Puzzle Guides 12-Language Clean Sweep (2026-10-17)

- Submodules: `projects/portal` (`b4ef233`).
- Monetization & High-Intent Conversion Routing:
  - 튀르키예어/힌디어 블록 퍼즐 가이드(`blog/{tr,hi}/block-puzzle-game-guide.html`):
    - 퀵 레일 내 정지 링크(`/minesweeper/`, `/brick-breaker/`)를 활성 수익화 도구(`/puzzle-2048/coach.html?lang=...`, `/reaction-test/?lang=...`, `/stress-check/?lang=...`, `/future-self/?lang=...`)로 개편.
    - 힌디어 본문 내 정지된 `brick-breaker` 카드 링크를 밀리초 순발력 반응속도 테스트(`/reaction-test/?lang=hi`)로 교체 및 하단 후속 도구 그리드 100% 활성 앱화.
    - 튀르키예어 상/하단 CTA 박스 및 관련 링크 6종을 2048 전술 코치, 반응속도 테스트, 센서리 리셋, 스트레스 측정, 미래의 나, HSP 테스트로 전면 전환.
    - **결과: `block-puzzle-game-guide.html` 12개 전 언어 트래픽 누수 0건 달성 (완전 무결화)**.
- Mobile & Ad Quality:
  - Playwright 기준 390x844 모바일 가로 오버플로 2개 파일 모두 0px 검증 완료.
  - `verify:adsense-contract`, `verify:portal-auto-ads-only`, `verify:portal-ad-containment`, `verify:restricted-ads`, `verify:zh-2048-guide`, `verify:ja-reaction-time`, `harness:analytics`, `verify:root`, `verify:docs` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
