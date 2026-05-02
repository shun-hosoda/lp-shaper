/** LP Builderのドメイン型定義 */

/** 業種カテゴリ（初期3業種 — ADR-002） */
export type LpCategory =
  | 'coaching'
  | 'creative-service'
  | 'photography-branding'

/** プロジェクトのステータス */
export type ProjectStatus = 'draft' | 'published'

/** ページバージョンの状態 */
export type PageVersionState = 'draft' | 'published'

/** LP構造JSON（ADR-001 Schema-First — v0.1） */
export interface LpStructure {
  schemaVersion: string
  meta: {
    title: string
    description: string
    ctaLabel: string
    ctaUrl: string
    [key: string]: unknown
  }
  sections: LpSection[]
  [key: string]: unknown
}

export interface LpSection {
  type: 'hero' | 'features' | 'testimonials' | 'faq' | 'cta'
  heading?: string
  body?: string
  items?: LpSectionItem[]
}

export interface LpSectionItem {
  heading: string
  body: string
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
export type ActionResult<T> = { data: T } | { error: string }
