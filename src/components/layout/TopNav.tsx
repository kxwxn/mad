"use client";

import styles from "./TopNav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import JournalismModal from '../common/JournalismModal';

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | null>(null);
  const plusButtonRef = useRef<HTMLDivElement>(null);

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

  const handlePlusClick = () => {
    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
    setIsModalOpen(true);
  };

  const handleMadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsVisible(false);
    setTimeout(() => {
      router.push('/');
    }, 300); // 애니메이션 시간과 맞춤
  };

  return (
    <>
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
            <Link
              href="/info"
              className={`${styles.info} ${
                pathname === "/info" ? styles.active : ""
              }`}
            >
              info
            </Link>
          </div>
          <div className={styles.bottomRow}>
            <Link
              href="/shop"
              className={`${styles.shop} ${
                pathname === "/shop" ? styles.active : ""
              }`}
            >
              shop
            </Link>
          </div>
          <div className={styles.plusRow} ref={plusButtonRef}>
            <div className={styles.plus} onClick={handlePlusClick}>
              +
            </div>
          </div>
        </div>
      </nav>
      <JournalismModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buttonPosition={buttonPosition}
      />
    </>
  );
}
