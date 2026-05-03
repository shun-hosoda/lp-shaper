import type { LpSection } from '@/types/lp'

interface Props {
  section: LpSection
  isMobile?: boolean
}

export function BenefitsSection({ section, isMobile }: Props) {
  return (
    <section className={`bg-white ${isMobile ? 'px-4 py-10' : 'px-8 py-14'}`}>
      {section.heading && (
        <h2 className={`font-bold text-slate-900 text-center mb-8
          ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          {section.heading}
        </h2>
      )}
      {section.items && section.items.length > 0 ? (
        <ul className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {section.items.map((item, i) => (
            <li key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <p className="font-semibold text-slate-800 text-sm mb-1">{item.heading}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm text-center">ベネフィット項目を入力してください</p>
      )}
    </section>
  )
}
