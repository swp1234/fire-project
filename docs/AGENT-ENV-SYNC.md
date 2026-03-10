# Agent Env Sync

This project supports two modes:
- default: isolated Codex mode (no Claude impact)
- optional: one-way MCP import from Claude to Codex

## Current parity status

What is synced:
- MCP server names
- MCP command and args
- MCP env vars
- Both Claude scopes are merged:
  - global: `~/.claude.json` -> `mcpServers`
  - project: `~/.claude.json` -> `projects["E:/Fire Project"].mcpServers`

What cannot be made truly identical:
- Base model runtime (`claude-*` vs `gpt-*`)
- Internal permission/sandbox systems
- Tool runtime implementation details

## Sync command

Run this only when you intentionally want to import MCP from Claude:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-claude-codex-mcp.ps1 -WorkspacePath "E:\Fire Project"
```

Optional cleanup to remove Codex-only servers not present in Claude:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-claude-codex-mcp.ps1 -WorkspacePath "E:\Fire Project" -Prune
```

Dry run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-claude-codex-mcp.ps1 -WorkspacePath "E:\Fire Project" -DryRun
```

## Team rule

When MCP settings change in Claude and you want the same MCP in Codex:
1. Update Claude MCP first.
2. Run the sync script once.
3. Start a new Codex session to load updated MCP tools.

## Isolation-first workflow

Use this launcher for daily Codex work:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-isolated.ps1
```

## Optional sync launcher

If you explicitly want Claude -> Codex MCP sync on launch:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-synced.ps1
```

Preview only:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-synced.ps1 -DryRun mcp list
```
