"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancellationNoticeTemplate = cancellationNoticeTemplate;
function cancellationNoticeTemplate(data) {
    return `
    <h2>Booking Cancelled</h2>
    <p>Hello ${data.name},</p>
    <p>Your booking ${data.bookingId} has been cancelled.</p>
  `;
}
//# sourceMappingURL=cancellationNotice.js.map