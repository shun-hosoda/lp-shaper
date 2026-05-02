/**
 * 設定ページ — グローバルLP設定（CTAボタン色・フォント・SNSリンク等）
 * 現フェーズはUI骨格のみ。保存アクションは次フェーズに実装。
 */
export default function SettingsPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <h1 className="text-base font-semibold text-slate-900">設定</h1>
        <p className="text-xs text-slate-400 mt-0.5">LPのデフォルトデザインや連絡先を設定できます</p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* デザイン設定 */}
          <SettingSection title="デザイン" description="生成されるLPのデフォルトスタイルを設定します">
            <SettingRow label="CTAボタンカラー" hint="メインのアクションボタンの色">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  defaultValue="#4f46e5"
                  className="h-8 w-16 rounded cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  defaultValue="#4f46e5"
                  className="w-28 rounded-lg border border-slate-200 px-3 py-1.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </SettingRow>

            <SettingRow label="フォント" hint="本文・見出しのフォントファミリー">
              <select
                className="w-48 rounded-lg border border-slate-200 px-3 py-1.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sans">システムサンセリフ（デフォルト）</option>
                <option value="noto">Noto Sans JP</option>
                <option value="m-plus">M PLUS Rounded 1c</option>
              </select>
            </SettingRow>
          </SettingSection>

          {/* 連絡先・SNS */}
          <SettingSection title="連絡先 / SNS" description="CTAフォームやフッターに表示する連絡先情報">
            <SettingRow label="ビジネス名">
              <input
                type="text"
                placeholder="例: 田中コーチング事務所"
                className={inputClass}
              />
            </SettingRow>
            <SettingRow label="メールアドレス">
              <input
                type="email"
                placeholder="contact@example.com"
                className={inputClass}
              />
            </SettingRow>
            <SettingRow label="X (Twitter)">
              <div className="flex items-center">
                <span className="text-sm text-slate-400 mr-2">@</span>
                <input
                  type="text"
                  placeholder="username"
                  className={inputClass}
                />
              </div>
            </SettingRow>
            <SettingRow label="Instagram">
              <div className="flex items-center">
                <span className="text-sm text-slate-400 mr-2">@</span>
                <input
                  type="text"
                  placeholder="username"
                  className={inputClass}
                />
              </div>
            </SettingRow>
          </SettingSection>

          {/* 保存ボタン（現フェーズはダミー） */}
          <div className="pt-2">
            <button
              type="button"
              disabled
              className="bg-indigo-600 text-white text-sm font-medium rounded-lg px-5 py-2.5
                opacity-50 cursor-not-allowed"
            >
              設定を保存（準備中）
            </button>
            <p className="text-xs text-slate-400 mt-2">※ 保存機能は次バージョンで実装予定です</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- サブコンポーネント ----

function SettingSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

const inputClass =
  'w-48 rounded-lg border border-slate-200 px-3 py-1.5 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500'
