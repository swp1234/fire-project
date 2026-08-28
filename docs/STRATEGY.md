# Hybrid Revenue Strategy

Updated: 2026-08-29

## Thesis

DopaBrain은 심리 사이트로 고정하지 않는다. 원문을 복제하지 않는 트렌드 해설이 검색 유입을 만들고, 테스트·도구·게임이 행동과 재방문을 만든다는 가설을 한 언어·한 URL씩 검증한다.

## Portfolio

- Primary: Stress Check, HSP Test, 2048 Coach.
- Support: Brain Type, IQ Test, K-pop Role Roster.
- Pilot: 영화·밈·게임 Culture Signal과 하나의 명확한 bridge.
- Archive/Suppressed: URL은 보존하되 성과 근거 없이 홈·집중 sitemap에 복귀시키지 않는다.

## Experiment rules

- 실험당 검색 intent, 내부 링크, 핵심 행동을 하나씩 명시한다.
- 색인되지 않는 주제를 대량 생산하거나 얇게 번역하지 않는다.
- 저작권 침해, 허위 통계, 광고 클릭 유도, 자동 생성 스팸은 제외한다.
- Direct 급증은 국가·기기·참여·수익으로 scan/bot을 먼저 배제한다.
- 첫 Culture Signal의 도구 bridge는 `(content_test_click + content_cta_click) / content_view`다. 목적지가 섞인 `content_related_click`은 제외한다.
- Auto Ads loader는 페이지당 하나만 허용한다. 수동 unit 계약이 없는 동안 임의 slot/push와 DOM marker 기반 광고 노출 이벤트를 만들지 않는다.

## Promotion gates

출시일과 현재일을 뺀 complete days만 사용한다.

| Signal | Pass | Credibility floor |
|---|---:|---:|
| Organic landing | 20 sessions/day | 7 complete days |
| Engagement | 55% | 20 Organic sessions |
| Tool bridge | 8% | 20 content views |
| Effective RPM | `$1` | 20 page-attributed PV |

AdSense 도메인 RPM과 국가/device RPM은 시장 proxy다. 글 단위 귀속이 없으면 표시만 하고 승격 pass로 세지 않는다. SG Desktop scan은 유효 RPM에서 제외한다.

## Decision loop

| State | Rule | Action |
|---|---|---|
| `TRACKING_BLOCKED` | path/event/window 계약 오류 | 계측 복구 후 재판정 |
| `TOO_EARLY` | 7 complete days 미만 | 변경 없이 관찰 |
| `DISCOVERY_HOLD` | Organic/GSC 발견 증거 없음 | 색인·내부 링크 점검 |
| `PROMOTE` | 신뢰 가능한 gate 2개 이상 | 인접 주제 1편 추가 |
| `ITERATE` | 7일 이후 0~1개 | 제목·주제·bridge 중 하나만 수정 |
| `SUPPRESS` | 14일 이후 Organic 20 + content view 20 표본과 credible fail | 홈·집중 discovery에서 제거, URL 유지 |

28일이 지나도 최소 표본이 없으면 억제하지 않고 discovery 문제로 남긴다. GA4·AdSense 값은 대상 pagePath/URL이 정확히 일치할 때만 페이지 귀속 신호다.

자동 판정은 `scripts/culture-signal-review.js`의 JSON을 기준으로 하고 Markdown은 짧은 사람이 읽는 요약만 유지한다.

현재 Culture Signal과 KR 두뇌훈련 bridge의 변경일은 2026-08-29다. 8월 30일~9월 5일을 첫 7 complete days로 보고 9월 6일에 서로 분리해 판정한다.

## Revenue constraints

- 주소 PIN·정책·site readiness는 코드와 별도 운영한다.
- 광고 밀도보다 KR/US의 유효 세션과 결과 도달을 우선한다.
- 작은 표본의 RPM이나 단일 클릭만으로 포트폴리오를 바꾸지 않는다.
- `content_ad_impression` 같은 DOM 생성 이벤트는 실제 AdSense fill·수익 증거로 사용하지 않는다.
