"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./ProductList.module.css";
import CartModal from "../CartModal/CartModal";
import { createClient } from "@/utils/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  brand?: string;
  image_url?: string;
  status?: string;
  original_price?: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      if (data) {
        setProducts(data);
      }
    };

    fetchProducts();
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
                <img
                  src={product.image_url || "/api/placeholder/400/400"}
                  alt={product.name}
                  className={styles.image}
                />
              </div>

              <div className={styles.productInfo}>
                <h3 className={styles.brand}>
                  {product.brand || "Brand Name"}
                </h3>

                <h4 className={styles.name}>{product.name}</h4>

                <div className={styles.priceContainer}>
                  <span className={styles.price}>
                    ${product.price?.toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className={styles.originalPrice}>
                      ${product.original_price?.toLocaleString()}
                    </span>
                  )}
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
