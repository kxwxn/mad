import React from "react";
import Image from "next/image";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface SplitImageSectionProps {
  images: { src: string; alt: string }[];
  variant?: "three" | "four"; // 3장 또는 4장
}

export default function SplitImageSection({ images, variant = "three" }: SplitImageSectionProps) {
  const sectionClassName = variant === "four" ? styles.splitSectionFour : styles.splitSection;
  const containerClassName = variant === "four" ? styles.imageContainerFour : styles.imageContainer;
  // 더 정확한 sizes 속성으로 이미지 품질 개선
  const imageSizes = variant === "four" 
    ? "(max-width: 768px) 100vw, 25vw" 
    : "(max-width: 768px) 100vw, 33vw";

  return (
    <section className={sectionClassName}>
      {images.map((img, index) => (
        <div key={index} className={containerClassName}>
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={imageSizes}
            quality={100}
            className={styles.splitImage}
            priority={index === 0} // 첫 번째 이미지에 priority 추가
          />
        </div>
      ))}
    </section>
  );
}
