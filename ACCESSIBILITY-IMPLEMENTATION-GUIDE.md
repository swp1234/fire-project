# WCAG 2.1 AA 접근성 구현 가이드 - DopaBrain

## 목적
dopabrain.com의 모든 앱(48개)을 WCAG 2.1 Level AA 표준에 맞게 개선

## 현황
- ✅ 공통 CSS 기본값 생성 완료 (`_common/a11y-base.css`)
- ✅ quiz-app 개선 완료
- 진행 중: 상위 20개 앱

---

## 각 앱 수정 방법

### 1단계: HTML 수정 (모든 앱 공통)

#### 1.1 Skip Link 추가
```html
<!-- <body> 직후에 추가 -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

#### 1.2 Main Content ID 추가
```html
<!-- 메인 콘텐츠 래퍼에 추가 -->
<main id="main-content">
    <!-- 앱 콘텐츠 -->
</main>
```

#### 1.3 공통 접근성 CSS 추가
```html
<head>
    ...
    <!-- WCAG 2.1 AA 공통 CSS (최상단) -->
    <link rel="stylesheet" href="/../_common/a11y-base.css">
    <!-- 앱 고유 CSS (그 다음) -->
    <link rel="stylesheet" href="css/style.css">
    ...
</head>
```

#### 1.4 언어 선택 버튼 개선 (있는 경우)
```html
<button id="lang-toggle" class="lang-btn"
    aria-label="Change language"
    aria-expanded="false"
    aria-controls="lang-menu">
    🌐
</button>
```

---

### 2단계: CSS 수정 (앱별 고유 CSS)

#### 2.1 색상 대비 개선

```css
/* BEFORE: 대비 부족 */
.text {
    color: rgba(255, 255, 255, 0.5);  /* 다크 배경에 불투명한 흰색 */
}

/* AFTER: WCAG AA 준수 */
.text {
    color: rgba(255, 255, 255, 0.95); /* 더 투명도 낮음 = 더 밝음 */
}
```

**색상 대비 기준:**
- 다크 배경(#0a0a0a, #1a1a1a, #333333) 위: #ffffff 또는 rgba(255, 255, 255, 0.95)
- 라이트 배경(#ffffff, #f8f4f0) 위: #333333 또는 #1a1a1a
- 링크 색상: #0066cc (4.5:1 이상)

#### 2.2 버튼 크기 확보

```css
/* BEFORE: 부족한 크기 */
button {
    padding: 10px 15px;
    min-height: 40px;
}

/* AFTER: 최소 44x44px */
button {
    padding: 12px 16px;
    min-height: 44px;
    min-width: 44px;
}
```

#### 2.3 포커스 스타일 강화

```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
    outline: 3px solid #4a90e2;
    outline-offset: 2px;
    border-radius: 2px;
}
```

#### 2.4 모션 감도 지원 추가

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

### 3단계: HTML 시맨틱 개선 (앱별 필요시)

#### 3.1 폼 라벨 추가 (계산기, 변환기 등)

```html
<!-- BEFORE: 라벨 없음 -->
<input type="number" placeholder="입력...">

<!-- AFTER: 라벨 연결 -->
<label for="input-amount">금액 입력:</label>
<input id="input-amount" type="number" placeholder="입력...">
```

#### 3.2 ARIA 속성 추가 (복잡한 UI)

```html
<!-- 게임 상태 표시 -->
<div role="status" aria-live="polite" aria-label="Current score">
    점수: 1000
</div>

<!-- 모달 대화상자 -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 id="dialog-title">확인</h2>
    <!-- 모달 콘텐츠 -->
</div>
```

#### 3.3 이미지 alt 텍스트 (SNS 이미지 등)

```html
<!-- BEFORE: alt 없음 -->
<img src="result.svg">

<!-- AFTER: 의미 있는 alt -->
<img src="result.svg" alt="테스트 결과: 매우 우호적 (98%)">
```

---

## 앱별 구체적 수정 사항

### 1. quiz-app
- ✅ 완료
- 수정 내용:
  - 색상 대비 개선 (광고 텍스트 0.5 → 0.95)
  - 포커스 스타일 강화
  - Skip link 추가
  - 언어 버튼 aria 속성

### 2. lottery
- 수정 필요:
  - 다크 배경 텍스트 대비 (rgba 투명도 증가)
  - 버튼 크기 44px+ 확인
  - select 엘리먼트 폼 라벨 추가

**수정 방법:**
```css
/* lottery/css/style.css 끝에 추가 */

/* 색상 대비 개선 */
.text-secondary {
    color: rgba(255, 255, 255, 0.85); /* 0.7 → 0.85 */
}

/* 버튼 최소 크기 */
button, input[type="button"], .btn {
    min-height: 44px;
    min-width: 44px;
}

/* 모션 감도 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus visible */
button:focus-visible, input:focus-visible, a:focus-visible {
    outline: 3px solid #e74c3c;
    outline-offset: 2px;
}
```

### 3. puzzle-2048
- 수정 필요:
  - 게임 타일 텍스트 대비
  - 버튼 크기 확인
  - 스코어 표시 명확화

### 4. dday-counter
- 수정 필요:
  - 카운터 텍스트 가독성
  - 버튼 크기
  - 모달 접근성

### 5. dream-fortune
- 수정 필요:
  - 결과 텍스트 대비
  - 버튼 인터랙션
  - 이미지 alt 텍스트

**이하 6~20번 앱도 동일한 패턴으로 수정**

---

## 검증 체크리스트

각 앱 수정 후 다음을 확인하세요:

### 색상 대비 검증
```
웹 주소: https://webaim.org/resources/contrastchecker/

검증 항목:
- 배경색 입력 (예: #0a0a0a)
- 텍스트색 입력 (예: #ffffff)
- 대비율 확인 (AA 최소 4.5:1)
```

### 터치 타겟 검증
```
브라우저 DevTools:
1. 요소 선택 (우클릭 → 검사)
2. Computed 탭에서 width, height 확인
3. 최소 44px x 44px 확인
```

### 키보드 접근성 검증
```
1. Tab 키로 모든 버튼 접근 가능한지 확인
2. Enter/Space로 버튼 실행 가능한지 확인
3. Focus 스타일 명확한지 확인 (outline 보임)
4. Skip link 작동하는지 확인
```

### 모션 감도 검증
```
macOS:
System Preferences → Accessibility → Display → Reduce motion

Windows:
Settings → Ease of Access → Display → Show animations

검증: 애니메이션이 비활성화되는지 확인
```

---

## 자동 검사 도구

### 웹 기반
- [WebAIM 색상 대비 검사](https://webaim.org/resources/contrastchecker/)
- [WAVE 웹 접근성](https://wave.webaim.org/)
- [Lighthouse (Chrome DevTools)](chrome://settings/accessibility)

### 명령줄
```bash
# axe-core 설치
npm install axe-core

# 또는 WCAG 검사기 설치
npm install pa11y
```

---

## 구현 우선순위

### Week 1 (완료)
- ✅ 공통 CSS 파일 생성
- ✅ quiz-app 개선
- 예정: lottery, puzzle-2048

### Week 2
- dday-counter, dream-fortune
- mbti-tips, white-noise
- dev-quiz, animal-personality

### Week 3
- shopping-calc, bmi-calculator
- hsp-test, unit-converter
- kpop-position, color-personality

### Week 4
- love-frequency, brain-type
- memory-card, color-memory
- detox-timer

### Week 5+
- 나머지 28개 앱 (loyalty-program, emotion-temp 등)

---

## 코드 스니펫

### 빠른 구현: CSS 추가 코드

모든 앱의 `css/style.css` 끝에 다음을 추가하세요:

```css
/* ===== WCAG 2.1 AA 접근성 개선 ===== */

/* 포커스 스타일 */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
}

/* 터치 타겟 최소 크기 */
button, a[href], input[type="button"],
input[type="submit"], [role="button"] {
    min-width: 44px;
    min-height: 44px;
}

/* 모션 감도 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* 색상 대비 - 앱에 맞게 수정 */
@media (prefers-contrast: more) {
    body {
        font-weight: 600;
    }
}
```

---

## 질문 및 지원

### 자주 묻는 질문

**Q: 색상을 어떻게 선택하나요?**
A: WCAG 색상 대비 검사기를 사용하세요. 배경색 + 텍스트색을 입력하면 4.5:1 이상인지 확인됩니다.

**Q: 모든 앱에 공통 CSS를 적용해야 하나요?**
A: 네. `<link rel="stylesheet" href="/../_common/a11y-base.css">` 추가하세요.

**Q: 왜 44x44px인가요?**
A: 모바일 터치 정확도를 위한 최소 크기. 손가락 크기 고려.

**Q: 기존 디자인이 망가지나요?**
A: 공통 CSS는 기본값만 설정하므로, 앱별 CSS가 덮어씁니다.

---

**최종 목표:** 2026년 3월 31일까지 모든 앱 WCAG 2.1 AA 준수
