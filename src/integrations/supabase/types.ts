export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          completed_at: string | null
          created_at: string | null
          delivered_count: number | null
          failed_count: number | null
          id: string
          message_template_id: string | null
          platform: string | null
          scheduled_at: string | null
          sent_count: number | null
          started_at: string | null
          status: string | null
          title: string
          total_recipients: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          message_template_id?: string | null
          platform?: string | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          title: string
          total_recipients?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          message_template_id?: string | null
          platform?: string | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          title?: string
          total_recipients?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_message_template_id_fkey"
            columns: ["message_template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          group_name: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          telegram_id: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          telegram_id?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          telegram_id?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      instagram_accounts: {
        Row: {
          bio: string | null
          created_at: string | null
          daily_dm_count: number | null
          daily_dm_limit: number | null
          engagement_rate: number | null
          facebook_page_id: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          is_private: boolean | null
          is_verified: boolean | null
          last_activity: string | null
          last_dm_reset: string | null
          name: string
          oauth_access_token: string | null
          oauth_connected_at: string | null
          oauth_provider: string | null
          oauth_refresh_token: string | null
          oauth_token_expires_at: string | null
          posts_count: number | null
          profile_pic_url: string | null
          proxy_config: Json | null
          session_data: Json | null
          stats_updated_at: string | null
          status: string | null
          updated_at: string | null
          use_for_posting: boolean | null
          user_id: string
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          daily_dm_count?: number | null
          daily_dm_limit?: number | null
          engagement_rate?: number | null
          facebook_page_id?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_private?: boolean | null
          is_verified?: boolean | null
          last_activity?: string | null
          last_dm_reset?: string | null
          name: string
          oauth_access_token?: string | null
          oauth_connected_at?: string | null
          oauth_provider?: string | null
          oauth_refresh_token?: string | null
          oauth_token_expires_at?: string | null
          posts_count?: number | null
          profile_pic_url?: string | null
          proxy_config?: Json | null
          session_data?: Json | null
          stats_updated_at?: string | null
          status?: string | null
          updated_at?: string | null
          use_for_posting?: boolean | null
          user_id: string
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          daily_dm_count?: number | null
          daily_dm_limit?: number | null
          engagement_rate?: number | null
          facebook_page_id?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_private?: boolean | null
          is_verified?: boolean | null
          last_activity?: string | null
          last_dm_reset?: string | null
          name?: string
          oauth_access_token?: string | null
          oauth_connected_at?: string | null
          oauth_provider?: string | null
          oauth_refresh_token?: string | null
          oauth_token_expires_at?: string | null
          posts_count?: number | null
          profile_pic_url?: string | null
          proxy_config?: Json | null
          session_data?: Json | null
          stats_updated_at?: string | null
          status?: string | null
          updated_at?: string | null
          use_for_posting?: boolean | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      instagram_auto_posts: {
        Row: {
          content_type: string
          content_url: string
          created_at: string | null
          generated_caption: string | null
          generated_hashtags: string | null
          generation_history: Json | null
          id: string
          instagram_account_id: string | null
          published_at: string | null
          scheduled_at: string | null
          status: string | null
          style_prompt: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_type: string
          content_url: string
          created_at?: string | null
          generated_caption?: string | null
          generated_hashtags?: string | null
          generation_history?: Json | null
          id?: string
          instagram_account_id?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          style_prompt: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_type?: string
          content_url?: string
          created_at?: string | null
          generated_caption?: string | null
          generated_hashtags?: string | null
          generation_history?: Json | null
          id?: string
          instagram_account_id?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          style_prompt?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instagram_auto_posts_instagram_account_id_fkey"
            columns: ["instagram_account_id"]
            isOneToOne: false
            referencedRelation: "instagram_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_contacts: {
        Row: {
          created_at: string | null
          display_name: string | null
          group_name: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          updated_at: string | null
          user_id: string
          user_id_instagram: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          group_name?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
          user_id_instagram?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          group_name?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          user_id_instagram?: string | null
          username?: string
        }
        Relationships: []
      }
      instagram_message_logs: {
        Row: {
          campaign_id: string
          created_at: string | null
          error_message: string | null
          id: string
          instagram_account_id: string
          instagram_contact_id: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          instagram_account_id: string
          instagram_contact_id: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          instagram_account_id?: string
          instagram_contact_id?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instagram_message_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_message_logs_instagram_account_id_fkey"
            columns: ["instagram_account_id"]
            isOneToOne: false
            referencedRelation: "instagram_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_message_logs_instagram_contact_id_fkey"
            columns: ["instagram_contact_id"]
            isOneToOne: false
            referencedRelation: "instagram_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      message_logs: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string | null
          error_message: string | null
          id: string
          sent_at: string | null
          status: string | null
          telegram_account_id: string
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          telegram_account_id: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          telegram_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_telegram_account_id_fkey"
            columns: ["telegram_account_id"]
            isOneToOne: false
            referencedRelation: "telegram_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          media_url: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      telegram_accounts: {
        Row: {
          api_token: string
          created_at: string | null
          id: string
          last_activity: string | null
          name: string
          phone: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_token: string
          created_at?: string | null
          id?: string
          last_activity?: string | null
          name: string
          phone: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_token?: string
          created_at?: string | null
          id?: string
          last_activity?: string | null
          name?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_scheduled_auto_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_oauth_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_daily_dm_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
