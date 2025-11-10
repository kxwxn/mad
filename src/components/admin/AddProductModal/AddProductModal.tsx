import React, { useState, useEffect } from "react";
import styles from "./AddProductModal.module.css";
import { insertAdminProduct } from "@/lib/supabase/adminProduct";
import { ProductInput, ColorVariant, ProductType } from "@/types/product.types";
import { uploadProductImage } from "@/lib/supabase/storage";
import ImageUploadPreview from "./ImageUploadPreview/ImageUploadPreview";
import ProductForm from "./ProductForm/ProductForm";

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

      await insertAdminProduct(productInput);
      alert("Product added successfully.");
      resetForm();
      onClose();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error adding product:", error);
      }
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
            <ProductForm
              formData={formData}
              handleInputChange={handleInputChange}
              addColor={addColor}
              updateColor={updateColor}
              removeColor={removeColor}
            />

            <ImageUploadPreview
              images={formData.images}
              imageUrls={imageUrls}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
            />

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

