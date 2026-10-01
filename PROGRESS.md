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

## Tomorrow Roadmap (내일 작업 목록)

- **[최우선] DopaBrain 전체 콘텐츠 탐색성 개선 (좌측 카테고리별 목록 네비게이션)**:
  - 사용자가 DopaBrain 내의 다양한 콘텐츠(심리/성격 테스트, 인지/두뇌 훈련 게임, 감정 회복 도구, 게임 테크 & e스포츠 뇌과학 가이드)를 한눈에 쉽게 파악하고 탐색할 수 있도록 좌측 카테고리별 목록(Sidebar / Drawer Nav) UI 구축.
  - 데스크톱: 좌측 카테고리별 아코디언/트리 뷰 메뉴 (블로그 레이아웃과 조화).
  - 모바일: 햄버거 드로어 또는 접이식 카테고리 바 (터치 타깃 최소 44px, 가로 오버플로 0px 엄수).
- **콘텐츠 지속 확장 (Tiers 262-263 준비 완료)**:
  - Tier 262: `roblox-custom-dynamic-weather-rain-snow-particle-guide` (카메라 상대 날씨 파티클, 지붕 차폐 레이캐스트).
  - Tier 263: `horror-game-jump-scare-acoustic-startle-limbic-neuroscience` (청각 놀람 반사, 편도체 하이재킹).

## Latest release: 3,366 Clean URLs - Roblox Voxel Mining & Stealth Sensory Deprivation Neuroscience (2026-10-01)

- **Roblox Voxel Terrain Mining & Stealth Sensory Deprivation (Tiers 260-261 - 3,366 Clean URLs)**:
  - Tier 260: 12-language Roblox Dynamic Voxel Terrain Architecture: Real-Time Smooth Terrain APIs, Voxel Density Operations & Debris Physics `roblox-custom-voxel-terrain-digging-dynamic-mesh-guide.html`.
  - Tier 261: 12-language Stealth Game Neurobiology: Sensory Deprivation, Acoustic Hypervigilance & Parasympathetic Rebound `stealth-game-sensory-deprivation-auditory-hypervigilance-neuroscience.html`.
  - Canonical inventory verified: exactly **3,366 clean unique URLs (0 issues, 0 blockers)**.
- **Verification & Deployment**: Full verification suite PASS (`indexing-inventory` 3366/0, Restricted Ads 36/36, Mobile Overflow 0px). Submodule `projects/portal` committed (`4b4333e`) and pushed.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
