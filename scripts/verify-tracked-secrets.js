#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { TextDecoder } = require('util');

const USAGE = 'Usage: node scripts/verify-tracked-secrets.js [--self-test]';
const UTF8_DECODER = new TextDecoder('utf-8', { fatal: true });
const AWS_DOCUMENTATION_IDS = new Set([
  ['AKIAIOS', 'FODNN7EXAMPLE'].join(''),
]);

function hasPattern(line, pattern) {
  pattern.lastIndex = 0;
  return pattern.test(line);
}

function entropy(value) {
  const counts = new Map();
  for (const character of value) {
    counts.set(character, (counts.get(character) || 0) + 1);
  }

  let result = 0;
  for (const count of counts.values()) {
    const probability = count / value.length;
    result -= probability * Math.log2(probability);
  }
  return result;
}

function isCredibleRapidApiValue(value) {
  const lower = value.toLowerCase();
  const placeholderWords = [
    'placeholder',
    'example',
    'dummy',
    'sample',
    'changeme',
    'replace',
    'your_',
    'your-',
    'key_here',
    'key-here',
    'notasecret',
    'redacted',
  ];

  if (placeholderWords.some((word) => lower.includes(word))) return false;
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return false;
  if (new Set(value).size < 10) return false;
  return entropy(value) >= 3.2;
}

function hasRapidApiAssignment(line) {
  const pattern = /\b(?:x-rapidapi-key|rapidapi[_-]?key)\b["']?\s*(?::|=)\s*["']?([A-Za-z0-9_-]{24,128})["']?/gi;
  let match;
  while ((match = pattern.exec(line)) !== null) {
    if (isCredibleRapidApiValue(match[1])) return true;
  }
  return false;
}

const RULES = [
  {
    id: 'google-api-key',
    matches: (line) => hasPattern(line, /\bAIza[0-9A-Za-z_-]{35}\b/),
  },
  {
    id: 'rapidapi-key',
    matches: (line) => (
      hasRapidApiAssignment(line)
      || hasPattern(line, /\b[A-Za-z0-9]{20,}msh[A-Za-z0-9]{10,}\b/i)
    ),
  },
  {
    id: 'github-token',
    matches: (line) => hasPattern(line, /\b(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{82,255})\b/),
  },
  {
    id: 'openai-api-key',
    matches: (line) => hasPattern(line, /\bsk-(?:(?:proj|svcacct)-)?[A-Za-z0-9_-]{32,}\b/),
  },
  {
    id: 'aws-access-key-id',
    matches: (line) => {
      const pattern = /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        if (!AWS_DOCUMENTATION_IDS.has(match[0])) return true;
      }
      return false;
    },
  },
  {
    id: 'private-key-pem',
    matches: (line) => hasPattern(line, /-----BEGIN\s+(?:(?:RSA|EC|DSA|OPENSSH|ENCRYPTED)\s+)?PRIVATE KEY-----/),
  },
];

function parseArgs(argv) {
  if (argv.length === 0) return { selfTest: false };
  if (argv.length === 1 && argv[0] === '--self-test') return { selfTest: true };
  throw new Error(`Invalid arguments. ${USAGE}`);
}

function scanText(file, text) {
  const findings = [];
  const lines = text.split(/\r\n|[\n\r\u2028\u2029]/);

  for (let index = 0; index < lines.length; index += 1) {
    for (const rule of RULES) {
      if (rule.matches(lines[index])) {
        findings.push({ file, line: index + 1, rule: rule.id });
      }
    }
  }

  return findings;
}

function decodeUtf16Be(buffer) {
  const payload = Buffer.from(buffer.subarray(2));
  for (let index = 0; index + 1 < payload.length; index += 2) {
    const first = payload[index];
    payload[index] = payload[index + 1];
    payload[index + 1] = first;
  }
  return payload.toString('utf16le');
}

function decodeText(buffer) {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.subarray(2).toString('utf16le');
  }
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    return decodeUtf16Be(buffer);
  }
  if (buffer.includes(0)) return null;

  let text;
  try {
    text = UTF8_DECODER.decode(buffer);
  } catch {
    return null;
  }

  let controlCharacters = 0;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    if (code < 32 && code !== 9 && code !== 10 && code !== 12 && code !== 13) {
      controlCharacters += 1;
    }
  }
  if (controlCharacters > Math.max(4, Math.floor(text.length * 0.01))) return null;
  return text;
}

function isExcludedPath(trackedPath) {
  const components = trackedPath.replace(/\\/g, '/').split('/');
  return components.some((component) => {
    const lower = component.toLowerCase();
    return lower.startsWith('.claude')
      || lower === '.git'
      || lower === 'node_modules'
      || lower === 'logs'
      || lower === '.codex-artifacts';
  });
}

function safeDisplayPath(trackedPath) {
  return trackedPath.replace(/[\r\n\u2028\u2029]/g, '?').replace(/\\/g, '/');
}

function gitOutput(args, options = {}) {
  return execFileSync('git', args, {
    encoding: options.encoding || 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function scanTrackedTree() {
  const workspace = path.resolve(String(gitOutput(['rev-parse', '--show-toplevel'])).trim());
  const rawPaths = gitOutput(['-C', workspace, 'ls-files', '-z', '--cached'], { encoding: 'buffer' });
  const trackedPaths = rawPaths.toString('utf8').split('\0').filter(Boolean);
  const findings = [];
  let scannedFiles = 0;
  let skippedFiles = 0;

  for (const trackedPath of trackedPaths) {
    if (isExcludedPath(trackedPath)) {
      skippedFiles += 1;
      continue;
    }

    const absolutePath = path.resolve(workspace, trackedPath);
    const relativePath = path.relative(workspace, absolutePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new Error('Git returned a path outside the workspace. Scan aborted.');
    }

    let stat;
    try {
      stat = fs.lstatSync(absolutePath);
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        skippedFiles += 1;
        continue;
      }
      throw new Error(`Unable to inspect tracked path: ${safeDisplayPath(trackedPath)}`);
    }

    if (!stat.isFile()) {
      skippedFiles += 1;
      continue;
    }

    let buffer;
    try {
      buffer = fs.readFileSync(absolutePath);
    } catch {
      throw new Error(`Unable to read tracked file: ${safeDisplayPath(trackedPath)}`);
    }

    const text = decodeText(buffer);
    if (text === null) {
      skippedFiles += 1;
      continue;
    }

    scannedFiles += 1;
    findings.push(...scanText(safeDisplayPath(trackedPath), text));
  }

  return { findings, scannedFiles, skippedFiles };
}

function assert(condition, message) {
  if (!condition) throw new Error(`Self-test failed: ${message}`);
}

function makeToken(length, alphabet = 'Ab3Cd7Ef9Gh2Jk5Lm8Np4Qr6St1Uv0WxYz') {
  return Array.from({ length }, (_, index) => alphabet[index % alphabet.length]).join('');
}

function runSelfTest() {
  const fixtures = [
    {
      rule: 'google-api-key',
      text: `value=${['AI', 'za', makeToken(35)].join('')}`,
    },
    {
      rule: 'rapidapi-key',
      text: `${['RAPIDAPI_', 'KEY'].join('')}=${makeToken(48)}`,
    },
    {
      rule: 'rapidapi-key',
      text: `value=${makeToken(24)}${['m', 'sh'].join('')}${makeToken(20)}`,
    },
    {
      rule: 'github-token',
      text: `token=${['gh', 'p_', makeToken(36)].join('')}`,
    },
    {
      rule: 'github-token',
      text: `token=${['github_', 'pat_', makeToken(82)].join('')}`,
    },
    {
      rule: 'openai-api-key',
      text: `token=${['s', 'k-proj-', makeToken(48)].join('')}`,
    },
    {
      rule: 'aws-access-key-id',
      text: `id=${['AK', 'IA', makeToken(16, 'A1B2C3D4E5F6G7H8')].join('')}`,
    },
    {
      rule: 'private-key-pem',
      text: ['-----BE', 'GIN ENCRYPTED PRIVATE KEY-----'].join(''),
    },
  ];

  for (const fixture of fixtures) {
    const findings = scanText('mutant.txt', `safe line\nanother safe line\n${fixture.text}`);
    assert(findings.length === 1, `${fixture.rule} fixture must produce exactly one finding`);
    assert(findings[0].rule === fixture.rule, `${fixture.rule} fixture must map to its rule`);
    assert(findings[0].line === 3, `${fixture.rule} fixture must preserve line numbers`);
    assert(Object.keys(findings[0]).sort().join(',') === 'file,line,rule', `${fixture.rule} finding must not retain secret data`);
  }

  const safeAwsExample = ['AKIAIOS', 'FODNN7EXAMPLE'].join('');
  const safeFixture = [
    'GOOGLE_API_KEY=AIzaYOUR_KEY_HERE',
    'RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY_HERE',
    'GITHUB_TOKEN=ghp_your_token_here',
    'OPENAI_API_KEY=sk-your-key-here',
    `AWS_ACCESS_KEY_ID=${safeAwsExample}`,
    'private_key=process.env.PRIVATE_KEY',
    '-----BEGIN PUBLIC KEY-----',
  ].join('\n');
  assert(scanText('safe.txt', safeFixture).length === 0, 'harmless placeholders must not be detected');
  const verifierSource = fs.readFileSync(__filename, 'utf8');
  assert(scanText('verify-tracked-secrets.js', verifierSource).length === 0, 'verifier source must remain safe when it becomes tracked');

  assert(decodeText(Buffer.from([0x00, 0x01, 0x02, 0x03])) === null, 'binary data must be skipped');
  assert(isExcludedPath('.claude/settings.json'), '.claude paths must be excluded');
  assert(isExcludedPath('.claude.json'), '.claude wildcard paths must be excluded');
  assert(isExcludedPath('vendor/node_modules/package/file.js'), 'node_modules paths must be excluded');
  assert(isExcludedPath('logs/runtime.txt'), 'logs paths must be excluded');
  assert(isExcludedPath('.codex-artifacts/report.json'), 'artifact paths must be excluded');
  assert(!isExcludedPath('scripts/verify-tracked-secrets.js'), 'ordinary tracked paths must remain in scope');

  assert(parseArgs([]).selfTest === false, 'empty arguments must select tree scan');
  assert(parseArgs(['--self-test']).selfTest === true, 'self-test flag must select self-test');
  for (const invalidArgs of [['--unknown'], ['--self-test', '--self-test'], ['--self-test', '--unknown']]) {
    let rejected = false;
    try {
      parseArgs(invalidArgs);
    } catch {
      rejected = true;
    }
    assert(rejected, 'unknown, duplicate, and mixed arguments must be rejected');
  }

  console.log(`Tracked secret verifier self-test passed (${fixtures.length} mutant fixtures, 1 safe fixture).`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) {
    runSelfTest();
    return;
  }

  const result = scanTrackedTree();
  if (result.findings.length > 0) {
    for (const finding of result.findings) {
      console.log(`${finding.file}:${finding.line}:${finding.rule}`);
    }
    console.error(`Tracked secret scan failed (${result.findings.length} finding(s)).`);
    process.exitCode = 1;
    return;
  }

  console.log(`Tracked secret scan passed (${result.scannedFiles} text files scanned, ${result.skippedFiles} paths safely skipped).`);
}

try {
  main();
} catch (error) {
  console.error(error && error.message ? error.message : 'Tracked secret verifier failed.');
  process.exitCode = 1;
}
