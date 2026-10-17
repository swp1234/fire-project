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

## Latest release: Organic Focus Blog Guides & MBTI Hub Monetization Routing (2026-10-17)

- Submodules: `projects/portal` (`7c0452f`), `projects/social-battery` (`0fafd74`), 10 Utility submodules, `projects/inner-child-test` (`7a78618`), `projects/villain-type` (`f7c847a`).
- Monetization & Traffic Routing:
  - 16개 MBTI 유형별 가이드(`enfj`~`istp`)의 하단 CTA 링크를 정지된 0광고 스텁(`mbti-love`, `mbti-career`)에서 활성 Auto Ads 앱(`attachment-style`, `animal-personality`, `portal/mbti`)으로 전환.
  - RSD 가이드(10개 언어), 감정조절(8개 언어), 습관형성(5개 언어), 바운더리(2개 언어), 발렌타인/K-POP 가이드 등 47개 파일 내 정지 스텁(`anxiety-type`, `toxic-trait-test`, `dopamine-type`, `red-flag-test`, `trauma-response`) 링크를 활성 수익화 앱(`stress-check`, `hsp-test/reset.html`, `detox-timer`, `red-green-flag`, `toxic-trait`)으로 전면 전환 (누적 1,765개 가이드, >4,450개 누수 차단).
  - 10개 유틸리티 앱 및 생성기 템플릿의 관련 도구 링크를 정지된 `qr-generator`에서 활성 `pomodoro-timer`로 교체 완료.
  - `inner-child-test`, `villain-type`, `social-battery` 정지 규약 준수 및 관련 그리드를 활성 수익화 앱으로 전면 라우팅.
- Test Harness:
  - `verify:portal-auto-ads-only`, `verify:portal-ad-containment`, `verify:adsense-contract`, `verify:restricted-ads`, `verify:docs`, `verify:root` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.




