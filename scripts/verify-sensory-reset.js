const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const workspace = path.resolve(__dirname, '..');
const routeRoots = [
    { prefix: '/hsp-test/', root: path.join(workspace, 'projects', 'hsp-test') },
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

function eventRecords(page) {
    return page.evaluate(() => (window.dataLayer || []).map(item => {
        if (item?.event) return { name: item.event, params: item };
        if (item?.[0] === 'event') return { name: item[1], params: item[2] || {} };
        return null;
    }).filter(Boolean));
}

async function events(page) {
    return (await eventRecords(page)).map(item => item.name);
}

function forbiddenPayloadKeys(records) {
    const failures = [];
    const forbidden = /(?:^|_)(?:trigger|place|capacity|profile)(?:$|_)|^result(?:_|$)/i;
    const visit = (value, eventName, prefix = '') => {
        if (!value || typeof value !== 'object') return;
        Object.entries(value).forEach(([key, nested]) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (forbidden.test(key)) failures.push(`${eventName}:${fullKey}`);
            visit(nested, eventName, fullKey);
        });
    };
    records.forEach(record => visit(record.params, record.name));
    return failures;
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
    await page.route(/googletagmanager|googlesyndication|doubleclick|google-analytics/, route => route.abort());

    try {
        const localeReports = [];
        for (const locale of ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/hsp-test/reset.html?lang=${locale}&source=hsp_result&profile=drop&trigger=drop&place=drop&capacity=drop&result=drop`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#generate-button');
            await page.click('#generate-button');
            await page.waitForSelector('#result-card:not([hidden])');
            await page.locator('#result-card').scrollIntoViewIfNeeded();
            await page.waitForTimeout(80);
            localeReports.push(await page.evaluate(expectedLocale => ({
                locale: document.documentElement.lang,
                expectedLocale,
                search: location.search,
                title: document.querySelector('h1')?.textContent,
                stepCount: document.querySelectorAll('.reset-step').length,
                firstStep: document.querySelector('.reset-step .step-copy')?.textContent,
                testHref: document.querySelector('#test-link-bottom')?.getAttribute('href'),
                guideHref: document.querySelector('#guide-link')?.getAttribute('href'),
                autoLoaderCount: document.querySelectorAll('script[src*="pagead/js/adsbygoogle.js"]').length,
                manualAdCount: document.querySelectorAll('ins.adsbygoogle,[data-ad-surface],[data-ad-slot]').length,
                manualAdPush: [...document.querySelectorAll('script:not([src])')]
                    .some(script => /adsbygoogle[\s\S]*\.push\s*\(/.test(script.textContent)),
                structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')]
                    .some(script => script.textContent.includes('5-Minute Sensory Reset Card')),
                eventRecords: (window.dataLayer || []).map(item => item?.event
                    ? { name: item.event, params: item }
                    : item?.[0] === 'event' ? { name: item[1], params: item[2] || {} } : null).filter(Boolean),
                activeElement: document.activeElement?.id,
                smallTargets: [...document.querySelectorAll('a,button,select')].filter(element => {
                    const rect = element.getBoundingClientRect();
                    const style = getComputedStyle(element);
                    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
                        && (rect.width < 44 || rect.height < 44);
                }).map(element => {
                    const rect = element.getBoundingClientRect();
                    const identity = element.id ? `#${element.id}` : element.getAttribute('href') ? `${element.tagName.toLowerCase()}[href="${element.getAttribute('href')}"]` : element.className || element.tagName;
                    return `${identity} ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`;
                }),
                timerRole: document.querySelector('.timer')?.getAttribute('role'),
                timerLive: document.querySelector('.timer')?.getAttribute('aria-live'),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }

        await page.goto(`${origin}/hsp-test/reset.html?lang=en&source=hsp_result&profile=antenna&result=80&trigger=sound&place=home&capacity=steady`, { waitUntil: 'domcontentloaded' });
        await page.selectOption('#trigger-select', 'light');
        await page.selectOption('#place-select', 'public');
        await page.selectOption('#capacity-select', 'exit');
        await page.click('#generate-button');
        await page.waitForTimeout(80);
        const customPlan = await page.evaluate(() => ({
            stepTexts: [...document.querySelectorAll('.step-copy')].map(node => node.textContent),
            url: location.search,
            resultVisible: !document.querySelector('#result-card').hidden,
            activeElement: document.activeElement?.id,
            stored: JSON.parse(localStorage.getItem('sensory-reset-settings') || 'null'),
            smallTargets: [...document.querySelectorAll('a,button,select')].filter(element => {
                const rect = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
                    && (rect.width < 44 || rect.height < 44);
            }).map(element => {
                const rect = element.getBoundingClientRect();
                const identity = element.id ? `#${element.id}` : element.getAttribute('href') ? `${element.tagName.toLowerCase()}[href="${element.getAttribute('href')}"]` : element.className || element.tagName;
                return `${identity} ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`;
            })
        }));
        await page.click('#timer-toggle');
        await page.waitForTimeout(1150);
        const timerRunning = await page.locator('#timer-display').textContent();
        await page.click('#timer-toggle');
        const timerEvents = await events(page);
        await page.click('#copy-button');
        const clipboard = await page.evaluate(() => navigator.clipboard.readText());
        const copyEvents = await events(page);
        const resetEventRecords = await eventRecords(page);

        await page.goto(`${origin}/hsp-test/?lang=de&source=verify`, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => !document.getElementById('app-loader') || document.getElementById('app-loader').classList.contains('hidden'));
        await page.click('#btn-start', { force: true });
        for (let category = 0; category < 5; category += 1) {
            await page.click('#btn-limit', { force: true });
            await page.waitForTimeout(420);
        }
        await page.waitForSelector('#screen-result.active');
        await page.locator('#sensory-reset-cta').scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
        const resultCta = await page.evaluate(() => ({
            title: document.querySelector('#sensory-reset-title')?.textContent,
            href: document.querySelector('#sensory-reset-link')?.getAttribute('href'),
            resetCount: document.querySelectorAll('#sensory-reset-cta').length,
            resetLinkCount: document.querySelectorAll('#screen-result #sensory-reset-link').length,
            mapCount: document.querySelectorAll('#sensory-map-cta').length,
            mapLinkCount: document.querySelectorAll('#screen-result a[href*="map.html"]').length,
            eventRecords: (window.dataLayer || []).map(item => item?.event
                ? { name: item.event, params: item }
                : item?.[0] === 'event' ? { name: item[1], params: item[2] || {} } : null).filter(Boolean),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        await page.evaluate(() => {
            document.querySelector('#sensory-reset-link')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.click('#sensory-reset-link');
        const resultClickEvents = await events(page);

        const bridgeReports = [];
        for (const locale of ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/portal/blog/${locale}/sensory-overload-hsp-coping.html`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.cp-sensory-reset');
            await page.locator('.cp-sensory-reset').scrollIntoViewIfNeeded();
            await page.waitForTimeout(80);
            bridgeReports.push(await page.evaluate(expectedLocale => ({
                locale: expectedLocale,
                title: document.querySelector('.cp-sensory-reset-title')?.textContent,
                href: document.querySelector('.cp-sensory-reset-link')?.getAttribute('href'),
                resetCount: document.querySelectorAll('.cp-sensory-reset').length,
                sprintCount: document.querySelectorAll('.cp-mobile-sprint').length,
                events: (window.dataLayer || [])
                    .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                    .filter(Boolean),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }
        await page.goto(`${origin}/portal/blog/de/sensory-overload-hsp-coping.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.cp-sensory-reset-link');
        await page.evaluate(() => {
            document.querySelector('.cp-sensory-reset-link')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.click('.cp-sensory-reset-link');
        const bridgeClickEvents = await events(page);

        await page.goto(`${origin}/portal/tools/?lang=zh`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-app="sensory-reset-card"]');
        await page.waitForFunction(() => document.querySelector('[data-app="sensory-reset-card"] .tc-name')?.textContent.includes('5分钟'));
        const toolsCatalog = await page.evaluate(() => ({
            name: document.querySelector('[data-app="sensory-reset-card"] .tc-name')?.textContent,
            description: document.querySelector('[data-app="sensory-reset-card"] .tc-desc')?.textContent,
            href: document.querySelector('[data-app="sensory-reset-card"]')?.getAttribute('href'),
            placementCount: document.querySelectorAll('[data-app="sensory-reset-card"]').length,
            structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')]
                .some(script => script.textContent.includes('hsp-test/reset.html')),
            events: (window.dataLayer || [])
                .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                .filter(Boolean),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        await page.evaluate(() => {
            document.querySelector('[data-app="sensory-reset-card"]')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.click('[data-app="sensory-reset-card"]');
        const toolsClickEvents = await events(page);

        const report = {
            localeReports,
            interaction: { customPlan, timerRunning, timerEvents, clipboard, copyEvents, resetEventRecords },
            resultCta,
            resultClickEvents,
            bridgeReports,
            bridgeClickEvents,
            toolsCatalog,
            toolsClickEvents,
            errors
        };
        console.log(JSON.stringify(report, null, 2));

        const failures = [];
        localeReports.forEach(item => {
            const eventNames = item.eventRecords.map(record => record.name);
            if (item.locale !== item.expectedLocale) failures.push(`${item.expectedLocale} html lang is ${item.locale}`);
            if (item.search !== `?lang=${item.expectedLocale}&source=hsp_result`) failures.push(`${item.expectedLocale} URL allowlist failed: ${item.search}`);
            if (!item.title || !item.firstStep) failures.push(`${item.expectedLocale} localized reset copy is empty`);
            if (item.stepCount !== 6) failures.push(`${item.expectedLocale} rendered ${item.stepCount} steps`);
            if (!item.testHref?.includes(`lang=${item.expectedLocale}`)) failures.push(`${item.expectedLocale} HSP return route is incomplete`);
            if (!item.guideHref?.includes(`/blog/${item.expectedLocale}/`)) failures.push(`${item.expectedLocale} guide route is incomplete`);
            if (item.autoLoaderCount !== 1 || item.manualAdCount !== 0 || item.manualAdPush || !item.structuredData) {
                failures.push(`${item.expectedLocale} Auto Ads or structured data contract is incomplete`);
            }
            if (!eventNames.includes('sensory_reset_view') || !eventNames.includes('sensory_reset_generate')) {
                failures.push(`${item.expectedLocale} view/generate telemetry is incomplete`);
            }
            if (eventNames.some(name => /_ad_impression$/.test(name))) failures.push(`${item.expectedLocale} emitted a synthetic ad-impression event`);
            const privateKeys = forbiddenPayloadKeys(item.eventRecords);
            if (privateKeys.length) failures.push(`${item.expectedLocale} leaked private telemetry keys: ${privateKeys.join(', ')}`);
            if (item.activeElement !== 'result-title') failures.push(`${item.expectedLocale} generated result did not receive focus`);
            if (item.smallTargets.length) failures.push(`${item.expectedLocale} has sub-44px targets: ${item.smallTargets.join(', ')}`);
            if (item.timerRole !== 'timer' || item.timerLive !== null) failures.push(`${item.expectedLocale} timer accessibility contract is invalid`);
            if (item.overflow > 0) failures.push(`${item.expectedLocale} has ${item.overflow}px overflow`);
        });
        if (!customPlan.resultVisible || customPlan.url !== '?lang=en&source=hsp_result') {
            failures.push(`custom plan state is incomplete: ${JSON.stringify(customPlan)}`);
        }
        if (customPlan.stored?.trigger !== 'light' || customPlan.stored?.place !== 'public' || customPlan.stored?.capacity !== 'exit') failures.push('custom settings were not kept in local storage');
        if (customPlan.activeElement !== 'result-title') failures.push(`custom generated result focus is ${customPlan.activeElement}`);
        if (customPlan.smallTargets.length) failures.push(`custom reset has sub-44px targets: ${customPlan.smallTargets.join(', ')}`);
        if (!customPlan.stepTexts.some(text => /light|screen/i.test(text))) failures.push('light customization did not affect the plan');
        if (timerRunning !== '04:59') failures.push(`timer did not advance to 04:59: ${timerRunning}`);
        if (!timerEvents.includes('sensory_reset_timer_start') || !timerEvents.includes('sensory_reset_timer_pause')) failures.push('timer telemetry is incomplete');
        if (!clipboard.includes('5-Minute Sensory Reset Card') || !copyEvents.includes('sensory_reset_copy')) failures.push('copy output or telemetry is incomplete');
        const resetPrivateKeys = forbiddenPayloadKeys(resetEventRecords);
        if (resetPrivateKeys.length) failures.push(`reset interaction leaked private telemetry keys: ${resetPrivateKeys.join(', ')}`);
        if (resetEventRecords.some(record => /_ad_impression$/.test(record.name))) failures.push('reset emitted a synthetic ad-impression event');
        if (!resultCta.title?.includes('5-Minuten') || resultCta.href !== 'reset.html?lang=de&source=hsp_result') {
            failures.push(`German result CTA is incomplete: ${JSON.stringify(resultCta)}`);
        }
        if (resultCta.resetCount !== 1 || resultCta.resetLinkCount !== 1 || resultCta.mapCount !== 0 || resultCta.mapLinkCount !== 0) failures.push('HSP result must expose one reset primary and no map CTA');
        if (!resultCta.eventRecords.some(record => record.name === 'sensory_reset_cta_view')) failures.push('result CTA view event is missing');
        const resultPrivateKeys = forbiddenPayloadKeys(resultCta.eventRecords);
        if (resultPrivateKeys.length) failures.push(`HSP result CTA leaked private telemetry keys: ${resultPrivateKeys.join(', ')}`);
        if (!resultClickEvents.includes('sensory_reset_cta_click')) failures.push('result CTA click event is missing');
        if (resultCta.overflow > 0) failures.push(`HSP result has ${resultCta.overflow}px overflow`);
        bridgeReports.forEach(item => {
            if (!item.title || !item.href?.includes(`lang=${item.locale}`) || !item.href.includes('source=blog_sensory_bridge')) {
                failures.push(`${item.locale} sensory bridge localization or attribution is incomplete`);
            }
            if (item.resetCount !== 1 || item.sprintCount !== 0) failures.push(`${item.locale} sensory bridge competed with a generic sprint`);
            if (!item.events.includes('sensory_reset_bridge_view')) failures.push(`${item.locale} sensory bridge view event is missing`);
            if (item.overflow > 0) failures.push(`${item.locale} sensory bridge has ${item.overflow}px overflow`);
        });
        if (!bridgeClickEvents.includes('sensory_reset_bridge_click')) failures.push('sensory bridge click event is missing');
        if (!toolsCatalog.name?.includes('5分钟') || !toolsCatalog.description || toolsCatalog.placementCount !== 1) {
            failures.push(`tools catalog sensory card is incomplete: ${JSON.stringify(toolsCatalog)}`);
        }
        if (!toolsCatalog.href?.includes('source=portal_tools_catalog') || !toolsCatalog.structuredData) {
            failures.push('tools catalog sensory attribution or structured data is incomplete');
        }
        if (!toolsCatalog.events.includes('sensory_reset_catalog_view')) failures.push('tools catalog sensory view event is missing');
        if (!toolsClickEvents.includes('sensory_reset_catalog_click')) failures.push('tools catalog sensory click event is missing');
        if (toolsCatalog.overflow > 0) failures.push(`tools catalog has ${toolsCatalog.overflow}px overflow`);
        if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);
        if (failures.length) throw new Error(failures.join('\n'));

        console.log('PASS: sensory reset verification');
    } finally {
        await browser.close();
        if (server) await new Promise(resolve => server.close(resolve));
    }
}

run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
