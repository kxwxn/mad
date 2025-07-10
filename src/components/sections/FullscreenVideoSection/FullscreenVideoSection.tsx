import React from "react";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface FullscreenVideoSectionProps {
  videoUrl: string;
}

export default function FullscreenVideoSection({ videoUrl }: FullscreenVideoSectionProps) {
  return (
    <section className={styles.fullscreenSection}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.heroVideo}
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
