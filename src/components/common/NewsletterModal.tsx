"use client";

import { useEffect, useState } from "react";
import styles from "./NewsletterModal.module.css";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <div 
      className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
      onClick={onClose}
    >
      <div 
        className={`${styles.modal} ${isOpen ? styles.visible : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>+</button>
        <div className={styles.content}>
          <iframe
            src="https://preview.mailerlite.io/forms/1664989/169702033605002470/share"
            className={styles.iframe}
            title="Newsletter Signup"
            allow="clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
