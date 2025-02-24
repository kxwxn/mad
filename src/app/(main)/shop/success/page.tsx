"use client";

import { Suspense } from "react";
import SuccessPageContent from "@/components/shop/SuccessPageContent/SuccessPageContet";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>WIP...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
