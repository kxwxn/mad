"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './AdminProductList.module.css';
import { Product } from '@/types/product.types';

interface AdminProductListProps {
  onProductClick: (product: Product) => void;
}

const AdminProductList: React.FC<AdminProductListProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div 
            key={product.id} 
            className={styles.productCard}
            onClick={() => onProductClick(product)}
          >
            <div className={styles.imageContainer}>
              <Image 
                src={product.image_urls?.[0] || "/api/placeholder/400/400"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className={styles.image}
                style={{ objectFit: 'cover' }}
              />
              <span className={`${styles.status} ${product.status === 'SOLD_OUT' ? styles.soldOut : ''}`}>
                {product.status}
              </span>
            </div>
            <div className={styles.productInfo}>
              <h4 className={styles.name}>{product.name}</h4>
              <p className={styles.description}>{product.description}</p>
              <span className={styles.price}>
                € {product.price?.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;