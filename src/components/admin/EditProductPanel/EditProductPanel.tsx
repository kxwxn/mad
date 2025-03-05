"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadProductImage } from '@/lib/supabase/storage';
import styles from './EditProductPanel.module.css';
import { Product, SizeType, ProductType } from '@/types/product.types';
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
  const [isVisible, setIsVisible] = useState(true);
  const { updateProduct, deleteProduct, isLoading } = useProductMutations();

  useEffect(() => {
    if (product) {
      const sizeType: SizeType = product.os > 0 ? 'onesize' : 'numbered';
      setFormData({
        ...product,
        sizeType,
        product_type: product.product_type || 'T-shirts'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleStockChange = (size: 's' | 'm' | 'l' | 'os', value: string) => {
    if (!formData) return;
    
    const numValue = parseInt(value) || 0;
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, [size]: numValue };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    if (!formData) return;
    
    const newImageUrls = [...formData.image_urls];
    newImageUrls.splice(index, 1);
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, image_urls: newImageUrls };
    });
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      let updatedImageUrls = [...formData.image_urls];
      if (newImages.length > 0) {
        const uploadPromises = newImages.map(file => uploadProductImage(file));
        const newImageUrls = await Promise.all(uploadPromises);
        updatedImageUrls = [...updatedImageUrls, ...newImageUrls];
      }

      const updateData: Partial<Product> = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        product_info: formData.product_info,
        image_urls: updatedImageUrls,
        s: formData.s,
        m: formData.m,
        l: formData.l,
        os: formData.os,
        product_type: formData.product_type as ProductType,
        status: formData.status
      };

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
                <label htmlFor="productType">Product Type</label>
                <select
                  id="productType"
                  name="product_type"
                  value={formData?.product_type || 'T-shirts'}
                  onChange={(e) => {
                    const newType = e.target.value as ProductType;
                    setFormData(prev => prev ? {...prev, product_type: newType} : null);
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