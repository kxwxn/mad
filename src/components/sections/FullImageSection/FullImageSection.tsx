import React from "react";
import Image from "next/image";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface FullImageSectionProps {
  imageUrl: string;
  altText: string;
}

export default function FullImageSection({ imageUrl, altText }: FullImageSectionProps) {
  return (
    <section className={styles.fullImageSection}>
      <div className={styles.fullImageContainer}>
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="200vw"
          quality={100}
          className={styles.fullImage}
        />
      </div>
    </section>
  );
}
