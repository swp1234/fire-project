#!/usr/bin/env bash
# maintenance-sweep.sh — Autonomous maintenance sweep across all submodules
# Usage: ./scripts/maintenance-sweep.sh [--fix] [--report]
# --fix: auto-fix common issues (dirty repos, missing .gitattributes)
# --report: save markdown report to MAINTENANCE_REPORT.md

set -uo pipefail

FIX_MODE=""
REPORT_MODE=""
for arg in "$@"; do
  case "$arg" in
    --fix) FIX_MODE="true" ;;
    --report) REPORT_MODE="true" ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_DIR="$ROOT_DIR/projects"
REPORT_FILE="$ROOT_DIR/MAINTENANCE_REPORT.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# Counters
TOTAL=0
CLEAN=0
DIRTY=0
ADSENSE_MISSING=0
GA4_MISSING=0
TITLE_LONG=0
DESC_LONG=0
DARK_MODE_MISSING=0
CROSS_PROMO_MISSING=0
JSONLD_MISSING=0
FIXED_COUNT=0
ERRORS=""

# Report header
REPORT="# Maintenance Sweep Report\n"
REPORT+="> Generated: $TIMESTAMP\n\n"
REPORT+="| App | Git | AdSense | GA4 | Title | Desc | Dark Mode | Cross-Promo | JSON-LD | Issues |\n"
REPORT+="|-----|-----|---------|-----|-------|------|-----------|-------------|---------|--------|\n"

echo "=== Maintenance Sweep: $(date '+%Y-%m-%d %H:%M') ==="
echo ""

for APP_DIR in "$PROJECTS_DIR"/*/; do
  APP_NAME=$(basename "$APP_DIR")

  # Skip non-app directories
  if [ "$APP_NAME" = "_common" ] || [ "$APP_NAME" = "portal" ] || [ "$APP_NAME" = "root-domain" ]; then
    continue
  fi

  # Skip if not a git repo
  if [ ! -d "$APP_DIR/.git" ] && [ ! -f "$APP_DIR/.git" ]; then
    continue
  fi

  TOTAL=$((TOTAL+1))
  INDEX="$APP_DIR/index.html"
  ISSUES=""
  GIT_STATUS=""
  ADSENSE_OK=""
  GA4_OK=""
  TITLE_OK=""
  DESC_OK=""
  DARK_OK=""
  PROMO_OK=""
  JSONLD_OK=""

  # --- Git status ---
  cd "$APP_DIR"
  if git diff --quiet HEAD 2>/dev/null && git diff --cached --quiet HEAD 2>/dev/null; then
    GIT_STATUS="clean"
    CLEAN=$((CLEAN+1))
  else
    DIRTY=$((DIRTY+1))
    CHANGED=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
    GIT_STATUS="dirty($CHANGED)"
    ISSUES="$ISSUES dirty;"

    if [ "$FIX_MODE" = "true" ]; then
      BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
      git add -A 2>/dev/null
      git commit -m "chore: maintenance sweep auto-commit" 2>/dev/null
      if git push origin "$BRANCH" 2>/dev/null; then
        GIT_STATUS="fixed"
        FIXED_COUNT=$((FIXED_COUNT+1))
        ISSUES="$ISSUES auto-committed;"
      else
        ISSUES="$ISSUES push-failed;"
      fi
    fi
  fi
  cd "$ROOT_DIR"

  # --- AdSense ---
  if [ -f "$INDEX" ] && grep -q "ca-pub-3600813755953882" "$INDEX" 2>/dev/null; then
    ADSENSE_OK="ok"
  else
    ADSENSE_OK="MISSING"
    ADSENSE_MISSING=$((ADSENSE_MISSING+1))
    ISSUES="$ISSUES no-adsense;"
  fi

  # --- GA4 ---
  if [ -f "$INDEX" ] && grep -q "G-J8GSWM40TV" "$INDEX" 2>/dev/null; then
    GA4_OK="ok"
  else
    GA4_OK="MISSING"
    GA4_MISSING=$((GA4_MISSING+1))
    ISSUES="$ISSUES no-ga4;"
  fi

  # --- Title length ---
  if [ -f "$INDEX" ]; then
    TITLE=$(grep -oP '(?<=<title[^>]*>)[^<]+' "$INDEX" 2>/dev/null | head -1)
    TITLE_LEN=${#TITLE}
    if [ "$TITLE_LEN" -le 60 ] || [ "$TITLE_LEN" -eq 0 ]; then
      TITLE_OK="ok(${TITLE_LEN})"
    else
      TITLE_OK="LONG(${TITLE_LEN})"
      TITLE_LONG=$((TITLE_LONG+1))
      ISSUES="$ISSUES title-long;"
    fi
  fi

  # --- Description length ---
  if [ -f "$INDEX" ]; then
    DESC=$(grep -oP 'name="description"\s+content="[^"]*"' "$INDEX" 2>/dev/null | head -1 | sed 's/.*content="//;s/"//')
    DESC_LEN=${#DESC}
    if [ "$DESC_LEN" -le 160 ] || [ "$DESC_LEN" -eq 0 ]; then
      DESC_OK="ok(${DESC_LEN})"
    else
      DESC_OK="LONG(${DESC_LEN})"
      DESC_LONG=$((DESC_LONG+1))
      ISSUES="$ISSUES desc-long;"
    fi
  fi

  # --- Dark mode CSS ---
  if [ -f "$APP_DIR/css/style.css" ]; then
    if grep -q 'data-theme.*light\|prefers-color-scheme.*light' "$APP_DIR/css/style.css" 2>/dev/null; then
      DARK_OK="ok"
    else
      DARK_OK="MISSING"
      DARK_MODE_MISSING=$((DARK_MODE_MISSING+1))
      ISSUES="$ISSUES no-lightmode;"
    fi
  else
    DARK_OK="n/a"
  fi

  # --- Cross-promo ---
  if [ -f "$INDEX" ] && grep -q "cross-promo.js" "$INDEX" 2>/dev/null; then
    PROMO_OK="ok"
  else
    PROMO_OK="MISSING"
    CROSS_PROMO_MISSING=$((CROSS_PROMO_MISSING+1))
    ISSUES="$ISSUES no-crosspromo;"
  fi

  # --- JSON-LD ---
  if [ -f "$INDEX" ]; then
    SCHEMAS=$(grep -c "application/ld+json" "$INDEX" 2>/dev/null || echo 0)
    if [ "$SCHEMAS" -ge 2 ]; then
      JSONLD_OK="ok(${SCHEMAS})"
    else
      JSONLD_OK="LOW(${SCHEMAS})"
      JSONLD_MISSING=$((JSONLD_MISSING+1))
      ISSUES="$ISSUES low-jsonld;"
    fi
  fi

  # Clean up issues string
  ISSUES=$(echo "$ISSUES" | sed 's/^ *//;s/ *$//')
  if [ -z "$ISSUES" ]; then
    ISSUES="-"
  fi

  # Add to report
  REPORT+="| $APP_NAME | $GIT_STATUS | $ADSENSE_OK | $GA4_OK | $TITLE_OK | $DESC_OK | $DARK_OK | $PROMO_OK | $JSONLD_OK | $ISSUES |\n"

  # Progress indicator
  printf "."
done

echo ""
echo ""

# Summary
echo "=== Summary ==="
echo "  Total apps scanned: $TOTAL"
echo "  Git clean: $CLEAN"
echo "  Git dirty: $DIRTY"
echo "  AdSense missing: $ADSENSE_MISSING"
echo "  GA4 missing: $GA4_MISSING"
echo "  Title too long: $TITLE_LONG"
echo "  Description too long: $DESC_LONG"
echo "  Light mode missing: $DARK_MODE_MISSING"
echo "  Cross-promo missing: $CROSS_PROMO_MISSING"
echo "  JSON-LD insufficient: $JSONLD_MISSING"
if [ "$FIX_MODE" = "true" ]; then
  echo "  Auto-fixed: $FIXED_COUNT"
fi

# Summary to report
REPORT+="\n## Summary\n"
REPORT+="- **Total apps:** $TOTAL\n"
REPORT+="- **Git clean:** $CLEAN / $TOTAL\n"
REPORT+="- **Git dirty:** $DIRTY\n"
REPORT+="- **AdSense missing:** $ADSENSE_MISSING\n"
REPORT+="- **GA4 missing:** $GA4_MISSING\n"
REPORT+="- **Title too long (>60):** $TITLE_LONG\n"
REPORT+="- **Description too long (>160):** $DESC_LONG\n"
REPORT+="- **Light mode missing:** $DARK_MODE_MISSING\n"
REPORT+="- **Cross-promo missing:** $CROSS_PROMO_MISSING\n"
REPORT+="- **JSON-LD insufficient (<2):** $JSONLD_MISSING\n"

if [ "$FIX_MODE" = "true" ]; then
  REPORT+="- **Auto-fixed:** $FIXED_COUNT\n"
fi

# Save report
if [ "$REPORT_MODE" = "true" ]; then
  printf "$REPORT" > "$REPORT_FILE"
  echo ""
  echo "Report saved to: $REPORT_FILE"
fi

# Exit code
ISSUES_TOTAL=$((DIRTY+ADSENSE_MISSING+GA4_MISSING+TITLE_LONG+DESC_LONG))
if [ "$ISSUES_TOTAL" -eq 0 ]; then
  echo ""
  printf "\033[32m ALL CLEAN \033[0m\n"
  exit 0
else
  echo ""
  printf "\033[33m $ISSUES_TOTAL issue(s) found \033[0m\n"
  exit 1
fi
