param(
    [string]$WorkspacePath = '',
    [string]$LogPath = '',
    [switch]$PrintAuthUrl
)

$ErrorActionPreference = 'Stop'

if (-not $WorkspacePath) {
    $WorkspacePath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
}

if (-not $LogPath) {
    $LogPath = Join-Path $WorkspacePath 'logs\adsense-mcp-keepalive.jsonl'
}

$mcpEntry = Join-Path $WorkspacePath '.mcp-servers\adsense-mcp\build\index.js'
if (-not (Test-Path -LiteralPath $mcpEntry)) {
    throw "AdSense MCP build entry not found: $mcpEntry"
}

$logDir = Split-Path -Parent $LogPath
if ($logDir) {
    New-Item -ItemType Directory -Force -Path $logDir | Out-Null
}

function Write-KeepAliveLog {
    param([hashtable]$Entry)
    $Entry.ts = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    Add-Content -LiteralPath $LogPath -Value ($Entry | ConvertTo-Json -Compress -Depth 8)
}

$doctorOutput = & node $mcpEntry doctor 2>&1
$doctorExitCode = $LASTEXITCODE
$raw = ($doctorOutput | Out-String).Trim()

$parsed = $null
try {
    if ($raw) {
        $parsed = $raw | ConvertFrom-Json
    }
} catch {
    $parsed = $null
}

if ($doctorExitCode -eq 0 -and $parsed -and $parsed.ok -eq $true) {
    Write-KeepAliveLog @{
        ok = $true
        command = 'doctor'
        defaultAccount = $parsed.defaultAccount
        rootDir = $parsed.rootDir
    }
    Write-Output $raw
    exit 0
}

$isInvalidGrant = $raw -match 'invalid_grant'
$entry = @{
    ok = $false
    command = 'doctor'
    error = if ($raw) { $raw } else { "doctor exited with code $doctorExitCode" }
    invalidGrant = $isInvalidGrant
}

if ($isInvalidGrant) {
    $entry.remediation = 'Move OAuth consent screen to Production if still Testing, then run auth-url and init --code to store a fresh refresh token.'
}

if ($PrintAuthUrl) {
    $authUrlOutput = & node $mcpEntry auth-url 2>&1
    $entry.authUrlOutput = ($authUrlOutput | Out-String).Trim()
}

Write-KeepAliveLog $entry
Write-Error $entry.error
exit 1
