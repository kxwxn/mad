import React, { useState, useEffect } from "react";
import styles from "./AddProductModal.module.css";
import { insertProduct } from "@/lib/supabase/product";
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
  sizeType: "numbered" | "onesize";
  size_1: number;
  size_2: number;
  size_3: number;
  os: number;
  images: File[];
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
    sizeType: "numbered",
    size_1: 0,
    size_2: 0,
    size_3: 0,
    os: 0,
    images: [],
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const imageUrls = await Promise.all(
        formData.images.map((image) => uploadProductImage(image))
      );

      const productInput = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        product_info: formData.product_info,
        size_1: formData.sizeType === "numbered" ? formData.size_1 : 0,
        size_2: formData.sizeType === "numbered" ? formData.size_2 : 0,
        size_3: formData.sizeType === "numbered" ? formData.size_3 : 0,
        os: formData.sizeType === "onesize" ? formData.os : 0,
        image_urls: imageUrls,
        status: "AVAILABLE",
      };

      const { error } = await insertProduct(productInput);
      if (error) throw error;

      alert("Product added successfully.");

      setFormData({
        name: "",
        price: 0,
        description: "",
        product_info: "",
        sizeType: "numbered",
        size_1: 0,
        size_2: 0,
        size_3: 0,
        os: 0,
        images: [],
      });

      imageUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageUrls([]);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  return (
    <>
      <div
        className={`${styles.overlay} ${isVisible ? styles.visible : ""}`}
        onClick={onClose}
      />
      <div className={`${styles.modal} ${isVisible ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>Add Product</h2>
          <button className={styles.closeButton} onClick={onClose}>
            [ x ]
          </button>
        </div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
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

            <div className={styles.formGroup}>
              <label htmlFor="sizeType">Size Type</label>
              <select
                id="sizeType"
                name="sizeType"
                value={formData.sizeType}
                onChange={handleInputChange}
              >
                <option value="numbered">Numbered Sizes</option>
                <option value="onesize">One Size</option>
              </select>
            </div>

            {formData.sizeType === "numbered" ? (
              <div className={styles.sizesContainer}>
                <div className={styles.sizeGroup}>
                  <label>Size 1 Quantity</label>
                  <input
                    type="text"
                    name="size_1"
                    value={formData.size_1}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
                <div className={styles.sizeGroup}>
                  <label>Size 2 Quantity</label>
                  <input
                    type="text"
                    name="size_2"
                    value={formData.size_2}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
                <div className={styles.sizeGroup}>
                  <label>Size 3 Quantity</label>
                  <input
                    type="text"
                    name="size_3"
                    value={formData.size_3}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
              </div>
            ) : (
              <div className={styles.sizesContainer}>
                <div className={styles.sizeGroup}>
                  <label>One Size Quantity</label>
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
