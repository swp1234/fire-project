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

## 최신 배포: Word Scramble 제품군 퇴출

- 앱의 56일 실데이터는 `21 PV / 21 users / 21 sessions / 7 engaged / 178s`였다. Singapore desktop Direct가 `19 PV / 19 sessions / 6 engaged / 102s`였고 나머지도 China/Iran Direct였다. Organic과 Search Console exact-page 행은 0이었다.
- `game_start` 코드가 있었지만 실제 행동 이벤트는 하나도 없었다. 전용 영문 가이드도 같은 기간 GA4·GSC가 모두 0이고 이미 `noindex`였다.
- Word Scramble 저장소 `39bad7b`, Pages `33913065844`; Portal `e9002ee`, Pages `33913178750`을 배포했다.
- 앱은 4파일·1.35KB `noindex,follow` 스텁으로 줄여 유효 Organic 신호가 있는 `/word-guess/`로 보낸다. 기존 캐시만 지우고 해제하는 서비스워커 외에 게임 코드·12 locale·광고·보상·가짜 AI 분석·합성 계측·이미지를 포함한 5,138줄과 바이너리 2개를 제거했다.
- 35KB 전용 가이드는 817B redirect로 바꾸고 Portal 카탈로그·게임 허브·brain-game-workout·관련 문서에서 Word Scramble 홍보를 제거하거나 Word Guess/Typing Speed로 교체했다.

## 검증 상태

- Word Scramble 전용: 13/13 변이 검출, 로컬·프로덕션 390/1440px 앱 -> Word Guess와 가이드 -> Word Guess 가이드 통과.
- 공통 AdSense 계약: 11/11 변이 통과. 중단 페이지의 광고 로더는 0개다.
- 광고 위험 인벤토리: `critical 9`, `high 40`, `medium 6`, `info 52`, `clean 12`.
- 블로그 포커스: indexable 173 유지, redirect 208, focused noindex 1,597. 제출 인벤토리는 63/0이다.
- 전체 하네스 `2026-09-04T19-51-13-951Z`: 165/165 통과, analytics 9/9, runtime 6/6.
- 사용자 파일 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 건드리지 않는다.

## 다음 실행 순서

1. 남은 critical 후보를 유효 Organic·실제 행동·구현 위험으로 다시 비교한다. Number Puzzle의 36 starts, Emoji Merge의 completion 1건, Word Guess의 Organic 4 sessions/577s는 보호 신호다.
2. 보호 신호가 약한 Road Shooter, Snake, Stack, Zigzag, Brick Breaker부터 exact-route GA4/GSC로 비교한다.
3. 선택한 한 제품에서 광고·보상·허위 증거만 격리하고 실제 검색/게임 경로는 유지하거나 개선한다.
4. 전용 변이·실제 여정·전체 하네스·하위 저장소·Pages·프로덕션 순으로 배포한다.
5. 최신 영화·게임·밈·트렌드는 공식 출처와 지속 검색 의도가 확인되고 기존 실험보다 뚜렷한 상호작용 가설이 있을 때만 한 건씩 실험한다. 광고 제한 중에는 트래픽 우회 수단으로 쓰지 않는다.

## 관찰 규칙

- 배포일은 비교에서 제외하고 완료된 KST 날짜만 본다.
- Singapore desktop Direct 스캔, 비정상 국가 클릭 집중, Direct/Unassigned는 기존 합성 이벤트와 분리한다.
- 제품별 20 qualified views 전에는 `DISCOVERY_HOLD`다.
- 광고 제한 중 수익 감소를 콘텐츠 실패로 판정하지 않는다. 제한 해제 후 동일 완료일 창에서 수익을 재평가한다.
