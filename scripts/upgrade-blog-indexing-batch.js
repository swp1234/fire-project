#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS_ROOT = path.join(ROOT, 'projects');
const PORTAL_ROOT = path.join(PROJECTS_ROOT, 'portal');
const BLOG_ROOT = path.join(PORTAL_ROOT, 'blog');
const ORIGIN = 'https://dopabrain.com';
const TODAY = (process.env.INDEXING_BATCH_TODAY || new Date().toISOString().slice(0, 10)).slice(0, 10);
const ADSENSE_CLIENT = 'ca-pub-3600813755953882';
const PLACEHOLDER_AD_SLOTS = ['1234567890', '9876543210', '5555555555'];

const DEFAULT_TARGETS = [
  'de/zodiac-compatibility.html',
  'es/zodiac-compatibility.html',
  'fr/zodiac-compatibility.html',
  'hi/zodiac-compatibility.html',
  'ja/zodiac-compatibility.html',
  'ko/zodiac-compatibility.html',
  'es/numerologia-calculadora-numero-vida.html',
  'fr/numerologie-nombre-vie.html',
  'ja/suushijutsu-unmei-no-kazu.html',
  'es/los-10-mejores-juegos-gratuitos-entrenamiento-cerebral-2026.html',
  'ja/2026-free-brain-games-top10.html',
  'ja/reaction-time-test-guide.html',
  'ja/typing-speed-test-guide.html',
  'ja/stress-level-selfcheck-guide.html',
  'hi/blood-type-personality.html',
  'hi/iq-test-guide.html',
  'hi/minesweeper-strategy.html',
  'ko/personality-tests.html',
  'ko/brick-breaker-retro-game-guide.html',
];

const APP_REPLACEMENTS = new Map([
  ['smart-todo-list.html', 'todo-list'],
  ['todo-list-guide.html', 'todo-list'],
  ['privacy.html', 'portal/privacy-policy.html'],
  ['daily-affirmation.html', 'affirmation'],
  ['decision-making.html', 'brain-type'],
  ['mbti-career-guide.html', 'mbti-career'],
  ['mbti-compatibility-guide.html', 'mbti-love'],
  ['mbti-love-compatibility-guide.html', 'mbti-love'],
  ['mbti-love-compatibility.html', 'mbti-love'],
  ['zodiac-compatibility-complete-guide.html', 'zodiac-match'],
  ['zodiac-match.html', 'zodiac-match'],
  ['blood-type.html', 'blood-type'],
  ['blood-type-personality.html', 'blood-type'],
  ['brain-type-test.html', 'brain-type'],
  ['animal-personality-guide.html', 'animal-personality'],
  ['animal-personality-test.html', 'animal-personality'],
  ['animal-personality-test-guide.html', 'animal-personality'],
  ['best-color-psychology-apps-2026.html', 'color-personality'],
  ['color-psychology.html', 'color-personality'],
  ['color-psychology-guide.html', 'color-personality'],
  ['color-psychology-mood.html', 'color-personality'],
  ['codependency-recovery-steps-guide.html', 'attachment-style'],
  ['digital-detox.html', 'detox-timer'],
  ['hsp-empathy-guide.html', 'hsp-test'],
  ['inner-child-healing-guide.html', 'inner-child-test'],
  ['inner-child-test-guide.html', 'inner-child-test'],
  ['emotional-neglect-signs-healing.html', 'inner-child-test'],
  ['kpop-idol-personality-test.html', 'kpop-position'],
  ['kpop-personality-guide.html', 'kpop-position'],
  ['kpop-personality-quiz.html', 'kpop-position'],
  ['kpop-personality-test-guide.html', 'kpop-position'],
  ['mbti-coffee-kohi-seikaku.html', 'mbti-coffee'],
  ['numerology-life-path.html', 'numerology'],
  ['typing-speed-improvement-guide.html', 'typing-speed'],
  ['hsp-complete-guide.html', 'hsp-test'],
  ['hsp-highly-sensitive-person-guide.html', 'hsp-test'],
  ['stress-relief-test-guide.html', 'stress-check'],
  ['stress-burnout-test.html', 'burnout-test'],
  ['burnout-test-guide.html', 'burnout-test'],
  ['stress-relief-tools-2026.html', 'stress-check'],
  ['meditation-guide.html', 'white-noise'],
  ['meditation', 'white-noise'],
  ['mindfulness', 'white-noise'],
  ['reaction-time-test', 'reaction-test'],
  ['2048-game', 'puzzle-2048'],
  ['math-quiz', 'quiz-app'],
  ['enneagram', 'animal-personality'],
  ['cbt-techniques-stop-overthinking.html', 'stress-check'],
  ['cptsd-signs-recovery.html', 'trauma-response'],
  ['emotional-flashbacks-cptsd.html', 'trauma-response'],
  ['emotional-intelligence', 'eq-test'],
  ['emotional-intelligence.html', 'eq-test'],
  ['emotional-dysregulation-signs-causes-treatment.html', 'eq-test'],
  ['emotional-triggers-understanding.html', 'eq-test'],
  ['nervous-system-regulation-techniques.html', 'stress-response'],
  ['cptsd-vs-ptsd-differences-symptoms-healing.html', 'trauma-response'],
  ['rumination-anxiety-break-cycle.html', 'stress-check'],
  ['gaslighting-signs-relationship.html', 'attachment-style'],
  ['toxic-relationship-patterns-signs.html', 'attachment-style'],
  ['dating-red-flags-checklist.html', 'attachment-style'],
  ['codependency-signs-relationship.html', 'attachment-style'],
  ['healthy-boundaries-guide.html', 'attachment-style'],
  ['avoidant-attachment-dating-guide.html', 'attachment-style'],
  ['dopamine-test', 'dopamine-type'],
  ['dopamine-test.html', 'dopamine-type'],
  ['adhd-test', 'dopamine-type'],
  ['adhd-test.html', 'dopamine-type'],
  ['brainrot-score-test-2026.html', 'dopamine-type'],
  ['high-functioning-anxiety-guide.html', 'stress-check'],
  ['fear-response-amygdala.html', 'trauma-response'],
  ['digital-detox-tips.html', 'detox-timer'],
  ['people-pleasing-fawn-response-guide.html', 'attachment-style'],
  ['trauma-response-4f-fight-flight-freeze-fawn.html', 'trauma-response'],
  ['daily-tarot-stratejisi.html', 'daily-tarot'],
  ['pomodoro-tekniği.html', 'pomodoro-timer'],
  ['tarot-pemula.html', 'daily-tarot'],
  ['pomodoro-produktivitas.html', 'pomodoro-timer'],
]);

const PATH_REPLACEMENTS = new Map([
  ['/projects/puzzle-2048', 'puzzle-2048'],
  ['/projects/pomodoro-timer', 'pomodoro-timer'],
  ['/projects/memory-card', 'memory-card'],
  ['/projects/to-do-list', 'todo-list'],
  ['/projects/todo-list', 'todo-list'],
  ['/projects/meditation', 'white-noise'],
  ['/projects/daily-tarot', 'daily-tarot'],
  ['/projects/numerology', 'numerology'],
  ['/projects/dream-fortune', 'dream-fortune'],
  ['/reaction-time-test', 'reaction-test'],
  ['/2048-game', 'puzzle-2048'],
  ['/math-quiz', 'quiz-app'],
  ['/mindfulness', 'white-noise'],
  ['/privacy.html', 'portal/privacy-policy.html'],
]);

const QUICK_CARD_SETS = {
  zodiac: [
    ['zodiac-match', 'Zodiac match', 'Compare signs'],
    ['mbti-love', 'MBTI love', 'Check relationship style'],
    ['animal-personality', 'Animal result', 'Try a fast personality path'],
    ['eq-test', 'EQ test', 'Read emotional patterns'],
  ],
  numerology: [
    ['numerology', 'Numerology', 'Calculate your number'],
    ['life-in-numbers', 'Life numbers', 'Map personal patterns'],
    ['fortune-cookie', 'Fortune cookie', 'Get a quick prompt'],
    ['daily-tarot', 'Daily tarot', 'Reflect on next steps'],
  ],
  games: [
    ['puzzle-2048', '2048', 'Play a number puzzle'],
    ['reaction-test', 'Reaction test', 'Measure speed'],
    ['minesweeper', 'Minesweeper', 'Practice logic'],
    ['brick-breaker', 'Brick breaker', 'Take a quick break'],
  ],
  personality: [
    ['animal-personality', 'Animal personality', 'Find your result'],
    ['brain-type', 'Brain type', 'Compare thinking style'],
    ['eq-test', 'EQ test', 'Read emotional patterns'],
    ['attachment-style', 'Attachment style', 'Check relationship habits'],
  ],
};

function parseArgs(argv) {
  const args = { files: [], allDefault: true };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--file') {
      args.files.push(String(argv[++i] || '').trim());
      args.allDefault = false;
    } else if (arg === '--default') {
      args.allDefault = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/upgrade-blog-indexing-batch.js
  node scripts/upgrade-blog-indexing-batch.js --file de/zodiac-compatibility.html --file es/zodiac-compatibility.html

Adds missing Article/Breadcrumb/FAQ JSON-LD, quick cards, Auto ad surface, content events,
repairs common broken internal links, and refreshes sitemap lastmod for selected portal blog pages.`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text, 'utf8');
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function decodeXml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(value) {
  return decodeXml(String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function firstMatch(text, regex) {
  const match = regex.exec(text);
  return match ? decodeXml(match[1].trim()) : '';
}

function extractAttr(tag, name) {
  const regex = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
  const match = regex.exec(tag);
  return match ? decodeXml(match[2] || match[3] || match[4] || '') : '';
}

function extractLinkTags(html) {
  return Array.from(html.matchAll(/<link\b[^>]*>/gi)).map((match) => match[0]);
}

function extractCanonical(html) {
  for (const tag of extractLinkTags(html)) {
    if (extractAttr(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical')) return extractAttr(tag, 'href');
  }
  return '';
}

function extractMetaDescription(html) {
  const tags = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).map((match) => match[0]);
  for (const tag of tags) {
    if (extractAttr(tag, 'name').toLowerCase() === 'description') return extractAttr(tag, 'content');
  }
  return '';
}

function extractOgImage(html) {
  const tags = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).map((match) => match[0]);
  for (const tag of tags) {
    if (extractAttr(tag, 'property').toLowerCase() === 'og:image') return extractAttr(tag, 'content');
  }
  return 'https://dopabrain.com/portal/icon-512.svg';
}

function extractJsonLd(html) {
  const values = [];
  const regex = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html))) {
    try {
      values.push(JSON.parse(decodeXml(match[1].trim())));
    } catch {
      values.push(null);
    }
  }
  return values;
}

function flattenJsonLd(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (typeof value !== 'object') return [];
  return [value].concat(Array.isArray(value['@graph']) ? value['@graph'].flatMap(flattenJsonLd) : []);
}

function typeMatches(node, typeName) {
  const type = node && node['@type'];
  return Array.isArray(type) ? type.includes(typeName) : type === typeName;
}

function getLangFromRelative(relativeFile) {
  const first = toPosix(relativeFile).split('/')[0] || 'en';
  return first.endsWith('.html') ? 'ko' : first;
}

function publicUrlForRelative(relativeFile) {
  return `${ORIGIN}/portal/blog/${toPosix(relativeFile)}`;
}

function resolveTargetFile(input) {
  const normalized = toPosix(input).replace(/^projects\/portal\/blog\//, '').replace(/^\/+/, '');
  const filePath = path.resolve(BLOG_ROOT, normalized);
  if (!filePath.startsWith(BLOG_ROOT)) throw new Error(`Target escapes blog root: ${input}`);
  if (!fs.existsSync(filePath)) throw new Error(`Missing target file: ${toPosix(path.relative(ROOT, filePath))}`);
  return { filePath, relativeFile: normalized };
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value);
}

function localPathForPublicHref(href) {
  const trimmed = String(href || '').trim();
  if (!trimmed || trimmed.startsWith('#')) return '';
  if (/^(mailto|tel|sms|javascript):/i.test(trimmed)) return '';
  let url;
  try {
    url = new URL(trimmed, ORIGIN);
  } catch {
    return '';
  }
  if (url.origin !== ORIGIN) return '';
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/' || pathname === '') return path.join(PROJECTS_ROOT, 'root-domain', 'index.html');
  return pathname.endsWith('/')
    ? path.join(PROJECTS_ROOT, pathname, 'index.html')
    : path.join(PROJECTS_ROOT, pathname);
}

function appHref(slug, lang) {
  if (String(slug).endsWith('.html')) return `/${String(slug).replace(/^\/+/, '')}`;
  return `/${slug}/?lang=${encodeURIComponent(lang)}`;
}

function replacementForMissingHref(href, lang) {
  const trimmed = String(href || '').trim();
  const lower = trimmed.toLowerCase();
  for (const [prefix, slug] of PATH_REPLACEMENTS.entries()) {
    if (lower === prefix || lower === `${prefix}/` || lower.startsWith(`${prefix}?`)) return appHref(slug, lang);
  }

  let pathname = lower;
  try {
    pathname = decodeURIComponent(new URL(trimmed, ORIGIN).pathname).toLowerCase();
  } catch {
    pathname = lower;
  }

  const basename = pathname.split('/').filter(Boolean).pop() || lower.split('/').pop() || '';
  if (APP_REPLACEMENTS.has(basename)) return appHref(APP_REPLACEMENTS.get(basename), lang);
  if (basename === 'free-games.html' || basename === 'best-browser-games-2026.html' || basename === 'brain-training-games.html') return '/portal/games/';
  if (basename === 'personality-tests.html') return `/portal/blog/${lang}/personality-tests.html`;
  return '';
}

function normalizeInternalHref(href, relativeFile, lang) {
  const trimmed = String(href || '').trim();
  if (!trimmed || trimmed.startsWith('#')) return href;
  if (/^(mailto|tel|sms|javascript):/i.test(trimmed)) return href;
  if (isHttpUrl(trimmed) && !trimmed.startsWith(ORIGIN)) return href;

  const blogDir = path.dirname(path.resolve(BLOG_ROOT, relativeFile));
  if (!trimmed.startsWith('/') && !isHttpUrl(trimmed)) {
    const direct = path.resolve(blogDir, trimmed);
    if (direct.startsWith(BLOG_ROOT) && fs.existsSync(direct)) {
      return `/portal/blog/${toPosix(path.relative(BLOG_ROOT, direct))}`;
    }
    if (/^[a-z]{2}\//i.test(trimmed)) {
      const langRelative = path.resolve(BLOG_ROOT, trimmed);
      if (langRelative.startsWith(BLOG_ROOT) && fs.existsSync(langRelative)) {
        return `/portal/blog/${toPosix(path.relative(BLOG_ROOT, langRelative))}`;
      }
    }
  }

  const publicLocalPath = localPathForPublicHref(trimmed);
  if (publicLocalPath && fs.existsSync(publicLocalPath)) return href;
  return replacementForMissingHref(trimmed, lang) || href;
}

function repairLinks(html, relativeFile, lang) {
  return html.replace(/\bhref=(["'])([^"']+)\1/g, (full, quote, href) => {
    const nextHref = normalizeInternalHref(href, relativeFile, lang);
    return `href=${quote}${nextHref}${quote}`;
  });
}

function chooseQuickCards(relativeFile) {
  const lower = relativeFile.toLowerCase();
  if (lower.includes('zodiac')) return QUICK_CARD_SETS.zodiac;
  if (lower.includes('numerolog') || lower.includes('suushijutsu')) return QUICK_CARD_SETS.numerology;
  if (lower.includes('game') || lower.includes('minesweeper') || lower.includes('2048') || lower.includes('reaction-time') || lower.includes('typing-speed') || lower.includes('brick-breaker')) {
    return QUICK_CARD_SETS.games;
  }
  return QUICK_CARD_SETS.personality;
}

function renderQuickRail(relativeFile, lang) {
  const cards = chooseQuickCards(relativeFile);
  return `
                <section class="indexing-quick-rail" aria-labelledby="indexing-quick-rail-title">
                    <h2 id="indexing-quick-rail-title">Quick next paths</h2>
                    <div class="quick-grid">
                        ${cards.map(([slug, title, text]) => `<a class="quick-card" href="${appHref(slug, lang)}" data-content-surface="quick_rail" data-target-slug="${slug}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></a>`).join('\n                        ')}
                    </div>
                </section>
`;
}

function ensureQuickRail(html, relativeFile, lang) {
  if (/class\s*=\s*["'][^"']*\bquick-card\b/i.test(html)) return html;
  const rail = renderQuickRail(relativeFile, lang);
  if (/<main\b[^>]*class\s*=\s*["'][^"']*\barticle-content\b[^"']*["'][^>]*>/i.test(html)) {
    return html.replace(/(<main\b[^>]*class\s*=\s*["'][^"']*\barticle-content\b[^"']*["'][^>]*>)/i, `$1${rail}`);
  }
  if (/<main\b[^>]*>/i.test(html)) return html.replace(/(<main\b[^>]*>)/i, `$1${rail}`);
  return html.replace(/(<body\b[^>]*>)/i, `$1${rail}`);
}

function renderAutoAd() {
  return `
                <div class="ad-container indexing-auto-ad" data-ad-surface="indexing_mid_article_ad" aria-label="Sponsored">
                    <ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
                </div>
`;
}

function stripScripts(html) {
  return String(html || '').replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

function ensureAutoAd(html) {
  let next = html;
  for (const slot of PLACEHOLDER_AD_SLOTS) {
    next = next.replace(new RegExp(`data-ad-slot=(["'])${slot}\\1`, 'g'), 'data-ad-slot="auto"');
  }
  const markupOnly = stripScripts(next);
  if (/data-ad-slot\s*=\s*["']auto["']/i.test(markupOnly) && /<[^>]+\bdata-ad-surface\s*=/i.test(markupOnly)) return next;
  const ad = renderAutoAd();
  if (/<div\b[^>]*class\s*=\s*["'][^"']*\bcta-section\b/i.test(next)) {
    return next.replace(/(<div\b[^>]*class\s*=\s*["'][^"']*\bcta-section\b[^>]*>)/i, `${ad}$1`);
  }
  if (/<section\b[^>]*>\s*<h2\b[^>]*>[^<]*(Related|Articles|Art)/i.test(next)) {
    return next.replace(/(<section\b[^>]*>\s*<h2\b[^>]*>[^<]*(?:Related|Articles|Art)[\s\S]*?<\/h2>)/i, `${ad}$1`);
  }
  if (/<\/main>/i.test(next)) return next.replace(/(<\/main>)/i, `${ad}$1`);
  if (/<footer\b/i.test(next)) return next.replace(/(<footer\b[^>]*>)/i, `${ad}$1`);
  return next.replace(/(<\/body>)/i, `${ad}$1`);
}

function ensureIndexingStyles(html) {
  if (/indexing-quick-rail/i.test(html) && /indexing-auto-ad/i.test(html) && /Indexing batch support/i.test(html)) {
    let next = html;
    if (!/Indexing table overflow support/i.test(next)) {
    const overflowCss = `

        /* Indexing table overflow support */
        .indexing-quick-rail,
        .indexing-auto-ad,
        .indexing-followup-section {
            max-width: 100%;
            overflow-wrap: anywhere;
        }

        table {
            max-width: 100%;
        }

        .compare-table {
            display: block;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
`;
      next = next.replace(/<\/style>/i, `${overflowCss}\n    </style>`);
    }
    if (/Indexing body overflow guard/i.test(next) && /Indexing spectrum overflow guard/i.test(next)) return next;
    if (/Indexing body overflow guard/i.test(next) && !/Indexing spectrum overflow guard/i.test(next)) {
      const spectrumCss = `

        /* Indexing spectrum overflow guard */
        .spectrum-labels {
            max-width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .spectrum-label {
            min-width: 0;
            overflow-wrap: anywhere;
        }

        @media (max-width: 760px) {
            .spectrum-labels {
                grid-template-columns: 1fr;
            }
        }
`;
      return next.replace(/<\/style>/i, `${spectrumCss}\n    </style>`);
    }
    const guardCss = `

        /* Indexing body overflow guard */
        html,
        body {
            max-width: 100%;
            overflow-x: hidden;
        }

        html,
        body,
        .hero-section,
        .cta-section,
        .article-wrapper {
            overflow-x: clip;
        }

        main,
        article,
        section,
        .container,
        .content,
        .article-content,
        .blog-content {
            max-width: 100%;
        }

        p,
        li,
        a,
        h1,
        h2,
        h3,
        h4,
        td,
        th {
            overflow-wrap: anywhere;
        }

        .compare-table,
        .comparison-table {
            display: block;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        /* Indexing spectrum overflow guard */
        .spectrum-labels {
            max-width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .spectrum-label {
            min-width: 0;
            overflow-wrap: anywhere;
        }

        @media (max-width: 760px) {
            .spectrum-labels {
                grid-template-columns: 1fr;
            }
        }
`;
    return next.replace(/<\/style>/i, `${guardCss}\n    </style>`);
  }
  const css = `

        /* Indexing batch support */
        .indexing-quick-rail {
            margin: 0 0 3rem;
        }

        .indexing-quick-rail .quick-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .indexing-quick-rail .quick-card {
            display: block;
            min-height: 96px;
            padding: 1rem;
            background: var(--card-bg, rgba(255, 255, 255, 0.06));
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
            border-radius: 8px;
            text-decoration: none;
            transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .indexing-quick-rail .quick-card:hover {
            transform: translateY(-2px);
            border-color: var(--primary, #8ab4ff);
            background: rgba(255, 255, 255, 0.08);
            text-decoration: none;
        }

        .indexing-quick-rail .quick-card strong {
            display: block;
            color: var(--text-primary, #fff);
            margin-bottom: 0.35rem;
        }

        .indexing-quick-rail .quick-card span {
            display: block;
            color: var(--text-secondary, #cbd5e1);
            font-size: 0.92rem;
            line-height: 1.45;
        }

        .indexing-auto-ad {
            min-height: 120px;
            margin: 2.5rem 0;
            padding: 1rem;
            border: 1px dashed var(--border-color, rgba(255, 255, 255, 0.18));
            border-radius: 8px;
        }

        /* Indexing table overflow support */
        .indexing-quick-rail,
        .indexing-auto-ad,
        .indexing-followup-section {
            max-width: 100%;
            overflow-wrap: anywhere;
        }

        table {
            max-width: 100%;
        }

        .compare-table {
            display: block;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        /* Indexing body overflow guard */
        html,
        body {
            max-width: 100%;
            overflow-x: hidden;
        }

        main,
        article,
        section,
        .container,
        .content,
        .article-content,
        .blog-content {
            max-width: 100%;
        }

        p,
        li,
        a,
        h1,
        h2,
        h3,
        h4,
        td,
        th {
            overflow-wrap: anywhere;
        }

        .compare-table,
        .comparison-table {
            display: block;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        /* Indexing spectrum overflow guard */
        .spectrum-labels {
            max-width: 100%;
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .spectrum-label {
            min-width: 0;
            overflow-wrap: anywhere;
        }

        .indexing-followup-section {
            margin: 2.5rem 0;
            padding: 1.5rem;
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
            border-radius: 8px;
            background: var(--card-bg, rgba(255, 255, 255, 0.06));
        }

        .indexing-followup-section .related-links {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.75rem;
            margin: 1rem 0 0;
            padding: 0;
            list-style: none;
        }

        .indexing-followup-section .related-links a {
            display: block;
            min-height: 44px;
            padding: 0.8rem 0.9rem;
            border: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
            border-radius: 8px;
            text-decoration: none;
        }

        @media (max-width: 760px) {
            .indexing-quick-rail .quick-grid {
                grid-template-columns: 1fr;
            }

            .indexing-followup-section .related-links {
                grid-template-columns: 1fr;
            }
        }
`;
  return html.replace(/<\/style>/i, `${css}\n    </style>`);
}

function hasCtaSelector(html) {
  const markupOnly = stripScripts(html);
  return (
    /<a\b[^>]*class\s*=\s*["'][^"']*\b(?:cta-button|cta-btn|game-link)\b/i.test(markupOnly) ||
    /<a\b[^>]*data-content-surface\s*=\s*["'][^"']*cta/i.test(markupOnly) ||
    /class\s*=\s*["'][^"']*\btest-cta\b[\s\S]*?<a\b/i.test(markupOnly)
  );
}

function hasRelatedSelector(html) {
  const markupOnly = stripScripts(html);
  return (
    /<a\b[^>]*class\s*=\s*["'][^"']*\brelated-card\b/i.test(markupOnly) ||
    /<a\b[^>]*class\s*=\s*["'][^"']*\brelated-link\b/i.test(markupOnly) ||
    /class\s*=\s*["'][^"']*\brelated-links\b[\s\S]*?<a\b/i.test(markupOnly) ||
    /<a\b[^>]*class\s*=\s*["'][^"']*\blink-item\b/i.test(markupOnly)
  );
}

function renderFollowupSection(relativeFile, lang) {
  const cards = chooseQuickCards(relativeFile);
  const [ctaSlug, ctaTitle] = cards[0];
  const related = cards.slice(1);
  return `
                <section class="indexing-followup-section" aria-labelledby="indexing-followup-title">
                    <h2 id="indexing-followup-title">Continue with DopaBrain</h2>
                    <a class="cta-button" href="${appHref(ctaSlug, lang)}" data-content-surface="cta" data-target-slug="${ctaSlug}">${escapeHtml(ctaTitle)}</a>
                    <ul class="related-links">
                        ${related.map(([slug, title]) => `<li><a class="related-link" href="${appHref(slug, lang)}" data-content-surface="related" data-target-slug="${slug}">${escapeHtml(title)}</a></li>`).join('\n                        ')}
                    </ul>
                </section>
`;
}

function ensureActionLinks(html, relativeFile, lang) {
  if (hasCtaSelector(html) && hasRelatedSelector(html)) return html;
  if (/indexing-followup-section/i.test(html)) return html;
  const section = renderFollowupSection(relativeFile, lang);
  if (/<footer\b/i.test(html)) return html.replace(/(<footer\b[^>]*>)/i, `${section}$1`);
  if (/<\/main>/i.test(html)) return html.replace(/(<\/main>)/i, `${section}$1`);
  return html.replace(/(<\/body>)/i, `${section}$1`);
}

function removeJsonLd(html) {
  return html.replace(/\s*<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n');
}

function findArticleNode(html) {
  const nodes = extractJsonLd(html).flatMap(flattenJsonLd);
  return nodes.find((node) => typeMatches(node, 'Article') || typeMatches(node, 'BlogPosting')) || {};
}

function renderJsonLd(html, relativeFile, lang, url) {
  const article = findArticleNode(html);
  const title = stripTags(firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)) || stripTags(firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)).replace(/\s*\|\s*DopaBrain\s*$/i, '') || 'DopaBrain guide';
  const description = extractMetaDescription(html) || article.description || `${title} from DopaBrain.`;
  const image = extractOgImage(html) || article.image || 'https://dopabrain.com/portal/icon-512.svg';
  const datePublished = String(article.datePublished || firstMatch(html, /"datePublished"\s*:\s*"([^"]+)"/i) || '2026-02-10').slice(0, 10);
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        image,
        datePublished,
        dateModified: TODAY,
        inLanguage: lang,
        author: { '@type': 'Organization', name: 'DopaBrain', url: ORIGIN },
        publisher: {
          '@type': 'Organization',
          name: 'DopaBrain',
          url: ORIGIN,
          logo: { '@type': 'ImageObject', url: `${ORIGIN}/portal/icon-512.svg` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DopaBrain', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: `Blog ${lang.toUpperCase()}`, item: `${ORIGIN}/portal/blog/${lang}/` },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How should I use this guide?',
            acceptedAnswer: { '@type': 'Answer', text: 'Use it as a practical starting point, then try the linked DopaBrain test or tool for a more personal result.' },
          },
          {
            '@type': 'Question',
            name: 'Is this result final advice?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. DopaBrain guides and tests are for reflection and entertainment, not professional, medical, legal, or financial advice.' },
          },
          {
            '@type': 'Question',
            name: 'What should I do next?',
            acceptedAnswer: { '@type': 'Answer', text: 'Open one of the quick cards, compare your result, and use the related links to continue with a focused follow-up path.' },
          },
        ],
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(graph).replace(/<\/script/gi, '<\\/script')}</script>`;
}

function ensureJsonLd(html, relativeFile, lang, url) {
  const withoutJsonLd = removeJsonLd(html);
  const jsonLd = `\n    ${renderJsonLd(html, relativeFile, lang, url)}\n`;
  if (/<!--\s*Google Analytics 4\s*-->/i.test(withoutJsonLd)) {
    return withoutJsonLd.replace(/<!--\s*Google Analytics 4\s*-->/i, `${jsonLd}\n    <!-- Google Analytics 4 -->`);
  }
  return withoutJsonLd.replace(/<\/head>/i, `${jsonLd}</head>`);
}

function ensureAdLoader(html) {
  if (/\/portal\/js\/ad-loader\.js/i.test(html)) return html;
  return html.replace(/<\/head>/i, '    <script src="/portal/js/ad-loader.js"></script>\n</head>');
}

function ensureTelemetry(html, relativeFile, lang) {
  html = html.replace(
    "target.closest('.cta-section') || target.classList.contains('cta-button') || target.getAttribute('data-content-surface') === 'cta'",
    "target.closest('.cta-section') || target.closest('.cta-box') || target.closest('.test-cta') || target.classList.contains('cta-btn') || target.classList.contains('cta-button') || target.classList.contains('game-link') || target.getAttribute('data-content-surface') === 'cta'"
  );
  html = html.replace(
    "target.closest('.cta-section') || target.closest('.cta-box') || target.classList.contains('cta-btn') || target.classList.contains('cta-button') || target.getAttribute('data-content-surface') === 'cta'",
    "target.closest('.cta-section') || target.closest('.cta-box') || target.closest('.test-cta') || target.classList.contains('cta-btn') || target.classList.contains('cta-button') || target.classList.contains('game-link') || target.getAttribute('data-content-surface') === 'cta'"
  );
  html = html.replace(
    "target.closest('.related-posts') || target.classList.contains('related-card') || target.closest('.related-card')",
    "target.closest('.related-posts') || target.closest('.related-links') || target.classList.contains('related-link') || target.classList.contains('related-card') || target.closest('.related-card')"
  );
  html = html.replace(
    "track('content_view');\n            document.querySelectorAll('[data-ad-surface]').forEach(function(node, index) {",
    "function emitInitialContentEvents() {\n                track('content_view');\n                document.querySelectorAll('[data-ad-surface]').forEach(function(node, index) {"
  );
  html = html.replace(
    "            });\n\n            document.addEventListener('click', function(event) {",
    "                });\n            }\n\n            if (document.readyState === 'loading') {\n                document.addEventListener('DOMContentLoaded', emitInitialContentEvents, { once: true });\n            } else {\n                emitInitialContentEvents();\n            }\n\n            document.addEventListener('click', function(event) {"
  );
  const expected = ['content_view', 'content_ad_impression', 'content_test_click', 'content_cta_click', 'content_related_click'];
  if (expected.every((eventName) => html.includes(eventName)) && /indexingContentTelemetry/i.test(html)) return html;
  const contentId = path.basename(relativeFile);
  const script = `
    <script>
        (function indexingContentTelemetry() {
            function track(name, params) {
                if (typeof gtag !== 'function') return;
                gtag('event', name, Object.assign({
                    event_category: 'content',
                    page_path: location.pathname,
                    content_locale: ${JSON.stringify(lang)},
                    content_id: ${JSON.stringify(contentId)}
                }, params || {}));
            }

            function emitInitialContentEvents() {
                track('content_view');
                document.querySelectorAll('[data-ad-surface]').forEach(function(node, index) {
                    track('content_ad_impression', {
                        ad_surface: node.getAttribute('data-ad-surface') || 'article_ad',
                        ad_index: index + 1
                    });
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', emitInitialContentEvents, { once: true });
            } else {
                emitInitialContentEvents();
            }

            document.addEventListener('click', function(event) {
                var target = event.target && event.target.closest ? event.target.closest('a,button') : null;
                if (!target) return;
                if (target.closest('.quick-card')) {
                    track('content_test_click', { link_url: target.href || '', target_slug: target.getAttribute('data-target-slug') || '' });
                } else if (target.closest('.cta-section') || target.closest('.cta-box') || target.closest('.test-cta') || target.classList.contains('cta-btn') || target.classList.contains('cta-button') || target.classList.contains('game-link') || target.getAttribute('data-content-surface') === 'cta') {
                    track('content_cta_click', { link_url: target.href || '' });
                } else if (target.closest('.related-posts') || target.closest('.related-links') || target.classList.contains('related-link') || target.classList.contains('related-card') || target.closest('.related-card')) {
                    track('content_related_click', { link_url: target.href || '' });
                } else if (target.closest('.toc')) {
                    track('content_toc_click', { target: target.getAttribute('href') || '' });
                }
            }, true);
        })();
    </script>
`;
  if (/<script\s+src=["']\/portal\/js\/cross-promo\.js["'][^>]*><\/script>/i.test(html)) {
    return html.replace(/<script\s+src=["']\/portal\/js\/cross-promo\.js["'][^>]*><\/script>/i, `${script}\n    <script src="/portal/js/cross-promo.js" defer></script>`);
  }
  return html.replace(/(<\/body>)/i, `${script}\n    <script src="/portal/js/cross-promo.js" defer></script>\n$1`);
}

function ensureCanonical(html, url) {
  if (extractCanonical(html)) {
    return html.replace(/<link\b([^>]*rel\s*=\s*["'][^"']*\bcanonical\b[^"']*["'][^>]*)>/i, (tag) => {
      if (/\bhref\s*=/i.test(tag)) return tag.replace(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/i, `href="${url}"`);
      return tag.replace(/>$/, ` href="${url}">`);
    });
  }
  return html.replace(/<\/head>/i, `    <link rel="canonical" href="${url}">\n</head>`);
}

function ensureSelfHreflang(html, lang, url) {
  const selfRegex = new RegExp(`<link\\b[^>]*rel\\s*=\\s*["'][^"']*\\balternate\\b[^"']*["'][^>]*hreflang\\s*=\\s*["']${lang}["'][^>]*>`, 'i');
  if (selfRegex.test(html)) return html;
  const canonicalTag = /<link\b[^>]*rel\s*=\s*["'][^"']*\bcanonical\b[^"']*["'][^>]*>/i;
  if (canonicalTag.test(html)) return html.replace(canonicalTag, (tag) => `${tag}\n    <link rel="alternate" hreflang="${lang}" href="${url}">`);
  return html.replace(/<\/head>/i, `    <link rel="alternate" hreflang="${lang}" href="${url}">\n</head>`);
}

function updateSitemapLastmod(filePath, urls) {
  let xml = readText(filePath);
  for (const url of urls) {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    xml = xml.replace(
      new RegExp(`(<loc>${escaped}<\\/loc>\\s*<lastmod>)[^<]+(<\\/lastmod>)`, 'g'),
      `$1${TODAY}$2`
    );
  }
  writeText(filePath, xml);
}

function upgradeOne(target) {
  const { filePath, relativeFile } = resolveTargetFile(target);
  const lang = getLangFromRelative(relativeFile);
  const url = publicUrlForRelative(relativeFile);
  let html = readText(filePath);

  html = ensureCanonical(html, url);
  html = ensureSelfHreflang(html, lang, url);
  html = repairLinks(html, relativeFile, lang);
  html = ensureJsonLd(html, relativeFile, lang, url);
  html = ensureAdLoader(html);
  html = ensureQuickRail(html, relativeFile, lang);
  html = ensureAutoAd(html);
  html = ensureActionLinks(html, relativeFile, lang);
  html = ensureIndexingStyles(html);
  html = ensureTelemetry(html, relativeFile, lang);

  writeText(filePath, html);
  return { file: toPosix(path.relative(ROOT, filePath)), url };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targets = args.allDefault ? DEFAULT_TARGETS : args.files;
  const changed = [];
  for (const target of targets) {
    try {
      changed.push(upgradeOne(target));
    } catch (error) {
      console.error(`${target}: ${error.message}`);
      process.exitCode = 1;
    }
  }

  if (changed.length > 0) {
    const urls = changed.map((item) => item.url);
    updateSitemapLastmod(path.join(PORTAL_ROOT, 'sitemap.xml'), urls);
    updateSitemapLastmod(path.join(BLOG_ROOT, 'sitemap.xml'), urls);
  }

  console.log(`Upgraded ${changed.length} blog indexing page(s) for ${TODAY}:`);
  for (const item of changed) console.log(`- ${item.file}`);
}

main();
