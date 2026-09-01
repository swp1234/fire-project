#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://dopabrain.com';
const HOST = 'dopabrain.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY_FILE = 'da41d463f68842ffa3ae58ee92c4105f.txt';
const KEY_PATH = path.resolve(__dirname, '..', 'projects', 'root-domain', KEY_FILE);
const KEY_LOCATION = `${ORIGIN}/${KEY_FILE}`;

function fail(message) {
  throw new Error(message);
}

function localKey() {
  const key = fs.readFileSync(KEY_PATH, 'utf8').trim();
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key) || `${key}.txt` !== KEY_FILE) {
    fail('IndexNow key file name/content contract is invalid');
  }
  return key;
}

function requestedUrls(args) {
  const urls = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--url') urls.push(args[index + 1] || '');
  }
  if (!urls.length) fail('Provide at least one newly added, updated, or deleted canonical URL with --url');
  if (urls.length > 100) fail('This project limits one submission batch to 100 changed URLs');
  if (new Set(urls).size !== urls.length) fail('Duplicate IndexNow URLs are forbidden');
  for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== ORIGIN || url.protocol !== 'https:' || url.search || url.hash) {
      fail(`IndexNow URL must be a clean DopaBrain HTTPS canonical: ${value}`);
    }
  }
  return urls;
}

function canonicalFrom(html) {
  return html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1] || '';
}

async function fetchChecked(url, options = {}) {
  const response = await fetch(url, options);
  return response;
}

async function validateLive(urls, key) {
  const keyResponse = await fetchChecked(`${KEY_LOCATION}?indexnow-check=${Date.now()}`);
  if (!keyResponse.ok || (await keyResponse.text()).trim() !== key) fail('Live IndexNow key is missing or mismatched');
  const pages = [];
  for (const value of urls) {
    const response = await fetchChecked(`${value}?indexnow-check=${Date.now()}`);
    if (!response.ok || response.url.split('?')[0] !== value) fail(`Changed URL is not directly reachable: ${value}`);
    if (!/html/i.test(response.headers.get('content-type') || '')) fail(`Changed URL is not HTML: ${value}`);
    const html = await response.text();
    if (/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\bcontent=["'][^"']*noindex/i.test(html)) fail(`Changed URL is noindex: ${value}`);
    if (canonicalFrom(html) !== value) fail(`Changed URL canonical mismatch: ${value}`);
    pages.push({ url: value, bytes: Buffer.byteLength(html) });
  }
  return pages;
}

function payload(key, urls) {
  return { host: HOST, key, keyLocation: KEY_LOCATION, urlList: urls };
}

function selfTest() {
  const valid = `${ORIGIN}/portal/blog/example.html`;
  if (requestedUrls(['--url', valid])[0] !== valid) fail('Valid URL parsing failed');
  const failures = [
    () => requestedUrls([]),
    () => requestedUrls(['--url', 'https://example.com/a']),
    () => requestedUrls(['--url', `${valid}?lang=ko`]),
    () => requestedUrls(['--url', `${valid}#section`]),
    () => requestedUrls(['--url', valid, '--url', valid])
  ];
  for (const mutation of failures) {
    let detected = false;
    try { mutation(); } catch { detected = true; }
    if (!detected) fail('An IndexNow safety mutation escaped');
  }
  const body = payload('test-key', [valid]);
  if (body.host !== HOST || body.keyLocation !== KEY_LOCATION || body.urlList.length !== 1) fail('IndexNow payload drifted');
  if (canonicalFrom(`<link rel="canonical" href="${valid}">`) !== valid) fail('Canonical parser drifted');
  console.log(`[PASS] IndexNow safety: ${failures.length}/${failures.length} mutations, explicit clean URLs only`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return selfTest();
  const urls = requestedUrls(args);
  const key = localKey();
  const pages = await validateLive(urls, key);
  if (args.includes('--dry-run')) {
    console.log(JSON.stringify({ ok: true, dryRun: true, keyLocation: KEY_LOCATION, pages }, null, 2));
    return;
  }
  const response = await fetchChecked(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload(key, urls))
  });
  if (![200, 202].includes(response.status)) {
    fail(`IndexNow submission failed: ${response.status} ${(await response.text()).slice(0, 300)}`);
  }
  console.log(JSON.stringify({ ok: true, status: response.status, submitted: urls, keyLocation: KEY_LOCATION }, null, 2));
}

main().catch(error => {
  console.error(`[FAIL] ${error.message}`);
  process.exitCode = 1;
});

