import type { LpSection } from '@/types/lp'

interface Props {
  section: LpSection
  isMobile?: boolean
}

export function SocialProofSection({ section, isMobile }: Props) {
  return (
    <section className={`bg-indigo-50 ${isMobile ? 'px-4 py-10' : 'px-8 py-14'}`}>
      {section.heading && (
        <h2 className={`font-bold text-slate-900 text-center mb-8
          ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          {section.heading}
        </h2>
      )}
      {section.items && section.items.length > 0 ? (
        <ul className="flex flex-wrap justify-center gap-6">
          {section.items.map((item, i) => (
            <li key={i} className="text-center">
              <p className="font-bold text-indigo-700 text-2xl">{item.heading}</p>
              <p className="text-slate-600 text-xs mt-1">{item.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm text-center">実績・数字を入力してください</p>
      )}
    </section>
  )
}
