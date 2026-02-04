'use client';

import Sidebar from '@/components/layout/sidebar/Sidebar';
import Topbar from '@/components/layout/topbar/Topbar';
import { LayoutDashboard, Car, Users, Calendar, Settings, Mail, Bell } from 'lucide-react';
import { useState } from 'react';

export default function ClientAdminWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const adminLinks = [
    { name: 'Overview', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Bookings', href: '/admin/bookings', icon: <Calendar size={20} /> },
    { name: 'Fleet Management', href: '/admin/cars', icon: <Car size={20} /> },
    { name: 'User Directory', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Messages', href: '/admin/messages', icon: <Bell size={20} /> },
    { name: 'Newsletter', href: '/admin/newsletter', icon: <Mail size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`flex min-h-screen bg-slate-50 font-outfit ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
      {/* Sidebar for admin */}
      <Sidebar
        title="Admin Panel"
        links={adminLinks}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-w-0 md:ml-64"
      >
        <Topbar
          user={{ name: "Admin User" }}
        />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
