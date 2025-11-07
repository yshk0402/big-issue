# データベース移行 Todoリスト

localStorageからデータベース管理へ移行するためのタスクリストです。

## Phase 1: データベース(Supabase)の導入と基本設定

- [ ] Supabaseプロジェクトの作成
- [ ] Next.jsアプリにSupabaseクライアントをインストール
- [ ] 環境変数の設定 (`.env.local`)

## Phase 2: データベーススキーマ設計

- [ ] `proposals` (提案) テーブルの設計
  - `id` (主キー)
  - `created_at` (作成日時)
  - `text` (提案内容)
  - `upvotes` (賛成票数)
  - `downvotes` (反対票数)
- [ ] `comments` (コメント) テーブルの設計
  - `id` (主キー)
  - `created_at` (作成日時)
  - `proposal_id` (提案ID、外部キー)
  - `user_name` (ユーザー名)
  - `text` (コメント内容)
- [ ] `votes` (投票) テーブルの設計
  - `id` (主キー)
  - `created_at` (作成日時)
  - `proposal_id` (提案ID、外部キー)
  - `user_id` (ユーザーID)
  - `vote_type` ('up' or 'down')
- [ ] `big_issue_votes` (大問題への投票) テーブルの設計
  - `id` (主キー)
  - `created_at` (作成日時)
  - `choice` ('agree' or 'disagree')
  - `user_id` (匿名ユーザーID)

## Phase 3: データアクセス層の実装

- [ ] Supabaseとの接続を管理するヘルパー関数の作成
- [ ] 提案を取得/追加/更新するための関数を作成
- [ ] コメントを取得/追加するための関数を作成
- [ ] 投票を取得/追加するための関数を作成

## Phase 4: APIルートの作成

- [ ] `app/api/proposals/route.ts`: 提案のCRUD操作
- [ ] `app/api/comments/route.ts`: コメントのCRUD操作
- [ ] `app/api/votes/route.ts`: 投票のCRUD操作

## Phase 5: フロントエンドの修正

- [ ] `app/ideas/page.tsx`:
  - `localStorage` の呼び出しをAPIリクエストに置き換え
  - データの取得、投稿、投票処理をAPI経由に変更
- [ ] `app/vote/page.tsx`:
  - `localStorage` の呼び出しをAPIリクエストに置き換え
  - 投票処理をAPI経由に変更
- [ ] データ取得中のローディング状態を管理
- [ ] エラーハンドリングの実装

## Phase 6: 認証 (Phase 2以降)

- [ ] 匿名ユーザーIDを生成し、`localStorage` またはクッキーに保存
- [ ] Supabase Auth (Magic Link, Google Sign-inなど) の導入
- [ ] 投票やコメントの投稿を認証済みユーザーに制限

## Phase 7: テスト

- [ ] APIルートの単体テスト
- [ ] フロントエンドコンポーネントのインタラクションテスト
- [ ] E2Eテスト (提案の投稿から投票までの一連の流れ)

## Phase 8: ドキュメント

- [ ] `README.md` を更新し、新しいバックエンドのセットアップ方法を記述
- [ ] APIのエンドポイント仕様をドキュメント化
