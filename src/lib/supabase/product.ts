import { getClient } from './client';
import { Product, ProductInput, ProductType, ColorVariant } from '@/types/product.types';

export type { Product, ProductInput, ProductType, ColorVariant };

export const getProducts = async (from?: number, to?: number) => {
  const supabase = getClient();
  const query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (typeof from === 'number' && typeof to === 'number') {
    query.range(from, to);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Product[];
};

export const getProduct = async (id: string) => {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
};

export async function insertProduct(productData: ProductInput): Promise<Product> {
  try {
    const supabase = getClient();

    // 숫자 필드 검증
    const numberFields = ['price', 's', 'm', 'l', 'os'] as const;
    numberFields.forEach(field => {
      const value = productData[field];
      if (typeof value !== 'number') {
        (productData[field] as number) = Number(value);
      }
    });

    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  } catch (error) {
    throw error;
  }
}

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: string) => {
  const supabase = getClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};