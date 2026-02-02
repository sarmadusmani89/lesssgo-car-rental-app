'use client';

export default function LoadingStatesDuringPayment() {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-blue-600 font-medium">
        Processing payment, please wait…
      </span>
    </div>
  );
}
