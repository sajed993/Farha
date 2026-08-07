-- ═══ FARHA — close the doors that were open ═══
-- Three separate leaks, all of them reachable with nothing but the publishable
-- key that ships in every page:
--
--   1. `pub_read_inv` allowed any anonymous client to SELECT invitations with
--      no filter at all. Not "the one you were sent" — the whole table. Every
--      couple's names, date, venue, message and programme, in one request.
--
--   2. Slugs were `inv-<timestamp base36><3 random base36 chars>`. The
--      timestamp is not a secret (it is roughly when the order was delivered),
--      which leaves 46,656 guesses. That is seconds of work.
--
--   3. The guest list was keyed on the invitation slug alone, so every guest
--      who received an invitation could swap ?i= for ?guests= and read the
--      names and private messages of everyone else invited.
--
-- The fix for all three is the same shape as guest_list(): nothing is readable
-- by table, only through a function that can answer for exactly one thing.

-- ── 1. a second secret, so the guest list is not reachable from an invitation ──
alter table invitations add column if not exists list_key text;

-- existing rows get one now; new rows get theirs from the dashboard
update invitations
   set list_key = encode(gen_random_bytes(12), 'hex')
 where list_key is null;

create index if not exists invitations_slug_idx on invitations (slug);

-- ── 2. no more reading the table ──
drop policy if exists pub_read_inv on invitations;
drop policy if exists "public read published invitations" on invitations;
-- owners keep full access (own_inv_all / the schema-3 policies) — untouched.

-- ── 3. one invitation, by slug, and nothing else ──
create or replace function public.invite_get(p_slug text)
returns table (slug text, design_id int, config jsonb)
language sql
security definer
stable
set search_path = public
as $$
  select i.slug, i.design_id, i.config
  from public.invitations i
  where i.slug = p_slug
    and i.published = true
    and coalesce(char_length(p_slug), 0) >= 8
  limit 1;
$$;

revoke all on function public.invite_get(text) from public;
grant execute on function public.invite_get(text) to anon, authenticated;

-- ── 4. the guest list now needs its own key, not the invitation's slug ──
drop function if exists public.guest_list(text);

create or replace function public.guest_list(p_slug text, p_key text)
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
    and exists (
      select 1 from public.invitations i
      where i.slug = p_slug
        and i.list_key is not null
        and i.list_key = p_key          -- wrong key returns nothing, not an error
    )
  order by r.created_at desc
  limit 500;
$$;

revoke all on function public.guest_list(text, text) from public;
grant execute on function public.guest_list(text, text) to anon, authenticated;

-- the heading on the guest-list page needs the couple's names, and asking for
-- them should cost the same key as asking for the list
create or replace function public.invite_name(p_slug text, p_key text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(i.config -> 'c' ->> 'n', '')
  from public.invitations i
  where i.slug = p_slug
    and i.list_key is not null
    and i.list_key = p_key
  limit 1;
$$;

drop function if exists public.invite_name(text);
revoke all on function public.invite_name(text, text) from public;
grant execute on function public.invite_name(text, text) to anon, authenticated;

-- ── 5. the owner needs to read the key back to build the link ──
-- (covered by own_inv_all: a signed-in owner selects invitations normally)
