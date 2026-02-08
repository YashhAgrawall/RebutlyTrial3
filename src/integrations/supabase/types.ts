export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      debate_participants: {
        Row: {
          connected_at: string | null
          disconnected_at: string | null
          id: string
          is_ai: boolean
          joined_at: string
          role: Database["public"]["Enums"]["debate_role"] | null
          room_id: string
          speaking_order: number | null
          user_id: string | null
        }
        Insert: {
          connected_at?: string | null
          disconnected_at?: string | null
          id?: string
          is_ai?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["debate_role"] | null
          room_id: string
          speaking_order?: number | null
          user_id?: string | null
        }
        Update: {
          connected_at?: string | null
          disconnected_at?: string | null
          id?: string
          is_ai?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["debate_role"] | null
          room_id?: string
          speaking_order?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debate_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "debate_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_rooms: {
        Row: {
          ai_difficulty: string | null
          ai_model: string | null
          created_at: string
          current_phase: string | null
          ended_at: string | null
          ended_reason: string | null
          format: Database["public"]["Enums"]["debate_format"]
          hvh_format: string | null
          id: string
          is_ai_opponent: boolean
          is_private: boolean
          mode: Database["public"]["Enums"]["match_mode"]
          region: Database["public"]["Enums"]["region_preference"]
          reserved_until: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["room_status"]
          timer_state: Json | null
          topic: string | null
        }
        Insert: {
          ai_difficulty?: string | null
          ai_model?: string | null
          created_at?: string
          current_phase?: string | null
          ended_at?: string | null
          ended_reason?: string | null
          format: Database["public"]["Enums"]["debate_format"]
          hvh_format?: string | null
          id?: string
          is_ai_opponent?: boolean
          is_private?: boolean
          mode: Database["public"]["Enums"]["match_mode"]
          region?: Database["public"]["Enums"]["region_preference"]
          reserved_until?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          timer_state?: Json | null
          topic?: string | null
        }
        Update: {
          ai_difficulty?: string | null
          ai_model?: string | null
          created_at?: string
          current_phase?: string | null
          ended_at?: string | null
          ended_reason?: string | null
          format?: Database["public"]["Enums"]["debate_format"]
          hvh_format?: string | null
          id?: string
          is_ai_opponent?: boolean
          is_private?: boolean
          mode?: Database["public"]["Enums"]["match_mode"]
          region?: Database["public"]["Enums"]["region_preference"]
          reserved_until?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          timer_state?: Json | null
          topic?: string | null
        }
        Relationships: []
      }
      invites: {
        Row: {
          consumed_at: string | null
          consumed_by_user_id: string | null
          created_at: string
          created_by_user_id: string
          expires_at: string
          id: string
          invite_code: string
          room_id: string
          status: Database["public"]["Enums"]["invite_status"]
        }
        Insert: {
          consumed_at?: string | null
          consumed_by_user_id?: string | null
          created_at?: string
          created_by_user_id: string
          expires_at?: string
          id?: string
          invite_code: string
          room_id: string
          status?: Database["public"]["Enums"]["invite_status"]
        }
        Update: {
          consumed_at?: string | null
          consumed_by_user_id?: string | null
          created_at?: string
          created_by_user_id?: string
          expires_at?: string
          id?: string
          invite_code?: string
          room_id?: string
          status?: Database["public"]["Enums"]["invite_status"]
        }
        Relationships: [
          {
            foreignKeyName: "invites_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "debate_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      match_history: {
        Row: {
          duration_seconds: number | null
          format: Database["public"]["Enums"]["debate_format"]
          id: string
          is_draw: boolean | null
          mode: Database["public"]["Enums"]["match_mode"]
          played_at: string
          rating_after_a: number | null
          rating_after_b: number | null
          rating_before_a: number | null
          rating_before_b: number | null
          room_id: string | null
          user_a_id: string
          user_b_id: string | null
          winner_user_id: string | null
        }
        Insert: {
          duration_seconds?: number | null
          format: Database["public"]["Enums"]["debate_format"]
          id?: string
          is_draw?: boolean | null
          mode: Database["public"]["Enums"]["match_mode"]
          played_at?: string
          rating_after_a?: number | null
          rating_after_b?: number | null
          rating_before_a?: number | null
          rating_before_b?: number | null
          room_id?: string | null
          user_a_id: string
          user_b_id?: string | null
          winner_user_id?: string | null
        }
        Update: {
          duration_seconds?: number | null
          format?: Database["public"]["Enums"]["debate_format"]
          id?: string
          is_draw?: boolean | null
          mode?: Database["public"]["Enums"]["match_mode"]
          played_at?: string
          rating_after_a?: number | null
          rating_after_b?: number | null
          rating_before_a?: number | null
          rating_before_b?: number | null
          room_id?: string | null
          user_a_id?: string
          user_b_id?: string | null
          winner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_history_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "debate_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      match_queue_entries: {
        Row: {
          age_bracket: string | null
          elo: number
          format: Database["public"]["Enums"]["debate_format"]
          id: string
          joined_at: string
          last_heartbeat_at: string
          matched_at: string | null
          matched_with_user_id: string | null
          mode: Database["public"]["Enums"]["match_mode"]
          opponent_type: Database["public"]["Enums"]["opponent_type"]
          region: Database["public"]["Enums"]["region_preference"]
          room_id: string | null
          status: Database["public"]["Enums"]["queue_status"]
          topic: string | null
          user_id: string
        }
        Insert: {
          age_bracket?: string | null
          elo?: number
          format: Database["public"]["Enums"]["debate_format"]
          id?: string
          joined_at?: string
          last_heartbeat_at?: string
          matched_at?: string | null
          matched_with_user_id?: string | null
          mode: Database["public"]["Enums"]["match_mode"]
          opponent_type?: Database["public"]["Enums"]["opponent_type"]
          region?: Database["public"]["Enums"]["region_preference"]
          room_id?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          topic?: string | null
          user_id: string
        }
        Update: {
          age_bracket?: string | null
          elo?: number
          format?: Database["public"]["Enums"]["debate_format"]
          id?: string
          joined_at?: string
          last_heartbeat_at?: string
          matched_at?: string | null
          matched_with_user_id?: string | null
          mode?: Database["public"]["Enums"]["match_mode"]
          opponent_type?: Database["public"]["Enums"]["opponent_type"]
          region?: Database["public"]["Enums"]["region_preference"]
          room_id?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      match_result_submissions: {
        Row: {
          id: string
          room_id: string
          submitted_at: string
          submitted_result: Database["public"]["Enums"]["match_result"]
          user_id: string
        }
        Insert: {
          id?: string
          room_id: string
          submitted_at?: string
          submitted_result: Database["public"]["Enums"]["match_result"]
          user_id: string
        }
        Update: {
          id?: string
          room_id?: string
          submitted_at?: string
          submitted_result?: Database["public"]["Enums"]["match_result"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_result_submissions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "debate_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_bracket: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_streak: number | null
          display_name: string | null
          elo_by_format: Json
          id: string
          is_public: boolean
          region: string | null
          total_debates: number | null
          total_wins: number | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          age_bracket?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          elo_by_format?: Json
          id?: string
          is_public?: boolean
          region?: string | null
          total_debates?: number | null
          total_wins?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          age_bracket?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          elo_by_format?: Json
          id?: string
          is_public?: boolean
          region?: string | null
          total_debates?: number | null
          total_wins?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          count: number
          id: string
          user_id: string
          window_start: string
        }
        Insert: {
          action: string
          count?: number
          id?: string
          user_id: string
          window_start?: string
        }
        Update: {
          action?: string
          count?: number
          id?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invite_code: { Args: never; Returns: string }
      get_timer_state: { Args: { p_room_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_room_participant: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      set_timer_state: {
        Args: { p_room_id: string; p_timer_state: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      debate_format: "BP" | "AP" | "LD" | "PF" | "WSDC"
      debate_role:
        | "proposition"
        | "opposition"
        | "government"
        | "opening_government"
        | "closing_government"
        | "opening_opposition"
        | "closing_opposition"
        | "affirmative"
        | "negative"
      invite_status: "active" | "consumed" | "expired"
      match_mode: "ranked" | "unranked"
      match_result: "win" | "loss" | "draw"
      opponent_type: "human_only" | "ai_only" | "human_then_ai"
      queue_status: "waiting" | "matched" | "cancelled" | "expired"
      region_preference: "local" | "national" | "global"
      room_status: "reserved" | "live" | "completed" | "abandoned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      debate_format: ["BP", "AP", "LD", "PF", "WSDC"],
      debate_role: [
        "proposition",
        "opposition",
        "government",
        "opening_government",
        "closing_government",
        "opening_opposition",
        "closing_opposition",
        "affirmative",
        "negative",
      ],
      invite_status: ["active", "consumed", "expired"],
      match_mode: ["ranked", "unranked"],
      match_result: ["win", "loss", "draw"],
      opponent_type: ["human_only", "ai_only", "human_then_ai"],
      queue_status: ["waiting", "matched", "cancelled", "expired"],
      region_preference: ["local", "national", "global"],
      room_status: ["reserved", "live", "completed", "abandoned"],
    },
  },
} as const
