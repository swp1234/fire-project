const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const WORKSPACE = path.resolve(__dirname, '..', '..', '..', '..');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

async function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const decoded = decodeURIComponent(req.url.split('?')[0]);
      let relPath = decoded.replace(/^\/+/, '');
      const filePath = path.join(WORKSPACE, 'projects', relPath);
      let targetPath = filePath;
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        targetPath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + targetPath);
        return;
      }
      const ext = path.extname(targetPath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(targetPath));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(e.message);
    }
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({
        port: server.address().port,
        close: () => new Promise(r => server.close(r))
      });
    });
  });
}

async function audit(submodules = []) {
  if (!submodules.length) {
    const projectsDir = path.join(WORKSPACE, 'projects');
    submodules = fs.readdirSync(projectsDir).filter(f => fs.existsSync(path.join(projectsDir, f, 'index.html')));
  }

  const server = await startServer();
  const origin = `http://127.0.0.1:${server.port}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  await page.route(url => !url.href.includes('127.0.0.1'), route => route.abort());

  const auditResults = {};

  for (const sub of submodules) {
    const url = `${origin}/${sub}/`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(800);

      const res = await page.evaluate(() => {
        const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        const clientW = document.documentElement.clientWidth;
        const overflow = Math.max(0, scrollW - clientW);

        const elements = Array.from(document.querySelectorAll('a, button, input:not([type="range"]):not([type="hidden"]), select, textarea, [role="button"], label[for]'));
        const visibleElements = [];
        const issues = [];

        for (const el of elements) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
          
          let rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (rect.bottom < 0 || rect.top > 5000) continue;

          // If label for text/number/date input, input itself is target
          if (el.tagName.toLowerCase() === 'label' && el.getAttribute('for')) {
            const target = document.getElementById(el.getAttribute('for'));
            if (target && target.tagName.toLowerCase() === 'input' && target.type !== 'checkbox' && target.type !== 'radio') {
              continue;
            }
          }

          // If input inside label (checkbox/radio), check if parent label is >= 43.5px
          if (el.tagName.toLowerCase() === 'input' && (el.type === 'checkbox' || el.type === 'radio')) {
            const parentLabel = el.closest('label');
            if (parentLabel) {
              const pRect = parentLabel.getBoundingClientRect();
              if (pRect.width >= 43.5 && pRect.height >= 43.5) {
                visibleElements.push({ tag: 'checkbox-in-label', w: pRect.width, h: pRect.height });
                continue;
              }
            }
          }

          // Virtual keyboard keys (essential exception: 10 columns on mobile screens require height >= 44px)
          if (el.classList.contains('key-btn') && rect.height >= 43.5) {
            visibleElements.push({ tag: 'keyboard-key', w: rect.width, h: rect.height });
            continue;
          }

          visibleElements.push({
            tag: el.tagName.toLowerCase(),
            w: Math.round(rect.width * 10) / 10,
            h: Math.round(rect.height * 10) / 10,
            text: (el.textContent || '').trim().slice(0, 15)
          });

          if (rect.width < 43.5 || rect.height < 43.5) {
            if (el.closest('[aria-hidden="true"]')) continue;
            issues.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              className: (el.className && typeof el.className === 'string') ? el.className.trim() : '',
              text: (el.textContent || '').trim().slice(0, 30),
              width: Math.round(rect.width * 10) / 10,
              height: Math.round(rect.height * 10) / 10
            });
          }
        }

        return { overflow, visibleCount: visibleElements.length, issues };
      });

      auditResults[sub] = res;
      console.log(`[${sub}] Visible: ${res.visibleCount}, Overflow: ${res.overflow}px, Issues: ${res.issues.length}`);
      if (res.issues.length > 0) {
        console.log(`  Issues:`, JSON.stringify(res.issues.slice(0, 5), null, 2));
      }
    } catch (err) {
      console.error(`[${sub}] Error:`, err.message);
      auditResults[sub] = { error: err.message };
    }
  }

  await browser.close();
  await server.close();
  return auditResults;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  audit(args).then(res => {
    fs.writeFileSync(path.join(WORKSPACE, 'logs', 'touch-audit-latest.json'), JSON.stringify(res, null, 2));
    console.log('Touch audit completed.');
  }).catch(console.error);
}

module.exports = { audit };
