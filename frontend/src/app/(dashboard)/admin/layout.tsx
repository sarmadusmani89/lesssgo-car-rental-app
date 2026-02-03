'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Car, Users, Calendar, Settings } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebarTitle="Admin Panel"
      topbarTitle="Admin Portal"
      userName="Admin User"
      links={[
        { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Cars', href: '/admin/cars', icon: <Car size={20} /> },
        { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
        { name: 'Bookings', href: '/admin/bookings', icon: <Calendar size={20} /> },
        { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
