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
  - Stress Check (`e3dccae`): PSS-10 프레임워크, 4개 점수 구간, 5개 FAQ, 학술 참고문헌, 12개 언어 i18n 동기화 (`verify:stress-core` 16/16).
  - HSP Test (`f78024d`): SPS 프레임워크, 3단계 감각 구간, 5개 FAQ, Aron 1997 등 문헌, 12개 언어 i18n 동기화 (`verify:hsp-reset-funnel` 13/13).
  - Brain Type (`5ec10cc`): 5개 인지 차원, 4개 인지 FAQ, Kahneman/Sternberg 문헌, 12개 언어 i18n 동기화 (`verify:brain-trust` 10/10).
  - Future Self (`276d977`): Future Self Continuity 프레임워크, 8개 아키타입, 3개 FAQ, Hershfield/Seligman 문헌, 12개 언어 i18n 동기화 (`verify:future-self-funnel` 15/15).
  - IQ Test (`fedf1c4`): 4개 인지 영역(Pattern/Sequence/Logic/Spatial), 점수 해석, 5개 FAQ, Raven/Cattell 문헌, 12개 언어 i18n 동기화 (`verify:iq-completion-reset` 10/10).
- **P2 AdSense UI 설정 완료**: 광고 인텐트(의도 기반 형식) 비활성화로 모바일 레이아웃 보호, 광고 로드 1단계 하향.
- **P3 색인 신호 전송 — 완료**: GSC 5개 URL 색인 요청 + IndexNow 6개 핵심 도구 및 가이드 갱신 제출 (HTTP 200).

## Latest release: P0 Topic Pruning & P1 Core Content Enrichment (2026-10-04)

- Submodules: portal `64b1105`, stress-check `e3dccae`, hsp-test `f78024d`, brain-type `5ec10cc`, future-self `276d977`, iq-test `fedf1c4`.
- Tier 확장은 이후 동결 유지.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
