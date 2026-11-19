# DopaBrain current status

Updated: 2026-11-19 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-19 Portfolio-Wide Blog Monetization, 12-Locale Interactive CRO, 29-App Funnel & RPM Shield
- **31 Submodules Deployed & Verified Live (`portal @ 266ebf6`, `root-domain @ d032e9b`, 29 Active Apps)**: Upgraded 1,080 unlocked sitemap blog pages (12-locale `.curated-resources-card` Amazon `dopabrain-20` + `rel=sponsored`, scroll `.revenue-sticky-cta-wrap`, AdSense/GA4 `preconnect`, 255 `.svg`→`.png` OGs, 52 `ad-loader.js` migrations), **611** accessible 60s `.bm-quick-check` widgets across **all 12 languages**, and 5 wellness tools. Added `aocr.org`/`gipkd.com` spam-referrer guard to `ad-loader.js`, HEAD-verified smart 404 recovery + 44px chips in `root-domain/404.html`, `aura-score` 1080×1920 story card, **100% (29/29)** unlocked active apps with 12-locale `#nextStepCard` + `preconnect`, and fixed 16 GA4 `gtag()` blackouts (`[WAIT]` cohort & `clarity.*` untouched).
- **Verifier Promotion & Live Proof**: Promoted `scripts/verify-blog-monetization.js` (10/10 mutations), `quality-gate.sh` managed `ad-loader.js`, and `listenOnSafePort` in `verify-sensory-load-map.js`; passed 148/148 `npm run harness`, 31/31 GitHub Pages exact-SHA builds, live Playwright on `https://dopabrain.com`, `trust-audit` (119/119 synced), and IndexNow `200 OK` (78 URLs). Earliest review: **2026-11-26** (funnel/affiliate) / **2026-12-17** (SEO).

## Target and status

- Target: `$1.40` / 7 completed days (`$0.20/day`).
- **AdSense Status (2026-11-15)**: Policy violations 0 (`{}`), user-owned PIN hold already acknowledged/in progress (do NOT re-warn or ask again). 7d **$0.22**, 30d **$1.62**, MTD **$0.53** (`11,418` PV, `$0.14` RPM). Tier-1 human RPM: US `$1.82`, FR `$2.62`, DE `$3.70`, BE `$2.82`; SG `$0.00` (`3,963` PV scan noise).
- GA4 (28d): `7,407` page_view (`1,151` ad_impression, `115` content_sticky_cta_view, `89` content_cta_click), `268` Organic Search (`1.57` PV/session).
- 고체류 핵심 진입면: Stress Check, HSP Test, Future Self, 2048 Coach, IQ Test, Color Blindness, White Noise, K-pop Position.

## Current operating rules

- 포트폴리오 비중: 신규 인터랙티브 40% : 핵심 진입면 강화 35% : SEO/인프라 25%.
- Keep 36 legacy apps in invalid-traffic suspension contract.
- Focus organic growth on core tools (Stress Check, Future Self, HSP Test, 2048 Coach, Brain Type, IQ Test, Color Blindness, White Noise, K-pop Position).
- Preserve user-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` untouched.

## Active plan (2026-11-12) — 상세 설계: `docs/STRATEGY.md`

- **P0-P3 SEO/GEO & Funnel Foundation (완료)**: IndexNow 송출 (`200 OK`), `llms*.txt` (`658524e`), 3대 킬러앱(Stress Check/HSP/Future Self) 1080x1920 스토리 카드·도서 큐레이션, 소셜 훅(`docs/MARKETING-VIRAL-HOOKS.md`), 4,034파일 퍼널 무결점 & 119개 레지스트리 동기화.

- **Hub Indexing & Monetization (`2026-11-14`)**: EN SEO, `window.i18n`, `stress-type`/`soul-age`/`dream-fortune` UX, Cloudflare WAF/TLS `1.2`, `/portal/` 419개 허브 링크(`TRUE_INDEXABLE_ORPHAN=0`), 7개 오가닉 `.revenue-sticky-cta`, protected `attachment-style/clarity.*` & 36 suspended apps untouched.
