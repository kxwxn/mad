"use client";

import styles from "./SuccessMessage.module.css";

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

export default function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  return (
    <div className={styles.successOverlay} onClick={onClose}>
      <div className={styles.successBox} onClick={(e) => e.stopPropagation()}>
        {message}
      </div>
    </div>
  );
}
