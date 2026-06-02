# Stops CommunityCenter.API and frees ports 5051 / 7134
$ErrorActionPreference = "SilentlyContinue"

$processes = Get-Process -Name "CommunityCenter.API" -ErrorAction SilentlyContinue
if ($processes) {
    $processes | ForEach-Object {
        Write-Host "Stopping CommunityCenter.API (PID $($_.Id))..."
        Stop-Process -Id $_.Id -Force
    }
    Start-Sleep -Seconds 2
    Write-Host "Server stopped."
} else {
    Write-Host "No CommunityCenter.API process is running."
}

$ports = @(5051, 7134)
foreach ($port in $ports) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object {
            $owner = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
            if ($owner -and $owner.ProcessName -notin @("System", "Idle")) {
                Write-Host "Freeing port $port (PID $($owner.Id) - $($owner.ProcessName))..."
                Stop-Process -Id $owner.Id -Force -ErrorAction SilentlyContinue
            }
        }
}

Start-Sleep -Seconds 1
