# Agent Env Sync

This project now has an MCP sync script so Claude and Codex stay aligned.

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

Run this in a normal terminal (not sandbox):

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

When MCP settings change in Claude:
1. Update Claude MCP first.
2. Run the sync script once.
3. Start a new Codex session to load updated MCP tools.

## Always-on workflow

Use this launcher so sync runs before every Codex session:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-synced.ps1
```

Optional with cleanup:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-synced.ps1 -Prune
```

Preview only:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-codex-synced.ps1 -DryRun mcp list
```
