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

## Latest release: Mobile Touch-Target & UX Invariant Audit Across 10 Interactive Submodules — Batch 10 (2026-10-23)

- Submodules: `lottery` (`21bbe41`), `aura-reading` (`2d315b3`), `mbti-city` (`00e1c34`), `number-puzzle` (`e38fd56`), `color-memory` (`898111d`), `word-guess` (`185185b`), `snake-game` (`a735057`), `memory-card` (`6d8d803`), `pong-game` (`fb71790`), `flappy-bird` (`de4ecd0`).
- UX & Touch Target Compliance:
  - 10개 인터랙티브·게임 서브모듈 Playwright 모바일(390x844) 전수 감사 결과 0 issues (100% PERFECT).
  - 테마/사운드 토글(44px 원형 버튼), 뒤로가기 링크(`.back-link`, `.home-link`), 본문 건너뛰기(`.skip-link`), 난이도 버튼(`.diff-btn`), 체크박스 래퍼(`.skip-preview-toggle`) 등 전수 44px 이상 터치 영역 확장 및 `touch-action: manipulation` 적용 완료.
  - 모바일(390x844) 가로 오버플로 0px 엄수.
  - 10개 서브모듈 Pre-push 품질 게이트(Quality Gate) 전원 PASS 및 origin 원격 배포 완료.
- Verification & Invariants:
  - `verify:root` (24/24), `verify:indexing-inventory` (0 issues), `verify:adsense-contract` (11/11 mutations), `verify:tracked-secrets` (232 files), `verify:docs` (10/10) 전수 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
