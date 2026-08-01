const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const portalRoot = path.join(root, 'projects', 'portal');
const pastLifeRoot = path.join(root, 'projects', 'past-life');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
function localFile(pathname) { let base; let relative; if (pathname.startsWith('/portal/')) { base = portalRoot; relative = pathname.slice('/portal/'.length); } else if (pathname.startsWith('/past-life/')) { base = pastLifeRoot; relative = pathname.slice('/past-life/'.length); } else return null; if (!relative || relative.endsWith('/')) relative += 'index.html'; const file = path.resolve(base, relative); return file.startsWith(base + path.sep) && fs.existsSync(file) && !fs.statSync(file).isDirectory() ? file : null; }
function serve() { return http.createServer((request, response) => { const file = localFile(decodeURIComponent(new URL(request.url, 'http://local').pathname)); if (!file) { response.writeHead(404); response.end('Not found'); return; } response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(response); }); }
function events(page) { return page.evaluate(() => (window.dataLayer || []).map((item) => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean)); }

async function run() {
    const production = process.argv.includes('--production');
    const server = production ? null : serve(); if (server) await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = production ? 'https://dopabrain.com' : `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', (error) => { if (!/adsbygoogle|TagError|Failed to register/i.test(String(error))) errors.push(String(error)); });
    await page.route(/googletagmanager|googlesyndication|doubleclick|google-analytics/, (route) => route.abort());
    try {
        const localeReports = [];
        for (const language of ['en', 'ko', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/portal/tools/past-life-story-studio.html?lang=${language}&source=verify`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#generate');
            localeReports.push(await page.evaluate((expected) => ({ expected, language: document.documentElement.lang, title: document.querySelector('h1')?.textContent, button: document.querySelector('#generate')?.textContent, controls: document.querySelectorAll('.controls select').length, ads: document.querySelectorAll('[data-ad-surface="past_life_story_inline"]').length, jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent)['@type']), hreflangs: document.querySelectorAll('link[rel="alternate"][hreflang]').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }), language));
        }

        await page.goto(`${origin}/portal/tools/past-life-story-studio.html?lang=en&source=verify`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => localStorage.removeItem('past_life_story_studio_v1')); await page.reload({ waitUntil: 'domcontentloaded' });
        await page.selectOption('#era', 'sail'); await page.selectOption('#setting', 'harbor'); await page.selectOption('#role', 'navigator'); await page.selectOption('#tone', 'adventurous'); await page.selectOption('#motif', 'compass'); await page.click('#generate');
        await page.locator('[data-ad-surface="past_life_story_inline"]').scrollIntoViewIfNeeded(); await page.waitForTimeout(150);
        const generated = await page.evaluate(() => ({ title: document.querySelector('#storyTitle').textContent, meta: document.querySelector('#storyMeta').textContent, code: document.querySelector('#storyCode').textContent, scenes: Array.from(document.querySelectorAll('.scene')).map((node) => ({ heading: node.querySelector('h3').textContent, body: node.querySelector('p').textContent })), keepsake: document.querySelector('#keepsake').textContent, stored: JSON.parse(localStorage.getItem('past_life_story_studio_v1')), proseLeak: JSON.stringify(window.dataLayer || []).includes(document.querySelector('.scene p').textContent), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
        await page.click('#copy'); await page.waitForFunction(() => (window.dataLayer || []).some((item) => item?.event === 'past_life_studio_copy' || (item?.[0] === 'event' && item[1] === 'past_life_studio_copy'))); await page.click('#save');
        for (let index = 0; index < 13; index += 1) { await page.click('#remix'); await page.click('#save'); }
        const collection = await page.evaluate(() => { const stored = JSON.parse(localStorage.getItem('past_life_story_studio_v1')); return { cards: document.querySelectorAll('.saved-card').length, storedCount: stored.saved.length, stateKeys: Object.keys(stored).sort(), cardKeys: Object.keys(stored.saved[0]).sort(), proseStored: JSON.stringify(stored).includes('The tale survived') || JSON.stringify(stored).includes('The road closed') }; });
        const beforeReloadEvents = await events(page); await page.reload({ waitUntil: 'domcontentloaded' });
        const persisted = await page.evaluate(() => ({ visible: !document.querySelector('#result').hidden, scenes: document.querySelectorAll('.scene').length, cards: document.querySelectorAll('.saved-card').length, saveDisabled: document.querySelector('#save').disabled }));
        await page.click('.saved-card:last-child [data-action="open"]'); await page.selectOption('#language', 'zh');
        const translated = await page.evaluate(() => ({ language: document.documentElement.lang, title: document.querySelector('#storyTitle').textContent, firstHeading: document.querySelector('.scene h3').textContent, firstBody: document.querySelector('.scene p').textContent, canonical: document.querySelector('link[rel="canonical"]').href }));
        const studioEvents = [...new Set(beforeReloadEvents.concat(await events(page)))];

        const bridgeReports = [];
        for (const file of ['en/past-life-calculator-birthday.html', 'en/past-life-test-who-were-you.html']) {
            await page.goto(`${origin}/portal/blog/${file}`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.cp-past-life-story'); await page.locator('.cp-past-life-story').scrollIntoViewIfNeeded(); await page.waitForTimeout(120);
            bridgeReports.push(await page.evaluate((name) => ({ file: name, links: document.querySelectorAll('.cp-past-life-story-link').length, studioHref: document.querySelector('[data-destination="story_studio"]')?.getAttribute('href'), competing: document.querySelectorAll('.cp-revenue-recovery,.cp-mobile-sprint,.cp-palworld-game,.cp-kpop-roster,.cp-brain-workout').length, events: (window.dataLayer || []).map((item) => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }), file));
        }
        await page.goto(`${origin}/portal/blog/en/past-life-calculator-birthday.html`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-destination="story_studio"]'); await page.evaluate(() => document.querySelector('[data-destination="story_studio"]').addEventListener('click', (event) => event.preventDefault(), { capture: true })); await page.click('[data-destination="story_studio"]'); const bridgeClickEvents = await events(page);
        await page.goto(`${origin}/portal/blog/en/kpop-positions-explained-guide.html`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('.cp-kpop-roster'); const priority = await page.evaluate(() => ({ kpop: document.querySelectorAll('.cp-kpop-roster').length, story: document.querySelectorAll('.cp-past-life-story').length }));
        await page.goto(`${origin}/past-life/?lang=ko`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('#btn-start'); await page.click('#btn-start', { force: true });
        for (let index = 0; index < 6; index += 1) { await page.locator('#screen-era.active #choice-a').waitFor(); await page.click('#screen-era.active #choice-a', { force: true }); await page.waitForTimeout(index < 5 ? 1750 : 3100); }
        await page.locator('#screen-result.active #story-studio-link').waitFor({ timeout: 10000 });
        const resultRoute = await page.evaluate(() => ({ label: document.querySelector('#story-studio-label')?.textContent, href: document.querySelector('#story-studio-link')?.getAttribute('href'), events: (window.dataLayer || []).map((item) => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
        await page.evaluate(() => document.querySelector('#story-studio-link').addEventListener('click', (event) => event.preventDefault(), { capture: true })); await page.click('#story-studio-link'); resultRoute.clickEvents = await events(page);
        await page.goto(`${origin}/portal/tools/?lang=zh`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-app="past-life-story-studio"]'); await page.waitForFunction(() => document.querySelector('[data-app="past-life-story-studio"] .tc-name')?.textContent.includes('前世故事'));
        const catalog = await page.evaluate(() => { const schema = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent)).find((item) => item.mainEntity?.['@type'] === 'ItemList'); return { count: document.querySelectorAll('[data-app="past-life-story-studio"]').length, name: document.querySelector('[data-app="past-life-story-studio"] .tc-name')?.textContent, href: document.querySelector('[data-app="past-life-story-studio"]')?.getAttribute('href'), itemCount: schema.mainEntity.numberOfItems, listLength: schema.mainEntity.itemListElement.length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });

        const report = { localeReports, generated, collection, persisted, translated, studioEvents, bridgeReports, bridgeClickEvents, priority, resultRoute, catalog, errors }; console.log(JSON.stringify(report, null, 2));
        const failures = [];
        localeReports.forEach((item) => { if (item.language !== item.expected || !item.title || !item.button || item.controls !== 5) failures.push(`${item.expected} locale incomplete`); if (item.ads !== 1 || item.jsonLd.join('|') !== 'WebApplication|FAQPage' || item.hreflangs !== 13 || item.overflow > 0) failures.push(`${item.expected} metadata/layout invalid`); });
        if (generated.scenes.length !== 5 || !generated.title || !generated.meta.includes('Age of sail') || !generated.meta.includes('Busy harbor') || !generated.code.startsWith('STORY-') || !generated.keepsake || generated.proseLeak || generated.overflow > 0) failures.push('generated story invalid');
        if (Object.keys(generated.stored).sort().join('|') !== 'era|generated|motif|role|saved|seed|setting|tone' || generated.stored.saved.length !== 0) failures.push('initial storage contract invalid');
        if (collection.cards !== 12 || collection.storedCount !== 12 || collection.stateKeys.join('|') !== 'era|generated|motif|role|saved|seed|setting|tone' || collection.cardKeys.join('|') !== 'era|id|motif|role|seed|setting|tone' || collection.proseStored) failures.push('collection cap or privacy contract invalid');
        if (!persisted.visible || persisted.scenes !== 5 || persisted.cards !== 12 || !persisted.saveDisabled) failures.push('persistence failed');
        if (translated.language !== 'zh' || !/前世|故事|档案|港口|作坊|市场|花园|观测/.test(translated.title + translated.firstBody) || translated.firstHeading !== '抵达' || !translated.canonical.includes('lang=zh')) failures.push('Chinese live rerender failed');
        ['past_life_studio_view', 'past_life_studio_generate', 'past_life_studio_remix', 'past_life_studio_copy', 'past_life_studio_save', 'past_life_studio_ad_impression', 'past_life_studio_open_saved', 'past_life_studio_language_change'].forEach((name) => { if (!studioEvents.includes(name)) failures.push(`${name} missing`); });
        bridgeReports.forEach((item) => { if (item.links !== 2 || !item.studioHref.includes('lang=en') || !item.studioHref.includes('source=blog_past_life_story_bridge') || item.competing || !item.events.includes('past_life_story_bridge_view') || item.overflow > 0) failures.push(`${item.file} bridge invalid`); });
        if (!bridgeClickEvents.includes('past_life_story_bridge_click')) failures.push('bridge click event missing'); if (priority.kpop !== 1 || priority.story) failures.push('K-pop priority changed');
        if (!resultRoute.label.includes('전생 이야기') || !resultRoute.href.includes('lang=ko') || !resultRoute.href.includes('source=past_life_result') || !resultRoute.events.includes('past_life_story_cta_view') || !resultRoute.clickEvents.includes('past_life_story_cta_click') || resultRoute.overflow > 0) failures.push('past life result route invalid');
        if (catalog.count !== 1 || !catalog.name.includes('前世故事') || !catalog.href.includes('source=portal_tools_catalog') || catalog.itemCount !== 33 || catalog.listLength !== 33 || catalog.overflow > 0) failures.push('catalog invalid');
        if (errors.length) failures.push(errors.join(' | ')); if (failures.length) throw new Error(failures.join('\n')); console.log('PASS: past life story studio verification');
    } finally { await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)); }
}
run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
