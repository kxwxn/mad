import { supabase } from './supabase';

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
}

export async function insertProduct(productData: ProductInput) {
  try {
    console.log('Inserting product with data:', productData);

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        price: productData.price,
        description: productData.description,
        product_info: productData.product_info,
        size_1: productData.size_1,
        size_2: productData.size_2,
        size_3: productData.size_3,
        os: productData.os,
        image_urls: productData.image_urls
      }])
      .select()
      .single();

    if (error) {
      console.error('Product insertion error:', error);
      throw error;
    }

    console.log('Product inserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error inserting product:', error);
    throw error;
  }
}