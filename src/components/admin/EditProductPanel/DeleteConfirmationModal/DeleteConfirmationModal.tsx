import React from "react";
import styles from "./DeleteConfirmationModal.module.css";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModal}>
        <h3>Delete Confirmation</h3>
        <p>Are you sure you want to delete this product?</p>
        <div className={styles.modalButtons}>
          <button
            onClick={onConfirm}
            className={styles.confirmDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            onClick={onClose}
            className={styles.cancelDelete}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
