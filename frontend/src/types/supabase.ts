/**
 * Supabase 型定義
 *
 * 本ファイルは `supabase gen types typescript --local` で自動生成される。
 * Supabase CLI セットアップ後に以下のコマンドで再生成すること:
 *
 *   npx supabase gen types typescript --local > src/types/supabase.ts
 *
 * 現在は開発初期のため最小限の手動定義を置いている。
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  PostgrestVersion: '12'
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          owner_user_id: string
          title: string
          category: string
          status: string
          published_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          title: string
          category: string
          status?: string
          published_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          title?: string
          category?: string
          status?: string
          published_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_versions: {
        Row: {
          id: string
          project_id: string
          version_no: number
          state: string
          lp_structure_json: unknown
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          version_no: number
          state?: string
          lp_structure_json: unknown
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          version_no?: number
          state?: string
          lp_structure_json?: unknown
          created_at?: string
        }
        Relationships: []
      }
      lp_events: {
        Row: {
          id: string
          project_id: string
          event_type: string
          event_payload: unknown | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          event_type: string
          event_payload?: unknown | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          event_type?: string
          event_payload?: unknown | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type PageVersionRow = Database['public']['Tables']['page_versions']['Row']
