import { generateBaseTemplate } from './baseTemplate';

export const generatePasswordResetEmail = (resetLink: string) => {
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
      We received a request to reset the password for your <strong>LesssGo</strong> account.
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #334155;">
      Click the button below to create a new password. This link will expire in <strong>1 hour</strong> for security reasons.
    </p>
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 10px 0 30px;">
          <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.3);">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 30px 0; border-radius: 8px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
        <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact our support team immediately.
      </p>
    </div>

    <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
      <p style="margin: 0 0 10px; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
        Direct Link:
      </p>
      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #3b82f6; word-break: break-all; font-family: monospace;">
        ${resetLink}
      </p>
    </div>
  `;

  return generateBaseTemplate('Reset Your Password', content);
};
