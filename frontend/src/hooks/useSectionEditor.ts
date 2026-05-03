import { useState, useCallback } from 'react'
import type { LpSection, SectionType } from '@/types/lp'

function makeSection(type: SectionType): LpSection {
  return {
    id: crypto.randomUUID(),
    type,
    variant: 'minimal',
    heading: '',
    body: '',
  }
}

/**
 * sections[] 配列の編集操作をまとめた hook
 */
export function useSectionEditor(initialSections: LpSection[] = []) {
  const [sections, setSections] = useState<LpSection[]>(initialSections)

  /** セクション全体を置き換え */
  const resetSections = useCallback((next: LpSection[]) => {
    setSections(next)
  }, [])

  /** 特定フィールドを更新 */
  const updateSection = useCallback((id: string, patch: Partial<LpSection>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    )
  }, [])

  /** 上方向に移動 */
  const moveUp = useCallback((id: string) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx <= 0) return prev
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx]!, next[idx - 1]!]
      return next
    })
  }, [])

  /** 下方向に移動 */
  const moveDown = useCallback((id: string) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx < 0 || idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1]!, next[idx]!]
      return next
    })
  }, [])

  /** セクションを追加（末尾） */
  const addSection = useCallback((type: SectionType) => {
    setSections((prev) => [...prev, makeSection(type)])
  }, [])

  /** セクションを削除 */
  const removeSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return {
    sections,
    resetSections,
    updateSection,
    moveUp,
    moveDown,
    addSection,
    removeSection,
  }
}
