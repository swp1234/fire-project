# GitHub Copilot Instructions for DopaBrain

> **SSOT:** [CLAUDE.md](../CLAUDE.md) defines all architectural invariants, core portfolio, ad-safety rules, and verification commands.

## Key Invariants
- **Core Focus:** `stress-check`, `hsp-test`, `future-self`, `color-blindness`, `iq-test`, `kpop-position`, `portal`, `puzzle-2048`, `brain-type` (`https://dopabrain.com/`).
- **12 Locales:** `ko en zh hi ru ja es pt id tr de fr` via `data-i18n` and locale JSON.
- **Ad & Privacy:** One Auto Ads loader (`data-ad-client`); zero manual units, rewarded exchanges, or raw score/answer telemetry.
- **Git Boundaries:** Commit/push `projects/*` submodules first, then update root pointers; follow [OPERATIONS.md](../docs/OPERATIONS.md) & [VALIDATION.md](../docs/VALIDATION.md).
