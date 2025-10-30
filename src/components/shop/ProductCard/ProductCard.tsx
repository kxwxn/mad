"use client";
import { useState, useMemo } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import CartModal from "@/components/shop/CartModal/CartModal";
import WishlistModal from "@/components/shop/WishlistModal/WishlistModal";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import WishlistIcon from "../WishlistIcon/WishlistIcon";
import { Product } from "@/lib/supabase/product";
import ProductOptions from "../ProductOptions/ProductOptions";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import AlertMessage from "@/components/ui/AlertMessage/AlertMessage";
import Accordion from "@/components/ui/Accordion/Accordion";
import SuccessMessage from "@/components/ui/SuccessMessage/SuccessMessage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  const [quantity, setQuantity] = useState(1);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const isInWishlist = useWishlistStore(state => state.isInWishlist(product.id));
  const addToWishlist = useWishlistStore(state => state.addItem);
  const removeFromWishlist = useWishlistStore(state => state.removeItem);
  const addToCart = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    if (isSoldOut) return;

    if (product.product_type === 'T-shirts' || product.product_type === 'Hoodie') {
      if (!selectedSize) {
        setError("Please select a size");
        setShowAlert(true);
        return;
      }
    }

    if (product.product_type === 'Earrings' && !selectedColor) {
      setError("Please select a color");
      setShowAlert(true);
      return;
    }

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image_urls[0],
        selectedSize: selectedSize || 'OS',
        selectedColor,
        quantity
      };
      
      addToCart(cartItem);
      setSuccessMessage("Added to cart");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsCartModalOpen(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart");
      setShowAlert(true);
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
          sizes: product.product_type === 'T-shirts' || product.product_type === 'Hoodie' 
            ? ['S', 'M', 'L'] 
            : ['OS']
        };
        
        addToWishlist(wishlistItem);
      } catch (err) {
        console.error("위시리스트 추가 중 에러 발생:", err);
      }
    }
  };

  

  

  const isSoldOut = useMemo(() => {
    if (product.product_type === 'T-shirts' || product.product_type === 'Hoodie') {
      return product.s === 0 && product.m === 0 && product.l === 0;
    }
    if (product.product_type === 'Earrings') {
      return !product.colors || product.colors.length === 0 || product.colors.every(c => c.quantity === 0);
    }
    return product.os === 0;
  }, [product]);

  return (
    <div className={styles.container}>
      <section className={styles.imageSection}>
        {product.image_urls?.map((url, index) => (
          <Image
            key={index}
            src={url}
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
                onClick={() => setIsWishlistModalOpen(true)}
                type="button"
                aria-label="Open wishlist"
              >
                <WishlistIcon 
                  productId=""
                  filled={false}
                  onClick={() => setIsWishlistModalOpen(true)}
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
                    <td>S</td>
                    <td>42cm</td>
                    <td>96cm</td>
                    <td>61cm</td>
                    <td>65cm</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>44cm</td>
                    <td>100cm</td>
                    <td>62cm</td>
                    <td>67cm</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>46cm</td>
                    <td>104cm</td>
                    <td>63cm</td>
                    <td>69cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <ProductOptions
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            isSelectOpen={isSelectOpen}
            setIsSelectOpen={setIsSelectOpen}
          />

          <div className={styles.addToCartBox}>
            <button
              className={`${styles.addToCartButton} ${isSoldOut ? styles.soldOut : ''}`}
              onClick={handleAddToCart}
              type="button"
              disabled={isSoldOut}
            >
              {isSoldOut ? 'SOLD OUT' : 'ADD TO CART'}
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

          <div className={styles.quantitySelectorContainer}>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          </div>

          <div className={styles.accordionContainer}>
            <Accordion title="PRODUCT INFO">
            {product.product_info}
          </Accordion>

          <Accordion title="SHIPPING">
            2-3 days in EU
            1-2 weeks in rest of the world
          </Accordion>
          </div>

          <div className={styles.footerText}>
            *Prices excl. VAT, excl. shipping costs.
          </div>
        </div>
      </section>

      {showAlert && (
        <AlertMessage message={error} onClose={() => setShowAlert(false)} />
      )}

      {successMessage && (
        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />
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