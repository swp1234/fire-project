# Data Decision Baseline

This file keeps only evidence that still changes a product, traffic, or release decision. Full release narratives remain in Git history and child repositories; raw responses and console output belong in ignored reports.

## Current account state — 2026-11-15 KST

- Goal: `$1.40` / 7 complete days (`$0.20/day`) interim, scaling toward `$1.00/day`.
- Observed baseline (`dopabrain.com`, 30d AdSense): **$1.62 / 30d** (`11,418` PV MTD **$0.53**), recent 7d **$0.22** (`~$0.031/day`).
- Country RPM signal: DE `$3.70`, BE `$2.82`, FR `$2.62`, US `$1.82`, SG `$0.00` (`3,963 PV` Direct bot scan).
- GA4 (28d): `7,407` page_view (`1,151` ad_impression, `115` content_sticky_cta_view, `89` content_cta_click), Organic Search `268` (`1.57` PV/session).
- Account constraints: AdSense PIN hold is user-acknowledged/in-progress — do **not** re-warn or ask; focus only on human traffic quality and conversion telemetry.

## Measurement rules

- Exclude deployment day and incomplete KST days from comparisons.
- **No premature ROI/effect checks**: NEVER evaluate or declare success/failure of monetization, CRO, or SEO edits within hours or `<7` complete KST days after deployment. Wait at least **7 full KST days (`+ >=20` qualified views)** for CTA/telemetry/affiliate changes, and **14–28 full days** for indexing, hub linking, `hreflang`, and AdSense RPM trends before drawing conclusions.
- Exclude `127.0.0.1` test traffic, Singapore desktop Direct scan traffic, and the 2026-08-06 spike from demand, engagement, and monetization decisions.
- Ignore synthetic `page_engage`, client-authored ad-impression events, hidden-surface views, fabricated proof, and action events whose current source cannot emit them.
- Keep a route when it has credible Organic acquisition or a real qualified action. Retire only when a working action event remains at zero and acquisition has no credible signal after full maturation.

## Active monetization tracking & maturation gates

| Deployed | Workstream & scope | Pre-change baseline | Primary tracking metrics | Earliest review |
|---|---|---|---|---|
| 2026-11-12 | Story cards + book curation (`stress-check`, `hsp-test`, `future-self`), `llms*.txt` | `7d $0.28`, 0 curated clicks | `curated_resource_click`, `share` / card downloads, referral/AI sessions | `2026-11-21` (+14d: `11-26`) |
| 2026-11-13 | `127.0.0.1` AdSense block (`92ac7ff`), `/brain-type/` leak fix, EN SEO/hreflang | `127.0.0.1` `4,191 PV/30d`, EN `ko` conflict | Zero `127.0.0.1` AdSense PV after deploy date; US/EN organic impressions | `2026-11-21` (+28d: `12-11`) |
| 2026-11-14 | Core wave 1-4 + Cloudflare proxy/SG WAF (`1a9b433`, `6190733`) | SG `4,053 PV` (`$0.00`), `#app-loader` LCP | SG Direct PV drop, human `Page RPM`, LCP/Core Web Vitals | `2026-11-22` (+28d: `12-12`) |
| 2026-11-14 | 419 blog hub links, `/portal/` `og:locale`, 7 organic sticky CTAs, `white-noise`/`stress-type` curation (`e96b663`) | 28d Org `279` sess (`1.54 PV/sess`), 142 pages | `content_sticky_cta_view`, `curated_resource_click`, `PV/session`, GSC indexed count & organic clicks | `2026-11-22` (funnel) / `2026-12-12` (SEO) |
| 2026-11-15 | Batch 1+2 (`0276a3a`, `cce1392`): `root-domain` i18n, 4 core app curation, 20 portal sticky CTAs + SG WAF | 7d `$0.22`, 28d Org `268`, `/future-self/` etc. unindexed | `content_sticky_cta_view`, `curated_resource_click`, SG PV/RPM, GSC indexation | `2026-11-22` (funnel) / `2026-12-13` (SEO) |

## Portfolio decisions still in force

| Area | Current decision | Evidence or condition |
|---|---|---|
| Home | Keep Stress Check, HSP Test and 2048 Coach primary; focused picks secondary | Portfolio reset preserved the strongest valid search/action paths |
| Crawl | Keep the submitted inventory small, unique, canonical and reachable | Large sitemap expansion produced little non-brand search value |
| Blog | Preserve the 175-page focused indexable cohort; leave low-signal inventory `noindex,follow` | The cohort retained about 90% of observed Organic blog sessions |
| Games | Keep playable routes but suspend ad rewards/manual units during restriction | Game actions can be valid; ad exchange and adjacent-click risk cannot |
| Reflections | Keep only disclosed scoring, visible limits, private stage telemetry and focused next actions | Unsupported ratings, percentiles, diagnoses and capability claims are not performance assets |
| Retirements | Word Scramble, MBTI Career, Seollal, Brainrot, Delulu, Hail Mary, Luck Meter, Sleep Animal, Rizz Score and Red Flag stay retired | Their qualified action/search evidence did not justify the stale experiences |

## Measured paths awaiting enough post-release evidence

| Path | Baseline and next comparison |
|---|---|
| HSP → Sensory Reset | Use actual 50%-visible CTA exposure → click → generate; old hidden result views are invalid. Wait for 20 qualified views; first click-user diagnostic is 8%. |
| Palworld settings | Existing utility gained 15 Organic landings but only one copy/preset user; compare generator → copy after 20 qualified users. |
| Routine Planner | Two credible Organic sessions in 56 days survived scan exclusion; compare source-attributed view → plan/timer/complete after 20 qualified users. |
| Future Self | Preserve the guide and auto-start destination; compare content view → CTA view/click → start → complete after 20 qualified CTA views. |
| Doomscrolling → Stress Check | Preserve the US-oriented guide; compare qualified reset view/use and Stress Check click after 20 views. |
| K-pop guide → roster/test | Preserve the valid path, but exclude all pre-reset fake proof/ad-lock events. |
| Odyssey/Spider-Man article | Existing URL had 4 page-view users, 2 Direct landings, 1 qualified choice view, 0 selections, 0 Organic landings in 2026-08-29~09-04. Improve the existing URL only after restriction; do not create a duplicate. |

## Invalid-traffic containment program — 2026-09-03 onward

- Root/shared surfaces and focused products keep either one Auto Ads loader or an explicit dated suspension marker with zero ad code. Manual units, direct pushes, paid-impression guesses and ad-for-result exchanges are forbidden; `0 critical / 14 high` baseline preserved across suspended apps (`2048`, `brain-type`, `color-personality`, etc.).

## Verification baseline

- Full release harness `146` steps (`131` package `verify:*` / `session:*`, `121` disk `verify-*.js`), zero synthetic/paid-impression tolerance, GitHub Pages build verification required per child repo.
- **2026-11-15 Batch 1+2 (`0276a3a`, `cce1392`)**: `root-domain` (`v5-focus` async `i18n` fix), `color-blindness`/`iq-test`/`future-self`/`kpop-position` 12-locale `.curated-resources-card` + static canonicals, `portal` (`f53819b`) 20 top-PV sticky CTAs + SG `ad-loader.js` guard + Palworld canonicals, IndexNow (`200 OK`). Earliest review: **2026-11-22** (7d funnel CTA/affiliate clicks, SG PV) / **2026-12-13** (28d GSC indexing for `/future-self/`, `/color-blindness/`, `/iq-test/`, `/portal/tools/grounding-exercise.html`).
