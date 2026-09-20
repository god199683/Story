create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 120),
  chapter text not null check (char_length(chapter) <= 80),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.stories enable row level security;
grant select, insert, delete on public.stories to authenticated;
drop policy if exists "Users read own stories" on public.stories;
drop policy if exists "Users insert own stories" on public.stories;
drop policy if exists "Users delete own stories" on public.stories;
create policy "Users read own stories" on public.stories for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own stories" on public.stories for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users delete own stories" on public.stories for delete to authenticated using ((select auth.uid()) = user_id);
create index if not exists stories_user_created_at_idx on public.stories (user_id, created_at desc);

-- Edge Function only: tracks per-user AI requests to protect the OpenAI balance.
create table if not exists public.ai_generation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.ai_generation_requests enable row level security;
create index if not exists ai_generation_requests_user_created_idx
  on public.ai_generation_requests (user_id, created_at desc);