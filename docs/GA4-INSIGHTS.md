# GA4 Insights Operating System

> 세션 단위 실행과 주간 전략 리뷰에서 같은 숫자를 같은 방식으로 읽기 위한 분석 운영 문서.

---

## 1. 목적

- GA4 인사이트를 `sessions + 일부 custom event` 중심 해석에서 `획득 → 품질 → 전환 → 재방문 → 수익 → 데이터위생` 체계로 확장한다.
- [PROGRESS.md](E:/Fire Project/PROGRESS.md), [memory/data-check-log.md](E:/Fire Project/memory/data-check-log.md), [docs/OPERATIONS.md](E:/Fire Project/docs/OPERATIONS.md), [docs/STRATEGY.md](E:/Fire Project/docs/STRATEGY.md)가 서로 다른 숫자를 보지 않도록 기준을 통일한다.
- Data API에서 불안정한 커스텀 이벤트가 있어도 세션 우선순위를 안정적으로 정할 수 있게 한다.

---

## 2. KPI 층위

### 2.1 획득

주요 지표:
- `sessionDefaultChannelGroup`
- `sessionSourceMedium`
- `landingPage`
- `country`
- `languageCode`
- `deviceCategory`

핵심 질문:
- 어디서 유입이 오는가?
- 어떤 랜딩페이지가 실제 진입점인가?
- 어느 국가/언어/디바이스가 볼륨과 품질을 동시에 만드는가?

액션 트리거:
- 특정 `landingPage`가 볼륨 상위권이면 해당 표면을 메인 실험축으로 승격
- 특정 `country`/`languageCode`가 볼륨은 높은데 품질이 낮으면 locale/카피/랜딩 정합성 점검
- `Organic Search` 비중이 상승하면 SEO 확장 우선, `Direct` 편중이면 바이럴/브랜드 의존도로 판단

### 2.2 품질

주요 지표:
- `engagementRate`
- `engagedSessions`
- `averageSessionDuration`
- `screenPageViewsPerSession`
- `screenPageViews`

핵심 질문:
- 들어온 사용자가 실제로 머무는가?
- 이 표면은 한 화면에서 오래 소비되는가, 다음 화면으로 분배되는가?

액션 트리거:
- 허브에서 `screenPageViewsPerSession`이 낮고 `engagementRate`도 낮으면 카드 구조/카피/우선순위 조정
- 앱에서 `averageSessionDuration`은 긴데 후속 클릭이 낮으면 결과 화면 CTA 구조 최적화
- 블로그에서 세션은 있으나 `engagementRate`가 낮으면 상단 훅/TOC/CTA 위치 우선 점검

### 2.3 전환

메인 KPI:
- 앱: `eq_test_start`, `eq_test_complete`
- 허브: `hub_view`, `hub_test_card_click`
- 공통: `cross_promo_click`

보조 KPI:
- `premium_*`
- `content_*`
- `hub_cta_click`
- `hub_faq_open`
- `eq_related_click`

운영 원칙:
- Data API에서 안정적으로 보이는 이벤트만 메인 KPI로 쓴다.
- Data API에서 지연/누락이 반복되는 이벤트는 보조 KPI로만 쓴다.
- 메인 KPI가 부재할 때는 표준 지표(`landingPage`, `engagementRate`, `averageSessionDuration`)를 우선한다.

### 2.4 재방문

주요 지표:
- `newVsReturning`
- `active1DayUsers`
- `active7DayUsers`
- `active28DayUsers`
- `dauPerWau`
- `wauPerMau`

핵심 질문:
- 이 서비스는 한 번 쓰고 끝나는가, 다시 돌아오는가?
- 재방문층이 깊게 쓰는가?

액션 트리거:
- `returning` 비중이 낮으면 재유입 구조가 약한 상태로 판단
- `DAU/WAU`, `WAU/MAU`가 낮으면 루프형 실험보다 신규 유입형 실험을 우선
- `returning` 체류시간이 높으면 해당 표면의 리텐션 장치를 강화

### 2.5 수익

주요 지표:
- `totalRevenue`
- `totalAdRevenue`
- `averageRevenuePerUser`
- `adUnitExposure`

운영 원칙:
- 값이 비거나 신뢰하기 어려우면 `미수집`으로 기록하고 추정하지 않는다.
- 수익 지표가 비어 있는 동안은 세션/체류 개선을 수익의 대리 지표로만 사용한다.
- AdSense 또는 별도 수익 로그와 GA4가 연결되지 않았으면 주간 리뷰에서 분리 보고한다.

### 2.6 데이터위생

상시 체크:
- `landingPage`와 `pagePath` 슬래시 규칙 차이
- `(not set)` 비중
- 비정상 국가/OS/언어 분포
- Data API 미반영 커스텀 이벤트

핵심 질문:
- 지금 보는 수치가 실제 사용자 행동을 반영하는가?
- 봇/이상치/측정 누락이 전략 판단을 왜곡하고 있지 않은가?

액션 트리거:
- `Singapore`, 특정 `Linux`, `0초 세션`, `(not set)` 비중이 급증하면 품질 트래픽으로 해석하지 않음
- 커스텀 이벤트가 계속 미반영이면 KPI 의존도를 낮추고 표준 지표 중심으로 되돌림

---

## 3. 세션용 조회 팩

### 팩 1. 28일 스냅샷

목적:
- 전체 구조를 본다.
- 전략 축을 정한다.

조회 항목:
- 채널: `sessionDefaultChannelGroup`
- 소스: `sessionSourceMedium`
- 랜딩: `landingPage`
- 주요 표면: `pagePath`
- 세그먼트: `country`, `languageCode`, `deviceCategory`, `operatingSystem`
- 재방문: `newVsReturning`, `active1DayUsers`, `active7DayUsers`, `active28DayUsers`, `dauPerWau`, `wauPerMau`

### 팩 2. 최근 3일 실험 표면

목적:
- 현재 세션에서 손댄 표면이 실제 변화 후보인지 본다.

기본 대상:
- `/eq-test/`
- `/portal/`
- `/portal/tests/`
- `/portal/mbti/`
- winner blog 후보 페이지

조회 항목:
- `sessions`
- `screenPageViews`
- `engagementRate`
- `averageSessionDuration`
- 필요 시 `landingPage` 기준 진입량

### 팩 3. 이벤트 건강도

목적:
- 어떤 이벤트를 메인 KPI로 쓸 수 있는지 판단한다.

조회 항목:
- `hub_view`
- `hub_test_card_click`
- `eq_test_start`
- `eq_test_complete`
- `cross_promo_click`
- 보조 이벤트: `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`, `eq_related_click`

판정:
- 최근 2~3회 조회에서 연속으로 잡히면 메인 후보
- 전송은 확인되지만 Data API에서 반복 누락되면 보조 유지

### 조건부 팩

- 수익 이슈: `totalRevenue`, `totalAdRevenue`, `averageRevenuePerUser`, `adUnitExposure`
- locale 확장: `languageCode`, `country`, locale별 `landingPage`
- SEO 연계: GSC는 별도 블록에서 조회

---

## 4. 표면별 KPI

## `app`

핵심:
- `landingPage`
- `sessions`
- `engagementRate`
- `averageSessionDuration`
- `eq_test_start`
- `eq_test_complete`

보조:
- `premium_*`
- `eq_related_click`

해석:
- 앱은 진입량보다 완주율과 결과 화면 이후 행동이 중요하다.
- 체류시간이 높고 완주가 나오는데 premium이 안 보이면 premium 자체보다 Data API 신뢰도 문제를 먼저 의심한다.

## `hub`

핵심:
- `landingPage`
- `engagementRate`
- `screenPageViewsPerSession`
- `hub_view`
- `hub_test_card_click`

보조:
- `hub_cta_click`
- `hub_faq_open`

해석:
- 허브는 클릭 수만 보면 안 된다.
- `screenPageViewsPerSession`이 낮고 체류가 길면 체류형 허브일 수 있다.
- `hub_view` 대비 `hub_test_card_click`이 낮으면 분배 효율이 낮은 허브로 본다.

## `blog`

핵심:
- `landingPage`
- `sessions`
- `engagementRate`
- `averageSessionDuration`

보조:
- `content_cta_click`
- `content_related_click`
- `content_view`

해석:
- 블로그는 세션이 먼저다.
- 아직 세션이 없는 글은 CTA 실험보다 유입 확보가 우선이다.
- 세션이 생긴 뒤 CTA/related를 최적화한다.

## `cross_promo`

핵심:
- `cross_promo_click`
- 후속 도착 pagePath 변화

해석:
- 클릭 수만으론 부족하다.
- 클릭 후 실제 도착 세션이나 후속 탐색이 생겼는지 같이 봐야 한다.

---

## 5. 메인 KPI와 보조 KPI 구분

메인 KPI:
- `sessionDefaultChannelGroup`
- `sessionSourceMedium`
- `landingPage`
- `pagePath`
- `engagementRate`
- `averageSessionDuration`
- `screenPageViewsPerSession`
- `newVsReturning`
- `active1DayUsers`
- `active7DayUsers`
- `active28DayUsers`
- `dauPerWau`
- `wauPerMau`
- `eq_test_start`
- `eq_test_complete`
- `hub_view`
- `hub_test_card_click`
- `cross_promo_click`

보조 KPI:
- `premium_cta_view`
- `premium_unlock_click`
- `premium_unlock_complete`
- `ai_analysis_view`
- `content_*`
- `hub_cta_click`
- `hub_faq_open`
- `eq_related_click`
- `adUnitExposure` 미수집 시 관찰 전용

---

## 6. PROGRESS.md 기록 템플릿

세션 기록에 아래 6줄을 고정 블록으로 남긴다.

```md
**#1 획득:**
- 채널/소스/랜딩 기준으로 이번 세션의 메인 진입점과 비정상 유입을 요약

**#2 품질:**
- engagementRate, averageSessionDuration, screenPageViewsPerSession 기준으로 잘 먹는 표면/약한 표면 요약

**#3 전환:**
- 메인 KPI 이벤트와 보조 KPI 상태를 구분해 기록

**#4 재방문:**
- new vs returning, DAU/WAU/MAU 관점에서 루프 강도 요약

**#5 수익/미수집:**
- 수익 지표가 잡히면 기록, 아니면 미수집 상태와 대체 판단 기준 기록

**#6 데이터위생:**
- (not set), 비정상 국가/OS, Data API 누락 이벤트, 슬래시 규칙 등 왜곡 요소 기록
```

`다음 우선순위`는 반드시 위 6개 중 어느 줄에서 나온 결론인지 연결한다.

---

## 7. data-check-log 기록 형식

기본 형식:

```md
- YYYY-MM-DD: GA4 조회 완료 (세션NNN, 팩1/팩2/팩3 + 목적 요약)
```

예시:

```md
- 2026-04-02: GA4 조회 완료 (세션336, 팩1+팩2, 채널 구조 재확인 + eq-test/hub 최근 3일 비교)
```

원칙:
- 같은 날 이미 조회했으면 중복 조회 전에 먼저 로그를 확인
- GA4와 GSC를 같이 봤더라도 기록은 목적이 드러나게 짧게 남김

---

## 8. STRATEGY.md 주간 템플릿

주간 전략 스냅샷은 아래 순서로 남긴다.

```md
### 28일 데이터 (기간)

| 층위 | 수치 | 의미 |
|------|------|------|
| 획득 | ... | ... |
| 품질 | ... | ... |
| 전환 | ... | ... |
| 재방문 | ... | ... |
| 수익 | ... | ... |
| 데이터위생 | ... | ... |

### 승자 표면
- app:
- hub:
- blog:
- cross_promo:

### 약한 표면
- ...

### 다음 주 액션
1. ...
2. ...
3. ...
```

---

## 9. 리뷰 리듬

### 일간 세션 루틴

1. `memory/data-check-log.md` 확인
2. 팩 1로 구조 확인
3. 팩 2로 현재 실험 표면 확인
4. 팩 3으로 이벤트 건강도 확인
5. `PROGRESS.md`에 6줄 요약 기록
6. 다음 우선순위를 숫자 근거와 연결

### 주간 리뷰 루틴

1. 28일 기준 채널/랜딩/세그먼트 구조 재정리
2. 승자 표면과 약한 표면 재분류
3. `STRATEGY.md` 업데이트
4. 수익 미수집이면 연결 필요 여부 재판단
5. 다음 주 액션 3~5개 확정

---

## 10. 즉시 적용 규칙

- `premium_*`, `content_*`, `hub_cta_click`, `hub_faq_open`은 Data API에서 안정화되기 전까지 보조 KPI다.
- winner blog는 세션이 생긴 페이지부터 최적화한다.
- `Direct`와 `Organic Search`를 항상 분리해서 읽는다.
- 국가/언어 볼륨과 품질이 다르게 나올 수 있으므로 하나의 지표로 locale 우선순위를 정하지 않는다.
- `returning` 사용자가 적더라도 체류가 길면 리텐션 레버 후보로 본다.
- 수익 지표가 비어 있으면 `미수집`으로 명시하고 과도한 해석을 금지한다.
