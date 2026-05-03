/**
 * 公開前バリデーション（サーバーサイド専用）
 * 景表法・薬機法リスクワードチェック + 構造チェック
 * NOTE: このファイルは publishLp() Server Action 内でのみ使用する
 */
import type { LpStructure, ValidationIssue } from '@/types/lp'
import words from './prohibited-words.json'

const WARNING_WORDS: string[] = [
  ...words.warning.keihyouhou,
  ...words.warning.yakukihou,
]

/** セクション内の全テキストを結合して返す */
function extractSectionText(section: LpStructure['sections'][number]): string {
  const parts: string[] = []
  if (section.heading) parts.push(section.heading)
  if (section.body) parts.push(section.body)
  if (section.items) {
    for (const item of section.items) {
      parts.push(item.heading, item.body)
    }
  }
  if (section.cta?.label) parts.push(section.cta.label)
  return parts.join(' ')
}

/**
 * LP構造の公開前バリデーションを実行する。
 * @returns ValidationIssue[] — エラー/警告の配列。空配列なら問題なし。
 */
export function validateLpForPublish(structure: LpStructure): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // [error] CTAが存在しない
  const hasCta =
    (structure.meta.ctaUrl && structure.meta.ctaUrl.trim().length > 0) ||
    structure.sections.some((s) => s.cta?.url && s.cta.url.trim().length > 0)

  if (!hasCta) {
    issues.push({
      level: 'error',
      code: 'CTA_MISSING',
      message: 'CTAボタンのURLが設定されていません。公開前に設定してください。',
    })
  }

  // [warning] タイトルが長すぎる（スマホ折り返しリスク）
  if (structure.meta.title.length > 30) {
    issues.push({
      level: 'warning',
      code: 'TITLE_TOO_LONG',
      message: `タイトルが${structure.meta.title.length}文字です。スマートフォンで折り返しが発生する可能性があります（推奨: 30文字以内）。`,
    })
  }

  // [warning] 景表法・薬機法リスクワード
  for (const section of structure.sections) {
    const text = extractSectionText(section)
    for (const word of WARNING_WORDS) {
      if (text.includes(word)) {
        issues.push({
          level: 'warning',
          code: 'PROHIBITED_WORD',
          message: `「${word}」は景品表示法・薬機法上リスクのある表現です。表現を見直すことを推奨します。`,
          sectionId: section.id,
        })
        break // セクションごとに1件まで（重複排除）
      }
    }
  }

  return issues
}
