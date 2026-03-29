export const verificationEmailTemplate = (username, verifyLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d9488,#134e4a);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
        Kamankar<span style="color:#5eead4;">Estate</span>
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;">Welcome, ${username}!</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
        Thank you for joining Kamankar Estate. Please verify your email address to activate your account and start exploring properties.
      </p>

      <!-- Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${verifyLink}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:12px;font-size:15px;font-weight:600;">
          Verify Email Address
        </a>
      </div>

      <div style="border-top:1px solid #f1f5f9;padding-top:20px;margin-top:20px;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">
          This verification link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">
        &copy; ${new Date().getFullYear()} Kamankar Estate. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmailTemplate = (username) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d9488,#134e4a);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
        Kamankar<span style="color:#5eead4;">Estate</span>
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;text-align:center;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
        <tr>
          <td align="center">
            <div style="width:80px;height:80px;background:#f0fdfa;border-radius:50%;text-align:center;line-height:80px;font-size:36px;margin:0 auto;">&#127968;</div>
          </td>
        </tr>
      </table>
      <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;">Welcome to Kamankar Estate!</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
        Hi <strong>${username}</strong>, your account has been successfully created and verified. You're all set to explore properties, save favorites, and connect with property owners.
      </p>

      <div style="background:#f0fdfa;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 12px;color:#1e293b;font-size:14px;font-weight:600;">What you can do now:</p>
        <p style="margin:0 0 6px;color:#64748b;font-size:13px;">&#10003; Browse 200+ properties across 50+ cities</p>
        <p style="margin:0 0 6px;color:#64748b;font-size:13px;">&#10003; List your own property for free</p>
        <p style="margin:0;color:#64748b;font-size:13px;">&#10003; Connect directly with property owners</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">
        &copy; ${new Date().getFullYear()} Kamankar Estate. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
