# Dear You email notifications

Dear You sends a notification email only when a brand-new message is created for the current app day. Editing an existing message does not send another notification.

## Resend setup

1. Create a Resend account and verify a sending domain.
2. Create an API key with permission to send mail.
3. Add these environment variables to Vercel and local development:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Dear You <notifications@your-domain.com>
RECIPIENT_EMAIL=recipient@example.com
NEXT_PUBLIC_APP_URL=https://your-dear-you-domain.vercel.app
APP_TIMEZONE=Europe/Berlin
```

`RESEND_FROM_EMAIL` must use a sender address/domain that Resend allows for the account.

## Behavior

When a new daily message is saved:

```text
Writer saves message
        -> Supabase insert
        -> Resend notification
        -> Reader receives "Something is waiting for you"
        -> Reader opens /read
```

If Resend is unavailable, the message remains saved. The email is intentionally best-effort so an email provider outage cannot destroy the daily note.

When the existing message for the same day is edited, its `read_at` is reset, but no second email is sent.

## Local development

Put the variables in `.env.local` (never commit that file). Restart the dev server after changing environment variables.

## Vercel

Add the same variables under the project's Settings -> Environment Variables for Production and Preview as appropriate. Redeploy after adding or changing them.
