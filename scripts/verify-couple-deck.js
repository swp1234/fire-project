const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const workspace = path.resolve(__dirname, '..');
const routeRoots = [
    { prefix: '/mbti-love/', root: path.join(workspace, 'projects', 'mbti-love') },
    { prefix: '/portal/', root: path.join(workspace, 'projects', 'portal') }
];
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

function findFile(requestPath) {
    const route = routeRoots.find(candidate => requestPath.startsWith(candidate.prefix));
    if (!route) return null;
    let relative = requestPath.slice(route.prefix.length);
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const filePath = path.resolve(route.root, relative);
    if (!filePath.startsWith(route.root + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return null;
    return filePath;
}

function createServer() {
    return http.createServer((request, response) => {
        const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const filePath = findFile(requestPath);
        if (!filePath) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }
        response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(response);
    });
}

function eventNames(page) {
    return page.evaluate(() => (window.dataLayer || [])
        .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
        .filter(Boolean));
}

async function run() {
    const production = process.argv.includes('--production');
    const server = production ? null : createServer();
    if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = production ? 'https://dopabrain.com' : `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => {
        const message = String(error);
        if (!/^TagError:/.test(message) && !/adsbygoogle/i.test(message)) errors.push(message);
    });

    try {
        const locales = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
        const localeReports = [];
        for (const locale of locales) {
            await page.goto(`${origin}/mbti-love/deck.html?lang=${locale}&source=verify&mbti=ENFP`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#draw-btn');
            await page.click('#draw-btn');
            localeReports.push(await page.evaluate(expectedLocale => ({
                expectedLocale,
                htmlLang: document.documentElement.lang,
                title: document.querySelector('h1')?.textContent,
                question: document.querySelector('#card-question')?.textContent,
                note: document.querySelector('#card-note')?.textContent,
                typeChip: document.querySelector('#type-chip')?.textContent,
                testHref: document.querySelector('#test-link-bottom')?.getAttribute('href'),
                oneAd: document.querySelectorAll('[data-ad-surface="couple_deck_inline"]').length,
                structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')]
                    .some(script => script.textContent.includes('MBTI Couple Conversation Deck')),
                events: (window.dataLayer || [])
                    .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                    .filter(Boolean),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }

        await page.goto(`${origin}/mbti-love/deck.html?lang=en&source=verify&mbti=INTJ`, { waitUntil: 'domcontentloaded' });
        await page.click('[data-mode="repair"]');
        const cardIds = [];
        for (let index = 0; index < 4; index += 1) {
            await page.click(index === 0 ? '#draw-btn' : '#next-btn');
            cardIds.push(await page.locator('#card-number').textContent());
        }
        await page.click('#favorite-btn');
        const saved = await page.evaluate(() => ({
            listCount: document.querySelectorAll('#saved-list li').length,
            favoritePressed: document.querySelector('#favorite-btn')?.getAttribute('aria-pressed'),
            restartVisible: !document.querySelector('#restart-btn')?.classList.contains('hidden')
        }));
        await page.click('#copy-btn');
        const clipboard = await page.evaluate(() => navigator.clipboard.readText());
        await page.evaluate(() => {
            window.print = () => {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ event: 'print_stub_called' });
            };
        });
        await page.click('#print-btn');
        await page.locator('#deck-ad').scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
        const interactionEvents = await eventNames(page);

        await page.goto(`${origin}/mbti-love/?lang=de&source=verify`, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => !document.getElementById('app-loader') || document.getElementById('app-loader').classList.contains('hidden'));
        const introCta = await page.evaluate(() => ({
            text: document.querySelector('#conversation-deck-intro-text')?.textContent,
            href: document.querySelector('#conversation-deck-intro')?.getAttribute('href')
        }));
        await page.click('#btn-start');
        const questionCount = await page.evaluate(() => QUESTIONS.length);
        for (let index = 0; index < questionCount; index += 1) {
            const option = page.locator('.option-btn:not([disabled])').first();
            await option.waitFor({ state: 'visible' });
            await option.click();
            if (index < questionCount - 1) await page.waitForTimeout(460);
        }
        await page.waitForSelector('#result-screen.active');
        const resultCta = await page.evaluate(() => ({
            title: document.querySelector('#conversation-deck-result-title')?.textContent,
            description: document.querySelector('#conversation-deck-result-desc')?.textContent,
            href: document.querySelector('#conversation-deck-result')?.getAttribute('href'),
            events: (window.dataLayer || [])
                .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                .filter(Boolean),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        await page.evaluate(() => document.querySelector('#conversation-deck-result')
            ?.addEventListener('click', event => event.preventDefault(), { capture: true }));
        await page.click('#conversation-deck-result');
        const resultClickEvents = await eventNames(page);

        const bridgeRoutes = {
            ko: 'ko/mbti-compatibility-complete-guide.html',
            en: 'en/mbti-love-compatibility-guide.html',
            zh: 'zh/mbti-compatibility.html',
            hi: 'hi/love-compatibility.html',
            ru: 'ru/love-compatibility.html',
            ja: 'ja/mbti-love.html',
            es: 'es/love-compatibility.html'
        };
        const bridgeReports = [];
        for (const [locale, route] of Object.entries(bridgeRoutes)) {
            await page.goto(`${origin}/portal/blog/${route}`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.cp-couple-deck');
            await page.locator('.cp-couple-deck').scrollIntoViewIfNeeded();
            await page.waitForTimeout(80);
            bridgeReports.push(await page.evaluate(expectedLocale => ({
                locale: expectedLocale,
                title: document.querySelector('.cp-couple-deck-title')?.textContent,
                href: document.querySelector('.cp-couple-deck-link')?.getAttribute('href'),
                deckCount: document.querySelectorAll('.cp-couple-deck').length,
                sprintCount: document.querySelectorAll('.cp-mobile-sprint').length,
                events: (window.dataLayer || [])
                    .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                    .filter(Boolean),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }
        await page.goto(`${origin}/portal/blog/en/mbti-love-compatibility-guide.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.cp-couple-deck-link');
        await page.evaluate(() => document.querySelector('.cp-couple-deck-link')
            ?.addEventListener('click', event => event.preventDefault(), { capture: true }));
        await page.click('.cp-couple-deck-link');
        const bridgeClickEvents = await eventNames(page);

        await page.goto(`${origin}/portal/tools/?lang=zh`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-app="couple-conversation-deck"]');
        await page.waitForFunction(() => document.querySelector('[data-app="couple-conversation-deck"] .tc-name')?.textContent.includes('情侣'));
        const catalog = await page.evaluate(() => ({
            name: document.querySelector('[data-app="couple-conversation-deck"] .tc-name')?.textContent,
            description: document.querySelector('[data-app="couple-conversation-deck"] .tc-desc')?.textContent,
            href: document.querySelector('[data-app="couple-conversation-deck"]')?.getAttribute('href'),
            count: document.querySelectorAll('[data-app="couple-conversation-deck"]').length,
            structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')]
                .some(script => script.textContent.includes('mbti-love/deck.html')),
            events: (window.dataLayer || [])
                .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                .filter(Boolean),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        await page.evaluate(() => document.querySelector('[data-app="couple-conversation-deck"]')
            ?.addEventListener('click', event => event.preventDefault(), { capture: true }));
        await page.click('[data-app="couple-conversation-deck"]');
        const catalogClickEvents = await eventNames(page);

        const report = {
            localeReports,
            interaction: { cardIds, saved, clipboard, events: interactionEvents },
            introCta,
            resultCta,
            resultClickEvents,
            bridgeReports,
            bridgeClickEvents,
            catalog,
            catalogClickEvents,
            errors
        };
        console.log(JSON.stringify(report, null, 2));

        const failures = [];
        localeReports.forEach(item => {
            if (item.htmlLang !== item.expectedLocale) failures.push(`${item.expectedLocale} html lang is ${item.htmlLang}`);
            if (!item.title || !item.question || !item.note) failures.push(`${item.expectedLocale} localized card copy is empty`);
            if (!item.typeChip?.includes('ENFP')) failures.push(`${item.expectedLocale} MBTI context is missing`);
            if (!item.testHref?.includes(`lang=${item.expectedLocale}`)) failures.push(`${item.expectedLocale} test link lost locale`);
            if (item.oneAd !== 1 || !item.structuredData) failures.push(`${item.expectedLocale} ad or structured data is incomplete`);
            if (!item.events.includes('couple_deck_view') || !item.events.includes('couple_deck_card_view')) failures.push(`${item.expectedLocale} view/card telemetry is incomplete`);
            if (item.overflow > 0) failures.push(`${item.expectedLocale} has ${item.overflow}px overflow`);
        });
        if (new Set(cardIds).size !== 4 || !saved.restartVisible) failures.push(`repair deck did not draw four unique cards: ${cardIds.join(',')}`);
        if (saved.listCount !== 1 || saved.favoritePressed !== 'true') failures.push(`favorite persistence failed: ${JSON.stringify(saved)}`);
        if (!clipboard.includes('MBTI Couple Conversation Deck')) failures.push('clipboard output is incomplete');
        ['couple_deck_mode_select', 'couple_deck_session_complete', 'couple_deck_favorite', 'couple_deck_copy', 'couple_deck_print', 'couple_deck_ad_impression']
            .forEach(name => { if (!interactionEvents.includes(name)) failures.push(`${name} event is missing`); });
        if (!introCta.text?.includes('Gesprächskarten') || !introCta.href?.includes('lang=de')) failures.push(`German intro CTA is incomplete: ${JSON.stringify(introCta)}`);
        if (!resultCta.title?.includes('Gespräch') || !resultCta.href?.includes('lang=de') || !/[?&]mbti=[A-Z]{4}/.test(resultCta.href)) {
            failures.push(`German result CTA is incomplete: ${JSON.stringify(resultCta)}`);
        }
        if (!resultCta.events.includes('couple_deck_cta_view')) failures.push('result CTA view event is missing');
        if (!resultClickEvents.includes('couple_deck_cta_click')) failures.push('result CTA click event is missing');
        if (resultCta.overflow > 0) failures.push(`MBTI result has ${resultCta.overflow}px overflow`);
        bridgeReports.forEach(item => {
            if (!item.title || !item.href?.includes(`lang=${item.locale}`) || !item.href.includes('source=blog_mbti_love_bridge')) {
                failures.push(`${item.locale} bridge localization or attribution is incomplete`);
            }
            if (item.deckCount !== 1 || item.sprintCount !== 0) failures.push(`${item.locale} deck bridge competed with a generic sprint`);
            if (!item.events.includes('couple_deck_bridge_view')) failures.push(`${item.locale} bridge view event is missing`);
            if (item.overflow > 0) failures.push(`${item.locale} bridge has ${item.overflow}px overflow`);
        });
        if (!bridgeClickEvents.includes('couple_deck_bridge_click')) failures.push('bridge click event is missing');
        if (!catalog.name?.includes('情侣') || !catalog.description || catalog.count !== 1) failures.push(`catalog localization failed: ${JSON.stringify(catalog)}`);
        if (!catalog.href?.includes('source=portal_tools_catalog') || !catalog.structuredData) failures.push('catalog attribution or structured data is incomplete');
        if (!catalog.events.includes('couple_deck_catalog_view')) failures.push('catalog view event is missing');
        if (!catalogClickEvents.includes('couple_deck_catalog_click')) failures.push('catalog click event is missing');
        if (catalog.overflow > 0) failures.push(`catalog has ${catalog.overflow}px overflow`);
        if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);
        if (failures.length) throw new Error(failures.join('\n'));

        console.log('PASS: couple conversation deck verification');
    } finally {
        await browser.close();
        if (server) await new Promise(resolve => server.close(resolve));
    }
}

run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
