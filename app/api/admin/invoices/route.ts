import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin(request);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ invoices: data ?? [] });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin(request);
    const body = await request.json();

    // Generate invoice number: FAC-YYYYMM-XXXX
    const now = new Date();
    const prefix = `FAC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .like('invoice_number', `${prefix}%`);
    const seq = String((count ?? 0) + 1).padStart(4, '0');
    const invoice_number = `${prefix}-${seq}`;

    const subtotal = body.subtotal ?? 0;
    const tax_rate = body.tax_rate ?? 20;
    const tax_amount = Number(((subtotal * tax_rate) / 100).toFixed(2));
    const total = Number((subtotal + tax_amount).toFixed(2));

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number,
        client_name: body.client_name,
        client_phone: body.client_phone ?? null,
        client_email: body.client_email ?? null,
        items: body.items ?? [],
        subtotal,
        tax_rate,
        tax_amount,
        total,
        status: body.status ?? 'Brouillon',
        notes: body.notes ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ invoice: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Création impossible.' }, { status: 500 });
  }
}
