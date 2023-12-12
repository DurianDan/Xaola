export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      shopify_app_category: {
        Row: {
          category_type: string | null
          created_on: string
          id: number
          name: string
          parent_category_id: number | null
          shopify_page: string
          updated_at: string
        }
        Insert: {
          category_type?: string | null
          created_on?: string
          id?: number
          name: string
          parent_category_id?: number | null
          shopify_page: string
          updated_at?: string
        }
        Update: {
          category_type?: string | null
          created_on?: string
          id?: number
          name?: string
          parent_category_id?: number | null
          shopify_page?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_app_category_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "shopify_app_category"
            referencedColumns: ["id"]
          }
        ]
      }
      shopify_app_description_log: {
        Row: {
          app_id: number
          created_on: string
          description: string | null
          id: number
        }
        Insert: {
          app_id: number
          created_on?: string
          description?: string | null
          id?: number
        }
        Update: {
          app_id?: number
          created_on?: string
          description?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "shopify_app_description_log_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "shopify_app_info"
            referencedColumns: ["id"]
          }
        ]
      }
      shopify_app_info: {
        Row: {
          app_name: string | null
          avg_rating: number | null
          created_on: string
          id: number
          partner_id: number | null
          review_count: number | null
          shopify_page: string
          updated_at: string
        }
        Insert: {
          app_name?: string | null
          avg_rating?: number | null
          created_on?: string
          id?: number
          partner_id?: number | null
          review_count?: number | null
          shopify_page: string
          updated_at?: string
        }
        Update: {
          app_name?: string | null
          avg_rating?: number | null
          created_on?: string
          id?: number
          partner_id?: number | null
          review_count?: number | null
          shopify_page?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_app_info_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "shopify_partner"
            referencedColumns: ["id"]
          }
        ]
      }
      shopify_app_reviews: {
        Row: {
          app_id: number
          approx_days_on_app: number
          content: string
          created_on: string
          date_posted: string
          id: number
          last_updated_page: number
          rating: number
          store_location: string
          store_name: string
        }
        Insert: {
          app_id: number
          approx_days_on_app: number
          content: string
          created_on?: string
          date_posted: string
          id?: number
          last_updated_page: number
          rating: number
          store_location: string
          store_name: string
        }
        Update: {
          app_id?: number
          approx_days_on_app?: number
          content?: string
          created_on?: string
          date_posted?: string
          id?: number
          last_updated_page?: number
          rating?: number
          store_location?: string
          store_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_app_reviews_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "shopify_app_info"
            referencedColumns: ["id"]
          }
        ]
      }
      shopify_category_rank_log: {
        Row: {
          app_id: number
          category_id: number
          created_on: string
          id: number
          rank: number
        }
        Insert: {
          app_id: number
          category_id: number
          created_on?: string
          id?: number
          rank: number
        }
        Update: {
          app_id?: number
          category_id?: number
          created_on?: string
          id?: number
          rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "shopify_category_rank_log_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "shopify_app_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopify_category_rank_log_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "shopify_app_category"
            referencedColumns: ["id"]
          }
        ]
      }
      shopify_community_user_stats: {
        Row: {
          community_user_name: string
          community_user_page: string
          community_user_type: string
          created_on: string
          id: number
          likes_count: number
          partner_id: number | null
          posts_count: number
          solutions_count: number
          topics_started_count: number
          updated_at: string
        }
        Insert: {
          community_user_name: string
          community_user_page: string
          community_user_type: string
          created_on?: string
          id?: number
          likes_count: number
          partner_id?: number | null
          posts_count: number
          solutions_count: number
          topics_started_count: number
          updated_at?: string
        }
        Update: {
          community_user_name?: string
          community_user_page?: string
          community_user_type?: string
          created_on?: string
          id?: number
          likes_count?: number
          partner_id?: number | null
          posts_count?: number
          solutions_count?: number
          topics_started_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_community_user_stats_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "shopify_partner"
            referencedColumns: ["id"]
          }
        ]
      }
      shopify_community_user_stats_log: {
        Row: {
          community_user_id: number
          created_on: string
          id: number
          likes_count: number
          posts_count: number
          solutions_count: number
          topics_started_count: number
        }
        Insert: {
          community_user_id: number
          created_on?: string
          id?: number
          likes_count: number
          posts_count: number
          solutions_count: number
          topics_started_count: number
        }
        Update: {
          community_user_id?: number
          created_on?: string
          id?: number
          likes_count?: number
          posts_count?: number
          solutions_count?: number
          topics_started_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "shopify_community_user_stats_log_community_user_id_fkey"
            columns: ["community_user_id"]
            isOneToOne: false
            referencedRelation: "shopify_community_user_stats_log"
            referencedColumns: ["id"]
          }
        ]
      }
      shopify_partner: {
        Row: {
          apps_published: number | null
          avg_rating: number | null
          business_location: string | null
          business_website: string | null
          created_on: string
          id: number
          name: string | null
          shopify_page: string
          support_cellphone: string | null
          support_email: string | null
          unknown_support_info: string[] | null
          updated_at: string
          years_built_apps: number | null
        }
        Insert: {
          apps_published?: number | null
          avg_rating?: number | null
          business_location?: string | null
          business_website?: string | null
          created_on?: string
          id?: number
          name?: string | null
          shopify_page: string
          support_cellphone?: string | null
          support_email?: string | null
          unknown_support_info?: string[] | null
          updated_at?: string
          years_built_apps?: number | null
        }
        Update: {
          apps_published?: number | null
          avg_rating?: number | null
          business_location?: string | null
          business_website?: string | null
          created_on?: string
          id?: number
          name?: string | null
          shopify_page?: string
          support_cellphone?: string | null
          support_email?: string | null
          unknown_support_info?: string[] | null
          updated_at?: string
          years_built_apps?: number | null
        }
        Relationships: []
      }
      shopify_pricing_plan: {
        Row: {
          additional_price_option: string | null
          app_id: number
          created_on: string
          id: number
          offer: string | null
          plan_name: string
          price: string | null
        }
        Insert: {
          additional_price_option?: string | null
          app_id: number
          created_on?: string
          id?: number
          offer?: string | null
          plan_name: string
          price?: string | null
        }
        Update: {
          additional_price_option?: string | null
          app_id?: number
          created_on?: string
          id?: number
          offer?: string | null
          plan_name?: string
          price?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_pricing_plan_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "shopify_app_info"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

export type DBShopifyPartner = Database['public']['Tables']['shopify_partner']['Insert'];
export type DBShopifyAppCategory = Database['public']['Tables']['shopify_app_category']['Insert'];
export type DBShopifyAppDetail = Database['public']['Tables']['shopify_app_info']['Insert'];
export type DBShopifyAppReview = Database['public']['Tables']['shopify_app_reviews']['Insert'];
export type DBShopifyPricingPlan = Database['public']['Tables']['shopify_pricing_plan']['Insert'];
export type DBShopifyCategoryRankLog = Database['public']['Tables']['shopify_category_rank_log']['Insert'];
export type DBShopifyAppDescriptionLog = Database['public']['Tables']['shopify_app_description_log']['Insert'];
export type DBShopifyCommunityUserStats = Database['public']['Tables']['shopify_community_user_stats']['Insert'];
export type DBShopifyCommunityUserStatsLog = Database['public']['Tables']['shopify_community_user_stats_log']['Insert'];
export type DBIndexEntityTable = DBShopifyPartner | DBShopifyAppCategory | DBShopifyAppDetail