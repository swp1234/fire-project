# Project Completion Validation

> 배포 전 AI가 직접 검증하는 체크리스트

## 1. Code Validation
- [ ] No HTML syntax errors
- [ ] No CSS syntax errors
- [ ] No JavaScript console errors
- [ ] All file paths correct (case-sensitive)

## 2. Functionality Test
- [ ] Core features work correctly
- [ ] All buttons/links clickable
- [ ] Input fields work
- [ ] LocalStorage save/load works
- [ ] Error handling in place

## 3. UI/UX Test
- [ ] Mobile responsive (360px ~ 480px)
- [ ] Desktop layout correct
- [ ] Dark mode displays properly
- [ ] Animations smooth
- [ ] Touch targets 44px+

## 4. PWA Validation
- [ ] manifest.json valid
- [ ] Icons exist (192, 512)

## 5. Ad Areas
- [ ] Top banner visible
- [ ] Bottom banner visible
- [ ] Interstitial logic works (if applicable)

## 6. Accessibility
- [ ] Sufficient color contrast
- [ ] Readable font sizes
- [ ] Keyboard navigation possible

## 7. i18n Validation
- [ ] i18n.js loader exists
- [ ] js/locales/ has 12 language files
- [ ] Language selector UI exists
- [ ] All user-facing text uses i18n keys
- [ ] Language switch updates all text
- [ ] localStorage saves/restores language

## 8. Integration
- [ ] app-loader CSS + JS hide logic
- [ ] cross-promo.js script included
- [ ] GA4 tracking active

## Test Commands
```bash
start index.html
python -m http.server 8000
# F12 → Console tab for errors
```

## Record Format
```
✅ Code: Pass
✅ Functionality: Pass
✅ UI/UX: Pass
✅ PWA: Pass
✅ i18n: Pass
⚠️ Issues: (if any)
```
