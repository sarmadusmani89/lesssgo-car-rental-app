'use client';

interface Props {
  bookingId: number;
}

export default function DownloadReceipt({ bookingId }: Props) {
  const handleDownload = () => {
    alert(`Downloading receipt for booking #${bookingId}`);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Download Receipt
    </button>
  );
}
