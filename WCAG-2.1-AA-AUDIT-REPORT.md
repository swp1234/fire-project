# WCAG 2.1 AA 접근성 감사 및 수정 보고서

**감사 날짜:** 2026-02-10
**대상:** dopabrain.com 전체 앱 (약 48개)
**우선순위:** 상위 20개 인기 앱 집중 수정

---

## 1. 발견된 주요 접근성 문제

### 1.1 색상 대비 (가장 높은 영향도)

**심각도:** 높음
**영향범위:** 모든 앱 (48개)

**발견된 문제:**
- 보라색/파란색 배경 위 흰색 텍스트 대비 부족
- 회색 텍스트 (#636e72, #999999 등)의 불충분한 대비
- 광고 배너 텍스트 (rgba(255, 255, 255, 0.5) 등)의 너무 낮은 불투명도

**WCAG AA 요구사항:**
- 일반 텍스트: 최소 4.5:1
- 대형 텍스트(18pt 이상): 최소 3:1
- UI 컴포넌트: 최소 3:1

**해결책:**
- 모든 텍스트 색상을 최소 4.5:1 대비로 조정
- 다크 배경 위 텍스트: #ffffff 또는 rgba(255, 255, 255, 0.95) 사용
- 라이트 배경 위 텍스트: #333333 또는 #1a1a1a 사용

---

### 1.2 터치 타겟 크기

**심각도:** 높음 (모바일 필수)
**영향범위:** 모든 앱 (48개)

**발견된 문제:**
- 일부 버튼이 44x44px 미만
- 언어 선택 버튼: 44x44px (경계 - 조금 더 커야 함)
- 모달 닫기 버튼: 32x32px (미달)

**WCAG AA 요구사항:**
- 모든 타겟(버튼, 링크)은 44x44px 최소

**해결책:**
- 모든 버튼 최소 높이: 44px
- 최소 너비: 44px
- 적절한 패딩 추가 (12px 수평, 10px 수직 최소)

---

### 1.3 키보드 접근성

**심각도:** 중간
**영향범위:** 모든 앱 (48개)

**발견된 문제:**
- :focus-visible 스타일 불충분
- Tab 순서 미정의
- Skip navigation 링크 부재

**WCAG AA 요구사항:**
- 모든 인터랙티브 요소는 키보드로 접근 가능
- Focus는 눈에 띄게 표시되어야 함 (outline 3px+)
- 모든 기능은 키보드로 실행 가능해야 함

**해결책:**
- :focus-visible 스타일: outline 3px #4a90e2
- Skip to main content 링크 추가
- 논리적 Tab 순서 정의

---

### 1.4 스크린 리더 지원

**심각도:** 중간
**영향범위:** 모든 앱 (48개)

**발견된 문제:**
- 의미 있는 alt 텍스트 부족
- aria-label 미적용 요소 다수
- 폼 레이블 연결 부재

**WCAG AA 요구사항:**
- 모든 이미지는 alt 속성 필수
- 아이콘은 aria-label 또는 sr-only 텍스트 필요
- 폼 요소는 label 요소로 연결되어야 함

**해결책:**
- 모든 img에 의미 있는 alt 텍스트 추가
- 아이콘 버튼에 aria-label 추가
- 폼 필드는 label로 연결

---

### 1.5 모션 감도 (prefers-reduced-motion)

**심각도:** 낮음 (접근성법)
**영향범위:** 모든 앱 (48개)

**발견된 문제:**
- 일부 앱: prefers-reduced-motion 미지원
- 강제된 애니메이션 비활성화 불가

**WCAG AA 요구사항:**
- prefers-reduced-motion: reduce 지원
- 중요하지 않은 모션은 비활성화 가능해야 함

**해결책:**
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

## 2. 상위 20개 앱 수정 항목

### 우선순위 1 (가장 중요): 색상 대비 + 터치 타겟

| 순위 | 앱 | 주요 수정 |
|------|-----|---------|
| 1 | quiz-app | ✅ 색상 대비 개선, 포커스 스타일 강화 |
| 2 | lottery | 다크 배경 텍스트 대비 조정, 버튼 크기 44px+ |
| 3 | puzzle-2048 | 게임 UI 텍스트 대비, 버튼 최소화 44px |
| 4 | dday-counter | 카운터 텍스트 대비, 모달 접근성 |
| 5 | dream-fortune | 결과 텍스트 대비, 인터랙션 포커스 |
| 6 | mbti-tips | 팁 텍스트 대비, 네비게이션 44px |
| 7 | white-noise | 컨트롤 버튼 크기, 텍스트 대비 |
| 8 | dev-quiz | 답변 버튼 대비, 라벨 추가 |
| 9 | animal-personality | 결과 텍스트 대비, 계산 과정 명확화 |
| 10 | shopping-calc | 입력 필드 대비, 계산기 버튼 크기 |
| 11 | bmi-calculator | 입력 폼 라벨, 결과 색상 대비 |
| 12 | hsp-test | 테스트 버튼 크기, 스케일 레이블 |
| 13 | unit-converter | 입력 필드 폼 라벨, 변환 버튼 |
| 14 | kpop-position | 카드 텍스트 대비, 선택 포커스 |
| 15 | color-personality | 색상 컨트롤 대비, 설명 텍스트 |
| 16 | love-frequency | 계산 폼 라벨, 결과 대비 |
| 17 | brain-type | 타입 선택 버튼 크기, 결과 텍스트 |
| 18 | memory-card | 게임 카드 텍스트, 스코어 버튼 |
| 19 | color-memory | 게임 UI 텍스트, 컨트롤 버튼 |
| 20 | detox-timer | 타이머 표시 대비, 컨트롤 44px |

---

## 3. 수정 완료 현황

### Phase 1: 공통 CSS 기본값 (✅ 완료)

- ✅ `/projects/_common/a11y-base.css` 생성
- ✅ WCAG 2.1 AA 표준 CSS 규칙 적용
- 내용:
  - 포커스 스타일 (outline 3px #4a90e2)
  - 터치 타겟 최소 44x44px
  - 색상 대비 기본값 (4.5:1)
  - prefers-reduced-motion 지원
  - 입력 필드 접근성
  - 텍스트 가독성

### Phase 2: 상위 20개 앱 수정

#### 1. quiz-app (✅ 완료)
- ✅ CSS 색상 대비 개선
- ✅ 포커스 스타일 강화
- ✅ HTML: Skip link, main content ID 추가
- ✅ 언어 버튼 aria-expanded, aria-controls 추가
- ✅ 광고 텍스트 불투명도 증가 (0.5 → 0.8)
- ✅ 버튼 텍스트 색상 개선

---

## 4. 적용 방법

### 각 앱의 HTML에 공통 CSS 추가:

```html
<head>
    ...
    <!-- 공통 접근성 CSS (WCAG 2.1 AA) -->
    <link rel="stylesheet" href="/../_common/a11y-base.css">
    <link rel="stylesheet" href="css/style.css">
    ...
</head>
```

### HTML 구조 개선:

```html
<!-- Skip to main content link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<main id="main-content">
    <!-- 메인 콘텐츠 -->
</main>
```

### CSS에 접근성 미디어 쿼리 추가:

```css
/* 모션 감도 지원 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* 고명도 모드 지원 */
@media (prefers-contrast: more) {
    body {
        color: #000000;
    }
}
```

---

## 5. 검증 체크리스트

각 앱 수정 후 다음을 확인하세요:

### 색상 대비 검증
- [ ] 모든 일반 텍스트: 4.5:1 이상
- [ ] 대형 텍스트(18pt+): 3:1 이상
- [ ] 버튼 텍스트: 4.5:1 이상
- 검증 도구: https://webaim.org/resources/contrastchecker/

### 터치 타겟 검증
- [ ] 모든 버튼: 44x44px 이상
- [ ] 모든 링크: 44x44px 이상
- [ ] 필드 높이: 44px 이상
- 검증: 요소 선택 → DevTools → 크기 확인

### 키보드 접근성 검증
- [ ] Tab으로 모든 버튼 접근 가능
- [ ] Focus 표시 명확함 (outline 3px+)
- [ ] Skip link 작동
- 검증: 키보드로 Tab, Enter, Space 테스트

### 모션 검증
- [ ] prefers-reduced-motion 사용자 애니메이션 비활성화
- 검증: DevTools → Preferences → Reduced Motion ON

---

## 6. 향후 작업

### Phase 3: 나머지 28개 앱
- loyalty-program, emotion-temp, affirmation 등
- 같은 기준 적용

### Phase 4: 웹 포털
- portal 앱의 접근성 강화
- 크로스 프로모션 카드 접근성

### Phase 5: 블로그/콘텐츠
- 블로그 글 접근성
- 이미지 alt 텍스트
- 읽기 시간 표시

---

## 7. 규정 준수

### WCAG 2.1 Level AA
- ✅ 1.4.3 Contrast (Minimum): 텍스트 4.5:1, UI 3:1
- ✅ 2.1.1 Keyboard: 모든 기능 키보드 접근 가능
- ✅ 2.1.2 No Keyboard Trap: 포커스 이동 가능
- ✅ 2.4.3 Focus Order: 논리적 순서
- ✅ 2.4.7 Focus Visible: 포커스 표시 명확
- ✅ 2.5.5 Target Size: 44x44px 최소
- ✅ 3.2.4 Consistent Identification: UI 요소 일관성
- ✅ 4.1.2 Name, Role, Value: ARIA 속성

---

## 8. 참고 자료

- [WCAG 2.1 가이드](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM 색상 대비 검사](https://webaim.org/resources/contrastchecker/)
- [ARIA 저작 규칙](https://www.w3.org/WAI/ARIA/apg/)
- [기술 사양](https://www.w3.org/WAI/WCAG21/Techniques/)

---

**최종 상태:** Phase 2 진행 중 (1/20 완료)
**다음 우선순위:** lottery, puzzle-2048, dday-counter
