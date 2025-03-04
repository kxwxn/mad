import { supabase } from '@/lib/supabase/config';
import { Database } from '@/types/database.types';
import { handleSupabaseError } from '@/lib/errorHandling';
import { NotFoundError } from '@/lib/errors';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface GetProductsParams {
  from?: number;
  to?: number;
  orderBy?: keyof Product;
  orderDirection?: 'asc' | 'desc';
}

export interface GetProductParams {
  id: string;
}

export const productApi = {
  getProducts: async ({ 
    from = 0, 
    to = 11, 
    orderBy = 'created_at',
    orderDirection = 'desc' 
  }: GetProductsParams = {}): Promise<Product[]> => {
    const { data, error } = await supabase()
      .from('products')
      .select('*')
      .range(from, to)
      .order(orderBy, { ascending: orderDirection === 'asc' });

    if (error) {
      handleSupabaseError(error);
    }

    return data || [];
  },

  getProduct: async ({ id }: GetProductParams): Promise<Product> => {
    const { data, error } = await supabase()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    if (!data) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return data;
  },

  createProduct: async (product: ProductInsert): Promise<Product> => {
    const { data, error } = await supabase()
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    return data;
  },

  updateProduct: async (id: string, updates: ProductUpdate): Promise<Product> => {
    const { data, error } = await supabase()
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    if (!data) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const { error } = await supabase()
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error);
    }
  }
};