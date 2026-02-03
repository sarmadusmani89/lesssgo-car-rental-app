'use client';

interface Props {
  disabled: boolean;
  onConfirm: () => void;
}

export default function ConfirmBookingButton({
  disabled,
  onConfirm,
}: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onConfirm}
      className={`w-full py-3 rounded font-semibold text-white transition ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      Confirm Booking
    </button>
  );
}
