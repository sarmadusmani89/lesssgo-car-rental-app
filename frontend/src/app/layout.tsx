import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Providers } from "@/components/common/Providers";
import MaintenanceGuard from "@/components/auth/MaintenanceGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lesssgo | Premium Car Rental Marketplace",
  description: "Rent the best cars with Lesssgo. Simple, fast, and professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <MaintenanceGuard>
            {children}
          </MaintenanceGuard>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
