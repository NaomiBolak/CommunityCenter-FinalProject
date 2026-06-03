# Starts API + React client in correct order
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$serverDir = Join-Path $root "Server\CommunityCenter.API"
$clientDir = Join-Path $root "Client\my-app"

Write-Host "=== Community Center Dev ===" -ForegroundColor Cyan

# Stop old API instances
& (Join-Path $serverDir "stop-server.ps1")

# Start API in background
Write-Host "Starting API on http://127.0.0.1:5051 ..."
$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:serverDir
    dotnet run --project CommunityCenter.API --launch-profile http 2>&1
}

# Wait until API responds
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:5051/api/Health" -UseBasicParsing -TimeoutSec 3
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch { }
    Write-Host "  waiting for API... ($($i + 1)/30)"
}

if (-not $ready) {
    Write-Host "API failed to start. Check Visual Studio / port 5051." -ForegroundColor Red
    Stop-Job $apiJob -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "API is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting React client..."
Write-Host "Press Ctrl+C to stop the client (API keeps running in background job)."
Write-Host ""

Set-Location $clientDir
npm start
