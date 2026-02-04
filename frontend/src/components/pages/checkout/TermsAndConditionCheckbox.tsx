'use client';

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function TermsAndConditionsCheckbox({
  checked,
  onChange,
}: Props) {
  return (
    <label className="flex items-center gap-4 cursor-pointer group p-2">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-6 h-6 border-2 border-gray-200 rounded-lg group-hover:border-blue-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-300" />
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-widest">
        I agree to the <span className="text-blue-600 underline">Terms and Conditions</span>
      </span>
    </label>
  );
}
