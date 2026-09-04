# DopaBrain 현재 상태

Updated: 2026-09-05 KST

이 파일에는 현재 운영 상태만 둔다. 상세 수치와 과거 변경은 `memory/data-check-log.md`, 검증 규칙은 `docs/VALIDATION.md`, 반복 절차는 `dopabrain-growth-ops` skill이 기준이다.

## 목표

- 1차 목표: 완료된 최근 7일 AdSense 수익 `$1.40` = `$0.20/day`.
- 현재 7일(2026-08-29~09-04): `$0.63 / 2,115 PV / 644 impressions / 14 clicks`, `$0.090/day`.
- 최근 30일: `$3.19`, 약 `$0.106/day`.
- 콘텐츠 확대보다 2026-09-03 시작된 무효 트래픽 광고 제한 해소가 현재 최우선 병목이다.

## AdSense 제한 대응

- API 경보: `SEVERE / adsense-traffic-throttled`. 정책 이슈 목록은 비어 있지만 제한 경보와 사용자 화면을 운영 사실로 취급한다.
- 2026-09-05 확인에서도 `SEVERE / adsense-traffic-throttled` 경보가 유지된다.
- 최근 8일 전체 CTR은 0.74%이나 소표본 국가가 비정상적으로 높다: CA `3/7`, DE `2/16`, EC `1/10`, GB `1/12` clicks/PV.
- 신규 유입 확대, 광고 밀도 실험, IndexNow, GSC 재제출을 중단한다.
- 상호작용형 페이지의 수동 광고·보상형 광고·가짜 unlock을 제거하고, 위험 페이지에는 명시적 광고 중단 계약을 한 번에 하나씩 배포한다.
- 주소 PIN 지급 보류는 별도 계정 작업이며 광고 제한 원인으로 간주하지 않는다.

## 최신 배포: Idle Clicker 광고 위험 격리

- Idle Clicker `f92a09e`, Pages `33902610149` 배포와 프로덕션 여정 검증을 완료했다.
- 56일 55 PV/54명 중 Singapore desktop Direct가 44 PV/44세션이었다. China Bing Organic은 3세션 있었지만 게임 행동 이벤트가 전혀 없었고, 비교군 Emoji Merge에는 Bing Organic 2세션과 완료 1건이 있어 Idle을 먼저 격리했다.
- 12개 언어·게임·5개 관련 링크는 보존하고 Auto Ads·보상형 오프라인 수익 2배·광고가 없어도 지급되던 2배 fallback·광고 뒤 분석·가짜 `4.5/2,148` 평점·합성 `page_engage`·광고 자리표시자를 제거했다.
- private exact-once `idle_view → idle_start → idle_progress → idle_share/idle_related_click`로 교체하고 공유 수치·URL을 배제했다. 실여정이 발견한 0.08초 사운드의 음수 release 시각도 보정했다. 광고 위험 인벤토리는 `critical 15→14`, `clean 6→7`이다.

## 검증 상태

- 광고 위험 인벤토리: 추적된 119개 프로젝트를 검사하며 삭제 예정 tracked 파일도 안전하게 건너뛰고 9/9 행동 변이를 탐지한다. 현재 `critical 14`, `clean 7`이다.
- Idle Clicker: 18/18 변이, 12개 언어, 390/1440px 첫 공격→첫 장비 구매→무료 분석→공유→관련 링크 로컬·프로덕션 여정과 private telemetry를 통과.
- 공용 AdSense 계약: 정상 페이지는 로더 1개, 중단 페이지는 로더 0개를 강제하며 11/11 변이를 탐지한다.
- 공통 analytics smoke: 9/9 통과.
- submitted inventory: 63 URLs / issues 0.
- 전체 하네스 `2026-09-04T17-50-44-137Z`: 154단계 모두 통과, Idle Clicker 18/18, analytics 9/9, runtime 6/6, submitted inventory 63/0.
- 사용자 작업 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 건드리지 않는다.

## 다음 실행 순서

1. 다음 단일 광고 위험 후보를 유효 Organic·완료 행동·구현 위험으로 다시 고른다. Emoji Merge의 완료 1건은 보존 판단에 반영한다.
2. 선택한 페이지의 광고·보상·허위 증거를 격리하되 확인된 유효 경로는 유지·개선한다.
3. 기존 콘텐츠를 유지·개선·통합·삭제로 재분류하고 최신 트렌드·게임·밈·영화 후보를 공식 출처·검색 의도·상호작용으로 점수화한다. 신규 제작은 한 건씩만 검증한다.
4. AdSense 경보와 완료된 KST 일별 impressions/clicks는 하루 한 번만 확인한다. 제한 해제 전에는 광고 실험과 대규모 색인 확대를 하지 않는다.

## 관찰창

| 대상 | 창 | 첫 판정 |
|---|---|---|
| AdSense 제한 | 완료일 기준 매일 | 경보 해제, impressions 회복, 국가×기기 클릭 이상 완화 |
| EQ 새 퍼널 | 제한 해제 후 7 완료일 | complete 20명 이후 action-view→next-click 25% |
| Stress result→plan | 제한 해제 후 7 완료일 | action view 20명 이후 plan click 25% |
| HSP coping→reset | 제한 해제 후 7 완료일 | qualified view 20명 이후 CTA 8%, reset generate 25% |

광고 제한 기간의 수익 감소를 콘텐츠 실패로 판정하지 않는다. 계정 안전이 회복된 뒤 동일한 완료일 창으로 수익 목표를 다시 평가한다.
