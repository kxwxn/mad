// /components/shop/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* 이미지 컨테이너 */}
        <div className="relative w-full aspect-square">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* 상품 정보 */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">{product.title}</h2>
          <p className="text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}