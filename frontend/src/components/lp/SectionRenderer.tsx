import type { LpSection, LpMeta } from '@/types/lp'
import { HeroSection } from './HeroSection'
import { BenefitsSection } from './BenefitsSection'
import { SocialProofSection } from './SocialProofSection'
import { TestimonialsSection } from './TestimonialsSection'
import { FaqSection } from './FaqSection'
import { CtaBannerSection } from './CtaBannerSection'

interface Props {
  section: LpSection
  meta: Pick<LpMeta, 'ctaLabel' | 'ctaUrl'>
  isMobile?: boolean
}

export function SectionRenderer({ section, meta, isMobile }: Props) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} meta={meta} isMobile={isMobile} />
    case 'benefits':
      return <BenefitsSection section={section} isMobile={isMobile} />
    case 'social_proof':
      return <SocialProofSection section={section} isMobile={isMobile} />
    case 'testimonials':
      return <TestimonialsSection section={section} isMobile={isMobile} />
    case 'faq':
      return <FaqSection section={section} isMobile={isMobile} />
    case 'cta_banner':
      return <CtaBannerSection section={section} meta={meta} isMobile={isMobile} />
    case 'pricing':
      // 将来フェーズで実装
      return (
        <section className="px-8 py-14 bg-white text-center text-slate-400 text-sm">
          [pricing section — coming soon]
        </section>
      )
    default:
      return null
  }
}
