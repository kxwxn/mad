import React from "react";
import styles from "./WishlistIcon.module.css";
import { useWishlistStore } from "@/store/wishlistStore";


interface WishlistIconProps {
  productId: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_urls?: string[];
  };
  filled?: boolean;
  onClick?: () => void;
  className?: string;
}

const WishlistIcon: React.FC<WishlistIconProps> = ({
  productId,
  product,
  filled: externalFilled = false,
  onClick,
  className = "",
}) => {
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  
  const isInWishlist = productId ? wishlistItems.some(item => item.id === productId) : false;
  const filled = productId ? isInWishlist : externalFilled;
  
  const handleInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick();
      return;
    }

    if (!productId || !toggleWishlist || !product) return;
    
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image_urls?.[0] || '',
      sizes: ["1", "2", "3"]
    });
  };
  
  return (
    <div 
      className={`${styles.wishlistButton} ${className} ${filled ? styles.filled : ''}`}
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInteraction(e);
        }
      }}
      aria-label={filled ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
  );
};

export default WishlistIcon;