#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PROJECTS = path.join(ROOT, 'projects');
const GRADES = ['genius', 'superior', 'high_average', 'average', 'below_average', 'needs_improvement'];
const AI_LABEL = /(?:\bAI\b|\bIA\b|\bKI(?:-|\b)|ИИ)/;
const AD_GATE = /(?:\bad\b|광고|広告|广告|विज्ञापन|реклам|anuncio|publicidad|publicité|iklan|reklam|anzeige)/i;
const SOURCE_CLAIM = /(?:AI[- ]powered|AI (?:brain|deep|analysis)|AI 두뇌|AI 심층|AI 분석|AI深|AI गहरे|KI-Tiefenanalyse|анализ ИИ)/i;
const LEGACY_IQ = /(?:btn-ai-analysis|ai-modal|ai-analysis-text|showAIAnalysis|closeAIAnalysis|ai_analysis_view|ai_insights)/;

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
  for (const { file, json } of locales) {
    const values = [json.results?.detail_notes, json.results?.detail_hint, json.results?.detail_title];
    if (values.some(value => typeof value !== 'string' || !value.trim())) issues.push(`${file}: missing detailed-note UI copy`);
    if (values.some(value => AI_LABEL.test(value))) issues.push(`${file}: detailed-note UI claims AI`);
    if (AD_GATE.test(json.results?.detail_hint || '')) issues.push(`${file}: detailed-note hint claims an ad gate`);
    for (const grade of GRADES) {
      if (typeof json.detail_notes?.[grade] !== 'string' || !json.detail_notes[grade].trim()) issues.push(`${file}: missing detail_notes.${grade}`);
    }
  }
  return issues;
}

function inspectZodiac(source, locales) {
  const issues = [];
  if (SOURCE_CLAIM.test(source)) issues.push('Zodiac source presents deterministic notes as AI output');
  for (const { file, json } of locales) {
    const values = [json.results?.deepAnalysis, json.meta?.description];
    if (values.some(value => typeof value !== 'string' || !value.trim())) issues.push(`${file}: missing relationship-note copy`);
    if (values.some(value => AI_LABEL.test(value))) issues.push(`${file}: relationship-note copy claims AI`);
  }
  return issues;
}

function staticIssues() {
  const iqSource = [
    fs.readFileSync(path.join(PROJECTS, 'iq-test', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'iq-test', 'js', 'app.js'), 'utf8'),
  ].join('\n');
  const zodiacSource = [
    fs.readFileSync(path.join(PROJECTS, 'zodiac-match', 'index.html'), 'utf8'),
    fs.readFileSync(path.join(PROJECTS, 'zodiac-match', 'js', 'app.js'), 'utf8'),
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
      results: { detail_notes: 'AI Brain Analysis', detail_hint: 'Available after watching an ad', detail_title: 'Notes' },
      detail_notes: Object.fromEntries(GRADES.slice(1).map(grade => [grade, 'note'])),
    },
  };
  const zodiacLocale = { file: 'mutation.json', json: { results: { deepAnalysis: 'AI Deep Analysis' }, meta: { description: 'AI-powered result' } } };
  const mutations = [
    inspectIQ('showAIAnalysis()', [iqLocale]).length,
    inspectIQ('AI-powered result', []).length,
    inspectZodiac('AI analysis', [zodiacLocale]).length,
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
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(`http://127.0.0.1:${port}/iq-test/?lang=en`, { waitUntil: 'domcontentloaded' });
    await page.click('#btn-start');
    for (let index = 0; index < 20; index += 1) {
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
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    iq.elapsedMs = Date.now() - iqStart;
    if (!iq.text || /not available/i.test(iq.text) || AI_LABEL.test(iq.label) || iq.elapsedMs > 1000 || iq.overflow > 0) {
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
