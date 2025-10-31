import styles from "../admin.module.css"; // Assuming admin.module.css is shared

interface DashboardStatsProps {
  totalRevenue: number;
  totalOrders: number;
}

export default function DashboardStats({ totalRevenue, totalOrders }: DashboardStatsProps) {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <h3>Total Revenue</h3>
        <p className={styles.statValue}>€ {totalRevenue.toLocaleString()}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Total Orders</h3>
        <p className={styles.statValue}>{totalOrders.toLocaleString()}</p>
      </div>
    </div>
  );
}
