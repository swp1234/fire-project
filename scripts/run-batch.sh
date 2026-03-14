#!/bin/bash
# Headless batch runner for Claude Code autonomous sessions
# Usage: bash scripts/run-batch.sh "<task description>"
# Example: bash scripts/run-batch.sh "SEO upgrade all test apps missing FAQPage"

set -e

TASK="${1:-}"
if [ -z "$TASK" ]; then
  echo "Usage: bash scripts/run-batch.sh \"<task description>\""
  echo ""
  echo "Examples:"
  echo "  bash scripts/run-batch.sh \"add FAQPage schema to all test apps\""
  echo "  bash scripts/run-batch.sh \"fix bounce rate for top 5 apps\""
  echo "  bash scripts/run-batch.sh \"create 12-lang blogs for ai-personality\""
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_DIR="E:/Fire Project/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/batch-$TIMESTAMP.log"

echo "=== Batch Run: $TIMESTAMP ===" | tee "$LOG_FILE"
echo "Task: $TASK" | tee -a "$LOG_FILE"
echo "Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "---" | tee -a "$LOG_FILE"

# Run Claude in headless mode with the task
claude -p "You are running a batch task autonomously. Follow CLAUDE.md rules strictly.

Task: $TASK

Process:
1. Identify all target apps/files
2. Skip already-done items
3. Process in batches of 4-6 using parallel agents (mode: dontAsk)
4. Commit & push each app after changes
5. Run live-check on modified apps
6. Update root submodule refs
7. Print summary table

Rules:
- Max 5 concurrent agents
- Read before edit
- No GA4/GSC queries
- Log failures with: bash scripts/log-failure.sh
" --allowedTools "Read,Edit,Write,Bash,Glob,Grep,Agent,Task,TaskOutput" 2>&1 | tee -a "$LOG_FILE"

echo "" | tee -a "$LOG_FILE"
echo "=== Batch Complete: $(date +%Y%m%d-%H%M%S) ===" | tee -a "$LOG_FILE"
