'use client';

import Sidebar from '@/components/layout/sidebar/Sidebar';
import Topbar from '@/components/layout/topbar/Topbar';
import { LayoutDashboard, Car, Users, Calendar, Settings, LogOut } from 'lucide-react';

export default function ClientAdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarWidth = 256; // w-64 in px

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fixed */}
      <div className="fixed h-screen top-0 left-0 z-30 w-64 flex flex-col justify-between">
        <Sidebar
          title="Admin Panel"
          links={[
            { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
            { name: 'Vehicles', href: '/admin/vehicles', icon: <Car size={20} /> },
            { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
            { name: 'Bookings', href: '/admin/bookings', icon: <Calendar size={20} /> },
            { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
          ]}
          className="flex-1"
        />
        {/* Logout button styled like sidebar link */}
        <div className="px-4 py-4">
          <button
            onClick={() => {
              console.log("Logging out...");
              window.location.href = "/login";
            }}
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
        <Topbar
          title="Admin Portal"
          user={{ name: "Admin User" }}
        />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
