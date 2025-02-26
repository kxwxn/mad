"use client";

import React, { useEffect, useState } from "react";
import styles from "./CartModal.module.css";
import { cartStorage } from "@/utils/cart/storage";
import type { CartItem } from "@/utils/cart/types";
import Image from "next/image";
import CheckoutButton from "../CheckOutButton/CheckOutButton";
import Link from "next/link";

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

  const handleUpdateQuantity = (
    id: string,
    selectedSize: string,
    quantity: number
  ) => {
    if (quantity < 1) return;
    const updatedItems = cartStorage.updateQuantity(id, selectedSize, quantity);
    setCartItems(updatedItems);
  };

  if (!isOpen && !isVisible) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

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
                <CheckoutButton cartItems={cartItems} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
