# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-13 (세션152)

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
| 크로스프로모 | **101앱** 기본 + **22앱 관련 카드**(2x2 그리드) |
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

### 세션152 (3/13) - 수익 최적화: 22앱 크로스프로모 네트워크 구축

- **고바운스 앱 5종 결과페이지 강화** — emotion-iceberg·mbti-coffee·mbti-city·hsp-test·stress-check에 관련 테스트 카드(2x2) + 퍼센타일 소셜 증거 추가
- **고세션 게임 5종 크로스프로모** — flappy-bird·idle-clicker·stack-tower·emoji-merge·snake-game에 관련 게임 카드 추가
- **테스트 앱 7종 관련 테스트 카드** — eq-test·emotion-temp·social-battery·mbti-love·dark-core·brain-type·emotional-age·mental-age·iq-test·love-language에 패턴 적용
- **게임 2종 크로스프로모** — zigzag-runner·block-puzzle에 관련 게임 카드 추가
- **인라인 SEO 링크 교체** — 기존 inline-style 관련앱 섹션 → 정형화된 2x2 그리드 카드 (i18n 12개 언어)

### 세션151 (3/13) - 게임 10종 대규모 폴리시 (자율 10세션)

- RS Phase 4+5, 게임 신기능 4종, 폴리시 6종, 애니메이션 강화 2종

### 세션150 (3/13) - i18n 하드코딩 전수조사 + 대규모 수정 (40+ 앱)

### 이전 세션 (~149)

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 148-149 | 3/13 | Road Shooter 리디자인 시작(무기+AI스프라이트), 게임 폴리시 4종 |
| 143-147 | 3/11-13 | Teams 통합, 게임 시각 고도화, emoji-merge 힌트, block-puzzle 3D |
| 133-142 | 3/10 | Brick Breaker, SEO 내부링크 95/95, GameAchievements, 게임 시스템 |
| 104-134 | 3/9-10 | 인프라 자동화, 쿠키커터 24개, 신규앱 4개, 도파민피드백 21/21, SFX |
| 1-103 | 2/4-22 | 앱96개, 포털, RS 3D, i18n, MBTI16, 블로그600+, AdSense |

---

## 다음 우선순위

1. **크로스프로모 확장** — 나머지 ~70앱에도 관련 카드 패턴 적용 (배치 자동화)
2. **바운스율/세션 모니터링** — 22앱 크로스프로모 효과 측정 (3/14~)
3. **Road Shooter Phase 6** — 보스 AI 스프라이트, 승리/패배 연출 강화
4. **Organic 가속** — hsp-test/stress-check SEO 반영 확인, mbti-love pos8 추적
5. **게임 폴리시 추가** — brick-breaker 파워업 확장, sky-runner 시각 피드백
