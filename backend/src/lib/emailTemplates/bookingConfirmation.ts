export function bookingConfirmationTemplate(data: {
  name: string;
  bookingId: string;
  vehicle: string;
  date: string;
}) {
  return `
    <h2>Booking Confirmed</h2>
    <p>Hello ${data.name},</p>
    <p>Your booking <strong>#${data.bookingId}</strong> is confirmed.</p>
    <p>Vehicle: ${data.vehicle}</p>
    <p>Date: ${data.date}</p>
  `;
}
