'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './ShopNav.module.css';
import { useEffect, useState } from 'react';

export default function ShopNav() {
  const router = useRouter();
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

  const handleMadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsVisible(false);
    setTimeout(() => {
      router.push('/');
    }, 300); // 애니메이션 시간과 맞춤
  };

  return (
    <nav className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.mad} onClick={handleMadClick}>
            MAD
          </Link>
        </div>
        <div className={styles.middleRow}>
          <Link href="/info" className={styles.info}>
            info
          </Link>
        </div>
        <div className={styles.bottomRow}>
          <span className={styles.shopHidden}>shop</span>
        </div>
        <div className={styles.plusRow}>
          <Link href="/" className={styles.plus}>
            +
          </Link>
        </div>
      </div>
    </nav>
  );
}