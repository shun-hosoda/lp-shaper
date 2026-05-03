import type { LpSection } from '@/types/lp'

interface Props {
  section: LpSection
  isMobile?: boolean
}

export function TestimonialsSection({ section, isMobile }: Props) {
  return (
    <section className={`bg-white ${isMobile ? 'px-4 py-10' : 'px-8 py-14'}`}>
      {section.heading && (
        <h2 className={`font-bold text-slate-900 text-center mb-8
          ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          {section.heading}
        </h2>
      )}
      {section.items && section.items.length > 0 ? (
        <ul className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {section.items.map((item, i) => (
            <li key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                &ldquo;{item.body}&rdquo;
              </p>
              <p className="text-xs text-slate-500 font-medium">{item.heading}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm text-center">お客様の声を入力してください</p>
      )}
    </section>
  )
}
