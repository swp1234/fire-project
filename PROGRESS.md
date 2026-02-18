# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-02-18 (세션76)

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

### 세션76 (2/18) - Road Shooter 자동 크로스리뷰 4라운드 (버그+시각 품질 9/10 달성)
- **병렬 크로스리뷰 시스템**: 버그탐지 + 3D에셋 품질 에이전트 4라운드 반복 (5/10→9/10)
- **쉴드 실효화 수정**: `checkEnemyBulletHits(squad, particles, shieldCharges)` → `{losses, shieldUsed}` 반환, 실제 피해 차단
- **업그레이드 전파 완성**: baseHP→Character생성자, moveSpeed→squad.moveTo(speedMul), magnetRange→흡수반경 배율
- **Endless 모드 대규모 수정**: 버프시스템(dmg/shield/fireRate/magnet), 3D drawScaled 렌더링, 가중치 아이템 스폰, 전투 쿨다운중에도 활성화
- **보스 스케일 수정**: targetY 80→300 (0.5x 스케일), drawEffects() 분리 (이펙트 왜곡 방지)
- **프레임 독립 타이머**: 아이템/게이트 스폰 frame→dt 기반, quicksand setTimeout→인게임 타이머

### 세션73-75 (2/18) - Road Shooter 오버홀: 센터링+군인스프라이트+3D투영+볼류메트릭+i18n
- **센터링**: cross-promo 제거, 캔버스 풀스크린
- **캐릭터 4타입**: Rifleman/Tanker/Sniper/Bomber 군인 실루엣 → 3D 볼류메트릭 (그래디언트+스펙큘러)
- **적 7종**: Rusher~Elite 군사유닛 → 궤도셰이딩+림라이팅+그라운드섀도
- **보스 3종+아이템**: 리액터글로우, 전기아크, 구체그래디언트, 유리반사
- **3D X투영**: `road.projectX()` + `unprojectX()` — 전 엔티티 소실점 수렴
- **피격 정확도**: 7종 적별 리드 예측, 아이템 이중 충돌 체크 (분대48px+멤버34px)
- **i18n 완전검수**: 7키 × 12언어, HUD 하드코딩 전부 교체

### 이전 세션

| 세션 | 날짜 | 주요 작업 |
|------|------|----------|
| 72 | 2/18 | 3D 원근도로, 파워업 5종, 게이트다양화, 항상-전투 |
| 71 | 2/18 | 사운드 13종, 화면흔들림, 3번째보스, 무한모드 |
| 70 | 2/18 | 업그레이드샵 6종, 적 4종 추가, 2번째보스, 스테이지선택 |
| 68-69 | 2/17 | Road Shooter GDD+MVP (68번째 프로젝트) |
| 65-67 | 2/16-17 | i18n 전면수정, MBTI 16타입, 설날앱 3개 |
| 59-64 | 2/15-16 | 블로그+80, 카테고리허브 4개, SEO최적화 |
| 46-58 | 2/11-15 | JSON-LD, AdSense, 소셜공유100%, a11y100%, UX개선 |
| 1-45 | 2/4~11 | 앱 62개 개발, 포털, 인프라, i18n 전수, 라이트모드 |

---

## 다음 우선순위

1. **주간 리뷰** - 2/15~2/21 데이터로 2/22(일) 실시
2. **EN free-games CTR 최적화** — 20노출 pos4.6 0클릭 → Meta Title/Description 개선
3. **신규 앱 인덱싱** - road-shooter, mental-age, seollal-fortune, sebatdon-calc, seollal-greetings
4. **내부 링크 강화** - Discovered/미인덱싱 앱들에 블로그→앱 링크 추가
