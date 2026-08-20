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

## Logging rule

새 항목은 아래 조건 중 하나일 때만 추가한다.

- 전략이나 우선순위가 바뀜.
- scan/bot 등 데이터 품질 결함을 새로 확인함.
- baseline 대비 의미 있는 변화가 생김.
- 계정/지급/정책 blocker가 바뀜.

상세 쿼리와 재사용 절차는 `dopabrain-growth-ops` Skill의 revenue reference를 따른다.
