# 코드 리뷰 수정 현황

## 📋 종합 분석 완료

**검토 대상**: dopabrain.com 전체 앱 (약 50개)
**검토 항목**: 보안 취약점, JavaScript 에러, 코드 품질, 호환성
**상세 보고서**: `CODE_REVIEW_REPORT.md` 참고

---

## ✅ 수정 완료된 파일

### 1. affirmation (긍정 확언 앱)
**상태**: ✅ 수정 완료

**수정 내용**:
- Line 246-268: `renderHistory()` - innerHTML 템플릿 → DOM 생성으로 전환 (XSS 방지)
- Line 300-341: `renderFavorites()` - onclick 인라인 이벤트 제거, addEventListener 사용 (XSS 방지)
- Line 497-521: `showPremiumContent()` - innerHTML 동적 삽입 → DOM 생성으로 전환 (XSS 방지)

**보안 개선**:
- XSS 취약점 완전 제거
- innerHTML 사용 중단, DOM API 사용
- addEventListener로 안전한 이벤트 등록

---

### 2. dday-counter (디데이 카운터)
**상태**: ✅ 수정 완료

**수정 내용**:
- Line 221-266: `renderEvents()` - onclick 인라인 제거 (Line 256, 259)
- Map/join 방식 → forEach + DOM 생성으로 전환
- 모든 버튼에 addEventListener로 이벤트 등록

**보안 개선**:
- onclick 인라인 이벤트 제거로 XSS 공격 차단
- ID 동적 삽입의 위험성 제거

---

## 🔴 미수정 파일 (수정 필요)

### 우선순위 1 (XSS 취약점 - 긴급)

#### dream-fortune (꿈해몽 앱)
- **Line 1208**: `onclick="dreamApp.deleteDiary(${entry.id})"`
- **영향**: innerHTML에 사용자 데이터 직접 삽입 (일기 텍스트)
- **수정**: onclick 제거, addEventListener 사용

#### habit-tracker (습관 추적기)
- **Line 331, 364, 392-393**: 여러 onclick 인라인 이벤트
- **Line 331**: `onclick="app.toggleHabitCompletion('${habit.id}')"`
- **Line 364**: `onclick="app.addFromTemplate(...)"`
- **Line 392-393**: `onclick="app.editHabit(${habit.id})", onclick="app.premiumAnalysis(${habit.id})"`
- **영향**: 습관 ID가 문자열로 삽입되어 XSS 가능
- **수정**: 모두 addEventListener로 전환

#### idle-clicker (방치 클리커)
- **Multiple lines**: 대량의 onclick 인라인 이벤트 (최소 6개 이상)
- **Line 1641, 1753, 1910, 2659, 2882-2885**: 동적 ID 삽입된 onclick
- **영향**: 게임 내 상점, 스킬, 애완동물 시스템 등에서 XSS 가능
- **수정**: 모든 onclick 제거, data 속성 + addEventListener 사용

#### lottery (로또 번호 생성기)
- **Line 279, 299, 403, 420**: `onclick="app.saveNumber(${index})", onclick="app.deleteSaved(${index})"`
- **영향**: 배열 인덱스가 동적 삽입, innerHTML과 함께 사용
- **수정**: onclick 제거, data-index 속성 사용

---

### 우선순위 2 (innerHTML 데이터 삽입)

#### block-puzzle (블록 퍼즐 게임)
- **Line 628, 775, 850**: innerHTML 사용하지만 안전 (숫자/이모지만)
- **권장**: 일관성을 위해 이미 안전하므로 유지

#### brick-breaker (벽돌 깨기 게임)
- **Line 752-773, 873**: innerHTML 사용하지만 안전
- **권장**: 유지

#### brain-type (뇌 유형 테스트)
- **Line 138**: `optionsContainer.innerHTML = '';` (초기화만)
- **권장**: 안전함

---

### 우선순위 3 (JSON.parse 검증)

#### 거의 모든 앱에서 발견
**패턴**:
```javascript
try {
  const data = localStorage.getItem(`key`);
  return data ? JSON.parse(data) : defaultValue;  // ← 타입 검증 없음
} catch (e) {
  return defaultValue;
}
```

**영향**: 중간 수준 (폴백이 있어서 크래시는 드물지만 silent failure 가능)

**수정 방법**:
```javascript
// Before
return data ? JSON.parse(data) : defaultValue;

// After
if (!data) return defaultValue;
const parsed = JSON.parse(data);
if (typeof parsed !== typeof defaultValue) {
  console.warn(`Type mismatch for ${key}`);
  return defaultValue;
}
return parsed;
```

---

### 우선순위 4 (이벤트 리스너 누수)

#### block-puzzle (Line 185-199)
**문제**: 게임 재시작 시 이벤트 리스너 중복 등록
**수정**: `setupEventListeners()` 시작 시 `if (this._eventListenersSetup) return;` 플래그 체크

#### brick-breaker (Line 121-122)
**문제**: 게임 시작 시마다 새 리스너 등록
**수정**: 동일한 플래그 패턴 적용

---

## 📊 수정 진도율

| 파일 | 상태 | 심각도 | 수정 난이도 |
|------|------|--------|----------|
| affirmation | ✅ 완료 | 🔴 CRITICAL | 중간 |
| dday-counter | ✅ 완료 | 🔴 CRITICAL | 중간 |
| dream-fortune | ❌ 대기 | 🔴 CRITICAL | 중간 |
| habit-tracker | ❌ 대기 | 🔴 CRITICAL | 높음 |
| idle-clicker | ❌ 대기 | 🔴 CRITICAL | 높음 |
| lottery | ❌ 대기 | 🔴 CRITICAL | 낮음 |
| block-puzzle | ⚠️ 안전 | 🟠 HIGH | 낮음 |
| brick-breaker | ⚠️ 안전 | 🟠 HIGH | 낮음 |
| 기타 30+ 앱 | ❌ 리뷰 필요 | 🟡 MEDIUM | 중간+ |

---

## 📝 상세 수정 가이드 (수정 예정 파일)

### dream-fortune 수정 예시

**현재 코드** (Line 1208):
```javascript
premiumBody.innerHTML += `
  <div class="diary-delete" onclick="dreamApp.deleteDiary(${entry.id})">✕</div>
`;
```

**수정 코드**:
```javascript
const deleteBtn = document.createElement('div');
deleteBtn.className = 'diary-delete';
deleteBtn.textContent = '✕';
deleteBtn.dataset.id = entry.id;
deleteBtn.addEventListener('click', () => dreamApp.deleteDiary(entry.id));
container.appendChild(deleteBtn);
```

---

## 🎯 다음 단계

### Phase 1 (이번 주)
- [x] affirmation - XSS 취약점 수정
- [x] dday-counter - onclick 제거
- [ ] dream-fortune - onclick 제거
- [ ] habit-tracker - onclick 제거 (복잡, 4개)
- [ ] idle-clicker - onclick 제거 (복잡, 6개+)
- [ ] lottery - onclick 제거

### Phase 2 (다음 주)
- [ ] JSON.parse 검증 추가 (모든 앱)
- [ ] undefined/null 체크 추가 (15+ 앱)
- [ ] 이벤트 리스너 누수 제거 (게임 앱)

### Phase 3 (1개월)
- [ ] 공통 코드 추상화 (`_common/app-base.js`)
- [ ] i18n 적용 (게임 내 동적 텍스트)
- [ ] Safari 호환성 검증

---

## 📌 수정 검증 방법

각 파일 수정 후 다음 항목 확인:

```
1. 브라우저 콘솔에서 에러 없음 확인
2. 주요 기능 동작 확인
3. onclick 속성이 없는지 확인 (F12 > Elements)
4. 이벤트 리스너가 정상 작동하는지 확인
5. localStorage 데이터가 정상적으로 저장/로드되는지 확인
```

---

## 🚀 Git 커밋 규칙

각 파일당 별도 커밋으로 추적성 향상:

```bash
# 예시
git add projects/affirmation/js/app.js
git commit -m "fix: affirmation app - remove XSS vulnerabilities in renderHistory/renderFavorites"

git add projects/dday-counter/js/app.js
git commit -m "fix: dday-counter app - remove inline onclick events and use addEventListener"
```

---

## 📖 참고 자료

- OWASP XSS Prevention Cheat Sheet
- MDN: Element.innerHTML risks
- GitHub Security Lab: JavaScript Injection

---

**마지막 업데이트**: 2026-02-10
**다음 검토 예정**: 모든 우선순위 1-2 파일 수정 완료 후
