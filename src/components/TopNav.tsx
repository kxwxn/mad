"use client";
import styles from "@/styles/TopNav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface MenuItem {
  href: string;
  label: string;
}

interface NavigationProps {
  className?: string;
}

export default function TopNav({
  className,
}: NavigationProps): React.ReactElement {
  const pathname = usePathname();
  const menuItems = [
    { href: "/", label: "MAD" },
    { href: "/info", label: "INFO" },
    { href: "/workshop", label: "WORKSHOP" },
    { href: "/shop", label: "SHOP" },
  ];

  return (
    <nav className={`${styles.nav} ${className || ""}`}>
      <div className={styles.container}>
        <div className={styles.menuItems}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.menuItem} ${
                pathname === item.href ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
