# TaskManagement 開発サーバー自動起動スクリプト
# DB (Docker) → Spring Boot (port 8080) → Vite (port 5173) の順で起動する

$backendDir  = "C:\Users\yukih\AIpro\TaskManagement\backend"
$frontendDir = "C:\Users\yukih\AIpro\TaskManagement\frontend"

# 1. PostgreSQL コンテナ起動
docker start task-management-db

# コンテナが healthy になるまで待機
Start-Sleep -Seconds 5

# 2. バックエンド起動
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; .\mvnw.cmd spring-boot:run" -WindowStyle Normal

# Spring Boot が起動し始めるまで少し待ってからフロントエンドを起動
Start-Sleep -Seconds 5

# 3. フロントエンド起動
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev" -WindowStyle Normal
