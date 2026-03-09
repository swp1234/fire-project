# DopaBrain Game Development Bible

> 게임 개발/개선 에이전트는 이 파일만 참조하면 됨

---

## 1. Core Design Principles (하이퍼캐주얼)

- **Simple Control:** One-tap or Swipe only
- **Short Session:** 30~60초 per level
- **Visual Feedback:** Particle effects, screen shake, confetti
- **Mobile First:** Low-end device 최적화, 빠른 로딩

## 2. 4-Layer Analysis (모든 게임 필수)

| Layer | 설명 | 체크 |
|-------|------|------|
| **Core Loop** | 5초 반복: Action → Reward → Feedback | 필수 |
| **Meta Systems** | 1시간 후 복귀 이유: 업그레이드/컬렉션/랭킹 | 필수 |
| **Retention** | 7일 후 접속 이유: 일일퀘스트/시즌테마/이벤트 | 권장 |
| **Monetization** | 광고 삽입: Rewarded(부활)/Interstitial(3레벨) | 필수 |

## 3. Dopamine Elements Checklist

- [ ] 파티클 이펙트 (성공/실패 시 confetti/explosion)
- [ ] Screen Shake (충돌/임팩트 시)
- [ ] 콤보 시스템 (연속 성공 x3, x5, x10)
- [ ] 점수 팝업 (+1, +5 플로팅 텍스트)
- [ ] 비주얼 피드백 (녹색/빨간 플래시, NEW BEST!)
- [ ] 진동 피드백 (navigator.vibrate)

## 4. Monetization Triggers

| 트리거 | 유형 | 시점 |
|--------|------|------|
| 부활 | Rewarded Ad | 게임오버 시 "광고 보고 부활" |
| 보상 2배 | Rewarded Ad | 결과 화면 "광고 보고 2배" |
| 레벨 간 | Interstitial | 매 3레벨마다 |
| 스킨 언락 | Rewarded Ad | 특정 스킨 "광고 보고 해금" |

## 5. Scenario Design (기획 시 필수)

- **A (신규):** 10초 만에 규칙 이해 + 첫 도파민
- **B (숙련):** 지루해질 때 새 변수 등장 (DDA)
- **C (이탈 직전):** Lucky Chance / 보상형 광고

## 6. 기획서 필수 포함 사항 (2,000자+)

1. 데이터 구조 (JSON 스키마)
2. 레벨별 난이도 곡선 (수치 테이블)
3. 유저 이탈 위험 5가지 + 해결책
4. 수익화 시뮬레이션 (eCPM, 세션당 수익)
5. Core Loop 도식

## 7. Asset Protocol

| 유형 | 소스 | 라이선스 |
|------|------|----------|
| Graphics | Kenney.nl | CC0 |
| Graphics | OpenGameArt | Public Domain |
| Icons | Lucide.dev | MIT |
| Fonts | Google Fonts | OFL |

- SVG/WebP 우선, CSS/Canvas 기반 비주얼 선호
- 외부 이미지 다운로드 금지, 코드로 생성
- manifest.json + sw.js에 캐싱 목록 추가

## 8. 기획 참고 리소스

- [Game Design Patterns](https://game-designpatterns.com/) - Positive Feedback Loop, Risk vs Reward
- [Machinations.io](https://machinations.io/articles/) - 게임 경제/밸런스 수학적 설계

## 9. 현재 게임 현황 (21개)

> 4-Layer 분석 기준 현황. ⚠️ = 부분 구현 (콤보/파티클 등 추가됨)

| 게임 | Core Loop | Meta | Retention | Monetization |
|------|-----------|------|-----------|-------------|
| road-shooter | ✅ | ✅ | ✅ | ⚠️ |
| idle-clicker | ✅ | ✅ | ⚠️ | ❌ |
| snake-game | ✅ | ✅ | ⚠️ | ❌ |
| stack-tower | ✅ | ✅ | ⚠️ | ❌ |
| brick-breaker | ✅ | ✅ | ⚠️ | ❌ |
| block-puzzle | ✅ | ✅ | ⚠️ | ❌ |
| flappy-bird | ✅ | ✅ | ⚠️ | ❌ |
| puzzle-2048 | ✅ | ✅ | ⚠️ | ❌ |
| emoji-merge | ✅ | ✅ | ⚠️ | ❌ |
| maze-runner | ✅ | ✅ | ⚠️ | ❌ |
| sky-runner | ✅ | ✅ | ⚠️ | ❌ |
| zigzag-runner | ✅ | ✅ | ⚠️ | ❌ |
| pong-game | ✅ | ✅ | ⚠️ | ❌ |
| minesweeper | ✅ | ✅ | ⚠️ | ❌ |
| number-puzzle | ✅ | ✅ | ⚠️ | ❌ |
| memory-card | ✅ | ✅ | ⚠️ | ❌ |
| color-memory | ✅ | ✅ | ⚠️ | ❌ |
| word-guess | ✅ | ✅ | ✅ | ❌ |
| word-scramble | ✅ | ✅ | ⚠️ | ❌ |
| reaction-test | ✅ | ✅ | ⚠️ | ❌ |
| typing-speed | ✅ | ✅ | ⚠️ | ❌ |
