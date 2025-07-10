"use client";

import React from "react";
import styles from "./ProductOptions.module.css";
import { Product } from "@/types/product.types";

interface ProductOptionsProps {
  product: Product;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  isSelectOpen: boolean;
  setIsSelectOpen: (isOpen: boolean) => void;
}

export default function ProductOptions({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  isSelectOpen,
  setIsSelectOpen,
}: ProductOptionsProps) {
  const renderSizeOptions = () => {
    if (product.product_type !== 'T-shirts' && product.product_type !== 'Hoodie') {
      return null;
    }

    return (
      <div className={styles.selectBoxContainer}>
        <div className={styles.selectBoxWrapper}>
          <div
            className={`${styles.selectBox} ${isSelectOpen ? styles.active : ""}`}
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
                  if (product.s > 0) {
                    setSelectedSize("S");
                    setIsSelectOpen(false);
                  }
                }}
                style={{
                  cursor: product.s > 0 ? 'pointer' : 'not-allowed',
                  color: product.s > 0 ? '#000' : '#999',
                  textDecoration: product.s === 0 ? 'line-through' : 'none'
                }}
              >
                S
              </div>
              <div
                className={styles.option}
                onClick={() => {
                  if (product.m > 0) {
                    setSelectedSize("M");
                    setIsSelectOpen(false);
                  }
                }}
                style={{
                  cursor: product.m > 0 ? 'pointer' : 'not-allowed',
                  color: product.m > 0 ? '#000' : '#999',
                  textDecoration: product.m === 0 ? 'line-through' : 'none'
                }}
              >
                M
              </div>
              <div
                className={styles.option}
                onClick={() => {
                  if (product.l > 0) {
                    setSelectedSize("L");
                    setIsSelectOpen(false);
                  }
                }}
                style={{
                  cursor: product.l > 0 ? 'pointer' : 'not-allowed',
                  color: product.l > 0 ? '#000' : '#999',
                  textDecoration: product.l === 0 ? 'line-through' : 'none'
                }}
              >
                L
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderColorOptions = () => {
    if (product.product_type !== 'Earrings' || !product.colors?.length) {
      return null;
    }

    return (
      <div className={styles.selectBoxContainer}>
        <div className={styles.selectBoxWrapper}>
          <div
            className={`${styles.selectBox} ${isSelectOpen ? styles.active : ""}`}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            <span>{selectedColor || "SELECT COLOR"}</span>
            <span className={styles.arrowDown}>▼</span>
          </div>
          {isSelectOpen && (
            <div className={styles.optionsContainer}>
              {product.colors.map((colorVariant, index) => (
                <div
                  key={index}
                  className={styles.option}
                  onClick={() => {
                    if (colorVariant.quantity > 0) {
                      setSelectedColor(colorVariant.color);
                      setIsSelectOpen(false);
                    }
                  }}
                  style={{
                    cursor: colorVariant.quantity > 0 ? 'pointer' : 'not-allowed',
                    color: colorVariant.quantity > 0 ? '#000' : '#999',
                    textDecoration: colorVariant.quantity === 0 ? 'line-through' : 'none'
                  }}
                >
                  {colorVariant.color}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderSizeOptions()}
      {renderColorOptions()}
    </>
  );
}
