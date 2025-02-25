import { createClient } from '@/utils/supabase/client';

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
    const supabase = createClient();

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