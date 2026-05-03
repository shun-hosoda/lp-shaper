import type { LpSection, LpMeta } from '@/types/lp'

interface Props {
  section: LpSection
  meta: Pick<LpMeta, 'ctaLabel' | 'ctaUrl'>
  isMobile?: boolean
}

export function HeroSection({ section, meta, isMobile }: Props) {
  const ctaLabel = section.cta?.label || meta.ctaLabel || '申し込む'
  const ctaUrl = section.cta?.url || meta.ctaUrl

  return (
    <section
      className={`bg-gradient-to-br from-indigo-600 to-indigo-800 text-white text-center
        ${isMobile ? 'px-4 py-12' : 'px-8 py-16'}`}
    >
      {section.heading && (
        <h1
          className={`font-bold leading-snug mb-4 whitespace-pre-wrap
            ${isMobile ? 'text-xl' : 'text-3xl'}`}
        >
          {section.heading}
        </h1>
      )}
      {section.body && (
        <p className={`text-indigo-100 leading-relaxed mx-auto mb-8 max-w-md
          ${isMobile ? 'text-sm' : 'text-base'}`}>
          {section.body}
        </p>
      )}
      {ctaLabel && (
        <a
          href={ctaUrl || '#'}
          className="inline-block bg-white text-indigo-700 font-semibold rounded-full shadow
            transition hover:shadow-md hover:bg-indigo-50 px-8 py-3 text-sm"
        >
          {ctaLabel}
        </a>
      )}
    </section>
  )
}
