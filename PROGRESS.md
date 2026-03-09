# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-10 (세션108)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **98개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **454개** (EN 109, JA 59, ZH 51, ES 46, FR 30, PT 32, HI 29, RU 27, KO 25, ID 23, TR 24, DE 19) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **43** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 3

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료(2/20)** ca-pub-3600813755953882 — 전앱 스크립트 확인완료(83/83) |
| 분석 | GA4 + GSC + **Reddit + Twitter + YouTube + Trends(TikTok/IG)** MCP 7개 연동 |
| 크로스프로모 | 61앱, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+), Quiz→SoftwareApplication 3앱 수정 |
| PWA/SW | pwa-install 13앱, SW network-first **93/94앱** |
| 카테고리 허브 | Games(20), Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** |
| 서브모듈 | **73/74** (_common만 tree) |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 785 URLs, .gitattributes 전체 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/mbti/` → `/road-shooter/`

---

## GSC 인덱싱 (3/9 업데이트)

**Indexed 60/62 (97%)** | 이전 미색인 10개 모두 indexed | **Unknown 7+1:** dark-core, soul-age, pick-me, emotional-age, villain-origin, ick-factor, life-in-numbers, emotion-iceberg — 사이트맵 등록 완료, 크롤링 대기

---

## 세션 기록

### 세션108 (3/10) - 신규 앱 + 블로그 12개 언어 + SEO 강화
- **GA4/GSC 분석**: Organic 55%(32%→55%↑), 블로그 pos 7~10 근접, 0 clicks/33 imp
- **신규 앱**: **emotion-iceberg** (감정 빙산 테스트) — 10 시나리오×2단계 답변, 6 결과유형, SVG 빙산 시각화, 12개 언어
- **life-in-numbers 블로그**: 12개 언어 SEO 블로그 생성 + 사이트맵/인덱스 업데이트
- **고성과 블로그 내부링크 강화**: digital-detox (pos7), numerology (pos10) — 앱 링크 섹션 추가
- **사이트맵**: life-in-numbers + emotion-iceberg URL 추가

### 세션107 (3/10) - 쿠키커터 리디자인 완료 + 신규 앱 + 트렌드 스캔
- **루트 정리**: 미커밋 파일 64개 일괄 정리 (CLAUDE.md, PROGRESS.md, docs/*, _common/ 추가, .gitignore 수정, 57개 서브모듈 포인터, data-check-log.md 루트 삭제)
- **쿠키커터 리디자인 8개 완료** (전체 완료!):
  - **sleep-animal**: 4지선다 → **수면 타임라인 빌더** (24시간 원형 시계 SVG, 활동 배치)
  - **npc-test**: 4지선다 → **RPG 대화 트리** (레트로 대화창, 타이핑 효과, NPC 반응)
  - **delulu-score**: 4지선다 → **현실왜곡 필터** (현실 vs 내 해석 이중 카드, 왜곡도 게이지)
  - **brainrot-score**: 4지선다 → **스크롤 중독 시뮬** (가짜 소셜 피드, 반응+속도 측정)
  - **rizz-score**: 4지선다 → **매력 오디션 스테이지** (3인 심사위원, 실시간 점수판)
  - **pick-me**: 4지선다 → **SNS 댓글 시뮬레이터** (가짜 포스트, 댓글/좋아요/무시)
  - **dark-core**: 4지선다 → **도덕 딜레마 저울** (양팔 저울 UI, 4특성 레이더 차트)
  - **aura-score**: 4지선다 → **오라 필드 스캐너** (7차크라 SVG, 터치→질문→시각화)
- **총 리디자인: 24개 완료** — 쿠키커터 패턴 전면 제거
- **신규 앱**: **life-in-numbers** (생년월일→14개 인생 통계, 카운트업 애니메이션, 별 배경)
- **소셜 트렌드 스캔**: Reddit/Twitter — 인터랙티브 시뮬레이터 트렌드, 푸망 MBTI 바이럴(125K views)

### 세션106 (3/9) - 복귀 리뷰 + 쿠키커터 리디자인 5개 + SEO + 인덱싱
- 2주 공백 복귀, Organic 32% 성장, 블로그 SEO, GSC 인덱싱, 소셜 트렌드
- 리디자인 5개: color-personality, brain-type, toxic-trait, animal-personality, past-life

### 세션105 (3/9) - 인프라 자동화 + Claude Code 최적화
- agents 5개, rules 3개, hooks, skills, `_common/template/`, 전앱 OG/SW/MD 정리

### 세션104 (3/9) - GSC 문제 전면 수정
- 구조화데이터 3앱 수정, 404 대량 정리, 사이트맵 재제출

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 100-103 | 2/22 | 쿠키커터 리디자인 7개, MCP 5개 추가, 주간 리뷰, 인프라 정리 |
| 96-99 | 2/20-21 | 버그수정12+, 라이트모드10앱, 바이럴앱9개, AdSense전수, 내부링크 |
| 91-95 | 2/19-20 | 바이럴앱6개, color-blindness, tree→sub 12개, zodiac SEO, 포털 i18n |
| 83-90 | 2/19 | GSC 404(68개), 블로그50개, RS폴리시, i18n 3라운드 |
| 59-82 | 2/15-19 | RS MVP→3D, i18n전면, MBTI16, 설날, 블로그+80, 카테고리허브, AdSense |
| 1-58 | 2/4-15 | 앱62개, 포털, JSON-LD, a11y100%, UX개선 |

---

## 다음 우선순위

1. **emotion-iceberg 블로그** — 12개 언어 SEO 블로그 생성
2. **소셜 트렌드 기반 신규 앱** — "MBTI×라이프스타일 메타포"(커피/OS/도시) 등
3. **Organic 가속** — 블로그 pos 7~10 → top 5 진입 추적, hsp-test/stress-check 보조 블로그
4. **GSC 재확인** — 세션104~108 수정사항 반영 확인 (1~2주 후)
5. **Road Shooter 폴리시**
