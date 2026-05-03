/**
 * LP構造JSONのスキーマ移行ユーティリティ
 * v0.1（フラットフィールド）→ v0.2（sections[]配列）への変換
 */
import type { LpStructure, LpSection, LpMeta } from '@/types/lp'

const DEFAULT_META: LpMeta = {
  title: '',
  description: '',
  ctaLabel: '今すぐ申し込む',
  ctaUrl: '',
}

const DEFAULT_STRUCTURE: LpStructure = {
  schemaVersion: '0.2',
  meta: DEFAULT_META,
  sections: [
    {
      id: crypto.randomUUID(),
      type: 'hero',
      variant: 'minimal',
      heading: '',
      body: '',
    },
  ],
}

/** v0.1フォーマットの型（移行専用） */
interface LpStructureV1 {
  schemaVersion: string
  meta?: {
    title?: string
    description?: string
    ctaLabel?: string
    ctaUrl?: string
    [key: string]: unknown
  }
  sections?: Array<{
    type?: string
    heading?: string
    body?: string
    items?: Array<{ heading: string; body: string }>
  }>
  [key: string]: unknown
}

function isV2Structure(json: unknown): json is LpStructure {
  return (
    typeof json === 'object' &&
    json !== null &&
    (json as Record<string, unknown>)['schemaVersion'] === '0.2'
  )
}

function isV1Structure(json: unknown): json is LpStructureV1 {
  return (
    typeof json === 'object' &&
    json !== null &&
    typeof (json as Record<string, unknown>)['schemaVersion'] === 'string'
  )
}

function migrateSection(s: NonNullable<LpStructureV1['sections']>[number]): LpSection {
  // v0.1の type 名を v0.2 にマッピング
  const typeMap: Record<string, LpSection['type']> = {
    hero: 'hero',
    features: 'benefits',
    testimonials: 'testimonials',
    faq: 'faq',
    cta: 'cta_banner',
  }
  const type = typeMap[s.type ?? ''] ?? 'hero'

  return {
    id: crypto.randomUUID(),
    type,
    variant: 'minimal',
    heading: s.heading,
    body: s.body,
    items: s.items,
  }
}

/**
 * 任意のJSONをLpStructure v0.2に変換する。
 * - v0.2はそのまま返す
 * - v0.1は変換する
 * - 不正なデータはデフォルト構造を返す
 */
export function migrateLpStructure(json: unknown): LpStructure {
  if (isV2Structure(json)) {
    return json
  }

  if (!isV1Structure(json)) {
    return { ...DEFAULT_STRUCTURE, sections: [{ ...DEFAULT_STRUCTURE.sections[0]!, id: crypto.randomUUID() }] }
  }

  const meta: LpMeta = {
    title: String(json.meta?.title ?? ''),
    description: String(json.meta?.description ?? ''),
    ctaLabel: String(json.meta?.ctaLabel ?? '今すぐ申し込む'),
    ctaUrl: String(json.meta?.ctaUrl ?? ''),
  }

  const sections: LpSection[] =
    Array.isArray(json.sections) && json.sections.length > 0
      ? json.sections.map(migrateSection)
      : [{ id: crypto.randomUUID(), type: 'hero', variant: 'minimal', heading: '', body: '' }]

  return {
    schemaVersion: '0.2',
    meta,
    sections,
  }
}
