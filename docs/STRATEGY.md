# DopaBrain growth strategy

Updated: 2026-10-04 KST. 이 문서는 모델/도구가 바뀌어도 그대로 이어서 실행할 수 있는 **단일 설계안**이다. 진행 체크는 `PROGRESS.md`에만 갱신한다.

## 1. 목표와 진단 (2026-10-03 실데이터)

- 목표: 완료된 7일 합계 ≥ `$1.40` (`$0.20/day`).
- 현재: 9/26–10/2 합계 `$0.55` (`$0.079/day`).
- 국가 RPM: US `$4.25`, DE `$5.87`, CA `$7.38`, KR `$0.11`, CN `$0.15`. 수익은 Tier-1 영어권 소수 PV에서 나온다.
- GA4: 세션 대부분이 Singapore Direct(평균 4초), China Direct 봇성 트래픽. 실제 Organic은 Bing·Naver·Yandex 합계 약 50세션/2주(체류 30–420초).
- **GSC: 3개월간 비-`site:` 노출 3회, 클릭 0. 홈만 색인.** Stress Check·HSP Test는 `Crawled - currently not indexed`(마지막 크롤 5월/2월), 신규 블로그는 `URL is unknown to Google`. 사이트맵은 9/3 이후 재다운로드 없음.
- 역산: Tier-1 RPM ≈ `$4.5` 기준 **Tier-1 실사용자 PV ≈ 45/일**이 필요. KR만으로는 약 1,800 PV/일 → 비현실적. 영어권 Google+Bing 롱테일이 유일한 현실 경로.

### 근본 원인
1. **대량·주제이탈 블로그(scaled content)**: Roblox 개발 가이드, 게임 "신경과학", 월드컵, 픽션/영화 심리 × 12개 언어 ≈ 1,900 URL. 심리 도구 사이트의 주제 신뢰도와 크롤 예산을 잠식.
2. **핵심 도구 페이지가 얇음**: 문항+결과 위주, 방법론·근거·해석·FAQ·운영자 신뢰 신호 부족.
3. **Above-the-fold 광고 과밀(Auto Ads)**: 모바일에서 "Discover more"(관련 검색)가 H1·시작 버튼 위에 삽입. 데스크톱 Stress Check는 사이드레일+상단 검색 오버레이+대형 앵커로 시작 버튼이 첫 화면에 없음. 광고 차단 시 CTA top 약 560px·overflow 0 → 코드 결함이 아니라 광고 배치 문제.

## 2. 금지/동결

- Tier 블로그 파이프라인(`scripts/build-tier*.js`, `submit-tier*-indexnow.js`) **동결**. 새 Tier 262/263 제작 금지.
- 좌측 카테고리 사이드바(3천 페이지 탐색성) 보류 — 색인 회복 전 수익 기여 없음.
- 주제이탈 신규 URL 생성 금지. 새 URL은 핵심 도구의 검색 의도와 직접 연결될 때만, 한 번에 하나.
- AdSense: 무효 트래픽 위험 행위 금지(자기 클릭, 트래픽 구매, 광고 유도 문구, 보상형 교환, 광고 근처 버튼 배치 변경으로 오클릭 유도). 과거 일시 수익 중단 이력이 있으므로 광고 관련 변경은 **AdSense UI 공식 설정만** 사용하고 코드로 광고 위치를 조작하지 않는다.

## 3. 단계별 설계

### P0 — 품질 정리 (코드, 2026-10-03 로컬 적용 완료 / 배포 전)
- `scripts/blog-topic-prune.js`: 주제이탈 슬러그 패턴(`OFF_TOPIC`)을 portal 사이트맵 2개에서 제거. `--self-test`, `--apply`, 인자 없으면 회귀 검사(제출된 off-topic URL이 있으면 실패).
- 이어서 `node scripts/blog-indexing-focus.js --apply`가 사이트맵·근거 스냅샷 밖 페이지에 `noindex,follow` 마커(`data-indexing-focus`)를 넣는다. 파일 삭제 없음 → 패턴 축소 후 사이트맵 행 복구+재실행으로 되돌릴 수 있다.
- 결과: 블로그 사이트맵 1,884행 제거(1,207 유지), noindex 2,174 / 유지 1,491. `blog-indexing-focus.js`의 article drift 기준값 1978→3874 갱신.
- 예외: `ko/odyssey-spider-man-identity-reset-2026.html`은 홈 culture signal과 `verify-root-focus*`, `verify-adsense-contract`, `verify-blog-generator-interaction`, `culture-signal-review` 픽스처에 묶여 있어 유지. 제거는 P1-4에서 검증기와 함께 처리.
- 남은 P0 작업:
  1. `npm run verify:indexing-inventory`, `npm run verify:adsense-contract`, `npm run verify:restricted-ads` 통과 확인. 인벤토리 기대치(3,366)가 하드코딩된 곳이 있으면 현재 값으로 갱신.
  2. `projects/portal` commit/push → Pages run 성공 확인 → 운영에서 샘플 3개(Roblox 1, 게임신경과학 1, 유지 심리 기사 1)의 robots meta와 운영 사이트맵 행 수 확인.
  3. 루트 저장소에 스크립트+포인터+문서 commit/push.

### P1 — 핵심 페이지 깊이·신뢰 (1–2주, EN 우선 → KO)
대상: `/stress-check/`, `/hsp-test/`, `/brain-type/` (그다음 `/future-self/`).
1. 도구 아래 정적 본문 섹션(크롤 가능한 HTML, i18n 키 사용, 12개 locale JSON에 키 추가; EN/KO는 완성 문안, 나머지는 번역):
   - 무엇을 측정하는가 / 측정 방법(Stress: PSS-10 *참고* 구조, HSP: Aron HSP Scale *참고*임을 명시, 진단 도구 아님 고지)
   - 점수 구간별 해석(3–4구간), 구간별 다음 행동 1개
   - FAQ 5개, 참고문헌 3–5개(원 논문/공공기관), 최종 검토일
2. Schema: `WebApplication` + `FAQPage`(본문 FAQ와 동일 문안). 기존 schema와 중복 금지.
3. 결과 후 재순환: 결과 카드 아래 관련 도구 1 + 관련 유지 기사 1. 점수·답변은 URL/공유/GA4 payload에 넣지 않는다(VALIDATION 규칙).
4. 홈 culture signal 교체: Spider-Man 링크를 핵심 도구 관련 유지 기사로 바꾸고 `verify-root-focus.js`, `verify-root-focus-mutations.js`의 `SIGNAL_PATH`와 관련 픽스처를 함께 갱신. 이후 해당 기사를 `OFF_TOPIC`에 추가 가능.
5. About 페이지: 운영자, 편집·검토 원칙, 연락처, 의료 고지.
6. 검증: `npm run harness:release -- --target projects/<app> --release-verifier scripts/verify-<app>.js`, 390/1440px overflow 0, 터치 44px, 12개 언어 렌더.

### P2 — 광고 UX (사용자가 AdSense UI에서만 실행)
- 광고 → 사이트별 → dopabrain.com → Auto ads 편집:
  - "관련 검색(Related search)" 끄기 **또는** 미리보기 편집기에서 히어로/시작 버튼 영역을 *제외 영역*으로 지정.
  - 광고 로드 한 단계 하향. 앵커·비네트·사이드레일은 유지.
- 변경일을 PROGRESS에 기록하고 전후 7일 RPM·페이지당 노출·GA4 test_complete 비율 비교. 수익이 20% 이상 떨어지고 완료율 개선이 없으면 원복.

### P3 — 색인 요청·채널 (P0 배포 직후)
- `npm run gsc:submit-sitemaps`로 3개 사이트맵 재제출(운영 robots/인벤토리 검증기는 3개 선언을 요구; CLAUDE.md의 "1개" 규칙과 충돌 중 — 현재는 검증기 계약 유지).
- 사용자 액션: GSC URL 검사 → "색인 생성 요청" 핵심 URL 10개(홈 제외 sitemap.xml 상위: stress-check, stress-check/plan, hsp-test, hsp-test/reset, brain-type, future-self, puzzle-2048/coach, burnout-test, iq-test, stress-response). API로 불가.
- `scripts/indexnow-submit.js`로 핵심 URL 재통지(Bing/Yandex/Naver). 동결된 Tier 스크립트는 쓰지 않는다.
- Naver 서치어드바이저에 사이트맵 재제출(사용자 액션).

### P4 — 측정 루프 (주 1회, 데이터 조회는 작업 재개 시에만)
1. `npm run adsense:keepalive` → 완료된 7일 수익, 국가 RPM.
2. GSC `index_inspect`로 핵심 URL 5개 상태, `search_analytics`(query, 28일) 비-`site:` 노출.
3. GA4: Organic Search 세션·참여(봇성 Singapore/China Direct 제외).

| 시점 | 성공 기준 | 실패 시 분기 |
|---|---|---|
| +1주 | 핵심 URL 5개 이상 Indexed | 색인 요청 재시도, P1 본문 보강 우선 |
| +3주 | Google 비-site 노출 500+/주, Bing organic 2배 | 유지 기사 범위를 EN/KO 핵심 도구 관련분만 남기고 나머지 noindex로 확대 |
| +6주 | 7일 합계 ≥ `$1.40` | P1 대상을 future-self·burnout-test로 확장 |

## 4. 릴리스 게이트 (공통)
- 한 번에 하나의 URL/가설/측정 계획.
- 하위 저장소 먼저 commit/push → Pages 성공 → 운영 재검증 → 루트 포인터·문서 commit/push.
- 사이트맵 변경 시 `verify:indexing-inventory`, 광고 관련 변경 시 `verify:adsense-contract`·`verify:restricted-ads`·`verify:ad-risk-inventory`.
