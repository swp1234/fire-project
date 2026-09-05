# 검증 기준

검증은 문자열 존재가 아니라 사용자 여정과 결함 탐지 능력을 증명한다. grep이나 스크린샷만으로 기능·배포를 승인하지 않는다.

## 증거 계층

| 계층 | 최소 증거 |
|---|---|
| 정적 | canonical, schema, locale JSON, 광고 계약, worker 범위 |
| 동작 | 시작→완료→다음 행동의 실제 브라우저 여정 |
| 분석 | 단계 이벤트 exact-once, 선택·답변·점수·결과 비전송 |
| 화면 | 390px/1440px overflow 0, 주요 터치 대상 44px 이상, 초점 이동 |
| 변이 | 같은 결함을 주입했을 때 검증기가 예상 사유로 실패 |
| 통합 | 출발 링크, 도착 페이지, 쿼리 allowlist가 함께 동작 |
| 운영 | 자식 저장소 배포 후 production에서 동일 계약 통과 |

## 실행 게이트

전체 회귀는 등록된 계약·변이·안전·브라우저 검사를 순차 실행한다.

```powershell
npm run harness
```

제품 반복 중에는 전용 검증기를 범용 릴리스 게이트에 넘긴다.

```powershell
npm run harness:release -- --target projects/<app> --release-verifier scripts/verify-<app>.js
```

`--plan`으로 경로, 등록, 중복, 패키지 검증기 분류를 실행 전에 검사한다. 변경 위험과 무관한 직접 진단은 `package.json`의 `verify:*`를 사용하되 전체 하네스 통과로 오인하지 않는다. 구조와 분류는 `docs/HARNESS-WORKFLOW.md`가 설명한다.

## 제품 계약

- 질문·계산·저장·공유를 바꾸면 정상 완료, 새로고침, 거부·실패 경로를 브라우저에서 실행한다.
- 12개 언어를 표방하면 shell뿐 아니라 질문, 선택지, 결과, 안전 문구까지 각 언어로 완료한다.
- 사용자 입력을 HTML에 되돌릴 때 악성 markup fixture로 escaping을 확인한다.
- service worker는 GET·same-origin·앱 경로·성공 응답만 캐시하고 앱 범위 밖을 가로채지 않는다.
- 퇴역 route는 2KB 이하 `noindex,follow` redirect, 정리 전용 worker, 광고·분석·schema·stale asset 0을 요구한다.

## 광고와 분석

- 정상 페이지는 고정 publisher의 Auto Ads loader 하나만 허용한다.
- `data-ad-serving="suspended-invalid-traffic-YYYY-MM-DD"` 페이지는 loader, 수동 unit, `adsbygoogle.push`, 정적 광고 surface가 모두 0이어야 한다.
- 광고 시청·클릭을 결과, 점수, 보상, 프리미엄 해제와 교환하지 않는다.
- paid impression은 AdSense 자료로 판단하며 DOM 관찰이나 자체 이벤트로 추정하지 않는다.
- view는 정의된 가시성·지속시간을 충족한 뒤 기록한다. start, complete, qualified view, primary click은 load당 exact-once다.
- 선택, 답변, 점수, 결과, 자유 입력은 URL·공유·GA4 payload에 넣지 않는다.

## 완료 조건

1. 변경 범위의 정적·동작·변이 검사가 통과한다.
2. 하위 저장소의 실제 Pages source branch에 fast-forward push하고 해당 run 성공을 확인한다.
3. production에서 핵심 여정, 콘솔, mobile/desktop, 내부 목적지, 배포 파일 일치를 다시 검사한다.
4. sitemap 변경 시 `npm run verify:indexing-inventory`; 광고 변경 시 `npm run verify:adsense-contract`와 `npm run verify:ad-risk-inventory`를 추가한다.
5. 실패는 제품·fixture·도구 결함으로 구분하며 같은 명령 반복으로 숨기지 않는다.
