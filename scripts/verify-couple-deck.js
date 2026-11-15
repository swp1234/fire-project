const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { blockExternalAds } = require('./lib/block-external-ads');
const { listenOnSafePort } = require('./lib/safe-local-port');

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
    const address = server ? await listenOnSafePort(server, '127.0.0.1') : null;
    const origin = production ? 'https://dopabrain.com' : `http://127.0.0.1:${address.port}`;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await blockExternalAds(context);
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
                adServing: document.body?.dataset?.adServing || '',
                ads: document.querySelectorAll('script[src*="pagead2"],ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').length,
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
        await page.waitForTimeout(120);
        const interactionEvents = await eventNames(page);

        await page.goto(`${origin}/mbti-love/?lang=de&source=verify`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#btn-start');
        await page.click('#btn-start');
        for (let index = 0; index < 12; index += 1) {
            const option = page.locator('.option').first();
            await option.waitFor({ state: 'visible' });
            await option.click();
            if (index < 11) {
                await page.waitForFunction(n => document.getElementById('progress-text')?.textContent?.startsWith(String(n)), index + 2);
            }
        }
        await page.waitForSelector('#result-screen.active');
        const resultCta = await page.evaluate(() => ({
            title: document.querySelector('#next-action')?.textContent,
            href: document.querySelector('#next-action')?.getAttribute('href'),
            adServing: document.body?.dataset?.adServing || '',
            ads: document.querySelectorAll('script[src*="pagead2"],ins.adsbygoogle,[data-ad-slot],[data-ad-surface]').length,
            events: (window.dataLayer || [])
                .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                .filter(Boolean),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        await page.evaluate(() => document.querySelector('#next-action')
            ?.addEventListener('click', event => event.preventDefault(), { capture: true }));
        await page.click('#next-action');
        const resultClickEvents = await eventNames(page);

        const bridgeRoutes = {
            ko: 'ko/mbti-compatibility-complete-guide.html',
            en: 'en/mbti-love-compatibility-guide.html',
            zh: 'zh/mbti-compatibility.html',
            hi: 'hi/love-compatibility.html',
            ru: 'ru/love-compatibility.html',
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
            if (item.adServing !== 'suspended-invalid-traffic-2026-09-03' || item.ads !== 0 || !item.structuredData) {
                failures.push(`${item.expectedLocale} suspension state or structured data is incomplete`);
            }
            if (!item.events.includes('couple_deck_view') || !item.events.includes('couple_deck_start') || item.events.includes('couple_deck_ad_impression')) {
                failures.push(`${item.expectedLocale} deck telemetry contract invalid`);
            }
            if (item.overflow > 0) failures.push(`${item.expectedLocale} has ${item.overflow}px overflow`);
        });
        if (new Set(cardIds).size !== 4 || !saved.restartVisible) failures.push(`repair deck did not draw four unique cards: ${cardIds.join(',')}`);
        if (saved.listCount !== 1 || saved.favoritePressed !== 'true') failures.push(`favorite persistence failed: ${JSON.stringify(saved)}`);
        if (!clipboard.includes('MBTI Couple Conversation Deck')) failures.push('clipboard output is incomplete');
        ['couple_deck_view', 'couple_deck_start', 'couple_deck_progress', 'couple_deck_complete', 'couple_deck_save', 'print_stub_called']
            .forEach(name => { if (!interactionEvents.includes(name)) failures.push(`${name} event is missing`); });
        if (interactionEvents.includes('couple_deck_ad_impression')) failures.push('legacy couple_deck_ad_impression event leaked');
        if (!resultCta.title?.includes('Gespräch') || !resultCta.href?.includes('lang=de') || !resultCta.href?.includes('source=mbti_love_result')) {
            failures.push(`German result CTA is incomplete: ${JSON.stringify(resultCta)}`);
        }
        if (resultCta.adServing !== 'suspended-invalid-traffic-2026-09-03' || resultCta.ads !== 0) {
            failures.push(`MBTI result suspension contract drifted: ${JSON.stringify(resultCta)}`);
        }
        if (!resultClickEvents.includes('mbti_love_next_click')) failures.push('result next action click event is missing');
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
