# dear you

> A private little place where one person can leave one message for another, every day.

`Dear You` is a small Next.js + Supabase app built around a single idea: **you write something each day, and one specific person comes back to read it.**

## Stack

- Next.js 16 + React 19 + TypeScript
- Supabase Auth + PostgreSQL + RLS
- Server Actions for message writes and read tracking
- CSS-first visual system with a dark, editorial aesthetic

## Local development

Install dependencies and start the app:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Create `.env.local` from `.env.example` and add the Supabase project values.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
APP_TIMEZONE=Asia/Tehran
```

`APP_TIMEZONE` controls the boundary of a Dear You day. Set it explicitly for production so the writer and reader always agree on what "today" means.

## Supabase setup

The original project schema creates `profiles` and `messages`. The current app additionally needs the migration in:

```text
supabase/001_daily_read_state.sql
```

Run that file in **Supabase → SQL Editor** after the original schema. It adds:

- `messages.read_at`
- strict message RLS policies
- a secure `mark_message_read(uuid)` RPC
- an index for read-state lookups

The designated reader account must have:

```text
role = reader
is_recipient = true
```

The writer account must have:

```text
role = writer
is_recipient = false
```

## Routes

```text
/              Public landing page
/login         Supabase login
/dashboard     Writer-only space
/read          Reader-only daily letter
/read?date=... Reader archive entry
```

## Product behavior

### Writer

The writer can:

- create or edit today's message
- see the full archive
- see whether each message has been opened
- see the time a message was first opened

Editing today's note resets its `read_at` value, so a revised message is treated as a fresh note.

### Reader

The designated reader can:

- open today's sealed note
- have the open recorded securely in the database
- revisit older notes from the private archive
- never write or edit messages

An unread note is intentionally presented as a small "sealed" experience instead of exposing the text immediately.

## Production verification

Run:

```bash
npm run lint
npm run build
```

GitHub Actions runs both checks for pushes and pull requests targeting `main`.

## Security notes

The browser never receives a service-role key. Supabase access is performed through the publishable client plus PostgreSQL RLS. Reader read-tracking is handled by a narrowly scoped `SECURITY DEFINER` function rather than granting the reader permission to update message rows directly.
