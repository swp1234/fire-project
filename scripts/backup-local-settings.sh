#!/bin/bash
# backup-local-settings.sh
# Backs up all local-only settings that are NOT tracked by git.
# Usage: bash scripts/backup-local-settings.sh [dest_dir]

set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEST="${1:-/c/Users/박상우/Desktop/fire-project-backup-$TIMESTAMP}"
PROJECT="E:/Fire Project"
USER_HOME="/c/Users/박상우"

mkdir -p "$DEST"

log()  { echo "[OK]   $1"; }
skip() { echo "[SKIP] $1 (not found)"; }

copy_file() {
  local src="$1"
  local dest_subdir="$2"
  local label="${3:-$src}"
  if [[ -f "$src" ]]; then
    mkdir -p "$DEST/$dest_subdir"
    cp "$src" "$DEST/$dest_subdir/"
    log "$label"
  else
    skip "$label"
  fi
}

copy_dir() {
  local src="$1"
  local dest_subdir="$2"
  local label="${3:-$src}"
  if [[ -d "$src" ]]; then
    mkdir -p "$DEST/$dest_subdir"
    cp -r "$src"/* "$DEST/$dest_subdir/" 2>/dev/null || true
    log "$label"
  else
    skip "$label"
  fi
}

echo "=== Fire Project Local Settings Backup ==="
echo "Destination: $DEST"
echo ""

# --- 1. Credentials ---
echo "--- Credentials ---"
copy_file "$PROJECT/shining-grid-486809-t4-577326e1e6a8.json" "credentials" "GCP Service Account Key"

# GCP ADC token
ADC_PATH="$USER_HOME/AppData/Roaming/gcloud/application_default_credentials.json"
copy_file "$ADC_PATH" "credentials" "GCP ADC credentials"

# --- 2. Claude Code Settings ---
echo ""
echo "--- Claude Code ---"
copy_file "$USER_HOME/.claude.json" "claude" "User .claude.json (MCP servers, project configs)"
copy_file "$USER_HOME/.claude/settings.json" "claude" "User settings.json"
copy_file "$USER_HOME/.claude/statusline-command.js" "claude" "Statusline script"

# Project-level local settings (not git-tracked)
copy_file "$PROJECT/.claude/settings.local.json" "claude/project" "Project settings.local.json"

# Auto-memory
MEMORY_SRC="$USER_HOME/.claude/projects/E--Fire-Project/memory"
if [[ -d "$MEMORY_SRC" ]]; then
  mkdir -p "$DEST/claude/memory"
  cp -r "$MEMORY_SRC"/* "$DEST/claude/memory/" 2>/dev/null || true
  log "Auto-memory files"
else
  skip "Auto-memory directory"
fi

# --- 3. Git Global Config ---
echo ""
echo "--- Git ---"
copy_file "$USER_HOME/.gitconfig" "git" "Git global config"

# --- 4. Shell Profile ---
echo ""
echo "--- Shell ---"
copy_file "$USER_HOME/.bashrc" "shell" ".bashrc"
copy_file "$USER_HOME/.bash_profile" "shell" ".bash_profile"
copy_file "$USER_HOME/.profile" "shell" ".profile"

# --- 5. Capture runtime versions & global packages ---
echo ""
echo "--- Runtime Info ---"
{
  echo "# Runtime Versions (captured $TIMESTAMP)"
  echo ""
  echo "node: $(node -v 2>/dev/null || echo 'not installed')"
  echo "npm: $(npm -v 2>/dev/null || echo 'not installed')"
  echo "python: $(python --version 2>/dev/null || echo 'not installed')"
  echo "python3: $(python3 --version 2>/dev/null || echo 'not installed')"
  echo "playwright: $(npx playwright --version 2>/dev/null || echo 'not installed')"
  echo "gcloud: $(gcloud --version 2>/dev/null | head -1 || echo 'not installed')"
  echo "gh: $(gh --version 2>/dev/null | head -1 || echo 'not installed')"
  echo ""
  echo "# Global npm packages"
  npm ls -g --depth=0 2>/dev/null || echo "(failed to list)"
  echo ""
  echo "# pip packages with 'mcp' or 'ga4'"
  pip list 2>/dev/null | grep -iE "mcp|ga4" || echo "(none found)"
  echo ""
  echo "# ga4-mcp-server location"
  which ga4-mcp-server 2>/dev/null || echo "not in PATH"
  ls "C:/Python3.11.2/Scripts/ga4-mcp-server.exe" 2>/dev/null || echo "not at hardcoded path"
  echo ""
  echo "# GCP config"
  echo "project: $(gcloud config get-value project 2>/dev/null || echo 'unset')"
  echo "account: $(gcloud config get-value account 2>/dev/null || echo 'unset')"
  echo ""
  echo "# GitHub CLI"
  gh auth status 2>&1 || echo "(not authenticated)"
} > "$DEST/runtime-info.txt"
log "Runtime info captured"

# --- 6. Generate restore script ---
echo ""
echo "--- Generating restore script ---"
cat > "$DEST/restore.sh" << 'RESTORE_EOF'
#!/bin/bash
# restore.sh — Run on the new machine after copying this backup folder.
# Usage: bash restore.sh [backup_dir]
#
# Prerequisites: node, npm, python, gcloud, gh must already be installed.

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)"
USER_HOME="$HOME"
PROJECT="${FIRE_PROJECT_PATH:-E:/Fire Project}"

echo "=== Fire Project Settings Restore ==="
echo "Backup dir: $BACKUP_DIR"
echo "Project dir: $PROJECT"
echo ""

restore_file() {
  local src="$1" dest="$2" label="${3:-}"
  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "[OK]   $label -> $dest"
  else
    echo "[SKIP] $label (not in backup)"
  fi
}

# Credentials
restore_file "$BACKUP_DIR/credentials/shining-grid-486809-t4-577326e1e6a8.json" \
  "$PROJECT/shining-grid-486809-t4-577326e1e6a8.json" "GCP SA Key"

# Claude Code
restore_file "$BACKUP_DIR/claude/.claude.json" "$USER_HOME/.claude.json" "User .claude.json"
restore_file "$BACKUP_DIR/claude/settings.json" "$USER_HOME/.claude/settings.json" "User settings"
restore_file "$BACKUP_DIR/claude/statusline-command.js" "$USER_HOME/.claude/statusline-command.js" "Statusline"
restore_file "$BACKUP_DIR/claude/project/settings.local.json" "$PROJECT/.claude/settings.local.json" "Project local settings"

# Memory
if [[ -d "$BACKUP_DIR/claude/memory" ]]; then
  MEMORY_DEST="$USER_HOME/.claude/projects/E--Fire-Project/memory"
  mkdir -p "$MEMORY_DEST"
  cp -r "$BACKUP_DIR/claude/memory"/* "$MEMORY_DEST/"
  echo "[OK]   Auto-memory files"
fi

# Git
restore_file "$BACKUP_DIR/git/.gitconfig" "$USER_HOME/.gitconfig" "Git global config"

# Shell
restore_file "$BACKUP_DIR/shell/.bashrc" "$USER_HOME/.bashrc" ".bashrc"
restore_file "$BACKUP_DIR/shell/.bash_profile" "$USER_HOME/.bash_profile" ".bash_profile"

echo ""
echo "=== Manual steps required ==="
echo "1. gcloud auth login"
echo "2. gcloud auth application-default login"
echo "3. gcloud config set project pubg-platform-ai"
echo "4. gh auth login"
echo "5. pip install ga4-mcp-server"
echo "6. npm i -g @justmpm/nanobanana @ycse/nanobanana-mcp mcp-server-gsc"
echo "7. npx playwright install"
echo "8. Check paths in .claude.json — update if Python/project paths differ"
echo "   - ga4 server: C:\\Python3.11.2\\Scripts\\ga4-mcp-server.exe"
echo "   - SA key: E:\\Fire Project\\shining-grid-486809-t4-577326e1e6a8.json"
echo ""
echo "See runtime-info.txt for version details from the source machine."
RESTORE_EOF
log "restore.sh generated"

# --- Summary ---
echo ""
echo "=== Backup Complete ==="
echo "Location: $DEST"
du -sh "$DEST" 2>/dev/null || true
echo ""
echo "Files:"
find "$DEST" -type f | sed "s|$DEST/||" | sort
