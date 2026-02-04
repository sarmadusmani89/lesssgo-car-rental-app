'use client';

import { User, Mail, Phone, MapPin } from 'lucide-react';

interface Props {
  onChange: (data: any) => void;
}

export default function CustomerInformationForm({ onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const inputClasses = "w-full bg-gray-50 border-2 border-gray-50 px-5 py-4 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal";
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-10 border border-gray-100">
      <h2 className="text-xl font-black text-gray-900 font-outfit mb-8 uppercase tracking-tight">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClasses}>First Name</label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              name="firstName"
              placeholder="e.g. John"
              className={`${inputClasses} pl-12`}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Last Name</label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              name="lastName"
              placeholder="e.g. Doe"
              className={`${inputClasses} pl-12`}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              className={`${inputClasses} pl-12`}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              name="phoneNumber"
              placeholder="+1 (555) 000-0000"
              className={`${inputClasses} pl-12`}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
