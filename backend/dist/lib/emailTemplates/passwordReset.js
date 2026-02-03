"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordResetEmail = void 0;
const generatePasswordResetEmail = (resetLink) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Reset Your Password</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                We received a request to reset the password for your <strong>LesssGo</strong> account.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Click the button below to create a new password. This link will expire in <strong>1 hour</strong> for security reasons.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 8px rgba(245, 87, 108, 0.3);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px; font-size: 14px; line-height: 1.6; color: #666666;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #f5576c; word-break: break-all;">
                ${resetLink}
              </p>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #856404;">
                  <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                &copy; ${new Date().getFullYear()} LesssGo. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                Premium vehicle rentals at your fingertips
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.generatePasswordResetEmail = generatePasswordResetEmail;
//# sourceMappingURL=passwordReset.js.map