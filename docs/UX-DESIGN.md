# DopaBrain UX/UI Design Guide

> UX 개선 에이전트는 이 파일만 참조하면 됨

---

## 1. 2026 UI/UX 필수 트렌드

### 적용 완료
- [x] Glassmorphism 2.0 (backdrop-filter: blur)
- [x] Dark Mode First
- [x] Microinteractions (hover/tap 애니메이션)
- [x] Minimalist Flow (generous white space)
- [x] Mobile First Design
- [x] 44px+ 터치 타겟
- [x] 카드 기반 레이아웃

### 추가 적용 대상
- [ ] Bento Grid 레이아웃 (Apple 스타일 비정형 그리드)
- [ ] Scroll-triggered Animations (Intersection Observer)
- [ ] Gradient Mesh (동적 그라디언트 배경)
- [ ] Skeleton Loading (뼈대 UI)
- [ ] Variable Fonts (가변 폰트)
- [ ] Container Queries (부모 크기 기반 반응형)
- [ ] Haptic-like Feedback (CSS 터치 피드백 시뮬레이션)

## 2. UX 심리 법칙 (디자인 결정 근거)

| 법칙 | 적용 |
|------|------|
| **피츠의 법칙** | 터치 타겟 44px+, CTA 버튼 크게 |
| **힉의 법칙** | 선택지 제한 (메뉴 5개 이하) |
| **밀러의 법칙** | 카테고리 7±2개 제한 |
| **야콥의 법칙** | 표준 UI 패턴 사용 (탭/카드/모달) |
| **도허티 임계값** | 응답 0.4초 이하 (애니메이션 최적화) |
| **폰 레스토프** | CTA 버튼 강조 색상, NEW/HOT 배지 |

## 3. 체류시간 개선 패턴

### 즉시 이탈 (0~3초) → 기술적 문제 또는 첫인상 실패
- JS 에러 확인 (콘솔 에러 유발 코드)
- 파일 경로/API 호출 실패 확인
- 히어로 섹션 개선 (가치 제안 명확화)
- CTA 버튼 Above the Fold에 배치

### 저체류 (3~10초) → 참여 유도 실패
- "N명이 참여중" 소셜 프루프 추가
- "30초면 끝!" 시간 제안
- 마이크로인터랙션 (로드 시 stagger 애니메이션)
- 진행 바/단계 표시

### 중간 체류 (10~30초) → 콘텐츠 깊이 부족
- 결과 화면 풍성하게 (차트/비교/이미지)
- "더 자세히 보기" 프리미엄 콘텐츠
- 관련 앱 추천 ("이것도 해보세요")

## 4. 디자인 영감 사이트

| 사이트 | 용도 |
|--------|------|
| [Mobbin](https://mobbin.com) | 앱 UX 플로우 벤치마킹 |
| [Godly](https://godly.website) | 실험적 웹 디자인 |
| [Bento Grids](https://bentogrids.com) | Apple 스타일 그리드 |
| [SaaSpo](https://saaspo.com) | 대시보드/유틸 UI |
| [Dribbble](https://dribbble.com/shots/popular) | 인기 UI 패턴 |
| [Laws of UX](https://lawsofux.com) | UX 원칙 참조 |

## 5. 앱별 디자인 테마

| 앱 | Primary | Style |
|----|---------|-------|
| Quiz App | #667eea | Game/Quiz |
| Shopping Calc | #f39c12 | Finance |
| Detox Timer | #00b894 | Meditation |
| Dream Fortune | #9b59b6 | Mystical |
| Affirmation | #e91e63 | Emotional |
| Lottery | #e74c3c | Luxury |
| D-Day Counter | #3498db | Minimal |
| MBTI Tips | #1abc9c | Social |
| White Noise | #2c3e50 | Sleep |
| Dev Quiz | #27ae60 | Terminal |

## 6. AI 디자인 도구

- [v0.dev](https://v0.dev) - Shadcn/UI 기반 UI 코드 생성
- [Lucide Icons](https://lucide.dev) - 오픈소스 아이콘 (SVG)
- [Shadcn UI](https://ui.shadcn.com) - 표준 컴포넌트 라이브러리
