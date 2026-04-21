import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin(request);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session admin invalide.' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Acces interdit.' }, { status: 403 });
      if (error.message === 'SUPABASE_NOT_CONFIGURED') return NextResponse.json({ error: 'Supabase non configuré.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireAdmin(request);
    const body = await request.json();

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        brand: body.brand ?? null,
        category: body.category,
        description: body.description ?? null,
        price: body.price,
        original_price: body.original_price ?? null,
        stock: body.stock ?? 0,
        badge: body.badge ?? null,
        image_path: body.image_path ?? null,
        image_url: body.image_url ?? null,
        image_alt: body.image_alt ?? null,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session admin invalide.' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Acces interdit.' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Création impossible.' }, { status: 500 });
  }
}
