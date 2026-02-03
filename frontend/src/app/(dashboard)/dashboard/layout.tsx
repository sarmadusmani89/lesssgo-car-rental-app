'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar, User, Settings } from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <DashboardLayout
      sidebarTitle="Dashboard"
      topbarTitle="User Dashboard"
      userName="User Name"
      links={[
        { name: 'My Bookings', href: '/dashboard/bookings', icon: <Calendar size={20} /> },
        { name: 'Booking Details', href: '/dashboard/bookingdetailspage', icon: <User size={20} /> },
        { name: 'Profile', href: '/dashboard/profile', icon: <Settings size={20} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
