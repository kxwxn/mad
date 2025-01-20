"use client";

import Link from "next/link";
import styles from "@/styles/Footer.module.css";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/work-index", label: "Work Index" },
    { href: "/personal-work", label: "Personal Work" },
    { href: "/contact", label: "Contact" },
    { href: "https://instagram.com/weare___mad", label: "Instagram" },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.container}>
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
    </nav>
  );
}
