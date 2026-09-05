# Harness Workflow

## Two gates

Full regression runs the registered static, mutation, analytics and representative browser checks in order, stopping on the first failure:

```powershell
npm run harness
```

Use it for broad changes and the final root release. For one product, use the smaller release path during iteration:

```powershell
node scripts/harness-workflow-check.js --target projects/qr-generator --release-verifier scripts/verify-qr-generator-trust.js
```

Release mode runs the chosen registered verifier plus documentation, quality, submitted-index, secret and advertising safety gates. It does not replace the final full regression.

`--plan` validates unique step names, script existence and the verifier path without running checks. Product verifiers own feature contracts; the shared runtime owns portfolio smoke coverage.

## Direct diagnostics

```powershell
npm run harness:analytics
node scripts/runtime-check.js focused
node scripts/runtime-check.js <app-name>
```

Use `runtime-check.js all` only for broad browser regressions. Runtime and analytics scenarios use isolated browser contexts and up to three workers; set `RUNTIME_CONCURRENCY=1` or `ANALYTICS_CONCURRENCY=1` for serial reproduction. Exposure qualification and crash-watch timers remain real time.

## Reports

- Successful reports retain step name, result and duration; failures also retain diagnostic tails.
- Large screenshots and traces are kept only on failure under ignored artifact directories.
- Do not copy generated reports into Markdown session history.
- `docs/VALIDATION.md` defines the verification layers and completion criteria.
