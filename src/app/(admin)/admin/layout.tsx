import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";

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
        <body>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedIn>
              <UserButton signOutUrl="/admin/sign-in" />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
