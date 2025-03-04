import { getClient } from './client';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  product_info: string;
  size_1: number;
  size_2: number;
  size_3: number;
  os: number;
  image_urls: string[];
  status: string;
  created_at: string;
}

export const getProducts = async () => {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

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

export interface ProductInput {
  name: string;
  price: number;
  description: string;
  product_info: string;
  size_1: number;
  size_2: number;
  size_3: number;
  os: number;
  image_urls: string[];
  status: string;
  [key: string]: string | number | string[];
}

export async function insertProduct(productData: ProductInput) {
  try {
    const supabase = getClient();

    // 숫자 필드 검증
    const numberFields = ['price', 'size_1', 'size_2', 'size_3', 'os'];
    numberFields.forEach(field => {
      if (typeof productData[field] !== 'number') {
        productData[field] = Number(productData[field]);
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

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
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