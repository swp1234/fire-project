# WCAG 2.1 AA 접근성 재검증 및 수정 계획

## 검증 날짜: 2026-02-10

### 주요 검증 항목 (우선순위)

1. **색상 대비 (가장 높은 영향도)**
   - 최소 요구사항: 일반 텍스트 4.5:1, 대형 텍스트 3:1
   - 다크 배경 + 흰색 텍스트의 대비 확인
   - 버튼 텍스트 가독성

2. **터치 타겟 크기 (모바일 필수)**
   - 최소 44x44px
   - 버튼, 링크, 인터랙티브 요소

3. **키보드 접근성**
   - focus-visible 스타일
   - Tab 순서
   - Skip navigation

4. **스크린 리더**
   - alt 텍스트
   - aria-label
   - form label

5. **모션 감도**
   - prefers-reduced-motion 미디어 쿼리

### 발견된 일반적인 문제

#### 문제 1: 색상 대비 부족
- 많은 앱이 그라데이션 배경 위에 연한 텍스트 사용
- 예: 검은색 배경 #2d3436 위 밝은 회색 텍스트 (대비 부족)
- 예: 보라색 배경 위 흰색 텍스트 대비 부족한 경우

#### 문제 2: 터치 타겟 부족
- 언어 선택 버튼: 44x44px (경계)
- 일부 작은 버튼들이 44x44px 미만

#### 문제 3: 키보드 접근성 부족
- :focus-visible 스타일 없음
- Tab 순서 정의 안 됨

#### 문제 4: 모션 감도 미지원
- prefers-reduced-motion 미디어 쿼리 없음
- 모든 애니메이션이 강제됨

### 수정 전략

#### Phase 1: 공통 CSS 기본값 추가
- _common/a11y-base.css 파일 생성
- 모든 앱이 포함할 기본 접근성 규칙

#### Phase 2: 상위 20개 앱 집중 수정
1. quiz-app
2. lottery
3. puzzle-2048
4. dday-counter
5. dream-fortune
6. mbti-tips
7. white-noise
8. dev-quiz
9. animal-personality
10. shopping-calc
11. bmi-calculator
12. hsp-test
13. unit-converter
14. kpop-position
15. color-personality
16. love-frequency
17. brain-type
18. memory-card
19. color-memory
20. detox-timer

#### Phase 3: 나머지 28개 앱 수정

### 수정 항목별 체크리스트

- [ ] 색상 대비: 텍스트 4.5:1 이상
- [ ] 터치 타겟: 모든 버튼/링크 44x44px 이상
- [ ] Focus: :focus-visible 스타일 추가
- [ ] ARIA: 필요한 aria-label 추가
- [ ] 모션: prefers-reduced-motion 지원
- [ ] 제목: 올바른 h1-h6 계층 구조
