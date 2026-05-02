import { getProjects } from '@/actions/lp'
import type { LpProject } from '@/types/lp'
import { LP_CATEGORY_LABELS } from '@/lib/validations/lp'

const STATUS_LABEL: Record<string, string> = {
  draft: '下書き',
  published: '公開中',
  archived: 'アーカイブ',
}

const STATUS_CLASS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-orange-100 text-orange-600',
}

export default async function HomePage() {
  const result = await getProjects()
  const projects: LpProject[] = 'data' in result ? result.data : []

  return (
    <div className="h-full flex flex-col">
      {/* ページヘッダー */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-base font-semibold text-slate-900">マイLP</h1>
        <a
          href="/lp-builder"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700
            text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新規作成
        </a>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {'error' in result && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
            {result.error}
          </div>
        )}

        {projects.length === 0 ? (
          /* 空状態 */
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-base font-semibold text-slate-800 mb-1">まだLPがありません</h2>
            <p className="text-sm text-slate-500 mb-5">「新規作成」ボタンからLPを作成しましょう</p>
            <a
              href="/lp-builder"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium
                rounded-lg px-5 py-2.5 transition-colors"
            >
              最初のLPを作成する
            </a>
          </div>
        ) : (
          /* LP一覧グリッド */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {projects.map((project) => (
              <LpCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LpCard({ project }: { project: LpProject }) {
  const statusLabel = STATUS_LABEL[project.status] ?? project.status
  const statusClass = STATUS_CLASS[project.status] ?? 'bg-slate-100 text-slate-600'
  const categoryLabel =
    (LP_CATEGORY_LABELS as Record<string, string>)[project.category] ?? project.category
  const updatedAt = new Date(project.updatedAt).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md
      transition-shadow flex flex-col">
      {/* サムネイル */}
      <div className="h-36 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-t-xl
        flex items-center justify-center text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      </div>

      {/* カード本体 */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 flex-1">
            {project.title}
          </h3>
          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3">{categoryLabel} · {updatedAt}</p>

        <div className="mt-auto flex gap-2">
          <a
            href={`/lp-builder?id=${project.id}`}
            className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg
              border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            編集
          </a>
          {project.publishedUrl ? (
            <a
              href={project.publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg
                bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              表示
            </a>
          ) : (
            <span className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg
              bg-slate-100 text-slate-400 cursor-default">
              未公開
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
