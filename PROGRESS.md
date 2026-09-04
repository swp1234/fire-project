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

## 최신 배포: MBTI Career 퇴역

- MBTI Career `f85ecd9`, Pages `33898609457` 성공. 포털 `b524a59`, Pages `33898622019`에서 메인 카탈로그 카드도 제거했다.
- `/mbti-career/`는 56일간 Organic/Search Console 노출과 유효한 시작·완료가 모두 0이었다. 41 page users 중 대부분은 desktop Direct였고 기존 `page_engage`·timer·traffic-quality 이벤트는 합성 신호라 제외했다.
- 근거 없는 TOP 10 직업 순위·평점·AI 심층 분석과 가짜 광고 완료 unlock을 포함한 6,289줄/19개 자산을 제거했다. 구형 URL은 1,351바이트 `noindex,follow` 경로로 유지해 `/portal/mbti/`로 연결하고, 구형 캐시를 지운 뒤 service worker를 해제한다.
- 광고 위험 인벤토리는 `critical 17→16`, `clean 4→5`다. 신규 트렌드는 기존 Culture Signal의 Organic/Search 노출이 확인되기 전 복제하지 않고, 공식 출처·별도 검색 의도·상호작용 가설이 있는 한 건만 실험한다.

## 검증 상태

- 광고 위험 인벤토리: 추적된 119개 프로젝트를 검사하며 삭제 예정 tracked 파일도 안전하게 건너뛰고 9/9 행동 변이를 탐지한다. 현재 `critical 16`, `clean 5`다.
- MBTI Career: 11/11 변이, 390/1440px 로컬·프로덕션 리디렉트, 무광고·noindex·4파일 footprint·구형 SW 해제를 통과.
- 공용 AdSense 계약: 정상 페이지는 로더 1개, 중단 페이지는 로더 0개를 강제하며 11/11 변이를 탐지한다.
- 공통 analytics smoke: 9/9 통과.
- submitted inventory: 63 URLs / issues 0.
- 전체 하네스 `2026-09-04T17-05-39-191Z`: 150단계 모두 통과, MBTI Career 11/11, analytics 9/9, runtime 6/6, submitted inventory 63/0.
- 사용자 작업 `projects/attachment-style/{clarity.html,css/clarity.css,js/clarity.js}`는 건드리지 않는다.

## 다음 실행 순서

1. 남은 critical 앱 하나를 최근 유입·유입 품질과 결합해 정리한다. 현재 비교군은 Pong, Emoji Merge, Idle Clicker이며 다음 대상은 실데이터로 다시 고른다.
2. 동시에 기존 콘텐츠를 유지·개선·통합·삭제로 재분류하되, 무노출·무참여·중복만으로 즉시 삭제하지 않고 검색 의도와 링크 대체 경로까지 확인한다.
3. 최신 트렌드·게임·밈·영화 주제를 주기적으로 조사해 검색 수요, 시의성, 원본성, DopaBrain에서 가능한 상호작용을 점수화한다. 신규 제작은 한 건씩 검증한다.
4. AdSense 경보와 완료된 KST 일별 impressions/clicks는 하루 한 번만 확인한다. 제한 해제 전에는 광고 실험과 대규모 색인 확대를 하지 않는다.

## 관찰창

| 대상 | 창 | 첫 판정 |
|---|---|---|
| AdSense 제한 | 완료일 기준 매일 | 경보 해제, impressions 회복, 국가×기기 클릭 이상 완화 |
| EQ 새 퍼널 | 제한 해제 후 7 완료일 | complete 20명 이후 action-view→next-click 25% |
| Stress result→plan | 제한 해제 후 7 완료일 | action view 20명 이후 plan click 25% |
| HSP coping→reset | 제한 해제 후 7 완료일 | qualified view 20명 이후 CTA 8%, reset generate 25% |

광고 제한 기간의 수익 감소를 콘텐츠 실패로 판정하지 않는다. 계정 안전이 회복된 뒤 동일한 완료일 창으로 수익 목표를 다시 평가한다.
