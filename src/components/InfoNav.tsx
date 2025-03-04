"use client";

import styles from "./InfoNav.module.css";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

export default function InfoNav() {
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

  return (
    <nav
      className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden}`}
    >
      <div className={styles.container}>
        <div className={styles.topRow}>
          <span className={styles.mad}>MAD</span>
        </div>
        <div className={styles.middleRow}>
          <span className={styles.info}>info</span>
        </div>
        <div className={styles.bottomRow}>
          <span className={styles.shopHidden}>shop</span>
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