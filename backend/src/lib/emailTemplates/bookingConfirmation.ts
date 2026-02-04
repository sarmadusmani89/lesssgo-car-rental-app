import { generateBaseTemplate } from './baseTemplate';

export function bookingConfirmationTemplate(data: {
  customerName: string;
  bookingId: string;
  brand: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentMethod: string;
  isConfirmed: boolean;
}) {
  const statusColor = data.isConfirmed ? '#10b981' : '#f59e0b';
  const statusText = data.isConfirmed ? 'Confirmed' : 'Pending Confirmation';

  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      Hi ${data.customerName},
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
      ${data.isConfirmed ? 'Great news! Your booking is officially confirmed.' : 'We have received your booking request and it is currently being processed.'} 
      Below are your reservation details.
    </p>
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; line-height: 1;">Booking ID</p>
            <p style="margin: 4px 0 0; font-size: 18px; font-weight: 800; color: #334155; font-family: monospace;">#${data.bookingId.toString().slice(-8).toUpperCase()}</p>
          </td>
          <td align="right" style="padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; line-height: 1;">Status</p>
            <p style="margin: 4px 0 0; font-size: 14px; font-weight: 800; color: ${statusColor}; text-transform: uppercase; letter-spacing: 0.05em;">${statusText}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Vehicle</p>
            <p style="margin: 2px 0 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">${data.brand}</p>
            <p style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a; text-transform: uppercase;">${data.vehicleName}</p>
          </td>
          <td align="right" style="padding-top: 20px;">
             <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Total Amount</p>
             <p style="margin: 2px 0 0; font-size: 24px; font-weight: 800; color: #3b82f6;">$${data.totalAmount}</p>
          </td>
        </tr>
      </table>
      
      <div style="margin-top: 25px; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #f1f5f9;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
               <p style="margin: 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Pickup - Dropoff</p>
               <p style="margin: 4px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.startDate} to ${data.endDate}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 15px;">
               <p style="margin: 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Payment Method</p>
               <p style="margin: 4px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.paymentMethod === 'ONLINE' ? 'Pay via Stripe (Online)' : 'Cash on Pickup'}</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
    
    <p style="margin: 0 0 20px; font-size: 15px; color: #475569;">
      ${data.isConfirmed ? 'Please present this email along with a valid driver\'s license and ID at the time of pickup.' : 'Once your payment is verified, we will send you a final confirmation email.'}
    </p>
    
    <p style="margin: 0; font-size: 15px; color: #475569;">
      Safe travels,<br>The LesssGo Team
    </p>
  `;

  return generateBaseTemplate(data.isConfirmed ? 'Booking Confirmed' : 'Booking Received', content);
}
