import React, { useState, useEffect } from "react";
import styles from "./AddProductModal.module.css";
import { insertProduct, ProductInput, ColorVariant, ProductType } from "@/lib/supabase/product";
import { uploadProductImage } from "@/lib/supabase/storage";
import Image from "next/image";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    description: "",
    product_info: "",
    product_type: "T-shirts",
    s: 0,
    m: 0,
    l: 0,
    os: 0,
    images: [],
    colors: []
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // 숫자 필드에 대한 처리
    if (name === 'price' || name === 's' || name === 'm' || name === 'l' || name === 'os') {
      const numValue = value === '' ? 0 : Number(value);
      if (!isNaN(numValue)) {
        setFormData((prev) => ({ ...prev, [name]: numValue }));
      }
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (formData.images.length + newFiles.length > 5) {
        alert("Max 5 images");
        return;
      }

      imageUrls.forEach((url) => URL.revokeObjectURL(url));
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImageUrls(newUrls);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles].slice(0, 5),
      }));
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      product_info: "",
      product_type: "T-shirts",
      s: 0,
      m: 0,
      l: 0,
      os: 0,
      images: [],
      colors: []
    });
    setImageUrls([]);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const imageUrls = await Promise.all(
        formData.images.map((file) => uploadProductImage(file))
      );

      const productInput: ProductInput = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image_urls: imageUrls,
        product_type: formData.product_type as ProductType,
        s: Number(formData.s || 0),
        m: Number(formData.m || 0),
        l: Number(formData.l || 0),
        os: Number(formData.os || 0),
        colors: formData.colors || [],
        product_info: formData.product_info || ''
      };

      await insertProduct(productInput);
      alert("Product added successfully.");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { color: "", quantity: 0 }],
    }));
  };

  const updateColor = (index: number, field: keyof ColorVariant, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.map((colorVar, i) =>
        i === index ? { ...colorVar, [field]: value } : colorVar
      ),
    }));
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isVisible ? styles.visible : ""}`}
        onClick={handleClose}
      />
      <div className={`${styles.modal} ${isVisible ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>Add Product</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            [ x ]
          </button>
        </div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
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

            <div className={styles.formGroup}>
              <label htmlFor="images">Product Images (Maximum 5)</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              {formData.images.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                  {formData.images.map((file, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <Image
                        src={imageUrls[index]}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImageBtn}
                      >
                        ×
                      </button>
                      <span className={styles.imageNumber}>{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "ADD PRODUCT"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
