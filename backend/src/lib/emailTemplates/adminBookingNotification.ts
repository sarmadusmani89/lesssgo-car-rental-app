import { generateBaseTemplate } from './baseTemplate';

export function adminBookingNotificationTemplate(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingId: string;
  brand: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transmission?: string | null;
  fuelType?: string | null;
  pickupLocation?: string | null;
  returnLocation?: string | null;
  hp?: number | null;
  vehicleClass?: string | null;
}) {
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      Hi Admin,
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
      A new booking has been <strong>confirmed</strong> and requires your attention.
    </p>
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
      <h3 style="margin: 0 0 20px; font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
        Customer Details
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        <tr>
          <td style="padding-bottom: 10px;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Name</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.customerName}</p>
          </td>
          <td align="right" style="padding-bottom: 10px;">
             <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Phone</p>
             <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.customerPhone}</p>
          </td>
        </tr>
         <tr>
          <td colspan="2">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Email</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.customerEmail}</p>
          </td>
        </tr>
      </table>

      <h3 style="margin: 0 0 20px; font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        Booking Details
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom: 20px;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Booking ID</p>
            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 800; color: #334155; font-family: monospace;">#${data.bookingId.toString().slice(-8).toUpperCase()}</p>
          </td>
          <td align="right" style="padding-bottom: 20px;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Total</p>
            <p style="margin: 4px 0 0; font-size: 20px; font-weight: 800; color: #10b981;">K${data.totalAmount}</p>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-bottom: 20px;">
             <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Vehicle</p>
             <p style="margin: 2px 0 0; font-size: 16px; font-weight: 800; color: #0f172a;">${data.brand} ${data.vehicleName}</p>
             <p style="margin: 2px 0 0; font-size: 11px; font-weight: 600; color: #64748b;">${data.vehicleClass || 'Premium'} • ${data.hp || 0} HP • ${data.transmission || 'Automatic'} • ${data.fuelType || 'Petrol'}</p>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%">
               <p style="margin: 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Rental Period</p>
               <p style="margin: 4px 0 0; font-size: 13px; font-weight: 700; color: #334155;">${data.startDate} to ${data.endDate}</p>
            </td>
            <td width="50%" align="right">
               <p style="margin: 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Payment Status</p>
               <p style="margin: 4px 0 0; font-size: 13px; font-weight: 700; color: #0891b2;">${data.paymentStatus}</p>
            </td>
          </tr>
          ${(data.pickupLocation || data.returnLocation) ? `
          <tr>
            <td colspan="2" style="padding-top: 15px;">
              <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #edf2f7;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%">
                      <p style="margin: 0; font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Pickup Location</p>
                      <p style="margin: 2px 0 0; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">${data.pickupLocation || 'Not specified'}</p>
                    </td>
                    <td width="50%" align="right">
                      <p style="margin: 0; font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Return Location</p>
                      <p style="margin: 2px 0 0; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">${data.returnLocation || 'Not specified'}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          ` : ''}
        </table>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/admin/bookings/${data.bookingId}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
            Manage Booking
        </a>
    </div>
  `;

  return generateBaseTemplate('New Booking Alert', content);
}
