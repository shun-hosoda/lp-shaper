/**
 * Unit tests — lib/validations/lp.ts
 * [Red → Green] createProjectSchema / saveDraftSchema のバリデーション確認
 */
import { describe, it, expect } from 'vitest'
import { createProjectSchema, saveDraftSchema } from '../lp'

describe('createProjectSchema', () => {
  it('正常系: 有効なタイトルとカテゴリを受け付ける', () => {
    const result = createProjectSchema.safeParse({
      title: 'コーチング体験申込LP',
      category: 'coaching',
    })
    expect(result.success).toBe(true)
  })

  it('正常系: creative-service カテゴリを受け付ける', () => {
    const result = createProjectSchema.safeParse({
      title: 'Web制作受託LP',
      category: 'creative-service',
    })
    expect(result.success).toBe(true)
  })

  it('正常系: photography-branding カテゴリを受け付ける', () => {
    const result = createProjectSchema.safeParse({
      title: '写真撮影LP',
      category: 'photography-branding',
    })
    expect(result.success).toBe(true)
  })

  it('異常系: タイトルが空の場合はエラー', () => {
    const result = createProjectSchema.safeParse({
      title: '',
      category: 'coaching',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined()
    }
  })

  it('異常系: タイトルが120文字を超える場合はエラー', () => {
    const result = createProjectSchema.safeParse({
      title: 'a'.repeat(121),
      category: 'coaching',
    })
    expect(result.success).toBe(false)
  })

  it('異常系: 無効なカテゴリはエラー', () => {
    const result = createProjectSchema.safeParse({
      title: 'テストLP',
      category: 'invalid-category',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.category).toBeDefined()
    }
  })
})

describe('saveDraftSchema', () => {
  const validLpStructure = {
    schemaVersion: '0.1',
    meta: {
      title: 'LPタイトル',
      description: '説明文',
      ctaLabel: '今すぐ申し込む',
      ctaUrl: 'https://example.com/apply',
    },
    sections: [
      { type: 'hero', heading: 'キャッチコピー', body: 'サブコピー' },
    ],
  }

  it('正常系: 有効なLPStructureを受け付ける', () => {
    const result = saveDraftSchema.safeParse({ lpStructureJson: validLpStructure })
    expect(result.success).toBe(true)
  })

  it('異常系: lpStructureJson が未定義の場合はエラー', () => {
    const result = saveDraftSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('異常系: lpStructureJson が null の場合はエラー', () => {
    const result = saveDraftSchema.safeParse({ lpStructureJson: null })
    expect(result.success).toBe(false)
  })
})
