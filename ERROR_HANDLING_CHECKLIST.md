# 에러 핸들링 강화 - 앱별 체크리스트

각 앱마다 아래의 순서대로 적용하세요.

---

## 1️⃣ dream-fortune ✅ 완료
- [x] index.html 공통 스크립트 추가
- [x] app.js StorageManager 적용
- [ ] Canvas 사용 부분 검토 (animateResultDisplay에서 DOM 접근)
- [ ] drawResultCard 함수 검토 (있으면 SafeCanvas 적용)
- [ ] 테스트: 개인정보 보호 모드 + 일반 모드

---

## 2️⃣ past-life 🔴 필요
### 우선순위: 높음 (Canvas 많음)
- [ ] index.html 공통 스크립트 4개 추가
- [ ] app.js constructor에 `this.storage = new StorageManager('pastlife')`
- [ ] localStorage 호출 모두 this.storage로 변경
  - Line 32-40: 참여자 수 저장
  - Line 49: premiumUnlocked localStorage 추가 필요
- [ ] drawResultCard() 함수 (Line 191-300)
  - Canvas 컨텍스트 획득: SafeCanvas.getContext() 사용
  - ctx.fillText → SafeCanvas.drawText()
  - ctx.createLinearGradient → SafeCanvas.createGradient()
- [ ] canvas.toDataURL() (Line 379)
  - SafeCanvas.downloadCanvas() 사용
- [ ] i18n.t() 호출 (Line 163, 232, 282)
  - 폴백 확인: window.i18n?.t || window.safeI18n.t
- [ ] 테스트:
  - [ ] 결과 카드 렌더링
  - [ ] 이미지 다운로드
  - [ ] 프리미엄 잠금 해제

---

## 3️⃣ emotion-temp 🔴 필요
### 우선순위: 높음 (히스토리 관리)
- [ ] index.html 공통 스크립트 4개 추가
- [ ] app.js 모든 IIFE 함수에 try-catch
- [ ] localStorage 호출 변경:
  - saveEmotionHistory() (Line 47-77)
  - updateStreak() (Line 79-107)
  - getEmotionComparison() (Line 110-126)
  → 모두 StorageManager로 변경
- [ ] JSON.parse 에러 처리 강화
  - Line 112, 56-61에 이미 있음 ✓
- [ ] Canvas 사용 (generateShareImage, Line 287-377)
  - SafeCanvas.getContext() 사용
  - 그래디언트 생성 SafeCanvas.createGradient()
  - drawText → SafeCanvas.drawText()
  - canvas.toDataURL() → SafeCanvas.downloadCanvas()
- [ ] 테스트:
  - [ ] 감정 온도 결과
  - [ ] 히스토리 저장/복원
  - [ ] 공유 이미지 생성
  - [ ] 연속측정 배지

---

## 4️⃣ hsp-test 🔴 필요
### 우선순위: 중간 (Canvas + localStorage)
- [ ] index.html 공통 스크립트 4개 추가
- [ ] 모든 함수를 try-catch로 감싸기
  - getTestCount(), incrementTestCount() (Line 41-56)
  - updateTestCount()
  - showResult() (Line 137-192)
  - displayPremiumContent() (Line 227-269)
  - 각 함수 시작에 try-catch 추가
- [ ] localStorage 변경:
  - getTestCount() → storage.getNumber()
  - incrementTestCount() → storage.setNumber()
- [ ] Canvas 사용 (generateShareImage, Line 354-458)
  - SafeCanvas 적용
- [ ] 테스트:
  - [ ] 테스트 완료 후 결과
  - [ ] 이미지 생성
  - [ ] 테스트 횟수 저장

---

## 5️⃣ idle-clicker 🔴 필요
### 우선순위: 매우 높음 (큰 게임, Canvas + Audio)
**파일이 크므로 섹션별로 나눠서 처리**

### 섹션 A: 초기화
- [ ] index.html 공통 스크립트 추가
- [ ] constructor에 에러 try-catch
- [ ] StorageManager 초기화

### 섹션 B: localStorage
- [ ] 게임 상태 저장 (save/load 함수)
  → StorageManager로 변경

### 섹션 C: Canvas
- [ ] 게임 렌더링 메인 루프
  - getContext → SafeCanvas.getContext
- [ ] 점수 표시 부분
  - fillText → SafeCanvas.drawText

### 섹션 D: Web Audio
- [ ] playSound() 함수
  - AudioContext → SafeAudio.createContext
  - tone 생성 → SafeAudio.playTone

### 섹션 E: 게임 루프 정리
- [ ] requestAnimationFrame 정리
- [ ] setInterval 정리
- [ ] 메모리 누수 체크

### 테스트:
- [ ] 게임 진행상황 저장/복원
- [ ] 클릭음 재생
- [ ] 점수 표시

---

## 6️⃣ brain-type 🔴 필요
### 우선순위: 중간
- [ ] index.html 공통 스크립트 추가
- [ ] constructor 전체 try-catch
- [ ] localStorage 사용 검토
  - 있으면 StorageManager로 변경
- [ ] Canvas drawResultCard 함수
  - SafeCanvas 적용
- [ ] i18n.t() 호출 전 null 체크
- [ ] 테스트:
  - [ ] 결과 카드 렌더링
  - [ ] 언어 변경

---

## 7️⃣ stress-check 🔴 필요
### 우선순위: 중간
- [ ] index.html 공통 스크립트 추가
- [ ] constructor + init() try-catch
- [ ] localStorage 호출:
  - 있으면 StorageManager로
- [ ] JSON.parse (있으면)
  - try-catch 확인
- [ ] 테스트:
  - [ ] 스트레스 점수 계산
  - [ ] 결과 저장

---

## 8️⃣ memory-card 🔴 필요
### 우선순위: 높음 (게임 + 오디오)
- [ ] index.html 공통 스크립트 추가
- [ ] constructor 전체 try-catch
- [ ] this.storage = new StorageManager('memorygame')
- [ ] localStorage 호출:
  - Line 11: bestScore → storage.getNumber('bestScore')
  - saveScore() → storage.setNumber()
- [ ] Web Audio (initAudio, playCardFlipSound 등)
  - AudioContext → SafeAudio.createContext
  - playTone → SafeAudio.playTone
- [ ] setInterval/setTimeout 정리
  - 게임 종료 시 모두 clearInterval/clearTimeout
- [ ] 테스트:
  - [ ] 게임 플레이
  - [ ] 최고 점수 저장
  - [ ] 카드 뒤집기 음

---

## 9️⃣ color-memory 🔴 필요
### 우선순위: 매우 높음 (Audio 중요)
- [ ] index.html 공통 스크립트 추가
- [ ] constructor 전체 try-catch
- [ ] StorageManager 초기화
- [ ] localStorage:
  - _loadBestScore() (Line 73-84) ✓ 이미 good
  - _saveBestScore() (Line 86-94) ✓ 이미 good
  - 하지만 StorageManager로 통일 권장
- [ ] Web Audio (initAudio, Line 96-108)
  - **CRITICAL**: AudioContext 초기화 에러 처리 필수
  - SafeAudio.createContext() 사용
  - playColorSequence() 함수
    - playTone → SafeAudio.playTone
- [ ] 테스트:
  - [ ] 색상 시퀀스 재생
  - [ ] 사용자 입력음

---

## 🔟 snake-game 🔴 필요
### 우선순위: 높음 (Canvas + 게임 루프)
- [ ] index.html 공통 스크립트 추가
- [ ] constructor 전체 try-catch
- [ ] StorageManager 초기화
- [ ] localStorage:
  - Line 13: highScore → storage.getNumber('snake_highscore')
  - stats 객체 (Line 34-39) → storage.getObject/setObject
- [ ] Canvas (startGameLoop, render 함수)
  - getContext → SafeCanvas.getContext
  - 모든 그리기 함수 SafeCanvas 사용
- [ ] requestAnimationFrame 루프
  - 게임 종료 시 정리
  - cancelAnimationFrame() 호출
- [ ] 테스트:
  - [ ] 게임 플레이
  - [ ] 최고 점수 저장
  - [ ] 일시 정지/재개

---

## 1️⃣1️⃣ color-personality 🔴 필요
### 우선순위: 중간
- [ ] index.html 공통 스크립트 추가
- [ ] 모든 주요 함수 try-catch
- [ ] Canvas 사용 부분
  - SafeCanvas 적용
- [ ] localStorage
  - StorageManager로 변경
- [ ] 테스트:
  - [ ] 테스트 완료
  - [ ] 이미지 생성

---

## 1️⃣2️⃣ mbti-love 🔴 필요
### 우선순위: 중간
- [ ] index.html 공통 스크립트 추가
- [ ] Canvas (호환도 차트)
  - SafeCanvas 적용
- [ ] localStorage
  - StorageManager로 변경
- [ ] i18n 폴백 확인
- [ ] 테스트:
  - [ ] 호환도 계산
  - [ ] 차트 그리기

---

## 1️⃣3️⃣ kpop-bias 🔴 필요
### 우선순위: 낮음
- [ ] index.html 공통 스크립트 추가
- [ ] Canvas (결과 카드)
  - SafeCanvas 적용
- [ ] localStorage
  - StorageManager로 변경
- [ ] 테스트:
  - [ ] 결과 렌더링

---

## 1️⃣4️⃣ reaction-test 🔴 필요
### 우선순위: 중간 (오디오)
- [ ] index.html 공통 스크립트 추가
- [ ] Web Audio (반응음)
  - SafeAudio.playTone() 사용
- [ ] localStorage
  - StorageManager로 변경
- [ ] 테스트:
  - [ ] 반응 음 재생
  - [ ] 점수 저장

---

## 1️⃣5️⃣ typing-speed 🔴 필요
### 우선순위: 중간
- [ ] index.html 공통 스크립트 추가
- [ ] Canvas (선택사항 - 결과 그래프)
  - 있으면 SafeCanvas 적용
- [ ] Web Audio (입력음)
  - SafeAudio 적용
- [ ] localStorage
  - StorageManager로 변경
- [ ] 테스트:
  - [ ] 타이핑 진행
  - [ ] 결과 저장

---

## 📋 전체 체크리스트

### Phase 1: 준비 (완료)
- [x] 공통 유틸리티 4개 파일 생성
  - [x] error-handler.js
  - [x] storage-manager.js
  - [x] api-wrappers.js
  - [x] i18n-safe-loader.js
- [x] dream-fortune 샘플 적용

### Phase 2: 주요 앱 (우선순위)
- [ ] past-life (Canvas 많음)
- [ ] emotion-temp (히스토리)
- [ ] idle-clicker (대규모 게임)
- [ ] memory-card (오디오)
- [ ] snake-game (게임)

### Phase 3: 보조 앱
- [ ] hsp-test
- [ ] brain-type
- [ ] stress-check
- [ ] color-memory (오디오)
- [ ] color-personality

### Phase 4: 최종 앱
- [ ] mbti-love
- [ ] kpop-bias
- [ ] reaction-test (오디오)
- [ ] typing-speed

### Phase 5: 검증
- [ ] 모든 앱 브라우저 테스트
- [ ] 개인정보 보호 모드 테스트
- [ ] 콘솔 에러 없음 확인
- [ ] Google Analytics 이벤트 전송 확인

---

## 🚀 배포 가이드

각 앱 수정 후:

1. **로컬 테스트** (Chrome 개발자도구)
   - F12 → Console 탭 열기
   - 에러 메시지 없음 확인
   - `window.errorHandler` 확인 (undefined 아님)
   - `window.StorageManager` 확인

2. **개인정보 보호 모드 테스트** (중요!)
   - Ctrl+Shift+N (Chrome)
   - Cmd+Shift+N (Mac)
   - 앱 실행
   - "개인정보 보호 모드" 메시지 없음 확인
   - 모든 기능 정상 작동 확인

3. **Console 에러 확인**
   ```javascript
   // Console에서 실행
   window.errorHandler.getStatus?.() || 'Loaded'
   window.StorageManager ? 'OK' : 'NOT LOADED'
   ```

4. **Google Play 업데이트** (필요시)
   - 앱 설명: "에러 안정성 개선"

---

## 📞 문제 해결

### "StorageManager is not defined"
→ index.html에 storage-manager.js 추가 확인
→ 스크립트 로드 순서 확인 (error-handler.js 먼저)

### Canvas에 아무것도 안 보임
→ SafeCanvas.getContext() 반환값 null 확인
→ 브라우저 Canvas 지원 확인: `SafeCanvas.isSupported()`

### 음성이 안 나옴
→ SafeAudio.createContext() 반환값 null 확인
→ 브라우저 Web Audio 지원 확인: `SafeAudio.isSupported()`

### localStorage 데이터 없음 (개인정보 보호 모드)
→ 정상 (메모리에만 저장, 세션 종료 시 소실)
→ 사용자에게 설명: "일반 모드에서 데이터가 저장됩니다"

---

**최종 목표**: 모든 15개 앱이 안정적인 에러 처리를 갖춘 프로덕션 품질의 코드

**예상 완료 기간**: 각 앱 30분~1시간 (경험치에 따라)
