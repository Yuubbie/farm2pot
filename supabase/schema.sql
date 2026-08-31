-- Farm2Pot Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- CATEGORIES: one row per menu category (Soups, Grills, Shisha, etc.)
create table if not exists categories (
  id text primary key,              -- e.g. 'soups', matches existing category ids
  name text not null,               -- display name, e.g. 'Soups'
  group_name text not null check (group_name in ('Food', 'Drinks', 'Experience')),
  flat_price integer,               -- if every item in this category costs the same
  big_price integer,                -- soups: big portion price
  small_price integer,              -- soups: small portion price
  sort_order integer not null default 0
);

-- MENU ITEMS: one row per dish/drink
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references categories(id) on delete cascade,
  name text not null,
  price integer,                    -- null if using category flat/big/small pricing, or price not yet confirmed
  image text,                       -- path under /public, e.g. '/menu-images/egusi-soup.jpg'
  sort_order integer not null default 0
);

-- ORDERS: filled in once checkout is built, created now so the table exists early
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text,
  customer_phone text,
  items jsonb not null,             -- [{ name, price, quantity }, ...]
  total integer not null,
  delivery_type text check (delivery_type in ('pickup', 'delivery')),
  address text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  paystack_reference text
);

-- Row Level Security
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;

-- Menu data is public — anyone can read it (needed for the website to display the menu)
create policy "Public can read categories" on categories
  for select using (true);

create policy "Public can read menu items" on menu_items
  for select using (true);

-- Orders: anyone can create an order (customers placing orders from the website),
-- but nobody can read/update/delete via the public API — that stays admin-only in the Supabase dashboard.
create policy "Public can insert orders" on orders
  for insert with check (true);
