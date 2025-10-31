"use client";

import { Suspense } from "react";
import SuccessPageContent from "@/components/shop/SuccessPageContent/SuccessPageContent";
import styles from "@/app/(main)/page.module.css";
export default function SuccessPage() {
  return (
    <Suspense fallback={<div>WIP...</div>}>
      <div className={styles.container}>
        <SuccessPageContent />
      </div>
    </Suspense>
  );
}
