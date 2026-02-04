'use client';

import { useState, useEffect } from 'react';
import ProfileView from '@/components/dashboard/ProfileView';
import UpdateProfileForm from '@/components/pages/user/profile/UpdateProfileForm';
import ChangePassword from '@/components/pages/user/profile/ChangePassword';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for updates from UpdateProfileForm
    const handleStorageChange = () => {
      const updated = localStorage.getItem('user');
      if (updated) setUser(JSON.parse(updated));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <ProfileView user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpdateProfileForm />
        <ChangePassword />
      </div>
    </div>
  );
}
