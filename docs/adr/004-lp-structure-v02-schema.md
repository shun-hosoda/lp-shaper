# ADR-004: LpStructure v0.2 スキーマ設計（セクションレジストリ方式）

## ステータス

承認

## コンテキスト

- 現行 `LpStructure` v0.1 は hero セクションのフィールドがメタ情報にフラットに混在しており、セクション追加のたびに型定義・フォーム・プレビューを個別修正する必要がある。
- 市場分析より「業種×目的のテンプレート選択」と「日本型PASONA構造（縦長 × 複数セクション）」への対応が不可欠と判断。
- LLM生成導入前に、セクション配列ベースの拡張可能なスキーマ基盤を確立する必要がある。

## 決定

`LpStructure` を v0.2 に移行し、以下の変更を採用する。

### 変更点

| 項目 | v0.1 | v0.2 |
|------|------|------|
| schemaVersion | `string` | `'0.2'` リテラル |
| セクション構造 | `sections: LpSection[]`（型はあるが hero フラットフィールドと混在） | セクション配列に完全移行、hero 固有フィールドを sections[] に集約 |
| LpSection.id | なし | `string`（nanoid。並び順管理用） |
| LpSection.variant | なし | `string`（セクション内レイアウト選択） |
| LpSection.cta | なし | `{ label: string; url: string } \| undefined` |
| テンプレート型 | なし | `LpTemplate`（業種×目的×framework定義） |
| バリデーション型 | なし | `ValidationIssue`（景表法・CTA欠落チェック） |
| framework | なし | `'PASONA' \| 'SDS' \| 'AIDA' \| 'custom' \| undefined` |

### セクション種別（SectionType）

| 種別 | 説明 | 実装フェーズ |
|------|------|------------|
| `hero` | ファーストビュー | ✅ 既存（移植） |
| `benefits` | ベネフィット3点訴求 | 今フェーズ |
| `social_proof` | 数字・実績 | 今フェーズ |
| `testimonials` | お客様の声 | 今フェーズ |
| `faq` | よくある質問 | 今フェーズ |
| `cta_banner` | 中間・末尾CTA | 今フェーズ |
| `pricing` | 料金プラン | 将来フェーズ |

### 後方互換

既存の v0.1 データは `migrateLpStructure()` 関数で自動変換する。
- `page_versions.lp_structure_json` のロード時に適用
- DB スキーマ変更なし（JSONB で吸収）

### テンプレートレジストリ

- 管理方法：コード（`frontend/src/lib/templates/`）
- 対象：3業種（coaching / creative-service / photography-branding）× 2〜3テンプレート
- `isFree: boolean` を型に含め、将来の有料テンプレート拡張に備える

### 公開前バリデーション

- `lp-publish.ts` に景表法リスクワードチェックと CTA 存在チェックを実装
- `publishLp()` Server Action 内で実行（クライアントバイパス不可）
- エラー時は公開をブロック、警告は表示のみ

## 結果

### メリット
- セクション追加がコンポーネント1ファイル追加で完結する拡張性
- テンプレートにより `time-to-first-publish` の大幅短縮が見込める
- 景表法チェックにより法的リスクによる解約を防止
- LLM 導入時はフォームフィールド自動入力として自然に統合できる

### デメリット・リスク
- v0.1 → v0.2 の migration 関数のテストが必要
- セクションコンポーネントの実装量が多い（6種類）

## 選択肢

### 選択肢A: v0.1 のままセクションを追加（無視）
- **却下理由**: hero フラットフィールドとの二重管理が続き、LLM 統合時に型が破綻する

### 選択肢B: DB に sections テーブルを作る
- **却下理由**: JOIN が増えて複雑度が上がる。JSONB で十分な柔軟性があり、将来の A/B テストも JSONパッチで対応可能
