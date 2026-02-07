import { generateBaseTemplate } from './baseTemplate';

export function bookingReminderTemplate(data: {
  userName: string;
  carName: string;
  brand: string;
  startDate: string;
  pickupLocation: string;
  bookingId: string;
}) {
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      Hi ${data.userName},
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
      This is a friendly reminder that your booking with <strong>LesssGo</strong> is scheduled for tomorrow!
    </p>
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Vehicle</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #64748b;">${data.brand}</p>
            <p style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a; text-transform: uppercase;">${data.carName}</p>
          </td>
          <td align="right">
             <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Booking ID</p>
             <p style="margin: 2px 0 0; font-size: 16px; font-weight: 800; color: #334155; font-family: monospace;">#${data.bookingId.slice(-8).toUpperCase()}</p>
          </td>
        </tr>
      </table>
      
      <div style="margin-top: 25px; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #f1f5f9;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%">
               <p style="margin: 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Pickup Time</p>
               <p style="margin: 4px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.startDate}</p>
            </td>
            <td width="50%" align="right">
               <p style="margin: 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Pickup Location</p>
               <p style="margin: 4px 0 0; font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase;">${data.pickupLocation}</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
    
    <p style="margin: 0; font-size: 15px; color: #475569;">
      Please ensure you have your driver's license and ID ready for the pickup. Safe travels!
    </p>
  `;

  return generateBaseTemplate('Booking Reminder', content);
}
