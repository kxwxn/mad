"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '@/utils/cart';
import styles from './CheckOutButton.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { sessionId } = await response.json();
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
      {isLoading ? '' : `CHECKOUT (${totalItems} ${totalItems === 1 ? 'ITEM' : 'ITEMS'})`}
    </button>
  );
};

export default CheckoutButton;