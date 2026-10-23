---
name: dopabrain-touch-audit
description: >-
  Audits DopaBrain projects for mobile UX compliance on a 390x844 viewport: ensures 0px horizontal overflow and >=44px interactive touch targets. Use before deploying or committing UX/UI changes.
---

# DopaBrain Mobile Touch & Overflow Audit Skill

This skill automates mobile UX audits on Playwright with a `390x844` viewport (standard iPhone reference), verifying that interactive elements meet WCAG touch target criteria (>=44px) and that pages have zero horizontal overflow (`0px`).

## When to Run
- After modifying styles (`style.css`), layouts, or navigation controls in any `projects/*` directory.
- Before committing and pushing submodule changes.
- When validating new tools, tests, or interactive widgets.

## How to Execute

### 1. Audit a Specific Project / Submodule
```bash
node .agents/skills/dopabrain-touch-audit/scripts/audit-touch.js <project-name>
# Example:
node .agents/skills/dopabrain-touch-audit/scripts/audit-touch.js stress-check
```

### 2. Audit Multiple Submodules
```bash
node .agents/skills/dopabrain-touch-audit/scripts/audit-touch.js stress-check hsp-test puzzle-2048
```

### 3. Audit All Submodules
```bash
node .agents/skills/dopabrain-touch-audit/scripts/audit-touch.js
```
The results are displayed in console and persisted to `logs/touch-audit-latest.json`.

## Common Fix Patterns
- **Touch Target < 44px**:
  ```css
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  ```
- **Horizontal Overflow > 0px**:
  ```css
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  ```
