[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$WorkspacePath = '',
    [string]$TaskName = 'FireProject-AdSenseMcp-KeepAlive',
    [ValidateSet('Daily', 'Weekly')]
    [string]$Schedule = 'Weekly',
    [string]$At = '09:10'
)

$ErrorActionPreference = 'Stop'

if (-not $WorkspacePath) {
    $WorkspacePath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
}

$keepAliveScript = Join-Path $WorkspacePath 'scripts\adsense-mcp-keepalive.ps1'
if (-not (Test-Path -LiteralPath $keepAliveScript)) {
    throw "Keepalive script not found: $keepAliveScript"
}

$time = [datetime]::ParseExact($At, 'HH:mm', [Globalization.CultureInfo]::InvariantCulture)
$actionArgs = "-NoProfile -ExecutionPolicy Bypass -File `"$keepAliveScript`" -WorkspacePath `"$WorkspacePath`""
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $actionArgs

if ($Schedule -eq 'Daily') {
    $trigger = New-ScheduledTaskTrigger -Daily -At $time
} else {
    $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At $time
}

$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

if ($PSCmdlet.ShouldProcess($TaskName, "Register AdSense MCP keepalive scheduled task")) {
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description 'Runs Fire Project AdSense MCP doctor to keep OAuth refresh token exercised and detect invalid_grant early.' -Force | Out-Null
}

Write-Output "Task ready: $TaskName ($Schedule at $At)"
