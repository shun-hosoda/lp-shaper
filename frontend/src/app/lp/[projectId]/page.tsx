import { getAdminClient } from '@/lib/supabase/admin'
import type { LpStructure } from '@/types/lp'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ projectId: string }>
}

/**
 * 公開LP表示ページ — 認証不要（middleware で PUBLIC_PATHS に追加済み）
 * page_versions の最新 published バージョンを取得してレンダリングする。
 */
export default async function PublicLpPage({ params }: Props) {
  const { projectId } = await params
  let supabase: ReturnType<typeof getAdminClient>
  try {
    supabase = getAdminClient()
  } catch {
    notFound()
  }

  // page_versions から最新 published バージョンを取得
  const { data, error } = await supabase
    .from('page_versions')
    .select('lp_structure_json, version_no, projects(title, category)')
    .eq('project_id', projectId)
    .eq('state', 'published')
    .order('version_no', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = (data as any).projects as { title: string; category: string } | null
  const structure = data.lp_structure_json as LpStructure

  const hero = structure.sections.find((s) => s.type === 'hero')
  const { ctaLabel, ctaUrl, title: pageTitle, description } = structure.meta

  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <nav className="bg-slate-900 px-6 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">{pageTitle || project?.title}</span>
      </nav>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug mb-6">
            {hero?.heading ?? project?.title}
          </h1>
          {hero?.body && (
            <p className="text-indigo-100 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              {hero.body}
            </p>
          )}
          {ctaUrl ? (
            <a
              href={ctaUrl}
              className="inline-block bg-white text-indigo-700 font-semibold text-base
                rounded-full px-10 py-4 shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all"
            >
              {ctaLabel || '今すぐ申し込む'}
            </a>
          ) : (
            <span
              className="inline-block bg-white text-indigo-700 font-semibold text-base
                rounded-full px-10 py-4 shadow-lg opacity-90"
            >
              {ctaLabel || '今すぐ申し込む'}
            </span>
          )}
        </div>
      </section>

      {/* 説明セクション */}
      {description && (
        <section className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-slate-600 text-base leading-relaxed">{description}</p>
        </section>
      )}

      {/* サービス訴求プレースホルダー */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-10">
            選ばれる3つの理由
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['実績・経験', '丁寧なサポート', '明確な成果'].map((item) => (
              <div key={item} className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">✨</div>
                <p className="text-sm font-semibold text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 下部CTA */}
      <section className="bg-indigo-600 py-14 text-center text-white">
        <h2 className="text-xl font-bold mb-2">{pageTitle || project?.title}</h2>
        <p className="text-indigo-200 text-sm mb-6">今すぐお気軽にご相談ください</p>
        {ctaUrl ? (
          <a
            href={ctaUrl}
            className="inline-block bg-white text-indigo-700 font-semibold text-sm
              rounded-full px-8 py-3 hover:bg-indigo-50 transition-colors"
          >
            {ctaLabel || '申し込む'}
          </a>
        ) : (
          <span className="inline-block bg-white text-indigo-700 font-semibold text-sm
            rounded-full px-8 py-3 opacity-80">
            {ctaLabel || '申し込む'}
          </span>
        )}
      </section>

      {/* フッター */}
      <footer className="bg-slate-900 text-slate-400 text-xs text-center py-5">
        Powered by LP Shaper
      </footer>
    </div>
  )
}
