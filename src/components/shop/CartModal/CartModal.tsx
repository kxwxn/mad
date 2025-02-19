'use client';

import React, { useEffect, useState } from 'react';
import styles from './CartModal.module.css';
import { cartStorage, CartItem } from '@/utils/cart';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCartItems(cartStorage.getItems());
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

  const handleRemoveItem = (id: string, selectedSize: string) => {
    const updatedItems = cartStorage.removeItem(id, selectedSize);
    setCartItems(updatedItems);
  };

  const handleUpdateQuantity = (id: string, selectedSize: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedItems = cartStorage.updateQuantity(id, selectedSize, quantity);
    setCartItems(updatedItems);
  };

  // 가격 포맷팅을 위한 헬퍼 함수
  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return '0'; // null 또는 undefined 처리
    return price.toLocaleString();
  };

  if (!isOpen && !isVisible) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <>
      <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={handleClose} />
      <div className={`${styles.modal} ${isVisible ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>CART</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            [ close ]
          </button>
        </div>
        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <p>EMPTY</p>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className={styles.cartItem}>
                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemBrand}>{item.brand}</div>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemSize}>Size: {item.selectedSize}</div>
                      <div className={styles.itemPrice}>
                        ${formatPrice(item.price)}
                      </div>
                      <div className={styles.quantityControl}>
                        <button onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                    >
                      [ remove ]
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.cartFooter}>
                <div className={styles.totalPrice}>
                  TOTAL: ${formatPrice(totalPrice)}
                </div>
                <button className={styles.checkoutButton}>
                  CHECKOUT
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;