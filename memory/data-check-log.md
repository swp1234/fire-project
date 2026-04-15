---
name: data-check-log
description: GA4/GSC 조회 날짜 기록 (중복 조회 방지)
type: reference
---

# Data Check Log

기록 형식:
- `YYYY-MM-DD: GA4 조회 완료 (세션NNN, 팩번호 + 목적 요약)`
- `YYYY-MM-DD: GA4+GSC 조회 완료 (세션NNN, 목적 요약)`
- `YYYY-MM-DD: AdSense 조회 완료 (세션NNN, 수익/정책/광고 상태 점검)`

- 2026-04-01: AdSense 조회 완료 (세션342, 전용 adsense-mcp 검증 + 미지급 수익/정책 경고/광고단위 정상응답 확인)
- 2026-04-04: GA4+GSC 조회 완료 (세션347, blog hub 성능 후속 판정 + locale hub 색인 상태 점검)
- 2026-03-31: GA4 조회 완료 (세션336, 팩1+팩2+팩3 기반 운영체계 설계용 구조/품질/이벤트 갭 재확인)
- 2026-03-31: GA4 조회 완료 (세션335, traffic-first 분기 고정 + portal/tests/mbti 허브 유입 강화 전/후 기준 확인)
- 2026-03-31: GA4 조회 완료 (세션334, delay 재확인 + eq-test CTA/winner blog funnel 구현 전 분기 판단)
- 2026-03-31: GA4 조회 완료 (세션333, custom event 재확인 + eq-test premium live beacon/collect 검증)
- 2026-03-29: GA4 조회 완료 (세션332, revenue rollout 라이브 수집 반영 여부 1차 확인)
- 2026-03-28: GA4+GSC 조회 완료 (세션320, 10세션 수익화 스프린트 baseline 확정)
- 2026-03-27: GA4+GSC 조회 완료 (세션314, stress-management/digital-detox/blood-type 점검)
- 2026-03-26: GA4+GSC 조회 완료 (세션309, 자율진행 시작)
- 2026-03-25: GA4+GSC 조회 완료 (세션289, 데스크탑 재개)
- 2026-04-07: GSC inspection completed (session348, 485 crawled-not-indexed blog URLs triaged; 3 zero-byte locale articles restored; locale blog hubs and portal sitemap remediated)
- 2026-04-07: GSC inspection completed (session349, live deploy verified; sample fixed URLs still show crawled-not-indexed with last crawls on 2026-04-03 to 2026-04-06; sitemap list read works but submit_sitemap API returned 403 insufficient permission)
- 2026-04-07: GA4+GSC query completed (session350, attachment-style selected as immediate winner optimization target; implemented richer funnel tracking, personalized related-card ranking, lang sync, and missing locale key fixes)
- 2026-04-11: GA4+GSC query completed (session352, weekly review compared 2026-04-04..2026-04-10 vs 2026-03-28..2026-04-03; attachment-style lift confirmed, npc-test selected for immediate engagement/result-funnel remediation, AdSense summary attempt returned invalid_grant)
- 2026-04-11: AdSense query completed (session353, OAuth recovered after invalid_grant; doctor passed; earnings summary/payments/alerts/sites rechecked via local adsense-mcp client)
- 2026-04-11: GA4+GSC query completed (session356, follow-up weekly review selected /portal/tools/ for low-engagement hub remediation; implemented focus/wellness featured path, inline ad slot, and direct test cross-sell tracking)
- 2026-04-13: GA4+GSC+AdSense query completed (session357, compared 2026-04-06..2026-04-12 vs 2026-03-30..2026-04-05; selected /portal/ homepage for hero-funnel remediation, confirmed AdSense earnings summary access is healthy again, and logged current earnings trend before implementation)
- 2026-04-13: GSC redirect cleanup completed (session358, traced the `Page with redirect` failure to internally referenced blog redirect stubs; rewrote sitemap/hreflang/related-link discovery paths to final destinations and verified 0 remaining non-self redirect stub references in non-stub html/xml files before deploy)
- 2026-04-13: GSC 404 inspection completed (session359, analyzed the 404 CSV export, narrowed 228 reported URLs to 22 live 404s, added locale redirect coverage plus root alias/favicon fixes, and removed the last known internal references before deploy)
- 2026-04-13: GSC crawled-not-indexed inspection completed (session360, analyzed the 470-URL CSV export, verified all targets were live 200s, regenerated the stale dedicated blog sitemap from portal sitemap coverage, and added portal/blog sitemap lines to the root and portal robots files before deploy)
- 2026-04-13: GA4+GSC+AdSense query completed (session361, weekly review compared 2026-04-06..2026-04-12 vs 2026-03-30..2026-04-05; selected /rizz-score/ for low-engagement relationship-funnel remediation and implemented a localized result CTA, inline ad, winner-card ranking, and expanded `rizz_*` analytics coverage)
- 2026-04-13: GA4+GSC query completed (session362, weekly review selected /brainrot-score/ after 12 sessions with 0 engaged sessions; implemented a localized recovery funnel, tier-based next-step ranking, lang-aware share flow, and expanded `brainrot_*` analytics coverage)
- 2026-04-14: GA4+AdSense query completed (session363, weekly review selected /villain-type/ after 15 sessions with 0 engaged sessions; AdSense snapshot showed today $0.04, yesterday $0.08, and last_7_days $0.28 before implementing the new result funnel and tracking rollout)
- 2026-04-14: GA4+AdSense query completed (session364, weekly review kept /npc-test/ as the next app-level target after 12 sessions with 0 engaged sessions and ~2.54s average session duration; used the same 2026-04-07..2026-04-13 window and the current AdSense recovery snapshot before upgrading the result funnel)
- 2026-04-14: GA4 query completed (session365, weekly review kept /portal/tools as the next hub target after 11 sessions with 0 engaged sessions and 0 average session duration on 2026-04-07..2026-04-13; tightened the hero quick-start funnel, added localized quick-start copy across 12 locales, and verified `hero_focus_sprint` fires through `hub_cta_click` on the live page)
- 2026-04-15: GA4+AdSense query completed (session366, weekly review selected /delulu-score/ after 11 sessions with 1 engaged session and ~3.33s average session duration on 2026-04-08..2026-04-14; upgraded the result funnel, localized the new follow-up labels across 12 locales, and verified the live page emits `delulu_*` CTA/share/retry events)
