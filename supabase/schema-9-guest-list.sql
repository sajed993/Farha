-- ═══ FARHA — the guest list an owner can be handed ═══
-- Two things were missing before a couple could open their own list.

-- 1. Guests write their name on the RSVP form, and there was nowhere to put it.
alter table rsvps add column if not exists name text;

-- 2. Reading. The existing policy is `auth.uid() is not null`, which is right:
--    nobody should be able to select the rsvps table anonymously, or one
--    guessed request would return every wedding's guest list at once.
--
--    So the shared page does not read the table. It calls this function, which
--    runs with the definer's rights but can only ever return the rows of the
--    one slug it was asked for. Knowing an invitation's slug buys you that
--    invitation's list and nothing else — the same thing knowing the slug
--    already buys you, since it is the invitation's own address.
create or replace function public.guest_list(p_slug text)
returns table (
  name text,
  attending boolean,
  guests int,
  message text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select r.name, r.attending, r.guests, r.message, r.created_at
  from public.rsvps r
  where r.inv_slug = p_slug
    and coalesce(char_length(p_slug), 0) > 0
  order by r.created_at desc
  limit 500;
$$;

revoke all on function public.guest_list(text) from public;
grant execute on function public.guest_list(text) to anon, authenticated;

-- the couple's own names for the page heading, without exposing the config
create or replace function public.invite_name(p_slug text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(i.config -> 'c' ->> 'n', '')
  from public.invitations i
  where i.slug = p_slug
  limit 1;
$$;

revoke all on function public.invite_name(text) from public;
grant execute on function public.invite_name(text) to anon, authenticated;

-- the list is read often and always by slug
create index if not exists rsvps_inv_slug_idx on rsvps (inv_slug);
