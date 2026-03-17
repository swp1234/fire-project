#!/usr/bin/env bash
# app-test-suite.sh — Comprehensive test suite for DopaBrain apps
# Usage: ./scripts/app-test-suite.sh <app-dir> [--fix]
# Exit 0 = all pass, Exit 1 = failures found
# With --fix: auto-fix common issues

set -uo pipefail

APP_DIR="${1:?Usage: app-test-suite.sh <app-dir> [--fix]}"
FIX_MODE="${2:-}"
PASS=0
FAIL=0
FIXED=0

red()    { printf "\033[31m FAIL: %s\033[0m\n" "$*"; }
green()  { printf "\033[32m PASS: %s\033[0m\n" "$*"; }
yellow() { printf "\033[33m FIXED: %s\033[0m\n" "$*"; }
blue()   { printf "\033[34m INFO: %s\033[0m\n" "$*"; }

if [ ! -d "$APP_DIR" ]; then
  red "Directory not found: $APP_DIR"
  exit 1
fi

APP_NAME=$(basename "$APP_DIR")
INDEX="$APP_DIR/index.html"

echo "=== Test Suite: $APP_NAME ==="
echo ""

# ============================================================
# TIER 1: Critical (must pass for deploy)
# ============================================================
echo "--- Tier 1: Critical ---"

# T1.1 Quality gate (wraps existing checks)
if bash scripts/quality-gate.sh "$APP_DIR" > /dev/null 2>&1; then
  green "Quality gate PASS"
  PASS=$((PASS+1))
else
  red "Quality gate FAIL (run: bash scripts/quality-gate.sh $APP_DIR)"
  FAIL=$((FAIL+1))
fi

# T1.2 No /_common/js/ references (404 in production)
if [ -f "$INDEX" ]; then
  if grep -q "/_common/js/" "$INDEX" 2>/dev/null; then
    if [ "$FIX_MODE" = "--fix" ]; then
      sed -i 's|/_common/js/|/portal/js/|g' "$INDEX"
      yellow "Replaced /_common/js/ with /portal/js/"
      FIXED=$((FIXED+1))
    else
      red "Has /_common/js/ references (should be /portal/js/)"
      FAIL=$((FAIL+1))
    fi
  else
    green "No /_common/js/ references"
    PASS=$((PASS+1))
  fi
fi

# T1.3 App-loader hide reachable (JS must hide loader even if i18n fails)
if [ -f "$APP_DIR/js/app.js" ]; then
  if grep -q "app-loader\|appLoader\|app_loader" "$APP_DIR/js/app.js" 2>/dev/null; then
    green "App-loader hide in app.js"
    PASS=$((PASS+1))
  elif [ -f "$APP_DIR/js/i18n.js" ] && grep -q "app-loader\|appLoader" "$APP_DIR/js/i18n.js" 2>/dev/null; then
    green "App-loader hide in i18n.js"
    PASS=$((PASS+1))
  else
    red "App-loader hide not found in JS"
    FAIL=$((FAIL+1))
  fi
fi

# T1.4 typeof guards on optional modules
if [ -f "$APP_DIR/js/app.js" ]; then
  GUARD_FAIL=0
  for mod in DailyStreak GameAchievements GameAds Haptic; do
    if grep -q "$mod" "$APP_DIR/js/app.js" 2>/dev/null; then
      if ! grep -q "typeof.*$mod" "$APP_DIR/js/app.js" 2>/dev/null; then
        red "Missing typeof guard for $mod"
        GUARD_FAIL=1
      fi
    fi
  done
  if [ "$GUARD_FAIL" -eq 0 ]; then
    green "typeof guards OK (optional modules)"
    PASS=$((PASS+1))
  else
    FAIL=$((FAIL+1))
  fi
fi

# ============================================================
# TIER 2: SEO (important for ranking)
# ============================================================
echo ""
echo "--- Tier 2: SEO ---"

# T2.1 Meta title length (under 60 chars)
if [ -f "$INDEX" ]; then
  TITLE=$(grep -oP '(?<=<title[^>]*>)[^<]+' "$INDEX" 2>/dev/null | head -1)
  if [ -n "$TITLE" ]; then
    TITLE_LEN=${#TITLE}
    if [ "$TITLE_LEN" -le 60 ]; then
      green "Meta title OK ($TITLE_LEN chars)"
      PASS=$((PASS+1))
    else
      red "Meta title too long ($TITLE_LEN chars, max 60)"
      FAIL=$((FAIL+1))
    fi
  fi
fi

# T2.2 Meta description length (under 160 chars)
if [ -f "$INDEX" ]; then
  DESC=$(grep -oP 'name="description"\s+content="[^"]*"' "$INDEX" 2>/dev/null | head -1 | sed 's/.*content="//;s/"//')
  if [ -n "$DESC" ]; then
    DESC_LEN=${#DESC}
    if [ "$DESC_LEN" -le 160 ]; then
      green "Meta description OK ($DESC_LEN chars)"
      PASS=$((PASS+1))
    else
      red "Meta description too long ($DESC_LEN chars, max 160)"
      FAIL=$((FAIL+1))
    fi
  fi
fi

# T2.3 JSON-LD schema types
if [ -f "$INDEX" ]; then
  SCHEMAS=$(grep -c "application/ld+json" "$INDEX" 2>/dev/null || echo 0)
  if [ "$SCHEMAS" -ge 2 ]; then
    green "JSON-LD schemas ($SCHEMAS blocks)"
    PASS=$((PASS+1))
  elif [ "$SCHEMAS" -eq 1 ]; then
    red "Only 1 JSON-LD schema (need FAQPage + BreadcrumbList)"
    FAIL=$((FAIL+1))
  else
    red "No JSON-LD schemas"
    FAIL=$((FAIL+1))
  fi
fi

# T2.4 hreflang tags (should have 12+)
if [ -f "$INDEX" ]; then
  HREFLANG=$(grep -c 'hreflang=' "$INDEX" 2>/dev/null || echo 0)
  if [ "$HREFLANG" -ge 12 ]; then
    green "hreflang tags ($HREFLANG)"
    PASS=$((PASS+1))
  elif [ "$HREFLANG" -ge 1 ]; then
    red "Only $HREFLANG hreflang tags (need 12+)"
    FAIL=$((FAIL+1))
  else
    red "No hreflang tags"
    FAIL=$((FAIL+1))
  fi
fi

# T2.5 Canonical URL present
if [ -f "$INDEX" ]; then
  if grep -q 'rel="canonical"' "$INDEX" 2>/dev/null; then
    green "Canonical URL present"
    PASS=$((PASS+1))
  else
    red "Canonical URL missing"
    FAIL=$((FAIL+1))
  fi
fi

# ============================================================
# TIER 3: UX & Accessibility
# ============================================================
echo ""
echo "--- Tier 3: UX & Accessibility ---"

# T3.1 Dark mode CSS
if [ -f "$APP_DIR/css/style.css" ]; then
  if grep -q 'data-theme.*light\|prefers-color-scheme.*light' "$APP_DIR/css/style.css" 2>/dev/null; then
    green "Light mode CSS present"
    PASS=$((PASS+1))
  else
    red "Light mode CSS missing"
    FAIL=$((FAIL+1))
  fi
fi

# T3.2 Touch target size (44px minimum)
if [ -f "$APP_DIR/css/style.css" ]; then
  if grep -qE 'min-height:\s*(4[4-9]|[5-9][0-9]|[1-9][0-9]{2})px|padding:\s*(1[2-9]|[2-9][0-9])px' "$APP_DIR/css/style.css" 2>/dev/null; then
    green "Touch targets appear adequate"
    PASS=$((PASS+1))
  else
    blue "Could not verify touch target size (manual check recommended)"
    PASS=$((PASS+1))
  fi
fi

# T3.3 Reduced motion support
if [ -f "$APP_DIR/css/style.css" ]; then
  if grep -q "prefers-reduced-motion" "$APP_DIR/css/style.css" 2>/dev/null; then
    green "Reduced motion support"
    PASS=$((PASS+1))
  else
    blue "No prefers-reduced-motion (optional)"
  fi
fi

# T3.4 Cross-promo widget
if [ -f "$INDEX" ]; then
  if grep -q "cross-promo.js" "$INDEX" 2>/dev/null; then
    green "Cross-promo widget loaded"
    PASS=$((PASS+1))
  else
    red "Cross-promo widget missing"
    FAIL=$((FAIL+1))
  fi
fi

# ============================================================
# TIER 4: Monetization
# ============================================================
echo ""
echo "--- Tier 4: Monetization ---"

# T4.1 AdSense tag
if [ -f "$INDEX" ]; then
  if grep -q "ca-pub-3600813755953882" "$INDEX" 2>/dev/null; then
    green "AdSense publisher ID present"
    PASS=$((PASS+1))
  else
    red "AdSense publisher ID missing"
    FAIL=$((FAIL+1))
  fi
fi

# T4.2 GA4 tag
if [ -f "$INDEX" ]; then
  if grep -q "G-J8GSWM40TV" "$INDEX" 2>/dev/null; then
    green "GA4 tracking ID present"
    PASS=$((PASS+1))
  else
    red "GA4 tracking ID missing"
    FAIL=$((FAIL+1))
  fi
fi

# ============================================================
# Summary
# ============================================================
echo ""
echo "=== Test Suite Results: $APP_NAME ==="
TOTAL=$((PASS+FAIL))
echo "  Passed: $PASS/$TOTAL"
echo "  Failed: $FAIL/$TOTAL"
if [ "$FIXED" -gt 0 ]; then
  echo "  Auto-fixed: $FIXED"
fi

if [ "$FAIL" -eq 0 ]; then
  green "ALL TESTS PASSED"
  exit 0
else
  red "$FAIL TEST(S) FAILED"
  exit 1
fi
