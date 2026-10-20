# DopaBrain current status

Updated: 2026-10-20 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-10-20)**: Policy violations 0 (`{}`). 7일 누적 **$0.33** (직전 $0.26 대비 +27%), 이달 누적 **$1.04** (직전 $0.91 대비 +14%).
- 핵심 대책: 포털 블로그 404 데드 링크 전수 복구 완료 상태 유지, GSC 사이트맵 및 IndexNow 8대 핵심 진입면 URL 갱신 통보로 인덱싱 복구 가속, 모바일 44px 터치 타깃 불변식 엄수.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, 2048 Coach 200s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-20) — 상세 설계: `docs/STRATEGY.md`

- **P0 색인 갱신 및 유기적 검색 회복**:
  - GSC Webmasters API로 3종 사이트맵(`sitemap.xml`, `portal/sitemap.xml`, `portal/blog/sitemap.xml`) 갱신 및 IndexNow 8대 진입면 통보 완료.
  - 검색 콘솔 '크롤링됨 - 현재 색인 생성되지 않음' 상태의 핵심 진입면(`stress-check`, `hsp-test`, `2048/coach`, `brain-type`, `future-self`) 유기적 순위 회복 촉진.
- **P1 모바일 a11y & 터치 타깃 불변식 보장**:
  - 모바일(390x844) 가로 오버플로 0px 및 최소 터치 타깃 44px 엄격 준수.

## Latest release: Mobile Touch-Target & UX Invariant Audit Across 11 Submodules (2026-10-20)

- Submodules: `ai-personality` (`fad709c`), `toxic-trait` (`64d99cf`), `mbti-love` (`16537d5`), `emotion-iceberg` (`7b7c1c6`), `mbti-coffee` (`04c8a38`), `routine-planner` (`9e8ebf0`), `shadow-work` (`ecd46fc`), `villain-origin` (`9a1b7cd`), `dark-core` (`35b60e5`), `pomodoro-timer` (`1087548`), `habit-tracker` (`b0056f4`).
- UX & Touch Target Compliance:
  - 11개 서브모듈 전수 Playwright 검사: `.skip-link`, `.brand`, `.back-link`, `.lang-btn`, `#theme-toggle`, `.trust-panel a`, `footer a` 대상 44px 최소 터치 타깃 규격 전면 확장 완료.
  - 모바일(390x844) 가로 오버플로 0px 유지 및 12개 로케일 UI 정렬 완료. GitHub Pages 11개 서브모듈 배포 상태 `built` 확인.
- Indexing & Verification:
  - 각 서브모듈 전용 신뢰/계약 검증기 (`verify-ai-personality`, `verify-toxic-trait`, `verify-mbti-love`, `verify-emotion-iceberg-trust`, `verify-mbti-coffee-trust`, `verify-routine-planner-trust`, `verify-en-shadow-reflection`) 및 뮤테이션 테스트 100% PASS.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
