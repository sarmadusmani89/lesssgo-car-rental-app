import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import Providers from "@/components/common/Providers/Providers";
import MaintenanceGuard from "@/components/auth/MaintenanceGuard";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://134.199.169.242'}/settings`, {
      cache: 'no-store' // Don't cache setting fetch on server to ensure fresh theme on refresh
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  if (!settings) {
    return {
      title: "Lesssgo | Premium Car Rental Marketplace",
      description: "Rent the best cars with Lesssgo. Simple, fast, and professional.",
      icons: {
        icon: '/favicon.ico',
      },
    };
  }

  return {
    title: settings.siteName ? `${settings.siteName} | Premium Car Rental Marketplace` : "Lesssgo | Premium Car Rental Marketplace",
    description: "Rent the best cars with Lesssgo. Simple, fast, and professional.",
    icons: {
      icon: settings.faviconUrl || '/favicon.ico',
      shortcut: settings.faviconUrl || '/favicon.ico',
      apple: settings.faviconUrl || '/favicon.ico',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const theme = settings?.theme || 'theme-corporate-blue';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${theme}`} suppressHydrationWarning>
        <Providers>
          <SessionProvider>
            <MaintenanceGuard>
              {children}
            </MaintenanceGuard>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
