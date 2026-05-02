# Project Context

## 概要

- プロジェクト名: lp-shaper
- 目的: 自然言語からLPを生成・編集・公開し、CV改善サイクルを高速化する
- 初期ターゲット業種: BtoC（個人事業主向け）初期3業種

## 技術スタック（現状）

- Frontend: Next.js (App Router), TypeScript, Tailwind
- テスト: Vitest, Playwright
- Backend: `backend/src` 配下（API/Service/Model構成）
- Infra: Docker Compose（Supabase/Auth検証構成あり）

## ディレクトリ要点

- `frontend/src/app`: 画面ルーティング
- `frontend/src/components`: UIコンポーネント
- `frontend/src/actions`: Server Actions
- `frontend/src/lib`: Supabase/Validationユーティリティ
- `docs/prd`: 要件定義
- `docs/adr`: アーキテクチャ決定記録
- `docs/adr/review-log`: ADRレビュー履歴

## 設計上の非交渉要件

1. LLMは構造化JSONのみを生成・更新する
2. クライアントからモデルAPIを直接呼ばない
3. 自由CSS生成は禁止し、許可済みコンポーネント/Propsのみ使う
4. 保存時・公開時の二段階バリデーションを行う

## 進行中の優先事項

- 個人事業主向けMVPの価値検証（公開速度・公開率・有料化率）
- 初期3業種（講座/受託制作/撮影・ブランディング）向けテンプレート3本（体験申込、相談予約、資料DL）の改善ループ
- cost-per-publish の監視とモデルルーティング最適化
