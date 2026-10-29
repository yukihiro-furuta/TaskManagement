# quality-check スキル

このスキルが呼ばれたら、コードの品質を確認するためのチェックポイントを実行する。

---

## 概要

このプロジェクトの品質管理チェックリスト。バックエンド（Java/Spring Boot）とフロントエンド（React/TypeScript）のレビューポイントをまとめている。

---

## バックエンド品質チェック

### 1. Checkstyle（静的解析）

```powershell
Set-Location "c:\Users\yukih\AIpro\github-demo\backend"
.\mvnw checkstyle:check
```

**主なルール（`backend/checkstyle.xml`）:**

| カテゴリ | ルール |
|----------|--------|
| インポート | `UnusedImports` / `RedundantImport` / `AvoidStarImport` |
| 命名規則 | クラス: UpperCamelCase / メソッド・変数: lowerCamelCase / 定数: UPPER_SNAKE_CASE |
| ブロック | `if/for/while` は必ず `{}` で囲む |
| コード品質 | `equals` を override したら `hashCode` も / `switch` に `default` 節必須 |
| 空白 | タブ禁止（スペースのみ） / 1行120文字以内 |

違反があれば `WARNING` が出る（ビルドは止まらない）。

---

### 2. 入力バリデーション

**エンティティ側（`Card.java`）**に `javax.validation` アノテーションがついていること:

```java
@NotBlank(message = "タイトルは必須です")
@Size(max = 255, message = "タイトルは255文字以内")
private String title;
```

**コントローラ側（`CardController.java`）**でリクエストに `@Valid` がついていること:

```java
public ResponseEntity<Card> create(@Valid @RequestBody Card card) { ... }
```

**グローバルハンドラ（`GlobalExceptionHandler.java`）**でバリデーションエラーが整形されて返ること:

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public Map<String, Object> handleValidation(MethodArgumentNotValidException ex) { ... }
```

確認コマンド（タイトルなしで POST して 400 が返るか）:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/cards" `
  -ContentType "application/json" -Body '{"title":"","status":"todo"}' -ErrorAction SilentlyContinue
```

---

### 3. CORS 設定

`backend/src/main/java/com/example/backend/config/CorsConfig.java` で、フロントエンドオリジン（`http://localhost:5173`）が許可されていること。

---

### 4. 例外ハンドリング

`GlobalExceptionHandler.java` で少なくとも以下が処理されていること:

- `CardNotFoundException` → `404 Not Found`
- `MethodArgumentNotValidException` → `400 Bad Request`

---

## フロントエンド品質チェック

### 1. Oxlint（静的解析）

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
Set-Location "c:\Users\yukih\AIpro\github-demo\frontend"
npx oxlint src
```

**設定ファイル（`frontend/.oxlintrc.json`）:**

```json
{
  "plugins": ["react"],
  "rules": {
    "react/set-state-in-effect": "off"
  }
}
```

---

### 2. TypeScript 型チェック

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
Set-Location "c:\Users\yukih\AIpro\github-demo\frontend"
npx tsc --noEmit
```

型エラーが 0 件であること。

---

### 3. ビルド確認

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
Set-Location "c:\Users\yukih\AIpro\github-demo\frontend"
npm run build
```

ビルドエラーが 0 件であること。

---

## 開発環境チェック

### 自動起動スクリプト（`scripts/start-dev.ps1`）

以下の順序で起動が完了すること:

1. Docker Desktop が Ready になる（最大 90 秒待機）
2. PostgreSQL コンテナ（`github-demo-db`）が Running になる
3. Spring Boot が port **8080** で起動（`Started BackendApplication` ログを確認）
4. Vite が port **5173** で起動（`ready in` ログを確認）

詳細な起動手順は `start-servers` スキルを参照。

---

## レビューチェックリスト（PR 前確認）

- [ ] Checkstyle 警告が増えていない（`.\mvnw checkstyle:check` で確認）
- [ ] 新しいエンドポイントには `@Valid` が付いている
- [ ] 新しい例外ケースは `GlobalExceptionHandler` に追加している
- [ ] Oxlint エラーが 0 件（`npx oxlint src`）
- [ ] TypeScript 型エラーが 0 件（`npx tsc --noEmit`）
- [ ] フロントエンドビルドが通る（`npm run build`）
- [ ] `localhost:8080/api/cards` と `localhost:5173/api/cards` が正常応答する
- [ ] 機密情報（パスワード・APIキー等）がコードに含まれていない
