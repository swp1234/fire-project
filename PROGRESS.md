# DopaBrain current status

Updated: 2026-10-04 KST. Release history is in `memory/data-check-log.md`; repeatable loop is in `dopabrain-growth-ops`.

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-09-26~10-02)**: Policy violations 0 (`{}`). Completed 7 days total **$0.55** (~$0.079/day). Tier 1 RPM: US $4.25, DE $5.87, CA $7.38. Address PIN remains threshold notice, not delivery block.
- Production `dopabrain.com` generated 100% of impressions and revenue.

## Current operating rules

- Keep 36 legacy apps in invalid-traffic suspension contract.
- Exclude Singapore desktop Direct scans (4.5s) and China bursts from decisions.
- Focus organic growth on core tools (Stress Check 95~175s, Future Self 178s, HSP Test 63s, Brain Type 122s).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-04) — 상세 설계: `docs/STRATEGY.md`

- 진단: Google 비-`site:` 노출 3회/3개월, 핵심 도구 `Crawled - currently not indexed`. 원인 = 주제이탈 블로그 + 얇은 핵심 페이지 + above-the-fold 광고 과밀.
- **동결**: Tier 파이프라인(262/263 취소), 좌측 사이드바 내비 보류.
- **P0 품질 정리 — 배포 완료**: portal `163e74a`, root `91de5c7`. `blog-topic-prune.js`로 사이트맵 1,884행 제거(1,207 유지). `blog-indexing-focus.js` noindex 2,174 적용.
- **P1 핵심 페이지 강화 — 배포 완료**:
  - Stress Check (`e3dccae`), HSP Test (`f78024d`), Brain Type (`5ec10cc`), Future Self (`276d977`), IQ Test (`fedf1c4`), Animal Personality (`7cb147e`), K-pop Position (`e179d54`), Daily Tarot (`4d16547`): 학술 프레임워크, FAQ 스키마/DOM 일치, 12개 언어 i18n 동기화, hreflang 고정 완료.
- **P2 AdSense UI 설정 완료**: 광고 인텐트(의도 기반 형식) 비활성화로 모바일 레이아웃 보호, 광고 로드 1단계 하향.
- **P3 색인 신호 전송 — 완료**: GSC 5개 URL 색인 요청 + IndexNow 10개 핵심 도구 및 가이드 갱신 제출 (HTTP 200).

## Latest release: Full Harness Gate Pass & Core Focus (2026-10-04)

- Submodules: portal `cf7defd`, root-domain `f6e2407`, daily-tarot `4d16547`, stress-check `e3dccae`, hsp-test `f78024d`, brain-type `5ec10cc`, future-self `276d977`, iq-test `fedf1c4`, animal-personality `7cb147e`, kpop-position `e179d54`.
- Root domain (`f6e2407`): 정규 6선 `top-picks` 복구 및 비정상 정렬 탭 제거, `verify:root` & `verify:root:mutations` 14/14 패스.
- Portal (`cf7defd`): 768개 색인 블로그 잔존 수동 광고/인텐트 정리 완료(단일 Auto Ads 로더 원칙 준수), `ko/2026-brain-training-top-10` hreflang 정규화.
- 전체 하네스 워크플로(`node scripts/harness-workflow-check.js`): 100+개 테스트, 뮤테이션, 텔레메트리, 런타임 스모크 전 항목 100% PASS 달성.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.

