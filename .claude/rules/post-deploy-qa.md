---
description: Auto-triggered after modifying any app in projects/
globs:
  - "projects/*/index.html"
  - "projects/*/js/*.js"
  - "projects/*/css/*.css"
---

# Post-Deploy QA Rule

After committing changes to any app, run the live-check script to verify:

```bash
bash scripts/live-check.sh projects/<app-name>
```

## Mandatory Checks Before Push

1. **No `/_common/js/` references** — use `/portal/js/` instead (common modules deployed at portal)
2. **typeof guards** on optional modules: `DailyStreak`, `GameAchievements`, `GameAds`, `Haptic`
3. **Light mode visibility** — if app has theme-toggle, verify `[data-theme="light"]` CSS has contrasting `--text` color
4. **App-loader hide** — JS must have code to hide `#app-loader` (reachable even if i18n fails)
5. **i18n try-catch** — i18n init must be wrapped in try-catch so loader-hide always executes
6. **No broken script refs** — all `<script src="...">` must point to files that exist

## After Batch Changes

When modifying multiple apps (e.g., adding common modules, changing shared patterns):
- Run `bash scripts/live-check.sh all` to verify ALL apps
- Fix any FAIL results before pushing
