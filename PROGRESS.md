# DopaBrain current status

Updated: 2026-10-01 KST. Release history is in `memory/data-check-log.md`; the repeatable loop is in the `dopabrain-growth-ops` skill.

## Target and status

- Target: `$1.40` per completed seven days (`$0.20/day`).
- **AdSense Health & Revenue Status (2026-09-26)**:
  - Policy issues API: 0 violations (`{}`). Serving restriction completely lifted.
  - Earnings trajectory: Completed 7 days (Sep 19–25) total **$0.42** (474 impressions, 2,134 page views). Daily: Sep 19 $0.11, Sep 20 $0.04, Sep 21 $0.10, Sep 22 $0.07, Sep 23 $0.05, Sep 24 $0.03, Sep 25 $0.03.
  - High-Value Tier 1 RPM: US RPM **$2.75**, Canada **$3.81**, Germany **$2.63**, UK **$8.91**, Poland **$10.21**, Cyprus **$61.47**, Saudi Arabia **$8.28**.
  - Production `dopabrain.com` generated 100% of impressions and revenue.
  - Address PIN verification remains an account-level payment threshold notice, not an ad delivery restriction.

## Current operating rules

- Keep 36 legacy apps in the invalid-traffic suspension contract: no loader, manual unit, request push, H5 game-ad loader, rewarded exchange, or ad-completion unlock.
- Exclude Singapore desktop Direct scans (average duration 4.5s) and China Direct bursts from growth and product performance decisions.
- Focus organic traffic growth on high-engagement core products (Stress Check: 95~175s dwell time, Future Self: 178s dwell time, HSP Test: 63s dwell time, Brain Type: 122s dwell time).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-10-04) — 상세 설계는 `docs/STRATEGY.md`

- 진단: Google 비-`site:` 노출 3회/3개월, 핵심 도구 `Crawled - currently not indexed`. 최근 7일 `$0.55` (`$0.079/day`). 원인 = 주제이탈 대량 블로그 + 얇은 핵심 페이지 + above-the-fold 광고 과밀.
- **동결**: Tier 파이프라인(262/263 취소), 좌측 사이드바 내비 보류.
- **P0 품질 정리 — 배포 완료 (2026-10-04)**: portal `163e74a`, root `91de5c7`.
  - `scripts/blog-topic-prune.js` 추가(`npm run verify:blog-topic-prune`). 블로그 사이트맵 1,884행 제거(운영 1,207행, roblox 0 확인).
  - `blog-indexing-focus.js --apply`로 noindex 2,174 / 유지 1,491. drift 기준 3874. 인벤토리 1,482 unique / 0 issue. adsense-contract 11/11, restricted-ads 36/36 PASS.
  - 운영 샘플 확인: Roblox·게임신경과학 기사 `noindex,follow`, 유지 심리 기사 `index`.
- P1 핵심 페이지(stress-check, hsp-test, brain-type) 본문·FAQ·schema·About: 미착수.
- P2 AdSense UI(관련 검색 끄기/제외 영역, 광고 로드 1단계 하향): 사용자 액션 대기.
- P3: GSC MCP는 읽기 전용(`submit_sitemap` Insufficient Permission), `npm run gsc:submit-sitemaps`는 Codex 격리 설정 필요 → **사용자가 GSC UI에서 사이트맵 3개 재제출 + 핵심 URL 10개 색인 요청**(목록은 `docs/STRATEGY.md` P3). IndexNow 재통지는 미실행.

## Last content release: Tiers 260-261 (2026-10-01), `projects/portal` `4b4333e`. Tier 확장은 이후 동결.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
