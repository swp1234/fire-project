#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const {
  MAX_BROWSER_SAFE_PORT,
  MIN_BROWSER_SAFE_PORT,
  listenOnSafePort,
} = require('./lib/safe-local-port');

const ROOT = path.resolve(__dirname, '..');
const BROWSER_VERIFIERS = [
  'scripts/verify-2048-ad-policy.js',
  'scripts/verify-zh-2048-guide.js',
  'scripts/verify-culture-choice.js',
  'scripts/verify-cross-promo-touch.js',
  'scripts/verify-blog-generator-interaction.js',
  'scripts/verify-brain-training-bridge.js',
];

function close(server) {
  return new Promise((resolve) => server.close(resolve));
}

async function main() {
  for (const relative of BROWSER_VERIFIERS) {
    const source = fs.readFileSync(path.join(ROOT, relative), 'utf8');
    if (/\.listen\(\s*0\b/.test(source)) throw new Error(`${relative}: unsafe OS-assigned browser port remains`);
    if (!source.includes("require('./lib/safe-local-port')")) throw new Error(`${relative}: safe local port helper missing`);
  }

  const servers = Array.from({ length: 12 }, () => http.createServer((_request, response) => response.end('ok')));
  try {
    const addresses = await Promise.all(servers.map((server) => listenOnSafePort(server)));
    const ports = addresses.map((address) => address.port);
    if (new Set(ports).size !== ports.length) throw new Error('Safe local port helper reused an active port');
    for (const port of ports) {
      if (port < MIN_BROWSER_SAFE_PORT || port > MAX_BROWSER_SAFE_PORT) {
        throw new Error(`Unsafe local verifier port selected: ${port}`);
      }
    }
    console.log(`[PASS] safe local verifier ports: ${ports.length} unique ports in ${MIN_BROWSER_SAFE_PORT}-${MAX_BROWSER_SAFE_PORT}`);
  } finally {
    await Promise.all(servers.filter((server) => server.listening).map(close));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
