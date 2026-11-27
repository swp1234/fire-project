# DopaBrain current status

Updated: 2026-11-27 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-27 Waves 61–70 — 120-Tool Wellness Lab (`CATALOG_COUNT=162`), +108 EN/DE/FR/JA Guides & Global Promo
- **Matured Cohort Proof (`2026-11-19` READY, `11-22..25`)**: `127.0.0.1` AdSense PV leak stayed **0 for 4d**; daily `dopabrain.com` revenue stabilized at **`$0.06/day`** (`$0.50–$0.76` RPM, ~2× prior `$0.031/day`). Nov 1–25 RPM: CA `$5.05`, FR `$4.09`, DE `$2.46`, AT `$1.84`, JP `$1.31`. GA4 `11-19..25`: Sticky CTR **`21.1%`** (`31/147`), `curated_resource_view=25`, `blog_tool_bridge_view=23`, `blog_quick_check_interact=7`.
- **Waves 61–70 (`portal` `a74c1bd`, `root-domain` `1ab2aea`, `attachment-style` `25b2858`)**: Guard #26 (`26/26`); expanded Mental Wellness Lab `80 → 120` tools (`CATALOG_COUNT=162`, `1,440` 12-locale cards, `llms*.txt` synced); shipped **108** `en/de/fr/ja` guides (`1,390` sitemap blogs); upgraded `attachment-style/index.html` (`clarity.*` untouched, **47/47** Discover/preconnect); promoted **20** public GitHub repos (SEO/topics/READMEs) + 3 GitHub Releases (`v2026.11-120-wellness-labs`) + multi-channel launch kit; passed `19/19` harness (`1,813` unique URLs `0` issues), `162/162` portal tools Playwright, live `200 OK`, GSC (`1,815` URLs), IndexNow. Review: **2026-12-04** (funnel) / **2026-12-25** (SEO).
- **Side Project — TokenLedger v6.0 (`94fa098`, CF `b9d542de`)**: 30 flagship LLMs, 18 browser-private FinOps workspaces, 120 HTML pages (`149/149` live `200 OK`, CI `success`, Cloudflare Web Analytics + GSC + IndexNow `120/120`, GitHub `v6.0.0` release, DEV.to `#showdev` live, Disquiet submitted; GeekNews unlocks **2026-12-03**).

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
