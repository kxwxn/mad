"use client";

import { useState, useEffect } from 'react';
import EditProductForm from "./EditProductForm/EditProductForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal/DeleteConfirmationModal";
import { uploadProductImage } from '@/lib/supabase/storage';
import styles from './EditProductPanel.module.css';
import { Product, SizeType, ProductType } from '@/types/product.types';
import { useAdminProductMutations } from '@/hooks/queries/useAdminProducts';

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
  const { updateProduct, deleteProduct, isLoading } = useAdminProductMutations();

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
              <EditProductForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleStockChange={handleStockChange}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              removeNewImage={removeNewImage}
              newImages={newImages}
            />

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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
}