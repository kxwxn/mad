'use client';

import React from 'react';
import { isApiError, getErrorMessage, getErrorStatus } from '@/lib/errorHandling';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const status = error ? getErrorStatus(error) : 500;
      const message = error ? getErrorMessage(error) : 'An unexpected error occurred';
      const details = isApiError(error) && error.details 
        ? JSON.stringify(error.details, null, 2)
        : '';

      return (
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>Error {status}</h1>
          <p className={styles.errorMessage}>{message}</p>
          {details && (
            <pre className={styles.errorDetails}>
              {details}
            </pre>
          )}
          <button
            className={styles.retryButton}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 