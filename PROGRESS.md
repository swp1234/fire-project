# DopaBrain current status

Updated: 2026-11-24 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-24 Waves 49–58 — 70-Tool Wellness Lab, 100% Blog/Tool/App Monetization, 24 Tier-1 EN/DE/FR Guides & 12-Locale App Bridge Sync
- **Live Data Proof (`2026-10-27..11-23`)**: `127.0.0.1` AdSense PV leak dropped to **0** on `11-22` & `11-23` (daily `dopabrain.com` Page RPM jumped to **`$0.61`** & **`$0.76`**; Mobile RPM `$1.06` = 3.4× Desktop `$0.31`; Tier-1 RPM: CA `$5.32`, NZ `$5.08`, FR `$3.62`, DE `$3.11`, US `$1.12`). All `11-19`/`11-21`/`11-22` cohorts remain in `WAIT` maturation gates (`11-26`/`11-28`/`11-29`).
- **Waves 49–58 (`portal`, `root-domain`, +40 active apps)**: Monetized **334** remaining blogs (100% of `1,273` sitemap blogs + `282` non-sitemap indexable blogs) + all **8** remaining high-traffic `/portal/tools/*.html` (Palworld/K-pop/Emotion/Past-Life), expanded Mental Wellness Lab `50 → 70` tools (`CATALOG_COUNT 92 → 112`, `840` 12-locale cards), published **24** high-RPM `en/de/fr` companion guides (8 clusters × 3 langs, 4-card quick rail, PNG OG), upgraded `root-domain` (`og-image.png`) & `future-self` from SVG→PNG OG, fixed untagged Amazon links (`iq-test`/`future-self`/`kpop-position`), wired `38` active standalone apps with localized `?lang=`-preserving Wellness Lab bridges (`blog-monetization.js` `BRIDGE_APP_I18N`), promoted 3 new mutations into `verify-blog-monetization.js` (**25/25**), verified `19/19` release harness + `1,646` unique URLs (`0` issues), refreshed GSC sitemaps (`1,648` raw URLs) & IndexNow (`200 OK`). Review: **2026-12-01** (funnel) / **2026-12-22** (SEO).

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
