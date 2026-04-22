# Known Issues

## 1. 生成物ファイルの配置揺れ

- PRD/ADRのドラフトが `docs/adr` に混在しやすい。
- 対策: 確定ADRは `docs/adr` 直下、ドラフトは `docs/adr/logs` へ保存。

## 2. 実行環境のポート競合

- 開発時に `3000` と `3100` の混在が発生しやすい。
- 対策: `frontend/package.json` の dev スクリプト、`.env.local` の URL整合を確認。

## 3. レビュー記録の保存先分散

- `docs/review/logs` と `docs/adr/review-log` の2系統が存在。
- 対策: ADRレビューは `docs/adr/review-log` を正本として保持。

## 4. git push時の警告

- `credential-manager-core` 警告が表示されるが、push自体は成功する場合あり。
- 対策: 実際の push 成否をリモート反映で確認する。
