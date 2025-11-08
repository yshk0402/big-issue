# GOAT — Community Driven App Platform

GOAT は、**ユーザー投票によってプロダクトの進化方針が決まる、完全民主制のアプリ・プラットフォーム**です。  
「Auth を作るべきか？」「次に何を実装すべきか？」など、すべての意思決定をコミュニティが行います。

提案投稿やコメント、Big Issue 投票は現在 Supabase に保存され、ブラウザやデバイスを跨いでも同じデータを共有できます。

---

## ✅ 技術スタック

| 項目 | 使用技術 |
|------|----------|
| Frontend | Next.js 14（App Router） |
| Styling | Tailwind CSS |
| State / Data | React Hooks + Supabase |
| Icons | Material Symbols Outlined |
| Images | next/image |
| Build / Deploy | Vercel 推奨 |

---

## ✅ 機能一覧

### ### 1. Users' Proposals（ユーザー提案）
- 匿名ユーザーとして提案を投稿（Supabase に保存）
- ランダム生成のハンドルネーム（例：`023 Comet`）
- 提案の一覧表示（新しい順）
- Upvote / Downvote（API 経由で集計）
- コメント数のカウント

### ### 2. コメント機能
- コメントモーダル表示（固定サイズ）
- 新しいコメントが上に積み上がる
- Supabase にて提案ごとに保存
- UI は GOAT テーマに合わせて統一

### ### 3. Big Issue（サイト運営側が設定する大質問）
- Yes/No（Agree/Disagree）投票
- 1 ブラウザ 1 票（ブラウザ生成の UUID を保存）
- グラフ表示（API レスポンスをリアルタイムに反映）

### ### 4. Sidebar（共通 UI）
- Home
- Users' Proposals
- Big Issue
- ロゴクリックで Home へ遷移
- ロゴは `/public/logo.png` に配置

---

## ✅ ディレクトリ構成（主要部分）

project-root/
├─ app/
│ ├─ page.tsx # Home
│ ├─ ideas/page.tsx # Users’ Proposals
│ ├─ vote/page.tsx # Big Issue
│ └─ components/
│ └─ Sidebar.tsx
│
├─ public/
│ ├─ favicon.ico
│ └─ logo.png # サイドバーのロゴ
│
├─ README.md
└─ package.json

yaml
コードをコピーする

---

## ✅ ローカル開発

1. 依存インストール
   ```bash
   npm install
   ```
2. Supabase の環境変数を `big-issue/.env.local` に設定
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...your project url...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...your anon key...
   ```
3. 開発サーバー起動
   ```bash
   npm run dev
   ```
4. ブラウザで確認: http://localhost:3000

---

## ✅ Git 設定

このプロジェクトに貢献する際は、以下のGitユーザー情報を設定してください。

```bash
git config user.name "YSato"
git config user.email "user@example.com" 
```

---

## ✅ デプロイ（Vercel）

1. GitHub リポジトリを作成  
2. Vercel に接続し Deploy  
3. 特別な設定不要（標準の Next.js 設定で動く）

---

## ✅ 今後のバックエンド化（設計案）

現在は Supabase を利用していますが、以下のように段階的に拡張可能です。

### **✅ Phase 1: Supabase or Firebase 導入**
- 提案、投票、コメントを DB 化
- 匿名ユーザー ID 生成

### **✅ Phase 2: 認証（Auth）導入**
- Magic Link / Google Sign-in
- ユーザーごとの投票制限を厳格化

### **✅ Phase 3: API 化**
- `/api/proposals`
- `/api/comments`
- `/api/votes`

### **✅ Phase 4: リアルタイム化**
- Supabase Realtime
- Live 更新（コメント・投票グラフ）

---

## ✅ 開発者用メモ

- UI はすべて Tailwind ベースで統一
- Proposal / Comments / Votes の key は **idea.id** で管理
- Big Issue は **将来複数化も可能な設計**

---

## ✅ ライセンス

オープンソース（MIT）または private に応じて後で設定。

---

## ✅ 作者

- **YSato / GOAT App Development**  
- サイドバー、投票 UI、アイコンデザイン、全体構成：独自実装  

---
