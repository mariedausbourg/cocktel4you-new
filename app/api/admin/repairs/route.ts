import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin(request);
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .order('brand')
      .order('model')
      .order('repair_type');

    if (error) throw error;
    return NextResponse.json({ repairs: data ?? [] });
  } catch (error) {
    console.error('[repairs GET]', error);
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Acces interdit.' }, { status: 403 });
      if (error.message === 'SUPABASE_NOT_CONFIGURED') return NextResponse.json({ error: 'Supabase non configuré.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin(request);
    const body = await request.json();

    const { data, error } = await supabase
      .from('repairs')
      .insert({
        brand: body.brand,
        model: body.model,
        repair_type: body.repair_type,
        price_from: body.price_from,
        duration: body.duration,
        description: body.description ?? null,
        is_popular: body.is_popular ?? false,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ repair: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Création impossible.' }, { status: 500 });
  }
}
