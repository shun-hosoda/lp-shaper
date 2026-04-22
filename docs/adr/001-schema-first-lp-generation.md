# ADR-001: Schema-First な LP 生成アーキテクチャを採用する

## ステータス

承認

## コンテキスト

Prompt LP Studio では、自然言語入力から LP を高速生成し、公開まで到達させる必要がある。  
一方で以下の課題がある。

- LLM に自由な HTML/CSS を生成させると、品質再現性と検証可能性が低下する
- クライアントから直接モデル API を呼ぶと、API キー露出と監査不能のリスクが高い
- ノーコード編集と AI 生成を併用するため、保存・公開の整合性保証が必要
- 収益化のため、モデルコストと公開率を同時に最適化する必要がある

## 決定

以下を最終アーキテクチャ方針として採用する。

1. **Schema-First**: LLM はコードではなく型付き `LPStructure JSON` を生成・更新する
2. **Deterministic Rendering**: 画面描画は事前定義コンポーネントと許可済み Props/Token のみで行う
3. **Server-Side Generation**: 生成処理は必ずサーバー経由で実行し、クライアント直生成を禁止する
4. **Two-Stage Validation**: 保存時・公開時の二段階バリデーションを必須化する
5. **Layered Runtime**: Experience / Intent&Planning / Policy&Validation / Composition / Rendering&Publish / Observability&Economics の 5+1 層で運用する

### 非交渉要件（MUST）

- LLM に自由な HTML/CSS を生成させない
- クライアントからモデル API を直接呼び出さない
- `type` と `props` は許可済みスキーマのみ受理する
- 外部リンクは allowlist・安全検査を通過したもののみ公開可能

### データ契約

- `LPStructure JSON` を正本データとする
- スキーマバージョンは `major.minor` で管理する
  - `minor`: 後方互換あり（既存レンダラで処理可能）
  - `major`: 後方互換なし（マイグレーション必須）

## 選択肢

### 選択肢A: LLM に HTML/CSS を直接生成させる
- **メリット**: 実装初期が速い
- **デメリット**: 品質不安定、XSS 面積増、バリデーション困難、再利用性低

### 選択肢B: 3レイヤー（Intent / Validator / Renderer）の最小構成
- **メリット**: MVP 説明がシンプル
- **デメリット**: 実運用に必要なジョブ制御・収益監視・品質改善ループが不足

### 選択肢C: 5+1 レイヤー + Schema-First（採用）
- **メリット**: 品質再現性、セキュリティ、運用監視、収益管理を両立
- **デメリット**: 初期設計・実装コストは増える

## 結果

この決定により、以下のトレードオフを受け入れる。

- 短期: 実装コストは増えるが、設計不整合の手戻りを減らせる
- 中期: 生成品質と公開品質の安定化により、継続利用率を上げやすい
- 長期: モデル差し替え・プラン別制御・コスト最適化が可能になる

### 運用KPI（追跡必須）

- `time-to-publish`
- `cost-per-generation`
- `cost-per-publish`
- `publish-rate`

### 見直し条件

- `cost-per-publish` が目標閾値を 2 週間連続で超過した場合
- 新モデル導入で Tier ルーティング戦略の優位性が崩れた場合
- 規制要件追加で Policy 層の責務変更が必要になった場合

## 参考

- docs/prd/2026-04-22_ai-lp-builder_prd.md
- docs/review/logs/2026-04-22_230500_adr-review.md
- docs/adr/logs/2026-04-22_architecture-draft-v2.md
