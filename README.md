# lp-shaper

個人事業主向け AI LP 生成 SaaS。ヒアリング → LP 生成 → 公開 → CV 改善サイクルを自動化する。

---

## テストアカウント

| 項目 | 値 |
|------|-----|
| メールアドレス | `test@example.com` |
| パスワード | `Test1234!` |

> ローカル開発環境専用アカウントです。本番環境では使用しないでください。

---

## 起動手順

### 前提条件

- Docker Desktop が起動していること
- Node.js 20+ がインストールされていること

### 1. 環境変数の設定

```bash
# Supabase / Docker 用
cp infra/docker/.env.example infra/docker/.env
# 必要に応じて .env を編集（ローカル開発はデフォルト値のまま動作する）

# フロントエンド用
cp frontend/.env.local.example frontend/.env.local
# 存在しない場合は以下の内容で作成する
```

**`frontend/.env.local`** の内容:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8100
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
NEXT_PUBLIC_APP_URL=http://localhost:3100
```

### 2. Supabase（DB・Auth）を起動

```bash
cd infra/docker
docker compose -f docker-compose.auth.yml up -d
```

初回起動時は `db-migrate` サービスが自動的にマイグレーションを実行します。  
起動完了まで約 30 秒かかります。

```bash
# 起動確認
docker compose -f docker-compose.auth.yml ps
```

### 3. フロントエンドを起動

```bash
cd frontend
npm install
npm run dev
```

ブラウザで [http://localhost:3100](http://localhost:3100) を開きます。

---

## サービス一覧

| サービス | URL | 説明 |
|---------|-----|------|
| フロントエンド | http://localhost:3100 | Next.js アプリ |
| Supabase API (Kong) | http://localhost:8100 | Auth / DB API ゲートウェイ |
| Inbucket（メール確認） | http://localhost:9000 | ローカルメール受信ボックス |

---

## 主要コマンド

```bash
# テスト実行
cd frontend
npm run test:run          # ユニットテスト（全件）
npm run typecheck         # TypeScript 型チェック
npm run test:coverage     # カバレッジレポート生成

# コンテナ停止
cd infra/docker
docker compose -f docker-compose.auth.yml down

# コンテナ + DB データ削除（完全リセット）
docker compose -f docker-compose.auth.yml down -v
```

---

## ディレクトリ構成

```
.
├── frontend/          # Next.js アプリ（App Router + TypeScript）
│   └── src/
│       ├── app/       # ページ・ルート
│       ├── actions/   # Server Actions（LP Builder CRUD）
│       ├── components/# UI コンポーネント
│       ├── lib/       # Supabase クライアント・Zod バリデーション
│       └── types/     # 型定義
├── infra/
│   └── docker/        # Docker Compose・DB マイグレーション
├── docs/
│   ├── prd/           # プロダクト要件定義書
│   ├── adr/           # アーキテクチャ決定記録
│   ├── api/           # OpenAPI 仕様
│   └── db/            # DB スキーマ
└── .ai-project/       # AI 開発設定（コンテキスト・既知の問題）
```

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| 認証 / DB | Supabase (PostgreSQL + GoTrue), Row Level Security |
| バリデーション | Zod |
| テスト | Vitest, Playwright |
| インフラ | Docker Compose |
