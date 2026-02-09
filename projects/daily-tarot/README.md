# Daily Tarot Reading - 오늘의 타로 운세

**바이럴 심리테스트 타로 앱 - 22장 메이저 아르카나 카드**

## 프로젝트 개요

Daily Tarot는 22장의 메이저 아르카나 타로 카드를 이용한 일일 운세 앱입니다. 3장 카드 스프레드(과거/현재/미래), 카테고리별 운세(러브/금전/건강), 그리고 AI 심층 리딩을 제공합니다.

**주요 특징:**
- 22장 메이저 아르카나 카드
- 3장 카드 스프레드 (과거/현재/미래)
- 정방향/역방향 해석
- 러브/금전/건강/개인성장 카테고리
- AI 심층 타로 리딩 (광고 시청 후)
- 타로 카드 갤러리
- 결과 공유 기능 (Web Share API)
- Canvas 결과 이미지 생성
- 일일 1회 무료 점사, 추가는 광고 시청

## 기술 스택

- **HTML5**: 시맨틱 마크업, PWA 메니페스트
- **CSS3**: Glassmorphism, 다크모드, 모바일 반응형
- **Vanilla JavaScript**: 프레임워크 없음, ES6+
- **Service Worker**: 오프라인 지원
- **LocalStorage**: 앱 상태 저장

## 파일 구조

```
daily-tarot/
├── index.html              # 메인 HTML (440줄+)
├── manifest.json           # PWA 설정
├── sw.js                   # Service Worker
├── icon-192.svg           # 앱 아이콘 (192px)
├── icon-512.svg           # 앱 아이콘 (512px)
├── css/
│   └── style.css          # 전체 스타일 (2000+ 줄)
└── js/
    ├── i18n.js            # 다국어 지원 (12언어)
    ├── tarot-data.js      # 22장 카드 데이터 + 해석
    ├── app.js             # 메인 앱 로직 (600+ 줄)
    └── locales/
        ├── ko.json        # 한국어
        ├── en.json        # English
        ├── zh.json        # 中文
        ├── ja.json        # 日本語
        ├── hi.json        # हिन्दी
        ├── ru.json        # Русский
        ├── es.json        # Español
        ├── pt.json        # Português
        ├── id.json        # Bahasa Indonesia
        ├── tr.json        # Türkçe
        ├── de.json        # Deutsch
        └── fr.json        # Français
```

## 기능 상세

### 1. 일일 운세 읽기
- 3장 카드 드로우 (과거/현재/미래)
- 3D 카드 플립 애니메이션
- 정방향/역방향 자동 판별
- 종합 메시지 생성

### 2. AI 심층 리딩
- 패턴 분석
- 개인화된 조언
- 실천 과제 (3개)
- 광고 시청 후 제공

### 3. 카테고리별 운세
- 💕 러브 (연애)
- 💰 금전 (금전/직업)
- 💪 건강 (건강/웰니스)
- 🌟 개인성장

### 4. 타로 카드 갤러리
- 22장 전체 카드 표시
- 각 카드 클릭 시 상세 정보
- 정방향/역방향 설명

### 5. 공유 기능
- Web Share API (모바일)
- 클립보드 복사 (데스크톱)
- 결과 이미지 생성 (Canvas)
- SNS 최적화 (Open Graph)

### 6. 다국어 지원
- 12개 언어 완벽 지원
- 자동 언어 감지
- 언어 선택기 UI
- LocalStorage 저장

## 2026 UI/UX 트렌드

✅ **Glassmorphism 2.0** - 반투명 배경 + 블러 효과
✅ **Microinteractions** - 카드 플립, 호버 효과, 펄스 애니메이션
✅ **Dark Mode First** - 어두운 배경 (#0f0f23), 밝은 텍스트
✅ **Minimalist Flow** - 한 화면 한 액션, 넉넉한 여백
✅ **Progress & Statistics** - 운세 분석, 카드 해석
✅ **Personalization** - 언어/테마 선택, LocalStorage 저장
✅ **Accessibility** - 색상 대비, 44px 터치 타겟, 키보드 네비게이션

## 2026 디자인 적용

- **주요색**: #9b59b6 (보라/신비로움)
- **강조색**: #e8c547 (금색)
- **배경**: #0f0f23 (거의 검은 색)
- **표면**: #1a1a2e, #252540
- **테마색**: 타로 카드의 신비로운 느낌

## 광고 & 수익화

### AdSense
- 상단 배너 광고
- 하단 배너 광고
- 반응형 레이아웃

### AdMob (앱 버전)
- 전면 광고 (AI 심층 리딩 전)
- 보상형 광고 (추가 운세)

### 프리미엘 콘텐츠
- **무료**: 기본 3장 카드 스프레드 + 해석
- **프리미엄** (광고 시청 후):
  - AI 심층 타로 리딩
  - 패턴 분석
  - 개인화된 조언
  - 실천 과제

## SEO & 분석

### Schema.org
```json
{
  "@type": "WebApplication",
  "name": "Daily Tarot Reading",
  "applicationCategory": "EntertainmentApplication",
  "inLanguage": ["ko", "en", "zh", "ja", "hi", "ru", "es", "pt", "id", "tr", "de", "fr"]
}
```

### Google Analytics 4
- Event ID: `G-J8GSWM40TV`
- 추적: 운세 조회, 카테고리 선택, 공유

### Open Graph
- 메타 태그 완벽 적용
- 이미지: icon-512.svg
- 다국어 hreflang 태그

## PWA 기능

✅ **manifest.json** - 설치 가능, 독립형 앱 모드
✅ **Service Worker** - 오프라인 지원, 캐싱 전략
✅ **아이콘** - 192px, 512px (SVG)
✅ **색상** - 테마 색상 #9b59b6

## 로컬 테스트

```bash
# 로컬 서버 실행
cd projects/daily-tarot
python -m http.server 8000

# 브라우저에서 접속
http://localhost:8000
```

## 배포

```bash
# Git 초기화 (이미 완료)
git init
git add .
git commit -m "Daily Tarot: 22 Major Arcana cards with 3-card spread, AI analysis, 12-language support"

# 원격 저장소 연결 (필요시)
git remote add origin https://github.com/dopabrain/daily-tarot.git
git push -u origin main
```

## 파일 체크리스트

- [x] index.html - PWA 완벽 적용
- [x] manifest.json - PWA 메니페스트
- [x] sw.js - Service Worker
- [x] icon-192.svg - 앱 아이콘
- [x] icon-512.svg - 앱 아이콘
- [x] css/style.css - 2026 트렌드 디자인
- [x] js/i18n.js - 다국어 로더
- [x] js/tarot-data.js - 22장 카드 데이터
- [x] js/app.js - 메인 로직
- [x] js/locales/ko.json - 한국어
- [x] js/locales/en.json - English
- [x] js/locales/zh.json - 中文
- [x] js/locales/ja.json - 日本語
- [x] js/locales/hi.json - हिन्दी
- [x] js/locales/ru.json - Русский
- [x] js/locales/es.json - Español
- [x] js/locales/pt.json - Português
- [x] js/locales/id.json - Bahasa Indonesia
- [x] js/locales/tr.json - Türkçe
- [x] js/locales/de.json - Deutsch
- [x] js/locales/fr.json - Français

## 라이선스

Copyright © 2026 DopaBrain. All rights reserved.

## 개발자

Sang-woo Park (상우)
- AI-based App Development
- AdMob SDK Integration
- Google Play 준비

---

**바이럴 전략**: 타로 결과 공유 → SNS 자연 확산 → 트래픽 유입 → 광고 수익
