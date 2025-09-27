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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          company_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          message_body: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      elements: {
        Row: {
          created_at: string
          id: string
          name: string
          properties: Json | null
          type: string
          updated_at: string
          world_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          properties?: Json | null
          type: string
          updated_at?: string
          world_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          properties?: Json | null
          type?: string
          updated_at?: string
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "elements_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      premises: {
        Row: {
          created_at: string
          id: string
          premise: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          premise: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          premise?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          email: string | null
          full_name: string | null
          id: string
          unsubscribed: boolean
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          unsubscribed?: boolean
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          unsubscribed?: boolean
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      relationships: {
        Row: {
          created_at: string
          id: string
          properties: Json | null
          source_element_id: string
          target_element_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          properties?: Json | null
          source_element_id: string
          target_element_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          properties?: Json | null
          source_element_id?: string
          target_element_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationships_source_element_id_fkey"
            columns: ["source_element_id"]
            isOneToOne: false
            referencedRelation: "elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_target_element_id_fkey"
            columns: ["target_element_id"]
            isOneToOne: false
            referencedRelation: "elements"
            referencedColumns: ["id"]
          },
        ]
      }
      story_sparks: {
        Row: {
          comparisons: string
          created_at: string
          hero_description: string
          hero_name: string
          hero_save_the_cat_moment: string
          id: number
          logline: string
          premise_id: string | null
          story_engine: string
          story_roadmap: string[]
          thematic_premise: string
          title: string[]
          user_id: string
        }
        Insert: {
          comparisons: string
          created_at?: string
          hero_description: string
          hero_name: string
          hero_save_the_cat_moment: string
          id?: number
          logline: string
          premise_id?: string | null
          story_engine: string
          story_roadmap: string[]
          thematic_premise: string
          title: string[]
          user_id: string
        }
        Update: {
          comparisons?: string
          created_at?: string
          hero_description?: string
          hero_name?: string
          hero_save_the_cat_moment?: string
          id?: number
          logline?: string
          premise_id?: string | null
          story_engine?: string
          story_roadmap?: string[]
          thematic_premise?: string
          title?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_sparks_premise_id_fkey"
            columns: ["premise_id"]
            isOneToOne: false
            referencedRelation: "premises"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          plan_id: string | null
          stripe_customer_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          plan_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          plan_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by_user_id: string | null
          created_at: string
          expires_at: string
          id: string
          invited_by_user_id: string
          invited_user_email: string
          role: Database["public"]["Enums"]["team_role"]
          status: string
          team_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_user_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by_user_id: string
          invited_user_email: string
          role?: Database["public"]["Enums"]["team_role"]
          status?: string
          team_id: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by_user_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invited_by_user_id?: string
          invited_user_email?: string
          role?: Database["public"]["Enums"]["team_role"]
          status?: string
          team_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_memberships: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      wish_list_items: {
        Row: {
          created_at: string
          description: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      world_assets: {
        Row: {
          asset_category: string
          created_at: string | null
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          size_bytes: number | null
          updated_at: string | null
          uploaded_by_user_id: string | null
          world_id: string
        }
        Insert: {
          asset_category?: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          size_bytes?: number | null
          updated_at?: string | null
          uploaded_by_user_id?: string | null
          world_id: string
        }
        Update: {
          asset_category?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          size_bytes?: number | null
          updated_at?: string | null
          uploaded_by_user_id?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_assets_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_business_details: {
        Row: {
          business_models: string | null
          created_at: string | null
          goals_creative: string | null
          goals_economic: string | null
          goals_user: string | null
          id: string
          success_indicators: string | null
          target_audience: string | null
          updated_at: string | null
          user_need: string | null
          world_id: string
        }
        Insert: {
          business_models?: string | null
          created_at?: string | null
          goals_creative?: string | null
          goals_economic?: string | null
          goals_user?: string | null
          id?: string
          success_indicators?: string | null
          target_audience?: string | null
          updated_at?: string | null
          user_need?: string | null
          world_id: string
        }
        Update: {
          business_models?: string | null
          created_at?: string | null
          goals_creative?: string | null
          goals_economic?: string | null
          goals_user?: string | null
          id?: string
          success_indicators?: string | null
          target_audience?: string | null
          updated_at?: string | null
          user_need?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_business_details_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: true
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_design_specs: {
        Row: {
          branding_guidelines_intro: string | null
          created_at: string | null
          design_aesthetic_description: string | null
          full_assets_list_description: string | null
          id: string
          media_design_styles_notes: string | null
          style_guide_notes: string | null
          updated_at: string | null
          world_id: string
        }
        Insert: {
          branding_guidelines_intro?: string | null
          created_at?: string | null
          design_aesthetic_description?: string | null
          full_assets_list_description?: string | null
          id?: string
          media_design_styles_notes?: string | null
          style_guide_notes?: string | null
          updated_at?: string | null
          world_id: string
        }
        Update: {
          branding_guidelines_intro?: string | null
          created_at?: string | null
          design_aesthetic_description?: string | null
          full_assets_list_description?: string | null
          id?: string
          media_design_styles_notes?: string | null
          style_guide_notes?: string | null
          updated_at?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_design_specs_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: true
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_functional_specs: {
        Row: {
          created_at: string | null
          id: string
          world_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          world_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_functional_specs_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: true
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_plot_points: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_index: number
          updated_at: string | null
          world_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_index?: number
          updated_at?: string | null
          world_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_index?: number
          updated_at?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_plot_points_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_tech_specs: {
        Row: {
          created_at: string | null
          id: string
          world_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          world_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_tech_specs_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: true
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_treatments: {
        Row: {
          backstory_context: string | null
          characterization_attitude: string | null
          created_at: string | null
          id: string
          synopsis: string | null
          tagline: string | null
          updated_at: string | null
          world_id: string
        }
        Insert: {
          backstory_context?: string | null
          characterization_attitude?: string | null
          created_at?: string | null
          id?: string
          synopsis?: string | null
          tagline?: string | null
          updated_at?: string | null
          world_id: string
        }
        Update: {
          backstory_context?: string | null
          characterization_attitude?: string | null
          created_at?: string | null
          id?: string
          synopsis?: string | null
          tagline?: string | null
          updated_at?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_treatments_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: true
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_user_scenarios: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_index: number
          updated_at: string | null
          world_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_index?: number
          updated_at?: string | null
          world_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_index?: number
          updated_at?: string | null
          world_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "world_user_scenarios_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      worlds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          map_image_url: string | null
          map_type: Database["public"]["Enums"]["map_type_enum"]
          name: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          map_image_url?: string | null
          map_type?: Database["public"]["Enums"]["map_type_enum"]
          name: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          map_image_url?: string | null
          map_type?: Database["public"]["Enums"]["map_type_enum"]
          name?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "worlds_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_team_invitation: {
        Args: { p_invitation_id: string }
        Returns: undefined
      }
      get_team_details_for_member: {
        Args: { input_team_id: string }
        Returns: {
          id: string
          name: string
          owner_user_id: string
        }[]
      }
      get_user_role_in_team: {
        Args: { p_team_id: string; p_user_id: string }
        Returns: Database["public"]["Enums"]["team_role"]
      }
      get_user_teams_with_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          owner_id: string
          team_id: string
          team_name: string
          user_role: Database["public"]["Enums"]["team_role"]
        }[]
      }
      is_team_member: {
        Args: { team_id_to_check: string }
        Returns: boolean
      }
      is_world_member: {
        Args: { p_user_id: string; p_world_id: string }
        Returns: boolean
      }
    }
    Enums: {
      invitation_status: "pending" | "accepted" | "declined"
      map_type_enum: "openstreetmap" | "custom_image"
      team_role:
        | "owner"
        | "admin"
        | "member"
        | "writer"
        | "canon-editor"
        | "story-lead"
        | "world-architect"
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
      invitation_status: ["pending", "accepted", "declined"],
      map_type_enum: ["openstreetmap", "custom_image"],
      team_role: [
        "owner",
        "admin",
        "member",
        "writer",
        "canon-editor",
        "story-lead",
        "world-architect",
      ],
    },
  },
} as const
