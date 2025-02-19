// src/components/admin/AddProductButton/AddProductButton.tsx
"use client";
import { useState } from "react";
import AddProductModal from "../AddProductModal/AddProductModal";
import styles from "./AddProductButton.module.css";

export default function AddProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleOpenModal} className={styles.textButton}>
        [ + ]
      </button>
      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
