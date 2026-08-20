# Analytics Decision Guide

## Purpose

GA4는 트래픽 총량 보고서가 아니라 어떤 진입면을 유지·교체할지 판단하는 도구다. AdSense와 GSC를 함께 보되 각 시스템의 역할을 섞지 않는다.

## Minimal query set

작업 재개 또는 명시적 분석 요청 때만 조회한다.

1. 최근 28일 channel × sessions/users/engaged sessions/engagement duration/views.
2. Organic landing page × sessions/engagement/next views.
3. Country × device × channel로 이상 급증 분해.
4. 핵심 이벤트 `root_view`, CTA, pick, 결과 도달.
5. AdSense country/device RPM과 GSC query/page를 별도로 조회.

## Interpretation

- Direct 급증 + 단일 국가/기기 집중 + 낮은 수익/참여는 scan 후보.
- sessions 상승과 views/session 하락이 함께 나타나면 품질 개선으로 단정하지 않는다.
- Organic의 engaged sessions와 다음 행동은 raw pageviews보다 우선한다.
- 표본이 작은 RPM은 방향 신호로만 사용하고 장기 평균을 기다린다.
- GSC `site:` query와 브랜드 탐색은 일반 검색 수요와 분리한다.

## Surface events

| Surface | Required evidence |
|---|---|
| Root | `root_view`, `root_cta_click`, `root_pick_click`, `root_language_change` |
| App | start, completion/result, related/next action |
| Blog | content view, primary CTA, related click |
| Hub | hub view, filter, featured/card click |

이벤트 이름 존재만 보지 말고 실제 클릭으로 발생하는지 Playwright로 확인한다.

## Record rule

`memory/data-check-log.md`에는 다음만 남긴다.

- 비교 기간과 핵심 baseline.
- 데이터 품질 제외 조건.
- 유지/교체 결정을 바꾼 근거.
- 다음 재검토 시점.

세션마다 동일 표를 추가하지 않는다. 현재 baseline이 바뀌면 기존 항목을 갱신한다.
