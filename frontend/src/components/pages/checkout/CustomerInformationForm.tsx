'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { formatAustralianPhone } from '@/lib/utils';

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
      const newData = {
        fullName: initialData.fullName || initialData.customerName || '',
        email: initialData.email || initialData.customerEmail || '',
        phoneNumber: formatAustralianPhone(initialData.phoneNumber || initialData.customerPhone || ''),
      };
      setFormData(newData);
      // Notify parent of the merged/pre-filled state
      onChange(newData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'phoneNumber') {
      value = formatAustralianPhone(value);
      // Block if stripped length exceeds 10 digits
      if (value.replace(/\s/g, '').length > 10) return;
    }

    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onChange(updated);
  };

  const inputClasses = "w-full bg-gray-50 border-2 border-gray-50 px-5 py-4 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal";
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-10 border border-gray-100">
      <h2 className="text-xl font-black text-gray-900 font-outfit mb-8 uppercase tracking-tight">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <label className={labelClasses}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              name="fullName"
              placeholder="e.g. John Doe"
              className={`${inputClasses} pl-12`}
              value={formData.fullName}
              onChange={handleChange}
              maxLength={50}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            Email Address <span className="text-gray-400 font-normal italic lowercase ml-1">(read-only)</span>
          </label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              name="email"
              type="email"
              readOnly
              className={`${inputClasses} pl-12 bg-gray-100 cursor-not-allowed text-gray-400`}
              value={formData.email}
              maxLength={100}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Phone Number <span className="text-gray-400 font-normal italic lowercase ml-1">(optional)</span></label>
          <div className="relative group">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              name="phoneNumber"
              type="tel"
              placeholder="04XX XXX XXX"
              className={`${inputClasses} pl-12`}
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength={12}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
