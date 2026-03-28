import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import Providers from "@/components/common/Providers/Providers";
import MaintenanceGuard from "@/components/auth/MaintenanceGuard";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://134.199.169.242'}/settings`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    const settings = await res.json();

    return {
      title: settings.siteName ? `${settings.siteName} | Premium Car Rental Marketplace` : "Lesssgo | Premium Car Rental Marketplace",
      description: "Rent the best cars with Lesssgo. Simple, fast, and professional.",
      icons: {
        icon: settings.faviconUrl || '/favicon.ico',
        shortcut: settings.faviconUrl || '/favicon.ico',
        apple: settings.faviconUrl || '/favicon.ico',
      },
      theme: settings.theme || 'theme-corporate-blue'
    };
  } catch (error) {
    return {
      title: "Lesssgo | Premium Car Rental Marketplace",
      description: "Rent the best cars with Lesssgo. Simple, fast, and professional.",
      icons: {
        icon: '/favicon.ico',
      },
      theme: 'theme-corporate-blue'
    } as any;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metadata: any = await generateMetadata();
  const theme = metadata.theme || 'theme-corporate-blue';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${theme}`} suppressHydrationWarning>
        <Providers>
          <MaintenanceGuard>
            {children}
          </MaintenanceGuard>
        </Providers>
      </body>
    </html>
  );
}
