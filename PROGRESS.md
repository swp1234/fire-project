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

## Latest release: JA & ZH Top Blog Guide Intent & App Routing Optimization (2026-10-17)

- Submodules: `projects/portal` (`b1eed40`).
- Monetization & High-Intent Conversion Routing:
  - 일본어 상위 블로그 7개 가이드(`attachment-style-quiz-guide`, `avoidant-attachment-dating-guide`, `disorganized-attachment-style`, `trauma-response-test-guide`, `nervous-system-regulation-techniques`, `people-pleasing-fawn-response-guide`, `codependency-recovery-steps-guide`):
    - CTA 및 관련 테스트 텍스트-URL 불일치(애착 가이드에서 'EQ테스트'/'트라우마반응' 버튼 등)를 타깃 일치 활성 앱(`/attachment-style/?lang=ja`, `/stress-check/?lang=ja`, `/hsp-test/?lang=ja`, `/future-self/?lang=ja`)으로 전면 재정렬.
    - 일본어 네이티브 쿼리 `?lang=ja` 누락 수정 및 내부 가이드 교차 링크 정상화.
  - 중국어 상위 가이드(`daily-tarot-reading-guide`): 미검증 AI 홍보 문구 정비 및 CTA 버튼을 `/daily-tarot/?lang=zh`로 직접 연결.
- Mobile & Ad Quality:
  - 390x844 모바일 가로 오버플로 8개 수정 파일 모두 0px 검증 완료.
  - `verify:adsense-contract`, `verify:portal-auto-ads-only`, `verify:portal-ad-containment`, `verify:restricted-ads`, `harness:analytics`, `verify:root`, `verify:docs` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.




