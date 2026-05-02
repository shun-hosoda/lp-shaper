/**
 * Unit tests — actions/lp.ts
 * [Red → Green] LP Builder Server Actions のロジックを確認
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Supabaseクライアントのモック
const mockGetUser = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}))

// モック用チェーンビルダー
function buildSelectChain(returnValue: unknown) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(returnValue),
    maybeSingle: vi.fn().mockResolvedValue(returnValue),
  }
  return chain
}

function buildInsertChain(returnValue: unknown) {
  return {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(returnValue),
  }
}

function buildUpdateChain(returnValue: unknown) {
  return {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(returnValue),
  }
}

const MOCK_USER = { id: 'user-uuid-1', email: 'test@example.com' }

describe('createProject action', () => {
  beforeEach(() => vi.clearAllMocks())

  it('未認証の場合はエラーを返す', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { createProject } = await import('../lp')

    const result = await createProject({ title: 'テストLP', category: 'coaching' })

    expect(result).toEqual({ error: '認証が必要です' })
  })

  it('バリデーションエラーの場合はDBを呼ばない', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER }, error: null })
    const { createProject } = await import('../lp')

    const result = await createProject({ title: '', category: 'coaching' })

    expect(mockFrom).not.toHaveBeenCalled()
    expect(result).toHaveProperty('error')
  })

  it('正常系: プロジェクトを作成してデータを返す', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER }, error: null })
    const mockProject = {
      id: 'proj-1',
      title: 'コーチングLP',
      category: 'coaching',
      status: 'draft',
      created_at: '2026-05-02T00:00:00Z',
    }

    const insertChain = buildInsertChain({ data: mockProject, error: null })
    mockFrom.mockReturnValue(insertChain)

    const { createProject } = await import('../lp')
    const result = await createProject({ title: 'コーチングLP', category: 'coaching' })

    expect(result).toHaveProperty('data')
    if ('data' in result) {
      expect(result.data.id).toBe('proj-1')
    }
  })

  it('DB挿入エラーが発生した場合はエラーを返す', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER }, error: null })

    const insertChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    }
    mockFrom.mockReturnValue(insertChain)

    const { createProject } = await import('../lp')
    const result = await createProject({ title: 'コーチングLP', category: 'coaching' })

    expect(result).toHaveProperty('error')
  })
})

describe('saveDraft action', () => {
  beforeEach(() => vi.clearAllMocks())

  it('未認証の場合はエラーを返す', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { saveDraft } = await import('../lp')

    const result = await saveDraft('proj-1', {
      lpStructureJson: { schemaVersion: '0.1', meta: {}, sections: [] },
    })

    expect(result).toEqual({ error: '認証が必要です' })
  })

  it('自分のプロジェクト以外はエラーを返す', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER }, error: null })

    // 1回目: projects取得 → owner不一致 → 早期リターン（from呼び出しは1回のみ）
    const selectChain = buildSelectChain({ data: { owner_user_id: 'other-user' }, error: null })
    mockFrom.mockReturnValueOnce(selectChain)

    const { saveDraft } = await import('../lp')
    const result = await saveDraft('proj-1', {
      lpStructureJson: { schemaVersion: '0.1', meta: {}, sections: [] },
    })

    expect(result).toEqual({ error: 'プロジェクトへのアクセス権限がありません' })
  })
})

describe('publishLp action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3100'
  })
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  it('未認証の場合はエラーを返す', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { publishLp } = await import('../lp')

    const result = await publishLp('proj-1')

    expect(result).toEqual({ error: '認証が必要です' })
  })

  it('公開後にlp_eventsへ記録される', async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER }, error: null })

    // プロジェクト存在確認
    const selectChain = buildSelectChain({
      data: { id: 'proj-1', owner_user_id: MOCK_USER.id, status: 'draft' },
      error: null,
    })
    // 最新バージョン取得
    const versionSelectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'ver-1', version_no: 1 }, error: null }),
    }
    // page_versions更新
    const updateVersionChain = buildUpdateChain({ error: null })
    // projects更新
    const updateProjectChain = buildUpdateChain({ error: null })
    // lp_events挿入
    const insertEventChain = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    }

    mockFrom
      .mockReturnValueOnce(selectChain)
      .mockReturnValueOnce(versionSelectChain)
      .mockReturnValueOnce(updateVersionChain)
      .mockReturnValueOnce(updateProjectChain)
      .mockReturnValueOnce(insertEventChain)

    const { publishLp } = await import('../lp')
    const result = await publishLp('proj-1')

    expect(result).toHaveProperty('data')
    expect(insertEventChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: 'published' }),
    )
  })
})
