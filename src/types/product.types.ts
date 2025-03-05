export type ProductStatus = 'AVAILABLE' | 'SOLD_OUT';
export type SizeType = 'numbered' | 'onesize';
export type ProductType = 'T-shirts' | 'Hoodie' | 'Earrings' | 'Miscellaneous';

export interface ColorVariant {
  color: string;
  quantity: number;
}

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
  s: number;
  m: number;
  l: number;
  os: number;
  product_type: ProductType;
  created_at: string;
  updated_at: string;
  colors?: ColorVariant[];
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  product_type: ProductType;
  s: number;
  m: number;
  l: number;
  os: number;
  colors: ColorVariant[];
  product_info: string;
}

export type ProductUpdateInput = Partial<ProductInput>;