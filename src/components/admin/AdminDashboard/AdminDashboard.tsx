"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import Image from "next/image";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  recentPayments: Array<{
    id: string;
    amount: number;
    customerEmail: string;
    status: string;
    created: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image: string;
    }>;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);  // currentPage 의존성 제거

  const handleViewInStripe = (paymentId: string) => {
    window.open(`https://dashboard.stripe.com/payments/${paymentId}`, '_blank');
  };

  if (isLoading || !data) return (
    <div className={styles.loadingContainer}>Loading...</div>
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(data.recentPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPagePayments = data.recentPayments.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <p className={styles.statValue}>
            € {data.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Orders</h3>
          <p className={styles.statValue}>
            {data.totalOrders.toLocaleString()}
          </p>
        </div>
      </div>

      <div className={styles.recentPayments}>
        <h2>Recent Orders</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPagePayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id.slice(-6)}</td>
                  <td>{payment.customerEmail}</td>
                  <td>
                    <div className={styles.itemsList}>
                      {payment.items?.map((item, index) => (
                        <div key={index} className={styles.itemRow}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={40}
                            height={40}
                            className={styles.itemImage}
                          />
                          <span className={styles.itemName}>{item.name} (×{item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>€ {payment.amount.toLocaleString()}</td>
                  <td>{new Date(payment.created * 1000).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.status} ${styles[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleViewInStripe(payment.id)}
                      className={styles.stripeButton}
                    >
                      View in Stripe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 컨트롤 */}
        <div className={styles.pagination}>
          <span
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className={`${styles.pageControl} ${currentPage === 1 ? styles.disabled : ''}`}
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
                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ''}`}
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
                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ''}`}
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
                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ''}`}
                  >
                    {pageNum},
                  </span>
                );
              }
              
              return null;
            })}
          </div>

          <span
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className={`${styles.pageControl} ${currentPage === totalPages ? styles.disabled : ''}`}
          >
            NEXT →
          </span>
        </div>
      </div>

      <div className={styles.stripeDashboard}>
        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.stripeLink}
        >
          Open Full Stripe Dashboard →
        </a>
      </div>
    </div>
  );
}
