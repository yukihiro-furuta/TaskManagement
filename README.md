# カンバンタスク管理アプリ

Trello 風のカンバンボード形式で、日常タスクを視覚的に管理できる Web アプリです。  
React + Vite フロントエンドと Spring Boot バックエンド、PostgreSQL で構成しています。

---

## 機能一覧

| 機能                     | 概要                                                            |
| ------------------------ | --------------------------------------------------------------- |
| カンバンボード表示       | 「未着手」「作業中」「完了」の 3 列を固定表示                  |
| カード作成・編集・削除   | タイトル（必須）・説明文・優先度・期限を設定可能               |
| 列間移動                 | ← → ボタンによるカード移動                                     |
| ドラッグ＆ドロップ       | 列内・列間の任意位置への自由移動（挿入位置を青ラインで表示）   |
| 並び替え（ソート）       | カラム単位で優先度順・期限順にソート可能                       |
| 期限の視覚化             | 期限超過（赤）・当日（オレンジ）・3日以内（黄）・通常（グレー） |
| キーワード検索           | タイトル・説明文を横断検索                                     |
| カード数表示             | 各カラムのカード枚数をリアルタイム表示                         |

---

## 技術スタック

### フロントエンド

| 技術               | バージョン |
| ------------------ | ---------- |
| React              | 19.3.1     |
| TypeScript         | 7.0.2      |
| Vite               | 8.3.5      |
| oxlint             | 1.89.0     |

### バックエンド

| 技術         | バージョン |
| ------------ | ---------- |
| Java         | 21 (LTS)   |
| Spring Boot  | 3.4.1      |
| Flyway       | 同梱       |
| Lombok       | 同梱       |

### データベース

| 技術         | バージョン |
| ------------ | ---------- |
| PostgreSQL   | 16         |

詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照してください。

---

## アーキテクチャ

```
[ブラウザ]
    │
    ▼
[React + TypeScript]  ← Vite dev サーバー (localhost:5173)
    │  /api/* → proxy
    ▼
[Spring Boot REST API]  ← localhost:8080
    │  JPA / Hibernate
    ▼
[PostgreSQL 16]  ← Docker Compose (localhost:5433)
```

フロントエンドの Vite 開発サーバーは `/api` へのリクエストをバックエンドの `localhost:8080` へ自動でプロキシします。

---

## 前提条件

| ツール                  | バージョン目安  |
| ----------------------- | --------------- |
| Java                    | 21 以上         |
| Maven                   | 3.9 以上（または付属の `mvnw` を使用） |
| Node.js                 | 22 以上         |
| npm                     | 10 以上         |
| Docker / Docker Compose | 最新安定版      |

---

## セットアップ・起動手順

### 1. データベースを起動する

```bash
docker compose up -d
```

PostgreSQL 16 が `localhost:5433` で起動します。  
Flyway によるマイグレーションはバックエンド起動時に自動実行されます。

### 2. バックエンドを起動する

```bash
cd backend
./mvnw spring-boot:run    # macOS / Linux
mvnw.cmd spring-boot:run  # Windows
```

`localhost:8080` で Spring Boot が起動します。

### 3. フロントエンドを起動する

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開くとアプリが表示されます。

> **ポート競合時の注意**  
> バックエンドは必ず **8080**、フロントエンドは必ず **5173** で起動してください。  
> 別ポートで起動すると `/api` プロキシが機能しなくなります。

---

## 実装済み API エンドポイント

| メソッド | エンドポイント       | 概要                                        |
| -------- | -------------------- | ------------------------------------------- |
| GET      | `/api/cards`         | カード一覧を取得。`?status=<列名>` でフィルタ可能 |
| GET      | `/api/cards/{id}`    | 指定 ID のカードを 1 件取得                 |

---

## プロジェクト構成

```
github-demo/
├── backend/                # Spring Boot バックエンド
│   ├── src/
│   │   ├── main/java/com/example/backend/
│   │   │   ├── controller/   # REST コントローラー
│   │   │   ├── service/      # ビジネスロジック
│   │   │   ├── repository/   # Spring Data JPA リポジトリ
│   │   │   ├── entity/       # JPA エンティティ
│   │   │   └── dto/          # レスポンス DTO
│   │   └── resources/
│   │       └── db/migration/ # Flyway マイグレーションスクリプト
│   └── pom.xml
├── frontend/               # React + Vite フロントエンド
│   ├── src/
│   │   ├── api/              # バックエンド API クライアント
│   │   ├── components/       # React コンポーネント
│   │   │   ├── KanbanBoard/
│   │   │   ├── KanbanColumn/
│   │   │   ├── KanbanCard/
│   │   │   └── SearchBar/
│   │   └── types/            # TypeScript 型定義
│   ├── package.json
│   └── vite.config.ts
├── docs/                   # 要件定義・設計ドキュメント
│   ├── requirements.md         # 要件定義書（概要）
│   ├── functional-spec.md      # 機能要件定義書
│   ├── screen-design.md        # 画面設計書
│   ├── data-design.md          # データ設計書
│   ├── tech-stack.md           # 技術スタック
│   └── acceptance-criteria.md  # 受け入れ条件
├── docker-compose.yml      # PostgreSQL 開発用 DB 設定
└── README.md
```

---

## ドキュメント

| ドキュメント       | ファイル                                                       |
| ------------------ | -------------------------------------------------------------- |
| 要件定義書         | [docs/requirements.md](docs/requirements.md)                   |
| 機能要件定義書     | [docs/functional-spec.md](docs/functional-spec.md)             |
| 画面設計書         | [docs/screen-design.md](docs/screen-design.md)                 |
| データ設計書       | [docs/data-design.md](docs/data-design.md)                     |
| 技術スタック       | [docs/tech-stack.md](docs/tech-stack.md)                       |
| 受け入れ条件       | [docs/acceptance-criteria.md](docs/acceptance-criteria.md)     |

---

## 開発ワークフロー

このリポジトリでは以下のルールに従って開発を進めます。詳細は [CLAUDE.md](CLAUDE.md) を参照してください。

1. 作業前に **GitHub Issue を作成**する
2. `feature/<issue番号>-<説明>` 形式でブランチを作成する
3. [Conventional Commits](https://www.conventionalcommits.org/) 形式でコミットする
4. Pull Request を作成し、Issue にリンクする（`Closes #<issue番号>`）
5. レビュー後にマージ（squash merge 推奨）

> `main` ブランチへの直接プッシュは禁止されています。
