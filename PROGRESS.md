# DopaBrain Current State

Updated: 2026-09-01

This file contains current operating state only. Decision-changing measurements belong in `memory/data-check-log.md`; reusable procedure belongs in the `dopabrain-growth-ops` skill; durable test contracts belong in `docs/VALIDATION.md`.

## Objective

- Raise rolling 7 complete-KST-day AdSense revenue from `$0.67` to `$1.40` (`$0.20/day`), then toward `$1/day`.
- Exclude deployment days, partial current days, and Singapore desktop Direct scans from decisions.
- Change one independently measurable path at a time and preserve its observation window.

## Baseline and portfolio

- 2026-08-25~31 AdSense: `$0.67`, 1,950 pageviews, 756 impressions, 21 clicks, Page RPM `$0.34`; prior seven days were `$0.63 / 1,785 PV / $0.35 RPM`. The target remains `$1.40` per seven complete days.
- Country opportunity: US `$0.15 / 54 PV / $2.85 RPM`; KR `$0.18 / 288 PV / $0.63 RPM`; CN `$0.18 / 601 PV / $0.30 RPM`; FR `$0.04 / 40 PV / $1.04 RPM`.
- 2026-08-31 GA4 was dominated by non-engaged scan-like traffic: Singapore desktop Direct 82 sessions plus Unassigned 56, and China Direct/Unassigned 77. Exclude these segments from demand decisions.
- Focused sitemap: 54 unique submitted URLs, strict issues 0.
- Search Console re-downloaded the focused queues on 2026-09-01 after their stale `174 / 1,940 / 1,770` submitted counts were replaced by live `18 / 10 / 29` root, portal and blog rows; all three report 0 warnings/errors.
- Raw AdSense request coverage was 10.43%, but it was 10.59% in the prior week and is dominated by scan traffic: Singapore generated 5,541 requests, 287 matches, 1 impression and $0.00. KR/US/JP coverage was 30.6%/47.3%/62.0%, so do not add ad density to fix the raw ratio.
- Primary: Stress Check, HSP Test, 2048 Coach. Support: Brain Type, IQ, K-pop Roster. Culture Signal remains one isolated pilot. Portal remains the archive.

## Latest releases

### Indonesian 6/45 random path

- `/portal/blog/id/lottery-number-guide.html` moved from no valid Organic baseline to four engaged Organic sessions in the latest 28-day window (three Indonesia mobile DuckDuckGo, one Indonesia desktop Bing), plus one engaged ChatGPT referral. The app itself also has Organic entry, but its 56-day event set had no generation, completion or share signal.
- The 42.7 KB prediction/strategy article is now a 12.8 KB probability guide. It publishes `C(45,6) = 8,145,060`, rejects hot-number/AI/winning claims, has two direct Indonesian app CTAs and four non-wagering internal paths, and sends no chosen number to analytics.
- The destination removed simulated winning results, fake AI/frequency analysis, fabricated rating/FAQ proof, manual ad surfaces, synthetic engagement and the broad root service-worker scope. It now uses Web Crypto rejection sampling, stores only explicit favorites locally and exposes a private exact-once view/generate/save/share/related funnel in 12 languages.
- Google Publisher guidance distinguishes educational material from pages enabling real-money play; this path does not sell tickets, accept wagers or connect to an operator. IndexNow accepted the changed guide/app URLs with HTTP 200 and Search Console accepted `18 / 10 / 29` focused rows.

### Chinese free-games controls path

- `/portal/blog/zh/free-games.html` moved `3 → 6` equal-window Organic sessions from China via Bing-family search; 4/6 were engaged. Across 56 days only two users took a valid CTA while 58 users fired synthetic ad telemetry and 35 were shown an unrelated Palworld bridge.
- The 62.4 KB “TOP 5” page is now a 12.5 KB non-ranking selector for five verified Chinese-language games. Users can filter by touch or keyboard/mouse; the chosen filter stays in the browser and only stage plus destination slug is measured.
- Popularity, brain-training effect, hidden English FAQ, synthetic ad events and generic cross-promo were removed. Visible boundaries define browser data/cache, device variation, entertainment-only use, Auto Ads and no ad-unlock gate.
- The focused blog sitemap now has 28 rows. The one changed canonical received IndexNow HTTP 200 and all three Search Console queues were accepted at `18 / 10 / 28`.

### Japanese Minesweeper guide-to-play path

- Japan desktop search traffic to the guide remained small but fully engaged (`3 → 4` equal-window Organic sessions; 7/7 engaged), while 56-day content users produced no valid next action. The generic cross-promo instead sent six users toward an unrelated Palworld path.
- The 28.6 KB generic guide is now a 16.5 KB Japanese rules path with two deterministic counting rules, a private example, explicit DopaBrain first-click/hint/random-board boundaries and two direct Japanese game CTAs. It sends no answer choice to analytics.
- The destination removed an unverifiable `4.5 / 4,200` rating, hidden FAQ schema, two invalid manual `data-ad-slot="auto"` units, duplicate page view and pre-success sharing. It now has a private exact-once view/start/complete/share/related funnel, allowlisted Japanese entry, 12-locale share feedback and app-scoped manifest/service-worker paths.
- The focused blog sitemap now has 27 rows. IndexNow accepted only the changed guide and game URLs with HTTP 200, and Search Console accepted all three focused sitemaps at `18 / 10 / 27` rows.

### Google discovery queue reset

- URL Inspection found the homepage submitted/indexed, six representative priority routes crawled but not indexed, and the Culture Signal URL unknown to Google. Fetch, robots, indexing permission and user/Google canonical were correct where Google had crawled.
- `mcp-server-gsc@0.3.0` exposes sitemap submission while hardcoding the read-only OAuth scope, so its write call always returned 403. `scripts/gsc-submit-sitemaps.js` now validates the fixed three-sitemap allowlist, live robots, XML content type, same-origin URLs, duplicate/count bounds and a full-scope signed service-account request before one submission pass.
- Search Console accepted and downloaded all three queues at 2026-09-01 07:24 UTC. This resets discovery only; it does not prove indexing or ranking.

### IndexNow changed-URL acquisition

- Bing and Naver are the current valid search sources while Google discovery remains thin. The pre-existing root IndexNow key was live and valid, but there was no guarded submission workflow.
- `scripts/indexnow-submit.js` now requires explicit clean same-origin canonical URLs and validates the live key, 200 HTML response, indexability and canonical before submission. It rejects external/query/hash/duplicate URLs and never submits the whole sitemap by default.
- Only today's updated Korean psychology picker was submitted; IndexNow returned HTTP 200. This is a crawl notification, not an indexing or ranking guarantee.

### Korean psychology-test purpose picker

- `/portal/blog/psychology-test-best.html` gained `0 → 5` equal-window Organic sessions, all from South Korea via Naver; only 2/5 engaged and no user took a valid next action. Exact-page Search Console rows were absent.
- The 74.1 KB “BEST 7” page is now a 14.6 KB purpose-first chooser. It removes fabricated popularity, accuracy, HSP diagnosis, frequency-healing and scientific-compatibility claims, and replaces them with five explicit measurement boundaries plus direct APA/WHO sources.
- A private five-choice picker routes to Stress Check, HSP, Brain Type, IQ Puzzle or K-pop Position. Its use event contains no selected purpose; the destination is attributed only when the user clicks the generated CTA. New Naver demand justified focused-sitemap inclusion as a separate Google-discovery hypothesis.

### Spanish cognitive-distortions path

- Equal 28-day Organic landing sessions held at `6 → 6`; 4/6 recent sessions engaged. Search entries came from Mexico, Guatemala, Peru and the United States. Across 56 days the page had 18 content users and no valid action user; exact-page Search Console rows were absent.
- The 54.2 KB generic page is now a 14.8 KB evidence-bound guide with 15 visible teaching categories, three direct NHS/WHO sources and a private three-step thought check. Deterministic brain/error claims, the hidden English FAQ, unrelated Animal Personality CTA and synthetic ad event were removed.
- Two identical primary CTAs open an allowlisted Spanish Stress Check route. The upgraded page was added to the focused sitemap because repeat Organic acquisition was already present.

### French cognitive-distortions path

- The guide had 18 content users and 8 engaged users over 56 days with no valid next action. The latest 28 Organic days had 3 sessions, 2 engaged sessions and 620 engagement seconds; exact-page Search Console rows were absent.
- The 52.7 KB generic page is now a 14.9 KB French reference with 15 visible teaching categories, explicit evidence/diagnosis boundaries, three direct NHS/WHO sources and a private three-step thought check. Choices stay in the browser and analytics records stages only.
- Two identical primary CTAs now open allowlisted French Stress Check auto-start routes; four related cards remain available. The Stress Check scoring and all other entry routes were left unchanged.

### English Jung shadow path

- `/portal/blog/en/carl-jung-shadow-self-explained.html` had 49 content users and 20 engaged users over 56 days but no valid next-action user. Its latest two Organic users were engaged for 410 seconds. Exact-page Google Search Console rows were absent.
- `/shadow-work/` had 54 page users, 17 quiz-start users and 9 quiz-complete users. The completion engine was usable, but its random percentile, invented six-archetype measurement, deterministic unconscious claims, result telemetry and mixed legacy events made the funnel uninterpretable.
- The 48.2 KB guide is now a 14.1 KB evidence-boundary article. It distinguishes Jungian theory from diagnosis or measurement, cites IAAP/SAP sources, provides one grounded four-line practice, and uses two identical direct-start CTAs plus two focused related links.
- The app is now a 12-locale private eight-scenario response reflection. It publishes the one-point-per-answer-direction formula, removes fabricated proof and result claims, uses one Auto Ads loader, and keeps answers, counts and result names out of analytics, URLs and neutral share links.
- New funnel only: `content_en_jung_shadow_concept_view -> content_cta_click -> shadow_reflection_view -> shadow_reflection_start -> shadow_reflection_complete -> shadow_reflection_share/shadow_reflection_related_click`. Historical quiz/result/ad events are not comparable.

## Deployment and verification

- Shadow app: `556933d`; Pages run `33312294971` succeeded.
- Portal guide/catalog: `83da986`; Pages run `33312297876` succeeded.
- Stress Check French entry allowlist: `f4e7539`; Pages run `33313140297` succeeded.
- French guide/catalog: `68c3f24`; Pages run `33313143194` succeeded.
- Stress Check Spanish entry allowlist: `73bd330`; Pages run `33314275421` succeeded.
- Spanish guide/catalog/sitemap: `1440793`; Pages run `33314278283` succeeded.
- Korean psychology picker/catalog/sitemap: `d89a970`; Pages run `33479823852` succeeded. The qualified-view layout-shift fix is `07c6fe1`; Pages run `33480344934` succeeded.
- Minesweeper app: `e644267`; Pages run `33484542795` succeeded. Japanese guide/catalog/sitemap: `c425b98`; Pages run `33484542960` succeeded.
- Chinese free-games guide/catalog/sitemap: `c236bd5`; Pages run `33486321526` succeeded.
- Lottery app: `a553d0e`; Pages run `33489504177` succeeded. Indonesian guide/catalog/sitemap: `cc5fb72`; Pages run `33489463109` succeeded.
- `verify:en-shadow-reflection`: 14/14 mutations detected; all 12 locale completions, guide auto-start, source normalization, neutral sharing, private telemetry, mobile layout and locale-load recovery passed locally and live.
- `verify:fr-cognitive-distortions`: 10/10 mutations detected; 390/1440px interaction, exact-once/private telemetry and linked French auto-start passed locally and live.
- `verify:es-cognitive-distortions`: 11/11 mutations detected; 390/1440px interaction, exact-once/private telemetry, focused sitemap inclusion and linked Spanish auto-start passed locally and live. French and Chinese adjacent live paths also passed after the shared Stress Check allowlist change.
- `verify:ko-psychology-picker`: 13/13 mutations detected; 390/1440px purpose selection, exact-once/private telemetry, 44px targets and continuous qualified exposure across live layout shifts passed locally and live.
- `verify:gsc-submit-sitemaps`: 5/5 safety mutations detected; live robots declared all three queues and dry-run counts matched `18 / 10 / 26`. Search Console confirmed same-minute download with 0 warnings/errors.
- `verify:indexnow-submit`: 5/5 safety mutations detected; live key, 14,821-byte HTML, indexability and canonical passed before the one-URL submission returned HTTP 200.
- `verify:ja-minesweeper-path`: 16/16 mutations detected; local and live 390/1440px guide-to-play journeys, Japanese rendering, query cleanup, exact-once/private stages and success-gated sharing passed.
- `verify:zh-free-games-controls`: 13/13 mutations detected; local and live 390/1440px filtering, five Chinese destination renders, exact-once/private stages and layout-shift-resilient qualified exposure passed.
- `verify:id-lottery-random-path`: 18/18 mutations detected; local and live 390/1440px guide-to-app journeys, all 12 languages, query cleanup, unbiased generation invariants and exact-once/private stages passed.
- Full harness: `logs/harness-workflow/2026-09-01T08-43-22-225Z.md`; every step passed, analytics 9/9, runtime 6/6, submitted inventory 54 URLs / 0 issues.

## Observation windows

Use complete KST days. Do not decide before 20 qualified views unless a correctness or policy defect appears.

| Path | Window | First diagnostic |
|---|---|---|
| Focused Google discovery queue | 2026-09-02~09-08 | newer `lastCrawlTime` on priority samples; first newly indexed non-home URL; first Culture Signal discovery |
| Korean psychology-test picker | 2026-09-02~09-08 | qualified picker-to-use 25%; use-to-CTA 25%; Organic engagement 55%; post-submit Bing/Naver sessions; first Google discovery row |
| Japanese Minesweeper guide → game | 2026-09-02~09-08 | qualified rule-view-to-use 25%; guide-to-game click 8%; game view-to-start 50%; start-to-complete 25%; Japan Organic engagement 55% |
| Chinese free games → five game entries | 2026-09-02~09-08 | qualified filter-view-to-use 25%; game-click user rate 8%; China Organic engagement 55%; destination split only by non-sensitive slug |
| Indonesian 6/45 guide → random picker | 2026-09-02~09-08 | qualified method-view-to-CTA 8%; app view-to-generate 25%; generate-to-save/share/related 8%; Indonesia Organic engagement 55% |
| Spanish cognitive distortions → Stress Check | 2026-08-31~09-06 | qualified check-to-use/CTA 8%; linked app view-to-start 50%; start-to-complete 50% |
| French cognitive distortions → Stress Check | 2026-08-31~09-06 | qualified check-to-use/CTA 8%; linked app view-to-start 50%; start-to-complete 50% |
| English Jung shadow reflection | 2026-08-31~09-06 | qualified concept-to-CTA 8%; app view-to-start 25%; start-to-complete 50%; complete-to-share/related 8% |
| English attachment, Chinese RSD, Chinese Zodiac Pair, Spanish Blood Type | 2026-08-31~09-06 | use each release's new stage events; ignore legacy/synthetic events |
| IQ, reaction time, HSP/thought/habit, Brain Type, Spanish guides | 2026-08-31~09-06 | qualified bridge/use 8%; linked action or completion 50% |
| Culture Signal and earlier focused resets | 2026-08-30~09-05 | first decision 2026-09-06 after valid exposure threshold |

## Decision rule

- Revenue milestone: rolling seven complete-day AdSense total `>= $1.40`.
- Fewer than seven complete days: `TOO_EARLY`; insufficient discovery or exposure: `DISCOVERY_HOLD`.
- `PROMOTE`: at least two durable signals among Organic 20/day, engagement 55%, bridge 8%, and attributable Page RPM `$1+`.
- Otherwise `ITERATE`. `SUPPRESS` only after at least 14 days plus 20 Organic sessions and 20 qualified content views show repeated failure.
- Page-unattributed AdSense RPM is a proxy, never URL-level causal evidence. Do not publish another trend candidate before the current Culture Signal reaches its first valid decision window.
