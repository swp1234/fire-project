#!/bin/bash
# Sitemap auto-updater for dopabrain.com
# Usage: bash _common/update-sitemap.sh [new-app-slug]
# If no slug provided, regenerates full sitemap from projects/

set -e
SITEMAP="projects/portal/sitemap.xml"
DOMAIN="https://dopabrain.com"
TODAY=$(date +%Y-%m-%d)

# If specific app slug provided, just append it
if [ -n "$1" ]; then
  SLUG="$1"
  # Check if already in sitemap
  if grep -q "/${SLUG}/" "$SITEMAP" 2>/dev/null; then
    echo "Already in sitemap: $SLUG"
    exit 0
  fi
  # Insert before closing </urlset>
  sed -i "s|</urlset>|  <url>\n    <loc>${DOMAIN}/${SLUG}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>|" "$SITEMAP"
  echo "Added to sitemap: $SLUG"
  exit 0
fi

# Full audit: check for missing apps
echo "=== Sitemap Audit ==="
MISSING=0
for d in projects/*/; do
  APP=$(basename "$d")
  # Skip non-app directories
  [[ "$APP" == "_common" || "$APP" == "portal" || "$APP" == "root-domain" ]] && continue
  # Skip if no index.html
  [ ! -f "$d/index.html" ] && continue

  if ! grep -q "/${APP}/" "$SITEMAP" 2>/dev/null; then
    echo "MISSING: $APP"
    MISSING=$((MISSING + 1))
    # Auto-add
    sed -i "s|</urlset>|  <url>\n    <loc>${DOMAIN}/${APP}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>|" "$SITEMAP"
  fi
done

if [ "$MISSING" -eq 0 ]; then
  echo "All apps present in sitemap."
else
  echo "Added $MISSING missing apps to sitemap."
fi

# Count
TOTAL=$(grep -c '<url>' "$SITEMAP")
echo "Total URLs in sitemap: $TOTAL"
