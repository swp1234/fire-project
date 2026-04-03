# Growth Recovery Design

`AdSense MCP` 완료 후 다시 성장 작업으로 복귀하기 위한 실행 설계 문서다.

핵심 순서는 고정한다.

1. 데이터 판정 루프
2. `Hail Mary` 교차 진입 확장
3. winner 블로그 2차 확장

## 1. 데이터 판정 루프

기준 문서:

- `docs/GA4-INSIGHTS.md`
- `docs/OPERATIONS.md`
- `docs/STRATEGY.md`
- `memory/data-check-log.md`

### 1.1 조회 순서

조회 순서는 항상 아래처럼 분리한다.

1. `memory/data-check-log.md`에서 같은 날짜 조회 이력 확인
2. `GA4` 팩 1, 팩 2, 팩 3
3. `GSC` 별도 블록
4. `AdSense` 별도 블록
5. `PROGRESS.md`에 6줄 요약 + 다음 우선순위 기록

### 1.2 최소 조회 세트

| 블록 | 목적 | 최소 입력 | 이번 복귀에서 보는 표면 |
|------|------|-----------|--------------------------|
| GA4 팩 1 | 28일 구조 판정 | 채널, 소스, 랜딩, pagePath, 국가, 언어, 디바이스, 재방문 | `/eq-test/`, `/portal/`, `/portal/tests/`, `/portal/mbti/` |
| GA4 팩 2 | 최근 3일 실험 표면 판정 | sessions, engagementRate, averageSessionDuration, screenPageViews | `/hail-mary-mode/`, winner 블로그 4개 |
| GA4 팩 3 | 이벤트 건강도 판정 | `eq_test_start`, `eq_test_complete`, `hub_view`, `hub_test_card_click`, `cross_promo_click`, 보조 `content_*`, `eq_related_click` | 허브/블로그/앱 분배 구조 |
| GSC | 검색 확장 여부 판정 | impressions, clicks, query, page | `hail-mary-mindset`, `stress-management`, `habit-building` |
| AdSense | 수익/정책 안정성 판정 | unpaid, `last_7_days`, `last_30_days`, alerts, sites | 전체 웹 수익 상태 |

### 1.3 판정 규칙

#### `Hail Mary`

- `확장`:
  - 최근 3일 `sessions`가 발생했고
  - `/hail-mary-mode/`가 직접 랜딩 또는 허브 분배로 확인되며
  - `averageSessionDuration`이 짧지 않고
  - GSC에서 관련 페이지의 노출이 생기기 시작한 경우
- `관찰 유지`:
  - 세션은 있으나 허브 분배량이 작고
  - 아직 `portal`/`tests`/블로그 중 어떤 표면이 진입점인지 불분명한 경우
- `보류`:
  - 세션이 아직 거의 없고
  - 허브/블로그 노출 효과도 불분명한 경우

#### winner 블로그

- `확장`:
  - 세션이 이미 발생했고 CTA/related 클릭 최적화 여지가 있는 페이지
- `관찰`:
  - 내부 링크는 연결됐지만 아직 세션이 약한 페이지
- `유지`:
  - locale 기반이 없고 세션도 없어, 먼저 허브 유입이 필요한 페이지

### 1.4 `PROGRESS.md` 기록 포맷

고정 6줄은 유지하되, 이번 복귀부터는 각 줄에 아래 항목을 함께 적는다.

- `획득`: `/hail-mary-mode/` 세션 발생 여부, 어느 랜딩에서 들어왔는지
- `품질`: `portal`, `portal/tests`, `portal/mbti`의 허브 역할 차이
- `전환`: `eq-test` 완료, 허브 카드 클릭, 블로그 related/CTA 클릭 상태
- `재방문`: 신규 vs 재방문 중 어떤 표면이 재사용되는지
- `수익/미수집`: `AdSense unpaid`, `last_7_days`, `last_30_days`, `alerts`
- `데이터위생`: `(not set)`, 이상 국가/OS, 이벤트 누락

### 1.5 이번 복귀에서의 판정 질문

- `/hail-mary-mode/`가 실제 세션을 받기 시작했는가
- `portal`과 `portal/tests`가 `eq-test`와 `hail-mary-mode`를 분배하는가
- `stress-management`, `digital-detox`, `habit-building`, `blood-type` 중 실제 유입이 생긴 것은 무엇인가
- AdSense 지표가 콘텐츠 우선순위를 바꿀 정도의 경고나 급감 신호를 주는가

## 2. `Hail Mary` 교차 진입 설계

대상 표면:

- `projects/eq-test/index.html`
- `projects/stress-response/index.html`
- `projects/burnout-test/index.html`
- `projects/brain-type/index.html`
- `projects/portal/tests/index.html`
- `projects/portal/index.html`

설계 원칙:

- `eq-test`는 메인 엔진이므로 밀어내지 않는다.
- `Hail Mary`는 `pressure`, `stress`, `mission`, `survival`, `problem solving` 서사와 맞는 표면에만 붙인다.
- 허브 역할 분리는 유지한다.
  - `portal`: 진입 허브
  - `portal/tests`: 분배 허브
  - `portal/mbti`: 체류 허브

### 2.1 파일별 배치안

| 파일 | 현재 상태 | `Hail Mary` 역할 | 설계 결정 |
|------|------------|------------------|-----------|
| `projects/eq-test/index.html` | 결과 `related-grid`가 크고 감정/스트레스/블로그 축 중심 | `secondary` | `Stress Response`, `Burnout`, `Anxiety` 근처에 `Hail Mary` 카드 1개 추가. 목적은 `감정 이해 -> 극한 압박 대처` 흐름 연결. `Explore More Tests`나 `Attachment Style`보다 앞세우지 않는다. |
| `projects/stress-response/index.html` | 결과 `related-grid`가 스트레스 클러스터 중심 | `primary-secondary` | `Burnout Test` 바로 옆에 `Hail Mary`를 넣는다. 가장 서사 적합성이 높아 실제 확장 1순위다. `Overthinker`나 `Toxic Trait`보다 우선순위를 높게 둔다. |
| `projects/burnout-test/index.html` | 결과 `related-grid`가 스트레스/불안/도파민 축 | `secondary` | `Stress Response` 다음 카드로 `Hail Mary` 배치. `Burnout -> 압박 상황 대처 방식` 흐름을 만든다. |
| `projects/brain-type/index.html` | 결과 `related-grid`가 EQ/HSP/Mental Age/IQ 중심 | `secondary-low` | `EQ Test`와 `IQ Test` 사이의 사고방식 연결 카드로 시험 배치 가능. 단, 데이터 판정 전까지는 1차 적용 우선순위를 낮춘다. |
| `projects/portal/tests/index.html` | Featured와 all tests에 이미 `Hail Mary` 존재 | `hold` | 지금은 현 위치 유지. `EQ Test`보다 위로 승격하지 않는다. 데이터 판정 후에만 featured 내 순서 조정 검토. |
| `projects/portal/index.html` | EN 블로그 피드에 `hail-mary-mindset`만 존재 | `observe` | 메인 홈에서는 앱 직접 승격보다 블로그 트렌드 카드 유지가 적절하다. 유효 조회일 전에는 추가 홈 CTA를 늘리지 않는다. |

### 2.2 구현 우선순위

1. `projects/stress-response/index.html`
2. `projects/burnout-test/index.html`
3. `projects/eq-test/index.html`
4. `projects/brain-type/index.html`
5. 허브 순서 조정은 데이터 판정 후

### 2.3 이벤트 설계

새 이벤트를 만들기보다 기존 체계에 편입한다.

- 앱 결과 카드 클릭: 기존 관련 클릭 이벤트 계열 재사용
- 허브 카드 클릭: `hub_test_card_click`
- 블로그 연결 클릭: `content_related_click`, `content_cta_click`

즉, 이번 배치에서 필요한 것은 신규 이벤트 설계보다 `surface_type`, `surface_name`, `content_slug`, `data-app` 정합성 유지다.

## 3. winner 블로그 2차 확장 설계

대상 파일:

- `projects/portal/blog/en/habit-building.html`
- `projects/portal/blog/en/stress-management-techniques-guide.html`
- `projects/portal/blog/en/digital-detox.html`
- `projects/portal/blog/en/blood-type-personality-guide.html`

### 3.1 현재 상태 판정

| 파일 | locale 상태 | 현재 역할 | 2차 분류 |
|------|-------------|-----------|-----------|
| `habit-building.html` | EN only | 습관/루틴 허브 후보 | `유지 -> 허브 유입 우선` |
| `stress-management-techniques-guide.html` | 12개 언어 존재 | 스트레스 클러스터의 메인 설명 페이지 | `확장` |
| `digital-detox.html` | EN + RU | 디지털 과부하/집중 회복 페이지 | `확장 후보` |
| `blood-type-personality-guide.html` | EN + KO | 이미 유입이 확인된 fun/personality 진입점 | `최적화 유지` |

### 3.2 분기 기준

#### `habit-building`

- 아직 EN only이고, 문서상 미발생 블로그에 가깝다.
- 그래서 2차에서는 `locale 확장`보다 `허브 유입 확대`가 먼저다.
- 연결 우선순위:
  1. `stress-management-techniques-guide.html`
  2. `digital-detox.html`
  3. `Stress Response Test`
  4. `EQ Test`

결론:

- `habit-building`은 이번 배치에서 locale을 늘리지 않는다.
- 대신 stress/focus cluster에서 더 자주 도착하도록 허브/related 배치를 강화한다.

#### `stress-management-techniques-guide`

- 이미 12개 언어가 있으므로 locale 확장은 아님.
- 이 페이지는 `Stress Response`, `Stress Check`, `Digital Detox`, `Habit Building`, `Hail Mary`를 묶는 메인 허브로 쓴다.

결론:

- 이 페이지를 stress cluster의 `확장` 표면으로 둔다.
- `Hail Mary`는 여기서 직접 CTA보다 `related-links` 성격으로 유지하는 편이 자연스럽다.

#### `digital-detox`

- RU까지 있어 최소 locale 기반이 존재한다.
- 지금 역할은 `focus reset -> habit rebuild` 중간 허브다.

결론:

- locale 확장보다 `habit-building`, `stress-management`, `EQ Test` 연결 최적화를 먼저 한다.
- `Hail Mary`와의 직접 연결은 1차 우선순위가 아니다.

#### `blood-type-personality-guide`

- 이미 winner 후보이며 fun entry 역할이 명확하다.
- 이 페이지는 관계/자기이해/가벼운 진입용으로 유지하는 것이 맞다.

결론:

- `EQ Test`, `digital-detox`, `attachment-style` 축은 유지
- `Hail Mary`를 여기에 붙이는 것은 우선순위 밖

### 3.3 블로그 2차 실행안

| 우선순위 | 페이지 | 액션 |
|----------|--------|------|
| 1 | `stress-management-techniques-guide.html` | stress cluster의 메인 연결 허브로 강화 |
| 2 | `habit-building.html` | locale 확장 보류, 허브 유입 확대 |
| 3 | `digital-detox.html` | focus -> habit -> stress 흐름 강화 |
| 4 | `blood-type-personality-guide.html` | winner 유지, CTA/related 미세 최적화만 |

## 4. 실제 구현 순서

1. 다음 유효 조회일에 `GA4`, `GSC`, `AdSense` 판정 실행
2. 그 결과를 `확장 / 관찰 / 유지`로 표면 분류
3. `Hail Mary`는 `stress-response`, `burnout-test`, `eq-test` 순으로 반영
4. winner 블로그는 `stress-management`와 `habit-building`부터 만진다

## 5. 이번 설계의 결론

- `Hail Mary`는 이미 허브에 올렸으므로, 다음 단계는 홈 대승격이 아니라 `stress-pressure cluster` 안에서 교차 진입을 키우는 것이다.
- `habit-building`은 지금 locale 확장보다 유입 확보가 먼저다.
- `stress-management-techniques-guide`는 locale 기반이 이미 있어, 실제 성장 허브로 쓰는 것이 가장 효율적이다.
- `AdSense`는 이제 별도 운영 축으로 존재하므로, 앞으로 성장 우선순위는 `세션`만이 아니라 `수익/경고 안정성`까지 포함해 판정한다.
