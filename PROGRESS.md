# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-13 (세션172)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **98개** (projects/ 98 디렉토리, 앱 96 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **603개** 실측 |

**앱 분류:** 유틸 12 / 바이럴 테스트 **45** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료(2/20)** — 전앱 스크립트 확인완료(83/83) |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **95/95앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 전앱 완료, aggregateRating+publisher 강화 완료 |
| PWA/SW | pwa-install 13앱, SW 등록 완료 **전앱** |
| 카테고리 허브 | Games(21), Tests, Tools, MBTI (4개 랜딩페이지) |
| 서브모듈 | **73/74** (_common만 tree) |
| 하네스 | pre-push quality gate, failure logging (JSONL), MCP on-demand |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 785 URLs |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/mbti/`

---

## GSC 인덱싱 (3/9 업데이트)

**Indexed 60/62 (97%)** | **Unknown 10:** dark-core, soul-age, pick-me, emotional-age, villain-origin, ick-factor, life-in-numbers, emotion-iceberg, mbti-coffee, mbti-city — 사이트맵 등록 완료, 크롤링 대기

---

## 세션 기록

### 세션163-172 (3/13) - 9개 앱/게임 UX 폴리시 (자율 10세션 완료)

- **Pong Game** — 파워업 시스템 3종 (Big Paddle, Shrink Opponent, Speed Ball) + 랠리 마일스톤
- **Zigzag Runner** — 점수 마일스톤 축하 (50~2000) + 컨페티 + 화면 효과
- **Word Guess** — 첫 추측 정확도 등급 + 퍼펙트 게임 인디케이터
- **Word Scramble** — 스피드 솔브 보너스 + 퍼펙트 레벨 배지
- **Typing Speed** — 실시간 WPM 마일스톤 (30~120) + 이전 결과 대비 개선 델타
- **Fortune Cookie** — 운세 등급 시스템 (Common→Legendary) + 일일 스트릭 추적
- **Would You Rather** — 성격 유형 시스템 6종 (선택 패턴 기반)
- **Quiz App** — 연속 정답 스트릭 시스템 + 컨페티 + 결과 최고 스트릭
- **Dev Quiz** — 5+/10+ 스트릭 컨페티 + 개발자 레벨 배지 (Intern→Staff Engineer)

### 세션158-162 (3/13) - 게임 13종 대규모 폴리시

- Flappy Bird 난이도곡선+바람, Snake 특수아이템, Maze Runner 5테마, RS Phase7 총알비주얼, Block Puzzle B2B, Puzzle 2048 마일스톤, Minesweeper 승률, Memory Card 퍼펙트, Color Memory 티어, Stack Tower 사쿠라, Brick Breaker 프로그레스바, Reaction Test PB, Sky Runner 마일스톤

### 세션153-157 (3/13) - 크로스프로모 95/95 + 게임 폴리시 3종

- 크로스프로모 2x2 그리드 전앱 확장 (22→95/95), RS Phase 6, Brick Breaker 파워업 3종, Sky Runner 스피드라인

### 이전 세션 (~152)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 150-152 | 3/13 | i18n 하드코딩 전수조사 40+앱, 크로스프로모 22앱, RS Phase 4+5 |
| 148-149 | 3/13 | Road Shooter 리디자인(무기+AI스프라이트), 게임 폴리시 4종 |
| 143-147 | 3/11-13 | Teams 통합, 게임 시각 고도화, emoji-merge 힌트, block-puzzle 3D |
| 133-142 | 3/10 | Brick Breaker, SEO 내부링크 95/95, GameAchievements, 게임 시스템 |
| 104-134 | 3/9-10 | 인프라 자동화, 쿠키커터 24개, 신규앱 4개, 도파민피드백 21/21, SFX |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **바운스율/세션 모니터링** — 95앱 크로스프로모 효과 측정 (3/14~)
2. **Organic 가속** — hsp-test/stress-check SEO 반영 확인, mbti-love pos8 추적
3. **SEO 콘텐츠** — 고트래픽 앱 블로그 업데이트, 신규 롱테일 키워드 타겟
4. **게임 추가** — idle-clicker 신규 콘텐츠, 새 게임 아이디어 실험
5. **신규 앱 실험** — 트렌드 기반 바이럴 테스트/게임 아이디어 탐색
