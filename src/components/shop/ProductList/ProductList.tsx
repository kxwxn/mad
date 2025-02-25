"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./ProductList.module.css";
import { createClient } from "@/utils/supabase/client";
import Image from 'next/image';
import { Product } from '@/types/product.types';

const supabase = createClient();

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return;
    }

    if (data) {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        {products?.map((product) => (
          <Link
            href={`/shop/${product.id}`}
            key={product.id}
            className={styles.productLink}
          >
            <div className={styles.productCard}>
              <div className={styles.imageContainer}>
                <Image 
                  src={product.image_urls?.[0] || "/api/placeholder/400/400"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className={styles.image}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className={styles.productInfo}>
                <h4 className={styles.name}>{product.name}</h4>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>
                    € {product.price?.toLocaleString()}
                  </span>
                </div>
                {product.status === "SOLD_OUT" && (
                  <span className={styles.soldOut}>SOLD OUT</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
