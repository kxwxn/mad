import React from "react";
import Image from "next/image";
import styles from "./ImageUploadPreview.module.css";

interface ImageUploadPreviewProps {
  images: File[];
  imageUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export default function ImageUploadPreview({
  images,
  imageUrls,
  handleImageChange,
  removeImage,
}: ImageUploadPreviewProps) {
  return (
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
      {images.length > 0 && (
        <div className={styles.imagePreviewContainer}>
          {images.map((file, index) => (
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
  );
}
