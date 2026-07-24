const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const workspace = path.resolve(__dirname, '..');
const routeRoots = [
    { prefix: '/portal/', root: path.join(workspace, 'projects', 'portal') },
    { prefix: '/stress-check/', root: path.join(workspace, 'projects', 'stress-check') }
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
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        permissions: ['clipboard-read', 'clipboard-write']
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => {
        if (!/^TagError:/.test(String(error))) errors.push(String(error));
    });

    try {
        const localeReports = [];
        for (const locale of ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/stress-check/script.html?lang=${locale}&context=work&tone=clear&source=verification`, {
                waitUntil: 'domcontentloaded'
            });
            await page.click('#example-button');
            await page.waitForSelector('#result-card:not([hidden])');
            localeReports.push(await page.evaluate(currentLocale => ({
                locale: currentLocale,
                htmlLang: document.documentElement.lang,
                title: document.querySelector('h1')?.textContent,
                outputLines: document.querySelectorAll('.script-line').length,
                outputLength: document.querySelector('#script-output')?.textContent.length,
                planHref: document.querySelector('#plan-link')?.getAttribute('href'),
                adCount: document.querySelectorAll('[data-ad-surface] > ins.adsbygoogle').length,
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), locale));
        }

        await page.goto(`${origin}/stress-check/script.html?lang=en&context=relationship&tone=firm&source=verification`, {
            waitUntil: 'domcontentloaded'
        });
        await page.fill('#situation-input', '<img src=x onerror="window.__scriptXss=1"> plans changed');
        await page.fill('#request-input', 'Please confirm changes before noon.');
        await page.fill('#boundary-input', 'I will make a separate plan after noon.');
        await page.click('#generate-button');
        await page.waitForSelector('#result-card:not([hidden])');
        await page.click('#copy-button');
        await page.locator('[data-ad-surface="boundary_script_mid"]').scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        const custom = await page.evaluate(async () => ({
            outputText: document.querySelector('#script-output')?.textContent,
            outputImageCount: document.querySelectorAll('#script-output img').length,
            xssRan: Boolean(window.__scriptXss),
            copiedText: await navigator.clipboard.readText(),
            events: (window.dataLayer || []).map(item => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean),
            planHref: document.querySelector('#plan-link')?.getAttribute('href'),
            source: new URL(location.href).searchParams.get('source'),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));

        await page.goto(`${origin}/stress-check/plan.html?lang=zh&focus=relationship&source=verification`, {
            waitUntil: 'domcontentloaded'
        });
        const planBridge = await page.evaluate(() => ({
            text: document.querySelector('#script-builder-link')?.textContent,
            href: document.querySelector('#script-builder-link')?.getAttribute('href'),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));

        await page.goto(`${origin}/portal/tools/?lang=zh`, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => document.querySelector('[data-app="boundary-script-builder"] .tc-name')?.textContent.includes('界限'));
        const toolsHub = await page.evaluate(() => ({
            name: document.querySelector('[data-app="boundary-script-builder"] .tc-name')?.textContent,
            href: document.querySelector('[data-app="boundary-script-builder"]')?.getAttribute('href'),
            itemListIncludesBuilder: [...document.querySelectorAll('script[type="application/ld+json"]')]
                .some(script => script.textContent.includes('stress-check/script.html')),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));

        const report = { localeReports, custom, planBridge, toolsHub, errors };
        console.log(JSON.stringify(report, null, 2));

        const failures = [];
        localeReports.forEach(item => {
            if (item.htmlLang !== item.locale) failures.push(`${item.locale}: html lang did not update`);
            if (!item.title || item.outputLines !== 4 || item.outputLength < 80) failures.push(`${item.locale}: localized script did not render`);
            if (!item.planHref?.includes(`lang=${item.locale}`)) failures.push(`${item.locale}: return-to-plan locale is missing`);
            if (item.adCount !== 1) failures.push(`${item.locale}: expected one ad surface`);
            if (item.overflow > 0) failures.push(`${item.locale}: ${item.overflow}px mobile overflow`);
        });
        if (!custom.outputText.includes('<img src=x')) failures.push('user text was not preserved as text');
        if (custom.outputImageCount !== 0 || custom.xssRan) failures.push('user text was interpreted as HTML');
        if (!custom.copiedText.includes('Please confirm changes before noon.')) failures.push('clipboard output is incomplete');
        for (const eventName of ['boundary_script_view', 'boundary_script_generate', 'boundary_script_copy', 'boundary_script_ad_impression']) {
            if (!custom.events.includes(eventName)) failures.push(`missing ${eventName}`);
        }
        if (!custom.planHref?.includes('focus=relationship') || custom.source !== 'verification') failures.push('builder attribution or plan routing is incomplete');
        if (!planBridge.text?.includes('界限') || !planBridge.href?.includes('context=relationship')) failures.push('localized plan-to-builder bridge is incomplete');
        if (!toolsHub.name?.includes('界限') || !toolsHub.href?.includes('source=portal_tools_catalog')) failures.push('localized tools catalog card is incomplete');
        if (!toolsHub.itemListIncludesBuilder) failures.push('tool ItemList omits the builder');
        if (custom.overflow > 0 || planBridge.overflow > 0 || toolsHub.overflow > 0) failures.push('mobile overflow detected');
        if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);
        if (failures.length) throw new Error(failures.join('\n'));
        console.log('PASS: boundary script builder verification');
    } finally {
        await browser.close();
        if (server) await new Promise(resolve => server.close(resolve));
    }
}

run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
