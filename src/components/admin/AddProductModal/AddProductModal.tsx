// src/components/admin/AddProductButton/AddProductModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddProductModal.module.css";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // 오버플로우 숨기기
    } else {
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = ''; // 오버플로우 복원
      }, 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen && !isVisible) return null;

  return (
    <>
      <div className={`${styles.overlay} ${isVisible ? styles.visible : ""}`} onClick={handleClose} />
      <div className={`${styles.modal} ${isVisible ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>Add Product</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            [ close ]
          </button>
        </div>
        <div className={styles.content}>
          {/* Add product form or content here */}
        </div>
      </div>
    </>
  );
};

export default AddProductModal;