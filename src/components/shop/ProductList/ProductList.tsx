"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import styles from "./ProductList.module.css";
import Image from 'next/image';
import { useInfiniteProducts } from '@/hooks/queries/useProducts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useInView } from 'react-intersection-observer';
import { Product } from "@/lib/supabase/product";

const ProductCard = memo(({ product, index }: { product: Product; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { id, name, price, image_urls, description, product_type, s, m, l, os, colors } = product;
  const imageUrl = image_urls?.[0] || '/images/placeholder.png';

  const renderSizeInfo = () => {
    if (product_type === 'Miscellaneous') {
      return <div className={styles.sizeInfo}>{os > 0 ? 'AVAILABLE' : 'SOLD OUT'}</div>;
    }
    
    if (product_type === 'T-shirts' || product_type === 'Hoodie') {
      if (s === 0 && m === 0 && l === 0) {
        return <div className={styles.sizeInfo}>SOLD OUT</div>;
      }

      return (
        <div className={styles.sizeInfo}>
          <span className={s === 0 ? styles.soldOut : ''}>{s === 0 ? 'S' : 'S'}</span>
          <span className={m === 0 ? styles.soldOut : ''}>{m === 0 ? 'M' : 'M'}</span>
          <span className={l === 0 ? styles.soldOut : ''}>{l === 0 ? 'L' : 'L'}</span>
        </div>
      );
    }

    if (product_type === 'Earrings') {
      if (!colors || colors.length === 0) {
        return <div className={styles.sizeInfo}>SOLD OUT</div>;
      }
      return (
        <div className={styles.sizeInfo}>
          {colors.map((colorVariant, index) => (
            <span key={index} className={colorVariant.quantity === 0 ? styles.soldOut : ''}>
              {colorVariant.color}
            </span>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Link 
      href={`/shop/${id}`} 
      className={styles.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageContainer}>
        <Image 
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.image}
          style={{ objectFit: 'cover' }} 
          priority={index < 4} // 처음 4개 이미지만 priority 적용
        />
        {isHovered && (
          <div className={styles.sizeOverlay}>
            {renderSizeInfo()}
          </div>
        )}
      </div>
      <div className={styles.productInfo}>
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.description}>{description}</p>
        <span className={styles.price}>
          € {price?.toLocaleString()}
        </span>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

const ProductList: React.FC = () => {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteProducts();

  // 스크롤이 하단에 도달하면 다음 페이지 로드
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (status === 'error') {
    return <div className={styles.error}>상품 목록을 불러오는데 실패했습니다.</div>;
  }

  const products = data?.pages.flat() || [];

  if (!products.length) {
    return (
      <div className={styles.emptyContainer}>
        <h2>No products available</h2>
        <p>Please check back later</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        {products.map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} index={index} />
        ))}
      </div>
      
      {/* 로딩 트리거 요소 */}
      <div ref={ref} className={styles.loadingTrigger}>
        {isFetchingNextPage && (
          <div className={styles.loadingMore}>
            <LoadingSpinner size="medium" />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProductList);
