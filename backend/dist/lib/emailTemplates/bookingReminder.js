"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingReminderTemplate = bookingReminderTemplate;
function bookingReminderTemplate(userName, vehicleName, startDate) {
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
//# sourceMappingURL=bookingReminder.js.map