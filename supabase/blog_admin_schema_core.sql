create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());

  if tg_table_name = 'blog_posts' then
    if new.is_published and new.published_at is null then
      new.published_at = timezone('utc', now());
    end if;

    if not new.is_published then
      new.published_at = null;
    end if;
  end if;

  return new;
end;
$$;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  display_name text,
  role text not null default 'editor' check (role in ('owner', 'editor', 'author')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users (id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category text not null default 'Conseils',
  tags text[] not null default '{}',
  featured_image_path text,
  featured_image_url text,
  featured_image_alt text,
  seo_title text,
  seo_description text,
  seo_keywords text[] not null default '{}',
  focus_keyword text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  meta_robots text not null default 'index,follow',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (is_published, published_at desc nulls last);

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

create index if not exists blog_posts_category_idx
  on public.blog_posts (category);

create index if not exists blog_posts_tags_gin_idx
  on public.blog_posts using gin (tags);

create index if not exists blog_posts_seo_keywords_gin_idx
  on public.blog_posts using gin (seo_keywords);

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.blog_posts enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'Admins can read their own profile'
  ) then
    create policy "Admins can read their own profile"
      on public.admin_profiles
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Published blog posts are public'
  ) then
    create policy "Published blog posts are public"
      on public.blog_posts
      for select
      to anon, authenticated
      using (is_published = true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_posts'
      and policyname = 'Admins manage blog posts'
  ) then
    create policy "Admins manage blog posts"
      on public.blog_posts
      for all
      to authenticated
      using (
        exists (
          select 1
          from public.admin_profiles admin
          where admin.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.admin_profiles admin
          where admin.user_id = auth.uid()
        )
      );
  end if;
end
$$;

comment on table public.admin_profiles is
'Authorized admin accounts for the Cocktel4you dashboard.';

comment on table public.blog_posts is
'SEO-oriented blog articles managed from the admin dashboard.';
