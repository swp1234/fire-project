# MBTI Career Compatibility Test

당신의 MBTI 성격 유형에 맞는 최고의 직업을 발견하세요. 과학 기반의 테스트로 진로를 결정하세요.

## 주요 기능

### 📊 정확한 MBTI 분석
- **빠른 테스트**: 12개 질문으로 2분 내 MBTI 유형 판단
- **직접 선택**: 16가지 MBTI 타입 중 직접 선택 가능
- 정확한 심리학 기반 질문 설계

### 💼 직업 매칭 및 분석
- 각 MBTI별 **TOP 10 추천 직업**
- 직업별 **적합도 별점** (1-5점)
- 직업 카테고리: IT, 의료, 교육, 예술, 경영, 법률 등

### 🎯 심층 분석
- **강점/약점 레이더 차트**: 5가지 주요 능력 시각화
- **팀 호환성 분석**: 함께 일하면 좋을 MBTI 유형
- **AI 심층 진로 분석**: 광고 시청 후 맞춤형 조언

### 🌍 다국어 지원 (12개 언어)
- 한국어, 영어, 일본어, 중국어, 스페인어
- 포르투갈어, 인도네시아어, 터키어
- 독일어, 프랑스어, 힌디어, 러시아어

### 📱 PWA (Progressive Web App)
- 모바일 앱처럼 설치 가능
- 오프라인 작동 지원
- 빠른 로딩 속도

### 📸 결과 공유
- Canvas 기반 결과 이미지 자동 생성
- Web Share API 통합 (SNS 공유)
- 고유 URL로 결과 공유

### 💰 수익화 옵션
- **Google AdSense**: 배너 광고 (상단, 하단)
- **프리미엄 콘텐츠**: 광고 시청 후 심층 분석
- **Google Analytics 4**: 사용자 행동 추적

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: 2026 UI/UX 트렌드 (Glassmorphism, Dark Mode First)
- **Responsiveness**: Mobile-first design (360px~1920px)
- **PWA**: Service Worker, Web App Manifest
- **i18n**: 12개 언어 지원 (JSON 기반)
- **Analytics**: Google Analytics 4 (G-J8GSWM40TV)
- **Ads**: Google AdSense (ca-pub-3600813755953882)

## 파일 구조

```
mbti-career/
├── index.html                 # 메인 HTML
├── manifest.json             # PWA 설정
├── sw.js                     # Service Worker
├── icon-192.svg, icon-512.svg # PWA 아이콘
│
├── css/
│   └── style.css             # 전체 스타일 (반응형)
│
└── js/
    ├── app.js                # 메인 애플리케이션 로직
    ├── i18n.js              # 다국어 시스템
    ├── mbti-data.js         # 16 MBTI 데이터 + 직업 데이터
    │
    └── locales/             # 12개 언어 파일
        ├── ko.json          # 한국어
        ├── en.json          # English
        ├── ja.json          # 日本語
        ├── zh.json          # 中文
        ├── es.json          # Español
        ├── pt.json          # Português
        ├── id.json          # Bahasa Indonesia
        ├── tr.json          # Türkçe
        ├── de.json          # Deutsch
        ├── fr.json          # Français
        ├── hi.json          # हिन्दी
        └── ru.json          # Русский
```

## 화면 구성

### 1. 홈 스크린
- 앱 소개 및 3가지 주요 기능 설명
- "빠른 테스트" vs "직접 선택" 버튼

### 2. 테스트 스크린
- 12개의 성격 질문
- 진행률 바
- 이전/다음 버튼
- 답변 저장 (페이지 나갔다가 돌아와도 유지)

### 3. MBTI 선택 스크린
- 16가지 MBTI 아이콘 그리드
- 클릭으로 즉시 결과 표시

### 4. 결과 스크린
- **MBTI 요약**: 유형 + 아이콘 + 설명
- **강점/약점 차트**: CSS 레이더 차트
- **직업 추천**: TOP 10 카드 (적합도 별점)
- **팀 호환성**: 3가지 추천 MBTI
- **프리미엄 버튼**: "AI 심층 진로 분석"
- **공유 버튼**: 이미지/URL 공유

### 5. 프리미엄 모달
- 광고 영역
- 광고 시청 후 상세 분석 표시
- 진로 조언, 업무 환경, 경력 개발 팁

## 사용자 흐름

```
홈 화면
  ↓
[빠른 테스트] ← → [직접 선택]
  ↓                    ↓
테스트 (12문제)   MBTI 그리드
  ↓                    ↓
결과 화면 ←─────────────┘
  ├─ 강점/약점 차트
  ├─ 직업 추천
  ├─ 팀 호환성
  ├─ [프리미엄 분석] → [광고] → 심층 분석
  ├─ [결과 이미지 저장]
  ├─ [결과 공유]
  └─ [다시 테스트]
```

## MBTI 데이터

### 16가지 MBTI 유형
각 유형별로 다음 정보 포함:
- **이름 & 설명**: 한국어 + 영어
- **아이콘**: 감정 이모지
- **강점**: 5가지 (점수 포함)
- **약점**: 5가지 (점수 포함)
- **추천 직업**: TOP 10 (직업명, 카테고리, 설명, 적합도)
- **팀 호환성**: 3가지 MBTI 유형
- **프리미엄 분석**: 진로 조언, 업무 환경, 경력 팁

### 직업 카테고리
IT, Finance, Healthcare, Education, Management, Law, Science, Creative, Marketing, HR, Sales, Consulting, Event, Construction, Trade, Military, Law Enforcement, Service, Hospitality, Travel, Fitness, Beauty, Culinary 등

## 스타일 & 디자인

### 색상 팔레트
- **배경**: `#0f0f23` (Dark Navy)
- **테마**: `#2c3e50` (Professional Navy)
- **강조**: `#3498db` (Sky Blue)
- **텍스트**: `#ffffff` (White)
- **보조**: `#b0b8c1` (Gray)

### 2026 UI/UX 트렌드 적용
- ✅ **Glassmorphism 2.0**: 반투명 배경 + 블러 효과
- ✅ **Microinteractions**: 호버 애니메이션, 리플 효과
- ✅ **Dark Mode First**: 어두운 배경 기본
- ✅ **Minimalist Flow**: 여백 있는 깔끔한 레이아웃
- ✅ **Data Visualization**: 레이더 차트 (SVG)
- ✅ **Accessibility**: 44px+ 터치 타겟, 충분한 색상 대비

## 기술 하이라이트

### 1. 반응형 디자인
```css
- Mobile: 360px ~ 480px
- Tablet: 481px ~ 768px
- Desktop: 769px ~ 1920px
- 터치 타겟: 최소 44x44px
```

### 2. 레이더 차트 (Canvas/SVG)
```javascript
- 5개 축 (강점/약점)
- 100점 만점
- 부드러운 애니메이션
- 선형 그라데이션
```

### 3. 다국어 시스템
```javascript
- localStorage에 언어 설정 저장
- JSON 기반 번역 관리 (dot notation)
- data-i18n 속성으로 자동 업데이트
- 언어 변경 시 GA4 이벤트 기록
```

### 4. PWA 기능
```javascript
- Service Worker로 오프라인 캐싱
- manifest.json으로 설치 가능
- Web App Manifest 지원
- 시작 화면 아이콘
```

## 광고 & 수익화

### AdSense 광고 배치
- **상단**: 수평 배너 (반응형)
- **하단**: 수평 배너 (반응형)
- **프리미엄 모달**: 직사각형 광고

### Google Analytics 4
- 테스트 완료 이벤트
- 프리미엄 모달 조회
- 프리미엄 언락 (광고 시청)
- 결과 공유 (이미지/URL)
- 언어 변경

## 프리미엄 콘텐츠

각 MBTI별 심층 분석:

1. **당신의 최적 진로**
   - 직업 선택 기준
   - 경력 발전 방향
   - 10년 목표

2. **이상적인 업무 환경**
   - 조직 문화
   - 업무 유형
   - 동료 관계

3. **경력 개발 팁**
   - 자신감 구축
   - 약점 보완
   - 성장 기회

## 성능 최적화

- ✅ 최소 JS 번들 (번들링 없음, Vanilla JS)
- ✅ 캐싱: Service Worker로 모든 자산 캐시
- ✅ 지연 로딩: 언어 파일은 필요할 때만 로드
- ✅ 이미지: SVG 아이콘 (벡터, 가벼움)
- ✅ 간소화된 CSS: 인라인 스타일 최소화

## 접근성 (Accessibility)

- ✅ 색상 대비: WCAG AA 기준 충족
- ✅ 터치 타겟: 최소 44x44px
- ✅ 키보드 네비게이션: 탭 순서 관리
- ✅ 스크린 리더: aria-label, role 지원
- ✅ 포커스 상태: outline 가시성 확보

## SEO

- ✅ Schema.org WebApplication 마크업
- ✅ Open Graph (SNS 공유) 메타태그
- ✅ 구조화된 데이터 (JSON-LD)
- ✅ Canonical 태그
- ✅ Mobile viewport 설정

## 브라우저 호환성

- Chrome/Edge: 최신 버전 ✅
- Firefox: 최신 버전 ✅
- Safari: 최신 버전 ✅
- iOS Safari: PWA 지원 (부분) ⚠️

## 개발 방법

### 로컬 테스트
```bash
cd projects/mbti-career
python -m http.server 8000
# http://localhost:8000
```

### 언어 추가
1. `js/locales/[lang].json` 생성
2. `i18n.supportedLanguages` 배열에 추가
3. `index.html` 언어 선택 버튼 추가

### 직업 데이터 수정
1. `js/mbti-data.js` 수정
2. 각 MBTI의 `careers` 배열 업데이트
3. `js/locales/*.json`의 직업명 번역 확인

## 보안

- ❌ 민감한 데이터 저장 없음 (localStorage만 언어 설정)
- ✅ HTTPS 권장
- ✅ CSP 헤더 설정 권장
- ✅ 외부 라이브러리 최소화

## 성과 지표

### 주요 KPI
- **DAU (Daily Active Users)**
- **세션 길이 (평균 3-5분)**
- **재방문율 (15-30%)**
- **프리미엄 전환율 (광고 시청)**

### GA4 이벤트
- `language_changed`
- `test_completed`
- `premium_modal_shown`
- `premium_unlocked`
- `result_image_shared`
- `result_url_shared`

## 향후 개선 사항

- [ ] WebSocket으로 친구 호환성 비교
- [ ] 직업별 월급 정보 추가
- [ ] 배경 음악/효과음
- [ ] 소셜 로그인 (결과 저장)
- [ ] 커뮤니티 (결과 공유, 댓글)
- [ ] A/B 테스트 (질문 변형)
- [ ] 심화 테스트 (50+ 질문)
- [ ] API 연동 (직업 정보, 급여 데이터)

## 라이선스

MIT License - 자유로운 사용, 수정, 배포 가능

## 개발자

Claude Code (Anthropic)
- AI 기반 풀스택 개발
- 2026년 UI/UX 트렌드 적용
- 12개 언어 i18n 지원

## 문의

- 버그 리포트: GitHub Issues
- 기능 제안: GitHub Discussions
- 번역 협력: Pull Requests

---

**Version**: 1.0.0
**Release Date**: 2026.02.10
**Status**: ✅ Production Ready
