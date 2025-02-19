"use client";

import React, { useState } from "react";
import ProductList from "../ProductList/ProductList";
import CartButton from "../CartButton/CartButton";
import CartModal from "../CartModal/CartModal";
import styles from "./ShopContainer.module.css";

export default function ShopContainer() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CartButton onClick={() => setIsCartOpen(true)} />
      </div>
      <ProductList />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}