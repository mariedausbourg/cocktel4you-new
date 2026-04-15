create or replace function public.bootstrap_admin_profile(target_email text, target_display_name text default null)
returns public.admin_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  created_profile public.admin_profiles;
begin
  insert into public.admin_profiles (user_id, email, display_name, role)
  select
    users.id,
    users.email,
    coalesce(target_display_name, split_part(users.email, '@', 1)),
    'owner'
  from auth.users users
  where lower(users.email) = lower(target_email)
  on conflict (user_id) do update
  set email = excluded.email,
      display_name = excluded.display_name,
      role = 'owner'
  returning * into created_profile;

  if created_profile.user_id is null then
    raise exception 'No auth user found for email %', target_email;
  end if;

  return created_profile;
end;
$$;

revoke all on function public.bootstrap_admin_profile(text, text) from public;
grant execute on function public.bootstrap_admin_profile(text, text) to service_role;
