# Review Checks

## 目的

レビュー時に最低限実行する確認コマンドを定義する。

## Frontend

```bash
cd frontend
npm run lint
npm run typecheck
npm run test:run
```

必要に応じて:

```bash
cd frontend
npm run test:e2e
```

## 変更種別ごとの追加チェック

- `.ts/.tsx` 構造変更時: `npm run typecheck` は必須
- `actions/` 変更時: `npm run test:run` で該当テスト確認
- 認証系変更時: middleware・auth action のテストを優先

## 判定基準

- エラー0件であること
- 失敗テストが変更起因でないかを確認すること
