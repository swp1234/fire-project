# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-13 (세션146)

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

### 세션146 (3/13) - 하네스 엔지니어링 + 게임 3종 폴리시 + MCP 가이드

- **하네스 엔지니어링 감사** — 6개 소스 기반 감사, `docs/HARNESS-AUDIT.md` 작성
  - pre-push quality gate 훅 (97서브모듈), failure logging (JSONL+분석), MEMORY.md/OPERATIONS.md 중복 제거
- **바운스율 개선** — emotion-iceberg/mbti-coffee/mbti-city: 소셜프루프 배지+시간예상+i18n 로더 타이밍 수정
- **color-memory** — 3-라이프 시스템 + 3색 시작 (3.6초 세션 문제 해결)
- **puzzle-2048** — 머지 파티클 버스트 + 128+ 타일 글로우 + 이동 카운터 + 게임오버 상세 스탯
- **memory-card** — 3-라이프 시스템 (긴장감 추가, 미스매치 시 생명 소모)
- **reaction-test** — 챌린지 모드 (20라운드 지속, 점진적 난이도)
- **AI 배경 생성** — NanoBanana(gemini-3.1-flash)로 3개 게임 배경 생성 및 적용
- **hsp-test SEO** — 메타 최적화 (pos 95 → top 50 타겟)
- **Gemini MCP 가이드 적용** — gemini-2.5-flash/flash-image, ADC 인증, on-demand 패턴

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

1. **게임 폴리시 계속** — number-puzzle(2048 중복?), idle-clicker, sky-runner 등 저참여 게임 개선
2. **Organic 가속** — 블로그 pos 7~10 → top 5 진입 추적
3. **GSC 재확인** — 세션104~146 수정사항 반영 확인
4. **NanoBanana 에셋 추가** — quota 회복 후 나머지 게임 배경/스프라이트 생성
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
