export const generateBaseTemplate = (title: string, content: string) => {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: #0f172a; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; tracking: -0.025em; font-style: italic;">
                LES<span style="color: #3b82f6;">SS</span>GO
              </h1>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px; font-weight: 500;">Premium Vehicle Rentals</p>
            </td>
          </tr>
          
          <!-- Content Title -->
          <tr>
            <td style="padding: 40px 40px 0; text-align: center;">
              <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700; tracking: -0.01em;">${title}</h2>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 40px 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #64748b; font-weight: 600;">
                &copy; ${currentYear} LesssGo. All rights reserved.
              </p>
              <div style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                <p style="margin: 0;">Sydney, Australia</p>
                <p style="margin: 4px 0 0;">Need help? <a href="mailto:support@lesssgo.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">Contact Support</a></p>
              </div>
            </td>
          </tr>
        </table>
        
        <!-- Social/Unsubscribe (Optional) -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td align="center" style="padding: 0 30px;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.6; text-align: center;">
                This email was sent to you because you have an account or active booking with LesssGo. 
                If you did not expect this email, please ignore it.
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
