"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './CheckOutButton.module.css';
import { useCartStore } from '@/store/cartStore';

// Stripe 초기화
// 클라이언트 컴포넌트에서는 process.env를 직접 사용합니다 (Next.js가 자동으로 번들링함)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
}
const stripePromise = loadStripe(stripePublishableKey);

const CheckoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Zustand store에서 장바구니 아이템 가져오기
  const cartItems = useCartStore(state => state.items);
  const totalItems = useCartStore(state => state.getTotalItems());

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
        const errorMessage = errorData.error || errorData.message || `Checkout failed with status ${response.status}`;
        console.error('Checkout error:', errorMessage);
        alert(`Checkout Error:\n\n${errorMessage}`);
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      const { sessionId } = responseData;
      
      if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('No valid session ID returned from the server');
      }

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process checkout. Please try again.';
      console.error('Checkout error:', errorMessage);
      alert(`Checkout Error:\n\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

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