import React from "react";
import styles from "@/app/(main)/page.module.css"; // Assuming page.module.css is shared

interface TextSectionProps {
  title: string;
  description1: string;
  description2: string;
  sectionType: "textSection" | "secondTextSection" | "thirdTextSection" | "fourthTextSection";
  titleStyle?: string;
  descriptionStyle?: string;
}

export default function TextSection({
  title,
  description1,
  description2,
  sectionType,
  titleStyle,
  descriptionStyle,
}: TextSectionProps) {
  const sectionClassName = styles[sectionType];
  const titleClassName = titleStyle ? styles[titleStyle] : styles.titleText;
  const descClassName = descriptionStyle ? styles[descriptionStyle] : styles.descriptionText;

  return (
    <section className={sectionClassName}>
      <h1 className={titleClassName}>{title}</h1>
      <p className={descClassName}>{description1}</p>
      <p className={descClassName}>{description2}</p>
    </section>
  );
}
