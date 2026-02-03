"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationEmail = void 0;
const generateVerificationEmail = (verificationLink) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for signing up with <strong>LesssGo</strong>! We're excited to have you on board.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                To complete your registration and start booking premium vehicles, please verify your email address by clicking the button below:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${verificationLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px; font-size: 14px; line-height: 1.6; color: #666666;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #667eea; word-break: break-all;">
                ${verificationLink}
              </p>
              
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #999999; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                If you didn't create an account with LesssGo, you can safely ignore this email.
              </p>
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
exports.generateVerificationEmail = generateVerificationEmail;
//# sourceMappingURL=verificationEmail.js.map