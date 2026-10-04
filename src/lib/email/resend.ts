/**
 * Resend Email Client & Password Reset Template
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Portfolio Admin <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to.trim()],
        subject,
        html,
        text: text || "Password reset verification code.",
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errBody.message ||
          `Resend API error (Status ${response.status}: ${response.statusText})`,
      };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to connect to email provider";
    return { success: false, error: errorMsg };
  }
}

/**
 * Builds a responsive, branded HTML email for password reset OTP.
 */
export function buildPasswordResetEmailTemplate(params: {
  otp: string;
  expiresMinutes: number;
}): { html: string; text: string } {
  const { otp, expiresMinutes } = params;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0a08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#faf7f2;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0a08;padding:40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#17120f;border:1px solid #3d2c22;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding:32px 32px 20px;text-align:center;border-bottom:1px solid #281d17;">
              <div style="display:inline-block;padding:8px 16px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:999px;color:#f59e0b;font-size:12px;font-family:monospace;font-weight:600;letter-spacing:0.05em;margin-bottom:14px;">
                SECURITY AUTHENTICATION
              </div>
              <h1 style="margin:0;color:#faf7f2;font-size:22px;font-weight:700;letter-spacing:-0.02em;">
                Admin Password Reset
              </h1>
              <p style="margin:8px 0 0;color:#a39687;font-size:13px;font-family:monospace;">
                Shivam Patil Portfolio CMS
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 18px;color:#cfc5b8;font-size:14px;line-height:1.6;">
                A password reset request was initiated for your portfolio administrator account. Use the 6-digit verification code below to authorize your new password:
              </p>

              <!-- OTP Code Display Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="background:rgba(245,158,11,0.08);border:1px dashed #f59e0b;border-radius:14px;padding:20px;">
                    <div style="font-family:monospace;font-size:32px;font-weight:800;letter-spacing:0.35em;color:#f59e0b;padding-left:0.35em;">
                      ${otp}
                    </div>
                    <div style="margin-top:8px;font-size:11px;font-family:monospace;color:#9e8e7e;">
                      Single-use verification code
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#cfc5b8;font-size:13px;line-height:1.5;">
                ⏰ This code will expire in <strong>${expiresMinutes} minutes</strong> and can only be used once.
              </p>

              <!-- Security Notice -->
              <div style="margin-top:24px;padding:14px 16px;background:rgba(239,68,68,0.08);border-left:3px solid #ef4444;border-radius:8px;">
                <p style="margin:0;color:#fca5a5;font-size:12px;line-height:1.5;">
                  <strong>Security Alert:</strong> If you did not request this password reset, please ignore this email. Your existing credentials remain secure and untouched.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#110d0a;border-top:1px solid #281d17;text-align:center;">
              <p style="margin:0;color:#6e6357;font-size:11px;font-family:monospace;">
                Automated Security Notification • Shivam Patil Portfolio
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Shivam Patil Portfolio - Admin Password Reset

A password reset request was initiated for your administrator account.

Your 6-digit verification code is:
${otp}

This code is valid for ${expiresMinutes} minutes and can only be used once.

Security Notice:
If you did not initiate this request, no action is needed. Your existing password remains secure.
  `.trim();

  return { html, text };
}

/**
 * Builds a responsive, branded HTML email for recovery email verification OTP.
 */
export function buildEmailVerificationTemplate(params: {
  otp: string;
  expiresMinutes: number;
}): { html: string; text: string } {
  const { otp, expiresMinutes } = params;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify New Recovery Email</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0a08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#faf7f2;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0a08;padding:40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#17120f;border:1px solid #3d2c22;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding:32px 32px 20px;text-align:center;border-bottom:1px solid #281d17;">
              <div style="display:inline-block;padding:8px 16px;background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.3);border-radius:999px;color:#60a5fa;font-size:12px;font-family:monospace;font-weight:600;letter-spacing:0.05em;margin-bottom:14px;">
                SECURITY VERIFICATION
              </div>
              <h1 style="margin:0;color:#faf7f2;font-size:22px;font-weight:700;letter-spacing:-0.02em;">
                Confirm New Recovery Email
              </h1>
              <p style="margin:8px 0 0;color:#a39687;font-size:13px;font-family:monospace;">
                Shivam Patil Portfolio CMS
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 18px;color:#cfc5b8;font-size:14px;line-height:1.6;">
                You requested to register this email address as the primary recovery email for your portfolio administrator account. Enter the 6-digit confirmation code below in Admin Settings:
              </p>

              <!-- OTP Code Display Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="background:rgba(59,130,246,0.08);border:1px dashed #3b82f6;border-radius:14px;padding:20px;">
                    <div style="font-family:monospace;font-size:32px;font-weight:800;letter-spacing:0.35em;color:#60a5fa;padding-left:0.35em;">
                      ${otp}
                    </div>
                    <div style="margin-top:8px;font-size:11px;font-family:monospace;color:#9e8e7e;">
                      Single-use verification code
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;color:#cfc5b8;font-size:13px;line-height:1.5;">
                ⏰ This code will expire in <strong>${expiresMinutes} minutes</strong> and can only be used once.
              </p>

              <!-- Security Notice -->
              <div style="margin-top:24px;padding:14px 16px;background:rgba(245,158,11,0.08);border-left:3px solid #f59e0b;border-radius:8px;">
                <p style="margin:0;color:#fde68a;font-size:12px;line-height:1.5;">
                  <strong>Notice:</strong> Your existing recovery email remains fully active until this new email address is verified. If you did not make this request, you can safely disregard this message.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#110d0a;border-top:1px solid #281d17;text-align:center;">
              <p style="margin:0;color:#6e6357;font-size:11px;font-family:monospace;">
                Automated Security Notification • Shivam Patil Portfolio
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Shivam Patil Portfolio - Confirm New Recovery Email

You requested to register this email address as the primary recovery email for your administrator account.

Your 6-digit confirmation code is:
${otp}

This code is valid for ${expiresMinutes} minutes and can only be used once.

Security Notice:
Your existing recovery email remains active until this new email is verified. If you did not make this request, please disregard this email.
  `.trim();

  return { html, text };
}
