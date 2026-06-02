# Starts CommunityCenter.API on http://localhost:5051
# Safe to run multiple times - skips start if API is already healthy.
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$apiUrl = "http://127.0.0.1:5051"
$swaggerUrl = "$apiUrl/swagger"

function Test-ApiRunning {
    try {
        $r = Invoke-WebRequest -Uri "$apiUrl/api/News" -UseBasicParsing -TimeoutSec 2
        return $r.StatusCode -eq 200
    } catch {
        return $false
    }
}

if (Test-ApiRunning) {
    Write-Host ""
    Write-Host "Server is ALREADY RUNNING." -ForegroundColor Green
    Write-Host "  API:     $apiUrl"
    Write-Host "  Swagger: $swaggerUrl"
    Write-Host ""
    Write-Host "To restart: run .\stop-server.ps1 first, then run this script again."
    Write-Host "If you use Visual Studio, click Stop before Run."
    exit 0
}

& "$scriptDir\stop-server.ps1"

Write-Host ""
Write-Host "Starting server on $apiUrl ..."
Write-Host "Swagger: $swaggerUrl"
Write-Host "Press Ctrl+C to stop."
Write-Host ""

dotnet run --project CommunityCenter.API --launch-profile http
