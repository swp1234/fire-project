# PWA 설정 검증 리포트 (2026-02-10)

## 목표
dopabrain.com의 모든 앱(~34개)에 대해 Service Worker(sw.js)와 manifest.json을 검증하고 수정

## 검증 항목

### 1. sw.js 검증
- [x] 파일 존재 확인
- [x] 캐시 이름이 앱별로 고유한지
- [x] 캐시할 파일 목록이 최신인지 (새로 추가된 JS/CSS 파일 포함)
- [x] install, fetch, activate 이벤트 핸들러 존재
- [x] 오프라인 fallback 처리
- [x] i18n 로케일 파일 포함 여부

### 2. manifest.json 검증
- [x] name, short_name 적절한지
- [x] start_url 올바른지
- [x] display: "standalone"
- [x] theme_color, background_color 설정
- [x] icons 배열에 192x192, 512x512 아이콘 경로
- [x] 아이콘 파일(icon-192.svg, icon-512.svg) 실제 존재 확인

### 3. index.html에서 PWA 연동
- [x] manifest.json link 태그 존재
- [x] SW 등록 스크립트 존재
- [x] apple-touch-icon 메타태그
- [x] theme-color 메타태그

## 발견된 주요 문제

### quiz-app 분석
✅ **Good:**
- sw.js: 모든 이벤트 핸들러 존재, i18n 로케일 파일 캐싱 포함
- manifest.json: 정상 구조, .svg 아이콘 포함
- index.html: manifest link 있음, theme-color 있음

⚠️ **Issues:**
- manifest.json의 icons 배열에 icon-192.png, icon-512.png 있는데 실제로는 .svg 파일만 존재
  → 수정: manifest.json에서 PNG 항목 제거

### affirmation 분석
✅ **Good:**
- manifest.json: 정상 구조
- index.html: manifest link, theme-color 있음

⚠️ **Issues:**
- sw.js: 캐시 경로가 절대 경로(/)를 사용하는데 상대 경로(./)로 변경 필요
- sw.js: i18n 로케일 파일이 캐시 목록에 없음
- index.html: Service Worker 등록 스크립트 없음
- manifest.json: icon-192.png, icon-512.png 참조하는데 실제는 .svg만 있음

## 수정 전략

1. **Phase 1**: Service Worker 등록 스크립트 추가 (모든 앱)
2. **Phase 2**: sw.js 업데이트 (캐시 경로 정규화, i18n 파일 추가)
3. **Phase 3**: manifest.json 정규화 (존재하는 아이콘만 참조)
4. **Phase 4**: 검증 및 테스트

## 표준 구조 (권장)

### 표준 index.html PWA 섹션
```html
<head>
  <!-- PWA -->
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#667eea">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="icon-192.svg">
</head>
<body>
  <!-- Body 끝 부분 -->
  <script src="js/i18n.js"></script>
  <!-- 다른 스크립트 -->
  <script>
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed:', error));
    }
  </script>
</body>
```

### 표준 sw.js 캐시 파일 목록
```javascript
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './manifest.json',
    './icon-192.svg',
    './icon-512.svg',
    // i18n 로케일 파일 (모두 포함)
    './js/locales/ko.json',
    './js/locales/en.json',
    './js/locales/zh.json',
    './js/locales/hi.json',
    './js/locales/ru.json',
    './js/locales/ja.json',
    './js/locales/es.json',
    './js/locales/pt.json',
    './js/locales/id.json',
    './js/locales/tr.json',
    './js/locales/de.json',
    './js/locales/fr.json'
];
```

### 표준 manifest.json icons 섹션
```json
{
  "icons": [
    {
      "src": "icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

## 진행 상황

### 우선순위 1 (핵심 앱)
- [ ] quiz-app
- [ ] affirmation
- [ ] detox-timer
- [ ] dream-fortune
- [ ] lottery

### 우선순위 2 (게임)
- [ ] idle-clicker
- [ ] sky-runner
- [ ] stack-tower
- [ ] emoji-merge
- [ ] memory-card
- [ ] color-memory
- [ ] reaction-test
- [ ] word-scramble
- [ ] number-puzzle
- [ ] typing-speed
- [ ] brain-type
- [ ] zigzag-runner
- [ ] snake-game (신규)
- [ ] stress-check

### 우선순위 3 (테스트/도구)
- [ ] hsp-test
- [ ] kpop-position
- [ ] mbti-love
- [ ] mbti-tips
- [ ] past-life
- [ ] valentine
- [ ] love-frequency
- [ ] emotion-temp
- [ ] dday-counter
- [ ] shopping-calc
- [ ] tax-refund-preview
- [ ] unit-converter
- [ ] white-noise
- [ ] dev-quiz

### 우선순위 4 (포털)
- [ ] portal

## 완료 체크리스트
- [ ] 34개 앱 모두 검증 완료
- [ ] 필요한 수정사항 모두 적용
- [ ] index.html에 SW 등록 스크립트 추가
- [ ] sw.js 상대 경로로 정규화
- [ ] manifest.json 정규화
- [ ] 모든 앱 테스트 (오프라인 모드 포함)
