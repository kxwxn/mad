"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import CartButton from "../CartButton/CartButton";
import WishlistIcon from "../WishlistIcon/WishlistIcon";
import styles from "./ShopContainer.module.css";

const ProductList = dynamic(() => import("../ProductList/ProductList"), { ssr: false });
const CartModal = dynamic(() => import("../CartModal/CartModal"), { ssr: false });
const WishlistModal = dynamic(() => import("../WishlistModal/WishlistModal"), { ssr: false });

export default function ShopContainer() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // 카트 모달을 여는 함수
  const openCartModal = () => {
    setIsCartOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerButtons}>
          <WishlistIcon 
            productId="" 
            filled={false} 
            onClick={() => setIsWishlistOpen(true)}
            className={styles.wishlistIcon}
          />
          <CartButton onClick={openCartModal} />
        </div>
      </div>
      <ProductList />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistModal 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
        openCartModal={openCartModal}
      />
    </div>
  );
}