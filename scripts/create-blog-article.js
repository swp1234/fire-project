#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORTAL_ROOT = path.join(ROOT, 'projects', 'portal');
const DEFAULT_AD_CLIENT = 'ca-pub-3600813755953882';
const DEFAULT_GA_ID = 'G-J8GSWM40TV';

function parseArgs(argv) {
  const args = {
    spec: '',
    write: false,
    dryRun: false,
    printSample: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--spec') args.spec = argv[++i] || '';
    else if (arg === '--write') args.write = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--print-sample') args.printSample = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (args.write && args.dryRun) {
    throw new Error('Use either --write or --dry-run, not both.');
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/create-blog-article.js --print-sample
  node scripts/create-blog-article.js --spec path/to/spec.json --dry-run
  node scripts/create-blog-article.js --spec path/to/spec.json --write

The command is safe by default. It only writes files when --write is present.
For English blog posts, it also updates portal/blog/en/index.html category counts.
For every language, it updates projects/portal/sitemap.xml and projects/portal/blog/sitemap.xml.`);
}

function sampleSpec() {
  return {
    lang: 'en',
    slug: 'example-trend-article-2026',
    title: 'Example Trend Article 2026: What To Do Next',
    h1: 'Example Trend Article 2026: What To Do Next',
    description: 'A practical trend-aware guide that connects a search topic to a DopaBrain test or tool.',
    keywords: ['example trend', 'free test', 'DopaBrain'],
    category: 'tests',
    tag: 'Trend',
    tagColor: '#14b8a6',
    readTime: '8 min',
    themeColor: '#14b8a6',
    contentGroup: 'trend_growth',
    contentSlug: 'example-trend-article-2026',
    ogImage: 'https://dopabrain.com/portal/img/og/burnout-test.png',
    date: '2026-05-30',
    quickRail: {
      title: 'Start With the Best Next Step',
      description: 'Pick the tool that matches your current state.',
      cards: [
        {
          title: 'Burnout Test',
          description: 'Check whether this topic is landing on top of exhaustion.',
          url: 'https://dopabrain.com/burnout-test/',
          surface: 'quick_burnout_test',
          targetSlug: 'burnout-test',
        },
        {
          title: 'Stress Check',
          description: 'Separate planning from high-alert stress.',
          url: 'https://dopabrain.com/stress-check/',
          surface: 'quick_stress_check',
          targetSlug: 'stress-check',
        },
      ],
    },
    cta: {
      title: 'Take the Free Test',
      body: 'Use the test first, then come back to the guide with a clearer state.',
      label: 'Start the Test ->',
      url: 'https://dopabrain.com/burnout-test/',
      surface: 'intro_burnout_test',
      targetSlug: 'burnout-test',
    },
    sections: [
      {
        heading: 'What This Trend Means',
        paragraphs: [
          'Explain the trend in plain language and connect it to the reader intent.',
          'Keep the first section practical, not just descriptive.',
        ],
      },
      {
        heading: 'Quick Self-Check',
        paragraphs: ['Use this checklist before choosing the next action.'],
        bullets: [
          'This topic keeps showing up in your feed.',
          'You are not sure whether the concern is practical or emotional.',
          'You want a concrete next step.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is this a diagnosis?',
        answer: 'No. DopaBrain articles and tests are educational and reflective, not medical, legal, or financial advice.',
      },
      {
        question: 'What should I do next?',
        answer: 'Start with one small action, then use a relevant DopaBrain test or tool to clarify the pattern.',
      },
    ],
    related: [
      {
        label: 'Burnout Test',
        url: 'https://dopabrain.com/burnout-test/',
        surface: 'related_burnout_test',
        targetSlug: 'burnout-test',
      },
      {
        label: 'Stress Check',
        url: 'https://dopabrain.com/stress-check/',
        surface: 'related_stress_check',
        targetSlug: 'stress-check',
      },
    ],
    sources: [
      {
        label: 'Google Search Central helpful content',
        url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      },
    ],
  };
}

function loadSpec(specPath) {
  const resolved = path.resolve(ROOT, specPath);
  if (!resolved.startsWith(ROOT)) {
    throw new Error(`Spec must be inside the workspace: ${specPath}`);
  }
  return JSON.parse(fs.readFileSync(resolved, 'utf8'));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeSlug(slug) {
  return String(slug || '').trim().replace(/\.html$/i, '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function escapeJsSingle(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n');
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function listText(value) {
  return asArray(value).join(', ');
}

function validateSpec(spec) {
  const required = ['lang', 'slug', 'title', 'description', 'category', 'tag', 'tagColor', 'readTime', 'contentGroup'];
  const missing = required.filter((key) => !spec[key]);
  if (missing.length) throw new Error(`Missing required spec fields: ${missing.join(', ')}`);

  spec.slug = normalizeSlug(spec.slug);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(spec.slug)) {
    throw new Error('slug must be lowercase kebab-case, without .html');
  }

  spec.lang = String(spec.lang).trim();
  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(spec.lang)) {
    throw new Error('lang must look like en, ko, zh, ja, or pt-BR');
  }

  spec.contentSlug = normalizeSlug(spec.contentSlug || spec.slug);
  spec.h1 = spec.h1 || spec.title;
  spec.date = spec.date || today();
  spec.themeColor = spec.themeColor || spec.tagColor || '#14b8a6';
  spec.ogImage = spec.ogImage || 'https://dopabrain.com/portal/img/og/burnout-test.png';
  spec.keywords = listText(spec.keywords);
  spec.priority = spec.priority || '0.8';
  spec.changefreq = spec.changefreq || 'monthly';
  spec.quickRail = spec.quickRail || { title: 'Start Here', description: '', cards: [] };
  spec.quickRail.cards = asArray(spec.quickRail.cards);
  spec.sections = asArray(spec.sections);
  spec.faq = asArray(spec.faq);
  spec.related = asArray(spec.related);
  spec.sources = asArray(spec.sources);

  if (spec.quickRail.cards.length === 0) {
    throw new Error('quickRail.cards must include at least one card.');
  }
  if (spec.sections.length === 0) {
    throw new Error('sections must include at least one section.');
  }
  if (spec.faq.length < 2) {
    throw new Error('faq should include at least two Q&A items.');
  }
  if (spec.related.length === 0) {
    throw new Error('related must include at least one link.');
  }

  for (const [index, card] of spec.quickRail.cards.entries()) {
    for (const key of ['title', 'description', 'url', 'surface', 'targetSlug']) {
      if (!card[key]) throw new Error(`quickRail.cards[${index}].${key} is required.`);
    }
  }

  return spec;
}

function pageUrl(spec) {
  return `https://dopabrain.com/portal/blog/${spec.lang}/${spec.slug}.html`;
}

function pagePath(spec) {
  return `/portal/blog/${spec.lang}/${spec.slug}.html`;
}

function renderParagraphs(paragraphs) {
  return asArray(paragraphs).map((text) => `            <p>${escapeHtml(text)}</p>`).join('\n');
}

function renderBullets(bullets) {
  const items = asArray(bullets);
  if (!items.length) return '';
  return [
    '            <ul>',
    ...items.map((item) => `                <li>${escapeHtml(item)}</li>`),
    '            </ul>',
  ].join('\n');
}

function renderSection(section) {
  return [
    `            <h2>${escapeHtml(section.heading)}</h2>`,
    renderParagraphs(section.paragraphs),
    renderBullets(section.bullets),
  ].filter(Boolean).join('\n');
}

function renderQuickCards(cards) {
  return cards.map((card) => `                    <a href="${escapeAttr(card.url)}" class="quick-scaffold-card" data-content-surface="${escapeAttr(card.surface)}" data-target-slug="${escapeAttr(card.targetSlug)}">
                        <strong>${escapeHtml(card.title)}</strong>
                        <span>${escapeHtml(card.description)}</span>
                    </a>`).join('\n');
}

function renderFaqJson(faq) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }, null, 8).replace(/^ {8}/gm, '    ');
}

function renderArticleJson(spec) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: spec.title,
    description: spec.description,
    image: spec.ogImage,
    datePublished: spec.date,
    dateModified: spec.date,
    inLanguage: spec.lang,
    author: { '@type': 'Organization', name: 'DopaBrain', url: 'https://dopabrain.com/' },
    publisher: {
      '@type': 'Organization',
      name: 'DopaBrain',
      url: 'https://dopabrain.com/',
      logo: { '@type': 'ImageObject', url: 'https://dopabrain.com/portal/icon-512.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl(spec) },
  }, null, 8).replace(/^ {8}/gm, '    ');
}

function renderBreadcrumbJson(spec) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'DopaBrain', item: 'https://dopabrain.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://dopabrain.com/portal/blog/${spec.lang}/` },
      { '@type': 'ListItem', position: 3, name: spec.h1 },
    ],
  }, null, 8).replace(/^ {8}/gm, '    ');
}

function renderRelatedLinks(links) {
  return links.map((link) => `                <a href="${escapeAttr(link.url)}" data-content-surface="${escapeAttr(link.surface)}" data-target-slug="${escapeAttr(link.targetSlug)}">${escapeHtml(link.label)}</a>`).join('\n');
}

function renderSources(sources) {
  if (!sources.length) return '';
  return `
            <h2>Sources Mentioned</h2>
            <p>${sources.map((source) => `<a href="${escapeAttr(source.url)}" class="inline-link" data-content-surface="source_link" data-target-slug="external-source">${escapeHtml(source.label)}</a>`).join(', ')}</p>`;
}

function renderArticle(spec) {
  const cta = spec.cta || spec.quickRail.cards[0];
  const ctaTitle = cta.title || spec.quickRail.cards[0].title;
  const ctaBody = cta.body || spec.quickRail.cards[0].description;
  const ctaLabel = cta.label || `Start ${spec.quickRail.cards[0].title} ->`;
  const ctaUrl = cta.url || spec.quickRail.cards[0].url;
  const ctaSurface = cta.surface || spec.quickRail.cards[0].surface;
  const ctaTargetSlug = cta.targetSlug || spec.quickRail.cards[0].targetSlug;

  return `<!DOCTYPE html>
<html lang="${escapeAttr(spec.lang)}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="description" content="${escapeAttr(spec.description)}">
    <meta name="keywords" content="${escapeAttr(spec.keywords)}">
    <meta name="author" content="DopaBrain">
    <meta name="theme-color" content="${escapeAttr(spec.themeColor)}">
    <title>${escapeHtml(spec.title)} | DopaBrain</title>

    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeAttr(spec.title)}">
    <meta property="og:description" content="${escapeAttr(spec.description)}">
    <meta property="og:image" content="${escapeAttr(spec.ogImage)}">
    <meta property="og:url" content="${escapeAttr(pageUrl(spec))}">
    <meta property="og:site_name" content="DopaBrain">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(spec.title)}">
    <meta name="twitter:description" content="${escapeAttr(spec.description)}">
    <meta name="twitter:image" content="${escapeAttr(spec.ogImage)}">

    <link rel="canonical" href="${escapeAttr(pageUrl(spec))}">

    <script type="application/ld+json">
${renderArticleJson(spec)}
    </script>

    <script type="application/ld+json">
${renderFaqJson(spec.faq)}
    </script>

    <script type="application/ld+json">
${renderBreadcrumbJson(spec)}
    </script>

    <script async src="https://www.googletagmanager.com/gtag/js?id=${DEFAULT_GA_ID}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${DEFAULT_GA_ID}');</script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${DEFAULT_AD_CLIENT}" crossorigin="anonymous"></script>

    <style>
        :root {
            --primary: ${spec.themeColor};
            --primary-light: #5eead4;
            --accent: #f59e0b;
            --danger: #ef4444;
            --bg-dark: #07110f;
            --text-primary: #f4fffd;
            --text-secondary: #aabbb8;
            --border-color: rgba(94,234,212,0.2);
            --card-bg: rgba(20,184,166,0.08);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(180deg, rgba(20,184,166,0.12), rgba(7,17,15,0) 360px), var(--bg-dark);
            color: var(--text-primary);
            line-height: 1.78;
            -webkit-font-smoothing: antialiased;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 32px 20px 60px; }
        .breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; }
        .breadcrumb a { color: var(--primary-light); text-decoration: none; }
        h1 { font-size: clamp(31px, 6vw, 47px); font-weight: 900; line-height: 1.18; margin-bottom: 16px; }
        .meta { font-size: 13px; color: var(--text-secondary); margin-bottom: 28px; }
        h2 { font-size: 24px; color: var(--primary-light); margin: 42px 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--border-color); }
        h3 { font-size: 19px; color: var(--text-primary); margin: 26px 0 10px; }
        p { margin-bottom: 16px; color: var(--text-secondary); font-size: 16px; }
        a { color: var(--primary-light); }
        ul, ol { margin: 0 0 22px 24px; color: var(--text-secondary); }
        li { margin-bottom: 9px; }
        strong { color: var(--text-primary); }
        .lead { font-size: 17px; color: #d9fffb; }
        .quick-scaffold-rail { margin: 30px 0; padding: 22px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); }
        .quick-scaffold-rail h2 { margin: 0 0 8px; padding: 0; border: 0; font-size: 21px; }
        .quick-scaffold-rail p { margin-bottom: 14px; font-size: 15px; }
        .quick-scaffold-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .quick-scaffold-card { display: block; min-height: 110px; padding: 15px; background: rgba(13,28,26,0.88); border: 1px solid rgba(94,234,212,0.18); border-radius: 8px; color: var(--text-primary); text-decoration: none; transition: transform 0.2s, border-color 0.2s, background 0.2s; }
        .quick-scaffold-card:hover { transform: translateY(-1px); border-color: var(--primary-light); background: rgba(20,184,166,0.13); }
        .quick-scaffold-card strong { display: block; margin-bottom: 5px; color: var(--primary-light); font-size: 15px; }
        .quick-scaffold-card span { display: block; color: var(--text-secondary); font-size: 13px; line-height: 1.5; }
        .cta-box { background: linear-gradient(135deg, rgba(20,184,166,0.15), rgba(245,158,11,0.11)); border: 1.5px solid rgba(94,234,212,0.28); border-radius: 8px; padding: 28px 24px; margin: 32px 0; text-align: center; }
        .cta-box h3 { color: var(--primary-light); margin-top: 0; }
        .cta-btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #06120f; text-decoration: none; border-radius: 8px; font-weight: 850; min-height: 44px; }
        .ad-shell { margin: 34px 0; padding: 20px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; text-align: center; min-height: 250px; }
        .faq-item { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 18px; margin-bottom: 12px; }
        .faq-item h3 { margin-top: 0; font-size: 17px; }
        .related-links { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
        .related-links a { padding: 10px 16px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; color: var(--primary-light); text-decoration: none; font-size: 14px; font-weight: 750; }
        footer { text-align: center; padding: 32px 0; border-top: 1px solid var(--border-color); margin-top: 42px; }
        footer a { color: var(--primary-light); text-decoration: none; }
        @media (max-width: 620px) {
            .container { padding: 22px 16px 44px; }
            .quick-scaffold-grid { grid-template-columns: 1fr; }
            .quick-scaffold-card { min-height: 96px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <nav class="breadcrumb">
            <a href="https://dopabrain.com/">DopaBrain</a> &rsaquo;
            <a href="https://dopabrain.com/portal/blog/${escapeAttr(spec.lang)}/">Blog</a> &rsaquo;
            ${escapeHtml(spec.h1)}
        </nav>

        <article>
            <h1>${escapeHtml(spec.h1)}</h1>
            <div class="meta">Published ${escapeHtml(spec.date)} &bull; ${escapeHtml(spec.readTime)} read &bull; By DopaBrain Team</div>

            <p class="lead">${escapeHtml(spec.description)}</p>

            <section class="quick-scaffold-rail" aria-labelledby="quick-scaffold-title">
                <h2 id="quick-scaffold-title">${escapeHtml(spec.quickRail.title)}</h2>
                <p>${escapeHtml(spec.quickRail.description)}</p>
                <div class="quick-scaffold-grid">
${renderQuickCards(spec.quickRail.cards)}
                </div>
            </section>

            <div class="cta-box">
                <h3>${escapeHtml(ctaTitle)}</h3>
                <p>${escapeHtml(ctaBody)}</p>
                <a href="${escapeAttr(ctaUrl)}" class="cta-btn" data-content-surface="${escapeAttr(ctaSurface)}" data-target-slug="${escapeAttr(ctaTargetSlug)}">${escapeHtml(ctaLabel)}</a>
            </div>

${spec.sections.map(renderSection).join('\n\n')}

            <h2>Frequently Asked Questions</h2>
${spec.faq.map((item) => `            <div class="faq-item">
                <h3>${escapeHtml(item.question)}</h3>
                <p>${escapeHtml(item.answer)}</p>
            </div>`).join('\n')}

            <div class="ad-shell" data-ad-surface="before_related_ad" aria-label="Sponsored">
                <ins class="adsbygoogle" style="display:block" data-ad-client="${DEFAULT_AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
                <script>
                    try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
                </script>
            </div>

            <h2>Related Tools and Guides</h2>
            <p>Use these next if you want a more specific result or a practical follow-up path.</p>
            <div class="related-links">
${renderRelatedLinks(spec.related)}
            </div>
${renderSources(spec.sources)}
        </article>

        <footer>
            <p><a href="https://dopabrain.com/">DopaBrain</a> &bull; <a href="https://dopabrain.com/portal/">All Content</a> &bull; <a href="https://dopabrain.com/portal/blog/${escapeAttr(spec.lang)}/">Blog</a></p>
            <p style="margin-top:8px;font-size:13px;color:var(--text-secondary)">&copy; 2026 DopaBrain. All rights reserved.</p>
        </footer>
    </div>

    <div style="max-width:800px;margin:20px auto;padding:0 20px" data-ad-surface="bottom_ad">
        <ins class="adsbygoogle" style="display:block" data-ad-client="${DEFAULT_AD_CLIENT}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>
            try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        </script>
    </div>

    <script>
        function trackContentEvent(eventName, params) {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, Object.assign({
                    content_group: '${escapeJsSingle(spec.contentGroup)}',
                    content_slug: '${escapeJsSingle(spec.contentSlug)}',
                    page_path: '${escapeJsSingle(pagePath(spec))}',
                    page_language: '${escapeJsSingle(spec.lang)}',
                    transport_type: 'beacon'
                }, params || {}));
            }
        }

        trackContentEvent('content_view', { content_type: 'blog' });

        document.querySelectorAll('.cta-btn').forEach(function(element) {
            element.addEventListener('click', function() {
                trackContentEvent('content_cta_click', {
                    target_url: this.getAttribute('href') || '',
                    target_label: this.textContent.trim(),
                    cta_surface: this.dataset.contentSurface || '',
                    target_slug: this.dataset.targetSlug || ''
                });
            });
        });

        document.querySelectorAll('.quick-scaffold-card').forEach(function(link) {
            link.addEventListener('click', function() {
                trackContentEvent('content_test_click', {
                    target_url: this.getAttribute('href') || '',
                    target_label: this.textContent.trim(),
                    cta_surface: this.dataset.contentSurface || '',
                    target_slug: this.dataset.targetSlug || '',
                    section_name: '${escapeJsSingle(spec.quickRail.title)}'
                });
            });
        });

        document.querySelectorAll('.inline-link').forEach(function(link) {
            link.addEventListener('click', function() {
                trackContentEvent('content_inline_click', {
                    target_url: this.getAttribute('href') || '',
                    target_label: this.textContent.trim(),
                    cta_surface: this.dataset.contentSurface || '',
                    target_slug: this.dataset.targetSlug || ''
                });
            });
        });

        document.querySelectorAll('.related-links a').forEach(function(link) {
            link.addEventListener('click', function() {
                trackContentEvent('content_related_click', {
                    target_url: this.getAttribute('href') || '',
                    target_label: this.textContent.trim(),
                    cta_surface: this.dataset.contentSurface || '',
                    target_slug: this.dataset.targetSlug || '',
                    section_name: 'Related Tools and Guides'
                });
            });
        });

        (function observeAds() {
            var seenAds = [];
            function hasSeen(element) {
                return seenAds.indexOf(element) !== -1;
            }
            function markSeen(element) {
                var adNode = element ? element.querySelector('.adsbygoogle') : null;
                if (!element || hasSeen(element)) return;
                seenAds.push(element);
                trackContentEvent('content_ad_impression', {
                    ad_surface: element.dataset.adSurface || 'unknown',
                    ad_slot: adNode && adNode.dataset ? adNode.dataset.adSlot || '' : ''
                });
            }
            var adShells = document.querySelectorAll('[data-ad-surface]');
            if (!('IntersectionObserver' in window)) {
                adShells.forEach(markSeen);
                return;
            }
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        markSeen(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });
            adShells.forEach(function(shell) { observer.observe(shell); });
        })();
    </script>
    <script src="/portal/js/cross-promo.js" defer></script>
</body>
</html>
`;
}

function insertRootSitemap(rootSitemap, spec) {
  const entry = `  <url><loc>${pageUrl(spec)}</loc><lastmod>${spec.date}</lastmod><changefreq>${spec.changefreq}</changefreq><priority>${spec.priority}</priority></url>`;
  if (rootSitemap.includes(pageUrl(spec))) return rootSitemap;
  const anchor = rootSitemap.indexOf('  <!-- Additional deployed apps missing from sitemap');
  if (anchor !== -1) {
    return `${rootSitemap.slice(0, anchor)}${entry}\n${rootSitemap.slice(anchor)}`;
  }
  return rootSitemap.replace('</urlset>', `${entry}\n</urlset>`);
}

function insertBlogSitemap(blogSitemap, spec) {
  if (blogSitemap.includes(pageUrl(spec))) return blogSitemap;
  const entry = `  <url>
    <loc>${pageUrl(spec)}</loc>
    <lastmod>${spec.date}</lastmod>
    <changefreq>${spec.changefreq}</changefreq>
    <priority>${spec.priority}</priority>
  </url>`;
  return blogSitemap.replace('</urlset>', `${entry}\n</urlset>`);
}

function updateEnglishBlogIndex(indexHtml, spec) {
  if (spec.lang !== 'en') return indexHtml;
  if (indexHtml.includes(`['${spec.slug}.html'`)) return indexHtml;

  const entry = `            ['${escapeJsSingle(spec.slug)}.html','${escapeJsSingle(spec.category)}','${escapeJsSingle(spec.tag)}','${escapeJsSingle(spec.tagColor)}','${escapeJsSingle(spec.h1)}','${escapeJsSingle(spec.description)}','${escapeJsSingle(spec.readTime)}'],`;
  const marker = `            // === ${spec.category.toUpperCase()}`;
  let next = indexHtml;
  const markerIndex = next.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find English blog index insertion marker for category: ${spec.category}`);
  }
  const lineEnd = next.indexOf('\n', markerIndex);
  next = `${next.slice(0, lineEnd + 1)}${entry}\n${next.slice(lineEnd + 1)}`;

  const countPattern = new RegExp(`(\\{id:'${spec.category}'[^\\n]*c:)(\\d+)(\\})`);
  if (!countPattern.test(next)) {
    throw new Error(`Could not find English blog category count for: ${spec.category}`);
  }
  next = next.replace(countPattern, (_match, prefix, count, suffix) => `${prefix}${Number(count) + 1}${suffix}`);
  return next;
}

function planChanges(spec) {
  const articlePath = path.join(PORTAL_ROOT, 'blog', spec.lang, `${spec.slug}.html`);
  const rootSitemapPath = path.join(PORTAL_ROOT, 'sitemap.xml');
  const blogSitemapPath = path.join(PORTAL_ROOT, 'blog', 'sitemap.xml');
  const enIndexPath = path.join(PORTAL_ROOT, 'blog', 'en', 'index.html');

  if (!articlePath.startsWith(PORTAL_ROOT)) {
    throw new Error('Article path escaped portal root.');
  }
  if (fs.existsSync(articlePath)) {
    throw new Error(`Article already exists: ${path.relative(ROOT, articlePath)}`);
  }

  const changes = [
    {
      path: articlePath,
      type: 'create',
      before: '',
      after: renderArticle(spec),
    },
  ];

  const rootSitemap = fs.readFileSync(rootSitemapPath, 'utf8');
  changes.push({
    path: rootSitemapPath,
    type: 'update',
    before: rootSitemap,
    after: insertRootSitemap(rootSitemap, spec),
  });

  const blogSitemap = fs.readFileSync(blogSitemapPath, 'utf8');
  changes.push({
    path: blogSitemapPath,
    type: 'update',
    before: blogSitemap,
    after: insertBlogSitemap(blogSitemap, spec),
  });

  if (spec.lang === 'en') {
    const enIndex = fs.readFileSync(enIndexPath, 'utf8');
    changes.push({
      path: enIndexPath,
      type: 'update',
      before: enIndex,
      after: updateEnglishBlogIndex(enIndex, spec),
    });
  }

  return changes.filter((change) => change.before !== change.after);
}

function summarize(changes, spec) {
  console.log(`Article: ${pageUrl(spec)}`);
  console.log(`Mode: ${changes.mode}`);
  for (const change of changes.items) {
    const rel = path.relative(ROOT, change.path).replace(/\\/g, '/');
    const size = Buffer.byteLength(change.after, 'utf8');
    console.log(`  ${change.type.padEnd(6)} ${rel} (${size} bytes)`);
  }
}

function writeChanges(changes) {
  for (const change of changes) {
    fs.mkdirSync(path.dirname(change.path), { recursive: true });
    fs.writeFileSync(change.path, change.after);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.printSample) {
    console.log(JSON.stringify(sampleSpec(), null, 2));
    return;
  }

  if (!args.spec) {
    printHelp();
    throw new Error('Missing --spec');
  }

  const spec = validateSpec(loadSpec(args.spec));
  const planned = planChanges(spec);
  const shouldWrite = args.write;
  const result = { mode: shouldWrite ? 'write' : 'dry-run', items: planned };
  summarize(result, spec);

  if (!shouldWrite) {
    console.log('\nDry run only. Re-run with --write to create/update files.');
    return;
  }

  writeChanges(planned);
  console.log('\nWrote files. Recommended checks:');
  console.log('  git -C projects/portal diff --check');
  console.log('  node scripts/portal-hub-locale-audit.js');
  console.log("  & 'C:/Program Files/Git/bin/bash.exe' scripts/quality-gate.sh projects/portal");
}

try {
  main();
} catch (error) {
  console.error(`create-blog-article: ${error.message}`);
  process.exit(1);
}
