'use client'

import { useEffect, useState, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createProject, getProjectEditorData, saveDraft, publishLp } from '@/actions/lp'
import { LP_CATEGORIES, LP_CATEGORY_LABELS } from '@/lib/validations/lp'
import type { LpProject, PageVersion, LpStructure } from '@/types/lp'

type Step = 'create' | 'edit' | 'published'

function LpBuilderInner() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>(editId ? 'edit' : 'create')
  const [project, setProject] = useState<LpProject | null>(null)
  const [pageVersion, setPageVersion] = useState<PageVersion | null>(null)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ---- フォーム状態 ----
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(LP_CATEGORIES[0])
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [ctaLabel, setCtaLabel] = useState('今すぐ申し込む')
  const [ctaUrl, setCtaUrl] = useState('')
  const [heroHeading, setHeroHeading] = useState('')
  const [heroBody, setHeroBody] = useState('')

  useEffect(() => {
    if (!editId) return

    let cancelled = false
    setError(null)

    startTransition(async () => {
      const result = await getProjectEditorData(editId)
      if (cancelled) return

      if ('error' in result) {
        setError(result.error)
        setStep('create')
        return
      }

      const loadedProject = result.data.project
      const loadedVersion = result.data.pageVersion
      const heroSection = loadedVersion?.lpStructureJson.sections.find((section) => section.type === 'hero')

      setProject(loadedProject)
      setTitle(loadedProject.title)
      setCategory(loadedProject.category)
      setStep('edit')

      if (!loadedVersion) return

      setPageVersion(loadedVersion)
      setMetaTitle(loadedVersion.lpStructureJson.meta.title ?? '')
      setMetaDescription(loadedVersion.lpStructureJson.meta.description ?? '')
      setCtaLabel(loadedVersion.lpStructureJson.meta.ctaLabel ?? '今すぐ申し込む')
      setCtaUrl(loadedVersion.lpStructureJson.meta.ctaUrl ?? '')
      setHeroHeading(heroSection?.heading ?? '')
      setHeroBody(heroSection?.body ?? '')
    })

    return () => {
      cancelled = true
    }
  }, [editId])

  const previewStructure: LpStructure = {
    schemaVersion: '0.1',
    meta: {
      title: metaTitle || title || 'LP タイトル',
      description: metaDescription,
      ctaLabel,
      ctaUrl,
    },
    sections: [
      { type: 'hero', heading: heroHeading || 'キャッチコピーを入力してください', body: heroBody },
    ],
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createProject({ title, category: category as never })
      if ('error' in result) { setError(result.error); return }
      setProject(result.data)
      setStep('edit')
    })
  }

  async function handleSaveDraft() {
    if (!project) return
    setError(null)
    startTransition(async () => {
      const result = await saveDraft(project.id, { lpStructureJson: previewStructure })
      if ('error' in result) { setError(result.error); return }
      setPageVersion(result.data)
    })
  }

  async function handlePublish() {
    if (!project) return
    setError(null)
    startTransition(async () => {
      if (!pageVersion) {
        const draft = await saveDraft(project.id, { lpStructureJson: previewStructure })
        if ('error' in draft) { setError(draft.error); return }
        setPageVersion(draft.data)
      }
      const result = await publishLp(project.id)
      if ('error' in result) { setError(result.error); return }
      setPublishedUrl(result.data.publishedUrl)
      setStep('published')
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* トップバー */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-slate-900">
            {project ? project.title : 'LP作成'}
          </h1>
          {project && (
            <span className="text-xs text-slate-400 bg-slate-100 rounded px-2 py-0.5">
              {(LP_CATEGORY_LABELS as Record<string, string>)[project.category] ?? project.category}
            </span>
          )}
        </div>

        {step === 'edit' && project && (
          <div className="flex items-center gap-2">
            {pageVersion && (
              <span className="text-xs text-slate-400">v{pageVersion.versionNo} 保存済</span>
            )}
            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveDraft}
              className="text-sm text-slate-600 border border-slate-300 hover:border-slate-400
                rounded-lg px-3 py-1.5 disabled:opacity-50 transition-colors"
            >
              {isPending ? '保存中...' : '下書き保存'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handlePublish}
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium
                rounded-lg px-4 py-1.5 disabled:opacity-50 transition-colors"
            >
              {isPending ? '公開中...' : '公開する'}
            </button>
          </div>
        )}
      </header>

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-sm text-red-700 shrink-0">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-hidden flex">

        {/* ---- 新規作成フォーム ---- */}
        {step === 'create' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-md">
              <h2 className="text-base font-semibold text-slate-900 mb-5">新しいLPを作成</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    LPタイトル <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: コーチング体験セッション申込"
                    maxLength={120}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-400 mt-1 text-right">{title.length}/120</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    業種 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {LP_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {(LP_CATEGORY_LABELS as Record<string, string>)[cat]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                    text-white font-medium text-sm rounded-lg py-2.5 transition-colors"
                >
                  {isPending ? '作成中...' : '作成して編集する'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---- 2カラム編集画面 ---- */}
        {step === 'edit' && project && (
          <>
            {/* 左: 入力フォーム */}
            <aside className="w-80 shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
              <div className="px-5 py-5 space-y-5">
                <section>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">メタ情報</p>
                  <div className="space-y-3">
                    <FormField label="ページタイトル">
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder={title}
                        className={inputClass}
                      />
                    </FormField>
                    <FormField label="説明文 (meta description)">
                      <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows={2}
                        placeholder="120文字程度で概要を記述"
                        className={inputClass + ' resize-none'}
                      />
                    </FormField>
                  </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">ヒーローセクション</p>
                  <div className="space-y-3">
                    <FormField label="キャッチコピー（見出し）" required>
                      <input
                        type="text"
                        value={heroHeading}
                        onChange={(e) => setHeroHeading(e.target.value)}
                        placeholder="例: 3ヶ月でフリーランス独立を実現する"
                        className={inputClass}
                      />
                    </FormField>
                    <FormField label="サブコピー">
                      <textarea
                        value={heroBody}
                        onChange={(e) => setHeroBody(e.target.value)}
                        rows={3}
                        placeholder="補足説明・ベネフィットを記述"
                        className={inputClass + ' resize-none'}
                      />
                    </FormField>
                  </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">CTA ボタン</p>
                  <div className="space-y-3">
                    <FormField label="ボタンテキスト">
                      <input
                        type="text"
                        value={ctaLabel}
                        onChange={(e) => setCtaLabel(e.target.value)}
                        placeholder="今すぐ申し込む"
                        className={inputClass}
                      />
                    </FormField>
                    <FormField label="リンク先 URL">
                      <input
                        type="url"
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </FormField>
                  </div>
                </section>
              </div>
            </aside>

            {/* 右: プレビュー */}
            <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col items-center py-8 px-4">
              <p className="text-xs text-slate-400 mb-3">プレビュー</p>
              <LpPreview structure={previewStructure} />
            </div>
          </>
        )}

        {/* ---- 公開完了 ---- */}
        {step === 'published' && publishedUrl && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-md text-center space-y-5">
              <div className="text-5xl">🎉</div>
              <h2 className="text-lg font-semibold text-slate-900">LPを公開しました！</h2>
              <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-700 break-all font-mono">
                {publishedUrl}
              </div>
              <div className="flex gap-3 justify-center">
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm
                    font-medium rounded-lg transition-colors"
                >
                  LPを確認する
                </a>
                <a
                  href="/home"
                  className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400
                    text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  一覧へ戻る
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- ヘルパーコンポーネント ----

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white'

function FormField({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function LpPreview({ structure }: { structure: LpStructure }) {
  const hero = structure.sections.find((s) => s.type === 'hero')
  const { ctaLabel, ctaUrl } = structure.meta

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden" style={{ minHeight: '500px' }}>
      <div className="bg-slate-900 px-6 py-3">
        <span className="text-white text-sm font-bold opacity-80">{structure.meta.title}</span>
      </div>
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-14 text-center text-white">
        <h1 className="text-2xl font-bold leading-snug mb-4 whitespace-pre-wrap">
          {hero?.heading ?? 'キャッチコピー'}
        </h1>
        {hero?.body && (
          <p className="text-indigo-100 text-sm leading-relaxed max-w-md mx-auto mb-8">
            {hero.body}
          </p>
        )}
        <span className="inline-block bg-white text-indigo-700 font-semibold text-sm rounded-full px-8 py-3 shadow">
          {ctaLabel || '申し込む'}
        </span>
        {ctaUrl && (
          <p className="text-indigo-200 text-xs mt-2 opacity-60">{ctaUrl}</p>
        )}
      </div>
      <div className="px-8 py-10 text-center bg-white">
        {structure.meta.description ? (
          <p className="text-slate-600 text-sm leading-relaxed">{structure.meta.description}</p>
        ) : (
          <p className="text-slate-300 text-sm">サービスの説明が入ります</p>
        )}
      </div>
    </div>
  )
}

export default function LpBuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
        読み込み中...
      </div>
    }>
      <LpBuilderInner />
    </Suspense>
  )
}
