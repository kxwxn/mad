"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import React, { useEffect, useState, useCallback } from "react";
import NewsletterModal from "../common/NewsletterModal";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

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

  const handleNewsletterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsNewsletterOpen(true);
  };

  const menuItems = [
    { 
      href: "https://preview.mailerlite.io/forms/1664989/169702033605002470/share", 
      label: "NEWSLETTER",
      isNewsletter: true
    },
    { href: "/contact", label: "CONTACT" },
    { href: "https://www.linkedin.com/company/madmaterialalternativedesign/", label: "LINKEDIN" },
    { href: "https://instagram.com/weare___mad", label: "INSTAGRAM" },
  ];

  return (
    <>
      <footer className={`${styles.bottomNav} ${isVisible ? styles.visible : styles.hidden}`}>
        <div className={styles.container}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.menuItem}
              target={item.href.startsWith('http') && !item.isNewsletter ? '_blank' : undefined}
              rel={item.href.startsWith('http') && !item.isNewsletter ? 'noopener noreferrer' : undefined}
              onClick={item.isNewsletter ? handleNewsletterClick : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </footer>
      <NewsletterModal 
        isOpen={isNewsletterOpen} 
        onClose={() => setIsNewsletterOpen(false)} 
      />
    </>
  );
}
