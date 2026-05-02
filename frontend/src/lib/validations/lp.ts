import { z } from 'zod'
import type { LpCategory } from '@/types/lp'

export const LP_CATEGORIES = [
  'coaching',
  'creative-service',
  'photography-branding',
] as const satisfies LpCategory[]

const LP_CATEGORY_LABELS: Record<LpCategory, string> = {
  coaching: 'オンライン講座・コーチング',
  'creative-service': '受託制作（Web・デザイン・動画）',
  'photography-branding': '写真撮影・ブランディング支援',
}

/** プロジェクト作成スキーマ */
export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(120, 'タイトルは120文字以内で入力してください'),
  category: z.enum(LP_CATEGORIES as [LpCategory, ...LpCategory[]], {
    errorMap: () => ({ message: '業種を選択してください' }),
  }),
})

/** ドラフト保存スキーマ */
export const saveDraftSchema = z.object({
  lpStructureJson: z
    .record(z.unknown())
    .refine((v) => v !== null, { message: 'LP構造データが必要です' }),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type SaveDraftInput = z.infer<typeof saveDraftSchema>

export { LP_CATEGORY_LABELS }
