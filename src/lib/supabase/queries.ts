import { getClient } from '@/lib/supabase/client';
import { Product } from '@/types/product.types';

export const getProducts = async (from: number, to: number): Promise<Product[]> => {
  const client = getClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const client = getClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const client = getClient();
  const { data, error } = await client
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
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

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const client = getClient();
  const { error } = await client
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

