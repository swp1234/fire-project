# 추천 섹션 교차링크 검증 보고서

**작업 일시:** 2026-02-10
**검증 범위:** E:\Fire Project\projects (27개 앱)
**검증 항목:**
1. 모든 앱의 추천 섹션(rec-section/recommendations-section) 존재 여부
2. 새 앱(brain-type, color-memory, reaction-test) 포함 여부
3. 링크의 정확성 (https://dopabrain.com/앱이름/)

---

## 검증 결과

### 전체 현황
- **총 앱 수:** 27개
- **추천 섹션 있음:** 27개 (100%)
- **추천 섹션 없음:** 0개

### 새 앱 포함 현황

#### 완전 포함 (3개/3개 모두 포함): 4개
- ✅ emoji-merge (brain-type, color-memory, reaction-test)
- ✅ idle-clicker (brain-type, color-memory, reaction-test)
- ✅ affirmation (brain-type, color-memory, reaction-test) - 작업 중
- ✅ color-memory (brain-type, reaction-test + 자신 제외)

#### 부분 포함 (1-2개 포함): 12개
| 앱명 | 포함됨 | 미포함 |
|------|--------|---------|
| brain-type | brain-type | color-memory, reaction-test |
| emotion-temp | brain-type | color-memory, reaction-test |
| hsp-test | brain-type | color-memory, reaction-test |
| kpop-position | brain-type | color-memory, reaction-test |
| mbti-love | brain-type | color-memory, reaction-test |
| reaction-test | reaction-test | brain-type, color-memory |
| sky-runner | color-memory | brain-type, reaction-test |
| stack-tower | color-memory | brain-type, reaction-test |
| tax-refund-preview | brain-type | color-memory, reaction-test |
| valentine | brain-type | color-memory, reaction-test |
| zigzag-runner | color-memory | brain-type, reaction-test |

#### 미포함 (0개): 13개
- affirmation ✅ (작업 중)
- dday-counter
- detox-timer
- dev-quiz
- dream-fortune
- lottery
- love-frequency
- mbti-tips
- past-life
- quiz-app
- shopping-calc
- unit-converter
- white-noise

---

## 앱별 추천 현황

### 게임 앱
| 앱 | 추천 수 | 새 앱 | 상태 |
|----|--------|------|------|
| color-memory | 6 | 2 | 부분 ⚠️ |
| emoji-merge | 8 | 3 | 완료 ✅ |
| idle-clicker | 10 | 3 | 완료 ✅ |
| sky-runner | 10 | 1 | 부분 ⚠️ |
| stack-tower | 7 | 1 | 부분 ⚠️ |
| zigzag-runner | 6 | 1 | 부분 ⚠️ |

### 테스트 앱
| 앱 | 추천 수 | 새 앱 | 상태 |
|----|--------|------|------|
| brain-type | 0 | 1 | 부분 ⚠️ |
| emotion-temp | 9 | 1 | 부분 ⚠️ |
| hsp-test | 7 | 1 | 부분 ⚠️ |
| kpop-position | 6 | 1 | 부분 ⚠️ |
| mbti-love | 9 | 1 | 부분 ⚠️ |
| mbti-tips | 7 | 0 | 미포함 ❌ |
| past-life | 1 | 0 | 미포함 ❌ |
| quiz-app | 9 | 0 | 미포함 ❌ |
| reaction-test | 9 | 1 | 부분 ⚠️ |
| valentine | 10 | 1 | 부분 ⚠️ |

### 유틸 앱
| 앱 | 추천 수 | 새 앱 | 상태 |
|----|--------|------|------|
| affirmation | 9 | 3 | 완료 ✅ |
| dday-counter | 7 | 0 | 미포함 ❌ |
| detox-timer | 8 | 0 | 미포함 ❌ |
| dev-quiz | 5 | 0 | 미포함 ❌ |
| dream-fortune | 9 | 0 | 미포함 ❌ |
| lottery | 5 | 0 | 미포함 ❌ |
| love-frequency | 9 | 0 | 미포함 ❌ |
| shopping-calc | 9 | 0 | 미포함 ❌ |
| tax-refund-preview | 9 | 1 | 부분 ⚠️ |
| unit-converter | 9 | 0 | 미포함 ❌ |
| white-noise | 8 | 0 | 미포함 ❌ |

---

## 개선 필요 사항

### 우선순위 1: 완전 제거 필요
다음 13개 앱에 새 앱 3개를 모두 추가:
- dday-counter, detox-timer, dev-quiz, dream-fortune, lottery, love-frequency, mbti-tips, past-life, quiz-app, shopping-calc, unit-converter, white-noise

### 우선순위 2: 부분 완성 필요
다음 12개 앱에 누락된 새 앱 추가:
- brain-type, emotion-temp, hsp-test, kpop-position, mbti-love, reaction-test, sky-runner, stack-tower, tax-refund-preview, valentine, zigzag-runner

---

## 수정 지침

### 표준 추천 섹션 구조

**게임 앱 (기본 8개 추천):**
- 게임 4-5개 (stack-tower, sky-runner, zigzag-runner, emoji-merge, idle-clicker, color-memory 중 자신 제외)
- 테스트 2-3개 (brain-type, reaction-test, emotion-temp 등)

**테스트 앱 (기본 8개 추천):**
- 테스트 3-4개 (brain-type, color-memory, reaction-test, emotion-temp 등)
- 게임 2-3개 (idle-clicker, emoji-merge, sky-runner 등)

**유틸 앱 (기본 8개 추천):**
- 혼합 추천 (게임 2-3개, 테스트 2-3개, 유틸 2-3개)

---

## 체크리스트

- [ ] dday-counter: 새 앱 3개 추가
- [ ] detox-timer: 새 앱 3개 추가
- [ ] dev-quiz: 새 앱 3개 추가
- [ ] dream-fortune: 새 앱 3개 추가
- [ ] lottery: 새 앱 3개 추가
- [ ] love-frequency: 새 앱 3개 추가
- [ ] mbti-tips: 새 앱 3개 추가
- [ ] past-life: 새 앱 3개 추가
- [ ] quiz-app: 새 앱 3개 추가
- [ ] shopping-calc: 새 앱 3개 추가
- [ ] unit-converter: 새 앱 3개 추가
- [ ] white-noise: 새 앱 3개 추가
- [ ] brain-type: color-memory, reaction-test 추가
- [ ] emotion-temp: color-memory, reaction-test 추가
- [ ] hsp-test: color-memory, reaction-test 추가
- [ ] kpop-position: color-memory, reaction-test 추가
- [ ] mbti-love: color-memory, reaction-test 추가
- [ ] reaction-test: brain-type, color-memory 추가
- [ ] sky-runner: brain-type, reaction-test 추가
- [ ] stack-tower: brain-type, reaction-test 추가
- [ ] tax-refund-preview: color-memory, reaction-test 추가
- [ ] valentine: color-memory, reaction-test 추가
- [ ] zigzag-runner: brain-type, reaction-test 추가

---

## 결론

**현재 상태:**
- 완전히 업데이트된 앱: 4개 (14.8%)
- 부분 업데이트 필요: 12개 (44.4%)
- 미업데이트: 13개 (48.1%)

**권장 다음 단계:**
1. 13개 미포함 앱에 새 앱 3개를 모두 추가
2. 12개 부분 포함 앱에 누락된 새 앱 추가
3. 모든 추천 링크 재확인 (정확성 검증)
4. 깨진 링크 없는지 최종 확인

최종 완성 후 git commit: `git add . && git commit -m "추천섹션 교차링크 업데이트"`
