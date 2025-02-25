// src/components/admin/AddProductButton/AddProductButton.tsx
"use client";
import { useState } from "react";
import AddProductModal from "../AddProductModal/AddProductModal";
import styles from "./AddProductButton.module.css";

export default function AddProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
        [ + ]
      </button>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
