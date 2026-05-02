import { createClient } from '@/lib/supabase/server'
import { logout } from '@/actions/auth'
import type { Profile } from '@/types/supabase'

/**
 * AppShell — 認証済み画面共通レイアウト
 * 左サイドバー240px固定 + メインエリア full-width
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profileResult = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user?.id ?? '')
    .maybeSingle()
  const profile = profileResult.data as Pick<Profile, 'display_name'> | null

  const displayName = profile?.display_name ?? user?.email ?? 'ユーザー'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ===== サイドバー ===== */}
      <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
        {/* ロゴ */}
        <div className="px-5 py-4 border-b border-slate-100">
          <span className="text-base font-bold text-indigo-600 tracking-tight">LP Shaper</span>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <SidebarLink href="/home" label="マイLP" icon={<IconGrid />} />
          <SidebarLink href="/lp-builder" label="新規作成" icon={<IconPlus />} />
          <SidebarLink href="/settings" label="設定" icon={<IconSettings />} />
        </nav>

        {/* アカウントエリア */}
        <div className="border-t border-slate-100 px-3 py-3 space-y-1">
          <SidebarLink href="/profile" label="アカウント" icon={<IconUser />} small />
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-500
                hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <IconLogout />
              ログアウト
            </button>
          </form>
        </div>

        {/* ユーザー名表示 */}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 truncate">{displayName}</p>
        </div>
      </aside>

      {/* ===== メインコンテンツ ===== */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

// ---- コンポーネント ----

function SidebarLink({
  href,
  label,
  icon,
  small = false,
}: {
  href: string
  label: string
  icon: React.ReactNode
  small?: boolean
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2.5 px-3 rounded-lg text-slate-600
        hover:text-slate-900 hover:bg-slate-50 transition-colors
        ${small ? 'py-1.5 text-xs' : 'py-2 text-sm font-medium'}`}
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </a>
  )
}

// ---- アイコン（SVG inline） ----

function IconGrid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
