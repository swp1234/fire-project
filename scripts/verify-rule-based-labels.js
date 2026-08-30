#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const LANGUAGES = ['de', 'en', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh'];
const AI_LABEL = /(?:\bAI\b|\bIA\b|\bKI(?:-|\b)|ИИ)/;
const AD_GATE = /(?:\bad\b|광고|広告|广告|विज्ञापन|реклам|anuncio|publicidad|publicité|iklan|reklam|anzeige)/i;
const SOURCE_CLAIM = /(?:AI[- ]powered|AI (?:brain|deep|analysis)|AI 두뇌|AI 심층|AI 분석|AI深|AI गहरे|KI-Tiefenanalyse|анализ ИИ)/i;
const LEGACY_IQ = /(?:btn-ai-analysis|ai-modal|ai-analysis-text|showAIAnalysis|closeAIAnalysis|ai_analysis_view|ai_insights)/;
const INVALID_IQ_SCORE = /(?:calculateIQ|getGradeInfo|gradeInfo|results\.iq|percentile-stat|results\.percentile|result\.percentileStat|\b85\s*-\s*145\b|IQ score instantly|measure your IQ|reliable indication|general population|specialized education|special education)/i;

function fail(message) {
  throw new Error(message);
}

function localeFiles(project) {
  const directory = path.join(PROJECTS, project, 'js', 'locales');
  return fs.readdirSync(directory).filter(file => file.endsWith('.json')).sort().map(file => ({
    file,
    json: JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')),
  }));
}

function inspectIQ(source, locales) {
  const issues = [];
  if (SOURCE_CLAIM.test(source)) issues.push('IQ source presents deterministic notes as AI output');
  if (LEGACY_IQ.test(source)) issues.push('IQ source retains a legacy AI-analysis identifier');
  if (INVALID_IQ_SCORE.test(source)) issues.push('IQ source retains an unsupported score, percentile, or ability claim');
  if (!/calculatePuzzleScore\(score\)/.test(source) || !/score\s*\/\s*this\.questions\.length/.test(source)) issues.push('IQ source lacks a transparent correct-answer score');
  for (const { file, json } of locales) {
    const values = [
      json.results?.detail_notes,
      json.results?.detail_hint,
      json.results?.detail_title,
      json.results?.detail_body,
      json.results?.score_label,
      json.results?.session_summary,
      json.results?.correct_count,
    ];
    if (values.some(value => typeof value !== 'string' || !value.trim())) issues.push(`${file}: missing detailed-note UI copy`);
    if (values.some(value => typeof value === 'string' && value.includes('?'))) issues.push(`${file}: detailed-note UI contains replacement question marks`);
    if (values.some(value => AI_LABEL.test(value))) issues.push(`${file}: detailed-note UI claims AI`);
    if (AD_GATE.test(json.results?.detail_hint || '')) issues.push(`${file}: detailed-note hint claims an ad gate`);
    if (json.grades || json.detail_notes || json.results?.iq || json.results?.percentile || json.result?.percentileStat) issues.push(`${file}: legacy IQ grade or percentile data remains`);
  }
  return issues;
}

function inspectZodiac(source, locales) {
  const issues = [];
  if (SOURCE_CLAIM.test(source)) issues.push('Zodiac source presents deterministic notes as AI output');
  if (!/this\.ready\s*=\s*this\.init\(\)/.test(source) || !/await\s+i18n\.ready/.test(source)) issues.push('Zodiac loader does not await locale initialization');
  for (const { file, json } of locales) {
    const values = [json.results?.deepAnalysis, json.meta?.description];
    if (values.some(value => typeof value !== 'string' || !value.trim())) issues.push(`${file}: missing relationship-note copy`);
    if (values.some(value => typeof value === 'string' && value.includes('?'))) issues.push(`${file}: relationship-note copy contains replacement question marks`);
    if (values.some(value => AI_LABEL.test(value))) issues.push(`${file}: relationship-note copy claims AI`);
  }
  return issues;
}

function staticIssues() {
  const iqSource = [
    fs.readFileSync(path.join(PROJECTS, 'iq-test', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'iq-test', 'js', 'app.js'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'iq-test', 'js', 'questions.js'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'iq-test', 'manifest.json'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'iq-test', 'README.md'), 'utf8'),
  ].join('\n');
  const zodiacSource = [
    fs.readFileSync(path.join(PROJECTS, 'zodiac-match', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'zodiac-match', 'js', 'app.js'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'zodiac-match', 'js', 'i18n.js'), 'utf8'),
  ].join('\n');
  return [
    ...inspectIQ(iqSource, localeFiles('iq-test')),
    ...inspectZodiac(zodiacSource, localeFiles('zodiac-match')),
  ];
}

function selfTest() {
  const iqLocale = {
    file: 'mutation.json',
    json: {
      results: {
        detail_notes: 'AI Brain Analysis', detail_hint: 'Available after watching an ad', detail_title: 'Notes',
        detail_body: 'note', score_label: 'score', session_summary: 'summary', correct_count: 'count',
      },
      grades: { genius: { title: 'Genius' } },
    },
  };
  const zodiacLocale = { file: 'mutation.json', json: { results: { deepAnalysis: 'AI Deep Analysis' }, meta: { description: 'AI-powered result' } } };
  const corruptedLocale = {
    file: 'mutation.json',
    json: {
      results: {
        detail_notes: '????', detail_hint: 'note', detail_title: 'note', detail_body: 'note',
        score_label: 'score', session_summary: 'summary', correct_count: 'count',
      },
    },
  };
  const validIqLocale = {
    file: 'valid.json',
    json: {
      results: {
        detail_notes: 'notes', detail_hint: 'context', detail_title: 'notes', detail_body: 'context',
        score_label: 'score', session_summary: 'summary', correct_count: 'count',
      },
      result: {},
    },
  };
  const mutations = [
    inspectIQ('showAIAnalysis()', [iqLocale]).length,
    inspectIQ('AI-powered result', []).length,
    inspectZodiac('AI analysis', [zodiacLocale]).length,
    inspectIQ('clean', [corruptedLocale]).length,
    inspectZodiac('const i18n = new I18n();', []).length,
    inspectIQ('function calculateIQ() {}', [validIqLocale]).length,
  ];
  if (mutations.some(count => count === 0)) fail('rule-based label mutation self-test failed');
  console.log(`PASS: rule-based label mutations ${mutations.length}/${mutations.length}`);
}

function createServer() {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(PROJECTS, pathname.replace(/^\/+/, ''));
    if (!file.startsWith(`${PROJECTS}${path.sep}`) || !fs.existsSync(file)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
    const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
    response.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    fs.createReadStream(file).pipe(response);
  });
}

async function listen(server) {
  for (let port = 24650; port < 24700; port += 1) {
    try {
      await new Promise((resolve, reject) => {
        const onError = error => { server.off('listening', onListening); reject(error); };
        const onListening = () => { server.off('error', onError); resolve(); };
        server.once('error', onError); server.once('listening', onListening); server.listen(port, '127.0.0.1');
      });
      return port;
    } catch (error) {
      if (!['EADDRINUSE', 'EACCES'].includes(error.code)) throw error;
    }
  }
  fail('no safe local verification port available');
}

async function runBrowser() {
  const server = createServer();
  const port = await listen(server);
  const iqLocales = Object.fromEntries(localeFiles('iq-test').map(({ file, json }) => [file.replace('.json', ''), json]));
  const zodiacLocales = Object.fromEntries(localeFiles('zodiac-match').map(({ file, json }) => [file.replace('.json', ''), json]));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    for (const language of LANGUAGES) {
      await page.goto(`http://127.0.0.1:${port}/iq-test/?lang=${language}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => !document.querySelector('#app-loader') || document.querySelector('#app-loader').classList.contains('hidden'));
      await page.waitForFunction(expected => document.documentElement.lang === expected, language);
      const iqLabels = await page.locator('#btn-detail-notes, [data-i18n="results.detail_title"]').allInnerTexts();
      const iqExpected = [iqLocales[language].results.detail_notes, iqLocales[language].results.detail_title];
      if (iqLabels.some(value => !value.trim() || value.includes('?') || AI_LABEL.test(value) || AD_GATE.test(value))) fail(`IQ ${language} locale runtime label failed`);
      if (JSON.stringify(iqLabels) !== JSON.stringify(iqExpected)) fail(`IQ ${language} locale runtime value mismatch`);
      if (await page.title() !== iqLocales[language].app.title) fail(`IQ ${language} locale title mismatch`);
      const iqMeta = await page.getAttribute('meta[name="description"]', 'content');
      if (iqMeta !== iqLocales[language].app.description) fail(`IQ ${language} locale meta mismatch`);

      await page.goto(`http://127.0.0.1:${port}/zodiac-match/?lang=${language}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => !document.querySelector('#app-loader') || document.querySelector('#app-loader').classList.contains('hidden'));
      await page.waitForFunction(expected => document.documentElement.lang === expected, language);
      const zodiacLabels = await page.locator('[data-i18n="results.deepAnalysis"]').allInnerTexts();
      if (zodiacLabels.some(value => !value.trim() || value.includes('?') || AI_LABEL.test(value))) fail(`Zodiac ${language} locale runtime label failed`);
      if (zodiacLabels.some(value => value !== zodiacLocales[language].results.deepAnalysis)) fail(`Zodiac ${language} locale runtime value mismatch`);
      const zodiacMeta = await page.getAttribute('meta[name="description"]', 'content');
      if (zodiacMeta !== zodiacLocales[language].meta.description) fail(`Zodiac ${language} locale meta mismatch`);
    }

    await page.goto(`http://127.0.0.1:${port}/iq-test/?lang=en`, { waitUntil: 'domcontentloaded' });
    await page.click('#btn-start');
    for (let index = 0; index < 10; index += 1) {
      await page.waitForSelector('.option');
      await page.click('.option');
      await page.waitForTimeout(340);
    }
    await page.waitForSelector('#screen-results.active', { timeout: 3000 });
    const iqStart = Date.now();
    await page.evaluate(() => document.querySelector('#btn-detail-notes').click());
    await page.waitForSelector('#detail-modal:not(.hidden)');
    const iq = await page.evaluate(() => ({
      text: document.querySelector('#detail-notes-text')?.innerText || '',
      label: document.querySelector('#btn-detail-notes')?.innerText || '',
      score: Number(document.querySelector('#score-value')?.textContent),
      scoreLabel: document.querySelector('[data-i18n="results.score_label"]')?.innerText || '',
      summary: document.querySelector('#grade-title')?.innerText || '',
      correctText: document.querySelector('#grade-desc')?.innerText || '',
      legacyPercentile: Boolean(document.querySelector('#percentile-stat')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    iq.elapsedMs = Date.now() - iqStart;
    const correctMatch = iq.correctText.match(/(\d+)\s+of\s+(\d+)/i);
    const transparentScore = correctMatch && iq.score === Math.round((Number(correctMatch[1]) / Number(correctMatch[2])) * 100);
    if (!iq.text.includes('does not measure intelligence') || !transparentScore || iq.scoreLabel !== iqLocales.en.results.score_label || iq.summary !== iqLocales.en.results.session_summary || iq.legacyPercentile || /\b(?:genius|superior|percentile)\b/i.test(`${iq.scoreLabel} ${iq.summary} ${iq.correctText}`) || AI_LABEL.test(iq.label) || iq.elapsedMs > 1000 || iq.overflow > 0) {
      fail(`IQ detailed-note runtime contract failed: ${JSON.stringify({ ...iq, text: iq.text.slice(0, 80) })}`);
    }

    await page.goto(`http://127.0.0.1:${port}/zodiac-match/?lang=en`, { waitUntil: 'domcontentloaded' });
    await page.locator('.zodiac-btn').nth(0).click();
    await page.locator('.zodiac-btn').nth(12).click();
    await page.click('#check-btn');
    await page.waitForSelector('#results-screen.active');
    const zodiacStart = Date.now();
    await page.evaluate(() => document.querySelector('#premium-btn').click());
    await page.waitForSelector('#premium-screen.active');
    const zodiac = await page.evaluate(() => ({
      text: ['premium-dynamics', 'premium-communication', 'premium-emotional', 'premium-growth'].map(id => document.getElementById(id)?.innerText || '').join(' '),
      label: document.querySelector('#premium-btn')?.innerText || '',
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    zodiac.elapsedMs = Date.now() - zodiacStart;
    if (!zodiac.text.trim() || AI_LABEL.test(zodiac.label) || zodiac.elapsedMs > 1000 || zodiac.overflow > 0) {
      fail(`Zodiac detailed-note runtime contract failed: ${JSON.stringify({ ...zodiac, text: zodiac.text.slice(0, 80) })}`);
    }
    if (errors.length) fail(`page errors: ${errors.join(' | ')}`);
    console.log(JSON.stringify({
      iq: { elapsedMs: iq.elapsedMs, detailLength: iq.text.length, overflow: iq.overflow },
      zodiac: { elapsedMs: zodiac.elapsedMs, detailLength: zodiac.text.length, overflow: zodiac.overflow },
      errors: errors.length,
    }));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

async function main() {
  selfTest();
  const issues = staticIssues();
  if (issues.length) fail(`rule-based label issue(s):\n- ${issues.join('\n- ')}`);
  await runBrowser();
  console.log('PASS: deterministic details are labeled and reachable');
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
