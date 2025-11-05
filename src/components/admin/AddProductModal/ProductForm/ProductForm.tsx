import React from "react";
import styles from "./ProductForm.module.css";
import { ProductType, ColorVariant } from "@/types/product.types";

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  product_info: string;
  product_type: ProductType;
  s: number;
  m: number;
  l: number;
  os: number;
  images: File[];
  colors: ColorVariant[];
}

interface ProductFormProps {
  formData: ProductFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  addColor: () => void;
  updateColor: (index: number, field: keyof ColorVariant, value: string | number) => void;
  removeColor: (index: number) => void;
}

export default function ProductForm({
  formData,
  handleInputChange,
  addColor,
  updateColor,
  removeColor,
}: ProductFormProps) {
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="productType">Product Type</label>
        <select
          id="productType"
          name="product_type"
          value={formData.product_type}
          onChange={handleInputChange}
          required
        >
          <option value="T-shirts">T-shirts</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Earrings">Earrings</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">Product Name</label>
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
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          pattern="[0-9]*"
          inputMode="numeric"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Short Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="productInfo">Detailed Information</label>
        <textarea
          id="productInfo"
          name="product_info"
          value={formData.product_info}
          onChange={handleInputChange}
          required
        />
      </div>

      {(formData.product_type === 'T-shirts' || formData.product_type === 'Hoodie') && (
        <div className={styles.sizesContainer}>
          <div className={styles.sizeGroup}>
            <label>Size S Quantity</label>
            <input
              type="text"
              name="s"
              value={formData.s}
              onChange={handleInputChange}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
          <div className={styles.sizeGroup}>
            <label>Size M Quantity</label>
            <input
              type="text"
              name="m"
              value={formData.m}
              onChange={handleInputChange}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
          <div className={styles.sizeGroup}>
            <label>Size L Quantity</label>
            <input
              type="text"
              name="l"
              value={formData.l}
              onChange={handleInputChange}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
        </div>
      )}

      {formData.product_type === 'Earrings' && (
        <div className={styles.sizesContainer}>
          <div className={styles.colorSection}>
            <div className={styles.colorHeader}>
              <h3>Color Variants</h3>
              <button 
                type="button" 
                onClick={addColor}
                className={styles.addColorBtn}
              >
                + Add Color
              </button>
            </div>
            {formData.colors.map((colorVar, index) => (
              <div key={index} className={styles.colorGroup}>
                <input
                  type="text"
                  placeholder="Color name"
                  value={colorVar.color}
                  onChange={(e) => updateColor(index, 'color', e.target.value)}
                  className={styles.colorInput}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={colorVar.quantity}
                  onChange={(e) => updateColor(index, 'quantity', parseInt(e.target.value) || 0)}
                  min="0"
                  className={styles.quantityInput}
                />
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className={styles.removeColorBtn}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {formData.product_type === 'Miscellaneous' && (
        <div className={styles.sizesContainer}>
          <div className={styles.sizeGroup}>
            <label>Total Quantity</label>
            <input
              type="text"
              name="os"
              value={formData.os}
              onChange={handleInputChange}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
        </div>
      )}
    </>
  );
}
