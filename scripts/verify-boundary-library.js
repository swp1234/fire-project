const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const workspace = path.resolve(__dirname, '..');
const routeRoots = [
    { prefix: '/stress-check/', root: path.join(workspace, 'projects', 'stress-check') },
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
    if (!filePath.startsWith(route.root + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        return null;
    }
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
        response.writeHead(200, {
            'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
        });
        fs.createReadStream(filePath).pipe(response);
    });
}

function trackedEvents(page) {
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
        if (!/^TagError:/.test(String(error))) errors.push(String(error));
    });

    try {
        const localeReports = [];
        for (const locale of ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/stress-check/library.html?lang=${locale}&source=verify`, {
                waitUntil: 'domcontentloaded'
            });
            await page.waitForSelector('.phrase-card');
            await page.locator('.phrase-card').first().scrollIntoViewIfNeeded();
            await page.waitForTimeout(100);
            localeReports.push(await page.evaluate(expectedLocale => ({
                locale: document.documentElement.lang,
                expectedLocale,
                title: document.querySelector('h1')?.textContent,
                cardCount: document.querySelectorAll('.phrase-card').length,
                lineCount: document.querySelectorAll('.phrase-card .phrase-line').length,
                editHref: document.querySelector('.phrase-edit')?.getAttribute('href'),
                countText: document.querySelector('#result-count')?.textContent,
                adCount: document.querySelectorAll('[data-ad-surface="boundary_library_mid"]').length,
                itemList: [...document.querySelectorAll('script[type="application/ld+json"]')]
                    .some(script => script.textContent.includes('"numberOfItems": 4')),
                events: (window.dataLayer || [])
                    .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                    .filter(Boolean),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }

        await page.goto(`${origin}/stress-check/library.html?lang=en&source=verify`, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector('.phrase-card');
        const clearOpening = await page.locator('.phrase-line .phrase-text').first().textContent();
        await page.selectOption('#tone-select', 'firm');
        const firmOpening = await page.locator('.phrase-line .phrase-text').first().textContent();
        await page.selectOption('#context-select', 'work');
        const filteredCount = await page.locator('.phrase-card').count();
        await page.fill('#phrase-search', '<img src=x onerror=window.__phraseXss=1>');
        const xssReport = await page.evaluate(() => ({
            triggered: window.__phraseXss === 1,
            injectedImageCount: [...document.images].filter(image => image.getAttribute('src') === 'x').length,
            noResultsVisible: !document.getElementById('no-results').hidden
        }));
        await page.fill('#phrase-search', '');
        await page.locator('.phrase-copy').first().click();
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
        const copyEvents = await trackedEvents(page);
        const editHref = await page.locator('.phrase-edit').first().getAttribute('href');
        await page.evaluate(() => {
            document.querySelector('.phrase-edit')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.locator('.phrase-edit').first().click();
        const editEvents = await trackedEvents(page);
        await page.locator('[data-ad-surface]').scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        const adEvents = await trackedEvents(page);

        await page.goto(`${origin}/stress-check/${editHref}`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#situation-input');
        const builderTemplate = await page.evaluate(() => ({
            context: document.querySelector('#context-select')?.value,
            tone: document.querySelector('#tone-select')?.value,
            situation: document.querySelector('#situation-input')?.value,
            request: document.querySelector('#request-input')?.value,
            boundary: document.querySelector('#boundary-input')?.value,
            libraryHref: document.querySelector('#library-link')?.getAttribute('href'),
            events: (window.dataLayer || [])
                .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                .filter(Boolean),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));

        await page.goto(`${origin}/portal/tools/?lang=zh`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-app="boundary-phrase-library"]');
        await page.waitForFunction(() => document.querySelector('[data-app="boundary-phrase-library"] .tc-name')?.textContent.includes('界限'));
        const toolsCatalog = await page.evaluate(() => ({
            name: document.querySelector('[data-app="boundary-phrase-library"] .tc-name')?.textContent,
            description: document.querySelector('[data-app="boundary-phrase-library"] .tc-desc')?.textContent,
            href: document.querySelector('[data-app="boundary-phrase-library"]')?.getAttribute('href'),
            placementCount: document.querySelectorAll('[data-app="boundary-phrase-library"]').length,
            structuredDataIncludesLibrary: [...document.querySelectorAll('script[type="application/ld+json"]')]
                .some(script => script.textContent.includes('stress-check/library.html')),
            events: (window.dataLayer || [])
                .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                .filter(Boolean),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        await page.evaluate(() => {
            document.querySelector('[data-app="boundary-phrase-library"]')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.click('[data-app="boundary-phrase-library"]');
        const toolsClickEvents = await trackedEvents(page);

        const report = {
            localeReports,
            interaction: {
                clearOpening,
                firmOpening,
                filteredCount,
                xssReport,
                clipboardText,
                copyEvents,
                editEvents,
                adEvents
            },
            builderTemplate,
            toolsCatalog,
            toolsClickEvents,
            errors
        };
        console.log(JSON.stringify(report, null, 2));

        const failures = [];
        localeReports.forEach(item => {
            if (item.locale !== item.expectedLocale) failures.push(`${item.expectedLocale} html lang is ${item.locale}`);
            if (!item.title) failures.push(`${item.expectedLocale} title is empty`);
            if (item.cardCount !== 4) failures.push(`${item.expectedLocale} card count is ${item.cardCount}`);
            if (item.lineCount !== 16) failures.push(`${item.expectedLocale} phrase line count is ${item.lineCount}`);
            if (!item.editHref?.includes(`lang=${item.expectedLocale}`) || !item.editHref.includes('example=1')) {
                failures.push(`${item.expectedLocale} edit route is incomplete`);
            }
            if (!item.countText || item.adCount !== 1 || !item.itemList) failures.push(`${item.expectedLocale} page metadata or ad surface is incomplete`);
            if (!item.events.includes('boundary_library_view') || !item.events.includes('boundary_library_card_view')) {
                failures.push(`${item.expectedLocale} view telemetry is incomplete`);
            }
            if (item.overflow > 0) failures.push(`${item.expectedLocale} has ${item.overflow}px overflow`);
        });
        if (clearOpening === firmOpening) failures.push('tone filter did not change the opening phrase');
        if (filteredCount !== 1) failures.push(`context filter returned ${filteredCount} cards`);
        if (xssReport.triggered || xssReport.injectedImageCount !== 0 || !xssReport.noResultsVisible) {
            failures.push(`search payload was not inert: ${JSON.stringify(xssReport)}`);
        }
        if (!clipboardText.includes('Extra work and deadline changes')) failures.push('copied phrase omitted the scenario title');
        if (!copyEvents.includes('boundary_library_copy')) failures.push('copy event is missing');
        if (!editEvents.includes('boundary_library_edit_click')) failures.push('edit event is missing');
        if (!adEvents.includes('boundary_library_ad_impression')) failures.push('ad impression event is missing');
        if (builderTemplate.context !== 'work' || builderTemplate.tone !== 'firm') failures.push('builder did not preserve template context and tone');
        if (![builderTemplate.situation, builderTemplate.request, builderTemplate.boundary].every(Boolean)) failures.push('builder template fields were not prefilled');
        if (!builderTemplate.libraryHref?.includes('context=work') || !builderTemplate.events.includes('boundary_script_template_load')) {
            failures.push('builder library round-trip or template-load telemetry is incomplete');
        }
        if (builderTemplate.overflow > 0) failures.push(`builder template has ${builderTemplate.overflow}px overflow`);
        if (!toolsCatalog.name?.includes('界限') || !toolsCatalog.description || toolsCatalog.placementCount !== 1) {
            failures.push(`tools catalog localization or placement is incomplete: ${JSON.stringify(toolsCatalog)}`);
        }
        if (!toolsCatalog.href?.includes('source=portal_tools_catalog') || !toolsCatalog.structuredDataIncludesLibrary) {
            failures.push('tools catalog attribution or structured data is incomplete');
        }
        if (!toolsCatalog.events.includes('boundary_library_catalog_view')) failures.push('tools catalog library view event is missing');
        if (!toolsClickEvents.includes('boundary_library_catalog_click')) failures.push('tools catalog library click event is missing');
        if (toolsCatalog.overflow > 0) failures.push(`tools catalog has ${toolsCatalog.overflow}px overflow`);
        if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);
        if (failures.length) throw new Error(failures.join('\n'));

        console.log('PASS: boundary phrase library verification');
    } finally {
        await browser.close();
        if (server) await new Promise(resolve => server.close(resolve));
    }
}

run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
