# Fire Project 종합 코드 리뷰 보고서

**검토 대상**: dopabrain.com 전체 앱 (약 50개)
**검토 일시**: 2026-02-10
**검토자**: Claude Code
**우선순위**: 보안 취약점 > JavaScript 에러 > 코드 품질 > 호환성

---

## 🔴 심각한 보안 취약점 (CRITICAL)

### 1. 인라인 onclick 속성 + 동적 ID 삽입 (XSS 위험)

**파일**:
- `affirmation/js/app.js` (Line 316)
- `dday-counter/js/app.js` (Line 256, 259)
- `dream-fortune/js/app.js` (Line 1208)
- `habit-tracker/js/app.js` (Line 331, 364, 392, 393)
- `idle-clicker/js/app.js` (Line 1641, 1753, 1910, 2659, 2882-2885)
- `lottery/js/app.js` (Line 279, 299, 403, 420)

**문제점**:
```javascript
// 취약한 패턴
innerHTML = `<button onclick="app.removeFavorite('${fav.id}')">✕</button>`;
```

**위험성**:
- `fav.id`가 외부 데이터(API, 사용자 입력)인 경우, XSS 공격 가능
- 예: `fav.id = "'); alert('XSS'); ('"`라면 `onclick` 이벤트가 주입됨
- 악성 코드 실행 가능

**수정 방안**:
```javascript
// 안전한 패턴 1: addEventListener 사용
const btn = document.createElement('button');
btn.textContent = '✕';
btn.addEventListener('click', () => app.removeFavorite(fav.id));
btn.className = 'remove-favorite';

// 안전한 패턴 2: data 속성 + dataset
const btn = document.createElement('button');
btn.textContent = '✕';
btn.className = 'remove-favorite';
btn.dataset.id = fav.id;
btn.addEventListener('click', (e) => app.removeFavorite(e.target.dataset.id));
```

**영향 받는 앱**: affirmation, dday-counter, dream-fortune, habit-tracker, idle-clicker, lottery (6개)

---

### 2. innerHTML에 사용자/API 데이터 직접 삽입

**파일**:
- `affirmation/js/app.js` (Line 250, 254-267, 304, 308-321)
- `block-puzzle/js/app.js` (Line 628, 775, 850)
- `brick-breaker/js/app.js` (Line 752-773, 873)
- `brain-type/js/app.js` (Line 138)

**문제점**:
```javascript
// 취약한 코드 (affirmation/js/app.js:254-267)
historyList.innerHTML = this.history.map((item, index) => {
  return `
    <div class="history-item slide-in" style="animation-delay: ${index * 0.05}s">
      <div class="history-text">
        <span style="margin-right: 8px">${categoryInfo.emoji}</span>
        ${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}
      </div>
    </div>
  `;
}).join('');
```

**위험성**:
- Quotable API에서 받은 `quote.content`가 HTML 태그를 포함하면 주입될 수 있음
- 사용자 입력 데이터도 동일한 위험

**수정 방안**:
```javascript
// 안전한 방법
historyList.innerHTML = '';
this.history.forEach((item, index) => {
  const div = document.createElement('div');
  div.className = 'history-item slide-in';
  div.style.animationDelay = `${index * 0.05}s`;

  const text = document.createElement('div');
  text.className = 'history-text';

  const emoji = document.createElement('span');
  emoji.textContent = categoryInfo.emoji;
  emoji.style.marginRight = '8px';
  text.appendChild(emoji);

  const content = document.createTextNode(
    item.text.substring(0, 50) + (item.text.length > 50 ? '...' : '')
  );
  text.appendChild(content);
  div.appendChild(text);
  historyList.appendChild(div);
});
```

**영향 받는 앱**: affirmation, block-puzzle, brick-breaker, brain-type, 다수의 심리테스트 앱

---

### 3. JSON.parse() 검증 부족

**파일**: 대부분의 앱 (`app.js`)
- `affirmation/js/app.js` (Line 80)
- `bmi-calculator/js/app.js`
- `habit-tracker/js/app.js`
- 기타 다수

**문제점**:
```javascript
// 위험한 코드
loadFromStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(`affirmation_${key}`);
    return data ? JSON.parse(data) : defaultValue;  // ← 검증 없음
  } catch (e) {
    return defaultValue;
  }
}
```

**위험성**:
- `localStorage`가 조작되거나 손상되면 앱 크래시 가능
- 예상과 다른 타입의 데이터로 논리 에러 발생
- `JSON.parse()` 에러는 try-catch로만 처리되어 silent failure

**수정 방안**:
```javascript
loadFromStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(`affirmation_${key}`);
    if (!data) return defaultValue;

    const parsed = JSON.parse(data);

    // 타입 검증
    if (typeof parsed !== typeof defaultValue) {
      console.warn(`Type mismatch for ${key}`);
      return defaultValue;
    }

    return parsed;
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return defaultValue;
  }
}
```

---

## 🟠 중대 JavaScript 에러 (HIGH)

### 4. undefined 객체 참조 가능성

**파일**:
- `brick-breaker/js/app.js` (Line 507-508)
- `block-puzzle/js/app.js` (Line 606, 664)
- 다수의 앱

**문제점**:
```javascript
// brick-breaker/js/app.js:507
document.getElementById('go-score').textContent = this.score;
document.getElementById('go-best').textContent = this.highScore;
```

만약 DOM에서 요소를 찾지 못하면:
```
Cannot read property 'textContent' of null
```

**수정 방안**:
```javascript
const scoreEl = document.getElementById('go-score');
const bestEl = document.getElementById('go-best');

if (scoreEl) scoreEl.textContent = this.score;
if (bestEl) bestEl.textContent = this.highScore;

// 또는 optional chaining 사용
document.getElementById('go-score')?.textContent = this.score;
document.getElementById('go-best')?.textContent = this.highScore;
```

---

### 5. 이벤트 리스너 누수

**파일**:
- `block-puzzle/js/app.js` (Line 185-199)
- `brick-breaker/js/app.js` (Line 121-122)
- `flappy-bird/js/app.js` (Line 86-128)

**문제점**:
```javascript
// block-puzzle/js/app.js:185-188 (매번 게임마다 등록됨)
this.elements.btnLeft.addEventListener('mousedown', () => this.startMoving(-1));
this.elements.btnLeft.addEventListener('mouseup', () => this.stopMoving());
this.elements.btnLeft.addEventListener('touchstart', (e) => { ... });
```

게임을 여러 번 시작/종료하면 이벤트 핸들러가 중복 등록되어 메모리 누수 및 성능 저하 발생

**수정 방안**:
```javascript
// setupEventListeners()는 한 번만 호출되도록 플래그 사용
setupEventListeners() {
  if (this._eventListenersSetup) return;  // ← 중복 방지

  this.elements.btnLeft.addEventListener('mousedown', () => this.startMoving(-1));
  // ... 기타 이벤트

  this._eventListenersSetup = true;
}
```

또는 게임 종료 시 명시적으로 제거:
```javascript
// gameLoop() 또는 endGame()에서
stopGame() {
  this.elements.btnLeft.removeEventListener('mousedown', this.onLeftMouseDown);
  this.elements.btnLeft.removeEventListener('mouseup', this.onLeftMouseUp);
  // ...
}
```

---

### 6. 비동기 작업의 에러 처리 부족

**파일**:
- `affirmation/js/app.js` (Line 162-184)
- `mbti-love/js/app.js` (Line 4-40)
- `hsp-test/js/app.js` (Line 2-22)

**문제점**:
```javascript
// affirmation/js/app.js:162
const response = await fetch('https://api.quotable.io/...');
const data = await response.json();  // ← response.ok 확인 없음

if (data && data.length > 0) {
  // API가 에러를 반환해도 data.length는 undefined일 수 있음
}
```

**위험성**:
- HTTP 에러(404, 500 등)를 처리하지 않음
- 네트워크 연결 끊김 시 앱 크래시
- 타임아웃 처리 없음

**수정 방안**:
```javascript
async loadQuotableCard() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);  // 5초 타임아웃

    const response = await fetch(
      'https://api.quotable.io/quotes/random?tags=inspirational|motivational',
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No quotes returned');
    }

    const quote = data[0];
    this.currentCard = {
      id: 'quote_' + Date.now(),
      category: 'quote',
      text: quote.content || 'Error loading quote',
      author: quote.author || 'Unknown'
    };
  } catch (error) {
    console.error('Quotable API error:', error);
    // 폴백: 내장된 명언 사용
    this.selectedCategory = 'all';
    await this.loadRandomCard();
  }
}
```

---

## 🟡 코드 품질 문제 (MEDIUM)

### 7. 하드코딩된 문자열 (i18n 미적용)

**파일**: 거의 모든 앱에서 발견

**예시**:
- `brick-breaker/js/app.js` (Line 527) - 한글 텍스트 하드코딩
- `block-puzzle/js/app.js` (Line 649) - 한글 텍스트
- 게임 설명, 에러 메시지 등

**문제점**:
- 다국어 지원이 CLAUDE.md에서 필수인데 미적용
- 게임 내 동적 텍스트가 i18n 키로 관리되지 않음

**영향**: 모든 게임 및 심리테스트 앱 (약 40개)

---

### 8. 전역 변수 오염

**파일**:
- `mbti-love/js/app.js` (Line 46-49)
- `hsp-test/js/app.js` (Line 24-27)
- 다수의 앱

**문제점**:
```javascript
// mbti-love/js/app.js:46-49 (모듈 패턴 없음)
let currentQ = 0;           // ← 전역
let answers = {...};        // ← 전역
let myType = '';            // ← 전역
let partnerType = '';       // ← 전역
```

**위험성**:
- 다른 스크립트와 네임스페이스 충돌 가능
- 테스트 불가능
- 코드 재사용성 낮음

**수정 방안**:
```javascript
// IIFE 또는 클래스 사용
const MBTILoveApp = (() => {
  let currentQ = 0;
  let answers = {...};
  let myType = '';
  let partnerType = '';

  return {
    startTest() { /* ... */ },
    selectOption() { /* ... */ },
    // 공개 인터페이스
  };
})();

// 또는 클래스 사용
class MBTILoveApp {
  constructor() {
    this.currentQ = 0;
    this.answers = {};
    this.myType = '';
    this.partnerType = '';
  }
}
const app = new MBTILoveApp();
```

---

### 9. 중복 코드 (DRY 위반)

**예시**:
- 모든 앱에서 i18n 초기화 코드 동일
- 레더보드 표시 로직 반복 (brick-breaker, block-puzzle)
- 통계 렌더링 로직 반복

**권장사항**: `_common/app-base.js` 생성하여 공통 로직 추상화

---

### 10. 사용하지 않는 변수/함수

**파일**: 다수의 앱에서 발견
- 레더보드 생성 후 표시 안 하는 경우
- 선언되지만 사용되지 않는 변수

---

## 🟢 호환성 문제 (LOW)

### 11. Safari/iOS 지원 부족

**문제점**:
- `document.getElementById('...').remove()` - iOS 9 미지원
- Web Audio API 초기화 - `webkitAudioContext` 폴백 있지만 일부 앱 누락
- `performance.now()` - 구형 브라우저 미지원

**해결 방안**:
```javascript
// 안전한 DOM 제거
const el = document.getElementById('...');
if (el) {
  el.parentNode?.removeChild(el);  // 또는
  el.remove?.();  // optional chaining
}

// 성능 측정
const getTimeNow = () => {
  return window.performance?.now?.() || Date.now();
};
```

---

## 📊 영향도 분석

| 심각도 | 항목 | 영향 앱 수 | 수정 난이도 |
|--------|------|----------|----------|
| 🔴 CRITICAL | onclick + 동적 ID XSS | 6 | 중간 |
| 🔴 CRITICAL | innerHTML 데이터 삽입 | 30+ | 높음 |
| 🟠 HIGH | JSON.parse 검증 부족 | 20+ | 낮음 |
| 🟠 HIGH | undefined 참조 | 15+ | 낮음 |
| 🟠 HIGH | 이벤트 리스너 누수 | 8 | 중간 |
| 🟠 HIGH | 비동기 에러 처리 | 10+ | 중간 |
| 🟡 MEDIUM | i18n 미적용 | 40+ | 높음 |
| 🟡 MEDIUM | 전역 변수 오염 | 15 | 중간 |
| 🟡 MEDIUM | 중복 코드 | 모든 앱 | 높음 |
| 🟢 LOW | Safari 호환성 | 25+ | 낮음 |

---

## ✅ 수정 우선순위

### Phase 1 (긴급 - 1주)
1. **onclick 인라인 이벤트 제거** (affirmation, dday-counter, dream-fortune, habit-tracker, idle-clicker, lottery)
   - 예상 시간: 4시간
   - 영향: XSS 공격 차단

2. **JSON.parse 검증 추가** (모든 localStorage 로드)
   - 예상 시간: 2시간
   - 영향: 앱 크래시 방지

3. **undefined 참조 방어** (null check 추가)
   - 예상 시간: 3시간
   - 영향: 런타임 에러 방지

### Phase 2 (중요 - 2주)
4. **innerHTML → textContent/createElement 전환** (모든 동적 콘텐츠)
   - 예상 시간: 16시간
   - 영향: XSS 완전 차단

5. **비동기 에러 처리 강화** (API 호출)
   - 예상 시간: 4시간

6. **이벤트 리스너 누수 제거** (게임 앱)
   - 예상 시간: 3시간

### Phase 3 (개선 - 1개월)
7. **공통 코드 추상화** (`_common/app-base.js`)
8. **i18n 적용** (게임 내 동적 텍스트)
9. **전역 변수 → 클래스 변환**
10. **Safari 호환성 검증**

---

## 🔧 권장 사항

### 개발 프로세스 개선
1. **ESLint 도입**: 보안 규칙 플러그인 추가
   - `eslint-plugin-security` 사용
   - innerHTML 사용 감지 및 경고

2. **자동 보안 테스트**: GitHub Actions/CI 파이프라인
   - OWASP ZAP 스캔
   - XSS 취약점 자동 감지

3. **코드 리뷰 체크리스트**:
   - [ ] innerHTML 사용하지 않음
   - [ ] onclick 인라인 이벤트 없음
   - [ ] JSON.parse 검증 포함
   - [ ] null check 완료
   - [ ] 비동기 에러 처리 포함

---

## 결론

현재 프로젝트는 **사용자 입력 데이터 처리 보안이 취약**합니다. 특히:

1. **XSS 취약점이 광범위** - onclick + innerHTML 패턴 사용
2. **비동기 작업 에러 처리 부족** - API 호출 안정성 낮음
3. **전역 변수 오염** - 모듈화 부족
4. **i18n 미적용** - 다국어 지원 규칙 위반

**즉시 조치**: Phase 1의 onclick 제거와 JSON 검증 추가로 가장 심각한 취약점 해결이 필수합니다.
