'use client';

import React, { useEffect, useState } from 'react';
import styles from './WishlistModal.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  openCartModal: () => void; // 카트 모달을 열기 위한 함수 추가
}

interface WishlistItemType {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sizes: string[];  // optional 제거
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose, openCartModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Get state and actions from Zustand store
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };
  
  const handleAddToCart = (item: WishlistItemType) => {
    const defaultSize = item.sizes.length > 0 ? item.sizes[0] : "ONE SIZE";
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      selectedSize: defaultSize,
      quantity: 1
    });
    
    removeItem(item.id);
    handleClose();
    openCartModal();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <>
      <div
        className={`${styles.overlay} ${isVisible ? styles.visible : ""}`}
        onClick={handleClose}
      />
      <div className={`${styles.modal} ${isVisible ? styles.open : ""}`}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={handleClose}>
            [ X CLOSE ]
          </button>
          <Link href="/shop" className={styles.shopButton}>
            [ <span>→</span> SHOP ]
          </Link>
        </div>
        <div className={styles.content}>
          {wishlistItems.length === 0 ? (
            <p>YOUR WISHLIST IS EMPTY</p>
          ) : (
            <>
              <div className={styles.wishlistItems}>
                {wishlistItems.map((item) => (
                  <div key={item.id} className={styles.wishlistItem}>
                    <div className={styles.itemDetails}>
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.price}>
                        € {(item.price || 0).toLocaleString()}
                      </div>
                      <div className={styles.actions}>
                        <button 
                          className={styles.addToCartButton}
                          onClick={() => handleAddToCart(item)}
                        >
                          ADD TO CART
                        </button>
                        <button 
                          className={styles.removeButton}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          [ REMOVE ]
                        </button>
                      </div>
                    </div>
                    <div className={styles.itemImageContainer}>
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.wishlistFooter}>
                <div className={styles.wishlistInfo}>
                  WISHLIST ITEMS: {wishlistItems.length}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistModal;