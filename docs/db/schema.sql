-- =============================================================
-- DB Schema Template
-- =============================================================
-- このファイルはデータベース設計の正（Single Source of Truth）です。
-- テーブル追加・変更時は必ずこのファイルを先に更新してください。
--
-- 命名規約:
--   テーブル名: snake_case, 複数形 (例: users, order_items)
--   カラム名:   snake_case (例: created_at, user_id)
--   外部キー:   {参照先テーブル名の単数形}_id (例: user_id)
--   インデックス: idx_{テーブル名}_{カラム名}
-- =============================================================

-- 例: ユーザーテーブル
-- CREATE TABLE users (
--     id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     email       VARCHAR(255) NOT NULL UNIQUE,
--     name        VARCHAR(100) NOT NULL,
--     created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
--     updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
-- );
--
-- CREATE INDEX idx_users_email ON users(email);

-- =============================================================
-- LP Builder MVP Schema (BtoC 個人事業主向け)
-- =============================================================

CREATE TABLE projects (
		id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		owner_user_id     UUID NOT NULL,
		title             VARCHAR(120) NOT NULL,
		category          VARCHAR(64) NOT NULL,
		status            VARCHAR(20) NOT NULL DEFAULT 'draft',
		published_url     TEXT,
		created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		CONSTRAINT chk_projects_status
			CHECK (status IN ('draft', 'published'))
);

CREATE INDEX idx_projects_owner_user_id ON projects(owner_user_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE TABLE page_versions (
		id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
		version_no        INTEGER NOT NULL,
		state             VARCHAR(20) NOT NULL DEFAULT 'draft',
		lp_structure_json JSONB NOT NULL,
		created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		CONSTRAINT uq_page_versions_project_version UNIQUE (project_id, version_no),
		CONSTRAINT chk_page_versions_state
			CHECK (state IN ('draft', 'published'))
);

CREATE INDEX idx_page_versions_project_id ON page_versions(project_id);
CREATE INDEX idx_page_versions_state ON page_versions(state);

CREATE TABLE lp_events (
		id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
		event_type        VARCHAR(40) NOT NULL,
		event_payload     JSONB,
		created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lp_events_project_id ON lp_events(project_id);
CREATE INDEX idx_lp_events_event_type ON lp_events(event_type);
