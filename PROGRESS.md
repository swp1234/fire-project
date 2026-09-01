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
- Focused sitemap: 59 unique submitted URLs, strict issues 0.
- Search Console re-downloaded the focused queues on 2026-09-01 after their stale `174 / 1,940 / 1,770` submitted counts were replaced by live `18 / 10 / 31` root, portal and blog rows; all three submissions were accepted.
- Raw AdSense request coverage was 10.43%, but it was 10.59% in the prior week and is dominated by scan traffic: Singapore generated 5,541 requests, 287 matches, 1 impression and $0.00. KR/US/JP coverage was 30.6%/47.3%/62.0%, so do not add ad density to fix the raw ratio.
- Primary: Stress Check, HSP Test, 2048 Coach. Support: Brain Type, IQ, K-pop Roster. Culture Signal remains one isolated pilot. Portal remains the archive.

## Latest releases

### French Minesweeper strategy → verified game path

- `/portal/blog/fr/minesweeper-strategy.html` moved `2 → 5` across equal 28-day Organic windows. Recent entries were France/Russia mobile DuckDuckGo and France mobile Ecosia; 2/5 engaged. Across 56 days, 14 content users produced no valid game action while all 14 saw generic cross-promo and synthetic ad telemetry.
- The 54.8 KB “beginner to expert” page is now a 15.9 KB two-rule guide. It removes solve-every-board, memory/logic improvement and daily-training claims, hidden FAQ, synthetic paid-impression events, generic cross-promo, probability overreach and the broken homepage play CTA.
- The guide teaches only `number − confirmed flags = closed cells` and `number = confirmed flags`, states DopaBrain's first-click/hint/random-board boundaries, offers a private mini exercise and links twice to an allowlisted French game entry. The app preserves the Japanese source while adding a measured French return route.
- The dedicated gate detects 15/15 mutations and verifies exact-once guide/game stages, private telemetry, query cleanup, share success and 390/1440px completion locally and live. Full harness `2026-09-01T11-43-33-996Z` passed with analytics `9/9`, runtime `6/6` and strict inventory `59 / 0`; IndexNow accepted the guide/game and Search Console downloaded `18 / 10 / 34` rows with zero warnings/errors.

### Korean emotion-regulation guide → private action planner

- `/portal/blog/ko/emotional-regulation-techniques.html` moved `1 → 4` across equal 28-day Organic windows. The latest South Korea desktop Bing entries were all engaged for 23–67 seconds, while four users saw the old injected planner bridge but none clicked it; the search identity was retained and the weak bridge was replaced.
- The 46.2 KB article is now a 13.7 KB `지금–다음–나중` action guide. Unsupported efficacy percentages, brain-rewiring language, fixed treatment timelines, hidden FAQ, synthetic ad telemetry, generic cross-promo and three unrelated EQ-test CTAs were removed. WHO/NHS guidance and one affect-labeling laboratory study are presented with explicit non-diagnostic and study-design boundaries.
- The existing planner now accepts an allowlisted Korean guide source, sanitizes query and hash data before analytics, and publishes only visible WebApplication/Breadcrumb schema. It keeps selections and generated text out of URLs and analytics while preserving the Chinese rejection-sensitivity entry.
- The dedicated gate detects 13/13 mutations and verifies all 12 languages plus linked 390/1440px journeys locally and live. Full harness `2026-09-01T11-24-15-595Z` passed with analytics `9/9`, runtime `6/6` and strict inventory `58 / 0`; IndexNow accepted the guide/planner and Search Console downloaded `18 / 10 / 33` rows with zero warnings/errors.

### Chinese MBTI city guide → city match path

- `/portal/blog/zh/mbti-city-chengshi-xingge.html` moved `1 → 3` across equal 28-day Organic windows. All three recent Bing entries engaged for 30–222 seconds, and five 56-day users clicked the old app CTA, so the search identity and direct route were preserved.
- `/mbti-city/` had 76 page users but no start or completion stage. A real completion-path bug called nonexistent `i18n.translateDOM`, while fabricated `15,200+` participation, `4.3 / 1,260` proof, random rarity percentages, hidden FAQ, manual ads and synthetic engagement made the old funnel unusable.
- The 24.5 KB guide is now a 13.0 KB city-culture explainer with the exact eight-question/four-axis rule, 16 explicitly fictional city mappings, two direct Chinese CTAs and four verified related routes. The app keeps the deterministic engine, adds 12-language boundaries, private exact-once stages, completion-break ads only and app-scoped caching.
- The dedicated gate detects 18/18 mutations and completes all eight questions at 390/1440px across 12 languages. Strict inventory is 57 URLs with 0 issues.

### English past-life birthday guide → story journey

- `/portal/blog/en/past-life-calculator-birthday.html` fell `16 → 3` across equal 28-day Organic windows, but all three recent Bing entries engaged. Across 56 days, 51 content users produced eight valid quick-path users and three CTA users, so the path still shows direct story-tool intent despite weak current discovery.
- `/past-life/` had 62 page users, 16 start users and 10 completion users. The 62.5% historical start-to-complete rate justified preserving the six-scene choice engine; a 271-event exception burst was confined to 2026-08-06 and did not reproduce in a current live completion.
- The 33.1 KB birthday-claim guide is now an 11.4 KB evidence-boundary page with transparent digit reduction, nine neutral writing prompts and two direct journey CTAs. The app removed fabricated `4.6 / 4,800` proof, fake participant counts, hidden FAQ, manual ad units, synthetic events, compatibility/percentile claims and result-bearing telemetry/share.
- The app retains six scenes and eight localized story roles, publishes its 3/2/1 scoring rule, keeps choices and result local, uses only an official completion-break ad request and scopes caching to `/past-life/`. IndexNow accepted the guide/app URLs with HTTP 200; Search Console accepted `18 / 10 / 31` queues.

### French developer guide → Developer Quiz path

- `/portal/blog/fr/guide-quiz-developpeur.html` moved `3 → 4` across equal 28-day Organic windows. All four recent sessions engaged, and five of nine 56-day content users produced ten direct Dev Quiz CTA clicks; the guide already had a usable intent signal.
- `/dev-quiz/` had 39 page users over 56 days but no measurable start or completion. Its claimed 12-language experience still served 100 Korean questions, and fabricated rating/FAQ proof, fake ad gates, synthetic engagement and generic cross-promo made the destination untrustworthy and the funnel uninterpretable.
- The 37.7 KB guide is now a 9.4 KB French practice boundary with two identical direct CTAs and four verified related routes. The app is a fixed ten-question, 12-language coding practice with app-scoped caching, official completion-break ads only, neutral sharing and private exact-once view/start/complete/share/related stages.
- IndexNow accepted the guide/app URLs with HTTP 200. Search Console accepted the focused queues at `18 / 10 / 31`, and strict inventory is 56 URLs with 0 issues.

### Chinese game catalog → Block Puzzle path

- `/portal/blog/zh/dopabrain-games-2026.html` moved `3 → 6` across equal 28-day Organic windows; all recent entries were China desktop Bing, 5/6 engaged, with 265 engagement seconds. Its four valid historical CTA users all chose Block Puzzle, so the existing choice was preserved and made primary.
- The 42.7 KB “TOP 10” page is now an 11.7 KB non-ranking catalog with four verified Chinese entries. It removes popularity/brain claims, fake ad telemetry and generic cross-promo, and states local-storage, device, entertainment and official game-over ad boundaries.
- Block Puzzle removed fabricated rating/FAQ proof, fake ad placeholders, synthetic engagement, score-bearing analytics/share, result-changing reward ads and root-scope caching. It now exposes private exact-once view/start/complete/successful-share/related stages in 12 languages; result data remains local.
- IndexNow accepted the guide/app URLs with HTTP 200. Search Console accepted the focused queues at `18 / 10 / 30`, and the strict inventory is 55 URLs with 0 issues.

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
- Block Puzzle app: `6ab51fe`; Pages run `33492331655` succeeded. Chinese game guide/catalog/sitemap: `f060103`; Pages run `33492301923` succeeded.
- Developer Quiz app: `86ee03a`; Pages run `33495211280` succeeded. French guide/catalog/sitemap: `3e0b2ae`; Pages run `33495211548` succeeded.
- Past Life app: `b06f53e`; Pages run `33497742054` succeeded. English guide/catalog/sitemap: `6acfbe5`; Pages run `33497741863` succeeded.
- MBTI City app: `ae05dad`; Pages run `33500561412` succeeded. Chinese guide/catalog/sitemap: `de2ef8f`; Pages run `33500571968` succeeded.
- `verify:en-shadow-reflection`: 14/14 mutations detected; all 12 locale completions, guide auto-start, source normalization, neutral sharing, private telemetry, mobile layout and locale-load recovery passed locally and live.
- `verify:fr-cognitive-distortions`: 10/10 mutations detected; 390/1440px interaction, exact-once/private telemetry and linked French auto-start passed locally and live.
- `verify:es-cognitive-distortions`: 11/11 mutations detected; 390/1440px interaction, exact-once/private telemetry, focused sitemap inclusion and linked Spanish auto-start passed locally and live. French and Chinese adjacent live paths also passed after the shared Stress Check allowlist change.
- `verify:ko-psychology-picker`: 13/13 mutations detected; 390/1440px purpose selection, exact-once/private telemetry, 44px targets and continuous qualified exposure across live layout shifts passed locally and live.
- `verify:gsc-submit-sitemaps`: 5/5 safety mutations detected; live robots declared all three queues and dry-run counts matched `18 / 10 / 26`. Search Console confirmed same-minute download with 0 warnings/errors.
- `verify:indexnow-submit`: 5/5 safety mutations detected; live key, 14,821-byte HTML, indexability and canonical passed before the one-URL submission returned HTTP 200.
- `verify:ja-minesweeper-path`: 16/16 mutations detected; local and live 390/1440px guide-to-play journeys, Japanese rendering, query cleanup, exact-once/private stages and success-gated sharing passed.
- `verify:zh-free-games-controls`: 13/13 mutations detected; local and live 390/1440px filtering, five Chinese destination renders, exact-once/private stages and layout-shift-resilient qualified exposure passed.
- `verify:id-lottery-random-path`: 18/18 mutations detected; local and live 390/1440px guide-to-app journeys, all 12 languages, query cleanup, unbiased generation invariants and exact-once/private stages passed.
- `verify:zh-block-puzzle-path`: 18/18 mutations detected; local and live 390/1440px guide-to-game journeys, all 12 languages, query cleanup, no score-changing rewards, success-gated neutral sharing and exact-once/private stages passed.
- `verify:fr-dev-quiz-path`: 16/16 mutations detected; local and live 390/1440px guide-to-quiz journeys, all 12 languages, ten-question completion, query cleanup, success-gated neutral sharing and exact-once/private stages passed.
- `verify:en-past-life-path`: 18/18 mutations detected; local and live 390/1440px guide-to-story journeys, all 12 languages, six-scene deterministic completion, query cleanup, neutral sharing and exact-once/private stages passed.
- `verify:zh-mbti-city-path`: 18/18 mutations detected; local and live 390/1440px guide-to-app journeys, all 12 languages, eight-question deterministic completion, query cleanup and exact-once/private stages passed. IndexNow accepted the guide/app URLs with HTTP 200; Search Console downloaded `18 / 10 / 32` rows with 0 warnings/errors.
- Full harness: `logs/harness-workflow/2026-09-01T10-51-49-035Z.md`; every step passed, analytics 9/9, runtime 6/6, submitted inventory 57 URLs / 0 issues.

## Observation windows

Use complete KST days. Do not decide before 20 qualified views unless a correctness or policy defect appears.

| Path | Window | First diagnostic |
|---|---|---|
| Focused Google discovery queue | 2026-09-02~09-08 | newer `lastCrawlTime` on priority samples; first newly indexed non-home URL; first Culture Signal discovery |
| Korean psychology-test picker | 2026-09-02~09-08 | qualified picker-to-use 25%; use-to-CTA 25%; Organic engagement 55%; post-submit Bing/Naver sessions; first Google discovery row |
| Japanese Minesweeper guide → game | 2026-09-02~09-08 | qualified rule-view-to-use 25%; guide-to-game click 8%; game view-to-start 50%; start-to-complete 25%; Japan Organic engagement 55% |
| Chinese free games → five game entries | 2026-09-02~09-08 | qualified filter-view-to-use 25%; game-click user rate 8%; China Organic engagement 55%; destination split only by non-sensitive slug |
| Indonesian 6/45 guide → random picker | 2026-09-02~09-08 | qualified method-view-to-CTA 8%; app view-to-generate 25%; generate-to-save/share/related 8%; Indonesia Organic engagement 55% |
| Chinese game catalog → Block Puzzle | 2026-09-02~09-08 | qualified catalog-view-to-game click 8%; app view-to-start 25%; start-to-complete 25%; complete-to-share/related 8%; China Organic engagement 55% |
| French developer guide → Developer Quiz | 2026-09-02~09-08 | qualified guide-view-to-CTA 8%; app view-to-start 25%; start-to-complete 50%; complete-to-share/related 8%; France/Brazil Organic engagement 55% |
| English past-life birthday guide → story journey | 2026-09-02~09-08 | qualified boundary-view-to-CTA 8%; app view-to-start 25%; start-to-complete 50%; complete-to-share/related 8%; non-SG Organic engagement 55% |
| Chinese MBTI city guide → city match | 2026-09-02~09-08 | qualified boundary-view-to-CTA 8%; app view-to-start 25%; start-to-complete 50%; complete-to-share/related 8%; China/HK Organic engagement 55% |
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
