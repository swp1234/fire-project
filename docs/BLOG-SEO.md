# Blog and SEO Operating Notes

블로그 전략은 [STRATEGY.md](STRATEGY.md), 완료 기준은 [VALIDATION.md](VALIDATION.md), 실제 계약은 `scripts/create-blog-article.js`와 `scripts/specs/*.json`이 기준이다. 현재 재고와 다음 판단은 [PROGRESS.md](../PROGRESS.md)에만 둔다.

## Release rule

- 한 실험은 한 언어·한 URL·한 검색 의도·한 핵심 행동으로 시작한다.
- 공식 발표, 제품 페이지, 원문 연구 등 가능한 1차 출처를 우선하고 사실과 편집 추론을 분리한다.
- 얇은 번역, 키워드 변형 대량 생산, 허위 통계·할인·제휴 표현, 저작권 자료 복제를 하지 않는다.
- canonical은 자기 URL과 일치시키고 hreflang은 실제 존재하는 locale만 선언한다.
- Article·FAQ schema의 보이는 문구와 JSON-LD를 일치시킨다.
- Culture Signal의 2-choice interaction, CTA·share URL과 event params는 generator 계약과 검증기를 통과해야 한다.

## Gate

```powershell
node scripts/create-blog-article.js --spec scripts/specs/<spec>.json --dry-run
npm run verify:blog-generator-interaction -- --spec scripts/specs/<spec>.json
```

승인된 배포 뒤에는 대상 URL의 canonical, schema, 내부 목적지, 실제 interaction과 분석 이벤트를 [VALIDATION.md](VALIDATION.md)에 따라 다시 확인한다. 성과가 확인되기 전에는 인접 주제나 다른 언어로 확장하지 않는다.
