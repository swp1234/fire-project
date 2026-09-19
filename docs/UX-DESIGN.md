# DopaBrain UX/UI Design Guide

DopaBrain 웹 포트폴리오의 일관된 사용자 경험과 인터페이스 설계를 위한 디자인 가이드라인입니다.

---

## 1. UI/UX 핵심 원칙

- **Dark Mode First**: 몰입감 있는 다크 테마 기본 적용.
- **Glassmorphism 2.0**: `backdrop-filter: blur(10px)`와 미세한 경계선(`border: 1px solid rgba(255,255,255,0.1)`) 활용.
- **Microinteractions**: 명확한 터치/호버 피드백(`cubic-bezier(0.4, 0, 0.2, 1)` 전환).
- **Mobile First & Accessibility**: 최소 44px 터치 타깃, 모바일 가로 오버플로 0px 유지, 고대비 텍스트 가독성.
- **Minimalist Flow**: 여백 중심의 레이아웃, 화면당 하나의 명확한 주요 액션(Primary CTA).

### CSS 필수 테크닉

```css
/* Glassmorphism Card */
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;

/* Smooth Transitions */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Glow Accent */
box-shadow: 0 0 24px rgba(99, 102, 241, 0.25);

/* Gradient Text */
background: linear-gradient(135deg, #6366f1, #a855f7);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 2. UX 심리 법칙과 의사결정 기준

| 법칙 | 적용 방안 |
|------|-----------|
| **피츠의 법칙 (Fitts's Law)** | 모바일 엄지 영역 및 주요 CTA 버튼 최소 높이 44px 이상 확보 |
| **힉의 법칙 (Hick's Law)** | 탐색 및 선택지 수 최소화, 단계별 점진적 노출 |
| **밀러의 법칙 (Miller's Law)** | 정보 묶음(Chunking)을 5~7개 단위로 구성하여 인지 부하 감소 |
| **야콥의 법칙 (Jakob's Law)** | 익숙한 인터랙션 패턴(스와이프, 탭, 결과 카드) 사용 |
| **도허티 임계값 (Doherty Threshold)** | 0.4초 이내의 즉각적인 인터랙션 응답 제공 |
| **폰 레스토프 효과 (Von Restorff)** | 다음 추천 행동(Primary CTA, 핵심 리셋 도구)에 포인트 컬러 강조 |

---

## 3. 체류시간 최적화 패턴

- **진입 3초 이내 이탈 방지**: 핵심 가치 제안과 시작 버튼을 Above the Fold에 명확히 노출, 콘솔 오류 0 유지.
- **참여 유지 (3~30초)**: 문항/단계 진행 바, 미려한 인터랙션, 모바일 친화적 입력 방식.
- **완료 후 재순환 (30초 이상)**: 통찰력 있는 맞춤형 결과 카드, 다음 추천 콘텐츠/도구(Stress Check, HSP Test 등) 유기적 연결.

---

## 4. 앱별 대표 컬러 테마

| 앱 | Primary | Style |
|----|---------|-------|
| Quiz App | `#667eea` | Game/Quiz |
| Shopping Calc | `#f39c12` | Finance |
| Detox Timer | `#00b894` | Meditation |
| Dream Fortune | `#9b59b6` | Mystical |
| Affirmation | `#e91e63` | Emotional |
| Lottery | `#e74c3c` | Luxury |
| D-Day Counter | `#3498db` | Minimal |
| MBTI Tips | `#1abc9c` | Social |
| White Noise | `#2c3e50` | Sleep |
| Dev Quiz | `#27ae60` | Terminal |

---

## 5. 저작권 및 에셋 원칙

- 공공 데이터 및 검증된 사실 기반 지식만 취급.
- 코드로 생성 가능한 CSS/Canvas/SVG 인터랙션 우선.
- 저작권이 있는 외부 이미지, 사운드, 폰트의 무단 사용 금지 (Google Fonts OFL, Lucide MIT 준수).
