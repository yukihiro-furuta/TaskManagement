$raw  = [Console]::In.ReadToEnd()
$data = $raw | ConvertFrom-Json
$cmd  = $data.tool_input.command

$port = $null
if ($cmd -match 'spring-boot:run') {
    $port = 8080
}
if ($cmd -match 'npm run dev' -or $cmd -match 'npx vite') {
    $port = 5173
}

if ($null -eq $port) {
    exit 0
}

$entry = netstat -ano 2>$null |
    Select-String (":${port}\s") |
    Where-Object { $_ -match "LISTENING" } |
    Select-Object -First 1

if ($entry) {
    $parts = $entry.ToString().Trim() -split '\s+'
    $procId = [int]$parts[-1]
    Write-Host "[port-check] port $port in use by PID $procId -- stopping"
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 800
    Write-Host "[port-check] port $port is now free"
}

exit 0
