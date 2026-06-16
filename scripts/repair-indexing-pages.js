#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORTAL = path.join(ROOT, 'projects', 'portal');
const TODAY = '2026-06-16';

function write(file, content) {
  fs.writeFileSync(file, `${content.trim()}\n`, 'utf8');
}

function escapeJson(value) {
  return JSON.stringify(value);
}

function renderArticle(page) {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    image: page.image,
    datePublished: page.datePublished,
    dateModified: TODAY,
    inLanguage: page.lang,
    author: { '@type': 'Organization', name: 'DopaBrain', url: 'https://dopabrain.com/' },
    publisher: {
      '@type': 'Organization',
      name: 'DopaBrain',
      url: 'https://dopabrain.com/',
      logo: { '@type': 'ImageObject', url: 'https://dopabrain.com/portal/icon-512.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': page.url },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'DopaBrain', item: 'https://dopabrain.com/' },
      { '@type': 'ListItem', position: 2, name: page.blogName, item: `https://dopabrain.com/portal/blog/${page.lang}/` },
      { '@type': 'ListItem', position: 3, name: page.title },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return `<!DOCTYPE html>
<html lang="${page.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="description" content="${page.description}">
  <meta name="author" content="DopaBrain">
  <meta name="theme-color" content="${page.color}">
  <title>${page.title} | DopaBrain</title>
  <meta property="og:type" content="article">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:image" content="${page.image}">
  <meta property="og:url" content="${page.url}">
  <meta property="og:site_name" content="DopaBrain">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  <meta name="twitter:image" content="${page.image}">
  <link rel="canonical" href="${page.url}">
  <link rel="alternate" hreflang="${page.lang}" href="${page.url}">
  <link rel="alternate" hreflang="x-default" href="${page.xDefault}">
  <script type="application/ld+json">${JSON.stringify(articleLd)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-J8GSWM40TV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-J8GSWM40TV');
  </script>
  <script src="/portal/js/ad-loader.js"></script>
  <style>
    :root { --primary:${page.color}; --accent:${page.accent}; --bg:#0b1020; --panel:#111827; --text:#f8fafc; --muted:#cbd5e1; --line:rgba(255,255,255,.14); }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.75; }
    a { color:#bfdbfe; text-decoration:none; }
    a:hover { text-decoration:underline; }
    .nav { display:flex; justify-content:space-between; gap:16px; padding:16px clamp(16px,4vw,48px); border-bottom:1px solid var(--line); background:rgba(11,16,32,.92); position:sticky; top:0; z-index:10; }
    .hero { padding:48px clamp(16px,5vw,72px) 36px; border-bottom:1px solid var(--line); background:linear-gradient(135deg, rgba(37,99,235,.18), rgba(20,184,166,.12)); }
    .hero-inner, main { max-width:980px; margin:0 auto; }
    .eyebrow { color:#93c5fd; font-weight:700; text-transform:uppercase; font-size:.78rem; letter-spacing:.08em; }
    h1 { font-size:clamp(2rem,5vw,3.35rem); line-height:1.12; margin:12px 0 16px; letter-spacing:0; }
    .summary { max-width:760px; color:var(--muted); font-size:1.08rem; }
    .meta { color:#94a3b8; font-size:.94rem; margin-top:18px; }
    main { padding:34px clamp(16px,5vw,72px) 56px; }
    .toc, .callout, .quick-card, .related-card, .faq-item { border:1px solid var(--line); background:rgba(17,24,39,.82); border-radius:8px; }
    .toc { padding:18px 20px; margin-bottom:28px; }
    .toc ol { margin:8px 0 0 20px; padding:0; }
    .toc li { margin:6px 0; }
    section { margin:38px 0; }
    h2 { font-size:1.55rem; margin:0 0 14px; }
    h3 { font-size:1.12rem; margin:22px 0 8px; }
    p { margin:0 0 16px; color:#dbeafe; }
    ul { color:#dbeafe; }
    .callout { padding:18px 20px; border-left:4px solid var(--accent); }
    .quick-grid, .related-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin:16px 0; }
    .quick-card, .related-card { display:block; padding:16px; min-width:0; }
    .quick-card strong, .related-card strong { display:block; color:#fff; margin-bottom:4px; }
    .quick-card span, .related-card span { color:#cbd5e1; font-size:.92rem; }
    .cta-button { display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:10px 16px; background:var(--primary); color:white; border-radius:8px; font-weight:800; }
    .ad-container { min-height:120px; display:flex; align-items:center; justify-content:center; margin:28px 0; border:1px dashed rgba(255,255,255,.22); border-radius:8px; color:#94a3b8; }
    .faq-item { padding:16px 18px; margin:12px 0; }
    footer { border-top:1px solid var(--line); padding:28px clamp(16px,5vw,72px); color:#94a3b8; text-align:center; }
    @media (max-width:760px) { .quick-grid, .related-grid { grid-template-columns:1fr; } .nav { align-items:flex-start; flex-direction:column; } }
  </style>
</head>
<body>
  <nav class="nav">
    <a href="/portal/">DopaBrain</a>
    <a href="/portal/blog/${page.lang}/">${page.blogName}</a>
  </nav>
  <header class="hero">
    <div class="hero-inner">
      <div class="eyebrow">${page.eyebrow}</div>
      <h1>${page.title}</h1>
      <p class="summary">${page.summary}</p>
      <div class="meta">${page.updatedLabel}: ${TODAY}</div>
    </div>
  </header>
  <main>
    <nav class="toc" aria-label="Table of contents">
      <strong>${page.tocTitle}</strong>
      <ol>${page.sections.map((section) => `<li><a href="#${section.id}">${section.title}</a></li>`).join('')}</ol>
    </nav>
    <section class="callout">
      <p>${page.callout}</p>
    </section>
    <section>
      <h2>${page.quickTitle}</h2>
      <div class="quick-grid">
        ${page.quickCards.map((card) => `<a class="quick-card" href="${card.href}" data-content-surface="quick"><strong>${card.title}</strong><span>${card.text}</span></a>`).join('')}
      </div>
    </section>
    ${page.sections.map((section) => `<section id="${section.id}"><h2>${section.title}</h2>${section.body.map((part) => `<p>${part}</p>`).join('')}</section>`).join('')}
    <div class="ad-container" data-ad-slot="auto" data-ad-surface="mid_article_ad">Advertisement</div>
    <section>
      <h2>${page.ctaTitle}</h2>
      <p>${page.ctaText}</p>
      <a class="cta-button" href="${page.ctaHref}" data-content-surface="cta">${page.ctaLabel}</a>
    </section>
    <section>
      <h2>${page.faqTitle}</h2>
      ${page.faq.map((item) => `<div class="faq-item"><h3>${item.q}</h3><p>${item.a}</p></div>`).join('')}
    </section>
    <section>
      <h2>${page.relatedTitle}</h2>
      <div class="related-grid">
        ${page.related.map((card) => `<a class="related-card" href="${card.href}"><strong>${card.title}</strong><span>${card.text}</span></a>`).join('')}
      </div>
    </section>
  </main>
  <footer>DopaBrain &copy; 2026</footer>
  <script>
    (function() {
      function track(name, params) {
        if (typeof gtag !== 'function') return;
        gtag('event', name, Object.assign({
          event_category: 'content',
          page_path: location.pathname,
          content_locale: ${escapeJson(page.lang)},
          content_id: ${escapeJson(path.basename(page.file))}
        }, params || {}));
      }
      track('content_view');
      document.querySelectorAll('[data-ad-surface]').forEach(function(node) {
        track('content_ad_impression', { ad_surface: node.getAttribute('data-ad-surface') || 'article' });
      });
      document.querySelectorAll('.quick-card').forEach(function(node) {
        node.addEventListener('click', function() { track('content_test_click', { link_url: node.href }); });
      });
      document.querySelectorAll('.cta-button').forEach(function(node) {
        node.addEventListener('click', function() { track('content_cta_click', { link_url: node.href }); });
      });
      document.querySelectorAll('.related-card').forEach(function(node) {
        node.addEventListener('click', function() { track('content_related_click', { link_url: node.href }); });
      });
      document.querySelectorAll('.toc a').forEach(function(node) {
        node.addEventListener('click', function() { track('content_toc_click', { target: node.getAttribute('href') || '' }); });
      });
    })();
  </script>
  <script src="/portal/js/cross-promo.js" defer></script>
</body>
</html>`;
}

function updateSitemapLastmod(file, urls) {
  let text = fs.readFileSync(file, 'utf8');
  for (const url of urls) {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    text = text.replace(
      new RegExp(`(<url>\\s*<loc>${escaped}<\\/loc>\\s*<lastmod>)[^<]+(<\\/lastmod>)`, 'g'),
      `$1${TODAY}$2`
    );
    text = text.replace(
      new RegExp(`(<url><loc>${escaped}<\\/loc><lastmod>)[^<]+(<\\/lastmod>)`, 'g'),
      `$1${TODAY}$2`
    );
  }
  fs.writeFileSync(file, text, 'utf8');
}

const frColor = {
  file: path.join(PORTAL, 'blog', 'fr', 'color-palette-generator-guide.html'),
  lang: 'fr',
  blogName: 'Blog FR',
  title: 'Generateur de palette de couleurs gratuit : guide simple pour creer une palette lisible',
  description: 'Guide pratique pour creer une palette de couleurs harmonieuse avec le generateur DopaBrain : contraste, regle 60-30-10, accessibilite et choix rapides.',
  summary: 'Une bonne palette n est pas seulement jolie : elle rend une interface plus lisible, plus coherente et plus facile a retenir. Voici une methode courte pour choisir vos couleurs sans deviner.',
  callout: 'Utilisez ce guide comme une checklist : une couleur principale, une couleur secondaire, une couleur d accent et des neutres lisibles suffisent pour la plupart des projets web.',
  color: '#2563eb',
  accent: '#14b8a6',
  image: 'https://dopabrain.com/portal/img/og/color-palette.png',
  url: 'https://dopabrain.com/portal/blog/fr/color-palette-generator-guide.html',
  xDefault: 'https://dopabrain.com/portal/blog/en/color-palette-generator-guide.html',
  datePublished: '2026-02-10',
  eyebrow: 'Design et couleurs',
  updatedLabel: 'Mis a jour',
  tocTitle: 'Sommaire',
  quickTitle: 'Outils rapides',
  ctaTitle: 'Creer une palette maintenant',
  ctaText: 'Ouvrez le generateur, choisissez une couleur de depart, puis comparez les variations avec vos textes et boutons principaux.',
  ctaHref: '/color-palette/?lang=fr',
  ctaLabel: 'Ouvrir le generateur de palette',
  faqTitle: 'Questions frequentes',
  relatedTitle: 'A lire ensuite',
  quickCards: [
    { href: '/color-palette/?lang=fr', title: 'Palette', text: 'Generer des couleurs' },
    { href: '/color-personality/?lang=fr', title: 'Couleur et personnalite', text: 'Relier couleurs et style' },
    { href: '/color-memory/?lang=fr', title: 'Memoire couleur', text: 'Entrainer la perception' },
    { href: '/brain-type/?lang=fr', title: 'Type de cerveau', text: 'Comprendre votre style cognitif' },
  ],
  sections: [
    {
      id: 'method',
      title: 'La methode 60-30-10',
      body: [
        'Commencez par une couleur principale qui porte l identite du projet. Elle apparait dans les titres, les boutons importants et quelques surfaces de marque.',
        'Ajoutez une couleur secondaire plus calme pour les fonds, les encadres ou les elements de navigation. La couleur d accent doit rester rare : elle attire l oeil vers l action a faire.',
      ],
    },
    {
      id: 'contrast',
      title: 'Verifier le contraste avant le style',
      body: [
        'Une palette peut etre harmonieuse et pourtant difficile a lire. Testez toujours le texte clair sur fond sombre, le texte sombre sur fond clair et les etats hover/focus.',
        'Si deux couleurs se ressemblent trop en luminosite, utilisez l une pour le fond et l autre seulement comme bordure ou illustration. Pour les boutons, privilegiez le contraste net.',
      ],
    },
    {
      id: 'workflow',
      title: 'Workflow rapide avec DopaBrain',
      body: [
        'Choisissez une couleur de depart dans le generateur, exportez trois variations, puis appliquez-les a un titre, un paragraphe, un bouton et une carte. Cette petite simulation evite les palettes jolies mais inutilisables.',
        'Gardez une note avec le role de chaque couleur : primaire, secondaire, accent, texte, bordure et fond. Une palette devient beaucoup plus facile a maintenir quand chaque couleur a une mission.',
      ],
    },
  ],
  faq: [
    { q: 'Combien de couleurs faut-il dans une palette ?', a: 'Trois a cinq couleurs suffisent pour la plupart des sites : une principale, une secondaire, une couleur d accent et deux neutres pour le texte et les fonds.' },
    { q: 'Une palette doit-elle suivre les tendances ?', a: 'Les tendances peuvent inspirer, mais la lisibilite et la coherence de marque passent avant. Une palette simple et stable dure souvent plus longtemps.' },
    { q: 'Comment eviter une palette trop chargee ?', a: 'Limitez les couleurs tres saturees aux actions importantes et utilisez des tons neutres pour les grandes surfaces. Le regard doit savoir ou aller.' },
  ],
  related: [
    { href: '/portal/blog/fr/personality-tests.html', title: 'Tests de personnalite', text: 'Explorer les tests populaires' },
    { href: '/portal/blog/fr/numerologie-nombre-vie.html', title: 'Numerologie', text: 'Un autre outil de decouverte' },
    { href: '/portal/blog/fr/zodiac-compatibility.html', title: 'Compatibilite zodiacale', text: 'Lire les profils relationnels' },
  ],
};

const hiLove = {
  file: path.join(PORTAL, 'blog', 'hi', 'love-compatibility.html'),
  lang: 'hi',
  blogName: 'Hindi Blog',
  title: 'लव कम्पैटिबिलिटी टेस्ट गाइड: आपका रिश्ता कितना मैच करता है?',
  description: 'लव कम्पैटिबिलिटी टेस्ट से रिश्ते की बातचीत, भावनात्मक जरूरत, संघर्ष शैली और लंबे समय की अनुकूलता समझने के लिए सरल हिंदी गाइड।',
  summary: 'रिश्ते की compatibility सिर्फ zodiac या MBTI का नंबर नहीं है। असली संकेत यह है कि दो लोग जरूरत, सीमा, संवाद और conflict repair को कैसे संभालते हैं।',
  callout: 'यह गाइड diagnosis नहीं है। इसे बातचीत शुरू करने, red flags पहचानने और रिश्ते में बेहतर सवाल पूछने के लिए इस्तेमाल करें।',
  color: '#db2777',
  accent: '#f97316',
  image: 'https://dopabrain.com/portal/img/og/mbti-love.png',
  url: 'https://dopabrain.com/portal/blog/hi/love-compatibility.html',
  xDefault: 'https://dopabrain.com/mbti-love/',
  datePublished: '2026-02-08',
  eyebrow: 'Relationship guide',
  updatedLabel: 'अपडेट',
  tocTitle: 'इस गाइड में',
  quickTitle: 'रिश्ते से जुड़े तेज टेस्ट',
  ctaTitle: 'अपनी compatibility अभी देखें',
  ctaText: 'अगर आप किसी रिश्ते, crush या partner के बारे में सोच रहे हैं, तो पहले communication और emotional needs पर आधारित test लें।',
  ctaHref: '/mbti-love/?lang=hi',
  ctaLabel: 'MBTI Love Test खोलें',
  faqTitle: 'अक्सर पूछे जाने वाले सवाल',
  relatedTitle: 'आगे पढ़ें',
  quickCards: [
    { href: '/mbti-love/?lang=hi', title: 'MBTI Love', text: 'Personality match देखें' },
    { href: '/zodiac-match/?lang=hi', title: 'Zodiac Match', text: 'राशि compatibility' },
    { href: '/red-green-flag/?lang=hi', title: 'Red/Green Flags', text: 'रिश्ते के संकेत' },
    { href: '/love-frequency/?lang=hi', title: 'Love Frequency', text: 'भावनात्मक तालमेल' },
  ],
  sections: [
    {
      id: 'signals',
      title: 'Compatibility के चार मुख्य संकेत',
      body: [
        'पहला संकेत communication है: क्या दोनों लोग अपनी बात साफ कह पाते हैं और सुनते भी हैं? दूसरा संकेत emotional pace है: एक व्यक्ति जल्दी closeness चाहता है और दूसरा space, तो tension बन सकती है.',
        'तीसरा संकेत conflict repair है. हर रिश्ता कभी न कभी उलझता है, लेकिन healthy match में दोनों लोग blame के बजाय repair की कोशिश करते हैं. चौथा संकेत values है: समय, पैसे, परिवार और future को लेकर सोच बहुत अलग हो तो बात पहले करनी चाहिए.',
      ],
    },
    {
      id: 'questions',
      title: 'Test के बाद पूछने लायक सवाल',
      body: [
        'Result को final label न मानें. अपने partner या crush से पूछें: तुम्हें प्यार महसूस कब होता है? stress में तुम्हें support चाहिए या space? disagreement के बाद तुम्हें repair कैसे पसंद है?',
        'इन जवाबों से compatibility score से ज्यादा useful insight मिलता है. अगर जवाबों में सम्मान, curiosity और consistency दिखती है, तो रिश्ता बेहतर दिशा में जा सकता है.',
      ],
    },
    {
      id: 'red-flags',
      title: 'जब score अच्छा हो लेकिन feeling ठीक न लगे',
      body: [
        'कभी-कभी quiz result अच्छा लगता है, पर व्यवहार में असुरक्षा रहती है. ऐसे में love bombing, guilt pressure, silent treatment, jealousy control और boundaries ignore करने जैसे संकेतों को गंभीरता से देखें.',
        'Healthy compatibility में excitement के साथ safety भी होती है. अगर आपको बार-बार खुद को छोटा करना पड़ता है, तो score चाहे जो कहे, रिश्ता फिर से सोचने लायक है.',
      ],
    },
  ],
  faq: [
    { q: 'क्या love compatibility test सच में future बता सकता है?', a: 'नहीं. Test future की guarantee नहीं देता. यह communication, values और emotional needs पर बातचीत शुरू करने का आसान तरीका है.' },
    { q: 'अगर हमारा score कम आए तो क्या रिश्ता खराब है?', a: 'जरूरी नहीं. कम score उन areas को दिखा सकता है जहां बातचीत और समझ की जरूरत है. Respect और repair मौजूद हो तो रिश्ता बेहतर हो सकता है.' },
    { q: 'कौन सा factor सबसे important है?', a: 'Long-term compatibility में trust, consistent behavior, boundaries और conflict repair अक्सर surface-level attraction से ज्यादा महत्वपूर्ण होते हैं.' },
  ],
  related: [
    { href: '/portal/blog/hi/personality-tests.html', title: 'Personality tests', text: 'अपने pattern समझें' },
    { href: '/portal/blog/hi/zodiac-compatibility.html', title: 'Zodiac compatibility', text: 'राशि match पढ़ें' },
    { href: '/portal/blog/hi/blood-type-personality.html', title: 'Blood type personality', text: 'एक और fun framework' },
  ],
};

function renderPrivacy() {
  const url = 'https://dopabrain.com/portal/privacy-policy.html';
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    url,
    dateModified: TODAY,
    publisher: { '@type': 'Organization', name: 'DopaBrain', url: 'https://dopabrain.com/' },
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="description" content="DopaBrain privacy policy: learn what data is stored locally, how analytics and advertising work, and how to contact us about privacy.">
  <meta name="author" content="DopaBrain">
  <meta name="theme-color" content="#667eea">
  <link rel="canonical" href="${url}">
  <title>Privacy Policy | DopaBrain</title>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <style>
    * { box-sizing:border-box; }
    body { margin:0; background:#07071a; color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.8; }
    main { max-width:760px; margin:0 auto; padding:32px 18px 56px; }
    a { color:#93c5fd; }
    h1 { font-size:2rem; line-height:1.15; margin:24px 0 8px; }
    h2 { font-size:1.2rem; margin:28px 0 8px; color:#a5b4fc; }
    p, li { color:#d1d5db; }
    .back-link { display:inline-block; margin-bottom:12px; text-decoration:none; font-weight:700; }
    .updated { color:#9ca3af; }
  </style>
</head>
<body>
  <main>
    <a href="/portal/" class="back-link">Back to DopaBrain</a>
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: ${TODAY}</p>
    <h2>1. Information We Collect</h2>
    <p>DopaBrain is designed to collect the minimum information needed to operate and improve the service. Quiz answers, preferences, and recent usage history may be stored in your browser through LocalStorage when a feature needs it.</p>
    <h2>2. Analytics</h2>
    <p>We use Google Analytics to understand aggregated usage patterns such as page views, device type, language, and feature interactions. Analytics data is used to improve performance, accessibility, and content quality.</p>
    <h2>3. Advertising</h2>
    <p>DopaBrain may display ads through Google AdSense. Advertising partners may use cookies or similar technologies to provide, measure, and improve ads according to their own policies.</p>
    <h2>4. Local Storage</h2>
    <p>Some tools save settings or results on your device only. You can remove this data by clearing your browser site data for dopabrain.com.</p>
    <h2>5. Third-Party Services</h2>
    <ul>
      <li>Google Analytics for aggregated usage analytics.</li>
      <li>Google AdSense for advertising.</li>
      <li>GitHub Pages and Cloudflare for hosting and delivery.</li>
    </ul>
    <h2>6. Your Choices</h2>
    <p>You can block cookies, use browser privacy controls, clear LocalStorage, or use analytics blocking tools. Some features may work differently if storage or scripts are disabled.</p>
    <h2>7. Contact</h2>
    <p>For privacy questions, contact us at <a href="mailto:woodori1234@gmail.com">woodori1234@gmail.com</a>.</p>
  </main>
</body>
</html>`;
}

write(frColor.file, renderArticle(frColor));
write(hiLove.file, renderArticle(hiLove));
write(path.join(PORTAL, 'privacy-policy.html'), renderPrivacy());

updateSitemapLastmod(path.join(PORTAL, 'sitemap.xml'), [frColor.url, hiLove.url, 'https://dopabrain.com/portal/privacy-policy.html']);
updateSitemapLastmod(path.join(PORTAL, 'blog', 'sitemap.xml'), [frColor.url, hiLove.url]);

console.log('Repaired indexing pages:');
console.log(`- ${path.relative(ROOT, frColor.file)}`);
console.log(`- ${path.relative(ROOT, hiLove.file)}`);
console.log('- projects/portal/privacy-policy.html');
