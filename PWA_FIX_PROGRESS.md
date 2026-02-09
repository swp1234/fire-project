# PWA 설정 수정 진행 현황

## 완료 (6개 앱)

### Tier 1 - 핵심 앱
1. **quiz-app** ✅
   - index.html: SW 등록 코드 추가
   - manifest.json: 중복 PNG 아이콘 제거, SVG로 통일
   - sw.js: 이미 좋은 상태

2. **affirmation** ✅
   - index.html: SW 등록 코드 추가
   - sw.js: 절대경로(/) → 상대경로(./) 변환, i18n 로케일 파일 추가, skipWaiting() 추가, fetch 개선
   - manifest.json: 중복 아이콘 제거, SVG로 통일

3. **detox-timer** ✅
   - index.html: SW 등록 코드 추가
   - sw.js: 절대경로 → 상대경로 변환, i18n 로케일 파일 추가, 기타 개선
   - manifest.json: 중복 아이콘 제거

4. **dream-fortune** ✅
   - index.html: SW 등록 코드 추가
   - sw.js: 절대경로 → 상대경로 변환, i18n 로케일 파일 추가, 기타 개선
   - manifest.json: 중복 아이콘 제거

5. **shopping-calc** ✅
   - index.html: SW 등록 코드 추가
   - sw.js: i18n 로케일 파일 추가, skipWaiting() 추가, fetch 개선, claim() 추가
   - manifest.json: 이미 정규화됨

### Tier 2 - 게임 (SW 등록 확인)
6. **idle-clicker** ✅
   - index.html: 이미 SW 등록됨
   - sw.js: 이미 좋은 상태 (모든 파일 캐싱)
   - manifest.json: 확인 필요

## 남은 작업 (약 28개 앱)

### Tier 2 - 게임
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
- [ ] snake-game
- [ ] stress-check

### Tier 3 - 테스트/도구
- [ ] hsp-test
- [ ] kpop-position
- [ ] mbti-love
- [ ] mbti-tips
- [ ] past-life
- [ ] valentine
- [ ] love-frequency
- [ ] emotion-temp
- [ ] dday-counter
- [ ] tax-refund-preview
- [ ] unit-converter
- [ ] white-noise
- [ ] dev-quiz

### Tier 4 - 포털
- [ ] portal

## 수정 패턴

### 패턴 1: 절대경로(/path) 사용하는 sw.js
특징:
- `/index.html`, `/js/app.js` 등 절대경로 사용
- i18n 로케일 파일 미포함

수정:
1. `./path` 상대경로로 변환
2. i18n 로케일 파일 12개 추가
3. `self.skipWaiting()` 추가
4. fetch 이벤트 개선 (캐시 갱신 로직)
5. activate 이벤트에 `self.clients.claim()` 추가

### 패턴 2: 상대경로(./path) 사용하는 sw.js (좋음)
특징:
- `./index.html`, `./js/app.js` 등 상대경로 이미 사용
- 하지만 i18n 로케일 파일 미포함 가능

수정:
1. i18n 로케일 파일 12개 추가 (누락된 경우)
2. `self.skipWaiting()` 추가 (없는 경우)
3. fetch 이벤트 개선 (필요한 경우)
4. activate 이벤트 개선 (필요한 경우)

### 패턴 3: manifest.json 아이콘 정규화
특징:
- PNG 파일도 참조하지만 실제로는 SVG만 존재
- 중복된 아이콘 정의

수정:
1. 존재하지 않는 PNG 아이콘 제거
2. SVG 아이콘만 유지
3. purpose를 "any maskable"로 통일

### 패턴 4: index.html에 SW 등록 스크립트 추가
위치: `</body>` 태그 직전에 다음 코드 추가
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

## 표준 sw.js 템플릿

```javascript
// [앱명] - Service Worker
const CACHE_NAME = '[app-name]-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/i18n.js',
    './manifest.json',
    './icon-192.svg',
    './icon-512.svg',
    // 추가 파일들...
    // i18n 로케일 파일 (필수)
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

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

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});
```

## 표준 manifest.json 아이콘 섹션

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

## 검증 체크리스트

- [x] quiz-app
- [x] affirmation
- [x] detox-timer
- [x] dream-fortune
- [x] shopping-calc
- [x] idle-clicker
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
- [ ] snake-game
- [ ] stress-check
- [ ] hsp-test
- [ ] kpop-position
- [ ] mbti-love
- [ ] mbti-tips
- [ ] past-life
- [ ] valentine
- [ ] love-frequency
- [ ] emotion-temp
- [ ] dday-counter
- [ ] tax-refund-preview
- [ ] unit-converter
- [ ] white-noise
- [ ] dev-quiz
- [ ] portal
