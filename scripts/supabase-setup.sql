-- ============================================================
-- Supabase setup: selections table + Row Level Security
--
-- Run this in your Supabase dashboard:
--   SQL Editor  →  New Query  →  paste  →  Run
-- ============================================================

-- 1. Create the selections table
create table if not exists public.selections (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  topic_id   text        not null,
  created_at timestamptz not null default now(),
  unique (user_id, topic_id)
);

-- 2. Enable Row Level Security
alter table public.selections enable row level security;

-- 3. Policy: anyone can READ all selections (needed for shared links)
create policy "Anyone can view selections"
  on public.selections
  for select
  using (true);

-- 4. Policy: authenticated users can INSERT their own selections
create policy "Users can insert own selections"
  on public.selections
  for insert
  with check (auth.uid() = user_id);

-- 5. Policy: authenticated users can DELETE their own selections
create policy "Users can delete own selections"
  on public.selections
  for delete
  using (auth.uid() = user_id);

-- 6. Index for fast lookups by user
create index if not exists idx_selections_user_id
  on public.selections(user_id);
