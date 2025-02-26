"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '@/utils/cart/types';
import styles from './CheckOutButton.module.css';

// Stripe 초기화 부분 수정
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

// 디버깅을 위한 콘솔 로그 추가 (나중에 제거 가능)
console.log('Stripe Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface CheckoutButtonProps {
  cartItems: CartItem[];
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ cartItems }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // API 호출 전에 cartItems가 비어있지 않은지 확인
      if (!cartItems.length) {
        throw new Error('Cart is empty');
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const { sessionId } = await response.json();
      
      // sessionId 확인
      if (!sessionId) {
        throw new Error('No session ID returned from the server');
      }

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button 
      className={`${styles.checkoutButton} ${isLoading ? styles.loading : ''}`}
      onClick={handleCheckout}
      disabled={isLoading || cartItems.length === 0}
    >
      {isLoading ? 'Processing...' : `CHECKOUT (${totalItems} ${totalItems === 1 ? 'ITEM' : 'ITEMS'})`}
    </button>
  );
};

export default CheckoutButton;