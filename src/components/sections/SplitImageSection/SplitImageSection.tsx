import React from "react";
import Image from "next/image";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface SplitImageSectionProps {
  images: { src: string; alt: string }[];
}

export default function SplitImageSection({ images }: SplitImageSectionProps) {
  return (
    <section className={styles.splitSection}>
      {images.map((img, index) => (
        <div key={index} className={styles.imageContainer}>
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="33vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
      ))}
    </section>
  );
}
