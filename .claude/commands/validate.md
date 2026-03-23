전체 앱 품질 검증 (BMAD Measure 단계).

병렬 에이전트 4개로 모든 앱 검증:

**에이전트 1 - i18n 안정성:**
- 모든 앱의 i18n IIFE에 try-catch 있는지 확인
- i18n.initialized 플래그 + safety timeout 확인
- 12개 locale JSON 파일 존재 확인

**에이전트 2 - App Loader:**
- app-loader HTML div 존재 확인
- .app-loader CSS (fixed, z-index 10000, transition) 확인
- JS hide 코드 (classList.add('hidden') + setTimeout remove) 확인

**에이전트 3 - 크로스프로모 + GA4:**
- cross-promo.js script 태그 존재 확인
- GA4 스크립트 존재 확인
- SW 등록 코드 확인

**에이전트 4 - HTML/CSS 무결성:**
- 닫히지 않은 div 태그 확인
- 라이트모드 CSS 존재 확인
- meta viewport, charset, theme-color 확인

결과를 테이블로 요약하고 실패 항목 즉시 수정.
