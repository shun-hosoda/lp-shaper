# Startup Checklist

セッション開始時に実施する確認項目。

## 1) ドキュメント確認

- `CLAUDE.md` を読む
- `.ai-project/context.md` を読む
- 直近の確定ADRを読む（`docs/adr/001-schema-first-lp-generation.md`）

## 2) ワークツリー確認

```bash
git status --short
git log --oneline -5
```

## 3) 実行環境確認（必要時）

- Docker構成が必要な作業か確認
- Frontend作業なら `frontend` 配下で依存とスクリプトを確認

## 4) 作業分類（ゲート）

- Hotfix / Minor / Standard / Major を宣言
- Standard以上は設計・レビュー工程を経る

## 5) 完了前チェック

- 変更範囲が要求に一致している
- 不要ファイルが混入していない
- ログ/ドキュメント更新先が正しい
