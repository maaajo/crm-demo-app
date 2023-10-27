import { TAccountStatus, TCurrency, TSource } from "./account";

export type Json =
  | string
  | number
  | boolean
  | undefined
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          address_line: string | undefined;
          city: string;
          country: string;
          created_at: string;
          created_by: string;
          currency: TCurrency;
          edited_at: string | undefined;
          edited_by: string | undefined;
          id: string;
          is_active: boolean;
          name: string;
          revenue: number | undefined;
          source: TSource;
          state: string | undefined;
          status: TAccountStatus;
          website: string | undefined;
          zip: string | undefined;
        };
        Insert: {
          address_line?: string | undefined;
          city: string;
          country: string;
          created_at?: string;
          created_by?: string;
          currency: TCurrency;
          edited_at?: string | undefined;
          edited_by?: string | undefined;
          id?: string;
          is_active?: boolean;
          name: string;
          revenue?: number | undefined;
          source: TSource;
          state?: string | undefined;
          status: TAccountStatus;
          website?: string | undefined;
          zip?: string | undefined;
        };
        Update: {
          address_line?: string | undefined;
          city?: string;
          country?: string;
          created_at?: string;
          created_by?: string;
          currency?: TCurrency;
          edited_at?: string | undefined;
          edited_by?: string | undefined;
          id?: string;
          is_active?: boolean;
          name?: string;
          revenue?: number | undefined;
          source?: TSource;
          state?: string | undefined;
          status?: TAccountStatus;
          website?: string | undefined;
          zip?: string | undefined;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
