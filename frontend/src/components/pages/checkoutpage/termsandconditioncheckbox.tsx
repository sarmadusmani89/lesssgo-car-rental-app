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
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-gray-700">
        I agree to the Terms and Conditions
      </span>
    </div>
  );
}
