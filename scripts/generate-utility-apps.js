const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TODAY = '2026-06-23';
const LANGS = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Seoul',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney'
];

const TOOLS = [
  {
    slug: 'file-extension-converter',
    title: 'File Extension Converter',
    shortTitle: 'Extension Converter',
    description: 'Rename file extensions, inspect MIME types, and download a renamed copy safely in your browser.',
    keywords: 'file extension converter,change file extension,rename file extension,mime type checker',
    category: 'File',
    filter: 'converter',
    color: '#14b8a6',
    accent: '#f97316',
    type: 'extension',
    popularity: 24,
    titleSuffix: 'File Renamer'
  },
  {
    slug: 'file-size-converter',
    title: 'File Size Converter',
    shortTitle: 'File Size',
    description: 'Convert bytes, KB, MB, GB, TB, and binary KiB/MiB/GiB units instantly with copyable results.',
    keywords: 'file size converter,mb to gb,kb to mb,bytes converter,kib mib gib',
    category: 'Converter',
    filter: 'converter',
    color: '#2563eb',
    accent: '#22c55e',
    type: 'fileSize',
    popularity: 23,
    titleSuffix: 'MB GB Bytes'
  },
  {
    slug: 'image-format-converter',
    title: 'Image Format Converter',
    shortTitle: 'Image Converter',
    description: 'Convert images locally to PNG, JPEG, or WebP with quality control and no upload required.',
    keywords: 'image format converter,png to jpg,jpg to webp,webp converter,local image converter',
    category: 'Image',
    filter: 'converter',
    color: '#7c3aed',
    accent: '#06b6d4',
    type: 'imageFormat',
    popularity: 22,
    titleSuffix: 'PNG JPG WebP'
  },
  {
    slug: 'image-size-converter',
    title: 'Image Size Converter',
    shortTitle: 'Image Size',
    description: 'Resize image dimensions, keep aspect ratio, estimate print size, and export a resized copy.',
    keywords: 'image size converter,image resize calculator,pixel size converter,dpi calculator',
    category: 'Image',
    filter: 'converter',
    color: '#db2777',
    accent: '#facc15',
    type: 'imageSize',
    popularity: 21,
    titleSuffix: 'Resize Pixels'
  },
  {
    slug: 'aspect-ratio-calculator',
    title: 'Aspect Ratio Calculator',
    shortTitle: 'Aspect Ratio',
    description: 'Calculate aspect ratios, missing dimensions, and common video or social media sizes instantly.',
    keywords: 'aspect ratio calculator,16 9 calculator,image ratio calculator,video size calculator',
    category: 'Calculator',
    filter: 'calculator',
    color: '#0f766e',
    accent: '#38bdf8',
    type: 'aspectRatio',
    popularity: 20,
    titleSuffix: '16:9 4:3'
  },
  {
    slug: 'data-transfer-calculator',
    title: 'Data Transfer Calculator',
    shortTitle: 'Transfer Time',
    description: 'Estimate download and upload time from file size and internet speed in seconds or hours.',
    keywords: 'download time calculator,data transfer calculator,upload time calculator,mbps to mb',
    category: 'Calculator',
    filter: 'calculator',
    color: '#0891b2',
    accent: '#a3e635',
    type: 'transfer',
    popularity: 19,
    titleSuffix: 'Download Time'
  },
  {
    slug: 'unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    shortTitle: 'Unix Time',
    description: 'Convert Unix timestamps to readable dates and turn local dates back into seconds or milliseconds.',
    keywords: 'unix timestamp converter,epoch time converter,timestamp to date,date to timestamp',
    category: 'Developer',
    filter: 'converter',
    color: '#475569',
    accent: '#f59e0b',
    type: 'timestamp',
    popularity: 18,
    titleSuffix: 'Epoch Time'
  },
  {
    slug: 'timezone-converter',
    title: 'Time Zone Converter',
    shortTitle: 'Time Zone',
    description: 'Convert a meeting time across UTC, US, Europe, and Asia time zones without an external API.',
    keywords: 'time zone converter,timezone calculator,meeting time converter,utc to local time',
    category: 'Time',
    filter: 'converter',
    color: '#4338ca',
    accent: '#2dd4bf',
    type: 'timezone',
    popularity: 17,
    titleSuffix: 'Meeting Time'
  },
  {
    slug: 'text-case-converter',
    title: 'Text Case Converter',
    shortTitle: 'Case Converter',
    description: 'Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and kebab-case.',
    keywords: 'text case converter,uppercase lowercase,title case converter,camel case,snake case',
    category: 'Text',
    filter: 'converter',
    color: '#ea580c',
    accent: '#10b981',
    type: 'textCase',
    popularity: 16,
    titleSuffix: 'Upper Lower'
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    shortTitle: 'JSON Formatter',
    description: 'Validate, format, and minify JSON locally in your browser with clear error messages.',
    keywords: 'json formatter,json validator,json beautifier,json minifier,format json online',
    category: 'Developer',
    filter: 'developer',
    color: '#16a34a',
    accent: '#60a5fa',
    type: 'json',
    popularity: 15,
    titleSuffix: 'Validate JSON'
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function toId(slug) {
  return slug.replace(/-/g, '_');
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function appIndex(tool) {
  const faq = [
    {
      q: 'Does this tool upload my files or text?',
      a: 'No. The tool runs in your browser. Files and text stay on your device unless you choose to download an output.'
    },
    {
      q: 'Is the result free to use?',
      a: 'Yes. This DopaBrain utility is free, requires no sign in, and works on desktop or mobile browsers.'
    },
    {
      q: 'Can I use it on a phone?',
      a: 'Yes. The interface is responsive and uses touch-friendly controls for small screens.'
    }
  ];
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    url: `https://dopabrain.com/${tool.slug}/`,
    image: `https://dopabrain.com/${tool.slug}/icon-512.svg`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript in a modern browser.',
    inLanguage: LANGS,
    dateModified: TODAY,
    author: { '@type': 'Organization', name: 'DopaBrain', url: 'https://dopabrain.com/' },
    publisher: { '@type': 'Organization', name: 'DopaBrain', url: 'https://dopabrain.com/' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    featureList: ['Browser-only processing', 'Copyable results', 'Mobile responsive interface', 'No account required']
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dopabrain.com/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://dopabrain.com/portal/tools/' },
      { '@type': 'ListItem', position: 3, name: tool.title, item: `https://dopabrain.com/${tool.slug}/` }
    ]
  };
  const title = `${tool.shortTitle} | DopaBrain`;
  const langs = LANGS.map((lang) => `  <link rel="alternate" hreflang="${lang}" href="https://dopabrain.com/${tool.slug}/">`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3600813755953882" crossorigin="anonymous"></script>
  <meta name="robots" content="max-image-preview:large">
  <meta name="theme-color" content="${tool.color}">
  <meta name="description" content="${escapeAttr(tool.description)}">
  <meta name="keywords" content="${escapeAttr(tool.keywords)}">
  <meta name="dateModified" content="${TODAY}">
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="https://dopabrain.com/${tool.slug}/">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" href="icon-192.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="icon-192.svg">
  <link rel="stylesheet" href="css/style.css">
  <meta property="og:title" content="${escapeAttr(tool.title)} | DopaBrain">
  <meta property="og:description" content="${escapeAttr(tool.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://dopabrain.com/${tool.slug}/">
  <meta property="og:image" content="https://dopabrain.com/${tool.slug}/icon-512.svg">
  <meta property="og:site_name" content="DopaBrain">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttr(tool.title)}">
  <meta name="twitter:description" content="${escapeAttr(tool.description)}">
${langs}
  <link rel="alternate" hreflang="x-default" href="https://dopabrain.com/${tool.slug}/">
  <script type="application/ld+json">${JSON.stringify(appSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-J8GSWM40TV"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-J8GSWM40TV');</script>
</head>
<body>
  <a href="#main-content" class="skip-link" data-i18n="ui.skip">Skip to tool</a>
  <div class="app-loader" id="app-loader" role="status" aria-live="polite">
    <div class="loader-mark">${escapeHtml(tool.shortTitle.slice(0, 2).toUpperCase())}</div>
    <div class="loader-spinner"></div>
    <p data-i18n="ui.loading">Loading...</p>
  </div>

  <header class="topbar">
    <a class="brand" href="/portal/tools/" aria-label="DopaBrain tools">DopaBrain</a>
    <div class="top-actions">
      <select id="language-select" class="language-select" aria-label="Language">
${LANGS.map((lang) => `        <option value="${lang}">${lang.toUpperCase()}</option>`).join('\n')}
      </select>
      <button class="icon-btn" id="theme-toggle" type="button" aria-label="Toggle theme" title="Toggle theme">T</button>
    </div>
  </header>

  <main id="main-content" class="app-shell">
    <section class="hero-band">
      <div>
        <p class="eyebrow">${escapeHtml(tool.category)} Utility</p>
        <h1 data-i18n="app.title">${escapeHtml(tool.title)}</h1>
        <p class="subtitle" data-i18n="app.description">${escapeHtml(tool.description)}</p>
      </div>
      <div class="trust-strip" aria-label="Tool highlights">
        <span>Local</span>
        <span>No Login</span>
        <span>Mobile Ready</span>
      </div>
    </section>

    <section class="tool-layout" aria-label="${escapeAttr(tool.title)}">
      <div class="tool-panel" id="tool-panel" data-tool="${tool.type}"></div>
      <aside class="side-panel">
        <h2>Quick Notes</h2>
        <ul id="tool-notes"></ul>
      </aside>
    </section>

    <section class="result-panel" aria-live="polite">
      <div class="result-header">
        <h2>Result</h2>
        <button class="ghost-btn" id="copy-primary" type="button">Copy</button>
      </div>
      <div id="result-output" class="result-output"></div>
    </section>

    <div class="ad-container" aria-label="Sponsored">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-3600813755953882"
           data-ad-slot="auto"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>

    <section class="related-tools">
      <h2>More Utilities</h2>
      <div class="related-grid">
        <a href="/unit-converter/">Unit Converter</a>
        <a href="/password-generator/">Password Generator</a>
        <a href="/qr-generator/">QR Generator</a>
        <a href="/portal/tools/">All Tools</a>
      </div>
    </section>
  </main>

  <footer class="footer">
    <a href="/portal/">Home</a>
    <a href="/portal/tools/">Tools</a>
    <a href="/portal/privacy-policy.html">Privacy</a>
  </footer>

  <script src="/portal/js/cross-promo.js" defer></script>
  <script src="js/i18n.js"></script>
  <script src="js/app.js"></script>
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function(){});
    }
  </script>
</body>
</html>
`;
}

function appCss(tool) {
  return `:root {
  color-scheme: dark;
  --primary: ${tool.color};
  --accent: ${tool.accent};
  --bg: #0b1020;
  --surface: #111827;
  --surface-2: #172033;
  --text: #f8fafc;
  --muted: #a9b5c7;
  --border: rgba(148, 163, 184, 0.24);
  --shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

[data-theme="light"] {
  color-scheme: light;
  --bg: #f7fafc;
  --surface: #ffffff;
  --surface-2: #eef4f7;
  --text: #102033;
  --muted: #506176;
  --border: rgba(15, 23, 42, 0.15);
  --shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
}

* { box-sizing: border-box; }
html { min-width: 320px; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
}
button, input, select, textarea { font: inherit; }
button, a, input, select, textarea { -webkit-tap-highlight-color: transparent; }
a { color: inherit; }
.skip-link {
  position: absolute;
  left: 12px;
  top: -60px;
  z-index: 10001;
  padding: 10px 14px;
  background: var(--text);
  color: var(--bg);
  border-radius: 6px;
}
.skip-link:focus { top: 12px; }
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-items: center;
  gap: 14px;
  align-content: center;
  background: var(--bg);
  transition: opacity 0.24s ease, visibility 0.24s ease;
}
.app-loader.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
.loader-mark {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-weight: 800;
  letter-spacing: 0;
}
.loader-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid rgba(255,255,255,0.16);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px clamp(16px, 4vw, 32px);
  background: color-mix(in srgb, var(--bg) 90%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(14px);
}
.brand {
  text-decoration: none;
  font-weight: 800;
  color: var(--text);
}
.top-actions { display: flex; align-items: center; gap: 8px; }
.language-select, .icon-btn, .ghost-btn, .primary-btn {
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
}
.language-select { padding: 0 12px; }
.icon-btn {
  min-width: 44px;
  cursor: pointer;
  font-weight: 800;
}
.app-shell {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 22px clamp(14px, 4vw, 28px) 40px;
}
.hero-band {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: end;
  padding: 20px 0 22px;
  border-bottom: 1px solid var(--border);
}
.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}
h1 {
  margin: 0;
  max-width: 780px;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.05;
  letter-spacing: 0;
}
.subtitle {
  max-width: 760px;
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.6;
  font-size: 16px;
}
.trust-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}
.trust-strip span {
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}
.tool-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 16px;
  margin-top: 18px;
}
.tool-panel, .side-panel, .result-panel, .ad-container, .related-tools {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
}
.tool-panel, .side-panel, .result-panel, .related-tools { padding: 18px; }
.side-panel h2, .result-panel h2, .related-tools h2 {
  margin: 0 0 12px;
  font-size: 18px;
}
.side-panel ul {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.6;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.field { display: grid; gap: 6px; }
.field.full { grid-column: 1 / -1; }
label { color: var(--muted); font-size: 13px; font-weight: 700; }
input, select, textarea {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--surface-2);
  color: var(--text);
  outline: none;
}
textarea {
  min-height: 180px;
  resize: vertical;
  line-height: 1.5;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 24%, transparent);
}
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}
.primary-btn {
  padding: 0 16px;
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}
.ghost-btn {
  padding: 0 14px;
  cursor: pointer;
  color: var(--text);
}
.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.result-output {
  display: grid;
  gap: 10px;
  min-height: 72px;
  color: var(--muted);
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}
.metric {
  padding: 13px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.metric strong {
  display: block;
  color: var(--text);
  font-size: 18px;
  overflow-wrap: anywhere;
}
.metric span { display: block; margin-top: 4px; font-size: 13px; }
.table-wrap { overflow-x: auto; }
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}
th, td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  color: var(--muted);
}
th { color: var(--text); }
.status-ok { color: #34d399; }
.status-bad { color: #fb7185; }
.preview {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.ad-container {
  margin-top: 18px;
  min-height: 96px;
  display: grid;
  place-items: center;
  padding: 12px;
}
.related-tools { margin-top: 18px; }
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.related-grid a {
  display: grid;
  place-items: center;
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  text-decoration: none;
  color: var(--text);
  font-weight: 700;
  text-align: center;
}
.footer {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 22px;
  color: var(--muted);
}
.footer a { text-decoration: none; }
@media (max-width: 820px) {
  .hero-band, .tool-layout { grid-template-columns: 1fr; }
  .trust-strip { justify-content: flex-start; }
  .related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .form-grid { grid-template-columns: 1fr; }
  h1 { font-size: 30px; }
  .topbar { align-items: flex-start; gap: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;
}

function i18nJs() {
  return `(function() {
  'use strict';
  const supportedLanguages = ${JSON.stringify(LANGS)};
  const fallback = 'en';
  const state = { lang: fallback, translations: {} };

  function detectLanguage() {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved && supportedLanguages.includes(saved)) return saved;
      const browser = (navigator.language || fallback).split('-')[0];
      if (supportedLanguages.includes(browser)) return browser;
    } catch (error) {}
    return fallback;
  }

  function getValue(key) {
    const keys = key.split('.');
    let value = state.translations;
    for (let i = 0; i < keys.length; i += 1) {
      if (!value || typeof value !== 'object') return null;
      value = value[keys[i]];
    }
    return typeof value === 'string' ? value : null;
  }

  async function load(lang) {
    try {
      const response = await fetch('js/locales/' + lang + '.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Missing locale');
      state.translations = await response.json();
      state.lang = lang;
      document.documentElement.lang = lang;
      return true;
    } catch (error) {
      if (lang !== fallback) return load(fallback);
      return false;
    }
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const value = getValue(el.getAttribute('data-i18n'));
      if (value) el.textContent = value;
    });
    const title = getValue('app.title');
    if (title) document.title = title + ' | DopaBrain';
    const description = getValue('app.description');
    const meta = document.querySelector('meta[name="description"]');
    if (description && meta) meta.setAttribute('content', description);
    const selector = document.getElementById('language-select');
    if (selector) selector.value = state.lang;
  }

  async function setLanguage(lang) {
    if (!supportedLanguages.includes(lang)) return false;
    await load(lang);
    try { localStorage.setItem('app_language', state.lang); } catch (error) {}
    apply();
    return true;
  }

  window.i18n = { init: setLanguage, setLanguage: setLanguage, getLanguage: function(){ return state.lang; } };

  document.addEventListener('DOMContentLoaded', function() {
    try {
      setLanguage(detectLanguage()).catch(function(){});
    } catch (error) {}
  });
})();
`;
}

function appJs(tool) {
  return `const TOOL_CONFIG = ${JSON.stringify({
    slug: tool.slug,
    title: tool.title,
    shortTitle: tool.shortTitle,
    description: tool.description,
    type: tool.type,
    color: tool.color,
    accent: tool.accent,
    timezones: TIMEZONES
  }, null, 2)};

(function() {
  'use strict';

  let selectedFile = null;
  let selectedImage = null;
  let lastPrimaryText = '';

  const decimalUnits = {
    B: 1,
    KB: 1000,
    MB: 1000000,
    GB: 1000000000,
    TB: 1000000000000,
    PB: 1000000000000000
  };
  const binaryUnits = {
    KiB: 1024,
    MiB: 1048576,
    GiB: 1073741824,
    TiB: 1099511627776
  };
  const mimeTypes = {
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    zip: 'application/zip',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4'
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function formatNumber(value, digits) {
    if (!Number.isFinite(value)) return '-';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits == null ? 6 : digits }).format(value);
  }

  function bytesToHuman(bytes) {
    if (!Number.isFinite(bytes)) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let value = bytes;
    let index = 0;
    while (value >= 1000 && index < units.length - 1) {
      value /= 1000;
      index += 1;
    }
    return formatNumber(value, 2) + ' ' + units[index];
  }

  function setResult(html, primaryText) {
    const out = $('#result-output');
    if (out) out.innerHTML = html;
    lastPrimaryText = primaryText || out?.innerText || '';
  }

  function hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(function() {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 260);
    }
  }

  function field(label, html, full) {
    return '<div class="field' + (full ? ' full' : '') + '"><label>' + label + '</label>' + html + '</div>';
  }

  function render() {
    const panel = $('#tool-panel');
    const notes = $('#tool-notes');
    if (!panel || !notes) return;
    notes.innerHTML = getNotes().map(function(note) { return '<li>' + escapeHtml(note) + '</li>'; }).join('');
    panel.innerHTML = getForm();
    attachToolEvents();
    calculate();
  }

  function getNotes() {
    const notes = {
      extension: [
        'Renaming an extension does not convert file contents.',
        'Use the download button only when you understand the target format.',
        'MIME hints help you spot common extension mistakes.'
      ],
      fileSize: [
        'Decimal KB uses 1,000 bytes; binary KiB uses 1,024 bytes.',
        'Storage vendors usually show decimal units.',
        'Operating systems often show binary-style sizes.'
      ],
      imageFormat: [
        'Images are decoded and re-encoded locally with canvas.',
        'JPEG quality affects file size and visual detail.',
        'Animated GIF frames are not preserved by canvas export.'
      ],
      imageSize: [
        'Lock ratio to avoid stretching images.',
        'DPI changes print size math, not screen pixels.',
        'Export is local and uses the browser canvas.'
      ],
      aspectRatio: [
        'Ratios are simplified with the greatest common divisor.',
        'Use presets for video and social media layouts.',
        'Leave one dimension blank to calculate it from a ratio.'
      ],
      transfer: [
        'Internet speeds are usually bits per second.',
        'File sizes are usually bytes.',
        'Real transfer time can be slower because of overhead.'
      ],
      timestamp: [
        'Unix seconds are 10 digits; milliseconds are 13 digits.',
        'Local time depends on your browser time zone.',
        'UTC output is best for logs and APIs.'
      ],
      timezone: [
        'Time zone math uses your browser Intl engine.',
        'DST is handled by the selected IANA time zone.',
        'Use UTC when sharing logs or backend times.'
      ],
      textCase: [
        'Case conversion happens locally.',
        'camelCase removes punctuation and spaces.',
        'Review acronyms before publishing title case text.'
      ],
      json: [
        'Validation happens in the browser.',
        'Formatter preserves data but changes whitespace.',
        'JSON does not allow comments or trailing commas.'
      ]
    };
    return notes[TOOL_CONFIG.type] || [];
  }

  function getForm() {
    const type = TOOL_CONFIG.type;
    if (type === 'extension') {
      return '<div class="form-grid">' +
        field('File name', '<input id="filename" value="report.final.txt" autocomplete="off">') +
        field('Target extension', '<input id="target-ext" value="csv" autocomplete="off">') +
        field('Optional file', '<input id="file-input" type="file">', true) +
        '</div><div class="button-row"><button class="primary-btn" data-action="download-renamed" type="button">Download renamed copy</button></div>';
    }
    if (type === 'fileSize') {
      return '<div class="form-grid">' +
        field('Value', '<input id="size-value" type="number" min="0" step="any" value="25">') +
        field('Unit', '<select id="size-unit"><option>MB</option><option>KB</option><option>GB</option><option>B</option><option>TB</option><option>PB</option><option>KiB</option><option>MiB</option><option>GiB</option><option>TiB</option></select>') +
        '</div>';
    }
    if (type === 'imageFormat') {
      return '<div class="form-grid">' +
        field('Image file', '<input id="image-input" type="file" accept="image/*">', true) +
        field('Output format', '<select id="image-format"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select>') +
        field('Quality', '<input id="image-quality" type="range" min="0.1" max="1" step="0.05" value="0.9">') +
        '</div><div class="button-row"><button class="primary-btn" data-action="download-image" type="button">Download converted image</button></div>';
    }
    if (type === 'imageSize') {
      return '<div class="form-grid">' +
        field('Image file', '<input id="resize-input" type="file" accept="image/*">', true) +
        field('Width px', '<input id="resize-width" type="number" min="1" step="1" value="1920">') +
        field('Height px', '<input id="resize-height" type="number" min="1" step="1" value="1080">') +
        field('DPI', '<input id="resize-dpi" type="number" min="1" step="1" value="300">') +
        field('Lock ratio', '<select id="resize-lock"><option value="yes">Yes</option><option value="no">No</option></select>') +
        '</div><div class="button-row"><button class="primary-btn" data-action="download-resized" type="button">Download resized image</button><button class="ghost-btn" data-preset="1280x720" type="button">1280x720</button><button class="ghost-btn" data-preset="1080x1080" type="button">1080x1080</button></div>';
    }
    if (type === 'aspectRatio') {
      return '<div class="form-grid">' +
        field('Width', '<input id="ratio-width" type="number" min="0" step="1" value="1920">') +
        field('Height', '<input id="ratio-height" type="number" min="0" step="1" value="1080">') +
        field('Ratio width', '<input id="ratio-a" type="number" min="1" step="1" value="16">') +
        field('Ratio height', '<input id="ratio-b" type="number" min="1" step="1" value="9">') +
        '</div><div class="button-row"><button class="ghost-btn" data-ratio="16:9" type="button">16:9</button><button class="ghost-btn" data-ratio="4:3" type="button">4:3</button><button class="ghost-btn" data-ratio="1:1" type="button">1:1</button><button class="ghost-btn" data-ratio="9:16" type="button">9:16</button></div>';
    }
    if (type === 'transfer') {
      return '<div class="form-grid">' +
        field('File size', '<input id="transfer-size" type="number" min="0" step="any" value="4.7">') +
        field('Size unit', '<select id="transfer-size-unit"><option>GB</option><option>MB</option><option>KB</option><option>TB</option></select>') +
        field('Connection speed', '<input id="transfer-speed" type="number" min="0" step="any" value="100">') +
        field('Speed unit', '<select id="transfer-speed-unit"><option>Mbps</option><option>MB/s</option><option>Kbps</option><option>Gbps</option></select>') +
        '</div>';
    }
    if (type === 'timestamp') {
      return '<div class="form-grid">' +
        field('Unix timestamp', '<input id="timestamp-value" value="' + Math.floor(Date.now() / 1000) + '">') +
        field('Local date and time', '<input id="datetime-value" type="datetime-local">') +
        '</div><div class="button-row"><button class="ghost-btn" data-action="now" type="button">Use current time</button></div>';
    }
    if (type === 'timezone') {
      return '<div class="form-grid">' +
        field('Date and time', '<input id="tz-datetime" type="datetime-local">') +
        field('Source time zone', '<select id="tz-source">' + TOOL_CONFIG.timezones.map(function(tz) { return '<option value="' + tz + '">' + tz + '</option>'; }).join('') + '</select>') +
        '</div>';
    }
    if (type === 'textCase') {
      return '<div class="form-grid">' + field('Text', '<textarea id="text-input">launch faster with clean browser tools</textarea>', true) + '</div>';
    }
    if (type === 'json') {
      return '<div class="form-grid">' + field('JSON input', '<textarea id="json-input">{ "name": "DopaBrain", "tools": 25, "free": true }</textarea>', true) + '</div><div class="button-row"><button class="primary-btn" data-action="format-json" type="button">Format</button><button class="ghost-btn" data-action="minify-json" type="button">Minify</button><button class="ghost-btn" data-action="sample-json" type="button">Sample</button></div>';
    }
    return '';
  }

  function attachToolEvents() {
    document.querySelectorAll('#tool-panel input, #tool-panel select, #tool-panel textarea').forEach(function(el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', handleChange);
    });
    document.querySelectorAll('#tool-panel button').forEach(function(button) {
      button.addEventListener('click', handleButton);
    });
  }

  function handleChange(event) {
    if (event.target.id === 'file-input') selectedFile = event.target.files[0] || null;
    if (event.target.id === 'image-input') loadImageFile(event.target.files[0], false);
    if (event.target.id === 'resize-input') loadImageFile(event.target.files[0], true);
    calculate();
  }

  function handleButton(event) {
    const action = event.currentTarget.dataset.action;
    const preset = event.currentTarget.dataset.preset;
    const ratio = event.currentTarget.dataset.ratio;
    if (preset) {
      const parts = preset.split('x');
      $('#resize-width').value = parts[0];
      $('#resize-height').value = parts[1];
      calculate();
    }
    if (ratio) {
      const parts = ratio.split(':');
      $('#ratio-a').value = parts[0];
      $('#ratio-b').value = parts[1];
      calculate();
    }
    if (action === 'download-renamed') downloadRenamed();
    if (action === 'download-image') downloadCanvasImage('converted');
    if (action === 'download-resized') downloadResized();
    if (action === 'now') setTimestampNow();
    if (action === 'format-json' || action === 'minify-json') calculate(action);
    if (action === 'sample-json') {
      $('#json-input').value = '{ "name": "DopaBrain", "features": ["tools", "games", "tests"], "free": true }';
      calculate('format-json');
    }
  }

  function calculate(mode) {
    const type = TOOL_CONFIG.type;
    if (type === 'extension') return calcExtension();
    if (type === 'fileSize') return calcFileSize();
    if (type === 'imageFormat') return calcImageFormat();
    if (type === 'imageSize') return calcImageSize();
    if (type === 'aspectRatio') return calcAspectRatio();
    if (type === 'transfer') return calcTransfer();
    if (type === 'timestamp') return calcTimestamp();
    if (type === 'timezone') return calcTimezone();
    if (type === 'textCase') return calcTextCase();
    if (type === 'json') return calcJson(mode);
  }

  function cleanExt(value) {
    return String(value || '').trim().replace(/^\\.+/, '').toLowerCase();
  }

  function calcExtension() {
    const filename = $('#filename')?.value || 'file.txt';
    const target = cleanExt($('#target-ext')?.value || 'txt');
    const base = filename.replace(/\\.[^./\\\\]+$/, '');
    const current = (filename.match(/\\.([^./\\\\]+)$/) || [null, 'none'])[1].toLowerCase();
    const next = target ? base + '.' + target : base;
    const mime = mimeTypes[target] || 'unknown';
    const selected = selectedFile ? '<div class="metric"><strong>' + escapeHtml(selectedFile.name) + '</strong><span>Selected file, ' + bytesToHuman(selectedFile.size) + '</span></div>' : '';
    setResult('<div class="metric-grid">' +
      '<div class="metric"><strong>' + escapeHtml(current) + '</strong><span>Current extension</span></div>' +
      '<div class="metric"><strong>' + escapeHtml(next) + '</strong><span>New file name</span></div>' +
      '<div class="metric"><strong>' + escapeHtml(mime) + '</strong><span>Target MIME hint</span></div>' +
      selected +
      '</div>', next);
  }

  function downloadRenamed() {
    if (!selectedFile) {
      alert('Choose a file first.');
      return;
    }
    const filename = $('#filename')?.value || selectedFile.name;
    const target = cleanExt($('#target-ext')?.value || 'txt');
    const base = filename.replace(/\\.[^./\\\\]+$/, '');
    const next = target ? base + '.' + target : base;
    const blob = new Blob([selectedFile], { type: mimeTypes[target] || selectedFile.type || 'application/octet-stream' });
    downloadBlob(blob, next);
  }

  function calcFileSize() {
    const value = Number($('#size-value')?.value || 0);
    const unit = $('#size-unit')?.value || 'MB';
    const factor = decimalUnits[unit] || binaryUnits[unit] || 1;
    const bytes = value * factor;
    const rows = [
      ['Bytes', bytes],
      ['KB', bytes / decimalUnits.KB],
      ['MB', bytes / decimalUnits.MB],
      ['GB', bytes / decimalUnits.GB],
      ['TB', bytes / decimalUnits.TB],
      ['KiB', bytes / binaryUnits.KiB],
      ['MiB', bytes / binaryUnits.MiB],
      ['GiB', bytes / binaryUnits.GiB]
    ].map(function(row) {
      return '<tr><td>' + row[0] + '</td><td>' + formatNumber(row[1], row[0] === 'Bytes' ? 0 : 6) + '</td></tr>';
    }).join('');
    setResult('<div class="metric-grid"><div class="metric"><strong>' + bytesToHuman(bytes) + '</strong><span>Decimal human size</span></div><div class="metric"><strong>' + formatNumber(bytes, 0) + '</strong><span>Total bytes</span></div></div><div class="table-wrap"><table><thead><tr><th>Unit</th><th>Value</th></tr></thead><tbody>' + rows + '</tbody></table></div>', formatNumber(bytes, 0) + ' bytes');
  }

  function loadImageFile(file, resize) {
    if (!file) return;
    const img = new Image();
    img.onload = function() {
      selectedImage = img;
      if (resize) {
        const width = $('#resize-width');
        const height = $('#resize-height');
        if (width) width.value = img.naturalWidth || img.width;
        if (height) height.value = img.naturalHeight || img.height;
      }
      calculate();
    };
    img.onerror = function() {
      setResult('<p class="status-bad">Could not load that image.</p>', '');
    };
    img.src = URL.createObjectURL(file);
  }

  function canvasFromImage(width, height) {
    if (!selectedImage) return null;
    const canvas = document.createElement('canvas');
    canvas.width = width || selectedImage.naturalWidth || selectedImage.width;
    canvas.height = height || selectedImage.naturalHeight || selectedImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(selectedImage, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  function calcImageFormat() {
    if (!selectedImage) {
      setResult('<p>Choose an image to preview conversion details.</p>', '');
      return;
    }
    const format = $('#image-format')?.value || 'image/png';
    const quality = Number($('#image-quality')?.value || 0.9);
    const canvas = canvasFromImage();
    const dataUrl = canvas.toDataURL(format, quality);
    const approx = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
    setResult('<div class="metric-grid"><div class="metric"><strong>' + escapeHtml(format.replace('image/', '').toUpperCase()) + '</strong><span>Output format</span></div><div class="metric"><strong>' + bytesToHuman(approx) + '</strong><span>Estimated output size</span></div><div class="metric"><strong>' + canvas.width + ' x ' + canvas.height + '</strong><span>Pixels</span></div></div><img class="preview" alt="Converted preview" src="' + dataUrl + '">', format + ', ' + canvas.width + 'x' + canvas.height);
  }

  function downloadCanvasImage(prefix) {
    if (!selectedImage) {
      alert('Choose an image first.');
      return;
    }
    const format = $('#image-format')?.value || 'image/png';
    const quality = Number($('#image-quality')?.value || 0.9);
    const canvas = canvasFromImage();
    canvas.toBlob(function(blob) {
      downloadBlob(blob, prefix + '.' + format.replace('image/', '').replace('jpeg', 'jpg'));
    }, format, quality);
  }

  function calcImageSize() {
    const width = Number($('#resize-width')?.value || 0);
    const height = Number($('#resize-height')?.value || 0);
    const dpi = Number($('#resize-dpi')?.value || 300);
    const ratio = height ? width / height : 0;
    const printW = dpi ? width / dpi : 0;
    const printH = dpi ? height / dpi : 0;
    setResult('<div class="metric-grid"><div class="metric"><strong>' + formatNumber(width * height, 0) + '</strong><span>Total pixels</span></div><div class="metric"><strong>' + formatNumber(ratio, 4) + ':1</strong><span>Aspect ratio</span></div><div class="metric"><strong>' + formatNumber(printW, 2) + ' x ' + formatNumber(printH, 2) + ' in</strong><span>Print size at ' + dpi + ' DPI</span></div></div>', width + ' x ' + height + ' px');
  }

  function downloadResized() {
    if (!selectedImage) {
      alert('Choose an image first.');
      return;
    }
    const width = Number($('#resize-width')?.value || selectedImage.width);
    const height = Number($('#resize-height')?.value || selectedImage.height);
    const canvas = canvasFromImage(width, height);
    canvas.toBlob(function(blob) {
      downloadBlob(blob, 'resized-' + width + 'x' + height + '.png');
    }, 'image/png');
  }

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a || 1;
  }

  function calcAspectRatio() {
    const width = Number($('#ratio-width')?.value || 0);
    const height = Number($('#ratio-height')?.value || 0);
    const a = Number($('#ratio-a')?.value || 16);
    const b = Number($('#ratio-b')?.value || 9);
    const divisor = gcd(width || a, height || b);
    const simplified = width && height ? Math.round(width / divisor) + ':' + Math.round(height / divisor) : a + ':' + b;
    const calcHeight = width && a && b ? width * b / a : 0;
    const calcWidth = height && a && b ? height * a / b : 0;
    setResult('<div class="metric-grid"><div class="metric"><strong>' + escapeHtml(simplified) + '</strong><span>Simplified ratio</span></div><div class="metric"><strong>' + formatNumber(calcHeight, 0) + ' px</strong><span>Height from width and ratio</span></div><div class="metric"><strong>' + formatNumber(calcWidth, 0) + ' px</strong><span>Width from height and ratio</span></div></div>', simplified);
  }

  function calcTransfer() {
    const size = Number($('#transfer-size')?.value || 0);
    const sizeUnit = $('#transfer-size-unit')?.value || 'GB';
    const speed = Number($('#transfer-speed')?.value || 0);
    const speedUnit = $('#transfer-speed-unit')?.value || 'Mbps';
    const bytes = size * (decimalUnits[sizeUnit] || 1);
    const bits = bytes * 8;
    const bitsPerSecond = speedUnit === 'Kbps' ? speed * 1000 : speedUnit === 'Mbps' ? speed * 1000000 : speedUnit === 'Gbps' ? speed * 1000000000 : speed * 8 * 1000000;
    const seconds = bitsPerSecond ? bits / bitsPerSecond : 0;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    setResult('<div class="metric-grid"><div class="metric"><strong>' + formatDuration(seconds) + '</strong><span>Estimated time</span></div><div class="metric"><strong>' + formatNumber(minutes, 2) + '</strong><span>Minutes</span></div><div class="metric"><strong>' + formatNumber(hours, 2) + '</strong><span>Hours</span></div></div>', formatDuration(seconds));
  }

  function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return (h ? h + 'h ' : '') + (m ? m + 'm ' : '') + s + 's';
  }

  function setTimestampNow() {
    const ts = $('#timestamp-value');
    const dt = $('#datetime-value');
    const now = new Date();
    if (ts) ts.value = Math.floor(now.getTime() / 1000);
    if (dt) dt.value = toDateTimeLocal(now);
    calculate();
  }

  function toDateTimeLocal(date) {
    const pad = function(n) { return String(n).padStart(2, '0'); };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function calcTimestamp() {
    const dt = $('#datetime-value');
    if (dt && !dt.value) dt.value = toDateTimeLocal(new Date());
    const raw = String($('#timestamp-value')?.value || '').trim();
    const numeric = Number(raw);
    const ms = raw.length >= 13 ? numeric : numeric * 1000;
    const date = Number.isFinite(ms) ? new Date(ms) : new Date();
    const fromDate = dt?.value ? new Date(dt.value) : date;
    setResult('<div class="metric-grid"><div class="metric"><strong>' + Math.floor(fromDate.getTime() / 1000) + '</strong><span>Seconds</span></div><div class="metric"><strong>' + fromDate.getTime() + '</strong><span>Milliseconds</span></div><div class="metric"><strong>' + escapeHtml(date.toISOString()) + '</strong><span>UTC from timestamp</span></div><div class="metric"><strong>' + escapeHtml(date.toLocaleString()) + '</strong><span>Local from timestamp</span></div></div>', date.toISOString());
  }

  function calcTimezone() {
    const input = $('#tz-datetime');
    if (input && !input.value) input.value = toDateTimeLocal(new Date());
    const source = $('#tz-source')?.value || 'UTC';
    const instant = dateFromZone(input.value, source);
    const rows = TOOL_CONFIG.timezones.map(function(tz) {
      return '<tr><td>' + escapeHtml(tz) + '</td><td>' + escapeHtml(formatInZone(instant, tz)) + '</td></tr>';
    }).join('');
    setResult('<div class="table-wrap"><table><thead><tr><th>Time zone</th><th>Local time</th></tr></thead><tbody>' + rows + '</tbody></table></div>', formatInZone(instant, source));
  }

  function dateFromZone(value, zone) {
    if (!value) return new Date();
    const parts = value.match(/(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})/);
    if (!parts) return new Date(value);
    const utcGuess = Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]), Number(parts[4]), Number(parts[5]));
    const offset = zoneOffset(new Date(utcGuess), zone);
    return new Date(utcGuess - offset);
  }

  function zoneOffset(date, zone) {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const parts = formatter.formatToParts(date).reduce(function(acc, part) {
      acc[part.type] = part.value;
      return acc;
    }, {});
    const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
    return asUtc - date.getTime();
  }

  function formatInZone(date, zone) {
    return new Intl.DateTimeFormat('en-US', { timeZone: zone, dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  function titleCase(text) {
    return text.toLowerCase().replace(/\\b\\w/g, function(char) { return char.toUpperCase(); });
  }

  function toWords(text) {
    return text.trim().split(/[^A-Za-z0-9]+/).filter(Boolean);
  }

  function calcTextCase() {
    const text = $('#text-input')?.value || '';
    const words = toWords(text);
    const variants = [
      ['UPPERCASE', text.toUpperCase()],
      ['lowercase', text.toLowerCase()],
      ['Title Case', titleCase(text)],
      ['Sentence case', text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()],
      ['camelCase', words.map(function(word, index) { word = word.toLowerCase(); return index ? word.charAt(0).toUpperCase() + word.slice(1) : word; }).join('')],
      ['snake_case', words.map(function(w) { return w.toLowerCase(); }).join('_')],
      ['kebab-case', words.map(function(w) { return w.toLowerCase(); }).join('-')]
    ];
    const rows = variants.map(function(item) {
      return '<tr><td>' + escapeHtml(item[0]) + '</td><td>' + escapeHtml(item[1]) + '</td></tr>';
    }).join('');
    setResult('<div class="table-wrap"><table><thead><tr><th>Case</th><th>Text</th></tr></thead><tbody>' + rows + '</tbody></table></div>', variants[0][1]);
  }

  function calcJson(mode) {
    const input = $('#json-input')?.value || '';
    try {
      const parsed = JSON.parse(input);
      const output = mode === 'minify-json' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setResult('<p class="status-ok">Valid JSON</p><textarea readonly>' + escapeHtml(output) + '</textarea>', output);
    } catch (error) {
      setResult('<p class="status-bad">Invalid JSON: ' + escapeHtml(error.message) + '</p>', '');
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  }

  async function copyPrimary() {
    try {
      await navigator.clipboard.writeText(lastPrimaryText);
      const button = $('#copy-primary');
      if (button) {
        const old = button.textContent;
        button.textContent = 'Copied';
        setTimeout(function() { button.textContent = old; }, 900);
      }
    } catch (error) {}
  }

  function setupTheme() {
    let theme = 'dark';
    try { theme = localStorage.getItem(TOOL_CONFIG.slug + '_theme') || 'dark'; } catch (error) {}
    document.documentElement.setAttribute('data-theme', theme);
    const button = $('#theme-toggle');
    if (button) {
      button.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem(TOOL_CONFIG.slug + '_theme', next); } catch (error) {}
      });
    }
  }

  function setupLanguage() {
    const select = $('#language-select');
    if (select) {
      select.addEventListener('change', function() {
        if (window.i18n) window.i18n.setLanguage(select.value);
      });
    }
  }

  function setupDefaults() {
    if (TOOL_CONFIG.type === 'timestamp') setTimeout(setTimestampNow, 0);
    if (TOOL_CONFIG.type === 'timezone') {
      setTimeout(function() {
        const input = $('#tz-datetime');
        if (input && !input.value) input.value = toDateTimeLocal(new Date());
        const source = $('#tz-source');
        if (source) source.value = 'Asia/Seoul';
        calculate();
      }, 0);
    }
  }

  function init() {
    setupTheme();
    setupLanguage();
    render();
    setupDefaults();
    const copy = $('#copy-primary');
    if (copy) copy.addEventListener('click', copyPrimary);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'utility_tool_view', { event_category: 'utility', tool_slug: TOOL_CONFIG.slug });
    }
    hideLoader();
  }

  document.addEventListener('DOMContentLoaded', function() {
    try {
      init();
    } catch (error) {
      setResult('<p class="status-bad">The tool could not initialize. Please refresh the page.</p>', '');
      hideLoader();
    }
  });
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 4500);
})();
`;
}

function manifest(tool) {
  return prettyJson({
    name: `${tool.title} - DopaBrain`,
    short_name: tool.shortTitle,
    description: tool.description,
    start_url: '.',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: tool.color,
    background_color: '#0b1020',
    lang: 'en',
    categories: ['utilities', 'productivity'],
    icons: [
      { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
      { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
    ]
  });
}

function sw(tool) {
  return `const CACHE_NAME = '${tool.slug}-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/i18n.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(URLS_TO_CACHE);
  }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) { return key !== CACHE_NAME; }).map(function(key) {
      return caches.delete(key);
    }));
  }).then(function() { return self.clients.claim(); }));
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(function(response) {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
    return response;
  }).catch(function() {
    return caches.match(event.request).then(function(response) {
      return response || caches.match('./index.html');
    });
  }));
});
`;
}

function iconSvg(tool, size) {
  const label = tool.shortTitle.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || 'DB';
  const fontSize = size === 192 ? 70 : 188;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeAttr(tool.title)} icon">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.16)}" fill="${tool.color}"/>
  <circle cx="${Math.round(size * 0.74)}" cy="${Math.round(size * 0.25)}" r="${Math.round(size * 0.18)}" fill="${tool.accent}" opacity="0.9"/>
  <path d="M${Math.round(size * 0.18)} ${Math.round(size * 0.72)} L${Math.round(size * 0.82)} ${Math.round(size * 0.72)}" stroke="#ffffff" stroke-width="${Math.max(6, Math.round(size * 0.045))}" stroke-linecap="round" opacity="0.72"/>
  <text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff">${label}</text>
</svg>
`;
}

function locale(tool) {
  return prettyJson({
    app: { title: tool.title, description: tool.description },
    ui: { skip: 'Skip to tool', loading: 'Loading...' }
  });
}

function appDataObject(tool) {
  const icon = tool.shortTitle.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || 'UT';
  return `    {
        id: '${tool.slug}',
        name: '${tool.title.replace(/'/g, "\\'")}',
        shortDesc: '${tool.description.replace(/'/g, "\\'")}',
        description: '${tool.description.replace(/'/g, "\\'")}',
        icon: '${icon}',
        color: '${tool.color}',
        category: 'tool',
        tags: [${tool.keywords.split(',').map((tag) => `'${tag.trim().replace(/'/g, "\\'")}'`).join(', ')}],
        url: 'https://dopabrain.com/${tool.slug}/',
        isNew: true,
        isPopular: false,
        popularity: ${tool.popularity},
        i18n: {
            en: { name: '${tool.title.replace(/'/g, "\\'")}', shortDesc: '${tool.shortTitle.replace(/'/g, "\\'")}' }
        }
    }`;
}

function toolCard(tool) {
  const icon = tool.shortTitle.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || 'UT';
  return `  <a href="/${tool.slug}/" class="tool-card" data-cat="${tool.filter}" data-app="${tool.slug}"><span class="tc-cat">${tool.filter.charAt(0).toUpperCase() + tool.filter.slice(1)}</span><div class="tc-icon" style="background:${hexToRgba(tool.color, 0.12)}">${icon}</div><div class="tc-name">${tool.shortTitle}</div><div class="tc-desc">${tool.titleSuffix}</div></a>`;
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const int = parseInt(normalized, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function updateCategories() {
  const filePath = path.join(ROOT, 'projects', '_common', 'app-categories.json');
  const data = JSON.parse(readFile(filePath));
  data.utilities = data.utilities || [];
  for (const tool of TOOLS) {
    if (!data.utilities.includes(tool.slug)) data.utilities.push(tool.slug);
  }
  writeFile(filePath, prettyJson(data));
}

function updateAppData() {
  const filePath = path.join(ROOT, 'projects', 'portal', 'js', 'app-data.js');
  let content = readFile(filePath);
  const missing = TOOLS.filter((tool) => !content.includes(`id: '${tool.slug}'`));
  if (missing.length === 0) return;
  const insert = ',\n' + missing.map(appDataObject).join(',\n');
  content = content.replace(/\r?\n\];\r?\n\r?\nconst CATEGORIES =/, insert + '\n];\n\nconst CATEGORIES =');
  writeFile(filePath, content);
}

function updateToolsHub() {
  const filePath = path.join(ROOT, 'projects', 'portal', 'tools', 'index.html');
  let content = readFile(filePath);
  content = content.replace(/15\+ free/g, '25+ free').replace(/15\+ Tools/g, '25+ Tools').replace(/15\+ tools/g, '25+ tools');
  if (!content.includes('data-filter="converter"')) {
    content = content.replace(
      /(<button class="filter-btn" data-filter="calculator"[^>]*>.*?<\/button>)/,
      '$1\n  <button class="filter-btn" data-filter="converter">Converter</button>'
    );
  }
  if (!content.includes('data-filter="developer"')) {
    content = content.replace(
      /(<button class="filter-btn" data-filter="generator"[^>]*>.*?<\/button>)/,
      '$1\n  <button class="filter-btn" data-filter="developer">Developer</button>'
    );
  }
  const missing = TOOLS.filter((tool) => !content.includes(`data-app="${tool.slug}"`));
  if (missing.length > 0) {
    const cards = missing.map(toolCard).join('\n');
    content = content.replace(/\r?\n<\/div>\r?\n\r?\n<div class="hub-ad-slot" id="hub-inline-ad"/, '\n' + cards + '\n</div>\n\n<div class="hub-ad-slot" id="hub-inline-ad"');
  }
  writeFile(filePath, content);
}

function updatePortalLocales() {
  const localeDir = path.join(ROOT, 'projects', 'portal', 'js', 'locales');
  for (const lang of LANGS) {
    const filePath = path.join(localeDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) continue;
    const next = readFile(filePath).replace(/15\+/g, '25+').replace(/15개 이상/g, '25개 이상');
    writeFile(filePath, next);
  }
}

function sitemapEntry(tool) {
  return `  <url><loc>https://dopabrain.com/${tool.slug}/</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
}

function updateSitemap(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  let content = readFile(filePath);
  const missing = TOOLS.filter((tool) => !content.includes(`https://dopabrain.com/${tool.slug}/`));
  if (missing.length === 0) return;
  const entries = missing.map(sitemapEntry).join('\n');
  if (content.includes('<url><loc>https://dopabrain.com/unit-converter/</loc>')) {
    content = content.replace(/(  <url><loc>https:\/\/dopabrain\.com\/unit-converter\/<\/loc>.*?<\/url>)/, '$1\n' + entries);
  } else {
    content = content.replace('</urlset>', entries + '\n</urlset>');
  }
  writeFile(filePath, content);
}

function createApps() {
  for (const tool of TOOLS) {
    const base = path.join(ROOT, 'projects', tool.slug);
    writeFile(path.join(base, '.gitattributes'), '* text=auto eol=lf\n');
    writeFile(path.join(base, 'index.html'), appIndex(tool));
    writeFile(path.join(base, 'css', 'style.css'), appCss(tool));
    writeFile(path.join(base, 'js', 'i18n.js'), i18nJs());
    writeFile(path.join(base, 'js', 'app.js'), appJs(tool));
    writeFile(path.join(base, 'manifest.json'), manifest(tool));
    writeFile(path.join(base, 'sw.js'), sw(tool));
    writeFile(path.join(base, 'icon-192.svg'), iconSvg(tool, 192));
    writeFile(path.join(base, 'icon-512.svg'), iconSvg(tool, 512));
    for (const lang of LANGS) {
      writeFile(path.join(base, 'js', 'locales', `${lang}.json`), locale(tool));
    }
  }
}

createApps();
updateCategories();
updateAppData();
updateToolsHub();
updatePortalLocales();
updateSitemap(path.join('projects', 'portal', 'sitemap.xml'));
updateSitemap(path.join('projects', 'root-domain', 'sitemap.xml'));

console.log(`Generated ${TOOLS.length} utility apps and updated portal wiring.`);
