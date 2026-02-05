import { generateBaseTemplate } from './baseTemplate';

export const generateVerificationEmail = (verificationLink: string) => {
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      Thank you for signing up with <strong>LesssGo</strong>! We're excited to have you on board.
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
      To complete your registration and start booking premium vehicles, please verify your email address by clicking the button below:
    </p>
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 10px 0 30px;">
          <a href=${verificationLink} style="display: inline-block; padding: 16px 40px; background: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.3);">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
      <p style="margin: 0 0 10px; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
        Or copy this link:
      </p>
      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #3b82f6; word-break: break-all; font-family: monospace;">
        ${verificationLink}
      </p>
    </div>
    
    <p style="margin: 30px 0 0; font-size: 13px; line-height: 1.6; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px;">
      If you didn't create an account with LesssGo, you can safely ignore this email.
    </p>
  `;

  return generateBaseTemplate('Verify Your Email', content);
};
