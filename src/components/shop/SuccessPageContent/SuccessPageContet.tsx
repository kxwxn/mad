'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './success.module.css';
import { useCartStore } from '@/store/cartStore';
import { useQuery } from '@tanstack/react-query';

interface PaymentDetails {
  amount_total: number;
  created: number;
  payment_intent: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    selectedSize: string;
  }>;
}

// 결제 정보를 가져오는 함수
const fetchPaymentDetails = async (sessionId: string | null) => {
  if (!sessionId) {
    throw new Error('Session ID is missing');
  }
  
  const response = await fetch(`/api/payment-details?session_id=${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payment details');
  }
  
  return response.json();
};

export default function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore(state => state.clearCart);
  
  // React Query를 사용하여 결제 정보 가져오기
  const { data: paymentDetails, isLoading, isError } = useQuery<PaymentDetails>({
    queryKey: ['payment-details', sessionId],
    queryFn: () => fetchPaymentDetails(sessionId),
    enabled: !!sessionId,
  });
  
  // 결제 성공 시 재고 업데이트 및 장바구니 비우기
  useEffect(() => {
    if (paymentDetails) {
      // 재고 업데이트 API 호출
      const updateStock = async () => {
        try {
          const response = await fetch('/api/update-stock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: paymentDetails.items }),
          });

          if (!response.ok) {
            console.error('Failed to update stock');
          }
        } catch (error) {
          console.error('Error updating stock:', error);
        }
      };

      updateStock();
      clearCart();
    }
  }, [paymentDetails, clearCart]);

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

  if (isLoading) {
    return <div className={styles.container}>Verifying payment...</div>;
  }

  if (isError || !sessionId) {
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
                  <td>€ {(item.price / item.quantity).toFixed(2)}</td>
                  <td>€ {item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className={styles.totalLabel}>Total Amount:</td>
                <td className={styles.totalAmount}>
                  € {(paymentDetails.amount_total / 100).toFixed(2)}
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