/**
 * Unit tests — hooks/useSectionEditor.ts
 */
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSectionEditor } from '@/hooks/useSectionEditor'
import type { LpSection } from '@/types/lp'

function makeSection(id: string, override?: Partial<LpSection>): LpSection {
  return { id, type: 'hero', variant: 'minimal', heading: 'テスト', ...override }
}

describe('useSectionEditor', () => {
  it('初期sectionsが正しくセットされる', () => {
    const initial = [makeSection('s1'), makeSection('s2')]
    const { result } = renderHook(() => useSectionEditor(initial))
    expect(result.current.sections).toHaveLength(2)
    expect(result.current.sections[0]!.id).toBe('s1')
  })

  it('updateSection: 特定セクションのheadingを更新する', () => {
    const { result } = renderHook(() => useSectionEditor([makeSection('s1'), makeSection('s2')]))
    act(() => {
      result.current.updateSection('s1', { heading: '更新後' })
    })
    expect(result.current.sections[0]!.heading).toBe('更新後')
    expect(result.current.sections[1]!.heading).toBe('テスト')
  })

  it('moveUp: 2番目を1番目に移動する', () => {
    const { result } = renderHook(() =>
      useSectionEditor([makeSection('s1'), makeSection('s2'), makeSection('s3')])
    )
    act(() => { result.current.moveUp('s2') })
    expect(result.current.sections[0]!.id).toBe('s2')
    expect(result.current.sections[1]!.id).toBe('s1')
    expect(result.current.sections[2]!.id).toBe('s3')
  })

  it('moveUp: 先頭は変化しない', () => {
    const { result } = renderHook(() => useSectionEditor([makeSection('s1'), makeSection('s2')]))
    act(() => { result.current.moveUp('s1') })
    expect(result.current.sections[0]!.id).toBe('s1')
  })

  it('moveDown: 1番目を2番目に移動する', () => {
    const { result } = renderHook(() =>
      useSectionEditor([makeSection('s1'), makeSection('s2'), makeSection('s3')])
    )
    act(() => { result.current.moveDown('s1') })
    expect(result.current.sections[0]!.id).toBe('s2')
    expect(result.current.sections[1]!.id).toBe('s1')
  })

  it('addSection: 末尾にセクションが追加される', () => {
    const { result } = renderHook(() => useSectionEditor([makeSection('s1')]))
    act(() => { result.current.addSection('benefits') })
    expect(result.current.sections).toHaveLength(2)
    expect(result.current.sections[1]!.type).toBe('benefits')
    expect(typeof result.current.sections[1]!.id).toBe('string')
  })

  it('removeSection: 指定IDが削除される', () => {
    const { result } = renderHook(() =>
      useSectionEditor([makeSection('s1'), makeSection('s2'), makeSection('s3')])
    )
    act(() => { result.current.removeSection('s2') })
    expect(result.current.sections).toHaveLength(2)
    expect(result.current.sections.find((s) => s.id === 's2')).toBeUndefined()
  })

  it('resetSections: 配列全体を置き換える', () => {
    const { result } = renderHook(() => useSectionEditor([makeSection('s1')]))
    act(() => {
      result.current.resetSections([makeSection('x1'), makeSection('x2')])
    })
    expect(result.current.sections).toHaveLength(2)
    expect(result.current.sections[0]!.id).toBe('x1')
  })
})
