'use client';

import { User, Mail, Phone } from 'lucide-react';

export default function PersonalInformation() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+92 300 1234567',
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <User size={20} className="text-blue-500" />
          <span>Name: {user.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-green-500" />
          <span>Email: {user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={20} className="text-purple-500" />
          <span>Phone: {user.phone}</span>
        </div>
      </div>
    </div>
  );
}
