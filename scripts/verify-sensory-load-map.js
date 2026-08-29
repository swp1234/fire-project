const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const routes = [
    ['/portal/', 'portal'],
    ['/hsp-test/', 'hsp-test']
].map(([prefix, id]) => ({ prefix, root: path.join(root, 'projects', id) }));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };

function fileFor(pathname) {
    const route = routes.find((item) => pathname.startsWith(item.prefix));
    if (!route) return null;
    let relative = pathname.slice(route.prefix.length);
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const file = path.resolve(route.root, relative);
    return file.startsWith(route.root + path.sep) && fs.existsSync(file) && !fs.statSync(file).isDirectory() ? file : null;
}
function serve() {
    return http.createServer((request, response) => {
        const file = fileFor(decodeURIComponent(new URL(request.url, 'http://local').pathname));
        if (!file) { response.writeHead(404); response.end('Not found'); return; }
        response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
        fs.createReadStream(file).pipe(response);
    });
}
function eventRecords(page) {
    return page.evaluate(() => (window.dataLayer || []).map((item) => {
        if (item?.event) return { name: item.event, params: item };
        if (item?.[0] === 'event') return { name: item[1], params: item[2] || {} };
        return null;
    }).filter(Boolean));
}
async function eventNames(page) {
    return (await eventRecords(page)).map((item) => item.name);
}

async function run() {
    const production = process.argv.includes('--production');
    const server = production ? null : serve();
    if (server) await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = production ? 'https://dopabrain.com' : `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => { if (!/adsbygoogle|TagError|Failed to register/i.test(String(error))) errors.push(String(error)); });
    await page.route(/googletagmanager|googlesyndication|doubleclick|google-analytics/, (route) => route.abort());

    try {
        const locales = [];
        for (const language of ['en', 'ko', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr']) {
            await page.goto(`${origin}/hsp-test/map.html?lang=${language}&source=hsp_result&profile=drop&result=drop&trigger=drop`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#domains .domain');
            locales.push(await page.evaluate((expected) => ({
                expected,
                language: document.documentElement.lang,
                search: location.search,
                title: document.querySelector('h1')?.textContent,
                button: document.querySelector('#build')?.textContent,
                domains: document.querySelectorAll('#domains .domain').length,
                autoLoaderCount: document.querySelectorAll('script[src*="pagead/js/adsbygoogle.js"]').length,
                manualAdCount: document.querySelectorAll('ins.adsbygoogle,[data-ad-surface],[data-ad-slot]').length,
                manualAdPush: [...document.querySelectorAll('script:not([src])')]
                    .some(script => /adsbygoogle[\s\S]*\.push\s*\(/.test(script.textContent)),
                levelLabels: [...document.querySelectorAll('#domains button[data-domain][data-level]')]
                    .map(button => button.getAttribute('aria-label')),
                smallTargets: [...document.querySelectorAll('a,button,select')].filter(element => {
                    const rect = element.getBoundingClientRect();
                    const style = getComputedStyle(element);
                    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
                        && (rect.width < 44 || rect.height < 44);
                }).map(element => element.id || element.className || element.tagName),
                jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => JSON.parse(node.textContent)['@type']),
                hreflangs: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
                events: (window.dataLayer || []).map(item => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean),
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
            }), language));
        }

        await page.goto(`${origin}/hsp-test/map.html?lang=ko&source=hsp_result&profile=drop&result=drop`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => localStorage.removeItem('sensory_load_map_v1'));
        await page.reload({ waitUntil: 'domcontentloaded' });
        for (const [domain, level] of [['noise', 'high'], ['light', 'low'], ['touch', 'medium'], ['social', 'low'], ['demands', 'high']]) {
            await page.click(`#domains button[data-domain="${domain}"][data-level="${level}"]`);
        }
        await page.selectOption('#context', 'work');
        await page.click('#build');
        await page.waitForTimeout(80);
        const generated = await page.evaluate(() => ({
            title: document.querySelector('#resultTitle').textContent,
            priorityNames: Array.from(document.querySelectorAll('.priority strong')).map((item) => item.textContent),
            advice: Array.from(document.querySelectorAll('.priority small')).map((item) => item.textContent),
            request: document.querySelector('#requestText').textContent,
            stored: JSON.parse(localStorage.getItem('sensory_load_map_v1')),
            search: location.search,
            activeElement: document.activeElement?.id,
            levelLabels: [...document.querySelectorAll('#domains button[data-domain][data-level]')]
                .map(button => button.getAttribute('aria-label')),
            smallTargets: [...document.querySelectorAll('a,button,select')].filter(element => {
                const rect = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
                    && (rect.width < 44 || rect.height < 44);
            }).map(element => element.id || element.className || element.tagName),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));
        await page.click('#used');
        await page.click('#used');
        await page.click('#used');
        const beforeReloadEvents = await eventNames(page);
        await page.reload({ waitUntil: 'domcontentloaded' });
        const persisted = await page.evaluate(() => ({
            visible: !document.querySelector('#result').hidden,
            used: document.querySelector('#result').classList.contains('used'),
            context: document.querySelector('#context').value,
            button: document.querySelector('#used').textContent
        }));
        await page.selectOption('#language', 'zh');
        const translated = await page.evaluate(() => ({
            language: document.documentElement.lang,
            title: document.querySelector('h1').textContent,
            advice: document.querySelector('.priority small').textContent,
            request: document.querySelector('#requestText').textContent,
            canonical: document.querySelector('link[rel="canonical"]').href
        }));
        const mapEvents = [...new Set(beforeReloadEvents.concat(await eventNames(page)))];

        await page.goto(`${origin}/hsp-test/?lang=ko`, { waitUntil: 'domcontentloaded' });
        await page.click('#btn-start');
        for (let index = 0; index < 5; index += 1) {
            await page.click('#btn-limit');
            await page.waitForTimeout(430);
        }
        await page.waitForSelector('#screen-result.active');
        const hspResult = await page.evaluate(() => ({
            resetCount: document.querySelectorAll('#sensory-reset-cta').length,
            mapCount: document.querySelectorAll('#sensory-map-cta').length,
            mapLinkCount: document.querySelectorAll('#screen-result a[href*="map.html"]').length,
            resetTitle: document.querySelector('#sensory-reset-title')?.textContent,
            resetHref: document.querySelector('#sensory-reset-link')?.getAttribute('href'),
            events: (window.dataLayer || []).map((item) => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean)
        }));

        await page.goto(`${origin}/portal/blog/zh/sensory-overload-hsp-coping.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.cp-sensory-reset-actions');
        await page.locator('.cp-sensory-reset').scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        await page.evaluate(() => document.querySelector('.cp-sensory-reset-link[data-destination="map"]').addEventListener('click', (event) => event.preventDefault(), { capture: true }));
        const bridge = await page.evaluate(() => ({
            links: document.querySelectorAll('.cp-sensory-reset-link').length,
            mapText: document.querySelector('.cp-sensory-reset-link[data-destination="map"]')?.textContent,
            mapHref: document.querySelector('.cp-sensory-reset-link[data-destination="map"]')?.getAttribute('href'),
            emotion: document.querySelectorAll('.cp-emotion-action').length,
            sprint: document.querySelectorAll('.cp-mobile-sprint').length,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            events: (window.dataLayer || []).map((item) => item?.event || (item?.[0] === 'event' ? item[1] : null)).filter(Boolean)
        }));
        await page.click('.cp-sensory-reset-link[data-destination="map"]');
        bridge.eventsAfterClick = await eventNames(page);

        await page.goto(`${origin}/portal/tools/?lang=zh`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-app="sensory-load-map"]');
        await page.waitForFunction(() => document.querySelector('[data-app="sensory-load-map"] .tc-name')?.textContent.includes('感官'), null, { timeout: 10000 });
        const catalog = await page.evaluate(() => ({
            count: document.querySelectorAll('[data-app="sensory-load-map"]').length,
            name: document.querySelector('[data-app="sensory-load-map"] .tc-name')?.textContent,
            href: document.querySelector('[data-app="sensory-load-map"]')?.getAttribute('href'),
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        }));

        const report = { locales, generated, persisted, translated, mapEvents, hspResult, bridge, catalog, errors };
        console.log(JSON.stringify(report, null, 2));
        const failures = [];
        locales.forEach((item) => {
            if (item.language !== item.expected || !item.title || !item.button || item.domains !== 5) failures.push(`${item.expected} locale incomplete`);
            if (item.search !== `?lang=${item.expected}&source=hsp_result`) failures.push(`${item.expected} URL allowlist failed: ${item.search}`);
            if (item.autoLoaderCount !== 1 || item.manualAdCount !== 0 || item.manualAdPush) failures.push(`${item.expected} Auto Ads contract invalid`);
            if (item.events.some((name) => /_ad_impression$/.test(name))) failures.push(`${item.expected} emitted a synthetic ad-impression event`);
            if (item.levelLabels.length !== 15 || item.levelLabels.some((label) => !label) || new Set(item.levelLabels).size !== 15) failures.push(`${item.expected} level-button accessible names invalid`);
            if (item.smallTargets.length) failures.push(`${item.expected} has sub-44px targets: ${item.smallTargets.join(', ')}`);
            if (item.jsonLd.join('|') !== 'WebApplication|FAQPage' || item.hreflangs !== 13 || item.overflow > 0) failures.push(`${item.expected} metadata/layout invalid`);
        });
        if (generated.priorityNames.length !== 3 || !generated.priorityNames[0].includes('소음') || !generated.priorityNames[1].includes('요구') || generated.advice.some((item) => !/[가-힣]/.test(item)) || !/[가-힣]/.test(generated.request) || generated.overflow > 0) failures.push('Korean generated card invalid');
        if (generated.search !== '?lang=ko&source=hsp_result') failures.push(`generated map URL allowlist failed: ${generated.search}`);
        if (generated.activeElement !== 'resultTitle') failures.push(`generated map focus is ${generated.activeElement}`);
        if (generated.levelLabels.length !== 15 || generated.levelLabels.some((label) => !label) || new Set(generated.levelLabels).size !== 15) failures.push('generated map level-button accessible names invalid');
        if (generated.smallTargets.length) failures.push(`generated map has sub-44px targets: ${generated.smallTargets.join(', ')}`);
        if (Object.keys(generated.stored).sort().join('|') !== 'context|levels|used' || Object.keys(generated.stored.levels).sort().join('|') !== 'demands|light|noise|social|touch' || 'request' in generated.stored || 'advice' in generated.stored) failures.push('local storage privacy contract invalid');
        if (!persisted.visible || !persisted.used || persisted.context !== 'work') failures.push('persistence failed');
        if (translated.language !== 'zh' || !/[一-鿿]/.test(translated.advice) || !/[一-鿿]/.test(translated.request) || !translated.canonical.includes('lang=zh')) failures.push('live Chinese result translation failed');
        ['sensory_map_view', 'sensory_map_generate', 'sensory_map_mark_used', 'sensory_map_mark_reopened'].forEach((name) => { if (!mapEvents.includes(name)) failures.push(`${name} missing`); });
        ['sensory_map_used', 'sensory_map_reopen', 'sensory_map_ad_impression'].forEach((name) => { if (mapEvents.includes(name)) failures.push(`${name} must not be emitted`); });
        if (hspResult.resetCount !== 1 || hspResult.mapCount !== 0 || hspResult.mapLinkCount !== 0 || !hspResult.resetTitle || hspResult.resetHref !== 'reset.html?lang=ko&source=hsp_result' || hspResult.events.includes('sensory_map_cta_view') || hspResult.events.includes('sensory_map_cta_click')) failures.push('HSP result must expose one reset primary and no map CTA');
        if (bridge.links !== 2 || !/[一-鿿]/.test(bridge.mapText) || !bridge.mapHref.includes('lang=zh') || !bridge.mapHref.includes('source=blog_sensory_bridge') || bridge.emotion || bridge.sprint || bridge.overflow > 0 || !bridge.events.includes('sensory_reset_bridge_view') || !bridge.eventsAfterClick.includes('sensory_map_bridge_click')) failures.push('blog two-choice bridge invalid');
        if (catalog.count !== 1 || !catalog.name.includes('感官') || !catalog.href.includes('source=portal_tools_catalog') || catalog.overflow > 0) failures.push('tools catalog route invalid');
        if (errors.length) failures.push(errors.join(' | '));
        if (failures.length) throw new Error(failures.join('\n'));
        console.log('PASS: sensory load map verification');
    } finally {
        await browser.close();
        if (server) await new Promise((resolve) => server.close(resolve));
    }
}

run().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
