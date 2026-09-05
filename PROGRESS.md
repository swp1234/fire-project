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

## Latest release: documentation and harness reset

- Replaced three accumulating product-specific release aliases with one parameterized `harness:release`; unsafe/missing arguments, duplicate steps and missing Node/Bash scripts now fail before execution.
- The plan reports six functional groups and classifies every package verifier as full or reasoned diagnostic-only: 110/114 scripts are full-registered and four legacy/focused diagnostics are explicit.
- Added a six-mutation harness self-test. Registering the previously omitted fake-unlock audit exposed stale Blood Type/MBTI Love selectors; it now runs the current immediate-result journeys with external network isolation and fails early.
- Expanded the Markdown contract from eight to ten canonical files, added UTF-8-marker and local-link checks, and increased document mutations from 7 to 10. `VALIDATION.md` fell from 6,657 to 3,408 bytes while preserving the release, ad, privacy and production contracts.

## Validation and next action

- Generic release harness `2026-09-05T13-49-34-552Z` passed 15/15. The first full run correctly failed on the stale selector; final run `2026-09-05T14-02-27-501Z` passed 127/127 in 763.6 summed seconds.
- The final run includes harness structure 6/6, documentation 10/10, analytics 9/9, runtime 6/6, ad risk `0 critical / 14 high / 6 medium / 53 info / 46 clean`, and submitted inventory 63/0.
- No product repository or production asset changed in this release. Generated reports remain ignored and retention-bounded.

User-owned `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}` remains untouched.
