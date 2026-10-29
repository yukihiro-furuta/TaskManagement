# start-servers スキル

このスキルが呼ばれたら、以下の手順でバックエンドとフロントエンドのサーバーを起動する。
**必ずデフォルトポートで起動すること。別ポートへのフォールバックは禁止。**

---

## ポートルール（絶対厳守）

| サービス | ポート |
|----------|--------|
| Spring Boot バックエンド | **8080** |
| Vite フロントエンド | **5173** |

ポート競合が発生した場合は、別ポートで起動せず、競合しているプロセスを停止してから指定ポートで起動する。

---

## 起動手順

### Step 1: ポート競合チェック＆解消

```powershell
# 8080 を使用しているプロセスを確認・停止
$e8080 = netstat -ano 2>$null | Select-String ":8080\s" | Where-Object { $_ -match "LISTENING" } | Select-Object -First 1
if ($e8080) {
    $pid8080 = [int]($e8080.ToString().Trim() -split '\s+')[-1]
    Write-Host "Port 8080 in use by PID $pid8080 -- stopping"
    Stop-Process -Id $pid8080 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 800
}

# 5173 を使用しているプロセスを確認・停止
$e5173 = netstat -ano 2>$null | Select-String ":5173\s" | Where-Object { $_ -match "LISTENING" } | Select-Object -First 1
if ($e5173) {
    $pid5173 = [int]($e5173.ToString().Trim() -split '\s+')[-1]
    Write-Host "Port 5173 in use by PID $pid5173 -- stopping"
    Stop-Process -Id $pid5173 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 800
}
```

### Step 2: Docker（PostgreSQL）起動

作業ディレクトリ: `c:\Users\yukih\AIpro\github-demo`

```powershell
Set-Location "c:\Users\yukih\AIpro\github-demo"
docker-compose up -d
```

コンテナが `Started` または `Running` になっていることを確認する。

### Step 3: Spring Boot バックエンド起動

作業ディレクトリ: `c:\Users\yukih\AIpro\github-demo\backend`

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
$logPath = "C:\Users\yukih\AppData\Local\Temp\github-demo-logs\springboot.log"
"" | Out-File $logPath -Encoding utf8
Start-Process powershell -ArgumentList '-NoProfile', '-Command', "Set-Location 'C:\Users\yukih\AIpro\github-demo\backend'; .\mvnw spring-boot:run 2>&1 | Out-File -FilePath '$logPath' -Encoding utf8 -Append" -WindowStyle Hidden
```

ログに `Started BackendApplication` が出るまで待つ（目安 15〜20 秒）。

確認コマンド:
```powershell
$log = Get-Content "C:\Users\yukih\AppData\Local\Temp\github-demo-logs\springboot.log" -Tail 5 -ErrorAction SilentlyContinue
$log -join "`n"
```

### Step 4: Vite フロントエンド起動

作業ディレクトリ: `c:\Users\yukih\AIpro\github-demo\frontend`

Node.js の PATH を毎回セットすること（PowerShell セッションにはデフォルトで入っていないため）:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
$logPath2 = "C:\Users\yukih\AppData\Local\Temp\github-demo-logs\vite.log"
"" | Out-File $logPath2 -Encoding utf8
Start-Process powershell -ArgumentList '-NoProfile', '-Command', "`$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH; Set-Location 'C:\Users\yukih\AIpro\github-demo\frontend'; npm run dev 2>&1 | Out-File -FilePath '$logPath2' -Encoding utf8 -Append" -WindowStyle Hidden
```

ログに `VITE v... ready` が出るまで待つ（目安 5〜10 秒）。

確認コマンド:
```powershell
Get-Content "C:\Users\yukih\AppData\Local\Temp\github-demo-logs\vite.log" -ErrorAction SilentlyContinue | Select-Object -First 10
```

### Step 5: 起動確認

```powershell
# API が正常にレスポンスを返すか確認
$api = Invoke-RestMethod -Uri "http://localhost:8080/api/cards" -TimeoutSec 5 -ErrorAction SilentlyContinue
if ($api) { Write-Host "Backend OK: $($api.Count) cards" } else { Write-Host "Backend NOT ready" }

# Vite proxy 経由の確認
$proxy = Invoke-RestMethod -Uri "http://localhost:5173/api/cards?status=todo" -TimeoutSec 5 -ErrorAction SilentlyContinue
if ($proxy) { Write-Host "Frontend proxy OK: $($proxy.Count) todo cards" } else { Write-Host "Frontend proxy NOT ready" }
```

---

## トラブルシューティング

| 症状 | 確認事項 |
|------|----------|
| `./mvnw` が見つからない | `c:\Users\yukih\AIpro\github-demo\backend\` で実行しているか確認 |
| Spring Boot が DB 接続失敗 | `docker-compose up -d` でコンテナが起動しているか確認 |
| Vite が 5173 以外のポートを使う | フォールバックしたなら停止し、再度競合チェックして起動し直す |
| `npm` が見つからない | `$env:PATH = "C:\Program Files\nodejs;$env:PATH"` を毎回実行する |

---

## 禁止事項

- `--port <別ポート>` での起動
- `server.port=<別ポート>` での起動
- ポート競合を無視したまま起動すること

Vite の `/api` プロキシは `localhost:8080` に固定されているため、バックエンドが別ポートで起動すると API 通信が全て失敗する。
