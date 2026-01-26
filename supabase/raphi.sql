-- RAPHi core tables
create table if not exists public.raphi_ingredients (
  id text primary key,
  name text not null,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  serving_size numeric not null default 0,
  unit text not null default 'g',
  micros jsonb,
  brand text,
  created_at timestamptz not null default now()
);

create table if not exists public.raphi_supplements (
  id text primary key,
  name text not null,
  dose numeric not null default 0,
  unit text not null default 'mg',
  micros jsonb,
  type text,
  created_at timestamptz not null default now()
);

create table if not exists public.raphi_intake_log (
  id text primary key,
  date date not null,
  item_type text not null check (item_type in ('ingredient', 'supplement')),
  item_id text not null,
  amount numeric not null default 0,
  unit text not null,
  notes text,
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists raphi_intake_log_date_idx on public.raphi_intake_log (date);
