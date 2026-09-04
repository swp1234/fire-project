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

## 2026-08-30 IQ puzzle completion reset

- `/iq-test` moved `6 → 10` equal-window Organic landing sessions and all ten recent sessions were engaged. Nine were Korean Naver entries (seven mobile, one desktop, one tablet); the remaining session was India desktop Bing. GSC returned no exact-page rows.
- Across 2026-07-05~08-29 the path had 71 page-view users, 25 test-start users, 16 question-answer users with 155 answers, and only 2 completions. The historical start-to-complete rate was 8%; old `page_engage`, timer/scroll engagement, per-answer values, completion score, and AI-analysis events are excluded from the new baseline.
- The UI claimed 12 locales, but all 20 random questions and choices were English, each had a 30-second timer, and a full run could take ten minutes. The replacement uses ten fixed number/symbol puzzles, no timer, real localized prompts and limits, one loader-only Auto Ads path, app-local caching, and private exact-once stage events. Answers, score, category counts, elapsed time, and result values are not transmitted.
- Observe 2026-08-31~09-06 KST; exclude deployment day, SG desktop Direct, and the legacy events above. Use `iq_puzzle_view → iq_puzzle_start → iq_puzzle_complete → iq_puzzle_related_click/iq_puzzle_share`; wait for 20 real views, then use the old 35% view-to-start only as context, 50% start-to-complete as the first repair threshold, and 8% complete-to-related-click as the revenue-path threshold.

## 2026-08-30 Spanish Blood Type trust reset

- `/portal/blog/es/blood-type-personality.html` held `6 → 6` equal-window Organic sessions. Across 56 days the guide had 12 content users and no CTA users; the app had 54 page users, 8 blood-type selectors, and all 8 selectors reached the result. First choice, not post-choice completion, was the bottleneck.
- The prior guide and app treated a cultural stereotype as personality, relationship, career, health and compatibility analysis; showed fabricated `89,000+` proof and a random percentile; kept stale premium/AI copy; rendered result details only in English; and transmitted the selected type in analytics.
- The replacement is a four-card culture/evidence path with a visible research boundary, 12 fully localized result bodies, generic share URLs, stage-only analytics, two direct research sources, one Auto Ads loader and app-scoped caching. The large-survey boundary is 10,000+ participants and less than 0.3% personality variance explained; the smaller study is presented as limited, not validation.
- Observe 2026-08-31~09-06 KST. Use `content_view → content_cta_click → blood_type_culture_view → blood_type_culture_open → blood_type_culture_related_click/blood_type_culture_share`; wait for 20 real app views, then use 25% first-open and 8% open-to-related-click as initial diagnostics. Exclude historical `page_engage`, `quiz_*`, `result_view`, `blood_type_select`, and synthetic ad events.

## 2026-08-30 Chinese zodiac pair reset

- `/portal/blog/zh/zodiac-compatibility-guide.html` held `6 → 6` equal-window Organic sessions. Across 56 days it had 25 pageview users, 20 qualified content users and no CTA users; the app had 67 page users but only 10 `zodiac_select` users. China desktop Bing supplied five of the six recent Organic sessions, so the route has discovery but weak guide-to-choice conversion.
- The prior app presented folklore as deterministic love, friendship and work scores, showed fabricated `5,280+` proof and a random percentile, transmitted selected signs, and mixed synthetic engagement/ad events into the funnel. The guide made stronger accuracy claims without a usable evidence boundary.
- The replacement is a 12-locale score-free conversation-card path backed by a 66,063-marriage/divorce study and a cross-cultural personality study. It keeps sign choices in browser memory, shares a generic URL, emits stage-only events, uses one Auto Ads loader and preserves app-scoped caching.
- Observe 2026-08-31~09-06 KST. Use `content_view → content_cta_click → zodiac_pair_view → zodiac_pair_start → zodiac_pair_open → zodiac_pair_related_click/zodiac_pair_share`; wait for 20 real app views, then use 25% view-to-start, 50% start-to-open and 8% open-to-related-click as diagnostics. Exclude legacy `page_engage`, `zodiac_select`, `zodiac_result_view`, timer/scroll and synthetic ad events.

## 2026-08-30 Chinese rejection-action reset

- `/portal/blog/zh/rejection-sensitivity-dysphoria.html` moved `8 → 7` equal-window Organic sessions, with 4/7 engaged sessions and 702 engagement seconds. Across 56 days it had 45 qualified content users and no CTA/action users. GSC returned no exact-page rows, so GA4 is the discovery baseline.
- The prior article framed RSD as a neurobiological disease, repeated a near-universal ADHD prevalence, asserted dopamine/amygdala mechanisms and medication effects beyond the available evidence, supplied a fixed episode duration, and gave a US-only crisis number to a Chinese-language audience.
- The replacement distinguishes the community/search label from researched rejection sensitivity and emotional dysregulation, names study design/sample limits, and links to one private now-next-later planner. The destination's invalid manual Auto Ads slot and synthetic paid-impression event were removed; entry attribution is allowlisted and private choices remain local.
- Observe 2026-08-31~09-06 KST. Use `content_view → content_zh_rejection_check_view → content_cta_click → emotion_action_view → emotion_action_generate → emotion_action_copy/emotion_action_used/emotion_action_related_click`; wait for 20 qualified check views, then use 8% CTA-user rate, 50% linked-view-to-generate and 8% generate-to-used/copy/related as diagnostics. Exclude historical synthetic ad and generic cross-promo events.

## 2026-08-30 English Jung shadow conversion reset

- The guide had 49 content users and 20 engaged users over 56 days but no valid next-action user; the latest two Organic users produced 410 engagement seconds. Exact-page GSC rows were absent.
- The app had 54 page users, 17 starts and 9 completions, but random percentiles, invented archetype measurement, result telemetry and mixed legacy events invalidated result-stage interpretation.
- The guide-to-app path now uses an evidence boundary, a published one-point-per-answer-direction formula and private stage-only telemetry. Observe 2026-08-31~09-06 KST and exclude deployment day plus all legacy quiz/result/ad events.
- First diagnostics after 20 qualified views: concept-to-CTA 8%, app view-to-start 25%, start-to-complete 50%, complete-to-share/related 8%.

## 2026-08-30 French cognitive-distortions conversion reset

- `/portal/blog/fr/cognitive-distortions-list.html` had 18 content users and 8 engaged users over 56 days but no valid action user. The latest 28 Organic days had 3 sessions, 2 engaged sessions and 620 engagement seconds; exact-page GSC rows were absent.
- The former 52.7 KB article mixed deterministic thought/brain claims, a hidden English FAQ and an unrelated Animal Personality CTA. The 14.9 KB replacement presents 15 non-diagnostic teaching categories, three direct NHS/WHO sources and a private facts/evidence/neutral-alternative check.
- Observe 2026-08-31~09-06 KST. Use `content_view → content_fr_thought_check_view → content_fr_thought_check_use/content_cta_click → stress_intro_view → test_start → test_complete`; after 20 qualified views, use 8% use/click-user rate, 50% linked-view-to-start and 50% start-to-complete as diagnostics. Exclude deployment day, SG desktop Direct and legacy/synthetic events.

## 2026-08-30 Spanish cognitive-distortions conversion reset

- `/portal/blog/es/cognitive-distortions-list.html` held `6 → 6` equal-window Organic landing sessions with 4/6 engaged. Recent entries were Mexico 3, Guatemala 1, Peru 1 and United States 1; across 56 days it had 18 content users and no valid action user. Exact-page GSC rows were absent.
- The former 54.2 KB page mixed deterministic brain/error claims, a hidden English FAQ, an unrelated Animal Personality CTA and synthetic ad telemetry. The 14.8 KB replacement presents 15 non-diagnostic categories, three direct NHS/WHO sources, a private three-step check and a Spanish Stress Check bridge; repeat Organic acquisition justified focused-sitemap inclusion.
- Observe 2026-08-31~09-06 KST. Use `content_view → content_es_thought_check_view → content_es_thought_check_use/content_cta_click → stress_intro_view → test_start → test_complete`; after 20 qualified views, use 8% use/click-user rate, 50% linked-view-to-start and 50% start-to-complete as diagnostics. Exclude deployment day, SG desktop Direct and legacy/synthetic events.

## 2026-09-01 revenue checkpoint and Korean test-picker reset

- Complete 2026-08-25~31 AdSense was `$0.67 / 1,950 PV / 756 impressions / 21 clicks / $0.34 RPM`, versus `$0.63 / 1,785 PV / 681 impressions / 11 clicks / $0.35 RPM` in the prior seven days. Revenue improved 6% but remains 48% of the `$1.40` target. US retained the best meaningful RPM at `$2.85`; KR and CN each earned `$0.18` at `$0.63` and `$0.30` RPM.
- 2026-08-31 GA4 contained 82 Singapore desktop Direct, 56 Singapore desktop Unassigned and 77 China Direct/Unassigned sessions with zero engaged sessions. These scan-like segments explain much of the pageview/RPM distortion and remain excluded from demand decisions.
- `/portal/blog/psychology-test-best.html` moved `0 → 5` equal-window Organic sessions, all South Korea/Naver, with 2 engaged sessions and no valid action. The 74.1 KB page mixed fabricated popularity, accuracy, diagnosis, healing-frequency and scientific-compatibility claims. It is now a 14.6 KB private purpose picker with five visible boundaries and focused-sitemap inclusion.
- Release verification found a real live-only denominator defect: the ad loader could shift the qualified heading below the fold after IntersectionObserver had already disconnected. Commit `07c6fe1` keeps observation active until 50% visibility is continuous for 500 ms; the dedicated 13-mutation verifier passed locally and live at 390/1440px, and full harness `2026-09-01T07-05-41-417Z` passed with 51 submitted URLs / 0 issues.
- Observe 2026-09-02~09-08 KST. Use `content_view → content_ko_test_picker_view → content_ko_test_picker_use → content_cta_click`; after 20 qualified views, use 25% picker-use, 25% use-to-CTA and 55% Organic engagement as diagnostics. GSC discovery is a separate outcome because the five baseline entries were Naver-only.

## 2026-09-01 Search Console discovery queue reset

- Search Console still showed the pre-focus submissions: root `174` rows last downloaded 2026-06-05, portal `1,940` last downloaded 2026-08-08, and blog `1,770` last downloaded 2026-05-14. All showed indexed `0`, while the live focused XML had only `18 / 10 / 26` rows and 51 unique URLs.
- URL Inspection sampled eight priority URLs. The homepage was submitted and indexed; Stress Check, HSP, 2048, the Korean psychology picker, Spanish cognitive distortions and English shadow reflection were `Crawled - currently not indexed`; Culture Signal was unknown to Google. Every crawled sample was fetchable, indexing-allowed and canonical-consistent.
- The GSC MCP submission tool returned 403 because package `mcp-server-gsc@0.3.0` hardcodes `webmasters.readonly` even for its write method. The repository's fixed-allowlist submitter used the same `siteFullUser` service account with the official `webmasters` scope. At 2026-09-01 07:24 UTC, Search Console accepted and downloaded all three live queues with submitted counts `18 / 10 / 26` and 0 warnings/errors.
- Observe 2026-09-02~09-08 KST for newer priority-route crawl times, a first newly indexed non-home sample and Culture Signal discovery. This is a discovery reset, not evidence that the pages will rank; do not change the observation pages solely because the sitemap report still displays indexed `0` immediately after submission.

## 2026-09-01 ad delivery and IndexNow acquisition audit

- AdSense account/site/client were READY, Auto Ads was enabled and policy issues were empty. The severe address-PIN alert is a payout hold, not a serving defect; the AFS partner client requiring review is separate from the READY AFC content client.
- Recent raw delivery was `12,973 requests / 1,353 matched / 756 impressions / 10.43% coverage`; the prior week was `12,567 / 1,331 / 681 / 10.59%`. Singapore alone produced 5,541 requests, 287 matches, 1 impression and `$0.00`, explaining much of the apparent coverage failure. KR/US/JP coverage was 30.6%/47.3%/62.0%; do not increase ad density or change Auto Ads based on the global ratio.
- Valid Organic discovery is currently led by Naver and Bing-family sources. The existing public IndexNow key passed live validation, and the new fixed-host submitter accepted only explicit clean canonical changes. The Korean psychology picker was the sole first submission because it was updated today; `api.indexnow.org` returned HTTP 200.
- Observe 2026-09-02~09-08 KST for Bing/Naver Organic sessions and engagement on that page. Do not resend unchanged URLs: IndexNow receipt only proves notification and repeated submissions do not accelerate indexing.

## 2026-09-01 Japanese Minesweeper guide-to-play reset

- The Japanese guide moved `3 → 4` equal-window Organic landing sessions; all seven sessions across both windows were engaged and recent engagement time rose `90 → 141` seconds. Across 56 days it had 10 content users but no valid action. Six users instead fired a stale Palworld bridge event from generic cross-promo, so that event is excluded.
- The former guide promised broad mastery and probability tactics without a usable action path. The destination compounded the problem with an unverifiable `4.5 / 4,200` rating, hidden FAQ, invalid manual Auto Ads units, duplicate page view, result-bearing share text and broad PWA paths.
- The replacement teaches two count-derived rules and links directly to an allowlisted Japanese game entry. Guide interaction and game telemetry are stage-only: no example answer, cell, board, difficulty, time or win/loss value is sent. The app retains the official H5 natural-break/reward module but removes invalid manual AdSense surfaces.
- Observe 2026-09-02~09-08 KST and exclude deployment day, SG desktop Direct, old `content_ad_impression`, generic cross-promo and legacy page-view events. Use `content_view → content_ja_minesweeper_rule_view → content_ja_minesweeper_rule_use/content_cta_click → minesweeper_view → minesweeper_start → minesweeper_complete`; wait for 20 qualified guide views, then use 25% rule-use, 8% game click, 50% view-to-start and 25% start-to-complete as initial diagnostics.

## 2026-09-01 Chinese free-games controls reset

- `/portal/blog/zh/free-games.html` moved `3 → 6` equal-window Organic sessions. Recent valid acquisition was five China desktop and one China tablet Bing-family session; 4/6 engaged. The 56-day path had two valid CTA users, but 58 synthetic `content_ad_impression` users and 35 unrelated Palworld bridge-view users made the old event set unusable.
- The 62.4 KB TOP/ranking page is now a 12.5 KB control-based selector for 2048, Minesweeper, Stack Tower, Emoji Merge and Idle Clicker. All five local destinations support `?lang=zh`; filter choice stays private, while clicked game slug is a non-sensitive destination dimension.
- Observe 2026-09-02~09-08 KST. Use `content_view → content_zh_game_filter_view → content_zh_game_filter_use/content_game_click`; wait for 20 qualified filter views, then use 25% filter-use, 8% game-click-user and 55% China Organic engagement as first diagnostics. Exclude deployment day, SG desktop Direct and all legacy synthetic/cross-promo events.

## 2026-09-01 Spanish tarot repeated-user anomaly

- The apparent `8 → 24` Organic-session growth on `/portal/blog/es/lectura-tarot-diario-guia.html` came from one recurring Edge desktop pattern in Ciudad Obregón, Mexico across 18 dates. The recent 24 sessions had only 166 total engagement seconds and approximately one repeated active user per date.
- Do not promote or rebuild the tarot guide from this count. Treat it as repeated-user/automation-like concentration until independent users, devices or locations appear; SG desktop Direct remains excluded separately.

## 2026-09-01 Indonesian 6/45 random-path reset

- `/portal/blog/id/lottery-number-guide.html` changed from no prior valid acquisition to four engaged Organic sessions in the latest 28-day window: three Indonesia mobile DuckDuckGo sessions with 721 engagement seconds and one Indonesia desktop Bing session with 19 seconds. One engaged Indonesia mobile ChatGPT referral added 14 seconds. Direct sessions were excluded.
- Across 56 days the guide had 10 users but only synthetic `content_ad_impression` and broad cross-promo signals; the destination had 42 page-view users and 39 synthetic `page_engage` users but no generation, completion or share event. The old funnel therefore cannot establish tool use.
- The article's hot/cold-number, syndicate, rollover value and winning-strategy material was replaced with the exact 6/45 combination boundary. The app's `Math.random`, simulated prizes, fake AI/frequency output, fabricated rating/FAQ and root-scope cache were removed. The deployed path uses unbiased Web Crypto sampling, local-only explicit favorites and stage-only analytics.
- Observe 2026-09-02~09-08 KST. Use `content_view → content_lottery_method_view/content_cta_click → lottery_random_view → lottery_random_generate → lottery_random_save/lottery_random_share/lottery_random_related_click`; wait for 20 qualified method views, then use 8% guide CTA, 25% app view-to-generate and 8% post-generate action as diagnostics. Exclude deployment day, Direct/Unassigned scans and all legacy synthetic/ad/statistics events.

## 2026-09-01 Chinese game catalog → Block Puzzle reset

- `/portal/blog/zh/dopabrain-games-2026.html` moved `3 → 6` across equal 28-day Organic landing windows. All six recent sessions were China desktop Bing entries, five were engaged, and total engagement was 265 seconds. Exact-page GSC rows were absent.
- Across 56 days the guide had 41 page users, but 39 users fired synthetic `content_ad_impression`. Valid `content_cta_click` destinations showed Block Puzzle as the only repeated choice: 6 events / 4 users, versus one user each for idle-clicker, sky-runner and word-guess.
- Block Puzzle had 48 page users but only 4 `game_start` users and 2 `game_over` users; those legacy events were mixed with 31 synthetic `page_engage` users and transmitted score. The app also exposed fake rating/FAQ proof, fake ad surfaces, a score-doubling reward and broad root caching, so historical completion/revenue inference is invalid.
- The released path preserves the observed Block Puzzle choice, presents four non-ranked Chinese entries and resets the app to private exact-once stages. Observe 2026-09-02~09-08 KST using `content_view → content_zh_game_catalog_view/content_game_click → block_puzzle_view → block_puzzle_start → block_puzzle_complete → block_puzzle_share/block_puzzle_related_click`; wait for 20 qualified catalog views, then use 8% game-click, 25% view-to-start and 25% start-to-complete as initial diagnostics. Exclude deployment day, Direct/Unassigned scans and all legacy synthetic/score events.

## 2026-09-01 French developer guide → Developer Quiz reset

- `/portal/blog/fr/guide-quiz-developpeur.html` moved `3 → 4` across equal 28-day Organic landing windows. All four recent sessions engaged for 288 seconds; sources were France desktop Bing (2), Brazil desktop Bing (1) and France mobile Bing (1). URL Inspection reported `Crawled - currently not indexed`, with successful fetch, allowed robots and last crawl on 2026-03-23.
- Across 56 days the guide had nine content users and five CTA users producing ten direct `/dev-quiz/` clicks. The destination had 39 page users but no valid start or completion event; 34 users fired synthetic `page_engage` and 31 received generic cross-promo. The guide-to-app bridge therefore showed intent while the destination remained unmeasurable.
- The app's advertised 12-language surface actually served 100 Korean core questions and mixed fabricated `4.6 / 1,200` proof, hidden FAQ, fake interstitial explanations, daily challenge state and score-bearing sharing/telemetry. It is now a deterministic ten-question practice in 12 localized shells with visible result/privacy/ad boundaries, neutral sharing, official completion-break ads only and app-local caching.
- Observe 2026-09-02~09-08 KST using `content_view → content_fr_dev_quiz_view/content_cta_click → dev_quiz_view → dev_quiz_start → dev_quiz_complete → dev_quiz_share/dev_quiz_related_click`. Wait for 20 qualified guide views, then use 8% guide CTA, 25% app view-to-start, 50% start-to-complete and 8% post-completion action as initial diagnostics. Exclude deployment day, Direct/Unassigned scans and all legacy synthetic, answer, score and cross-promo events.

## 2026-09-01 English past-life birthday guide → story journey reset

- `/portal/blog/en/past-life-calculator-birthday.html` moved `16 → 3` across equal 28-day Organic landing windows. All three recent sessions engaged and came from distinct Bing segments: Bangladesh desktop, Cayman Islands desktop and United States mobile. Search Console returned no exact-page row; URL Inspection reported `Crawled - currently not indexed`, successful fetch, allowed indexing and canonical agreement, with the last crawl on 2026-05-21.
- Across 56 days the guide had 51 content users, eight valid quick-path users and three CTA users. The destination had 62 page users, 16 start users and 10 completion users; four users saved and two shared. The 62.5% start-to-complete rate supported preserving the core engine rather than rebuilding the journey logic.
- The apparent runtime emergency was not persistent: all 271 `exception` events occurred on 2026-08-06 across 12 users, while a current live six-scene completion produced no exception event or page error. It remains excluded from the new funnel. Verified defects were fabricated rating/participant proof, hidden FAQ, manual ad/fake impression surfaces, result-bearing analytics/share, invented compatibility/percentile claims and unsafe broad caching.
- Observe 2026-09-02~09-08 KST using `content_view → content_en_past_life_method_view/content_cta_click → past_life_view → past_life_start → past_life_complete → past_life_share/past_life_related_click`. Wait for 20 qualified guide views, then use 8% guide CTA, 25% app view-to-start, 50% start-to-complete and 8% post-completion action as diagnostics. Exclude deployment day, SG desktop Direct, the one-day exception burst and all legacy synthetic/result/ad/cross-promo events.

## 2026-09-01 Chinese MBTI city guide → city match reset

- `/portal/blog/zh/mbti-city-chengshi-xingge.html` moved `1 → 3` across equal 28-day Organic windows. Recent entries were China mobile/tablet and Hong Kong mobile Bing sessions; all engaged for 30–222 seconds. Across 56 days, 46 content users produced five CTA users. Search Console had no exact row, while URL Inspection reported crawled-currently-not-indexed with successful fetch, allowed indexing, canonical agreement and last crawl 2026-03-28.
- `/mbti-city/` had 76 page users but no valid start or completion stage. A reproduced source defect called nonexistent `i18n.translateDOM` during completion. The old shell also contained fabricated `15,200+`, `4.3 / 1,260`, random rarity, hidden FAQ, manual ad and synthetic engagement surfaces.
- The release preserves the eight-question/four-axis deterministic engine and resets the destination contract to private exact-once stages. Observe 2026-09-02~09-08 KST using `content_view → content_zh_mbti_city_boundary_view/content_cta_click → mbti_city_view → mbti_city_start → mbti_city_complete → mbti_city_share/mbti_city_related_click`. Wait for 20 qualified boundary views, then use 8% guide CTA, 25% app view-to-start, 50% start-to-complete and 8% post-completion action. Exclude deployment day, Direct/Unassigned scans and all legacy synthetic, result, rarity and cross-promo events.

## 2026-09-01 Korean emotion-regulation guide → action planner reset

- `/portal/blog/ko/emotional-regulation-techniques.html` moved `1 → 4` across equal 28-day Organic landing windows. The recent sessions were South Korea desktop Bing entries and all engaged for 23–67 seconds. Search Console returned no exact-page row; URL Inspection reported `Crawled - currently not indexed`, successful fetch, allowed indexing, canonical agreement and last crawl 2026-04-04.
- Across 56 days the guide had six content users and four `emotion_action_bridge_view` users, but no content CTA or bridge click. The planner had 35 page users and no generate stage; its historical 35 `emotion_action_ad_impression` users came from retired synthetic telemetry and are excluded. The weak injected bridge cannot establish tool demand.
- The 46.2 KB article asserted exact efficacy percentages, brain rewiring and treatment timing, exposed hidden FAQ/synthetic ad telemetry and sent three primary CTAs to an unrelated EQ test. The 13.7 KB replacement uses WHO/NHS actions and narrowly describes one affect-labeling laboratory study without extending it to treatment effectiveness. The planner source is allowlisted and private query values are removed before analytics.
- Release `6eaee94` passed the complete local harness and live 12-language 390/1440px linked journeys. IndexNow accepted only the changed guide/planner URLs, and Search Console downloaded `18 / 10 / 33` focused rows with zero warnings/errors.
- Observe 2026-09-02~09-08 KST using `content_view → content_ko_emotion_action_view/content_cta_click → emotion_action_view → emotion_action_generate → emotion_action_copy/emotion_action_used/emotion_action_related_click`. Wait for 20 qualified action views, then use 8% guide CTA, 25% linked-view-to-generate and 8% post-generate action as initial diagnostics. Exclude deployment day, Direct/Unassigned scans, `emotion_action_bridge_*`, synthetic ad events and all selection/result values.

## 2026-09-01 French Minesweeper guide → verified game path reset

- `/portal/blog/fr/minesweeper-strategy.html` moved `2 → 5` across equal 28-day Organic landing windows. Recent acquisition was France mobile DuckDuckGo (1 engaged), Russia mobile DuckDuckGo (2 non-engaged) and France mobile Ecosia (2 sessions / 1 engaged user). Search Console returned no exact-page row; URL Inspection reported `Crawled - currently not indexed`, successful fetch, allowed indexing, canonical agreement and last crawl 2026-04-01.
- Across 56 days the page had 14 content users and no valid game CTA. Fourteen users fired retired `content_ad_impression` and `cross_promo_view`; six received an unrelated Palworld bridge. The old page routed its only primary play button to the homepage and claimed complete mastery, every-board resolution and cognitive improvement from daily play.
- The 15.9 KB replacement teaches two deterministic counting rules, a private practice choice and visible DopaBrain first-click/hint/random-board boundaries. The existing 12-language app now allowlists `fr_minesweeper_guide` alongside the Japanese source and provides a measured French return route; board, result, difficulty and time remain out of analytics.
- App release `ef08e45` and Portal release `d58965c` passed the complete local harness and live French/Japanese 390/1440px journeys. IndexNow accepted only the changed guide/game URLs, and Search Console downloaded `18 / 10 / 34` rows with zero warnings/errors.
- Observe 2026-09-02~09-08 KST using `content_view → content_fr_minesweeper_rule_view/content_fr_minesweeper_rule_use/content_cta_click → minesweeper_view → minesweeper_start → minesweeper_complete → minesweeper_share/minesweeper_related_click`. Wait for 20 qualified rule views, then use 25% practice-use, 8% game CTA, 25% app view-to-start and 25% start-to-complete as diagnostics. Exclude deployment day, Direct/Unassigned scans and all legacy synthetic/cross-promo events.

## 2026-09-01 Indonesian emotion-regulation guide → action planner reset

- `/portal/blog/id/emotional-regulation-techniques.html` recorded 10 Organic sessions, 9 engaged sessions, 6 users and 1,630 engagement seconds across 2026-07-07~08-31. Equal 28-day windows were `6 → 4` sessions and `5 → 4` engaged sessions, so traffic did not grow but remained independently engaged. Search Console returned no exact-page row; URL Inspection reported `Crawled - currently not indexed`, successful fetch, allowed indexing, canonical agreement and last crawl 2026-03-31.
- Across the same 56 days, 12 content users generated nine `emotion_action_bridge_view` users but no bridge or content CTA click. Indonesia produced `$0.04 / 276 PV / $0.13 RPM` at account-country level, which is only a revenue proxy; the reason to release this path is the repeated engaged traffic plus a zero-action bottleneck, not RPM.
- The old 47.8 KB page asserted exact anxiety/depression, cortisol and amygdala effects, brain restructuring and 4–8 week improvement, while routing primary action to an unrelated EQ test. It also exposed hidden FAQ, synthetic `content_ad_impression`, raw link telemetry and generic cross-promo. The 13.2 KB replacement uses bounded WHO/NHS self-management guidance and two source-attributed planner CTAs.
- The destination previously rendered only a few Indonesian labels and fell back to English for most UI and every generated action. Release `eea66a1` localizes the full shell and action library, allowlists only `id_emotion_regulation_guide`, sanitizes query/hash data before analytics and keeps selections/results private. Dedicated mutations passed `15/15`; full harness `2026-09-01T12-06-44-705Z`, live 390/1440px journeys, IndexNow HTTP 200 and Search Console `18 / 10 / 35` with zero errors all passed.
- Observe 2026-09-02~09-08 KST using `content_view → content_id_emotion_action_view/content_cta_click → emotion_action_view → emotion_action_generate → emotion_action_copy/emotion_action_used/emotion_action_related_click`. Wait for 20 qualified action views, then use 8% guide CTA, 25% linked-view-to-generate and 8% post-generate action as initial diagnostics. Exclude deployment day, Direct/Unassigned scans, `emotion_action_bridge_*`, synthetic ad events and every selection/result value.

## 2026-09-01 English Future Self guide → transparent story reset

- `/portal/blog/en/future-self-prediction-quiz.html` moved `1 → 5` across equal 28-day Organic landing windows. Recent Organic entries were India 2, Nigeria 2 and United States 1, with three engaged sessions, 172 engagement seconds and four users. Across 56 days the same three countries contributed six Organic sessions; 12 content users produced one CTA user and two test-click users, so the direct route had evidence despite small discovery. Ukraine AI-assistant traffic and Singapore/Direct traffic are excluded.
- Search Console had no exact performance row. URL Inspection reported `Crawled - currently not indexed`, successful fetch, allowed indexing and canonical agreement, with the last crawl on 2026-05-09. The old 33.4 KB page claimed AI-powered accurate prediction across career, health, finances and relationships, while carrying hidden FAQ, synthetic `content_ad_impression`, raw-link telemetry and generic cross-promo.
- Release `f234acb` replaces it with a 15.0 KB fixed-rule reflection: eight choices assign two points each across eight fictional themes, ties use a published order, and two English auto-start CTAs preserve `en_future_self_guide` attribution without answers or results. Dedicated mutations passed `13/13`; full harness `2026-09-01T12-27-03-843Z`, live 390/1440px completion, IndexNow HTTP 200 and Search Console `18 / 10 / 36` with zero errors all passed.
- The first live run timed out because Auto Ads inserted a 390px mobile surface after `DOMContentLoaded` and moved the qualified card away before the continuous 500 ms threshold. The event correctly cancelled. The verifier now waits for layout settlement, re-centres the card if needed and still requires exact-once 50%/500ms exposure; local mutation and production journeys pass.
- Observe 2026-09-02~09-08 KST using `content_view → content_en_future_self_method_view/content_cta_click → test_start → test_complete → share/related_click`. Wait for 20 qualified method views, then use 8% guide CTA, 50% linked start-to-complete and 8% post-completion action as initial diagnostics. Exclude deployment day, SG Direct, AI-assistant acquisition and all legacy synthetic ad/cross-promo events.

## 2026-09-01 German emotion-regulation guide → action planner reset

- `/portal/blog/de/emotional-regulation-techniques.html` moved `0 → 3` across equal 28-day Organic landing windows. The recent entries were Germany mobile Ecosia 2 and Germany desktop Bing 1; all three engaged for a combined 187 seconds. Search Console returned no exact performance row; URL Inspection reported `Crawled - currently not indexed`, successful fetch, allowed indexing, canonical agreement and last crawl 2026-05-18.
- Across 56 days, nine content users produced three `emotion_action_bridge_view` users but no content CTA or planner click. One user generated two old `content_test_click` events toward a generic test rail; nine users also saw generic cross-promo and eight saw retired synthetic `content_ad_impression`, all excluded from the new baseline.
- The 49.7 KB page claimed brain-structure change, 25–30% symptom reduction, exercise comparable to medication, up to 40% amygdala effects and measurable improvement in 4–8 weeks. It also exposed an English hidden FAQ, unrelated EQ-test CTAs, raw link URLs and generic cross-promo. The 13.3 KB replacement limits its claims to general WHO and gesund.bund.de self-management, treatment and German crisis-routing guidance.
- Release `2eb66b5` fully localizes the planner shell, options, safety/privacy copy and generated action library, allowlists only `de_emotion_regulation_guide`, sanitizes query/hash data before analytics and keeps selections/results private. Dedicated mutations passed `16/16`; full harness `2026-09-01T12-54-14-509Z`, live 390/1440px journeys, IndexNow HTTP 200 and Search Console `18 / 10 / 37` with zero errors all passed.
- Observe 2026-09-02~09-08 KST using `content_view → content_de_emotion_action_view/content_cta_click → emotion_action_view → emotion_action_generate → emotion_action_copy/emotion_action_used/emotion_action_related_click`. Wait for 20 qualified action views, then use 8% guide CTA, 25% linked-view-to-generate and 8% post-generate action as initial diagnostics. Exclude deployment day, Direct/Unassigned scans, `emotion_action_bridge_*`, synthetic ad/cross-promo events and every selection/result value.

## 2026-09-05 invalid-traffic inventory and Minesweeper containment

- A tracked-source inventory now classifies active loaders separately from policy-risk behavior. Before this release it scanned 119 projects and returned `critical 20 / high 40 / medium 6 / info 52 / clean 1`. Its 8/8 self-test covers comment decoys, an informational Auto Ads loader, incentivized score reward, self-declared completion unlock, manual unit/push, clean suspension and suspension-code conflict. It reads only each child repository's `git ls-files`, so user-untracked Attachment clarity files stay excluded without hiding the deployed Attachment project.
- Recent 28-day GA4 placed `/minesweeper/` first among critical app routes with 67 page views, 40 sessions and 28 engaged sessions. This was not search demand: China desktop Direct supplied `61 PV / 35 sessions / 26 engaged`, Singapore desktop Direct `3 / 3 / 0`, South Korea desktop Direct `2 / 1 / 1`, and Spain desktop Organic Search only `1 / 1 / 1`. The route is therefore treated as an invalid-traffic exposure surface, not a growth winner.
- The app loaded Auto Ads plus the H5 Games ad module, delayed the result behind an interstitial callback and offered a loss-only “Watch Ad for 2nd Chance” control that restored the board and timer. Release `564fcf3` removes the loader, game-ad module, reward handler and obsolete ad CSS, applies the invalid-traffic suspension marker and shows the existing result immediately. Game logic, hints, records, 12 locales and private stage telemetry remain intact.
- The release reduced the portfolio inventory to `critical 19 / high 40 / medium 6 / info 52 / clean 2`. Japanese mutations passed 18/18 and French mutations 17/17; both local and production 390/1440px journeys verified no ad element, no `GameAds` runtime and no reward control after a forced loss. GitHub Pages run `33887455042` succeeded.
- The completed 2026-08-29~09-04 AdSense window was `$0.63 / 2,115 PV / 644 impressions / 14 clicks`, or `$0.090/day`. The `SEVERE / adsense-traffic-throttled` alert remained on 2026-09-05. IndexNow and GSC submission were intentionally skipped because containment should not expand discovery and no sitemap changed.
- The first full harness correctly failed after the KST date rollover because Animal Personality still declared `dateModified=2026-06-06`, although commit `7fb458c` had removed fabricated rating schema on 2026-08-30. Release `3d6b1ec` uses that real commit date rather than claiming a fresh edit. The final integrated harness `2026-09-04T15-17-12-519Z` passed every stage, including analytics 9/9, runtime 6/6, ad-risk behavior 8/8 and submitted inventory 63/0.

## Logging rule

새 항목은 아래 조건 중 하나일 때만 추가한다.

- 전략이나 우선순위가 바뀜.
- scan/bot 등 데이터 품질 결함을 새로 확인함.
- baseline 대비 의미 있는 변화가 생김.
- 계정/지급/정책 blocker가 바뀜.

상세 쿼리와 재사용 절차는 `dopabrain-growth-ops` Skill의 revenue reference를 따른다.

## 2026-09-01 French attachment reflection reset

- Equal 28-day Organic landing sessions for `/portal/blog/fr/attachment-style-test-quiz.html` moved `6 → 4`. The prior window included France, Belgium and Canada; the recent window was four France mobile Ecosia sessions with two engaged sessions, three users and 191 engagement seconds. Across 56 days the page had 19 content users, four CTA users and one test-click user, which supports preserving the query and direct destination rather than suppressing it.
- Search Console had no exact performance row and URL Inspection reported `Explorée, actuellement non indexée`; the last crawl was 2026-05-07, while robots, fetch and canonical selection were valid. The focused sitemap row now carries 2026-09-01 lastmod and both changed canonical URLs received IndexNow HTTP 200.
- The old 52.0 KB guide treated childhood as a lifetime blueprint, asserted fixed type shares and relationship outcomes, suggested treatment paths, exposed hidden English FAQ and emitted synthetic ad/generic cross-promo telemetry. The 14.7 KB replacement uses the ECR-R author's 36-item anxiety/avoidance documentation and primary sources to bound DopaBrain's ten-scenario activity as non-validated reflection.
- New observation funnel: `content_view → content_fr_attachment_boundary_view → content_cta_click → attachment_reflection_view → attachment_reflection_start → attachment_reflection_complete → attachment_reflection_share/attachment_reflection_related_click`. Exclude historical synthetic ad and generic cross-promo events. Do not judge before 20 qualified boundary-view users; first diagnostics are 8% qualified-view-to-CTA users and 50% linked-view-to-completion.
- Releases: attachment app `d4c927f` / Pages `33514020326`; portal `ce13694` / Pages `33514118925`. Full harness `2026-09-01T13-20-16-180Z` passed, including 13/13 targeted mutations, analytics 9/9, runtime 6/6 and focused inventory 62/0.

## 2026-09-03 English HSP coping action-path reset

- Complete-day AdSense comparison: 2026-08-27~09-02 produced `$0.55 / 2,139 PV / 708 impressions / 16 clicks / $0.26 Page RPM`; 2026-08-20~08-26 produced `$0.76 / 1,588 / 775 / 18 / $0.48`. The extra volume did not improve revenue. Singapore desktop alone produced 590 PV, four impressions, `$0`, 5,699 requests and 310 matches, so it remains excluded as scan-like traffic.
- `/portal/blog/en/hsp-coping-strategies-highly-sensitive.html` moved from 2 to 5 equal-window Organic sessions and had three sessions in the latest seven days. Its 56-day Organic mix included recurring US/UK Bing plus one long Serbia Ecosia visit: 7 sessions, 4 engaged. Across all traffic, 59 page users produced no valid reset, map, test or CTA action.
- The 42,165-byte page mixed fixed prevalence, universal brain-language, treatment-like advice, hidden FAQ, synthetic ad measurement and generic promotion. The 13,668-byte replacement provides one three-step sensory plan, two identical private Reset entries, one Map route and one non-diagnostic reflection route. Three direct research sources visibly bound the SPS construct and the 18-person/13-repeat task-fMRI evidence.
- New measurement contract: `content_view -> content_en_hsp_coping_plan_view -> content_cta_click -> sensory_reset_view -> sensory_reset_generate`; the qualified guide view requires continuous 50% visibility for 500 ms. Selection values remain out of URLs and analytics. Historical bridge-view and synthetic ad events are not comparable.
- Portal `118ca49` deployed successfully. The dedicated verifier detected 14/14 mutants and passed local/live 390/1440px guide qualification, click deduplication, URL sanitation, Reset generation and Map load. Full harness `2026-09-03T13-49-18-607Z` passed with analytics 9/9, runtime 6/6 and focused inventory 63/0. IndexNow accepted only the changed canonical; Search Console accepted the three verified `18 / 10 / 38` sitemap queues once.
- Observe complete days 2026-09-04~09-10. Do not judge before 20 qualified plan-view users. First diagnostics: 8% qualified-view-to-CTA, 25% linked Reset view-to-generate and 55% non-SG Organic engagement.

## 2026-09-03 Stress Check result-action reset

- In the latest 28 days, Stress Check recorded 79 `stress_intro_view` users, 79 `stress_intro_cta_view` users, 26 `stress_intro_start_click`/`test_start` users, 11 `test_complete` users and one `stress_plan_click` user. Organic landing traffic was 25 sessions / 21 engaged; the latest seven days were 5/5 engaged across the United States, India, South Korea and Sri Lanka. The first bottleneck is therefore result-to-action conversion, not initial search engagement.
- The previous result placed a percentage gauge and category/tip blocks before the plan action, then offered image save/share, nine related tests, four SEO links, six dynamic recommendations and generic cross-promo. The reset keeps the 15-question/12-language search identity but places one semantic 7-day-plan link immediately after the result boundary and retains only HSP and Stress Response as focused alternatives.
- New measurement contract: `stress_intro_cta_view -> stress_intro_start_click -> test_complete -> stress_result_action_view -> stress_plan_click`. The action view requires continuous 50% visibility for 500 ms; start, action view and click are exact-once. Answers, totals, categories and display bands remain out of URLs and analytics. Historical synthetic `stress_ad_impression` and `page_engage` are excluded.
- Stress Check `a174424` passed 16/16 targeted mutations, all 12 locale result renders, complete 15-question mobile/desktop journeys, plan persistence and live Chinese/French/Spanish/Doomscroll entries. Full harness `2026-09-03T14-25-17-423Z` passed with analytics 9/9, runtime 6/6 and focused inventory 63/0. IndexNow accepted only `https://dopabrain.com/stress-check/`; no sitemap changed, so GSC was not resubmitted.
- The first French live check falsely reported 310 px overflow because its verifier appended the guide route to the full guide URL and tested a 404 path. The verifier now validates the exact canonical, derives the origin and then appends the route; local 10/10 mutations and live 390/1440px journeys pass. This was a verifier defect, not a production layout defect.
- Observe complete days 2026-09-04~09-10. Do not judge before 20 qualified result-action views. First diagnostics: 40% intro-view-to-start, 50% start-to-complete and 25% action-view-to-plan-click. Exclude deployment day, Singapore desktop Direct scans and all legacy synthetic/ad/result-value events.

## 2026-09-04 AdSense invalid-traffic containment and EQ reset

- The user supplied an AdSense notice showing ad serving limited for invalid-traffic concerns from 2026-09-03. Read-only API confirmation returned `SEVERE / adsense-traffic-throttled`; the policy-issues collection was empty. The address-PIN payout hold remains a separate alert.
- Complete 2026-08-28~09-03 performance was `$0.64 / 2,211 page views / 724 impressions / 17 clicks`, or `$0.091/day`. The last 30 complete days earned `$3.19` (`$0.106/day`). Partial 2026-09-04 was `$0.04 / 237 PV / 44 impressions / 1 click` and is not compared with complete days.
- Account CTR for 2026-08-28~09-04 was 0.74%, but small-country concentrations were abnormal: Canada 3 clicks / 7 PV, Germany 2/16, Ecuador 1/10 and Great Britain 1/12. This supports interaction-placement containment rather than a country-wide content decision.
- A production-source scan found 54 files with manual AdSense units, 49 with direct pushes and several game/result flows exchanging ads for scores, lives or fabricated premium output. Traffic expansion, ad-density experiments, IndexNow and GSC resubmission are paused while the restriction is active.
- `/eq-test/` was the first containment release because it combined 125 recent page views, 53 completers, three manual ad units, direct push code, fabricated premium/AI output, a random percentile and result-bearing analytics. Release `c9a1257` removes all AdSense code from the page, applies `data-ad-serving="suspended-invalid-traffic-2026-09-03"`, retains 10 fixed scenarios/12 locales and reframes the output as author-defined scenario points rather than validated EQ.
- The new result path is `eq_test_start -> eq_test_complete -> eq_result_action_view -> eq_next_click`, with two stable related targets. Answers, scores, bands and URLs remain private. The qualified action view requires continuous 50% visibility for 500 ms.
- The dedicated verifier detected 20/20 injected defects and passed local and production 390/1440px journeys, all 12 locales and the allowlisted Spanish auto-start. The common analytics smoke passed 9/9 and submitted inventory remained 63/0.
- The final integrated harness `2026-09-04T14-43-45-825Z` passed every stage, including analytics 9/9 and runtime 6/6.
- Full-harness testing exposed two validator defects: Blood Type used `listen(0)` and occasionally selected Chromium-blocked port 5061; the shared safe-port allocator now fixes it. The analytics smoke still expected the retired fake EQ AI button; it now exercises the real start-to-complete-to-qualified-action-to-click funnel.
- Do not judge EQ revenue while its ad serving is deliberately suspended or while the account is throttled. Resume discovery and monetization experiments only after the account alert clears and the high-risk interaction inventory is contained.
