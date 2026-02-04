'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Loader2 } from 'lucide-react';
import AuthInput from '@/components/pages/auth/AuthInput';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function UpdateProfileForm() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({ ...parsed });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id, name, email } = user;

      await api.put(`/users/${id}`, {
        name,
        email,
      });

      // Update localStorage with new values
      const updatedUser = { ...user, name };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold font-outfit mb-6">Update Information</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          label="Full Name"
          icon={User}
          required
          value={user.name || ''}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          maxLength={50}
        />

        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          required
          value={user.email || ''}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          maxLength={100}
        />

        {/* Phone not in backend yet, skipping or just UI */}

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-8"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
