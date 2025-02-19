"use client";
import { useRouter } from "next/navigation";
import styles from "./AccessDenied.module.css";

export default function AdminAccessDeniedPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Admin Only Page</h1>
        <p>Sorry, this page is accessible to administrators only.</p>
        <div onClick={() => router.push("/")} className={styles.link}>
          Return to Main Page
        </div>
      </div>
    </div>
  );
}
