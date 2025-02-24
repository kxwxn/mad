'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './success.module.css';
import { cartStorage } from '@/utils/cart';

interface PaymentDetails {
  amount_total: number;
  created: number; // 주문 시간
  payment_intent: string; // 주문 번호로 사용
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string; // 상품 이미지 URL
  }>;
}

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`/api/payment-details?session_id=${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch payment details');
        const details = await response.json();
        setPaymentDetails(details);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setStatus('error');
      }
    };

    fetchPaymentDetails();
    cartStorage.clearCart();
  }, [sessionId]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return <div className={styles.container}>Verifying payment...</div>;
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <h1>An error occurred</h1>
        <p>There was a problem verifying your payment.</p>
        <Link href="/shop" className={styles.button}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Payment Completed!</h1>
      <p>Thank you for your order.</p>
      
      {paymentDetails && (
        <div className={styles.orderDetails}>
          <div className={styles.orderInfo}>
            <p>Order ID: #{paymentDetails.payment_intent}</p>
            <p>Order Date: {formatDate(paymentDetails.created)}</p>
          </div>
          
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {paymentDetails.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td className={styles.imageCell}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className={styles.productImage}
                      />
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className={styles.totalLabel}>Total Amount:</td>
                <td className={styles.totalAmount}>
                  ${(paymentDetails.amount_total / 100).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <Link href="/shop" className={styles.button}>
        Continue Shopping
      </Link>
    </div>
  );
}