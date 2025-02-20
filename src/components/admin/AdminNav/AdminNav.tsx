"use client";
import styles from "./AdminNav.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function AdminNav() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut(() => {
      window.location.href = "/admin/sign-in";
    });
  };

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
        <button onClick={handleSignOut} className={styles.link}>
          LOGOUT
        </button>
      </div>
    </nav>
  );
}