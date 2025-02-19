"use client";

import React from "react";
import styles from "./CartButton.module.css";

interface CartButtonProps {
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.cartButton} onClick={onClick}>
      [ cart ]
    </button>
  );
};

export default CartButton;
