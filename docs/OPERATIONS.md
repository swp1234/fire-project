# DopaBrain AI Operations Guide

> 자율 운영/코디네이션 에이전트는 이 파일 참조

---

## 1. 자율 운영 원칙 (Master Directive)

> 매 세션 시작 시 PROGRESS.md를 분석하여 자율적으로 목표를 설정하고 보고한다.
> 작업 완료 시 사용자 확인 없이 다음 목표를 즉시 설정하고 진행한다.
> 수익화를 향해 지속적으로 전진. 멈추지 않는다.

### 우선순위
1. **유지보수 (Stability):** 전체 프로젝트 인프라 정합성
2. **성장 (Growth):** SEO + 인덱싱 + 콘텐츠 확장
3. **최적화 (Optimization):** GA4 데이터 기반 UX 개선
4. **확장 (Scalability):** 다국어 + 새 앱/게임

## 2. Daily Growth Loop

1. **데이터 수집:** GA4/GSC MCP로 트래픽/인덱싱 확인
2. **분석:** 체류시간 저조 앱 식별, 트렌드 키워드 파악
3. **최적화:** 코드 수정, 콘텐츠 업데이트, UI 개선
4. **배포:** push + IndexNow + 사이트맵 업데이트

## 3. 병렬 에이전트 운영

### 에이전트별 참조 문서
| 에이전트 유형 | 참조 문서 |
|-------------|-----------|
| 게임 개발/개선 | `docs/GAME-SPEC.md` |
| 블로그/SEO | `docs/BLOG-SEO.md` |
| UX/UI 개선 | `docs/UX-DESIGN.md` |
| 운영/코디네이션 | `docs/OPERATIONS.md` |
| 진행상황 확인 | `PROGRESS.md` |

### 병렬 실행 규칙
- 최대 4개 동시 실행 (비용 관리)
- 같은 파일 수정하는 에이전트 동시 실행 금지
- 각 에이전트는 자신의 참조 문서만 읽으면 됨
- 완료 후 PROGRESS.md 업데이트

## 4. 자가 점검 (작업 완료 시)

- [ ] '도파민 증대'라는 서비스 본질에 기여했는가?
- [ ] 수동 반복 작업 중 자동화한 부분은?
- [ ] 전체 앱의 일관성을 유지하는가?
- [ ] 다음 에이전트가 이 로그로 바로 이어갈 수 있는가?

## 5. 기술 스택

| 역할 | 현재 |
|------|------|
| AI | Claude (Opus) via Cursor |
| Monitoring | GA4 + GSC (MCP 연동) |
| Hosting | GitHub Pages |
| Domain | dopabrain.com (Cloudflare) |
| Ads | AdSense (심사중), AdMob (예정) |

## 6. 프로젝트 현황 (61개)

> **정확한 앱 목록/메타데이터:** `portal/js/app-data.js` 참조

### 카테고리별 분류

| 카테고리 | 수량 | 주요 앱 |
|---------|------|---------|
| 게임 | 18 | idle-clicker, emoji-merge, puzzle-2048, flappy-bird, snake-game, maze-runner, sky-runner, stack-tower, zigzag-runner, pong-game, block-puzzle, brick-breaker, minesweeper, number-puzzle, memory-card, color-memory, word-guess, word-scramble |
| 바이럴 테스트 | 19 | hsp-test, kpop-position, mbti-love, mbti-tips, mbti-career, animal-personality, color-personality, brain-type, blood-type, emotion-temp, future-self, iq-test, numerology, past-life, stress-check, valentine, zodiac-match, love-frequency, daily-tarot |
| 유틸/도구 | 22 | quiz-app, shopping-calc, detox-timer, dream-fortune, affirmation, lottery, dday-counter, white-noise, dev-quiz, tax-refund-preview, unit-converter, bmi-calculator, color-palette, habit-tracker, password-generator, pomodoro-timer, qr-generator, reaction-test, typing-speed, todo-list, routine-planner, biorhythm |
| 인프라 | 2 | portal, root-domain |

## 7. 핵심 구현 원칙

- **i18n 필수:** 12개 언어 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr)
- **PWA:** sw.js + manifest.json
- **광고:** AdSense 코드 전체 삽입 완료
- **GA4:** 전체 삽입 완료
- **저작권:** AI 생성 에셋만 사용, 저작권 침해 0 원칙
- **Git:** Co-authored-by 금지, 간결한 한국어 커밋 메시지
