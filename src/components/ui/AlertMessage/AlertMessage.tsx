"use client";

import React from "react";
import styles from "./AlertMessage.module.css";

interface AlertMessageProps {
  message: string;
  onClose: () => void;
}

export default function AlertMessage({ message, onClose }: AlertMessageProps) {
  return (
    <div className={styles.alertOverlay} onClick={onClose}>
      <div className={styles.alertBox} onClick={(e) => e.stopPropagation()}>
        {message}
      </div>
    </div>
  );
}
