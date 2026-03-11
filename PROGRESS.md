# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-11 (세션145)

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
| 수익화 | **AdSense 승인완료(2/20)** ca-pub-3600813755953882 — 전앱 스크립트 확인완료(83/83) |
| 분석 | GA4 + GSC + **Reddit + Twitter + YouTube + Trends(TikTok/IG) + Gemini(mnthe/gemini-mcp-server)** MCP 8개 연동 |
| 크로스프로모 | **101앱**, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 전앱 완료, aggregateRating+publisher 강화 완료 |
| PWA/SW | pwa-install 13앱, SW 등록 완료 **전앱** |
| 카테고리 허브 | Games(21), Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** |
| 서브모듈 | **73/74** (_common만 tree) |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 785 URLs, .gitattributes 전체 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/mbti/` → `/road-shooter/`

---

## GSC 인덱싱 (3/9 업데이트)

**Indexed 60/62 (97%)** | 이전 미색인 10개 모두 indexed | **Unknown 7+3:** dark-core, soul-age, pick-me, emotional-age, villain-origin, ick-factor, life-in-numbers, emotion-iceberg, mbti-coffee, mbti-city — 사이트맵 등록 완료, 크롤링 대기

---

## 세션 기록

### 세션145 (3/11) - 게임 5종 시각 고도화
- **zigzag-runner**: 타일 크럼블(지나간 타일 파편 떨어짐) + 착지 펄스 이펙트 + 고속 스피드 라인
- **brick-breaker**: 3D 벽돌 렌더링(그라디언트+광택+엣지 하이라이트) + 파워업 아이콘 표시
- **stack-tower**: 타워 흔들림 물리(높이 비례 사인파 스웨이) + 층수 진행 바 (우측)
- **maze-runner**: 벽 돌 질감(셀별 색상 변화 + 벽돌 패턴)
- **flappy-bird**: 코인 3D 스피닝 이펙트(엣지 링 + 하이라이트 이동)

### 세션144 (3/11) - Teams 통합 + Nano Banana 에셋 + 게임 고도화
- **Claude Teams 통합** — 6개 에이전트 Teams Protocol, `/team` 스킬 4개 템플릿
- **Gemini MCP 가이드 적용** — cmd→npx, IMAGE_OUTPUT_DIR, NanoBanana 별칭
- **Nano Banana 에셋 대량 생성 (54개)**
  - P1 OG 31개 + P2 배경 8개 + P3 스프라이트 15개 — 전부 push
- **게임 전수 에셋 감사** — 21개 감사, 보고서 `.claude/asset-audit-report.md`
- **게임 고도화**
  - emoji-merge: 힌트 시스템(💡 버튼 + H키, 쿨다운) + 이모지 파티클 버스트
  - block-puzzle: 3D 블록 렌더링(하이라이트+그림자+광택) + 고스트피스 채우기 + 라인클리어 파편 파티클

### 이전 세션 (~143)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 143-144 | 3/11 | Gemini MCP 재설정, Teams 통합, Nano Banana 에셋 54개, emoji-merge 힌트+파티클, block-puzzle 3D렌더링 |
| 140-142 | 3/10 | Minesweeper 코드클릭, Word Guess 스코어링, Maze Runner 순찰적, Block Puzzle 고스트피스 |
| 133-139 | 3/10 | Brick Breaker 폭발브릭, SEO 내부링크 95/95, GameAchievements, Flappy/Pong/RS 고도화 |
| 125-134 | 3/10 | 도파민피드백 21/21, Snake 파워업, typing-speed HUD, RS 적+보스, SFX 21/21, English-first 96앱 |
| 118-124 | 3/10 | 에셋/온보딩/업적/Monetization 완성, 크로스프로모 101앱 |
| 104-110 | 3/9-10 | 복귀+인프라 자동화, 쿠키커터 24개, 신규앱 4개 |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **Organic 가속** — 블로그 pos 7~10 → top 5 진입 추적, ~~내부링크 강화~~ ✅ 95/95 완료
2. **GSC 재확인** — 세션104~119 수정사항 반영 확인 (1~2주 후)
3. **기존 앱 품질 개선** — Stop Criteria 기반 성과 점검 후 저성과 앱 개선/정리
4. **Road Shooter 추가 폴리시** — ~~스킨, 랭킹, 새 보스, 새 적~~ ✅ → ~~5번째 보스~~ ✅ → 밸런스 미세조정, 추가 콘텐츠
5. **신규 게임/앱** — 트렌드 기반 실험 (10% 할당)
