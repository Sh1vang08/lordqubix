-- Qubix & LORD admin panel schema.
--
-- Families and categories are catalogue structure, not per-product data, so
-- they're their own tables rather than free-text columns on products —
-- that's what lets the admin panel reorder families/categories without
-- touching every product row, and lets Home.jsx keep reading FAMILIES as a
-- simple ordered list instead of re-deriving it from product data.

create table families (
  slug text primary key,
  label text not null,
  blurb text not null,
  sort_order integer not null
);

create table categories (
  slug text primary key,
  label text not null,
  brand text not null check (brand in ('Qubix', 'Lord')),
  family_slug text references families(slug) on delete set null,
  -- Position within its family's category list (catalogue page order).
  sort_order integer not null
);

create table products (
  slug text primary key,
  name text not null,
  brand text not null check (brand in ('Qubix', 'Lord')),
  category_slug text not null references categories(slug) on delete restrict,
  summary text not null default '',
  tagline text not null default '',
  features jsonb not null default '[]',   -- string[]
  specs jsonb not null default '[]',      -- [key, value][]
  -- Position within its category, for the admin's drag-to-reorder. Sparse
  -- (multiples of 1000) so a single reorder only touches the two rows either
  -- side of the drop point instead of renumbering the whole category.
  sort_order integer not null default 0,
  -- Position among the four home-page "Engineered for Professionals" cards.
  -- NULL means "not featured" — nullable rather than a separate join table
  -- since a product is featured in at most one slot.
  featured_order integer unique,
  -- true once this product has 2026 studio photography (replaces the old
  -- PHOTOGRAPHED set in products.js), used by bestShot() to lead category
  -- cards with the strongest available image.
  has_new_photo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on products(category_slug, sort_order);
create index products_featured_idx on products(featured_order) where featured_order is not null;

-- Collections: editorial groupings independent of the family/category tree
-- (e.g. a "Diwali Sale" or "Live Sound Bundle" page), each with its own
-- product order.
create table collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table collection_products (
  collection_id uuid not null references collections(id) on delete cascade,
  product_slug text not null references products(slug) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, product_slug)
);

-- updated_at maintenance ----------------------------------------------------

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create trigger collections_set_updated_at
  before update on collections
  for each row execute function set_updated_at();

-- Row Level Security ---------------------------------------------------------
-- Public (anon key, the live site): read-only, and only published data.
-- Authenticated (admin panel, logged-in user): full read/write.
-- There's exactly one admin account, so "authenticated" is an adequate
-- boundary here rather than a role/claims system built for many admins.

alter table families enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table collections enable row level security;
alter table collection_products enable row level security;

create policy "public read families" on families for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read published collections" on collections
  for select using (is_published = true);
create policy "public read collection_products of published collections"
  on collection_products for select using (
    exists (
      select 1 from collections c
      where c.id = collection_id and c.is_published = true
    )
  );

create policy "admin full access families" on families
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access collections" on collections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access collection_products" on collection_products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
