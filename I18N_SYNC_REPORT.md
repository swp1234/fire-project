# I18N Locale Synchronization Report

**Generated:** 2026-02-10
**Total Projects:** 30 apps
**Apps with Locale Folders:** 27
**Apps WITHOUT Locale Folders:** 1 (typing-speed)
**Apps with Issues:** 13

---

## Summary of Issues

### Critical Issues (Many Missing Keys)
1. **idle-clicker**: Missing complete sections (dungeon, monsters, skills, milestones) in multiple languages (en, zh, ja, es, pt, hi, id, tr, de, fr)
2. **tax-refund-preview**: Missing 100+ keys in all non-Korean languages

### Minor Issues (1-5 Missing Keys)
- **brain-type**: ERROR - de.json has incomplete translations
- **color-memory**: Missing `app.loading` in all non-Korean files
- **dday-counter**: Missing `app.loading` in all non-Korean files
- **detox-timer**: Missing `app.loading` and hero section in all non-Korean files
- **dev-quiz**: Missing `game.loading` in de.json
- **dream-fortune**: Missing `app.loading` in all non-Korean files
- **emoji-merge**: Missing app.loading in all non-Korean files
- **emotion-temp**: Missing complete "title" section in de.json
- **hsp-test**: Missing `app.loading` in all non-Korean files
- **kpop-position**: Missing `app.loading` in all non-Korean files
- **love-frequency**: Missing `app.loading` in all non-Korean files
- **white-noise**: Missing `game` and `game.back` in all non-Korean files
- **zigzag-runner**: Missing `recommendations.colorMemory` and `recommendations.colorMemoryDesc` in all non-Korean files

### Apps with Complete Locales (OK)
- affirmation
- detox-timer (minor missing keys)
- emotion-temp (minor missing keys)
- heart-frequency
- kpop-position (minor missing keys)
- lottery
- mbti-love
- mbti-tips
- past-life
- portal
- quiz-app
- reaction-test
- shopping-calc
- sky-runner
- stack-tower
- unit-converter
- valentine

---

## Priority Fix Order

### Priority 1: Critical (100+ keys)
- [ ] tax-refund-preview: Add all missing 100+ keys to all languages

### Priority 2: Major Issues (missing complete sections)
- [ ] idle-clicker: Add dungeon, monsters, skills, milestones sections to en, zh, ja, es, pt, hi, id, tr, de, fr

### Priority 3: Common Pattern (app.loading missing)
- [ ] color-memory
- [ ] dday-counter
- [ ] dream-fortune
- [ ] emoji-merge
- [ ] hsp-test
- [ ] kpop-position
- [ ] love-frequency

### Priority 4: Miscellaneous
- [ ] brain-type: Fix de.json
- [ ] detox-timer: Add hero section to all languages
- [ ] dev-quiz: Add game.loading to de.json
- [ ] emotion-temp: Add complete title section to de.json
- [ ] white-noise: Add game section to all non-Korean files
- [ ] zigzag-runner: Add colorMemory recommendations to all languages

### Apps to Create/Handle
- [ ] typing-speed: Needs locale folder creation (if applicable)

---

## Technical Details

All apps should support 12 languages:
- ko (Korean)
- en (English)
- zh (Chinese)
- hi (Hindi)
- ru (Russian)
- ja (Japanese)
- es (Spanish)
- pt (Portuguese)
- id (Indonesian)
- tr (Turkish)
- de (German)
- fr (French)

Files should be located at: `projects/{app}/js/locales/{lang}.json`
