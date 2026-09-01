#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { createSign, generateKeyPairSync } = require('crypto');
const { spawnSync } = require('child_process');

const SITE_URL = 'https://dopabrain.com/';
const SITEMAPS = [
  'https://dopabrain.com/sitemap.xml',
  'https://dopabrain.com/portal/sitemap.xml',
  'https://dopabrain.com/portal/blog/sitemap.xml'
];
const WRITE_SCOPE = 'https://www.googleapis.com/auth/webmasters';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function fail(message) {
  throw new Error(message);
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sitemapApiUrl(feed) {
  if (!SITEMAPS.includes(feed)) fail(`Unapproved sitemap: ${feed}`);
  return `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(feed)}`;
}

function validateRobots(text) {
  const declared = new Set(
    Array.from(String(text).matchAll(/^\s*Sitemap\s*:\s*(\S+)\s*$/gim), match => match[1])
  );
  const missing = SITEMAPS.filter(url => !declared.has(url));
  if (missing.length) fail(`robots.txt is missing sitemap declarations: ${missing.join(', ')}`);
  return { declared: declared.size };
}

function validateSitemap(text, contentType, feed) {
  if (!/xml/i.test(String(contentType))) fail(`${feed} did not return an XML content type`);
  if (!/<urlset\b/i.test(text) || !/<\/urlset>/i.test(text)) fail(`${feed} is not a URL sitemap`);
  const urls = Array.from(String(text).matchAll(/<loc>([^<]+)<\/loc>/gi), match => match[1].trim());
  if (!urls.length || urls.length > 50000) fail(`${feed} has an invalid URL count: ${urls.length}`);
  if (new Set(urls).size !== urls.length) fail(`${feed} contains duplicate URLs`);
  for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== 'https://dopabrain.com') fail(`${feed} contains an external URL: ${value}`);
  }
  return { urls: urls.length };
}

function credentialsPath() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const windows = process.platform === 'win32';
  const command = windows ? 'cmd.exe' : 'codex';
  const args = windows ? ['/d', '/s', '/c', 'codex mcp get gsc --json'] : ['mcp', 'get', 'gsc', '--json'];
  const result = spawnSync(command, args, { encoding: 'utf8' });
  if (result.status !== 0) fail('Could not read the isolated Codex GSC configuration');
  const config = JSON.parse(result.stdout);
  const value = config?.transport?.env?.GOOGLE_APPLICATION_CREDENTIALS;
  if (!value) fail('GOOGLE_APPLICATION_CREDENTIALS is not configured for the Codex GSC server');
  return value;
}

function serviceAccount(file) {
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (value.type !== 'service_account' || !value.client_email || !value.private_key) {
    fail('GSC credentials must be a service-account JSON file');
  }
  return value;
}

function signedAssertion(credentials, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: WRITE_SCOPE,
    aud: TOKEN_URL,
    iat: nowSeconds,
    exp: nowSeconds + 3600
  }));
  const unsigned = `${header}.${claims}`;
  const signature = createSign('RSA-SHA256').update(unsigned).end().sign(credentials.private_key);
  return `${unsigned}.${base64url(signature)}`;
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    fail(`${options.method || 'GET'} ${url} failed: ${response.status} ${body}`);
  }
  return response;
}

async function validateLiveQueue() {
  const robotsResponse = await request(`${SITE_URL}robots.txt?gsc-submit-check=${Date.now()}`);
  const robots = validateRobots(await robotsResponse.text());
  const sitemapRows = [];
  for (const feed of SITEMAPS) {
    const response = await request(`${feed}?gsc-submit-check=${Date.now()}`);
    sitemapRows.push({
      feed,
      ...validateSitemap(await response.text(), response.headers.get('content-type'), feed)
    });
  }
  return { robots, sitemaps: sitemapRows };
}

async function accessToken(credentials) {
  const response = await request(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedAssertion(credentials)
    })
  });
  const value = await response.json();
  if (!value.access_token) fail('Google token response did not contain an access token');
  return value.access_token;
}

async function submit(token, feed) {
  await request(sitemapApiUrl(feed), {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}` }
  });
}

function selfTest() {
  validateRobots(SITEMAPS.map(url => `Sitemap: ${url}`).join('\n'));
  const valid = '<urlset><url><loc>https://dopabrain.com/a/</loc></url></urlset>';
  validateSitemap(valid, 'application/xml', SITEMAPS[0]);
  const failures = [
    () => validateRobots(`Sitemap: ${SITEMAPS[0]}`),
    () => validateSitemap('<html></html>', 'text/html', SITEMAPS[0]),
    () => validateSitemap('<urlset></urlset>', 'application/xml', SITEMAPS[0]),
    () => validateSitemap('<urlset><url><loc>https://example.com/</loc></url></urlset>', 'application/xml', SITEMAPS[0]),
    () => sitemapApiUrl('https://dopabrain.com/unapproved.xml')
  ];
  for (const mutation of failures) {
    let detected = false;
    try { mutation(); } catch { detected = true; }
    if (!detected) fail('A sitemap submission safety mutation escaped');
  }
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const assertion = signedAssertion({ client_email: 'test@example.invalid', private_key: privateKey }, 1000);
  const claims = JSON.parse(Buffer.from(assertion.split('.')[1], 'base64url').toString('utf8'));
  if (claims.scope !== WRITE_SCOPE || claims.aud !== TOKEN_URL || claims.exp - claims.iat !== 3600) {
    fail('Write-scope JWT contract drifted');
  }
  const api = decodeURIComponent(sitemapApiUrl(SITEMAPS[2]));
  if (!api.includes(SITE_URL) || !api.includes(SITEMAPS[2])) fail('Submission URL encoding drifted');
  console.log(`[PASS] GSC sitemap submit safety: ${failures.length}/${failures.length} mutations, fixed queue=${SITEMAPS.length}, scope=webmasters`);
}

async function main() {
  if (process.argv.includes('--self-test')) return selfTest();
  if (process.argv.includes('--credential-check')) {
    serviceAccount(credentialsPath());
    console.log('[PASS] isolated GSC service-account credentials are readable');
    return;
  }
  const queue = await validateLiveQueue();
  if (process.argv.includes('--dry-run')) {
    console.log(JSON.stringify({ ok: true, dryRun: true, ...queue }, null, 2));
    return;
  }
  const credentials = serviceAccount(credentialsPath());
  const token = await accessToken(credentials);
  for (const feed of SITEMAPS) await submit(token, feed);
  console.log(JSON.stringify({ ok: true, submitted: SITEMAPS, ...queue }, null, 2));
}

main().catch(error => {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
});
