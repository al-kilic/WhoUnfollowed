import 'server-only';

// Plain inline-styled HTML for broad email-client compatibility (no React Email
// dependency). Keep copy on-brand: direct, privacy-forward, no em dashes.

export function verificationCodeEmail(code: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `${code} is your WhoUnfollowed verification code`;
  const text = `Your WhoUnfollowed verification code is ${code}. It expires in 15 minutes. If you did not create an account, you can ignore this email.`;

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e0d3;">
            <tr>
              <td style="padding:32px 32px 8px;">
                <div style="font-size:18px;font-weight:600;color:#01696f;">WhoUnfollowed</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0;">
                <h1 style="margin:0 0 8px;font-size:20px;color:#1a1a1a;">Confirm your email</h1>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#555;">Enter this code to finish creating your account. It expires in 15 minutes.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;">
                <div style="background:#f4f0e8;border:1px solid #e7e0d3;border-radius:12px;padding:18px;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;color:#01696f;font-family:'SF Mono',Menlo,Consolas,monospace;">${code}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#999;">If you did not create a WhoUnfollowed account, you can safely ignore this email. Nothing happens until the code is used.</p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:11px;color:#b3aa97;">WhoUnfollowed. Not affiliated with Instagram or Meta.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
