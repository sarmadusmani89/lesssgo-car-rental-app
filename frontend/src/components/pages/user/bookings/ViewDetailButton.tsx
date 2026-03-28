'use client';

import { Button } from '@/components/ui/Button';

interface Props {
  bookingId: number;
}

export default function ViewDetailButton({ bookingId }: Props) {
  const handleClick = () => {
    alert(`Viewing details for booking #${bookingId}`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="px-3 hover:bg-muted"
    >
      View Details
    </Button>
  );
}
