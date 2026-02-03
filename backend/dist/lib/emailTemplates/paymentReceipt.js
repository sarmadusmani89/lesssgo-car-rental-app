"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentReceiptTemplate = paymentReceiptTemplate;
function paymentReceiptTemplate(data) {
    return `
    <h2>Payment Receipt</h2>
    <p>Hello ${data.name},</p>
    <p>Amount Paid: ${data.amount}</p>
    <p>Booking ID: ${data.bookingId}</p>
  `;
}
//# sourceMappingURL=paymentReceipt.js.map