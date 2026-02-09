# DopaBrain 크로스링크 업데이트 보고서
**작성일: 2026-02-10**

## 작업 요약

dopabrain.com의 모든 앱에서 추천 섹션(크로스링크)을 최신 앱 목록으로 일괄 업데이트했습니다.

---

## 업데이트 현황

### 전체 앱 개수
- **총 30개 앱** (포탈, root-domain 제외)

### 처리 결과

#### 성공적으로 업데이트된 앱 (30개)
✓ **추천 섹션 6개 앱 포함**
1. affirmation (일일 긍정)
2. brain-type (두뇌 유형 테스트)
3. color-memory (색상 기억력)
4. dday-counter (디데이 카운터)
5. detox-timer (디지털 디톡스)
6. dev-quiz (개발자 퀴즈)
7. dream-fortune (꿈해몽/운세)
8. emoji-merge (이모지 머지)
9. emotion-temp (감정 온도계)
10. hsp-test (HSP 테스트)
11. idle-clicker (던전 클리커)
12. kpop-position (K-POP 포지션)
13. lottery (로또 번호 추천)
14. love-frequency (사랑 주파수)
15. mbti-love (MBTI 궁합)
16. mbti-tips (MBTI 팁)
17. number-puzzle (2048 퍼즐)
18. past-life (전생 테스트)
19. quiz-app (상식 퀴즈)
20. reaction-test (반응속도 테스트)
21. shopping-calc (환전 계산기)
22. sky-runner (스카이 러너)
23. stack-tower (스택 타워)
24. tax-refund-preview (연말정산)
25. typing-speed (타이핑 속도) - 새로 추가
26. unit-converter (단위 변환기)
27. valentine (발렌타인)
28. white-noise (화이트 노이즈)
29. word-scramble (단어 섞임)
30. zigzag-runner (지그재그 러너)

---

## 기술적 상세

### 1. 자동 업데이트 (첫 번째 스크립트: update_cross_links.py)
- **처리 앱:** 25개
- **작업 내용:**
  - 기존 추천 섹션을 정규식으로 제거
  - 각 앱 카테고리별 최적화된 6개 추천 앱 삽입
  - 상대 경로 형식 사용 (`/app-key/`)

### 2. 링크 절대 경로 변환 (fix_recommendation_links.py)
- **처리 앱:** 25개
- **작업 내용:**
  - 모든 상대 경로를 절대 URL로 변환
  - 형식: `https://dopabrain.com/{app-key}/`

### 3. 수동 추가 (typing-speed)
- **앱:** typing-speed
- **작업 내용:**
  - 기존 추천 섹션 미존재
  - 마크업 구조를 유지하면서 새로운 `<section class="recommendations-section">` 추가
  - 6개 관련 앱 추천

### 4. 기존 섹션 유지 업데이트
다음 앱들은 이미 추천 섹션이 있어서 링크만 업데이트:
- emotion-temp (9개 링크)
- hsp-test (7개 링크)
- idle-clicker (13개 링크)
- valentine (9개 링크)

---

## 추천 앱 기준

각 앱의 추천 카테고리는 다음과 같이 구성:

### 1. 테스트/퀴즈 앱
- quiz-app → reaction-test, dev-quiz, brain-type, emotion-temp, hsp-test, mbti-love
- brain-type → reaction-test, hsp-test, emotion-temp, mbti-love, past-life, dream-fortune
- reaction-test → color-memory, number-puzzle, typing-speed, brain-type, word-scramble, quiz-app
- hsp-test → emotion-temp, affirmation, mbti-love, dream-fortune, brain-type, past-life
- emotion-temp → affirmation, hsp-test, mbti-love, dream-fortune, past-life, love-frequency

### 2. 연애/운세 앱
- mbti-love → mbti-tips, hsp-test, emotion-temp, affirmation, love-frequency, valentine
- dream-fortune → past-life, love-frequency, affirmation, emotion-temp, mbti-love, brain-type
- past-life → dream-fortune, love-frequency, affirmation, mbti-love, valentine, emotion-temp
- love-frequency → mbti-love, valentine, past-life, dream-fortune, affirmation, hsp-test
- valentine → mbti-love, love-frequency, past-life, dream-fortune, affirmation, emotion-temp

### 3. 게임 앱
- idle-clicker → emoji-merge, sky-runner, zigzag-runner, stack-tower, number-puzzle, color-memory
- emoji-merge → idle-clicker, sky-runner, zigzag-runner, stack-tower, number-puzzle, color-memory
- sky-runner → idle-clicker, zigzag-runner, stack-tower, emoji-merge, color-memory, number-puzzle
- zigzag-runner → sky-runner, stack-tower, idle-clicker, emoji-merge, color-memory, number-puzzle
- stack-tower → idle-clicker, sky-runner, zigzag-runner, emoji-merge, color-memory, number-puzzle
- color-memory → number-puzzle, reaction-test, brain-type, emotion-temp, hsp-test, typing-speed
- number-puzzle → color-memory, typing-speed, word-scramble, reaction-test, brain-type, quiz-app
- typing-speed → word-scramble, number-puzzle, color-memory, reaction-test, dev-quiz, quiz-app
- word-scramble → typing-speed, number-puzzle, quiz-app, dev-quiz, color-memory, reaction-test

### 4. 유틸리티 앱
- shopping-calc → unit-converter, tax-refund-preview, lottery, dday-counter, mbti-tips, kpop-position
- unit-converter → shopping-calc, tax-refund-preview, lottery, dday-counter, quiz-app, dev-quiz
- tax-refund-preview → unit-converter, shopping-calc, lottery, dday-counter, quiz-app, mbti-tips
- lottery → unit-converter, shopping-calc, tax-refund-preview, dday-counter, dream-fortune, love-frequency
- dday-counter → unit-converter, shopping-calc, tax-refund-preview, lottery, valentine, mbti-tips

### 5. 웰니스/명상 앱
- affirmation → emotion-temp, hsp-test, mbti-love, love-frequency, detox-timer, white-noise
- detox-timer → white-noise, affirmation, emotion-temp, hsp-test, dream-fortune, past-life
- white-noise → detox-timer, affirmation, emotion-temp, hsp-test, dream-fortune, past-life

### 6. 정보/팁 앱
- mbti-tips → mbti-love, brain-type, hsp-test, emotion-temp, quiz-app, dev-quiz
- dev-quiz → quiz-app, reaction-test, brain-type, typing-speed, number-puzzle, word-scramble
- kpop-position → mbti-tips, quiz-app, brain-type, hsp-test, mbti-love, emotion-temp

---

## 마크업 구조

### 표준 추천 섹션 HTML
```html
<!-- 크로스 프로모션 추천 섹션 -->
<div class="recommendations-section">
    <div class="rec-title" data-i18n="recommendations.title">이것도 해보세요</div>
    <div class="rec-grid">
        <a href="https://dopabrain.com/{app-key}/" class="rec-card" target="_blank">
            <span class="rec-icon">{emoji}</span>
            <span class="rec-info">
                <span class="rec-name">{app-name}</span>
            </span>
        </a>
        <!-- 반복... -->
    </div>
</div>
```

### 특징
- 절대 URL 사용 (포탈 이동 경로 고려)
- `target="_blank"` 속성으로 새 탭에서 열기
- i18n 다국어 지원 (제목)
- 일관된 CSS 클래스 사용
- 6-13개의 추천 앱 포함 (앱별 차이)

---

## 링크 형식 검증

### 확인된 절대 경로 형식
✓ `https://dopabrain.com/affirmation/`
✓ `https://dopabrain.com/brain-type/`
✓ `https://dopabrain.com/quiz-app/`
✓ 등 모든 앱에서 일관되게 적용

### 상대 경로 오류
✗ 발견되지 않음 (모두 절대 경로로 변환 완료)

---

## SEO 및 사용자 경험 개선

### 긍정적 영향
1. **내부 링크 증가**: 앱 간 상호 연결로 사이트 구조 강화
2. **사용자 체류 시간 증가**: 추천 앱으로 다른 콘텐츠 발견 유도
3. **교차 프로모션**: 저조한 트래픽 앱도 고조한 앱을 통해 노출 기회
4. **Google 크롤링**: 더 많은 내부 링크는 인덱싱 강화
5. **사용자 만족도**: 관련 앱 발견으로 더 나은 경험

### 크로스링크 효과
- 30개 앱 × 평균 7개 추천 = 210개 내부 링크 생성
- 모든 사용자가 앱 종료 전 다른 앱 발견 가능
- 바이럴 가능성 증대 (한 앱의 인기 → 추천된 앱으로 확산)

---

## 파일 변경 사항

### 수정된 앱 index.html 파일
- 30개 앱 모두 업데이트 완료
- 평균 5-15줄의 마크업 변경
- 스타일 변경 없음 (기존 CSS 활용)
- 작동성 테스트: 완료 (모든 링크 클릭 가능)

### 사용된 스크립트
1. `update_cross_links.py` - 자동 추천 섹션 생성
2. `fix_recommendation_links.py` - 상대→절대 경로 변환
3. `validate_all_links.py` - 최종 검증

---

## 추가 작업 (향후)

### 선택 사항
1. **A/B 테스트**: 추천 섹션 배치 위치 최적화
2. **분석**: GA4에서 추천 링크 클릭 추적
3. **개인화**: 사용자 행동 기반 동적 추천 (향후 개발)
4. **더 많은 추천**: 현재 6-13개에서 더 확대 가능

### 모니터링
- Google Search Console: 크롤링 활동 증가 확인
- Google Analytics: 사용자 경로 분석
- 사용자 반응: 추천 링크 클릭률 추적

---

## 결론

dopabrain.com의 모든 30개 앱에 최신 크로스링크 추천 섹션이 일괄 적용되었습니다.

- 절대 URL 형식으로 통일
- 각 앱의 특성에 맞는 관련 앱 추천
- i18n 다국어 지원
- 기존 마크업 구조 유지
- SEO 및 사용자 경험 개선 기대

모든 앱이 상호 연결되어 있으므로, 한 앱의 성공이 추천을 통해 다른 앱으로 자연스럽게 확산될 수 있습니다.
