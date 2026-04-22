#!/usr/bin/env bash
# quality-gate.sh — Pre-deploy quality gate for DopaBrain apps
# Usage: ./scripts/quality-gate.sh <app-dir>
# Example: ./scripts/quality-gate.sh projects/mbti-city

set -euo pipefail

APP_DIR="${1:?Usage: quality-gate.sh <app-dir>}"
FAIL=0
WARN=0

red()    { printf "\033[31m✗ %s\033[0m\n" "$*"; }
green()  { printf "\033[32m✓ %s\033[0m\n" "$*"; }
yellow() { printf "\033[33m⚠ %s\033[0m\n" "$*"; }

if [ ! -d "$APP_DIR" ]; then
  red "Directory not found: $APP_DIR"
  exit 1
fi

echo "=== Quality Gate: $APP_DIR ==="
echo ""

# 1. index.html exists
if [ -f "$APP_DIR/index.html" ]; then
  green "index.html exists"
else
  red "index.html missing"
  FAIL=$((FAIL+1))
fi

# 2. .gitattributes (LF enforcement)
if [ -f "$APP_DIR/.gitattributes" ]; then
  green ".gitattributes exists"
else
  red ".gitattributes missing (LF enforcement)"
  FAIL=$((FAIL+1))
fi

# 3. i18n: check 12 locale files
LANGS="ko en zh hi ru ja es pt id tr de fr"
LOCALE_DIR="$APP_DIR/js/locales"
MISSING_LANGS=""
if [ -d "$LOCALE_DIR" ]; then
  for lang in $LANGS; do
    if [ ! -f "$LOCALE_DIR/$lang.json" ]; then
      MISSING_LANGS="$MISSING_LANGS $lang"
    fi
  done
  if [ -z "$MISSING_LANGS" ]; then
    green "i18n: all 12 locales present"
  else
    red "i18n: missing locales:$MISSING_LANGS"
    FAIL=$((FAIL+1))
  fi
else
  red "i18n: js/locales/ directory missing"
  FAIL=$((FAIL+1))
fi

# 4. i18n.js has try-catch (IIFE pattern)
if [ -f "$APP_DIR/js/i18n.js" ]; then
  if grep -q "try" "$APP_DIR/js/i18n.js" 2>/dev/null; then
    green "i18n.js has try-catch"
  else
    red "i18n.js missing try-catch wrapper"
    FAIL=$((FAIL+1))
  fi
else
  red "i18n.js not found"
  FAIL=$((FAIL+1))
fi

# 5. GA4 tag present
if [ -f "$APP_DIR/index.html" ]; then
  if grep -q "G-J8GSWM40TV" "$APP_DIR/index.html" 2>/dev/null; then
    green "GA4 tag present"
  else
    red "GA4 tag (G-J8GSWM40TV) missing"
    FAIL=$((FAIL+1))
  fi
fi

# 6. AdSense tag present
if [ -f "$APP_DIR/index.html" ]; then
  if grep -q "ca-pub-3600813755953882" "$APP_DIR/index.html" 2>/dev/null; then
    green "AdSense tag present"
  else
    red "AdSense tag missing"
    FAIL=$((FAIL+1))
  fi
fi

# 7. Cross-promo script
if [ -f "$APP_DIR/index.html" ]; then
  if grep -q "cross-promo.js" "$APP_DIR/index.html" 2>/dev/null; then
    green "Cross-promo script present"
  else
    yellow "Cross-promo script missing (optional)"
    WARN=$((WARN+1))
  fi
fi

# 8. App-loader div
if [ -f "$APP_DIR/index.html" ]; then
  if grep -q "app-loader\|appLoader" "$APP_DIR/index.html" 2>/dev/null; then
    green "App-loader present"
  else
    red "App-loader div missing"
    FAIL=$((FAIL+1))
  fi
fi

# 9. Skip-link (a11y)
if [ -f "$APP_DIR/index.html" ]; then
  if grep -q "skip-link\|skip-to\|skipTo" "$APP_DIR/index.html" 2>/dev/null; then
    green "Skip-link (a11y) present"
  else
    yellow "Skip-link missing (a11y)"
    WARN=$((WARN+1))
  fi
fi

# 10. JSON-LD structured data
if [ -f "$APP_DIR/index.html" ]; then
  if grep -q "application/ld+json" "$APP_DIR/index.html" 2>/dev/null; then
    green "JSON-LD structured data present"
  else
    red "JSON-LD structured data missing"
    FAIL=$((FAIL+1))
  fi
fi

# 11. manifest.json (PWA)
if [ -f "$APP_DIR/manifest.json" ]; then
  green "manifest.json present"
else
  yellow "manifest.json missing (PWA)"
  WARN=$((WARN+1))
fi

# 12. Service worker
if [ -f "$APP_DIR/sw.js" ]; then
  green "sw.js present"
else
  yellow "sw.js missing (PWA)"
  WARN=$((WARN+1))
fi

# 13. Validate JSON locale files (syntax check)
JSON_ERRORS=""
if [ -d "$LOCALE_DIR" ]; then
  for f in "$LOCALE_DIR"/*.json; do
    if [ -f "$f" ]; then
      if ! python -c "import json; json.load(open(r'$f', encoding='utf-8'))" 2>/dev/null; then
        JSON_ERRORS="$JSON_ERRORS $(basename "$f")"
      fi
    fi
  done
  if [ -z "$JSON_ERRORS" ]; then
    green "All locale JSON files are valid"
  else
    red "Invalid JSON:$JSON_ERRORS"
    FAIL=$((FAIL+1))
  fi
fi

# 14. Check for console.log left in app.js (potential debug leftovers)
if [ -f "$APP_DIR/js/app.js" ]; then
  LOG_COUNT=$(grep -c "console\.log" "$APP_DIR/js/app.js" 2>/dev/null || true)
  LOG_COUNT=${LOG_COUNT:-0}
  LOG_COUNT=$(echo "$LOG_COUNT" | tr -d '[:space:]')
  if [ "$LOG_COUNT" -gt 3 ]; then
    yellow "app.js has $LOG_COUNT console.log calls (debug leftover?)"
    WARN=$((WARN+1))
  else
    green "app.js console.log count OK ($LOG_COUNT)"
  fi
fi

# 15. Portal hub locale audit
if [ "$APP_DIR" = "projects/portal" ]; then
  if node scripts/portal-hub-locale-audit.js >/dev/null 2>&1; then
    green "Portal hub locale audit passed"
  else
    red "Portal hub locale audit failed"
    FAIL=$((FAIL+1))
  fi
fi

# Summary
echo ""
echo "=== Results ==="
if [ "$FAIL" -eq 0 ]; then
  green "PASS — $WARN warning(s)"
  exit 0
else
  red "FAIL — $FAIL error(s), $WARN warning(s)"
  exit 1
fi
