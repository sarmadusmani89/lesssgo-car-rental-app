'use client';

import Sidebar from '@/components/layout/sidebar/Sidebar';
import Topbar from '@/components/layout/topbar/Topbar';
import { Calendar, Settings, LogOut, User } from 'lucide-react';

interface WrapperProps {
  children: React.ReactNode;
}

export default function ClientUserWrapper({ children }: WrapperProps) {
  const sidebarWidth = 256;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 flex flex-col justify-between bg-white shadow z-20">
        <Sidebar
          title="Dashboard"
          links={[
            { name: 'My Bookings', href: '/dashboard/bookings', icon: <Calendar size={20} /> },
            { name: 'Booking Details', href: '/dashboard/bookingdetailspage', icon: <User size={20} /> },
            { name: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
          ]}
    <div className={`flex min-h-screen bg-slate-50 font-outfit ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
          {/* Sidebar for user */}
          <Sidebar
            title="My ACCOUNT"
            links={userLinks}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 md:ml-64">
            {/* Only one Topbar */}
            <Topbar
              user={{ name: 'User Name' }}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
          </div>
        </div>
        );
}
