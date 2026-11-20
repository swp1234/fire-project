# DopaBrain current status

Updated: 2026-11-21 KST. Release history: `memory/data-check-log.md`; ops loop: `dopabrain-growth-ops`.

## Latest release: 2026-11-21 11-Tool Interactive Wellness Lab, 1080×1920 Story Cards, 1,080 Blog Bridges & Hub/AI Monetization
- **3 Submodules Deployed & Verified Live (`portal @ 5cc3dd3`, `root-domain @ 8cd4a24`, `work-style @ cdcfd03`)**: Shipped **11 brand-new 12-language interactive tools** (`cognitive-distortion-reframer`, `rsd-coping-audit`, `attachment-trigger-decoder`, `sleep-chronotype-reset`, `procrastination-root-decoder`, `daily-mind-checkin`, `imposter-syndrome-audit`, `boundary-script-builder`, `window-of-tolerance-check`, `adhd-focus-friction-audit`, `inner-critic-compassion-lab`) with visible `.faq-grid` parity, XSS-safe local inputs, `ad-loader.js` + `preconnect`, Amazon `dopabrain-20` (`rel=sponsored`), and **1080×1920 PNG Story Cards** (`tool-story-card.js`). Upgraded **6 existing flagship tools** (`burnout-stress-differential`, `cognitive-load-calculator`, `decision-matrix`, `dopamine-detox-protocol`, `grounding-exercise`, `brain-game-workout`), **1,080/1,080** unlocked sitemap blogs with localized `.bm-tool-bridge` cards, **16 MBTI type pages** + **5 portal hubs** (`tools`, `tests`, `mbti`, `games`, `blog` incl. 75px mobile overflow fix), **30 `.svg`→`.png` OGs**, `work-style` curated books, and `llms*.txt` (fixed 404 link) + Smart `404.html` aliases (`[WAIT]` cohort & `clarity.*` untouched).
- **Verifier Promotion & Live Proof**: Created `scripts/verify-wellness-tools-suite.js` (17/17 mutations + 390×844/1440×900 Playwright/XSS/canvas), expanded `verify-blog-monetization.js` (11/11 mutations incl. zero-404 `llms*.txt`), hardened `portal-hub-locale-audit.js` offline routing, synced `CATALOG_COUNT=59`; passed **149/149 `npm run harness`**, `health-guard`, `funnel-bridge`, `indexing-inventory` (1,568 URLs, 0 issues), `trust-audit`, live Playwright on `https://dopabrain.com`, and IndexNow `200 OK`. Earliest review: **2026-11-28** (funnel/cards/affiliate) / **2026-12-19** (SEO).

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
