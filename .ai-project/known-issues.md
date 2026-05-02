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

## 5. Supabase v2.103+ GenericTable型制約回避（技術的負債）

- `frontend/src/actions/lp.ts` にて `type Db = SupabaseClient<any>` + `as unknown as Db` キャストを使用。
- 原因: SDK v2.103+ の GenericTable 型制約が厳格化し、手動管理の `supabase.ts` では新テーブルのInsert操作で `type: never` エラーになる。
- 現状の型安全性の担保: Zodバリデーション（入力側）+ `satisfies` 型アサーション（戻り値側）
- 解決策候補: Supabase CLI `generate types` で自動生成した型定義に置き換える（CI組み込みが前提）。
- 優先度: Medium（MVP完了後に対応）

## 6. saveDraft の version_no 採番（楽観的ロック未対応）

- `MAX(version_no) + 1` による採番のため、同一プロジェクトへの並行 `saveDraft` 呼び出しで UNIQUE制約違反 `(project_id, version_no)` が発生する可能性がある。
- 現状: MVPユーザーは個人事業主の単一ユーザー操作が前提のため実発生リスクは極低。DB側の UNIQUE制約でデータ破損は防止される。
- 解決策候補: DBシーケンス or `SELECT ... FOR UPDATE` による排他ロック。
- 優先度: Low（ユーザー規模拡大後に対応）
