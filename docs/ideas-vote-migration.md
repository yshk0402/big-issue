# Ideas & Big Issue Migration Plan

このドキュメントでは、`/ideas` と `/vote` ページを `localStorage` 依存から Supabase / REST API ベースに移行するための具体的なステップをまとめます。

## 1. バックエンド / データベース準備

1. **スキーマ適用**
   - `schema.sql` の `proposals`, `comments`, `votes`, `big_issue_votes` を Supabase プロジェクトに反映。
   - `votes.user_id` と `big_issue_votes.user_id` はブラウザで発行する匿名 UUID を想定（`localStorage` へ保存）。

2. **RLS / セキュリティ**
   - Phase 1 では `anon` キーのまま公開 API を叩く前提なので、RLS 無効 or 読み書き許可ロールを作成。
   - Phase 2 で Auth を導入する場合に備えて、`user_id` での一意制約（`unique(proposal_id, user_id)` 等）を追加できるよう migration を設計。

3. **API Routes**
   - `app/api/proposals/route.ts`: `GET`（一覧）、`POST`（新規作成）。
   - `app/api/proposals/[id]/votes/route.ts`: `POST`（up/down 投票）や `PATCH`（変更）を追加し、body に `voteType`・`userId` を受け取る。
   - `app/api/comments/route.ts`: `GET`（`proposalId` クエリで絞り込み）、`POST`（コメント追加）。
   - `app/api/votes/route.ts`: Big Issue 用 `GET`（集計済み）/`POST`（投票）。Supabase の `rpc`（`count(*) filter`）を使うか、`select('choice, count(*)')` で集計。

## 2. アプリ内データアクセス層

1. `app/lib/data.ts` を提案専用 → **共通 Repository** に拡張。
   - `fetchProposals()`, `createProposal()`, `voteProposal({ proposalId, voteType, userId })`。
   - `fetchComments(proposalId)`, `createComment({ proposalId, userName, text })`。
   - `fetchBigIssueVotes()`（agree/disagree 集計を返す）、`submitBigIssueVote({ userId, choice })`。

2. Supabase を直接触らない場合に備えて、上記関数を `fetch` 経由で API Routes を叩くラッパーとして実装（サーバー → Supabase への責務集中）。

## 3. `/ideas` ページの移行ステップ

1. **データ取得**
   - 初期表示時に `GET /api/proposals` で最新リストを取得。
   - コメントモーダルを開くタイミングで `GET /api/comments?proposalId=...` を呼び出す。

2. **投稿/投票**
   - 新規提案投稿フォームは `POST /api/proposals` へ送信し、成功後にリストを再フェッチまたは楽観的に先頭へ追加。
   - Upvote/Downvote は `POST /api/proposals/{id}/votes` に `voteType` と `userId`（`localStorage` に保持する UUID）を渡す。レスポンスでは最新カウントを返し、UI を同期。

3. **コメント**
   - 投稿は `POST /api/comments`。レスポンスで返るコメントを `modal state` に追加。
   - コメント一覧を SSR で読み込む場合は `fetchCache: 'force-no-store'` を指定し、リアルタイム性を担保。

4. **ローディング/エラー**
   - 既存 Skeleton を API ローディングに合わせて再利用。
   - ネットワークエラー時はトーストやバナーで通知し、リトライ操作を提供。

## 4. `/vote` ページの移行ステップ

1. **初期カウント取得**
   - マウント時に `GET /api/votes` を呼び、agree/disagree の集計結果を受け取る。
   - エンドポイント側では Supabase に対して `select('choice, count(*)')` ＋ `group` で集計。

2. **投票ロジック**
   - `localStorage` に `bigIssueUserId` を保存（無ければ UUID 生成）。
   - ボタン押下で `POST /api/votes` に `{ userId, choice }` を送信。
   - 既存票を切り替える場合はサーバー側でトランザクション（`delete + insert` or `upsert`）。Supabase では `insert` + `onConflict` が簡潔。

3. **UI 更新**
   - レスポンスで最新カウントとユーザーの選択を返し、`setCounts`/`setChoice` を更新。
   - 送信中はボタンを `disabled` にし、`VoteSkeleton` を再利用してフェッチ状態を示す。

## 5. テストとロールアウト

1. **ユニット / 結合テスト**
   - API Routes ごとに happy path / validation / missing userId 等のテストケースを作成（`@supabase/supabase-js` をモック）。
   - Hooks/ページは Playwright Component テストで投稿 → 投票までのフローを自動化。

2. **段階的リリース**
   - Feature flag（`NEXT_PUBLIC_ENABLE_SUPABASE` など）で `/ideas` と `/vote` の切替を制御し、動作確認後にデフォルト有効化。

3. **データ移行**
   - 既存ユーザーの `localStorage` データを Supabase へ移す必要がある場合、簡易エクスポートスクリプト（`npm run migrate-local-data`）で `/api` に一括送信するオプションを検討。

---

この計画をベースに Phase 3〜5 の実装を進めれば、`/ideas` と `/vote` の体験を Supabase バックエンドへスムーズに移行できます。
