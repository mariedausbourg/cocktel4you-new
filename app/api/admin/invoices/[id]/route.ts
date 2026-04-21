import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { supabase } = await requireAdmin(request);
    const body = await request.json();

    const subtotal = body.subtotal ?? 0;
    const tax_rate = body.tax_rate ?? 20;
    const tax_amount = Number(((subtotal * tax_rate) / 100).toFixed(2));
    const total = Number((subtotal + tax_amount).toFixed(2));

    const { data, error } = await supabase
      .from('invoices')
      .update({
        client_name: body.client_name,
        client_phone: body.client_phone ?? null,
        client_email: body.client_email ?? null,
        items: body.items ?? [],
        subtotal,
        tax_rate,
        tax_amount,
        total,
        status: body.status,
        notes: body.notes ?? null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ invoice: data });
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
    const { error } = await supabase.from('invoices').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Suppression impossible.' }, { status: 500 });
  }
}
