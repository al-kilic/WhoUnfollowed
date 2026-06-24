import 'server-only';

// Inline-styled, table-based HTML for broad email-client compatibility (no React
// Email dependency). Brand: warm teal (#01696F), cream (#F4F0E8), terra accent
// (#A84B2F). Copy stays on-brand: direct, privacy-forward, no em dashes.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

const C = {
  bg: '#f4f0e8',
  card: '#ffffff',
  border: '#e7e0d3',
  teal: '#01696f',
  ink: '#1a1a1a',
  dim: '#555555',
  mute: '#8a8275',
  faint: '#b3aa97',
};

// Hidden preview text shown by inbox clients next to the subject line.
function preheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${text}</div>`;
}

// Shared branded shell: logo header, content slot, legal footer.
function emailLayout(opts: { preview: string; contentHtml: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
  </head>
  <body style="margin:0;padding:0;background:${C.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    ${preheader(opts.preview)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;width:100%;">
            <tr>
              <td style="padding:4px 8px 20px;">
                <a href="${APP_URL}" style="text-decoration:none;display:inline-block;">
                  <img src="${APP_URL}/logo.png" width="26" height="26" alt="" style="vertical-align:middle;border-radius:7px;" />
                  <span style="vertical-align:middle;margin-left:9px;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${C.ink};letter-spacing:-0.01em;">WhoUnfollowed</span>
                </a>
              </td>
            </tr>
            <tr>
              <td style="background:${C.card};border:1px solid ${C.border};border-radius:16px;">
                ${opts.contentHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 8px 0;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:${C.faint};">
                  WhoUnfollowed. Your data stays in your browser. Not affiliated with Instagram or Meta.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function verificationCodeEmail(code: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `${code} is your WhoUnfollowed verification code`;
  const text = `Your WhoUnfollowed verification code is ${code}. It expires in 15 minutes. If you did not create an account, you can ignore this email.`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">Confirm your email</h1>
        <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${C.dim};">Enter this code to finish creating your account. It expires in 15 minutes.</p>
      </td></tr>
      <tr><td style="padding:0 30px;">
        <div style="background:${C.bg};border:1px solid ${C.border};border-radius:12px;padding:18px;text-align:center;font-size:34px;font-weight:700;letter-spacing:10px;color:${C.teal};font-family:'SF Mono',Menlo,Consolas,monospace;">${code}</div>
      </td></tr>
      <tr><td style="padding:20px 30px 30px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">If you did not create a WhoUnfollowed account, you can safely ignore this email. Nothing happens until the code is used.</p>
      </td></tr>
    </table>`;

  return { subject, html: emailLayout({ preview: `Your verification code is ${code}`, contentHtml: content }), text };
}

export function exportConfirmationEmail(csvFilename: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `You exported: ${csvFilename}`;
  const text = `Thanks for using WhoUnfollowed. Your CSV (${csvFilename}) was downloaded directly to your device. We do not store your follower data on our servers.`;

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">Thanks for using WhoUnfollowed</h1>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.dim};">Your CSV <strong style="color:${C.ink};">${csvFilename}</strong> was downloaded straight to your device. We do not store your follower data on our servers. Nothing left your browser.</p>
      </td></tr>
      <tr><td style="padding:0 30px 30px;">
        <a href="${APP_URL}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:10px;">Open WhoUnfollowed</a>
      </td></tr>
    </table>`;

  return { subject, html: emailLayout({ preview: 'Your export is ready on your device.', contentHtml: content }), text };
}
