"use client";

import useDashboardData from "@/hooks/useDashboardData/useDashboardData";
import styles from "./admin.module.css";
import Image from "next/image";
import DashboardStats from "./DashboardStats/DashboardStats";
import RecentOrdersTable from "./RecentOrdersTable/RecentOrdersTable";
import PaginationControls from "./PaginationControls/PaginationControls";

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
  const { data, isLoading, currentPage, setCurrentPage, itemsPerPage } = useDashboardData();

  const handleViewInStripe = (paymentId: string) => {
    window.open(`https://dashboard.stripe.com/payments/${paymentId}`, '_blank');
  };

  if (isLoading || !data) return (
    <div className={styles.loadingContainer}>Loading...</div>
  );

  return (
    <div className={styles.container}>
      <DashboardStats totalRevenue={data.totalRevenue} totalOrders={data.totalOrders} />

      <RecentOrdersTable payments={data.recentPayments} handleViewInStripe={handleViewInStripe} />

      <PaginationControls
        currentPage={currentPage}
        totalPages={data.totalPages}
        setCurrentPage={setCurrentPage}
      />

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
