export function bookingReminderTemplate(userName: string, vehicleName: string, startDate: string) {
  return `
    <h1>Booking Reminder</h1>
    <p>Hi ${userName},</p>
    <p>This is a reminder for your upcoming booking:</p>
    <ul>
      <li>Vehicle: ${vehicleName}</li>
      <li>Date: ${startDate}</li>
    </ul>
    <p>Thank you for choosing us!</p>
  `;
}
