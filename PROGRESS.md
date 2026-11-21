# DopaBrain current status

Updated: 2026-11-22 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-22 Wave 48 Early-Scroll Mid-Article Tool Strip (1,197 Blogs), 100% Hreflang Parity & GSC/IndexNow Sync
- **Matured 7d Proof (`2026-11-15..21`, `11-14`/`11-15` READY cohorts)**: AdSense 7d earnings jumped **+86%** (`$0.22` → **`$0.41`**, RPM `$0.33`, FR **`$4.23 RPM`**, DE `$1.39 RPM`); SG Direct dropped **-76%** (exited Top 25 AdSense PV); GA4 `content_sticky_cta_view` hit **151/7d** (5.2× velocity) & `curated_resource_view` hit **15/7d**. Refreshed all 3 sitemaps in GSC (`portal/sitemap.xml` `283` → **328 URLs**).
- **Wave 48 (`portal @ 11e712d`)**: Added zero-bloat early-scroll mid-article interactive tool companion strip (`#bmMidJump`, `blog_mid_tool_cta_view`/`click`, 12 langs, 44px touch, 0px overflow) in `blog-monetization.js`/`.css` across **1,197 monetized blogs** (targeting 1.00–1.08 PV/sess Bing/DDG/Ecosia/Naver/ChatGPT organic landings like `fr/jeux-entrainement-cerveau-2026.html`), fixed all **11 missing `x-default`/FR `hreflang` clusters** (**0/153** gaps), promoted `bm-mid-jump-removed` into `verify-blog-monetization.js` (**22/22**), verified live on `https://dopabrain.com`, and batch-submitted all 50 Mental Wellness Labs to IndexNow (`200 OK`). Review: **2026-11-29** (funnel) / **2026-12-20** (SEO).

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
