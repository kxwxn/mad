"use client";

import { useEffect, useState } from "react";
import styles from "./admin.module.css";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
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
    }>;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    // 5분마다 데이터 새로고침
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!data) {
    return <div className={styles.error}>Failed to load dashboard data</div>;
  }

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
              </tr>
            </thead>
            <tbody>
              {data.recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id.slice(-6)}</td>
                  <td>{payment.customerEmail}</td>
                  <td>
                    {payment.items
                      .map((item) => `${item.name} (${item.quantity})`)
                      .join(", ")}
                  </td>
                  <td>€ {payment.amount.toLocaleString()}</td>
                  <td>
                    {new Date(payment.created * 1000).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
