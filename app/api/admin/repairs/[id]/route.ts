import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { supabase } = await requireAdmin(request);
    const body = await request.json();

    const { data, error } = await supabase
      .from('repairs')
      .update({
        brand: body.brand,
        model: body.model,
        repair_type: body.repair_type,
        price_from: body.price_from,
        duration: body.duration,
        description: body.description ?? null,
        is_popular: body.is_popular ?? false,
        is_active: body.is_active ?? true,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ repair: data });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Mise à jour impossible.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { supabase } = await requireAdmin(request);
    const { error } = await supabase.from('repairs').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Suppression impossible.' }, { status: 500 });
  }
}
