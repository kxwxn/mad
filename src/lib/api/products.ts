import { getServerClient } from '@/lib/supabase/client';
import { Product, ProductInput } from '@/types/product.types';
import { handleSupabaseError } from '@/lib/errorHandling';
import { NotFoundError } from '@/lib/errors';

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
    const client = getServerClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .range(from, to)
      .order(orderBy, { ascending: orderDirection === 'asc' });

    if (error) {
      handleSupabaseError(error);
    }

    return (data || []) as Product[];
  },

  getProduct: async ({ id }: GetProductParams): Promise<Product> => {
    const client = getServerClient();
    const { data, error } = await client
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

    return data as Product;
  },

  createProduct: async (product: ProductInput): Promise<Product> => {
    const client = getServerClient();
    const { data, error } = await client
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    return data as Product;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const client = getServerClient();
    const { data, error } = await client
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

    return data as Product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const client = getServerClient();
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error);
    }
  }
};