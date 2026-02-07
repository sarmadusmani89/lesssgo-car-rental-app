import { generateBaseTemplate } from './baseTemplate';

export function cancellationNoticeTemplate(data: {
  name: string;
  bookingId: string;
  carName: string;
  brand: string;
}) {
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      Hi ${data.name},
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
      Your booking for the <strong>${data.brand} ${data.carName}</strong> (#${data.bookingId.slice(-8).toUpperCase()}) has been successfully cancelled as requested.
    </p>
    
    <div style="padding: 24px; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 16px; margin-bottom: 30px;">
      <p style="margin: 0; font-size: 14px; font-weight: 700; color: #b91c1c; text-align: center;">
        BOOKING CANCELLED
      </p>
    </div>
    
    <p style="margin: 0; font-size: 15px; color: #475569;">
      We hope to see you again soon! If you have any questions, feel free to contact us.
    </p>
  `;

  return generateBaseTemplate('Booking Cancelled', content);
}
