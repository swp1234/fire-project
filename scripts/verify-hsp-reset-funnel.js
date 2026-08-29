#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const HSP_ROOT = path.join(ROOT, 'projects', 'hsp-test');
const PORTAL_ROOT = path.join(ROOT, 'projects', 'portal');
const ORIGIN = 'https://dopabrain.com';
const CLIENT = 'ca-pub-3600813755953882';
const ALL_LOCALES = Object.freeze(['de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh']);
const RUNTIME_LOCALES = Object.freeze(['en', 'ko', 'de']);
const BANNED_RESET_PARAMS = Object.freeze([
  'reset_trigger',
  'reset_place',
  'reset_capacity',
  'hsp_profile',
  'result_type',
  'result_value',
]);
const ALLOWED_FUNNEL_QUERY_KEYS = Object.freeze(['lang', 'source']);

const FILES = Object.freeze({
  hspHtml: path.join(HSP_ROOT, 'index.html'),
  hspJs: path.join(HSP_ROOT, 'js', 'app.js'),
  resetHtml: path.join(HSP_ROOT, 'reset.html'),
  resetJs: path.join(HSP_ROOT, 'js', 'reset.js'),
  mapHtml: path.join(HSP_ROOT, 'map.html'),
  mapJs: path.join(HSP_ROOT, 'js', 'map.js'),
  i18nJs: path.join(HSP_ROOT, 'js', 'i18n.js'),
  manifest: path.join(HSP_ROOT, 'manifest.json'),
  serviceWorker: path.join(HSP_ROOT, 'sw.js'),
  ...Object.fromEntries(ALL_LOCALES.map((locale) => [
    `${locale}Json`,
    path.join(HSP_ROOT, 'js', 'locales', `${locale}.json`),
  ])),
});

const PRODUCTION_ROUTES = Object.freeze({
  hspHtml: '/hsp-test/',
  hspJs: '/hsp-test/js/app.js',
  resetHtml: '/hsp-test/reset.html',
  resetJs: '/hsp-test/js/reset.js',
  mapHtml: '/hsp-test/map.html',
  mapJs: '/hsp-test/js/map.js',
  i18nJs: '/hsp-test/js/i18n.js',
  manifest: '/hsp-test/manifest.json',
  serviceWorker: '/hsp-test/sw.js',
  ...Object.fromEntries(ALL_LOCALES.map((locale) => [
    `${locale}Json`,
    `/hsp-test/js/locales/${locale}.json`,
  ])),
});

const MIME_TYPES = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseArgs(argv) {
  const options = { mutations: false, production: false };
  for (const argument of argv) {
    if (argument === '--mutations') options.mutations = true;
    else if (argument === '--production') options.production = true;
    else if (argument === '--help' || argument === '-h') {
      console.log('Usage: node scripts/verify-hsp-reset-funnel.js [--mutations] [--production]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  assert(!(options.mutations && options.production), '--mutations is local-only');
  return options;
}

function stripComments(value) {
  return String(value || '').replace(/<!--[\s\S]*?-->/g, '');
}

function countMatches(value, pattern) {
  return (String(value || '').match(pattern) || []).length;
}

function readLocalSources() {
  return Object.fromEntries(Object.entries(FILES).map(([key, filePath]) => {
    assert(fs.existsSync(filePath), `Missing local source: ${path.relative(ROOT, filePath)}`);
    return [key, fs.readFileSync(filePath, 'utf8')];
  }));
}

async function readProductionSources() {
  const nonce = Date.now();
  const entries = await Promise.all(Object.entries(PRODUCTION_ROUTES).map(async ([key, route]) => {
    const url = new URL(route, ORIGIN);
    url.searchParams.set('_verify', String(nonce));
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      redirect: 'follow',
    });
    assert(response.ok, `Production source failed ${response.status}: ${route}`);
    const body = await response.text();
    assert(body.trim(), `Production source is empty: ${route}`);
    return [key, body];
  }));
  return Object.fromEntries(entries);
}

function extractElementById(html, id) {
  const source = String(html || '');
  const openPattern = new RegExp(`<([a-z][a-z0-9:-]*)\\b[^>]*\\bid\\s*=\\s*(["'])${escapeRegex(id)}\\2[^>]*>`, 'i');
  const open = openPattern.exec(source);
  assert(open, `Missing #${id}`);
  const duplicatePattern = new RegExp(`\\bid\\s*=\\s*(["'])${escapeRegex(id)}\\1`, 'gi');
  assert(countMatches(source, duplicatePattern) === 1, `#${id} must be unique`);

  const tag = open[1].toLowerCase();
  const openStart = open.index;
  const openEnd = openStart + open[0].length;
  const tokenPattern = new RegExp(`<\\/?${escapeRegex(tag)}\\b[^>]*>`, 'gi');
  tokenPattern.lastIndex = openEnd;
  let depth = 1;
  let token;
  while ((token = tokenPattern.exec(source))) {
    const value = token[0];
    if (/^<\//.test(value)) depth -= 1;
    else if (!/\/\s*>$/.test(value)) depth += 1;
    if (depth === 0) {
      const end = token.index + value.length;
      return {
        id,
        tag,
        openTag: open[0],
        openStart,
        openEnd,
        closeStart: token.index,
        end,
        html: source.slice(openStart, end),
      };
    }
  }
  throw new Error(`Unclosed #${id}`);
}

function inspectAds(html, script, label) {
  const source = stripComments(html);
  const headMatch = source.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  assert(headMatch, `${label}: missing head`);
  const directLoader = /<script\b[^>]*\bsrc\s*=\s*["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=([^"'&\s>]+)[^"']*["'][^>]*>\s*<\/script>/gi;
  const managedLoader = /<script\b[^>]*\bsrc\s*=\s*["']\/portal\/js\/ad-loader\.js["'][^>]*>\s*<\/script>/gi;
  const direct = Array.from(source.matchAll(directLoader));
  const managed = Array.from(source.matchAll(managedLoader));
  const head = headMatch[0];
  const headDirect = Array.from(head.matchAll(directLoader));
  const headManaged = Array.from(head.matchAll(managedLoader));
  const combined = `${source}\n${script || ''}`;

  assert(direct.length + managed.length === 1, `${label}: Auto Ads loader count must be exactly one`);
  assert(headDirect.length + headManaged.length === 1, `${label}: Auto Ads loader must be in head`);
  assert(direct.every((match) => match[1] === CLIENT), `${label}: AdSense client mismatch`);
  assert(!/<ins\b[^>]*\bclass\s*=\s*["'][^"']*\badsbygoogle\b/i.test(source), `${label}: manual adsbygoogle unit is forbidden`);
  assert(!/\bdata-ad-slot\s*=/i.test(source), `${label}: manual data-ad-slot is forbidden`);
  assert(!/\bdata-ad-surface\s*=/i.test(source), `${label}: manual data-ad-surface is forbidden`);
  assert(!/\b(?:window\.)?adsbygoogle\b[\s\S]{0,140}\.push\s*\(/i.test(combined), `${label}: manual adsbygoogle.push is forbidden`);
  assert(!/\b(?:hsp_result|sensory_reset|sensory_map)[a-z0-9_]*ad_(?:impression|view)\b/i.test(combined), `${label}: synthetic ad event is forbidden`);
}

function verifyEntryPrivacy(sources) {
  const html = stripComments(sources.hspHtml);
  const sanitizerStart = html.indexOf('(function sanitizeEntryQuery()');
  const firstExternalScript = html.search(/<script\b[^>]*\bsrc\s*=/i);
  assert(sanitizerStart >= 0, 'HSP entry query sanitizer is missing');
  assert(firstExternalScript >= 0 && sanitizerStart < firstExternalScript, 'HSP entry query sanitizer must run before every external script');

  const sanitizerScriptStart = html.lastIndexOf('<script', sanitizerStart);
  const sanitizerScriptEnd = html.indexOf('</script>', sanitizerStart);
  assert(sanitizerScriptStart >= 0 && sanitizerScriptEnd > sanitizerStart, 'HSP entry query sanitizer script is malformed');
  const sanitizer = html.slice(sanitizerScriptStart, sanitizerScriptEnd);
  const passthroughMatch = sanitizer.match(/passthroughKeys\s*=\s*\[([^\]]*)\]/);
  assert(passthroughMatch, 'HSP entry query passthrough allowlist is missing');
  const passthroughKeys = Array.from(passthroughMatch[1].matchAll(/["']([^"']+)["']/g), (match) => match[1]).sort();
  const expectedKeys = ['source', 'surface', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_source'].sort();
  assert(passthroughKeys.join('|') === expectedKeys.join('|'), `HSP entry query passthrough allowlist mismatch: ${passthroughKeys.join(',')}`);
  assert(/searchParams\.get\(\s*["']start["']\s*\)\s*===\s*["']1["']/.test(sanitizer), 'HSP entry start parameter is not restricted to 1');
  assert(/\^\[A-Za-z0-9_\.\-\]\{1,80\}\$/.test(sanitizer), 'HSP entry attribution values are not bounded safe tokens');
  assert(/history\.replaceState\s*\(/.test(sanitizer), 'HSP entry query sanitizer does not replace the unsafe URL');
  ['profile', 'result', 'result_type', 'result_value', 'trigger', 'place', 'capacity'].forEach((name) => {
    assert(!passthroughKeys.includes(name), `HSP entry query sanitizer allows private key ${name}`);
  });
}

function verifyResultHierarchy(sources) {
  const result = extractElementById(sources.hspHtml, 'screen-result');
  const boundary = extractElementById(sources.hspHtml, 'result-boundary');
  const reset = extractElementById(sources.hspHtml, 'sensory-reset-cta');
  assert(boundary.openStart > result.openStart && boundary.end < result.end, '#result-boundary must be inside #screen-result');
  assert(reset.openStart > result.openStart && reset.end < result.end, '#sensory-reset-cta must be inside #screen-result');
  assert(boundary.end <= reset.openStart, '#sensory-reset-cta must follow #result-boundary');
  const between = stripComments(sources.hspHtml.slice(boundary.end, reset.openStart)).trim();
  assert(!between, '#sensory-reset-cta must be the immediate element after #result-boundary');

  const resetLinks = countMatches(reset.html, /\bid\s*=\s*(["'])sensory-reset-link\1/gi);
  assert(resetLinks === 1, '#sensory-reset-cta must contain one #sensory-reset-link primary action');
  assert(/\bdata-cta-surface\s*=\s*(["'])hsp_result_reset\1/i.test(reset.openTag), '#sensory-reset-cta surface mismatch');

  const forbiddenResultPatterns = [
    ['result map', /\bid\s*=\s*(["'])sensory-map-cta\1|\bsensory-map-cta\b/i],
    ['next-step card', /\bid\s*=\s*(["'])next-step-card\1|\bquick-actions-card\b/i],
    ['manual result ad', /\bid\s*=\s*(["'])result-inline-ad\1|<ins\b[^>]*\badsbygoogle\b|\bdata-ad-slot\s*=/i],
    ['fabricated percentile', /\bid\s*=\s*(["'])percentile-stat\1|\bpercentileStat\b|\bpercentilePool\b/i],
  ];
  forbiddenResultPatterns.forEach(([label, pattern]) => {
    assert(!pattern.test(result.html), `Result contains forbidden ${label}`);
  });
  assert(!/aggregateRating|ratingValue|ratingCount/i.test(sources.hspHtml), 'HSP page contains forbidden aggregateRating');
  assert(!/\bsensory_map_cta_(?:view|click)\b/i.test(sources.hspJs), 'HSP app retains forbidden result map telemetry');
  assert(!/\bhsp_result_ad_impression\b|\bensureResultAdLoaded\b|\bpercentilePool\b|\bupdatePercentileStat\b/i.test(sources.hspJs), 'HSP app retains forbidden result ad or percentile code');
}

function verifyTelemetrySource(sources) {
  const viewCount = countMatches(sources.hspJs, /["']sensory_reset_cta_view["']/g);
  const clickCount = countMatches(sources.hspJs, /["']sensory_reset_cta_click["']/g);
  assert(viewCount === 1, `sensory_reset_cta_view source count must be one, got ${viewCount}`);
  assert(clickCount === 1, `sensory_reset_cta_click source count must be one, got ${clickCount}`);
  assert(/\bIntersectionObserver\b/.test(sources.hspJs), 'Reset CTA view must use IntersectionObserver');
  assert(/\bthreshold\s*:\s*(?:\[\s*)?0?\.5\b/.test(sources.hspJs), 'Reset CTA observer threshold must be 0.5');
  assert(/\bintersectionRatio\b[\s\S]{0,100}(?:>=\s*0?\.5|<\s*0?\.5)|(?:>=\s*0?\.5|<\s*0?\.5)[\s\S]{0,100}\bintersectionRatio\b/.test(sources.hspJs), 'Reset CTA view must explicitly guard intersectionRatio at 0.5');
  assert(!/[?&](?:profile|result(?:_type|_value)?|trigger|place|capacity)=/i.test(sources.hspJs), 'HSP reset destination contains forbidden query parameter');
}

function verifyResetPrivacySource(sources) {
  BANNED_RESET_PARAMS.forEach((name) => {
    assert(!new RegExp(`\\b${escapeRegex(name)}\\b`).test(sources.resetJs), `Reset source contains forbidden telemetry parameter ${name}`);
  });
  ['trigger', 'place', 'capacity', 'profile', 'result', 'result_type', 'result_value'].forEach((name) => {
    const writePattern = new RegExp(`searchParams\\s*\\.\\s*(?:set|append)\\s*\\(\\s*(["'])${escapeRegex(name)}\\1`, 'i');
    assert(!writePattern.test(sources.resetJs), `Reset source writes forbidden URL selection ${name}`);
  });
  assert(!/(?:query|params)\.get\(\s*(["'])profile\1\s*\)/i.test(sources.resetJs), 'Reset source reads forbidden profile parameter');
}

function verifyLocaleJson(sources) {
  for (const locale of ALL_LOCALES) {
    const key = `${locale}Json`;
    let parsed;
    try {
      parsed = JSON.parse(sources[key]);
    } catch (error) {
      throw new Error(`${locale} locale JSON is invalid: ${error.message}`);
    }
    assert(parsed && typeof parsed === 'object', `${locale} locale JSON must be an object`);
    assert(!parsed.intro && !parsed.types && !parsed.about, `${locale} locale retains dead legacy trust blocks`);
    assert(!Object.prototype.hasOwnProperty.call(parsed.result || {}, 'percentileStat'), `${locale} locale retains fabricated percentile copy`);
    ['title', 'description'].forEach((name) => assert(typeof parsed.meta?.[name] === 'string' && parsed.meta[name].trim(), `${locale} meta.${name} is empty`));
    ['h1', 'subtitle', 'heroDesc', 'badge', 'disclaimer', 'start'].forEach((name) => assert(typeof parsed.app?.[name] === 'string' && parsed.app[name].trim(), `${locale} app.${name} is empty`));
    ['profileTitle', 'radarTitle', 'overallLevel', 'boundary', 'retake', 'moreTests'].forEach((name) => assert(typeof parsed.result?.[name] === 'string' && parsed.result[name].trim(), `${locale} result.${name} is empty`));
  }
}

function verifyManifestAndOffline(sources) {
  let manifest;
  try {
    manifest = JSON.parse(sources.manifest);
  } catch (error) {
    throw new Error(`HSP manifest JSON is invalid: ${error.message}`);
  }
  const manifestText = JSON.stringify(manifest);
  assert(manifest.name === 'HSP Sensory Preferences Check', 'HSP manifest name is stale');
  assert(Array.isArray(manifest.categories) && manifest.categories.join('|') === 'lifestyle', 'HSP manifest categories must be lifestyle only');
  assert(!/20\s*(?:questions|items|문항|問)|자가진단|"health"/i.test(manifestText), 'HSP manifest retains diagnostic-category or fake-question copy');

  const worker = sources.serviceWorker;
  assert(!/js\/data\.js/.test(worker), 'Service worker retains nonexistent js/data.js');
  assert(/request\.method\s*!==\s*['"]GET['"]/.test(worker), 'Service worker does not limit caching to GET');
  assert(/url\.origin\s*!==\s*self\.location\.origin/.test(worker), 'Service worker does not limit caching to same origin');
  assert(/url\.pathname\.startsWith\(scopePath\)/.test(worker), 'Service worker does not limit caching to its scope');
  assert(/js\/i18n\.js/.test(worker), 'Service worker omits i18n runtime');
  ALL_LOCALES.forEach((locale) => assert(new RegExp(`js/locales/${locale}\\.json`).test(worker), `Service worker omits ${locale} locale`));

  assert(/translations\.en/.test(sources.i18nJs), 'i18n runtime has no explicit English failure fallback');
  assert(/languageRequestId/.test(sources.i18nJs), 'i18n runtime has no rapid-switch race guard');
}

function verifyStatic(sources) {
  verifyLocaleJson(sources);
  verifyResultHierarchy(sources);
  verifyEntryPrivacy(sources);
  inspectAds(sources.hspHtml, sources.hspJs, 'HSP result');
  inspectAds(sources.resetHtml, sources.resetJs, 'Sensory reset');
  inspectAds(sources.mapHtml, sources.mapJs, 'Sensory map');
  verifyTelemetrySource(sources);
  verifyResetPrivacySource(sources);
  verifyManifestAndOffline(sources);
}

function cloneSources(sources) {
  return { ...sources };
}

function insertBeforeElement(html, id, markup) {
  const element = extractElementById(html, id);
  return `${html.slice(0, element.openStart)}${markup}${html.slice(element.openStart)}`;
}

function insertAfterElement(html, id, markup) {
  const element = extractElementById(html, id);
  return `${html.slice(0, element.end)}${markup}${html.slice(element.end)}`;
}

function insertInsideElement(html, id, markup) {
  const element = extractElementById(html, id);
  return `${html.slice(0, element.openEnd)}${markup}${html.slice(element.openEnd)}`;
}

function runMutations(baseline) {
  verifyStatic(baseline);
  const mutations = [
    {
      name: 'trust-aggregate-rating',
      expected: /aggregateRating/,
      apply(value) {
        const next = cloneSources(value);
        next.hspHtml = next.hspHtml.replace('</head>', '<script type="application/ld+json">{"@type":"WebApplication","aggregateRating":{"ratingValue":"5"}}</script></head>');
        return next;
      },
    },
    {
      name: 'trust-fabricated-percentile',
      expected: /percentile/,
      apply(value) {
        const next = cloneSources(value);
        next.hspHtml = insertInsideElement(next.hspHtml, 'result-boundary', '<p id="percentile-stat">Top 10%</p>');
        return next;
      },
    },
    {
      name: 'hierarchy-interposed-card',
      expected: /immediate element/,
      apply(value) {
        const next = cloneSources(value);
        next.hspHtml = insertBeforeElement(next.hspHtml, 'sensory-reset-cta', '<div id="interposed-result-card"></div>');
        return next;
      },
    },
    {
      name: 'hierarchy-result-map',
      expected: /result map/,
      apply(value) {
        const next = cloneSources(value);
        next.hspHtml = insertAfterElement(next.hspHtml, 'sensory-reset-cta', '<section id="sensory-map-cta"></section>');
        return next;
      },
    },
    {
      name: 'ad-manual-unit',
      expected: /manual adsbygoogle unit/,
      apply(value) {
        const next = cloneSources(value);
        next.resetHtml = next.resetHtml.replace('</body>', '<ins class="adsbygoogle" data-ad-slot="auto"></ins></body>');
        return next;
      },
    },
    {
      name: 'ad-push-and-fake-event',
      expected: /adsbygoogle\.push|synthetic ad event/,
      apply(value) {
        const next = cloneSources(value);
        next.mapJs += "\n(adsbygoogle = window.adsbygoogle || []).push({}); gtag('event', 'sensory_map_ad_impression');\n";
        return next;
      },
    },
    {
      name: 'privacy-selection-event-param',
      expected: /reset_trigger/,
      apply(value) {
        const next = cloneSources(value);
        next.resetJs += '\nconst leakedResetSelection = { reset_trigger: trigger };\n';
        return next;
      },
    },
    {
      name: 'privacy-selection-url',
      expected: /forbidden URL selection trigger/,
      apply(value) {
        const next = cloneSources(value);
        next.resetJs += "\nnew URL(location.href).searchParams.set('trigger', trigger);\n";
        return next;
      },
    },
    {
      name: 'privacy-entry-sanitizer-order',
      expected: /sanitizer must run before every external script/,
      apply(value) {
        const next = cloneSources(value);
        next.hspHtml = next.hspHtml.replace('<head>', '<head><script src="https://example.test/leak.js"></script>');
        return next;
      },
    },
    {
      name: 'telemetry-unconditional-view',
      expected: /source count must be one/,
      apply(value) {
        const next = cloneSources(value);
        next.hspJs += "\ngtag('event', 'sensory_reset_cta_view', {});\n";
        return next;
      },
    },
    {
      name: 'locale-dead-trust-block',
      expected: /dead legacy trust blocks/,
      apply(value) {
        const next = cloneSources(value);
        const parsed = JSON.parse(next.deJson);
        parsed.types = { antenna: { name: 'Ultra Antenna' } };
        next.deJson = JSON.stringify(parsed);
        return next;
      },
    },
    {
      name: 'manifest-health-category',
      expected: /lifestyle only/,
      apply(value) {
        const next = cloneSources(value);
        const parsed = JSON.parse(next.manifest);
        parsed.categories = ['lifestyle', 'health'];
        next.manifest = JSON.stringify(parsed);
        return next;
      },
    },
    {
      name: 'service-worker-missing-asset',
      expected: /nonexistent js\/data\.js/,
      apply(value) {
        const next = cloneSources(value);
        next.serviceWorker = next.serviceWorker.replace("'./js/app.js',", "'./js/app.js',\n    './js/data.js',");
        return next;
      },
    },
  ];

  const results = mutations.map((mutation) => {
    try {
      verifyStatic(mutation.apply(baseline));
      return { name: mutation.name, detected: false, error: 'mutation escaped' };
    } catch (error) {
      return {
        name: mutation.name,
        detected: mutation.expected.test(String(error.message)),
        error: String(error.message),
      };
    }
  });

  results.forEach((result) => {
    console.log(`${result.detected ? '[PASS]' : '[FAIL]'} mutation ${result.name}: ${result.error}`);
  });
  const escaped = results.filter((result) => !result.detected);
  assert(!escaped.length, `Mutation detection failed: ${escaped.map((item) => item.name).join(', ')}`);
  console.log(`[PASS] mutation summary ${results.length}/${results.length} detected`);
}

function localFile(requestPath) {
  const routes = [
    { prefix: '/hsp-test/', root: HSP_ROOT },
    { prefix: '/portal/', root: PORTAL_ROOT },
  ];
  const route = routes.find((candidate) => requestPath.startsWith(candidate.prefix));
  if (!route) return null;
  let relative = requestPath.slice(route.prefix.length);
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  const resolved = path.resolve(route.root, relative);
  if (!resolved.startsWith(`${route.root}${path.sep}`)) return null;
  if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) return null;
  return resolved;
}

function createServer() {
  return http.createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const filePath = localFile(requestPath);
    if (!filePath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

function eventInitScript() {
  window.__hspEventAudit = [];
  window.dataLayer = [];
  const originalPush = Array.prototype.push;
  window.dataLayer.push = function patchedDataLayerPush(...items) {
    for (const item of items) {
      const isArrayStyle = item && item[0] === 'event';
      const isObjectStyle = item && typeof item === 'object' && typeof item.event === 'string';
      if (!isArrayStyle && !isObjectStyle) continue;
      const name = isArrayStyle ? item[1] : item.event;
      const params = isArrayStyle ? (item[2] || {}) : { ...item };
      if (isObjectStyle) delete params.event;
      const cta = document.getElementById('sensory-reset-cta');
      const result = document.getElementById('screen-result');
      let ratio = 0;
      let visible = false;
      if (cta) {
        const rect = cta.getBoundingClientRect();
        const style = getComputedStyle(cta);
        const visibleWidth = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
        const visibleHeight = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
        const area = rect.width * rect.height;
        visible = style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && area > 0;
        ratio = visible && area > 0 ? (visibleWidth * visibleHeight) / area : 0;
      }
      window.__hspEventAudit.push({
        name,
        params: { ...params },
        ratio,
        visible,
        resultActive: !!result?.classList.contains('active'),
        resultDisplay: result ? getComputedStyle(result).display : null,
        scrollY,
      });
    }
    return originalPush.apply(this, items);
  };
}

async function eventRecords(page, name) {
  return page.evaluate((eventName) => (window.__hspEventAudit || []).filter((item) => !eventName || item.name === eventName), name || null);
}

function verifyNoBannedResetParams(records, label) {
  records.filter((record) => /^sensory_reset(?:_|$)/.test(record.name)).forEach((record) => {
    BANNED_RESET_PARAMS.forEach((name) => {
      assert(!Object.prototype.hasOwnProperty.call(record.params || {}, name), `${label}: ${record.name} leaks ${name}`);
    });
  });
}

function assertFunnelUrl(rawUrl, expectedLang, expectedSource, label) {
  const url = new URL(rawUrl, ORIGIN);
  const keys = Array.from(new Set(url.searchParams.keys())).sort();
  assert(keys.join('|') === [...ALLOWED_FUNNEL_QUERY_KEYS].sort().join('|'), `${label}: query keys must be lang+source only, got ${keys.join(',')}`);
  assert(url.searchParams.getAll('lang').length === 1 && url.searchParams.get('lang') === expectedLang, `${label}: lang mismatch`);
  assert(url.searchParams.getAll('source').length === 1 && url.searchParams.get('source') === expectedSource, `${label}: source mismatch`);
  ['profile', 'result', 'result_type', 'result_value', 'trigger', 'place', 'capacity'].forEach((name) => {
    assert(!url.searchParams.has(name), `${label}: forbidden query key ${name}`);
  });
  return url;
}

async function primaryMetrics(page, selector, label) {
  const locator = page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  await locator.focus();
  const metrics = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      active: document.activeElement === element,
      width: rect.width,
      height: rect.height,
      text: (element.textContent || '').trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  assert(metrics.active, `${label}: primary action cannot receive focus`);
  assert(metrics.width >= 44 && metrics.height >= 44, `${label}: primary action is below 44px (${metrics.width}x${metrics.height})`);
  assert(metrics.text, `${label}: primary action has no accessible text`);
  assert(metrics.overflow <= 0, `${label}: horizontal overflow ${metrics.overflow}px`);
  return metrics;
}

async function waitForApp(page) {
  await page.waitForFunction(() => {
    const loader = document.getElementById('app-loader');
    return !loader || loader.classList.contains('hidden') || getComputedStyle(loader).visibility === 'hidden';
  });
}

async function completeHspResult(page, origin, locale, forceBelowFold) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/hsp-test/?lang=${locale}&source=verify_hsp_reset&profile=drop&result=drop&trigger=drop&place=drop&capacity=drop&unknown=drop`, { waitUntil: 'domcontentloaded' });
  await waitForApp(page);
  const sanitizedEntry = new URL(page.url());
  const entryKeys = Array.from(new Set(sanitizedEntry.searchParams.keys())).sort();
  assert(entryKeys.join('|') === 'lang|source', `${locale}: HSP entry query was not sanitized: ${entryKeys.join(',')}`);
  assert(sanitizedEntry.searchParams.get('lang') === locale && sanitizedEntry.searchParams.get('source') === 'verify_hsp_reset', `${locale}: HSP entry attribution changed during sanitation`);
  assert((await eventRecords(page, 'sensory_reset_cta_view')).length === 0, `${locale}: reset CTA view fired before result`);
  await page.click('#btn-start');
  for (let index = 0; index < 5; index += 1) {
    if (forceBelowFold && index === 4) await page.setViewportSize({ width: 390, height: 320 });
    await page.click('#btn-limit');
    await page.waitForTimeout(430);
  }
  await page.waitForSelector('#screen-result.active');

  const result = await page.evaluate((expectedLocale) => {
    const screen = document.getElementById('screen-result');
    const boundary = document.getElementById('result-boundary');
    const cta = document.getElementById('sensory-reset-cta');
    const link = document.getElementById('sensory-reset-link');
    return {
      lang: document.documentElement.lang,
      expectedLocale,
      resetCount: document.querySelectorAll('#sensory-reset-cta').length,
      boundaryCount: document.querySelectorAll('#result-boundary').length,
      immediate: boundary?.nextElementSibling === cta,
      mapCount: screen?.querySelectorAll('#sensory-map-cta,.sensory-map-cta').length || 0,
      nextStepCount: screen?.querySelectorAll('#next-step-card,.quick-actions-card').length || 0,
      manualAdCount: screen?.querySelectorAll('ins.adsbygoogle,[data-ad-slot],#result-inline-ad').length || 0,
      percentileCount: screen?.querySelectorAll('#percentile-stat,.percentile-stat').length || 0,
      boundaryText: (boundary?.textContent || '').trim(),
      ctaTitle: (document.getElementById('sensory-reset-title')?.textContent || '').trim(),
      ctaAction: (link?.textContent || '').trim(),
      href: link?.href || '',
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, locale);
  assert(result.lang === locale, `${locale}: HSP rendered ${result.lang}`);
  assert(result.resetCount === 1 && result.boundaryCount === 1 && result.immediate, `${locale}: result reset hierarchy is invalid`);
  assert(result.mapCount === 0 && result.nextStepCount === 0 && result.manualAdCount === 0 && result.percentileCount === 0, `${locale}: forbidden result surface remains`);
  assert(result.boundaryText && result.ctaTitle && result.ctaAction, `${locale}: result boundary/reset copy is empty`);
  assert(result.overflow <= 0, `${locale}: HSP horizontal overflow ${result.overflow}px`);
  const ctaUrl = assertFunnelUrl(result.href, locale, 'hsp_result', `${locale} HSP reset CTA`);
  assert(ctaUrl.pathname === '/hsp-test/reset.html', `${locale}: reset CTA path mismatch ${ctaUrl.pathname}`);

  if (forceBelowFold) {
    await page.waitForTimeout(160);
    const earlyViews = await eventRecords(page, 'sensory_reset_cta_view');
    earlyViews.forEach((record) => {
      assert(record.visible && record.resultActive && record.resultDisplay !== 'none' && record.ratio >= 0.5, `${locale}: reset CTA view fired below 50% visibility (${record.ratio})`);
    });
    await page.setViewportSize({ width: 390, height: 844 });
  }
  if ((await eventRecords(page, 'sensory_reset_cta_view')).length === 0) {
    await page.locator('#sensory-reset-cta').scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() => (window.__hspEventAudit || []).filter((item) => item.name === 'sensory_reset_cta_view').length >= 1);
  let views = await eventRecords(page, 'sensory_reset_cta_view');
  assert(views.length === 1, `${locale}: reset CTA view count ${views.length}`);
  assert(views[0].visible && views[0].resultActive && views[0].resultDisplay !== 'none' && views[0].ratio >= 0.5, `${locale}: reset CTA view fired without real >=50% intersection (${views[0].ratio})`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(80);
  await page.locator('#sensory-reset-cta').scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  views = await eventRecords(page, 'sensory_reset_cta_view');
  assert(views.length === 1, `${locale}: reset CTA view repeated after re-entry`);
  await primaryMetrics(page, '#sensory-reset-link', `${locale} HSP reset CTA`);

  await page.evaluate(() => {
    document.getElementById('sensory-reset-link')?.addEventListener('click', (event) => event.preventDefault(), { capture: true, once: true });
  });
  await page.click('#sensory-reset-link');
  await page.waitForTimeout(50);
  const clicks = await eventRecords(page, 'sensory_reset_cta_click');
  assert(clicks.length === 1, `${locale}: reset CTA click count ${clicks.length}`);
  verifyNoBannedResetParams(views.concat(clicks), `${locale} HSP CTA`);
  return result;
}

async function completeReset(page, origin, locale) {
  await page.setViewportSize({ width: 390, height: 844 });
  const url = `${origin}/hsp-test/reset.html?lang=${locale}&source=hsp_result`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#generate-button');
  await page.waitForTimeout(60);
  assertFunnelUrl(page.url(), locale, 'hsp_result', `${locale} reset entry`);
  const primary = await primaryMetrics(page, '#generate-button', `${locale} reset generate`);

  await page.selectOption('#trigger-select', 'light');
  await page.selectOption('#place-select', 'public');
  await page.selectOption('#capacity-select', 'exit');
  await page.waitForTimeout(40);
  assertFunnelUrl(page.url(), locale, 'hsp_result', `${locale} reset customized URL`);
  await page.click('#generate-button');
  await page.waitForSelector('#result-card:not([hidden])');
  assertFunnelUrl(page.url(), locale, 'hsp_result', `${locale} reset generated URL`);

  const runtime = await page.evaluate((expectedLocale) => ({
    lang: document.documentElement.lang,
    expectedLocale,
    title: (document.querySelector('h1')?.textContent || '').trim(),
    generateText: (document.getElementById('generate-button')?.textContent || '').trim(),
    steps: document.querySelectorAll('.reset-step').length,
    visible: !document.getElementById('result-card').hidden,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }), locale);
  assert(runtime.lang === locale, `${locale}: reset rendered ${runtime.lang}`);
  assert(runtime.title && runtime.generateText && runtime.steps >= 5 && runtime.visible, `${locale}: reset flow incomplete`);
  assert(runtime.overflow <= 0, `${locale}: reset horizontal overflow ${runtime.overflow}px`);
  const records = await eventRecords(page);
  assert(records.filter((item) => item.name === 'sensory_reset_view').length === 1, `${locale}: sensory_reset_view must fire once`);
  assert(records.filter((item) => item.name === 'sensory_reset_generate').length === 1, `${locale}: sensory_reset_generate must fire once`);
  verifyNoBannedResetParams(records, `${locale} reset`);
  return { ...runtime, primary };
}

async function completeMap(page, origin, locale) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/hsp-test/map.html?lang=${locale}&source=sensory_reset`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#build');
  const primary = await primaryMetrics(page, '#build', `${locale} sensory map build`);
  await page.click('button[data-domain="noise"][data-level="high"]');
  await page.click('#build');
  await page.waitForSelector('#result:not([hidden])');
  const runtime = await page.evaluate((expectedLocale) => ({
    lang: document.documentElement.lang,
    expectedLocale,
    title: (document.querySelector('h1')?.textContent || '').trim(),
    buildText: (document.getElementById('build')?.textContent || '').trim(),
    priorities: document.querySelectorAll('.priority').length,
    visible: !document.getElementById('result').hidden,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    queryKeys: Array.from(new Set(new URL(location.href).searchParams.keys())).sort(),
  }), locale);
  assert(runtime.lang === locale, `${locale}: map rendered ${runtime.lang}`);
  assert(runtime.title && runtime.buildText && runtime.priorities === 3 && runtime.visible, `${locale}: map flow incomplete`);
  assert(runtime.overflow <= 0, `${locale}: map horizontal overflow ${runtime.overflow}px`);
  assert(runtime.queryKeys.join('|') === 'lang|source', `${locale}: map URL contains selection state`);
  return { ...runtime, primary };
}

function verifyLocalizedFlows(hspReports, resetReports, mapReports) {
  const enHsp = hspReports.find((item) => item.expectedLocale === 'en');
  const koHsp = hspReports.find((item) => item.expectedLocale === 'ko');
  const deHsp = hspReports.find((item) => item.expectedLocale === 'de');
  assert(/[가-힣]/.test(`${koHsp.boundaryText} ${koHsp.ctaTitle} ${koHsp.ctaAction}`), 'Korean HSP result copy is not localized');
  assert(deHsp.boundaryText !== enHsp.boundaryText && deHsp.ctaTitle !== enHsp.ctaTitle && deHsp.ctaAction !== enHsp.ctaAction, 'German HSP result copy falls back to English');

  const enReset = resetReports.find((item) => item.expectedLocale === 'en');
  const koReset = resetReports.find((item) => item.expectedLocale === 'ko');
  const deReset = resetReports.find((item) => item.expectedLocale === 'de');
  assert(/[가-힣]/.test(`${koReset.title} ${koReset.generateText}`), 'Korean reset copy is not localized');
  assert(deReset.title !== enReset.title && deReset.generateText !== enReset.generateText, 'German reset copy falls back to English');

  const enMap = mapReports.find((item) => item.expectedLocale === 'en');
  const koMap = mapReports.find((item) => item.expectedLocale === 'ko');
  const deMap = mapReports.find((item) => item.expectedLocale === 'de');
  assert(/[가-힣]/.test(`${koMap.title} ${koMap.buildText}`), 'Korean map copy is not localized');
  assert(deMap.title !== enMap.title && deMap.buildText !== enMap.buildText, 'German map copy falls back to English');
}

async function runRuntime(origin, production) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    serviceWorkers: 'block',
    extraHTTPHeaders: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
  });
  await context.addInitScript(eventInitScript);
  await context.route(/https:\/\/(?:www\.googletagmanager\.com|pagead2\.googlesyndication\.com)\//, async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => {
    const message = String(error?.message || error);
    if (!/^TagError:/.test(message)) pageErrors.push(message);
  });

  try {
    const hspReports = [];
    const resetReports = [];
    const mapReports = [];
    for (const locale of RUNTIME_LOCALES) {
      hspReports.push(await completeHspResult(page, origin, locale, locale === 'en'));
      resetReports.push(await completeReset(page, origin, locale));
      mapReports.push(await completeMap(page, origin, locale));
      console.log(`[PASS] runtime ${locale}: result -> reset + sensory map`);
    }
    verifyLocalizedFlows(hspReports, resetReports, mapReports);
    assert(!pageErrors.length, `Browser page errors: ${pageErrors.join(' | ')}`);
    console.log(`[PASS] ${production ? 'production' : 'local'} runtime: EN/KO/DE, 390px, focus, 44px, privacy, exact-once telemetry`);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sources = options.production ? await readProductionSources() : readLocalSources();
  verifyStatic(sources);
  console.log(`[PASS] ${options.production ? 'production' : 'local'} static: trust, hierarchy, Auto Ads, privacy, telemetry`);
  if (options.mutations) {
    runMutations(sources);
    return;
  }

  let server = null;
  let origin = ORIGIN;
  if (!options.production) {
    server = createServer();
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    origin = `http://127.0.0.1:${server.address().port}`;
  }
  try {
    await runRuntime(origin, options.production);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
