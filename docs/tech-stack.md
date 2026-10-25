# 技術スタック

| 項目           | 内容         |
| -------------- | ------------ |
| ドキュメント名 | 技術スタック |
| バージョン     | 2.0          |
| 作成者         | yukihiro     |
| 作成日         | 2026-10-24   |
| 最終更新日     | 2026-10-25   |

---

## 1. フロントエンド

| 技術             | バージョン / 詳細 | 採用理由                                         |
| ---------------- | ----------------- | ------------------------------------------------ |
| React            | 18.x              | コンポーネント指向・エコシステムが豊富            |
| TypeScript       | 5.x               | 型安全性・IDE補完・バグ早期検出                  |
| Vite             | 5.x               | 高速ビルド・React向け標準的な開発ツール          |
| React Router     | 6.x               | SPAルーティング                                  |
| Axios            | 1.x               | バックエンドAPIとのHTTP通信                      |
| Tailwind CSS     | 3.x               | ユーティリティファーストCSSで素早くスタイリング  |

---

## 2. バックエンド

| 技術             | バージョン / 詳細 | 採用理由                                         |
| ---------------- | ----------------- | ------------------------------------------------ |
| Java             | 21 (LTS)          | 安定性・エコシステムの成熟                       |
| Spring Boot      | 3.x               | 設定最小・本番運用実績が豊富なフレームワーク     |
| Spring Web MVC   | Spring Boot同梱   | REST APIの実装                                   |
| Spring Data JPA  | Spring Boot同梱   | DBアクセスの抽象化・ボイラープレート削減         |
| Spring Security  | Spring Boot同梱   | 認証・認可                                       |
| Hibernate        | Spring Boot同梱   | JPAプロバイダ・ORM                               |
| Lombok           | 1.18.x            | ゲッター/セッター等のコード自動生成              |
| MapStruct        | 1.5.x             | DTO ↔ エンティティ変換                          |
| Maven            | 3.9.x             | ビルド・依存関係管理                             |

---

## 3. データベース

| 技術             | バージョン / 詳細 | 採用理由                                         |
| ---------------- | ----------------- | ------------------------------------------------ |
| PostgreSQL       | 16.x              | OSS・高機能RDB・Spring Data JPAとの親和性が高い  |
| Flyway           | 10.x              | DBマイグレーション管理                           |

---

## 4. テスト

| 技術             | バージョン / 詳細 | 用途                                             |
| ---------------- | ----------------- | ------------------------------------------------ |
| JUnit 5          | Spring Boot同梱   | バックエンド単体・統合テスト                     |
| Mockito          | Spring Boot同梱   | モックを使った単体テスト                         |
| Testcontainers   | 1.19.x            | PostgreSQLを使った統合テスト                     |
| Vitest           | 1.x               | フロントエンド単体テスト（Viteネイティブ）       |
| React Testing Library | 14.x         | Reactコンポーネントテスト                        |

---

## 5. 開発環境・インフラ

| 項目             | 内容                                                 |
| ---------------- | ---------------------------------------------------- |
| エディタ         | IntelliJ IDEA / VS Code                              |
| バージョン管理   | Git / GitHub                                         |
| コンテナ         | Docker / Docker Compose（ローカル開発用DB起動等）    |
| APIドキュメント  | SpringDoc OpenAPI (Swagger UI)                       |
| 動作確認ブラウザ | Google Chrome 120 以降                               |

---

## 6. アーキテクチャ概要

```
[ブラウザ]
    │  HTTP/JSON (REST API)
    ▼
[React + TypeScript]  ← Viteでビルド
    │  HTTP/JSON (REST API)
    ▼
[Spring Boot (Java)]  ← REST Controller → Service → Repository
    │  JDBC / JPA
    ▼
[PostgreSQL]
```
