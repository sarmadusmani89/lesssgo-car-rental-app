'use client';

interface Props {
  onChange: (data: any) => void;
}

export default function CustomerInformationForm({ onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold">Customer Information</h2>

      <input
        name="name"
        placeholder="Full Name"
        className="w-full border rounded px-3 py-2"
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        className="w-full border rounded px-3 py-2"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        className="w-full border rounded px-3 py-2"
        onChange={handleChange}
      />
    </div>
  );
}
