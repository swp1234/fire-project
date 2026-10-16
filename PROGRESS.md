# DopaBrain current status

Updated: 2026-10-11 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-16)**: Policy violations 0 (`{}`). 10-16 **$0.01** (22 imps / 326 views). 7일 누적 **$0.28**, 30일 누적 **$1.69**.
- 핵심 대책: 블로그/포털 크로스 프로모션 라우팅을 광고 정지 앱(brain-type, eq-test)에서 활성 수익화 앱(stress-check, hsp-test, future-self)으로 전면 교체하여 트래픽 누수 차단.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-16) — 상세 설계: `docs/STRATEGY.md`

- **P0 수익화 트래픽 누수 차단 및 활성 도구 라우팅**:
  - `cross-promo.js` 내 블로그 브릿지/스티키 스프린트 대상 목록을 광고 활성 앱으로 전면 전환 완료.
  - 모바일 스티키 터치 타깃 44px 및 변이 테스트 통과 (`verify:cross-promo-touch`).
  - 서브모듈 선푸시 후 루트 포인터 갱신 및 IndexNow 200 전송 완료.
- **P1 핵심 진입면 인덱싱 회복 & GSC 재크롤링 유도**:
  - '크롤링됨 - 현재 색인 생성되지 않음' 상태인 핵심 앱(stress-check, hsp-test, 2048-coach) 재인덱싱 유도.
  - Auto Ads 신호 안정성 및 뷰포트 오버플로 0px 유지.

## Latest release: Monetization Traffic Routing & Cross-Promo Recovery (2026-10-16)

- Submodule: `projects/portal` (`js/cross-promo.js`).
- Monetization & SEO:
  - 블로그 및 포털 유입 트래픽이 광고 비활성화 앱으로 유실되던 라우팅 버그 수정 (`stress-check`, `hsp-test`, `future-self`, `attachment-style` 우선 배정).
  - 모바일 스티키 스프린트 대체 링크(`cp-sticky-alt`) 터치 타깃 44px 보장 및 마켓별 대응 최적화.
- Test Harness:
  - `verify:cross-promo-touch`, `verify:restricted-ads`, `verify:kpop-role-roster`, `verify:zh-2048-guide` 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
