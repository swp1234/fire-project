#!/usr/bin/env bash
# Install shared git hooks across all project submodules
# Usage: bash scripts/install-hooks.sh

ROOT_DIR="E:/Fire Project"
HOOKS_DIR="$ROOT_DIR/.githooks"
COUNT=0
SKIP=0

echo "Installing shared hooks from $HOOKS_DIR"
echo ""

for dir in "$ROOT_DIR"/projects/*/; do
  app="$(basename "$dir")"

  # Skip non-git dirs
  if [ ! -d "$dir/.git" ] && [ ! -f "$dir/.git" ]; then
    SKIP=$((SKIP+1))
    continue
  fi

  git -C "$dir" config core.hooksPath "$HOOKS_DIR" 2>/dev/null
  COUNT=$((COUNT+1))
done

echo "Installed: $COUNT submodules"
echo "Skipped:   $SKIP (no .git)"
echo ""
echo "Hook: pre-push → quality-gate.sh (blocks push on FAIL)"
