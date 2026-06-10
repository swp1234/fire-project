# 프로젝트 진행 상황

> 매 세션마다 자동 업데이트. **마지막:** 2026-06-10 (Session 433: AdSense OAuth Keepalive Research)

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 총 프로젝트 | **109개** (projects/ 109 디렉토리, 앱 109 + portal + _common) |
| 지원 언어 | 12개 (ko/en/zh/hi/ru/ja/es/pt/id/tr/de/fr) |
| 블로그 | **1565개** |

**앱 분류:** 유틸 12 / 바이럴 테스트 **58** / 게임 **21** / 도구 13 / 웹 2 / 운세 **4** / 신규 10

---

## 인프라 현황

| 항목 | 상태 |
|------|------|
| 호스팅 | dopabrain.com (Cloudflare, HTTPS, GitHub Pages) |
| 수익화 | **AdSense 승인완료** — 전앱 스크립트 + 10개 인기앱 수동 배치 + **eq-test AI 프리미엄 실험** |
| 분석 | GA4 + GSC + MCP 8개 (on-demand: gemini/gemini-image/reddit/twitter/youtube/trends) |
| 크로스프로모 | **99/99앱** 2x2 그리드 카드 완료 + cross-promo.js 동적 위젯 |
| i18n/FOUC/라이트모드 | **전앱+허브 완료** |
| SEO 스키마 | FAQPage **106/106 (100%)**, BreadcrumbList **106/106 (100%)**, JSON-LD 전앱 |
| 카테고리 허브 | Games(21), **Tests(41)**, Tools, MBTI (4개 랜딩페이지) |
| OG 이미지 | **107개 앱별 1200×630 PNG** (전앱 완료) + 470+블로그 교체 완료 |
| 런타임 검증 | **Playwright 스모크 테스트 + analytics event harness** + 게임 루프 try-catch **21/21** 게임 |
| 하네스 | pre-push quality gate, failure logging, MCP on-demand, TeamCreate/TaskCreate/CronCreate |
| 멀티디바이스 | 루트 repo GitHub private (`swp1234/fire-project`) — 데스크톱↔노트북 동기화 |
| 기타 | 커스텀 404, 블로그 인덱스 12개 언어, 사이트맵 **1669 URLs**, 피드백 페이지 |

**URL:** `/` → `/portal/` → `/[앱]/` → `/portal/blog/{lang}/` → `/portal/games/` → `/portal/tests/` → `/portal/mbti/`

---

## 전략 전환 (3/14)

**이전:** 게임 70% / SEO 20% / 실험 10%
**현재:** 테스트/콘텐츠 SEO 50% / 게임 유지보수 20% / 바이럴 테스트 신규 20% / 실험 10%

근거: GA4 데이터상 유저가 게임이 아닌 테스트/블로그로 유입·체류. eq-test 바이럴(108u/일) 확인.

---

## 세션 기록

> Older detailed session logs were archived to [PROGRESS-ARCHIVE-2026-03-TO-2026-06.md](E:/Fire%20Project/docs/archive/PROGRESS-ARCHIVE-2026-03-TO-2026-06.md) on 2026-06-06 so this active file stays lightweight for Codex and AI-agent startup context.

### Session 424 (2026-06-05) - Indexing Maintenance Kickoff + Portal Content Signals

- Started the requested Google indexing maintenance pass. GSC sitemap status for `2026-06-05` showed the three submitted sitemaps error-free but still reporting `indexed: 0`; URL Inspection clarified the real split: `/` is `Submitted and indexed`, while `/portal/`, `/animal-personality/`, `/portal/blog/en/animal-personality-test-guide.html`, `/portal/blog/hi/best-free-brain-training-games-2026.html`, and `/portal/blog/ko/passive-aggressive-behavior-guide.html` are all `Crawled - currently not indexed` with robots/indexing allowed.
- Found a technical canonical mismatch on [projects/animal-personality/js/i18n.js](E:/Fire%20Project/projects/animal-personality/js/i18n.js): Googlebot could request the clean `/animal-personality/` URL but the rendered canonical changed to `?lang=en` from browser-language detection. Updated the i18n SEO sync so clean URLs keep the x-default canonical unless the visitor explicitly entered with `?lang=` or manually switches language.
- Used the same data pass to prioritize `/portal/` as the first hub-level content improvement target. GA4 for `2026-05-29..2026-06-04` showed `/animal-personality/` as the strongest landing (`90` Direct sessions, `66` engaged, `73.3%` engagement), while `/portal/` still had weak Direct engagement (`6` sessions, `1` engaged, `8.7s` average duration) and GSC showed it as crawled-not-indexed.
- Strengthened [projects/portal/index.html](E:/Fire%20Project/projects/portal/index.html) by making count signals consistent (`100+` in visible stats/FAQ, `107` in `AggregateOffer`) and converting the old `display:none` SEO directory into a visible, user-openable app directory with `76` internal app links. Added matching styles in [projects/portal/css/style.css](E:/Fire%20Project/projects/portal/css/style.css) and fixed the existing mobile document-width overflow by clipping `html` overflow and keeping card glow effects inside card bounds.
- Refreshed `/portal/` lastmod to `2026-06-05` in [projects/portal/sitemap.xml](E:/Fire%20Project/projects/portal/sitemap.xml) and [projects/root-domain/sitemap.xml](E:/Fire%20Project/projects/root-domain/sitemap.xml).
- Validation: `node --check projects/animal-personality/js/i18n.js`, submodule `git diff --check`, `node scripts/portal-hub-locale-audit.js`, and the quality gates for `animal-personality`, `portal`, and `root-domain` all passed. Local Playwright confirmed `/animal-personality/` clean URLs now render clean canonical/OG/Twitter URLs while explicit `?lang=en` still renders the language URL, and `/portal/` mobile render exposes the app directory, reports `offerCount: 107`, shows `100+` stats, and has no horizontal document overflow.

### Session 425 (2026-06-05) - PT Toxic Relationship Article Indexing Upgrade

- Continued the indexing maintenance pass using the Session 424 GSC sample instead of repeating the full analytics pull. [projects/portal/blog/pt/toxic-relationship-patterns-signs.html](E:/Fire%20Project/projects/portal/blog/pt/toxic-relationship-patterns-signs.html) was selected because the latest GSC page rows showed a thin but promising `position 2` impression for the Portuguese article, while URL Inspection still reported `Crawled - currently not indexed` with robots allowed and matching Google/user canonical.
- Kept the long Portuguese article body intact and upgraded the conversion/indexing layer: added a visible safety note for immediate-risk readers, inserted a top quick-action rail to `Red Flag Test`, `Toxic Trait Test`, `Attachment Style`, and `Trauma Response`, and added stable `data-content-surface` / `data-target-slug` metadata to quick cards, CTA buttons, and related links.
- Replaced the old placeholder manual ad slot (`1234567890`) with the project's Auto ads convention inside an inline article ad container, and added the standard `content_*` event taxonomy for `content_view`, `content_test_click`, `content_cta_click`, `content_toc_click`, `content_related_click`, and `content_ad_impression`.
- Refreshed the Article JSON-LD `dateModified` plus both [projects/portal/sitemap.xml](E:/Fire%20Project/projects/portal/sitemap.xml) and [projects/portal/blog/sitemap.xml](E:/Fire%20Project/projects/portal/blog/sitemap.xml) to `2026-06-05` for the changed Portuguese URL.
- Validation: portal `git diff --check`, `node scripts/portal-hub-locale-audit.js`, the portal quality gate, JSON-LD parse checks, and hreflang target existence checks all passed. Local mobile Playwright confirmed the page self-canonical, `4` quick cards, Auto ad slot, `2026-06-05` JSON-LD date, no horizontal overflow, and the expected `content_*` events with no browser errors.

### Session 426 (2026-06-05) - 5-Page Blog Indexing Batch

- Continued the indexing maintenance pass at the user's requested higher session throughput. Reused the Session 424/425 GSC context and selected five crawled-not-indexed or stale-indexing candidates for one batch: [projects/portal/blog/hi/best-free-brain-training-games-2026.html](E:/Fire%20Project/projects/portal/blog/hi/best-free-brain-training-games-2026.html), [projects/portal/blog/ko/passive-aggressive-behavior-guide.html](E:/Fire%20Project/projects/portal/blog/ko/passive-aggressive-behavior-guide.html), [projects/portal/blog/en/best-browser-games-2026.html](E:/Fire%20Project/projects/portal/blog/en/best-browser-games-2026.html), [projects/portal/blog/en/maladaptive-daydreaming-signs-test.html](E:/Fire%20Project/projects/portal/blog/en/maladaptive-daydreaming-signs-test.html), and [projects/portal/blog/ru/rejection-sensitivity-dysphoria.html](E:/Fire%20Project/projects/portal/blog/ru/rejection-sensitivity-dysphoria.html).
- Upgraded all five articles with a four-card quick-action rail, visible Auto ads using `data-ad-slot="auto"` and stable `data-ad-surface`, refreshed Article JSON-LD `dateModified=2026-06-05`, and the standard content analytics taxonomy: `content_view`, `content_test_click`, `content_cta_click`, `content_toc_click` where a TOC exists, `content_related_click`, and `content_ad_impression`.
- Fixed stale conversion paths while preserving the existing long-form article bodies: Hindi game CTAs now link to the actual game pages, the maladaptive daydreaming article now points old `/dopamine-test/` links to `/dopamine-type/`, and the Russian article's mobile comparison table is constrained to prevent document overflow. A live-only Korean article overflow was also fixed with page-level horizontal clipping.
- Refreshed the matching URL entries in both [projects/portal/sitemap.xml](E:/Fire%20Project/projects/portal/sitemap.xml) and [projects/portal/blog/sitemap.xml](E:/Fire%20Project/projects/portal/blog/sitemap.xml) to `2026-06-05`.
- Validation: JSON-LD parse checks, quick-card/ad/event/hreflang/sitemap assertions, portal `git diff --check`, `node scripts/portal-hub-locale-audit.js`, and the portal quality gate all passed. Local mobile Playwright confirmed all five pages had `4` quick cards, Auto ads, `2026-06-05` Article dates, no horizontal overflow, no page errors, and expected `content_*` events.
- Deployment: pushed portal commits `e61d1d0` (`Batch upgrade blog indexing candidates`) and `4f3e915` (`Fix Korean article mobile overflow`) to `origin/main`. Live verification on `dopabrain.com` confirmed both portal sitemaps carry `2026-06-05` lastmod for all five URLs, and all five live pages render quick cards, Auto ads, refreshed Article dates, zero horizontal/body overflow, zero page errors, and the expected `content_*` events.

### Session 427 (2026-06-05) - Blog Indexing Audit + Verification Tooling

- Corrected the throughput interpretation after the user clarified that the goal was not "five blog posts" but materially higher development volume per session. Shifted this pass from hand-editing more pages to reusable tooling that makes future indexing/content batches faster and safer.
- Added [scripts/blog-indexing-audit.js](E:/Fire%20Project/scripts/blog-indexing-audit.js) plus `npm run content:audit`. The read-only audit scans portal blog articles and ranks candidates by sitemap coverage, sitemap `lastmod`, canonical URL, Article/FAQ/Breadcrumb JSON-LD, `dateModified` age, quick-action rail coverage, Auto ad surfaces, expected `content_*` events, placeholder ad slots, legacy `/dopamine-test/` links, internal link existence, and simple mobile overflow risks.
- Added [scripts/verify-blog-pages.js](E:/Fire%20Project/scripts/verify-blog-pages.js) plus `npm run content:verify`. The Playwright verifier accepts `--file`, `--url`, and `--live`, starts a temporary local static server when needed, checks H1/Article JSON-LD/date/quick cards/Auto ads/horizontal overflow/runtime errors, instruments analytics, clicks expected content surfaces, and fails if expected `content_*` events do not reach `dataLayer`.
- Updated [docs/OPERATIONS.md](E:/Fire%20Project/docs/OPERATIONS.md) with the new indexing-maintenance batch routine so future content work starts with `content:audit` and ends with local/live `content:verify` instead of one-off browser snippets.
- Validation: `node --check scripts/blog-indexing-audit.js`, `node --check scripts/verify-blog-pages.js`, `npm run content:audit -- --limit 5`, and `npm run content:audit -- --lang ko --limit 5` all passed. The audit scanned `1,956` portal blog article pages overall and `195` Korean article pages, surfacing old empty/stub-like DE/JA/KO candidates at the top for the next large batch.
- Local and live verification both passed on [projects/portal/blog/en/maladaptive-daydreaming-signs-test.html](E:/Fire%20Project/projects/portal/blog/en/maladaptive-daydreaming-signs-test.html) and [projects/portal/blog/ko/passive-aggressive-behavior-guide.html](E:/Fire%20Project/projects/portal/blog/ko/passive-aggressive-behavior-guide.html): each rendered `4` quick cards, `1` Auto ad, `dateModified=2026-06-05`, zero horizontal overflow, and `content_view`, `content_ad_impression`, `content_test_click`, `content_cta_click`, `content_related_click`, and `content_toc_click`.
- Session close: recorded the active handoff instructions in [docs/OPERATIONS.md](E:/Fire%20Project/docs/OPERATIONS.md): keep Codex isolated per [AGENTS.md](E:/Fire%20Project/AGENTS.md), continue autonomously without waiting for confirmation, interpret "5x development volume" as reusable tooling/batch pipelines/quality gates rather than exactly five blog edits, and use the `content:audit` -> implementation -> local/live `content:verify` -> progress log -> commit/push loop for indexing maintenance.

### Session 428 (2026-06-05) - Strength Amplification R&D Direction

- Ran a fresh deep-dive after the user noted the last 1-2 weeks of traffic and revenue growth. The clearest cause was not Google Search indexing: GSC remained thin with only root-level low-volume clicks/impressions, while GA4 showed the growth came from Direct and high-quality test usage.
- Isolated the strongest winning mechanism: [projects/animal-personality](E:/Fire%20Project/projects/animal-personality) spiked from `5` sessions in `2026-05-08..2026-05-21` to `93` sessions in `2026-05-22..2026-06-04`, with the recent `2026-05-29..2026-06-04` window showing `91` sessions, `66` engaged sessions, `72.5%` engagement, and about `188s` average session duration.
- The highest-value source was Mexico Direct on `/animal-personality/`: `81` sessions, `63` engaged sessions, `142` pageviews, and `2,179` events in `2026-05-29..2026-06-04`. The peak days were `2026-05-30` (`36` Mexico Direct sessions, `86%` engagement) and `2026-06-02` (`25` Mexico Direct sessions, `84%` engagement), pointing to private/direct sharing rather than trackable Google or public social.
- Revenue matched the same pattern. AdSense recent 7-day revenue grew from `$0.44` to `$0.71` while AdSense page views only moved `1,811 -> 1,881`; the uplift came from better RPM/click quality. Mexico AdSense moved from `$0.02`, `18` pageviews, `66` impressions, `0` clicks to `$0.26`, `145` pageviews, `210` impressions, and `7` clicks.
- Benchmarked quiz/result UX patterns across Typeform, Interact, quiz-marketing references, and viral quiz analysis. The recurring quality levers were positive result framing, shareable result pages, personalized next steps, optional low-friction follow-up, custom result landing pages, and measurable sharing/reporting loops.
- Recorded the new [docs/OPERATIONS.md](E:/Fire%20Project/docs/OPERATIONS.md) Strength Amplification R&D Rule: future autonomous development should keep stability/indexing/new experiments in the mix, but dedicate roughly `20-30%` of capacity, or one pass every `3-4` sessions when fresh data supports it, to qualitatively amplifying proven winners rather than simply increasing content quantity.
- Immediate implication: treat Animal Personality as the current model to reinforce with better result-card clarity, Mexico/Spanish fit, share/save/copy instrumentation, result-specific OG/UTM links, next-test routing, and revenue-safe result-page ad placement before cloning volume elsewhere.
- Next autonomous development queue recorded at user request: add UTM parameters to `/animal-personality/` result share links (`utm_source=share`, `utm_medium=animal_result`, `utm_campaign=animal_mx`); split `animal_share_click`, `animal_copy_link`, and `animal_save_click` with richer metadata; prioritize Mexico/Spanish Animal result copy, ES landing/blog/internal-link improvements, and natural Spanish share text; segment Singapore Direct as low-value noise in future reports; then port the result-save-share pattern to `brain-type`, `color-personality`, and `mbti-love`.

### Session 429 (2026-06-06) - Animal Result Share UTM Amplification

- Resumed with the isolated Codex launcher. The script ran without touching Claude paths, but the nested launcher reported `stdin is not a terminal` because this API session is not an interactive TTY.
- Fresh data confirmed the Session 428 direction. GA4 `2026-05-30..2026-06-05` showed Direct at `897` sessions / `156` engaged sessions, while Organic Search stayed higher quality at `157` sessions / `102` engaged sessions. `/animal-personality/` Direct was still the standout landing page with `122` sessions, `91` engaged sessions, `74.6%` engagement, about `202s` average session duration, and `218` views.
- Mexico remained the high-value driver: Mexico Direct on `/animal-personality/` had `112` sessions, `88` engaged sessions, `78.6%` engagement, about `210s` average session duration, `206` views, and `3,137` events. Singapore remained noise-level on this page with `1` Direct session and `0` engaged sessions.
- Result events showed the amplification gap: `animal_result_ad_impression` reached `125` total / `112` Mexico, while `animal_save_click` was only `8` and existing generic share events did not cleanly identify Mexico result sharing. GSC `2026-05-30..2026-06-04` stayed thin with only root `/` returning `1` click and `5` impressions, so the work stayed GA4/AdSense-led.
- AdSense was healthy before implementation: today `$0.07`, yesterday `$0.18`, last 7 days `$0.85`, this month `$0.57`, last 30 days `$2.21`; `dopabrain.com` was `READY` with Auto ads enabled and policy issues `{}`.
- Implemented the first strength-amplification item in [projects/animal-personality/js/app.js](E:/Fire%20Project/projects/animal-personality/js/app.js): result share links now carry `lang`, `utm_source=share`, `utm_medium=animal_result`, `utm_campaign=animal_mx`, `utm_content=<animal>`, `animal_result`, and `animal_biome`.
- Split the result action telemetry so future reads can distinguish `animal_share_click` for external share actions, `animal_copy_link` for link copying, and `animal_save_click` for result image saves. Each event now carries richer metadata: result key, biome, language, surface, method, and the campaign params. The URL-copy action now copies explicitly instead of being mixed into generic share behavior, and Kakao falls back to copying the tracked result URL when the SDK is unavailable.
- Improved the Spanish result path in [projects/animal-personality/js/locales/es.json](E:/Fire%20Project/projects/animal-personality/js/locales/es.json) with more natural share text and a clearer next-step explanation for Spanish/Mexico users.
- Refreshed the app JSON-LD `dateModified` in [projects/animal-personality/index.html](E:/Fire%20Project/projects/animal-personality/index.html) plus `/animal-personality/` lastmod in [projects/portal/sitemap.xml](E:/Fire%20Project/projects/portal/sitemap.xml) and [projects/root-domain/sitemap.xml](E:/Fire%20Project/projects/root-domain/sitemap.xml) to `2026-06-06`.
- Validation passed: `node --check js/app.js`, Spanish locale JSON parsing, `git diff --check`, quality gates for `animal-personality`, `portal`, and `root-domain`, `node scripts/portal-hub-locale-audit.js`, `bash scripts/app-test-suite.sh projects/animal-personality`, and `npm run harness -- --skip-analytics --skip-runtime`.
- Local mobile Playwright over a temporary static server verified `/animal-personality/?lang=es` result flow: share URL included all expected UTM/result/biome params, copied text matched the tracked URL, Twitter carried the same encoded URL, `dateModified=2026-06-06`, zero horizontal overflow, zero page errors, and `animal_copy_link`, `animal_share_click`, and `animal_save_click` all reached the hooked GA event stream.
- Deployment: pushed animal-personality commit `c9e11e0`, portal sitemap commit `944e399`, root-domain sitemap commit `658a494`, and root progress commit `9ca748b`.
- Live verification initially saw the old cached app (`dateModified=2026-04-25`), then passed after Pages/Cloudflare propagation. `https://dopabrain.com/animal-personality/?lang=es&v=429browser3` confirmed `dateModified=2026-06-06`, the tracked share URL with `utm_campaign=animal_mx`, copied URL parity, Twitter carrying the encoded tracked URL, zero mobile overflow, zero page errors, and live `animal_copy_link`, `animal_share_click`, and `animal_save_click` events.
- Next priority: after deploy and live verification, watch Mexico `animal_copy_link`, `animal_share_click`, `animal_save_click`, `animal_result_ad_impression`, and returning `utm_campaign=animal_mx` sessions. If the split proves useful, port the same result-save-share pattern to `brain-type`, `color-personality`, and `mbti-love`.

### Session 430 (2026-06-06) - Spanish Animal Blog Funnel Support

- Continued the recorded Strength Amplification TODO without repeating GA4/GSC/AdSense, because Session 429 already completed the same-day data read. This pass handled item `3` from [docs/OPERATIONS.md](E:/Fire%20Project/docs/OPERATIONS.md): Mexico/Spanish Animal quality improvements, ES landing support, ES blog/internal links, and more natural Spanish routing.
- Selected two stale Spanish animal-cluster articles in [projects/portal/blog/es](E:/Fire%20Project/projects/portal/blog/es): `animal-personality.html` and `spirit-animal-personality-quiz.html`. Both had old `dateModified`/sitemap dates and direct `/animal-personality/` links that did not preserve `?lang=es` or the new `animal_mx` campaign.
- Upgraded [projects/portal/blog/es/animal-personality.html](E:/Fire%20Project/projects/portal/blog/es/animal-personality.html): refreshed Article `dateModified=2026-06-06`, added FAQPage and BreadcrumbList JSON-LD, added a four-card quick-action rail, changed the bottom CTA to `https://dopabrain.com/animal-personality/?lang=es&utm_source=portal_blog&utm_medium=es_animal_article&utm_campaign=animal_mx&utm_content=bottom_cta`, inserted an Auto ad surface, and replaced the old generic click event with `content_view`, `content_test_click`, `content_cta_click`, `content_toc_click`, `content_related_click`, and `content_ad_impression`.
- Upgraded [projects/portal/blog/es/spirit-animal-personality-quiz.html](E:/Fire%20Project/projects/portal/blog/es/spirit-animal-personality-quiz.html): softened the overconfident "science-based" framing into self-reflection wording, refreshed `dateModified=2026-06-06`, added BreadcrumbList JSON-LD, converted all Animal app paths to `?lang=es` plus `animal_mx` campaign params, replaced placeholder ad slot `1234567890` with `data-ad-slot="auto"`, and added the standard `content_*` event taxonomy.
- Refreshed both URLs in [projects/portal/sitemap.xml](E:/Fire%20Project/projects/portal/sitemap.xml) and [projects/portal/blog/sitemap.xml](E:/Fire%20Project/projects/portal/blog/sitemap.xml) to `2026-06-06`.
- Validation passed: JSON-LD parse checks for Article/FAQPage/BreadcrumbList, Auto ad and no-placeholder checks, `git diff --check`, `node scripts/portal-hub-locale-audit.js`, portal quality gate, and `npm run harness -- --skip-analytics --skip-runtime`.
- Local mobile Playwright over a temporary static server passed for both Spanish pages: no page errors, `dateModified=2026-06-06`, Auto ads present, `animal_mx` links present, zero placeholder slots, zero horizontal overflow, and expected `content_*` events reached `dataLayer` after clicking quick/CTA/related surfaces.
- Deployment: pushed portal commit `1e608af` and root progress commit `e75150c`, then updated the root portal submodule pointer with commit `b390bc2`.
- Live verification passed after Pages/Cloudflare propagation on the third retry. `https://dopabrain.com/portal/blog/es/animal-personality.html?v=430browser` and `https://dopabrain.com/portal/blog/es/spirit-animal-personality-quiz.html?v=430browser` both served `dateModified=2026-06-06`, Article/FAQPage/BreadcrumbList JSON-LD, Auto ads, zero placeholder slots, `animal_mx` links, zero mobile overflow, zero page errors, and expected `content_*` events. Live portal and blog sitemaps also confirmed `2026-06-06` lastmod for both Spanish URLs.
- Next priority: port the result-save-share instrumentation pattern to `brain-type`, `color-personality`, and `mbti-love`, starting with the app that already has the clearest result screen and weakest share/copy/save event split.

### Session 431 (2026-06-06) - Workspace Cleanup + Codex/Harness R&D

- Resumed the user's recorded cleanup/R&D request and kept Codex isolation rules intact: no `.claude` writes and no `claude` CLI usage.
- Archived the full historical [PROGRESS.md](E:/Fire%20Project/PROGRESS.md) snapshot into [docs/archive/PROGRESS-ARCHIVE-2026-03-TO-2026-06.md](E:/Fire%20Project/docs/archive/PROGRESS-ARCHIVE-2026-03-TO-2026-06.md), then reduced active `PROGRESS.md` from about `270KB` to about `24KB` by keeping current state plus recent sessions only.
- Reviewed current Codex/OpenAI/Playwright guidance and converted the applicable parts into operating rules instead of creating another loose Markdown file. [docs/OPERATIONS.md](E:/Fire%20Project/docs/OPERATIONS.md) now records compact startup context, script-first workflow capture, safe Codex automation boundaries, Agents SDK applicability, tracing/eval adoption criteria, and failure-first harness artifact rules.
- Updated [docs/HARNESS-WORKFLOW.md](E:/Fire%20Project/docs/HARNESS-WORKFLOW.md) with report retention and the Playwright trace-fit rationale: compact pass summaries, failure-first trace/screenshot/source artifacts, and bounded timestamped reports.
- Added report pruning to [scripts/harness-workflow-check.js](E:/Fire%20Project/scripts/harness-workflow-check.js): it keeps `latest.json` plus the most recent `8` timestamped workflow runs by default, with `HARNESS_WORKFLOW_REPORT_KEEP` as an override.
- Cleaned ignored workspace artifacts: removed the stale `logs/batch-20260327-212750.log`; verification harness runs pruned `12` old `logs/harness-workflow/` timestamp files and left `latest.json` plus the most recent `8` run pairs.
- Validation passed: `node --check scripts/harness-workflow-check.js`, `git diff --check`, and `npm run harness -- --skip-analytics --skip-runtime`.

### Session 432 (2026-06-10) - Result Share Pattern Replication + AdSense Reauth Prep

- Resumed per [AGENTS.md](E:/Fire%20Project/AGENTS.md) and kept Codex isolated: the launcher ran without touching Claude paths, but reported `stdin is not a terminal` because this API session is not an interactive TTY.
- Checked AdSense first as requested. The MCP tool and local `doctor` both returned `invalid_grant`; stored OAuth credentials were still present, so a fresh consent URL was generated for manual `init --code` recovery. The failure was logged to [memory/failures.jsonl](E:/Fire%20Project/memory/failures.jsonl).
- Ran a fresh GA4/GSC selection pass for `2026-06-03..2026-06-09` before implementation. `/animal-personality/` Mexico Direct remained the model winner with `58` sessions, `43` engaged sessions, `101` views, `1,473` events, and about `216s` average session duration. Among the replication candidates, `/mbti-love/` was the only one with recent `result_view` events, while `/brain-type/` and `/color-personality/` had small but engaged Direct/Organic rows. GSC exact checks for all three candidate app URLs returned no recent rows.
- Ported the Animal result-sharing instrumentation pattern to [projects/mbti-love/js/app.js](E:/Fire%20Project/projects/mbti-love/js/app.js), [projects/brain-type/js/app.js](E:/Fire%20Project/projects/brain-type/js/app.js), and [projects/color-personality/js/app.js](E:/Fire%20Project/projects/color-personality/js/app.js). Result share URLs now carry `lang`, `utm_source=share`, app-specific `utm_medium`, `utm_campaign=personality_result_share`, `utm_content=<result>`, plus result identifiers such as `mbti_love_result`, `brain_type`, `color_type`, `love_group`, and `signature_hex`.
- Split telemetry so future Direct/share reconstruction can distinguish external share actions from copy and save behavior: `mbti_love_share_click`, `mbti_love_copy_link`, `mbti_love_save_click`; `brain_type_share_click`, `brain_type_copy_link`, `brain_type_result_view`; and `color_personality_share_click`, `color_personality_copy_link`, `color_personality_save_click`, `color_personality_result_view`. `brain-type` has no result-save UI, so this pass kept it to result view/share/copy without adding a new control.
- Refreshed SoftwareApplication `dateModified=2026-06-10` in [projects/mbti-love/index.html](E:/Fire%20Project/projects/mbti-love/index.html), [projects/brain-type/index.html](E:/Fire%20Project/projects/brain-type/index.html), and [projects/color-personality/index.html](E:/Fire%20Project/projects/color-personality/index.html). Updated the matching app URL lastmods in [projects/portal/sitemap.xml](E:/Fire%20Project/projects/portal/sitemap.xml) and [projects/root-domain/sitemap.xml](E:/Fire%20Project/projects/root-domain/sitemap.xml).
- Validation passed: `node --check` for all three edited app scripts, submodule/root `git diff --check`, `node scripts/portal-hub-locale-audit.js`, quality gates for `mbti-love`, `brain-type`, `color-personality`, `portal`, and `root-domain`, plus a local mobile Playwright smoke over a temporary static server. The smoke completed result flows for all three apps and confirmed tracked share URLs plus the expected copy/share/save/result events in `dataLayer`.
- Deployment: pushed [projects/mbti-love](E:/Fire%20Project/projects/mbti-love) commit `26bc752`, [projects/brain-type](E:/Fire%20Project/projects/brain-type) commit `391a90f`, [projects/color-personality](E:/Fire%20Project/projects/color-personality) commit `46d1075`, [projects/portal](E:/Fire%20Project/projects/portal) commit `4e6b7c1`, [projects/root-domain](E:/Fire%20Project/projects/root-domain) commit `35b8c70`, and root commit `b2e69c6`. `brain-type` and `color-personality` were detached submodule checkouts, so the commits were pushed to both `main` and the default `master` branch.
- Live verification passed immediately on `dopabrain.com`: the three app pages served `dateModified=2026-06-10`, the live JS bundles contained the new copy/share/save event names plus app-specific `utm_medium` values, and both live root/portal sitemaps served `2026-06-10` lastmods for `/mbti-love/`, `/brain-type/`, and `/color-personality/`.

### Session 433 (2026-06-10) - AdSense OAuth Keepalive Research

- Researched the AdSense MCP authentication question against official Google OAuth, Google Cloud token type, and AdSense Management API documentation. Conclusion: truly permanent authentication is not available; the durable approach is a production OAuth consent screen plus a stored refresh token, with a scheduled keepalive to exercise it and detect breakage.
- Confirmed the current `invalid_grant` state cannot be repaired automatically. A fresh manual OAuth consent flow is required after checking that the Google Cloud OAuth consent screen is `In production` rather than `Testing`; external apps in `Testing` can receive refresh tokens that expire after seven days for non-profile scopes.
- Documented the operating rule in [docs/ADSENSE-OAUTH-KEEPALIVE.md](E:/Fire%20Project/docs/ADSENSE-OAUTH-KEEPALIVE.md): AdSense does not support service accounts, access tokens are short-lived, refresh tokens are long-lived but revocable/expirable, and keepalive checks are detection/prevention rather than a bypass for Google token rules.
- Added root package helpers: `npm run adsense:auth-url`, `npm run adsense:doctor`, and `npm run adsense:keepalive`.
- Added [scripts/adsense-mcp-keepalive.ps1](E:/Fire%20Project/scripts/adsense-mcp-keepalive.ps1), which runs the local AdSense MCP `doctor`, writes JSONL status to `logs/adsense-mcp-keepalive.jsonl`, flags `invalid_grant`, and can print a recovery auth URL.
- Added [scripts/install-adsense-mcp-keepalive-task.ps1](E:/Fire%20Project/scripts/install-adsense-mcp-keepalive-task.ps1), which registers a Windows Scheduled Task named `FireProject-AdSenseMcp-KeepAlive` for a daily or weekly keepalive run.
- Validation: `package.json` parsed successfully, `git diff --check` passed, the keepalive script produced the expected `invalid_grant` failure on the current stale token, and the scheduled-task installer passed `-WhatIf` with the default weekly `09:10` schedule.
