type EmailNotificationInput = {
  recipient: string;
  appUrl: string;
  messageDate: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export async function sendNewMessageNotification({
  recipient,
  appUrl,
  messageDate,
}: EmailNotificationInput) {
  const apiKey = requiredEnv("RESEND_API_KEY");
  const from = requiredEnv("RESEND_FROM_EMAIL");

  const safeAppUrl = appUrl.replace(/\/$/, "");
  const readUrl = `${safeAppUrl}/read`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject: "Something is waiting for you — Dear You",
      text: `A new message is waiting for you in Dear You.\n\nOpen it here: ${readUrl}\n\n${messageDate}`,
      html: `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#0a0b10;color:#f4f1eb;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:48px 24px;">
      <div style="border:1px solid rgba(255,255,255,.12);border-radius:20px;background:#11121a;padding:42px;text-align:center;">
        <div style="color:#efa5c8;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin-bottom:22px;">DEAR YOU</div>
        <div style="font-family:Georgia,serif;font-size:42px;line-height:1.1;margin-bottom:16px;">Something is waiting for you.</div>
        <p style="margin:0 auto 28px;max-width:420px;color:#9b9ba5;font-size:16px;line-height:1.7;">
          A new message has been left for you today. It is waiting quietly in your private space.
        </p>
        <a href="${readUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#f4f1eb;color:#101016;text-decoration:none;font-weight:600;">
          Open Dear You&nbsp; ↗
        </a>
        <p style="margin:28px 0 0;color:#676874;font-size:12px;">${messageDate}</p>
      </div>
    </div>
  </body>
</html>`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend failed (${response.status}): ${details}`);
  }
}
