import type { LpSection, LpMeta } from '@/types/lp'

interface Props {
  section: LpSection
  meta: Pick<LpMeta, 'ctaLabel' | 'ctaUrl'>
  isMobile?: boolean
}

export function CtaBannerSection({ section, meta, isMobile }: Props) {
  const ctaLabel = section.cta?.label || meta.ctaLabel || '申し込む'
  const ctaUrl = section.cta?.url || meta.ctaUrl

  return (
    <section className={`bg-indigo-600 text-white text-center
      ${isMobile ? 'px-4 py-10' : 'px-8 py-14'}`}>
      {section.heading && (
        <h2 className={`font-bold mb-4 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          {section.heading}
        </h2>
      )}
      {section.body && (
        <p className="text-indigo-100 text-sm mb-6 max-w-md mx-auto leading-relaxed">
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
