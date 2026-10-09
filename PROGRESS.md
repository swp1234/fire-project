# DopaBrain current status

Updated: 2026-10-09 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-09)**: Policy violations 0 (`{}`). 10-06 **$0.11**, 10-07 **$0.02**, 10-08 **$0.06** (반등!, Brazil $0.02, US $0.03), 10-09 진행 중 ($0.01). 7일 누적 **$0.55**, 30일 누적 **$1.69**.
- 핵심 대책: PV당 노출률 11~25%대 유지하며 체류시간이 검증된 킬러 진입면과 최신 바이럴 진단 가이드를 전면 배치하여 고가치 오가닉 유입 및 클릭 활성화 도모.

## Current operating rules

- Keep 36 legacy apps in invalid-traffic suspension contract.
- Exclude Singapore desktop Direct scans (4.5s) and China bursts from decisions.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s, Mental Age).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-09) — 상세 설계: `docs/STRATEGY.md`

- **P0 GSC 검색 크롤러 차단 요소(Thin Content) 전면 해소**:
  - `mental-age`: 7개 인지 영역 설명 및 E-E-A-T FAQ `<section class="about-section">` `<details open>` 기본 노출 전환 (Thin Content 해소).
  - `stress-check`, `hsp-test`, `future-self`, `iq-test`, `puzzle-2048`: 접힌 아코디언 기본 노출 전환.
  - 서브모듈 선푸시: `mental-age`(`e41ea44`), `stress-check`, `hsp-test`, `future-self`, `iq-test`, `puzzle-2048`.
- **P1 소셜 트렌드 기반 신규 킬러 콘텐츠 배포**:
  - 신규 배포: `adhd-paralysis`, `brain-battery`, `brain-rot`, `revenge-bedtime-procrastination` (각 ko/en 인터랙티브 진단).
  - 서브모듈 선푸시: `portal`(`a91ae37`), `emoji-merge`(`14ed27c`), `mental-age`(`92437e3`), `root-domain`(`f137d55`).
  - 엄격 인덱싱 인벤토리 검증(`verify:indexing-inventory`): 1,491개 URL 전수 이슈 0건(Clean) 달성.

## Latest release: Revenge Bedtime Procrastination & Crawler Optimization (2026-10-09)

- Submodules: mental-age (`92437e3`), emoji-merge (`14ed27c`), root-domain (`f137d55`), portal (`a91ae37`).
- Crawler & Indexing:
  - Mental Age 7대 인지 메커니즘 정적 콘텐츠 확충으로 Thin Content 탈피 및 IndexNow 즉시 제출 (HTTP 200).
  - Portal & Emoji-merge 중복 robots 메타태그 정리로 크롤러 혼선 해소 및 재제출 완료.
  - 신규 바이럴 가이드 4종(ADHD 탭 마비, 뇌 배터리 12%, 브레인 롯, 보복성 취침 미루기) sitemap & IndexNow 완료.
- Trend Content & Portal UX:
  - 보복성 취침 미루기 & 수면 부채 실시간 진단기 배포, 포털 히어로 1순위에 Stress Check 전면 배치.
- Test Harness:
  - 아티클 인벤토리 3,882건 및 하네스 전수 검증 100% 통과 (1,491개 URL 0 issues).

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
