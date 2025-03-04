"use client";

import React, { useEffect, useState } from "react";
import styles from "./CartModal.module.css";
import Image from "next/image";
import CheckoutButton from "../CheckOutButton/CheckOutButton";
import { useCartStore } from "@/store/cartStore";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Zustand store에서 상태와 액션 가져오기
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

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

  const handleUpdateQuantity = (
    id: string,
    selectedSize: string,
    quantity: number
  ) => {
    if (quantity < 1) return;
    updateQuantity(id, selectedSize, quantity);
  };

  const handleRemoveItem = (id: string, selectedSize: string) => {
    removeItem(id, selectedSize);
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
        </div>
        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <p>EMPTY</p>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className={styles.cartItem}
                  >
                    <div className={styles.itemDetails}>
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.size}>SIZE: {item.selectedSize}</div>
                      <div className={styles.quantityControl}>
                        <button onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}>—</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}>+</button>
                      </div>
                      <button 
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                      >
                        [ REMOVE ]
                      </button>
                    </div>
                    <div className={styles.itemImageContainer}>
                      <div className={styles.itemPrice}>
                        € {item.price?.toLocaleString()}
                      </div>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.cartFooter}>
                <div className={styles.totalText}>
                  TOTAL
                  <span>(Shipping calculated at checkout)</span>
                </div>
                <div className={styles.totalPrice}>
                  €{totalPrice.toLocaleString()}
                  <span>(Excl. VAT)</span>
                </div>
                <CheckoutButton />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;