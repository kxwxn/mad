import React from "react";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface VideoGridSectionProps {
  videoUrl: string;
  count: number;
}

export default function VideoGridSection({ videoUrl, count }: VideoGridSectionProps) {
  return (
    <section className={styles.videoSection}>
      <div className={styles.videoContainer}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={styles.videoWrapper}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.video}
              preload="auto"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </section>
  );
}
