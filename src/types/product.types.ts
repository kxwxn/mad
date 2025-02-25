export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  product_info: string;
  image_urls: string[];
  status?: string;
  sizeType: 'numbered' | 'onesize';
  size_1: number;
  size_2: number;
  size_3: number;
  os: number;
}

export interface ProductInput {
  name: string;
  price: number;
  description: string;
  product_info: string;
  sizeType: 'numbered' | 'onesize';
  size_1: number;
  size_2: number;
  size_3: number;
  os: number;
  image_urls: string[];
}