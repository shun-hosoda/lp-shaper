'use server'

import { createClient } from '@/lib/supabase/server'
import { createProjectSchema, saveDraftSchema } from '@/lib/validations/lp'
import type { ActionResult, LpCategory, LpProject, LpStructure, PageVersion, ProjectStatus } from '@/types/lp'
import type { CreateProjectInput, SaveDraftInput } from '@/lib/validations/lp'
import type { SupabaseClient } from '@supabase/supabase-js'

/** DB操作共通: Supabase SDKのGenericTable型を回避するためanyでキャスト */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = SupabaseClient<any>

// ===============================================================
// getProjects — LP一覧取得
// ===============================================================
export async function getProjects(): Promise<ActionResult<LpProject[]>> {
  const supabase = (await createClient()) as unknown as Db

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return { error: 'LP一覧の取得に失敗しました' }

  return {
    data: (data ?? []).map((d: Record<string, unknown>) => ({
      id: d.id as string,
      ownerUserId: d.owner_user_id as string,
      title: d.title as string,
      category: d.category as LpCategory,
      status: d.status as ProjectStatus,
      publishedUrl: (d.published_url as string | null) ?? null,
      createdAt: d.created_at as string,
      updatedAt: d.updated_at as string,
    })),
  }
}

// ===============================================================
// createProject — プロジェクト作成
// ===============================================================
export async function createProject(
  input: CreateProjectInput,
): Promise<ActionResult<LpProject>> {
  const supabase = (await createClient()) as unknown as Db

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  // バリデーション
  const parsed = createProjectSchema.safeParse(input)
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
    return { error: first ?? '入力内容を確認してください' }
  }

  // DB挿入
  const { data, error } = await supabase
    .from('projects')
    .insert({
      owner_user_id: user.id,
      title: parsed.data.title,
      category: parsed.data.category,
      status: 'draft',
    })
    .select()
    .single()

  if (error || !data) {
    console.error('[createProject] DB error:', error)
    return { error: 'プロジェクトの作成に失敗しました' }
  }

  // lp_events: project.created を記録（draft-to-publish rate計測用）
  await supabase.from('lp_events').insert({
    project_id: data.id,
    event_type: 'project.created',
    event_payload: { category: parsed.data.category },
  })

  return {
    data: {
      id: data.id,
      ownerUserId: data.owner_user_id,
      title: data.title,
      category: data.category,
      status: data.status,
      publishedUrl: data.published_url ?? null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } satisfies LpProject,
  }
}

// ===============================================================
// saveDraft — ドラフト保存
// ===============================================================
export async function saveDraft(
  projectId: string,
  input: SaveDraftInput,
): Promise<ActionResult<PageVersion>> {
  const supabase = (await createClient()) as unknown as Db

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  // バリデーション
  const parsed = saveDraftSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'LP構造データが不正です' }
  }

  // オーナー確認（RLSの二重チェック）
  const { data: project } = await supabase
    .from('projects')
    .select('owner_user_id')
    .eq('id', projectId)
    .single()

  if (!project || project.owner_user_id !== user.id) {
    return { error: 'プロジェクトへのアクセス権限がありません' }
  }

  // version_no 採番（MAX + 1）
  const { data: maxRow } = await supabase
    .from('page_versions')
    .select('version_no')
    .eq('project_id', projectId)
    .order('version_no', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersionNo = (maxRow?.version_no ?? 0) + 1

  // ドラフト挿入
  const { data, error } = await supabase
    .from('page_versions')
    .insert({
      project_id: projectId,
      version_no: nextVersionNo,
      state: 'draft',
      lp_structure_json: parsed.data.lpStructureJson,
    })
    .select()
    .single()

  if (error || !data) {
    return { error: 'ドラフトの保存に失敗しました' }
  }

  return {
    data: {
      id: data.id,
      projectId: data.project_id,
      versionNo: data.version_no,
      state: data.state,
      lpStructureJson: data.lp_structure_json as unknown as LpStructure,
      createdAt: data.created_at,
    } satisfies PageVersion,
  }
}

// ===============================================================
// publishLp — LP公開
// ===============================================================
export async function publishLp(
  projectId: string,
): Promise<ActionResult<{ publishedUrl: string }>> {
  const supabase = (await createClient()) as unknown as Db

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  // オーナー確認
  const { data: project } = await supabase
    .from('projects')
    .select('id, owner_user_id, status')
    .eq('id', projectId)
    .single()

  if (!project || project.owner_user_id !== user.id) {
    return { error: 'プロジェクトへのアクセス権限がありません' }
  }

  // 最新ドラフトバージョン取得
  const { data: latestVersion } = await supabase
    .from('page_versions')
    .select('id, version_no')
    .eq('project_id', projectId)
    .order('version_no', { ascending: false })
    .limit(1)
    .single()

  if (!latestVersion) {
    return { error: '公開できるドラフトがありません' }
  }

  // page_versionsをpublishedに更新
  const { error: versionUpdateError } = await supabase
    .from('page_versions')
    .update({ state: 'published' })
    .eq('id', latestVersion.id)

  if (versionUpdateError) {
    return { error: '公開処理に失敗しました' }
  }

  // 公開URLを生成してprojectsを更新
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    return { error: '公開URLの設定が見つかりません。管理者に連絡してください。' }
  }
  const publishedUrl = `${appUrl}/lp/${projectId}`

  const { error: projectUpdateError } = await supabase
    .from('projects')
    .update({ status: 'published', published_url: publishedUrl })
    .eq('id', projectId)

  if (projectUpdateError) {
    return { error: '公開処理に失敗しました' }
  }

  // lp_events: published を記録（KPI計測）
  await supabase.from('lp_events').insert({
    project_id: projectId,
    event_type: 'published',
    event_payload: { version_no: latestVersion.version_no, published_url: publishedUrl },
  })

  return { data: { publishedUrl } }
}
