'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { formatPNGPhone, stripPhone } from '@/lib/utils';
import AuthInput from '@/components/pages/auth/AuthInput';

interface Props {
  initialData: any;
  onChange: (data: any) => void;
}

export default function CustomerInformationForm({ initialData, onChange }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (initialData) {
      const rawPhone = initialData.phoneNumber || initialData.customerPhone || '';
      // Strip +675 if present for local display/edit
      const strippedPhone = rawPhone.startsWith('+675') ? rawPhone.slice(4).trim() : rawPhone;

      const newData = {
        fullName: initialData.fullName || initialData.customerName || '',
        email: initialData.email || initialData.customerEmail || '',
        phoneNumber: formatPNGPhone(strippedPhone),
      };
      setFormData(newData);
      // Notify parent of the merged/pre-filled state
      onChange(newData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'phoneNumber') {
      value = formatPNGPhone(value);
      // PNG format is 8 digits (7XXX XXXX) which becomes 9 with the space
      if (stripPhone(value).length > 8) return;
    }

    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-10 border border-gray-100">
      <h2 className="text-xl font-black text-gray-900 font-outfit mb-8 uppercase tracking-tight">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div className="md:col-span-2">
          <AuthInput
            label="Full Name"
            icon={User}
            required
            placeholder="e.g. John Doe"
            value={formData.fullName}
            name="fullName"
            onChange={handleChange}
            maxLength={50}
          />
        </div>

        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          readOnly
          value={formData.email}
          name="email"
          maxLength={100}
        />

        <AuthInput
          label="Phone Number"
          icon={Phone}
          type="tel"
          placeholder="7XXX XXXX"
          prefix="+675"
          required
          value={formData.phoneNumber}
          name="phoneNumber"
          onChange={handleChange}
          maxLength={9}
        />
      </div>
    </div>
  );
}
