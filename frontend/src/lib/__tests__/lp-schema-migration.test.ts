/**
 * Unit tests — lib/lp-schema-migration.ts
 */
import { describe, it, expect } from 'vitest'
import { migrateLpStructure } from '@/lib/lp-schema-migration'

describe('migrateLpStructure', () => {
  it('v0.2構造はそのまま返す', () => {
    const v2 = {
      schemaVersion: '0.2' as const,
      meta: { title: 'テスト', description: '', ctaLabel: 'CTA', ctaUrl: 'https://example.com' },
      sections: [{ id: 'abc', type: 'hero' as const, variant: 'minimal', heading: '見出し' }],
    }
    const result = migrateLpStructure(v2)
    expect(result.schemaVersion).toBe('0.2')
    expect(result.sections[0]!.id).toBe('abc')
  })

  it('v0.1構造をv0.2に変換する', () => {
    const v1 = {
      schemaVersion: '0.1',
      meta: {
        title: '講座LP',
        description: '説明文',
        ctaLabel: '申し込む',
        ctaUrl: 'https://example.com',
      },
      sections: [
        { type: 'hero', heading: 'ヒーロー見出し', body: '本文' },
        { type: 'features', heading: 'ベネフィット', items: [{ heading: '特徴1', body: '詳細1' }] },
        { type: 'faq', heading: 'FAQ', items: [{ heading: 'Q1', body: 'A1' }] },
      ],
    }
    const result = migrateLpStructure(v1)
    expect(result.schemaVersion).toBe('0.2')
    expect(result.meta.title).toBe('講座LP')
    expect(result.sections).toHaveLength(3)
    expect(result.sections[0]!.type).toBe('hero')
    expect(result.sections[1]!.type).toBe('benefits') // features → benefits
    expect(result.sections[2]!.type).toBe('faq')
    // 各セクションにidが付与される
    result.sections.forEach((s) => {
      expect(typeof s.id).toBe('string')
      expect(s.id!.length).toBeGreaterThan(0)
    })
    // variantがデフォルト設定される
    expect(result.sections[0]!.variant).toBe('minimal')
  })

  it('v0.1でsectionsが空の場合、heroセクションを1つ追加する', () => {
    const v1 = {
      schemaVersion: '0.1',
      meta: { title: '', description: '', ctaLabel: '', ctaUrl: '' },
      sections: [],
    }
    const result = migrateLpStructure(v1)
    expect(result.sections).toHaveLength(1)
    expect(result.sections[0]!.type).toBe('hero')
  })

  it('不正なデータはデフォルト構造を返す', () => {
    const result = migrateLpStructure(null)
    expect(result.schemaVersion).toBe('0.2')
    expect(result.sections.length).toBeGreaterThanOrEqual(1)
  })

  it('不正なデータ(文字列)はデフォルト構造を返す', () => {
    const result = migrateLpStructure('invalid')
    expect(result.schemaVersion).toBe('0.2')
  })

  it('v0.1のctaはcta_bannerにマッピングされる', () => {
    const v1 = {
      schemaVersion: '0.1',
      meta: { title: '', description: '', ctaLabel: '申し込む', ctaUrl: '' },
      sections: [{ type: 'cta', heading: 'CTA見出し' }],
    }
    const result = migrateLpStructure(v1)
    expect(result.sections[0]!.type).toBe('cta_banner')
  })
})
