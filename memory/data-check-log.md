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

## 2026-08-30 Palworld conversion reset

- Equal 28-day comparison: AdSense earnings `$2.15 → $2.90`, pageviews `5,560 → 14,379`, Page RPM `$0.39 → $0.20`; Organic Search `654 → 680` sessions. Traffic volume rose without proportional search or yield growth.
- Palworld Server Settings produced `0 → 15` Organic landing sessions; 13 were KR. KR mobile was 0/4 engaged, while path events showed 138 tool users, 1 copy user, and 1 preset user.
- Official Palworld Server Guide is now 1.0.3. The local PvP preset enabled only 1 of 3 required flags, and mobile placed the copy action 4,521px below the top.
- Decision: repair the existing indexed utility instead of publishing another trend URL. Observe 2026-08-31~09-06 KST; exclude deployment day and SG desktop, require 20 qualified generator users, and use 8% copy-user rate as the first threshold.

## 2026-08-30 MBTI compatibility intent consolidation

- Equal 28-day Organic landing evidence: evergreen `/portal/blog/mbti-compatibility.html` moved `7 → 18` sessions with `3 → 7` engaged; dated `/portal/blog/mbti-love-compatibility-2026.html` moved `8 → 11` with `2 → 8` engaged. Their text-token Jaccard overlap was 0.714.
- The evergreen route had the stronger current landing signal, while both articles targeted the same Korean compatibility intent. The dated route is now a noindex redirect and is absent from the sitemap/catalog.
- The 625 MBTI exception events were excluded as SG desktop scan noise: the sitewide spike was concentrated on 2026-08-06, recent MBTI exceptions were zero, and KO mobile/EN desktop production journeys had no page errors.
- Decision: observe 2026-08-31~09-06 KST; exclude deployment day and SG desktop, require 20 qualified comparison-view users, and compare the combined Organic landings of both former routes plus compare-use/CTA rates.

## 2026-08-30 Future Self conversion reset

- Equal 28-day Organic landing evidence for `/portal/blog/ko/future-self-prediction-test.html` was `6 → 9` sessions. The recent window had only `2/9` engaged sessions and 14 total engagement seconds across 8 users; 8 recent sessions were KR mobile Naver traffic, so this was a real mobile entry problem rather than SG scan noise.
- Historical app evidence showed 37 page-view users, 2 test-start users, and 1 completion. The guide's primary CTA incorrectly opened the Portal home, while the app ignored `?lang=ko`, claimed AI-like destiny output, displayed an unsupported 4.6/2,340 rating, and sent result type/value to analytics.
- Decision: repair this existing organic path instead of adding another URL. The guide now links directly into a Korean auto-start journey; the app publishes its fixed scoring rule, removes fabricated proof, does not send answers/results, and attributes linked versus manual starts.
- Observe 2026-08-31~09-06 KST, excluding deployment day and SG desktop. Use `content_view → content_future_self_cta_view → content_cta_click → test_start → test_complete`; wait for 20 qualified CTA-view users before judging, with 8% CTA click-user rate and 50% completion as the first diagnostic thresholds.
- Revenue milestone is now `$1.40` across seven complete days (`$0.20/day`), up from the latest `$0.75/7 days` (`$0.107/day`).

## 2026-08-30 doomscrolling US bridge reset

- The complete 2026-08-23~29 AdSense window was `$0.75`, 1,795 pageviews, 827 impressions, 22 clicks, and `$0.42` Page RPM. US produced `$0.21` from 57 pageviews (`$3.75` RPM), KR `$0.18` from 103 (`$1.71`), and CN `$0.19` from 591 (`$0.32`); US/KR valid traffic remains the leverage point for the `$0.20/day` milestone.
- `/portal/blog/en/doom-scrolling-mental-health-effects.html` moved `4 → 6` equal-window Organic landing sessions and US Organic moved `1 → 4`. Recent Organic engagement was only 21 seconds across 5 users. Path history had 14 content-view users, 0 CTA users, and old synthetic ad telemetry that is no longer emitted by current code.
- The previous page made unsupported dopamine-hijack, cortisol-duration, two-hour cutoff, and detox-reset claims. It is now a shorter association-not-causation guide with CDC, two original studies, Android controls, a private 60-second interrupt, and a near-top Stress Check bridge.
- Observe 2026-08-31~09-06 KST; exclude deployment day and SG desktop Direct. Compare US Organic landings and `content_view → content_doomscroll_reset_view → content_doomscroll_reset_use/content_cta_click → test_start`. Wait for 20 qualified reset-view users; use 8% Stress Check click-user rate as the first diagnostic threshold.

## 2026-08-30 Chinese browser-games bridge reset

- `/portal/blog/zh/browser-games.html` moved `3 → 11` equal-window Organic landing sessions and `3 → 8` engaged sessions; all 11 recent Organic sessions were China desktop. Historical page-wide events were polluted by 27 synthetic `content_ad_impression` and stale Palworld bridge events, so they are excluded from the new funnel baseline.
- China generated `$0.19` from 591 complete-window pageviews (`$0.32` Page RPM), so a single landing view has low yield. The page now prioritizes multi-page game entry through nine live Chinese routes instead of unsupported TOP-10 rankings, ratings, global popularity, or no-ad claims.
- Observe 2026-08-31~09-06 KST; exclude deployment day and SG desktop Direct. Use `content_view → content_game_picker_view → content_game_picker_use/content_game_click`, wait for 20 qualified picker views, and use 8% game-click-user rate as the first threshold. Do not compare new picker events with the historical synthetic event set.

## 2026-08-30 Spanish dopamine-break funnel reset

- `/portal/blog/es/dopamine-detox-guide-reset-brain.html` moved `1 → 9` equal-window Organic landing sessions, with 7 engaged sessions and real search entries from Mexico, Spain, Chile, Colombia, and Costa Rica. GSC exact-page rows were still absent.
- Historical page events included synthetic `content_ad_impression`; the destination app also claimed 50,000+ users, exposed a fabricated aggregate rating and AI analysis, and sent give-up actions into a nonexistent ad gate. Those events and claims are excluded from the new baseline.
- The guide now frames the action as a voluntary screen break, cites Harvard Health, Cleveland Clinic, Android, and Apple, and states the health boundary. The timer accepts a linked Spanish 10-minute preset without auto-start, localizes completion/abort, records no duration or choice values, and caches only successful same-origin GET responses.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and old synthetic events. Use `content_view → content_dopamine_break_view → content_dopamine_break_use/content_cta_click → detox_timer_view → detox_timer_start → detox_timer_complete/detox_timer_abort`; wait for 20 qualified break views, then use 8% click-user rate and 50% linked-view-to-start as initial diagnostics.

## 2026-08-30 Spanish typing-speed funnel reset

- `/portal/blog/es/test-velocidad-escritura-guia.html` moved `0 → 5` equal-window Organic landing sessions; all five were engaged, spread across Argentina, Mexico, Spain, and the United States on separate dates through Bing/Yahoo. GSC exact-page rows were absent.
- Path-wide recent evidence had 9 content-view users and 5 CTA users, but also old synthetic `content_ad_impression`. `/typing-speed/` had 36 users and no start or completion event, so the destination could not prove that clicks became tests.
- The 44 KB guide and app exposed unsupported professional ranges, a fabricated 4.5/850 rating, population percentiles, arbitrary grades, reward-inflated 2× WPM, duplicate page views, and a service worker that cached root-site paths instead of its app scope. The accuracy formula also penalized every unattempted prompt word.
- The guide is now a focused Spanish measurement route with a visible formula and three durations. The app adds Spanish prompts, uses attempted words for accuracy, removes fabricated ranking/reward output, accepts allowlisted linked entry without auto-start, records private exact-once view/start/complete/share stages, and caches successful same-origin app requests only.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and old synthetic events. Use `content_view → content_typing_test_view → content_cta_click → typing_test_view → typing_test_start → typing_test_complete/typing_test_share`; wait for 20 qualified guide views, then use 8% CTA-user rate, 50% linked-view-to-start, and completion as diagnostics.

## 2026-08-30 French Brain Type trust and conversion reset

- `/portal/blog/fr/test-type-cerveau.html` moved `3 → 8` equal-window Organic landing sessions; 5 recent sessions were engaged. The small but geographically varied Bing/Ecosia sample came from France, Belgium, and Morocco, while path-wide history had 12 content-view users and only 1 CTA user.
- The former guide presented unsupported left/right-brain and career-determining claims and retained hidden generic FAQ content. The app also duplicated `page_view`, emitted synthetic engagement, and sent answer choice, result type, and shared URL data to analytics.
- The replacement states that the result is a fixed summary of 10 binary choices rather than a brain scan, intelligence measure, diagnosis, or career assessment. It cites the 1,011-participant Nielsen et al. lateralization study, exposes the scoring rule, links directly to the French app, and records only private stage events. External share success is counted only when a share window actually opens or clipboard write succeeds.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and old synthetic events. Use `content_view → content_fr_brain_type_view → content_cta_click → test_start → test_complete`; wait for 20 qualified profile views, then use 8% CTA-user rate and 50% linked-view-to-start as initial diagnostics.

## 2026-08-30 Chinese habit-tracker conversion reset

- `/portal/blog/zh/habit-tracker-guide.html` held roughly flat at `8 → 9` equal-window Organic landing sessions; 4/9 recent sessions were engaged, all entries were China/Taiwan desktop Bing, and the recent window had only 59 total engagement seconds. Path-wide history had 27 content-view users but no CTA users and was polluted by synthetic ad/sticky events.
- The 78 KB guide mixed practical material with fixed-duration framing and a hidden generic FAQ. The linked app exposed a fabricated 4.3/780 rating, fake AI analysis behind an ad button, three invalid manual Auto Ads units, synthetic engagement, and analytics parameters containing habit counts, goal days, template choice, completion counts, and completion rate.
- The guide is now one Chinese 7-day starter route with the 66-day study boundary and three direct sources. The app opens a localized allowlisted preset without saving, escapes user-entered names, stores habit records locally, records private exact-once stages, counts shares only after success, and limits the service worker to successful same-origin app responses.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, historical synthetic events, and old sticky events. Use `content_view → content_zh_habit_plan_view → content_cta_click → habit_tracker_view → habit_tracker_quick_form_view → habit_tracker_habit_created → habit_tracker_first_completion`; wait for 20 qualified plan views, then use 8% CTA-user rate and 50% form-to-create as initial diagnostics.

## 2026-08-30 Japanese Brain Type trust and conversion reset

- `/portal/blog/ja/brain-type-test.html` moved `4 → 8` equal-window Organic landing sessions. Five of eight recent sessions were engaged with 472 total engagement seconds; six were Japan desktop Bing, with one Bing mobile and one Google tablet session. Exact-page GSC rows were absent.
- Recent path-wide evidence had 12 content-view users and only one CTA user. Historical `content_ad_impression` events were synthetic and are excluded from the new baseline.
- The former 54 KB guide claimed “latest neuroscience,” left/right-brain personality, 80–85% accuracy, and career fit. The replacement publishes the fixed 10-choice/8-label scoring boundary, cites the 1,011-participant Nielsen et al. study, and links directly to a Japanese auto-start route without sending answer or result data.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and old synthetic events. Use `content_view → content_ja_brain_type_view → content_cta_click → test_start → test_complete`; wait for 20 qualified guide views, then use 8% CTA-user rate and 50% linked-start as initial diagnostics.

## 2026-08-30 Chinese cognitive-distortions conversion reset

- `/portal/blog/zh/cognitive-distortions-list.html` moved `3 → 8` equal-window Organic landing sessions with 7/8 engaged and 786 engagement seconds. Five recent sessions were China desktop Bing, two China mobile Bing, and one Hong Kong desktop Bing; exact-page GSC rows were absent.
- Path-wide history had 29 content-view users, no meaningful content CTA users, one cross-promo user, and 29 synthetic `content_ad_impression` users. The page's primary conversion was an unrelated Animal Personality route.
- The 47 KB generic article is now a concise 15-pattern reference with an NHS-style evidence check, three direct NHS/WHO sources, and a private Chinese Stress Check bridge. Stress Check no longer claims a validated scale, fabricated 4,800 users, AI/ad unlocking, or hidden FAQ; it sends no answers, totals, result bands, or category values to analytics/URLs and counts sharing only after success. Browser verification also found and fixed nested text/icon clicks that previously did not advance questions.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and historical synthetic events. Use `content_view → content_zh_thought_check_view → content_zh_thought_check_use/content_cta_click → stress_intro_view → test_start → test_complete`; wait for 20 qualified views, then use 8% use/click-user rate and 50% linked-start as initial diagnostics.

## 2026-08-30 Chinese HSP guide trust reset

- `/portal/blog/zh/hsp-test-guide.html` was stable at `8 → 7` equal-window Organic landing sessions. Five of seven recent sessions were engaged for 1,372 total engagement seconds: five China desktop Bing sessions, one China mobile Bing session, and one Germany desktop Bing session. Exact-page GSC rows were absent.
- Path-wide history already showed 5 CTA users and 12 CTA clicks from 19 content-view users, so the conversion intent was not replaced. The HSP app and its separate reset observation window were left unchanged.
- The 32.6 KB guide claimed a free diagnosis, a universal 15–20% prevalence, a science-backed validated test, a mandatory four-feature diagnosis, and deterministic inborn brain activation; it also retained a hidden generic FAQ. The 17.6 KB replacement frames SPS as a research construct, distinguishes observation from diagnosis, cites the original construct paper, a critical review, and a small fMRI study with its sample limit, and records only qualified view, four-prompt completion, and CTA stages without selections.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and historical synthetic events. Use `content_view → content_zh_hsp_profile_view → content_zh_hsp_profile_use/content_cta_click → test_start → quiz_complete`; wait for 20 qualified views, then use 8% use/click-user rate and 50% linked-start as initial diagnostics.

## 2026-08-30 Japanese reaction-time trust and conversion reset

- `/portal/blog/ja/reaction-time-test-guide.html` moved `5 → 6` equal-window Organic landing sessions; 5/6 recent sessions were engaged. The valid search sample was Japan desktop Bing 4/4 engaged plus Japan desktop Yahoo referral 2 sessions/1 engaged; Singapore desktop Direct traffic was excluded. Exact-page GSC rows were absent.
- Recent path-wide evidence had 13 content users and 16 content views but no CTA or test-click users. Historical `content_ad_impression` (13 users/16 events) was synthetic and is excluded from the new baseline.
- The former 55 KB guide and destination used unsupported exact averages/rankings, professional and sports claims, a fabricated 4.3/1,420 rating, arbitrary grades and percentiles, AI personality/career interpretation, fake manual ads/countdown, synthetic engagement, and result telemetry. The 11.9 KB replacement explains browser/device timing limits with three direct sources and connects a private preflight to Japanese auto-start. The app records only view/start/complete stages and sends no round times, average, grade, or result values.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and old synthetic events. Use `content_view → content_ja_reaction_setup_view → content_ja_reaction_setup_use/content_cta_click → reaction_test_view → reaction_test_start → reaction_test_complete`; wait for 20 qualified views, then use 8% use/click-user rate, 50% linked-start, and 50% completion as initial diagnostics.

## Logging rule

새 항목은 아래 조건 중 하나일 때만 추가한다.

- 전략이나 우선순위가 바뀜.
- scan/bot 등 데이터 품질 결함을 새로 확인함.
- baseline 대비 의미 있는 변화가 생김.
- 계정/지급/정책 blocker가 바뀜.

상세 쿼리와 재사용 절차는 `dopabrain-growth-ops` Skill의 revenue reference를 따른다.
