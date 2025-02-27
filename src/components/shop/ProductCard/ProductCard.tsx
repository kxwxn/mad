"use client";
import { useState } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import CartModal from "@/components/shop/CartModal/CartModal";
import WishlistModal from "@/components/shop/WishlistModal/WishlistModal";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import WishlistIcon from "../WishlistIcon/WishlistIcon";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_urls: string[];
  details?: string[];
  size_guide?: string;
  shipping?: string;
  product_info?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // 위시리스트 관련 상태와 함수
  const isInWishlist = useWishlistStore(state => state.isInWishlist(product.id));
  const addToWishlist = useWishlistStore(state => state.addItem);
  const removeFromWishlist = useWishlistStore(state => state.removeItem);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      setShowSizeAlert(true);
      return;
    }

    try {
      useCartStore.getState().addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image_urls[0],
        quantity: 1,
        selectedSize,
      });

      setSuccessMessage("Added to cart");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      setIsCartModalOpen(true);
      
      console.log("Cart items:", useCartStore.getState().items);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart");
      setShowSizeAlert(true);
    }
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      try {
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image_urls[0],
          sizes: ["1", "2", "3"]  // availableSizes를 sizes로 변경
        };
        
        addToWishlist(wishlistItem);
      } catch (err) {
        console.error("위시리스트 추가 중 에러 발생:", err);
      }
    }
  };
  
  // 위시리스트 모달 열기 함수 수정
  const openWishlistModal = () => {
    setIsWishlistModalOpen(true);
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
          <div className={styles.headerSection}>
            <h1 className={styles.name}>{product.name}</h1>
            <div className={styles.buttonGroup}>
              <Link href="/shop" className={styles.shopButton}>
                [ <span>→</span> SHOP ]
              </Link>
              <button 
                className={styles.cartButton} 
                onClick={() => setIsCartModalOpen(true)}
                type="button"
              >
                [ CART ]
              </button>
              <button 
                className={styles.wishlistModalButton} 
                onClick={openWishlistModal}
                type="button"
                aria-label="Open wishlist"
              >
                <WishlistIcon 
                  productId=""
                  filled={false}
                  onClick={openWishlistModal}
                  className={styles.headerWishlistIcon}
                />
              </button>
            </div>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              € {product.price?.toLocaleString()}
            </span>
          </div>

          <button
            className={`${styles.sizeGuideBtn} ${
              showSizeGuide ? styles.active : ""
            }`}
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
            <div className={styles.addToCartBox}>
              <button 
                className={styles.addToCartButton} 
                onClick={handleAddToCart}
                type="button"
              >
                ADD TO CART
              </button>
              <button 
                className={styles.wishlistButton} 
                onClick={handleWishlistToggle}
                type="button"
              >
                <WishlistIcon 
                  productId={product.id}
                  product={product}
                  className={styles.wishlistIconInButton}
                />
              </button>
            </div>
          </div>

          <div className={styles.accordionContainer}>
            <div className={styles.accordionItem}>
              <div
                className={`${styles.accordionHeader} ${
                  openInfo ? styles.active : ""
                }`}
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
                className={`${styles.accordionHeader} ${
                  openShipping ? styles.active : ""
                }`}
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
                2-3 days in EU{"\n"}
                1-2 weeks in rest of the world
              </div>
            </div>
          </div>

          <div className={styles.footerText}>
            *Prices excl. VAT, excl. shipping costs.
          </div>
        </div>
      </section>

      {showSizeAlert && (
        <div className={styles.alertOverlay} onClick={() => setShowSizeAlert(false)}>
          <div className={styles.alertBox} onClick={(e) => e.stopPropagation()}>
            {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className={styles.successOverlay} onClick={() => setSuccessMessage("")}>
          <div className={styles.successBox} onClick={(e) => e.stopPropagation()}>
            {successMessage}
          </div>
        </div>
      )}

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        openCartModal={() => setIsCartModalOpen(true)}
      />
    </div>
  );
}
