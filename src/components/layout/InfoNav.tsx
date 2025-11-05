"use client";

import styles from "./InfoNav.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

export default function InfoNav() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleMadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsVisible(false);
    setTimeout(() => {
      router.push('/');
    }, 300); // 애니메이션 시간과 맞춤
  };

  return (
    <nav
      className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden}`}
    >
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.mad} onClick={handleMadClick}>
            MAD
          </Link>
        </div>
        <div className={styles.middleRow}>
          <span className={styles.infoHidden}>info</span>
        </div>
        <div className={styles.bottomRow}>
          <Link href="/shop" className={styles.shop}>
            shop
          </Link>
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