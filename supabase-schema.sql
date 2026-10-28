-- Supabase SQL Editorben futtasd.
-- Ez a séma a bejelentkezett felhasználó saját fogadásait tárolja.
create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bet_date date not null,
  stake numeric(12,2) not null check (stake >= 0),
  odds numeric(8,3) not null check (odds >= 1),
  result text not null default 'Függőben'
    check (result in ('Függőben','Nyert','Veszített','Void')),
  event text not null default '',
  tip text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bets enable row level security;
create policy "Users can read own bets" on public.bets for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own bets" on public.bets for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own bets" on public.bets for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own bets" on public.bets for delete to authenticated using (auth.uid() = user_id);
create index if not exists bets_user_date_idx on public.bets(user_id, bet_date desc);
