# DopaBrain current status

Updated: 2026-10-23 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-21)**: Policy violations 0 (`{}`). 오늘 **$0.03**, 7일 누적 **$0.30**, 이달 누적 **$1.08**, 30일 누적 **$1.76**.
- 핵심 대책: 포털 블로그 404 데드 링크 전수 복구 완료 상태 유지, GSC 사이트맵 및 IndexNow 8대 핵심 진입면 URL 갱신 통보로 인덱싱 복구 가속, 모바일 44px 터치 타깃 불변식 엄수.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 200s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-23) — 상세 설계: `docs/STRATEGY.md`

- **P0 색인 갱신 및 유기적 검색 회복**:
  - GSC 사이트맵 및 IndexNow API로 14대 핵심 진입면·상위 유기적 랜딩 URL(HTTP 200) 통보 완료.
  - 검색 콘솔 '크롤링됨' 대기 진입면(`stress-check`, `hsp-test`, `2048/coach`, `future-self`, `iq-test`) 및 Bing 유입 순위 회복 가속.
- **P1 모바일 a11y & 터치 타깃 불변식 보장**:
  - 모바일(390x844) 가로 오버플로 0px 및 최소 터치 타깃 44px 전수 준수.

## Latest release: Mobile Touch-Target & UX Invariant Audit Across 11 Submodules — Batch 8 (2026-10-23)

- Submodules: `shopping-calc` (`07a59f3`), `dev-quiz` (`76e2490`), `quiz-app` (`c5144db`), `past-life` (`af49085`), `toxic-trait-test` (`773058e`) (완전 무결 0-issue 검증 완료: `sebatdon-calc`, `love-frequency`, `color-personality`, `emotion-temp`, `villain-type`, `npc-test`).
- UX & Touch Target Compliance:
  - 11개 서브모듈 Playwright 모바일(390x844) 전수 검사 0 issues (100% PERFECT).
  - `shopping-calc` 통화 선택기 셀렉트박스(`.currency-box select`) 48px 최소 터치 규격 확장.
  - `dev-quiz`, `past-life`의 `.skip-link`, 브랜드 링크, 푸터 링크 44px 최소 규격 확장.
  - `quiz-app` 헤더 브랜드 링크, 언어 선택창, 스킵 링크 44px 최소 터치 규격 확장.
  - `toxic-trait-test`의 `.skip-link` 44px 최소 규격 교정 완료.
  - 5개 수정 서브모듈 Pre-push 품질 게이트 전원 PASS 및 원격 저장소 배포 완료.
- Verification & Invariants:
  - `verify:root` (24/24), `verify:indexing-inventory` (0 issues), `verify:adsense-contract` (11/11 mutations), `verify:tracked-secrets` (232 files), `verify:docs` (10/10) 전수 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
