# データベース移行 Todoリスト

localStorageからデータベース管理へ移行するためのタスクリストです。

## Phase 1: データベース(Supabase)の導入と基本設定

- [x] Supabaseプロジェクトの作成
- [x] Next.jsアプリにSupabaseクライアントをインストール
- [x] 環境変数の設定 (`.env.local`)

## Phase 2: データベーススキーマ設計

- [x] `proposals` (提案) テーブルの設計
  - `id` (主キー)
  - `created_at` (作成日時)
  - `text` (提案内容)
  - `upvotes` (賛成票数)
  - `downvotes` (反対票数)
- [x] `comments` (コメント) テーブルの設計
  - `id` (主キー)
  - `created_at` (作成日時)
  - `proposal_id` (提案ID、外部キー)
  - `user_name` (ユーザー名)
  - `text` (コメント内容)
- [ ] `votes` (投票) テーブルの設計（後続で追加予定）
  - `id` (主キー)
  - `created_at` (作成日時)
  - `proposal_id` (提案ID、外部キー)
  - `user_id` (ユーザーID)
  - `vote_type` ('up' or 'down')
- [x] `big_issue_votes` (大問題への投票) テーブルの設計
  - `id` (主キー)
  - `created_at` (作成日時)
  - `choice` ('agree' or 'disagree')
  - `user_id` (匿名ユーザーID)

## Phase 3: データアクセス層の実装

- [x] Supabaseとの接続を管理するヘルパー関数の作成
- [x] 提案を取得/追加/投票更新するための関数を作成
- [x] コメントを取得/追加するための関数を作成
- [x] Big Issue 投票（集計/投稿）の関数を作成

## Phase 4: APIルートの作成

- [x] `app/api/proposals/route.ts`: 提案のCRUD操作
- [x] `app/api/comments/route.ts`: コメントのCRUD操作
- [x] `app/api/votes/route.ts`: Big Issue 投票の取得/投稿

## Phase 5: フロントエンドの修正

- [x] `app/ideas/page.tsx` を Supabase API ベースに刷新
- [x] `app/vote/page.tsx` を Supabase API ベースに刷新
- [x] フェッチ中のローディング／エラー UI を実装

## Phase 6: 認証 (Phase 2以降)

- [x] 匿名ユーザーIDを生成し、`localStorage` に保存して Big Issue 投票に利用
- [ ] Supabase Auth (Magic Link, Google Sign-inなど) の導入
- [ ] 投票やコメントの投稿を認証済みユーザーに制限

## Phase 7: テスト

- [ ] APIルートの単体テスト
- [ ] フロントエンドコンポーネントのインタラクションテスト
- [ ] E2Eテスト (提案の投稿から投票までの一連の流れ)

## Phase 8: ドキュメント

- [x] `README.md` を更新し、新しいバックエンドのセットアップ方法を記述
- [ ] APIのエンドポイント仕様をドキュメント化
