"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingConfirmationTemplate = bookingConfirmationTemplate;
function bookingConfirmationTemplate(data) {
    return `
    <h2>Booking Confirmed</h2>
    <p>Hello ${data.name},</p>
    <p>Your booking <strong>#${data.bookingId}</strong> is confirmed.</p>
    <p>Vehicle: ${data.vehicle}</p>
    <p>Date: ${data.date}</p>
  `;
}
//# sourceMappingURL=bookingConfirmation.js.map