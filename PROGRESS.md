# DopaBrain 현재 상태

Updated: 2026-09-05 KST

이 파일은 현재 운영 판단만 유지한다. 상세 수치와 변경 이력은 `memory/data-check-log.md`, 검증 규칙은 `docs/VALIDATION.md`, 반복 절차는 `dopabrain-growth-ops` skill에 둔다.

## 목표와 최우선 병목

- 1차 목표: 완료된 최근 7일 AdSense 수익 `$1.40`, 즉 `$0.20/day`.
- 현재 7일(2026-08-29~09-04): `$0.63 / 2,115 PV / 644 impressions / 14 clicks`, `$0.090/day`.
- 최근 30일: `$3.19`, 평균 `$0.106/day`.
- 2026-09-03 시작된 무효 트래픽 광고 게재 제한이 현재 최우선 병목이다.

## 광고 안전 상태

- API 경보는 `SEVERE / adsense-traffic-throttled`이며 정책 이슈 목록은 비어 있다.
- 신규 유입 실험, 광고 배치 실험, IndexNow, GSC 수동 제출은 제한 해제 전까지 중단한다.
- 상호작용 페이지의 수동 광고·보상형 광고·가짜 unlock·합성 광고 이벤트를 한 제품씩 격리한다.
- 오늘 AdSense 상태는 이미 확인했으므로 다음 완료일 전에는 재조회하지 않는다.

## 최신 배포: Color Memory 광고 위험 격리

- 56일 실데이터는 `30 PV / 30 users / 30 sessions / 25 engaged / 477s`였다. Singapore desktop Direct가 `27 PV / 27 sessions / 24 engaged / 388s`로 대부분을 차지했다. Organic은 Japan desktop 1회/13초뿐이고 Search Console exact-page 행은 없었다.
- 유효 제품 신호는 `game_start` 사용자 1명뿐이었다. 기존 `page_engage`, `traffic_quality_*`, `cross_promo_view`는 제품 사용이나 수익 개선의 근거로 사용하지 않는다.
- 하위 저장소 `37181cf`, Pages `33910357761`을 배포했다.
- Simon형 게임, 3 lives, 진행형 라운드, 튜토리얼, 로컬 리더보드, 12개 언어, 4개 관련 경로는 유지했다. Auto Ads, 수동 광고 2개와 push, 전면/보상형 게임 광고, DailyStreak/Achievements, 가짜 `4.2/1,340` 평점, 합성 계측, 중복 공유와 일반 추천은 제거했다.
- 계측은 private exact-once `color_memory_view -> color_memory_start -> color_memory_progress -> color_memory_complete -> color_memory_share / color_memory_related_click`로 제한했다. 점수·라운드·URL 같은 개인 결과는 보내지 않는다.
- 실제 터치 한 번에 `touchstart`와 `click`이 모두 실행되어 입력이 두 번 들어가던 결함을 수정했다. 서비스워커와 manifest는 `/color-memory/` 범위로 제한했고 미사용 자산 약 102 KB를 삭제했다.

## 검증 상태

- Color Memory 전용: 17/17 변이 검출, 12개 locale, 로컬·프로덕션 390/1440px 실제 touch -> 진행 -> 강제 종료 -> 재시작 -> 공유 -> 중첩 관련 링크 통과.
- 공통 AdSense 계약: 11/11 변이 통과. 중단 페이지의 광고 로더는 0개다.
- 광고 위험 인벤토리: `critical 10`, `high 40`, `medium 6`, `info 52`, `clean 11`.
- 전체 하네스 `2026-09-04T19-26-35-273Z`: 162/162 통과, analytics 9/9, runtime 6/6, submitted inventory 63/0.
- 첫 전체 실행은 기존 Flappy의 실제 44px 높이가 Chromium에서 `43.999938...px`로 측정되어 실패했다. 소스의 40px 회귀는 계속 잡되 렌더링 경계만 `43.99px`로 보정했고 Flappy 18/18을 재검증했다.
- 사용자 파일 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 건드리지 않는다.

## 다음 실행 순서

1. 남은 critical 후보를 유효 Organic·실제 행동·구현 위험으로 다시 비교한다. Number Puzzle의 36 starts, Emoji Merge의 completion 1건, Word Guess의 Organic 4 sessions/577s는 보호 신호다.
2. 보호 신호가 약한 Road Shooter, Word Scramble, Snake, Stack, Zigzag, Brick Breaker부터 exact-route GA4/GSC로 비교한다.
3. 선택한 한 제품에서 광고·보상·허위 증거만 격리하고 실제 검색/게임 경로는 유지하거나 개선한다.
4. 전용 변이·실제 여정·전체 하네스·하위 저장소·Pages·프로덕션 순으로 배포한다.
5. 최신 영화·게임·밈·트렌드는 공식 출처와 지속 검색 의도가 확인되고 기존 실험보다 뚜렷한 상호작용 가설이 있을 때만 한 건씩 실험한다. 광고 제한 중에는 트래픽 우회 수단으로 쓰지 않는다.

## 관찰 규칙

- 배포일은 비교에서 제외하고 완료된 KST 날짜만 본다.
- Singapore desktop Direct 스캔, 비정상 국가 클릭 집중, Direct/Unassigned는 기존 합성 이벤트와 분리한다.
- 제품별 20 qualified views 전에는 `DISCOVERY_HOLD`다.
- 광고 제한 중 수익 감소를 콘텐츠 실패로 판정하지 않는다. 제한 해제 후 동일 완료일 창에서 수익을 재평가한다.
