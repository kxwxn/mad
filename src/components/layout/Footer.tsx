"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import React, { useEffect, useState, useCallback } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // 스크롤 다운
      setIsVisible(false);
    } else {
      // 스크롤 업
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

  const menuItems = [
    { href: "/newsletter", label: "NEWSLETTER" },
    { href: "/contact", label: "CONTACT" },
    { href: "https://linkedin.com/company/wearemad", label: "LINKEDIN" },
    { href: "https://instagram.com/weare___mad", label: "INSTAGRAM" },
  ];

  return (
    <footer className={`${styles.bottomNav} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.container}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.menuItem}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
