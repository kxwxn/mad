import { supabase } from './config';
import { Product } from '@/types/product';

export async function getProducts(from = 0, to = 11) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch products');
  }

  return data;
}


export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Failed to fetch product');
  }

  return data;
}

