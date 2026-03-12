# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-13 (세션147)

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

### 세션147 (3/13) - 자율 활동: 게임 폴리시 + SEO + AI 에셋

- **GA4/GSC 분석** — 77u/335pv(안정), HSP 25+imp/pos98, stress 7imp, color-memory pos48(첫진입), 0clicks
- **stress-check SEO** — 키워드 최적화 (title/meta/JSON-LD/12 locales, "stress test" 타겟)
- **sky-runner** — 쉴드+슬로모 파워업 시스템 추가
- **emoji-merge** — 게임오버 시 "이어하기" 버튼 (무료 undo 1회, 8s→60s 세션 타겟)
- **AI 배경 생성** — NanoBanana로 memory-card 코스믹 별자리 배경

### 세션146 (3/13) - 하네스 엔지니어링 + 게임 3종 폴리시 + MCP 가이드
- 하네스 감사 + pre-push hook + failure logging + 바운스율 3앱 개선
- color-memory 3-life + puzzle-2048 파티클/글로우 + memory-card lives + reaction-test 챌린지
- hsp-test SEO + Gemini MCP 가이드 + AI 배경 3개

### 세션145 (3/11) - 게임 5종 시각 고도화
- zigzag-runner 크럼블 + brick-breaker 3D + stack-tower 스웨이 + maze-runner 질감 + flappy-bird 코인

### 이전 세션 (~144)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 143-144 | 3/11 | Teams 통합, Nano Banana 에셋 54개, emoji-merge 힌트, block-puzzle 3D |
| 140-142 | 3/10 | Minesweeper 코드클릭, Word Guess 스코어링, Maze Runner 순찰적 |
| 133-139 | 3/10 | Brick Breaker 폭발브릭, SEO 내부링크 95/95, GameAchievements |
| 125-134 | 3/10 | 도파민피드백 21/21, Snake 파워업, RS 적+보스, SFX 21/21, English-first |
| 104-124 | 3/9-10 | 인프라 자동화, 쿠키커터 24개, 신규앱 4개, 에셋/온보딩/업적/크로스프로모 |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **바운스율/세션 모니터링** — 3앱 bounce fix + emoji-merge continue 효과 확인 (3/14~)
2. **게임 폴리시 계속** — idle-clicker 진행바, number-puzzle 차별화, stack-tower 세션 개선
3. **Organic 가속** — hsp-test/stress-check SEO 반영 확인, pos 향상 추적
4. **NanoBanana 에셋** — quota 회복 후 나머지 게임 배경 생성
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
