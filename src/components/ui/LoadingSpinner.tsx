import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  fullScreen = false 
}) => {
  const containerClassName = fullScreen 
    ? styles.fullScreenContainer 
    : styles.container;

  return (
    <div className={containerClassName}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      <p className={styles.text}>Loading...</p>
    </div>
  );
}; 