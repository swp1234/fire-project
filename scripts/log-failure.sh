#!/usr/bin/env bash
# Log agent/tool failures to JSONL for pattern analysis
# Usage: bash scripts/log-failure.sh <agent> <app> <category> <description>
#
# Categories: build | deploy | test | mcp | edit | hook | other
#
# Examples:
#   bash scripts/log-failure.sh builder snake-game build "i18n locale missing: hi.json"
#   bash scripts/log-failure.sh main "" mcp "GA4 timeout after 30s"
#   bash scripts/log-failure.sh redesigner dark-core edit "parallel Edit cascade failure"

AGENT="${1:?Usage: log-failure.sh <agent> <app> <category> <description>}"
APP="${2:-unknown}"
CATEGORY="${3:-other}"
DESC="${4:?Description required}"

LOG_FILE="C:/Users/박상우/.claude/projects/E--Fire-Project/memory/failures.jsonl"
TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Escape quotes in description for valid JSON
DESC_ESCAPED="$(echo "$DESC" | sed 's/"/\\"/g')"

echo "{\"ts\":\"$TIMESTAMP\",\"agent\":\"$AGENT\",\"app\":\"$APP\",\"category\":\"$CATEGORY\",\"error\":\"$DESC_ESCAPED\",\"resolved\":false}" >> "$LOG_FILE"

echo "[logged] $CATEGORY failure in $APP by $AGENT"
