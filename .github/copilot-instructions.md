# GitHub Copilot Instructions for DopaBrain

> **Primary Source of Truth:** [CLAUDE.md](../CLAUDE.md)
> All architectural boundaries, product rules, and verification criteria are defined in [CLAUDE.md](../CLAUDE.md).

## Key Invariants
- **Core Focus:** Stress Check, HSP Test, 2048 Coach (Secondary: Brain Type, IQ Test, Future Self, K-pop Role Roster).
- **12 Languages:** `ko en zh hi ru ja es pt id tr de fr` via locale JSON and `data-i18n`.
- **Touch & Mobile:** Touch targets >= 44px, zero horizontal overflow on mobile.
- **Git Boundaries:** `projects/*` may be independent Git submodules. Always commit child repos first, then update root submodule pointers.
- **Ad & Privacy:** One Auto Ads loader; no manual slots or rewarded exchanges. Never transmit test answers, scores, or raw inputs to analytics.

## Documentation Reference
- Progress & Blocker: [PROGRESS.md](../PROGRESS.md)
- Operations & Deployment: [docs/OPERATIONS.md](../docs/OPERATIONS.md)
- Validation Criteria: [docs/VALIDATION.md](../docs/VALIDATION.md)
- UX & Design: [docs/UX-DESIGN.md](../docs/UX-DESIGN.md)
