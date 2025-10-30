import React from "react";
import Image from "next/image";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface FullImageSectionProps {
  imageUrl: string;
  altText: string;
  overlayText?: string; // 기존 단순 텍스트 (하위 호환성)
  overlayTitle?: string; // 대제목
  overlaySubtitle?: string; // 소제목 (선택적)
  overlayDescription?: string; // 내용 (선택적)
  overlayPosition?: "top" | "bottom"; // 상단 또는 하단 위치
  overlayTitleClass?: string; // 클래스 override (CSS Modules key)
  overlaySubtitleClass?: string; // 클래스 override (CSS Modules key)
  overlayDescriptionClass?: string; // 클래스 override (CSS Modules key)
}

export default function FullImageSection({ 
  imageUrl, 
  altText, 
  overlayText,
  overlayTitle,
  overlaySubtitle,
  overlayDescription,
  overlayPosition = "bottom",
  overlayTitleClass,
  overlaySubtitleClass,
  overlayDescriptionClass,
}: FullImageSectionProps) {
  const overlayClassName = overlayPosition === "top" 
    ? styles.fullImageOverlayTop 
    : styles.fullImageOverlay;

  // 구조화된 텍스트가 있으면 그것을 사용, 없으면 기존 overlayText 사용
  const hasStructuredText = overlayTitle || overlaySubtitle || overlayDescription;
  const hasOverlayContent = hasStructuredText || overlayText;

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
      {hasOverlayContent && (
        <div className={overlayClassName}>
          {hasStructuredText ? (
            <div className={styles.fullImageStructuredText}>
              {overlayTitle && (
                <h2
                  className={
                    overlayTitleClass
                      ? `${overlayPosition === "top" ? styles.fullImageTitleTop : styles.fullImageTitle} ${styles[overlayTitleClass]}`
                      : overlayPosition === "top"
                        ? styles.fullImageTitleTop
                        : styles.fullImageTitle
                  }
                >
                  {overlayTitle}
                </h2>
              )}
              {overlaySubtitle && (
                <h3
                  className={
                    overlaySubtitleClass
                      ? `${overlayPosition === "top" ? styles.fullImageSubtitleTop : styles.fullImageSubtitle} ${styles[overlaySubtitleClass]}`
                      : overlayPosition === "top"
                        ? styles.fullImageSubtitleTop
                        : styles.fullImageSubtitle
                  }
                >
                  {overlaySubtitle}
                </h3>
              )}
              {overlayDescription && (
                <p
                  className={
                    overlayDescriptionClass
                      ? `${overlayPosition === "top" ? styles.fullImageDescriptionTop : styles.fullImageDescription} ${styles[overlayDescriptionClass]}`
                      : overlayPosition === "top"
                        ? styles.fullImageDescriptionTop
                        : styles.fullImageDescription
                  }
                >
                  {overlayDescription}
                </p>
              )}
            </div>
          ) : (
            <p className={overlayPosition === "top" ? styles.fullImageTextTop : styles.fullImageText}>
              {overlayText}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
