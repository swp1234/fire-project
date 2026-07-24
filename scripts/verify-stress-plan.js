const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

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
    const server = createServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    const origin = `http://127.0.0.1:${port}`;
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));

    try {
        await page.goto(`${origin}/plan.html?lang=en&focus=work&level=high&source=verification`, {
            waitUntil: 'domcontentloaded'
        });
        await page.waitForSelector('.day-card');
        const initial = await page.evaluate(() => ({
            title: document.querySelector('h1')?.textContent,
            days: document.querySelectorAll('.day-card').length,
            focus: document.querySelector('#focus-select')?.value,
            level: document.querySelector('#level-select')?.value,
            adCount: document.querySelectorAll('.adsbygoogle').length,
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

        await page.goto(`${origin}/?lang=en`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => {
            STRESS_QUESTIONS.forEach(question => {
                window.app.answers[question.id] = 4;
            });
            window.app.calculateResults();
            window.app.displayResults();
        });
        await page.waitForSelector('#result-screen.active', { timeout: 7000 });
        const callToAction = (await page.textContent('#btn-premium-unlock')).trim();
        await Promise.all([
            page.waitForURL(/plan\.html/, { timeout: 5000 }),
            page.click('#btn-premium-unlock')
        ]);
        const routedUrl = page.url();

        const report = { initial, progress, koreanTitle, persisted, callToAction, routedUrl, errors };
        console.log(JSON.stringify(report, null, 2));

        const failures = [];
        if (initial.days !== 7) failures.push(`expected 7 day cards, received ${initial.days}`);
        if (initial.focus !== 'work') failures.push(`expected work focus, received ${initial.focus}`);
        if (initial.level !== 'high') failures.push(`expected high level, received ${initial.level}`);
        if (initial.adCount < 1) failures.push('expected at least one AdSense surface');
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
        await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}

run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
