# Data Check Log

원시 응답과 세션별 반복 표는 저장하지 않는다. 의사결정을 바꾼 기준점만 유지한다.

## 2026-08-20 portfolio reset

### AdSense

- Recent 30 days: 약 `$2.97`.
- Pageviews: 14,682; impressions: 3,610; clicks: 56.
- Page RPM: 약 `$0.20`; impression RPM: 약 `$0.81`.
- 2026-08-06: 7,137 pageviews와 `$0.24` 수익으로 스캔성 유입 판정.
- 상대적으로 유효한 시장: US desktop/mobile, KR mobile, JP mobile.
- 정책 문제는 없으나 주소 PIN 지급 보류가 존재한다.

### GA4

- Organic 681 sessions, 67.8% engagement, 약 208초 engagement duration.
- Singapore desktop Direct 9,909 sessions는 수요·성장 판단에서 제외.
- 유효 landing 신호: Stress Check, HSP Test, ZH 2048 guide, 일부 brain/K-pop guides.

### GSC

- 비브랜드 검색 성과가 얇고 대량 sitemap의 색인 성과가 없었다.
- 페이지 추가보다 crawl portfolio 축소를 선택했다.
- 운영 큐: 42 unique URLs, inventory blockers 0.

### Decision

- 홈: 3 primary + 6 focused picks + 1 archive link.
- 저성과 자산: 삭제 대신 discovery/crawl suppression.
- 다음 비교 전 최소 2주 관찰.

## 2026-08-28 early checkpoint

- 비교 구간: 2026-08-13~19 대 2026-08-21~27. 배포일과 당일 부분 데이터는 제외했다.
- AdSense: 수익 `$0.70 → $0.76`, pageviews `1,939 → 1,531`, clicks `12 → 20`, Page RPM `$0.36 → $0.49`.
- Singapore desktop scan: `783 → 694` pageviews, impressions·earnings 0. 제외 후 유효 Page RPM은 약 `$0.61 → $0.91`.
- KR: 수익 `$0.12 → $0.20`, Page RPM `$1.96 → $3.21`; CN: 수익 `$0.14 → $0.17`, Page RPM `$0.17 → $0.32`; US 수익은 `$0.28 → $0.18`.
- GA4 Organic은 `178 → 175` sessions로 정체했지만 Bing organic과 홈의 방문 깊이는 개선됐다.
- 퍼널은 Brain Type과 HSP가 강하고 Stress가 상대적으로 약했다. 2048 Coach는 소수 사용자의 반복 사용 신호가 강했다.
- GSC는 홈만 색인됐고 HSP·Stress·Brain Type은 미색인, 2048 Coach는 미발견 상태였다.
- 결론: 1주차에는 포트폴리오를 유지한다. 2주차에도 Stress가 약하면 Brain Type 또는 HSP와 우선순위를 교체한다.
- 계정: 정책 문제 없음, 사이트 READY. 주소 PIN 미인증 지급 보류와 미지급 잔액 `$9.18`이 남아 있다.

## 2026-08-29 K-pop path reset

- EN K-pop 가이드는 28일 Organic landing 16 sessions, 최근 7일 3 sessions였다. 기존 bridge는 37 users view 대비 1 user click으로 후속 전환이 약했다.
- 가이드·로스터·포지션 테스트에서 수동 광고 계약과 가짜 노출 이벤트를 제거했다. 테스트의 가짜 사회증거·평점·희귀도·광고 잠금과 비지원 locale 자산도 제거해 이전 수치를 성과 신호에서 제외했다.
- 8월 30일~9월 5일을 새 관찰 구간으로 두고 SG desktop Direct, 배포일, 이전 허위 이벤트를 제외한다.

## 2026-08-29 HSP reset baseline correction

- 기존 reset/map view 각 41 users·click 0은 숨겨진 결과를 render할 때 view가 먼저 발생한 값이라 실제 노출 기준선으로 사용할 수 없다.
- HSP 결과에서는 map과 fabricated percentile·rating·types·manual ads를 제거하고 5분 감각 리셋 하나만 primary로 둔다. 선택·결과값을 query나 telemetry로 보내지 않는다.
- 새 퍼널은 `result_view → sensory_reset_cta_view`(실제 50% intersection, exact-once) `→ sensory_reset_cta_click → sensory_reset_view → sensory_reset_generate`다.
- 2026-08-30~09-05 KST를 새 관찰창으로 두고 배포일 08-29를 제외한다. 실제 CTA exposure 20 users 전에는 판정하지 않으며 초기 click-user rate 목표는 8%다.

## 2026-08-29 Daily Tarot trust reset

- 최근 28일 스페인어 타로 가이드는 Bing organic 25 sessions였지만 GA4 unique users는 3명 수준이라 sitemap 승격 근거로 쓰지 않는다.
- 연결 앱의 허위 54,000+ 이용량·2,800건 평점·가짜 광고/AI 잠금을 제거하고, 가이드와 앱의 Auto Ads 계약만 복구했다.
- 최근 7일 AdSense는 `$0.75`로 일평균 약 `$0.11`; 목표까지는 광고 배치보다 실제 검색 사용자 확대가 우선이다.

## 2026-08-29 blog crawl focus

- 90일 Organic Search가 확인된 blog 327개·1,569세션 중 2세션 이상 174개가 1,416세션(90.2%)을 보존한다. sitemap pilot 1개를 더해 175개만 indexable로 유지했다.
- 일반 글 1,598개는 `noindex,follow`, redirect 205개는 유지했다. keep 175개 중 155개에 남은 수동 광고·합성 impression을 제거했다.
- GSC URL 검사는 homepage만 indexed, 핵심 글과 앱은 `Crawled - currently not indexed`였다. sitemap 재제출 API는 scope 부족(403)으로 실행되지 않았다.

## Logging rule

새 항목은 아래 조건 중 하나일 때만 추가한다.

- 전략이나 우선순위가 바뀜.
- scan/bot 등 데이터 품질 결함을 새로 확인함.
- baseline 대비 의미 있는 변화가 생김.
- 계정/지급/정책 blocker가 바뀜.

상세 쿼리와 재사용 절차는 `dopabrain-growth-ops` Skill의 revenue reference를 따른다.
