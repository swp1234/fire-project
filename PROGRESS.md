# DopaBrain 현재 상태

Updated: 2026-09-04 KST

이 파일에는 현재 운영 상태만 둔다. 상세 수치와 과거 변경은 `memory/data-check-log.md`, 검증 규칙은 `docs/VALIDATION.md`, 반복 절차는 `dopabrain-growth-ops` skill이 기준이다.

## 목표

- 1차 목표: 완료된 최근 7일 AdSense 수익 `$1.40` = `$0.20/day`.
- 현재 7일(2026-08-28~09-03): `$0.64 / 2,211 PV / 724 impressions / 17 clicks`, 약 `$0.091/day`.
- 최근 30일: `$3.19`, 약 `$0.106/day`.
- 콘텐츠 확대보다 2026-09-03 시작된 무효 트래픽 광고 제한 해소가 현재 최우선 병목이다.

## AdSense 제한 대응

- API 경보: `SEVERE / adsense-traffic-throttled`. 정책 이슈 목록은 비어 있지만 제한 경보와 사용자 화면을 운영 사실로 취급한다.
- 2026-09-04 진행 중 수치: `$0.04 / 237 PV / 44 impressions / 1 click`; 완료일과 직접 비교하지 않는다.
- 최근 8일 전체 CTR은 0.74%이나 소표본 국가가 비정상적으로 높다: CA `3/7`, DE `2/16`, EC `1/10`, GB `1/12` clicks/PV.
- 신규 유입 확대, 광고 밀도 실험, IndexNow, GSC 재제출을 중단한다.
- 상호작용형 페이지의 수동 광고·보상형 광고·가짜 unlock을 제거하고, 위험 페이지에는 명시적 광고 중단 계약을 한 번에 하나씩 배포한다.
- 주소 PIN 지급 보류는 별도 계정 작업이며 광고 제한 원인으로 간주하지 않는다.

## 최신 배포: EQ 광고 중단·신뢰 리셋

- 자식 저장소: `eq-test c9a1257`, 프로덕션 배포 완료.
- 10개 고정 시나리오와 12개 언어는 유지했다.
- 수동 광고 3개, 직접 push, Auto Ads 로더, 가짜 AI/프리미엄 잠금, 무작위 백분위, 결과 저장·공유, 18개 추천 분산을 제거했다.
- 결과는 작성자 정의 0–3점, 총 30점의 “시나리오 점수”로만 설명한다. 검증된 EQ 평가나 진단이 아님을 시작·결과 화면에 표시한다.
- 결과 직후 Stress Check 1개 주 행동과 Attachment/HSP 2개 관련 경로만 둔다.
- 분석은 `eq_test_start → eq_test_complete → eq_result_action_view → eq_next_click`과 관련 클릭만 사용한다. 답변·점수·결과·URL은 전송하지 않는다.
- 광고 중단 마커: `data-ad-serving="suspended-invalid-traffic-2026-09-03"`; 광고 코드와 surface는 0개다.

## 검증 상태

- EQ 전용: 정적 계약, 20/20 변이, 390/1440px 완주, 12 locale, 연결 자동 시작, 프로덕션 모두 통과.
- 공통 analytics smoke: 9/9 통과.
- submitted inventory: 63 URLs / issues 0.
- 전체 하네스 `2026-09-04T14-43-45-825Z`: 모든 단계 통과, runtime 6/6.
- 전체 회귀 중 발견한 Blood Type 검증기의 `listen(0)` 금지 포트 결함을 공용 safe-port 할당기로 수정했다.
- 사용자 작업 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 건드리지 않는다.

## 다음 실행 순서

1. 전체 프로덕션 광고 위험 인벤토리를 재현 가능한 스크립트로 고정하고 실제 유입과 결합해 우선순위를 매긴다.
2. 점수·생명·결과와 광고를 교환하는 게임부터 한 페이지씩 광고 중단 또는 보상 제거를 배포한다.
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
