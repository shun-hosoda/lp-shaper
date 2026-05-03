import type { LpTemplate } from '@/types/lp'
import type { LpCategory } from '@/types/lp'

export { coachingTrial, coachingInquiry, coachingTemplates } from './coaching'
export { creativeInquiry, creativeDownload, creativeTemplates } from './creative'
export { photographyTrial, photographyTemplates } from './photography'

import { coachingTemplates } from './coaching'
import { creativeTemplates } from './creative'
import { photographyTemplates } from './photography'

export const ALL_TEMPLATES: LpTemplate[] = [
  ...coachingTemplates,
  ...creativeTemplates,
  ...photographyTemplates,
]

/**
 * IDでテンプレートを取得する
 */
export function getTemplate(id: string): LpTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id)
}

/**
 * 業種でテンプレートを絞り込む
 */
export function getTemplatesByIndustry(industry: LpCategory): LpTemplate[] {
  return ALL_TEMPLATES.filter((t) => t.industry === industry)
}
