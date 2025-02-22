"use client";
import { useState } from "react";
import styles from "./ProductCard.module.css";
import { cartStorage, CartItem } from "@/utils/cart";
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  description?: string;
  image_urls: string[];
  details?: string[];
  size_guide?: string;
  shipping?: string;
  product_info?: string;
}

interface ProductCardProps {
  product: Product;
  onCartUpdate?: () => void;
}

export default function ProductCard({
  product,
  onCartUpdate,
}: ProductCardProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const imageUrl = product.image_urls?.[0] || "/api/placeholder/400/400";

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      selectedSize,
      quantity: 1,
      imageUrl: imageUrl,
    };

    cartStorage.addItem(cartItem);
    onCartUpdate?.();
    alert("Added to cart");
  };

  return (
    <div className={styles.container}>
      <section className={styles.imageSection}>
        {product.image_urls?.map((url, index) => (
          <Image 
            key={index}
            src={url || "/api/placeholder/400/400"}
            alt={`${product.name} - Image ${index + 1}`}
            width={500}
            height={300}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
            className={styles.productImage}
          />
        ))}
      </section>

      <div className={styles.divider} />

      <section className={styles.infoSection}>
        <div className={styles.productInfo}>
          <div className={styles.brand}>{product.brand}</div>
          <h1 className={styles.name}>{product.name}</h1>
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

          <button
            className={`${styles.sizeGuideBtn} ${showSizeGuide ? styles.active : ''}`}
            onClick={() => setShowSizeGuide(!showSizeGuide)}
          >
            [SIZE GUIDE]
          </button>

          {showSizeGuide && (
            <div className={styles.sizeGuideInfo}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>shoulder</th>
                    <th>chest</th>
                    <th>arm</th>
                    <th>length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>42cm</td>
                    <td>96cm</td>
                    <td>61cm</td>
                    <td>65cm</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>44cm</td>
                    <td>100cm</td>
                    <td>62cm</td>
                    <td>67cm</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>46cm</td>
                    <td>104cm</td>
                    <td>63cm</td>
                    <td>69cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.selectBoxContainer}>
            <div className={styles.selectBoxWrapper}>
              <div
                className={`${styles.selectBox} ${
                  isSelectOpen ? styles.active : ""
                }`}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span>{selectedSize || "SELECT SIZE"}</span>
                <span className={styles.arrowDown}>▼</span>
              </div>
              {isSelectOpen && (
                <div className={styles.optionsContainer}>
                  <div
                    className={styles.option}
                    onClick={() => {
                      setSelectedSize("1");
                      setIsSelectOpen(false);
                    }}
                  >
                    1
                  </div>
                  <div
                    className={styles.option}
                    onClick={() => {
                      setSelectedSize("2");
                      setIsSelectOpen(false);
                    }}
                  >
                    2
                  </div>
                  <div
                    className={styles.option}
                    onClick={() => {
                      setSelectedSize("3");
                      setIsSelectOpen(false);
                    }}
                  >
                    3
                  </div>
                </div>
              )}
            </div>
            <div className={styles.addToCartBox} onClick={handleAddToCart}>
              <span>ADD TO CART</span>
            </div>
          </div>

          <div className={styles.accordionContainer}>
            <div className={styles.accordionItem}>
              <div
                className={`${styles.accordionHeader} ${openInfo ? styles.active : ''}`}
                onClick={() => setOpenInfo(!openInfo)}
              >
                <span>PRODUCT INFO</span>
                <span className={styles.toggleIcon}>
                  {openInfo ? "[ - ]" : "[ + ]"}
                </span>
              </div>
              <div
                className={`${styles.accordionContent} ${
                  openInfo ? styles.open : ""
                }`}
              >
                {product.product_info}
              </div>
            </div>

            <div className={styles.accordionItem}>
              <div
                className={`${styles.accordionHeader} ${openShipping ? styles.active : ''}`}
                onClick={() => setOpenShipping(!openShipping)}
              >
                <span>SHIPPING</span>
                <span className={styles.toggleIcon}>
                  {openShipping ? "[ - ]" : "[ + ]"}
                </span>
              </div>
              <div
                className={`${styles.accordionContent} ${
                  openShipping ? styles.open : ""
                }`}
              >
                2-3 days in EU{'\n'}
                1-2 weeks in rest of the world
              </div>
            </div>
          </div>

          <div className={styles.footerText}>
            *Prices excl. VAT, excl. shipping costs.
          </div>
        </div>
      </section>
    </div>
  );
}
