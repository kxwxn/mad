import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import AdminNav from "@/components/admin/AdminNav/AdminNav";
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: "MAD Admin",
  description: "Admin page",
};

const helvetica = localFont({ src: "../../../fonts/helvmb__0.ttf" });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={helvetica.className}>
        <body className={styles.body}>
          <SignedIn>
            <AdminNav />
            <main className={styles.main}>
              {children}
            </main>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
