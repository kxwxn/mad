import { getAdminClient } from './adminClient';
import { Product, ProductInput, ProductType, ColorVariant } from '@/types/product.types';

export type { Product, ProductInput, ProductType, ColorVariant };

export const getAdminProducts = async (from?: number, to?: number) => {
  const supabase = getAdminClient();
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

export const getAdminProduct = async (id: string) => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
};

export async function insertAdminProduct(productData: ProductInput): Promise<Product> {
  try {
    const supabase = getAdminClient();

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

export const updateAdminProduct = async (id: string, product: Partial<Product>) => {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteAdminProduct = async (id: string) => {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 