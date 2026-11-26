# DopaBrain current status

Updated: 2026-11-26 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-26 Waves 61–62 — 90-Tool Wellness Lab (`CATALOG_COUNT=132`), 12 EN/DE/FR/JA Guides, 11-Hub CTA Fix & Guard #26
- **Matured Cohort Proof (`2026-11-19` READY, `11-22..25`)**: `127.0.0.1` AdSense PV leak stayed **0 for 4 consecutive days**; daily `dopabrain.com` revenue stabilized at **`$0.06/day`** (`$0.50–$0.76` RPM, ~2× prior `$0.031/day`). Nov 1–25 country RPM: CA `$5.05`, FR `$4.09` (`$0.24`/58 PV), DE `$2.46`, AT `$1.84`, JP `$1.31` (`4.63` imp/PV). GA4 `11-19..25`: Sticky CTA CTR **`21.1%`** (`31/147`), `curated_resource_view=25`, `blog_tool_bridge_view=23`, `blog_quick_check_interact=7`; Bing Organic (`fr/jeux-entrainement-cerveau-2026`, `zh/dopamine-detox-guide-reset-brain`) drives `63–78%` engagement.
- **Waves 61–62 (`portal` `ff5586d`, `root-domain` `6ed33c2`)**: Repaired 11 non-EN blog hub broken Wellness Lab hero CTAs (PowerShell `$180$2` corruption) + `ja/index.html` Hangul typo and promoted permanent `blog-hub-broken-wellness-cta` mutation into `verify-blog-monetization.js` (**26/26**); added **12** high-RPM `en/de/fr/ja` companion guides (Zoom fatigue, working-memory brain training, public speaking); expanded Mental Wellness Lab `80 → 90` tools (`CATALOG_COUNT 122 → 132`, `1,080` 12-locale cards); verified `19/19` release harness (`1,687` unique URLs `0` issues, `4,164` funnels clean) + live `200 OK` + GSC (`1,689` raw URLs) + IndexNow. Review: **2026-12-03** (funnel) / **2026-12-24** (SEO).

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
