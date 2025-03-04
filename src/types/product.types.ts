export type ProductStatus = 'AVAILABLE' | 'SOLD_OUT';
export type SizeType = 'numbered' | 'onesize';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  image_url: string | null;
  status: ProductStatus;
  product_info: string;
  sizeType: SizeType;
  size_1: number;
  size_2: number;
  size_3: number;
  os: number;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;