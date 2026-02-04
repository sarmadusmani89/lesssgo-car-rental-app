'use client';

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import AuthInput from '@/components/pages/auth/AuthInput';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) throw new Error('User not found');

      const { id } = JSON.parse(storedUser);

      await api.put(`/users/${id}`, {
        password: passwords.newPassword,
      });

      toast.success('Password changed successfully');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold font-outfit mb-6">Change Password</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          label="New Password"
          icon={Lock}
          type="password"
          required
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          maxLength={50}
        />

        <AuthInput
          label="Confirm Password"
          icon={Lock}
          type="password"
          required
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          maxLength={50}
        />

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-8"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
