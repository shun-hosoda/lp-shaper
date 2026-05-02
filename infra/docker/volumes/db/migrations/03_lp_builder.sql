-- =============================================================
-- LP Builder MVP Schema — lp-shaper
-- =============================================================
-- このファイルは db-migrate サービスによって GoTrue 起動後に実行される。
-- docs/db/schema.sql が Single Source of Truth。
-- =============================================================

\set ON_ERROR_STOP off

-- =============================================================
-- projects: LPプロジェクト
-- =============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id   UUID        NOT NULL,
  title           VARCHAR(120) NOT NULL,
  category        VARCHAR(64) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'draft',
  published_url   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_projects_status
    CHECK (status IN ('draft', 'published'))
);

CREATE INDEX IF NOT EXISTS idx_projects_owner_user_id ON public.projects(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- updated_at 自動更新トリガー
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_projects_updated_at'
  ) THEN
    CREATE TRIGGER set_projects_updated_at
      BEFORE UPDATE ON public.projects
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END;
$$;

-- =============================================================
-- page_versions: LPドラフト・公開バージョン
-- =============================================================
CREATE TABLE IF NOT EXISTS public.page_versions (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID    NOT NULL,
  version_no          INTEGER NOT NULL,
  state               VARCHAR(20) NOT NULL DEFAULT 'draft',
  lp_structure_json   JSONB   NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_page_versions_project
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT uq_page_versions_project_version
    UNIQUE (project_id, version_no),
  CONSTRAINT chk_page_versions_state
    CHECK (state IN ('draft', 'published'))
);

CREATE INDEX IF NOT EXISTS idx_page_versions_project_id ON public.page_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_page_versions_state ON public.page_versions(state);

-- =============================================================
-- lp_events: KPIイベントログ
-- （draft-to-publish rate / time-to-first-publish 計測用）
-- =============================================================
CREATE TABLE IF NOT EXISTS public.lp_events (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID    NOT NULL,
  event_type      VARCHAR(40) NOT NULL,
  event_payload   JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_lp_events_project
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lp_events_project_id ON public.lp_events(project_id);
CREATE INDEX IF NOT EXISTS idx_lp_events_event_type ON public.lp_events(event_type);
CREATE INDEX IF NOT EXISTS idx_lp_events_created_at ON public.lp_events(created_at);

-- =============================================================
-- Row Level Security (RLS)
-- =============================================================

-- projects RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects: select own" ON public.projects;
CREATE POLICY "projects: select own"
  ON public.projects FOR SELECT
  USING (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "projects: insert own" ON public.projects;
CREATE POLICY "projects: insert own"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "projects: update own" ON public.projects;
CREATE POLICY "projects: update own"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "projects: delete own" ON public.projects;
CREATE POLICY "projects: delete own"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_user_id);

-- =============================================================
-- Grant permissions to authenticated / anon roles
-- =============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_versions TO authenticated;
GRANT SELECT, INSERT               ON public.lp_events      TO authenticated;

-- anon role は読み取り不要（RLSで制御するが念のため）
-- service_role はすべてのテーブルに対してフルアクセス
GRANT ALL ON public.projects      TO service_role;
GRANT ALL ON public.page_versions TO service_role;
GRANT ALL ON public.lp_events     TO service_role;
ALTER TABLE public.page_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "page_versions: select via project" ON public.page_versions;
CREATE POLICY "page_versions: select via project"
  ON public.page_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = page_versions.project_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "page_versions: insert via project" ON public.page_versions;
CREATE POLICY "page_versions: insert via project"
  ON public.page_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = page_versions.project_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "page_versions: update via project" ON public.page_versions;
CREATE POLICY "page_versions: update via project"
  ON public.page_versions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = page_versions.project_id
        AND p.owner_user_id = auth.uid()
    )
  );

-- lp_events RLS（projectsのオーナー経由で制御）
ALTER TABLE public.lp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lp_events: select via project" ON public.lp_events;
CREATE POLICY "lp_events: select via project"
  ON public.lp_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = lp_events.project_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "lp_events: insert via project" ON public.lp_events;
CREATE POLICY "lp_events: insert via project"
  ON public.lp_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = lp_events.project_id
        AND p.owner_user_id = auth.uid()
    )
  );
