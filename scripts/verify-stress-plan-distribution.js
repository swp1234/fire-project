const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const workspace = path.resolve(__dirname, '..');
const routeRoots = [
    { prefix: '/portal/', root: path.join(workspace, 'projects', 'portal') },
    { prefix: '/stress-response/', root: path.join(workspace, 'projects', 'stress-response') },
    { prefix: '/stress-check/', root: path.join(workspace, 'projects', 'stress-check') }
];
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
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
    if (server) {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    }
    const origin = production ? 'https://dopabrain.com' : `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => {
        if (!/^TagError:/.test(String(error))) errors.push(String(error));
    });

    try {
        await page.goto(`${origin}/portal/tools/?lang=zh`, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForFunction(() => document.querySelector('[data-plan-surface="featured"] .fc-name')?.textContent.includes('7天'));
        const toolsHub = await page.evaluate(() => ({
            featuredName: document.querySelector('[data-plan-surface="featured"] .fc-name')?.textContent,
            catalogName: document.querySelector('[data-plan-surface="catalog"] .tc-name')?.textContent,
            featuredHref: document.querySelector('[data-plan-surface="featured"]')?.getAttribute('href'),
            catalogHref: document.querySelector('[data-plan-surface="catalog"]')?.getAttribute('href'),
            placementCount: document.querySelectorAll('[data-app="stress-reset-plan"]').length,
            itemListIncludesPlan: [...document.querySelectorAll('script[type="application/ld+json"]')]
                .some(script => script.textContent.includes('stress-check/plan.html')),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        const toolsHubEvents = await trackedEvents(page);
        await page.evaluate(() => {
            document.querySelector('[data-plan-surface="catalog"]')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.click('[data-plan-surface="catalog"]');
        const toolsHubClickEvents = await trackedEvents(page);

        await page.goto(`${origin}/portal/blog/en/workplace-stress-relief-guide.html`, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector('.cp-stress-plan');
        await page.locator('.cp-stress-plan').scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        const englishBlog = await page.evaluate(() => ({
            title: document.querySelector('.cp-stress-plan-title')?.textContent,
            href: document.querySelector('.cp-stress-plan-link')?.getAttribute('href'),
            scriptText: document.querySelector('.cp-stress-script-link')?.textContent,
            scriptHref: document.querySelector('.cp-stress-script-link')?.getAttribute('href'),
            planCount: document.querySelectorAll('.cp-stress-plan').length,
            sprintCount: document.querySelectorAll('.cp-mobile-sprint').length,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        const englishEvents = await trackedEvents(page);
        await page.evaluate(() => {
            document.querySelector('.cp-stress-script-link')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.click('.cp-stress-script-link');
        const englishScriptEvents = await trackedEvents(page);

        const communicationReports = [];
        for (const locale of ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/portal/blog/${locale}/people-pleasing-signs-fawn-response.html`, {
                waitUntil: 'domcontentloaded'
            });
            await page.waitForSelector('.cp-boundary-script');
            await page.locator('.cp-boundary-script').scrollIntoViewIfNeeded();
            await page.waitForTimeout(100);
            communicationReports.push(await page.evaluate(currentLocale => ({
                locale: currentLocale,
                title: document.querySelector('.cp-boundary-script-title')?.textContent,
                href: document.querySelector('.cp-boundary-script-link')?.getAttribute('href'),
                context: document.querySelector('.cp-boundary-script')?.getAttribute('data-script-context'),
                scriptCount: document.querySelectorAll('.cp-boundary-script').length,
                sprintCount: document.querySelectorAll('.cp-mobile-sprint').length,
                events: (window.dataLayer || [])
                    .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                    .filter(Boolean),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }
        await page.goto(`${origin}/portal/blog/ko/healthy-boundaries-guide.html`, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector('.cp-boundary-script-link');
        await page.evaluate(() => {
            document.querySelector('.cp-boundary-script-link')
                ?.addEventListener('click', event => event.preventDefault(), { capture: true });
        });
        await page.click('.cp-boundary-script-link');
        const communicationClickEvents = await trackedEvents(page);
        await page.goto(`${origin}/portal/blog/en/hsp-workplace-survival-guide.html`, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector('.cp-boundary-script');
        const workplaceCommunication = await page.evaluate(() => ({
            href: document.querySelector('.cp-boundary-script-link')?.getAttribute('href'),
            context: document.querySelector('.cp-boundary-script')?.getAttribute('data-script-context')
        }));
        await page.goto(`${origin}/portal/blog/en/gaslighting-signs-relationship.html`, {
            waitUntil: 'domcontentloaded'
        });
        const unsafeRelationship = await page.evaluate(() => ({
            scriptCount: document.querySelectorAll('.cp-boundary-script').length
        }));

        const localeReports = [];
        for (const locale of ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/portal/blog/${locale}/stress-management-techniques-guide.html`, {
                waitUntil: 'domcontentloaded'
            });
            await page.waitForSelector('.cp-stress-plan');
            localeReports.push(await page.evaluate(currentLocale => ({
                locale: currentLocale,
                title: document.querySelector('.cp-stress-plan-title')?.textContent,
                href: document.querySelector('.cp-stress-plan-link')?.getAttribute('href'),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }
        const chineseBlog = localeReports.find(item => item.locale === 'zh');

        await page.goto(`${origin}/stress-response/?lang=en`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#app-loader.hidden', { timeout: 5000 });
        await page.waitForSelector('#start-btn');
        await page.click('#start-btn', { force: true });
        for (let question = 0; question < 8; question += 1) {
            await page.click('.option-btn:first-child', { force: true });
            await page.waitForTimeout(450);
        }
        await page.waitForSelector('#result-screen.active', { timeout: 7000 });
        const responseResult = await page.evaluate(() => ({
            cta: document.querySelector('#stress-plan-link')?.textContent,
            href: document.querySelector('#stress-plan-link')?.getAttribute('href'),
            percentilePresent: !!document.querySelector('#percentile-stat'),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            overflowElements: [...document.querySelectorAll('body *')]
                .filter(element => {
                    const rect = element.getBoundingClientRect();
                    return rect.width > 0 && (rect.right > document.documentElement.clientWidth + 1 || rect.left < -1);
                })
                .slice(0, 8)
                .map(element => ({
                    tag: element.tagName,
                    id: element.id,
                    className: String(element.className || ''),
                    right: Math.round(element.getBoundingClientRect().right),
                    width: Math.round(element.getBoundingClientRect().width)
                }))
        }));
        const responseEvents = await trackedEvents(page);

        const report = {
            toolsHub,
            toolsHubEvents,
            toolsHubClickEvents,
            englishBlog,
            englishEvents,
            englishScriptEvents,
            communicationReports,
            communicationClickEvents,
            workplaceCommunication,
            unsafeRelationship,
            localeReports,
            responseResult,
            responseEvents,
            errors
        };
        console.log(JSON.stringify(report, null, 2));

        const failures = [];
        if (!toolsHub.featuredName?.includes('7天') || !toolsHub.catalogName?.includes('7天')) {
            failures.push('Chinese tool hub localization did not render on both plan cards');
        }
        if (toolsHub.placementCount !== 2) failures.push(`expected two tool hub plan placements, received ${toolsHub.placementCount}`);
        if (!toolsHub.featuredHref?.includes('source=portal_tools_featured')) failures.push('featured plan source attribution is missing');
        if (!toolsHub.catalogHref?.includes('source=portal_tools_catalog')) failures.push('catalog plan source attribution is missing');
        if (!toolsHub.itemListIncludesPlan) failures.push('structured tool catalog omits the stress plan');
        if (toolsHub.overflow > 0) failures.push(`tools hub has ${toolsHub.overflow}px mobile overflow`);
        if (!toolsHubEvents.includes('stress_plan_catalog_view')) failures.push('tool hub plan view was not tracked');
        if (!toolsHubClickEvents.includes('stress_plan_catalog_click')) failures.push('tool hub plan click was not tracked');
        if (englishBlog.planCount !== 1) failures.push(`expected one English plan bridge, received ${englishBlog.planCount}`);
        if (englishBlog.sprintCount !== 0) failures.push('generic revenue sprint competed with the plan bridge');
        if (!englishBlog.href?.includes('focus=work') || !englishBlog.href.includes('lang=en')) {
            failures.push(`English workplace personalization is wrong: ${englishBlog.href}`);
        }
        if (!englishBlog.scriptHref?.includes('context=work') || !englishBlog.scriptHref.includes('source=blog_stress_bridge')) {
            failures.push(`English workplace script routing is wrong: ${englishBlog.scriptHref}`);
        }
        if (!englishEvents.includes('stress_plan_bridge_view')) failures.push('English bridge view was not tracked');
        if (!englishScriptEvents.includes('boundary_script_bridge_click')) failures.push('English script bridge click was not tracked');
        communicationReports.forEach(item => {
            if (item.scriptCount !== 1) failures.push(`${item.locale} communication bridge count is ${item.scriptCount}`);
            if (!item.title || !item.href?.includes(`lang=${item.locale}`) || !item.href.includes('source=blog_communication_bridge')) {
                failures.push(`${item.locale} communication bridge localization or attribution is incomplete`);
            }
            if (item.context !== 'relationship') failures.push(`${item.locale} communication bridge context is ${item.context}`);
            if (item.sprintCount !== 0) failures.push(`${item.locale} generic revenue sprint competed with the communication bridge`);
            if (!item.events.includes('boundary_script_bridge_view')) failures.push(`${item.locale} communication bridge view was not tracked`);
            if (item.overflow > 0) failures.push(`${item.locale} communication bridge has ${item.overflow}px overflow`);
        });
        if (!communicationClickEvents.includes('boundary_script_bridge_click')) {
            failures.push('standalone communication bridge click was not tracked');
        }
        if (workplaceCommunication.context !== 'work' || !workplaceCommunication.href?.includes('context=work')) {
            failures.push(`workplace communication routing is wrong: ${JSON.stringify(workplaceCommunication)}`);
        }
        if (unsafeRelationship.scriptCount !== 0) failures.push('gaslighting article received an unsafe conversation-script prompt');
        if (!chineseBlog?.title?.includes('7天')) failures.push('Chinese bridge copy did not render');
        localeReports.forEach(item => {
            if (!item.title || !item.href?.includes(`lang=${item.locale}`)) {
                failures.push(`${item.locale} bridge localization is incomplete`);
            }
            if (item.overflow > 0) failures.push(`${item.locale} bridge has ${item.overflow}px overflow`);
        });
        if (!responseResult.cta?.includes('7-day')) failures.push('English stress-response CTA did not render');
        if (!responseResult.href?.includes('source=stress_response_result')) {
            failures.push(`stress-response source attribution is wrong: ${responseResult.href}`);
        }
        if (responseResult.percentilePresent) failures.push('unsupported stress-response percentile remains');
        if (!responseEvents.includes('stress_plan_cta_view')) failures.push('stress-response CTA view was not tracked');
        if (englishBlog.overflow > 0 || responseResult.overflow > 0) {
            failures.push('mobile overflow detected');
        }
        if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);
        if (failures.length) throw new Error(failures.join('\n'));

        console.log('PASS: stress plan distribution verification');
    } finally {
        await browser.close();
        if (server) {
            await new Promise(resolve => server.close(resolve));
        }
    }
}

run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
