# DopaBrain current status

Updated: 2026-11-21 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-21 40-Tool Wellness Lab (12/12 i18n), 12-Lang Affiliate UI, 285 Bridge Repairs & Leak Fix
- **2 Submodules Deployed & Verified Live (`portal @ b96e621`, `root-domain @ a49d24b`)**: Plugged 100% of `127.0.0.1` AdSense/GA4 Playwright leaks (71 globs across 22 scripts + `BAD_GLOB_RE`). Shipped **23 more 12-lang tools** (#12–#34: overthinking, social-battery, somatic-map, energy-audit, gaslighting, codependency, perfectionism, social-anxiety, vagal-reset, doomscrolling, inner-child, decision-fatigue, flashback-grounding, anxiety-vs-panic, emotional-exhaustion, emotional-validation, abandonment-soother, nvc-conflict, morning-energy, emotional-trigger, workplace-stress, grief-companion, green-flag-audit) + **40-Tool Mental Wellness Lab** (`/portal/tools/wellness-lab.html`, 480 localized cards across 12/12 langs, `CATALOG_COUNT=82`, wired across all 6 portal hubs & 16 MBTI pages). Monetized **+117 organic blogs** (`1,197` curated), repaired **285 orphaned/unstyled `.bm-tb-cta` bridges** + upgraded **290 funnels**, added **12-locale curated Amazon card localizer & exact `data-tool-slug` bridge telemetry** in `blog-monetization.js` (~1,250+ pages), upgraded **320+ blogs & 12 locale hubs** to `.png` OG + `max-image-preview:large`, and updated `llms*.txt` & `404.html`.
- **Verifier Promotion & Live Proof**: `verify-wellness-tools-suite.js` (**41/41**, 34 new tools + 40-tool hub), `verify-blog-monetization.js` (**17/17** incl. Discover/zero-SVG-OG/zero-orphan-bridge/12-lang affiliate/slug telemetry), `verify-portal-tools.js` (50 tools), `verify-kpop-role-roster.js` (52/52) & `verify-mbti-career-retirement.js` (11/11) at `CATALOG_COUNT=82`; passed **149/149 `npm run harness`**, `health-guard`, `funnel-bridge` (4,069 files), `indexing-inventory` (1,588 URLs, 0 issues), `trust-audit`, live Playwright, and IndexNow `200 OK`. Review: **2026-11-28** (funnel/leak) / **2026-12-19** (SEO).

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
