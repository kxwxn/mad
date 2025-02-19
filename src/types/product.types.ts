export interface ProductInput {
  name: string;
  price: number;
  description: string;
  productInfo: string;
  sizeType: 'numbered' | 'onesize';
  sizes: Array<{
    size: string;
    quantity: number;
  }>;
}