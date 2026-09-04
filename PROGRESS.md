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

## 최신 배포: Minesweeper 보상 광고 중단

- 자식 저장소: `minesweeper 564fcf3`, Pages `33887455042` 성공, 프로덕션 검증 완료.
- 최근 28일 67 PV 중 중국 데스크톱 Direct가 61 PV였다. Organic Search는 스페인 1 PV뿐이므로 검색 성과가 아니라 무효 트래픽 노출면으로 취급한다.
- Auto Ads 로더, H5 Games 광고 모듈, 패배 후 “광고 시청→두 번째 기회” 흐름과 광고 전용 CSS를 제거했다.
- 승패·기록·힌트·12개 언어·연결 출처·공유 기능은 유지하며, 승패 결과는 광고 콜백 없이 즉시 표시한다.
- `data-ad-serving="suspended-invalid-traffic-2026-09-03"` 상태에서 광고 DOM과 런타임 `GameAds`가 모두 0개다.

## 검증 상태

- 광고 위험 인벤토리: 추적된 119개 프로젝트를 검사하며 8/8 행동 변이를 탐지한다. Minesweeper 배포로 `critical 20→19`, `clean 1→2`가 됐다.
- Minesweeper: 일본어 18/18·프랑스어 17/17 변이, 390/1440px 시작→패배→즉시 결과→공유→복귀 여정과 프로덕션 모두 통과.
- 공통 analytics smoke: 9/9 통과.
- submitted inventory: 63 URLs / issues 0.
- 전체 하네스 `2026-09-04T15-17-12-519Z`: 모든 단계 통과, analytics 9/9, runtime 6/6, submitted inventory 63/0.
- 첫 회귀에서 실제 2026-08-30 변경 뒤 갱신되지 않은 Animal Personality `dateModified`를 탐지했다. 오늘 날짜가 아닌 실제 변경일로 교정한 `3d6b1ec` 배포 후 전체 회귀를 다시 통과했다.
- 전체 회귀 중 발견한 Blood Type 검증기의 `listen(0)` 금지 포트 결함을 공용 safe-port 할당기로 수정했다.
- 사용자 작업 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 건드리지 않는다.

## 다음 실행 순서

1. 광고 위험 인벤토리의 다음 critical 앱을 최근 유입·유입 품질과 결합해 하나만 고른다.
2. 점수·생명·결과와 광고를 교환하는 흐름을 한 페이지씩 제거하고 광고 중단 계약을 배포한다.
3. AdSense 경보와 완료된 KST 일별 impressions/clicks를 하루 한 번만 확인한다.
4. 제한 해제 전까지 트렌드 콘텐츠·새 광고 실험·대규모 색인 확대는 보류한다.

## 관찰창

| 대상 | 창 | 첫 판정 |
|---|---|---|
| AdSense 제한 | 완료일 기준 매일 | 경보 해제, impressions 회복, 국가×기기 클릭 이상 완화 |
| EQ 새 퍼널 | 제한 해제 후 7 완료일 | complete 20명 이후 action-view→next-click 25% |
| Stress result→plan | 제한 해제 후 7 완료일 | action view 20명 이후 plan click 25% |
| HSP coping→reset | 제한 해제 후 7 완료일 | qualified view 20명 이후 CTA 8%, reset generate 25% |

광고 제한 기간의 수익 감소를 콘텐츠 실패로 판정하지 않는다. 계정 안전이 회복된 뒤 동일한 완료일 창으로 수익 목표를 다시 평가한다.
