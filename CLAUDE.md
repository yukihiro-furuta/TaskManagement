# GitHub Workflow Rules — github-demo

These rules are **strictly enforced** in every Claude Code session. No exceptions.

---

## 1. イシューの作成（必須）

作業を開始する前に、**必ずGitHub Issueを作成すること**。

- バグ修正 → `bug_report` テンプレートを使用
- 機能追加 → `feature_request` テンプレートを使用
- その他 → ラベル `task` で手動作成

**Issueなしでブランチを作ることは禁止。**

```bash
# Issue作成例
gh issue create --title "タイトル" --body "..." --label "bug"
```

---

## 2. ブランチ命名規則（必須）

| 種別 | プレフィックス | 例 |
|------|--------------|-----|
| 機能追加 | `feature/` | `feature/123-add-login` |
| バグ修正 | `fix/` | `fix/456-null-pointer` |
| ドキュメント | `docs/` | `docs/789-update-readme` |
| リファクタリング | `refactor/` | `refactor/101-extract-service` |
| ホットフィックス | `hotfix/` | `hotfix/202-critical-crash` |

形式: `<prefix>/<issue番号>-<短い説明（英語・ハイフン区切り）>`

```bash
# ブランチ作成例（Issue #42の場合）
git checkout -b feature/42-add-user-profile
```

---

## 3. コミットメッセージ規則

[Conventional Commits](https://www.conventionalcommits.org/) に従う。

```
<type>(<scope>): <要約（英語）>

<本文（任意・日本語可）>

<フッター（任意）>
```

**type一覧:**
- `feat` — 新機能
- `fix` — バグ修正
- `docs` — ドキュメントのみの変更
- `refactor` — リファクタリング
- `test` — テストの追加・修正
- `chore` — ビルド・ツール・設定の変更

---

## 4. プルリクエストのルール

- **`main` への直接プッシュ禁止**（ブランチ保護で強制）
- PRは必ず対応するIssueにリンクすること（`Closes #<issue番号>`）
- PRテンプレートを埋めること
- セルフレビューを実施してからレビュー依頼すること

```bash
# PR作成例
gh pr create --title "feat: add user profile (#42)" \
  --body "$(cat .github/pull_request_template.md)"
```

---

## 5. Claude Codeが守るべき手順

新しい作業を始めるとき、**必ずこの順番で実行すること：**

1. `gh issue create` でIssueを作成
2. `git checkout -b <prefix>/<issue番号>-<説明>` でブランチ作成
3. 実装・コミット（Conventional Commits形式）
4. `gh pr create` でPR作成（Issueにリンク）
5. レビュー後にマージ（squash merge 推奨）

**この手順を省略した場合はユーザーに確認を取ること。**

---

## 6. 禁止事項

- `git push origin main` — 直接プッシュ禁止
- Issueなしでのブランチ作成
- PRレビューなしでのマージ
- `--force` フラグの使用（`main` ブランチへは絶対禁止）
