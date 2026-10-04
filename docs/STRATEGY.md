# DopaBrain growth strategy

Updated: 2026-10-04 KST. 모델 무관 단일 실행 설계안. 진행 상태는 `PROGRESS.md`에만 갱신.

## Goal and constraint

- 목표: 7일 합계 ≥ `$1.40` (`$0.20/day`).
- 현재: 7일 `$0.55` (`$0.079/day`). Tier 1 RPM: US `$4.25`, DE `$5.87`, CA `$7.38`.
- 병목: Google 노출 3회/3개월. Stress Check·HSP Test가 `Crawled - currently not indexed`.
- 원인:
  1. **주제이탈 블로그(~1,900 URL)**: Roblox/게임 등 대량 생성물이 사이트 신뢰도 및 크롤 잠식.
  2. **핵심 도구 얇음**: 설명/방법론/FAQ/참고문헌 부족으로 저품질 판정.
  3. **Above-the-fold 광고 과밀**: AdSense Auto Ads 관련 검색(Ad Intent)이 버튼과 H1 가림.

## 2. 금지 및 동결

- Tier 블로그 파이프라인(`scripts/build-tier*.js`, `submit-tier*-indexnow.js`) 영구 동결.
- 좌측 카테고리 사이드바(3,000p) 보류.
- AdSense: 무효 트래픽 위험 금지. 광고 위치 조작 금지, **AdSense UI 설정만** 사용.

## 3. 단계별 설계

### P0 — 품질 정리 (배포 완료)
- `scripts/blog-topic-prune.js`: portal 사이트맵에서 off-topic 1,884행 제거(1,207행 유지).
- `scripts/blog-indexing-focus.js --apply`: 2,174개 페이지 `noindex,follow` 적용. portal `163e74a`.

### P1 — 핵심 도구 깊이·신뢰 강화 (배포 완료)
- 대상: `/stress-check/`, `/hsp-test/`, `/brain-type/`, `/future-self/`, `/iq-test/`.
- 크롤 가능한 본문 섹션(i18n 12개 언어):
  1. 측정 프레임워크(PSS-10, Aron SPS DOES, 5개 인지 차원, Future Self Continuity, 4대 추론 영역). 진단 불가 명시.
  2. 점수/반응 구간별 해석 및 실천 가이드.
  3. FAQ 3~5개, 학술 참고문헌(APA, WHO, Aron, Kahneman, Hershfield, Raven, Cattell 등), 검토 메타데이터.
- 배포: stress-check `e3dccae`, hsp-test `f78024d`, brain-type `5ec10cc`, future-self `276d977`, iq-test `fedf1c4`.

### P2 — 광고 UX (AdSense UI 완료)
- dopabrain.com Auto Ads 설정: 광고 인텐트(의도 기반 형식) 끄기, 광고 로드 1단계 하향.

### P3 — 색인 요청·신호 (완료)
- GSC UI: 핵심 5개 URL 색인 요청 완료.
- IndexNow: `scripts/indexnow-submit.js`로 5개 핵심 도구 갱신 제출 (HTTP 200).

### P4 — 주간 측정 루프
1. AdSense: `npm run adsense:keepalive` → 7일 수익, Tier 1 RPM.
2. GSC: `index_inspect` 핵심 5개 URL 색인 상태 확인.
3. GA4: Organic Search 세션·체류시간 추적 (Direct 봇 트래픽 제외).

## 4. 릴리스 원칙

- 하위 저장소(`projects/*`) 먼저 commit/push → Pages 성공 → 루트 포인터·문서 commit/push.
- 사이트맵 변경 시 `verify:indexing-inventory`, 광고 변경 시 `verify:adsense-contract`.
