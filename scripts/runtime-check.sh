#!/usr/bin/env bash
# Runtime smoke test wrapper for Playwright
# Usage: bash scripts/runtime-check.sh <app-name|all|games>

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  echo ""
  echo "  Usage: bash scripts/runtime-check.sh <app-name|all|games>"
  echo ""
  echo "  Arguments:"
  echo "    <app-name>   Test a single app (e.g., road-shooter)"
  echo "    all          Test all apps with index.html"
  echo "    games        Test the 20 known game directories"
  echo ""
  exit 2
fi

GAME_DIRS=(
  snake-game flappy-bird minesweeper maze-runner reaction-test
  pong-game zigzag-runner color-memory stack-tower sky-runner
  emoji-merge idle-clicker block-puzzle brick-breaker puzzle-2048
  memory-card typing-speed word-guess word-scramble road-shooter
)

echo ""
echo "============================================"
echo "  Playwright Runtime Smoke Test"
echo "============================================"

if [ "$TARGET" = "games" ]; then
  echo "  Scope: 20 game directories"
elif [ "$TARGET" = "all" ]; then
  count=$(ls -d "$ROOT_DIR/projects"/*/index.html 2>/dev/null | wc -l)
  echo "  Scope: all apps (~$count)"
else
  echo "  Scope: $TARGET"
fi

echo "============================================"
echo ""

# Run the Node.js Playwright script
node "$SCRIPT_DIR/runtime-check.js" "$TARGET"
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "  All tests passed!"
elif [ $EXIT_CODE -eq 1 ]; then
  echo "  Some tests FAILED. Check output above."
else
  echo "  Script error (exit code $EXIT_CODE)."
fi

echo ""
exit $EXIT_CODE
