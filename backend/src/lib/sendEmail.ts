import sgMail from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_FROM_EMAIL;

  if (!apiKey) {
    console.warn('SENDGRID_API_KEY is not set. Email will not be sent.');
    return;
  }

  sgMail.setApiKey(apiKey);

  const msg = {
    to,
    from: fromEmail!,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to} via SendGrid`);
  } catch (error: any) {
    console.error('Error sending email via SendGrid:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
