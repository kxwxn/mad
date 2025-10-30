import React from "react";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface TextSectionProps {
  title: string;
  description1: string;
  description2: string;
  sectionType: "textSection" | "secondTextSection" | "thirdTextSection" | "fourthTextSection" | "bannerTextSection";
  titleStyle?: string;
  descriptionStyle?: string; // 하위 호환성을 위해 유지
  description1Style?: string; // description1 전용 스타일
  description2Style?: string; // description2 전용 스타일
  rightBottomTitle?: string;
  rightBottomText?: string;
}

export default function TextSection({
  title,
  description1,
  description2,
  sectionType,
  titleStyle,
  descriptionStyle,
  description1Style,
  description2Style,
  rightBottomTitle,
  rightBottomText,
}: TextSectionProps) {
  const sectionClassName = styles[sectionType];
  const titleClassName = titleStyle ? styles[titleStyle] : styles.titleText;
  
  // description1Style이 있으면 사용, 없으면 descriptionStyle 또는 기본값
  const desc1ClassName = description1Style 
    ? styles[description1Style] 
    : descriptionStyle 
      ? styles[descriptionStyle] 
      : styles.descriptionText;
  
  // description2Style이 있으면 사용, 없으면 descriptionStyle 또는 기본값
  const desc2ClassName = description2Style 
    ? styles[description2Style] 
    : descriptionStyle 
      ? styles[descriptionStyle] 
      : styles.descriptionText;

  const titleLines = title.split(/\r?\n/);

  return (
    <section className={sectionClassName}>
      <div className={styles.bannerLeftBlock}>
        <h1 className={titleClassName}>
          {titleLines.map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < titleLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <p className={desc1ClassName}>{description1}</p>
        <p className={desc2ClassName}>{description2}</p>
      </div>
      {(rightBottomTitle || rightBottomText) && (
        <div className={styles.bannerRightBlock}>
          {rightBottomTitle && <div className={styles.bannerRightTitle}>{rightBottomTitle}</div>}
          {rightBottomText && <div className={styles.bannerRightText}>{rightBottomText}</div>}
        </div>
      )}
    </section>
  );
}
