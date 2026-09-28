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
      addresses: {
        Row: {
          city: string
          created_at: string
          full_address: string
          id: string
          is_default: boolean | null
          mobile: string
          name: string
          pincode: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          full_address: string
          id?: string
          is_default?: boolean | null
          mobile: string
          name: string
          pincode: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          full_address?: string
          id?: string
          is_default?: boolean | null
          mobile?: string
          name?: string
          pincode?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string | null
          product_image_url: string
          product_name: string
          quantity: number
          selected_color: string | null
          selected_size: string
          tryon_image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id?: string | null
          product_image_url: string
          product_name: string
          quantity?: number
          selected_color?: string | null
          selected_size: string
          tryon_image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string | null
          product_image_url?: string
          product_name?: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string
          tryon_image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
        ]
      }
      garments: {
        Row: {
          category: string
          color: string | null
          created_at: string
          description: string | null
          gender: string | null
          id: string
          image_url: string
          name: string
          price: number
          size: string | null
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          image_url: string
          name: string
          price?: number
          size?: string | null
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          image_url?: string
          name?: string
          price?: number
          size?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string | null
          product_image_url: string
          product_name: string
          quantity: number
          selected_color: string | null
          selected_size: string
          tryon_image_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          product_image_url: string
          product_name: string
          quantity: number
          selected_color?: string | null
          selected_size: string
          tryon_image_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          product_image_url?: string
          product_name?: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string
          tryon_image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          created_at: string
          delivery_address: string
          delivery_charge: number
          delivery_city: string
          delivery_mobile: string
          delivery_name: string
          delivery_pincode: string
          delivery_state: string
          delivery_type: string
          estimated_delivery: string | null
          id: string
          order_number: string
          payment_method: string
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          delivery_address: string
          delivery_charge?: number
          delivery_city: string
          delivery_mobile: string
          delivery_name: string
          delivery_pincode: string
          delivery_state: string
          delivery_type?: string
          estimated_delivery?: string | null
          id?: string
          order_number: string
          payment_method?: string
          status?: string
          subtotal: number
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          created_at?: string
          delivery_address?: string
          delivery_charge?: number
          delivery_city?: string
          delivery_mobile?: string
          delivery_name?: string
          delivery_pincode?: string
          delivery_state?: string
          delivery_type?: string
          estimated_delivery?: string | null
          id?: string
          order_number?: string
          payment_method?: string
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      try_on_sessions: {
        Row: {
          created_at: string
          detected_gender: string | null
          garment_id: string
          id: string
          result_image_url: string | null
          status: string
          updated_at: string
          user_id: string
          user_image_url: string
        }
        Insert: {
          created_at?: string
          detected_gender?: string | null
          garment_id: string
          id?: string
          result_image_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
          user_image_url: string
        }
        Update: {
          created_at?: string
          detected_gender?: string | null
          garment_id?: string
          id?: string
          result_image_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          user_image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "try_on_sessions_garment_id_fkey"
            columns: ["garment_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          page: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          page?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          page?: string | null
          user_id?: string
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
      user_sessions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          login_time: string
          logout_time: string | null
          session_duration_seconds: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          login_time?: string
          logout_time?: string | null
          session_duration_seconds?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          login_time?: string
          logout_time?: string | null
          session_duration_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string | null
          product_image_url: string
          product_name: string
          tryon_image_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id?: string | null
          product_image_url: string
          product_name: string
          tryon_image_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string | null
          product_image_url?: string
          product_name?: string
          tryon_image_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    },
  },
} as const
