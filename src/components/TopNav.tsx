"use client";
import styles from "@/styles/TopNav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link
            href="/"
            className={`${styles.mad} ${pathname === "/" ? styles.active : ""}`}
          >
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
            INFO
          </Link>
        </div>
        <div className={styles.bottomRow}>
          <Link
            href="/shop"
            className={`${styles.shop} ${
              pathname === "/shop" ? styles.active : ""
            }`}
          >
            SHOP
          </Link>
        </div>
      </div>
    </nav>
  );
}