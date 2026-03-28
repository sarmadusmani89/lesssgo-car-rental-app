import { generateBaseTemplate, EmailConfig } from './baseTemplate';

export const contactFormTemplate = (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}, config: EmailConfig) => {
    const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      You have received a new message from the website contact form.
    </p>
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
      <h3 style="margin: 0 0 20px; font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
        Sender Details
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        <tr>
          <td style="padding-bottom: 10px;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Name</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;">${data.name}</p>
          </td>
        </tr>
         <tr>
          <td>
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Email</p>
            <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #334155;"><a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">${data.email}</a></p>
          </td>
        </tr>
      </table>

      <h3 style="margin: 0 0 20px; font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        Message Content
      </h3>
      <div style="padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #f1f5f9;">
        <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Subject</p>
        <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #0f172a;">${data.subject}</p>
        
        <p style="margin: 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${data.message}</p>
      </div>
    </div>
    
    <p style="margin: 0; font-size: 15px; color: #475569; text-align: center;">
      Please reply directly to <a href="mailto:${data.email}" style="color: #3b82f6; font-weight: 700;">${data.email}</a> to respond to the customer.
    </p>
  `;

    return generateBaseTemplate('New Contact Message', content, config);
};
