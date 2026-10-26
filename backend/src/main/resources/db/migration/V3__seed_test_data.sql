INSERT INTO cards (title, description, priority, due_date, status, position) VALUES
    ('APIの設計',           'RESTfulエンドポイントの設計とOpenAPI仕様の作成',   'high', '2026-11-01', 'done',  1),
    ('バックエンド実装',    'Spring BootでCRUD APIを実装する',                  'high', '2026-11-10', 'doing', 1),
    ('DBマイグレーション',  'FlywayでPostgreSQLスキーマを管理する',             'mid',  '2026-11-05', 'done',  2),
    ('フロントエンド実装',  'ReactでカンバンUIを実装する',                      'mid',  '2026-11-20', 'todo',  1),
    ('テスト作成',          'ユニットテストと結合テストを作成する',             'mid',  '2026-12-01', 'todo',  2),
    ('パフォーマンス改善',  'クエリのN+1問題を解消しページネーションを実装する','low',  '2026-12-10', 'todo',  3),
    ('デプロイ',            'AWS ECSへのCI/CDパイプラインを構築する',           'low',  '2026-12-15', 'doing', 2);
