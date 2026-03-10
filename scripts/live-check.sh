#!/usr/bin/env bash
# live-check.sh — Post-deploy runtime verification for DopaBrain apps
# Usage: ./scripts/live-check.sh [app-dir|all]
# Example: ./scripts/live-check.sh projects/stack-tower
#          ./scripts/live-check.sh all

set -uo pipefail

red()    { printf "\033[31m✗ %s\033[0m\n" "$*"; }
green()  { printf "\033[32m✓ %s\033[0m\n" "$*"; }
yellow() { printf "\033[33m⚠ %s\033[0m\n" "$*"; }
blue()   { printf "\033[34m→ %s\033[0m\n" "$*"; }

TOTAL_FAIL=0
TOTAL_WARN=0
TOTAL_PASS=0

check_app() {
  local APP_DIR="$1"
  local APP_NAME
  APP_NAME=$(basename "$APP_DIR")
  local FAIL=0
  local WARN=0
  local IDX="$APP_DIR/index.html"

  if [ ! -f "$IDX" ]; then
    return
  fi

  echo ""
  blue "Checking: $APP_NAME"

  # 1. Broken script references — check all src paths exist locally
  local BROKEN_SCRIPTS=""
  while IFS= read -r src; do
    # Skip external URLs, cross-promo, pwa-install (served from portal)
    case "$src" in
      http*|/portal/*) continue ;;
    esac
    # Resolve local path
    local LOCAL_PATH="$APP_DIR/$src"
    LOCAL_PATH=$(echo "$LOCAL_PATH" | sed 's|/\./|/|g')
    if [ ! -f "$LOCAL_PATH" ]; then
      BROKEN_SCRIPTS="$BROKEN_SCRIPTS $src"
    fi
  done < <(grep -oP 'src="([^"]+\.js)"' "$IDX" | sed 's/src="//;s/"//' | grep -v '^http')

  if [ -z "$BROKEN_SCRIPTS" ]; then
    green "  All local script references valid"
  else
    red "  Broken script refs:$BROKEN_SCRIPTS"
    FAIL=$((FAIL+1))
  fi

  # 2. /_common/js/ references (known 404)
  if grep -q '/_common/js/' "$IDX" 2>/dev/null; then
    red "  References /_common/js/ (404 on live site!)"
    FAIL=$((FAIL+1))
  else
    green "  No /_common/js/ references"
  fi

  # 3. Light mode CSS — check [data-theme="light"] exists if theme-toggle exists
  if grep -q 'theme-toggle\|theme_toggle' "$IDX" 2>/dev/null; then
    local CSS_FILE="$APP_DIR/css/style.css"
    if [ -f "$CSS_FILE" ]; then
      if grep -q 'data-theme.*light\|\.light-mode\|\.light-theme' "$CSS_FILE" 2>/dev/null; then
        # Check key light mode variables
        local LIGHT_TEXT
        LIGHT_TEXT=$(grep -A5 'data-theme.*light' "$CSS_FILE" | grep -o '\-\-text:[^;]*' | head -1 || true)
        if [ -n "$LIGHT_TEXT" ]; then
          # Check if text color is too light for light mode
          if echo "$LIGHT_TEXT" | grep -qiE '#[ef][ef][ef]|#fff|rgba.*255.*255.*255|transparent'; then
            red "  Light mode --text might be invisible (too light): $LIGHT_TEXT"
            FAIL=$((FAIL+1))
          else
            green "  Light mode text color OK"
          fi
        else
          yellow "  Light mode exists but --text not explicitly set"
          WARN=$((WARN+1))
        fi
      else
        red "  Has theme-toggle but NO light mode CSS rules"
        FAIL=$((FAIL+1))
      fi
    fi
  fi

  # 4. App-loader hide — check if loader hide code exists in JS or inline script
  if grep -q 'app-loader' "$IDX" 2>/dev/null; then
    local LOADER_HIDDEN=0
    for jsf in "$APP_DIR"/js/*.js; do
      [ -f "$jsf" ] || continue
      if grep -q 'app-loader\|app_loader\|appLoader' "$jsf" 2>/dev/null; then
        LOADER_HIDDEN=1
        break
      fi
    done
    # Also check inline <script> blocks in index.html for loader hide
    if [ "$LOADER_HIDDEN" -eq 0 ]; then
      if grep -q 'getElementById.*app-loader\|app-loader.*hidden\|appLoader.*hidden' "$IDX" 2>/dev/null; then
        LOADER_HIDDEN=1
      fi
    fi
    if [ "$LOADER_HIDDEN" -eq 1 ]; then
      green "  App-loader hide code found in JS"
    else
      red "  App-loader exists but NO hide code in JS!"
      FAIL=$((FAIL+1))
    fi
  fi

  # 5. typeof guards — check for bare calls to optional modules
  for jsf in "$APP_DIR"/js/*.js; do
    [ -f "$jsf" ] || continue
    local FNAME
    FNAME=$(basename "$jsf")
    for MODULE in DailyStreak GameAchievements; do
      # Find lines with Module.init( or Module.report( that are NOT guarded
      # Check: the line itself or the preceding line must have "typeof"
      local BARE_CALLS=""
      local LINE_NUMS
      LINE_NUMS=$(grep -n "${MODULE}\.\(init\|report\)" "$jsf" 2>/dev/null | grep -v "^[[:space:]]*//" | cut -d: -f1 || true)
      for LN in $LINE_NUMS; do
        # Check current line and 5 lines above for typeof guard
        local START=$((LN > 5 ? LN - 5 : 1))
        local CONTEXT
        CONTEXT=$(sed -n "${START},${LN}p" "$jsf" 2>/dev/null || true)
        if ! echo "$CONTEXT" | grep -q "typeof.*${MODULE}"; then
          BARE_CALLS="$BARE_CALLS line:$LN"
        fi
      done
      if [ -n "$BARE_CALLS" ]; then
        red "  $FNAME: bare $MODULE call without typeof guard ($BARE_CALLS)"
        FAIL=$((FAIL+1))
      fi
    done
  done

  # 6. i18n try-catch (prevent loader stuck)
  if [ -f "$APP_DIR/js/i18n.js" ]; then
    if ! grep -q 'try' "$APP_DIR/js/i18n.js" 2>/dev/null; then
      # Check if app.js has try-catch around i18n init
      local HAS_TRYCATCH=0
      for jsf in "$APP_DIR"/js/app.js "$APP_DIR"/js/game.js; do
        [ -f "$jsf" ] || continue
        if grep -q 'try.*i18n\|i18n.*try' "$jsf" 2>/dev/null; then
          HAS_TRYCATCH=1
        fi
      done
      if [ "$HAS_TRYCATCH" -eq 0 ]; then
        yellow "  i18n init may lack try-catch protection"
        WARN=$((WARN+1))
      fi
    fi
  fi

  # 7. console.log excess
  for jsf in "$APP_DIR"/js/app.js "$APP_DIR"/js/game.js; do
    [ -f "$jsf" ] || continue
    local LOG_CT
    LOG_CT=$(grep -c 'console\.log' "$jsf" 2>/dev/null || echo 0)
    LOG_CT=$(echo "$LOG_CT" | tr -d '[:space:]')
    if [ "$LOG_CT" -gt 5 ]; then
      yellow "  $(basename "$jsf") has $LOG_CT console.log calls"
      WARN=$((WARN+1))
    fi
  done

  # Summary for this app
  if [ "$FAIL" -gt 0 ]; then
    red "  FAIL ($FAIL errors, $WARN warnings)"
    TOTAL_FAIL=$((TOTAL_FAIL+1))
  elif [ "$WARN" -gt 0 ]; then
    yellow "  WARN ($WARN warnings)"
    TOTAL_WARN=$((TOTAL_WARN+1))
  else
    green "  PASS"
    TOTAL_PASS=$((TOTAL_PASS+1))
  fi
}

# Main
TARGET="${1:-all}"

if [ "$TARGET" = "all" ]; then
  echo "=== Live Check: ALL apps ==="
  for dir in projects/*/; do
    # Skip _common, portal
    case "$(basename "$dir")" in
      _common|portal) continue ;;
    esac
    check_app "$dir"
  done
else
  echo "=== Live Check: $TARGET ==="
  check_app "$TARGET"
fi

echo ""
echo "========================================="
echo "  PASS: $TOTAL_PASS  |  WARN: $TOTAL_WARN  |  FAIL: $TOTAL_FAIL"
echo "========================================="

if [ "$TOTAL_FAIL" -gt 0 ]; then
  exit 1
fi
