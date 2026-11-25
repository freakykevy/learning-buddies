-- Learning Buddies – free shared database (Supabase / Postgres)
-- Paste this whole file into: Supabase dashboard → SQL Editor → New query → Run.

create table if not exists public.attempts (
  id       text primary key,                 -- unique per record (made by the app)
  ts       bigint not null,                  -- time in ms since 1970
  sid      text   not null,                  -- student id (lower-cased name)
  student  text   not null,                  -- display name (use first names / nicknames!)
  av       text,                             -- avatar emoji
  lesson   text   not null,                  -- lesson id, e.g. 'subtract'
  type     text   not null check (type in ('watch','quiz','practice','assign')),
  score    int,
  total    int,
  assigned boolean                           -- only used by type = 'assign'
);

create index if not exists attempts_ts_idx on public.attempts (ts);

-- Row Level Security: the public (anon) key may ONLY read and add rows.
-- There is no update or delete policy, so records can't be changed or erased from the browser.
alter table public.attempts enable row level security;

drop policy if exists "anon can read attempts" on public.attempts;
create policy "anon can read attempts" on public.attempts for select to anon using (true);

drop policy if exists "anon can add attempts" on public.attempts;
create policy "anon can add attempts" on public.attempts for insert to anon with check (true);

-- Let the public (anon) role reach the table through the Data API (needed when
-- "Grant API access to new tables automatically" is switched off). Only read + add; no update/delete.
grant usage on schema public to anon;
grant select, insert on public.attempts to anon;