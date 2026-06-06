# Harness Workflow

Last updated: 2026-06-06

## Purpose

Use this workflow when changing shared portal code, analytics instrumentation, runtime behavior, or any app that could affect retention, navigation, ads, or i18n.

## Fast Path

```bash
npm run harness
```

Default scope:

- `projects/portal` quality gate
- portal locale audit
- analytics event smoke scenarios
- `brainrot-score` runtime smoke
- git whitespace/conflict check
- Playwright version floor check

## Targeted Runs

```bash
node scripts/harness-workflow-check.js --target projects/portal --runtime brainrot-score
node scripts/harness-workflow-check.js --target projects/eq-test --runtime eq-test --skip-analytics
node scripts/analytics-event-check.js
node scripts/runtime-check.js brainrot-score
```

## Artifacts

Workflow reports:

- `logs/harness-workflow/latest.json`
- `logs/harness-workflow/<timestamp>.json` for the most recent retained runs
- `logs/harness-workflow/<timestamp>.md` for the most recent retained runs

Runtime smoke results:

- `logs/harness-artifacts/runtime/latest-results.json`

Failure diagnostics, when a runtime smoke fails:

- `logs/harness-artifacts/runtime/<timestamp>/<app>/result.json`
- `logs/harness-artifacts/runtime/<timestamp>/<app>/failure.png`
- `logs/harness-artifacts/runtime/<timestamp>/<app>/trace.zip`

## Current Playwright Features In Use

- Playwright `1.60.0`.
- `page.ariaSnapshot({ mode: 'ai' })` to catch blank or inaccessible pages in analytics smoke checks and to store runtime context.
- `page.pageErrors({ filter: 'since-navigation' })` and `page.consoleMessages({ filter: 'since-navigation' })` to collect buffered errors after each scenario.
- Context tracing with screenshots, snapshots, and sources retained only on runtime failure by default.

## Report Retention

- `scripts/harness-workflow-check.js` keeps `latest.json` plus the most recent `8` timestamped workflow runs by default.
- Override with `HARNESS_WORKFLOW_REPORT_KEEP=<number>` when a longer investigation needs more local history; the script always preserves at least the current timestamped run plus `latest.json`.
- Runtime traces and screenshots stay failure-first; normal successful runs should leave compact JSON/Markdown summaries only.
- `logs/harness-workflow/` and `logs/harness-artifacts/` remain ignored workspace artifacts, not committed source-of-truth docs.

## R&D Fit

- Playwright's trace viewer is best used for failed or retried flows because full trace recording is heavier than a normal smoke pass: https://playwright.dev/docs/next/trace-viewer
- The current project pattern is therefore correct: use `ariaSnapshot`, buffered console/page errors, and compact summaries on pass; keep trace/screenshot/source artifacts for failures.
- If a future workflow starts producing repeated noisy diagnostics, add a bounded retention rule in the harness script before adding another Markdown report.

## Retention Coverage

`scripts/analytics-event-check.js` includes `portal-retention-personalization`:

1. Load `/brainrot-score/`.
2. Verify the current app is written to `dopabrain_personalize.recent` and `visits`.
3. Click a cross-promo card and verify `cross_promo_click`.
4. Open `/portal/`.
5. Verify personalized recent/recommend cards render.
6. Click a personalized card and verify `hub_personalized_click`.

This keeps the cross-promo to portal-retention loop from silently regressing.
