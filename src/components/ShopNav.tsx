'use client';

import Link from 'next/link';
import styles from './ShopNav.module.css';
import { useEffect, useState } from 'react';

export default function ShopNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setIsVisible(currentScrollY < lastScrollY);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.mad}>
            MAD
          </Link>
        </div>
        <div className={styles.middleRow}>
          <div className={styles.infoHidden}>
            info
          </div>
        </div>
        <div className={styles.bottomRow}>
          <Link href="/shop" className={styles.shop}>
            shop
          </Link>
        </div>
        <div className={styles.plusRow}>
          <Link href="/" className={styles.plus}>
            x
          </Link>
        </div>
      </div>
    </nav>
  );
}