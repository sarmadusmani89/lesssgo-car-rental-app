import { generateBaseTemplate } from './baseTemplate';

export function paymentReceiptTemplate(data: {
  customerName: string;
  amount: number;
  bookingId: string;
  paymentMethod: string;
  transactionId?: string;
  date: string;
}) {
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      Hi ${data.customerName},
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
      Thank you for your payment. This email serves as your official receipt for your reservation with <strong>LesssGo</strong>.
    </p>
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="margin: 0; font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em;">Amount Paid</p>
        <p style="margin: 5px 0 0; font-size: 48px; font-weight: 800; color: #10b981; font-family: 'Outfit', sans-serif;">K${data.amount}</p>
      </div>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e2e8f0; padding-top: 25px;">
        <tr>
          <td style="padding-bottom: 15px;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Booking Reference</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;">#${data.bookingId.toString().slice(-8).toUpperCase()}</p>
          </td>
          <td align="right" style="padding-bottom: 15px;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Payment Date</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.date}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Method</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.paymentMethod}</p>
          </td>
          <td align="right">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Transaction ID</p>
            <p style="margin: 2px 0 0; font-size: 13px; font-weight: 600; color: #64748b; font-family: monospace;">${data.transactionId || 'N/A'}</p>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="padding: 20px; background: #f1f5f9; border-radius: 12px; text-align: center;">
      <p style="margin: 0; font-size: 13px; font-weight: 600; color: #475569;">
        Need a full VAT invoice? <a href="mailto:billing@lesssgo.com" style="color: #3b82f6; text-decoration: none;">Download from your dashboard</a>
      </p>
    </div>
  `;

  return generateBaseTemplate('Payment Receipt', content);
}
