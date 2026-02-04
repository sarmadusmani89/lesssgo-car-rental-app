export function cancellationNoticeTemplate(data: {
  name: string;
  bookingId: string;
}) {
  return `
    <h2>Booking Cancelled</h2>
    <p>Hello ${data.name},</p>
    <p>Your booking #${data.bookingId.slice(-8).toUpperCase()} has been cancelled.</p>
  `;
}
