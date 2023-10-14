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
      accounts: {
        Row: {
          address_line: string | null
          city: string
          country: string
          created_at: string
          created_by: string
          currency: string
          edited_at: string | null
          edited_by: string | null
          id: string
          is_active: boolean | null
          name: string
          revenue: number | null
          source: string
          state: string | null
          status: string
          website: string | null
          zip: string | null
        }
        Insert: {
          address_line?: string | null
          city: string
          country: string
          created_at?: string
          created_by?: string
          currency: string
          edited_at?: string | null
          edited_by?: string | null
          id: string
          is_active?: boolean | null
          name: string
          revenue?: number | null
          source: string
          state?: string | null
          status: string
          website?: string | null
          zip?: string | null
        }
        Update: {
          address_line?: string | null
          city?: string
          country?: string
          created_at?: string
          created_by?: string
          currency?: string
          edited_at?: string | null
          edited_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          revenue?: number | null
          source?: string
          state?: string | null
          status?: string
          website?: string | null
          zip?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
