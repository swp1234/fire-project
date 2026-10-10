# DopaBrain current status

Updated: 2026-10-10 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-10)**: Policy violations 0 (`{}`). 10-07 **$0.02**, 10-08 **$0.06** (Brazil $0.02, US $0.03), 10-09 **$0.02**, 10-10 진행 중 ($0.02). 7일 누적 **$0.55**, 30일 누적 **$1.69**.
- 핵심 대책: PV당 노출률 11~25%대 유지하며 체류시간 1위 진입면과 고수익 로케일(US/BR/LATAM) 최신 바이럴 인터랙티브 가이드를 전면 배치하여 오가닉 유입 및 CTR 증대.

## Current operating rules

- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s, Mental Age).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-10) — 상세 설계: `docs/STRATEGY.md`

- **P0 GSC 검색 크롤러 차단 요소(Robots 메타 & Thin Content) 전면 해소**:
  - `stress-check`, `hsp-test`, `reaction-test`, `puzzle-2048`, `social-battery`, `root-domain`: `index, follow` robots 지시어 명시 및 누락 태그 전면 정상화.
  - 서브모듈 선푸시: `stress-check`(`ea09923`), `hsp-test`(`57b0440`), `reaction-test`(`3180316`), `puzzle-2048`(`69a497c`), `social-battery`(`d5c9e6d`), `root-domain`(`32e5bfb`).
- **P1 소셜 트렌드 바이럴 킬러 콘텐츠 배포 (Former Gifted Kid Burnout & 100+ Tabs)**:
  - 영재 번아웃 증후군(Former Gifted Kid Burnout) 및 ADHD 100+ Tabs 영어(`en`), 한국어(`ko`), 포르투갈어(`pt`), 스페인어(`es`) 인터랙티브 진단 가이드 배포.
  - 서브모듈 선푸시: `portal`(`ec28e03`).
  - 엄격 인덱싱 인벤토리 검증(`verify:indexing-inventory`): 1,502개 URL 전수 이슈 0건(Clean) 통과.

## Latest release: Former Gifted Kid Burnout Multi-Locale Rollout (2026-10-10)

- Submodules: portal (`ec28e03`), stress-check (`ea09923`), hsp-test (`57b0440`), reaction-test (`3180316`), puzzle-2048 (`69a497c`), social-battery (`d5c9e6d`), root-domain (`32e5bfb`).
- Crawler & Indexing:
  - `former-gifted-kid-burnout-syndrome-recovery` en, ko, pt, es 4개 로케일 배포 및 sitemap 등록 완료.
  - 포털 메인 Featured 및 각 언어별 블로그 디렉터리 최상단 추천 카드 전면 배치.
- Test Harness:
  - 아티클 인벤토리 3,892건, sitemap 1,502개 URL 전수 검사 0 issues, 0 blockers 통과.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
