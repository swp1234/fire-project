---
name: dopabrain-funnel-bridge
description: >-
  Audits and optimizes DopaBrain conversion funnels: detects and eliminates suspended/unmonetized app links, guarantees language parameter preservation (?lang=), ensures CTA destination-description consistency, and prevents telemetry result leakage.
---

# DopaBrain Funnel Bridge & Revenue Optimization Skill

This skill automates conversion funnel integrity audits across `dopabrain.com`, ensuring traffic never leaks into unmonetized dead ends, users never drop into incorrect language defaults, and privacy invariants remain 100% compliant.

## When to Run
- After editing blog articles (`projects/portal/blog/*`), hub pages (`games/`, `tests/`), or assessment landing pages.
- When auditing traffic bounce rates or preparing for AdSense revenue expansion.
- Before committing and pushing submodule changes.

## How to Execute

### 1. Run the Funnel Audit
```bash
node .agents/skills/dopabrain-funnel-bridge/scripts/audit-funnel.js
# Or via npm script:
npm run skill:funnel-bridge
```

## Core Compliance Rules
1. **Zero Suspended Links**:
   - Links must NEVER route to invalid-traffic suspended apps (`dark-core`, `past-life`, `daily-tarot`, `numerology`, `flappy-bird`, `brick-breaker`, `snake-game`, etc.).
   - Route to core active monetized assessments instead:
     - Stress & Overwhelm $\rightarrow$ `/stress-check/?lang={currentLang}`
     - Sensitivity & Overload $\rightarrow$ `/hsp-test/?lang={currentLang}`
     - Relationships & Attachment $\rightarrow$ `/attachment-style/?lang={currentLang}`
     - Flaws & Behavioral Habits $\rightarrow$ `/toxic-trait/?lang={currentLang}`
     - Long-term Vision & Values $\rightarrow$ `/future-self/?lang={currentLang}`
     - Cognitive Style & Focus $\rightarrow$ `/brain-type/?lang={currentLang}`
2. **Strict Language Preservation**:
   - Always append `?lang={currentLang}` on cross-promotion links.
   - NEVER assume English is the default and strip the parameter (`url.searchParams.delete('lang')`), as Korean-default submodules (`future-self`, `animal-personality`) will bounce international visitors to Korean.
3. **Destination-Description Honesty**:
   - Cards and CTAs must truthfully describe their exact destination (e.g. do not label `/future-self/` as "Flappy Bird", do not label `/dark-core/` as "Inner Child Test").
4. **Telemetry Privacy Invariant**:
   - Analytics events (`stress_hero_cta_click`, `content_cta_click`, etc.) must NEVER include user scores, results, answers, or medical/psychological scores (`stress_score`, `score`, `result_type`, `percentage`).
   - Only technical navigation metadata (`target_key`, `surface`, `cta_position`) is permitted.
5. **Sitemap & Date Synchronization**:
   - Whenever an article is updated, ensure HTML `dateModified` matches `sitemap.xml` `<lastmod>2026-10-24</lastmod>`.
   - Submit updated URLs via `npm run indexnow:submit -- --url <url>`.
