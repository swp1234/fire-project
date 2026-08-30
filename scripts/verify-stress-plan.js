const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { ADSENSE_CLIENT, inspectHtml } = require('./clean-indexable-blog-ads');

const projectRoot = path.resolve(__dirname, '..', 'projects', 'stress-check');
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

function createServer() {
    return http.createServer((request, response) => {
        const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
        const filePath = path.resolve(projectRoot, relativePath);

        if (!filePath.startsWith(projectRoot + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
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

async function run() {
    const baseArgument = process.argv.find(argument => argument.startsWith('--base-url='));
    const productionBase = baseArgument ? baseArgument.slice('--base-url='.length).replace(/\/+$/, '') : '';
    const server = productionBase ? null : createServer();
    if (server) {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    }
    const origin = productionBase || `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    let resultContext;
    page.on('pageerror', error => errors.push(String(error)));

    try {
        const planUrl = `${origin}/plan.html?lang=en&focus=work&level=high&source=verification&verify_cache=${Date.now()}`;
        const sourceResponse = await fetch(planUrl, { headers: { 'Cache-Control': 'no-cache' } });
        if (!sourceResponse.ok) throw new Error(`plan source returned HTTP ${sourceResponse.status}`);
        const sourceAds = inspectHtml(await sourceResponse.text());

        await page.goto(planUrl, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector('.day-card');
        const initial = await page.evaluate(() => ({
            title: document.querySelector('h1')?.textContent,
            days: document.querySelectorAll('.day-card').length,
            focus: document.querySelector('#focus-select')?.value,
            level: document.querySelector('#level-select')?.value,
            runtimeAdsbygoogleCount: document.querySelectorAll('ins.adsbygoogle').length,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            events: window.dataLayer
                .map(item => item?.event || (item?.[0] === 'event' ? item[1] : null))
                .filter(Boolean)
        }));

        await page.check('.day-card input[data-day="0"]');
        const progress = (await page.textContent('#progress-count')).trim();
        await page.selectOption('#language-select', 'ko');
        const koreanTitle = (await page.textContent('h1')).trim();
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.day-card');
        const persisted = await page.isChecked('.day-card input[data-day="0"]');

        resultContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const resultPage = await resultContext.newPage();
        resultPage.on('pageerror', error => errors.push(String(error)));
        await resultPage.goto(`${origin}/?lang=en&verify_cache=${Date.now()}`, { waitUntil: 'domcontentloaded' });
        await resultPage.waitForFunction(() => (
            typeof i18n !== 'undefined'
            && i18n.currentLang === 'en'
            && Boolean(i18n.translations.en)
            && document.querySelector('#intro-screen')?.classList.contains('active')
        ), null, { timeout: 7000 });
        await resultPage.evaluate(() => {
            STRESS_QUESTIONS.forEach(question => {
                window.app.answers[question.id] = 4;
            });
            window.app.calculateResults();
            window.app.displayResults();
        });
        await resultPage.waitForSelector('#result-screen.active', { timeout: 7000 });
        const callToAction = (await resultPage.textContent('#btn-premium-unlock')).trim();
        await Promise.all([
            resultPage.waitForURL(/plan\.html/, { timeout: 5000 }),
            resultPage.click('#btn-premium-unlock')
        ]);
        const routedUrl = resultPage.url();

        const report = { sourceAds, initial, progress, koreanTitle, persisted, callToAction, routedUrl, errors };
        console.log(JSON.stringify(report, null, 2));

        const failures = [];
        if (initial.days !== 7) failures.push(`expected 7 day cards, received ${initial.days}`);
        if (initial.focus !== 'work') failures.push(`expected work focus, received ${initial.focus}`);
        if (initial.level !== 'high') failures.push(`expected high level, received ${initial.level}`);
        const loaderCount = sourceAds.directLoaders + sourceAds.managedLoaders;
        if (loaderCount !== 1 || sourceAds.loaderClients[0] !== ADSENSE_CLIENT) {
            failures.push(`expected one official Auto Ads loader in source, received ${sourceAds.loaderClients.join(', ') || 'none'}`);
        }
        if (sourceAds.invalidAutoSlots) failures.push(`invalid auto slots in source: ${sourceAds.invalidAutoSlots}`);
        if (sourceAds.manualUnits) failures.push(`manual ad units in source: ${sourceAds.manualUnits}`);
        if (sourceAds.manualPushes) failures.push(`manual ad pushes in source: ${sourceAds.manualPushes}`);
        if (sourceAds.staticAdSurfaces) failures.push(`static ad surfaces in source: ${sourceAds.staticAdSurfaces}`);
        if (sourceAds.paidImpressionClaims) failures.push(`synthetic ad impression claims in source: ${sourceAds.paidImpressionClaims}`);
        if (initial.overflow > 0) failures.push(`mobile overflow is ${initial.overflow}px`);
        if (!initial.events.includes('stress_plan_view')) failures.push('stress_plan_view was not tracked');
        if (progress !== '1 / 7') failures.push(`expected progress 1 / 7, received ${progress}`);
        if (!koreanTitle.includes('7일')) failures.push('Korean title did not render');
        if (!persisted) failures.push('local checklist state did not persist');
        if (!callToAction.toLowerCase().includes('7-day')) failures.push('English result CTA did not render');
        if (!routedUrl.includes('focus=') || !routedUrl.includes('level=high')) {
            failures.push(`result route lost personalization: ${routedUrl}`);
        }
        if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);

        if (failures.length) {
            throw new Error(failures.join('\n'));
        }
        console.log('PASS: stress plan browser verification');
    } finally {
        if (resultContext) await resultContext.close();
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
