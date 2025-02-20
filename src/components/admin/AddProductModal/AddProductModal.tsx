import React, { useState, useEffect } from 'react';
import styles from './AddProductModal.module.css';
import { insertProduct } from '@/lib/supabase/product';
import { uploadProductImage } from '@/lib/supabase/storage';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SizeQuantity {
  size: string;
  quantity: number;
}

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  product_info: string;
  sizeType: 'numbered' | 'onesize';
  size_1: number;
  size_2: number;
  size_3: number;
  os: number;
  images: File[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    product_info: '',
    sizeType: 'numbered',
    size_1: 0,
    size_2: 0,
    size_3: 0,
    os: 0,
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeQuantityChange = (size: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => 
        s.size === size ? { ...s, quantity } : s
      )
    }));
  };

  const handleSizeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSizeType = e.target.value as 'numbered' | 'onesize';
    setFormData(prev => ({
      ...prev,
      sizeType: newSizeType,
      sizes: newSizeType === 'onesize' 
        ? [{ size: 'OS', quantity: 0 }]
        : [
            { size: '1', quantity: 0 },
            { size: '2', quantity: 0 },
            { size: '3', quantity: 0 }
          ]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (formData.images.length + newFiles.length > 5) {
        alert('최대 5개의 이미지만 업로드할 수 있습니다.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles].slice(0, 5)
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      // 여러 이미지 업로드
      const imageUrls = await Promise.all(
        formData.images.map(image => uploadProductImage(image))
      );

      console.log('Uploaded image URLs:', imageUrls);  // 디버깅용

      const productInput = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        product_info: formData.product_info,
        size_1: formData.sizeType === 'numbered' ? formData.size_1 : 0,
        size_2: formData.sizeType === 'numbered' ? formData.size_2 : 0,
        size_3: formData.sizeType === 'numbered' ? formData.size_3 : 0,
        os: formData.sizeType === 'onesize' ? formData.os : 0,
        image_urls: imageUrls  // image_url 대신 image_urls 사용
      };

      console.log('Submitting product data:', productInput);

      await insertProduct(productInput);
      
      alert('제품이 성공적으로 추가되었습니다.');
      
      setFormData({
        name: '',
        price: 0,
        description: '',
        product_info: '',
        sizeType: 'numbered',
        size_1: 0,
        size_2: 0,
        size_3: 0,
        os: 0,
        images: []
      });

      onClose();
    } catch (error) {
      console.error('제품 추가 중 오류 발생:', error);
      alert('제품 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={handleClose} />
      <div className={`${styles.modal} ${isVisible ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Add Product</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            [ x ]
          </button>
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
              <label htmlFor="sizeType">사이즈 타입</label>
              <select
                id="sizeType"
                name="sizeType"
                value={formData.sizeType}
                onChange={handleInputChange}
              >
                <option value="numbered">숫자 사이즈</option>
                <option value="onesize">원사이즈</option>
              </select>
            </div>

            {formData.sizeType === 'numbered' ? (
              <div className={styles.sizesContainer}>
                <div className={styles.sizeGroup}>
                  <label>사이즈 1</label>
                  <input
                    type="number"
                    name="size_1"
                    value={formData.size_1}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className={styles.sizeGroup}>
                  <label>사이즈 2</label>
                  <input
                    type="number"
                    name="size_2"
                    value={formData.size_2}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className={styles.sizeGroup}>
                  <label>사이즈 3</label>
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
                  <label>원사이즈 수량</label>
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
              <label htmlFor="images">제품 이미지 (최대 5개)</label>
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
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index + 1}`} 
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
              {isLoading ? '처리중...' : '제품 추가'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;