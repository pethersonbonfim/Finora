-- =============================================================
--  FINORA · Esquema do banco de dados (Supabase / PostgreSQL)
--  Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.
--  É seguro rodar mais de uma vez (idempotente).
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- 1. PERFIS
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Você',
  currency text not null default 'BRL',
  monthly_income numeric(12, 2) not null default 0 check (monthly_income >= 0),
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------
-- 2. CATEGORIAS
-- -------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  icon text not null default 'wallet',
  color text not null default '#34D399',
  kind text not null default 'expense' check (kind in ('income', 'expense')),
  monthly_budget numeric(12, 2) not null default 0 check (monthly_budget >= 0),
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories (user_id);

-- -------------------------------------------------------------
-- 3. TRANSAÇÕES
-- -------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category_id uuid references public.categories (id) on delete set null,
  date date not null default current_date,
  recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);
create index if not exists transactions_category_idx
  on public.transactions (category_id);

-- -------------------------------------------------------------
-- 4. METAS
-- -------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  saved_amount numeric(12, 2) not null default 0 check (saved_amount >= 0),
  deadline date not null,
  color text not null default '#34D399',
  created_at timestamptz not null default now()
);

create index if not exists goals_user_id_idx on public.goals (user_id);

-- -------------------------------------------------------------
-- 5. SIMULAÇÕES DE INVESTIMENTO
-- -------------------------------------------------------------
create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  initial_amount numeric(12, 2) not null default 0 check (initial_amount >= 0),
  monthly_contribution numeric(12, 2) not null default 0 check (monthly_contribution >= 0),
  annual_rate numeric(5, 2) not null default 10 check (annual_rate >= 0),
  months integer not null check (months between 1 and 600),
  created_at timestamptz not null default now()
);

create index if not exists simulations_user_id_idx on public.simulations (user_id);

-- -------------------------------------------------------------
-- 6. ROW LEVEL SECURITY — cada usuário só vê o que é seu
-- -------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.simulations enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- categories
drop policy if exists "categories_select_own" on public.categories;
create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

-- transactions
drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

-- goals
drop policy if exists "goals_select_own" on public.goals;
create policy "goals_select_own" on public.goals
  for select using (auth.uid() = user_id);

drop policy if exists "goals_insert_own" on public.goals;
create policy "goals_insert_own" on public.goals
  for insert with check (auth.uid() = user_id);

drop policy if exists "goals_update_own" on public.goals;
create policy "goals_update_own" on public.goals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "goals_delete_own" on public.goals;
create policy "goals_delete_own" on public.goals
  for delete using (auth.uid() = user_id);

-- simulations
drop policy if exists "simulations_select_own" on public.simulations;
create policy "simulations_select_own" on public.simulations
  for select using (auth.uid() = user_id);

drop policy if exists "simulations_insert_own" on public.simulations;
create policy "simulations_insert_own" on public.simulations
  for insert with check (auth.uid() = user_id);

drop policy if exists "simulations_update_own" on public.simulations;
create policy "simulations_update_own" on public.simulations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "simulations_delete_own" on public.simulations;
create policy "simulations_delete_own" on public.simulations
  for delete using (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 7. NOVO USUÁRIO → perfil + categorias padrão
-- -------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(coalesce(new.email, 'você'), '@', 1)
    )
  )
  on conflict (id) do nothing;

  insert into public.categories (user_id, name, icon, color, kind) values
    (new.id, 'Moradia',      'home',       '#34D399', 'expense'),
    (new.id, 'Alimentação',  'utensils',   '#FBBF24', 'expense'),
    (new.id, 'Transporte',   'car',        '#60A5FA', 'expense'),
    (new.id, 'Lazer',        'popcorn',    '#F472B6', 'expense'),
    (new.id, 'Saúde',        'heart',      '#A78BFA', 'expense'),
    (new.id, 'Educação',     'book',       '#22D3EE', 'expense'),
    (new.id, 'Assinaturas',  'repeat',     '#FB923C', 'expense'),
    (new.id, 'Compras',      'shopping',   '#94A3B8', 'expense'),
    (new.id, 'Salário',      'briefcase',  '#34D399', 'income'),
    (new.id, 'Freelance',    'sparkles',   '#22D3EE', 'income');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------------
-- 8. PERMISSÕES (o RLS continua controlando linha a linha)
-- -------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
