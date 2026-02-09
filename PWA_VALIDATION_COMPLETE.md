# PWA 설정 검증 및 수정 - 최종 리포트

**작성일**: 2026-02-10
**대상**: dopabrain.com 34개 앱
**상태**: 진행 중 (6개 완료, 26개 대기)

## 목표

dopabrain.com의 모든 앱(~34개)에 대해 Service Worker(sw.js)와 manifest.json을 일괄 검증하고 수정

## 주요 발견사항

### 1. Service Worker 등록 상태
- **문제**: 대부분의 앱에서 index.html에 Service Worker 등록 스크립트 누락
- **영향**: 앱이 설치되어도 오프라인 모드에서 작동하지 않음
- **해결**: index.html의 </body> 태그 직전에 SW 등록 코드 추가

### 2. sw.js 절대경로 문제
- **문제**: 많은 앱의 sw.js에서 절대경로(/, /index.html 등) 사용
  - 예: `/index.html`, `/css/style.css`, `/js/app.js`
- **영향**: 앱을 서브도메인(예: dopabrain.com/quiz-app/)에서 실행할 때 캐시 실패
- **해결**: 모든 경로를 상대경로로 변환 (./index.html, ./css/style.css 등)

### 3. i18n 로케일 파일 캐싱 누락
- **문제**: sw.js의 urlsToCache에 i18n 로케일 파일이 포함되지 않음
- **영향**: 다국어 지원이 오프라인에서 작동하지 않음
- **해결**: 12개 언어 파일(ko, en, zh, hi, ru, ja, es, pt, id, tr, de, fr) 모두 캐싱 목록에 추가

### 4. manifest.json 아이콘 문제
- **문제**: manifest.json이 icon-192.png, icon-512.png를 참조하지만 실제로는 .svg 파일만 존재
  - 예: Quiz App의 manifest에는 4개의 PNG 참조가 있지만 실제로는 .svg만 존재
- **영향**: PWA 설치 시 아이콘 누락 가능성
- **해결**: 존재하지 않는 파일 참조 제거, SVG 아이콘만 유지, purpose를 "any maskable"으로 통일

### 5. Service Worker 이벤트 핸들러 불완전성
- **문제**:
  - install 이벤트에 skipWaiting() 미포함 → 버전 업데이트 시 지연
  - fetch 이벤트가 단순 캐시 응답만 함 → 캐시 갱신 로직 없음
  - activate 이벤트에 clients.claim() 미포함 → 이전 버전이 새 버전의 앱 제어 안 함
- **영향**: 앱 업데이트 시 사용자가 새 버전을 받지 못할 수 있음
- **해결**: 모든 이벤트 핸들러를 표준 템플릿으로 업그레이드

## 완료된 작업 (6개 앱)

### 1. Quiz App (quiz-app) ✅
**파일**:
- `/projects/quiz-app/index.html`
- `/projects/quiz-app/sw.js`
- `/projects/quiz-app/manifest.json`

**수정 사항**:
1. ✅ index.html: SW 등록 스크립트 추가
2. ✅ manifest.json: 중복 PNG 아이콘 4개 제거, SVG로 통일 (2개로 축약)
3. ✅ sw.js: 이미 좋은 상태 (i18n 파일 포함, 개선된 fetch 로직)

### 2. Affirmation (일일 긍정 확언) ✅
**파일**:
- `/projects/affirmation/index.html`
- `/projects/affirmation/sw.js`
- `/projects/affirmation/manifest.json`

**수정 사항**:
1. ✅ index.html: SW 등록 스크립트 추가
2. ✅ sw.js:
   - 절대경로(/) → 상대경로(./) 변환
   - i18n 로케일 파일 12개 추가
   - skipWaiting() 추가
   - fetch 이벤트 개선 (캐시 갱신 로직)
   - activate 이벤트에 clients.claim() 추가
3. ✅ manifest.json: 중복 아이콘 제거, SVG로 통일

### 3. Detox Timer (디지털 디톡스 타이머) ✅
**파일**:
- `/projects/detox-timer/index.html`
- `/projects/detox-timer/sw.js`
- `/projects/detox-timer/manifest.json`

**수정 사항**:
1. ✅ index.html: SW 등록 스크립트 추가
2. ✅ sw.js: 절대경로 → 상대경로, i18n 파일 추가, 기타 개선
3. ✅ manifest.json: 아이콘 정규화

### 4. Dream Fortune (꿈해몽 & 운세) ✅
**파일**:
- `/projects/dream-fortune/index.html`
- `/projects/dream-fortune/sw.js`
- `/projects/dream-fortune/manifest.json`

**수정 사항**:
1. ✅ index.html: SW 등록 스크립트 추가
2. ✅ sw.js: 절대경로 → 상대경로, i18n 파일 추가, 기타 개선
3. ✅ manifest.json: 아이콘 정규화

### 5. Shopping Calc (해외 쇼핑 환율 계산기) ✅
**파일**:
- `/projects/shopping-calc/index.html`
- `/projects/shopping-calc/sw.js`
- `/projects/shopping-calc/manifest.json`

**수정 사항**:
1. ✅ index.html: SW 등록 스크립트 추가
2. ✅ sw.js:
   - i18n 로케일 파일 12개 추가
   - skipWaiting() 추가
   - fetch 이벤트 개선
   - activate 이벤트에 clients.claim() 추가
3. ✅ manifest.json: 이미 정규화됨

### 6. Idle Clicker (게임) ✅
**파일**:
- `/projects/idle-clicker/index.html`
- `/projects/idle-clicker/sw.js`
- `/projects/idle-clicker/manifest.json`

**수정 사항**:
1. ✅ index.html: 이미 SW 등록되어 있음
2. ✅ sw.js: 이미 좋은 상태 (상대경로, i18n 파일 포함)
3. ⏳ manifest.json: 확인 필요

## 부분 완료 (1개 앱)

### 7. Sky Runner (게임) 🔄
**파일**:
- `/projects/sky-runner/index.html` ✅ 수정함
- `/projects/sky-runner/sw.js` ⏳ 남음
- `/projects/sky-runner/manifest.json` ⏳ 남음

## 대기 중 (26개 앱)

### 게임 (13개)
- stack-tower
- emoji-merge
- memory-card
- color-memory
- reaction-test
- word-scramble
- number-puzzle
- typing-speed
- brain-type
- zigzag-runner
- snake-game
- stress-check
- kpop-position (테스트이지만 게임처럼 동작)

### 테스트/도구 (12개)
- hsp-test
- mbti-love
- mbti-tips
- past-life
- valentine
- love-frequency
- emotion-temp
- dday-counter
- tax-refund-preview
- unit-converter
- white-noise
- dev-quiz

### 포털 (1개)
- portal

## 수정 전략

### 수정할 파일별 작업

#### 1. index.html (26개 앱)
**위치**: `</body>` 태그 직전

**추가 코드**:
```html
<!-- Service Worker 등록 -->
<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service Worker registered'))
                .catch(error => console.log('Service Worker registration failed:', error));
        });
    }
</script>
```

**자동화 팁**:
- 대부분의 앱이 동일한 구조를 가짐
- `</body>` 태그를 찾고 그 직전에 코드 삽입
- 이미 있는 경우는 건너뛰기

#### 2. sw.js (26개 앱)
**수정 항목**:

A. 절대경로 → 상대경로 변환
```javascript
// 변경 전
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    ...
];

// 변경 후
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    ...
];
```

B. i18n 로케일 파일 추가
```javascript
// 캐시 목록 끝에 추가
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
```

C. install 이벤트 개선
```javascript
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();  // 추가
});
```

D. fetch 이벤트 개선
```javascript
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Cache hit - return cached version, but also fetch update
                    fetch(event.request).then(fetchResponse => {
                        if (fetchResponse && fetchResponse.status === 200) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, fetchResponse);
                            });
                        }
                    }).catch(() => {});
                    return response;
                }
                return fetch(event.request);
            })
    );
});
```

E. activate 이벤트 개선
```javascript
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())  // 추가
    );
});
```

#### 3. manifest.json (26개 앱)
**수정 항목**: icons 배열 정규화

```javascript
// 변경 전 (예시)
"icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any" },
    { "src": "icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any" },
    { "src": "icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "maskable" },
    { "src": "icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "maskable" }
]

// 변경 후
"icons": [
    { "src": "icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any maskable" },
    { "src": "icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any maskable" }
]
```

**단계**:
1. 존재하지 않는 파일 참조 제거 (PNG가 없으면 제거)
2. SVG 아이콘만 유지
3. 중복 제거 (같은 src + sizes)
4. purpose 통합 ("any" + "maskable" → "any maskable")

## 예상 효과

이 수정을 통해 달성되는 효과:

| 항목 | 현재 상태 | 수정 후 |
|------|---------|--------|
| **오프라인 모드** | ❌ 작동 안 함 | ✅ 완벽하게 작동 |
| **다국어 오프라인 지원** | ❌ 작동 안 함 | ✅ 12개 언어 지원 |
| **앱 업데이트 감지** | ⚠️ 지연됨 | ✅ 즉시 감지 |
| **서브도메인 지원** | ❌ 작동 안 함 | ✅ 완벽하게 작동 |
| **PWA 설치** | ⚠️ 부분적 | ✅ 완벽한 설치 |
| **캐시 갱신** | ❌ 자동 갱신 없음 | ✅ 백그라운드 갱신 |

## 다음 단계

1. **Phase 1** (진행 중): 6개 핵심 앱 완료 + 1개 부분 완료
2. **Phase 2** (예정): 나머지 26개 앱 수정
3. **Phase 3** (예정): 전체 앱 검증 및 테스트
4. **Phase 4** (예정): Google Play 배포 준비

## 추가 고려사항

### 1. CSS 파일 최적화
일부 앱이 여러 CSS 파일을 사용하는 경우:
```css
/* style.css */
@import url('styles/layout.css');
@import url('styles/colors.css');
/* 등... */
```
이런 경우 캐시 목록에 모두 추가해야 함

### 2. 동적 로드되는 JS 파일
일부 게임이 런타임에 추가 JS 파일을 로드하는 경우:
- 캐시 목록에 미리 추가 필요
- 또는 fetch 이벤트에서 동적으로 캐싱

### 3. API 요청 캐싱
(예: shopping-calc의 환율 API)
- 첫 요청만 캐싱하고 이후는 네트워크 우선
- 또는 시간 기반 캐시 갱신

## 테스트 체크리스트

각 앱 수정 후 검증할 항목:

- [ ] 오프라인 모드 테스트 (DevTools → Network → Offline)
- [ ] 다국어 변경 후 오프라인 테스트
- [ ] PWA 설치 테스트
- [ ] 앱 업데이트 감지 테스트 (캐시 버전 변경)
- [ ] 캐시 저장소 크기 확인 (DevTools → Application → Cache)
- [ ] 모바일 설치 테스트

## 문서 참고

- **CLAUDE.md**: 프로젝트 전체 가이드
- **PWA_FIX_PROGRESS.md**: 진행 현황 추적
- **VALIDATION_REPORT.md**: 초기 검증 리포트

---

**최종 목표**: 2026년 2월 내에 모든 34개 앱의 PWA 설정 완료 및 검증
