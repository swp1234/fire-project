# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-03-09 (세션104)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **96개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **442개** (EN 108, JA 58, ZH 50, ES 45, FR 29, PT 31, HI 28, RU 26, KO 24, ID 22, TR 23, DE 18) |

**앱 분류:** 유틸 12 / 바이럴 테스트 **42** / 게임 **21** / 도구 12 / 웹 2 / 운세 **4** / 신규 2

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
| 서브모듈 | **72/73** (tree→submodule 12개 변환 완료, _common만 tree) |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 785 URLs, .gitattributes 전체 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/mbti/` → `/road-shooter/`

---

## GSC 인덱싱 (3/9 업데이트)

**Indexed 60/62 (97%)** | 이전 미색인 10개 모두 indexed | **Unknown 6 (신규앱):** dark-core, soul-age, pick-me, emotional-age, villain-origin, ick-factor → 사이트맵 추가 완료, 색인 대기

---

## 휴가 기간 리뷰 (2/22~3/8, 15일 공백)

| 지표 | 2/22~3/8 (15일) | 이전 주 (2/15~21) | 비고 |
|------|-----------------|-------------------|------|
| 사용자 | **~79명** (일 ~5명) | 359명 (일 ~51명) | 프로모션 부재 효과 |
| PV | **232** | 750 | |
| TOP 국가 | **Russia(17)**, US(15), Armenia/Canada/DE(5) | US(174) | 러시아 자연유입 증가 |
| TOP 앱 | stack-tower(12), color-personality(10), emoji-merge(10) | social-battery, luck-meter | 게임↑ |
| 채널 | Direct 67%, **Organic 32%** | Direct 97%, Organic <1% | **Organic 급성장** |
| GSC | 1클릭/55노출 | 1클릭/11노출 | 노출 5배↑ |
| 인사이트 | 콘텐츠 업데이트 없이도 Organic 자연 성장, 블로그 4편 pos1~7 진입 | | |

---

## 세션 기록

### 세션106 (3/9) - 복귀 리뷰 + 쿠키커터 리디자인 5개 + SEO + 인덱싱
- **2주 공백 복귀**: GA4/GSC 전면 리뷰 — Organic 32% 성장 (이전 <1%), 일평균 5명 자연유입
- **블로그 SEO**: 10개 포스트 title/meta CTR 최적화, 깨진 링크 9+2개 수정, 고아 ru/ru 리다이렉트 제거
- **GSC 인덱싱**: 이전 미색인 10개 모두 indexed 확인, 신규 6개+19개 사이트맵 추가
- **소셜 트렌드**: Reddit/Twitter/TikTok 스캔 — MBTI×라이프스타일 메타포, 개인데이터 계산기, 뇌다양성 트렌드 확인
- **쿠키커터 리디자인 5개 완료**:
  - **color-personality**: 4지선다 → **컬러 믹싱 랩** (3단계 색 선택+조합, 고유 HEX 생성)
  - **brain-type**: 4지선다 → **뇌 경로 스캐너** (10개 3초 타이머 바이너리, SVG 뇌 시각화)
  - **toxic-trait**: 4지선다 → **문자 메시지 재판** (8개 채팅+4개 SNS 반응, 독성도 미터)
  - **animal-personality**: 4지선다 → **야생 생존 여행** (4바이옴 선택+6 생존 시나리오)
  - **past-life**: 4지선다 → **시간 포탈 여행** (6개 역사 시대 바이너리, 시대별 CSS 테마)
- 총 리디자인: **13/~20개 완료** (이번 세션 +5)

### 세션105 (3/9) - 인프라 자동화 + Claude Code 최적화 + 전앱 OG/SW/MD 정리
- **Claude Code 최적화**: agents 5개, rules 3개, hooks, skills, statusline 워크트리 표시
- **문서 정리**: CLAUDE.md/OPERATIONS.md/STRATEGY.md 최신화, MEMORY.md 구조 개선, permissions 256→71
- **앱 템플릿**: `_common/template/` 8파일 (index.html, CSS, i18n, SW, manifest 등)
- **자동화 스크립트**: `_common/generate-og-image.js`, `_common/update-sitemap.sh`
- **전앱 일괄 작업**: OG image 91앱, SW 18앱 추가(93/94), 불필요 MD 31개 삭제
- **전체 서브모듈 commit & push 완료** (92개)

### 세션104 (3/9) - GSC 문제 전면 수정 (구조화데이터 + 404 + 색인)
- **리뷰 스니펫 오류 수정**: kpop-position, reaction-test, work-style — `@type: Quiz` → `SoftwareApplication`
- **404 대량 정리**: 블로그 사이트맵 깨진 URL 11개 매핑, 내부 링크 21종 ~643건 수정, tools 푸터 링크 수정
- **리디렉션 정리**: `blog/ru/ru/` 중복 디렉토리 삭제
- **크롤링-미색인 대응**: 블로그 12개 언어 인덱스에 hreflang 상호참조 추가, 프라이버시 정책 11개 noindex 추가
- **사이트맵 재제출**: 3개 사이트맵 GSC 제출 (785 URLs)

### 세션103 (2/22) - 쿠키커터 리디자인 2개 (hsp-test, future-self)
- **hsp-test 리디자인**: 4지선다 → **감각 과부하 시뮬레이터** (5개 감각 카테고리 × 4단계 강도, 한계점 도달 시 탭)
- **future-self 리디자인**: 12문항 퀴즈 → **하루 스토리 카드** (새벽~심야 8개 순간, 시간대별 하늘 그라데이션 배경)
- 두 앱 모두 12개 언어 완전 번역, quiz-data.js 삭제, 고유 메카닉 적용
- 사용한 메카닉: 감각과부하 임계점(hsp-test), 시간진행 내러티브(future-self)

### 세션102 (2/22) - 쿠키커터 리디자인 2개 (attachment-style, social-battery)
- **소셜 트렌드 스캔**: Reddit/Twitter/TikTok MCP 활용 — "personality guide + bias" 실시간 바이럴 확인
- **쿠키커터 앱 전수 분석**: 26개 4지선다 퀴즈 패턴 앱 식별 (리디자인 6개 완료, 20개 남음)
- **attachment-style 리디자인**: 4지선다 → **채팅 시뮬레이터** (가짜 메시지 앱 UI, 10개 연인 대화 시나리오)
- **social-battery 리디자인**: Likert 스케일 → **실시간 배터리 대시보드** (12 시나리오 ⚡/🪫 바이너리 선택, 배터리 실시간 변화)
- 두 앱 모두 12개 언어 완전 번역, i18n/GA4/AdSense/cross-promo 유지

### 세션101 (2/22) - 주간 리뷰 + MCP 5개 추가 (소셜 트렌드 모니터링)
- **주간 리뷰 완료**: 2/15-21 vs 2/8-14 비교 — PV+16%, 참여도(PV/세션)+46%, Organic 여전히 <1%
- **MCP 5개 신규 등록**: Reddit(무료), Twitter(RapidAPI), YouTube(Google API), Trends(TikTok+Instagram+YouTube 트렌딩)
- Twitter MCP: `twitter154` 404 → `twitter-api45`로 코드 수정, 응답 포맷 매핑 재작성
- Trends MCP: uv 한글경로 인코딩 에러 → pip 직접 설치 + mcp CLI로 전환

### 세션100 (2/22) - 차별화 메카닉 앱 3개 + 인프라 정리 + CLAUDE.md 개선
- CLAUDE.md 대폭 개선(insights 기반), 인프라 정리(고아 `portal/` 삭제)
- **emotional-age**: 시나리오 슬라이더(10상황×0-100), **villain-origin**: 이진 래피드파이어(16쌍), **ick-factor**: 스와이프 카드(20장)
- 기존 테스트 전수 감사: ~30개 쿠키커터 확인 → 4개 리디자인(mental-age/love-language/stress-type/eq-test)

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 96-99 | 2/20-21 | 버그수정12+, 라이트모드10앱, 바이럴앱9개(dark-core~ick-factor), AdSense전수, 내부링크 |
| 91-95 | 2/19-20 | 바이럴앱6개, color-blindness, tree→sub 12개, zodiac SEO, 포털 i18n |
| 83-90 | 2/19 | GSC 404(68개), 블로그50개, RS폴리시, i18n 3라운드 |
| 59-82 | 2/15-19 | RS MVP→3D, i18n전면, MBTI16, 설날, 블로그+80, 카테고리허브, AdSense |
| 1-58 | 2/4-15 | 앱62개, 포털, JSON-LD, a11y100%, UX개선 |

---

## 다음 우선순위

1. **쿠키커터 리디자인 잔여** — ~7개 (sleep-animal, kpop-position, villain-type, work-style + 미검증 3~4개)
2. **소셜 트렌드 기반 신규 앱** — "MBTI×라이프스타일 메타포"(커피/OS/도시), "Your Life in Numbers" 계산기, "감정 빙산" 등
3. **Organic 가속** — 블로그 SEO 최적화 효과 추적, 고볼륨 키워드 타겟 콘텐츠
4. **GSC 재확인** — 세션104/106 수정사항 반영 확인 (1~2주 후)
5. **Road Shooter 폴리시**
