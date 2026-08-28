#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_REAL = fs.realpathSync.native(WORKSPACE_ROOT);
const DEFAULT_ORIGIN = 'https://dopabrain.com';
const SCHEMA_VERSION = 1;

const DEFAULT_EVENTS = Object.freeze({
  entry: 'root_trend_click',
  view: 'content_view',
  bridge: ['content_test_click', 'content_cta_click'],
  related: 'content_related_click',
});

const DEFAULT_THRESHOLDS = Object.freeze({
  organicSessionsPerDay: 20,
  engagementRate: 0.55,
  bridgeRate: 0.08,
  effectiveRpmUsd: 1,
  minimumFullDays: 7,
  minimumContentViews: 20,
  minimumOrganicSessionsForRate: 20,
  minimumRevenuePageViews: 20,
  minimumGscImpressionsForSuppression: 20,
  promotePasses: 2,
  earliestSuppressDays: 14,
  finalReviewDays: 28,
});

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const args = {
    help: false,
    input: '',
    mutations: false,
    out: '',
    spec: '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--mutations') args.mutations = true;
    else if (arg === '--spec') args.spec = readArgValue(argv, ++index, arg);
    else if (arg === '--input') args.input = readArgValue(argv, ++index, arg);
    else if (arg === '--out') args.out = readArgValue(argv, ++index, arg);
    else fail(`Unknown argument: ${arg}`);
  }

  return args;
}

function readArgValue(argv, index, label) {
  const value = String(argv[index] || '').trim();
  if (!value || value.startsWith('--')) fail(`${label} requires a value.`);
  return value;
}

function printHelp() {
  console.log(`Usage:
  node scripts/culture-signal-review.js --spec <spec.json> --input <evidence.json> [--out <directory>]
  node scripts/culture-signal-review.js --mutations

The command is a deterministic, offline judge. It never calls GA4, GSC, or AdSense.
When --out is omitted, reports are written below:
  .codex-artifacts/culture-signal-review/<as-of-date>/

Expected evidence shape:
{
  "asOf": "2026-09-05",
  "window": { "startDate": "2026-08-29", "endDate": "2026-09-04", "fullDays": 7 },
  "technical": {
    "ok": true,
    "pagePath": "/portal/blog/ko/example.html",
    "events": ["root_trend_click", "content_view", "content_test_click", "content_cta_click"]
  },
  "ga4": {
    "pagePath": "/portal/blog/ko/example.html",
    "organic": { "sessions": 140, "engagedSessions": 77 },
    "events": { "content_view": 100, "content_test_click": 5, "content_cta_click": 3 }
  },
  "gsc": { "indexed": true, "clicks": 2, "impressions": 50 },
  "adsense": {
    "attribution": "proxy",
    "pagePath": "/portal/blog/ko/example.html",
    "totals": { "earnings": 0.76, "pageViews": 1531 },
    "segments": [{ "country": "SG", "platform": "Desktop", "earnings": 0, "pageViews": 694 }]
  }
}

Use attribution "page" only for genuinely page-attributed revenue. Domain-level data is
reported as a proxy and never contributes a promotion pass.`);
}

function readJson(fileName, label) {
  const resolved = path.resolve(WORKSPACE_ROOT, fileName);
  let raw;
  try {
    raw = fs.readFileSync(resolved, 'utf8');
  } catch (error) {
    fail(`Cannot read ${label} ${resolved}: ${error.message}`);
  }

  try {
    return { path: resolved, value: JSON.parse(raw) };
  } catch (error) {
    fail(`Invalid JSON in ${label} ${resolved}: ${error.message}`);
  }
}

function parseDateOnly(value, label) {
  const text = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) fail(`${label} must use YYYY-MM-DD.`);
  const date = new Date(`${text}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== text) {
    fail(`${label} is not a valid calendar date: ${text}`);
  }
  return date;
}

function addDays(value, days) {
  const date = parseDateOnly(value, 'date');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function inclusiveDays(startValue, endValue) {
  const start = parseDateOnly(startValue, 'window.startDate');
  const end = parseDateOnly(endValue, 'window.endDate');
  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
}

function finiteNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function optionalNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function nonNegativeNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) fail(`${label} must be a non-negative number.`);
  return number;
}

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) fail(`${label} must be a positive integer.`);
  return number;
}

function normalizePagePath(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  try {
    return new URL(text, DEFAULT_ORIGIN).pathname;
  } catch {
    return text.split(/[?#]/)[0];
  }
}

function targetMatchesConfig(value, config) {
  const text = String(value || '').trim();
  if (!text) return false;
  try {
    const absolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(text);
    const url = new URL(text, config.expectedOrigin);
    if (absolute && url.origin.toLowerCase() !== config.expectedOrigin) return false;
    return url.pathname === config.expectedPagePath;
  } catch {
    return false;
  }
}

function displayTarget(value) {
  const text = String(value || '').trim();
  if (!text) return '(missing)';
  try {
    const absolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(text);
    const url = new URL(text, DEFAULT_ORIGIN);
    return absolute ? `${url.origin}${url.pathname}` : url.pathname;
  } catch {
    return text;
  }
}

function normalizeToken(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value === undefined || value === null ? [] : [value];
}

function valueAt(source, keys, fallback = 0) {
  const object = source && typeof source === 'object' ? source : {};
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null && object[key] !== '') {
      return finiteNumber(object[key], fallback);
    }
  }
  return fallback;
}

function buildConfig(spec) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) fail('Spec must be a JSON object.');
  const experiment = spec.experiment && typeof spec.experiment === 'object' ? spec.experiment : {};
  const lang = String(spec.lang || experiment.lang || '').trim().toLowerCase();
  const slug = String(spec.slug || experiment.slug || '').trim();
  if (!lang) fail('Spec is missing lang.');
  if (!slug) fail('Spec is missing slug.');

  const launchDate = String(experiment.launchDate || spec.date || '').trim();
  parseDateOnly(launchDate, 'spec launch date');

  const canonicalUrl = String(
    experiment.canonicalUrl ||
    spec.canonicalUrl ||
    `${DEFAULT_ORIGIN}/portal/blog/${lang}/${slug}.html`
  ).trim();
  let canonical;
  try {
    canonical = new URL(canonicalUrl);
  } catch {
    fail(`Spec canonicalUrl is invalid: ${canonicalUrl}`);
  }
  if (!['http:', 'https:'].includes(canonical.protocol)) fail('Spec canonicalUrl must use HTTP or HTTPS.');
  const expectedPagePath = normalizePagePath(experiment.pagePath || canonicalUrl);
  if (!expectedPagePath.startsWith('/')) fail('The expected pagePath must be an absolute URL path.');

  const eventConfig = experiment.events && typeof experiment.events === 'object'
    ? experiment.events
    : experiment;
  const events = {
    entry: String(eventConfig.entryEvent || eventConfig.entry || DEFAULT_EVENTS.entry),
    view: String(eventConfig.viewEvent || eventConfig.view || DEFAULT_EVENTS.view),
    bridge: asArray(eventConfig.bridgeEvents || eventConfig.bridge || DEFAULT_EVENTS.bridge)
      .map((item) => String(item || '').trim())
      .filter(Boolean),
    related: String(eventConfig.relatedEvent || eventConfig.related || DEFAULT_EVENTS.related),
  };
  if (!events.entry || !events.view || events.bridge.length === 0) fail('Spec event contract is incomplete.');

  const thresholdSource = experiment.thresholds && typeof experiment.thresholds === 'object'
    ? experiment.thresholds
    : {};
  const thresholds = { ...DEFAULT_THRESHOLDS, ...thresholdSource };
  for (const key of [
    'organicSessionsPerDay',
    'effectiveRpmUsd',
  ]) thresholds[key] = nonNegativeNumber(thresholds[key], `thresholds.${key}`);
  for (const key of ['engagementRate', 'bridgeRate']) {
    thresholds[key] = nonNegativeNumber(thresholds[key], `thresholds.${key}`);
    if (thresholds[key] > 1) fail(`thresholds.${key} must be between 0 and 1.`);
  }
  for (const key of [
    'minimumFullDays',
    'minimumContentViews',
    'minimumOrganicSessionsForRate',
    'minimumRevenuePageViews',
    'minimumGscImpressionsForSuppression',
    'promotePasses',
    'earliestSuppressDays',
    'finalReviewDays',
  ]) thresholds[key] = positiveInteger(thresholds[key], `thresholds.${key}`);
  if (thresholds.earliestSuppressDays < thresholds.minimumFullDays) {
    fail('earliestSuppressDays cannot be earlier than minimumFullDays.');
  }
  if (thresholds.finalReviewDays < thresholds.earliestSuppressDays) {
    fail('finalReviewDays cannot be earlier than earliestSuppressDays.');
  }

  const excludedSegments = asArray(experiment.excludedSegments).length > 0
    ? asArray(experiment.excludedSegments)
    : [{ country: 'SG', platform: 'Desktop' }];

  return {
    canonicalUrl,
    contentGroup: String(spec.contentGroup || 'culture_signal'),
    contentSlug: String(spec.contentSlug || slug),
    events,
    excludedSegments,
    expectedOrigin: canonical.origin.toLowerCase(),
    expectedPagePath,
    lang,
    launchDate,
    slug,
    thresholds,
    title: String(spec.h1 || spec.title || slug),
  };
}

function buildWindow(config, evidence) {
  const asOf = String(evidence.asOf || evidence.window?.asOf || '').trim();
  parseDateOnly(asOf, 'evidence.asOf');
  const startDate = String(evidence.window?.startDate || addDays(config.launchDate, 1));
  const endDate = String(evidence.window?.endDate || addDays(asOf, -1));
  const computedFullDays = Math.max(0, inclusiveDays(startDate, endDate));
  const suppliedFullDays = evidence.window?.fullDays;
  const fullDays = suppliedFullDays === undefined
    ? computedFullDays
    : nonNegativeNumber(suppliedFullDays, 'window.fullDays');
  if (!Number.isInteger(fullDays)) fail('window.fullDays must be an integer.');

  const issues = [];
  if (suppliedFullDays !== undefined && fullDays !== computedFullDays) {
    issues.push(`window.fullDays ${fullDays} does not match the inclusive date window ${computedFullDays}`);
  }
  if (parseDateOnly(endDate, 'window.endDate') >= parseDateOnly(asOf, 'evidence.asOf')) {
    issues.push('window.endDate must be earlier than asOf so partial current-day data is excluded');
  }
  if (parseDateOnly(startDate, 'window.startDate') < parseDateOnly(config.launchDate, 'spec launch date')) {
    issues.push('window.startDate cannot be earlier than the launch date');
  }

  return { asOf, computedFullDays, endDate, fullDays, issues, startDate };
}

function eventNamesFromEvidence(evidence) {
  const technicalEvents = evidence.technical?.events;
  if (Array.isArray(technicalEvents)) return technicalEvents.map(String);
  if (technicalEvents && typeof technicalEvents === 'object') return Object.keys(technicalEvents);
  const ga4Events = evidence.ga4?.events;
  if (ga4Events && typeof ga4Events === 'object') return Object.keys(ga4Events);
  return [];
}

function eventCount(events, name) {
  const value = events && typeof events === 'object' ? events[name] : undefined;
  if (value && typeof value === 'object') {
    return Math.max(0, valueAt(value, ['eventCount', 'count', 'total'], 0));
  }
  return Math.max(0, finiteNumber(value, 0));
}

function inspectTechnical(config, evidence, window) {
  const issues = [...window.issues];
  if (!evidence.technical || evidence.technical.ok !== true) {
    issues.push('technical.ok must be true after the runtime/event verifier passes');
  }

  const suppliedPaths = [
    evidence.pagePath,
    evidence.pilot?.pagePath,
    evidence.technical?.pagePath,
    evidence.ga4?.pagePath,
    evidence.ga4?.url,
    evidence.ga4?.pageUrl,
  ].filter((value) => value !== undefined && value !== null && String(value).trim());
  if (suppliedPaths.length === 0) {
    issues.push('No evidence pagePath was supplied');
  } else {
    for (const supplied of suppliedPaths) {
      if (!targetMatchesConfig(supplied, config)) {
        issues.push(`pagePath mismatch: expected ${config.expectedOrigin}${config.expectedPagePath}, got ${displayTarget(supplied)}`);
      }
    }
  }

  const ga4Targets = [evidence.ga4?.pagePath, evidence.ga4?.url, evidence.ga4?.pageUrl]
    .filter((value) => value !== undefined && value !== null && String(value).trim());
  if (ga4Targets.length === 0) {
    issues.push('GA4 pagePath/URL is required; technical.pagePath cannot attribute GA4 metrics');
  } else if (!ga4Targets.every((target) => targetMatchesConfig(target, config))) {
    issues.push(`GA4 pagePath/URL does not match ${config.expectedOrigin}${config.expectedPagePath}`);
  }

  const installedEvents = new Set(eventNamesFromEvidence(evidence));
  const requiredEvents = [config.events.entry, config.events.view, ...config.events.bridge];
  for (const eventName of requiredEvents) {
    if (!installedEvents.has(eventName)) issues.push(`Required event missing from evidence contract: ${eventName}`);
  }

  return {
    installedEvents: [...installedEvents].sort(),
    issues: [...new Set(issues)],
    ok: issues.length === 0,
    requiredEvents,
  };
}

function isExcludedSegment(segment, exclusions) {
  const country = normalizeToken(segment.country ?? segment.countryCode);
  const platform = normalizeToken(segment.platform ?? segment.platformType ?? segment.platformTypeName);
  return exclusions.some((excluded) => (
    normalizeToken(excluded.country) === country &&
    normalizeToken(excluded.platform) === platform
  ));
}

function readAdTotals(source) {
  return {
    clicks: Math.max(0, valueAt(source, ['clicks'], 0)),
    earnings: valueAt(source, ['earnings', 'estimatedEarnings', 'estimated_earnings'], 0),
    impressions: Math.max(0, valueAt(source, ['impressions'], 0)),
    pageViews: Math.max(0, valueAt(source, ['pageViews', 'pageviews', 'page_views'], 0)),
  };
}

function addAdTotals(left, right) {
  return {
    clicks: left.clicks + right.clicks,
    earnings: left.earnings + right.earnings,
    impressions: left.impressions + right.impressions,
    pageViews: left.pageViews + right.pageViews,
  };
}

function inspectAdsense(config, evidence) {
  const adsense = evidence.adsense && typeof evidence.adsense === 'object' ? evidence.adsense : {};
  const segments = Array.isArray(adsense.segments) ? adsense.segments : [];
  const hasTotals = adsense.totals && typeof adsense.totals === 'object';
  const totals = hasTotals
    ? readAdTotals(adsense.totals)
    : segments.reduce((sum, segment) => addAdTotals(sum, readAdTotals(segment)), readAdTotals({}));
  const excludedRows = segments.filter((segment) => isExcludedSegment(segment, config.excludedSegments));
  const excluded = excludedRows.reduce(
    (sum, segment) => addAdTotals(sum, readAdTotals(segment)),
    readAdTotals({})
  );
  const warnings = [];
  if (excluded.pageViews > totals.pageViews) warnings.push('Excluded pageviews exceed supplied totals; valid pageviews were clamped to zero.');
  if (excluded.earnings > totals.earnings) warnings.push('Excluded earnings exceed supplied totals; valid earnings were clamped to zero.');
  const valid = {
    clicks: Math.max(0, totals.clicks - excluded.clicks),
    earnings: Math.max(0, totals.earnings - excluded.earnings),
    impressions: Math.max(0, totals.impressions - excluded.impressions),
    pageViews: Math.max(0, totals.pageViews - excluded.pageViews),
  };
  const effectiveRpmUsd = valid.pageViews > 0 ? (valid.earnings / valid.pageViews) * 1000 : null;
  const attributionValue = normalizeToken(adsense.attribution || adsense.scope);
  const claimedPageAttribution = adsense.pageAttributed === true || ['page', 'url', 'article'].includes(attributionValue);
  const attributionTargets = [adsense.pagePath, adsense.url, adsense.pageUrl, adsense.canonicalUrl]
    .filter((value) => value !== undefined && value !== null && String(value).trim());
  const pageTargetMatched = (
    attributionTargets.length > 0 &&
    attributionTargets.every((target) => targetMatchesConfig(target, config))
  );
  const exactPageAttribution = claimedPageAttribution && pageTargetMatched;
  const attribution = exactPageAttribution ? 'page' : (hasTotals || segments.length > 0 ? 'proxy' : 'none');
  if (claimedPageAttribution && attributionTargets.length === 0) {
    warnings.push('Page attribution was claimed without an AdSense pagePath/URL; revenue was downgraded to proxy.');
  } else if (claimedPageAttribution && !pageTargetMatched) {
    warnings.push(`AdSense pagePath/URL does not match ${config.expectedOrigin}${config.expectedPagePath}; revenue was downgraded to proxy.`);
  }

  return {
    attribution,
    attributionTargets: attributionTargets.map(displayTarget),
    claimedPageAttribution,
    effectiveRpmUsd,
    excluded,
    excludedRows: excludedRows.length,
    exactPageAttribution,
    pageTargetMatched,
    totals,
    valid,
    warnings,
  };
}

function makeSignal(value, threshold, eligible, passWhenEligible, note = '') {
  if (!eligible || value === null || value === undefined || !Number.isFinite(value)) {
    return { credible: false, note, status: 'unknown', threshold, value: value ?? null };
  }
  return {
    credible: true,
    note,
    status: passWhenEligible ? 'pass' : 'fail',
    threshold,
    value,
  };
}

function evaluate(spec, evidence) {
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) fail('Evidence must be a JSON object.');
  const config = buildConfig(spec);
  const window = buildWindow(config, evidence);
  const technical = inspectTechnical(config, evidence, window);
  const ga4 = evidence.ga4 && typeof evidence.ga4 === 'object' ? evidence.ga4 : {};
  const organic = ga4.organic && typeof ga4.organic === 'object' ? ga4.organic : {};
  const sessions = Math.max(0, valueAt(organic, ['sessions'], 0));
  const engagedSessionsValue = optionalNumber(organic.engagedSessions ?? organic.engaged_sessions);
  const suppliedEngagementRate = optionalNumber(organic.engagementRate ?? organic.engagement_rate);
  let engagedSessions = engagedSessionsValue === null ? null : Math.max(0, engagedSessionsValue);
  let engagementRate = null;
  if (engagedSessions !== null && sessions > 0) engagementRate = engagedSessions / sessions;
  else if (suppliedEngagementRate !== null) engagementRate = suppliedEngagementRate;
  if (engagedSessions !== null && engagedSessions > sessions) {
    technical.issues.push(`engagedSessions ${engagedSessions} exceeds sessions ${sessions}`);
    technical.ok = false;
  }
  if (engagementRate !== null && (engagementRate < 0 || engagementRate > 1)) {
    technical.issues.push(`engagementRate must be between 0 and 1, got ${engagementRate}`);
    technical.ok = false;
  }

  const events = ga4.events && typeof ga4.events === 'object' ? ga4.events : {};
  const contentViews = eventCount(events, config.events.view);
  const entryClicks = eventCount(events, config.events.entry);
  const bridgeCounts = Object.fromEntries(config.events.bridge.map((name) => [name, eventCount(events, name)]));
  const bridgeClicks = Object.values(bridgeCounts).reduce((sum, value) => sum + value, 0);
  const relatedClicks = eventCount(events, config.events.related);
  const organicSessionsPerDay = window.fullDays > 0 ? sessions / window.fullDays : null;
  const bridgeRate = contentViews > 0 ? bridgeClicks / contentViews : null;

  const gsc = evidence.gsc && typeof evidence.gsc === 'object' ? evidence.gsc : {};
  const gscClicks = Math.max(0, valueAt(gsc, ['clicks'], 0));
  const gscImpressions = Math.max(0, valueAt(gsc, ['impressions'], 0));
  const indexed = typeof gsc.indexed === 'boolean' ? gsc.indexed : null;
  const discovered = indexed === true || gscImpressions > 0 || gscClicks > 0 || sessions > 0;
  const adsense = inspectAdsense(config, evidence);

  const thresholds = config.thresholds;
  const signals = {
    demand: makeSignal(
      organicSessionsPerDay,
      thresholds.organicSessionsPerDay,
      window.fullDays >= thresholds.minimumFullDays,
      organicSessionsPerDay !== null && organicSessionsPerDay >= thresholds.organicSessionsPerDay,
      'Organic landing sessions per complete day.'
    ),
    engagement: makeSignal(
      engagementRate,
      thresholds.engagementRate,
      sessions >= thresholds.minimumOrganicSessionsForRate,
      engagementRate !== null && engagementRate >= thresholds.engagementRate,
      `Requires at least ${thresholds.minimumOrganicSessionsForRate} organic sessions.`
    ),
    bridge: makeSignal(
      bridgeRate,
      thresholds.bridgeRate,
      contentViews >= thresholds.minimumContentViews,
      bridgeRate !== null && bridgeRate >= thresholds.bridgeRate,
      `Uses ${config.events.bridge.join(' + ')} over ${config.events.view}; related clicks are excluded.`
    ),
    revenue: makeSignal(
      adsense.effectiveRpmUsd,
      thresholds.effectiveRpmUsd,
      adsense.exactPageAttribution && adsense.valid.pageViews >= thresholds.minimumRevenuePageViews,
      adsense.effectiveRpmUsd !== null && adsense.effectiveRpmUsd >= thresholds.effectiveRpmUsd,
      adsense.exactPageAttribution
        ? `Requires at least ${thresholds.minimumRevenuePageViews} page-attributed pageviews.`
        : 'Domain-level revenue is a proxy and cannot promote this page.'
    ),
  };
  if (!adsense.exactPageAttribution && adsense.effectiveRpmUsd !== null) {
    signals.revenue.status = adsense.effectiveRpmUsd >= thresholds.effectiveRpmUsd ? 'proxy_pass' : 'proxy_fail';
  }

  const crediblePasses = Object.entries(signals)
    .filter(([, signal]) => signal.credible && signal.status === 'pass')
    .map(([name]) => name);
  const credibleFailures = Object.entries(signals)
    .filter(([, signal]) => signal.credible && signal.status === 'fail')
    .map(([name]) => name);
  const exposureForSuppression = (
    gscImpressions >= thresholds.minimumGscImpressionsForSuppression ||
    contentViews >= thresholds.minimumContentViews ||
    sessions > 0
  );
  const suppressionSampleReady = (
    sessions >= thresholds.minimumOrganicSessionsForRate &&
    contentViews >= thresholds.minimumContentViews
  );
  const suppressionEvidenceReady = suppressionSampleReady && credibleFailures.length > 0;

  let status;
  let reason;
  let nextAction;
  if (!technical.ok) {
    status = 'TRACKING_BLOCKED';
    reason = technical.issues[0];
    nextAction = 'Repair the evidence contract or instrumentation, then rerun before making a content decision.';
  } else if (window.fullDays < thresholds.minimumFullDays) {
    status = 'TOO_EARLY';
    reason = `${window.fullDays}/${thresholds.minimumFullDays} complete observation days are available.`;
    nextAction = 'Keep the pilot unchanged and collect complete-day evidence.';
  } else if (!discovered) {
    status = 'DISCOVERY_HOLD';
    reason = 'No Organic landing session, GSC impression, click, or positive index signal is present.';
    nextAction = 'Inspect indexing and crawl discovery; do not classify the topic as a content failure yet.';
  } else if (crediblePasses.length >= thresholds.promotePasses) {
    status = 'PROMOTE';
    reason = `${crediblePasses.length} credible gates passed: ${crediblePasses.join(', ')}.`;
    nextAction = 'Keep the pilot promoted and prepare one adjacent Culture Signal experiment.';
  } else if (
    suppressionEvidenceReady && (
      window.fullDays >= thresholds.finalReviewDays ||
      (window.fullDays >= thresholds.earliestSuppressDays && crediblePasses.length === 0 && exposureForSuppression)
    )
  ) {
    status = 'SUPPRESS';
    reason = `${crediblePasses.length} credible gates passed after ${window.fullDays} complete days.`;
    nextAction = 'Remove the promotion slot and focused discovery route while keeping the URL live.';
  } else {
    status = 'ITERATE';
    reason = !suppressionSampleReady && window.fullDays >= thresholds.earliestSuppressDays
      ? `Suppression is blocked: organic sessions ${sessions}/${thresholds.minimumOrganicSessionsForRate}, content views ${contentViews}/${thresholds.minimumContentViews}.`
      : `${crediblePasses.length}/${thresholds.promotePasses} required credible gates passed.`;
    nextAction = !suppressionSampleReady && window.fullDays >= thresholds.earliestSuppressDays
      ? 'Keep or repair discovery until both minimum samples are available; do not suppress from thin data.'
      : 'Revise one hypothesis (topic, title, internal link, or bridge) and preserve the measurement contract.';
  }

  const warnings = [...adsense.warnings];
  if (adsense.attribution === 'proxy') warnings.push('Revenue is domain-level proxy data and is excluded from promotion pass counts.');
  if (indexed === null) warnings.push('GSC indexed status is unknown.');
  if (bridgeRate !== null && bridgeRate > 1) warnings.push('Bridge event count exceeds content views; inspect repeat or duplicate events.');

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    pilot: {
      canonicalUrl: config.canonicalUrl,
      contentGroup: config.contentGroup,
      contentSlug: config.contentSlug,
      expectedPagePath: config.expectedPagePath,
      lang: config.lang,
      launchDate: config.launchDate,
      slug: config.slug,
      title: config.title,
    },
    window: {
      asOf: window.asOf,
      endDate: window.endDate,
      fullDays: window.fullDays,
      startDate: window.startDate,
    },
    decision: {
      crediblePasses,
      minimumPasses: thresholds.promotePasses,
      nextAction,
      reason,
      status,
    },
    signals,
    metrics: {
      adsense: {
        attribution: adsense.attribution,
        attributionTargets: adsense.attributionTargets,
        claimedPageAttribution: adsense.claimedPageAttribution,
        effectiveRpmUsd: adsense.effectiveRpmUsd,
        excluded: adsense.excluded,
        excludedRows: adsense.excludedRows,
        pageTargetMatched: adsense.pageTargetMatched,
        totals: adsense.totals,
        valid: adsense.valid,
      },
      ga4: {
        bridgeClicks,
        bridgeCounts,
        bridgeRate,
        contentViews,
        engagedSessions,
        engagementRate,
        entryClicks,
        organicSessions: sessions,
        organicSessionsPerDay,
        relatedClicks,
      },
      gsc: {
        clicks: gscClicks,
        discovered,
        impressions: gscImpressions,
        indexed,
      },
    },
    dataQuality: {
      installedEvents: technical.installedEvents,
      issues: technical.issues,
      requiredEvents: technical.requiredEvents,
      technicalOk: technical.ok,
      suppression: {
        credibleFailures,
        evidenceReady: suppressionEvidenceReady,
        sampleReady: suppressionSampleReady,
      },
      warnings,
    },
    thresholds,
  };
}

function isWithin(base, target) {
  const relative = path.relative(base, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function nearestExistingAncestor(target) {
  let current = target;
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) return current;
    current = parent;
  }
  return current;
}

function resolveOutputDir(rawOutput, asOf) {
  const recommended = path.join('.codex-artifacts', 'culture-signal-review', asOf);
  const resolved = path.resolve(WORKSPACE_ROOT, rawOutput || recommended);
  if (!isWithin(WORKSPACE_ROOT, resolved)) fail(`Output path must stay inside the workspace: ${resolved}`);
  const ancestor = nearestExistingAncestor(resolved);
  const ancestorReal = fs.realpathSync.native(ancestor);
  if (!isWithin(WORKSPACE_REAL, ancestorReal)) fail(`Output path resolves outside the workspace: ${resolved}`);
  return resolved;
}

function markdownEscape(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
}

function formatNumber(value, digits = 2) {
  return value === null || value === undefined || !Number.isFinite(value)
    ? 'n/a'
    : Number(value).toFixed(digits).replace(/\.00$/, '');
}

function formatPercent(value) {
  return value === null || value === undefined || !Number.isFinite(value)
    ? 'n/a'
    : `${(value * 100).toFixed(1)}%`;
}

function formatSignalValue(name, signal) {
  if (name === 'engagement' || name === 'bridge') return formatPercent(signal.value);
  if (name === 'revenue') return signal.value === null ? 'n/a' : `$${formatNumber(signal.value)}`;
  return formatNumber(signal.value);
}

function formatSignalThreshold(name, signal) {
  if (name === 'engagement' || name === 'bridge') return formatPercent(signal.threshold);
  if (name === 'revenue') return `$${formatNumber(signal.threshold)}`;
  return formatNumber(signal.threshold);
}

function renderMarkdown(report) {
  const lines = [
    '# Culture Signal Review',
    '',
    `- Pilot: ${markdownEscape(report.pilot.title)}`,
    `- Window: ${report.window.startDate} to ${report.window.endDate} (${report.window.fullDays} complete days)`,
    `- Decision: **${report.decision.status}**`,
    `- Reason: ${markdownEscape(report.decision.reason)}`,
    '',
    '| Signal | Value | Gate | Status |',
    '|---|---:|---:|---|',
  ];
  for (const [name, signal] of Object.entries(report.signals)) {
    lines.push(`| ${name} | ${formatSignalValue(name, signal)} | ${formatSignalThreshold(name, signal)} | ${signal.status} |`);
  }
  lines.push(
    '',
    '## Data quality',
    '',
    `- GSC: indexed=${report.metrics.gsc.indexed ?? 'unknown'}, impressions=${formatNumber(report.metrics.gsc.impressions, 0)}, clicks=${formatNumber(report.metrics.gsc.clicks, 0)}`,
    `- AdSense attribution: ${report.metrics.adsense.attribution}; excluded pageviews=${formatNumber(report.metrics.adsense.excluded.pageViews, 0)}`,
    `- Technical contract: ${report.dataQuality.technicalOk ? 'pass' : 'blocked'}`
  );
  for (const warning of report.dataQuality.warnings) lines.push(`- Warning: ${markdownEscape(warning)}`);
  for (const issue of report.dataQuality.issues) lines.push(`- Issue: ${markdownEscape(issue)}`);
  lines.push('', '## Next action', '', markdownEscape(report.decision.nextAction), '');
  return lines.join('\n');
}

function writeReports(report, rawOutput) {
  const outputDir = resolveOutputDir(rawOutput, report.window.asOf);
  fs.mkdirSync(outputDir, { recursive: true });
  const outputReal = fs.realpathSync.native(outputDir);
  if (!isWithin(WORKSPACE_REAL, outputReal)) fail(`Output directory resolves outside the workspace: ${outputDir}`);
  const jsonPath = path.join(outputDir, 'review.json');
  const markdownPath = path.join(outputDir, 'review.md');
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownPath, renderMarkdown(report), 'utf8');
  return { jsonPath, markdownPath, outputDir };
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function approximately(actual, expected, epsilon = 1e-9) {
  return actual !== null && Math.abs(actual - expected) <= epsilon;
}

function fixtureSpec() {
  return {
    lang: 'ko',
    slug: 'odyssey-spider-man-identity-reset-2026',
    h1: 'Fixture Culture Signal',
    date: '2026-08-28',
    contentGroup: 'culture_signal',
    contentSlug: 'odyssey-spider-man-identity-reset-2026',
  };
}

function fixtureEvidence(fullDays = 7) {
  const launchDate = '2026-08-28';
  const pagePath = '/portal/blog/ko/odyssey-spider-man-identity-reset-2026.html';
  return {
    asOf: addDays(launchDate, fullDays + 1),
    window: {
      startDate: addDays(launchDate, 1),
      endDate: addDays(launchDate, fullDays),
      fullDays,
    },
    technical: {
      ok: true,
      pagePath,
      events: ['root_trend_click', 'content_view', 'content_test_click', 'content_cta_click'],
    },
    ga4: {
      pagePath,
      organic: { sessions: 0, engagedSessions: 0 },
      events: {
        root_trend_click: 0,
        content_view: 20,
        content_test_click: 0,
        content_cta_click: 0,
      },
    },
    gsc: { indexed: true, clicks: 0, impressions: 30 },
    adsense: {
      attribution: 'proxy',
      totals: { earnings: 0.2, pageViews: 100 },
      segments: [],
    },
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function runMutations() {
  const spec = fixtureSpec();
  const tests = [];
  const test = (name, run) => tests.push({ name, run });

  test('TOO_EARLY before seven complete days', () => {
    const evidence = fixtureEvidence(6);
    evidence.gsc = { indexed: false, clicks: 0, impressions: 0 };
    assert(evaluate(spec, evidence).decision.status === 'TOO_EARLY', 'Expected TOO_EARLY.');
  });

  test('DISCOVERY_HOLD is not a content failure', () => {
    const evidence = fixtureEvidence(7);
    evidence.ga4.organic = { sessions: 0, engagedSessions: 0 };
    evidence.ga4.events.content_view = 0;
    evidence.gsc = { indexed: false, clicks: 0, impressions: 0 };
    assert(evaluate(spec, evidence).decision.status === 'DISCOVERY_HOLD', 'Expected DISCOVERY_HOLD.');
  });

  test('PROMOTE at exact threshold boundaries', () => {
    const evidence = fixtureEvidence(7);
    evidence.ga4.organic = { sessions: 140, engagedSessions: 77 };
    evidence.ga4.events.content_view = 100;
    evidence.ga4.events.content_test_click = 5;
    evidence.ga4.events.content_cta_click = 3;
    evidence.adsense = {
      attribution: 'page',
      pagePath: evidence.ga4.pagePath,
      totals: { earnings: 0.1, pageViews: 100 },
      segments: [],
    };
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'PROMOTE', 'Expected PROMOTE.');
    assert(report.signals.demand.status === 'pass' && approximately(report.signals.demand.value, 20), 'Demand boundary failed.');
    assert(report.signals.engagement.status === 'pass' && approximately(report.signals.engagement.value, 0.55), 'Engagement boundary failed.');
    assert(report.signals.bridge.status === 'pass' && approximately(report.signals.bridge.value, 0.08), 'Bridge boundary failed.');
    assert(report.signals.revenue.status === 'pass' && approximately(report.signals.revenue.value, 1), 'RPM boundary failed.');
  });

  test('ITERATE and proxy revenue cannot create promotion', () => {
    const evidence = fixtureEvidence(7);
    evidence.ga4.organic = { sessions: 140, engagedSessions: 70 };
    evidence.ga4.events.content_view = 20;
    evidence.adsense = {
      attribution: 'proxy',
      totals: { earnings: 2, pageViews: 1000 },
      segments: [],
    };
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'ITERATE', 'Expected ITERATE with one direct pass.');
    assert(report.signals.revenue.status === 'proxy_pass', 'Expected proxy_pass revenue status.');
    assert(report.signals.revenue.credible === false, 'Proxy revenue must not be credible for promotion.');
    assert(report.decision.crediblePasses.length === 1, 'Proxy revenue incorrectly increased pass count.');
  });

  test('SUPPRESS only after sufficient time and exposure', () => {
    const evidence = fixtureEvidence(14);
    evidence.ga4.organic = { sessions: 20, engagedSessions: 0 };
    evidence.ga4.events.content_view = 20;
    evidence.gsc = { indexed: true, clicks: 0, impressions: 50 };
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'SUPPRESS', 'Expected SUPPRESS after 14 days with zero passes.');
  });

  test('SG Desktop scan is excluded from effective RPM', () => {
    const evidence = fixtureEvidence(7);
    evidence.adsense = {
      attribution: 'proxy',
      totals: { earnings: 0.76, pageViews: 1531, impressions: 797, clicks: 20 },
      segments: [{ country: 'SG', platform: 'Desktop', earnings: 0, pageViews: 694, impressions: 0, clicks: 0 }],
    };
    const report = evaluate(spec, evidence);
    assert(report.metrics.adsense.excluded.pageViews === 694, 'SG Desktop pageviews were not excluded.');
    assert(report.metrics.adsense.valid.pageViews === 837, 'Valid pageview denominator is incorrect.');
    assert(approximately(report.metrics.adsense.effectiveRpmUsd, (0.76 / 837) * 1000), 'Effective RPM is incorrect.');
  });

  test('zero denominators remain unknown and finite', () => {
    const evidence = fixtureEvidence(7);
    evidence.ga4.events.content_view = 0;
    evidence.adsense = {
      attribution: 'page',
      pagePath: evidence.ga4.pagePath,
      totals: { earnings: 0, pageViews: 0 },
      segments: [],
    };
    const report = evaluate(spec, evidence);
    assert(report.metrics.ga4.bridgeRate === null, 'Zero-view bridge rate must be null.');
    assert(report.metrics.adsense.effectiveRpmUsd === null, 'Zero-view RPM must be null.');
    const serialized = JSON.stringify(report);
    assert(!serialized.includes('NaN') && !serialized.includes('Infinity'), 'Report contains a non-finite number.');
  });

  test('wrong pagePath is detected', () => {
    const evidence = fixtureEvidence(7);
    evidence.ga4.pagePath = '/portal/blog/ko/wrong.html';
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'TRACKING_BLOCKED', 'Wrong pagePath did not block the review.');
    assert(report.dataQuality.issues.some((issue) => issue.includes('pagePath mismatch')), 'Wrong pagePath issue is missing.');
  });

  test('wrong event contract is detected', () => {
    const evidence = fixtureEvidence(7);
    evidence.technical.events = evidence.technical.events.map((name) => (
      name === 'content_cta_click' ? 'content_cta_typo' : name
    ));
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'TRACKING_BLOCKED', 'Wrong event contract did not block the review.');
    assert(report.dataQuality.issues.some((issue) => issue.includes('content_cta_click')), 'Missing event issue is absent.');
  });

  test('thin samples cannot trigger SUPPRESS', () => {
    const evidence = fixtureEvidence(28);
    evidence.ga4.organic = { sessions: 1, engagedSessions: 0 };
    evidence.ga4.events.content_view = 1;
    evidence.gsc = { indexed: true, clicks: 0, impressions: 100 };
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'ITERATE', 'Thin samples must remain ITERATE, even after 28 days.');
    assert(report.dataQuality.suppression.sampleReady === false, 'Thin samples were marked suppression-ready.');
  });

  test('global GA4 and AdSense values cannot promote without page targets', () => {
    const evidence = fixtureEvidence(7);
    evidence.ga4.organic = { sessions: 140, engagedSessions: 77 };
    evidence.ga4.events.content_view = 100;
    evidence.ga4.events.content_test_click = 5;
    evidence.ga4.events.content_cta_click = 3;
    delete evidence.ga4.pagePath;
    evidence.adsense = {
      attribution: 'page',
      totals: { earnings: 0.1, pageViews: 100 },
      segments: [],
    };
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'TRACKING_BLOCKED', 'Global GA4 values bypassed page attribution.');
    assert(report.dataQuality.issues.some((issue) => issue.includes('GA4 pagePath/URL is required')), 'Missing GA4 target issue is absent.');
    assert(report.metrics.adsense.attribution === 'proxy', 'Targetless AdSense revenue remained page-attributed.');
    assert(report.signals.revenue.credible === false, 'Targetless AdSense revenue remained credible.');
  });

  test('mismatched AdSense URL is downgraded to proxy', () => {
    const evidence = fixtureEvidence(7);
    evidence.ga4.organic = { sessions: 140, engagedSessions: 70 };
    evidence.ga4.events.content_view = 20;
    evidence.adsense = {
      attribution: 'page',
      url: 'https://dopabrain.com/portal/blog/ko/wrong.html?source=global',
      totals: { earnings: 2, pageViews: 1000 },
      segments: [],
    };
    const report = evaluate(spec, evidence);
    assert(report.decision.status === 'ITERATE', 'Mismatched AdSense URL incorrectly promoted the pilot.');
    assert(report.metrics.adsense.attribution === 'proxy', 'Mismatched AdSense URL remained page-attributed.');
    assert(report.metrics.adsense.pageTargetMatched === false, 'Mismatched AdSense URL was accepted.');
    assert(report.dataQuality.warnings.some((warning) => warning.includes('does not match')), 'AdSense URL mismatch warning is absent.');
  });

  test('output path escape is rejected', () => {
    let rejected = false;
    try {
      resolveOutputDir('..', '2026-09-05');
    } catch {
      rejected = true;
    }
    assert(rejected, 'Workspace output escape was accepted.');
  });

  let passed = 0;
  for (const item of tests) {
    try {
      item.run();
      passed += 1;
      console.log(`[PASS] ${item.name}`);
    } catch (error) {
      console.error(`[FAIL] ${item.name}: ${error.message}`);
    }
  }
  console.log(`\nMutation summary: ${passed}/${tests.length} passed`);
  if (passed !== tests.length) process.exitCode = 1;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.mutations) {
    runMutations();
    return;
  }
  if (!args.spec || !args.input) fail('--spec and --input are required unless --mutations is used.');

  const spec = readJson(args.spec, 'spec');
  const input = readJson(args.input, 'input');
  const report = evaluate(spec.value, input.value);
  const written = writeReports(report, args.out);
  console.log(JSON.stringify({
    decision: report.decision.status,
    fullDays: report.window.fullDays,
    passes: report.decision.crediblePasses,
    reportJson: path.relative(WORKSPACE_ROOT, written.jsonPath).replace(/\\/g, '/'),
    reportMarkdown: path.relative(WORKSPACE_ROOT, written.markdownPath).replace(/\\/g, '/'),
  }, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`culture-signal-review: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  buildConfig,
  evaluate,
  renderMarkdown,
  resolveOutputDir,
  runMutations,
};
