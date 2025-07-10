import React from "react";
import Image from "next/image";
import styles from "./EditProductForm.module.css";
import { Product, ProductType } from "@/types/product.types";

interface EditProductFormProps {
  formData: Product;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStockChange: (size: 's' | 'm' | 'l' | 'os', value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeNewImage: (index: number) => void;
  newImages: File[];
}

export default function EditProductForm({
  formData,
  handleInputChange,
  handleStockChange,
  handleImageUpload,
  removeImage,
  removeNewImage,
  newImages,
}: EditProductFormProps) {
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="productInfo">Product Info</label>
        <textarea
          id="productInfo"
          name="product_info"
          value={formData.product_info}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="productType">Product Type</label>
        <select
          id="productType"
          name="product_type"
          value={formData?.product_type || 'T-shirts'}
          onChange={(e) => {
            const newType = e.target.value as ProductType;
            // This part needs to be handled in the parent component (EditProductPanel)
            // setFormData(prev => prev ? {...prev, product_type: newType} : null);
          }}
          required
        >
          <option value="T-shirts">T-shirts</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Earrings">Earrings</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
      </div>

      {formData.product_type === 'T-shirts' || formData.product_type === 'Hoodie' ? (
        <div className={styles.stockGroup}>
          <h3>Size Stock</h3>
          <div className={styles.sizeInputs}>
            <div>
              <label>S</label>
              <input
                type="number"
                name="s"
                value={formData.s}
                onChange={(e) => handleStockChange('s', e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label>M</label>
              <input
                type="number"
                name="m"
                value={formData.m}
                onChange={(e) => handleStockChange('m', e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label>L</label>
              <input
                type="number"
                name="l"
                value={formData.l}
                onChange={(e) => handleStockChange('l', e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.stockGroup}>
          <h3>Stock</h3>
          <div className={styles.sizeInputs}>
            <div>
              <label>Quantity</label>
              <input
                type="number"
                name="os"
                value={formData.os}
                onChange={(e) => handleStockChange('os', e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label>Product Images (Max 5)</label>
        <div className={styles.imageGrid}>
          {formData.image_urls.map((url, index) => (
            <div key={`existing-${index}`} className={styles.imageContainer}>
              <Image
                src={url}
                alt={`Product ${index + 1}`}
                width={100}
                height={100}
                className={styles.image}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className={styles.removeImage}
              >
                ×
              </button>
            </div>
          ))}
          {newImages.map((file, index) => (
            <div key={`new-${index}`} className={styles.imageContainer}>
              <Image
                src={URL.createObjectURL(file)}
                alt={`New ${index + 1}`}
                width={100}
                height={100}
                className={styles.image}
              />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className={styles.removeImage}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className={styles.fileInput}
        />
      </div>
    </>
  );
}
