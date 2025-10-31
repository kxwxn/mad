"use client";

import React, { useState, ReactNode } from "react";
import styles from "./Accordion.module.css";

interface AccordionProps {
  title: string;
  children: ReactNode;
  initialOpen?: boolean;
}

export default function Accordion({ title, children, initialOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className={styles.accordionItem}>
      <div
        className={`${styles.accordionHeader} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className={styles.toggleIcon}>
          {isOpen ? "[ - ]" : "[ + ]"}
        </span>
      </div>
      <div
        className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
