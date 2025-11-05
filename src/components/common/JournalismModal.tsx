'use client';

import { useEffect, useState } from 'react';
import styles from './JournalismModal.module.css';

interface JournalismModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonPosition: { x: number; y: number } | null;
}

export default function JournalismModal({ isOpen, onClose, buttonPosition }: JournalismModalProps) {
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

  const modalStyle = buttonPosition ? {
    '--origin-x': `${buttonPosition.x}px`,
    '--origin-y': `${buttonPosition.y}px`,
  } as React.CSSProperties : {};

  return (
    <div 
      className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
      onClick={onClose}
    >
      <div 
        className={`${styles.modal} ${isOpen ? styles.visible : ''}`}
        style={modalStyle}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>+</button>
        <div className={styles.content}>
          <div className={styles.comingSoon}>MANY MORE TO COME...</div>
        </div>
      </div>
    </div>
  );
} 