"use client";

import { useState } from "react";
import AdminProductList from "@/components/admin/AdminProductList/AdminProductList";
import EditProductPanel from "@/components/admin/EditProductPanel/EditProductPanel";
import AddProductButton from "@/components/admin/AddProductButton/AddProductButton";
import styles from "./page.module.css";
import { Product } from "@/types/product.types";

export default function ProductAdminPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleProductUpdate = () => {
    setSelectedProduct(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        <AddProductButton />
      </div>
      <AdminProductList
        onProductClick={handleProductClick}
        key={refreshTrigger}
      />
      <EditProductPanel
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onProductUpdate={handleProductUpdate}
      />
    </div>
  );
}
