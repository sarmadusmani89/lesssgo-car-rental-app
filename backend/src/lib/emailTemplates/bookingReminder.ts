export function bookingReminderTemplate(userName: string, carName: string, startDate: string) {
  return `
    <h1>Booking Reminder</h1>
    <p>Hi ${userName},</p>
    <p>This is a reminder for your upcoming booking:</p>
    <ul>
      <li>Car: ${carName}</li>
      <li>Date: ${startDate}</li>
    </ul>
    <p>Thank you for choosing us!</p>
  `;
}
