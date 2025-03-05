export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ColorVariant {
  color: string;
  quantity: number;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price: number
          image_urls: string[]
          image_url: string | null
          status: 'AVAILABLE' | 'SOLD_OUT'
          product_info: string
          sizeType: 'numbered' | 'onesize'
          size_1: number
          size_2: number
          size_3: number
          os: number
          updated_at: string
          product_type: 'T-shirts' | 'Hoodie' | 'Earrings' | 'Miscellaneous'
          colors: ColorVariant[]
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
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
