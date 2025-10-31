import Image from "next/image";
import styles from "../admin.module.css"; // Assuming admin.module.css is shared

interface PaymentItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Payment {
  id: string;
  amount: number;
  customerEmail: string;
  status: string;
  created: number;
  items: PaymentItem[];
}

interface RecentOrdersTableProps {
  payments: Payment[];
  handleViewInStripe: (paymentId: string) => void;
}

export default function RecentOrdersTable({ payments, handleViewInStripe }: RecentOrdersTableProps) {
  return (
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
            {payments.map((payment) => (
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
    </div>
  );
}
