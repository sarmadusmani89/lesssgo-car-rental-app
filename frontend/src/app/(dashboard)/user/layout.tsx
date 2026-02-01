'use client';

import Sidebar from '@/components/layout/sidebar/Sidebar';
import Topbar from '@/components/layout/topbar/Topbar';
import { Calendar, User, Settings, LogOut } from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const sidebarWidth = 256; // Sidebar width in px

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 flex flex-col justify-between bg-white shadow z-20">
        <Sidebar
          title="User Panel"
          links={[
            { name: 'My Bookings', href: '/user/bookings', icon: <Calendar size={20} /> },
            { name: 'Booking Details', href: '/user/bookingdetailspage', icon: <User size={20} /> },
            { name: 'Profile', href: '/user/profile', icon: <Settings size={20} /> },
          ]}
          className="flex-1"
        />

        {/* Logout */}
        <div className="px-4 py-4">
          <button
            onClick={() => (window.location.href = '/login')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
          >
            <LogOut size={20} className="text-gray-400 group-hover:text-blue-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar title="User Dashboard" user={{ name: 'User Name' }} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
