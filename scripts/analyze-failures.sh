#!/usr/bin/env bash
# Analyze failure logs for recurring patterns
# Usage: bash scripts/analyze-failures.sh [days]
# Default: last 7 days

DAYS="${1:-7}"
LOG_FILE="C:/Users/박상우/.claude/projects/E--Fire-Project/memory/failures.jsonl"

if [ ! -f "$LOG_FILE" ]; then
  echo "No failures logged yet."
  exit 0
fi

TOTAL=$(wc -l < "$LOG_FILE")
CUTOFF=$(date -u -d "$DAYS days ago" +%Y-%m-%d 2>/dev/null || date -u -v-${DAYS}d +%Y-%m-%d 2>/dev/null || echo "2000-01-01")
RECENT=$(grep -c "\"ts\":\"$CUTOFF\|\"ts\":\"$(date -u +%Y-%m-%d)" "$LOG_FILE" 2>/dev/null || echo "0")

echo "=== Failure Analysis ==="
echo "Total entries: $TOTAL"
echo "Period: last $DAYS days"
echo ""

echo "--- By Category ---"
grep -oP '"category":"[^"]*"' "$LOG_FILE" | sort | uniq -c | sort -rn
echo ""

echo "--- By Agent ---"
grep -oP '"agent":"[^"]*"' "$LOG_FILE" | sort | uniq -c | sort -rn
echo ""

echo "--- By App (top 10) ---"
grep -oP '"app":"[^"]*"' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10
echo ""

echo "--- Unresolved ---"
grep '"resolved":false' "$LOG_FILE" | wc -l
echo ""

echo "--- Recent Errors (last $DAYS days) ---"
# Show last 10 entries
tail -10 "$LOG_FILE" | while IFS= read -r line; do
  ts=$(echo "$line" | grep -oP '"ts":"[^"]*"' | cut -d'"' -f4)
  agent=$(echo "$line" | grep -oP '"agent":"[^"]*"' | cut -d'"' -f4)
  app=$(echo "$line" | grep -oP '"app":"[^"]*"' | cut -d'"' -f4)
  cat=$(echo "$line" | grep -oP '"category":"[^"]*"' | cut -d'"' -f4)
  err=$(echo "$line" | grep -oP '"error":"[^"]*"' | cut -d'"' -f4)
  printf "  [%s] %s/%s (%s): %s\n" "$ts" "$agent" "$app" "$cat" "$err"
done

echo ""
echo "--- Recurring Patterns (errors appearing 2+ times) ---"
grep -oP '"error":"[^"]*"' "$LOG_FILE" | sort | uniq -c | sort -rn | awk '$1 >= 2'
