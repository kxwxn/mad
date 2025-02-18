'use client'
import { useState } from 'react';
import styles from './ProductCard.module.css';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  description?: string;
  images: string[];  
  details?: string[];
  size_guide?: string;
  shipping?: string;
  productInfo?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
const [selectedSize, setSelectedSize] = useState('');
  

  return (
    <div className={styles.container}>
      <section className={styles.imageSection}>
        {product.images?.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl || "/api/placeholder/400/400"}
            alt={`${product.name} - Image ${index + 1}`}
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
            <span className={styles.price}>${product.price?.toLocaleString()}</span>
            {product.original_price && (
              <span className={styles.originalPrice}>
                ${product.original_price?.toLocaleString()}
              </span>
            )}
          </div>

          <button 
            className={styles.sizeGuideBtn}
            onClick={() => setShowSizeGuide(!showSizeGuide)}
          >
            [SIZE GUIDE]
          </button>

          <div className={styles.selectBoxContainer}>
  <div className={styles.selectBoxWrapper}>
    <div 
      className={`${styles.selectBox} ${isSelectOpen ? styles.active : ''}`}
      onClick={() => setIsSelectOpen(!isSelectOpen)}
    >
      <span>{selectedSize || 'SELECT SIZE'}</span>
      <span className={styles.arrowDown}>▼</span>
    </div>
    {isSelectOpen && (
      <div className={styles.optionsContainer}>
        <div 
          className={styles.option} 
          onClick={() => {
            setSelectedSize('1');
            setIsSelectOpen(false);
          }}
        >
          1
        </div>
        <div 
          className={styles.option}
          onClick={() => {
            setSelectedSize('2');
            setIsSelectOpen(false);
          }}
        >
          2
        </div>
        <div 
          className={styles.option}
          onClick={() => {
            setSelectedSize('3');
            setIsSelectOpen(false);
          }}
        >
          3
        </div>
      </div>
    )}
  </div>
  <div className={styles.addToCartBox}>
    <span>ADD TO CART</span>
    <span className={styles.heartIcon}>♡</span>
  </div>
</div>


          <div className={styles.accordionContainer}>
            <div className={styles.accordionItem}>
              <div 
                className={styles.accordionHeader}
                onClick={() => setOpenInfo(!openInfo)}
              >
                <span>PRODUCT INFO</span>
                <span className={styles.toggleIcon}>
                  {openInfo ? '[-]' : '[+]'}
                </span>
              </div>
              <div className={`${styles.accordionContent} ${openInfo ? styles.open : ''}`}>
                {product.productInfo}
              </div>
            </div>

            <div className={styles.accordionItem}>
              <div 
                className={styles.accordionHeader}
                onClick={() => setOpenShipping(!openShipping)}
              >
                <span>SHIPPING</span>
                <span className={styles.toggleIcon}>
                  {openShipping ? '[-]' : '[+]'}
                </span>
              </div>
              <div className={`${styles.accordionContent} ${openShipping ? styles.open : ''}`}>
                {product.shipping}
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