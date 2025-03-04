"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadProductImage } from '@/lib/supabase/storage';
import styles from './EditProductPanel.module.css';
import { Product, SizeType } from '@/types/product.types';
import { useProductMutations } from '@/hooks/queries/useProducts';

interface EditProductPanelProps {
  product: Product | null;
  onClose: () => void;
  onProductUpdate: () => void;
}

export default function EditProductPanel({ 
  product, 
  onClose,
  onProductUpdate 
}: EditProductPanelProps) {
  const [formData, setFormData] = useState<Product | null>(product);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { updateProduct, deleteProduct, isLoading } = useProductMutations();

  useEffect(() => {
    if (product) {
      const sizeType: SizeType = product.os > 0 ? 'onesize' : 'numbered';
      setFormData({
        ...product,
        sizeType
      });
      setIsClosing(false);
      setNewImages([]);
      setIsVisible(true);
    }
  }, [product]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      [name]: name === 'price' || name.startsWith('size') || name === 'os' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (formData!.image_urls.length + newImages.length + newFiles.length > 5) {
        alert('Maximum 5 images allowed');
        return;
      }
      setNewImages(prev => [...prev, ...newFiles].slice(0, 5 - formData!.image_urls.length));
    }
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev!,
      image_urls: prev!.image_urls.filter((_, i) => i !== index)
    }));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      // 새 이미지 업로드
      let updatedImageUrls = [...formData.image_urls];
      if (newImages.length > 0) {
        const uploadPromises = newImages.map(file => uploadProductImage(file));
        const newImageUrls = await Promise.all(uploadPromises);
        updatedImageUrls = [...updatedImageUrls, ...newImageUrls];
      }

      // 업데이트할 데이터 준비
      const updateData = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        product_info: formData.product_info,
        image_urls: updatedImageUrls,
        size_1: formData.sizeType === 'numbered' ? Number(formData.size_1) : 0,
        size_2: formData.sizeType === 'numbered' ? Number(formData.size_2) : 0,
        size_3: formData.sizeType === 'numbered' ? Number(formData.size_3) : 0,
        os: formData.sizeType === 'onesize' ? Number(formData.os) : 0
      };

      // 데이터 업데이트
      await updateProduct({ id: formData.id, updates: updateData });
      onProductUpdate();
      handleClose();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update product');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(formData!.id);
      onProductUpdate();
      handleClose();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };

  if (!formData || !isVisible) return null;

  return (
    <>
      <div 
        className={`${styles.overlay} ${isClosing ? styles.fadeOut : ''}`} 
        onClick={handleOverlayClick}
      >
        <div className={`${styles.panel} ${isClosing ? styles.slideOut : styles.slideIn}`}>
          <div className={styles.header}>
            <h2>Edit Product</h2>
            <button onClick={handleClose} className={styles.closeButton}>×</button>
          </div>

          <div className={styles.content}>
            <form onSubmit={handleSubmit}>
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
                <label htmlFor="sizeType">Size Type</label>
                <select
                  id="sizeType"
                  name="sizeType"
                  value={formData.sizeType}
                  onChange={handleInputChange}
                >
                  <option value="numbered">Size</option>
                  <option value="onesize">OS</option>
                </select>
              </div>

              {formData.sizeType === 'numbered' ? (
                <div className={styles.sizesContainer}>
                  <div className={styles.sizeGroup}>
                    <label>Size 1</label>
                    <input
                      type="number"
                      name="size_1"
                      value={formData.size_1}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className={styles.sizeGroup}>
                    <label>Size 2</label>
                    <input
                      type="number"
                      name="size_2"
                      value={formData.size_2}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className={styles.sizeGroup}>
                    <label>Size 3</label>
                    <input
                      type="number"
                      name="size_3"
                      value={formData.size_3}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.sizesContainer}>
                  <div className={styles.sizeGroup}>
                    <label>OS Quantity</label>
                    <input
                      type="number"
                      name="os"
                      value={formData.os}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Product Images (Max 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
                <div className={styles.imagePreviewContainer}>
                  {formData.image_urls.map((url, index) => (
                    <div key={`existing-${index}`} className={styles.imagePreview}>
                      <Image
                        src={url}
                        alt={`Product ${index + 1}`}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }}
                      />
                      <button 
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className={styles.removeImageBtn}
                      >
                        ×
                      </button>
                      <span className={styles.imageNumber}>{index + 1}</span>
                    </div>
                  ))}
                  {newImages.map((file, index) => (
                    <div key={`new-${index}`} className={styles.imagePreview}>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                      <button 
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className={styles.removeImageBtn}
                      >
                        ×
                      </button>
                      <span className={styles.imageNumber}>
                        {formData.image_urls.length + index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button 
                  type="submit" 
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'SAVE'}
                </button>
                <button 
                  type="button" 
                  className={styles.deleteButton}
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isLoading}
                >
                  DELETE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <h3>Delete Confirmation</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className={styles.modalButtons}>
              <button 
                onClick={handleDelete}
                className={styles.confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className={styles.cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}