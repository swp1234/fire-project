# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-18 (세션72)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **68개** (projects/) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **404개** (EN 88, JA 58, ZH 49, ES 41, FR 26, PT 26, HI 22, RU 22, KO 20, ID 18, TR 18, DE 16) |

**앱 분류:** 유틸 12 / 바이럴 테스트 18 / 게임 **20** / 도구 12 / 웹 2 / 운세 2 / 신규 2

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | AdSense ca-pub-3600813755953882, 심사 중(2/8) |
| 분석 | GA4 523606964 + GSC `https://dopabrain.com/` (MCP 연동) |
| 크로스프로모 | 59앱, 라이트모드+a11y |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| 접근성 | skip-link 61앱, reduced-motion 61앱, 키보드 4게임 **(100%)** |
| 소셜 공유 | **62앱 (100%)** |
| 구조화 데이터 | JSON-LD 60/61앱 (98%+) |
| PWA/SW | pwa-install 13앱, SW network-first 28앱+ |
| 카테고리 허브 | Games(20), Tests, Tools, MBTI (4개 랜딩페이지) |
| MBTI Programmatic | **16/16 타입 페이지 완료** |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 454 URLs, .gitattributes 전체 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/mbti/` → `/road-shooter/`

---

## GSC 인덱싱 (2/12)

**Indexed 50/62 (81%)** | **Discovered 9:** minesweeper, flappy-bird, dev-quiz, qr-generator, lottery, color-palette, blood-type, routine-planner, todo-list | **Unknown 1:** brick-breaker

---

## GSC 주간 리뷰 (2/8~2/14)

| 지표 | 값 |
|------|-----|
| 주간 클릭 | **6건** |
| 주간 노출 | **~270건** |
| TOP 국가 | FR 4클릭(17%CTR) > JPN 1 > USA 1 |
| 클릭 페이지 | FR jeux-navigateur(3/12%/pos4.5), FR cerebral(1/20%/6.2), JA 2048(1/10%/7.5), EN valentine(1/25%/7.5) |
| 기회 | EN blood-type(32노출,pos53), EN free-games(20,pos4.6), idle-clicker(3,pos9.7) |

---

## 세션 기록

### 세션72 (2/18) - Road Shooter: 3D 원근도로 + 파워업 + UX 오버홀
- **3D 원근 도로**: road.js 전면 리라이트 — 소실점 기반 사다리꼴 도로, 수렴 차선, 수평 스크롤 스트라이프, 양쪽 건물 스카이라인
- **엔티티 깊이 스케일링**: drawScaled() — Y위치 기반 0.3~1.0 스케일 (도로 상단=작게, 하단=크게)
- **파워업 시스템 5종**: DMG+(+30%dmg,8s), SHIELD(5hit흡수), RAPID(2연발+반쿨,8s), MAGNET(아이템흡수,6s), NUKE(전적즉사)
- **게이트 다양화**: 기존3 + weapons(스나이퍼/폭격병) + power(DMG/SHIELD)
- **매끄러운 전환**: 세그먼트 전환 오버레이 제거, 게임플레이 중단 없음
- **항상-전투**: 도로 구간에도 적 스폰 + 분대 자동 사격
- **분대 하단 이동**: 0.75→0.85, 엘리트 확대(size35,hp25)
- ⚠️ **미해결**: 캔버스 왼쪽 치우침(cross-promo 숨기기 실패), 에셋 조악(동그라미), 3D 도로만 적용(X투영 없음)

### 세션71 (2/18) - Road Shooter: 사운드+화면흔들림+3번째보스+무한모드
- **사운드 시스템**: Web Audio API 절차적 생성, 13개 사운드 (슈팅/적피격/사망/아이템/게이트/보스/폭발/UI)
- **화면 흔들림(Screen Shake)**: 폭발, 보스 사망, 게임오버 시 강도별 진동 효과
- **해상도 수정**: devicePixelRatio 고해상도 캔버스 렌더링, CSS pixelated 제거
- **3번째 보스 Storm Colossus**: lightning(낙뢰 2줄기) + tornado(이동 회오리) + thunderstorm(8방향 탄+연속번개)
- **무한모드(Endless)**: 스테이지3 클리어 후 해금, 웨이브제 무한전투, 5웨이브마다 보스 순환, 하이스코어 저장
- **사운드 토글**: 메뉴 우상단 음소거 버튼, 설정 저장
- **i18n**: 무한모드 3개 키 12개 언어 추가

### 세션70 (2/18) - Road Shooter 심화: 업그레이드+보스+적+스테이지
- **업그레이드 샵**: 6개 영구 업그레이드 (시작분대/공격력/체력/속도/자석/골드), 골드 소비, 메뉴+결과에서 진입
- **신규 적 4종**: mortar(후방포격), detonator(자폭), thief(아이템도둑), flanker(측면돌격+사격)
- **2번째 보스 War Machine**: gatling(확산사격) + missiles(범위경고) + shield_rush(무적돌진), 스테이지별 교대
- **스테이지 선택**: 클리어한 스테이지 재플레이, 별점 표시, 좌우 화살표
- **캐릭터 다양화**: mercenary→랜덤타입, clonePod→탱커, conscription→혼합(라이플+탱커+스나이퍼+폭격)
- **HUD 분대 카운트**: 하단 실시간 분대 인원 표시
- **i18n**: 업그레이드 관련 9개 키 12개 언어 추가

### 세션69 (2/17) - Road Shooter MVP 구현 + 배포
- **68번째 프로젝트 `/road-shooter/`**: HTML5 Canvas 2D 분대 러너 슈터 32파일
- 도로 스크롤 → 아이템(5종) → 게이트(3종) → 전투(Rusher/Shooter) → 보스(Zombie Titan) → 결과

### 세션68 (2/17) - Road Shooter GDD v2 심화 설계
- 도로 아이템 47종, 무기 18종, 적 18+6+10종, 오리지널리티 섹션, GDD 1576줄

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 66-68 | 2/17 | i18n 전면수정, MBTI 16타입, Road Shooter GDD+MVP |
| 65 | 2/16 | 설날 특화 앱 3개 + Mental Age Test (67개 프로젝트) |
| 64 | 2/16 | 4개 카테고리 허브 + MBTI 매트릭스 |
| 59-63 | 2/15-16 | 다국어 블로그 +80개, SEO최적화, 내부링크 |
| 52-58 | 2/13-15 | UX개선 22앱, EN+32블로그, 소셜공유100%, a11y100% |
| 46-51 | 2/11-12 | JSON-LD, AdSense, GSC 37→50, SW+PWA, 크로스프로모 |
| 30-45 | 2/10-11 | i18n 전수, FOUC 60앱, 라이트모드, 게임 버그 |
| 1-29 | 2/4~10 | 앱 62개 개발, 포털, 도메인, 인프라 |

---

## 다음 우선순위

1. **Road Shooter 오버홀 (팀 에이전트)** — MEMORY.md 참조
   - 캔버스 센터링: cross-promo.js DOM 조사 → 확실히 숨기기
   - 캐릭터 에셋: 군인 스프라이트 (캔버스 픽셀아트)
   - 적 에셋: 적군 테마 통일 (좀비군인/드론/차량)
   - 3D 투영: X좌표도 소실점 수렴 + 총알/파티클 투영
   - 팀 에이전트 4개로 병렬 진행, 서로 검토/개선 반복
2. **주간 리뷰** - 2/15~2/21 데이터로 2/22(일) 실시
3. **신규 앱 인덱싱** - road-shooter, mental-age, seollal-fortune, sebatdon-calc, seollal-greetings + Discovered 9앱
4. **내부 링크 강화** - Discovered/미인덱싱 앱들에 블로그→앱 링크 추가
