#!/usr/bin/env node
/**
 * OG Image Generator for dopabrain.com apps
 * Generates SVG-based OG images (1200x630) with app branding
 *
 * Usage: node _common/generate-og-image.js <app-slug> <title> <primary-color> [emoji]
 * Example: node _common/generate-og-image.js eq-test "EQ Test" "#00bcd4" "🧠"
 */

const fs = require('fs');
const path = require('path');

const [,, slug, title, color, emoji = '🎯'] = process.argv;

if (!slug || !title || !color) {
  console.log('Usage: node generate-og-image.js <slug> <title> <color> [emoji]');
  process.exit(1);
}

const appDir = path.join(__dirname, '..', 'projects', slug);
if (!fs.existsSync(appDir)) {
  console.error(`Directory not found: ${appDir}`);
  process.exit(1);
}

// Generate SVG OG image
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a"/>
      <stop offset="50%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0a0a1a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.3"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="900" cy="200" r="150" fill="${color}" opacity="0.08" filter="url(#glow)"/>
  <circle cx="200" cy="500" r="100" fill="${color}" opacity="0.05" filter="url(#glow)"/>

  <!-- Accent line -->
  <rect x="80" y="520" width="200" height="4" rx="2" fill="url(#accent)"/>

  <!-- Emoji -->
  <text x="600" y="240" text-anchor="middle" font-size="120">${emoji}</text>

  <!-- Title -->
  <text x="600" y="370" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="56" font-weight="700" fill="white">${title}</text>

  <!-- Brand -->
  <text x="600" y="430" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" fill="${color}" opacity="0.9">dopabrain.com</text>

  <!-- Bottom bar -->
  <rect x="0" y="620" width="1200" height="10" fill="${color}" opacity="0.6"/>
</svg>`;

const outPath = path.join(appDir, 'og-image.svg');
fs.writeFileSync(outPath, svg, 'utf8');
console.log(`Generated: ${outPath}`);

// Also check if index.html has og:image pointing to this file
const indexPath = path.join(appDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  const ogUrl = `https://dopabrain.com/${slug}/og-image.svg`;

  if (!html.includes('og:image') || !html.includes(ogUrl)) {
    console.log(`Note: Update og:image in index.html to: ${ogUrl}`);
  }
}
