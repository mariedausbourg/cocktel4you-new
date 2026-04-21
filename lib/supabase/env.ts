function getEnv(name: string) {
  return process.env[name]?.trim() || null;
}

export function getSupabaseUrl() {
  return getEnv('NEXT_PUBLIC_SUPABASE_URL');
}

export function getSupabaseAnonKey() {
  return getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export function getSupabaseServiceRoleKey() {
  return getEnv('SUPABASE_SERVICE_ROLE_KEY');
}

export function hasPublicSupabaseEnv() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function hasServiceRoleSupabaseEnv() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}
