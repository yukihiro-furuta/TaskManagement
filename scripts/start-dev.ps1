# TaskManagement 開発環境 自動起動スクリプト
# Task Scheduler からログイン時に実行される

$logDir  = "C:\Users\yukih\AppData\Local\Temp\task-management-logs"
$logBe   = "$logDir\springboot.log"
$logFe   = "$logDir\vite.log"
$project = "C:\Users\yukih\AIpro\TaskManagement"

# ログディレクトリを保証
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Force $logDir | Out-Null }

function Write-Log($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$ts  $msg" | Out-File "$logDir\startup.log" -Append -Encoding utf8
}

Write-Log "=== start-dev.ps1 begin ==="

# ── 1. Docker Desktop が起動するまで最大 90 秒待つ ──────────────────────
Write-Log "Waiting for Docker Desktop..."
$timeout = 90
$elapsed = 0
while ($elapsed -lt $timeout) {
    $dockerOk = docker info 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep -Seconds 5
    $elapsed += 5
}
if ($elapsed -ge $timeout) {
    Write-Log "ERROR: Docker Desktop not ready after ${timeout}s — abort"
    exit 1
}
Write-Log "Docker Desktop ready"

# ── 2. PostgreSQL ────────────────────────────────────────────────────────
$running = docker ps --filter "name=task-management-db" --filter "status=running" -q
if (-not $running) {
    Write-Log "Starting PostgreSQL..."
    Set-Location $project
    docker compose up -d 2>&1 | Out-File "$logDir\docker.log" -Encoding utf8
    Start-Sleep -Seconds 5
    Write-Log "PostgreSQL started"
} else {
    Write-Log "PostgreSQL already running"
}

# ── 3. Spring Boot (port 8080) ───────────────────────────────────────────
$be = netstat -ano 2>$null | Select-String ":8080\s" | Where-Object { $_ -match "LISTENING" }
if (-not $be) {
    Write-Log "Starting Spring Boot..."
    "" | Out-File $logBe -Encoding utf8  # ログファイルを初期化
    Start-Process powershell -ArgumentList '-NoProfile', '-Command',
        "Set-Location '$project\backend'; .\mvnw spring-boot:run 2>&1 | Out-File -FilePath '$logBe' -Encoding utf8 -Append" `
        -WindowStyle Hidden
    # Started BackendApplication が出るまで最大 60 秒待つ
    $waited = 0
    while ($waited -lt 60) {
        Start-Sleep -Seconds 5
        $waited += 5
        $found = Select-String -Path $logBe -Pattern "Started BackendApplication" -ErrorAction SilentlyContinue
        if ($found) { break }
    }
    Write-Log "Spring Boot ready (waited ${waited}s)"
} else {
    Write-Log "Spring Boot already running on 8080"
}

# ── 4. Vite (port 5173) ─────────────────────────────────────────────────
$fe = netstat -ano 2>$null | Select-String ":5173\s" | Where-Object { $_ -match "LISTENING" }
if (-not $fe) {
    Write-Log "Starting Vite..."
    "" | Out-File $logFe -Encoding utf8
    Start-Process powershell -ArgumentList '-NoProfile', '-Command',
        "`$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH; Set-Location '$project\frontend'; npm run dev 2>&1 | Out-File -FilePath '$logFe' -Encoding utf8 -Append" `
        -WindowStyle Hidden
    # VITE ready が出るまで最大 30 秒待つ
    $waited = 0
    while ($waited -lt 30) {
        Start-Sleep -Seconds 3
        $waited += 3
        $found = Select-String -Path $logFe -Pattern "ready in" -ErrorAction SilentlyContinue
        if ($found) { break }
    }
    Write-Log "Vite ready (waited ${waited}s)"
} else {
    Write-Log "Vite already running on 5173"
}

Write-Log "=== start-dev.ps1 done === http://localhost:5173 is ready"
