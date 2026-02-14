'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import AuthInput from '@/components/pages/auth/AuthInput';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatPNGPhone, mapToPNGPrefix, stripPhone } from '@/lib/utils';

export default function UpdateProfileForm() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Strip prefix for display/edit if it exists
      const rawPhone = parsed.phoneNumber || '';
      const strippedPhone = rawPhone.startsWith('+675') ? rawPhone.slice(4).trim() : rawPhone;

      setUser({
        ...parsed,
        phoneNumber: formatPNGPhone(strippedPhone)
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id, name, email, phoneNumber } = user;
      const formattedPhone = mapToPNGPrefix(phoneNumber);

      await api.put(`/users/${id}`, {
        name,
        email,
        phoneNumber: formattedPhone,
      });

      // Update localStorage with new values
      const updatedUser = { ...user, name, email, phoneNumber: formattedPhone };

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

        <AuthInput
          label="Phone Number"
          icon={Phone}
          type="tel"
          placeholder="7XXX XXXX"
          prefix="+675"
          required
          value={user.phoneNumber || ''}
          onChange={(e) => {
            const formatted = formatPNGPhone(e.target.value);
            if (stripPhone(formatted).length <= 8) {
              setUser({ ...user, phoneNumber: formatted });
            }
          }}
          maxLength={9}
        />

        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            isLoading={loading}
            disabled={loading}
            className="px-8"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
