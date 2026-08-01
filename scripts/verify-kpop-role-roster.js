const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const portalRoot = path.join(root, 'projects', 'portal');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };
function localFile(pathname) { if (!pathname.startsWith('/portal/')) return null; let relative = pathname.slice('/portal/'.length); if (!relative || relative.endsWith('/')) relative += 'index.html'; const file = path.resolve(portalRoot, relative); return file.startsWith(portalRoot + path.sep) && fs.existsSync(file) && !fs.statSync(file).isDirectory() ? file : null; }
function serve() { return http.createServer((request, response) => { const file = localFile(decodeURIComponent(new URL(request.url, 'http://local').pathname)); if (!file) { response.writeHead(404); response.end('Not found'); return; } response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(response); }); }
function events(page) { return page.evaluate(() => (window.dataLayer || []).map((item) => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean)); }

async function run() {
    const production = process.argv.includes('--production');
    const server = production ? null : serve(); if (server) await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = production ? 'https://dopabrain.com' : `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', (error) => { if (!/adsbygoogle|TagError|Failed to register/i.test(String(error))) errors.push(String(error)); });
    await page.route(/googletagmanager|googlesyndication|doubleclick|google-analytics/, (route) => route.abort());
    try {
        const localeReports = [];
        for (const language of ['en', 'ko', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/portal/tools/kpop-role-roster.html?lang=${language}&source=verify`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#members .member');
            localeReports.push(await page.evaluate((expected) => ({ expected, language: document.documentElement.lang, title: document.querySelector('h1')?.textContent, button: document.querySelector('#generate')?.textContent, members: document.querySelectorAll('#members .member').length, ads: document.querySelectorAll('[data-ad-surface="kpop_roster_inline"]').length, jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent)['@type']), hreflangs: document.querySelectorAll('link[rel="alternate"][hreflang]').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }), language));
        }
        await page.goto(`${origin}/portal/tools/kpop-role-roster.html?lang=ko&source=verify`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => localStorage.removeItem('kpop_role_roster_v1')); await page.reload({ waitUntil: 'domcontentloaded' });
        await page.click('[data-preset="seven"]');
        await page.fill('.member:nth-child(1) input', '<img src=x onerror=alert(1)>');
        await page.fill('.member:nth-child(2) input', 'Nova');
        await page.click('#generate');
        await page.locator('[data-ad-surface="kpop_roster_inline"]').scrollIntoViewIfNeeded(); await page.waitForTimeout(150);
        const generated = await page.evaluate(() => ({ title: document.querySelector('#resultTitle').textContent, rosterCount: document.querySelectorAll('.roster-card').length, names: Array.from(document.querySelectorAll('.roster-card h3')).map((node) => node.textContent), tags: Array.from(document.querySelectorAll('.role-tags span')).map((node) => node.textContent), coLeaders: Array.from(document.querySelectorAll('.role-tags span')).filter((node) => node.textContent.includes('공동 리더')).length, coverage: Array.from(document.querySelectorAll('.coverage-item b')).map((node) => Number(node.textContent)), images: document.querySelectorAll('.roster-card img').length, stored: JSON.parse(localStorage.getItem('kpop_role_roster_v1')), leakedToAnalytics: JSON.stringify(window.dataLayer || []).includes('<img src=x'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
        await page.click('#finalize'); const beforeReloadEvents = await events(page); await page.reload({ waitUntil: 'domcontentloaded' });
        const persisted = await page.evaluate(() => ({ visible: !document.querySelector('#result').hidden, cards: document.querySelectorAll('.roster-card').length, final: document.querySelector('#statusBadge').textContent, name: document.querySelector('.roster-card h3').textContent }));
        await page.selectOption('#language', 'zh');
        const translated = await page.evaluate(() => ({ language: document.documentElement.lang, title: document.querySelector('#resultTitle').textContent, firstRole: document.querySelector('.role-tags span').textContent, canonical: document.querySelector('link[rel="canonical"]').href }));
        const plannerEvents = [...new Set(beforeReloadEvents.concat(await events(page)))];

        const bridgeReports = [];
        for (const [language, file] of [['en', 'en/kpop-positions-explained-guide.html'], ['es', 'es/test-posicion-kpop-guia.html'], ['zh', 'zh/kpop-position-test-guide.html']]) {
            await page.goto(`${origin}/portal/blog/${file}`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.cp-kpop-roster'); await page.locator('.cp-kpop-roster').scrollIntoViewIfNeeded(); await page.waitForTimeout(120);
            bridgeReports.push(await page.evaluate((expected) => ({ expected, title: document.querySelector('.cp-kpop-roster-title')?.textContent, links: document.querySelectorAll('.cp-kpop-roster-link').length, rosterHref: document.querySelector('.cp-kpop-roster-link[data-destination="group_roster"]')?.getAttribute('href'), generic: document.querySelectorAll('.cp-revenue-recovery,.cp-mobile-sprint,.cp-palworld-game,.cp-brain-workout').length, events: (window.dataLayer || []).map((item) => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }), language));
        }
        await page.goto(`${origin}/portal/blog/en/kpop-positions-explained-guide.html`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.cp-kpop-roster-link[data-destination="group_roster"]'); await page.evaluate(() => document.querySelector('.cp-kpop-roster-link[data-destination="group_roster"]').addEventListener('click', (event) => event.preventDefault(), { capture: true })); await page.click('.cp-kpop-roster-link[data-destination="group_roster"]'); const bridgeClickEvents = await events(page);
        await page.goto(`${origin}/portal/blog/zh/2048-strategy-guide.html`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.cp-2048-coach'); const priority = await page.evaluate(() => ({ coach: document.querySelectorAll('.cp-2048-coach').length, kpop: document.querySelectorAll('.cp-kpop-roster').length }));
        await page.goto(`${origin}/portal/tools/?lang=zh`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-app="kpop-role-roster"]'); await page.waitForFunction(() => document.querySelector('[data-app="kpop-role-roster"] .tc-name')?.textContent.includes('K-pop组合'), null, { timeout: 10000 });
        const catalog = await page.evaluate(() => { const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent); return { count: document.querySelectorAll('[data-app="kpop-role-roster"]').length, name: document.querySelector('[data-app="kpop-role-roster"] .tc-name')?.textContent, href: document.querySelector('[data-app="kpop-role-roster"]')?.getAttribute('href'), itemCount: graph.mainEntity.numberOfItems, listLength: graph.mainEntity.itemListElement.length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
        const report = { localeReports, generated, persisted, translated, plannerEvents, bridgeReports, bridgeClickEvents, priority, catalog, errors }; console.log(JSON.stringify(report, null, 2));
        const failures = [];
        localeReports.forEach((item) => { if (item.language !== item.expected || !item.title || !item.button || item.members !== 5) failures.push(`${item.expected} locale incomplete`); if (item.ads !== 1 || item.jsonLd.join('|') !== 'WebApplication|FAQPage' || item.hreflangs !== 13 || item.overflow > 0) failures.push(`${item.expected} metadata/layout invalid`); });
        ['메인 보컬', '메인 댄서', '메인 래퍼', '센터'].forEach((tag) => { if (!generated.tags.includes(tag)) failures.push(`${tag} missing`); });
        if (generated.rosterCount !== 7 || generated.coLeaders !== 2 || generated.coverage.length !== 5 || generated.coverage.some((count) => count < 1) || generated.images || generated.leakedToAnalytics || generated.overflow > 0) failures.push('generated roster invalid');
        if (!generated.names[0].includes('<img') || Object.keys(generated.stored).sort().join('|') !== 'concept|final|generated|leadership|members|size' || 'roles' in generated.stored || 'coverage' in generated.stored) failures.push('storage or safe rendering contract invalid');
        if (!persisted.visible || persisted.cards !== 7 || !persisted.final.includes('확정') || !persisted.name.includes('<img')) failures.push('persistence failed');
        if (translated.language !== 'zh' || !/[一-鿿]/.test(translated.title) || !/[一-鿿]/.test(translated.firstRole) || !translated.canonical.includes('lang=zh')) failures.push('Chinese live rerender failed');
        ['kpop_roster_view', 'kpop_roster_preset', 'kpop_roster_generate', 'kpop_roster_finalize', 'kpop_roster_ad_impression'].forEach((name) => { if (!plannerEvents.includes(name)) failures.push(`${name} missing`); });
        bridgeReports.forEach((item) => { if (item.links !== 2 || !item.rosterHref.includes(`lang=${item.expected}`) || !item.rosterHref.includes('source=blog_kpop_position_bridge') || item.generic || !item.events.includes('kpop_roster_bridge_view') || item.overflow > 0) failures.push(`${item.expected} bridge invalid`); });
        if (!bridgeClickEvents.includes('kpop_roster_bridge_click')) failures.push('bridge click event missing'); if (priority.coach !== 1 || priority.kpop) failures.push('2048 priority changed');
        if (catalog.count !== 1 || !catalog.name.includes('组合') || !catalog.href.includes('source=portal_tools_catalog') || catalog.itemCount !== 32 || catalog.listLength !== 32 || catalog.overflow > 0) failures.push('catalog invalid');
        if (errors.length) failures.push(errors.join(' | ')); if (failures.length) throw new Error(failures.join('\n')); console.log('PASS: K-pop role roster verification');
    } finally { await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)); }
}
run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
