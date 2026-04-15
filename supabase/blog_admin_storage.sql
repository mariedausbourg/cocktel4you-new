insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-covers',
  'blog-covers',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read blog cover images'
  ) then
    create policy "Public can read blog cover images"
      on storage.objects
      for select
      to public
      using (bucket_id = 'blog-covers');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can upload blog cover images'
  ) then
    create policy "Admins can upload blog cover images"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'blog-covers'
        and exists (
          select 1
          from public.admin_profiles admin
          where admin.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can update blog cover images'
  ) then
    create policy "Admins can update blog cover images"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'blog-covers'
        and exists (
          select 1
          from public.admin_profiles admin
          where admin.user_id = auth.uid()
        )
      )
      with check (
        bucket_id = 'blog-covers'
        and exists (
          select 1
          from public.admin_profiles admin
          where admin.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can delete blog cover images'
  ) then
    create policy "Admins can delete blog cover images"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'blog-covers'
        and exists (
          select 1
          from public.admin_profiles admin
          where admin.user_id = auth.uid()
        )
      );
  end if;
end
$$;
