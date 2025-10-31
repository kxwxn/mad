import styles from "../admin.module.css"; // Assuming admin.module.css is shared

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationControlsProps) {
  return (
    <div className={styles.pagination}>
      <span
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        className={`${styles.pageControl} ${currentPage === 1 ? styles.disabled : ""}`}
      >
        ← PREVIOUS
      </span>

      <div className={styles.pageNumbers}>
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;

          if (pageNum === 1) {
            return (
              <span
                key={`page-${pageNum}`}
                onClick={() => setCurrentPage(pageNum)}
                className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ""}`}
              >
                {pageNum},
              </span>
            );
          }

          if (pageNum === totalPages) {
            return (
              <span
                key={`page-${pageNum}`}
                onClick={() => setCurrentPage(pageNum)}
                className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ""}`}
              >
                {pageNum}.
              </span>
            );
          }

          if (pageNum === 3 && totalPages > 6) {
            return <span key="ellipsis" className={styles.ellipsis}>...</span>;
          }

          if (pageNum < 3 || pageNum === totalPages) {
            return (
              <span
                key={`page-${pageNum}`}
                onClick={() => setCurrentPage(pageNum)}
                className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ""}`}
              >
                {pageNum},
              </span>
            );
          }

          return null;
        })}
      </div>

      <span
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        className={`${styles.pageControl} ${currentPage === totalPages ? styles.disabled : ""}`}
      >
        NEXT →
      </span>
    </div>
  );
}
