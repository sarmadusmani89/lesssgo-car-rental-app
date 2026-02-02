export function paymentReceiptTemplate(data: {
  name: string;
  amount: string;
  bookingId: string;
}) {
  return `
    <h2>Payment Receipt</h2>
    <p>Hello ${data.name},</p>
    <p>Amount Paid: ${data.amount}</p>
    <p>Booking ID: ${data.bookingId}</p>
  `;
}
