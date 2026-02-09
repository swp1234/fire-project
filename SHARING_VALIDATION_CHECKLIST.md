# 바이럴 앱 공유 기능 검증 (2026-02-10)

## 검증 기준

각 앱이 갖춰야 할 공유 기능:

1. **공유 버튼** - 결과 화면에 최소 1개 이상의 공유 버튼
   - 카카오톡, 트위터/X, 페이스북, 링크 복사 중 최소 1개
   - 또는 통합 "공유" 버튼

2. **OG 메타태그** - 동적 업데이트 준비
   - `og:title`, `og:description`, `og:image`, `og:url`

3. **결과 이미지 생성** - Canvas 또는 이미지 생성 기능
   - 결과를 이미지로 다운로드 가능

4. **Web Share API** - navigator.share 구현
   - 모바일에서 네이티브 공유 메뉴

5. **올바른 URL** - dopabrain.com/{앱이름}/ 형식
   - 공유 시 정확한 링크 전달

6. **다시 하기** - 재테스트 기능
   - UX 개선을 위한 필수 기능

7. **다른 테스트 추천** - 크로스 프로모션
   - 다른 바이럴 앱으로의 유도

---

## 앱별 검증 결과

### 📱 1. past-life (전생 테스트)
- ✅ 공유 버튼: YES (btn-share)
- ✅ Canvas 이미지: YES (resultCanvas)
- ✅ OG 메타태그: YES (og:title, og:description, og:image, og:url)
- ✅ 올바른 URL: YES (https://dopabrain.com/past-life/)
- ✅ Web Share API: YES (navigator.share)
- ✅ 다시 하기: YES (btn-retry)
- ✅ 추천: YES (recommend-section)
**상태: 완전 준수** ✅

### 📱 2. brain-type (두뇌 유형)
- ✅ 공유 버튼: YES (share-kakao, share-twitter, share-facebook, share-copy)
- ⚠️  Canvas 이미지: 미확인 (검증 필요)
- ✅ OG 메타태그: YES
- ✅ 올바른 URL: YES (https://dopabrain.com/brain-type/)
- ⚠️  Web Share API: 미확인 (검증 필요)
- ⚠️  다시 하기: 미확인 (retry-btn 존재)
**상태: 부분 준수 (추가 검증 필요)** ⚠️

### 📱 3. mbti-love (MBTI 궁합)
- ✅ 공유 버튼: YES (btn-share)
- ⚠️  Canvas: 미확인
- ✅ OG 메타태그: YES
- ✅ 올바른 URL: YES (https://dopabrain.com/mbti-love/)
- ⚠️  구조: 궁합표 앱 (테스트 결과 화면이 아님)
**상태: 부분 준수** ⚠️

---

## 다음 단계

1. **kpop-bias, love-frequency, emotion-temp 등** 나머지 앱 검증
2. **Canvas 이미지 생성** - 미구현 앱에 추가
3. **Web Share API** - 모든 앱에 통합
4. **OG 메타태그 동적 업데이트** - 결과별 다른 미리보기
5. **바이럴 최적화** - SNS 공유 시 결과 미리보기 강화

---

## 작업 일정

- 모든 앱 검증: 2026-02-10 (본 세션)
- 누락된 기능 구현: 2026-02-11
- 테스트 및 배포: 2026-02-12
