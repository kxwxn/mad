"use client";

import React from "react";
import styles from "./QuantitySelector.module.css";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number | ((prev: number) => number)) => void;
}

export default function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  return (
    <div className={styles.quantitySelector}>
      <button
        className={styles.quantityButton}
        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        type="button"
      >
        -
      </button>
      <span className={styles.quantityValue}>{quantity}</span>
      <button
        className={styles.quantityButton}
        onClick={() => setQuantity((prev) => prev + 1)}
        type="button"
      >
        +
      </button>
    </div>
  );
}
