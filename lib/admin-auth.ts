import { NextRequest } from 'next/server';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export type AdminContext = {
  supabase: NonNullable<ReturnType<typeof createServiceRoleSupabaseClient>>;
  user: {
    id: string;
    email?: string;
  };
  adminProfile: {
    user_id: string;
    email: string;
    display_name: string | null;
    role: string;
  };
};

export async function requireAdmin(request: NextRequest): Promise<AdminContext> {
  const authorization = request.headers.get('authorization');
  const supabase = createServiceRoleSupabaseClient();

  if (!supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  if (!authorization?.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }

  const token = authorization.replace('Bearer ', '').trim();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    throw new Error('UNAUTHORIZED');
  }

  const { data: adminProfile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('user_id, email, display_name, role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError || !adminProfile) {
    throw new Error('FORBIDDEN');
  }

  return {
    supabase,
    user: {
      id: user.id,
      email: user.email,
    },
    adminProfile,
  };
}
