# DopaBrain Current State

Updated: 2026-09-03

이 파일은 현재 운영 상태만 보관한다. 수치 변화와 선택 근거는 `memory/data-check-log.md`, 재사용 절차는 `dopabrain-growth-ops` skill, 장기 테스트 계약은 `docs/VALIDATION.md`가 기준이다. 완료된 릴리스 연대기는 Git 기록에서 확인한다.

## 목표와 판단 기준

- 최근 7개 완전한 KST 일자의 AdSense 수익을 `$1.40`(`$0.20/day`)까지 높이고 이후 `$1/day`를 목표로 한다.
- 배포일, 당일 미완전 데이터, Singapore desktop Direct 스캔은 성과 판단에서 제외한다.
- 한 번에 독립적으로 측정 가능한 경로 하나만 바꾸고 관찰창을 보존한다.
- 20 qualified view 이전은 `DISCOVERY_HOLD`; 14일·Organic 20·qualified view 20을 모두 충족하기 전에는 `SUPPRESS`하지 않는다.
- 페이지 귀속이 없는 AdSense RPM은 proxy일 뿐 URL 단위 인과 근거가 아니다.

## 2026-09-03 기준선

- 최근 완전 7일(08-27~09-02): `$0.55`, 2,139 pageviews, 708 impressions, 16 clicks, Page RPM `$0.26`.
- 직전 7일(08-20~08-26): `$0.76`, 1,588 pageviews, 775 impressions, 18 clicks, Page RPM `$0.48`.
- 페이지뷰 증가와 수익 하락이 동시에 나타났다. Singapore desktop은 590 PV·4 impressions·`$0`, 5,699 requests·310 matches로 스캔 성격이 강하다.
- 최근 고가치 표본: US `$0.16 / 54 PV / $2.96 RPM`, FR `$0.04 / 38 / $1.02`; KR mobile `$0.06 / 27 / $2.40`. KR desktop과 SG desktop을 같은 품질로 해석하지 않는다.
- 포트폴리오: Primary는 Stress Check, HSP Test, 2048 Coach. Support는 Brain Type, IQ, K-pop Roster. Culture Signal은 격리된 파일럿이며 Portal은 검색 수요를 검증하는 아카이브다.
- 제출 인벤토리: 63 unique URLs, strict issues 0. Search Console sitemap 행은 root/portal/blog `18 / 10 / 38`.

## 최신 릴리스: English HSP coping → sensory reset

- `/portal/blog/en/hsp-coping-strategies-highly-sensitive.html`은 equal-window Organic이 `2 → 5`, 최근 7일은 3회였다. 56일 동안 미국·영국·세르비아의 Organic 7회 중 4회가 engaged였지만 59 page users에서 유효한 후속 행동은 0이었다.
- 기존 42,165-byte “15 evidence-based tips” 글을 13,668-byte 실행 가이드로 교체했다. 고정 유병률, 보편적 뇌 특성, 치료 효과, 숨은 FAQ, 합성 광고 이벤트와 generic cross-promo를 제거했다.
- SPS를 연구 construct이자 비진단적 성찰 언어로 한정했다. 1997 원 논문, 2019 review, 18명/재검 13명의 2014 task-fMRI 연구를 직접 연결하고 작은 표본·과제 한계를 표시했다.
- 행동 경로는 `content_view → content_en_hsp_coping_plan_view → content_cta_click → sensory_reset_view → sensory_reset_generate`다. Map은 별도 secondary path다. 선택값은 URL·analytics에 포함하지 않는다.
- Portal release `118ca49`가 배포됐다. 전용 gate는 변이 14/14와 local/live 390/1440px Reset 생성·Map 진입을 통과했다. 전체 harness `2026-09-03T13-49-18-607Z`도 전 단계 PASS, analytics `9/9`, runtime `6/6`, inventory `63/0`이다.
- IndexNow는 변경 canonical 한 개를 HTTP 200으로 접수했다. Search Console은 검증된 세 sitemap을 한 번 접수했고 live rows는 `18 / 10 / 38`이다.

## 관찰창

완전한 KST 일자만 사용한다. 배포일은 제외하고 표본 임계치가 오기 전에는 콘텐츠 실패로 판정하지 않는다.

| 경로 묶음 | 관찰창 | 첫 진단 |
|---|---|---|
| English HSP coping → Reset/Map | 2026-09-04~09-10 | qualified plan view 20 후 CTA user rate 8%, linked reset view→generate 25%, non-SG Organic engagement 55% |
| Focused Google discovery queue | 2026-09-02~09-08 | priority URL의 새 crawl, 첫 non-home indexed URL, Culture Signal 최초 발견 |
| German emotion, English Future Self, Korean picker | 2026-09-02~09-08 | qualified action 8%, linked completion/generate 25~50%, valid Organic engagement 55% |
| JA Minesweeper, ZH games, ID lottery, FR dev quiz, EN past-life, ZH MBTI city | 2026-09-02~09-08 | 각 gate의 qualified→CTA와 app view→start/complete; destination slug 외 민감 상태 제외 |
| Attachment, emotion-action, cognitive-distortion, shadow, IQ/HSP/reaction/habit | 2026-08-31~09-06 | 새 stage event만 사용하고 legacy synthetic/ad/cross-promo event 제외 |
| Culture Signal 및 초기 reset | 2026-08-30~09-05 | 2026-09-06부터 exposure 임계치 충족 경로만 첫 판단 |

## 다음 실행

1. 09-04 이후 HSP 새 stage event가 GA4에 유입되는지 먼저 확인한다. 이벤트 부재와 0 클릭을 구분한다.
2. 09-06에는 초기 관찰창 중 표본 임계치를 충족한 경로만 `PROMOTE / ITERATE / SUPPRESS`로 판정한다.
3. 새 변경 전에는 AdSense 7일 완전 구간과 country×device를 다시 측정해 스캔 유입을 제거한다.
4. 운영 변경은 child repo commit/push → live verifier → 변경 canonical만 IndexNow → 검증 sitemap 한 번 제출 순서를 유지한다.
