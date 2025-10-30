import { getClient } from '@/lib/supabase/client';
import { Product, ProductInput } from '@/types/product.types';
import { handleSupabaseError } from '@/lib/errorHandling';

export const getProducts = async (from: number, to: number): Promise<Product[]> => {
  const client = getClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) handleSupabaseError(error);
  return data || [];
};

export const getProduct = async (id: string): Promise<Product> => {
  const client = getClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) handleSupabaseError(error);
  if (!data) {
    throw new Error('Product not found');
  }
  return data;
};

export const createProduct = async (product: ProductInput): Promise<Product> => {
  const client = getClient();
  const { data, error } = await client
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const client = getClient();
  const { data, error } = await client
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) handleSupabaseError(error);
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const client = getClient();
  const { error } = await client
    .from('products')
    .delete()
    .eq('id', id);

  if (error) handleSupabaseError(error);
};

