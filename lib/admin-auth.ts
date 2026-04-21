import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export type AdminContext = {
  supabase: NonNullable<ReturnType<typeof createServerSupabaseClient>>;
};

export async function requireAdmin(request: NextRequest): Promise<AdminContext> {
  const authorization = request.headers.get('authorization');
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  if (!authorization?.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }

  const token = authorization.replace('Bearer ', '').trim();
  const secret = process.env.ADMIN_API_SECRET ?? process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE ?? '';

  if (!secret || token !== secret) {
    throw new Error('UNAUTHORIZED');
  }

  return { supabase };
}
