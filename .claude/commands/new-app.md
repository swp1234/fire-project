새 앱 생성 (BMAD Build 단계). 인자: $ARGUMENTS

1. **기획 (Plan):** 앱 컨셉, 타겟 유저, 핵심 기능 정의
2. **설계 (Design):** docs/DESIGN.md 참조, 고유 primary color 선정, UI 와이어프레임
3. **구현 (Build):** 병렬 에이전트로:
   - 에이전트1: index.html + css/style.css (다크모드 우선, app-loader, 라이트모드)
   - 에이전트2: js/app.js (핵심 로직, GA4, error-handler)
   - 에이전트3: js/i18n.js + 12개 locales JSON
   - 에이전트4: sw.js + manifest.json
4. **검증 (Validate):** docs/VALIDATION.md 체크리스트 전체 통과 확인
5. **배포 (Deploy):**
   - portal/js/app-data.js에 앱 추가
   - cross-promo.js script 태그 추가
   - sitemap 업데이트
   - git commit & push

모든 단계 자율 진행, 확인 질문 없음.
