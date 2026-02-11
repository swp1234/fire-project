# Design Principles & App Themes

> 2026 UI/UX 트렌드 + 앱별 고유 디자인

## 2026 UI/UX Trends (필수 적용)

1. **Glassmorphism 2.0** - backdrop-filter: blur
2. **Microinteractions** - hover/tap 애니메이션, ripple
3. **Dark Mode First** - 다크가 기본
4. **Minimalist Flow** - 여백, 한 화면 한 액션
5. **Progress & Statistics** - 데이터 시각화
6. **Personalization** - LocalStorage 저장
7. **Accessibility** - 색상 대비, 44px 터치 타겟

**References:** Calm, Headspace, Timefully, Wise, Revolut, Co-Star

## CSS 필수 테크닉

```css
/* Glassmorphism */
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);

/* Smooth Transitions */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Glow Effect */
box-shadow: 0 0 30px rgba(primary, 0.3);

/* Gradient Text */
background: linear-gradient(...);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## 앱별 디자인 테마 (대표)

> 전체 앱 목록/메타: `portal/js/app-data.js` 참조

| 앱 | Primary | Style | Reference |
|----|---------|-------|-----------|
| quiz-app | `#667eea` | Game/Quiz | Kahoot |
| shopping-calc | `#f39c12` | Finance | Wise |
| detox-timer | `#00b894` | Meditation | Calm |
| dream-fortune | `#9b59b6` | Mystical | Co-Star |
| affirmation | `#e91e63` | Emotional | Pinterest |
| lottery | `#e74c3c` | Luxury | Casino |
| dday-counter | `#3498db` | Minimal | Apple Calendar |
| mbti-tips | `#1abc9c` | Social | 16Personalities |
| white-noise | `#2c3e50` | Sleep | Noisli |
| dev-quiz | `#27ae60` | Terminal | VS Code |

## New App Checklist

- [ ] All 7 UX trends applied
- [ ] Unique primary color (중복 금지)
- [ ] 3+ microinteractions
- [ ] Dark mode first
- [ ] Statistics visualization
- [ ] Accessibility (44px targets, contrast)
- [ ] i18n 12개 언어 (see docs/I18N.md)
- [ ] app-loader (HTML + CSS + JS hide)
- [ ] cross-promo script
- [ ] GA4 연동

## Copyright Principles

- Fact-based knowledge and public data only
- AI-generated assets only
- No copyrighted images, text, or code
