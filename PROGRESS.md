# DopaBrain 현재 상태

Updated: 2026-09-05 KST

이 파일은 현재 운영 상태와 다음 판단만 유지한다. 상세 수치와 과거 변경은 `memory/data-check-log.md`, 검증 규칙은 `docs/VALIDATION.md`, 반복 절차는 `dopabrain-growth-ops` skill이 기준이다.

## 목표와 최우선 병목

- 1차 목표: 완료된 최근 7일 AdSense 수익 `$1.40`, 즉 `$0.20/day`.
- 현재 7일(2026-08-29~09-04): `$0.63 / 2,115 PV / 644 impressions / 14 clicks`, `$0.090/day`.
- 최근 30일: `$3.19`, 평균 `$0.106/day`.
- 2026-09-03 시작된 무효 트래픽 광고 게재 제한이 현재 최우선 병목이다.

## 광고 안전 상태

- API 경보는 `SEVERE / adsense-traffic-throttled`이며 정책 이슈 목록은 비어 있다.
- 신규 유입 확대, 광고 배치 실험, IndexNow, GSC 재제출은 제한 해제 전까지 중단한다.
- 상호작용 페이지의 수동 광고·보상형 광고·가짜 unlock·합성 광고 이벤트를 한 번에 한 제품씩 격리한다.
- 오늘 AdSense 상태는 이미 확인했으므로 다음 완료일 전에는 재조회하지 않는다.

## 최신 배포: Memory Card 광고 위험 격리

- 실데이터 56일: `35 PV / 34 users`. Singapore desktop Direct가 `28 PV / 28 sessions / 23 engaged / 483s`를 차지했다. Organic은 China Bing 1회·4초뿐이었고 Search Console 행과 실제 시작/완료 행동은 없었다.
- 하위 저장소 `8667aca`, Pages `33906637827`이 배포됐다.
- 게임·4개 테마·단계 진행·로컬 리더보드·12개 언어·4개 관련 경로는 유지했다. Auto Ads, 수동 광고 2개, 전면/보상형 광고, 가짜 `4.5/2,650` 평점, 합성 참여 계측, 중복 공유 UI와 일반 cross-promo는 제거했다.
- 계측은 private exact-once `memory_card_view -> memory_card_start -> memory_card_progress -> memory_card_complete -> memory_card_share / memory_card_related_click`로 제한했다. 점수·결과·시간·URL은 보내지 않는다.
- 서비스워커와 manifest를 `/memory-card/`에 한정했다. 실제 모바일 여정에서 발견한 40px 버튼 터치 영역은 44px로 수정했다.

## 검증 상태

- Memory Card 전용: 19/19 변이, 12개 locale JSON, 로컬·프로덕션 390/1440px 시작→단계 완료→다음 단계→게임 종료→재시작→공유→관련 경로 통과.
- 공통 AdSense 계약: 11/11 변이 통과. 중단 페이지는 광고 로더 0개다.
- 광고 위험 인벤토리: `critical 12`, `high 40`, `medium 6`, `info 52`, `clean 9`.
- 전체 하네스 `2026-09-04T18-35-45-651Z`: 158/158 통과, analytics 9/9, runtime 6/6, submitted inventory 63/0.
- 사용자 파일 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 건드리지 않는다.

## 다음 실행 순서

1. 남은 critical 후보를 유효 Organic·실제 행동·구현 위험으로 다시 비교한다. Number Puzzle의 36 start, Emoji Merge의 completion 1건, Word Guess의 Organic 4 sessions/577s는 보존 신호로 취급한다.
2. 선택한 한 제품에서 광고·보상·허위 증거만 격리하고 실제 검색/게임 경로는 유지하거나 개선한다.
3. 전용 변이→실사용 여정→전체 하네스→하위 저장소→Pages→프로덕션→루트 순으로 배포한다.
4. 트렌드·밈·게임·영화 후보는 공식 출처와 검색 의도, 기존 포트폴리오와 다른 상호작용 가설이 있을 때만 한 건씩 실험한다. 현재 제한을 우회하는 트래픽 확대 수단으로 사용하지 않는다.

## 관찰 규칙

- 배포일은 비교에서 제외하고 완료된 KST 날짜끼리 본다.
- Singapore desktop Direct 스캔, 비정상 국가 클릭 집중, Direct/Unassigned와 기존 합성 이벤트를 분리한다.
- 제품별 20 qualified views 전에는 `DISCOVERY_HOLD`다.
- 광고 제한 중 수익 감소는 콘텐츠 실패로 판정하지 않는다. 제한 해제 후 동일 완료일 창에서 수익을 재평가한다.
