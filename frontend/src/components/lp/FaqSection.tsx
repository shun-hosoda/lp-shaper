import type { LpSection } from '@/types/lp'

interface Props {
  section: LpSection
  isMobile?: boolean
}

export function FaqSection({ section, isMobile }: Props) {
  return (
    <section className={`bg-slate-50 ${isMobile ? 'px-4 py-10' : 'px-8 py-14'}`}>
      {section.heading && (
        <h2 className={`font-bold text-slate-900 text-center mb-8
          ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          {section.heading}
        </h2>
      )}
      {section.items && section.items.length > 0 ? (
        <dl className="space-y-3 max-w-2xl mx-auto">
          {section.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
              <dt className="font-semibold text-slate-800 text-sm mb-2">
                Q. {item.heading}
              </dt>
              <dd className="text-slate-600 text-sm leading-relaxed">
                A. {item.body}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-slate-400 text-sm text-center">FAQ項目を入力してください</p>
      )}
    </section>
  )
}
