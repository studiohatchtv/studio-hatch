-- Studio HATCH — Supabase schema (Phase 1)
-- Run this in the Supabase Dashboard > SQL Editor.

-- 1) Content table (exhibitions, events, workshops, products, audio)
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('exhibition','event','workshop','product','audio')),
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- 2) Settings (about text, etc.)
create table if not exists public.settings (
  key text primary key,
  value text
);
insert into public.settings (key, value)
values ('about', 'Studio HATCH, sanatı yaşayan bir deneyime dönüştüren çağdaş bir sanat ve kültür merkezidir.')
on conflict (key) do nothing;

-- 3) Profiles (membership + admin flag)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  is_admin boolean not null default false,
  marketing boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4) Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, marketing)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'marketing')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- 6) Enable Row Level Security
alter table public.content_items enable row level security;
alter table public.settings enable row level security;
alter table public.profiles enable row level security;

-- content_items: everyone can read; only admins can write
drop policy if exists "content read" on public.content_items;
create policy "content read" on public.content_items for select using (true);
drop policy if exists "content admin write" on public.content_items;
create policy "content admin write" on public.content_items for all
  using (public.is_admin()) with check (public.is_admin());

-- settings: everyone can read; only admins can write
drop policy if exists "settings read" on public.settings;
create policy "settings read" on public.settings for select using (true);
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

-- profiles: a user reads/updates their own row; admins read all
drop policy if exists "profile self read" on public.profiles;
create policy "profile self read" on public.profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists "profile self update" on public.profiles;
create policy "profile self update" on public.profiles for update
  using (auth.uid() = id);

-- 7) Storage policies for the 'media' bucket
-- (create a PUBLIC bucket named "media" in Dashboard > Storage first)
drop policy if exists "media read" on storage.objects;
create policy "media read" on storage.objects for select
  using (bucket_id = 'media');
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
