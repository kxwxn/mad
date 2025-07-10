import React from "react";
import Image from "next/image";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface SixImageGridSectionProps {
  images: { src: string; alt: string }[];
}

export default function SixImageGridSection({ images }: SixImageGridSectionProps) {
  return (
    <section className={styles.sixImageSection}>
      <div className={styles.imageRow}>
        {images.slice(0, 3).map((img, index) => (
          <div key={index} className={styles.imageWrapper}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
        ))}
      </div>
      <div className={styles.imageRow}>
        {images.slice(3, 6).map((img, index) => (
          <div key={index + 3} className={styles.imageWrapper}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
