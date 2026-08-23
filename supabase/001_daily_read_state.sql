-- Dear You — daily message read state
-- Run this in Supabase SQL Editor after the original Dear You schema.
-- It is safe to run more than once.

alter table public.messages
  add column if not exists read_at timestamptz;

-- Keep role lookup available to RLS and secure functions.
create or replace function public.get_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.get_user_role() from public;
grant execute on function public.get_user_role() to authenticated;

-- Remove broad policies from the first database version.
drop policy if exists "Authenticated users can read messages" on public.messages;
drop policy if exists "Writer can create messages" on public.messages;
drop policy if exists "Writer can update messages" on public.messages;
drop policy if exists "Writer can delete messages" on public.messages;

-- Both authenticated roles can read because this is a single-private-reader app.
-- No anonymous user can read anything from messages.
create policy "Private members can read messages"
on public.messages
for select
to authenticated
using (
  public.get_user_role() = 'writer'
  or (
    public.get_user_role() = 'reader'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'reader'
        and p.is_recipient = true
    )
  )
);

create policy "Writer can create messages"
on public.messages
for insert
to authenticated
with check (public.get_user_role() = 'writer');

create policy "Writer can update messages"
on public.messages
for update
to authenticated
using (public.get_user_role() = 'writer')
with check (public.get_user_role() = 'writer');

create policy "Writer can delete messages"
on public.messages
for delete
to authenticated
using (public.get_user_role() = 'writer');

-- The reader must not receive UPDATE access to the messages table.
-- Instead, this SECURITY DEFINER function changes only read_at.
create or replace function public.mark_message_read(p_message_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_read_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'reader'
      and is_recipient = true
  ) then
    raise exception 'Only the designated reader can mark messages as read';
  end if;

  update public.messages
  set read_at = coalesce(read_at, now())
  where id = p_message_id;

  if not found then
    raise exception 'Message not found';
  end if;

  select read_at into v_read_at
  from public.messages
  where id = p_message_id;

  return v_read_at;
end;
$$;

revoke all on function public.mark_message_read(uuid) from public;
grant execute on function public.mark_message_read(uuid) to authenticated;

create index if not exists messages_read_at_idx
  on public.messages(read_at);

-- Verification:
-- select id, message_date, read_at from public.messages order by message_date desc;
