'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Check for 'name' or construct from 'firstName' and 'lastName'
        const name = parsedUser.name || `${parsedUser.firstName || ''} ${parsedUser.lastName || ''}`.trim() || 'User';
        setUserName(name);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  return (
    <DashboardLayout
      sidebarTitle="Dashboard"
      topbarTitle="User Dashboard"
      userName={userName}
      links={[
        { name: 'Profile', href: '/dashboard/profile', icon: <Settings size={20} /> },
        { name: 'My Bookings', href: '/dashboard/bookings', icon: <Calendar size={20} /> },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
