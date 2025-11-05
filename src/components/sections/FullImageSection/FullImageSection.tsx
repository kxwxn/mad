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
  // 상단 오버레이 (overlayPosition="bottom"일 때 하단과 함께 사용 가능)
  topOverlayText?: string;
  topOverlayTitle?: string;
  topOverlaySubtitle?: string;
  topOverlayDescription?: string;
  topOverlayTitleClass?: string;
  topOverlaySubtitleClass?: string;
  topOverlayDescriptionClass?: string;
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
  topOverlayText,
  topOverlayTitle,
  topOverlaySubtitle,
  topOverlayDescription,
  topOverlayTitleClass,
  topOverlaySubtitleClass,
  topOverlayDescriptionClass,
}: FullImageSectionProps) {
  // 하단 오버레이
  const bottomOverlayClassName = styles.fullImageOverlay;
  const hasBottomStructuredText = overlayTitle || overlaySubtitle || overlayDescription;
  const hasBottomOverlayContent = hasBottomStructuredText || overlayText;

  // 상단 오버레이
  const topOverlayClassName = styles.fullImageOverlayTop;
  // overlayPosition이 "top"이고 상단 전용 props가 비어있다면 하단용 props를 상단에 매핑해서 사용
  const effectiveTopTitle = topOverlayTitle ?? (overlayPosition === "top" ? overlayTitle : undefined);
  const effectiveTopSubtitle = topOverlaySubtitle ?? (overlayPosition === "top" ? overlaySubtitle : undefined);
  const effectiveTopDescription = topOverlayDescription ?? (overlayPosition === "top" ? overlayDescription : undefined);
  const effectiveTopTitleClass = topOverlayTitleClass ?? (overlayPosition === "top" ? overlayTitleClass : undefined);
  const effectiveTopSubtitleClass = topOverlaySubtitleClass ?? (overlayPosition === "top" ? overlaySubtitleClass : undefined);
  const effectiveTopDescriptionClass = topOverlayDescriptionClass ?? (overlayPosition === "top" ? overlayDescriptionClass : undefined);

  const hasTopStructuredText = effectiveTopTitle || effectiveTopSubtitle || effectiveTopDescription;
  const hasTopOverlayContent = hasTopStructuredText || topOverlayText;

  // 오버레이 렌더링 헬퍼
  const renderOverlay = (
    isTop: boolean,
    hasStructured: boolean,
    overlayCls: string,
    text?: string,
    title?: string,
    subtitle?: string,
    description?: string,
    titleCls?: string,
    subtitleCls?: string,
    descriptionCls?: string
  ) => {
    if (isTop && !hasTopOverlayContent) return null;
    if (!isTop && !hasBottomOverlayContent) return null;

    return (
      <div className={overlayCls}>
        {hasStructured ? (
          <div className={styles.fullImageStructuredText}>
            {title && (
              <h2
                className={
                  titleCls
                    ? `${isTop ? styles.fullImageTitleTop : styles.fullImageTitle} ${styles[titleCls]}`
                    : isTop
                      ? styles.fullImageTitleTop
                      : styles.fullImageTitle
                }
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <h3
                className={
                  subtitleCls
                    ? `${isTop ? styles.fullImageSubtitleTop : styles.fullImageSubtitle} ${styles[subtitleCls]}`
                    : isTop
                      ? styles.fullImageSubtitleTop
                      : styles.fullImageSubtitle
                }
              >
                {subtitle}
              </h3>
            )}
            {description && (
              <p
                className={
                  descriptionCls
                    ? `${isTop ? styles.fullImageDescriptionTop : styles.fullImageDescription} ${styles[descriptionCls]}`
                    : isTop
                      ? styles.fullImageDescriptionTop
                      : styles.fullImageDescription
                }
              >
                {description}
              </p>
            )}
          </div>
        ) : (
          text && (
            <p className={isTop ? styles.fullImageTextTop : styles.fullImageText}>
              {text.includes('Get in touch!') ? (
                <>
                  {text.split('Get in touch!')[0]}
                  <br />
                  Get in touch!
                </>
              ) : (
                text
              )}
            </p>
          )
        )}
      </div>
    );
  };

  return (
    <section className={styles.fullImageSection}>
      <div className={styles.fullImageContainer}>
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="200vw"
          quality={85}
          className={styles.fullImage}
        />
      </div>
      {/* 상단 오버레이 */}
      {renderOverlay(
        true,
        Boolean(hasTopStructuredText),
        topOverlayClassName,
        topOverlayText,
        effectiveTopTitle,
        effectiveTopSubtitle,
        effectiveTopDescription,
        effectiveTopTitleClass,
        effectiveTopSubtitleClass,
        effectiveTopDescriptionClass
      )}
      {/* 하단 오버레이 (overlayPosition="top"이 아니면 기본 하단) */}
      {overlayPosition !== "top" && renderOverlay(
        false,
        Boolean(hasBottomStructuredText),
        bottomOverlayClassName,
        overlayText,
        overlayTitle,
        overlaySubtitle,
        overlayDescription,
        overlayTitleClass,
        overlaySubtitleClass,
        overlayDescriptionClass
      )}
    </section>
  );
}
