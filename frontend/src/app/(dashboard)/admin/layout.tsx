'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Car, Users, Calendar, Settings, Mail, User } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState('Admin User');

  useEffect(() => {
    // Fetch user data from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'Admin User');
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  return (
    <DashboardLayout
      sidebarTitle="Admin Panel"
      topbarTitle="Admin Portal"
      userName={userName}
      userRole="ADMIN"
      links={[
        { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Cars', href: '/admin/cars', icon: <Car size={20} /> },
        { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
        { name: 'Bookings', href: '/admin/bookings', icon: <Calendar size={20} /> },
        { name: 'Profile', href: '/dashboard/profile', icon: <User size={20} /> },
        { name: 'Newsletter', href: '/admin/newsletter', icon: <Mail size={20} /> },
        { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
