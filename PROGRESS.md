# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-13 (세션151)

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
| 크로스프로모 | **101앱**, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| i18n 하드코딩 검수 | **게임 21종 + 테스트 40종 + 포털 완료** (세션150) |
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

### 세션151 (3/13) - 게임 10종 대규모 폴리시 (자율 10세션)

- **Road Shooter Phase 4+5** — 글래스모피즘 HUD/도로 텍스처(Phase 4), 결과화면 리디자인+무기별 히트 이펙트+스크린 셰이크(Phase 5)
- **게임 신기능 4종** — pong-game 스트릭 멀티플라이어, word-guess 난이도 4티어, maze-runner 안개 시스템, color-memory 패턴 프리뷰
- **게임 폴리시 6종** — snake-game 장애물(무한모드), block-puzzle 착지+테트리스 이펙트, zigzag-runner 니어미스 보너스, minesweeper 힌트 시스템, flappy-bird 궤적 파티클, stack-tower 파편 이펙트
- **애니메이션 강화 2종** — emoji-merge 바운스 머지/스폰, idle-clicker 콤보 3단계 시각 피드백

### 세션150 (3/13) - i18n 하드코딩 전수조사 + 대규모 수정 (40+ 앱)

- road-shooter/게임 5종/error-handler 25개/테스트 6종/게임 데이터 4종/대형 데이터 리팩토링 6종/포털 i18n

### 이전 세션 (~149)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 148-149 | 3/13 | Road Shooter 리디자인 시작(무기+AI스프라이트 캐릭터6+적군12), 게임 폴리시 4종 |
| 145-147 | 3/11-13 | 게임 5종 시각 고도화, 하네스 감사, stress-check SEO, sky-runner 파워업, emoji-merge 이어하기 |
| 143-144 | 3/11 | Teams 통합, Nano Banana 에셋 54개, emoji-merge 힌트, block-puzzle 3D |
| 140-142 | 3/10 | Minesweeper 코드클릭, Word Guess 스코어링, Maze Runner 순찰적 |
| 133-139 | 3/10 | Brick Breaker 폭발브릭, SEO 내부링크 95/95, GameAchievements |
| 125-134 | 3/10 | 도파민피드백 21/21, Snake 파워업, RS 적+보스, SFX 21/21, English-first |
| 104-124 | 3/9-10 | 인프라 자동화, 쿠키커터 24개, 신규앱 4개, 에셋/온보딩/업적/크로스프로모 |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **Road Shooter 리디자인 계속** — Phase 6: 보스 AI 스프라이트, 승리/패배 연출 강화
2. **바운스율/세션 모니터링** — emoji-merge continue + stack-tower 난이도 효과 확인 (3/14~)
3. **Organic 가속** — hsp-test/stress-check SEO 반영 확인, mbti-love pos8 추적
4. **게임 폴리시 추가** — brick-breaker 파워업 확장, sky-runner 시각 피드백
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
