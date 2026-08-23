-- Dear You reader setup
-- Run the main schema first, then run:
--   supabase/001_daily_read_state.sql
--
-- The migration adds secure read tracking and replaces the early broad
-- message policies with the final writer/recipient policies.

alter table public.profiles
  add column if not exists is_recipient boolean not null default false;

-- Writer example:
-- update public.profiles
-- set role = 'writer', is_recipient = false
-- where id = 'YOUR_WRITER_USER_ID';

-- Reader example:
-- update public.profiles
-- set role = 'reader', is_recipient = true
-- where id = 'YOUR_READER_USER_ID';

-- Verify:
select
  u.email,
  p.role,
  p.is_recipient
from auth.users u
left join public.profiles p on p.id = u.id
order by u.created_at;

-- After the profile check, execute:
-- supabase/001_daily_read_state.sql
