# DopaBrain current status

Updated: 2026-09-05 KST. Release history is in `memory/data-check-log.md`; the repeatable loop is in the `dopabrain-growth-ops` skill.

## Target and blocker

- Target: `$1.40` per completed seven days (`$0.20/day`).
- 2026-08-29 through 2026-09-04: `$0.63 / 2,115 page views / 644 impressions / 14 clicks`, or `$0.090/day`.
- Ad serving has been restricted for invalid-traffic concerns since 2026-09-03; the policy-issues API remains empty.

## Current rule

- Keep ad-layout experiments, traffic expansion, IndexNow and manual GSC submissions paused until the restriction clears.
- Remove manual ads, reward/interstitial exchanges, fabricated proof and unverifiable paid-impression telemetry one measured product at a time.
- Preserve routes with credible Organic acquisition or valid action evidence. Exclude Singapore desktop Direct scans and legacy synthetic events from growth decisions.

## Latest release: Rizz Score retirement

- Retired `/rizz-score/`: the complete 2026-08-29 through 2026-09-04 window had zero GA4 visits/actions, and the prior 28 Search Console days returned no rows.
- Removed the unvalidated social score, telemetry, manual ad unit/request and stale bundle; 4,854 lines were deleted. The 1.4 KB `noindex,follow` route now redirects to Attachment Style with narrow cache cleanup.
- Removed portal promotion and replaced backlinks in Ick Factor, Pick Me, Would You Rather, NPC Test and K-pop Position. The same pass removed lingering Brainrot/Delulu recommendation cards. Attachment Style had two Organic sessions and five completion users in the comparison window.
- App `74cd5a2`, Ick `ce05856`, Pick Me `87ad916`, Would You Rather `5d2fafb`, NPC `47d7e08`, K-pop `d6156e1` and portal `94afaaa` deployed from confirmed Pages sources; runs `33964626238`/`33964629177`/`33964632737`/`33964640785`/`33964644161`/`33964646569`/`33964649073` succeeded. All 13 affected live files match their deployed Git blobs.

## Validation and next action

- Rizz Score retirement caught 8/8 injected defects; local and production mobile/desktop redirects passed. NPC and K-pop dependency checks caught 22/22 and 52/52 mutations. Portfolio risk is now `0 critical / 17 high / 6 medium / 53 info / 43 clean`; submitted inventory remains 63/0 because the retired URL was not submitted.
- All seven affected products passed their quality gates. Final harness `2026-09-05T11-57-56-963Z` passed 122/122 in 788.7 summed seconds, including analytics 9/9, runtime 6/6 and submitted inventory 63/0.
- Documentation budgets remain mutation-tested: `PROGRESS.md` is current-state only, and durable evidence is compacted in the data log and skill references.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
