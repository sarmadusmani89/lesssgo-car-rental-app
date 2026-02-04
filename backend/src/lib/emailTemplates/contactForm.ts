export const contactFormTemplate = (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Outfit', sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f1f5f9; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: #0f172a; padding: 32px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; }
        .content { padding: 40px 32px; }
        .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin: 24px 0; }
        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; margin-bottom: 4px; }
        .value { color: #1e293b; font-size: 16px; font-weight: 500; margin-bottom: 16px; }
        .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Message</h1>
        </div>
        <div class="content">
          <p style="margin-top: 0;">You have received a new message from the website contact form.</p>
          
          <div class="message-box">
            <div class="label">Sender Name</div>
            <div class="value">${data.name}</div>
            
            <div class="label">Sender Email</div>
            <div class="value"><a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">${data.email}</a></div>
            
            <div class="label">Subject</div>
            <div class="value">${data.subject}</div>
            
            <div class="label">Message</div>
            <div class="value" style="white-space: pre-wrap; margin-bottom: 0;">${data.message}</div>
          </div>
          
          <p>Please reply directly to this email to respond to the customer.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} LesssGo Car Rental. All rights reserved.<br>
          Admin Notification
        </div>
      </div>
    </body>
    </html>
  `;
};
