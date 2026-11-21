# DopaBrain current status

Updated: 2026-11-22 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-22 50-Tool Wellness Lab (600 12-Lang Cards), 1,111 Blog Quick-Checks, Calm Pacer & Chain
- **13 Submodules Deployed & Verified Live (`portal @ eedda2b`, `root-domain @ 031fb6b`, +11 flagship apps)**: Completed Waves 37–47! Expanded `/portal/tools/wellness-lab.html` to **50 Free Interactive Mental Wellness Labs × 12 languages (600 cards)** (`CATALOG_COUNT=92`, +10 new flagship tools #35–#44: fawn, freeze-thaw, hypervigilance, self-worth, sensory-calm, avoidant-thaw, anger-cooldown, guilt-filter, loneliness-plan, sunday-reset) with instant local `#labSearch`, 6 12-lang mood chips, and local Recent Labs strip. Shipped shared 12-lang **60s Physiological Sigh Calm Pacer** (`tool-calm-pacer.js`), **3-card Next-Lab Chain** + full 12-lang H1/title/chrome localization (`blog-monetization.js` + `wellness-lab-leads.json`), **Story Card v2** (`1080×1920` 12-lang viral footer), **+386 Quick-Checks** (`1,111` total), **+220 blog bridges**, 12 blog hub quick-lab strips, `portal/games/` affiliate/CTA fix, **100% portal tool preconnect (60/60)**, **22/22 hub 44px touch parity**, zero-404 OG (+118 `twitter:image`), `@media print` CSS, and `rel="sponsored"`/Discover/preconnect across 11 flagship apps.
- **Verifier Promotion & Live Proof**: `verify-wellness-tools-suite.js` (**53/53**), `verify-blog-monetization.js` (**21/21** incl. `app-missing-sponsored-rel`, `bm-next-chain-removed`, `broken-og-image-404`, `>=1100` quick-checks), `verify-portal-tools.js` (61 tools), `verify-kpop-role-roster.js` (**52/52**) & `verify-mbti-career-retirement.js` (**11/11**) at `CATALOG_COUNT=92`; passed **FULL 149/149 `npm run harness`**, `health-guard`, `funnel-bridge` (4,079 files), `indexing-inventory` (1,602 URLs, 0 issues), `trust-audit`, live Playwright, and IndexNow `200 OK`. Review: **2026-11-29** (funnel) / **2026-12-20** (SEO).

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-20)**: Policy violations 0 (`{}`), user-owned PIN hold acknowledged/in progress (do NOT re-warn). 30d `dopabrain.com`: **$1.73** (`6,568` PV, `2,085` imp, `55.6%` Active View). Country RPM: DE `$3.41`, FR `$3.17`, US `$1.24`.
- GA4 (28d): Organic Search `311` sess / `467` PV (`1.50` PV/sess; US `1.04`), AI Assistant `16` sess (`81%` engaged).
- 고체류 핵심 진입면: Stress Check, HSP Test, Future Self, 2048 Coach, IQ Test, Color Blindness, White Noise, K-pop Position.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise, K-pop Position).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-12) — 상세 설계: `docs/STRATEGY.md`

- **P0-P3 SEO/GEO & Funnel Foundation (완료)**: IndexNow 송출 (`200 OK`), `llms*.txt` (`658524e`), 3대 킬러앱(Stress Check/HSP/Future Self) 1080x1920 스토리 카드·도서 큐레이션, 소셜 훅(`docs/MARKETING-VIRAL-HOOKS.md`), 4,034파일 퍼널 무결점 & 119개 레지스트리 동기화.

- **Hub Indexing & Monetization (`2026-11-14`)**: EN SEO, `window.i18n`, `stress-type`/`soul-age`/`dream-fortune` UX, Cloudflare WAF/TLS `1.2`, `/portal/` 419개 허브 링크(`TRUE_INDEXABLE_ORPHAN=0`), 7개 오가닉 `.revenue-sticky-cta`, protected `attachment-style/clarity.*` & 36 suspended apps untouched.
