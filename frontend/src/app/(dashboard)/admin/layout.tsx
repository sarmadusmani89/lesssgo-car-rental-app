'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Car, Users, Calendar, Settings, Mail, MessageSquare } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState('Admin User');

  useEffect(() => {
    const updateUserName = () => {
      // Fetch user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Check for full name first, then build from parts
          const name = parsedUser.name || `${parsedUser.firstName || ''} ${parsedUser.lastName || ''}`.trim();
          setUserName(name || 'Admin User');
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    };

    updateUserName();

    // Support real-time updates if profile is changed in another tab or in this session
    window.addEventListener('storage', updateUserName);
    return () => window.removeEventListener('storage', updateUserName);
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
        { name: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquare size={20} /> },
        { name: 'Newsletter', href: '/admin/newsletter', icon: <Mail size={20} /> },
        { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}

