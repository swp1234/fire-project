# Fire Project Agent Rules

## Goal
Run Codex in isolation so Codex work does not affect Claude runtime/config.

## Isolation rules (default)
- Do not write to `%USERPROFILE%\.claude*` paths.
- Do not write to `E:\Fire Project\.claude\` paths.
- Do not run `claude` CLI commands from Codex sessions unless explicitly requested by the user.

## Start-of-session rule
Launch Codex in isolated mode:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-isolated.ps1
```

## Optional one-way import (manual only)
If user explicitly asks to copy MCP definitions from Claude to Codex, use:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-claude-codex-mcp.ps1 -WorkspacePath "E:\Fire Project"
```

This is import-only (Claude -> Codex). Never export from Codex to Claude.

## Source of truth
- Codex runtime config: `%USERPROFILE%\.codex\config.toml`
- Project operating rules: `CLAUDE.md`, `PROGRESS.md`, and `docs/`
