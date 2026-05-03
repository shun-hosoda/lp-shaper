/** LP Builderのドメイン型定義 — v0.2 (ADR-004) */

/** 業種カテゴリ（初期3業種 — ADR-002） */
export type LpCategory =
  | 'coaching'
  | 'creative-service'
  | 'photography-branding'

/** LP作成目標 */
export type LpGoal = 'trial_booking' | 'inquiry' | 'download'

/** セクション種別 */
export type SectionType =
  | 'hero'
  | 'benefits'
  | 'social_proof'
  | 'testimonials'
  | 'faq'
  | 'cta_banner'
  | 'pricing' // 型定義のみ、実装は将来フェーズ

/** LPフレームワーク */
export type LpFramework = 'PASONA' | 'SDS' | 'AIDA' | 'custom'

/** プロジェクトのステータス */
export type ProjectStatus = 'draft' | 'published'

/** ページバージョンの状態 */
export type PageVersionState = 'draft' | 'published'

/** セクション内繰り返し要素 */
export interface LpSectionItem {
  heading: string
  body: string
  icon?: string
}

/** セクション（v0.2） */
export interface LpSection {
  id?: string
  type: SectionType
  variant: string
  heading?: string
  body?: string
  items?: LpSectionItem[]
  cta?: { label: string; url: string }
}

/** LP メタ情報 */
export interface LpMeta {
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
}

/** LP構造JSON（ADR-004 Schema-First — v0.2） */
export interface LpStructure {
  schemaVersion: '0.2'
  framework?: LpFramework
  meta: LpMeta
  sections: LpSection[]
}

/** LP テンプレート */
export interface LpTemplate {
  id: string
  name: string
  description: string
  industry: LpCategory
  goal: LpGoal
  framework: LpFramework
  isFree: boolean
  defaultSections: Omit<LpSection, 'id'>[]
}

/** 公開前バリデーション結果 */
export interface ValidationIssue {
  level: 'error' | 'warning'
  code: string
  message: string
  sectionId?: string
}

/** LPプロジェクト */
export interface LpProject {
  id: string
  ownerUserId: string
  title: string
  category: LpCategory
  status: ProjectStatus
  publishedUrl: string | null
  createdAt: string
  updatedAt: string
}

/** ページバージョン */
export interface PageVersion {
  id: string
  projectId: string
  versionNo: number
  state: PageVersionState
  lpStructureJson: LpStructure
  createdAt: string
}

/** Server Action戻り値 */
export type ActionResult<T> = { data: T } | { error: string; issues?: ValidationIssue[] }
