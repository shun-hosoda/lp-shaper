/**
 * Unit tests — lib/validations/lp-publish.ts
 */
import { describe, it, expect } from 'vitest'
import { validateLpForPublish } from '@/lib/validations/lp-publish'
import type { LpStructure } from '@/types/lp'

const baseStructure: LpStructure = {
  schemaVersion: '0.2',
  meta: {
    title: '体験レッスン申込',
    description: '説明文',
    ctaLabel: '今すぐ申し込む',
    ctaUrl: 'https://example.com/apply',
  },
  sections: [
    {
      id: 'sec-1',
      type: 'hero',
      variant: 'minimal',
      heading: 'あなたの目標を達成する',
      body: '初回体験無料でお試しいただけます',
    },
  ],
}

describe('validateLpForPublish', () => {
  it('正常なstructureはissues: []を返す', () => {
    const issues = validateLpForPublish(baseStructure)
    expect(issues).toHaveLength(0)
  })

  it('CTAのURLが空の場合、CTA_MISSINGエラーを返す', () => {
    const structure: LpStructure = {
      ...baseStructure,
      meta: { ...baseStructure.meta, ctaUrl: '' },
    }
    const issues = validateLpForPublish(structure)
    expect(issues.some((i) => i.code === 'CTA_MISSING' && i.level === 'error')).toBe(true)
  })

  it('セクションにCTA URLがある場合はCTA_MISSINGを出さない', () => {
    const structure: LpStructure = {
      ...baseStructure,
      meta: { ...baseStructure.meta, ctaUrl: '' },
      sections: [
        {
          ...baseStructure.sections[0]!,
          cta: { label: '申し込む', url: 'https://example.com' },
        },
      ],
    }
    const issues = validateLpForPublish(structure)
    expect(issues.some((i) => i.code === 'CTA_MISSING')).toBe(false)
  })

  it('禁止ワード「最高」を含む場合、PROHIBITED_WORDのwarningを返す', () => {
    const structure: LpStructure = {
      ...baseStructure,
      sections: [
        { ...baseStructure.sections[0]!, heading: '最高のコーチングを体験' },
      ],
    }
    const issues = validateLpForPublish(structure)
    expect(issues.some((i) => i.code === 'PROHIBITED_WORD' && i.level === 'warning')).toBe(true)
    expect(issues.find((i) => i.code === 'PROHIBITED_WORD')?.sectionId).toBe('sec-1')
  })

  it('禁止ワード「必ず治る」を含む場合、PROHIBITED_WORDのwarningを返す', () => {
    const structure: LpStructure = {
      ...baseStructure,
      sections: [
        { ...baseStructure.sections[0]!, body: 'このサプリで必ず治る' },
      ],
    }
    const issues = validateLpForPublish(structure)
    expect(issues.some((i) => i.code === 'PROHIBITED_WORD')).toBe(true)
  })

  it('タイトルが30字を超える場合、TITLE_TOO_LONGのwarningを返す', () => {
    const structure: LpStructure = {
      ...baseStructure,
      meta: { ...baseStructure.meta, title: 'あ'.repeat(31) },
    }
    const issues = validateLpForPublish(structure)
    expect(issues.some((i) => i.code === 'TITLE_TOO_LONG' && i.level === 'warning')).toBe(true)
  })

  it('warningのみの場合はerrorがない', () => {
    const structure: LpStructure = {
      ...baseStructure,
      sections: [
        { ...baseStructure.sections[0]!, heading: '世界一のコーチング' },
      ],
    }
    const issues = validateLpForPublish(structure)
    const errors = issues.filter((i) => i.level === 'error')
    expect(errors).toHaveLength(0)
  })

  it('各セクションで禁止ワードが複数あっても1セクション1件のみ返す', () => {
    const structure: LpStructure = {
      ...baseStructure,
      sections: [
        {
          ...baseStructure.sections[0]!,
          heading: '最高で世界一のサービス',
          body: '絶対に成功する',
        },
      ],
    }
    const issues = validateLpForPublish(structure)
    const prohibited = issues.filter((i) => i.code === 'PROHIBITED_WORD')
    expect(prohibited).toHaveLength(1)
  })
})
