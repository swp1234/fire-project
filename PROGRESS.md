# DopaBrain current status

Updated: 2026-10-11 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-11)**: Policy violations 0 (`{}`). 10-07 **$0.02**, 10-08 **$0.06**, 10-09 **$0.02**, 10-10 **$0.02**. 7일 누적 **$0.55**, 30일 누적 **$1.69**.
- 핵심 대책: 1,678개 블로그 미렌더링 FAQ 스키마 제거로 GSC 크롤링 페널티 해소 및 핵심 진입면 인덱싱 재개 유도.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s, Mental Age).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-11) — 상세 설계: `docs/STRATEGY.md`

- **P0 GSC 크롤링 페널티 & 정규 URL 불일치 전면 해소**:
  - 12개 진입면 앱 hreflang-canonical 언어 쿼리 uncollapse 전면 적용 (`?lang=en` 등).
  - 36개 레거시 앱 무효 트래픽 광고 격리 계약 준수 유지.
  - 서브모듈 선푸시 후 루트 포인터 갱신 및 IndexNow 200 전송 완료.
- **P1 신규 바이럴 인터랙티브 콘텐츠 확장 & 핵심 도구 전환 루프**:
  - '도파민 메뉴(Dopamine Menu): 팝콘 브레인 4코스 리셋' 인터랙티브 빌더 ko/en 배포 및 사이트맵 반영.
  - '뇌 배터리 12% / 감각 과부하 리셋' 8개 언어 배포 완료 및 핵심 4대 도구 백링크 연계.

## Latest release: Life in Numbers & Villain Origin 12-Locale SEO Uncollapse (2026-10-15)

- Submodules: life-in-numbers (`a662f4d`), villain-origin (`c9a74f4`), aura-score (`754790b`), would-you-rather (`7a8054f`), mbti-tips (`fa23f78`), soul-age (`0668997`), love-frequency (`b1e97e5`), portal (`09a6132`), puzzle-2048 (`14f7e30`), love-language (`3831688`), typing-speed (`b58a835`), reaction-test (`6cd4bd6`), stress-type (`58cf271`), red-green-flag (`81b2fdf`), fortune-cookie (`b75f037`), dark-core (`0d7e227`), emotional-age (`11dd627`), ai-personality (`368aa1b`), biorhythm (`f328d14`), ick-factor (`505af9e`), pomodoro-timer (`ff82b6f`), social-battery (`528a1b1`), stress-response (`65169eb`), work-style (`ef3d79b`), stress-check (`3aff627`), trauma-response (`d8e5336`), anxiety-type (`2373550`), color-personality (`2e81ee6`), color-memory (`c82607b`), toxic-trait (`02e4554`), toxic-trait-test (`31bbc8e`), future-self (`c87189d`), eq-test (`84a1352`).
- Content & SEO:
  - `life-in-numbers`, `villain-origin`, `aura-score`, `would-you-rather`, `mbti-tips`, `soul-age`, `love-frequency` 12개 언어 hreflang 고유 쿼리 파라미터(`?lang=en` 등) uncollapse 전면 적용 및 i18n URL 검색 파라미터 감지 연동.
  - 신규 인터랙티브 가이드 2종('도파민 메뉴' & '뇌 배터리 12% 리셋') 12개 전 언어 배포 완료 및 IndexNow 200 전송 완료.
- Test Harness:
  - 아티클 3,914건, 사이트맵 1,524개 URL 전수 검사 0 issues 통과 (`verify:indexing-inventory`).
  - `verify:portal-auto-ads-only` 9/9, `verify:blog-indexing-focus` PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
