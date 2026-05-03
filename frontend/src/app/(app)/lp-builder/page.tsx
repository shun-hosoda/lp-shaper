'use client'

import { useEffect, useState, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createProject, getProjectEditorData, saveDraft, publishLp } from '@/actions/lp'
import { LP_CATEGORIES, LP_CATEGORY_LABELS } from '@/lib/validations/lp'
import { getTemplatesByIndustry, getTemplate } from '@/lib/templates'
import { useSectionEditor } from '@/hooks/useSectionEditor'
import { SectionRenderer } from '@/components/lp/SectionRenderer'
import type { LpProject, PageVersion, LpStructure, LpMeta, LpCategory } from '@/types/lp'

type Step = 'create' | 'template' | 'edit' | 'published'

// ---- ヘルパー ----
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

// ---- プレビュー ----
function LpPreview({ structure, isMobile }: { structure: LpStructure; isMobile: boolean }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300
        ${isMobile ? 'w-[375px]' : 'w-full max-w-2xl'}`}
      style={{ minHeight: '500px' }}
    >
      <div className="bg-slate-900 px-6 py-3">
        <span className="text-white text-sm font-bold opacity-80">{structure.meta.title || 'ページタイトル'}</span>
      </div>
      {structure.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          meta={{ ctaLabel: structure.meta.ctaLabel, ctaUrl: structure.meta.ctaUrl }}
          isMobile={isMobile}
        />
      ))}
      {structure.sections.length === 0 && (
        <div className="px-8 py-16 text-center text-slate-400 text-sm">
          テンプレートを選択するかセクションを追加してください
        </div>
      )}
    </div>
  )
}

// ---- メインコンポーネント ----
function LpBuilderInner() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const templateId = searchParams.get('template')

  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>(editId ? 'edit' : 'create')
  const [project, setProject] = useState<LpProject | null>(null)
  const [pageVersion, setPageVersion] = useState<PageVersion | null>(null)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobilePreview, setIsMobilePreview] = useState(false)

  // ---- フォーム状態 ----
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(LP_CATEGORIES[0])
  const [meta, setMeta] = useState<LpMeta>({
    title: '',
    description: '',
    ctaLabel: '今すぐ申し込む',
    ctaUrl: '',
  })

  const { sections, resetSections, updateSection, moveUp, moveDown, addSection, removeSection } =
    useSectionEditor([])

  // ---- 初期ロード ----
  useEffect(() => {
    if (!editId) {
      if (templateId) {
        const tpl = getTemplate(templateId)
        if (tpl) {
          resetSections(
            tpl.defaultSections.map((s, i) => ({ ...s, id: `tpl-${i}-${Date.now()}` }))
          )
        }
      }
      return
    }

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

      setProject(loadedProject)
      setTitle(loadedProject.title)
      setCategory(loadedProject.category)
      setStep('edit')

      if (!loadedVersion) return

      setPageVersion(loadedVersion)
      const s = loadedVersion.lpStructureJson
      setMeta({
        title: s.meta.title ?? '',
        description: s.meta.description ?? '',
        ctaLabel: s.meta.ctaLabel ?? '今すぐ申し込む',
        ctaUrl: s.meta.ctaUrl ?? '',
      })
      resetSections(s.sections)
    })

    return () => { cancelled = true }
  }, [editId, templateId, resetSections])

  // ---- previewStructure ----
  const previewStructure: LpStructure = {
    schemaVersion: '0.2',
    meta: {
      title: meta.title || title || 'LP タイトル',
      description: meta.description,
      ctaLabel: meta.ctaLabel,
      ctaUrl: meta.ctaUrl,
    },
    sections,
  }

  // ---- プロジェクト作成 ----
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createProject({ title, category: category as LpCategory })
      if ('error' in result) { setError(result.error); return }
      setProject(result.data)
      setStep('template')
    })
  }

  // ---- テンプレート適用 ----
  function handleApplyTemplate(tplId: string | null) {
    if (tplId) {
      const tpl = getTemplate(tplId)
      if (tpl) {
        resetSections(
          tpl.defaultSections.map((s) => ({ ...s, id: crypto.randomUUID() }))
        )
      }
    }
    setStep('edit')
  }

  // ---- ドラフト保存 ----
  async function handleSaveDraft() {
    if (!project) return
    setError(null)
    startTransition(async () => {
      const result = await saveDraft(project.id, {
        lpStructureJson: previewStructure as unknown as Record<string, unknown>,
      })
      if ('error' in result) { setError(result.error); return }
      setPageVersion(result.data)
    })
  }

  // ---- 公開 ----
  async function handlePublish() {
    if (!project) return
    setError(null)
    startTransition(async () => {
      if (!pageVersion) {
        const draft = await saveDraft(project.id, {
          lpStructureJson: previewStructure as unknown as Record<string, unknown>,
        })
        if ('error' in draft) { setError(draft.error); return }
        setPageVersion(draft.data)
      }
      const result = await publishLp(project.id)
      if ('error' in result) { setError(result.error); return }
      setPublishedUrl(result.data.publishedUrl)
      setStep('published')
    })
  }

  const templates = project
    ? getTemplatesByIndustry(project.category as LpCategory)
    : []

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

        <div className="flex items-center gap-2">
          {step === 'edit' && (
            <>
              <button
                type="button"
                onClick={() => setIsMobilePreview((v) => !v)}
                className="text-xs text-slate-500 border border-slate-200 hover:border-slate-300
                  rounded-lg px-3 py-1.5 transition-colors"
              >
                {isMobilePreview ? '🖥 PC表示' : '📱 モバイル表示'}
              </button>
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
            </>
          )}
        </div>
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
                  {isPending ? '作成中...' : '作成してテンプレートを選ぶ'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---- テンプレート選択 ---- */}
        {step === 'template' && project && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-base font-semibold text-slate-900 mb-1">テンプレートを選択</h2>
              <p className="text-sm text-slate-500 mb-6">
                {(LP_CATEGORY_LABELS as Record<string, string>)[project.category]} 向けのテンプレートです
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl.id)}
                    className="text-left rounded-xl border border-slate-200 bg-white p-5
                      hover:border-indigo-400 hover:shadow-sm transition-all"
                  >
                    <p className="font-semibold text-slate-800 text-sm mb-1">{tpl.name}</p>
                    <p className="text-xs text-slate-500 mb-2">{tpl.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-xs bg-indigo-50 text-indigo-700 rounded px-2 py-0.5">
                        {tpl.framework}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 rounded px-2 py-0.5">
                        {tpl.defaultSections.length}セクション
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleApplyTemplate(null)}
                className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline"
              >
                テンプレートなしで始める
              </button>
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
                        value={meta.title}
                        onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
                        placeholder={title}
                        className={inputClass}
                      />
                    </FormField>
                    <FormField label="説明文">
                      <textarea
                        value={meta.description}
                        onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))}
                        rows={2}
                        placeholder="120文字程度で概要を記述"
                        className={inputClass + ' resize-none'}
                      />
                    </FormField>
                    <FormField label="CTAボタンテキスト">
                      <input
                        type="text"
                        value={meta.ctaLabel}
                        onChange={(e) => setMeta((m) => ({ ...m, ctaLabel: e.target.value }))}
                        placeholder="今すぐ申し込む"
                        className={inputClass}
                      />
                    </FormField>
                    <FormField label="リンク先 URL">
                      <input
                        type="url"
                        value={meta.ctaUrl}
                        onChange={(e) => setMeta((m) => ({ ...m, ctaUrl: e.target.value }))}
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </FormField>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* セクション一覧 */}
                <section>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">セクション</p>
                  <div className="space-y-2">
                    {sections.map((sec, idx) => (
                      <div key={sec.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-700 capitalize">
                            {sec.type.replace('_', ' ')}
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveUp(sec.id!)}
                              className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30 px-1"
                              title="上へ"
                            >↑</button>
                            <button
                              type="button"
                              disabled={idx === sections.length - 1}
                              onClick={() => moveDown(sec.id!)}
                              className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30 px-1"
                              title="下へ"
                            >↓</button>
                            <button
                              type="button"
                              onClick={() => removeSection(sec.id!)}
                              className="text-xs text-slate-400 hover:text-red-500 px-1"
                              title="削除"
                            >✕</button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={sec.heading ?? ''}
                          onChange={(e) => updateSection(sec.id!, { heading: e.target.value })}
                          placeholder="見出し"
                          className={inputClass + ' text-xs'}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-1">セクションを追加</p>
                    <div className="flex flex-wrap gap-1">
                      {(['hero', 'benefits', 'social_proof', 'testimonials', 'faq', 'cta_banner'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => addSection(t)}
                          className="text-xs bg-white border border-slate-200 hover:border-indigo-400
                            hover:text-indigo-700 rounded px-2 py-1 transition-colors"
                        >
                          + {t.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </aside>

            {/* 右: プレビュー */}
            <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col items-center py-8 px-4">
              <p className="text-xs text-slate-400 mb-3">
                {isMobilePreview ? '📱 モバイルプレビュー (375px)' : '🖥 PCプレビュー'}
              </p>
              <LpPreview structure={previewStructure} isMobile={isMobilePreview} />
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

