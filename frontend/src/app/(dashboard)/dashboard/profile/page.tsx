'use client';

import { useState, useEffect } from 'react';
import ProfileView from '@/components/dashboard/ProfileView';
import UpdateProfileForm from '@/components/pages/user/profile/UpdateProfileForm';
import ChangePassword from '@/components/pages/user/profile/ChangePassword';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial load from local storage for faster UI
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchProfile();

    // Listen for updates from UpdateProfileForm
    const handleStorageChange = () => {
      const updated = localStorage.getItem('user');
      if (updated) setUser(JSON.parse(updated));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

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
