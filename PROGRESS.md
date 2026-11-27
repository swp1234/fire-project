# DopaBrain current status

Updated: 2026-11-28 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-28 Waves 61–77 — 140-Tool Wellness Lab (`CATALOG_COUNT=182`), +208 EN/DE/FR/JA Guides & TokenLedger v8.0
- **Matured Cohort Proof (`2026-11-19` READY, `11-22..25`)**: `127.0.0.1` AdSense PV leak stayed **0 for 4d**; daily `dopabrain.com` revenue stabilized at **`$0.06/day`** (`$0.50–$0.76` RPM, ~2× prior `$0.031/day`). Nov 1–25 RPM: CA `$5.05`, FR `$4.09`, DE `$2.46`, AT `$1.84`, JP `$1.31`. GA4 `11-19..25`: Sticky CTR **`21.1%`** (`31/147`), `curated_resource_view=25`, `blog_tool_bridge_view=23`, `blog_quick_check_interact=7`.
- **Waves 61–77 (`portal` `8cb1dde`, `root-domain` `97595f9`, `attachment-style` `25b2858`)**: Guard #26 (`26/26`); expanded Mental Wellness Lab `80 → 140` tools (`CATALOG_COUNT=182`, `1,680` 12-locale cards, `llms*.txt` synced); shipped **208** `en/de/fr/ja` guides (`1,490` sitemap blogs); refreshed 2 KO `90d` blogs (`2026-11-28`); **47/47** active apps Discover/preconnect (`clarity.*` untouched); `v2026.11-140-wellness-labs` release; passed `19/19` harness (`1,935` raw / `1,933` unique `0` issues), `182/182` tools Playwright, `53/53`+`52/52`+`11/11` mutations, live `200 OK`, IndexNow. Review: **2026-12-05** (funnel) / **2026-12-26** (SEO).
- **Side Project — TokenLedger v8.0 (`6ece44c`, CF `a2ca6e3d`)**: **40** flagship LLMs, **22** browser-private FinOps workspaces (+Cache TTL ROI & LLM-as-a-Judge Eval Budget), **140** HTML pages (`173/173` live `200 OK`, CI `success`, IndexNow `140/140`, `v8.0.0` release, DEV.to `#showdev` live, Disquiet submitted; GeekNews unlocks **2026-12-03**).
- **Deferred Promo TODO**: Direct community posting for DopaBrain (DEV.to `#showdev`, Disquiet, GeekNews Show GN after `2026-12-03`, Show HN) & TokenLedger GeekNews queued in `docs/MARKETING-VIRAL-HOOKS.md`; current focus is development only.

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
