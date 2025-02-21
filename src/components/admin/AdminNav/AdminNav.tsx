"use client";
import styles from "./AdminNav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link
          href="/admin/dashboard"
          className={`${styles.link} ${
            pathname === "/admin/dashboard" ? styles.active : ""
          }`}
        >
          DASHBOARD
        </Link>
        <Link
          href="/admin/product"
          className={`${styles.link} ${
            pathname === "/admin/product" ? styles.active : ""
          }`}
        >
          PRODUCT
        </Link>
      </div>
      <div className={styles.userButtonWrapper}>
        <UserButton 
          afterSignOutUrl="/admin/sign-in"
          appearance={{
            elements: {
              rootBox: {
                width: '40px',
                height: '40px'
              }
            }
          }}
        />
      </div>
    </nav>
  );
}
