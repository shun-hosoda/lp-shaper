'use client'

import { useState, useTransition } from 'react'
import { createProject, saveDraft, publishLp } from '@/actions/lp'
import { LP_CATEGORIES, LP_CATEGORY_LABELS } from '@/lib/validations/lp'
import type { LpProject, PageVersion, LpStructure } from '@/types/lp'

type Step = 'create' | 'edit' | 'published'

/** LP Builder — 最小構成（骨格実装 / LLM生成は後フェーズ） */
export default function LpBuilderPage() {
  const [isPending, startTransition] = useTransition()

  const [step, setStep] = useState<Step>('create')
  const [project, setProject] = useState<LpProject | null>(null)
  const [pageVersion, setPageVersion] = useState<PageVersion | null>(null)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ---- Step 1: プロジェクト作成 ----
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(LP_CATEGORIES[0])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createProject({ title, category: category as never })
      if ('error' in result) {
        setError(result.error)
        return
      }
      setProject(result.data)
      setStep('edit')
    })
  }

  // ---- Step 2: ドラフト保存 ----
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [ctaLabel, setCtaLabel] = useState('今すぐ申し込む')
  const [ctaUrl, setCtaUrl] = useState('')
  const [heroHeading, setHeroHeading] = useState('')
  const [heroBody, setHeroBody] = useState('')

  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault()
    if (!project) return
    setError(null)

    const lpStructureJson: LpStructure = {
      schemaVersion: '0.1',
      meta: {
        title: metaTitle || title,
        description: metaDescription,
        ctaLabel,
        ctaUrl,
      },
      sections: [
        { type: 'hero', heading: heroHeading, body: heroBody },
      ],
    }

    startTransition(async () => {
      const result = await saveDraft(project.id, { lpStructureJson })
      if ('error' in result) {
        setError(result.error)
        return
      }
      setPageVersion(result.data)
    })
  }

  // ---- Step 3: 公開 ----
  async function handlePublish() {
    if (!project || !pageVersion) return
    setError(null)
    startTransition(async () => {
      const result = await publishLp(project.id)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setPublishedUrl(result.data.publishedUrl)
      setStep('published')
    })
  }

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <a
            href="/home"
            className="text-slate-400 hover:text-slate-600 text-sm"
          >
            ← ホームへ
          </a>
          <h1 className="text-lg font-semibold text-slate-900">LP作成</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ---- Step: create ---- */}
        {step === 'create' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              新しいLPを作成
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  LPタイトル
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: コーチング体験セッション申込"
                  maxLength={120}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{title.length}/120</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  業種
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {LP_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {LP_CATEGORY_LABELS[cat]}
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
                {isPending ? '作成中...' : '作成する'}
              </button>
            </form>
          </div>
        )}

        {/* ---- Step: edit ---- */}
        {step === 'edit' && project && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-700">
              <span className="font-medium">プロジェクト作成完了</span>: {project.title}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                LP内容を入力
              </h2>
              <form onSubmit={handleSaveDraft} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ページタイトル（metaタグ）
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    説明文（meta description）
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="LPの概要を120文字程度で"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <hr className="border-slate-100" />
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  ヒーローセクション
                </p>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    キャッチコピー（見出し）
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={heroHeading}
                    onChange={(e) => setHeroHeading(e.target.value)}
                    placeholder="例: 3ヶ月でフリーランス独立を実現する"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    サブコピー
                  </label>
                  <textarea
                    value={heroBody}
                    onChange={(e) => setHeroBody(e.target.value)}
                    rows={3}
                    placeholder="補足説明・ベネフィットを記述"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <hr className="border-slate-100" />
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  CTA（行動促進ボタン）
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ボタンテキスト
                    </label>
                    <input
                      type="text"
                      value={ctaLabel}
                      onChange={(e) => setCtaLabel(e.target.value)}
                      placeholder="今すぐ申し込む"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      リンク先URL
                    </label>
                    <input
                      type="url"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-white border border-slate-300 hover:border-slate-400
                      disabled:opacity-50 text-slate-700 font-medium text-sm rounded-lg py-2.5 transition-colors"
                  >
                    {isPending ? '保存中...' : 'ドラフト保存'}
                  </button>
                  <button
                    type="button"
                    disabled={isPending || !pageVersion}
                    onClick={handlePublish}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                      text-white font-medium text-sm rounded-lg py-2.5 transition-colors"
                  >
                    {isPending ? '公開中...' : '公開する'}
                  </button>
                </div>

                {pageVersion && (
                  <p className="text-xs text-slate-400 text-center">
                    ドラフト保存済み（バージョン {pageVersion.versionNo}）
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ---- Step: published ---- */}
        {step === 'published' && publishedUrl && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
            <div className="text-4xl">🎉</div>
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
                LPを確認する →
              </a>
              <a
                href="/home"
                className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400
                  text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                ホームへ戻る
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
